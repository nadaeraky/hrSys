// function setTheme(theme) {
//   const body = document.body;
//   const toggleBtn = document.getElementById("theme-toggle");

//   if (theme === "dark") {
//     body.classList.add("dark-mode");

//     toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
//     localStorage.setItem("theme", "dark");
//   } else {
//     body.classList.remove("dark-mode");

//     toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
//     localStorage.setItem("theme", "light");
//   }
// }


// document.addEventListener("DOMContentLoaded", () => {
//   const toggleBtn = document.getElementById("theme-toggle");

//   const savedTheme = localStorage.getItem("theme") || "dark";
//   setTheme(savedTheme);

//   toggleBtn.addEventListener("click", () => {
//     const currentTheme = document.body.classList.contains("dark-mode")
//       ? "dark"
//       : "light";
//     const newTheme = currentTheme === "light" ? "dark" : "light";
//     setTheme(newTheme);
//   });
// });



// const menuToggleBtn = document.getElementById("menu-toggle");
// const body = document.body;

// if (menuToggleBtn) {
//   menuToggleBtn.addEventListener("click", () => {
//     body.classList.toggle("menu-toggled");

//     const icon = menuToggleBtn.querySelector("i");
//     if (body.classList.contains("menu-toggled")) {
//       icon.classList.remove("fa-bars");
//       icon.classList.add("fa-times"); 
//     } else {
//       icon.classList.remove("fa-times");
//       icon.classList.add("fa-bars"); 
//     }
//   });
// }



