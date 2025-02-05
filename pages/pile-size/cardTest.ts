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

  const player1 = new Player("Player 1", deck, [{ name: "Hand" }]);
  const player2 = new Player("Player 2", deck, [{ name: "Hand" }]);
  const main = new Player(
    "Dealer",
    deck,
    [{ name: "Draw" }, { name: "Discard" }],
    "Draw",
  );

  const hand1 = player1.getPile("Hand");
  hand1.options.type = "cascade";
  document.getElementById("p1Hand")?.appendChild(hand1.container);

  const hand2 = player2.getPile("Hand");
  hand2.options.type = "cascade";
  document.getElementById("p2Hand")?.appendChild(hand2.container);

  const draw = main.getPile("Draw");
  document.getElementById("mainDraw")?.appendChild(draw.container);

  const discard = main.getPile("Discard");
  document.getElementById("mainDiscard")?.appendChild(discard.container);

  draw.cascade();

  hand2.cascadeOffset = [0.3, 0];

  for (let i = 0; i < 15; i++) {
    await draw.moveCardToPile(hand1);
    await delay(50);
  }

  for (let i = 0; i < 15; i++) {
    await draw.moveCardToPile(hand2);
    await delay(50);
  }

  window.addEventListener("DOMContentLoaded", () => {});
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
