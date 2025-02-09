export interface RuleSet {
  canPass(arr: [() => boolean]): boolean;
  canReceive(arr: [() => boolean]): boolean;
}

export class Rules implements RuleSet {
  // Rules accept any number of arguments and return a boolean
  passRules: Array<(...args: unknown[]) => boolean>;
  receiveRules: Array<(...args: unknown[]) => boolean>;

  constructor(
    passRules: Array<(...args: unknown[]) => boolean> = [],
    receiveRules: Array<(...args: unknown[]) => boolean> = [],
  ) {
    this.passRules = passRules;
    this.receiveRules = receiveRules;
  }

  canPass(...args: unknown[]): boolean {
    return this.passRules.every((rule) => rule(...args));
  }

  canReceive(...args: unknown[]): boolean {
    return this.receiveRules.every((rule) => rule(...args));
  }
}
