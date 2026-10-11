const crypto = require('crypto');
function key(secret){return crypto.createHash('sha256').update(secret).digest()}
function seal(data,secret){const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',key(secret),iv);const body=Buffer.concat([cipher.update(JSON.stringify(data)),cipher.final()]);return Buffer.concat([iv,cipher.getAuthTag(),body]).toString('base64url')}
function open(value,secret){const b=Buffer.from(value,'base64url'),iv=b.subarray(0,12),tag=b.subarray(12,28),body=b.subarray(28),dec=crypto.createDecipheriv('aes-256-gcm',key(secret),iv);dec.setAuthTag(tag);return JSON.parse(Buffer.concat([dec.update(body),dec.final()]).toString())}
function cookie(req,name){return req.headers.cookie?.split(';').map(x=>x.trim()).find(x=>x.startsWith(`${name}=`))?.slice(name.length+1)||''}
module.exports={seal,open,cookie};
