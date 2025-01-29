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
  const player1HAND = playingCards.createPile();
  drawPile.shuffle();
  drawPile.passCard(player1);
  drawPile.passCard(player1);
  drawPile.passCard(player1);
  drawPile.passCard(player1);
  drawPile.passCard(player1);

  drawPile.passCard(player1HAND);
  drawPile.passCard(player1HAND);
  drawPile.passCard(player1HAND);
  drawPile.passCard(player1HAND);
  drawPile.passCard(player1HAND);

  const player1CardElements: CardElement<PlayingCard>[] = [];
  const player1CardElements2: CardElement<PlayingCard>[] = [];

  player1.cards.forEach((card) => {
    const frontnback = PlayingCardFrontAndBack(card);
    const cardElly = CardElement(frontnback.frontDiv, frontnback.backDiv, card);
    player1CardElements.push(cardElly);
  });

  player1HAND.cards.forEach((card) => {
    const frontnback = PlayingCardFrontAndBack(card);
    const cardElly = CardElement(frontnback.frontDiv, frontnback.backDiv, card);
    player1CardElements2.push(cardElly);
  });

  const p1DrawPileElement = pileElement(player1, player1CardElements);
  const p1DrawDOM = document.getElementById("p1DrawPile");
  p1DrawDOM?.appendChild(p1DrawPileElement.container);
  p1DrawPileElement.reset();
  p1DrawPileElement.container.addEventListener("dblclick", () => {
    p1DrawPileElement.moveCardToPile(player1HandPile);
  });
  p1DrawPileElement.container.addEventListener("click", () => {
    p1DrawPileElement.getTopCardElement().flip();
  });

  const player1HandPile = pileElement(player1HAND, player1CardElements2);
  const p1Hand = document.getElementById("p1Hand");
  p1Hand?.appendChild(player1HandPile.container);
  player1HandPile.reset();
  player1HandPile.container.addEventListener("click", () => {
    player1HandPile.moveCardToPile(p1DrawPileElement);
  });

  player1HandPile.container.addEventListener("mouseenter", () => {
    player1HandPile.spinCard(player1HandPile.getTopCardElement(), 1000);
  });
}
