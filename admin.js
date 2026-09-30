// ============================================================
// HALBA SAMAJ ADMIN DASHBOARD
// SUPABASE VERSION
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
// ADMIN CONFIG
// ============================================================

const ADMIN_USERNAME = "admin";

const ADMIN_EMAIL =
  "aaryanchiram@gmail.com";


// ============================================================
// STATE
// ============================================================

let allRecords = [];

let filteredRecords = [];


// ============================================================
// DOM HELPERS
// ============================================================

function $(id) {
  return document.getElementById(id);
}


function showAdminMessage(
  message,
  type = "error"
) {

  const box =
    $("adminMessage");

  if (!box) return;

  box.textContent = message;

  box.style.display = "block";

  if (type === "success") {

    box.style.background =
      "#e8f5e9";

    box.style.color =
      "#1b5e20";

  } else {

    box.style.background =
      "#ffebee";

    box.style.color =
      "#b71c1c";
  }
}


function clearAdminMessage() {

  const box =
    $("adminMessage");

  if (!box) return;

  box.textContent = "";

  box.style.display = "none";
}


// ============================================================
// DATE FORMAT
// ============================================================

function formatDate(dateValue) {

  if (!dateValue) return "-";

  const date =
    new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return date.toLocaleString(
    "hi-IN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  );
}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// ============================================================
// LOGIN
// ============================================================

async function loginAdmin(event) {

  event.preventDefault();

  clearAdminMessage();

  const username =
    $("username")?.value.trim();

  const password =
    $("password")?.value || "";


  if (
    username.toLowerCase() !==
    ADMIN_USERNAME
  ) {

    showAdminMessage(
      "गलत Admin ID."
    );

    return;
  }


  if (!password) {

    showAdminMessage(
      "पासवर्ड दर्ज करें।"
    );

    return;
  }


  const button =
    $("loginBtn");


  if (button) {

    button.disabled = true;

    button.textContent =
      "Login हो रहा है...";
  }


  try {

    const { data, error } =
      await supabase.auth.signInWithPassword({

        email:
          ADMIN_EMAIL,

        password:
          password
      });


    if (error) {

      console.error(
        "Login error:",
        error
      );

      showAdminMessage(
        "Login असफल: " +
        error.message
      );

      return;
    }


    const user =
      data?.user;


    if (
      !user ||
      user.email?.toLowerCase() !==
      ADMIN_EMAIL.toLowerCase()
    ) {

      await supabase.auth.signOut();

      showAdminMessage(
        "यह account Admin account नहीं है।"
      );

      return;
    }


    $("loginPanel").style.display =
      "none";

    $("dashboardPanel").style.display =
      "block";


    await loadRecords();


  } catch (error) {

    console.error(
      error
    );

    showAdminMessage(
      "Login में तकनीकी समस्या हुई।"
    );

  } finally {

    if (button) {

      button.disabled = false;

      button.textContent =
        "Admin Login";
    }
  }
}


// ============================================================
// CHECK SESSION
// ============================================================

async function checkSession() {

  const {
    data,
    error
  } =
    await supabase.auth.getSession();


  if (error) {

    console.error(
      error
    );

    return;
  }


  const session =
    data?.session;


  if (
    session?.user?.email?.toLowerCase() ===
    ADMIN_EMAIL.toLowerCase()
  ) {

    $("loginPanel").style.display =
      "none";

    $("dashboardPanel").style.display =
      "block";

    await loadRecords();

  } else {

    $("loginPanel").style.display =
      "block";

    $("dashboardPanel").style.display =
      "none";
  }
}


// ============================================================
// LOAD RECORDS
// ============================================================

async function loadRecords() {

  clearAdminMessage();

  const body =
    $("recordsBody");


  if (body) {

    body.innerHTML =
      `<tr>
        <td colspan="20" style="text-align:center;padding:30px;">
          डेटा लोड हो रहा है...
        </td>
      </tr>`;
  }


  try {

    const {
      data,
      error
    } =
      await supabase
        .from("registrations")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false
          }
        );


    if (error) {

      console.error(
        "Load error:",
        error
      );

      showAdminMessage(
        "डेटा लोड नहीं हुआ: " +
        error.message
      );

      return;
    }


    allRecords =
      Array.isArray(data)
        ? data
        : [];


    filteredRecords =
      [...allRecords];


    updateFilters();

    renderTable();

    updateStats();


    const lastUpdated =
      $("lastUpdated");

    if (lastUpdated) {

      lastUpdated.textContent =
        "अंतिम अपडेट: " +
        formatDate(
          new Date()
        );
    }


  } catch (error) {

    console.error(
      error
    );

    showAdminMessage(
      "डेटा लोड करने में समस्या हुई।"
    );
  }
}


// ============================================================
// UNIQUE FILTER VALUES
// ============================================================

function uniqueValues(field) {

  return [
    ...new Set(
      allRecords
        .map(record =>
          String(
            record[field] || ""
          ).trim()
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
// UPDATE FILTERS
// ============================================================

function updateSelect(
  elementId,
  values,
  placeholder
) {

  const select =
    $(elementId);

  if (!select) return;

  const current =
    select.value;


  select.innerHTML =
    `<option value="">${placeholder}</option>`;


  values.forEach(value => {

    const option =
      document.createElement(
        "option"
      );

    option.value =
      value;

    option.textContent =
      value;

    select.appendChild(
      option
    );
  });


  if (
    values.includes(current)
  ) {

    select.value =
      current;
  }
}


function updateFilters() {

  updateSelect(
    "districtFilter",
    uniqueValues("district"),
    "सभी जिले"
  );


  updateSelect(
    "relatedBlockFilter",
    uniqueValues("related_block"),
    "सभी संबंधित ब्लॉक"
  );


  updateSelect(
    "blockFilter",
    uniqueValues("block"),
    "सभी ब्लॉक"
  );


  updateSelect(
    "villageFilter",
    uniqueValues("village"),
    "सभी गाँव / नगर"
  );
}


// ============================================================
// APPLY FILTERS
// ============================================================

function applyFilters() {

  const district =
    $("districtFilter")?.value
    || "";

  const relatedBlock =
    $("relatedBlockFilter")?.value
    || "";

  const block =
    $("blockFilter")?.value
    || "";

  const village =
    $("villageFilter")?.value
    || "";

  const gender =
    $("genderFilter")?.value
    || "";

  const search =
    (
      $("searchFilter")?.value
      || ""
    )
      .trim()
      .toLowerCase();


  filteredRecords =
    allRecords.filter(
      record => {

        if (
          district &&
          record.district !==
          district
        ) {
          return false;
        }


        if (
          relatedBlock &&
          record.related_block !==
          relatedBlock
        ) {
          return false;
        }


        if (
          block &&
          record.block !==
          block
        ) {
          return false;
        }


        if (
          village &&
          record.village !==
          village
        ) {
          return false;
        }


        if (
          gender &&
          record.gender !==
          gender
        ) {
          return false;
        }


        if (search) {

          const searchable = [

            record.registration_id,

            record.participant_name,

            record.father_name,

            record.mobile,

            record.email,

            record.gotra,

            record.totem,

            record.district,

            record.related_block,

            record.block,

            record.village,

            record.address

          ]
            .map(
              value =>
                String(
                  value || ""
                ).toLowerCase()
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


  renderTable();

  updateStats();
}


// ============================================================
// RENDER TABLE
// ============================================================

function renderTable() {

  const body =
    $("recordsBody");

  if (!body) return;


  if (!filteredRecords.length) {

    body.innerHTML =
      `<tr>
        <td colspan="20"
            style="text-align:center;padding:30px;">
          कोई रिकॉर्ड नहीं मिला।
        </td>
      </tr>`;

    return;
  }


  body.innerHTML =
    filteredRecords
      .map(
        (record, index) => {

          return `
          <tr>

            <td>
              ${index + 1}
            </td>

            <td>
              ${escapeHTML(
                record.registration_id
              )}
            </td>

            <td>
              ${escapeHTML(
                record.mahasabha
              )}
              ${
                record.other_mahasabha
                  ? `<br><small>${escapeHTML(
                      record.other_mahasabha
                    )}</small>`
                  : ""
              }
            </td>

            <td>
              ${escapeHTML(
                record.participant_name
              )}
            </td>

            <td>
              ${escapeHTML(
                record.gotra
              )}
            </td>

            <td>
              ${escapeHTML(
                record.totem
              )}
            </td>

            <td>
              ${escapeHTML(
                record.father_name
              )}
            </td>

            <td>
              ${escapeHTML(
                record.dob
              )}
            </td>

            <td>
              ${escapeHTML(
                record.gender
              )}
            </td>

            <td>
              ${escapeHTML(
                record.email
              )}
            </td>

            <td>
              ${escapeHTML(
                record.mobile
              )}
            </td>

            <td>
              ${escapeHTML(
                record.district
              )}
            </td>

            <td>
              ${escapeHTML(
                record.related_block
              )}
            </td>

            <td>
              ${escapeHTML(
                record.block
              )}
            </td>

            <td>
              ${escapeHTML(
                record.village
              )}
            </td>

            <td>
              ${escapeHTML(
                record.address
              )}
            </td>

            <td>
              ${escapeHTML(
                record.status
              )}
            </td>

            <td>
              ${formatDate(
                record.created_at
              )}
            </td>

            <td>
              <button
                class="small-btn"
                onclick="printRecord('${encodeURIComponent(
                  record.registration_id || ""
                )}')">
                Print
              </button>
            </td>

          </tr>
          `;
        }
      )
      .join("");
}


// ============================================================
// STATS
// ============================================================

function updateStats() {

  const total =
    allRecords.length;

  const male =
    allRecords.filter(
      r =>
        r.gender === "पुरुष" ||
        r.gender === "Male"
    ).length;

  const female =
    allRecords.filter(
      r =>
        r.gender === "महिला" ||
        r.gender === "Female"
    ).length;

  const other =
    total -
    male -
    female;


  if ($("totalCount"))
    $("totalCount").textContent =
      total;


  if ($("maleCount"))
    $("maleCount").textContent =
      male;


  if ($("femaleCount"))
    $("femaleCount").textContent =
      female;


  if ($("otherCount"))
    $("otherCount").textContent =
      other;


  if ($("visibleCount"))
    $("visibleCount").textContent =
      filteredRecords.length;


  renderSummary(
    "districtSummary",
    "district"
  );

  renderSummary(
    "relatedBlockSummary",
    "related_block"
  );

  renderSummary(
    "blockSummary",
    "block"
  );

  renderSummary(
    "villageSummary",
    "village"
  );
}


// ============================================================
// SUMMARY
// ============================================================

function renderSummary(
  elementId,
  field
) {

  const element =
    $(elementId);

  if (!element) return;


  const counts = {};


  filteredRecords.forEach(
    record => {

      const value =
        String(
          record[field] || ""
        ).trim();

      if (!value) return;

      counts[value] =
        (counts[value] || 0) + 1;
    }
  );


  const sorted =
    Object.entries(counts)
      .sort(
        (a, b) =>
          b[1] - a[1]
      );


  if (!sorted.length) {

    element.innerHTML =
      "<p>कोई डेटा नहीं</p>";

    return;
  }


  element.innerHTML =
    sorted
      .map(
        ([name, count]) =>
          `<div class="summary-row">
             <span>${escapeHTML(name)}</span>
             <strong>${count}</strong>
           </div>`
      )
      .join("");
}


// ============================================================
// PRINT SINGLE RECORD
// ============================================================

window.printRecord =
  function(encodedId) {

    const registrationId =
      decodeURIComponent(
        encodedId
      );


    const record =
      allRecords.find(
        r =>
          String(
            r.registration_id
          ) ===
          String(
            registrationId
          )
      );


    if (!record) {

      alert(
        "रिकॉर्ड नहीं मिला।"
      );

      return;
    }


    const html = `
<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">

<title>
हल्बा समाज पंजीयन
</title>

<style>

body {
  font-family:
    Arial,
    "Noto Sans Devanagari",
    sans-serif;

  padding: 30px;

  color: #222;
}

h1 {
  text-align: center;
  margin-bottom: 5px;
}

.subtitle {
  text-align: center;
  margin-bottom: 25px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

td, th {
  border: 1px solid #777;
  padding: 9px;
  text-align: left;
}

th {
  width: 30%;
}

.print-btn {
  margin-bottom: 20px;
  padding: 10px 20px;
}

@media print {

  .print-btn {
    display: none;
  }

  body {
    padding: 0;
  }
}

</style>
</head>

<body>

<button
  class="print-btn"
  onclick="window.print()">
  Print
</button>

<h1>
अखिल भारतीय आदिवासी हल्बा हल्बी समाज
</h1>

<div class="subtitle">
पंजीयन विवरण
</div>

<table>

<tr>
<th>पंजीयन क्रमांक</th>
<td>${escapeHTML(record.registration_id)}</td>
</tr>

<tr>
<th>महासभा</th>
<td>${escapeHTML(record.mahasabha)}</td>
</tr>

<tr>
<th>अन्य महासभा</th>
<td>${escapeHTML(record.other_mahasabha)}</td>
</tr>

<tr>
<th>नाम</th>
<td>${escapeHTML(record.participant_name)}</td>
</tr>

<tr>
<th>गोत्र</th>
<td>${escapeHTML(record.gotra)}</td>
</tr>

<tr>
<th>टोटम</th>
<td>${escapeHTML(record.totem)}</td>
</tr>

<tr>
<th>पिता का नाम</th>
<td>${escapeHTML(record.father_name)}</td>
</tr>

<tr>
<th>जन्म तिथि</th>
<td>${escapeHTML(record.dob)}</td>
</tr>

<tr>
<th>लिंग</th>
<td>${escapeHTML(record.gender)}</td>
</tr>

<tr>
<th>ईमेल</th>
<td>${escapeHTML(record.email)}</td>
</tr>

<tr>
<th>मोबाइल</th>
<td>${escapeHTML(record.mobile)}</td>
</tr>

<tr>
<th>वैकल्पिक मोबाइल</th>
<td>${escapeHTML(record.alternate_mobile)}</td>
</tr>

<tr>
<th>जिला</th>
<td>${escapeHTML(record.district)}</td>
</tr>

<tr>
<th>संबंधित ब्लॉक</th>
<td>${escapeHTML(record.related_block)}</td>
</tr>

<tr>
<th>ब्लॉक</th>
<td>${escapeHTML(record.block)}</td>
</tr>

<tr>
<th>गाँव / नगर</th>
<td>${escapeHTML(record.village)}</td>
</tr>

<tr>
<th>पूरा पता</th>
<td>${escapeHTML(record.address)}</td>
</tr>

<tr>
<th>स्थिति</th>
<td>${escapeHTML(record.status)}</td>
</tr>

<tr>
<th>पंजीयन दिनांक</th>
<td>${formatDate(record.created_at)}</td>
</tr>

</table>

</body>
</html>
`;


    const printWindow =
      window.open(
        "",
        "_blank",
        "width=900,height=700"
      );


    if (!printWindow) {

      alert(
        "Popup blocked है। Browser में popup allow करें।"
      );

      return;
    }


    printWindow.document.open();

    printWindow.document.write(
      html
    );

    printWindow.document.close();
};


// ============================================================
// PRINT LIST
// ============================================================

function printList() {

  if (!filteredRecords.length) {

    alert(
      "Print करने के लिए कोई रिकॉर्ड नहीं है।"
    );

    return;
  }


  const rows =
    filteredRecords
      .map(
        (r, index) => `
        <tr>

          <td>${index + 1}</td>

          <td>${escapeHTML(
            r.registration_id
          )}</td>

          <td>${escapeHTML(
            r.participant_name
          )}</td>

          <td>${escapeHTML(
            r.father_name
          )}</td>

          <td>${escapeHTML(
            r.gender
          )}</td>

          <td>${escapeHTML(
            r.mobile
          )}</td>

          <td>${escapeHTML(
            r.district
          )}</td>

          <td>${escapeHTML(
            r.related_block
          )}</td>

          <td>${escapeHTML(
            r.block
          )}</td>

          <td>${escapeHTML(
            r.village
          )}</td>

        </tr>
        `
      )
      .join("");


  const html = `
<!DOCTYPE html>
<html lang="hi">

<head>

<meta charset="UTF-8">

<title>
हल्बा समाज पंजीयन सूची
</title>

<style>

body {
  font-family:
    Arial,
    "Noto Sans Devanagari",
    sans-serif;
}

h1 {
  text-align: center;
}

.info {
  margin-bottom: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #555;
  padding: 6px;
  font-size: 12px;
}

th {
  background: #eee;
}

.print-button {
  margin-bottom: 15px;
  padding: 8px 15px;
}

@media print {

  .print-button {
    display: none;
  }

}

</style>

</head>

<body>

<button
  class="print-button"
  onclick="window.print()">
  Print
</button>

<h1>
अखिल भारतीय आदिवासी हल्बा हल्बी समाज
</h1>

<div class="info">
कुल दिखाई दे रहे रिकॉर्ड:
${filteredRecords.length}
</div>

<table>

<thead>

<tr>
<th>#</th>
<th>पंजीयन क्रमांक</th>
<th>नाम</th>
<th>पिता</th>
<th>लिंग</th>
<th>मोबाइल</th>
<th>जिला</th>
<th>संबंधित ब्लॉक</th>
<th>ब्लॉक</th>
<th>गाँव / नगर</th>
</tr>

</thead>

<tbody>

${rows}

</tbody>

</table>

</body>

</html>
`;


  const printWindow =
    window.open(
      "",
      "_blank",
      "width=1200,height=800"
    );


  if (!printWindow) {

    alert(
      "Popup blocked है।"
    );

    return;
  }


  printWindow.document.open();

  printWindow.document.write(
    html
  );

  printWindow.document.close();
}


// ============================================================
// EXCEL EXPORT
// ============================================================

function downloadExcel() {

  if (
    typeof XLSX ===
    "undefined"
  ) {

    alert(
      "Excel library load नहीं हुई।"
    );

    return;
  }


  if (!filteredRecords.length) {

    alert(
      "Export करने के लिए कोई रिकॉर्ड नहीं है।"
    );

    return;
  }


  const excelData =
    filteredRecords.map(
      (r, index) => ({

        "क्रमांक":
          index + 1,

        "पंजीयन क्रमांक":
          r.registration_id || "",

        "महासभा":
          r.mahasabha || "",

        "अन्य महासभा":
          r.other_mahasabha || "",

        "नाम":
          r.participant_name || "",

        "गोत्र":
          r.gotra || "",

        "टोटम":
          r.totem || "",

        "पिता का नाम":
          r.father_name || "",

        "जन्म तिथि":
          r.dob || "",

        "लिंग":
          r.gender || "",

        "ईमेल":
          r.email || "",

        "मोबाइल":
          r.mobile || "",

        "वैकल्पिक मोबाइल":
          r.alternate_mobile || "",

        "जिला":
          r.district || "",

        "संबंधित ब्लॉक":
          r.related_block || "",

        "ब्लॉक":
          r.block || "",

        "गाँव / नगर":
          r.village || "",

        "पूरा पता":
          r.address || "",

        "स्थिति":
          r.status || "",

        "पंजीयन दिनांक":
          formatDate(
            r.created_at
          )

      })
    );


  const worksheet =
    XLSX.utils.json_to_sheet(
      excelData
    );


  const workbook =
    XLSX.utils.book_new();


  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Registrations"
  );


  const date =
    new Date()
      .toISOString()
      .slice(
        0,
        10
      );


  XLSX.writeFile(
    workbook,
    `Halba-Samaj-Registrations-${date}.xlsx`
  );
}


// ============================================================
// LOGOUT
// ============================================================

async function logoutAdmin() {

  await supabase.auth.signOut();

  allRecords = [];

  filteredRecords = [];


  $("dashboardPanel").style.display =
    "none";

  $("loginPanel").style.display =
    "block";


  if ($("username"))
    $("username").value = "";

  if ($("password"))
    $("password").value = "";


  clearAdminMessage();
}


// ============================================================
// EVENT LISTENERS
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    // Login
    $("loginForm")?.addEventListener(
      "submit",
      loginAdmin
    );


    // Refresh
    $("refreshBtn")?.addEventListener(
      "click",
      loadRecords
    );


    // Logout
    $("logoutBtn")?.addEventListener(
      "click",
      logoutAdmin
    );


    // Filters
    [
      "districtFilter",
      "relatedBlockFilter",
      "blockFilter",
      "villageFilter",
      "genderFilter"
    ].forEach(id => {

      $(id)?.addEventListener(
        "change",
        applyFilters
      );
    });


    // Search
    $("searchFilter")?.addEventListener(
      "input",
      applyFilters
    );


    // Print list
    $("printListBtn")?.addEventListener(
      "click",
      printList
    );


    // Excel
    $("downloadExcelBtn")?.addEventListener(
      "click",
      downloadExcel
    );


    // Session
    checkSession();
  }
);
