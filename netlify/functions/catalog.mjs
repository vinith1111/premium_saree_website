import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";

const defaults=[
{id:1,name:"Banarasi Silk Saree",price:"4999",category:"Silk",color:"Ruby & Gold",description:"Lustrous silk with classic zari detailing.",image:"https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",featured:true},
{id:2,name:"Kanchipuram Heritage",price:"6999",category:"Silk",color:"Blush Pink",description:"A festive silk drape with traditional character.",image:"https://images.unsplash.com/photo-1610189012906-1b89d7b2f4f5?auto=format&fit=crop&w=900&q=85",featured:true},
{id:3,name:"Handloom Cotton",price:"1799",category:"Cotton",color:"Indigo Blue",description:"Easy, breathable and beautifully textured.",image:"https://images.unsplash.com/photo-1583391733981-8498406f7f0c?auto=format&fit=crop&w=900&q=85",featured:true},
{id:4,name:"Festive Tissue Saree",price:"3299",category:"Festive",color:"Rose Gold",description:"Light-catching festive texture for evenings.",image:"https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85",featured:true}
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