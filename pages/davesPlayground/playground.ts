/* eslint-disable @typescript-eslint/no-unused-vars */
import "../../src/styles/style.css";
import "../../src/styles/card.css";
import "../../src/styles/theme.css";
import "./styles.css";
import "../../src/components/navMenu/navMenu";
import PlayingCard from "../../src/components/card/playingCard/playingCardClass";
import StandardDeckOfCards from "../../src/components/card/playingCard/standardDeckOfCards";
import Player from "../../src/components/player/player";
import { deal } from "../../src/components/animate/animate";
import { PileElementType } from "../../src/types/pile.types";
import { CardElementType } from "../../src/types/card.types";
import { setTheme, redFelt } from "../../src/components/table/themes";
import { Rules } from "../../src/components/rules/rules";

const app = document.getElementById("app");
if (app) {
  setTheme(redFelt);

  const gameDeck = StandardDeckOfCards();

  class FreeCellRules extends Rules {
    constructor(passRules?, receiveRules?) {
      super(passRules, receiveRules);
    }
  }

  const s = {} as PileElementType<PlayingCard>;
  const d = {} as PileElementType<PlayingCard>;
  const c = {} as CardElementType<PlayingCard>;
  const tableauReceiveRuleArray = [
    // card must be alternating colors
    (source = s, dest = d, card = c) => {
      if (card.card.color === dest.topCardElement.card.color) return false;
      else return true;
    },
    // card must be one less than the destination pile
    (source = s, dest = d, card = c) => {
      if (card.card.value + 1 !== dest.topCardElement.card.value) return false;
      else return true;
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

  const aceSpotReceiveRules = [
    () => {
      return false;
    },
  ];

  const freeSpotRules = new FreeCellRules();
  const aceSpotRules = new FreeCellRules([() => false], aceSpotReceiveRules);
  const freeSpaces = 2;

  const dragRules = (
    pile: PileElementType<PlayingCard>,
    card: CardElementType<PlayingCard>,
  ) => {
    // always drag top card
    if (pile.topCardElement === card) return true;
    const cardIndex = pile.cardElements.findIndex((element) => {
      return JSON.stringify(element) === JSON.stringify(card);
    });
    const cardsOnTop = pile.cardElements.slice(cardIndex);
    // to move a pile, must be in sequence
    if (
      cardsOnTop.every((cardElement, index, arr) => {
        if (index === 0) return true; // First card has nothing to compare with

        const prevCard = arr[index - 1].card;
        const currentCard = cardElement.card;

        return (
          prevCard.color !== currentCard.color &&
          prevCard.value === currentCard.value + 1
        );
      }) === false
    )
      return false;
    if (cardsOnTop.length > freeSpaces) return false;
    return true;
  };

  const piles = [
    { name: "deck", options: {} },
    {
      name: "tableau1",
      options: { layout: "visibleStack", dragRules: dragRules },
    },
    {
      name: "tableau2",
      options: { layout: "visibleStack", dragRules: dragRules },
    },
    {
      name: "tableau3",
      options: { layout: "visibleStack", dragRules: dragRules },
    },
    {
      name: "tableau4",
      options: { layout: "visibleStack", dragRules: dragRules },
    },
    {
      name: "tableau5",
      options: { layout: "visibleStack", dragRules: dragRules },
    },
    {
      name: "tableau6",
      options: { layout: "visibleStack", dragRules: dragRules },
    },
    {
      name: "tableau7",
      options: { layout: "visibleStack", dragRules: dragRules },
    },
    {
      name: "tableau8",
      options: { layout: "visibleStack", dragRules: dragRules },
    },
    { name: "freeSpot1", options: { rules: freeSpotRules } },
    { name: "freeSpot2", options: { rules: freeSpotRules } },
    { name: "freeSpot3", options: { rules: freeSpotRules } },
    { name: "freeSpot4", options: { rules: freeSpotRules } },
    {
      name: "aceSpot1",
      options: { rules: aceSpotRules, groupDrag: false },
    },
    {
      name: "aceSpot2",
      options: { rules: aceSpotRules, groupDrag: false },
    },
    {
      name: "aceSpot3",
      options: { rules: aceSpotRules, groupDrag: false },
    },
    {
      name: "aceSpot4",
      options: { rules: aceSpotRules, groupDrag: false },
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

  // TODO: Re-enable linting on this file, and fix errors
}
