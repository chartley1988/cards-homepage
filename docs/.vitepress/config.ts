import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "CardsJS",
  base: "/docs/",
  outDir: "../dist/docs",
  description: "A Javascript library for creating card games",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Home", link: "/" }],

    sidebar: [
      {
        text: "Guides",
        items: [
          { text: "Running Project", link: "/running-project" },
          { text: "Contribution Guide", link: "/contribution-guide" },
        ],
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/Daver067/cards-npm-package",
      },
    ],
  },
});
