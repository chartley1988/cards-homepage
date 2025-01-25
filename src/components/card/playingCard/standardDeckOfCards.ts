import Deck from "../../deck/deck";
import PlayingCard from "./playingCard";

type suit = "diamond" | "spade" | "heart" | "club";
type cardNumber =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

function StandardDeckOfCards() {
  // Dictionary of Standard 52 Card deck definitions
  const standardDeck: { suit: suit[]; members: cardNumber[] } = {
    suit: ["diamond", "heart", "spade", "club"],

    members: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
  };
  const returnDeck = new Deck();
  for (let index = 0; index < standardDeck.suit.length; index++) {
    const suit = standardDeck.suit[index];
    for (let index2 = 0; index2 < standardDeck.members.length; index2++) {
      const cardNumber = standardDeck.members[index2];
      const newCard = new PlayingCard(cardNumber, suit);
      returnDeck.addCards(newCard);
    }
  }
  // adds the two jokers
  returnDeck.addCards(new PlayingCard("joker", "joker"));
  returnDeck.addCards(new PlayingCard("joker", "joker"));

  return returnDeck;
}

export default StandardDeckOfCards;
