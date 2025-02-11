/* eslint-disable @typescript-eslint/no-unused-vars */
import "../../src/styles/style.css";
import "../../src/styles/card.css";
import "../../src/styles/theme.css";
import "./styles.css";
import "../../src/components/navMenu/navMenu";
import PlayingCard from "../../src/components/card/playingCard/playingCardClass";
import StandardDeckOfCards from "../../src/components/card/playingCard/standardDeckOfCards";
import Player from "../../src/components/player/player";
import { deal, denyMove } from "../../src/components/animate/animate";
import { PileElementType } from "../../src/types/pile.types";
import { CardElementType } from "../../src/types/card.types";
import { setTheme, greenFelt } from "../../src/components/table/themes";
import { Rules } from "../../src/components/rules/rules";
import { pileElement } from "../../src/components/pile/pileElement";

const app = document.getElementById("app");
if (app) {
  // setting the background of the game
  setTheme(greenFelt);

  // Initialize a deck of playing cards
  const gameDeck = StandardDeckOfCards();
  // creating the pile Elements to display the cards
  const deck = gameDeck.createPileElement("deck", gameDeck.cards);
  // Type casting my blank arrays to ensure I have access to methods and props
  const tableaus: PileElementType<PlayingCard>[] = [];
  const freeSpots: PileElementType<PlayingCard>[] = [];
  const aceSpots: PileElementType<PlayingCard>[] = [];
  // running loops to make elements, as all tableaus are the same, all free spots, and all ace spots.
  for (let i = 1; i < 9; i++) {
    tableaus.push(
      gameDeck.createPileElement(`tableau${i}`, [], { layout: "visibleStack" }),
    );
    document
      .getElementById(`tableau${i}`)
      ?.appendChild(tableaus[i - 1].container);
  }
  for (let i = 1; i < 9; i++) {
    freeSpots.push(gameDeck.createPileElement(`freeSpot${i}`, [], {}));
    aceSpots.push(gameDeck.createPileElement(`aceSpot${i}`, [], {}));
    document
      .getElementById(`freeSpot${i}`)
      ?.appendChild(freeSpots[i - 1].container);
    document
      .getElementById(`aceSpot${i}`)
      ?.appendChild(aceSpots[i - 1].container);
  }
}
