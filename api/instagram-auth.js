const crypto = require('crypto');
const {hasSession} = require('../lib/content-auth');
module.exports = async function (req, res) {
  const {IG_APP_ID, SESSION_SECRET, SITE_URL} = process.env;
  if (!hasSession(req, SESSION_SECRET)) return res.status(401).send('Autoriza este dispositivo para abrir tu estudio.');
  if (!IG_APP_ID || !SESSION_SECRET) return res.status(503).send('Falta configurar IG_APP_ID y SESSION_SECRET en Vercel.');
  const origin = SITE_URL || `https://${req.headers.host}`;
  const redirectUri = `${origin}/api/instagram-callback`;
  const nonce = crypto.randomBytes(20).toString('hex');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(nonce).digest('hex');
  res.setHeader('Set-Cookie', `br_ig_state=${nonce}.${sig}; HttpOnly; Secure; SameSite=Lax; Path=/api/instagram-callback; Max-Age=600`);
  const params = new URLSearchParams({client_id:IG_APP_ID,redirect_uri:redirectUri,response_type:'code',scope:'instagram_business_basic,instagram_business_manage_insights',state:`${nonce}.${sig}`});
  res.redirect(302, `https://www.instagram.com/oauth/authorize?${params}`);
};
