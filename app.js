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
const DEMO_ITEMS=[
["Demo Banarasi Silk Saree","4999","Silk Sarees","Red & Gold"],["Demo Kanchipuram Silk Saree","6999","Silk Sarees","Royal Blue"],["Demo Cotton Saree","1999","Cotton Sarees","Sky Blue"],["Demo Linen Saree","2499","Linen Sarees","Peach"],["Demo Organza Saree","3299","Organza Sarees","Lavender"],["Demo Printed Saree","1799","Printed Sarees","Green"],["Demo Festive Saree","2899","Festive Sarees","Maroon"],["Demo Soft Silk Saree","3999","Silk Sarees","Wine"],["Demo Anarkali Dress","2999","Dresses","Pink"],["Demo Casual Dress","1799","Dresses","Green"],["Demo Party Dress","3499","Dresses","Black"],["Demo Floral Dress","2199","Dresses","Yellow"],["Demo Maxi Dress","2699","Dresses","Blue"],["Demo Embroidered Dress","3299","Dresses","Peach"],["Demo Straight Kurti","1299","Kurtis","Mustard"],["Demo Printed Kurti","1499","Kurtis","Teal"],["Demo Festive Kurti","1899","Kurtis","Wine"],["Demo Lehenga Set","5499","Lehengas","Pink"],["Demo Bridal Lehenga","8999","Lehengas","Red"],["Demo Palazzo Dress Set","2499","Dress Sets","Beige"]
];
const EXTRA_DEMO_ITEMS=DEMO_ITEMS.slice(4).map((x,i)=>({id:2001+i,name:x[0],price:x[1],category:x[2],color:x[3],description:"TEST ITEM - temporary product for catalogue testing.",image:"/images/demo-"+String(i+5).padStart(2,"0")+".svg",featured:i<6}));
let sarees=[
{id:1001,name:"Test Banarasi Saree",price:"4999",category:"Silk Sarees",color:"Red & Gold",description:"TEST ITEM - temporary product for website testing.",image:"/images/test-banarasi-saree.svg",featured:true},
{id:1002,name:"Test Cotton Saree",price:"1999",category:"Cotton Sarees",color:"Blue",description:"TEST ITEM - temporary product for website testing.",image:"/images/test-cotton-saree.svg",featured:false},
{id:1003,name:"Test Party Dress",price:"2999",category:"Dresses",color:"Pink",description:"TEST ITEM - temporary product for website testing.",image:"/images/test-party-dress.svg",featured:true},
{id:1004,name:"Test Casual Dress",price:"1799",category:"Dresses",color:"Green",description:"TEST ITEM - temporary product for website testing.",image:"/images/test-casual-dress.svg",featured:false},
...EXTRA_DEMO_ITEMS
]

let settings=(()=>{try{return JSON.parse(localStorage.getItem(SETTINGS)||"null")}catch(e){return null}})()||{shopName:"SRI SAI VANI",whatsapp:"",about:"Explore our collection and contact us on WhatsApp for product details and availability.",footer:""};
const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
function saveLocal(){try{localStorage.setItem(KEY,JSON.stringify(sarees));localStorage.setItem(SETTINGS,JSON.stringify(settings));return true}catch(e){console.error("Local storage error",e);return false}}
function whatsappNumber(){const raw=String(settings.whatsapp||"").replace(/\D/g,"");return raw.length===10?"91"+raw:(raw.startsWith("91")&&raw.length===12?raw:"")}
function whatsappLink(message){const phone=whatsappNumber();const text=encodeURIComponent(message);return phone?"https://wa.me/"+phone+"?text="+text:"https://wa.me/?text="+text}
function wa(s){return whatsappLink("Hi, I'm interested in "+s.name+" - ₹"+s.price+". Is it available?")}
function card(s){return '<article class="product-card"><div class="product-image" onclick="showImage(this.querySelector(\'img\').src)" role="button" tabindex="0" aria-label="View product image">'+(s.featured?'<span class="badge">New arrival</span>':'')+'<img src="'+esc(s.image)+'" alt="'+esc(s.name)+'" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0" onerror="this.style.display=\'none\'"></div><div class="product-body"><h3>'+esc(s.name)+'</h3><div class="subline">'+esc(s.category)+' · '+esc(s.color)+'</div><div class="price-row"><span class="price">₹'+Number(s.price).toLocaleString("en-IN")+'</span><a class="small-wa whatsapp-mini" target="_blank" href="'+wa(s)+'" aria-label="Enquire on WhatsApp" title="Enquire on WhatsApp"><svg class="wa-logo-correct" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#fff" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg></a></div></div></article>'}
async function syncSharedSettings(){
try{
const r=await fetch("/.netlify/functions/settings",{cache:"no-store"});
if(r.ok){
const remote=await r.json();
if(remote && Object.keys(remote).length){
settings={...settings,...remote};
try{localStorage.setItem(SETTINGS,JSON.stringify(settings))}catch(e){}
}
}
}catch(e){console.warn("Shared settings unavailable; using local settings.",e)}
render();
}
let catalogPage=1;
function catalogPageSize(){return window.innerWidth<=600?10:24}
function render(){
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
 if(grid) grid.innerHTML=pageItems.map(card).join("");
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
 const shopName=settings.shopName||"SRI SAI VANI";
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
 try{const r=await fetch("/.netlify/functions/admin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:p.value})});const d=await r.json();if(!r.ok)throw new Error(d.error||"Could not sign in");p.value="";document.getElementById("loginBox").classList.add("hidden");document.getElementById("adminBox").classList.remove("hidden");await loadCatalog();openSareeList()}catch(e){p.value="";p.focus();if(status)status.textContent=e.message}}
async function apiCatalog(method="GET",body=null){const opt={method,headers:{}};if(body){opt.headers["Content-Type"]="application/json";opt.body=JSON.stringify(body)}const r=await fetch("/.netlify/functions/catalog",opt);if(!r.ok)throw new Error("Could not save catalogue");return r.json()}
async function saveCatalog(){
 try{
  const data=await apiCatalog("PUT",sarees);
  if(!Array.isArray(data))throw new Error("Invalid catalogue response");
  sarees=data; saveLocal(); return true;
 }catch(e){
  console.error("Catalogue save failed",e);
  alert(e.message||"Could not save catalogue. Please try again.");
  return false;
 }
}
async function loadCatalog(){
try{
const remote=await apiCatalog();
if(Array.isArray(remote)){
  const existingIds=new Set(remote.map(x=>Number(x.id)));
  const extras=EXTRA_DEMO_ITEMS.filter(x=>!existingIds.has(Number(x.id))).slice(0,Math.max(0,20-remote.length));
  // Keep the temporary 20-item test catalogue available until real products replace it.
  sarees=[...remote,...extras];
  saveLocal();
  if(extras.length){
    try{
      const seeded=await apiCatalog("PUT",sarees);
      if(Array.isArray(seeded) && seeded.length>=sarees.length){
        sarees=seeded;
        saveLocal();
      }
    }catch(e){
      console.warn("Demo catalogue seed could not be persisted; showing the full test catalogue locally.",e);
    }
  }
  render();return true
}
}catch(e){console.warn("Cloud catalogue unavailable",e)}
saveLocal();render();return false
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
 el.innerHTML='<div class="admin-list">'+items.map(s=>'<div class="admin-item"><img src="'+esc(s.image)+'"><div class="grow"><b>'+esc(s.name)+'</b><br>₹'+Number(s.price).toLocaleString("en-IN")+' · '+esc(s.category)+'</div><button onclick="openSareeForm('+s.id+')">Edit</button><button class="danger" onclick="deleteItem('+s.id+')">Delete</button></div>').join("")+'</div><div class="admin-pagination"><button class="btn" '+(adminPage===1?'disabled':'')+' onclick="openSareeList('+(adminPage-1)+')">Previous</button><span>Page '+adminPage+' of '+totalPages+' · '+sarees.length+' items</span><button class="btn" '+(adminPage===totalPages?'disabled':'')+' onclick="openSareeList('+(adminPage+1)+')">Next</button></div>';
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
 if(id){
  const existing=sarees.find(x=>x.id===id);
  if(!existing)return alert("This item could not be found. Please refresh and try again.");
  Object.assign(existing,d);
 }else sarees.unshift({id:Date.now(),...d});
 if(await saveCatalog()){render();await openSareeList()}
}
async function deleteItem(id){if(confirm("Delete this item?")){const previous=[...sarees];sarees=sarees.filter(s=>s.id!==id);if(await saveCatalog()){render();await openSareeList()}else{sarees=previous}}}
function openSettings(){
const mobile=(settings.whatsapp||"").replace(/^91/,"").slice(-10);
document.getElementById("adminContent").innerHTML='<div class="settings-card"><div class="settings-heading"><span class="eyebrow">SETTINGS</span><h3>Store details</h3><p>Change your shop name or WhatsApp number. You can save either one independently.</p></div><div class="form settings-form"><label>Shop name<input id="setName" value="'+esc(settings.shopName)+'" placeholder="SRI SAI VANI"></label><label>WhatsApp number<span class="field-help">Customers will use this number when they tap WhatsApp.</span><div class="phone-field"><select id="setCountry" aria-label="Country code"><option value="91" selected>+91</option></select><input id="setWa" inputmode="numeric" maxlength="10" value="'+esc(mobile)+'" placeholder="9876543210" aria-label="WhatsApp phone number"></div><span class="field-help">Enter your 10-digit mobile number.</span></label><div class="settings-actions"><button class="btn secondary" type="button" onclick="openSettings()">Cancel</button><button class="btn dark" type="button" onclick="saveSettings()">Save Changes</button></div><div id="settingsStatus" class="settings-status" aria-live="polite"></div></div></div>'}
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
settings={...settings,shopName:(name?.value||"").trim()||"SRI SAI VANI",whatsapp,about:settings.about||"",footer:""};
if(!saveLocal()){if(status){status.textContent="Could not save this change on this device.";status.className="settings-status error"};return}
render();
if(status){status.textContent="Saving changes...";status.className="settings-status"}
try{
const r=await fetch("/.netlify/functions/settings",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(settings)});
if(!r.ok)throw new Error("Shared settings unavailable");
const remote=await r.json();
if(remote&&typeof remote==="object"){settings={...settings,...remote};try{localStorage.setItem(SETTINGS,JSON.stringify(settings))}catch(e){};render()}
if(status){status.textContent="✓ Changes saved successfully.";status.className="settings-status success"}
}catch(e){
if(status){status.textContent="Could not save online. Please try again.";status.className="settings-status error"}
}
}
render();loadCatalog();syncSharedSettings();setupAnchorLinks();initMobileMenu();function showImage(src){const m=document.getElementById("imageModal"),img=document.getElementById("largeImage");if(!m||!img)return;img.src=src;m.classList.remove("hidden");document.body.style.overflow="hidden"}
function closeImageViewer(e){if(e&&e.target&&e.target.id==="largeImage")return;const m=document.getElementById("imageModal");if(m)m.classList.add("hidden");document.body.style.overflow=""}

function clearCatalogSearch(){const el=document.getElementById("search");if(el){el.value="";catalogPage=1;render();el.focus()}}
