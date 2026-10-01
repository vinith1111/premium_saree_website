import crypto from "node:crypto";

function tokenFor(password){
  const payload=Buffer.from(JSON.stringify({exp:Date.now()+8*60*60*1000})).toString("base64url");
  const sig=crypto.createHmac("sha256",password).update(payload).digest("base64url");
  return payload+"."+sig;
}
function validToken(req,password){
  const h=req.headers.get("authorization")||"";
  if(!h.startsWith("Bearer ")) return false;
  const token=h.slice(7),[payload,sig]=token.split(".");
  if(!payload||!sig) return false;
  const expected=crypto.createHmac("sha256",password).update(payload).digest("base64url");
  if(!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected))) return false;
  try{return JSON.parse(Buffer.from(payload,"base64url").toString()).exp>Date.now()}catch{return false}
}
export default async (req)=>{
  const password=process.env.ADMIN_PASSWORD;
  if(!password) return Response.json({error:"Admin password is not configured. Add ADMIN_PASSWORD in Netlify environment variables."},{status:503});
  if(req.method!=="POST") return new Response("Method not allowed",{status:405});
  const body=await req.json().catch(()=>({}));
  if(String(body.password||"")!==password) return Response.json({error:"Incorrect password"},{status:401});
  return new Response(JSON.stringify({ok:true}),{headers:{"Content-Type":"application/json","Set-Cookie":"sri_admin="+tokenFor(password)+"; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800"}});
};
export {validToken};