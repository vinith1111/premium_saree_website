import crypto from "node:crypto";

function parseToken(value,secret){
 const token=String(value||"");
 const [payload,sig]=token.split(".");
 if(!payload||!sig)return false;
 const expected=crypto.createHmac("sha256",secret).update(payload).digest("base64url");
 if(sig.length!==expected.length)return false;
 try{
  if(!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return false;
  const data=JSON.parse(Buffer.from(payload,"base64url").toString());
  return Number(data.exp)>Date.now();
 }catch{return false}
}

export function createAdminToken(password){
 const payload=Buffer.from(JSON.stringify({exp:Date.now()+8*60*60*1000})).toString("base64url");
 const sig=crypto.createHmac("sha256",password).update(payload).digest("base64url");
 return payload+"."+sig;
}

export function validToken(req,password){
 const cookie=req.headers.get("cookie")||"";
 const match=cookie.match(/(?:^|;\s*)sri_admin=([^;]+)/);
 return !!match && parseToken(match[1],password);
}

export function bearerTokenValid(req,password){
 const h=req.headers.get("authorization")||"";
 return h.startsWith("Bearer ") && parseToken(h.slice(7),password);
}
