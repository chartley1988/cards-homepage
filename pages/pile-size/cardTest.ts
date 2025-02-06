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
  document.getElementById("p1Hand")?.appendChild(hand1.container);

  const hand2 = player2.getPile("Hand");
  document.getElementById("p2Hand")?.appendChild(hand2.container);

  const draw = main.getPile("Draw");
  document.getElementById("mainDraw")?.appendChild(draw.container);

  const discard = main.getPile("Discard");
  document.getElementById("mainDiscard")?.appendChild(discard.container);

  draw.cascade();

  hand1.createCascadeLayout("flop", [1.1, 0]);
  hand1.createCascadeLayout("tight", [0, -0.01]);
  hand1.applyCascadeLayout("flop");
  hand2.applyCascadeLayout("tight");
  hand1.cascade();
  hand2.cascade();

  window.addEventListener("DOMContentLoaded", async () => {
    for (let i = 0; i < 15; i++) {
      await draw.moveCardToPile(hand1);
      await delay(50);
    }

    for (let i = 0; i < 15; i++) {
      await draw.moveCardToPile(hand2);
      await delay(50);
    }
  });
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
