import { Card } from "../../types/card.types";

export default class Deck {
  #cards: Card[];
  constructor(cards: Card[] = []) {
    this.#cards = cards;
  }
  get cards() {
    return this.#cards;
  }

  #getCardIndex(card: Card) {
    return this.#cards.indexOf(card);
  }

  addCards(cards: Card | Card[], conditions: () => Boolean = () => true) {
    if (conditions() === false) {
      return false;
    }
    if (Array.isArray(cards)) {
      cards.forEach((card) => {
        this.#cards.push(card);
      });
    } else {
      this.#cards.push(cards);
    }
    return true;
  }

  passCard(
    target: Deck,
    card: Card = this.cards[this.cards.length - 1],
    rules: () => Boolean = () => true
  ) {
    if (target.addCards(card, rules) === false) return false;
    else {
      this.#cards.splice(this.#getCardIndex(card), 1);
      return true;
    }
  }
  shuffle = () => {
    const copy = [...this.cards];
    const shuffledDeck = [];
    for (let i = 0; i < this.cards.length; i++) {
      const randomNum = Math.floor(Math.random() * copy.length);
      shuffledDeck.push(copy.splice(randomNum, 1)[0]);
    }
    this.#cards = shuffledDeck;
  };

  //! Should this be a method? I think this was Solitaire Necessary
  isLastCard(card: Card) {
    if (this.#getCardIndex(card) === this.#cards.length - 1) return true;
    else return false;
  }
}
