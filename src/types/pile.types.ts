import { CardElementType } from "./card.types";
import Pile from "../components/pile/pile";
import Card from "../components/card/card";
import { Rules } from "../components/rules/rules";

export type PileElementType<T extends Card> = {
  pile: Pile<T>;
  cards: T[];
  cardElements: CardElementType<T>[];
  container: HTMLDivElement;
  cascadeOffset: [number, number];
  cascadeDuration: number;
  cascade: () => Promise<unknown>;
  applyCascadeLayout: (layoutName: string) => void | Error;
  createCascadeLayout: (layoutName: string, offset: Offset) => void;
  getTopCardElement: () => CardElementType<T>;
  moveCardToPile: (
    destinationPile: PileElementType<T>,
    cardElement?: CardElementType<T>,
    gameRules?: Rules,
    animationCallback?: (
      destination: PileElementType<T>,
      cardThatWasPassed: CardElementType<T>,
    ) => Promise<boolean>,
  ) => Promise<boolean> | false;
  reset: () => void;
  findCardContainer: (element: HTMLElement) => null | CardElementType<T>;
  shuffle: () => void;
  options: pileOptionsType<T>;
};

export interface DragData {
  indexs: string[];
  sourcePileContainerId: string;
}

export type pileOptionsType<T extends Card> = {
  cardElements: CardElementType<T>[];
  layout: "stack" | "cascade" | "visibleStack";
  draggable: boolean;
  rules: Rules;
  groupDrag: boolean;
};

export type Offset = [number, number];

type LayoutSection = {
  offset: Offset;
};

export type Layout = {
  stack: LayoutSection;
  cascade: LayoutSection;
  [key: string]: LayoutSection;
  visibleStack: LayoutSection;
};
