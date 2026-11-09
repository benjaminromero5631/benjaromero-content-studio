const crypto = require('crypto');
const {cookie} = require('./ig-token');

const COOKIE = 'br_content_session';
const MAX_AGE = 60 * 60 * 24 * 180;

function signature(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

function createSession(secret) {
  const payload = `${Date.now() + MAX_AGE * 1000}.${crypto.randomBytes(16).toString('base64url')}`;
  return `${payload}.${signature(payload, secret)}`;
}

function hasSession(req, secret) {
  if (!secret) return false;
  const value = cookie(req, COOKIE);
  const parts = value.split('.');
  if (parts.length !== 3 || Number(parts[0]) < Date.now()) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = Buffer.from(signature(payload, secret));
  const actual = Buffer.from(parts[2]);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function setSession(res, secret) {
  res.setHeader('Set-Cookie', `${COOKIE}=${createSession(secret)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${MAX_AGE}`);
}

function clearSession(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`);
}

module.exports = {hasSession, setSession, clearSession};
