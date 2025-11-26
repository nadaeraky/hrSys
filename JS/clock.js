// JS/clock.js

// ==========================================================
// 1. تعريف بيانات الموظفين (Placeholder for Backend Data)
// ==========================================================
// **ملاحظة للـ Backend:** هذه البيانات يجب أن يتم جلبها من API لاحقاً.
const employeesData = [
  {
    name: "د/ سارة الهادي",
    department: "في قسم العلوم الاساسية",
    departmentKey: "basic-science",
    clockInTime: "09:05",
    avatar: "IMAGE/saraElhady.jpg",
  },
  {
    name: "د/ سارة الجلاد",
    department: "في قسم العلوم الاساسية",
    departmentKey: "basic-science",
    clockInTime: "09:00",
    avatar: "IMAGE/saraELgalad.png",
  },
  {
    name: "أ.د/ خالد منصور",
    department: "في قسم الهندسة المدنية",
    departmentKey: "civil-engineering",
    clockInTime: "09:20",
    avatar: "IMAGE/saraElhady.jpg",
  },
  {
    name: "د/ أميرة فؤاد",
    department: "في قسم الهندسة الكيميائية",
    departmentKey: "chemical-engineering",
    clockInTime: "09:35",
    avatar: "IMAGE/saraELgalad.png",
  },
  {
    name: "د/ محمد علي",
    department: "في قسم هندسة الأتصالات و الألكترونيات",
    departmentKey: "tele-electronics",
    clockInTime: "10:15",
    avatar: "IMAGE/saraELgalad.png",
  },
  {
    name: "أ.م.د/ سلمى أحمد",
    department: "في قسم العلوم الاساسية",
    departmentKey: "basic-science",
    clockInTime: "08:50", // حضور مبكر
    avatar: "IMAGE/saraElhady.jpg",
  },
];

// مواعيد العمل الثابتة
const WORK_START_HOUR = 9; // 09:00 صباحاً
const WORK_START_MINUTE = 0;

// ==========================================================
// 2. دالة لحساب التأخير
// ==========================================================
/**
 * تحسب التأخير بالدقائق عن وقت بدء العمل المحدد (09:00).
 * @param {string} clockInTime - وقت الدخول بصيغة "HH:MM".
 * @returns {number} - عدد دقائق التأخير. 0 إذا لم يكن هناك تأخير.
 */
function calculateDelayMinutes(clockInTime) {
  const [inHour, inMinute] = clockInTime.split(":").map(Number);
  const workStartMinutes = WORK_START_HOUR * 60 + WORK_START_MINUTE;
  const clockInMinutes = inHour * 60 + inMinute;

  // يتم حساب الفرق إذا كان وقت الدخول بعد وقت بدء العمل
  const delayMinutes = clockInMinutes - workStartMinutes;

  return delayMinutes > 0 ? delayMinutes : 0;
}

// ==========================================================
// 3. دالة لرسم عنصر الموظف (Clock Item)
// ==========================================================
function createClockItemHTML(employee) {
  const delayMinutes = calculateDelayMinutes(employee.clockInTime);
  const isLate = delayMinutes > 0;

  // تحديد الـ Class المناسب (أخضر للحضور في الموعد أو مبكراً، أحمر للتأخير)
  const statusClass = isLate ? "red" : "green";
  const delayText = isLate
    ? `متأخر ${delayMinutes} دقيقة`
    : "حضور في الموعد";
  const clockIcon = isLate ? "fa-exclamation-triangle" : "fa-clock";

  return `
    <div class="clock-item">
        <img src="${employee.avatar}" alt="${employee.name}" class="avatar" />
        <div>
            <strong>${employee.name}</strong>
            <small>${employee.department}</small>
        </div>
        <span class="status-chip ${statusClass}">${employee.clockInTime}</span>
    </div>
    <div class="clock-details">
        <span class="${statusClass === "red" ? "late-entry" : ""}">
            <i class="fas ${clockIcon}"></i> 
            ${delayText}
        </span>
        <span><i class="fas fa-calendar-alt"></i> 2025-11-26</span>
    </div>
    `;
}

// ==========================================================
// 4. دالة لعرض قائمة الحضور المفلترة
// ==========================================================
function renderClockList(filterKey) {
  const container = document.getElementById("clock-list-container");
  if (!container) return; 

  // فلترة البيانات بناءً على المفتاح المحدد
  const filteredEmployees =
    filterKey === "all"
      ? employeesData
      : employeesData.filter((emp) => emp.departmentKey === filterKey);

  // توليد الـ HTML وعرضه
  container.innerHTML = filteredEmployees.map(createClockItemHTML).join("");

  // في حالة عدم وجود نتائج
  if (filteredEmployees.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: var(--text-light); padding: 20px;">لا يوجد سجلات حضور لهذا القسم.</p>';
  }
}

// ==========================================================
// 5. ربط دالة الفلترة مع عنصر الـ Select
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  const filterSelect = document.getElementById("department-filter");

  if (filterSelect) {
    // 5.1. استدعاء الدالة عند تغيير قيمة الـ Select
    filterSelect.addEventListener("change", (event) => {
      renderClockList(event.target.value);
    });

    // 5.2. العرض الأولي (جميع الأقسام)
    renderClockList(filterSelect.value);
  }
});