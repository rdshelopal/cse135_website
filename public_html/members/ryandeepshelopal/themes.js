document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("theme-toggle");
  const root = document.documentElement;

  // Apply saved theme from localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    root.setAttribute("data-theme", "light");
  }

  // Toggle theme on button click
  toggleBtn.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme");

    if (currentTheme === "light") {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "dark");
    } else {
      root.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  });
});
