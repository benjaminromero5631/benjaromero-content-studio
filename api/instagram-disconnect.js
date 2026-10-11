const {cookie}=require('../lib/ig-token');
module.exports=async function(req,res){if(req.method!=='POST')return res.status(405).end();const raw=cookie(req,'br_ig');if(!raw)return res.status(200).json({ok:true});res.setHeader('Set-Cookie','br_ig=; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=0');res.status(200).json({ok:true})};
