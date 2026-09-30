// ============================================================
// HALBA SAMAJ REGISTRATION
// FIREBASE FIRESTORE VERSION
// Google Apps Script की जरूरत नहीं
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
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


// ============================================================
// INITIALIZE FIREBASE
// ============================================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// ============================================================
// HTML ELEMENTS
// ============================================================

const form =
  document.getElementById("registrationForm");

const message =
  document.getElementById("message");

const submitBtn =
  document.getElementById("submitBtn");

const mahasabha =
  document.getElementById("mahasabha");

const otherWrap =
  document.getElementById("otherMahasabhaWrap");

const otherInput =
  document.getElementById("otherMahasabha");

const districtSelect =
  document.getElementById("district");

const blockSelect =
  document.getElementById("block");


// ============================================================
// CHHATTISGARH DISTRICT → BLOCK
// ============================================================

const CG_DISTRICT_BLOCKS = {

  "बालोद": [
    "बालोद",
    "डौंडी",
    "डौंडी-लोहारा",
    "गुंडरदेही",
    "गुरूर"
  ],

  "बलौदाबाजार-भाटापारा": [
    "बलौदाबाजार",
    "भाटापारा",
    "कसडोल",
    "पलारी",
    "सिमगा"
  ],

  "बलरामपुर-रामानुजगंज": [
    "बलरामपुर",
    "कुसमी",
    "राजपुर",
    "रामचन्द्रपुर",
    "शंकरगढ़",
    "वाड्रफनगर"
  ],

  "बस्तर": [
    "जगदलपुर",
    "बस्तर",
    "बकावंड",
    "बस्तानार",
    "दरभा",
    "लोहंडीगुड़ा",
    "तोकापाल"
  ],

  "बेमेतरा": [
    "बेमेतरा",
    "साजा",
    "बेरला",
    "नवागढ़"
  ],

  "बीजापुर": [
    "बीजापुर",
    "भैरमगढ़",
    "भोपालपटनम",
    "उसूर"
  ],

  "बिलासपुर": [
    "बिल्हा",
    "कोटा",
    "मस्तूरी",
    "तखतपुर"
  ],

  "दक्षिण बस्तर दंतेवाड़ा": [
    "दंतेवाड़ा",
    "गीदम",
    "कटेकल्याण",
    "कुआकोंडा"
  ],

  "धमतरी": [
    "धमतरी",
    "कुरूद",
    "मगरलोड",
    "नगरी"
  ],

  "दुर्ग": [
    "दुर्ग",
    "धमधा",
    "पाटन"
  ],

  "गरियाबंद": [
    "गरियाबंद",
    "फिंगेश्वर",
    "छुरा",
    "देवभोग",
    "मैनपुर"
  ],

  "गौरेला-पेंड्रा-मरवाही": [
    "पेंड्रा रोड",
    "पेंड्रा",
    "मरवाही"
  ],

  "जांजगीर-चांपा": [
    "अकलतरा",
    "बलौदा",
    "बम्हनीडीह",
    "नवागढ़",
    "पामगढ़"
  ],

  "कांकेर": [
    "अंतागढ़",
    "भानुप्रतापपुर",
    "चारामा",
    "दुर्गूकोंदल",
    "कांकेर",
    "कोयलीबेड़ा",
    "नरहरपुर"
  ],

  "जशपुर": [
    "जशपुर",
    "कुनकुरी",
    "पत्थलगांव",
    "बगीचा",
    "दुलदुला",
    "मनोरा",
    "कांसाबेल",
    "फरसाबहार"
  ],

  "कबीरधाम": [
    "कवर्धा",
    "बोड़ला",
    "सहसपुर लोहारा",
    "पंडरिया"
  ],

  "खैरागढ़-छुईखदान-गंडई": [
    "खैरागढ़",
    "छुईखदान"
  ],

  "कोंडागांव": [
    "कोंडागांव",
    "केशकाल",
    "बड़ेराजपुर",
    "माकड़ी",
    "फरसगांव"
  ],

  "कोरबा": [
    "कोरबा",
    "कटघोरा",
    "पाली",
    "करतला",
    "पोड़ी-उपरोड़ा"
  ],

  "कोरिया": [
    "बैकुंठपुर",
    "सोनहत"
  ],

  "महासमुंद": [
    "महासमुंद",
    "बसना",
    "बागबाहरा",
    "पिथौरा",
    "सरायपाली"
  ],

  "मनेन्द्रगढ़-चिरमिरी-भरतपुर": [
    "भरतपुर",
    "मनेन्द्रगढ़"
  ],

  "मोहला-मानपुर-अंबागढ़ चौकी": [
    "अंबागढ़ चौकी",
    "मानपुर",
    "मोहला"
  ],

  "मुंगेली": [
    "मुंगेली",
    "पथरिया",
    "लोरमी"
  ],

  "नारायणपुर": [
    "नारायणपुर",
    "ओरछा (अबूझमाड़)"
  ],

  "रायगढ़": [
    "रायगढ़",
    "पुसौर",
    "खरसिया",
    "घरघोड़ा",
    "तमनार",
    "धरमजयगढ़",
    "लैलूंगा"
  ],

  "रायपुर": [
    "आरंग",
    "अभनपुर",
    "धरसींवा",
    "तिल्दा"
  ],

  "राजनांदगांव": [
    "राजनांदगांव",
    "डोंगरगढ़",
    "डोंगरगांव",
    "छुरिया"
  ],

  "सक्ती": [
    "सक्ती",
    "जैजैपुर",
    "मालखरौदा",
    "डभरा"
  ],

  "सारंगढ़-बिलाईगढ़": [
    "सारंगढ़",
    "बरमकेला",
    "बिलाईगढ़"
  ],

  "सुकमा": [
    "सुकमा",
    "छिंदगढ़",
    "कोंटा"
  ],

  "सूरजपुर": [
    "सूरजपुर",
    "प्रेमनगर",
    "भैयाथान",
    "ओड़गी",
    "प्रतापपुर",
    "रामानुजनगर"
  ],

  "सरगुजा": [
    "अंबिकापुर",
    "लखनपुर",
    "उदयपुर",
    "लुंड्रा",
    "बतौली",
    "सीतापुर",
    "मैनपाट"
  ]

};


// ============================================================
// DISTRICT DROPDOWN
// ============================================================

function initDistrictBlockDropdowns() {

  if (!districtSelect || !blockSelect) {
    return;
  }

  Object.keys(CG_DISTRICT_BLOCKS).forEach(
    (district, index) => {

      const option =
        document.createElement("option");

      option.value = district;

      option.textContent =
        `${index + 1}. ${district}`;

      districtSelect.appendChild(option);

    }
  );

  districtSelect.addEventListener(
    "change",
    updateBlocks
  );

}


// ============================================================
// UPDATE BLOCKS
// ============================================================

function updateBlocks() {

  const district =
    districtSelect.value;

  blockSelect.innerHTML = "";

  if (!district) {

    blockSelect.disabled = true;

    blockSelect.innerHTML =
      '<option value="">-- पहले जिला चुनें --</option>';

    return;
  }

  const firstOption =
    document.createElement("option");

  firstOption.value = "";

  firstOption.textContent =
    "-- ब्लॉक / विकासखंड चुनें --";

  blockSelect.appendChild(firstOption);

  CG_DISTRICT_BLOCKS[district].forEach(
    (block, index) => {

      const option =
        document.createElement("option");

      option.value = block;

      option.textContent =
        `${index + 1}. ${block}`;

      blockSelect.appendChild(option);

    }
  );

  blockSelect.disabled = false;

}


// Initialize dropdown

initDistrictBlockDropdowns();


// ============================================================
// OTHER MAHASABHA
// ============================================================

if (mahasabha) {

  mahasabha.addEventListener(
    "change",
    () => {

      const isOther =
        mahasabha.value === "अन्य";

      otherWrap.classList.toggle(
        "hidden",
        !isOther
      );

      otherInput.required =
        isOther;

      if (!isOther) {
        otherInput.value = "";
      }

    }
  );

}


// ============================================================
// MESSAGE
// ============================================================

function showMessage(
  html,
  type
) {

  message.className =
    "message show " + type;

  message.innerHTML =
    html;

}


function clearMessage() {

  message.className =
    "message";

  message.innerHTML =
    "";

}


// ============================================================
// MOBILE CLEAN
// ============================================================

function cleanMobile(value) {

  return String(value || "")
    .replace(/\D/g, "");

}


// ============================================================
// GET FORM DATA
// ============================================================

function getPayload() {

  const payload =
    Object.fromEntries(
      new FormData(form).entries()
    );

  payload.mobile =
    cleanMobile(payload.mobile);

  return payload;

}


// ============================================================
// LOCAL VALIDATION
// ============================================================

function validateLocal(payload) {

  // Mobile validation

  if (
    !/^[6-9]\d{9}$/.test(
      payload.mobile
    )
  ) {

    showMessage(
      "❌ कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।",
      "error"
    );

    const mobile =
      document.getElementById("mobile");

    if (mobile) {
      mobile.focus();
    }

    return false;
  }


  // Other Mahasabha

  if (
    payload.mahasabha === "अन्य" &&
    !String(
      payload.otherMahasabha || ""
    ).trim()
  ) {

    showMessage(
      "❌ कृपया अन्य महासभा का नाम लिखें।",
      "error"
    );

    if (otherInput) {
      otherInput.focus();
    }

    return false;
  }


  // Email

  if (
    !payload.email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      payload.email
    )
  ) {

    showMessage(
      "❌ कृपया सही ईमेल दर्ज करें।",
      "error"
    );

    return false;
  }


  // District

  if (!payload.district) {

    showMessage(
      "❌ कृपया जिला चुनें।",
      "error"
    );

    return false;
  }


  // Block

  if (!payload.block) {

    showMessage(
      "❌ कृपया ब्लॉक / विकासखंड चुनें।",
      "error"
    );

    return false;
  }


  return true;

}


// ============================================================
// FIREBASE SAVE
// ============================================================

async function saveRegistration(
  payload
) {

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
      String(
        payload.email || ""
      )
        .trim()
        .toLowerCase(),

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


  // Firestore collection:
  // registrations

  const docRef =
    await addDoc(
      collection(
        db,
        "registrations"
      ),
      registrationData
    );


  return docRef.id;

}


// ============================================================
// FORM SUBMIT
// ============================================================

form.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    clearMessage();


    // ========================================================
    // BROWSER VALIDATION
    // ========================================================

    if (!form.checkValidity()) {

      form.reportValidity();

      return;
    }


    // ========================================================
    // GET DATA
    // ========================================================

    const payload =
      getPayload();


    // ========================================================
    // LOCAL VALIDATION
    // ========================================================

    if (!validateLocal(payload)) {

      return;
    }


    // ========================================================
    // DISABLE BUTTON
    // ========================================================

    submitBtn.disabled = true;

    submitBtn.innerHTML =
      "<span>सेव हो रहा है...</span><b>…</b>";


    // ========================================================
    // FIREBASE SAVE + SUCCESS PAGE
    // ========================================================

    try {

      // ------------------------------------------------------
      // SAVE TO FIREBASE
      // ------------------------------------------------------

      const documentId =
        await saveRegistration(
          payload
        );


      console.log(
        "Registration saved:",
        documentId
      );


      // ------------------------------------------------------
      // DATA FOR SUCCESS PAGE
      // ------------------------------------------------------

      const successData = {

        registrationId:
          documentId,

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
          payload.email || "",

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

        registrationTime:
          new Date().toLocaleString(
            "hi-IN"
          )

      };


      // ------------------------------------------------------
      // STORE SUBMITTED DATA TEMPORARILY
      // ------------------------------------------------------

      sessionStorage.setItem(
        "halbaRegistration",
        JSON.stringify(
          successData
        )
      );


      // ------------------------------------------------------
      // GO TO SUCCESS PAGE
      // ------------------------------------------------------

      window.location.href =
        "success.html";

    }


    // ========================================================
    // ERROR
    // ========================================================

    catch (error) {

      console.error(
        "Firebase Error:",
        error
      );


      let errorMessage =
        "❌ डेटा सेव नहीं हो पाया।";


      // Permission error

      if (
        error.code ===
        "permission-denied"
      ) {

        errorMessage =
          "❌ Firebase अनुमति नहीं दे रहा है। Firestore Rules जाँचें।";

      }


      // Network error

      else if (
        error.code ===
        "unavailable"
      ) {

        errorMessage =
          "❌ इंटरनेट कनेक्शन की समस्या है। कृपया पुनः प्रयास करें।";

      }


      showMessage(
        errorMessage,
        "error"
      );

    }


    // ========================================================
    // ENABLE BUTTON AGAIN
    // ========================================================

    finally {

      submitBtn.disabled =
        false;

      submitBtn.innerHTML =
        "<span>पंजीयन सबमिट करें</span><b>→</b>";

    }

  }
);
