
const menuToggleBtn = document.getElementById("menu-toggle");
const body = document.body;

if (menuToggleBtn) {
  menuToggleBtn.addEventListener("click", () => {
    body.classList.toggle("menu-toggled");

    const icon = menuToggleBtn.querySelector("i");
    if (body.classList.contains("menu-toggled")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times"); 
    } else {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars"); 
    }
  });
}
