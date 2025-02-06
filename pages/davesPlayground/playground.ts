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
import { PileElementType } from "../../src/types/pile.types";
import { CardElementType } from "../../src/types/card.types";

const app = document.getElementById("app");
if (app) {
  const gameDeck = StandardDeckOfCards();

  const tableauRules = (
    sourcePile: PileElementType<PlayingCard>,
    destinationPile: PileElementType<PlayingCard>,
    cardElement: CardElementType<PlayingCard>,
  ) => {
    const card = cardElement.card;
    const destCard = destinationPile.getTopCardElement().card;
    if (card.color === "red") {
      if (destCard.color !== "black") {
        return false;
      }
    }
    if (card.color === "black") {
      if (destCard.color !== "red") {
        return false;
      }
    }
    if (
      card.value + 1 !== destCard.value &&
      card.value - 1 !== destCard.value
    ) {
      return false;
    }
    return true;
  };
  const freeSpotRules = () => true;
  const aceSpotRules = () => true;
  const piles = [
    { name: "deck", options: {} },
    {
      name: "tableau1",
      options: { rules: tableauRules, layout: "visibleStack" },
    },
    {
      name: "tableau2",
      options: { rules: tableauRules, layout: "visibleStack" },
    },
    {
      name: "tableau3",
      options: { rules: tableauRules, layout: "visibleStack" },
    },
    {
      name: "tableau4",
      options: { rules: tableauRules, layout: "visibleStack" },
    },
    {
      name: "tableau5",
      options: { rules: tableauRules, layout: "visibleStack" },
    },
    {
      name: "tableau6",
      options: { rules: tableauRules, layout: "visibleStack" },
    },
    {
      name: "tableau7",
      options: { rules: tableauRules, layout: "visibleStack" },
    },
    {
      name: "tableau8",
      options: { rules: tableauRules, layout: "visibleStack" },
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
    });
  });

  // TODO: Renable linting on this file, and fix errors
}
