import {
  createClient
} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


// ============================================================
// SUPABASE CONFIGURATION
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
// CHHATTISGARH DISTRICT → BLOCK MAPPING
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
// HELPER FUNCTIONS
// ============================================================

function $(id) {
  return document.getElementById(id);
}


function getValue(id) {

  const element = $(id);

  if (!element) {
    return "";
  }

  return element.value.trim();
}


function getChecked(id) {

  const element = $(id);

  return element
    ? element.checked
    : false;
}


function showMessage(message, type = "error") {

  const box = $("formMessage");

  if (!box) {
    return;
  }

  box.textContent = message;

  box.className =
    "message " + type;

  box.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}


function clearMessage() {

  const box = $("formMessage");

  if (!box) {
    return;
  }

  box.textContent = "";

  box.className = "message";
}


// ============================================================
// REGISTRATION ID GENERATOR
// ============================================================

function generateRegistrationId() {

  const now = new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      now.getDate()
    ).padStart(2, "0");


  const randomPart =
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();


  return `HS-${year}${month}${day}-${randomPart}`;
}


// ============================================================
// DISTRICT + BLOCK SETUP
// ============================================================

function setupDistrictBlock() {

  const district =
    $("district");

  const block =
    $("block");


  if (!district) {

    console.error(
      "District field नहीं मिला।"
    );

    return;
  }


  // ----------------------------------------------------------
  // जिला dropdown भरना
  // ----------------------------------------------------------

  district.innerHTML = "";


  const defaultDistrict =
    document.createElement("option");

  defaultDistrict.value = "";

  defaultDistrict.textContent =
    "जिला चुनें";

  defaultDistrict.selected = true;

  district.appendChild(
    defaultDistrict
  );


  Object.keys(
    CG_DISTRICT_BLOCKS
  )
    .sort(
      (a, b) =>
        a.localeCompare(
          b,
          "hi"
        )
    )
    .forEach(
      districtName => {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          districtName;

        option.textContent =
          districtName;

        district.appendChild(
          option
        );

      }
    );


  // ----------------------------------------------------------
  // ब्लॉक अपडेट करना
  // ----------------------------------------------------------

  function updateBlocks() {

    if (!block) {
      return;
    }


    const selectedDistrict =
      district.value;


    block.innerHTML = "";


    const defaultBlock =
      document.createElement(
        "option"
      );


    defaultBlock.value = "";


    defaultBlock.textContent =
      selectedDistrict
        ? "ब्लॉक चुनें"
        : "पहले जिला चुनें";


    defaultBlock.selected =
      true;


    block.appendChild(
      defaultBlock
    );


    const blocks =
      CG_DISTRICT_BLOCKS[
        selectedDistrict
      ] || [];


    blocks.forEach(
      blockName => {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          blockName;

        option.textContent =
          blockName;

        block.appendChild(
          option
        );

      }
    );

  }


  district.addEventListener(
    "change",
    updateBlocks
  );


  // Initial state
  updateBlocks();
}


// ============================================================
// OTHER MAHASABHA SHOW / HIDE
// ============================================================

function setupMahasabha() {

  const mahasabha =
    $("mahasabha");

  const otherField =
    $("otherMahasabhaField");

  const otherInput =
    $("otherMahasabha");


  if (
    !mahasabha ||
    !otherField ||
    !otherInput
  ) {
    return;
  }


  function updateOtherMahasabha() {

    if (
      mahasabha.value ===
      "अन्य"
    ) {

      otherField.style.display =
        "flex";

      otherInput.required =
        true;

    } else {

      otherField.style.display =
        "none";

      otherInput.required =
        false;

      otherInput.value =
        "";

    }

  }


  mahasabha.addEventListener(
    "change",
    updateOtherMahasabha
  );


  updateOtherMahasabha();
}


// ============================================================
// MOBILE INPUT VALIDATION
// ============================================================

function setupMobileInputs() {

  const mobile =
    $("mobile");

  const alternate =
    $("alternateMobile");


  function onlyDigits(event) {

    event.target.value =
      event.target.value
        .replace(/\D/g, "")
        .substring(0, 10);

  }


  if (mobile) {

    mobile.addEventListener(
      "input",
      onlyDigits
    );

  }


  if (alternate) {

    alternate.addEventListener(
      "input",
      onlyDigits
    );

  }

}


// ============================================================
// VALIDATION
// ============================================================

function validateForm() {

  const participantName =
    getValue("participantName");

  const fatherName =
    getValue("fatherName");

  const mobile =
    getValue("mobile");

  const alternateMobile =
    getValue("alternateMobile");

  const district =
    getValue("district");

  const relatedBlock =
    getValue("relatedBlock");

  const block =
    getValue("block");

  const village =
    getValue("village");

  const termsAccepted =
    getChecked("termsAccepted");

  const informationConfirmed =
    getChecked(
      "informationConfirmed"
    );


  if (!participantName) {

    showMessage(
      "कृपया प्रतिभागी का नाम दर्ज करें।"
    );

    $("participantName")?.focus();

    return false;
  }


  if (!fatherName) {

    showMessage(
      "कृपया पिता का नाम दर्ज करें।"
    );

    $("fatherName")?.focus();

    return false;
  }


  if (
    !/^[0-9]{10}$/.test(
      mobile
    )
  ) {

    showMessage(
      "कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।"
    );

    $("mobile")?.focus();

    return false;
  }


  if (
    alternateMobile &&
    !/^[0-9]{10}$/.test(
      alternateMobile
    )
  ) {

    showMessage(
      "वैकल्पिक मोबाइल नंबर 10 अंकों का होना चाहिए।"
    );

    $("alternateMobile")?.focus();

    return false;
  }


  if (!district) {

    showMessage(
      "कृपया जिला चुनें।"
    );

    $("district")?.focus();

    return false;
  }


  if (!relatedBlock) {

    showMessage(
      "कृपया संबंधित ब्लॉक दर्ज करें।"
    );

    $("relatedBlock")?.focus();

    return false;
  }


  if (!block) {

    showMessage(
      "कृपया ब्लॉक चुनें।"
    );

    $("block")?.focus();

    return false;
  }


  if (!village) {

    showMessage(
      "कृपया गाँव / नगर का नाम दर्ज करें।"
    );

    $("village")?.focus();

    return false;
  }


  if (!termsAccepted) {

    showMessage(
      "कृपया घोषणा को स्वीकार करें।"
    );

    return false;
  }


  if (!informationConfirmed) {

    showMessage(
      "कृपया जानकारी की पुष्टि करें।"
    );

    return false;
  }


  return true;
}


// ============================================================
// SUBMIT REGISTRATION
// ============================================================

async function submitRegistration(
  event
) {

  event.preventDefault();

  clearMessage();


  // Validate
  if (!validateForm()) {
    return;
  }


  const submitBtn =
    $("submitBtn");

  const loadingMessage =
    $("loadingMessage");


  try {

    // --------------------------------------------------------
    // UI LOCK
    // --------------------------------------------------------

    if (submitBtn) {

      submitBtn.disabled =
        true;

      submitBtn.textContent =
        "पंजीयन हो रहा है...";

    }


    if (loadingMessage) {

      loadingMessage.style.display =
        "block";

    }


    // --------------------------------------------------------
    // FORM DATA
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
        getValue("participantName"),

      gotra:
        getValue("gotra"),

      totem:
        getValue("totem"),

      father_name:
        getValue("fatherName"),

      dob:
        getValue("dob") || null,

      gender:
        getValue("gender"),

      email:
        getValue("email"),

      mobile:
        getValue("mobile"),

      alternate_mobile:
        getValue("alternateMobile"),

      district:
        getValue("district"),

      related_block:
        getValue("relatedBlock"),

      block:
        getValue("block"),

      village:
        getValue("village"),

      address:
        getValue("address"),

      terms_accepted:
        getChecked("termsAccepted"),

      information_confirmed:
        getChecked(
          "informationConfirmed"
        ),

      status:
        "Submitted"
    };


    console.log(
      "Supabase registration data:",
      data
    );


    // --------------------------------------------------------
    // INSERT INTO SUPABASE
    // --------------------------------------------------------

    const {
  
      error
    } = await supabase
      .from("registrations")
      .insert([data]);


    // --------------------------------------------------------
    // ERROR
    // --------------------------------------------------------

    if (error) {

      console.error(
        "Supabase insert error:",
        error
      );


      // Unique registration ID
      if (
        error.code ===
        "23505"
      ) {

        showMessage(
          "पंजीयन क्रमांक पहले से मौजूद है। कृपया दोबारा प्रयास करें।"
        );

      }

      // RLS / permission
      else if (
        error.code ===
        "42501"
      ) {

        showMessage(
          "डेटाबेस अनुमति में समस्या है। Supabase RLS Policy जाँचें।"
        );

      }

      else {

        showMessage(
          "पंजीयन सुरक्षित नहीं हो सका। कृपया कुछ देर बाद पुनः प्रयास करें।"
        );

      }


      return;
    }


    // --------------------------------------------------------
    // SUCCESS
    // --------------------------------------------------------

    console.log(
      "Registration successful:",
      insertedData
    );


    const savedRegistration = {

      registration_id:
        registrationId,

      participant_name:
        data.participant_name,

      father_name:
        data.father_name,

      mobile:
        data.mobile,

      district:
        data.district,

      block:
        data.block,

      village:
        data.village,

      created_at:
        insertedData?.created_at ||
        new Date().toISOString()

    };


    // Session storage
    sessionStorage.setItem(
      "halbaRegistrationSuccess",
      JSON.stringify(
        savedRegistration
      )
    );


    // --------------------------------------------------------
    // REDIRECT TO SUCCESS PAGE
    // --------------------------------------------------------

    window.location.href =
      "success.html";

  }

  catch (error) {

    console.error(
      "Unexpected registration error:",
      error
    );


    showMessage(
      "अचानक तकनीकी समस्या हुई। कृपया इंटरनेट कनेक्शन जाँचकर पुनः प्रयास करें।"
    );

  }

  finally {

    if (submitBtn) {

      submitBtn.disabled =
        false;

      submitBtn.textContent =
        "पंजीयन करें";

    }


    if (loadingMessage) {

      loadingMessage.style.display =
        "none";

    }

  }

}


// ============================================================
// PAGE INITIALIZATION
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
      "Halba Samaj registration page loaded."
    );


    // जिला + ब्लॉक
    setupDistrictBlock();


    // महासभा
    setupMahasabha();


    // Mobile
    setupMobileInputs();


    // Registration form
    const form =
      $("registrationForm");


    if (form) {

      form.addEventListener(
        "submit",
        submitRegistration
      );

    } else {

      console.error(
        "registrationForm नहीं मिला।"
      );

    }


    // Current year
    const year =
      $("currentYear");


    if (year) {

      year.textContent =
        new Date().getFullYear();

    }

  }
);
