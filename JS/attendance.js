// 1. تعريف بيانات الموظفين
const ATTENDANCE_DATA = [
  {
    id: 101,
    name: "د/ خالد منصور",
    department: "الهندسة المدنية",
    deptKey: "civil-engineering",
    clockIn: "08:55",
    clockOut: "16:05",
  },
  {
    id: 102,
    name: "د/ سارة الهادي",
    department: "العلوم الأساسية",
    deptKey: "basic-science",
    clockIn: "09:15",
    clockOut: "17:00",
  },
  {
    id: 103,
    name: "أ/ محمد علي",
    department: "الاتصالات والإلكترونيات",
    deptKey: "tele-electronics",
    clockIn: "09:00",
    clockOut: "15:45",
  },
  {
    id: 104,
    name: "أ/ أميرة فؤاد",
    department: "الهندسة الكيميائية",
    deptKey: "chemical-engineering",
    clockIn: "10:30",
    clockOut: "16:10",
  },
  {
    id: 105,
    name: "م/ أحمد جلال",
    department: "الهندسة المدنية",
    deptKey: "civil-engineering",
    clockIn: "09:05",
    clockOut: "16:00",
  },
  {
    id: 106,
    name: "م/ نادية سعيد",
    department: "العلوم الأساسية",
    deptKey: "basic-science",
    clockIn: "00:00",
    clockOut: "00:00",
  }, // غائب
];

// لحساب مواعيد العمل
const WORK_START_MINUTES = 9 * 60 + 0;
const WORK_END_MINUTES = 16 * 60 + 0;
const REQUIRED_HOURS = 7;

// الأعمدة التي سيتم تصديرها إلى Excel
const EXPORT_COLUMNS = [
  { header: "اسم الموظف", key: "name" },
  { header: "القسم", key: "department" },
  { header: "الدخول (بصمة)", key: "clockIn" },
  { header: "الخروج (بصمة)", key: "clockOut" },
  { header: "التأخير", key: "delay" },
  { header: "الخروج المبكر", key: "earlyExit" },
  { header: "إجمالي ساعات العمل", key: "totalWork" },
  { header: "الحالة", key: "statusText" },
];

//  لحساب الوقت بالدقائق
function timeToMinutes(time) {
  if (time === "00:00") return 0;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// لتحويل الوقت الي ساعات
function minutesToHHMM(minutes) {
  if (minutes <= 0) return "0h 0m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function calculateAttendanceStatus(clockIn, clockOut) {
  const inMinutes = timeToMinutes(clockIn);
  const outMinutes = timeToMinutes(clockOut);

  if (clockIn === "00:00" && clockOut === "00:00") {
    return {
      delay: "غائب",
      earlyExit: "غائب",
      totalWork: "0h 0m",
      status: "absent",
    };
  }

  const delayMinutes =
    inMinutes > WORK_START_MINUTES ? inMinutes - WORK_START_MINUTES : 0;
  const earlyExitMinutes =
    outMinutes < WORK_END_MINUTES ? WORK_END_MINUTES - outMinutes : 0;
  const totalWorkMinutes = outMinutes > inMinutes ? outMinutes - inMinutes : 0;
  let status = "on-time";

  if (delayMinutes > 0) {
    status = "late";
  } else if (earlyExitMinutes > 0 && outMinutes > 0) {
    status = "early";
  }

  // هترجع object
  return {
    delay: delayMinutes > 0 ? minutesToHHMM(delayMinutes) : "-",
    earlyExit: earlyExitMinutes > 0 ? minutesToHHMM(earlyExitMinutes) : "-",
    totalWork: minutesToHHMM(totalWorkMinutes),
    status: status,
  };
}

//  دالة لرسم صف في الجدول (لم تتغير)
function createTableRowHTML(employee, index) {
  const { delay, earlyExit, totalWork, status } = calculateAttendanceStatus(
    employee.clockIn,
    employee.clockOut
  );

  let statusText = "";
  switch (status) {
    case "late":
      statusText = "متأخر";
      break;
    case "early":
      statusText = "خروج مبكر";
      break;
    case "on-time":
      statusText = "في الموعد";
      break;
    case "absent":
      statusText = "غائب";
      break;
  }

  const delayClass =
    delay === "-" || delay === "غائب" ? "" : "status-badge late";
  const earlyExitClass =
    earlyExit === "-" || earlyExit === "غائب" ? "" : "status-badge early";

  return `
    <tr>
        <td>${index + 1}</td>
        <td>${employee.name}</td>
        <td>${employee.department}</td>
        <td><i class="fas fa-sign-in-alt text-green"></i> ${
          employee.clockIn
        }</td>
        <td><i class="fas fa-sign-out-alt text-red"></i> ${
          employee.clockOut !== "00:00" ? employee.clockOut : "-"
        }</td>
        <td><span class="${delayClass}">${delay}</span></td>
        <td><span class="${earlyExitClass}">${earlyExit}</span></td>
        <td>${totalWork}</td>
        <td><span class="status-badge ${status}">${statusText}</span></td>
    </tr>
    `;
}

// ==========================================================
// 4. دالة الفلترة والعرض الرئيسية (لم تتغير)
// ==========================================================
function renderAttendanceTable() {
  const deptFilter = document.getElementById("dept-filter").value;
  const statusFilter = document.getElementById("status-filter").value;
  const tbody = document.getElementById("attendance-tbody");
  const recordCountSpan = document.getElementById("record-count");

  let filteredData = ATTENDANCE_DATA.filter((employee) => {
    const matchesDept = deptFilter === "all" || employee.deptKey === deptFilter;
    if (!matchesDept) return false;

    if (statusFilter === "all") return true;

    const { status } = calculateAttendanceStatus(
      employee.clockIn,
      employee.clockOut
    );
    return status === statusFilter;
  });

  const tableHTML = filteredData.map(createTableRowHTML).join("");
  tbody.innerHTML = tableHTML;
  recordCountSpan.textContent = `(${filteredData.length} موظف)`;
}

//   تحول مصفوفة البيانات إلى سلسلة نصية بصيغة CSV.
function convertDataToCSV(data) {
  // BOM لضمان عرض الأحرف العربية بشكل صحيح في Excel
  let csv = "\ufeff";

  // 1. Headers (الصف الأول)
  const headers = EXPORT_COLUMNS.map((col) => col.header);
  csv += headers.join(",") + "\n";

  // 2. Data Rows (صفوف البيانات)
  data.forEach((employee) => {
    const statusData = calculateAttendanceStatus(
      employee.clockIn,
      employee.clockOut
    );

    const rowData = {
      ...employee,
      delay: statusData.delay,
      earlyExit: statusData.earlyExit,
      totalWork: statusData.totalWork,
      statusText:
        statusData.status === "late"
          ? "متأخر"
          : statusData.status === "early"
          ? "خروج مبكر"
          : statusData.status === "on-time"
          ? "في الموعد"
          : "غائب",
      clockOut: employee.clockOut === "00:00" ? "-" : employee.clockOut,
    };

    const values = EXPORT_COLUMNS.map((col) => {
      let value = rowData[col.key];

      if (typeof value === "string") {
        value = value.replace(/"/g, '""');
        if (value.includes(",")) {
          value = `"${value}"`;
        }
      }
      return value;
    });

    csv += values.join(",") + "\n";
  });

  return csv;
}

/**
 * تبدأ عملية تنزيل ملف CSV يحتوي على بيانات الحضور المفلترة.
 */
function exportTableToCSV(filename) {
  // إعادة تنفيذ منطق الفلترة للحصول على البيانات الحالية المعروضة
  const deptFilter = document.getElementById("dept-filter").value;
  const statusFilter = document.getElementById("status-filter").value;

  let filteredData = ATTENDANCE_DATA.filter((employee) => {
    const matchesDept = deptFilter === "all" || employee.deptKey === deptFilter;
    if (!matchesDept) return false;

    const { status } = calculateAttendanceStatus(
      employee.clockIn,
      employee.clockOut
    );
    return statusFilter === "all" || status === statusFilter;
  });

  if (filteredData.length === 0) {
    alert("لا توجد بيانات لتصديرها.");
    return;
  }

  // التحويل والتنزيل
  const csvString = convertDataToCSV(filteredData);

  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==========================================================
// 6. ربط الأحداث
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  const deptFilter = document.getElementById("dept-filter");
  const statusFilter = document.getElementById("status-filter");
  const exportBtn = document.getElementById("export-attendance-btn");

  // ربط الفلاتر بدالة العرض
  deptFilter.addEventListener("change", renderAttendanceTable);
  statusFilter.addEventListener("change", renderAttendanceTable);

  // ربط زر التصدير بدالة التصدير
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const date =
        document.getElementById("date-filter").value || "attendance_report";
      exportTableToCSV(`تقرير_الحضور_${date}.csv`);
    });
  }

  // العرض الأولي للجدول
  renderAttendanceTable();
});
