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
import { setTheme, redFelt } from "../../src/components/table/themes";
import { Rules } from "../../src/components/rules/rules";
import { pileElement } from "../../src/components/pile/pileElement";

const app = document.getElementById("app");
if (app) {
  // setting the background of the game
  setTheme(redFelt);

  // Game specific log
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

  // Initialize a deck of playing cards
  const gameDeck = StandardDeckOfCards();

  // creating a class for freeCell Rules that extends Rules
  class FreeCellRules extends Rules {
    constructor(passRules?, receiveRules?) {
      super(passRules, receiveRules);
    }
  }

  // Type casting my blank objects to ensure I have access to methods and props in my rules. The actual objects will be inserted during a pass.
  const s = {} as PileElementType<PlayingCard>;
  const d = {} as PileElementType<PlayingCard>;
  const c = {} as CardElementType<PlayingCard>;

  // the first 3 args to a rule are always SourcePile, DestinationPile, and Card being passed. Any additional args must be placed after
  const tableauReceiveRuleArray = [
    // card must be alternating colors
    (source, dest = d, card = c) => {
      // always must be willing to receive if no cards in the pile, this shortcut must be here for every rule
      if (dest.cardElements.length === 0) return true;
      if (card.card.color === dest.topCardElement.card.color) return false;
      else return true;
    },
    // card must be one less in value than the destination pile
    (source = s, dest = d, card = c) => {
      if (dest.cardElements.length === 0) return true;
      if (card.card.value + 1 !== dest.topCardElement.card.value) return false;
      else return true;
    },
  ];

  // rules for a tableau to be able to pass a card. Once again, SourcePile is the first arg, DestinationPile is the second, CardElement is the third.
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

  // rules for free spots are pretty much just receive any top card if the pile is empty
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

  // ace spot receive rules, must be an ace, or one higher in the same suit as the previous card
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

  // initializing all the rules for the 3 separate spots
  // rules for both passing and receiving
  const tableauRules = new FreeCellRules(
    tableauPassRuleArray,
    tableauReceiveRuleArray,
  );
  // always able to pass a card, rules for receiving
  const freeSpotRules = new FreeCellRules([() => true], freeSpotReceiveRules);
  // never pass a card, rules for receiving
  const aceSpotRules = new FreeCellRules([() => false], aceSpotReceiveRules);

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
  }
  for (let i = 1; i < 5; i++) {
    freeSpots.push(
      gameDeck.createPileElement(`freeSpot${i}`, [], {
        rules: freeSpotRules,
        receiveCardCallback: gameInfo.minusFreeSpace,
        passCardCallback: gameInfo.addFreeSpace,
      }),
    );
    aceSpots.push(
      gameDeck.createPileElement(`aceSpot${i}`, [], {
        rules: aceSpotRules,
        groupDrag: false,
      }),
    );
  }

  // In my index.html I created a layout with id's matching the names I used for my pileElements.
  // I am getting those elements, and putting the correct pileElement in the spot
  [...tableaus, ...freeSpots, ...aceSpots, deck].forEach((element) => {
    document.getElementById(element.pile.name)?.appendChild(element.container);
  });

  // Once the DomContent is loaded we can run some async operations
  window.addEventListener("DOMContentLoaded", async () => {
    // shuffle the deck, deal the cards, then remove the dealers pile container.
    deck.shuffle();
    await deal(7, deck, tableaus, 100);
    document.getElementById("deck")?.removeChild(deck.container);
    // each of the tableaus will now have the cards dealt, and you must flip the cards
    tableaus.forEach((pile) => {
      pile.cardElements.forEach((element) => element.flip());
      // we didn't initialize tableaus with rules, as we wanted to pass shuffled cards to them
      // now we must put the rules into play
      pile.options.rules = tableauRules;
    });

    //! These helper functions and listeners are only for adding extra double click functionality to the game
    //! Drag and drop functionality will work without these

    // helper function to look for and return the first empty free spot
    function checkForAvailableFreeSpot() {
      return freeSpots.find((element) => {
        return element.cardElements.length === 0;
      });
    }

    // helper function to move a card to the ace spot if conditions are correct.
    // returns true if it found an acceptable spot, and false if it is unable to move to aces
    function moveToAceSpot(
      source: PileElementType<PlayingCard>,
      cardElement: CardElementType<PlayingCard>,
    ) {
      if (cardElement.card.value === 1) {
        const firstFreeSpot = aceSpots.filter((element) => {
          return element.cardElements.length === 0;
        })[0];
        source.moveCardToPile(firstFreeSpot, cardElement);
        return true;
      } else {
        const allowedMove = aceSpots.filter((element) => {
          if (element.cardElements.length === 0) return false;
          return (
            element.topCardElement.card.suit === cardElement.card.suit &&
            element.topCardElement.card.value === cardElement.card.value - 1
          );
        });
        if (allowedMove.length === 0) return false;
        else {
          source.moveCardToPile(allowedMove[0], cardElement);
          return true;
        }
      }
    }

    // helper function to move a card to tableaus if conditions are correct.
    // returns true if it found an acceptable spot, and false if it is unable to move to tableaus
    // will prioritize a legal move over putting it on a blank tableau
    function moveToTableau(
      source: PileElementType<PlayingCard>,
      cardElement: CardElementType<PlayingCard>,
    ) {
      const legalMove = tableaus.find((pile) => {
        if (pile.cardElements.length === 0) return false;
        return (
          pile.topCardElement.card.color !== cardElement.card.color &&
          pile.topCardElement.card.value === cardElement.card.value + 1
        );
      });
      if (legalMove) {
        source.moveCardToPile(legalMove, cardElement);
        return true;
      }
      const blankTableau = tableaus.find((pile) => {
        return pile.cardElements.length === 0;
      });
      if (blankTableau) {
        source.moveCardToPile(blankTableau, cardElement);
        return true;
      } else return false;
    }

    // now we add the listeners to each pile
    tableaus.forEach((pile) => {
      pile.container.addEventListener("dblclick", (e) => {
        // a check to ensure the target is an element
        if (!(e.target instanceof HTMLElement)) return;
        // a function that recursively finds the card container from anywhere clicked on a card
        const cardElement = pile.findCardContainer(e.target);
        // safety check that the pile had a card
        if (cardElement === null) return;
        // only allow double clicks on the top card of a tableau
        if (pile.topCardElement !== cardElement) {
          denyMove(cardElement);
          return false;
        }
        // prioritize a move to an ace spot
        if (moveToAceSpot(pile, cardElement) === true) return;
        // next priority is a tableau move
        if (moveToTableau(pile, cardElement) === true) return;
        // last option is to move it to a free spot
        const availableFreeSpots = checkForAvailableFreeSpot();
        if (availableFreeSpots) {
          pile.moveCardToPile(availableFreeSpots, cardElement);
          return true;
          // if no available moves, deny the move
        } else denyMove(cardElement);
        return false;
      });
    });

    // please see above breakdown for details
    freeSpots.forEach((pile) => {
      pile.container.addEventListener("dblclick", (e) => {
        if (!(e.target instanceof HTMLElement)) return;
        const cardElement = pile.findCardContainer(e.target);
        if (cardElement === null) return;
        if (moveToAceSpot(pile, cardElement) === true) return;
        if (moveToTableau(pile, cardElement) === true) return;
        else {
          denyMove(cardElement);
          return false;
        }
      });
    });
    // please see above breakdown for details
    aceSpots.forEach((pile) => {
      pile.container.addEventListener("dblclick", (e) => {
        if (!(e.target instanceof HTMLElement)) return;
        const cardElement = pile.findCardContainer(e.target);
        if (cardElement === null) return;
        denyMove(cardElement);
        return false;
      });
    });
  });
}

// TODO: Re-enable linting on this file, and fix errors
