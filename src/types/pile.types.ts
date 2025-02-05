import { CardElementType } from "./card.types";
import Pile from "../components/pile/pile";
import Card from "../components/card/card";

export type PileElementType<T extends Card> = {
  type: "stack" | "cascade";
  pile: Pile<T>;
  cards: T[];
  cardElements: CardElementType<T>[];
  container: HTMLDivElement;
  cascadeOffset: [number, number];
  cascadeDuration: number;
  cascade: () => Promise<unknown>;
  slideCard: (
    cardElement: CardElementType<T>,
    vector2: [number, number],
    duration: number,
  ) => Promise<Animation | undefined>;
  getTopCardElement: () => CardElementType<T>;
  spinCard: (
    cardElement: CardElementType<T>,
    duration: number,
  ) => Promise<Animation> | Promise<unknown>;
  zoomCard: (
    cardElement: CardElementType<T>,
    factor: number,
    duration: number,
  ) => Promise<Animation>;
  slideDeck: (vector1: number[], duration: number) => void;
  moveCardToPile: (
    destinationPile: PileElementType<T>,
    cardElement?: CardElementType<T>,
    gameRules?: boolean,
    animationCallback?: (
      destination: PileElementType<T>,
      cardThatWasPassed: CardElementType<T>,
    ) => Promise<boolean>,
  ) => boolean;
  reset: () => void;
  findCardContainer: (element: HTMLElement) => null | CardElementType<T>;
  options: pileOptionsType<T>;
};

export interface DragData {
  indexs: string[];
  sourcePileContainerId: string;
}

export type pileOptionsType<T extends Card> = {
  cardElements: CardElementType<T>[];
  type: "stack" | "cascade";
  draggable: boolean;
  rules: () => boolean;
  groupDrag: boolean;
};

type Offset = [number, number];

type LayoutSection = {
  offset: Offset;
};

export type Layout = {
  stack: LayoutSection;
  cascade: LayoutSection;
};
