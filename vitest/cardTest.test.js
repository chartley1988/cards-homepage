import { test, expect } from "vitest";
import Card from "../src/components/card/card";
import PlayingCard from "../src/components/card/playingCard/playingCardClass";
import Deck from "../src/components/deck/deck";
import Pile from "../src/components/pile/pile";
import StandardDeckOfCards from "../src/components/card/playingCard/standardDeckOfCards";

test("can flip a blank card", () => {
  const card = new Card();
  expect(card.faceUp).toBe(false);
  card.flip();
  expect(card.faceUp).toBe(true);
});

test("can make a playing card", () => {
  const aceOfSpades = new PlayingCard("A", "spade");
  expect(aceOfSpades.suit).toBe("spade");
  expect(aceOfSpades.number).toBe("A");
  expect(aceOfSpades.symbol).toBe("♠");
});

test("different varieties of a new card are not the same card", () => {
  const aceOfSpades = new PlayingCard("A", "spade");
  const newAceOfSpades = new PlayingCard("A", "spade");
  expect(aceOfSpades === newAceOfSpades).toBe(false);
});

test("can make a blank deck", () => {
  const deck = new Deck();
  expect(deck.cards).toStrictEqual([]);
});

test("can add cards to deck, singles or an array", () => {
  const deck = new Deck();
  const aceOfSpades = new PlayingCard("A", "spade");
  const twoOfSpades = new PlayingCard("2", "spade");
  const threeOfSpades = new PlayingCard("3", "spade");
  const fourOfSpades = new PlayingCard("4", "spade");
  deck.addCards(aceOfSpades);
  expect(deck.cards).toStrictEqual([aceOfSpades]);
  deck.addCards([twoOfSpades, threeOfSpades, fourOfSpades]);
  expect(deck.cards).toStrictEqual([
    aceOfSpades,
    twoOfSpades,
    threeOfSpades,
    fourOfSpades,
  ]);
});

test("pile can pass cards", () => {
  const deck = new Deck();
  const aceOfSpades = new PlayingCard("A", "spade");
  const twoOfSpades = new PlayingCard("2", "spade");
  const threeOfSpades = new PlayingCard("3", "spade");
  const fourOfSpades = new PlayingCard("4", "spade");
  deck.addCards(aceOfSpades);
  deck.addCards([twoOfSpades, threeOfSpades, fourOfSpades]);
  const drawPile = new Pile(deck.cards);
  expect(drawPile.cards).toStrictEqual(deck.cards);
  const playerHand = new Pile();
  drawPile.passCard(playerHand, aceOfSpades);
  // draw pile will no longer have ace of spades
  expect(drawPile.cards).toStrictEqual([
    twoOfSpades,
    threeOfSpades,
    fourOfSpades,
  ]);
  // player hand will have only ace of spades
  expect(playerHand.cards).toStrictEqual([aceOfSpades]);
  // the deck still contains all cards
  expect(deck.cards).toStrictEqual([
    aceOfSpades,
    twoOfSpades,
    threeOfSpades,
    fourOfSpades,
  ]);
});

test("Changing a value in the deck, will change it in the pile", () => {
  const deck = StandardDeckOfCards();
  const drawPile = deck.createPile();
  drawPile.receiveCard(deck.cards);
  const player1 = deck.createPile();
  drawPile.passCard(player1);
  // the decks "last card" is the first one to get passed.
  deck.cards[51].value = 0;
  expect(player1.cards[0].value).toBe(0);
});

test("deleting a card from the deck will delete it from piles", () => {
  const deck = StandardDeckOfCards();
  const drawPile = deck.createPile();
  drawPile.receiveCard(deck.cards);
  const player1 = deck.createPile();
  drawPile.passCard(player1);
  deck.removeCard(deck.cards[51]);
  expect(player1.cards.length).toBe(0);
});
