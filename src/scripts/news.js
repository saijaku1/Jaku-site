const categoryFilter = document.querySelector("#news-category");
const monthFilter = document.querySelector("#news-month");
const searchInput = document.querySelector("#news-search");
const resetButton = document.querySelector("#news-reset");
const resultText = document.querySelector("#news-result");
const emptyMessage = document.querySelector("#news-empty");
const cards = Array.from(document.querySelectorAll(".news-card"));

function filterNews() {
  const category = categoryFilter?.value ?? "all";
  const month = monthFilter?.value ?? "all";
  const keyword = searchInput?.value.trim().toLowerCase() ?? "";

  let visibleCount = 0;

  cards.forEach((card) => {
    const matchesCategory =
      category === "all" || card.dataset.category === category;

    const matchesMonth = month === "all" || card.dataset.month === month;

    const matchesKeyword = (card.dataset.search ?? "").includes(keyword);

    const isVisible = matchesCategory && matchesMonth && matchesKeyword;

    card.hidden = !isVisible;

    if (isVisible) {
      visibleCount++;
    }
  });

  if (resultText) {
    resultText.textContent = `${visibleCount} 件 / 全 ${cards.length} 件`;
  }

  if (emptyMessage) {
    emptyMessage.hidden = visibleCount !== 0;
  }
}

categoryFilter?.addEventListener("change", filterNews);
monthFilter?.addEventListener("change", filterNews);
searchInput?.addEventListener("input", filterNews);

resetButton?.addEventListener("click", () => {
  if (categoryFilter) categoryFilter.value = "all";
  if (monthFilter) monthFilter.value = "all";
  if (searchInput) searchInput.value = "";

  filterNews();
});

// 初期表示の件数も更新
filterNews();
