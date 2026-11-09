const {hasSession} = require('../lib/content-auth');
const {IG_PATH, readJson} = require('../lib/content-store');
module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const ready = Boolean(process.env.IG_APP_ID && process.env.IG_APP_SECRET && process.env.SESSION_SECRET);
  const token = req.headers.cookie?.split(';').map(x=>x.trim()).find(x=>x.startsWith('br_ig='))?.slice(6);
  let connected = false, username = '';
  try { const saved = await readJson(IG_PATH); if (saved?.data?.expiresAt > Date.now()) { connected = true; username = saved.data.username || ''; } } catch {}
  if (token && process.env.SESSION_SECRET) {
    try {
      const {open} = require('../lib/ig-token');
      const auth = open(token, process.env.SESSION_SECRET);
      connected = Date.now() < auth.expiresAt;
      username = auth.username || '';
    } catch {}
  }
  res.status(200).json({ready, connected, username});
};
