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
import Player from "../../src/components/player/player";
import { deal } from "../../src/components/animate/animate";
import { Layout, PileElementType } from "../../src/types/pile.types";
import { CardElementType } from "../../src/types/card.types";
import { Rules } from "../../src/components/rules/rules";

const app = document.getElementById("app");
if (app) {
  const gameDeck = StandardDeckOfCards();

  class FreeCellRules extends Rules {
    constructor(passRules?, receiveRules?) {
      super(passRules, receiveRules);
    }
  }
  const something = { word: "heeyyy" };
  const getSomething = () => something.word;
  const s = {} as PileElementType<PlayingCard>;
  const d = {} as PileElementType<PlayingCard>;
  const c = {} as CardElementType<PlayingCard>;

  const tableauReceiveRuleArray = [
    // card must be alternating colors
    (source = s, dest = d, card = c) => {
      if (card.card.color === dest.getTopCardElement().card.color) return false;
      else return true;
    },
    // card must be one less than the destination pile
    (source = s, dest = d, card = c) => {
      if (card.card.value + 1 !== dest.getTopCardElement().card.value)
        return false;
      else return true;
    },
    (word, another, three, four = getSomething(), five) => {
      return true;
    },
  ];
  const tableauPassRuleArray = [
    (source, dest, card) => {
      if (card) return true;
    },
    () => {
      return true;
    },
  ];

  const tableauRules = new FreeCellRules(
    tableauPassRuleArray,
    tableauReceiveRuleArray,
  );
  const freeSpotRules = new FreeCellRules();
  const aceSpotRules = new FreeCellRules();

  const piles = [
    { name: "deck", options: {} },
    {
      name: "tableau1",
      options: { layout: "visibleStack" },
    },
    {
      name: "tableau2",
      options: { layout: "visibleStack" },
    },
    {
      name: "tableau3",
      options: { layout: "visibleStack" },
    },
    {
      name: "tableau4",
      options: { layout: "visibleStack" },
    },
    {
      name: "tableau5",
      options: { layout: "visibleStack" },
    },
    {
      name: "tableau6",
      options: { layout: "visibleStack" },
    },
    {
      name: "tableau7",
      options: { layout: "visibleStack" },
    },
    {
      name: "tableau8",
      options: { layout: "visibleStack" },
    },
    { name: "freeSpot1", options: { rules: freeSpotRules } },
    { name: "freeSpot2", options: { rules: freeSpotRules } },
    { name: "freeSpot3", options: { rules: freeSpotRules } },
    { name: "freeSpot4", options: { rules: freeSpotRules } },
    {
      name: "aceSpot1",
      options: { rules: aceSpotRules, draggable: false, groupDrag: false },
    },
    {
      name: "aceSpot2",
      options: { rules: aceSpotRules, draggable: false, groupDrag: false },
    },
    {
      name: "aceSpot3",
      options: { rules: aceSpotRules, draggable: false, groupDrag: false },
    },
    {
      name: "aceSpot4",
      options: { rules: aceSpotRules, draggable: false, groupDrag: false },
    },
  ];

  const game = new Player("freeCell", gameDeck, piles, "deck");

  // Destructure game.getPile for each pile dynamically
  const pileMap = Object.fromEntries(
    piles.map(({ name }) => [name, game.getPile(name)]),
  );

  // Now you have:
  const {
    deck,
    tableau1,
    tableau2,
    tableau3,
    tableau4,
    tableau5,
    tableau6,
    tableau7,
    tableau8,
    freeSpot1,
    freeSpot2,
    freeSpot3,
    freeSpot4,
    aceSpot1,
    aceSpot2,
    aceSpot3,
    aceSpot4,
  } = pileMap;
  deck.shuffle();

  piles.forEach((pile) => {
    document
      .getElementById(pile.name)
      ?.appendChild(pileMap[pile.name].container);
  });

  const tableaus = [
    tableau1,
    tableau2,
    tableau3,
    tableau4,
    tableau5,
    tableau6,
    tableau7,
    tableau8,
  ];

  window.addEventListener("DOMContentLoaded", async () => {
    await deal(
      6,
      deck,
      [
        tableau1,
        tableau2,
        tableau3,
        tableau4,
        tableau5,
        tableau6,
        tableau7,
        tableau8,
      ],
      10,
    );

    await deal(1, deck, [tableau1, tableau2, tableau3, tableau4], 10);

    // Flip all cards after dealing is done
    [
      tableau1,
      tableau2,
      tableau3,
      tableau4,
      tableau5,
      tableau6,
      tableau7,
      tableau8,
    ].forEach((pile) => {
      pile.cardElements.forEach((element) => element.flip());
      pile.options.rules = tableauRules;
    });
  });

  // TODO: Renable linting on this file, and fix errors
}
