import { TableSettings, Table } from "./table";

export const greenFelt: TableSettings = {
  tileImage: "/images/45-degree-fabric-light.png",
  backgroundColor: "rgb(38, 133, 72)",
  overlayStartColor: "rgba(0, 100, 0, 0)",
  overlayEndColor: "rgba(0, 0, 0, 1)",
  overlayGradientType: "radial",
  overlayDirection: "to bottom",
  overlayCenter: "center",
  overlaySize: "100%",
  vignette: {
    enabled: true,
    center: "center",
    size: "80%",
    color: "rgba(0, 0, 0, 0.4)",
  },
};

export const redFelt: TableSettings = {
  tileImage: "/images/45-degree-fabric-light.png",
  backgroundColor: "rgb(181 44 44)",
  overlayStartColor: "rgba(0, 100, 0, 0)",
  overlayEndColor: "rgba(0, 0, 0, 0.6)",
  overlayGradientType: "radial",
  overlayDirection: "to bottom",
  overlayCenter: "center",
  overlaySize: "100%",
  vignette: {
    enabled: true,
    center: "center",
    size: "80%",
    color: "rgba(0, 0, 0, 0.4)",
  },
};

export const brickWall: TableSettings = {
  tileImage: "/images/brick-wall.png",
  backgroundColor: "rgba(114, 6, 6, 1)",
  overlayStartColor: "rgba(0, 100, 0, 0)",
  overlayEndColor: "rgba(0, 0, 0, 1)",
  overlayGradientType: "linear",
  overlayDirection: "to bottom",
  overlayCenter: "top",
  overlaySize: "100%",
  vignette: {
    enabled: false,
    center: "center",
    size: "80%",
    color: "rgba(0, 0, 0, 0.4)",
  },
};

export const redOak: TableSettings = {
  tileImage: "/images/wood-pattern.png",
  backgroundColor: "rgb(100 70 70)",
  overlayStartColor: "rgba(0, 100, 0, 0)",
  overlayEndColor: "rgba(0, 0, 0, 0.6)",
  overlayGradientType: "radial",
  overlayDirection: "to bottom",
  overlayCenter: "center",
  overlaySize: "100%",
  vignette: {
    enabled: true,
    center: "center",
    size: "80%",
    color: "rgba(0, 0, 0, 0.4)",
  },
};

export const tanTiles: TableSettings = {
  tileImage: "/images/gradient-squares.png",
  backgroundColor: "rgb(175 157 149)",
  overlayStartColor: "rgba(118 60 28 / 35%)",
  overlayEndColor: "rgba(0, 0, 0, 1)",
  overlayGradientType: "radial",
  overlayDirection: "to bottom",
  overlayCenter: "center",
  overlaySize: "100%",
  vignette: {
    enabled: true,
    center: "center",
    size: "80%",
    color: "rgba(0, 0, 0, 0.4)",
  },
};

export function setTheme(theme: TableSettings) {
  const table = new Table(theme);
  table.setBackground();
}
