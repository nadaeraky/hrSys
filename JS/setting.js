// منطق التبديل بين الأقسام الجانبية (لصفحة الإعدادات فقط)
document.querySelectorAll(".settings-nav a").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    document
      .querySelectorAll(".settings-nav a")
      .forEach((nav) => nav.classList.remove("active-setting"));
    this.classList.add("active-setting");

    const targetId = this.getAttribute("href").substring(1);
    document.querySelectorAll(".setting-section").forEach((section) => {
      section.style.display = "none";
    });
    document.getElementById(targetId).style.display = "block";
  });
});
// عرض القسم العام افتراضياً عند التحميل
document.querySelectorAll(".setting-section").forEach((section, index) => {
  section.style.display = index === 0 ? "block" : "none";
});
