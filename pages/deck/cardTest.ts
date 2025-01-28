import { CardElement } from "../../src/components/card/cardElement";
import pileElement from "../../src/components/pile/pileElement";
import "../../src/styles/style.css";
import "../../src/styles/card.css";
import "../../src/styles/theme.css";
import "./styles.css";
import "../../src/components/navMenu/navMenu";
import addDeckBase from "../../src/legacy/scripts/cardFoundations/deckBase";
import PlayingCard from "../../src/components/card/playingCard/playingCardClass";
import StandardDeckOfCards from "../../src/components/card/playingCard/standardDeckOfCards";
import PlayingCardFrontAndBack from "../../src/components/card/playingCard/playingCardElement";
import Card from "../../src/components/card/card";

function instanceCard() {
  const front = document.createElement("div");
  front.classList.add("eh", "gfhfdgh", "yolo");
  front.innerHTML = "heyyyy";
  const card = CardElement(front);
  card.wrapper.addEventListener("click", () => {
    card.flip();
  });

  return card;
}
const instanceCard2 = () => {
  const card = new PlayingCard("K", "spade");
  const playingCardFrontAndBackDivs = PlayingCardFrontAndBack(card);
  const cardElly = CardElement(
    playingCardFrontAndBackDivs.frontDiv,
    playingCardFrontAndBackDivs.backDiv,
    card
  );
  cardElly.wrapper.addEventListener("click", () => {
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
  deckBase.container?.appendChild(testCard.wrapper);
  const p1DrawPile = document.getElementById("p1Discard");
  p1DrawPile?.appendChild(deckBase2.container);
  deckBase2.container?.appendChild(testCard2.wrapper);

  // Deck
  const playingCards = StandardDeckOfCards();
  const drawPile = playingCards.createPile(playingCards.cards);
  const player1 = playingCards.createPile();
  const player2 = playingCards.createPile();
  drawPile.shuffle();
  drawPile.passCard(player1);
  drawPile.passCard(player1);
  drawPile.passCard(player1);
  drawPile.passCard(player1);
  drawPile.passCard(player1);

  drawPile.passCard(player2);
  drawPile.passCard(player2);
  drawPile.passCard(player2);
  drawPile.passCard(player2);
  drawPile.passCard(player2);

  console.log(player1.cards);
  console.log(player2.cards);
  const player1CardElements: CardElement<PlayingCard>[] = [];
  player1.cards.forEach((card) => {
    const frontnback = PlayingCardFrontAndBack(card);
    const cardElly = CardElement(frontnback.frontDiv, frontnback.backDiv, card);
    player1CardElements.push(cardElly);
  });

  const player1PileElement = pileElement(player1, player1CardElements);
  const p1Draw = document.getElementById("p1DrawPile");
  p1Draw?.appendChild(player1PileElement.container);
  player1PileElement.reset();
  const player1HandPile = pileElement<PlayingCard>();
  const p1Hand = document.getElementById("p1Hand");
  p1Hand?.appendChild(player1HandPile.container);
  player1PileElement.container.addEventListener("click", () => {
    player1PileElement.moveCardToPile(player1HandPile);
  });
}
