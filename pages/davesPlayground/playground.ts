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
import { CardElement } from "../../src/components/card/cardElement";

const app = document.getElementById("app");
if (app) {
  setTheme(redFelt);

  const gameInfo = {
    freeSpaces: 4,
    getFreeSpaces: () => {
      return gameInfo.freeSpaces;
    },
    addFreeSpace: () => {
      gameInfo.freeSpaces += 1;
      return true;
    },
    minusFreeSpace: () => {
      gameInfo.freeSpaces -= 1;
      return true;
    },
  };

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
      if (dest.cardElements.length === 0) return true;
      if (card.card.color === dest.topCardElement.card.color) return false;
      else return true;
    },
    // card must be one less than the destination pile
    (source = s, dest = d, card = c) => {
      if (dest.cardElements.length === 0) return true;
      if (card.card.value + 1 !== dest.topCardElement.card.value) return false;
      else return true;
    },
  ];
  const tableauPassRuleArray = [
    // can only pass if top card, or sequence is correct
    (source = s, dest = d, card = c) => {
      if (source.topCardElement === card) return true;
      const cardIndex = source.cardElements.findIndex((element) => {
        return JSON.stringify(element) === JSON.stringify(card);
      });
      const cardsOnTop = source.cardElements.slice(cardIndex);
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
      else return true;
    },
    // cant pass a group if not enough free spaces
    (source = s, dest = d, card = c, freeSpaces = gameInfo.getFreeSpaces()) => {
      if (source.topCardElement === card) return true;
      const cardIndex = source.cardElements.findIndex((element) => {
        return JSON.stringify(element) === JSON.stringify(card);
      });
      const cardDepth = source.cardElements.length - 1 - cardIndex;
      if (cardDepth > freeSpaces) return false;
      else return true;
    },
    (source = s, dest = d, card = c) => {
      if (card) return true;
    },
    (source = s, dest = d, card = c) => {
      if (card) return true;
    },
  ];

  const freeSpotReceiveRules = [
    // if theres a card in the spot its illegal
    (source = s, dest = d, card = c) => {
      if (dest.cardElements.length > 0) {
        return false;
      } else {
        return true;
      }
    },
    // if your not passing the top card, its illegal
    (source = s, dest = d, card = c) => {
      if (source.topCardElement !== card) {
        return false;
      } else return true;
    },
  ];

  const aceSpotReceiveRules = [
    (source = s, dest = d, card = c) => {
      if (dest.cardElements.length > 0) {
        const topCard = dest.topCardElement.card;
        return (
          topCard.suit === card.card.suit &&
          card.card.value - 1 === topCard.value
        );
      } else return card.card.value === 1;
    },
  ];

  const tableauRules = new FreeCellRules(
    tableauPassRuleArray,
    tableauReceiveRuleArray,
  );
  const freeSpotRules = new FreeCellRules([() => true], freeSpotReceiveRules);
  const aceSpotRules = new FreeCellRules([() => false], aceSpotReceiveRules);

  const piles = [
    { name: "deck" },
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
    {
      name: "freeSpot1",
      options: {
        rules: freeSpotRules,
        receiveCardCallback: gameInfo.minusFreeSpace,
        passCardCallback: gameInfo.addFreeSpace,
      },
    },
    {
      name: "freeSpot2",
      options: {
        rules: freeSpotRules,
        receiveCardCallback: gameInfo.minusFreeSpace,
        passCardCallback: gameInfo.addFreeSpace,
      },
    },
    {
      name: "freeSpot3",
      options: {
        rules: freeSpotRules,
        receiveCardCallback: gameInfo.minusFreeSpace,
        passCardCallback: gameInfo.addFreeSpace,
      },
    },
    {
      name: "freeSpot4",
      options: {
        rules: freeSpotRules,
        receiveCardCallback: gameInfo.minusFreeSpace,
        passCardCallback: gameInfo.addFreeSpace,
      },
    },
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
    document.getElementById("deck")?.removeChild(deck.container);
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
