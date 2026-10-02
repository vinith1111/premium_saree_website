function toggleMenu(){
 const nav=document.getElementById("mainNav");
 const btn=document.getElementById("menuToggle");
 if(!nav)return;
 const open=nav.classList.toggle("mobile-open");
 document.body.classList.toggle("menu-open",open);
 if(btn){btn.setAttribute("aria-expanded",String(open));btn.setAttribute("aria-label",open?"Close menu":"Open menu")}
}
function showAdmin(){
 const modal=document.getElementById("adminModal");
 if(!modal)return;
 modal.classList.remove("hidden");
 document.body.style.overflow="hidden";
 const loginBox=document.getElementById("loginBox"),adminBox=document.getElementById("adminBox");
 loginBox?.classList.remove("hidden");adminBox?.classList.add("hidden");
 const p=document.getElementById("adminPassword");if(p){p.value="";setTimeout(()=>p.focus(),50)}
}
function hideAdmin(){
 document.getElementById("adminModal")?.classList.add("hidden");
 document.body.style.overflow="";
}
function initMobileMenu(){
 const btn=document.getElementById("menuToggle");
 if(!btn)return;
 btn.addEventListener("click",toggleMenu);
 window.addEventListener("resize",()=>{
   if(window.innerWidth>900){
     const nav=document.getElementById("mainNav");
     if(nav)nav.classList.remove("mobile-open");
     document.body.classList.remove("menu-open");
     btn.setAttribute("aria-expanded","false");
     btn.setAttribute("aria-label","Open menu");
   }
 });
}
function setupAnchorLinks(){
 document.querySelectorAll('a[href^="#"]').forEach(link=>{
   if(link.dataset.anchorBound) return;
   link.dataset.anchorBound="1";
   link.addEventListener("click",e=>{
     const id=link.getAttribute("href").slice(1);
     if(!id) return;
     const target=document.getElementById(id);
     if(!target) return;
     e.preventDefault();
     target.scrollIntoView({behavior:"smooth",block:"start"});
     const nav=document.getElementById("mainNav");
     if(nav) nav.classList.remove("mobile-open");
     document.body.classList.remove("menu-open");
     history.replaceState(null,"","#"+id);
   });
 });
}
const KEY="srisai_vani_items_v2", SETTINGS="srisai_vani_settings_v2";
let sarees=[];

let settings=(()=>{try{return JSON.parse(localStorage.getItem(SETTINGS)||"null")}catch(e){return null}})()||{shopName:"SRI SAI VANI",whatsapp:"",about:"Explore our collection and contact us on WhatsApp for product details and availability.",footer:"",theme:"light"};
// Theme has one authoritative browser preference. This prevents an older cached/cloud setting
// from putting the storefront back into Dark after Light was selected.
try{
  const savedTheme=localStorage.getItem("srisai_vani_theme");
  if(savedTheme==="light" || savedTheme==="dark") settings.theme=savedTheme;
}catch(e){}
const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
function saveLocal(){try{localStorage.setItem(KEY,JSON.stringify(sarees));localStorage.setItem(SETTINGS,JSON.stringify(settings));return true}catch(e){console.error("Local storage error",e);return false}}
function whatsappNumber(){const raw=String(settings.whatsapp||"").replace(/\D/g,"");return raw.length===10?"91"+raw:(raw.startsWith("91")&&raw.length===12?raw:"")}
function whatsappLink(message){const phone=whatsappNumber();const text=encodeURIComponent(message);return phone?"https://wa.me/"+phone+"?text="+text:"https://wa.me/?text="+text}
function wa(s){return whatsappLink("Hi, I'm interested in "+s.name+" - ₹"+s.price+". Is it available?")}
function card(s){return '<article class="product-card"><div class="product-image" onclick="showImage(this.querySelector(\'img\').src)" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();showImage(this.querySelector(\'img\').src)}" role="button" tabindex="0" aria-label="View product image">'+(s.featured?'<span class="badge">New arrival</span>':'')+'<img class="product-img" src="'+esc(s.image)+'" alt="'+esc(s.name)+'" onerror="this.classList.add(\'image-load-failed\')"></div>'<div class="product-body"><h3>'+esc(s.name)+'</h3><div class="subline">'+esc(s.category)+' · '+esc(s.color)+'</div><div class="price-row"><span class="price">₹'+Number(s.price).toLocaleString("en-IN")+'</span><a class="small-wa whatsapp-mini" target="_blank" href="'+wa(s)+'" aria-label="Enquire on WhatsApp" title="Enquire on WhatsApp"><svg class="wa-logo-correct" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#fff" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg></a></div></div></article>'}
async function syncSharedSettings(){
try{
const r=await window.SriSaiApi.settings({cache:"no-store"});
if(r && typeof r==="object" && Object.keys(r).length){
const remote=r;
if(remote && Object.keys(remote).length){
 const savedTheme=localStorage.getItem("srisai_vani_theme");
 const settingsSnapshot=localStorage.getItem(SETTINGS);
 let localTheme="";
 try{
   if(savedTheme==="light" || savedTheme==="dark") localTheme=savedTheme;
   else if(settingsSnapshot){
     const local=JSON.parse(settingsSnapshot);
     localTheme=local.theme==="light"?"light":local.theme==="dark"?"dark":"";
   }
 }catch(e){}
 settings={...settings,...remote};
 // Theme is device/browser UI preference, never a stale cloud preference.
 if(localTheme) settings.theme=localTheme;
 try{localStorage.setItem(SETTINGS,JSON.stringify(settings));localStorage.setItem("srisai_vani_theme",settings.theme)}catch(e){}
}
}
}catch(e){console.warn("Shared settings unavailable; using local settings.",e)}
render();
}
let catalogPage=1;
function catalogPageSize(){return 10}
function setSiteTheme(selected){
 const theme=selected==="dark"?"dark":"light";
 settings={...settings,theme};
 try{
   localStorage.setItem("srisai_vani_theme",theme);
   localStorage.setItem(SETTINGS,JSON.stringify(settings));
 }catch(e){}
 applyTheme();
 render();
}
function applyTheme(){
 const theme=settings.theme==="dark"?"dark":"light";
 const root=document.documentElement;
 if(root.dataset.theme!==theme) root.dataset.theme=theme;
 const siteTheme=document.getElementById("siteTheme");
 if(siteTheme && siteTheme.value!==theme) siteTheme.value=theme;
}
function render(){
 applyTheme();
 const searchEl=document.getElementById("search");
 const q=(searchEl?.value||"").trim().toLowerCase();
 const clearBtn=document.getElementById("searchClear");
 if(clearBtn) clearBtn.classList.toggle("hidden",!q);
 const cats=[...new Set((sarees||[]).map(s=>String(s.category||"").trim()).filter(Boolean))];
 const current=String(window.selectedCategory||"").trim();
 const filtered=(sarees||[]).filter(s=>{
   const category=String(s.category||"").trim();
   const text=[s.name,s.category,s.color,s.description].map(v=>String(v||"")).join(" ").toLowerCase();
   return (!current||category.toLowerCase()===current.toLowerCase())&&(!q||text.includes(q));
 });
 const list=[...filtered].sort((a,b)=>Number(Boolean(b.featured))-Number(Boolean(a.featured)));
 const size=catalogPageSize();
 const totalPages=Math.max(1,Math.ceil(list.length/size));
 if(catalogPage>totalPages) catalogPage=totalPages;
 const pageItems=list.slice((catalogPage-1)*size,catalogPage*size);
 const tabs=document.getElementById("catalogCategoryTabs");
 if(tabs){
   tabs.innerHTML='<button type="button" class="category-btn '+(!current?'active':'')+'" data-category="">All</button>'+
     cats.map(c=>'<button type="button" class="category-btn '+(current.toLowerCase()===c.toLowerCase()?'active':'')+'" data-category="'+escAttr(c)+'">'+esc(c)+'</button>').join("");
   tabs.querySelectorAll(".category-btn").forEach(btn=>btn.addEventListener("click",()=>selectCatalogCategory(btn.dataset.category)));
 }
 const grid=document.getElementById("catalogGrid");
 if(grid){
   grid.innerHTML=pageItems.map(card).join("");
   grid.querySelectorAll(".product-img").forEach(img=>img.addEventListener("error",()=>img.classList.add("image-load-failed"),{once:true}));
 }
 const empty=document.getElementById("empty");
 if(empty){
   empty.textContent=q||current?"No items found. Try another search or category.":"No products available yet.";
   empty.classList.toggle("hidden",list.length>0);
 }
 const pager=document.getElementById("catalogPagination");
 if(pager){
   pager.innerHTML=totalPages>1?
     '<button type="button" class="btn" '+(catalogPage===1?'disabled':'')+' onclick="changeCatalogPage('+(catalogPage-1)+')">Previous</button><span>Page '+catalogPage+' of '+totalPages+'</span><button type="button" class="btn" '+(catalogPage===totalPages?'disabled':'')+' onclick="changeCatalogPage('+(catalogPage+1)+')">Next</button>':'';
   pager.classList.toggle("hidden",totalPages<=1);
 }
 const rawShopName=String(settings.shopName||"SRI SAI VANI").trim();
 const baseShopName=rawShopName.replace(/(?:\s+collections)+\s*$/i,"").trim();
 const shopName=baseShopName?baseShopName+" COLLECTIONS":"SRI SAI VANI COLLECTIONS";
 ["shopName","footerName","heroShopName"].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=shopName});
 document.title=shopName;
 const aboutInfo=document.getElementById("aboutInfo"); if(aboutInfo) aboutInfo.textContent=settings.about||"";
 const mainWaLink=whatsappLink("Hi, I'd like to see your collection.");
 const mainWa=document.getElementById("mainWa"); if(mainWa) mainWa.href=mainWaLink;
 const mainWaButton=document.getElementById("mainWaButton"); if(mainWaButton) mainWaButton.href=mainWaLink;
}
function escAttr(value){return String(value??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function selectCatalogCategory(category){window.selectedCategory=String(category||"").trim();catalogPage=1;const search=document.getElementById("search");if(search)search.value="";render()}
function changeCatalogPage(page){catalogPage=Math.max(1,Number(page)||1);render();document.getElementById("catalog")?.scrollIntoView({behavior:"smooth",block:"start"})}

async function login(){
 const p=document.getElementById("adminPassword"),status=document.getElementById("loginStatus");
 try{const d=await window.SriSaiApi.login(p.value);p.value="";document.getElementById("loginBox").classList.add("hidden");document.getElementById("adminBox").classList.remove("hidden");await loadCatalog();openSareeList()}catch(e){p.value="";p.focus();if(status)status.textContent=e.message}}
async function apiCatalog(method="GET",body=null){return window.SriSaiApi.catalog(method,body)}
async function saveCatalogItem(item,isNew=false){
 try{
  const saved=isNew?await window.SriSaiApi.addProduct(item):await window.SriSaiApi.updateProduct(item);
  if(!saved||typeof saved!=="object")throw new Error("Invalid product response");
  return saved;
 }catch(e){
  console.error("Product save failed",e);
  alert(e.message||"Could not save this product. Please try again.");
  return null;
 }
}
async function deleteCatalogItem(id){
 try{
  await window.SriSaiApi.deleteProduct(id);
  return true;
 }catch(e){
  console.error("Product delete failed",e);
  alert(e.message||"Could not delete this product. Please try again.");
  return false;
 }
}
async function loadCatalog(){
 try{
  const remote=await apiCatalog();
  if(Array.isArray(remote)){
    sarees=remote;
    saveLocal();
    render();
    return true;
  }
 }catch(e){
  console.warn("Cloud catalogue unavailable",e);
  sarees=[];
  saveLocal();
  render();
  return false;
 }
}

let adminPage=1;
const ADMIN_PAGE_SIZE=10;
function openSareeList(page=1){
 adminPage=Math.max(1,Math.min(Number(page)||1,Math.ceil(sarees.length/ADMIN_PAGE_SIZE)||1));
 const start=(adminPage-1)*ADMIN_PAGE_SIZE;
 const items=sarees.slice(start,start+ADMIN_PAGE_SIZE);
 const totalPages=Math.ceil(sarees.length/ADMIN_PAGE_SIZE)||1;
 const el=document.getElementById("adminContent");
 if(!el)return;
 el.innerHTML='<div class="admin-list">'+items.map(s=>'<div class="admin-item"><img src="'+esc(s.image)+'"><div class="grow"><b>'+esc(s.name)+'</b><br>₹'+Number(s.price).toLocaleString("en-IN")+' · '+esc(s.category)+'<br><span class="admin-arrival-status '+(s.featured?'is-new':'is-old')+'">'+(s.featured?'New Arrival':'Regular Item')+'</span></div><button class="arrival-toggle" onclick="toggleNewArrival('+s.id+')">'+(s.featured?'Mark as Old':'Make New Arrival')+'</button><button onclick="openSareeForm('+s.id+')">Edit</button><button class="danger" onclick="deleteItem('+s.id+')">Delete</button></div>').join("")+'</div><div class="admin-pagination"><button class="btn" '+(adminPage===1?'disabled':'')+' onclick="openSareeList('+(adminPage-1)+')">Previous</button><span>Page '+adminPage+' of '+totalPages+' · '+sarees.length+' items</span><button class="btn" '+(adminPage===totalPages?'disabled':'')+' onclick="openSareeList('+(adminPage+1)+')">Next</button></div>';
}
function openSareeForm(id=null){const s=id?sarees.find(x=>x.id===id):{name:"",price:"",category:"",color:"",description:"",image:"",featured:false};document.getElementById("adminContent").innerHTML='<div class="form"><label>Name<input id="fName" value="'+esc(s.name)+'"></label><div class="row"><label>Price<input id="fPrice" type="number" value="'+esc(s.price)+'"></label><label>Category<input id="fCategory" value="'+esc(s.category)+'"></label></div><label>Colour<input id="fColor" value="'+esc(s.color)+'"></label><label>Description<textarea id="fDesc">'+esc(s.description)+'</textarea></label><label>Image URL<input id="fImage" value="'+esc(s.image)+'"></label><label>Upload image<input id="fFile" type="file" accept="image/*" onchange="previewFile(this)"></label><img id="fPreview" class="preview '+(s.image?'':'hidden')+'" src="'+esc(s.image)+'"><label><input id="fFeatured" type="checkbox" '+(s.featured?'checked':'')+'> Show as new arrival</label><div><button class="btn dark" onclick="saveItem('+(id||"null")+')">Save Item</button> <button class="btn" onclick="openSareeList()">Cancel</button></div></div>'}
function previewFile(input){
const file=input.files[0];if(!file)return;
const reader=new FileReader();
reader.onload=()=>{
const img=new Image();
img.onload=()=>{
const max=1400,scale=Math.min(1,max/Math.max(img.width,img.height)),canvas=document.createElement("canvas");
canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);
canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);
const data=canvas.toDataURL("image/jpeg",0.82);
document.getElementById("fImage").value=data;document.getElementById("fPreview").src=data;document.getElementById("fPreview").classList.remove("hidden");
};
img.src=reader.result;
};
reader.readAsDataURL(file);
}
async function saveItem(id){
 const d={name:document.getElementById("fName").value.trim(),price:document.getElementById("fPrice").value,category:document.getElementById("fCategory").value.trim(),color:document.getElementById("fColor").value.trim(),description:document.getElementById("fDesc").value.trim(),image:document.getElementById("fImage").value.trim(),featured:document.getElementById("fFeatured").checked};
 const price=Number(d.price);
 if(!d.name)return alert("Please enter the item name.");
 if(!Number.isFinite(price)||price<=0)return alert("Please enter a valid price greater than 0.");
 if(!d.category)return alert("Please enter a category, for example Sarees or Dresses.");
 if(!d.image)return alert("Please add an image URL or upload an image.");
 if(d.image.length>2_500_000)return alert("Image is too large. Please choose a smaller image.");
 const item={id:id||Date.now(),...d};
 const saved=await saveCatalogItem(item,!id);
 if(saved){
   if(id){
     const index=sarees.findIndex(x=>x.id===id);
     if(index>=0)sarees[index]=saved;
   }else{
     sarees=[saved,...sarees];
   }
   saveLocal();
   render();
   await openSareeList(id?adminPage:1);
 }
}
async function toggleNewArrival(id){
 const item=sarees.find(x=>x.id===id);
 if(!item)return;
 const previous=Boolean(item.featured);
 item.featured=!previous;
 const saved=await saveCatalogItem(item,false);
 if(saved){
   Object.assign(item,saved);
   saveLocal();
   render();
   await openSareeList(adminPage);
 }else{
   item.featured=previous;
 }
}
async function deleteItem(id){
 if(!confirm("Delete this item?"))return;
 if(await deleteCatalogItem(id)){
   sarees=sarees.filter(s=>String(s.id)!==String(id));
   saveLocal();
   render();
   await openSareeList(Math.min(adminPage,Math.ceil(sarees.length/ADMIN_PAGE_SIZE)||1));
 }
}
function openSettings(){
const mobile=(settings.whatsapp||"").replace(/^91/,"").slice(-10);
document.getElementById("adminContent").innerHTML='<div class="settings-card"><div class="settings-heading"><span class="eyebrow">SETTINGS</span><h3>Store details</h3><p>Change your shop name or WhatsApp number.</p></div><div class="form settings-form"><label>Shop name<input id="setName" value="'+esc(settings.shopName)+'" placeholder="SRI SAI VANI"></label><label>WhatsApp number<span class="field-help">Customers will use this number when they tap WhatsApp.</span><div class="phone-field"><select id="setCountry" aria-label="Country code"><option value="91" selected>+91</option></select><input id="setWa" inputmode="numeric" maxlength="10" value="'+esc(mobile)+'" placeholder="9876543210" aria-label="WhatsApp phone number"></div><span class="field-help">Enter your 10-digit mobile number.</span></label><div class="settings-actions"><button class="btn secondary" type="button" onclick="openSettings()">Cancel</button><button class="btn dark" type="button" onclick="saveSettings()">Save Changes</button></div><div id="settingsStatus" class="settings-status" aria-live="polite"></div></div></div>'}
async function saveSettings(){
const name=document.getElementById("setName");
const wa=document.getElementById("setWa");
const country=document.getElementById("setCountry");
const status=document.getElementById("settingsStatus");
const phone=(wa?.value||"").replace(/\D/g,"");
const existing=String(settings.whatsapp||"").replace(/\D/g,"");
if(phone.length!==0 && phone.length!==10){
if(status){status.textContent="Enter a 10-digit WhatsApp number, or leave it blank.";status.className="settings-status error"}
wa?.focus();return
}
const whatsapp=phone.length===10?(country?.value||"91")+phone:"";
const enteredShopName=(name?.value||"").trim()||"SRI SAI VANI";
const normalizedShopName=enteredShopName.replace(/(?:\s+collections)+\s*$/i,"").trim()||"SRI SAI VANI";
settings={...settings,shopName:normalizedShopName,whatsapp,theme:settings.theme==="dark"?"dark":"light",about:settings.about||"",footer:""};
if(!saveLocal()){if(status){status.textContent="Could not save this change on this device.";status.className="settings-status error"};return}
render();
if(status){status.textContent="Saving changes...";status.className="settings-status"}
try{
const remote=await window.SriSaiApi.settings({method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(settings)});
if(remote&&typeof remote==="object"){settings={...settings,...remote};try{localStorage.setItem(SETTINGS,JSON.stringify(settings))}catch(e){};render()}
if(status){status.textContent="✓ Changes saved successfully.";status.className="settings-status success"}
}catch(e){
if(status){status.textContent="Could not save online. Please try again.";status.className="settings-status error"}
}
}
render();loadCatalog();syncSharedSettings();setupAnchorLinks();initMobileMenu();function showImage(src){const m=document.getElementById("imageModal"),img=document.getElementById("largeImage");if(!m||!img)return;img.src=src;m.classList.remove("hidden");document.body.style.overflow="hidden"}
function closeImageViewer(e){if(e&&e.target&&e.target.id==="largeImage")return;const m=document.getElementById("imageModal");if(m)m.classList.add("hidden");document.body.style.overflow=""}

function clearCatalogSearch(){const el=document.getElementById("search");if(el){el.value="";catalogPage=1;render();el.focus()}}
