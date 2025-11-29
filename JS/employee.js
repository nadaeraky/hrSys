const modal = document.getElementById("add-employee-modal");
const btn = document.querySelector(".add-employee-btn");
const span = document.querySelector(".close-btn");
const form = document.getElementById("add-employee-form");
const employeeGrid = document.querySelector(".employee-grid");
const designationFilter = document.getElementById("designation-filter");

// filter employee
function filterEmployeesByDesignation() {
  const selectedDesignation = designationFilter.value;

  const cards = document.querySelectorAll(".employee-card");

  cards.forEach((card) => {
    const cardDesignation = card.dataset.designation;

    if (selectedDesignation === "" || cardDesignation === selectedDesignation) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

// عند حدوث اي تغير من اليوزر استدعي دالة الفلتر
designationFilter.addEventListener("change", filterEmployeesByDesignation);

// delete button
function addDeleteListener(cardElement) {
  const deleteBtn = cardElement.querySelector(".delete-employee-btn");
  if (deleteBtn) {
    deleteBtn.onclick = function () {
      cardElement.remove();
      filterEmployeesByDesignation();
    };
  }
}
// تفعيل زر الحدف
document.querySelectorAll(".employee-card").forEach((card) => {
  addDeleteListener(card);
});

// اظهار نافدة أضافة موظف
btn.onclick = function () {
  modal.style.display = "flex";
};
// أخفاء نافدة أضافة موظف
span.onclick = function () {
  modal.style.display = "none";
};
// عند الضغط علي اي مكان في الشاشة أغلاق النافدة
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function createEmployeeCard(name, role, email, phone, imageSrc) {
  const card = document.createElement("div");
  card.className = "card employee-card";
  card.dataset.designation = role;

  card.innerHTML = `
    <div class="card-header-icon delete-employee-btn" title="حذف الموظف">
      <i class="fas fa-trash-alt"></i>
    </div>
    <img
      src="${imageSrc}"
      alt="Avatar"
      class="employee-avatar"
    />
    <div class="employee-details">
      <h3>${name}</h3>
      <p class="role">${role}</p>
    </div>

    <div class="employee-actions">
      <a href="mailto:${email}" class="action-link">
        <i class="fas fa-envelope action-icon"></i>
      </a>
      <a href="tel:${phone}" class="action-link">
        <i class="fas fa-phone action-icon"></i>
      </a>
    </div>
  `;
  return card;
}

form.onsubmit = function (event) {
  // منع اعادة تحميل الصفحة
  event.preventDefault();

  const name = document.getElementById("employee-name").value;
  const designation = document.getElementById("employee-designation").value;
  const email = document.getElementById("employee-email").value;
  const phone = document.getElementById("employee-phone").value;
  const image = document.getElementById("employee-image").value;

  const newEmployeeCard = createEmployeeCard(
    name,
    designation,
    email,
    phone,
    image
  );
  // أضافه الكارد اول واحدة
  employeeGrid.prepend(newEmployeeCard);

  addDeleteListener(newEmployeeCard);

  modal.style.display = "none";
  form.reset();

  filterEmployeesByDesignation();
};
