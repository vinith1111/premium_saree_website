import { createAdminToken } from "./_auth.mjs";

export default async (req)=>{
  const password=process.env.ADMIN_PASSWORD;
  if(!password) return Response.json({error:"Admin password is not configured. Add ADMIN_PASSWORD in Netlify environment variables."},{status:503});
  if(req.method!=="POST") return new Response("Method not allowed",{status:405});
  const body=await req.json().catch(()=>({}));
  if(String(body.password||"")!==password) return Response.json({error:"Incorrect password"},{status:401});
  return new Response(JSON.stringify({ok:true}),{headers:{"Content-Type":"application/json","Set-Cookie":"sri_admin="+createAdminToken(password)+"; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800"}});
};
export {validToken};