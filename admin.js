import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
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

/* =========================
   FIREBASE CONFIG
========================= */

const firebaseConfig = {
  apiKey: "AIzaSyDrAvxLdDT9TUbbC9B3p7SsJDTp5XfVuEU",
  authDomain: "halba-register-b23bb.firebaseapp.com",
  projectId: "halba-register-b23bb",
  storageBucket: "halba-register-b23bb.firebasestorage.app",
  messagingSenderId: "514620312693",
  appId: "1:514620312693:web:5259d7df657e96911b3c3c",
  measurementId: "G-162MZWB8RB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* =========================
   ADMIN SETTINGS
========================= */

const ADMIN_USERNAME = "admin";
const ADMIN_EMAIL = "admin@halbasamaj.com";

/* =========================
   DOM
========================= */

const loginPanel = document.getElementById("loginPanel");
const dashboardPanel = document.getElementById("dashboardPanel");

const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");

const adminMessage = document.getElementById("adminMessage");

const refreshBtn = document.getElementById("refreshBtn");
const logoutBtn = document.getElementById("logoutBtn");

const districtFilter = document.getElementById("districtFilter");
const blockFilter = document.getElementById("blockFilter");
const villageFilter = document.getElementById("villageFilter");
const genderFilter = document.getElementById("genderFilter");
const searchFilter = document.getElementById("searchFilter");

const recordsBody = document.getElementById("recordsBody");

const totalCount = document.getElementById("totalCount");
const maleCount = document.getElementById("maleCount");
const femaleCount = document.getElementById("femaleCount");
const otherCount = document.getElementById("otherCount");

const visibleCount = document.getElementById("visibleCount");

const districtSummary = document.getElementById("districtSummary");
const blockSummary = document.getElementById("blockSummary");
const villageSummary = document.getElementById("villageSummary");

const lastUpdated = document.getElementById("lastUpdated");

const printListBtn = document.getElementById("printListBtn");
const downloadExcelBtn = document.getElementById("downloadExcelBtn");

/* =========================
   DATA
========================= */

let records = [];

/* =========================
   MESSAGE
========================= */

function showMessage(message, type = "") {
  if (!adminMessage) return;

  adminMessage.textContent = message;
  adminMessage.className = "message";

  if (type) {
    adminMessage.classList.add(type);
  }
}

/* =========================
   ESCAPE HTML
========================= */

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =========================
   FIRESTORE TIMESTAMP
========================= */

function formatTimestamp(value) {
  if (!value) return "";

  try {
    if (typeof value.toDate === "function") {
      return value.toDate().toLocaleString("hi-IN");
    }

    if (value.seconds) {
      return new Date(value.seconds * 1000).toLocaleString("hi-IN");
    }

    const date = new Date(value);

    if (!isNaN(date.getTime())) {
      return date.toLocaleString("hi-IN");
    }
  } catch (error) {
    console.error(error);
  }

  return String(value);
}

/* =========================
   AUTH STATE
========================= */

onAuthStateChanged(auth, async (user) => {

  if (user && user.email === ADMIN_EMAIL) {

    loginPanel.classList.add("hidden");
    dashboardPanel.classList.remove("hidden");

    showMessage("एडमिन लॉगिन सफल।", "success");

    await loadData();

  } else {

    loginPanel.classList.remove("hidden");
    dashboardPanel.classList.add("hidden");

  }

});

/* =========================
   LOGIN
========================= */

loginForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  const formData = new FormData(loginForm);

  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (username !== ADMIN_USERNAME) {
    showMessage("❌ गलत यूज़रनेम।", "error");
    return;
  }

  if (!password) {
    showMessage("❌ पासवर्ड डालें।", "error");
    return;
  }

  loginBtn.disabled = true;

  const oldText = loginBtn.innerHTML;
  loginBtn.innerHTML = "<span>लॉगिन हो रहा है...</span>";

  try {

    await signInWithEmailAndPassword(
      auth,
      ADMIN_EMAIL,
      password
    );

    loginForm.reset();

  } catch (error) {

    console.error(error);

    let message = "❌ लॉगिन असफल।";

    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password" ||
      error.code === "auth/user-not-found"
    ) {
      message = "❌ यूज़रनेम या पासवर्ड गलत है।";
    }

    showMessage(message, "error");

  } finally {

    loginBtn.disabled = false;
    loginBtn.innerHTML = oldText;

  }

});

/* =========================
   LOAD FIRESTORE DATA
========================= */

async function loadData() {

  try {

    showMessage("डेटा लोड हो रहा है...", "info");

    const registrationsRef = collection(db, "registrations");

    let snapshot;

    try {

      const q = query(
        registrationsRef,
        orderBy("createdAt", "desc")
      );

      snapshot = await getDocs(q);

    } catch (error) {

      console.warn(
        "createdAt order query failed. Loading without order.",
        error
      );

      snapshot = await getDocs(registrationsRef);

    }

    records = [];

    snapshot.forEach((docSnap) => {

      records.push({
        id: docSnap.id,
        ...docSnap.data()
      });

    });

    records.sort((a, b) => {

      const aTime = getTimeValue(a.createdAt);
      const bTime = getTimeValue(b.createdAt);

      return bTime - aTime;

    });

    populateFilters();
    renderDashboard();

    const now = new Date();

    lastUpdated.textContent =
      "अंतिम अपडेट: " +
      now.toLocaleString("hi-IN");

    showMessage(
      `✅ ${records.length} पंजीयन रिकॉर्ड लोड हुए।`,
      "success"
    );

  } catch (error) {

    console.error("Firestore load error:", error);

    showMessage(
      "❌ डेटा लोड नहीं हो पाया। Firestore Rules और Firebase Config जाँचें।",
      "error"
    );

    recordsBody.innerHTML =
      `<tr><td colspan="10">डेटा लोड नहीं हुआ।</td></tr>`;

  }

}

/* =========================
   TIMESTAMP VALUE
========================= */

function getTimeValue(value) {

  if (!value) return 0;

  try {

    if (typeof value.toDate === "function") {
      return value.toDate().getTime();
    }

    if (value.seconds) {
      return Number(value.seconds) * 1000;
    }

    const time = new Date(value).getTime();

    return isNaN(time) ? 0 : time;

  } catch (error) {

    return 0;

  }

}

/* =========================
   UNIQUE VALUES
========================= */

function uniqueValues(field) {

  return [
    ...new Set(
      records
        .map(record => String(record[field] || "").trim())
        .filter(Boolean)
    )
  ].sort((a, b) =>
    a.localeCompare(b, "hi")
  );

}

/* =========================
   POPULATE FILTERS
========================= */

function populateFilters() {

  const oldDistrict = districtFilter.value;
  const oldBlock = blockFilter.value;
  const oldVillage = villageFilter.value;

  districtFilter.innerHTML =
    `<option value="">सभी जिले</option>`;

  uniqueValues("district").forEach(value => {

    districtFilter.insertAdjacentHTML(
      "beforeend",
      `<option value="${esc(value)}">${esc(value)}</option>`
    );

  });

  districtFilter.value = oldDistrict;

  populateBlockFilter(oldBlock);
  populateVillageFilter(oldVillage);

}

/* =========================
   BLOCK FILTER
========================= */

function populateBlockFilter(selectedValue = "") {

  const selectedDistrict = districtFilter.value;

  let values = records
    .filter(record => {
      if (!selectedDistrict) return true;
      return String(record.district || "") === selectedDistrict;
    })
    .map(record =>
      String(record.block || "").trim()
    )
    .filter(Boolean);

  values = [...new Set(values)].sort((a, b) =>
    a.localeCompare(b, "hi")
  );

  blockFilter.innerHTML =
    `<option value="">सभी ब्लॉक</option>`;

  values.forEach(value => {

    blockFilter.insertAdjacentHTML(
      "beforeend",
      `<option value="${esc(value)}">${esc(value)}</option>`
    );

  });

  if (values.includes(selectedValue)) {
    blockFilter.value = selectedValue;
  }

}

/* =========================
   VILLAGE FILTER
========================= */

function populateVillageFilter(selectedValue = "") {

  const selectedDistrict = districtFilter.value;
  const selectedBlock = blockFilter.value;

  let values = records
    .filter(record => {

      if (
        selectedDistrict &&
        String(record.district || "") !== selectedDistrict
      ) {
        return false;
      }

      if (
        selectedBlock &&
        String(record.block || "") !== selectedBlock
      ) {
        return false;
      }

      return true;

    })
    .map(record =>
      String(record.village || "").trim()
    )
    .filter(Boolean);

  values = [...new Set(values)].sort((a, b) =>
    a.localeCompare(b, "hi")
  );

  villageFilter.innerHTML =
    `<option value="">सभी गाँव</option>`;

  values.forEach(value => {

    villageFilter.insertAdjacentHTML(
      "beforeend",
      `<option value="${esc(value)}">${esc(value)}</option>`
    );

  });

  if (values.includes(selectedValue)) {
    villageFilter.value = selectedValue;
  }

}

/* =========================
   FILTER EVENTS
========================= */

districtFilter.addEventListener("change", () => {

  populateBlockFilter();
  populateVillageFilter();

  renderDashboard();

});

blockFilter.addEventListener("change", () => {

  populateVillageFilter();

  renderDashboard();

});

villageFilter.addEventListener(
  "change",
  renderDashboard
);

genderFilter.addEventListener(
  "change",
  renderDashboard
);

searchFilter.addEventListener(
  "input",
  renderDashboard
);

/* =========================
   FILTERED RECORDS
========================= */

function filteredRecords() {

  const district = districtFilter.value;
  const block = blockFilter.value;
  const village = villageFilter.value;
  const gender = genderFilter.value;

  const search =
    String(searchFilter.value || "")
      .trim()
      .toLowerCase();

  return records.filter(record => {

    if (
      district &&
      String(record.district || "") !== district
    ) {
      return false;
    }

    if (
      block &&
      String(record.block || "") !== block
    ) {
      return false;
    }

    if (
      village &&
      String(record.village || "") !== village
    ) {
      return false;
    }

    if (
      gender &&
      String(record.gender || "") !== gender
    ) {
      return false;
    }

    if (search) {

      const searchable = [
        record.participantName,
        record.email,
        record.mobile,
        record.fatherName,
        record.gotra,
        record.totem,
        record.district,
        record.block,
        record.relatedBlock,
        record.village
      ]
        .map(value =>
          String(value || "").toLowerCase()
        )
        .join(" ");

      if (!searchable.includes(search)) {
        return false;
      }

    }

    return true;

  });

}

/* =========================
   RENDER DASHBOARD
========================= */

function renderDashboard() {

  const list = filteredRecords();

  visibleCount.textContent = list.length;

  totalCount.textContent = records.length;

  maleCount.textContent =
    records.filter(
      r => String(r.gender || "") === "पुरुष"
    ).length;

  femaleCount.textContent =
    records.filter(
      r => String(r.gender || "") === "महिला"
    ).length;

  otherCount.textContent =
    records.filter(r => {

      const gender = String(r.gender || "");

      return (
        gender !== "पुरुष" &&
        gender !== "महिला"
      );

    }).length;

  renderTable(list);
  renderSummary(list);

}

/* =========================
   RENDER TABLE
========================= */

function renderTable(list) {

  if (!list.length) {

    recordsBody.innerHTML =
      `<tr>
        <td colspan="10">
          कोई रिकॉर्ड नहीं मिला।
        </td>
      </tr>`;

    return;

  }

  recordsBody.innerHTML = list
    .map((record, index) => {

      return `
        <tr>
          <td>${index + 1}</td>

          <td>
            <strong>${esc(record.participantName)}</strong>
          </td>

          <td>${esc(record.gender)}</td>

          <td>${esc(record.district)}</td>

          <td>${esc(record.block)}</td>

          <td>${esc(record.village)}</td>

          <td>${esc(record.mobile)}</td>

          <td>${esc(record.email)}</td>

          <td>
            <button
              type="button"
              class="secondary-btn"
              onclick="window.printRegistration('${esc(record.id)}')"
            >
              प्रिंट
            </button>
          </td>

        </tr>
      `;

    })
    .join("");

}

/* =========================
   SUMMARY
========================= */

function makeSummary(list, field) {

  const map = {};

  list.forEach(record => {

    const value =
      String(record[field] || "नहीं बताया").trim();

    map[value] = (map[value] || 0) + 1;

  });

  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) =>
      `<div class="summary-row">
        <span>${esc(name)}</span>
        <strong>${count}</strong>
      </div>`
    )
    .join("");

}

function renderSummary(list) {

  districtSummary.innerHTML =
    makeSummary(list, "district") ||
    "<p>कोई डेटा नहीं।</p>";

  blockSummary.innerHTML =
    makeSummary(list, "block") ||
    "<p>कोई डेटा नहीं।</p>";

  villageSummary.innerHTML =
    makeSummary(list, "village") ||
    "<p>कोई डेटा नहीं।</p>";

}

/* =========================
   REFRESH
========================= */

refreshBtn.addEventListener(
  "click",
  loadData
);

/* =========================
   LOGOUT
========================= */

logoutBtn.addEventListener(
  "click",
  async () => {

    try {

      await signOut(auth);

      showMessage(
        "आप सफलतापूर्वक लॉगआउट हो गए।",
        "success"
      );

    } catch (error) {

      console.error(error);

      showMessage(
        "❌ लॉगआउट नहीं हो पाया।",
        "error"
      );

    }

  }
);

/* =========================
   PRINT SINGLE RECORD
========================= */

window.printRegistration = function (id) {

  const record = records.find(
    item => item.id === id
  );

  if (!record) {

    showMessage(
      "❌ रिकॉर्ड नहीं मिला।",
      "error"
    );

    return;

  }

  const rows = [
    ["पंजीयन ID", record.id],
    ["महासभा", record.mahasabha],
    ["अन्य महासभा", record.otherMahasabha],
    ["प्रतिभागी का नाम", record.participantName],
    ["गोत्र", record.gotra],
    ["टोटम", record.totem],
    ["पिता का नाम", record.fatherName],
    ["जन्मतिथि", record.dob],
    ["लिंग", record.gender],
    ["ईमेल", record.email],
    ["कॉन्टेक्ट नम्बर", record.mobile],
    ["जिला", record.district],
    ["संबंधित ब्लॉक", record.relatedBlock],
    ["ब्लॉक / विकासखंड", record.block],
    ["गाँव / नगर", record.village],
    ["पूरा पता", record.address],
    ["नियम एवं शर्तें", record.termsAccepted],
    ["जानकारी पुष्टि", record.informationConfirmed],
    ["स्थिति", record.status],
    ["पंजीयन समय", formatTimestamp(record.createdAt)]
  ];

  const html = `
    <!doctype html>
    <html lang="hi">
    <head>
      <meta charset="utf-8">
      <title>पंजीयन विवरण</title>

      <style>
        @page {
          size: A4 portrait;
          margin: 12mm;
        }

        * {
          box-sizing: border-box;
        }

        body {
          font-family:
            Arial,
            "Noto Sans Devanagari",
            sans-serif;

          margin: 0;
          color: #222;
        }

        h1 {
          text-align: center;
          margin: 0 0 4px;
          font-size: 22px;
        }

        h2 {
          text-align: center;
          margin: 0 0 18px;
          font-size: 16px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          border: 1px solid #777;
          padding: 7px 9px;
          text-align: left;
          vertical-align: top;
        }

        th {
          width: 30%;
          background: #f2f2f2;
        }

        .footer {
          margin-top: 18px;
          text-align: center;
          font-size: 11px;
        }
      </style>
    </head>

    <body>

      <h1>अखिल भारतीय आदिवासी हलबा हलबी समाज</h1>
      <h2>पंजीयन विवरण</h2>

      <table>
        ${rows.map(([label, value]) => `
          <tr>
            <th>${esc(label)}</th>
            <td>${esc(value)}</td>
          </tr>
        `).join("")}
      </table>

      <div class="footer">
        Powered by Aaryan Chiram
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      <\/script>

    </body>
    </html>
  `;

  printHtml(html);

};

/* =========================
   PRINT HTML
========================= */

function printHtml(html) {

  const printWindow = window.open(
    "",
    "_blank",
    "width=900,height=700"
  );

  if (!printWindow) {

    showMessage(
      "❌ Popup blocked है। Browser में popup allow करें।",
      "error"
    );

    return;

  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

}

/* =========================
   PRINT LIST
========================= */

printListBtn.addEventListener(
  "click",
  () => {

    const list = filteredRecords();

    if (!list.length) {

      showMessage(
        "❌ प्रिंट करने के लिए कोई रिकॉर्ड नहीं है।",
        "error"
      );

      return;

    }

    const rows = list
      .map((record, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${esc(record.participantName)}</td>
          <td>${esc(record.gender)}</td>
          <td>${esc(record.district)}</td>
          <td>${esc(record.relatedBlock)}</td>
          <td>${esc(record.block)}</td>
          <td>${esc(record.village)}</td>
          <td>${esc(record.mobile)}</td>
          <td>${esc(record.email)}</td>
        </tr>
      `)
      .join("");

    const html = `
      <!doctype html>
      <html lang="hi">

      <head>

        <meta charset="utf-8">

        <title>पंजीयन सूची</title>

        <style>

          @page {
            size: A4 landscape;
            margin: 8mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            font-family:
              Arial,
              "Noto Sans Devanagari",
              sans-serif;

            margin: 0;
            color: #222;
          }

          h1 {
            text-align: center;
            margin: 0 0 3px;
            font-size: 20px;
          }

          h2 {
            text-align: center;
            margin: 0 0 12px;
            font-size: 14px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9px;
          }

          th,
          td {
            border: 1px solid #777;
            padding: 4px;
            vertical-align: top;
          }

          th {
            background: #f2f2f2;
          }

          .footer {
            text-align: center;
            margin-top: 10px;
            font-size: 9px;
          }

        </style>

      </head>

      <body>

        <h1>
          अखिल भारतीय आदिवासी हलबा हलबी समाज
        </h1>

        <h2>
          पंजीयन सूची — कुल ${list.length} रिकॉर्ड
        </h2>

        <table>

          <thead>
            <tr>
              <th>क्रम</th>
              <th>नाम</th>
              <th>लिंग</th>
              <th>जिला</th>
              <th>संबंधित ब्लॉक</th>
              <th>ब्लॉक</th>
              <th>गाँव</th>
              <th>मोबाइल</th>
              <th>ईमेल</th>
            </tr>
          </thead>

          <tbody>
            ${rows}
          </tbody>

        </table>

        <div class="footer">
          Powered by Aaryan Chiram
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        <\/script>

      </body>
      </html>
    `;

    printHtml(html);

  }
);

/* =========================
   EXCEL DOWNLOAD
========================= */

if (downloadExcelBtn) {

  downloadExcelBtn.addEventListener(
    "click",
    downloadExcel
  );

}

function downloadExcel() {

  const list = filteredRecords();

  if (!list.length) {

    showMessage(
      "❌ डाउनलोड करने के लिए कोई रिकॉर्ड नहीं है।",
      "error"
    );

    return;

  }

  /* SheetJS library check */

  if (
    typeof XLSX === "undefined"
  ) {

    showMessage(
      "❌ Excel Library लोड नहीं हुई। Internet connection जाँचें।",
      "error"
    );

    return;

  }

  const exportData = list.map(
    (record, index) => ({

      "क्रम": index + 1,

      "पंजीयन ID":
        record.id || "",

      "महासभा":
        record.mahasabha || "",

      "अन्य महासभा":
        record.otherMahasabha || "",

      "प्रतिभागी का नाम":
        record.participantName || "",

      "गोत्र":
        record.gotra || "",

      "टोटम":
        record.totem || "",

      "पिता का नाम":
        record.fatherName || "",

      "जन्मतिथि":
        record.dob || "",

      "लिंग":
        record.gender || "",

      "ईमेल":
        record.email || "",

      "मोबाइल":
        record.mobile || "",

      "जिला":
        record.district || "",

      "संबंधित ब्लॉक":
        record.relatedBlock || "",

      "ब्लॉक / विकासखंड":
        record.block || "",

      "गाँव / नगर":
        record.village || "",

      "पूरा पता":
        record.address || "",

      "नियम एवं शर्तें":
        record.termsAccepted || "",

      "जानकारी पुष्टि":
        record.informationConfirmed || "",

      "स्थिति":
        record.status || "",

      "पंजीयन समय":
        formatTimestamp(record.createdAt)

    })
  );

  const worksheet =
    XLSX.utils.json_to_sheet(exportData);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "पंजीयन डेटा"
  );

  /* Column widths */

  const headers =
    Object.keys(exportData[0]);

  worksheet["!cols"] =
    headers.map(header => ({
      wch: Math.min(
        Math.max(header.length + 5, 12),
        30
      )
    }));

  /* Freeze first row */

  worksheet["!freeze"] = {
    xSplit: 0,
    ySplit: 1
  };

  const date = new Date();

  const dateText =
    date.toISOString().slice(0, 10);

  XLSX.writeFile(
    workbook,
    `Halba-Samaj-Registration-${dateText}.xlsx`
  );

  showMessage(
    `✅ ${list.length} रिकॉर्ड Excel में डाउनलोड हो गए।`,
    "success"
  );

}
