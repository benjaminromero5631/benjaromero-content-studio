const {cookie}=require('../lib/ig-token');
const {hasSession}=require('../lib/content-auth');
const {IG_PATH,writeJson}=require('../lib/content-store');
module.exports=async function(req,res){if(req.method!=='POST')return res.status(405).end();if(!hasSession(req,process.env.SESSION_SECRET))return res.status(401).json({error:'Autoriza este dispositivo.'});const raw=cookie(req,'br_ig');try{await writeJson(IG_PATH,{expiresAt:0,accessToken:'',userId:'',username:''})}catch{}if(raw)res.setHeader('Set-Cookie','br_ig=; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=0');res.status(200).json({ok:true})};
