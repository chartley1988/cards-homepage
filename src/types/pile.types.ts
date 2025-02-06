import { CardElementType } from "./card.types";
import Pile from "../components/pile/pile";
import Card from "../components/card/card";

export type PileElementType<T extends Card> = {
  pile: Pile<T>;
  cards: T[];
  cardElements: CardElementType<T>[];
  container: HTMLDivElement;
  cascadeOffset: [number, number];
  cascadeDuration: number;
  cascade: () => Promise<unknown>;
  getTopCardElement: () => CardElementType<T>;
  moveCardToPile: (
    destinationPile: PileElementType<T>,
    cardElement?: CardElementType<T>,
    gameRules?: boolean,
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
  type: "stack" | "cascade" | "visibleStack";
  draggable: boolean;
  rules: (
    sourcePile: PileElementType<T>,
    destinationPile: PileElementType<T>,
    cardElement: CardElementType<T>,
  ) => boolean;
  groupDrag: boolean;
};

type Offset = [number, number];

type LayoutSection = {
  offset: Offset;
};

export type Layout = {
  stack: LayoutSection;
  cascade: LayoutSection;
  visibleStack: LayoutSection;
};
