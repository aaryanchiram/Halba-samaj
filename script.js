/* Paste your deployed Google Apps Script Web App /exec URL here. */
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwYC5JEZKwnRGv6xFydZANi5PO54V-T89DU6yHSVZPzzlDD511ZcWIVlxH9T_SNnAjA/exec";
const form = document.getElementById("registrationForm");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");
const mahasabha = document.getElementById("mahasabha");
const otherWrap = document.getElementById("otherMahasabhaWrap");
const otherInput = document.getElementById("otherMahasabha");
let pendingPayload = null;
let currentRequestId = "";

// छत्तीसगढ़: जिला → विकासखंड cascading dropdown
const CG_DISTRICT_BLOCKS = {
  "बालोद": ["बालोद", "डौंडी", "डौंडी-लोहारा", "गुंडरदेही", "गुरूर"],
  "बलौदाबाजार-भाटापारा": ["बलौदाबाजार", "भाटापारा", "कसडोल", "पलारी", "सिमगा"],
  "बलरामपुर-रामानुजगंज": ["बलरामपुर", "कुसमी", "राजपुर", "रामचन्द्रपुर", "शंकरगढ़", "वाड्रफनगर"],
  "बस्तर": ["जगदलपुर", "बस्तर", "बकावंड", "बस्तानार", "दरभा", "लोहंडीगुड़ा", "तोकापाल"],
  "बेमेतरा": ["बेमेतरा", "साजा", "बेरला", "नवागढ़"],
  "बीजापुर": ["बीजापुर", "भैरमगढ़", "भोपालपटनम", "उसूर"],
  "बिलासपुर": ["बिल्हा", "कोटा", "मस्तूरी", "तखतपुर"],
  "दक्षिण बस्तर दंतेवाड़ा": ["दंतेवाड़ा", "गीदम", "कटेकल्याण", "कुआकोंडा"],
  "धमतरी": ["धमतरी", "कुरूद", "मगरलोड", "नगरी"],
  "दुर्ग": ["दुर्ग", "धमधा", "पाटन"],
  "गरियाबंद": ["गरियाबंद", "फिंगेश्वर", "छुरा", "देवभोग", "मैनपुर"],
  "गौरेला-पेंड्रा-मरवाही": ["पेंड्रा रोड", "पेंड्रा", "मरवाही"],
  "जांजगीर-चांपा": ["अकलतरा", "बलौदा", "बम्हनीडीह", "नवागढ़", "पामगढ़"],
  "कांकेर": ["अंतागढ़", "भानुप्रतापपुर", "चारामा", "दुर्गूकोंदल", "कांकेर", "कोयलीबेड़ा", "नरहरपुर"],
  "जशपुर": ["जशपुर", "कुनकुरी", "पत्थलगांव", "बगीचा", "दुलदुला", "मनोरा", "कांसाबेल", "फरसाबहार"],
  "कबीरधाम": ["कवर्धा", "बोड़ला", "सहसपुर लोहारा", "पंडरिया"],
  "खैरागढ़-छुईखदान-गंडई": ["खैरागढ़", "छुईखदान"],
  "कोंडागांव": ["कोंडागांव", "केशकाल", "बड़ेराजपुर", "माकड़ी", "फरसगांव"],
  "कोरबा": ["कोरबा", "कटघोरा", "पाली", "करतला", "पोड़ी-उपरोड़ा"],
  "कोरिया": ["बैकुंठपुर", "सोनहत"],
  "महासमुंद": ["महासमुंद", "बसना", "बागबाहरा", "पिथौरा", "सरायपाली"],
  "मनेन्द्रगढ़-चिरमिरी-भरतपुर": ["भरतपुर", "मनेन्द्रगढ़"],
  "मोहला-मानपुर-अंबागढ़ चौकी": ["अंबागढ़ चौकी", "मानपुर", "मोहला"],
  "मुंगेली": ["मुंगेली", "पथरिया", "लोरमी"],
  "नारायणपुर": ["नारायणपुर", "ओरछा (अबूझमाड़)"],
  "रायगढ़": ["रायगढ़", "पुसौर", "खरसिया", "घरघोड़ा", "तमनार", "धरमजयगढ़", "लैलूंगा"],
  "रायपुर": ["आरंग", "अभनपुर", "धरसींवा", "तिल्दा"],
  "राजनांदगांव": ["राजनांदगांव", "डोंगरगढ़", "डोंगरगांव", "छुरिया"],
  "सक्ती": ["सक्ती", "जैजैपुर", "मालखरौदा", "डभरा"],
  "सारंगढ़-बिलाईगढ़": ["सारंगढ़", "बरमकेला", "बिलाईगढ़"],
  "सुकमा": ["सुकमा", "छिंदगढ़", "कोंटा"],
  "सूरजपुर": ["सूरजपुर", "प्रेमनगर", "भैयाथान", "ओड़गी", "प्रतापपुर", "रामानुजनगर"],
  "सरगुजा": ["अंबिकापुर", "लखनपुर", "उदयपुर", "लुंड्रा", "बतौली", "सीतापुर", "मैनपाट"]
};

const districtSelect = document.getElementById("district");
const blockSelect = document.getElementById("block");

function initDistrictBlockDropdowns() {
  if (!districtSelect || !blockSelect) return;
  Object.keys(CG_DISTRICT_BLOCKS).forEach((district, i) => {
    const option = document.createElement("option");
    option.value = district;
    option.textContent = `${i + 1}. ${district}`;
    districtSelect.appendChild(option);
  });
  districtSelect.addEventListener("change", updateBlocks);
}

function updateBlocks() {
  const district = districtSelect.value;
  blockSelect.innerHTML = "";
  if (!district) {
    blockSelect.disabled = true;
    blockSelect.innerHTML = '<option value="">-- पहले जिला चुनें --</option>';
    return;
  }
  const first = document.createElement("option");
  first.value = "";
  first.textContent = "-- ब्लॉक / विकासखंड चुनें --";
  blockSelect.appendChild(first);
  CG_DISTRICT_BLOCKS[district].forEach((block, i) => {
    const option = document.createElement("option");
    option.value = block;
    option.textContent = `${i + 1}. ${block}`;
    blockSelect.appendChild(option);
  });
  blockSelect.disabled = false;
}

initDistrictBlockDropdowns();


mahasabha.addEventListener("change", () => {
  const isOther = mahasabha.value === "अन्य";
  otherWrap.classList.toggle("hidden", !isOther);
  otherInput.required = isOther;
  if (!isOther) otherInput.value = "";
});

window.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.source !== "halba-balod-registration" || data.requestId !== currentRequestId) return;
  submitBtn.disabled = false;
  submitBtn.innerHTML = "<span>पंजीयन सबमिट करें</span><b>→</b>";

  if (data.status === "duplicate") {
    if (data.canPrint && data.record) {
      showMessage("<strong>यह पंजीयन पहले से मौजूद है। नया फॉर्म जमा नहीं होगा।</strong><p>पुराने पंजीयन की प्रति प्रिंट करने के लिए नीचे बटन दबाएँ।</p><button type=\"button\" id=\"printExistingBtn\" class=\"print-btn\">पुराना पंजीयन प्रिंट करें</button>", "info", true);
      document.getElementById("printExistingBtn").onclick = () => printExistingRecord(data.record);
    } else {
      showMessage("<strong>यह ईमेल या मोबाइल नंबर पहले से पंजीकृत है।</strong><p>सुरक्षा के लिए पुराने रिकॉर्ड की प्रति तभी दिखाई जाएगी जब ईमेल और मोबाइल दोनों पुराने रिकॉर्ड से मेल खाते हों। नया पंजीयन स्वीकार नहीं होगा।</p>", "error", true);
    }
    return;
  }
  if (data.status === "success") {
    showMessage("पंजीयन सफलतापूर्वक सेव हो गया। आपका डेटा Google Sheet में दर्ज कर दिया गया है।", "success");
    form.reset(); otherWrap.classList.add("hidden"); otherInput.required = false;
    window.scrollTo({top:0, behavior:"smooth"});
  } else {
    showMessage(data.message || "डेटा सेव नहीं हो सका। कृपया पुनः प्रयास करें।", "error");
  }
});

function showMessage(html, type, raw=false) { message.className = "message show " + type; message.innerHTML = html; }
function clearMessage() { message.className = "message"; message.innerHTML = ""; }
function cleanMobile(v) { return String(v || "").replace(/\D/g, ""); }
function getPayload() {
  const payload = Object.fromEntries(new FormData(form).entries());
  payload.action = "submit";
  payload.mobile = cleanMobile(payload.mobile);
  payload.requestId = makeRequestId();
  return payload;
}
function makeRequestId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }
function validateLocal(payload) {
  if (APPS_SCRIPT_URL.includes("PASTE_YOUR_")) { showMessage("पहले script.js में Google Apps Script Web App URL डालें।", "error"); return false; }
  if (!/^[6-9]\d{9}$/.test(payload.mobile)) { showMessage("कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।", "error"); return false; }
  if (payload.mahasabha === "अन्य" && !payload.otherMahasabha.trim()) { showMessage("कृपया अन्य महासभा का नाम लिखें।", "error"); otherInput.focus(); return false; }
  return true;
}
function submitData() { if (!pendingPayload) pendingPayload = getPayload(); sendToAppsScript(pendingPayload); }
function sendToAppsScript(payload) {
  submitBtn.disabled = true; submitBtn.innerHTML = "<span>जाँच/सेव हो रहा है…</span><b>…</b>"; clearMessage();
  currentRequestId = payload.requestId;
  const tempForm = document.createElement("form"); tempForm.method = "POST"; tempForm.action = APPS_SCRIPT_URL; tempForm.target = "appsScriptFrame"; tempForm.style.display = "none";
  Object.entries(payload).forEach(([key, value]) => { const input = document.createElement("input"); input.type = "hidden"; input.name = key; input.value = value ?? ""; tempForm.appendChild(input); });
  document.body.appendChild(tempForm); tempForm.submit(); tempForm.remove();
}
form.addEventListener("submit", (e) => {
  e.preventDefault(); pendingPayload = getPayload();
  if (!validateLocal(pendingPayload)) return;
  submitData();
});

function esc(value) { return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function printExistingRecord(r) {
  const fields = [
    ["महासभा", "महासभा"], ["अन्य महासभा", "अन्य महासभा"], ["प्रतिभागी का नाम", "प्रतिभागी का नाम"],
    ["गोत्र", "गोत्र"], ["टोटम", "टोटम"], ["पिता का नाम", "पिता का नाम"], ["जन्मतिथि", "जन्मतिथि"],
    ["ईमेल", "ईमेल"], ["कॉन्टेक्ट नम्बर", "मोबाइल"], ["लिंग", "लिंग"], ["जिला", "जिला"],
    ["ब्लॉक", "ब्लॉक / विकासखंड"], ["गाँव", "गाँव / नगर"], ["पूरा पता", "पूरा पता"]
  ];
  const rows = fields.map(([key, label]) => `<tr><th>${esc(label)}</th><td>${esc(r[key] || "—")}</td></tr>`).join("");
  const logoUrl = new URL("assets/logo.webp", window.location.href).href;
  const win = window.open("", "_blank", "width=800,height=900");
  if (!win) { showMessage("प्रिंट विंडो नहीं खुली। कृपया ब्राउज़र में पॉप-अप की अनुमति दें।", "error"); return; }
  win.document.write(`<!doctype html><html lang="hi"><head><meta charset="utf-8"><title>पंजीयन प्रति</title><style>body{font-family:Arial,'Noto Sans Devanagari',sans-serif;padding:28px;color:#163b39}header{text-align:center;border-bottom:2px solid #0d6f6c;padding-bottom:12px}header img{width:85px;height:85px;object-fit:contain}h1{font-size:22px;margin:8px 0}p{text-align:center}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #bbb;padding:9px;text-align:left;vertical-align:top}th{width:34%;background:#f0f7f6}@media print{.noprint{display:none}body{padding:0}}</style></head><body><header><img src="${logoUrl}"><h1>अखिल भारतीय आदिवासी हलबा हलबी समाज</h1><h2>बालोद महासभा</h2><p>पुराने पंजीयन की प्रिंट प्रति</p></header><table>${rows}</table><p class="noprint"><button onclick="window.print()">प्रिंट करें</button></p><script>window.onload=()=>setTimeout(()=>window.print(),300);<\/script></body></html>`);
  win.document.close();
}
