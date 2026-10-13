import blogPosts from "./blog.json";
import farceEpisodes from "./farce.json";
import characters from "./characters.json";

export type SearchItem = {
  title: string;
  description: string;
  category: string;
  url: string;
  keywords?: string;
};

const blogItems: SearchItem[] = blogPosts.map((post) => ({
  title: post.title,
  description: post.description,
  category: "ブログ",
  url: `/blog/${post.slug}`,
  keywords: post.content.join(" "),
}));
const farceItems: SearchItem[] = farceEpisodes.map((episode) => ({
  title: episode.title,
  description: episode.description,
  category: "茶番",
  url: `/farce/${episode.slug}/`,
  keywords: [
    `第${episode.episode}話`,
    `EPISODE ${String(episode.episode).padStart(2, "0")}`,
    ...episode.keywords,
  ].join(" "),
}));

const characterItems: SearchItem[] = characters.map((character) => ({
  title: character.name,
  description: character.description,
  category: "キャラクター",
  url: "/characters/",
  keywords: [
    character.role,
    character.quote,
    ...character.details.map((detail) => `${detail.label} ${detail.value}`),
    ...(character.keywords ?? []),
  ].join(" "),
}));

export const searchItems: SearchItem[] = [
  ...blogItems,
  ...farceItems,
  ...characterItems,
];
