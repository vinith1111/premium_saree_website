import { getStore } from "@netlify/blobs";
import { validToken } from "./_auth.mjs";

const OWNER=process.env.GITHUB_OWNER||"vinith1111";
const REPO=process.env.GITHUB_REPO||"premium_saree_website";
const BRANCH=process.env.GITHUB_BRANCH||"main";
const INDEX="products/index.json";
const API="https://api.github.com";

function headers(){return {"Accept":"application/vnd.github+json","Authorization":"Bearer "+process.env.GITHUB_TOKEN,"X-GitHub-Api-Version":"2022-11-28"}}
async function gh(path,opts={}){
 if(!process.env.GITHUB_TOKEN)throw new Error("Git-backed catalogue is not configured. Add GITHUB_TOKEN in Netlify environment variables.");
 const r=await fetch(API+path,{...opts,headers:{...headers(),...(opts.headers||{})}});
 const t=await r.text();let d={};try{d=t?JSON.parse(t):{}}catch{d={message:t}}
 if(!r.ok)throw new Error(d.message||"GitHub request failed ("+r.status+")");
 return d;
}
async function readFile(path,ref=BRANCH){
 try{
  const d=await gh("/repos/"+OWNER+"/"+REPO+"/contents/"+path+"?ref="+encodeURIComponent(ref));
  return {sha:d.sha,content:Buffer.from(String(d.content||"").replace(/\n/g,""),"base64").toString("utf8")};
 }catch(e){if(String(e.message).includes("404"))return null;throw e}
}
async function index(){
 const f=await readFile(INDEX);if(!f)return null;
 try{const d=JSON.parse(f.content);return Array.isArray(d)?d:null}catch{return null}
}
async function legacy(){
 try{const s=getStore("sri-sai-vani-catalog");const d=await s.get("items",{type:"json",consistency:"strong"});return Array.isArray(d)?d:[]}catch{return []}
}
function valid(x,i){
 const a={id:Number(x?.id)||Date.now()+i,name:String(x?.name||"").trim(),price:String(x?.price||"").trim(),category:(()=>{const v=String(x?.category||"").trim().toLowerCase();return v==="saree"||v==="sarees"?"Sarees":v==="dress"||v==="dresses"?"Dresses":""})(),color:String(x?.color||"").trim(),description:String(x?.description||"").trim(),image:String(x?.image||"").trim(),featured:Boolean(x?.featured),bestSeller:Boolean(x?.bestSeller)};
 if(!a.name||a.name.length>100||!a.price||!Number.isFinite(Number(a.price))||Number(a.price)<=0||a.price.length>20||!a.category||a.category.length>50||a.color.length>50||a.description.length>1000||!a.image||a.image.length>3000000)return null;
 if(!/^(https?:\/\/|\/|data:image\/)/i.test(a.image))return null;
 if(/^data:image\//i.test(a.image)&&a.image.length>2500000)return null;
 return a;
}
function id(v){return String(v).replace(/[^a-zA-Z0-9_-]/g,"-").slice(0,80)||String(Date.now())}
function dataImage(v){
 const m=String(v).match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,([A-Za-z0-9+/=]+)$/i);
 if(!m)return null;
 return {ext:m[1].toLowerCase().includes("png")?"png":m[1].toLowerCase().includes("webp")?"webp":"jpg",base64:m[2]};
}
async function blob(content,encoding="utf-8"){
 const d=await gh("/repos/"+OWNER+"/"+REPO+"/git/blobs",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content,encoding})});return d.sha;
}
async function head(){
 const r=await gh("/repos/"+OWNER+"/"+REPO+"/git/ref/heads/"+encodeURIComponent(BRANCH));
 const c=await gh("/repos/"+OWNER+"/"+REPO+"/git/commits/"+r.object.sha);
 return {parent:r.object.sha,tree:c.tree.sha};
}
async function commit(changes,message){
 const h=await head();
 const tree=await gh("/repos/"+OWNER+"/"+REPO+"/git/trees",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({base_tree:h.tree,tree:changes.map(x=>({path:x.path,mode:"100644",type:"blob",sha:x.delete?null:x.sha}))})});
 const c=await gh("/repos/"+OWNER+"/"+REPO+"/git/commits",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message,tree:tree.sha,parents:[h.parent]})});
 await gh("/repos/"+OWNER+"/"+REPO+"/git/refs/heads/"+encodeURIComponent(BRANCH),{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({sha:c.sha,force:false})});
 return c.sha;
}
async function putIndex(items,changes){
 changes.push({path:INDEX,sha:await blob(Buffer.from(JSON.stringify(items,null,2)+"\n").toString("base64"),"base64")});
}
async function migrate(items){
 const clean=items.map(valid).filter(Boolean),storedItems=[],changes=[];
 for(const x of clean){
  const img=dataImage(x.image);let imagePath=null;
  if(img){imagePath="products/"+id(x.id)+"/image."+img.ext;changes.push({path:imagePath,sha:await blob(img.base64,"base64")})}
  const stored={...x,image:img?imagePath:x.image,imagePath};
  storedItems.push(stored);
  changes.push({path:"products/"+id(x.id)+"/product.json",sha:await blob(Buffer.from(JSON.stringify(stored,null,2)+"\n").toString("base64"),"base64")});
 }
 await putIndex(storedItems,changes);await commit(changes,"Migrate catalogue to Git-backed storage");return storedItems;
}
async function ensure(){
 const i=await index();if(i)return i;
 const old=await legacy();if(old.length)return migrate(old);
 const changes=[];await putIndex([],changes);await commit(changes,"Initialize Git-backed product catalogue");return [];
}
async function save(x,isNew){
 const items=await ensure(),idx=items.findIndex(a=>String(a.id)===String(x.id));
 if(isNew&&idx>=0)throw new Error("A product with this ID already exists.");
 if(!isNew&&idx<0)throw new Error("Product not found.");
 const old=idx>=0?items[idx]:null,next=[...items];if(isNew)next.unshift(x);else next[idx]=x;
 if(next.length>500)throw new Error("Catalogue cannot contain more than 500 products.");
 const changes=[],img=dataImage(x.image);let imagePath=old?.imagePath||null;
 if(img){imagePath="products/"+id(x.id)+"/image."+img.ext;changes.push({path:imagePath,sha:await blob(img.base64,"base64")});if(old?.imagePath&&old.imagePath!==imagePath)changes.push({path:old.imagePath,delete:true})}
 const stored={...x,image:img?imagePath:x.image,imagePath};next[isNew?0:idx]=stored;
 changes.push({path:"products/"+id(x.id)+"/product.json",sha:await blob(Buffer.from(JSON.stringify(stored,null,2)+"\n").toString("base64"),"base64")});
 await putIndex(next,changes);await commit(changes,(isNew?"Add product: ":"Update product: ")+x.name);return stored;
}
async function remove(pid){
 const items=await ensure(),idx=items.findIndex(x=>String(x.id)===String(pid));if(idx<0)throw new Error("Product not found.");
 const x=items[idx],next=items.filter((_,i)=>i!==idx),changes=[{path:"products/"+id(x.id)+"/product.json",delete:true}];
 if(x.imagePath)changes.push({path:x.imagePath,delete:true});
 await putIndex(next,changes);await commit(changes,"Delete product: "+x.name);return {id:pid};
}
function auth(req){const p=process.env.ADMIN_PASSWORD;return !!p&&validToken(req,p)}
export default async(req)=>{
 try{
  if(req.method==="GET"){
   const i=await index();
   if(i!==null){
    if(i.length===0&&process.env.GITHUB_TOKEN){
     const old=await legacy();
     if(old.length)return Response.json(await migrate(old));
    }
    return Response.json(i);
   }
   return Response.json(await legacy());
  }
  if(!auth(req))return Response.json({error:"Admin login required"},{status:401});
  if(!process.env.GITHUB_TOKEN)return Response.json({error:"Git-backed catalogue is not configured. Add GITHUB_TOKEN in Netlify environment variables."},{status:503});
  if(req.method==="POST"||req.method==="PATCH"){
   if(Number(req.headers.get("content-length")||0)>3000000)return Response.json({error:"Product image/request is too large."},{status:413});
   const x=valid(await req.json().catch(()=>null),0);if(!x)return Response.json({error:"Invalid or oversized product."},{status:400});
   const saved=await save(x,req.method==="POST");return Response.json(saved,{status:req.method==="POST"?201:200});
  }
  if(req.method==="DELETE"){const b=await req.json().catch(()=>null);if(b?.id==null)return Response.json({error:"Product ID is required."},{status:400});return Response.json(await remove(b.id))}
  return new Response("Method not allowed",{status:405});
 }catch(e){console.error(e);return Response.json({error:e.message||"Git-backed catalogue failed"},{status:500})}
};
