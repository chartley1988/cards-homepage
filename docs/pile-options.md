---
outline: deep
---

# Pile Options

Pile Elements take a third optional argument which is an object containing different options.

## Option Properties

| Property              | Type                       | Description                                                            | Default     | Alternative Options      |
| --------------------- | -------------------------- | ---------------------------------------------------------------------- | ----------- | ------------------------ |
| `cardElements`        | `Array of CardElements<T>` | CardElements are any extension of CardElement                          | Empty Array | Provide Array            |
| `layout`              | `string`                   | Appearance of the Cards in the pile                                    | stack       | 'cascade' 'visibleStack' |
| `rules`               | `class Rule `              | When cards are passed or received these rules determine if its allowed | new Rules() | Provide Rules            |
| `draggable`           | `boolean`                  | Whether or not drag and drop is allowed on cards in this pile          | true        | false                    |
| `groupDrag`           | `boolean`                  | Allow dragging a whole stack of cards from this pile                   | true        | false                    |
| `receiveCardCallback` | `function`                 | Perform game specific logic after a card is received in this pile      | ( ) => true | Provide a function       |
| `passCardCallback`    | `function`                 | Perform game specific logic after a card is passed from this pile      | ( ) => true | Provide a function       |

## Option Type

```typescript
type pileOptionsType<T extends Card> = {
  cardElements: CardElementType<T>[];
  layout: "stack" | "cascade" | "visibleStack";
  rules: Rules<T>;
  draggable: boolean;
  groupDrag: boolean;
  receiveCardCallback: (
    card: CardElementType<T>,
    source: PileElementType<T>,
    destination: PileElementType<T>,
    ...extraArgs: unknown[]
  ) => boolean;
  passCardCallback: (
    card: CardElementType<T>,
    source: PileElementType<T>,
    destination: PileElementType<T>,
    ...extraArgs: unknown[]
  ) => boolean;
};
```

## How to use options

### Suggested: using deck to create piles

Its suggested to use a deck to create pileElements, the drag and drop system works more cohesively when decks are used to create individual piles.

```typescript
import StandardDeckOfCards from "@/components/card/playingCard/standardDeckOfCards";

const deck = StandardDeckOfCards();
const handOptions = {
  layout: "cascade",
  groupDrag: false,
};
const drawPileOptions = {
  rules: new Rules([() => true], [() => false]), // always pass, never receive
  groupDrag: false,
};
const hand = deck.createPileElement("hand", [], handOptions);
const drawPile = deck.createPileElement(
  "drawPile",
  deck.cards,
  drawPileOptions,
);
```

Please see [Rules](/rules) for more info on the Rules class

Please see [Callbacks](/callbacks) for more info on callbacks
