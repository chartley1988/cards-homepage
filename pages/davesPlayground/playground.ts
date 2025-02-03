/* eslint-disable @typescript-eslint/no-unused-vars */
import { CardElement } from "../../src/components/card/cardElement";
import { pileElement } from "../../src/components/pile/pileElement";
import "../../src/styles/style.css";
import "../../src/styles/card.css";
import "../../src/styles/theme.css";
import "./styles.css";
import "../../src/components/navMenu/navMenu";
import addDeckBase from "../../src/legacy/scripts/cardFoundations/deckBase";
import PlayingCard from "../../src/components/card/playingCard/playingCardClass";
import StandardDeckOfCards from "../../src/components/card/playingCard/standardDeckOfCards";
import Card from "../../src/components/card/card";
import Handler from "../../src/components/handler/handler";
import PlayingCardElement from "../../src/components/card/playingCard/playingCardElement";

const app = document.getElementById("app");
console.log("hi");
if (app) {
  const deck = StandardDeckOfCards();
  const player1 = { deck: deck, name: "Dave", piles: ["hand", "discard"] };
  const drawPile = { deck: deck, name: "DrawPile", piles: ["draw"] };
  const handler = new Handler([player1, drawPile]);
  //  Chartley: Not sure what's going on here ha, just turned off linting because I was getting yelled at. Commented out line below.

  // handler.players;
  console.log("hi");

  // TODO: Renable linting on this file, and fix errors
}
