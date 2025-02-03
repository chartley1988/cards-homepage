import "../../src/styles/style.css";
import "../../src/styles/card.css";
import "../../src/styles/theme.css";
import "./styles.css";
import "../../src/components/navMenu/navMenu";
import StandardDeckOfCards from "../../src/components/card/playingCard/standardDeckOfCards";
import Player from "../../src/components/player/player";
import Card from "../../src/components/card/card";
import { PileElement } from "../../src/components/pile/pileElement";
import { CardElement } from "../../src/components/card/cardElement";
import PlayingCard from "../../src/components/card/playingCard/playingCardClass";

const app = document.getElementById("app");
if (app) {
  const deck = StandardDeckOfCards();

  const player1 = new Player("dave", deck, ["hand"]);
  const main = new Player("main", deck, ["draw", "discard"], "draw");
  const player2 = new Player("hups", deck, ["hand"]);

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
  player1.getPile("hand").cascadeValueSetter([0.0, 0.4], 0);

  window.addEventListener("DOMContentLoaded", () => {
    deal(5, draw, [hand1, hand2]);
  });
  hand1.cascade();

  draw.container.addEventListener("dblclick", () => {
    main.getPile("draw").moveCardToPile(currentPlayer.getPile("hand"));
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  });

  main.getPile("draw").container.addEventListener("click", () => {
    if (!main.getPile("draw").getTopCardElement().faceUp)
      main.getPile("draw").getTopCardElement().flip();
  });

  hand1.container.addEventListener("dblclick", () => {
    hand1.moveCardToPile(
      discard,
      hand1.getTopCardElement(),
      rules(hand1, discard, hand1.getTopCardElement())
    );
  });
  hand1.container.addEventListener("click", (e) => {
    if (e.target instanceof HTMLElement) {
      hand1.cardElements[
        parseInt(findCardContainer(e.target).style.zIndex)
      ].flip();
    }
  });
  const findCardContainer = (element: HTMLElement) => {
    if (element.classList.contains("card-container")) return element;
    else if (element.parentElement)
      return findCardContainer(element.parentElement);
    else throw "something went wrong in find card container";
  };

  hand2.container.addEventListener("dblclick", (e) => {
    if (e.target instanceof HTMLElement) {
      const cardClicked =
        hand2.cardElements[parseInt(findCardContainer(e.target).style.zIndex)];
        console.log(cardClicked)
      hand2.moveCardToPile(
        discard,
        cardClicked,
        rules(hand2, discard, cardClicked)
      );
    }
  });

  hand2.container.addEventListener("click", (e) => {
    if (e.target instanceof HTMLElement) {
      const cardClicked =
        hand2.cardElements[parseInt(findCardContainer(e.target).style.zIndex)];
      if (cardClicked.faceUp) return;
      console.log(cardClicked.faceUp)
      cardClicked.flip();
    }
  });

  const rules = (
    sourcePile: PileElement<PlayingCard>,
    destinationPile: PileElement<PlayingCard>,
    card: CardElement<PlayingCard>
  ): boolean => {
    if (!card.faceUp) return false;
    if (card.card.value < 6) console.log(card.card.value);
    console.log(card.card.value);
    return true;
  };
}

async function deal<T extends Card>(
  number: number,
  from: PileElement<T>,
  to: PileElement<T>[] | PileElement<T>,
) {
  // If `to` is a single pile, convert it to an array for simplicity
  const piles = Array.isArray(to) ? to : [to];

  for (let i = 0; i < number * piles.length; i++) {
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
