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
        text: "Getting Started",
        items: [{ text: "Basic Setup", link: "/getting-started" }],
      },
      {
        text: "Advanced ",
        items: [{ text: "Custom Themes", link: "/custom-themes" }],
      },
      {
        text: "Contributing",
        items: [
          { text: "Contribution Guide", link: "/contribution-guide" },
          { text: "Running Project", link: "/running-project" },
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
  ignoreDeadLinks: "localhostLinks",
});
