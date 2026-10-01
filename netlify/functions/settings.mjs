import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";

function authorized(req){
 const secret=process.env.ADMIN_PASSWORD;if(!secret)return false;
 const h=req.headers.get("authorization")||"";if(!h.startsWith("Bearer "))return false;
 const [payload,sig]=h.slice(7).split(".");if(!payload||!sig)return false;
 const expected=crypto.createHmac("sha256",secret).update(payload).digest("base64url");
 if(sig.length!==expected.length||!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return false;
 try{return JSON.parse(Buffer.from(payload,"base64url").toString()).exp>Date.now()}catch{return false}
}
export default async(req)=>{
 const store=getStore("sri-sai-vani-settings");
 if(req.method==="GET"){
  const data=await store.get("settings",{type:"json",consistency:"strong"});
  return Response.json(data||{});
 }
 if(req.method==="PUT"){
  if(!authorized(req))return Response.json({error:"Admin login required"},{status:401});
  const data=await req.json();
  const clean={shopName:String(data.shopName||"SRI SAI VANI").trim(),whatsapp:String(data.whatsapp||"").replace(/\D/g,""),about:String(data.about||"").trim(),footer:String(data.footer||"").trim()};
  if(!/^91\d{10}$/.test(clean.whatsapp))return Response.json({error:"Invalid WhatsApp number"},{status:400});
  await store.setJSON("settings",clean);return Response.json(clean);
 }
 return new Response("Method not allowed",{status:405});
};