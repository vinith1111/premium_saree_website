window.SriSaiApi={
 base(){
  // Netlify Functions are available only on the Netlify deployment.
  return /netlify\\.app$/i.test(location.hostname) ? "" : "";
 },
 async settings(options={}){
  if(!/netlify\\.app$/i.test(location.hostname)) return {};
  const r=await fetch("/.netlify/functions/settings",options);
  const data=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(data.error||"Settings request failed");
  return data;
 },
 async login(password){
  const r=await fetch("/.netlify/functions/admin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})});
  const data=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(data.error||"Could not sign in");
  return data;
 },
 async catalog(method="GET",body=null){
  if(!/netlify\\.app$/i.test(location.hostname)) return [];
  const options={method,headers:{}};
  if(body!==null){options.headers["Content-Type"]="application/json";options.body=JSON.stringify(body)}
  const r=await fetch("/.netlify/functions/catalog",options);
  const data=await r.json().catch(()=>null);
  if(!r.ok)throw new Error(data?.error||"Catalogue request failed");
  return data;
 },
 async addProduct(product){return this.catalog("POST",product)},
 async updateProduct(product){return this.catalog("PATCH",product)},
 async deleteProduct(id){return this.catalog("DELETE",{id})}
};