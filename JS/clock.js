const employeesData = [
  {
    name: "أ.د خالد سمير محمد",
    department: "في قسم العلوم الاساسية",
    departmentKey: "basic-science",
    clockInTime: "09:05",
    avatar: "IMAGE/saraElhady.jpg",
  },
  {
    name: "د.ياسر محمد توفيق علي",
    department: "في قسم الهندسة الكيميائية",
    departmentKey: "chemical-engineering",
    clockInTime: "09:00",
    avatar: "IMAGE/saraELgalad.png",
  },
  {
    name: "د. أيمن محمد هلال",
    department: "في قسم الهندسة المدنية",
    departmentKey: "civil-engineering",
    clockInTime: "09:20",
    avatar: "IMAGE/saraElhady.jpg",
  },
  {
    name: "أ.م.د.سهير محمد بكر عمر",
    department: "في قسم الهندسة الكيميائية",
    departmentKey: "chemical-engineering",
    clockInTime: "09:35",
    avatar: "IMAGE/saraELgalad.png",
  },
];

// مواعيد العمل الثابتة
const WORK_START_HOUR = 9;
const WORK_START_MINUTE = 0;

// دالة لحساب التأخير
/**
 * @param {string} clockInTime
 * @returns {number}
 */
function calculateDelayMinutes(clockInTime) {
  const [inHour, inMinute] = clockInTime.split(":").map(Number);
  const workStartMinutes = WORK_START_HOUR * 60 + WORK_START_MINUTE;
  const clockInMinutes = inHour * 60 + inMinute;

  const delayMinutes = clockInMinutes - workStartMinutes;

  return delayMinutes > 0 ? delayMinutes : 0;
}

// دالة لرسم عنصر الموظف (Clock Item)
function createClockItemHTML(employee) {
  const delayMinutes = calculateDelayMinutes(employee.clockInTime);
  const isLate = delayMinutes > 0;

  const statusClass = isLate ? "red" : "green";
  const delayText = isLate ? `متأخر ${delayMinutes} دقيقة` : "حضور في الموعد";
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

//  دالة لعرض قائمة الحضور المفلترة
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

// ربط دالة الفلترة مع عنصر الـ Select

document.addEventListener("DOMContentLoaded", () => {
  const filterSelect = document.getElementById("department-filter");

  if (filterSelect) {
    //  استدعاء الدالة عند تغيير قيمة الـ Select
    filterSelect.addEventListener("change", (event) => {
      renderClockList(event.target.value);
    });

    //  العرض الأولي (جميع الأقسام)
    renderClockList(filterSelect.value);
  }
});

// بيانات الموظفين الأساسية مع سنة الانضمام (للفلترة حسب السنة)
const employeesStatusData = [
  { type: "أعضاء هيئة التدريس", count: 47, percentage: 42, joinYear: 2025 },
  { type: "الأداريين", count: 15, percentage: 15, joinYear: 2025 },
  { type: "أعضاء هيئة معاونة", count: 20, percentage: 20, joinYear: 2025 },
  { type: " تحت التدريب ", count: 10, percentage: 10, joinYear: 2025 },

  { type: "أعضاء هيئة التدريس", count: 50, percentage: 50, joinYear: 2024 },
  { type: "الأداريين", count: 15, percentage: 15, joinYear: 2024 },
  { type: "أعضاء هيئة معاونة", count: 30, percentage: 30, joinYear: 2024 },
  { type: " تحت التدريب ", count: 5, percentage: 5, joinYear: 2024 },

  { type: "أعضاء هيئة التدريس", count: 65, percentage: 65, joinYear: 2023 },
  { type: "الأداريين", count: 25, percentage: 25, joinYear: 2023 },
  { type: "أعضاء هيئة معاونة", count: 10, percentage: 10, joinYear: 2023 },
  { type: " تحت التدريب ", count: 0, percentage: 0, joinYear: 2023 },
];

/**
 * دالة لرسم عنصر حالة الموظفين (Status Item)
 * @param {object} statusItem
 * @returns {string}
 */
function createStatusItemHTML(statusItem) {
  return `
    <div class="status-item">
        <h4><span class="label"> ${statusItem.type} (${statusItem.percentage}%)</span></h4>
        <p>${statusItem.count} موظف</p>
    </div>
  `;
}

/**
 * @param {string} filterYear
 */
function renderEmployeeStatusList(filterYear) {
  const container = document.getElementById("employee-status-list");
  if (!container) return;

  // الفلترة: إذا كانت القيمة 'all' لا يتم تطبيق فلترة
  const filteredData =
    filterYear === "all"
      ? employeesStatusData
      : employeesStatusData.filter(
          (item) => item.joinYear.toString() === filterYear
        );

  // توليد الـ HTML وعرضه
  container.innerHTML = filteredData.map(createStatusItemHTML).join("");

  // تحديث إجمالي عدد الموظفين (اختياري)
  const totalCount = filteredData.reduce((sum, item) => sum + item.count, 0);
  const totalElement = document.querySelector(".employee-status .total span");
  if (totalElement) {
    totalElement.textContent = totalCount;
  }

  // في حالة عدم وجود نتائج
  if (filteredData.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: var(--text-light); padding: 10px;">لا توجد بيانات لهذه السنة.</p>';
  }
}

// ربط دالة الفلترة مع عنصر الـ Select عند تحميل الصفحة بالكامل
document.addEventListener("DOMContentLoaded", () => {
  const filterSelect = document.getElementById("employee-status-filter");

  if (filterSelect) {
    filterSelect.addEventListener("change", (event) => {
      renderEmployeeStatusList(event.target.value);
    });

    renderEmployeeStatusList(filterSelect.value);
  }
});
