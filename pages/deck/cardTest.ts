import { createCard } from "../../src/components/card/cardDom";
import "../../src/styles/style.css";
import "../../src/styles/card.css";
import "../../src/styles/theme.css";
import "./styles.css";
import "../../src/components/navMenu/navMenu";
import addDeckBase from "../../src/legacy/scripts/cardFoundations/deckBase";
import Pile from "../../src/components/pile/pile";
import PlayingCard from "../../src/components/card/playingCard/playingCard";
import StandardDeckOfCards from "../../src/components/card/playingCard/standardDeckOfCards";
function instanceCard() {
  const card = createCard();
  card.wrapper.addEventListener("click", () => {
    card.flipCard();
  });

  return card;
}

const app = document.getElementById("app");
if (app) {
  const deckBase = addDeckBase();
  const deckBase2 = addDeckBase();
  const testCard = instanceCard();
  const testCard2 = instanceCard();
  const p2DrawPile = document.getElementById("p2DrawPile");
  p2DrawPile?.appendChild(deckBase.container);
  deckBase.container?.appendChild(testCard.wrapper);
  const p1DrawPile = document.getElementById("p1Discard");
  p1DrawPile?.appendChild(deckBase2.container);
  deckBase2.container?.appendChild(testCard2.wrapper);

  // Deck
  const playingCards = StandardDeckOfCards();
  const drawPile = new Pile(playingCards.getCards());
  const player1 = new Pile();
  const cards = playingCards.getCards();
  const aceSpades = new PlayingCard("A", "spade");
  const joker = new PlayingCard("joker", "joker");
  const joker2 = new PlayingCard("joker", "joker");
  console.log(joker === joker2);
  console.log(JSON.stringify(joker) === JSON.stringify(joker2));
  playingCards.removeCard(joker);
  playingCards.removeCard(joker);
  console.log(player1);
}
