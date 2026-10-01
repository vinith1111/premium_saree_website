import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";

const defaults=[
{id:1001,name:"Test Banarasi Saree",price:"4999",category:"Silk Sarees",color:"Red & Gold",description:"TEST ITEM - temporary product for website testing.",image:"/images/test-banarasi-saree.svg",featured:true},
{id:1002,name:"Test Cotton Saree",price:"1999",category:"Cotton Sarees",color:"Blue",description:"TEST ITEM - temporary product for website testing.",image:"/images/test-cotton-saree.svg",featured:false},
{id:1003,name:"Test Party Dress",price:"2999",category:"Dresses",color:"Pink",description:"TEST ITEM - temporary product for website testing.",image:"/images/test-party-dress.svg",featured:true},
{id:1004,name:"Test Casual Dress",price:"1799",category:"Dresses",color:"Green",description:"TEST ITEM - temporary product for website testing.",image:"/images/test-casual-dress.svg",featured:false}
];
function authorized(req){
 const secret=process.env.ADMIN_PASSWORD;if(!secret)return false;
 const cookie=req.headers.get("cookie")||"";const match=cookie.match(/(?:^|;\s*)sri_admin=([^;]+)/);const h=match?match[1]:"";if(!h)return false;
 const [payload,sig]=h.split(".");if(!payload||!sig)return false;
 const expected=crypto.createHmac("sha256",secret).update(payload).digest("base64url");
 if(sig.length!==expected.length||!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return false;
 try{return JSON.parse(Buffer.from(payload,"base64url").toString()).exp>Date.now()}catch{return false}
}
export default async(req)=>{
 const store=getStore("sri-sai-vani-catalog");
 if(req.method==="GET"){
  let data=await store.get("items",{type:"json",consistency:"strong"});
  if(!Array.isArray(data)){data=defaults;await store.setJSON("items",data)}
  else {
   const demoImages={1001:"/images/test-banarasi-saree.svg",1002:"/images/test-cotton-saree.svg",1003:"/images/test-party-dress.svg",1004:"/images/test-casual-dress.svg"};
   const updated=data.map(x=>demoImages[x.id] && String(x.name||"").startsWith("Test ") && x.image!==demoImages[x.id] ? {...x,image:demoImages[x.id]} : x);
   if(updated.some((x,i)=>x.image!==data[i].image)) await store.setJSON("items",updated);
   data=updated;
  }
  return Response.json(data);
 }
 if(!authorized(req))return Response.json({error:"Admin login required"},{status:401});
 if(req.method==="PUT"){
  const data=await req.json();
  if(!Array.isArray(data))return Response.json({error:"Invalid catalogue"},{status:400});
  const clean=data.map((x,i)=>({id:Number(x.id)||Date.now()+i,name:String(x.name||"").trim(),price:String(x.price||"").trim(),category:String(x.category||"").trim(),color:String(x.color||"").trim(),description:String(x.description||"").trim(),image:String(x.image||"").trim(),featured:Boolean(x.featured)})).filter(x=>x.name&&x.price&&x.image);
  await store.setJSON("items",clean);return Response.json(clean);
 }
 return new Response("Method not allowed",{status:405});
};