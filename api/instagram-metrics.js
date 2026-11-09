const {open,cookie,seal}=require('../lib/ig-token');
const {hasSession} = require('../lib/content-auth');
const {IG_PATH, readJson, writeJson} = require('../lib/content-store');
const API='https://graph.instagram.com/v26.0';
function monthKey(value){try{const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Santiago',year:'numeric',month:'2-digit'}).formatToParts(new Date(value));return `${parts.find(x=>x.type==='year')?.value}-${parts.find(x=>x.type==='month')?.value}`}catch{return ''}}
const isVideo=item=>item.media_product_type==='REELS'||item.media_type==='VIDEO';
const isReel=item=>item.media_product_type==='REELS';
module.exports=async function(req,res){
  res.setHeader('Cache-Control','no-store');
  const secret=process.env.SESSION_SECRET;
  if(!hasSession(req,secret))return res.status(401).json({error:'Autoriza este dispositivo para abrir tu estudio.'});
  const raw=cookie(req,'br_ig');
  if(!secret)return res.status(401).json({error:'Conecta primero tu cuenta de Instagram desde el panel.'});
  let auth;try{const saved=await readJson(IG_PATH);auth=saved?.data||(raw?open(raw,secret):null);if(!auth)return res.status(401).json({error:'Conecta primero tu cuenta de Instagram desde el panel.'})}catch{return res.status(401).json({error:'La sesión de Instagram no se pudo leer. Vuelve a conectar la cuenta.'})}
  try{
    if(auth.expiresAt-Date.now()<14*86400*1000){const refreshUrl=new URL(`${API}/refresh_access_token`);refreshUrl.search=new URLSearchParams({grant_type:'ig_refresh_token',access_token:auth.accessToken});const rr=await fetch(refreshUrl);const rd=await rr.json();if(rr.ok&&rd.access_token){auth.accessToken=rd.access_token;auth.expiresAt=Date.now()+(Number(rd.expires_in)||5184000)*1000;res.setHeader('Set-Cookie',`br_ig=${seal(auth,secret)}; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=${Math.floor((auth.expiresAt-Date.now())/1000)}`)}}
    const u=new URL(`${API}/${auth.userId}/media`);u.search=new URLSearchParams({fields:'id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count',limit:'100',access_token:auth.accessToken});
    const currentMonth=monthKey(Date.now()),allMedia=[];let next=u.toString();
    for(let page=0;next&&page<10;page++){
      const mr=await fetch(next);const media=await mr.json();if(!mr.ok)throw Error(media.error?.message||'No se pudieron leer tus publicaciones.');
      allMedia.push(...(media.data||[]));
      const pageCrossedMonth=(media.data||[]).some(item=>monthKey(item.timestamp)<currentMonth);
      next=pageCrossedMonth?'':media.paging?.next||'';
    }
    const videos=allMedia.filter(item=>isReel(item)&&monthKey(item.timestamp)===currentMonth).map(item=>({id:item.id,caption:item.caption||'',permalink:item.permalink||'',timestamp:item.timestamp||'',media_type:item.media_type,media_product_type:item.media_product_type}));
    const reels=allMedia.filter(isVideo).slice(0,60);
    const metrics='views,reach,likes,comments,saved,shares,total_interactions,ig_reels_avg_watch_time,ig_reels_video_view_total_time';
    const results=await Promise.all(reels.map(async item=>{
      try{
        const q=new URL(`${API}/${item.id}/insights`);q.search=new URLSearchParams({metric:metrics,access_token:auth.accessToken});
        const r=await fetch(q),d=await r.json();
        if(!r.ok)return {...item,insights:null,insightsError:d.error?.message};
        const insights=Object.fromEntries((d.data||[]).map(x=>[x.name,x.values?.[0]?.value??x.value??0]));
        return {...item,insights};
      }catch{return {...item,insights:null}}
    }));
    await writeJson(IG_PATH,auth);
    res.status(200).json({username:auth.username,media:results,videos,month:currentMonth});
  }catch(e){res.status(502).json({error:e.message||'Error consultando Instagram.'})}
};
