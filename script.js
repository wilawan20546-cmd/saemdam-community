import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDz0iJHJPZ7i7ZbQlHK9W9xcsmQU8sIS1c",
  authDomain: "update-4a1f3.firebaseapp.com",
  projectId: "update-4a1f3",
  storageBucket: "update-4a1f3.firebasestorage.app",
  messagingSenderId: "842420110442",
  appId: "1:842420110442:web:21e3e7fb9979d097f33613",
  measurementId: "G-LNB41NMMEG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function showSection(sectionId) {
  const sections = document.querySelectorAll(".page");

  sections.forEach(section => {
    section.classList.remove("active");
  });

  document
    .getElementById(sectionId)
    .classList.add("active");
}
window.showSection = showSection;

let repairs = [];

let repairPage = 1;
let renovationPage = 1;
let adminRepairPage = 1;
let adminRenovationPage = 1;
const itemsPerPage = 5;

const repairForm = document.getElementById("repairForm");
const repairTrackingList = document.getElementById("repairTrackingList");
const trackingSearch =
  document.getElementById("trackingSearch");

function generateRepairCode() {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  const number = repairs.length + 1;

  const runningNumber = String(number)
    .padStart(4, "0");

  return `R-${year}-${month}-${day}-${runningNumber}`;
}

repairForm.addEventListener("submit", async function(event) {
  event.preventDefault();

  const repairSubmitBtn =
    document.getElementById("repairSubmitBtn");

  repairSubmitBtn.disabled = true;
  repairSubmitBtn.textContent = "กำลังส่ง...";

 const trackingCode = generateRepairCode();

  await addDoc(collection(db, "repairs"), {
    trackingCode: trackingCode,
    name: document.getElementById("repairName").value,
    house: document.getElementById("repairHouse").value,
    phone: document.getElementById("repairPhone").value,
    issue: document.getElementById("repairIssue").value,
    detail: document.getElementById("repairDetail").value,
    status: "รับเรื่องแล้ว",
    createdAt: serverTimestamp()
  });
await new Promise(resolve => setTimeout(resolve, 1000));
  repairForm.reset();
  repairSubmitBtn.disabled = false;
repairSubmitBtn.textContent = "ส่งคำร้องแจ้งซ่อม";

 showToast("ส่งคำร้องเรียบร้อย เลขติดตามคือ " + trackingCode);
  showSection("tracking");
});

function renderRepairTracking() {
  repairTrackingList.innerHTML = "";

  const start = (repairPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const keyword = trackingSearch.value.toLowerCase();

const filteredRepairs = repairs.filter(function(item) {
  return item.trackingCode
    .toLowerCase()
    .includes(keyword);
});

const totalPages = Math.ceil(filteredRepairs.length / itemsPerPage);

const pageItems = filteredRepairs.slice(start, end);
  
  if (filteredRepairs.length === 0) {
  repairTrackingList.innerHTML = `
    <div class="tracking-card">
      ไม่พบรายการแจ้งซ่อมที่ตรงกับเลขติดตามนี้
    </div>
  `;
  return;
}

  pageItems.forEach(function(item) {
    repairTrackingList.innerHTML += `
      <div class="tracking-card">
        <h3>${item.trackingCode}</h3>
        <p><strong>สถานะ:</strong> ${item.status}</p>
        <p><strong>ปัญหา:</strong> ${item.issue}</p>
      </div>
    `;
  });

  repairTrackingList.innerHTML += `
    <div class="pagination">
      <button onclick="changeRepairPage(-1)" ${repairPage === 1 ? "disabled" : ""}>
        ก่อนหน้า
      </button>

      <span>หน้า ${repairPage} / ${totalPages || 1}</span>

      <button onclick="changeRepairPage(1)" ${repairPage >= totalPages ? "disabled" : ""}>
        ถัดไป
      </button>
    </div>
  `;
}
function changeRepairPage(direction) {
  const totalPages = Math.ceil(repairs.length / itemsPerPage);

  repairPage += direction;

  if (repairPage < 1) repairPage = 1;
  if (repairPage > totalPages) repairPage = totalPages;

  renderRepairTracking();
}

window.changeRepairPage = changeRepairPage;

let renovations = [];

const renovationForm = document.getElementById("renovationForm");
const renovationTrackingList = document.getElementById("renovationTrackingList");

function generateRenovationCode() {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  const number = renovations.length + 1;

  const runningNumber = String(number)
    .padStart(4, "0");

  return `N-${year}-${month}-${day}-${runningNumber}`;
}

renovationForm.addEventListener("submit", async function(event) {
  event.preventDefault();
  
const renovationSubmitBtn =
  document.getElementById("renovationSubmitBtn");

renovationSubmitBtn.disabled = true;
renovationSubmitBtn.textContent = "กำลังส่ง...";
  
const trackingCode = generateRenovationCode();

  await addDoc(collection(db, "renovations"), {
    trackingCode: trackingCode,
    name: document.getElementById("renoName").value,
    house: document.getElementById("renoHouse").value,
    phone: document.getElementById("renoPhone").value,
    type: document.getElementById("renoType").value,
    startDate: document.getElementById("renoStart").value,
    endDate: document.getElementById("renoEnd").value,
    detail: document.getElementById("renoDetail").value,
    status: "รอตรวจสอบคำร้อง",
    createdAt: serverTimestamp()
  });
await new Promise(resolve => setTimeout(resolve, 1000));
  renovationForm.reset();
 renovationSubmitBtn.disabled = false;
renovationSubmitBtn.textContent = "ส่งคำร้องรีโนเวท";

  showToast("ส่งคำร้องเรียบร้อย เลขติดตามคือ " + trackingCode);
  showSection("tracking");
});

function renderRenovationTracking() {
  renovationTrackingList.innerHTML = "";

  const start = (renovationPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

const keyword = trackingSearch.value.toLowerCase();

const filteredRenovations = renovations.filter(function(item) {
  return item.trackingCode
    .toLowerCase()
    .includes(keyword);
});

const totalPages = Math.ceil(filteredRenovations.length / itemsPerPage);

const pageItems = filteredRenovations.slice(start, end);
  
  if (filteredRenovations.length === 0) {
  renovationTrackingList.innerHTML = `
    <div class="tracking-card">
      ไม่พบรายการรีโนเวทที่ตรงกับเลขติดตามนี้
    </div>
  `;
  return;
}

  pageItems.forEach(function(item) {
    renovationTrackingList.innerHTML += `
      <div class="tracking-card">
        <h3>${item.trackingCode}</h3>
        <p><strong>ชื่อ:</strong> ${item.name}</p>
        <p><strong>บ้านเลขที่:</strong> ${item.house}</p>
        <p><strong>ประเภท:</strong> ${item.type}</p>
        <p><strong>สถานะ:</strong> ${item.status}</p>
      </div>
    `;
  });

  renovationTrackingList.innerHTML += `
    <div class="pagination">
      <button onclick="changeRenovationPage(-1)" ${renovationPage === 1 ? "disabled" : ""}>
        ก่อนหน้า
      </button>

      <span>หน้า ${renovationPage} / ${totalPages || 1}</span>

      <button onclick="changeRenovationPage(1)" ${renovationPage >= totalPages ? "disabled" : ""}>
        ถัดไป
      </button>
    </div>
  `;
}
function changeRenovationPage(direction) {
  const totalPages = Math.ceil(renovations.length / itemsPerPage);

  renovationPage += direction;

  if (renovationPage < 1) renovationPage = 1;
  if (renovationPage > totalPages) renovationPage = totalPages;

  renderRenovationTracking();
}

window.changeRenovationPage = changeRenovationPage;

let isAdmin = false;

const admins = [
  {
    username: "admin1",
    password: "admin1",
    role: "ผู้จัดการ"
  },

  {
    username: "admin2",
    password: "admin2",
    role: "นิติ 1"
  },

  {
    username: "admin3",
    password: "admin3",
    role: "นิติ 2"
  },

  {
    username: "samaedum_dev",
    password: "1544",
    role: "samaedum-support"
  }
];

function adminLogin() {
  const username = document.getElementById("adminUsername").value;
  const password = document.getElementById("adminPassword").value;

  const matchedAdmin = admins.find(function(admin) {
    return admin.username === username && admin.password === password;
  });

  if (matchedAdmin) {
    isAdmin = true;

    document.getElementById("adminLoginBox").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";

    // showToast("เข้าสู่ระบบผู้ดูแลสำเร็จ");

    renderAdminAnnouncements();
    renderAdminRepair();
    renderAdminRenovation();
    updateDashboard();
  } else {
    showToast("Username หรือ Password ไม่ถูกต้อง");
  }
}

window.adminLogin = adminLogin;

function renderAdminRepair() {
  const container = document.getElementById("adminRepairList");

  container.innerHTML = "";

  const start = (adminRepairPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const pageItems = repairs.slice(start, end);
  const totalPages = Math.ceil(repairs.length / itemsPerPage);

  pageItems.forEach(function(item, index) {
    const realIndex = start + index;

    container.innerHTML += `
      <div class="tracking-card">
        <h3>${item.trackingCode}</h3>
        <p><strong>ผู้แจ้ง:</strong> ${item.name}</p>
        <p><strong>บ้านเลขที่:</strong> ${item.house}</p>
        <p><strong>เบอร์โทร:</strong> <a href="tel:${item.phone}">${item.phone}</a></p>
        <p><strong>ปัญหา:</strong> ${item.issue}</p>
        
        <p><strong>วันที่แจ้ง:</strong> ${
    item.createdAt?.toDate().toLocaleDateString("th-TH")
}</p>

        <select onchange="updateRepairStatus(${realIndex}, this.value)">
          <option value="รับเรื่องแล้ว" ${item.status === "รับเรื่องแล้ว" ? "selected" : ""}>รับเรื่องแล้ว</option>
          <option value="กำลังตรวจสอบ" ${item.status === "กำลังตรวจสอบ" ? "selected" : ""}>กำลังตรวจสอบ</option>
          <option value="กำลังดำเนินการ" ${item.status === "กำลังดำเนินการ" ? "selected" : ""}>กำลังดำเนินการ</option>
          <option value="เสร็จสิ้น" ${item.status === "เสร็จสิ้น" ? "selected" : ""}>เสร็จสิ้น</option>
        </select>
        <button onclick="deleteRepair('${item.id}')">
  ลบรายการ
</button>
      </div>
    `;
  });

  container.innerHTML += `
    <div class="pagination">
      <button onclick="changeAdminRepairPage(-1)" ${adminRepairPage === 1 ? "disabled" : ""}>
        ก่อนหน้า
      </button>

      <span>หน้า ${adminRepairPage} / ${totalPages || 1}</span>

      <button onclick="changeAdminRepairPage(1)" ${adminRepairPage >= totalPages ? "disabled" : ""}>
        ถัดไป
      </button>
    </div>
  `;
}

async function updateRepairStatus(index, status) {
  const item = repairs[index];

  await updateDoc(doc(db, "repairs", item.id), {
    status: status
  });
}

window.updateRepairStatus = updateRepairStatus;

function renderAdminRenovation() {
  const container = document.getElementById("adminRenovationList");

  container.innerHTML = "";

  const start = (adminRenovationPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const pageItems = renovations.slice(start, end);
  const totalPages = Math.ceil(renovations.length / itemsPerPage);

  pageItems.forEach(function(item, index) {
    const realIndex = start + index;

    container.innerHTML += `
      <div class="tracking-card">
        <h3>${item.trackingCode}</h3>
        <p>${item.type}</p>
        <p><strong>ผู้แจ้ง:</strong> ${item.name}</p>
        <p><strong>บ้านเลขที่:</strong> ${item.house}</p>
        <p><strong>ประเภท:</strong> ${item.type}</p>
        <p><strong>เบอร์โทร:</strong> <a href="tel:${item.phone}">${item.phone}</a></p>
        <p><strong>วันที่แจ้ง:</strong> ${
  item.createdAt?.toDate().toLocaleDateString("th-TH")
}</p>

        <select onchange="updateRenovationStatus(${realIndex}, this.value)">
          <option value="รอตรวจสอบคำร้อง" ${item.status === "รอตรวจสอบคำร้อง" ? "selected" : ""}>รอตรวจสอบคำร้อง</option>
          <option value="กำลังตรวจสอบ" ${item.status === "กำลังตรวจสอบ" ? "selected" : ""}>กำลังตรวจสอบ</option>
          <option value="อนุมัติแล้ว" ${item.status === "อนุมัติแล้ว" ? "selected" : ""}>อนุมัติแล้ว</option>
          <option value="ไม่อนุมัติ" ${item.status === "ไม่อนุมัติ" ? "selected" : ""}>ไม่อนุมัติ</option>
        </select>
        <button onclick="deleteRenovation('${item.id}')">
  ลบรายการ
</button>
      </div>
    `;
  });

  container.innerHTML += `
    <div class="pagination">
      <button onclick="changeAdminRenovationPage(-1)" ${adminRenovationPage === 1 ? "disabled" : ""}>
        ก่อนหน้า
      </button>

      <span>หน้า ${adminRenovationPage} / ${totalPages || 1}</span>

      <button onclick="changeAdminRenovationPage(1)" ${adminRenovationPage >= totalPages ? "disabled" : ""}>
        ถัดไป
      </button>
    </div>
  `;
}
function changeAdminRenovationPage(direction) {
  const totalPages = Math.ceil(renovations.length / itemsPerPage);

  adminRenovationPage += direction;

  if (adminRenovationPage < 1) adminRenovationPage = 1;
  if (adminRenovationPage > totalPages) adminRenovationPage = totalPages;

  renderAdminRenovation();
}

window.changeAdminRenovationPage = changeAdminRenovationPage;

function changeAdminRepairPage(direction) {
  const totalPages = Math.ceil(repairs.length / itemsPerPage);

  adminRepairPage += direction;

  if (adminRepairPage < 1) adminRepairPage = 1;
  if (adminRepairPage > totalPages) adminRepairPage = totalPages;

  renderAdminRepair();
}

window.changeAdminRepairPage = changeAdminRepairPage;

async function updateRenovationStatus(index, status) {
  const item = renovations[index];

  await updateDoc(doc(db, "renovations", item.id), {
    status: status
  });
}

window.updateRenovationStatus = updateRenovationStatus;

onSnapshot(
  query(collection(db, "repairs"), orderBy("createdAt", "desc")),
  function(snapshot) {
    
  repairs = [];

  snapshot.forEach(function(document) {
    repairs.push({
      id: document.id,
      ...document.data()
    });
  });

  renderRepairTracking();
    updateDashboard();

  if (isAdmin) {
    renderAdminRepair();
  }
});

onSnapshot(
  query(collection(db, "renovations"), orderBy("createdAt", "desc")),
  function(snapshot) {
    
  renovations = [];

  snapshot.forEach(function(document) {
    renovations.push({
      id: document.id,
      ...document.data()
    });
  });

  renderRenovationTracking();
    updateDashboard();

  if (isAdmin) {
    renderAdminRenovation();
  }
});
let announcements = [];

const announcementForm =
  document.getElementById("announcementForm");

const announcementList =
  document.getElementById("announcementList");


announcementForm.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();
    
const announcementSubmitBtn =
  document.getElementById("announcementSubmitBtn");

announcementSubmitBtn.disabled = true;
announcementSubmitBtn.textContent = "กำลังเพิ่ม...";
    
    await addDoc(
      collection(db, "announcements"),
      {
        title:
          document.getElementById("announceTitle").value,

        date:
          document.getElementById("announceDate").value,

        detail:
          document.getElementById("announceDetail").value,

        createdAt:
          serverTimestamp()
      }
    );
await new Promise(resolve => setTimeout(resolve, 1000));
    announcementForm.reset();
announcementSubmitBtn.disabled = false;
announcementSubmitBtn.textContent = "เพิ่มประกาศ";
    showToast("เพิ่มประกาศเรียบร้อย");

  }
);
onSnapshot(
  query(collection(db, "announcements"), orderBy("createdAt", "desc")),
  function(snapshot) {

    announcements = [];

    snapshot.forEach(function(document) {

      announcements.push({
        id: document.id,
        ...document.data()
      });

    });

    renderAnnouncements();

if (isAdmin) {
  renderAdminAnnouncements();
}
  }
);
function renderAnnouncements() {
  announcementList.innerHTML = "";

  announcements.forEach(function(item) {
    announcementList.innerHTML += `
      <div class="tracking-card">
        <h3>📢 ${item.title}</h3>
        <p><strong>วันที่:</strong> ${item.date}</p>
        <p>${item.detail}</p>
      </div>
    `;
  });
}
function renderAdminAnnouncements() {

  adminAnnouncementList.innerHTML = "";

  announcements.forEach(function(item) {

    adminAnnouncementList.innerHTML += `
      <div class="tracking-card">

        <h3>${item.title}</h3>

        <p>
          <strong>วันที่:</strong>
          ${item.date}
        </p>

        <p>
          ${item.detail}
        </p>

        <button onclick="deleteAnnouncement('${item.id}')">
          ลบประกาศ
        </button>

      </div>
    `;

  });

}
async function deleteAnnouncement(id) {

  const confirmDelete =
    confirm("ต้องการลบประกาศนี้ใช่ไหม?");

  if (!confirmDelete) {
    return;
  }

  await deleteDoc(
    doc(db, "announcements", id)
  );

}

window.deleteAnnouncement =
  deleteAnnouncement;

async function deleteRepair(id) {
  const confirmDelete = confirm("ต้องการลบรายการแจ้งซ่อมนี้ใช่ไหม?");

  if (!confirmDelete) return;

  await deleteDoc(doc(db, "repairs", id));
}

window.deleteRepair = deleteRepair;
async function deleteRenovation(id) {
  const confirmDelete = confirm("ต้องการลบรายการรีโนเวทนี้ใช่ไหม?");

  if (!confirmDelete) return;

  await deleteDoc(doc(db, "renovations", id));
}

window.deleteRenovation = deleteRenovation;

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(function() {
    toast.classList.remove("show");
  }, 2500);
}

window.showToast = showToast;
trackingSearch.addEventListener("input", function() {
  repairPage = 1;
  renovationPage = 1;

  renderRepairTracking();
  renderRenovationTracking();
});
function updateDashboard() {
  const totalRepairCount =
    repairs.length;

  const totalRenovationCount =
    renovations.length;

  const doneCount =
    repairs.filter(item => item.status === "เสร็จสิ้น").length +
    renovations.filter(item => item.status === "อนุมัติแล้ว").length;

  const pendingCount =
    repairs.filter(item => item.status !== "เสร็จสิ้น").length +
    renovations.filter(item => item.status !== "อนุมัติแล้ว").length;

  document.getElementById("totalRepairCount").textContent =
    totalRepairCount;

  document.getElementById("totalRenovationCount").textContent =
    totalRenovationCount;

  document.getElementById("doneCount").textContent =
    doneCount;

  document.getElementById("pendingCount").textContent =
    pendingCount;
}
