import Card from "../card/card";
import Deck from "../deck/deck";
import { PileElement } from "../pile/pileElement";

export default class Player<T extends Card> {
  private _deck: Deck<T>;
  private _piles: PileElement<T>[];
  name: string;
  constructor(
    name: string,
    deck: Deck<T>,
    piles: string[],
    cardInitializer?: string
  ) {
    this._deck = deck;
    this.name = name;
    this._piles = piles.map((pileName) => {
      // Need somewhere to put all the cards to start the game... could be 1 spot per player
      if (pileName === cardInitializer) {
        return deck.createPileElement(pileName, deck.cards);
      }
      return deck.createPileElement(pileName);
    });
  }

  get piles() {
    return this._piles;
  }

  get deck() {
    return this._deck;
  }

  getPile = (name: string) => {
    return this._piles.filter((element) => element.pile.name === name)[0];
  };
}
