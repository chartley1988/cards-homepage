import Card from "../card/card";

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
export default class Deck {
  protected cards: Card[];
  constructor(cards: Card[] = []) {
    this.cards = cards;
  }

  getCards = () => {
    return this.cards;
  };

  /**
   * @param cards must be a singular item of class Card or an Array of class Card
   * @returns card will be added into the deck
   */
  addCards(cards: Card | Card[]) {
    if (Array.isArray(cards)) {
      cards.forEach((card) => {
        this.cards.push(card);
      });
    } else {
      this.cards.push(cards);
    }
    return;
  }

  // just totally eliminates a card from existence
  /**
   *
   * @param card A singular item of class Card
   * @returns true if card was removed
   * @returns false if card was not found in deck
   */
  removeCard = (card: Card) => {
    this.cards.forEach((item) => {
      if (JSON.stringify(item) === JSON.stringify(card)) {
        this.cards.splice(
          this.cards.findIndex((index) => index === card),
          1
        );
      }
    });
  };
}
