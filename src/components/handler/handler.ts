import Card from "../card/card";
import Deck from "../deck/deck";
import Pile from "../pile/pile";
import Player from "../player/player";

export default class Handler<T extends Card> {
  private _players: Player<T>[];

  constructor(
    players: {
      name: string;
      deck: Deck<T>;
      piles: [];
      cardInitializer?: string;
    }[],
  ) {
    this._players = players.map(
      (player) =>
        new Player(
          player.name,
          player.deck,
          player.piles,
          player.cardInitializer, // Need somewhere to put all the cards to start the game
        ),
    );
  }

  player(name: string) {
    return this._players.filter((player) => player.name === name)[0];
  }

  deal(
    number: number,
    from: { player: Player<T>; pile: Pile<T> },
    to:
      | { player: Player<T>; pile: Pile<T> }[]
      | { player: Player<T>; pile: Pile<T> },
  ) {
    from.pile.shuffle();
    for (let i = 0; i < number; i++) {
      if (Array.isArray(to)) {
        to.forEach((player) => {
          from.pile.passCard(player.pile);
        });
      } else {
        from.pile.passCard(to.pile);
      }
    }
  }
}
