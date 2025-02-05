import { CardElement } from "../../src/components/card/cardElement";
import "../../src/styles/style.css";
import "../../src/styles/card.css";
import "../../src/styles/theme.css";
import "./styles.css";
import "../../src/components/navMenu/navMenu";
import addDeckBase from "../../src/legacy/scripts/cardFoundations/deckBase";
import PlayingCard from "../../src/components/card/playingCard/playingCardClass";
import StandardDeckOfCards from "../../src/components/card/playingCard/standardDeckOfCards";
import PlayingCardElement from "../../src/components/card/playingCard/playingCardElement";
import { spinCard } from "../../src/components/animate/animate";

function instanceCard() {
  const front = document.createElement("div");
  front.classList.add("eh", "gfhfdgh", "yolo");
  front.innerHTML = "heyyyy";
  const card = CardElement();
  card.container.addEventListener("click", () => {
    card.flip();
  });

  return card;
}
const instanceCard2 = () => {
  const card = new PlayingCard("K", "spade");
  const cardElly = PlayingCardElement(card);

  cardElly.container.addEventListener("click", () => {
    cardElly.flip();
  });

  return cardElly;
};

const app = document.getElementById("app");
if (app) {
  const deckBase = addDeckBase();
  const deckBase2 = addDeckBase();
  const testCard = instanceCard();
  const testCard2 = instanceCard2();
  const p2DrawPile = document.getElementById("p2DrawPile");
  p2DrawPile?.appendChild(deckBase.container);
  deckBase.container?.appendChild(testCard.container);
  const p1DrawPile = document.getElementById("p1Discard");
  p1DrawPile?.appendChild(deckBase2.container);
  deckBase2.container?.appendChild(testCard2.container);

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
    p1DrawPileElement.getTopCardElement().flip();
  });

  const p1Hand = document.getElementById("p1Hand");
  p1Hand?.appendChild(player1HandPile.container);
  player1HandPile.cascade();
  player1HandPile.container.addEventListener("click", () => {
    player1HandPile.moveCardToPile(p1DrawPileElement);
  });

  player1HandPile.container.addEventListener("mouseenter", () => {
    spinCard(player1HandPile.getTopCardElement(), 1000);
  });
}
