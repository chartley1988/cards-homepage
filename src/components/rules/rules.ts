import { RuleSet, Rule } from "@/types/rules.types";
import Card from "../card/card";

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
