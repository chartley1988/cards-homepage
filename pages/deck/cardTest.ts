import "../../src/styles/style.css";
import "../../src/styles/card.css";
import "../../src/styles/theme.css";
import "./styles.css";
import "../../src/components/navMenu/navMenu";
import StandardDeckOfCards from "../../src/components/card/playingCard/standardDeckOfCards";
import { spinCard } from "../../src/components/animate/animate";
import { setTheme, redOak } from "../../src/components/table/themes";

const app = document.getElementById("app");
if (app) {
  setTheme(redOak, app);

  // Deck
  const playingCards = StandardDeckOfCards();
  const drawPile = playingCards.createPileElement("draw", playingCards.cards);
  drawPile.pile.shuffle();

  const p1DrawPileElement = playingCards.createPileElement(
    "p1draw",
    drawPile.cards.splice(0, 5),
    { draggable: true },
  );
  const player1HandPile = playingCards.createPileElement(
    "p1Hand",
    drawPile.cards.splice(0, 5),
  );

  const p1DrawDOM = document.getElementById("p1DrawPile");
  p1DrawDOM?.appendChild(p1DrawPileElement.container);
  p1DrawPileElement.cascade();
  p1DrawPileElement.container.addEventListener("dblclick", () => {
    p1DrawPileElement.moveCardToPile(player1HandPile);
  });
  p1DrawPileElement.container.addEventListener("click", () => {
    p1DrawPileElement.topCardElement.flip();
  });

  const p1Hand = document.getElementById("p1Hand");
  p1Hand?.appendChild(player1HandPile.container);
  player1HandPile.cascade();
  player1HandPile.container.addEventListener("click", () => {
    player1HandPile.moveCardToPile(p1DrawPileElement);
  });

  player1HandPile.container.addEventListener("mouseenter", () => {
    spinCard(player1HandPile.topCardElement, 1000);
  });
}
