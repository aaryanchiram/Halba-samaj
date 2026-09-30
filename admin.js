/* ============================================================
   HALBA HALBI SAMAJ
   ADMIN DASHBOARD - FINAL VERSION

   Features:
   - Firebase Authentication
   - Firestore registrations
   - Admin username/password login
   - District / Related Block / Block / Village filters
   - Search
   - Statistics
   - Single record print
   - Full filtered list print
   - Excel XLSX download
   - Mobile responsive UI
   - No update/delete
   ============================================================ */

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


/* ============================================================
   FIREBASE CONFIG
   ============================================================ */

const firebaseConfig = {
  apiKey: "AIzaSyDrAvxLdDT9TUbbC9B3p7SsJDTp5XfVuEU",
  authDomain: "halba-register-b23bb.firebaseapp.com",
  projectId: "halba-register-b23bb",
  storageBucket: "halba-register-b23bb.firebasestorage.app",
  messagingSenderId: "514620312693",
  appId: "1:514620312693:web:5259d7df657e96911b3c3c",
  measurementId: "G-162MZWB8RB"
};


/* ============================================================
   INITIALIZE FIREBASE
   ============================================================ */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


/* ============================================================
   ADMIN SETTINGS
   ============================================================ */

const ADMIN_USERNAME = "admin";

const ADMIN_EMAIL = "admin@halbasamaj.com";


/* ============================================================
   DISTRICT → BLOCK DATA
   ============================================================ */

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


/* ============================================================
   DOM ELEMENTS
   ============================================================ */

const loginPanel =
  document.getElementById("loginPanel");

const dashboardPanel =
  document.getElementById("dashboardPanel");

const loginForm =
  document.getElementById("loginForm");

const loginBtn =
  document.getElementById("loginBtn");

const adminMessage =
  document.getElementById("adminMessage");

const refreshBtn =
  document.getElementById("refreshBtn");

const logoutBtn =
  document.getElementById("logoutBtn");

const districtFilter =
  document.getElementById("districtFilter");

const relatedBlockFilter =
  document.getElementById("relatedBlockFilter");

const blockFilter =
  document.getElementById("blockFilter");

const villageFilter =
  document.getElementById("villageFilter");

const genderFilter =
  document.getElementById("genderFilter");

const searchFilter =
  document.getElementById("searchFilter");

const recordsBody =
  document.getElementById("recordsBody");

const totalCount =
  document.getElementById("totalCount");

const maleCount =
  document.getElementById("maleCount");

const femaleCount =
  document.getElementById("femaleCount");

const otherCount =
  document.getElementById("otherCount");

const visibleCount =
  document.getElementById("visibleCount");

const lastUpdated =
  document.getElementById("lastUpdated");

const districtSummary =
  document.getElementById("districtSummary");

const relatedBlockSummary =
  document.getElementById("relatedBlockSummary");

const blockSummary =
  document.getElementById("blockSummary");

const villageSummary =
  document.getElementById("villageSummary");

const printListBtn =
  document.getElementById("printListBtn");

const downloadExcelBtn =
  document.getElementById("downloadExcelBtn");


/* ============================================================
   APPLICATION STATE
   ============================================================ */

let allRecords = [];

let filteredRecords = [];


/* ============================================================
   HELPER FUNCTIONS
   ============================================================ */

function showMessage(
  message,
  type = "info"
) {

  if (!adminMessage) {
    return;
  }

  adminMessage.textContent = message;

  adminMessage.className =
    `message show ${type}`;

}


function hideMessage() {

  if (!adminMessage) {
    return;
  }

  adminMessage.textContent = "";

  adminMessage.className = "message";

}


function safeValue(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value).trim();

}


function escapeHtml(value) {

  return safeValue(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


function normalizeText(value) {

  return safeValue(value)
    .toLocaleLowerCase("hi-IN")
    .trim();

}


function formatDate(value) {

  if (!value) {
    return "";
  }

  try {

    if (
      typeof value === "object" &&
      typeof value.toDate === "function"
    ) {

      return value
        .toDate()
        .toLocaleString("hi-IN");

    }

    if (
      typeof value === "object" &&
      value.seconds !== undefined
    ) {

      return new Date(
        Number(value.seconds) * 1000
      ).toLocaleString("hi-IN");

    }

    const date =
      new Date(value);

    if (
      !Number.isNaN(date.getTime())
    ) {

      return date.toLocaleString(
        "hi-IN"
      );

    }

  } catch (error) {

    console.warn(
      "Date formatting error:",
      error
    );

  }

  return safeValue(value);

}


function getCreatedAtForSort(record) {

  const value =
    record.createdAt;

  if (!value) {
    return 0;
  }

  try {

    if (
      typeof value.toMillis === "function"
    ) {

      return value.toMillis();

    }

    if (
      typeof value.toDate === "function"
    ) {

      return value.toDate().getTime();

    }

    if (
      typeof value === "object" &&
      value.seconds !== undefined
    ) {

      return Number(value.seconds) * 1000;

    }

    const date =
      new Date(value);

    const time =
      date.getTime();

    return Number.isNaN(time)
      ? 0
      : time;

  } catch {

    return 0;

  }

}


/* ============================================================
   AUTH STATE
   ============================================================ */

onAuthStateChanged(
  auth,
  async (user) => {

    if (
      user &&
      user.email === ADMIN_EMAIL
    ) {

      loginPanel?.classList.add("hidden");

      dashboardPanel?.classList.remove("hidden");

      hideMessage();

      await loadData();

      return;
    }


    loginPanel?.classList.remove("hidden");

    dashboardPanel?.classList.add("hidden");

  }
);


/* ============================================================
   LOGIN
   ============================================================ */

loginForm?.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    hideMessage();

    const formData =
      new FormData(loginForm);

    const username =
      safeValue(
        formData.get("username")
      );

    const password =
      safeValue(
        formData.get("password")
      );


    if (!username || !password) {

      showMessage(
        "यूज़रनेम और पासवर्ड दर्ज करें।",
        "error"
      );

      return;
    }


    if (username !== "admin") {
  showMessage("गलत एडमिन यूज़रनेम।", "error");
  return;
}


    try {

      loginBtn.disabled = true;

      loginBtn.innerHTML =
        "<span>लॉगिन हो रहा है...</span><b>…</b>";


      await signInWithEmailAndPassword(
        auth,
        ADMIN_EMAIL,
        password
      );


      showMessage(
        "एडमिन लॉगिन सफल।",
        "success"
      );


    } catch (error) {

      console.error(
        "Admin login error:",
        error
      );


      let message =
        "लॉगिन असफल हुआ।";


      if (
        error.code ===
        "auth/invalid-credential"
      ) {

        message =
          "यूज़रनेम या पासवर्ड गलत है।";

      } else if (
        error.code ===
        "auth/user-not-found"
      ) {

        message =
          "एडमिन Firebase Authentication में नहीं मिला।";

      } else if (
        error.code ===
        "auth/wrong-password"
      ) {

        message =
          "पासवर्ड गलत है।";

      } else if (
        error.code ===
        "auth/too-many-requests"
      ) {

        message =
          "बहुत अधिक प्रयास किए गए हैं। थोड़ी देर बाद पुनः प्रयास करें।";

      }


      showMessage(
        message,
        "error"
      );

    } finally {

      loginBtn.disabled = false;

      loginBtn.innerHTML =
        "<span>लॉगिन करें</span><b>→</b>";

    }

  }
);


/* ============================================================
   LOGOUT
   ============================================================ */

logoutBtn?.addEventListener(
  "click",
  async () => {

    try {

      await signOut(auth);

      allRecords = [];

      filteredRecords = [];

      showMessage(
        "लॉगआउट सफल।",
        "success"
      );

    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

      showMessage(
        "लॉगआउट नहीं हो पाया।",
        "error"
      );

    }

  }
);


/* ============================================================
   LOAD FIRESTORE DATA
   ============================================================ */

async function loadData() {

  if (!auth.currentUser) {
    return;
  }


  if (
    auth.currentUser.email !==
    ADMIN_EMAIL
  ) {

    showMessage(
      "एडमिन अनुमति आवश्यक है।",
      "error"
    );

    return;
  }


  try {

    showMessage(
      "पंजीयन डेटा लोड हो रहा है...",
      "info"
    );


    let snapshot;


    /*
      पहले createdAt descending order
      से data लोड करने का प्रयास।
    */

    try {

      const orderedQuery =
        query(
          collection(
            db,
            "registrations"
          ),
          orderBy(
            "createdAt",
            "desc"
          )
        );

      snapshot =
        await getDocs(
          orderedQuery
        );

    } catch (orderError) {

      console.warn(
        "Ordered query failed. Loading without order:",
        orderError
      );


      /*
        अगर पुराने documents या index के कारण
        orderBy query fail हो तो बिना order
        पूरा collection पढ़ेंगे।
      */

      snapshot =
        await getDocs(
          collection(
            db,
            "registrations"
          )
        );

    }


    allRecords =
      snapshot.docs.map(
        (doc, index) => {

          const data =
            doc.data() || {};

          return {

            id: doc.id,

            ...data,

            /*
              पुराने documents में
              relatedBlock नहीं होगा।
            */

            relatedBlock:
              safeValue(
                data.relatedBlock
              ),

            /*
              Internal fallback number.
            */

            _index: index

          };

        }
      );


    /*
      अगर बिना order query data आया है
      तो client-side createdAt sorting।
    */

    allRecords.sort(
      (a, b) =>
        getCreatedAtForSort(b) -
        getCreatedAtForSort(a)
    );


    populateDistrictFilter();

    populateRelatedBlockFilter();

    populateBlockFilter();

    populateVillageFilter();


    applyFilters();


    lastUpdated.textContent =
      `अंतिम अपडेट: ${new Date().toLocaleString("hi-IN")}`;


    showMessage(
      `कुल ${allRecords.length} पंजीयन लोड हुए।`,
      "success"
    );


  } catch (error) {

    console.error(
      "Firestore load error:",
      error
    );


    allRecords = [];

    filteredRecords = [];

    renderTable();

    showMessage(
      "Firestore से डेटा लोड नहीं हो पाया। Firebase Rules और Admin Login जाँचें।",
      "error"
    );

  }

}


/* ============================================================
   UNIQUE SORTED VALUES
   ============================================================ */

function uniqueSorted(
  records,
  field
) {

  return [
    ...new Set(
      records
        .map(
          record =>
            safeValue(
              record[field]
            )
        )
        .filter(Boolean)
    )
  ].sort(
    (a, b) =>
      a.localeCompare(
        b,
        "hi"
      )
  );

}


/* ============================================================
   POPULATE DISTRICT FILTER
   ============================================================ */

function populateDistrictFilter() {

  if (!districtFilter) {
    return;
  }


  const current =
    districtFilter.value;


  const districts =
    uniqueSorted(
      allRecords,
      "district"
    );


  districtFilter.innerHTML =
    `<option value="">सभी जिले</option>`;


  districts.forEach(
    district => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        district;

      option.textContent =
        district;

      districtFilter.appendChild(
        option
      );

    }
  );


  if (
    districts.includes(current)
  ) {

    districtFilter.value =
      current;

  }

}


/* ============================================================
   POPULATE RELATED BLOCK FILTER
   ============================================================ */

function populateRelatedBlockFilter(
  records = allRecords
) {

  if (!relatedBlockFilter) {
    return;
  }


  const current =
    relatedBlockFilter.value;


  const relatedBlocks =
    uniqueSorted(
      records,
      "relatedBlock"
    );


  relatedBlockFilter.innerHTML =
    `<option value="">सभी संबंधित ब्लॉक</option>`;


  relatedBlocks.forEach(
    relatedBlock => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        relatedBlock;

      option.textContent =
        relatedBlock;

      relatedBlockFilter.appendChild(
        option
      );

    }
  );


  if (
    relatedBlocks.includes(current)
  ) {

    relatedBlockFilter.value =
      current;

  }

}


/* ============================================================
   POPULATE BLOCK FILTER
   ============================================================ */

function populateBlockFilter() {

  if (!blockFilter) {
    return;
  }


  const district =
    safeValue(
      districtFilter?.value
    );


  const current =
    blockFilter.value;


  let blocks = [];


  if (
    district &&
    CG_DISTRICT_BLOCKS[district]
  ) {

    blocks =
      CG_DISTRICT_BLOCKS[district];

  } else {

    blocks =
      uniqueSorted(
        allRecords,
        "block"
      );

  }


  /*
    Firestore में मौजूद block को भी
    include करेंगे ताकि कोई नया block
    data में हो तो वह गायब न हो।
  */

  const firestoreBlocks =
    uniqueSorted(
      allRecords
        .filter(
          record =>
            !district ||
            safeValue(
              record.district
            ) === district
        ),
      "block"
    );


  blocks =
    [
      ...new Set(
        [
          ...blocks,
          ...firestoreBlocks
        ]
      )
    ].sort(
      (a, b) =>
        a.localeCompare(
          b,
          "hi"
        )
    );


  blockFilter.innerHTML =
    `<option value="">सभी ब्लॉक</option>`;


  blocks.forEach(
    block => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        block;

      option.textContent =
        block;

      blockFilter.appendChild(
        option
      );

    }
  );


  if (
    blocks.includes(current)
  ) {

    blockFilter.value =
      current;

  }

}


/* ============================================================
   POPULATE VILLAGE FILTER
   ============================================================ */

function populateVillageFilter(
  records = allRecords
) {

  if (!villageFilter) {
    return;
  }


  const current =
    villageFilter.value;


  const villages =
    uniqueSorted(
      records,
      "village"
    );


  villageFilter.innerHTML =
    `<option value="">सभी गाँव</option>`;


  villages.forEach(
    village => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        village;

      option.textContent =
        village;

      villageFilter.appendChild(
        option
      );

    }
  );


  if (
    villages.includes(current)
  ) {

    villageFilter.value =
      current;

  }

}


/* ============================================================
   FILTER EVENT LISTENERS
   ============================================================ */

districtFilter?.addEventListener(
  "change",
  () => {

    populateBlockFilter();

    applyFilters();

  }
);


relatedBlockFilter?.addEventListener(
  "change",
  applyFilters
);


blockFilter?.addEventListener(
  "change",
  applyFilters
);


villageFilter?.addEventListener(
  "change",
  applyFilters
);


genderFilter?.addEventListener(
  "change",
  applyFilters
);


searchFilter?.addEventListener(
  "input",
  applyFilters
);


/* ============================================================
   APPLY FILTERS
   ============================================================ */

function applyFilters() {

  const district =
    normalizeText(
      districtFilter?.value
    );

  const relatedBlock =
    normalizeText(
      relatedBlockFilter?.value
    );

  const block =
    normalizeText(
      blockFilter?.value
    );

  const village =
    normalizeText(
      villageFilter?.value
    );

  const gender =
    normalizeText(
      genderFilter?.value
    );

  const search =
    normalizeText(
      searchFilter?.value
    );


  filteredRecords =
    allRecords.filter(
      record => {

        const recordDistrict =
          normalizeText(
            record.district
          );

        const recordRelatedBlock =
          normalizeText(
            record.relatedBlock
          );

        const recordBlock =
          normalizeText(
            record.block
          );

        const recordVillage =
          normalizeText(
            record.village
          );

        const recordGender =
          normalizeText(
            record.gender
          );


        if (
          district &&
          recordDistrict !== district
        ) {

          return false;

        }


        if (
          relatedBlock &&
          recordRelatedBlock !==
            relatedBlock
        ) {

          return false;

        }


        if (
          block &&
          recordBlock !== block
        ) {

          return false;

        }


        if (
          village &&
          recordVillage !== village
        ) {

          return false;

        }


        if (
          gender &&
          recordGender !== gender
        ) {

          return false;

        }


        if (search) {

          const searchable = [

            record.participantName,

            record.fatherName,

            record.gotra,

            record.gotraName,

            record.totem,

            record.email,

            record.mobile,

            record.alternateMobile,

            record.district,

            record.relatedBlock,

            record.block,

            record.village,

            record.address,

            record.mahasabha,

            record.otherMahasabha,

            record.registrationId,

            record.id

          ]
            .map(
              normalizeText
            )
            .join(" ");


          if (
            !searchable.includes(
              search
            )
          ) {

            return false;

          }

        }


        return true;

      }
    );


  /*
    Dependent filters के options को
    वर्तमान district के अनुसार update करें।
  */

  const districtFiltered =
    allRecords.filter(
      record => {

        if (!district) {
          return true;
        }

        return (
          normalizeText(
            record.district
          ) === district
        );

      }
    );


  populateRelatedBlockFilter(
    districtFiltered
  );

  populateVillageFilter(
    districtFiltered
  );


  renderStats(
    filteredRecords
  );

  renderTable(
    filteredRecords
  );

  renderSummaries(
    filteredRecords
  );

}


/* ============================================================
   RENDER STATISTICS
   ============================================================ */

function renderStats(
  records
) {

  const total =
    records.length;


  const male =
    records.filter(
      record =>
        normalizeText(
          record.gender
        ) === "पुरुष"
    ).length;


  const female =
    records.filter(
      record =>
        normalizeText(
          record.gender
        ) === "महिला"
    ).length;


  const other =
    total -
    male -
    female;


  if (totalCount) {
    totalCount.textContent =
      total;
  }

  if (maleCount) {
    maleCount.textContent =
      male;
  }

  if (femaleCount) {
    femaleCount.textContent =
      female;
  }

  if (otherCount) {
    otherCount.textContent =
      Math.max(
        0,
        other
      );
  }

}


/* ============================================================
   RENDER TABLE
   ============================================================ */

function renderTable(
  records = filteredRecords
) {

  if (!recordsBody) {
    return;
  }


  if (visibleCount) {

    visibleCount.textContent =
      records.length;

  }


  if (!records.length) {

    recordsBody.innerHTML = `
      <tr>
        <td
          colspan="10"
          class="empty-row">
          कोई पंजीयन नहीं मिला।
        </td>
      </tr>
    `;

    return;
  }


  recordsBody.innerHTML =
    records
      .map(
        (record, index) => {

          const name =
            safeValue(
              record.participantName
            ) ||
            "—";


          const gender =
            safeValue(
              record.gender
            ) ||
            "—";


          const district =
            safeValue(
              record.district
            ) ||
            "—";


          const relatedBlock =
            safeValue(
              record.relatedBlock
            ) ||
            "—";


          const block =
            safeValue(
              record.block
            ) ||
            "—";


          const village =
            safeValue(
              record.village
            ) ||
            "—";


          const mobile =
            safeValue(
              record.mobile
            ) ||
            "—";


          const email =
            safeValue(
              record.email
            ) ||
            "—";


          return `

            <tr>

              <td>
                ${index + 1}
              </td>

              <td>
                ${escapeHtml(name)}
              </td>

              <td>
                ${escapeHtml(gender)}
              </td>

              <td>
                ${escapeHtml(district)}
              </td>

              <td>
                ${escapeHtml(relatedBlock)}
              </td>

              <td>
                ${escapeHtml(block)}
              </td>

              <td>
                ${escapeHtml(village)}
              </td>

              <td>
                ${escapeHtml(mobile)}
              </td>

              <td>
                ${escapeHtml(email)}
              </td>

              <td>

                <button
                  type="button"
                  class="record-print-btn"
                  data-print-id="${escapeHtml(record.id)}">
                  🖨️
                </button>

              </td>

            </tr>

          `;

        }
      )
      .join("");


  /*
    Single record print buttons
  */

  recordsBody
    .querySelectorAll(
      ".record-print-btn"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const id =
              button.dataset.printId;

            const record =
              allRecords.find(
                item =>
                  item.id === id
              );

            if (record) {

              printSingleRecord(
                record
              );

            }

          }
        );

      }
    );

}


/* ============================================================
   SUMMARY
   ============================================================ */

function createSummary(
  records,
  field
) {

  const counts = {};


  records.forEach(
    record => {

      const value =
        safeValue(
          record[field]
        ) ||
        "नहीं बताया";


      counts[value] =
        (counts[value] || 0) + 1;

    }
  );


  const entries =
    Object.entries(
      counts
    ).sort(
      (a, b) =>
        b[1] - a[1] ||
        a[0].localeCompare(
          b[0],
          "hi"
        )
    );


  if (!entries.length) {

    return `
      <div class="summary-row">
        <span>कोई डेटा नहीं</span>
        <strong>0</strong>
      </div>
    `;

  }


  return entries
    .map(
      ([name, count]) => `

        <div class="summary-row">

          <span>
            ${escapeHtml(name)}
          </span>

          <strong>
            ${count}
          </strong>

        </div>

      `
    )
    .join("");

}


function renderSummaries(
  records
) {

  if (districtSummary) {

    districtSummary.innerHTML =
      createSummary(
        records,
        "district"
      );

  }


  if (relatedBlockSummary) {

    relatedBlockSummary.innerHTML =
      createSummary(
        records,
        "relatedBlock"
      );

  }


  if (blockSummary) {

    blockSummary.innerHTML =
      createSummary(
        records,
        "block"
      );

  }


  if (villageSummary) {

    villageSummary.innerHTML =
      createSummary(
        records,
        "village"
      );

  }

}


/* ============================================================
   REFRESH
   ============================================================ */

refreshBtn?.addEventListener(
  "click",
  async () => {

    await loadData();

  }
);


/* ============================================================
   SINGLE RECORD PRINT
   ============================================================ */

function printSingleRecord(
  record
) {

  const html =
    buildPrintableRecordHtml(
      record
    );


  openPrintWindow(
    html,
    "पंजीयन विवरण"
  );

}


/* ============================================================
   PRINTABLE SINGLE RECORD HTML
   ============================================================ */

function buildPrintableRecordHtml(
  record
) {

  const rows = [

    [
      "पंजीयन ID",
      record.registrationId ||
      record.id
    ],

    [
      "महासभा",
      record.mahasabha
    ],

    [
      "अन्य महासभा",
      record.otherMahasabha
    ],

    [
      "प्रतिभागी का नाम",
      record.participantName
    ],

    [
      "गोत्र",
      record.gotra ||
      record.gotraName
    ],

    [
      "टोटम",
      record.totem
    ],

    [
      "पिता का नाम",
      record.fatherName
    ],

    [
      "जन्मतिथि",
      record.dob
    ],

    [
      "लिंग",
      record.gender
    ],

    [
      "ईमेल",
      record.email
    ],

    [
      "मोबाइल",
      record.mobile
    ],

    [
      "जिला",
      record.district
    ],

    [
      "संबंधित ब्लॉक",
      record.relatedBlock
    ],

    [
      "ब्लॉक / विकासखंड",
      record.block
    ],

    [
      "गाँव / नगर",
      record.village
    ],

    [
      "पूरा पता",
      record.address
    ],

    [
      "नियम एवं शर्तें",
      record.termsAccepted
    ],

    [
      "जानकारी पुष्टि",
      record.informationConfirmed
    ],

    [
      "पंजीयन समय",
      formatDate(
        record.createdAt
      )
    ]

  ];


  const tableRows =
    rows
      .map(
        ([label, value]) => `

          <tr>

            <th>
              ${escapeHtml(label)}
            </th>

            <td>
              ${escapeHtml(
                safeValue(value) || "—"
              )}
            </td>

          </tr>

        `
      )
      .join("");


  return `

    <!doctype html>

    <html lang="hi">

    <head>

      <meta charset="utf-8">

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1">

      <title>
        पंजीयन विवरण
      </title>

      <style>

        *{
          box-sizing:border-box;
        }

        body{
          margin:0;
          font-family:
            Arial,
            "Noto Sans Devanagari",
            sans-serif;
          background:#fff;
          color:#222;
        }

        .page{
          width:100%;
          padding:18px;
        }

        .header{
          text-align:center;
          border-bottom:2px solid #0f6b68;
          padding-bottom:12px;
          margin-bottom:15px;
        }

        h1{
          margin:0;
          font-size:20px;
          color:#0f6b68;
        }

        h2{
          margin:5px 0 0;
          font-size:15px;
        }

        .sub{
          margin:5px 0 0;
          font-size:12px;
        }

        table{
          width:100%;
          border-collapse:collapse;
          font-size:11px;
        }

        th,
        td{
          border:1px solid #999;
          padding:7px;
          vertical-align:top;
        }

        th{
          width:27%;
          background:#eef6f5;
          text-align:left;
        }

        .footer{
          text-align:center;
          margin-top:18px;
          font-size:10px;
          color:#777;
        }

        @page{
          size:A4 portrait;
          margin:10mm;
        }

        @media print{

          .page{
            padding:0;
          }

        }

      </style>

    </head>

    <body>

      <div class="page">

        <div class="header">

          <h1>
            अखिल भारतीय आदिवासी हलबा हलबी समाज
          </h1>

          <h2>
            पंजीयन विवरण
          </h2>

          <p class="sub">
            जय माँ दंतेश्वरी • जय जोहार
          </p>

        </div>


        <table>

          <tbody>

            ${tableRows}

          </tbody>

        </table>


        <div class="footer">
          Powered by Aaryan Chiram
        </div>

      </div>


      <script>

        window.onload = function(){

          window.print();

        };

      <\/script>

    </body>

    </html>

  `;

}


/* ============================================================
   PRINT FILTERED LIST
   ============================================================ */

printListBtn?.addEventListener(
  "click",
  () => {

    if (!filteredRecords.length) {

      showMessage(
        "प्रिंट करने के लिए कोई रिकॉर्ड नहीं है।",
        "error"
      );

      return;

    }


    const html =
      buildPrintableListHtml(
        filteredRecords
      );


    openPrintWindow(
      html,
      "पंजीयन सूची"
    );

  }
);


/* ============================================================
   PRINTABLE LIST
   ============================================================ */

function buildPrintableListHtml(
  records
) {

  const rows =
    records
      .map(
        (record, index) => `

          <tr>

            <td>
              ${index + 1}
            </td>

            <td>
              ${escapeHtml(
                record.registrationId ||
                record.id ||
                "—"
              )}
            </td>

            <td>
              ${escapeHtml(
                record.participantName ||
                "—"
              )}
            </td>

            <td>
              ${escapeHtml(
                record.gender ||
                "—"
              )}
            </td>

            <td>
              ${escapeHtml(
                record.district ||
                "—"
              )}
            </td>

            <td>
              ${escapeHtml(
                record.relatedBlock ||
                "—"
              )}
            </td>

            <td>
              ${escapeHtml(
                record.block ||
                "—"
              )}
            </td>

            <td>
              ${escapeHtml(
                record.village ||
                "—"
              )}
            </td>

            <td>
              ${escapeHtml(
                record.mobile ||
                "—"
              )}
            </td>

            <td>
              ${escapeHtml(
                record.email ||
                "—"
              )}
            </td>

          </tr>

        `
      )
      .join("");


  return `

    <!doctype html>

    <html lang="hi">

    <head>

      <meta charset="utf-8">

      <title>
        पंजीयन सूची
      </title>

      <style>

        *{
          box-sizing:border-box;
        }

        body{
          margin:0;
          font-family:
            Arial,
            "Noto Sans Devanagari",
            sans-serif;
          color:#222;
          background:#fff;
        }

        .page{
          width:100%;
          padding:10px;
        }

        .header{
          text-align:center;
          margin-bottom:10px;
        }

        h1{
          margin:0;
          font-size:18px;
          color:#0f6b68;
        }

        h2{
          margin:4px 0;
          font-size:14px;
        }

        .meta{
          font-size:10px;
          color:#555;
        }

        table{
          width:100%;
          border-collapse:collapse;
          font-size:8px;
        }

        th,
        td{
          border:1px solid #888;
          padding:4px;
          text-align:left;
          vertical-align:top;
        }

        th{
          background:#eef6f5;
          color:#155d5b;
        }

        .footer{
          text-align:center;
          margin-top:8px;
          font-size:8px;
          color:#777;
        }

        @page{
          size:A4 landscape;
          margin:7mm;
        }

        @media print{

          .page{
            padding:0;
          }

          thead{
            display:table-header-group;
          }

          tr{
            page-break-inside:avoid;
          }

        }

      </style>

    </head>

    <body>

      <div class="page">

        <div class="header">

          <h1>
            अखिल भारतीय आदिवासी हलबा हलबी समाज
          </h1>

          <h2>
            पंजीयन सूची
          </h2>

          <div class="meta">
            कुल रिकॉर्ड: ${records.length}
            |
            प्रिंट समय:
            ${escapeHtml(
              new Date()
                .toLocaleString("hi-IN")
            )}
          </div>

        </div>


        <table>

          <thead>

            <tr>

              <th>
                क्रम
              </th>

              <th>
                पंजीयन ID
              </th>

              <th>
                नाम
              </th>

              <th>
                लिंग
              </th>

              <th>
                जिला
              </th>

              <th>
                संबंधित ब्लॉक
              </th>

              <th>
                ब्लॉक
              </th>

              <th>
                गाँव
              </th>

              <th>
                मोबाइल
              </th>

              <th>
                ईमेल
              </th>

            </tr>

          </thead>

          <tbody>

            ${rows}

          </tbody>

        </table>


        <div class="footer">
          Powered by Aaryan Chiram
        </div>

      </div>


      <script>

        window.onload = function(){

          window.print();

        };

      <\/script>

    </body>

    </html>

  `;

}


/* ============================================================
   OPEN PRINT WINDOW
   ============================================================ */

function openPrintWindow(
  html,
  title
) {

  const printWindow =
    window.open(
      "",
      "_blank",
      "width=1200,height=800"
    );


  if (!printWindow) {

    showMessage(
      "Print window नहीं खुली। Browser में pop-up अनुमति दें।",
      "error"
    );

    return;

  }


  printWindow.document.open();

  printWindow.document.write(
    html
  );

  printWindow.document.close();

}


/* ============================================================
   EXCEL DOWNLOAD
   ============================================================ */

downloadExcelBtn?.addEventListener(
  "click",
  () => {

    downloadExcel();

  }
);


/* ============================================================
   CREATE EXCEL FILE
   ============================================================ */

function downloadExcel() {

  if (
    typeof XLSX === "undefined"
  ) {

    showMessage(
      "Excel library लोड नहीं हुई। इंटरनेट कनेक्शन जाँचें और पेज पुनः लोड करें।",
      "error"
    );

    return;

  }


  if (!filteredRecords.length) {

    showMessage(
      "डाउनलोड करने के लिए कोई रिकॉर्ड नहीं है।",
      "error"
    );

    return;

  }


  try {

    /*
      Excel में वर्तमान filtered list जाएगी।
    */

    const excelData =
      filteredRecords.map(
        (record, index) => ({

          "क्रम":
            index + 1,

          "पंजीयन ID":
            safeValue(
              record.registrationId
            ) ||
            safeValue(
              record.id
            ),

          "महासभा":
            safeValue(
              record.mahasabha
            ),

          "अन्य महासभा":
            safeValue(
              record.otherMahasabha
            ),

          "प्रतिभागी का नाम":
            safeValue(
              record.participantName
            ),

          "गोत्र":
            safeValue(
              record.gotra
            ) ||
            safeValue(
              record.gotraName
            ),

          "टोटम":
            safeValue(
              record.totem
            ),

          "पिता का नाम":
            safeValue(
              record.fatherName
            ),

          "जन्मतिथि":
            safeValue(
              record.dob
            ),

          "लिंग":
            safeValue(
              record.gender
            ),

          "ईमेल":
            safeValue(
              record.email
            ),

          "मोबाइल":
            safeValue(
              record.mobile
            ),

          "वैकल्पिक मोबाइल":
            safeValue(
              record.alternateMobile
            ),

          "जिला":
            safeValue(
              record.district
            ),

          "संबंधित ब्लॉक":
            safeValue(
              record.relatedBlock
            ),

          "ब्लॉक / विकासखंड":
            safeValue(
              record.block
            ),

          "गाँव / नगर":
            safeValue(
              record.village
            ),

          "पूरा पता":
            safeValue(
              record.address
            ),

          "नियम एवं शर्तें":
            safeValue(
              record.termsAccepted
            ),

          "जानकारी पुष्टि":
            safeValue(
              record.informationConfirmed
            ),

          "स्थिति":
            safeValue(
              record.status
            ),

          "पंजीयन समय":
            formatDate(
              record.createdAt
            )

        })
      );


    /*
      JSON → worksheet
    */

    const worksheet =
      XLSX.utils.json_to_sheet(
        excelData
      );


    /*
      Column widths
    */

    worksheet["!cols"] = [

      { wch: 7 },
      { wch: 25 },
      { wch: 20 },
      { wch: 20 },
      { wch: 28 },
      { wch: 18 },
      { wch: 18 },
      { wch: 25 },
      { wch: 14 },
      { wch: 14 },
      { wch: 30 },
      { wch: 16 },
      { wch: 18 },
      { wch: 25 },
      { wch: 25 },
      { wch: 22 },
      { wch: 25 },
      { wch: 45 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 23 }

    ];


    /*
      Workbook
    */

    const workbook =
      XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Registration"
    );


    /*
      Date filename
    */

    const now =
      new Date();


    const year =
      now.getFullYear();


    const month =
      String(
        now.getMonth() + 1
      ).padStart(
        2,
        "0"
      );


    const day =
      String(
        now.getDate()
      ).padStart(
        2,
        "0"
      );


    const filename =
      `Halba-Samaj-Registration-${year}-${month}-${day}.xlsx`;


    /*
      Download XLSX
    */

    XLSX.writeFile(
      workbook,
      filename
    );


    showMessage(
      `${filteredRecords.length} रिकॉर्ड Excel में डाउनलोड किए गए।`,
      "success"
    );


  } catch (error) {

    console.error(
      "Excel export error:",
      error
    );

    showMessage(
      "Excel बनाने में समस्या हुई।",
      "error"
    );

  }

}


/* ============================================================
   INITIAL UI
   ============================================================ */

renderStats([]);

renderTable([]);

renderSummaries([]);


/* ============================================================
   END
   ============================================================ */
