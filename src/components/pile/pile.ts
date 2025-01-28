import Card from "../card/card";
import Deck from "../deck/deck";

/**
 * The cards in a Pile are a REFERENCE to the cards in the deck
 */
export default class Pile<T extends Card> {
  private _cards: T[];
  constructor(_deck: Deck<T>, cards: T[] = []) {
    this._cards = [...cards];
  }

  get cards() {
    return this._cards;
  }

  private _getCardIndex = (card: T): number => {
    return this.cards.indexOf(card);
  };

  receiveCard = (cards: T | T[], conditions: () => Boolean = () => true) => {
    if (conditions() === false) {
      return false;
    }
    if (Array.isArray(cards)) {
      cards.forEach((card) => {
        this._cards.push(card);
      });
    } else {
      this._cards.push(cards);
    }
    return true;
  };

  passCard = (
    target: Pile<T>,
    card: T = this._cards[this._cards.length - 1],
    rules: () => Boolean = () => true
  ) => {
    if (target.receiveCard(card, rules) === false) return false;
    else {
      this._cards.splice(this._getCardIndex(card), 1);
      return true;
    }
  };
  shuffle = () => {
    const copy = [...this._cards];
    const shuffledPile = [];
    for (let i = 0; i < this._cards.length; i++) {
      const randomNum = Math.floor(Math.random() * copy.length);
      shuffledPile.push(copy.splice(randomNum, 1)[0]);
    }
    this._cards = shuffledPile;
  };

  //! Should this be a method? I think this was Solitaire Necessary
  isLastCard = (card: T) => {
    if (this._getCardIndex(card) === this._cards.length - 1) return true;
    else return false;
  };
}
