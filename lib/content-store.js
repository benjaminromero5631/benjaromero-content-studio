const REPO = 'benjaminromero5631/benjaromero-content-studio';
const DATA_PATH = '_data/studio.json';
const IG_PATH = '_data/ig-session.json';

async function ghGet(filePath) {
  const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${filePath}`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
    },
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub GET ${r.status}: ${await r.text()}`);
  const j = await r.json();
  return {content: JSON.parse(Buffer.from(j.content, 'base64').toString('utf8')), sha: j.sha};
}

async function ghPut(filePath, data, sha) {
  const content = Buffer.from(JSON.stringify(data, null, 0)).toString('base64');
  const body = {message: 'studio: sync', content};
  if (sha) body.sha = sha;
  const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${filePath}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`GitHub PUT ${r.status}: ${await r.text()}`);
  const j = await r.json();
  return j.content.sha;
}

async function readJson(path) {
  const result = await ghGet(path);
  if (!result) return null;
  return {data: result.content, etag: result.sha};
}

async function writeJson(path, data) {
  const existing = await ghGet(path);
  return ghPut(path, data, existing?.sha);
}

module.exports = {DATA_PATH, IG_PATH, readJson, writeJson};
