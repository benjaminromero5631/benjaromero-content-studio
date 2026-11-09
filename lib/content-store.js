const {put, get} = require('@vercel/blob');

const DATA_PATH = 'private/content-studio.json';
const IG_PATH = 'private/instagram-session.json';

async function readJson(path) {
  try {
    const result = await get(path, {access: 'private', useCache: false});
    if (!result) return null;
    const response = new Response(result.stream);
    return {data: await response.json(), etag: result.blob.etag};
  } catch (error) {
    if (error?.status === 404 || error?.code === 'BLOB_NOT_FOUND') return null;
    throw error;
  }
}

async function writeJson(path, data) {
  const result = await put(path, JSON.stringify(data), {
    access: 'private',
    allowOverwrite: true,
    contentType: 'application/json; charset=utf-8',
    cacheControlMaxAge: 60,
  });
  return result.etag;
}

module.exports = {DATA_PATH, IG_PATH, readJson, writeJson};
