// ============================================================
// HALBA SAMAJ - SUPABASE REGISTRATION
// GitHub Pages + Supabase
// ============================================================

import { createClient } from
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


// ============================================================
// SUPABASE CONFIG
// ============================================================

const SUPABASE_URL =
  "https://ckezucvgugovsadflhqj.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_Bj-VKmQBUTGs0zKuCRMTgg_apvB0LKe";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// ============================================================
// CHHATTISGARH DISTRICT / BLOCK
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
// HELPERS
// ============================================================

function $(selector) {
  return document.querySelector(selector);
}

function getValue(name) {

  const element =
    document.querySelector(`[name="${name}"]`) ||
    document.getElementById(name);

  if (!element) return "";

  return String(element.value || "").trim();
}


function getChecked(id, name) {

  const element =
    document.getElementById(id) ||
    document.querySelector(`[name="${name}"]`);

  return element ? Boolean(element.checked) : false;
}


function showMessage(message, type = "info") {

  let box =
    document.getElementById("formMessage") ||
    document.getElementById("message");

  if (!box) {

    box = document.createElement("div");

    box.id = "formMessage";

    const form =
      document.querySelector("#registrationForm") ||
      document.querySelector("form");

    if (form) {
      form.prepend(box);
    }
  }

  box.textContent = message;

  box.style.display = "block";
  box.style.padding = "12px";
  box.style.marginBottom = "15px";
  box.style.borderRadius = "8px";

  if (type === "success") {
    box.style.background = "#e8f5e9";
    box.style.color = "#1b5e20";
  } else if (type === "error") {
    box.style.background = "#ffebee";
    box.style.color = "#b71c1c";
  } else {
    box.style.background = "#fff8e1";
    box.style.color = "#795548";
  }

  box.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}


function clearMessage() {

  const box =
    document.getElementById("formMessage") ||
    document.getElementById("message");

  if (box) {
    box.textContent = "";
    box.style.display = "none";
  }
}


// ============================================================
// REGISTRATION ID
// ============================================================

function generateRegistrationId() {

  const date = new Date();

  const y = date.getFullYear();

  const m = String(date.getMonth() + 1)
    .padStart(2, "0");

  const d = String(date.getDate())
    .padStart(2, "0");

  const random = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  return `HS-${y}${m}${d}-${random}`;
}


// ============================================================
// DISTRICT / BLOCK DROPDOWN
// ============================================================

function setupDistrictBlock() {

  const district =
    document.getElementById("district");

  const block =
    document.getElementById("block");

  if (!district) {
    console.error("District field नहीं मिला।");
    return;
  }


  // ========================================================
  // DISTRICT OPTIONS
  // ========================================================

  district.innerHTML = "";

  const defaultDistrict =
    document.createElement("option");

  defaultDistrict.value = "";

  defaultDistrict.textContent =
    "जिला चुनें";

  defaultDistrict.disabled = false;

  defaultDistrict.selected = true;

  district.appendChild(
    defaultDistrict
  );


  Object.keys(CG_DISTRICT_BLOCKS)
    .sort((a, b) =>
      a.localeCompare(b, "hi")
    )
    .forEach(districtName => {

      const option =
        document.createElement("option");

      option.value =
        districtName;

      option.textContent =
        districtName;

      district.appendChild(
        option
      );
    });


  // ========================================================
  // BLOCK OPTIONS
  // ========================================================

  function updateBlocks() {

    if (!block) return;

    const selectedDistrict =
      district.value;


    block.innerHTML = "";

    const defaultBlock =
      document.createElement("option");

    defaultBlock.value = "";

    defaultBlock.textContent =
      selectedDistrict
        ? "ब्लॉक चुनें"
        : "पहले जिला चुनें";

    defaultBlock.selected = true;

    block.appendChild(
      defaultBlock
    );


    const blocks =
      CG_DISTRICT_BLOCKS[
        selectedDistrict
      ] || [];


    blocks.forEach(blockName => {

      const option =
        document.createElement("option");

      option.value =
        blockName;

      option.textContent =
        blockName;

      block.appendChild(
        option
      );

    });
  }


  // District बदलने पर Block बदलेगा

  district.addEventListener(
    "change",
    updateBlocks
  );


  // Initial state

  updateBlocks();
}
// ============================================================
// FORM SUBMIT
// ============================================================

async function submitRegistration(event) {

  event.preventDefault();

  clearMessage();

  const form = event.currentTarget;

  const submitButton =
    form.querySelector(
      'button[type="submit"], input[type="submit"]'
    );

  const originalText =
    submitButton
      ? submitButton.textContent
      : "";

  try {

    // --------------------------------------------------------
    // BASIC VALIDATION
    // --------------------------------------------------------

    const participantName =
      getValue("participantName");

    const fatherName =
      getValue("fatherName");

    const mobile =
      getValue("mobile");

    const district =
      getValue("district");

    const relatedBlock =
      getValue("relatedBlock");

    const block =
      getValue("block");

    const village =
      getValue("village");

    const termsAccepted =
      getChecked(
        "termsAccepted",
        "termsAccepted"
      );

    const informationConfirmed =
      getChecked(
        "informationConfirmed",
        "informationConfirmed"
      );


    if (!participantName) {
      showMessage(
        "कृपया नाम दर्ज करें।",
        "error"
      );
      return;
    }


    if (!fatherName) {
      showMessage(
        "कृपया पिता का नाम दर्ज करें।",
        "error"
      );
      return;
    }


    if (!mobile) {
      showMessage(
        "कृपया मोबाइल नंबर दर्ज करें।",
        "error"
      );
      return;
    }


    if (!/^[0-9]{10}$/.test(mobile)) {

      showMessage(
        "मोबाइल नंबर 10 अंकों का होना चाहिए।",
        "error"
      );

      return;
    }


    if (!district) {

      showMessage(
        "कृपया जिला चुनें।",
        "error"
      );

      return;
    }


    if (!relatedBlock) {

      showMessage(
        "कृपया संबंधित ब्लॉक दर्ज करें।",
        "error"
      );

      return;
    }


    if (!block) {

      showMessage(
        "कृपया ब्लॉक दर्ज/चुनें।",
        "error"
      );

      return;
    }


    if (!village) {

      showMessage(
        "कृपया गाँव / नगर दर्ज करें।",
        "error"
      );

      return;
    }


    if (!termsAccepted) {

      showMessage(
        "कृपया नियम एवं शर्तें स्वीकार करें।",
        "error"
      );

      return;
    }


    if (!informationConfirmed) {

      showMessage(
        "कृपया जानकारी की पुष्टि करें।",
        "error"
      );

      return;
    }


    // --------------------------------------------------------
    // BUTTON LOADING
    // --------------------------------------------------------

    if (submitButton) {

      submitButton.disabled = true;

      submitButton.textContent =
        "पंजीयन हो रहा है...";
    }


    // --------------------------------------------------------
    // FORM VALUES
    // --------------------------------------------------------

    const registrationId =
      generateRegistrationId();


    const data = {

      registration_id:
        registrationId,

      mahasabha:
        getValue("mahasabha"),

      other_mahasabha:
        getValue("otherMahasabha"),

      participant_name:
        participantName,

      gotra:
        getValue("gotra"),

      totem:
        getValue("totem"),

      father_name:
        fatherName,

      dob:
        getValue("dob") || null,

      gender:
        getValue("gender"),

      email:
        getValue("email"),

      mobile:
        mobile,

      alternate_mobile:
        getValue("alternateMobile"),

      district:
        district,

      related_block:
        relatedBlock,

      block:
        block,

      village:
        village,

      address:
        getValue("address"),

      terms_accepted:
        termsAccepted,

      information_confirmed:
        informationConfirmed,

      status:
        "Submitted"
    };


    // --------------------------------------------------------
    // INSERT INTO SUPABASE
    // --------------------------------------------------------

    const { data: insertedData, error } =
      await supabase
        .from("registrations")
        .insert([data])
        .select()
        .single();


    if (error) {

      console.error(
        "Supabase registration error:",
        error
      );

      if (
        error.code === "23505"
      ) {

        showMessage(
          "यह पंजीयन पहले से मौजूद है। कृपया पुनः प्रयास करें।",
          "error"
        );

      } else {

        showMessage(
          "पंजीयन जमा नहीं हो सका। " +
          (error.message || "कृपया पुनः प्रयास करें।"),
          "error"
        );
      }

      return;
    }


    // --------------------------------------------------------
    // SUCCESS DATA
    // --------------------------------------------------------

    const successData = {

      registrationId:
        insertedData?.registration_id ||
        registrationId,

      participantName:
        participantName,

      fatherName:
        fatherName,

      mobile:
        mobile,

      district:
        district,

      relatedBlock:
        relatedBlock,

      block:
        block,

      village:
        village,

      createdAt:
        insertedData?.created_at ||
        new Date().toISOString()
    };


    sessionStorage.setItem(
      "halbaRegistrationSuccess",
      JSON.stringify(successData)
    );


    // --------------------------------------------------------
    // SUCCESS PAGE
    // --------------------------------------------------------

    window.location.href =
      "success.html";


  } catch (error) {

    console.error(
      "Registration error:",
      error
    );

    showMessage(
      "कुछ तकनीकी समस्या हुई। कृपया थोड़ी देर बाद पुनः प्रयास करें।",
      "error"
    );

  } finally {

    if (submitButton) {

      submitButton.disabled = false;

      submitButton.textContent =
        originalText || "पंजीयन करें";
    }
  }
}


// ============================================================
// INITIALIZE
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    setupDistrictBlock();

    const form =
      document.getElementById(
        "registrationForm"
      ) ||
      document.querySelector(
        "form"
      );

    if (form) {

      form.addEventListener(
        "submit",
        submitRegistration
      );
    }

  }
);
