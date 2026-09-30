// ============================================================
// HALBA SAMAJ ADMIN DASHBOARD
// FIREBASE VERSION
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs
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

const auth = getAuth(app);

const db = getFirestore(app);


// ============================================================
// ADMIN CONFIG
// ============================================================

// Login page पर username "admin" रहेगा
// Firebase Authentication में वास्तविक email यह रहेगा

const ADMIN_USERNAME = "admin";

const ADMIN_EMAIL = "admin@halbasamaj.com";


// ============================================================
// HTML ELEMENTS
// ============================================================

const loginForm =
  document.getElementById("loginForm");

const loginBtn =
  document.getElementById("loginBtn");

const loginPanel =
  document.getElementById("loginPanel");

const dashboardPanel =
  document.getElementById("dashboardPanel");

const adminMessage =
  document.getElementById("adminMessage");

const recordsBody =
  document.getElementById("recordsBody");

const districtFilter =
  document.getElementById("districtFilter");

const blockFilter =
  document.getElementById("blockFilter");

const villageFilter =
  document.getElementById("villageFilter");

const genderFilter =
  document.getElementById("genderFilter");

const searchFilter =
  document.getElementById("searchFilter");

const refreshBtn =
  document.getElementById("refreshBtn");

const logoutBtn =
  document.getElementById("logoutBtn");

const printListBtn =
  document.getElementById("printListBtn");


// ============================================================
// DATA
// ============================================================

let records = [];


// ============================================================
// MESSAGE
// ============================================================

function showMessage(text, type) {

  adminMessage.textContent = text;

  adminMessage.className =
    "message show " + type;

}


// ============================================================
// ESCAPE HTML
// ============================================================

function esc(value) {

  return String(value ?? "")
    .replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));

}


// ============================================================
// FIREBASE AUTH STATE
// ============================================================

onAuthStateChanged(auth, async (user) => {

  if (user) {

    // केवल निर्धारित admin email स्वीकार करें

    if (
      user.email?.toLowerCase() !==
      ADMIN_EMAIL.toLowerCase()
    ) {

      await signOut(auth);

      showMessage(
        "यह Admin account नहीं है।",
        "error"
      );

      return;
    }


    loginPanel.classList.add("hidden");

    dashboardPanel.classList.remove("hidden");

    showMessage(
      "लॉगिन सफल।",
      "success"
    );


    await loadData();

  } else {

    loginPanel.classList.remove("hidden");

    dashboardPanel.classList.add("hidden");

  }

});


// ============================================================
// ADMIN LOGIN
// ============================================================

loginForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    showMessage("", "");

    const formData =
      new FormData(loginForm);

    const username =
      String(
        formData.get("username") || ""
      ).trim();

    const password =
      String(
        formData.get("password") || ""
      );


    // Username check

    if (
      username.toLowerCase() !==
      ADMIN_USERNAME.toLowerCase()
    ) {

      showMessage(
        "❌ गलत Admin username।",
        "error"
      );

      return;
    }


    if (!password) {

      showMessage(
        "❌ पासवर्ड दर्ज करें।",
        "error"
      );

      return;
    }


    loginBtn.disabled = true;

    loginBtn.innerHTML =
      "<span>लॉगिन हो रहा है...</span><b>…</b>";


    try {

      await signInWithEmailAndPassword(
        auth,
        ADMIN_EMAIL,
        password
      );

      loginForm.reset();


    } catch (error) {

      console.error(
        "Admin Login Error:",
        error
      );


      let msg =
        "❌ यूज़रनेम या पासवर्ड गलत है।";


      if (
        error.code ===
        "auth/invalid-credential"
      ) {

        msg =
          "❌ Admin username या password गलत है।";

      }

      else if (
        error.code ===
        "auth/user-not-found"
      ) {

        msg =
          "❌ Firebase में Admin account नहीं मिला।";

      }

      else if (
        error.code ===
        "auth/wrong-password"
      ) {

        msg =
          "❌ Admin password गलत है।";

      }

      else if (
        error.code ===
        "auth/too-many-requests"
      ) {

        msg =
          "❌ बहुत अधिक प्रयास हुए हैं। कुछ समय बाद पुनः प्रयास करें।";

      }

      else if (
        error.code ===
        "auth/network-request-failed"
      ) {

        msg =
          "❌ Internet connection की समस्या है।";

      }


      showMessage(
        msg,
        "error"
      );


    } finally {

      loginBtn.disabled = false;

      loginBtn.innerHTML =
        "<span>लॉगिन करें</span><b>→</b>";

    }

  }
);


// ============================================================
// LOAD FIRESTORE DATA
// ============================================================

async function loadData() {

  if (!auth.currentUser) {

    return;
  }


  refreshBtn.disabled = true;

  refreshBtn.textContent =
    "लोड हो रहा है...";


  try {

    const snapshot =
      await getDocs(
        collection(
          db,
          "registrations"
        )
      );


    records = [];


    snapshot.forEach(
      docSnapshot => {

        const data =
          docSnapshot.data();


        records.push({

          id:
            docSnapshot.id,

          ...data

        });

      }
    );


    // नवीनतम registration पहले

    records.sort(
      (a, b) => {

        const aTime =
          a.createdAt?.toMillis
            ? a.createdAt.toMillis()
            : 0;

        const bTime =
          b.createdAt?.toMillis
            ? b.createdAt.toMillis()
            : 0;

        return bTime - aTime;

      }
    );


    populateFilters();

    renderDashboard();


    const lastUpdated =
      document.getElementById(
        "lastUpdated"
      );


    if (lastUpdated) {

      lastUpdated.textContent =
        "अंतिम अपडेट: " +
        new Date().toLocaleString(
          "hi-IN"
        );

    }


  } catch (error) {

    console.error(
      "Firestore Load Error:",
      error
    );


    if (
      error.code ===
      "permission-denied"
    ) {

      showMessage(
        "❌ Firestore ने अनुमति नहीं दी। Firebase Authentication और Rules जाँचें।",
        "error"
      );

    } else {

      showMessage(
        "❌ डेटा लोड नहीं हो पाया।",
        "error"
      );

    }


  } finally {

    refreshBtn.disabled = false;

    refreshBtn.textContent =
      "रीफ्रेश";

  }

}


// ============================================================
// REFRESH
// ============================================================

refreshBtn.addEventListener(
  "click",
  loadData
);


// ============================================================
// LOGOUT
// ============================================================

logoutBtn.addEventListener(
  "click",
  async () => {

    try {

      await signOut(auth);

      records = [];

      showMessage(
        "लॉगआउट हो गया।",
        "success"
      );

    } catch (error) {

      console.error(
        "Logout Error:",
        error
      );

      showMessage(
        "लॉगआउट नहीं हो पाया।",
        "error"
      );

    }

  }
);


// ============================================================
// UNIQUE VALUES
// ============================================================

function uniq(values) {

  return [
    ...new Set(
      values
        .map(
          value =>
            String(value || "")
              .trim()
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


// ============================================================
// FILL SELECT
// ============================================================

function fillSelect(
  element,
  values,
  defaultText
) {

  if (!element) {

    return;
  }


  const oldValue =
    element.value;


  element.innerHTML = "";


  const defaultOption =
    document.createElement(
      "option"
    );

  defaultOption.value = "";

  defaultOption.textContent =
    defaultText;

  element.appendChild(
    defaultOption
  );


  values.forEach(
    value => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        value;

      option.textContent =
        value;

      element.appendChild(
        option
      );

    }
  );


  if (
    values.includes(oldValue)
  ) {

    element.value =
      oldValue;

  }

}


// ============================================================
// POPULATE FILTERS
// ============================================================

function populateFilters() {

  fillSelect(
    districtFilter,
    uniq(
      records.map(
        r => r.district
      )
    ),
    "सभी जिले"
  );


  fillSelect(
    blockFilter,
    uniq(
      records.map(
        r => r.block
      )
    ),
    "सभी ब्लॉक"
  );


  fillSelect(
    villageFilter,
    uniq(
      records.map(
        r => r.village
      )
    ),
    "सभी गाँव"
  );

}


// ============================================================
// FILTER EVENTS
// ============================================================

[
  districtFilter,
  blockFilter,
  villageFilter,
  genderFilter
].forEach(
  element => {

    element.addEventListener(
      "change",
      renderDashboard
    );

  }
);


searchFilter.addEventListener(
  "input",
  renderDashboard
);


// ============================================================
// FILTER RECORDS
// ============================================================

function filteredRecords() {

  const district =
    districtFilter.value;

  const block =
    blockFilter.value;

  const village =
    villageFilter.value;

  const gender =
    genderFilter.value;

  const query =
    searchFilter.value
      .trim()
      .toLowerCase();


  return records.filter(
    record => {

      const districtMatch =
        !district ||
        record.district ===
        district;


      const blockMatch =
        !block ||
        record.block ===
        block;


      const villageMatch =
        !village ||
        record.village ===
        village;


      const genderMatch =
        !gender ||
        record.gender ===
        gender;


      const searchMatch =
        !query ||
        [
          record.participantName,
          record.email,
          record.mobile,
          record.fatherName,
          record.gotra,
          record.totem
        ]
          .some(
            value =>
              String(
                value || ""
              )
                .toLowerCase()
                .includes(
                  query
                )
          );


      return (
        districtMatch &&
        blockMatch &&
        villageMatch &&
        genderMatch &&
        searchMatch
      );

    }
  );

}


// ============================================================
// RENDER DASHBOARD
// ============================================================

function renderDashboard() {

  const list =
    filteredRecords();


  // Total

  document.getElementById(
    "totalCount"
  ).textContent =
    records.length;


  // Male

  document.getElementById(
    "maleCount"
  ).textContent =
    records.filter(
      r =>
        r.gender ===
        "पुरुष"
    ).length;


  // Female

  document.getElementById(
    "femaleCount"
  ).textContent =
    records.filter(
      r =>
        r.gender ===
        "महिला"
    ).length;


  // Other

  document.getElementById(
    "otherCount"
  ).textContent =
    records.filter(
      r =>
        ![
          "पुरुष",
          "महिला"
        ].includes(
          r.gender
        )
    ).length;


  // Visible

  document.getElementById(
    "visibleCount"
  ).textContent =
    list.length;


  renderTable(list);


  renderSummary(
    "districtSummary",
    list,
    "district"
  );


  renderSummary(
    "blockSummary",
    list,
    "block"
  );


  renderSummary(
    "villageSummary",
    list,
    "village"
  );

}


// ============================================================
// FORMAT DATE
// ============================================================

function formatTimestamp(
  timestamp
) {

  if (
    timestamp &&
    typeof timestamp.toDate ===
      "function"
  ) {

    return timestamp
      .toDate()
      .toLocaleString(
        "hi-IN"
      );

  }


  if (
    timestamp instanceof Date
  ) {

    return timestamp
      .toLocaleString(
        "hi-IN"
      );

  }


  return "—";

}


// ============================================================
// RENDER TABLE
// ============================================================

function renderTable(list) {

  if (!list.length) {

    recordsBody.innerHTML =
      `
      <tr>
        <td colspan="9"
            class="empty-row">
          कोई रिकॉर्ड नहीं मिला।
        </td>
      </tr>
      `;

    return;
  }


  recordsBody.innerHTML =
    list.map(
      (record, index) => {

        return `
        <tr>

          <td>${index + 1}</td>

          <td>
            ${esc(
              record.participantName
            )}
          </td>

          <td>
            ${esc(
              record.gender
            )}
          </td>

          <td>
            ${esc(
              record.district
            )}
          </td>

          <td>
            ${esc(
              record.block
            )}
          </td>

          <td>
            ${esc(
              record.village
            )}
          </td>

          <td>
            ${esc(
              record.mobile
            )}
          </td>

          <td>
            ${esc(
              record.email
            )}
          </td>

          <td>

            <button
              type="button"
              class="print-row-btn"
              data-id="${esc(record.id)}">
              प्रिंट
            </button>

          </td>

        </tr>
        `;

      }
    ).join("");


  recordsBody
    .querySelectorAll(
      "button[data-id]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const record =
              records.find(
                r =>
                  r.id ===
                  button.dataset.id
              );

            printRecord(record);

          }
        );

      }
    );

}


// ============================================================
// SUMMARY
// ============================================================

function renderSummary(
  elementId,
  list,
  key
) {

  const counts = {};


  list.forEach(
    record => {

      const value =
        String(
          record[key] ||
          "(जानकारी नहीं)"
        );


      counts[value] =
        (counts[value] || 0) + 1;

    }
  );


  const items =
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


  const element =
    document.getElementById(
      elementId
    );


  if (!element) {

    return;
  }


  element.innerHTML =
    items.length

      ? `
        <div class="summary-list">

          ${items.map(
            ([name, count]) => `
              <div class="summary-row">
                <span>${esc(name)}</span>
                <strong>${count}</strong>
              </div>
            `
          ).join("")}

        </div>
        `

      : `
        <p class="privacy-note">
          कोई रिकॉर्ड नहीं
        </p>
        `;

}


// ============================================================
// PRINT SINGLE RECORD
// ============================================================

function printRecord(record) {

  if (!record) {

    return;
  }


  const rows = [

    ["महासभा", record.mahasabha],

    [
      "अन्य महासभा",
      record.otherMahasabha
    ],

    [
      "प्रतिभागी का नाम",
      record.participantName
    ],

    ["गोत्र", record.gotra],

    ["टोटम", record.totem],

    [
      "पिता का नाम",
      record.fatherName
    ],

    ["जन्मतिथि", record.dob],

    ["ईमेल", record.email],

    ["मोबाइल", record.mobile],

    ["लिंग", record.gender],

    ["जिला", record.district],

    ["ब्लॉक", record.block],

    ["गाँव / नगर", record.village],

    ["पूरा पता", record.address],

    [
      "नियम एवं शर्तें",
      record.termsAccepted
    ],

    [
      "जानकारी पुष्टि",
      record.informationConfirmed
    ],

    [
      "स्थिति",
      record.status
    ],

    [
      "पंजीयन समय",
      formatTimestamp(
        record.createdAt
      )
    ]

  ];


  const htmlRows =
    rows
      .filter(
        ([, value]) =>
          value !== undefined &&
          value !== null &&
          value !== ""
      )
      .map(
        ([label, value]) => `
          <tr>
            <th>${esc(label)}</th>
            <td>${esc(value)}</td>
          </tr>
        `
      )
      .join("");


  printHtml(
    "पंजीयन प्रति",
    htmlRows
  );

}


// ============================================================
// PRINT HTML
// ============================================================

function printHtml(
  title,
  rows
) {

  const logoUrl =
    new URL(
      "assets/logo.webp",
      window.location.href
    ).href;


  const win =
    window.open(
      "",
      "_blank",
      "width=900,height=900"
    );


  if (!win) {

    showMessage(
      "प्रिंट विंडो नहीं खुली। कृपया Pop-up की अनुमति दें।",
      "error"
    );

    return;
  }


  win.document.write(`

<!doctype html>

<html lang="hi">

<head>

<meta charset="utf-8">

<title>
${esc(title)}
</title>

<style>

body{
  font-family:
    Arial,
    "Noto Sans Devanagari",
    sans-serif;

  padding:28px;

  color:#163b39;
}

header{
  text-align:center;

  border-bottom:
    2px solid #0d6f6c;

  padding-bottom:12px;
}

header img{
  width:80px;
  height:80px;

  object-fit:contain;
}

h1{
  font-size:22px;
  margin:8px 0;
}

h2{
  font-size:18px;
  margin:4px 0;
}

table{
  width:100%;

  border-collapse:
    collapse;

  margin-top:20px;
}

th,
td{
  border:
    1px solid #bbb;

  padding:9px;

  text-align:left;

  vertical-align:top;
}

th{
  width:34%;

  background:#f0f7f6;
}

.print-button{
  margin-top:20px;

  padding:10px 20px;
}

@media print{

  .noprint{
    display:none;
  }

  body{
    padding:0;
  }

}

</style>

</head>

<body>

<header>

<img
  src="${logoUrl}"
  alt="समाज लोगो"
>

<h1>
अखिल भारतीय आदिवासी हल्बा हल्बी समाज
</h1>

<h2>
बालोद महासभा
</h2>

<p>
${esc(title)}
</p>

</header>

<table>

${rows}

</table>

<div class="noprint">

<button
  class="print-button"
  onclick="window.print()">

प्रिंट करें

</button>

</div>

<script>

window.onload = function(){

  setTimeout(
    function(){
      window.print();
    },
    300
  );

};

<\/script>

</body>

</html>

  `);


  win.document.close();

}


// ============================================================
// PRINT FILTERED LIST
// ============================================================

printListBtn.addEventListener(
  "click",
  () => {

    const list =
      filteredRecords();


    if (!list.length) {

      showMessage(
        "प्रिंट करने के लिए कोई रिकॉर्ड नहीं है।",
        "error"
      );

      return;
    }


    const header = `

      <tr>

        <th>क्रम</th>

        <th>नाम</th>

        <th>लिंग</th>

        <th>जिला</th>

        <th>ब्लॉक</th>

        <th>गाँव</th>

        <th>मोबाइल</th>

        <th>ईमेल</th>

      </tr>

    `;


    const rows =
      list.map(
        (record, index) => `

          <tr>

            <td>${index + 1}</td>

            <td>
              ${esc(
                record.participantName
              )}
            </td>

            <td>
              ${esc(
                record.gender
              )}
            </td>

            <td>
              ${esc(
                record.district
              )}
            </td>

            <td>
              ${esc(
                record.block
              )}
            </td>

            <td>
              ${esc(
                record.village
              )}
            </td>

            <td>
              ${esc(
                record.mobile
              )}
            </td>

            <td>
              ${esc(
                record.email
              )}
            </td>

          </tr>

        `
      ).join("");


    printHtml(
      "पंजीयन सूची",
      header + rows
    );

  }
);
