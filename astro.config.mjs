import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://jaku-site.vercel.app",
  integrations: [sitemap(), react()],
  vite: {
    build: {
      cssMinify: false,
    },
  },
});
