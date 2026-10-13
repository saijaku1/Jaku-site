const button = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
  button.textContent = "☀️";
}

button.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");

  if (document.documentElement.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    button.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    button.textContent = "🌙";
  }
});
