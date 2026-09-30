// ============================================================
// HALBA SAMAJ REGISTRATION - FIREBASE VERSION
// Google Apps Script की जरूरत नहीं
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getFirestore,
  doc,
  runTransaction,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// ============================================================
// FIREBASE CONFIG
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyDrAvxLdDT9TUabC9B3p7SsJDTp5XfVuEU",
  authDomain: "halba-register-b23bb.firebaseapp.com",
  projectId: "halba-register-b23bb",
  storageBucket: "halba-register-b23bb.firebasestorage.app",
  messagingSenderId: "514620312693",
  appId: "1:514620312693:web:5259d7df657e96911b3c3c",
  measurementId: "G-162MZWB8RB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ============================================================
// HTML ELEMENTS
// ============================================================

const form = document.getElementById("registrationForm");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");

const mahasabha = document.getElementById("mahasabha");
const otherWrap = document.getElementById("otherMahasabhaWrap");
const otherInput = document.getElementById("otherMahasabha");

const districtSelect = document.getElementById("district");
const blockSelect = document.getElementById("block");


// ============================================================
// CHHATTISGARH DISTRICT → BLOCK
// ============================================================

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


// ============================================================
// DISTRICT DROPDOWN
// ============================================================

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


// ============================================================
// BLOCK DROPDOWN
// ============================================================

function updateBlocks() {

  const district = districtSelect.value;

  blockSelect.innerHTML = "";

  if (!district) {

    blockSelect.disabled = true;

    blockSelect.innerHTML =
      '<option value="">-- पहले जिला चुनें --</option>';

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


// ============================================================
// OTHER MAHASABHA
// ============================================================

mahasabha.addEventListener("change", () => {

  const isOther = mahasabha.value === "अन्य";

  otherWrap.classList.toggle("hidden", !isOther);

  otherInput.required = isOther;

  if (!isOther) {
    otherInput.value = "";
  }

});


// ============================================================
// MESSAGE
// ============================================================

function showMessage(html, type) {

  message.className = "message show " + type;

  message.innerHTML = html;

}

function clearMessage() {

  message.className = "message";

  message.innerHTML = "";

}


// ============================================================
// MOBILE CLEAN
// ============================================================

function cleanMobile(value) {

  return String(value || "").replace(/\D/g, "");

}


// ============================================================
// FORM PAYLOAD
// ============================================================

function getPayload() {

  const payload =
    Object.fromEntries(new FormData(form).entries());

  payload.mobile = cleanMobile(payload.mobile);

  return payload;

}


// ============================================================
// LOCAL VALIDATION
// ============================================================

function validateLocal(payload) {

  if (!/^[6-9]\d{9}$/.test(payload.mobile)) {

    showMessage(
      "❌ कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।",
      "error"
    );

    document.getElementById("mobile").focus();

    return false;
  }


  if (
    payload.mahasabha === "अन्य" &&
    !String(payload.otherMahasabha || "").trim()
  ) {

    showMessage(
      "❌ कृपया अन्य महासभा का नाम लिखें।",
      "error"
    );

    otherInput.focus();

    return false;
  }


  if (!payload.email || !payload.email.includes("@")) {

    showMessage(
      "❌ कृपया सही ईमेल दर्ज करें।",
      "error"
    );

    return false;
  }


  return true;
}


// ============================================================
// SHA-256 HASH
// Duplicate key बनाने के लिए
// ============================================================

async function sha256(value) {

  const encoder = new TextEncoder();

  const data =
    encoder.encode(String(value).trim().toLowerCase());

  const hashBuffer =
    await crypto.subtle.digest("SHA-256", data);

  const hashArray =
    Array.from(new Uint8Array(hashBuffer));

  return hashArray
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

}


// ============================================================
// FIRESTORE REGISTRATION
// ============================================================

async function saveRegistration(payload) {

  const mobileKey =
    await sha256("mobile:" + payload.mobile);

  const emailKey =
    await sha256("email:" + payload.email);


  const registrationRef =
    doc(db, "registrations", mobileKey);

  const mobileKeyRef =
    doc(db, "registration_keys", mobileKey);

  const emailKeyRef =
    doc(db, "registration_keys", emailKey);


  await runTransaction(db, async (transaction) => {

    // --------------------------------------------
    // DUPLICATE MOBILE CHECK
    // --------------------------------------------

    const mobileKeyDoc =
      await transaction.get(mobileKeyRef);

    if (mobileKeyDoc.exists()) {

      throw new Error(
        "DUPLICATE_MOBILE"
      );

    }


    // --------------------------------------------
    // DUPLICATE EMAIL CHECK
    // --------------------------------------------

    const emailKeyDoc =
      await transaction.get(emailKeyRef);

    if (emailKeyDoc.exists()) {

      throw new Error(
        "DUPLICATE_EMAIL"
      );

    }


    // --------------------------------------------
    // REGISTRATION DATA
    // --------------------------------------------

    const registrationData = {

      mahasabha:
        payload.mahasabha || "",

      otherMahasabha:
        payload.otherMahasabha || "",

      participantName:
        payload.participantName || "",

      gotra:
        payload.gotra || "",

      totem:
        payload.totem || "",

      fatherName:
        payload.fatherName || "",

      dob:
        payload.dob || "",

      gender:
        payload.gender || "",

      email:
        String(payload.email || "").trim().toLowerCase(),

      mobile:
        payload.mobile || "",

      district:
        payload.district || "",

      block:
        payload.block || "",

      village:
        payload.village || "",

      address:
        payload.address || "",

      termsAccepted:
        payload.termsAccepted || "",

      informationConfirmed:
        payload.informationConfirmed || "",

      status:
        "pending",

      createdAt:
        serverTimestamp()

    };


    // --------------------------------------------
    // SAVE REGISTRATION
    // --------------------------------------------

    transaction.set(
      registrationRef,
      registrationData
    );


    // --------------------------------------------
    // MOBILE UNIQUE KEY
    // --------------------------------------------

    transaction.set(
      mobileKeyRef,
      {
        type: "mobile",
        createdAt: serverTimestamp()
      }
    );


    // --------------------------------------------
    // EMAIL UNIQUE KEY
    // --------------------------------------------

    transaction.set(
      emailKeyRef,
      {
        type: "email",
        createdAt: serverTimestamp()
      }
    );

  });

}


// ============================================================
// SUBMIT
// ============================================================

form.addEventListener("submit", async (event) => {

  event.preventDefault();

  clearMessage();


  // Browser required validation

  if (!form.checkValidity()) {

    form.reportValidity();

    return;
  }


  const payload = getPayload();


  // Local validation

  if (!validateLocal(payload)) {

    return;
  }


  // Button loading

  submitBtn.disabled = true;

  submitBtn.innerHTML =
    "<span>सेव हो रहा है...</span><b>…</b>";


  try {

    await saveRegistration(payload);


    // --------------------------------------------
    // SUCCESS
    // --------------------------------------------

    showMessage(
      "✅ <strong>पंजीयन सफलतापूर्वक सबमिट हो गया।</strong><p>आपका पंजीयन Firebase में सुरक्षित रूप से दर्ज हो गया है।</p>",
      "success"
    );


    form.reset();

    otherWrap.classList.add("hidden");

    otherInput.required = false;

    blockSelect.innerHTML =
      '<option value="">-- पहले जिला चुनें --</option>';

    blockSelect.disabled = true;


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });


  } catch (error) {

    console.error(
      "Firebase Registration Error:",
      error
    );


    // --------------------------------------------
    // DUPLICATE MOBILE
    // --------------------------------------------

    if (error.message === "DUPLICATE_MOBILE") {

      showMessage(
        "<strong>⚠️ यह मोबाइल नंबर पहले से पंजीकृत है।</strong><p>इस मोबाइल नंबर से नया पंजीयन स्वीकार नहीं किया जाएगा।</p>",
        "error"
      );

      return;
    }


    // --------------------------------------------
    // DUPLICATE EMAIL
    // --------------------------------------------

    if (error.message === "DUPLICATE_EMAIL") {

      showMessage(
        "<strong>⚠️ यह ईमेल पहले से पंजीकृत है।</strong><p>इस ईमेल से नया पंजीयन स्वीकार नहीं किया जाएगा।</p>",
        "error"
      );

      return;
    }


    // --------------------------------------------
    // OTHER FIREBASE ERROR
    // --------------------------------------------

    showMessage(
      "❌ <strong>डेटा सेव नहीं हो पाया।</strong><p>कृपया इंटरनेट कनेक्शन जाँचकर दोबारा प्रयास करें।</p>",
      "error"
    );


  } finally {

    submitBtn.disabled = false;

    submitBtn.innerHTML =
      "<span>पंजीयन सबमिट करें</span><b>→</b>";

  }

});
