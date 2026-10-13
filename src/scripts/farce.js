function setupFarceAnimations() {
  const targets = document.querySelectorAll(".talk, .scene-image");

  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      },
    );

    targets.forEach((target) => {
      observer.observe(target);
    });
  } else {
    targets.forEach((target) => {
      target.classList.add("is-visible");
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupFarceAnimations);
} else {
  setupFarceAnimations();
}
