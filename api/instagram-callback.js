const crypto = require('crypto');
const {seal,cookie} = require('../lib/ig-token');
const {hasSession} = require('../lib/content-auth');
const {IG_PATH, writeJson} = require('../lib/content-store');
module.exports = async function (req,res) {
  const {IG_APP_ID,IG_APP_SECRET,SESSION_SECRET,SITE_URL}=process.env;
  const fail=(msg)=>res.status(400).send(`<meta charset="utf-8"><p style="font:16px sans-serif">Instagram no se conectó: ${String(msg).replace(/[<>]/g,'')}</p><a href="/studio.html">Volver al estudio</a>`);
  if(!IG_APP_ID||!IG_APP_SECRET||!SESSION_SECRET)return fail('Falta configurar la app de Meta en Vercel.');
  if(!hasSession(req,SESSION_SECRET))return fail('La sesión del estudio expiró. Autoriza el dispositivo y vuelve a conectar Instagram.');
  if(req.query.error)return fail(req.query.error_description||req.query.error);
  const state=String(req.query.state||''),stored=cookie(req,'br_ig_state');
  if(!stored||!state||state!==stored)return fail('La validación de seguridad expiró. Vuelve al panel e inténtalo otra vez.');
  const [nonce,sig]=state.split('.');
  if(!nonce||!sig||crypto.createHmac('sha256',SESSION_SECRET).update(nonce).digest('hex')!==sig)return fail('Validación de seguridad incorrecta.');
  try{
    const origin=SITE_URL||`https://${req.headers.host}`,redirectUri=`${origin}/api/instagram-callback`;
    const form=new URLSearchParams({client_id:IG_APP_ID,client_secret:IG_APP_SECRET,grant_type:'authorization_code',redirect_uri:redirectUri,code:String(req.query.code||'')});
    const tokenResp=await fetch('https://api.instagram.com/oauth/access_token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:form});
    const short=await tokenResp.json();if(!tokenResp.ok||!short.access_token)throw Error(short.error_message||short.error?.message||'Meta no entregó acceso.');
    const longUrl=new URL('https://graph.instagram.com/access_token');longUrl.search=new URLSearchParams({grant_type:'ig_exchange_token',client_secret:IG_APP_SECRET,access_token:short.access_token});
    const longResp=await fetch(longUrl);const long=await longResp.json();if(!longResp.ok||!long.access_token)throw Error(long.error?.message||'No se pudo extender el acceso.');
    const meUrl=new URL('https://graph.instagram.com/v26.0/me');meUrl.search=new URLSearchParams({fields:'user_id,username',access_token:long.access_token});
    const meResp=await fetch(meUrl);const me=await meResp.json();if(!meResp.ok)throw Error(me.error?.message||'No se pudo leer la cuenta.');
    const expiresAt=Date.now()+(Number(long.expires_in)||5184000)*1000;
    const instagramSession={accessToken:long.access_token,expiresAt,userId:me.user_id||me.id,username:me.username||''};
    await writeJson(IG_PATH,instagramSession);
    const value=seal(instagramSession,SESSION_SECRET);
    res.setHeader('Set-Cookie',[`br_ig=${value}; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=${Math.floor((expiresAt-Date.now())/1000)}`,`br_ig_state=; HttpOnly; Secure; SameSite=Lax; Path=/api/instagram-callback; Max-Age=0`]);
    res.redirect(302,`${origin}/studio.html?instagram=connected`);
  }catch(e){fail(e.message||'Error al conectar con Meta.');}
};
