type CardElements = {
  front: HTMLDivElement;
  back: HTMLDivElement;
  parent: HTMLDivElement;
  container: HTMLDivElement;
};

type CardFunctions = {
  flipCard: (delay?: number) => void;
  getFlipSpeed: () => string;
  blindFlip: () => void;
};

// TODO: This is in the wrong place. Need to eventually move this
export type DeckBase = {
  id?: string;
  position?: number;
};

export type CardDom = {
  faceUp: boolean;
  flipEnabled: boolean;
  state: "available" | "busy";
  location: DeckBase | null;
} & CardElements &
  CardFunctions;
