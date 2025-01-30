import "../../src/styles/style.css";
import "../../src/styles/card.css";
import "../../src/styles/theme.css";
import "./styles.css";
import "../../src/components/navMenu/navMenu";
import StandardDeckOfCards from "../../src/components/card/playingCard/standardDeckOfCards";
import Handler from "../../src/components/handler/handler";
import PlayingCardElement from "../../src/components/card/playingCard/playingCardElement";
import Player from "../../src/components/player/player";
import Card from "../../src/components/card/card";
import { PileElement } from "../../src/components/pile/pileElement";

const app = document.getElementById("app");
if (app) {
  const deck = StandardDeckOfCards();

  const player1 = new Player("dave", deck, ["hand"]);
  const main = new Player("main", deck, ["draw", "discard"], "draw");
  const player2 = new Player("hups", deck, ["hand"]);

  const game = {
    firstClick: true,
  };

  const hand1 = player1.getPile("hand");
  document.getElementById("p1Hand")?.appendChild(hand1.container);

  const hand2 = player2.getPile("hand");
  document.getElementById("p2Hand")?.appendChild(hand2.container);

  const draw = main.getPile("draw");
  document.getElementById("mainDraw")?.appendChild(draw.container);

  const discard = main.getPile("discard");
  document.getElementById("mainDiscard")?.appendChild(discard.container);

  let currentPlayer = player1;

  draw.cascade();
  hand1.cascadeValueSetter([0.18, 0], 0);
  hand2.cascadeValueSetter([0.4, 0], 0);
  console.log(player1.getPile("hand").cascadePercent);
  player1.getPile("hand").cascadeValueSetter([0.0, 0.4], 0);

  window.addEventListener("DOMContentLoaded", () => {
    deal(5, draw, [hand1, hand2]);
  });

  draw.container.addEventListener("dblclick", () => {
    main.getPile("draw").moveCardToPile(currentPlayer.getPile("hand"));
    currentPlayer === player1
      ? (currentPlayer = player2)
      : (currentPlayer = player1);
  });

  main.getPile("draw").container.addEventListener("click", () => {
    if (!main.getPile("draw").getTopCardElement().faceUp)
      main.getPile("draw").getTopCardElement().flip();
  });
}

async function deal<T extends Card>(
  number: number,
  from: PileElement<T>,
  to: PileElement<T>[] | PileElement<T>
) {
  // If `to` is a single pile, convert it to an array for simplicity
  const piles = Array.isArray(to) ? to : [to];

  for (let i = 0; i < number * piles.length; i++) {
    console.log(`dealing ${i}`);
    // Alternate between piles using the modulo operator
    const currentPile = piles[i % piles.length];

    // Move card to the current pile
    from.moveCardToPile(currentPile);

    // Wait for 0.5 seconds before the next card
    if (i < number * piles.length - 1) {
      await delay(500); // 500 milliseconds = 0.5 seconds
    }
  }
}
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
