import { make54 } from "./deckBuilding";

class TableDeck {
  constructor() {
    this.drawPile = [];
    this.faceUp = [];
    this.discardPile = [];
    this.deck = []; // not sure if this is needed... may be nice to have the full deck being used here Just In Case....? May cause confusion tho.
  }
  // getters and setters

  get drawPile() {
    return this._drawPile;
  }

  set drawPile(newDrawPile) {
    this._drawPile = newDrawPile;
  }

  get faceUp() {
    return this._faceUp;
  }

  set faceUp(newFaceUp) {
    this._faceUp = newFaceUp;
  }

  get discardPile() {
    return this._discardPile;
  }

  set discardPile(newdiscardPile) {
    this._discardPile = newdiscardPile;
  }

  get deck() {
    return this._deck;
  }

  set deck(newDeck) {
    this._deck = newDeck;
  }

  // methods

  shuffleDeck = () => {
    const copiedDeck = [...this.deck]; // makes a copy of the original deck, to help not confuse loop using this.deck.length
    const shuffledDeck = []; // where the shuffled cards get pushed to
    for (let i = 0; i < this.deck.length; i++) {
      // loops this once for each card in deck
      const randomNum = Math.floor(Math.random() * copiedDeck.length); // makes a random number from 0 - (copied deck length -1) to use as an index
      shuffledDeck.push(copiedDeck.splice(randomNum, 1)[0]); // copiedDeck.splice returns an array with a random card in it. shuffledDeck.push()[0] adds only the value of the array to shuffled deck
    }
    this.deck = shuffledDeck; // refresh this.deck with the shuffled version
  };

  /* THIS IS NOW DONE BY THE CARD ITSELF... PROBABLY CAN DELETE. 
  flipCard = (fromThisPile, toThisPile) => {
    // flip card
  }; 
  */

  moveDiscardToDraw = () => {
    // move all discarded cards to draw pile
  };

  dealCards = () => {
    // deal x amount of cards to y amount of players from this.drawpile
  };
}

export default TableDeck;
