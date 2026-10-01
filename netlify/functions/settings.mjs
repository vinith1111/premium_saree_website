import { getStore } from "@netlify/blobs";
import { validToken } from "./_auth.mjs";

function normalizeShopName(value){
 const raw=String(value||"SRI SAI VANI").trim();
 const base=raw.replace(/(?:\s+collections)+\s*$/i,"").trim();
 return (!base||/^collections$/i.test(base)?"SRI SAI VANI":base)+" COLLECTIONS";
}

function authorized(req){
 const secret=process.env.ADMIN_PASSWORD;
 return !!secret && validToken(req,secret);
}
export default async(req)=>{
 const store=getStore("sri-sai-vani-settings");
 if(req.method==="GET"){
  const data=await store.get("settings",{type:"json",consistency:"strong"});
  if(!data)return Response.json({});
  return Response.json({
   ...data,
   shopName:normalizeShopName(data.shopName),
   whatsapp:String(data.whatsapp||"").replace(/\D/g,""),
   about:String(data.about||"").trim(),
   footer:String(data.footer||"").trim()
  });
 }
 if(req.method==="PUT"){
  if(!authorized(req))return Response.json({error:"Admin login required"},{status:401});
  const contentLength=Number(req.headers.get("content-length")||0);
  if(contentLength>50_000)return Response.json({error:"Settings request is too large."},{status:413});
  const data=await req.json().catch(()=>({}));
  const clean={shopName:normalizeShopName(data.shopName).slice(0,100),whatsapp:String(data.whatsapp||"").replace(/\D/g,""),about:String(data.about||"").trim().slice(0,2000),footer:String(data.footer||"").trim().slice(0,1000)};
  if(clean.whatsapp && !/^91\d{10}$/.test(clean.whatsapp))return Response.json({error:"Invalid WhatsApp number"},{status:400});
  await store.setJSON("settings",clean);return Response.json(clean);
 }
 return new Response("Method not allowed",{status:405});
};