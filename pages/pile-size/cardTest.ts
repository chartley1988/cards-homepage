import "../../src/styles/style.css";
import "../../src/styles/card.css";
import "../../src/styles/theme.css";
import "./styles.css";
import "../../src/components/navMenu/navMenu";
import StandardDeckOfCards from "../../src/components/card/playingCard/standardDeckOfCards";
import Player from "../../src/components/player/player";

const app = document.getElementById("app");
if (app) {
  const deck = StandardDeckOfCards();

  const player1 = new Player("Player 1", deck, ["hand"]);
  const main = new Player("Dealer", deck, ["draw", "discard"], "draw");

  const hand1 = player1.getPile("hand");
  hand1.type = "cascade";
  document.getElementById("p1Hand")?.appendChild(hand1.container);

  const draw = main.getPile("draw");
  document.getElementById("mainDraw")?.appendChild(draw.container);

  const discard = main.getPile("discard");
  document.getElementById("mainDiscard")?.appendChild(discard.container);

  draw.cascadeValueSetter([0.0, -0.005], 0);
  draw.cascade();

  hand1.cascadeValueSetter([0.0, -0.015], 0);
  await hand1.cascade();

  for (let i = 0; i < 15; i++) {
    await draw.moveCardToPile(hand1);
    await delay(50);
  }

  window.addEventListener("DOMContentLoaded", () => {});
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
