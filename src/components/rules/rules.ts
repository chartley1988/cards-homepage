import { CardElementType } from "../../types/card.types";
import { PileElementType } from "../../types/pile.types";
import Card from "../card/card";

export interface RuleSet<T extends Card> {
  canPass(
    source: PileElementType<T>,
    destination: PileElementType<T>,
    card: CardElementType<T>,
    ...extraArgs: unknown[]
  ): boolean;
  canReceive(
    source: PileElementType<T>,
    destination: PileElementType<T>,
    card: CardElementType<T>,
    ...extraArgs: unknown[]
  ): boolean;
}

export class Rules<T extends Card> implements RuleSet<T> {
  passRules: Array<
    (
      source: PileElementType<T>,
      destination: PileElementType<T>,
      card: CardElementType<T>,
      ...extraArgs: unknown[]
    ) => boolean
  >;
  receiveRules: Array<
    (
      source: PileElementType<T>,
      destination: PileElementType<T>,
      card: CardElementType<T>,
      ...extraArgs: unknown[]
    ) => boolean
  >;

  constructor(
    passRules: Array<
      (
        source: PileElementType<T>,
        destination: PileElementType<T>,
        card: CardElementType<T>,
        ...extraArgs: unknown[]
      ) => boolean
    > = [],
    receiveRules: Array<
      (
        source: PileElementType<T>,
        destination: PileElementType<T>,
        card: CardElementType<T>,
        ...extraArgs: unknown[]
      ) => boolean
    > = [],
  ) {
    this.passRules = passRules;
    this.receiveRules = receiveRules;
  }

  canPass(
    source: PileElementType<T>,
    destination: PileElementType<T>,
    card: CardElementType<T>,
    ...extraArgs: unknown[]
  ): boolean {
    return this.passRules.every((rule) =>
      rule(source, destination, card, ...extraArgs),
    );
  }

  canReceive(
    source: PileElementType<T>,
    destination: PileElementType<T>,
    card: CardElementType<T>,
    ...extraArgs: unknown[]
  ): boolean {
    return this.receiveRules.every((rule) =>
      rule(source, destination, card, ...extraArgs),
    );
  }
}
