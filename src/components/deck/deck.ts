import Card from "../card/card";
import Pile from "../pile/pile";

/**
 * A deck is all of the cards to be used in your game.
 *
 * Most Standard Playing Card games will only have one deck (52 cards)
 *
 * Players will have cards from this deck in their piles... draw piles, hands, discard piles, etc. Those are Piles.
 *
 * In a more advanced game, each player could be playing from separate decks, ex) Magic The Gathering
 *
 * Pass an argument of an array of Cards to build deck with cards added already. Or initiate a deck and use function addCards to populate cards.
 */
export default class Deck<T extends Card> {
  private _cards: T[];
  private _piles: Pile<T>[];
  private _graveyard: Pile<T>;
  constructor(cards: T[] = []) {
    this._cards = cards;
    this._piles = [];
    this._graveyard = new Pile<T>(this); // to remove a card already in play it has to be passed to a pile... this is the graveyard pile it goes to. Rare use case.
  }

  get cards() {
    return this._cards;
  }

  /**
   * @param cards must be a singular item of class Card or an Array of class Card
   * @returns card will be added into the deck
   */
  addCards = (cards: T | T[]) => {
    if (Array.isArray(cards)) {
      cards.forEach((card) => {
        this._cards.push(card);
      });
    } else {
      this.cards.push(cards);
    }
    return;
  };
  /**
   * This will create a pile for draw piles, discard piles, hands. Anywhere cards can go!
   * @returns Piles
   */

  createPile = (cards: T[] = []) => {
    const pile = new Pile(this, cards);
    this._piles.push(pile);
    return pile;
  };

  // just totally eliminates a card from existence
  /**
   *
   * @param card A singular item of class Card
   * @returns true if card was removed
   * @returns false if card was not found in deck
   */
  removeCard = (card: T) => {
    this.cards.forEach((item) => {
      if (JSON.stringify(item) === JSON.stringify(card)) {
        const removalCard = this._cards.splice(
          this.cards.findIndex((index) => index === card),
          1
        )[0];
        this._piles.forEach((pile) => {
          if (pile.cards.includes(removalCard)) {
            pile.passCard(this._graveyard, removalCard);
          }
        });
        return true;
      }
    });
    return false;
  };
}
