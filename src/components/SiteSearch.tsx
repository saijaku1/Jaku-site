import { useState } from "react";
import { searchItems } from "../data/searchIndex";
import "./SiteSearch.css";

export default function SiteSearch() {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLocaleLowerCase();

  const results = normalizedQuery
    ? searchItems.filter((item) => {
        const searchableText = [
          item.title,
          item.description,
          item.category,
          item.keywords ?? "",
        ]
          .join(" ")
          .toLocaleLowerCase();

        return searchableText.includes(normalizedQuery);
      })
    : [];

  return (
    <div className="site-search">
      <label className="site-search-label" htmlFor="site-search-input">
        サイト内検索
      </label>

      <input
        id="site-search-input"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="記事・キャラクターを検索..."
        autoComplete="off"
      />

      {normalizedQuery && (
        <div className="site-search-results" role="status">
          {results.length > 0 ? (
            <ul>
              {results.map((item) => (
                <li key={`${item.category}-${item.url}-${item.title}`}>
                  <a href={item.url}>
                    <span className="site-search-category">
                      {item.category}
                    </span>
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>一致する結果が見つかりませんでした。</p>
          )}
        </div>
      )}
    </div>
  );
}
