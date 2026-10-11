const {open,cookie,seal}=require('../lib/ig-token');
const API='https://graph.instagram.com/v26.0';
module.exports=async function(req,res){
  res.setHeader('Cache-Control','no-store');
  const secret=process.env.SESSION_SECRET,raw=cookie(req,'br_ig');
  if(!secret||!raw)return res.status(401).json({error:'Conecta primero tu cuenta de Instagram desde el panel.'});
  let auth;try{auth=open(raw,secret)}catch{return res.status(401).json({error:'La sesión de Instagram no se pudo leer. Vuelve a conectar la cuenta.'})}
  try{
    if(auth.expiresAt-Date.now()<14*86400*1000){const refreshUrl=new URL(`${API}/refresh_access_token`);refreshUrl.search=new URLSearchParams({grant_type:'ig_refresh_token',access_token:auth.accessToken});const rr=await fetch(refreshUrl);const rd=await rr.json();if(rr.ok&&rd.access_token){auth.accessToken=rd.access_token;auth.expiresAt=Date.now()+(Number(rd.expires_in)||5184000)*1000;res.setHeader('Set-Cookie',`br_ig=${seal(auth,secret)}; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=${Math.floor((auth.expiresAt-Date.now())/1000)}`)}}
    const u=new URL(`${API}/${auth.userId}/media`);u.search=new URLSearchParams({fields:'id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count',limit:'60',access_token:auth.accessToken});
    const mr=await fetch(u);const media=await mr.json();if(!mr.ok)throw Error(media.error?.message||'No se pudieron leer tus publicaciones.');
    const reels=(media.data||[]).filter(x=>x.media_product_type==='REELS'||x.media_type==='VIDEO');
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
    res.status(200).json({username:auth.username,media:results});
  }catch(e){res.status(502).json({error:e.message||'Error consultando Instagram.'})}
};
