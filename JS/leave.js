//  open a modal
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "block";
  }
}

//  close a modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}

document
  .querySelectorAll(".close-btn, .modal-footer button[data-modal]")
  .forEach((element) => {
    element.addEventListener("click", (e) => {
      const modalId =
        e.currentTarget.getAttribute("data-modal") ||
        e.currentTarget.closest(".modal").id;
      // استدعاء دالة الأغلاق
      closeModal(modalId);
    });
  });

// اغلاق النافدة عند الضغط خارجها
window.addEventListener("click", (event) => {
  document.querySelectorAll(".modal").forEach((modal) => {
    if (event.target === modal) {
      closeModal(modal.id);
    }
  });
});

// filter and search
const leaveTableBody = document.getElementById("leave-table-body");
const leaveTypeFilter = document.getElementById("leave-type-filter");
const tableSearchInput = document.getElementById("table-search-input");

// Function to apply filters and search
function applyTableFilters() {
  const selectedType = leaveTypeFilter.value;
  const searchText = tableSearchInput.value.toLowerCase().trim();

  document.querySelectorAll("#leave-table-body tr").forEach((row) => {
    const leaveType = row.getAttribute("data-leave-type");
    const employeeName = row
      .querySelector("[data-employee-name]")
      .textContent.toLowerCase();

    const typeMatch = selectedType === "all" || leaveType === selectedType;

    const searchMatch = employeeName.includes(searchText);

    if (typeMatch && searchMatch) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// تحديث الجدول
leaveTypeFilter.addEventListener("change", applyTableFilters);
tableSearchInput.addEventListener("input", applyTableFilters);

// نافدة البحث
document.querySelectorAll(".delete-icon").forEach((icon) => {
  icon.addEventListener("click", (e) => {
    const leaveId = e.currentTarget.getAttribute("data-id");
    const row = e.currentTarget.closest("tr");
    const employeeName = row
      .querySelector("[data-employee-name]")
      .textContent.trim();

    document.getElementById("delete-employee-name").textContent = employeeName;
    document
      .getElementById("confirm-delete-btn")
      .setAttribute("data-leave-id", leaveId);

    openModal("delete-modal");
  });
});

// Confirmation button handler
document.getElementById("confirm-delete-btn").addEventListener("click", (e) => {
  const leaveIdToDelete = e.currentTarget.getAttribute("data-leave-id");

  console.log(`Sending request to delete leave with ID: ${leaveIdToDelete}`);

  const rowToDelete = document.querySelector(
    `tr[data-leave-id="${leaveIdToDelete}"]`
  );
  if (rowToDelete) {
    rowToDelete.remove();
    console.log(`Leave ID ${leaveIdToDelete} deleted successfully from UI.`);
  }
  closeModal("delete-modal");
});

// edit window
document.querySelectorAll(".edit-icon").forEach((icon) => {
  icon.addEventListener("click", (e) => {
    const leaveId = e.currentTarget.getAttribute("data-id");
    const row = e.currentTarget.closest("tr");

    const employeeName = row
      .querySelector("[data-employee-name]")
      .textContent.trim();
    const leaveType = row.getAttribute("data-leave-type");
    const startDate = row.children[3].textContent.trim();
    const endDate = row.children[4].textContent.trim();

    const formatDateForInput = (dateStr) => {
      const parts = dateStr.split("-");
      return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : "";
    };

    // Populate the modal form
    document.getElementById("edit-leave-id").value = leaveId;
    document.getElementById("edit-employee-name").value = employeeName;
    document.getElementById("edit-leave-type").value = leaveType;
    document.getElementById("edit-start-date").value =
      formatDateForInput(startDate);
    document.getElementById("edit-end-date").value =
      formatDateForInput(endDate);

    openModal("edit-modal");
  });
});

// Save Edit button handler
document.getElementById("save-edit-btn").addEventListener("click", () => {
  const leaveIdToEdit = document.getElementById("edit-leave-id").value;
  const newType = document.getElementById("edit-leave-type").value;
  const newStartDate = document.getElementById("edit-start-date").value;
  const newEndDate = document.getElementById("edit-end-date").value;

  // لحساب عدد الايام
  const calculateDays = (start, end) => {
    const date1 = new Date(start);
    const date2 = new Date(end);
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    return diffDays;
  };

  // console.log(`Sending request to update leave ID ${leaveIdToEdit} with new data...`);

  // updated data after input it unto form^^
  const rowToUpdate = document.querySelector(
    `tr[data-leave-id="${leaveIdToEdit}"]`
  );
  if (rowToUpdate) {
    const formatForDisplay = (dateStr) => {
      const parts = dateStr.split("-");
      return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : "";
    };

    const days = calculateDays(newStartDate, newEndDate);
    const typeText = document.querySelector(
      `#edit-leave-type option[value="${newType}"]`
    ).textContent;

    rowToUpdate.setAttribute("data-leave-type", newType);
    rowToUpdate.children[2].querySelector(
      "[data-leave-type-text]"
    ).textContent = typeText;
    rowToUpdate.children[3].textContent = formatForDisplay(newStartDate);
    rowToUpdate.children[4].textContent = formatForDisplay(newEndDate);
    rowToUpdate.children[5].textContent = `${days} أيام`;
    rowToUpdate
      .querySelector(".info-icon")
      .setAttribute("data-type-info", newType);

    // console.log(`Leave ID ${leaveIdToEdit} updated successfully in UI.`);
  }

  closeModal("edit-modal");
});

// explaination window
const leaveInfo = {
  Annual: {
    name: "إجازة سنوية",
    description:
      "إجازة يتمتع بها الموظف كل عام لأغراض الترفيه والاستراحة. يتم احتسابها من رصيده السنوي المخصص.",
    maxDays: "30 يومًا",
  },
  Casual: {
    name: "إجازة عارضة",
    description:
      "إجازة قصيرة وغير مخطط لها تُمنح للموظف في حالات الطوارئ الشخصية أو الظروف المفاجئة.",
    maxDays: "7 أيام في السنة",
  },
  Medical: {
    name: "إجازة مرضية",
    description:
      "إجازة تُمنح للموظف عند المرض، وتتطلب تقديم تقرير طبي رسمي. يتم احتسابها وفقًا للوائح الشركة.",
    maxDays: "حسب التقرير الطبي",
  },
};

document.querySelectorAll(".info-icon").forEach((icon) => {
  icon.addEventListener("click", (e) => {
    const leaveTypeKey = e.currentTarget.getAttribute("data-type-info");
    const info = leaveInfo[leaveTypeKey];

    if (info) {
      document.getElementById("info-leave-type-name").textContent = info.name;
      document.getElementById("info-leave-description").textContent =
        info.description;
      document.getElementById("info-max-days").textContent = info.maxDays;
      openModal("info-modal");
    } else {
      console.error("Info not found for type:", leaveTypeKey);
    }
  });
});
