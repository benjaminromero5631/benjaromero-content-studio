const {hasSession} = require('../lib/content-auth');
const {DATA_PATH, readJson, writeJson} = require('../lib/content-store');

module.exports = async function(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  try {
    if (req.method === 'GET') {
      const stored = await readJson(DATA_PATH);
      if (!stored) return res.status(404).json({error: 'Todavía no hay datos en el estudio.'});
      if (hasSession(req, process.env.SESSION_SECRET)) {
        res.setHeader('ETag', `"${stored.etag}"`);
        return res.status(200).json(stored.data);
      }
      // Brand strategy and personal context are available only after edit authorization.
      const {profileContext, saasContext, brandBase, ...publicData} = stored.data;
      res.setHeader('ETag', `"${stored.etag}"`);
      return res.status(200).json(publicData);
    }
    if (req.method !== 'PUT') return res.status(405).json({error: 'Método no permitido.'});
    if (!hasSession(req, process.env.SESSION_SECRET)) return res.status(401).json({error: 'Autoriza este dispositivo para editar tu estudio.'});
    const data = req.body;
    if (!data || typeof data !== 'object' || Array.isArray(data) || !Array.isArray(data.hooks) || !Array.isArray(data.metrics)) return res.status(400).json({error: 'El contenido del estudio no tiene un formato válido.'});
    if (Buffer.byteLength(JSON.stringify(data), 'utf8') > 2_000_000) return res.status(413).json({error: 'El respaldo supera el límite permitido.'});
    const etag = await writeJson(DATA_PATH, data);
    res.setHeader('ETag', `"${etag}"`);
    return res.status(200).json({ok: true, etag});
  } catch (error) {
    console.error('Content store error:', error?.message || error);
    return res.status(500).json({error: 'No se pudo sincronizar el estudio con el servidor.'});
  }
};
