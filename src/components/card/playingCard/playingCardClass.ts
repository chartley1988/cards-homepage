import Card from "../card";

/**
 * @props suit, symbol, number, value
 * @methods updateValue(newValue)
 */
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
    value: number = 0,
  ) {
    super();
    this.suit = suit;
    this.number = number;
    this.value = value;

    switch (number) {
      case "A":
        this.value = 1;
        break;
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "10":
        this.value = 2;
        break;
      case "J":
        this.value = 11;
        break;
      case "Q":
        this.value = 12;
        break;
      case "K":
        this.value = 13;
        break;
      case "joker":
        this.value = 100;
        break;
      default:
        this.value = Number(number);
    }

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
  updateValue = (newValue: number) => {
    this.value = newValue;
  };
}
