/**
 * Bare Bones Card, only prop is facedUp
 */
export default class Card {
  faceUp: Boolean;
  constructor() {
    this.faceUp = false;
  }

  /**
   * changes whether card is faceUp or not
   */
  flip() {
    this.faceUp = !this.faceUp;
  }
}
