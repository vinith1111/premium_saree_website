import { getStore } from "@netlify/blobs";
import { validToken } from "./_auth.mjs";

function authorized(req){
 const secret=process.env.ADMIN_PASSWORD;
 return !!secret && validToken(req,secret);
}
function validateProduct(x,i){
 const item={
  id:Number(x?.id)||Date.now()+i,
  name:String(x?.name||"").trim(),
  price:String(x?.price||"").trim(),
  category:String(x?.category||"").trim(),
  color:String(x?.color||"").trim(),
  description:String(x?.description||"").trim(),
  image:String(x?.image||"").trim(),
  featured:Boolean(x?.featured)
 };
 if(!item.name||item.name.length>100)return null;
 if(!item.price||item.price.length>20)return null;
 const numericPrice=Number(item.price);
 if(!Number.isFinite(numericPrice)||numericPrice<=0)return null;
 if(!item.category||item.category.length>50)return null;
 if(item.color.length>50||item.description.length>1000)return null;
 if(!item.image||item.image.length>3_000_000)return null;
 if(/^data:image\//i.test(item.image) && item.image.length>2_500_000)return null;
 if(!(/^(?:https?:\/\/|\/|data:image\/)/i.test(item.image)))return null;
 return item;
}
export default async(req)=>{
 const store=getStore("sri-sai-vani-catalog");
 if(req.method==="GET"){
  const data=await store.get("items",{type:"json",consistency:"strong"});
  return Response.json(Array.isArray(data)?data:[]);
 }
 if(!authorized(req))return Response.json({error:"Admin login required"},{status:401});
 if(req.method==="PUT"){
  const contentLength=Number(req.headers.get("content-length")||0);
  if(contentLength>10_000_000)return Response.json({error:"Catalogue request is too large."},{status:413});
  const data=await req.json().catch(()=>null);
  if(!Array.isArray(data))return Response.json({error:"Invalid catalogue"},{status:400});
  if(data.length>500)return Response.json({error:"Catalogue cannot contain more than 500 products."},{status:400});
  const clean=data.map(validateProduct).filter(Boolean);
  if(clean.length!==data.length)return Response.json({error:"One or more products contain invalid or oversized fields."},{status:400});
  const ids=clean.map(x=>String(x.id));
  if(new Set(ids).size!==ids.length)return Response.json({error:"Product IDs must be unique."},{status:400});
  await store.setJSON("items",clean);return Response.json(clean);
 }
 if(req.method==="POST"){
  const contentLength=Number(req.headers.get("content-length")||0);
  if(contentLength>3_000_000)return Response.json({error:"Product image/request is too large."},{status:413});
  const body=await req.json().catch(()=>null);
  const item=validateProduct(body,0);
  if(!item)return Response.json({error:"Invalid or oversized product."},{status:400});
  const data=await store.get("items",{type:"json",consistency:"strong"});
  const items=Array.isArray(data)?data:[];
  if(items.length>=500)return Response.json({error:"Catalogue cannot contain more than 500 products."},{status:400});
  if(items.some(x=>String(x.id)===String(item.id)))return Response.json({error:"A product with this ID already exists."},{status:409});
  const updated=[item,...items];
  await store.setJSON("items",updated);
  return Response.json(item,{status:201});
 }
 if(req.method==="PATCH"){
  const contentLength=Number(req.headers.get("content-length")||0);
  if(contentLength>3_000_000)return Response.json({error:"Product image/request is too large."},{status:413});
  const body=await req.json().catch(()=>null);
  const item=validateProduct(body,0);
  if(!item)return Response.json({error:"Invalid or oversized product."},{status:400});
  const data=await store.get("items",{type:"json",consistency:"strong"});
  const items=Array.isArray(data)?data:[];
  const index=items.findIndex(x=>String(x.id)===String(item.id));
  if(index<0)return Response.json({error:"Product not found."},{status:404});
  const updated=[...items];
  updated[index]=item;
  await store.setJSON("items",updated);
  return Response.json(item);
 }
 if(req.method==="DELETE"){
  const contentLength=Number(req.headers.get("content-length")||0);
  if(contentLength>1000)return Response.json({error:"Invalid request."},{status:400});
  const body=await req.json().catch(()=>null);
  const id=body?.id;
  if(id===undefined||id===null||String(id).trim()==="")return Response.json({error:"Product ID is required."},{status:400});
  const data=await store.get("items",{type:"json",consistency:"strong"});
  const items=Array.isArray(data)?data:[];
  const updated=items.filter(x=>String(x.id)!==String(id));
  if(updated.length===items.length)return Response.json({error:"Product not found."},{status:404});
  await store.setJSON("items",updated);
  return Response.json({id});
 }
 return new Response("Method not allowed",{status:405});
};