const timelineItems = document.querySelectorAll(".timeline-item");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        timelineItems.forEach((item) => {
          item.classList.remove("is-active");
        });

        entry.target.classList.add("is-active");
      }
    });
  },
  {
    rootMargin: "-35% 0px -45% 0px",
    threshold: 0,
  },
);

timelineItems.forEach((item) => observer.observe(item));

const timeline = document.querySelector(".timeline");

if (timeline) {
  let ticking = false;

  const updateTimeline = () => {
    const rect = timeline.getBoundingClientRect();
    const start = window.innerHeight * 0.65;
    const distance = rect.height - start;
    const progress =
      distance > 0
        ? Math.max(0, Math.min(1, (start - rect.top) / distance))
        : 0;

    timeline.style.setProperty("--timeline-progress", String(progress));
    timeline.style.setProperty("--timeline-scale", String(progress));

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateTimeline);
      ticking = true;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateTimeline);
  updateTimeline();
}
