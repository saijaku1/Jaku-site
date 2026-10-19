const form = document.querySelector("#pagefind-search-form");
const input = document.querySelector("#pagefind-search-input");
const status = document.querySelector("#pagefind-status");
const resultsContainer = document.querySelector("#pagefind-results");

if (form && input && status && resultsContainer) {
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q") || "";

  input.value = initialQuery;

  let pagefind = null;
  let pagefindPromise = null;
  async function loadPagefind() {
    if (pagefind) return pagefind;

    if (!pagefindPromise) {
      pagefindPromise = (async () => {
        const engine = await import("/pagefind/pagefind.js");
        await engine.init();

        pagefind = engine;
        return engine;
      })();
    }

    try {
      return await pagefindPromise;
    } catch (error) {
      pagefindPromise = null;
      throw error;
    }
  }
  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };

      return entities[character];
    });
  }

  async function search(query) {
    const normalizedQuery = query.trim();

    resultsContainer.replaceChildren();

    if (!normalizedQuery) {
      status.textContent = "キーワードを入力して検索してください。";
      return;
    }

    status.textContent = "検索しています...";

    try {
      const engine = await loadPagefind();
      const searchResult = await engine.search(normalizedQuery);

      if (searchResult.results.length === 0) {
        status.textContent = "一致するページが見つかりませんでした。";
        return;
      }

      status.textContent = `${searchResult.results.length}件の候補が見つかりました。`;

      const details = await Promise.all(
        searchResult.results.slice(0, 30).map((result) => result.data()),
      );

      for (const item of details) {
        const article = document.createElement("article");
        article.className = "search-result";

        const link = document.createElement("a");
        link.href = item.url;
        link.textContent = item.meta?.title || "タイトルなし";

        const excerpt = document.createElement("p");
        excerpt.innerHTML = item.excerpt
          ? item.excerpt
          : escapeHtml(item.meta?.description || "説明はありません。");

        article.append(link, excerpt);
        resultsContainer.append(article);
      }
    } catch (error) {
      console.error("検索エラー:", error);

      status.textContent =
        "検索機能を読み込めませんでした。Consoleのエラーを確認してください。";
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = input.value.trim();
    const nextUrl = new URL(window.location.href);

    if (query) {
      nextUrl.searchParams.set("q", query);
    } else {
      nextUrl.searchParams.delete("q");
    }

    window.history.replaceState({}, "", nextUrl);
    search(query);
  });

  if (initialQuery.trim()) {
    search(initialQuery);
  }
}
