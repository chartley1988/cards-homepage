import Card from "../card";

export default class PlayingCard extends Card {
  suit: "diamond" | "spade" | "heart" | "club" | "joker";
  symbol: "♦" | "♠" | "♥" | "♣" | "joker";
  number:
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
    | "K"
    | "joker";
  value: number;

  constructor(
    number:
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
      | "K"
      | "joker",
    suit: "diamond" | "spade" | "heart" | "club" | "joker",
    value: number = 0
  ) {
    super();
    this.suit = suit;
    this.number = number;
    this.value = value;
    switch (suit) {
      case "spade":
        this.symbol = "♠";
        break;
      case "diamond":
        this.symbol = "♦";
        break;
      case "club":
        this.symbol = "♣";
        break;
      case "heart":
        this.symbol = "♥";
        break;
      default:
        this.symbol = "joker";
    }
  }
}
