const crypto = require('crypto');
const {hasSession, setSession, clearSession} = require('../lib/content-auth');

module.exports = async function(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method === 'GET') return res.status(200).json({authenticated: hasSession(req, process.env.SESSION_SECRET)});
  if (req.method === 'DELETE') {
    clearSession(res);
    return res.status(200).json({ok: true});
  }
  if (req.method !== 'POST') return res.status(405).json({error: 'Método no permitido.'});
  const {CONTENT_ACCESS_KEY, SESSION_SECRET} = process.env;
  if (!CONTENT_ACCESS_KEY || !SESSION_SECRET) return res.status(503).json({error: 'Falta configurar el acceso privado del estudio.'});
  const submitted = String(req.body?.key || '');
  const expected = Buffer.from(CONTENT_ACCESS_KEY);
  const actual = Buffer.from(submitted);
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) return res.status(401).json({error: 'La clave no coincide.'});
  setSession(res, SESSION_SECRET);
  return res.status(200).json({ok: true});
};
