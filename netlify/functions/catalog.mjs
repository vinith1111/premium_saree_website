import { getStore } from "@netlify/blobs";
import { validToken } from "./_auth.mjs";

const defaults=[
{id:1001,name:"Test Banarasi Saree",price:"4999",category:"Silk Sarees",color:"Red & Gold",description:"TEST ITEM - temporary product for website testing.",image:"/images/test-banarasi-saree.svg",featured:true},
{id:1002,name:"Test Cotton Saree",price:"1999",category:"Cotton Sarees",color:"Blue",description:"TEST ITEM - temporary product for website testing.",image:"/images/test-cotton-saree.svg",featured:false},
{id:1003,name:"Test Party Dress",price:"2999",category:"Dresses",color:"Pink",description:"TEST ITEM - temporary product for website testing.",image:"/images/test-party-dress.svg",featured:true},
{id:1004,name:"Test Casual Dress",price:"1799",category:"Dresses",color:"Green",description:"TEST ITEM - temporary product for website testing.",image:"/images/test-casual-dress.svg",featured:false}
];
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
  let data=await store.get("items",{type:"json",consistency:"strong"});
  if(!Array.isArray(data)){data=defaults;await store.setJSON("items",data)}
  else {
   const hasOldImages=data.some(x=>/images\.unsplash\.com|placehold\.co/i.test(String(x.image||"")));
   const hasOldDemoIds=data.some(x=>[1,2,3,4].includes(Number(x.id)));
   if(hasOldImages || hasOldDemoIds){
    data=defaults;
    await store.setJSON("items",data);
   } else {
    const demoImages={1001:"/images/test-banarasi-saree.svg",1002:"/images/test-cotton-saree.svg",1003:"/images/test-party-dress.svg",1004:"/images/test-casual-dress.svg"};
    const updated=data.map(x=>demoImages[x.id] && String(x.name||"").startsWith("Test ") && x.image!==demoImages[x.id] ? {...x,image:demoImages[x.id]} : x);
    if(updated.some((x,i)=>x.image!==data[i].image)) await store.setJSON("items",updated);
    data=updated;
   }
  }
  return Response.json(data);
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
 return new Response("Method not allowed",{status:405});
};