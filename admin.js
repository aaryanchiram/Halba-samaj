/* Use the same deployed Apps Script /exec URL as script.js. */
const APPS_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const loginPanel = document.getElementById("loginPanel");
const dashboardPanel = document.getElementById("dashboardPanel");
const adminMessage = document.getElementById("adminMessage");
const recordsBody = document.getElementById("recordsBody");
const districtFilter = document.getElementById("districtFilter");
const blockFilter = document.getElementById("blockFilter");
const villageFilter = document.getElementById("villageFilter");
const genderFilter = document.getElementById("genderFilter");
const searchFilter = document.getElementById("searchFilter");
let token = sessionStorage.getItem("halbaAdminToken") || "";
let records = [];
let activeRequestId = "";

function request(action, values={}) {
  if (APPS_SCRIPT_URL.includes("PASTE_YOUR_")) { showMessage("पहले admin.js और script.js में Apps Script Web App URL डालें।", "error"); return; }
  activeRequestId = Date.now().toString(36) + Math.random().toString(36).slice(2);
  const payload = {...values, action, requestId:activeRequestId};
  const f = document.createElement("form"); f.method="POST"; f.action=APPS_SCRIPT_URL; f.target="adminAppsScriptFrame"; f.style.display="none";
  Object.entries(payload).forEach(([k,v])=>{const i=document.createElement("input");i.type="hidden";i.name=k;i.value=v??"";f.appendChild(i);});
  document.body.appendChild(f); f.submit(); f.remove();
}
window.addEventListener("message", e => {
  const d=e.data;
  if(!d || d.source!=="halba-balod-registration" || d.requestId!==activeRequestId) return;
  if(d.status==="loginSuccess") {
    token=d.token; sessionStorage.setItem("halbaAdminToken",token); loginForm.reset();
    loginPanel.classList.add("hidden"); dashboardPanel.classList.remove("hidden"); showMessage("लॉगिन सफल।", "success"); loadData();
  } else if(d.status==="adminData") {
    records=Array.isArray(d.records)?d.records:[]; populateFilters(); renderDashboard();
    document.getElementById("lastUpdated").textContent="अंतिम अपडेट: "+new Date().toLocaleString("hi-IN");
  } else if(d.status==="logoutSuccess") {
    token="";sessionStorage.removeItem("halbaAdminToken");records=[];dashboardPanel.classList.add("hidden");loginPanel.classList.remove("hidden");showMessage("लॉगआउट हो गया।","success");
  } else if(d.status==="unauthorized") {
    token="";sessionStorage.removeItem("halbaAdminToken");dashboardPanel.classList.add("hidden");loginPanel.classList.remove("hidden");showMessage(d.message||"फिर से लॉगिन करें।","error");
  } else if(d.status==="error") { showMessage(d.message||"अनुरोध पूरा नहीं हुआ।","error"); }
  loginBtn.disabled=false;loginBtn.innerHTML="<span>लॉगिन करें</span><b>→</b>";
});
function showMessage(text,type){adminMessage.textContent=text;adminMessage.className="message show "+type;}
loginForm.addEventListener("submit",e=>{e.preventDefault();if(APPS_SCRIPT_URL.includes("PASTE_YOUR_")){showMessage("Apps Script URL सेट करें।","error");return;}const fd=new FormData(loginForm);loginBtn.disabled=true;loginBtn.textContent="लॉगिन हो रहा है…";request("adminLogin",{username:fd.get("username"),password:fd.get("password")});});
function loadData(){if(token)request("adminData",{token});}
document.getElementById("refreshBtn").addEventListener("click",loadData);
document.getElementById("logoutBtn").addEventListener("click",()=>{if(token)request("adminLogout",{token});else{sessionStorage.removeItem("halbaAdminToken");dashboardPanel.classList.add("hidden");loginPanel.classList.remove("hidden");}});
[districtFilter,blockFilter,villageFilter,genderFilter].forEach(el=>el.addEventListener("change",renderDashboard));searchFilter.addEventListener("input",renderDashboard);
function uniq(values){return [...new Set(values.map(v=>String(v||"").trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"hi"));}
function fillSelect(el,values,defaultText){const old=el.value;el.innerHTML="";const o=document.createElement("option");o.value="";o.textContent=defaultText;el.appendChild(o);values.forEach(v=>{const op=document.createElement("option");op.value=v;op.textContent=v;el.appendChild(op);});if(values.includes(old))el.value=old;}
function populateFilters(){fillSelect(districtFilter,uniq(records.map(r=>r["जिला"])),"सभी जिले");fillSelect(blockFilter,uniq(records.map(r=>r["ब्लॉक"])),"सभी ब्लॉक");fillSelect(villageFilter,uniq(records.map(r=>r["गाँव"])),"सभी गाँव");}
function filteredRecords(){const d=districtFilter.value,b=blockFilter.value,v=villageFilter.value,g=genderFilter.value,q=searchFilter.value.trim().toLowerCase();return records.filter(r=>(!d||r["जिला"]===d)&&(!b||r["ब्लॉक"]===b)&&(!v||r["गाँव"]===v)&&(!g||r["लिंग"]===g)&&(!q||[r["प्रतिभागी का नाम"],r["ईमेल"],r["कॉन्टेक्ट नम्बर"],r["पिता का नाम"]].some(x=>String(x||"").toLowerCase().includes(q))));}
function renderDashboard(){const list=filteredRecords();document.getElementById("totalCount").textContent=records.length;document.getElementById("maleCount").textContent=records.filter(r=>r["लिंग"]==="पुरुष").length;document.getElementById("femaleCount").textContent=records.filter(r=>r["लिंग"]==="महिला").length;document.getElementById("otherCount").textContent=records.filter(r=>!["पुरुष","महिला"].includes(r["लिंग"])).length;document.getElementById("visibleCount").textContent=list.length;renderTable(list);renderSummary("districtSummary",list,"जिला");renderSummary("blockSummary",list,"ब्लॉक");renderSummary("villageSummary",list,"गाँव");}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderTable(list){if(!list.length){recordsBody.innerHTML='<tr><td colspan="9" class="empty-row">कोई रिकॉर्ड नहीं मिला।</td></tr>';return;}recordsBody.innerHTML=list.slice().reverse().map((r,i)=>`<tr><td>${i+1}</td><td>${esc(r["प्रतिभागी का नाम"])}</td><td>${esc(r["लिंग"])}</td><td>${esc(r["जिला"])}</td><td>${esc(r["ब्लॉक"])}</td><td>${esc(r["गाँव"])}</td><td>${esc(r["कॉन्टेक्ट नम्बर"])}</td><td>${esc(r["ईमेल"])}</td><td><button type="button" class="print-row-btn" data-index="${records.indexOf(r)}">प्रिंट</button></td></tr>`).join("");recordsBody.querySelectorAll("button[data-index]").forEach(btn=>btn.addEventListener("click",()=>printRecord(records[Number(btn.dataset.index)])));}
function renderSummary(id,list,key){const counts={};list.forEach(r=>{const value=String(r[key]||"(जानकारी नहीं)");counts[value]=(counts[value]||0)+1;});const items=Object.entries(counts).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],"hi"));document.getElementById(id).innerHTML=items.length?'<div class="summary-list">'+items.map(([name,count])=>`<div class="summary-row"><span>${esc(name)}</span><strong>${count}</strong></div>`).join("")+'</div>':'<p class="privacy-note">कोई रिकॉर्ड नहीं</p>';}
function printRecord(r){if(!r)return;const keys=[["महासभा","महासभा"],["प्रतिभागी का नाम","प्रतिभागी का नाम"],["गोत्र","गोत्र"],["टोटम","टोटम"],["पिता का नाम","पिता का नाम"],["जन्मतिथि","जन्मतिथि"],["ईमेल","ईमेल"],["कॉन्टेक्ट नम्बर","मोबाइल"],["लिंग","लिंग"],["जिला","जिला"],["ब्लॉक","ब्लॉक"],["गाँव","गाँव"],["पूरा पता","पूरा पता"],["Timestamp","पंजीयन समय"]];const rows=keys.map(([k,l])=>`<tr><th>${esc(l)}</th><td>${esc(r[k]||"—")}</td></tr>`).join("");printHtml("पंजीयन प्रति",rows);}
function printHtml(title,rows){const logoUrl=new URL("assets/logo.webp",window.location.href).href;const w=window.open("","_blank","width=900,height=900");if(!w){showMessage("प्रिंट विंडो नहीं खुली। पॉप-अप की अनुमति दें।","error");return;}w.document.write(`<!doctype html><html lang="hi"><head><meta charset="utf-8"><title>${esc(title)}</title><style>body{font-family:Arial,'Noto Sans Devanagari',sans-serif;padding:28px;color:#163b39}header{text-align:center;border-bottom:2px solid #0d6f6c;padding-bottom:12px}header img{width:80px;height:80px;object-fit:contain}h1{font-size:22px;margin:8px 0}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #bbb;padding:9px;text-align:left;vertical-align:top}th{width:34%;background:#f0f7f6}@media print{.noprint{display:none}body{padding:0}}</style></head><body><header><img src="${logoUrl}"><h1>अखिल भारतीय आदिवासी हलबा हलबी समाज</h1><h2>बालोद महासभा</h2><p>${esc(title)}</p></header><table>${rows}</table><p class="noprint"><button onclick="window.print()">प्रिंट करें</button></p><script>window.onload=()=>setTimeout(()=>window.print(),300);<\/script></body></html>`);w.document.close();}
document.getElementById("printListBtn").addEventListener("click",()=>{const list=filteredRecords();const rows='<tr><th>क्रम</th><th>नाम</th><th>लिंग</th><th>जिला</th><th>ब्लॉक</th><th>गाँव</th><th>मोबाइल</th><th>ईमेल</th></tr>'+list.map((r,i)=>`<tr><td>${i+1}</td><td>${esc(r["प्रतिभागी का नाम"])}</td><td>${esc(r["लिंग"])}</td><td>${esc(r["जिला"])}</td><td>${esc(r["ब्लॉक"])}</td><td>${esc(r["गाँव"])}</td><td>${esc(r["कॉन्टेक्ट नम्बर"])}</td><td>${esc(r["ईमेल"])}</td></tr>`).join("");printHtml("पंजीयन सूची",rows);});
if(token){loginPanel.classList.add("hidden");dashboardPanel.classList.remove("hidden");loadData();}
