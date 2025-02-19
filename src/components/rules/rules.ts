import { CardElementType } from "../../types/card.types";
import { PileElementType } from "../../types/pile.types";
import Card from "../card/card";

export interface RuleSet<T extends Card> {
  canPass: Rule<T>;
  canReceive: Rule<T>;
}

export type Rule<T extends Card> = (
  source: PileElementType<T>,
  destination: PileElementType<T>,
  card: CardElementType<T>,
  ...extraArgs: unknown[]
) => boolean;

export class Rules<T extends Card> implements RuleSet<T> {
  passRules: Rule<T>[];
  receiveRules: Rule<T>[];

  constructor(
    passRules: Rule<T>[] = [() => true],
    receiveRules: Rule<T>[] = [() => true],
  ) {
    this.passRules = passRules;
    this.receiveRules = receiveRules;
  }

  canPass: Rule<T> = (source, destination, card, ...extraArgs) =>
    this.passRules.every((rule) =>
      rule(source, destination, card, ...extraArgs),
    );

  canReceive: Rule<T> = (source, destination, card, ...extraArgs) =>
    this.receiveRules.every((rule) =>
      rule(source, destination, card, ...extraArgs),
    );
}
