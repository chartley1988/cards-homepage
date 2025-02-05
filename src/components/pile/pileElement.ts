import Pile from "./pile";
import Card from "../card/card";
import { CardElement } from "../card/cardElement";
import "../../styles/pile.css";
import Deck from "../deck/deck";
import { slideCard } from "../animate/animate";

interface DragData {
  indexs: string[];
  sourcePileContainerId: string;
}

export type pileOptions<T extends Card> = {
  cardElements: CardElement<T>[];
  type: "stack" | "cascade";
  draggable: boolean;
  rules: () => boolean;
  groupDrag: boolean;
};

export const createDefaultOptions = <T extends Card>(): pileOptions<T> => ({
  cardElements: [],
  type: "stack",
  draggable: true,
  rules: () => true,
  groupDrag: true,
});

export type PileElement<T extends Card> = {
  type: "stack" | "cascade";
  pile: Pile<T>;
  cards: T[];
  cardElements: CardElement<T>[];
  container: HTMLDivElement;
  cascadePercent: number[];
  cascadeDuration: number;
  options: pileOptions<T>;
  cascade: () => Promise<unknown>;

  getTopCardElement: () => CardElement<T>;

  moveCardToPile: (
    destinationPile: PileElement<T>,
    cardElement?: CardElement<T>,
    gameRules?: boolean,
    animationCallback?: (
      destination: PileElement<T>,
      cardThatWasPassed: CardElement<T>,
    ) => Promise<boolean>,
  ) => boolean;
  cascadeValueSetter: (percent: number[], duration: number) => void;
  reset: () => void;
  animateMoveCardToNewDeck: (
    destination: PileElement<T>,
    cardThatWasPassed: CardElement<T>,
  ) => Promise<boolean>;
  topCard: CardElement<T>;
  findCardContainer: (element: HTMLElement) => null | CardElement<T>;
};

// Adds a base the size of the card to be the basis of deck layouts.\
export const pileElement = <T extends Card>(
  pile: Pile<T>,
  deck: Deck<T>,
  partialOptions: Partial<pileOptions<T>> = {},
): PileElement<T> => {
  const options: pileOptions<T> = {
    ...createDefaultOptions(),
    ...partialOptions,
  };
  const { type, cardElements, draggable, rules, groupDrag } = options;

  let cascadePercent = [0, 0.001];
  let cascadeDuration = 0;
  if (type === "stack") {
    cascadePercent = [-0.003, -0.003];
    cascadeDuration = 0;
  } else if (type === "cascade") {
    cascadePercent = [0.18, 0];
    cascadeDuration = 0;
  }
  const cards = pile.cards;

  // Define the function before it's used
  const allowDrop = (e: DragEvent) => {
    e.preventDefault();
  };
  const drag = (e: DragEvent) => {
    if (!(e.target instanceof HTMLElement)) return;

    // Find the main card container.
    const cardElement = findCardContainer(e.target);
    if (cardElement === null) return;

    // Prepare your drag data.
    const data = {
      indexs: [cardElement.container.style.zIndex],
      sourcePileContainerId: container.id,
    };

    if (groupDrag) {
      // Create a custom drag image that visually represents the group.
      const dragImage = document.createElement("div");
      dragImage.id = "card-dragImage";
      dragImage.classList.add("drag-image");

      // Get the parent element that holds the card and its siblings.
      const pileElement = cardElement.container.parentElement;
      if (!pileElement) return;

      // Card dragged index
      const originalZIndex = parseInt(cardElement.container.style.zIndex);

      // Iterate over all children in the pile.
      Array.from(pileElement.children).forEach((card) => {
        if (!(card instanceof HTMLElement)) {
          return;
        }

        // Get the card's z-index as a number.
        const cardZIndex = parseInt(card.style.zIndex);

        // Only add the class if the card's z-index is higher than the original.
        // Clone each card element and append to dragImage.
        if (cardZIndex >= originalZIndex) {
          card.classList.add("card-dragging");
          const clone = card.cloneNode(true);
          dragImage.appendChild(clone);
          if (cardZIndex !== originalZIndex) {
            data.indexs.push(card.style.zIndex);
          }
        }
      });

      // It might be necessary to add the drag image element off-screen before using it.
      dragImage.style.position = "absolute";
      dragImage.style.top = "-9999px";
      document.body.appendChild(dragImage);

      e.dataTransfer?.setDragImage(dragImage, 0, 0);
    }
    e.dataTransfer?.setData("application/json", JSON.stringify(data));
  };
  const dragend = (e: DragEvent) => {
    // clears the image being used by drag
    const dragImage = document.getElementById("card-dragImage");
    if (dragImage) {
      dragImage.remove();
    }
    // if the drop target isnt an element then abort
    if (!(e.target instanceof HTMLElement)) return;
    const cardElement = findCardContainer(e.target);

    if (cardElement === null || cardElement === undefined) return;
    const parent = cardElement.container.parentElement;
    // clears dragging class from all selected elements
    if (parent) {
      Array.from(parent.children).forEach((child) => {
        child.classList.remove("card-dragging");
      });
    }
  };

  const drop = (e: DragEvent) => {
    // if drop target isnt element, get out
    if (!(e.target instanceof HTMLElement)) return;
    const jsonData = e.dataTransfer?.getData("application/json");
    // if the data isnt there, the draggable probably shouldn't have been draggable
    if (!jsonData) throw "no json data... source probably isnt draggable";
    const { indexs, sourcePileContainerId } = JSON.parse(jsonData) as DragData;
    // something went wrong with the data
    if (indexs.length === 0 || !sourcePileContainerId) {
      throw "no card index during drop";
    }
    // figure out which piles the cards came from / are going to
    const sourcePile = findPileElement(sourcePileContainerId);
    const thisPile = findPileElement(container.id);

    // dont animate when cards set back down
    if (sourcePile.container.id === container.id) {
      return "cant drop in own container";
    }

    // grabs all the card elements from the index data
    const cardElements = indexs.map((index) => {
      return sourcePile.cardElements[parseInt(index)];
    });

    // removes all the card-dragging classes
    cardElements.forEach((element) => {
      element.container.classList.remove("card-dragging");
    });

    // try passing the first card
    const attemptPrimaryMove = sourcePile.moveCardToPile(
      thisPile,
      sourcePile.cardElements[parseInt(indexs[0])],
      rules(),
    );

    // if the first card is successful, pass the rest
    if (attemptPrimaryMove === true) {
      cardElements.splice(0, 1);
      cardElements.forEach((element) => {
        sourcePile.moveCardToPile(thisPile, element, true);
      });
    }
  };

  const container = document.createElement("div");
  container.classList.add("deck-base");
  container.id = Math.random().toString(36).slice(2, 11);
  if (draggable) {
    container.ondragstart = drag;
    container.ondragend = dragend;
    container.ondrop = drop;
    container.ondragover = allowDrop;
  }

  //! Seems to not work on cards that have been passed
  const cascade = (duration = cascadeDuration) => {
    reset();
    const arrayFinished = []; // Array of .finished promises returned by animate
    for (let i = 0; i < cardElements.length; i++) {
      const vector2 = [];
      const cardElement = cardElements[i].container;
      vector2[0] = cascadePercent[0] * cardElement.offsetWidth * i;
      vector2[1] = cascadePercent[1] * cardElement.offsetHeight * i;
      const slide = slideCard(cardElements[i], vector2, duration);
      arrayFinished.push(slide);
    }
    return Promise.all(arrayFinished);
  };

  // sets a new value to the percent of cascade, and a one time use duration
  // then performs the cascade and resets duration to 0
  const cascadeValueSetter = (percent: number[], duration: number) => {
    cascadePercent[0] = percent[0];
    cascadePercent[1] = percent[1];
    cascadeDuration = duration;
    cascade();
    cascadeDuration = 0;
  };

  /**
   * Card Elements have animations, and must remain part of the original Pile until the animation is complete. The card objects are moved instantly, this function checks for top card object, and returns matching cardElement.
   * @returns The cardElement that is on the top of the pile
   */
  const getTopCardElement = (): CardElement<T> => {
    const topCard = cards[cards.length - 1];
    return cardElements.filter((element) => element.card === topCard)[0];
  };

  // slimmed down move card to deck
  const moveCardToPile = (
    destinationPile: PileElement<T>,
    cardElement = getTopCardElement(),
    gameRules = true, // ability to pass in rules for passing the card from one deckbase to another
    animationCallback = animateMoveCardToNewDeck, // probably un-needed arg... but allows us to change the animation, or use null to not animate the move
  ) => {
    if (cardElements.indexOf(cardElement) === -1) return false;

    // will return either the card that got passed, or false if the rules aren't "true"
    const cardPassed = pile.passCard(
      destinationPile.pile,
      cardElement.card,
      gameRules,
    );

    // if the attempt to pass the card is a fail, return immediately
    if (cardPassed === false) {
      return false;
    }

    // if the animation callback is set to null, don't animate anything and return
    //! untested
    if (animationCallback === null) {
      destinationPile.cardElements.push(
        cardElements.splice(cardElements.indexOf(cardElement), 1)[0],
      );
      cascade();
      destinationPile.cascade();
      return true;
    }

    // the card got passed, and this is the animation we want to show.
    animationCallback(destinationPile, cardElement);
    return true;
  };

  // Only to do with animations.
  // I had to now reference where things used to be in objects, because the card
  // has been moved in the Objects, but not visually on the screen
  async function animateMoveCardToNewDeck(
    destination: PileElement<T>,
    cardElement: CardElement<T>,
  ) {
    cardElement.container.style.zIndex = String(
      destination.cards.length + 1000,
    );
    const sourceBox = container.getBoundingClientRect();
    const destinationBox = destination.container.getBoundingClientRect();

    const destinationCascade = [
      destination.cascadePercent[0] *
        cardElement.container.offsetWidth *
        (destination.cards.length - 1),
      destination.cascadePercent[1] *
        cardElement.container.offsetHeight *
        (destination.cards.length - 1),
    ];

    const vector2 = [];
    vector2[0] = destinationBox.x - sourceBox.x + destinationCascade[0];
    vector2[1] = destinationBox.y - sourceBox.y + destinationCascade[1];

    await slideCard(cardElement, vector2, 600);

    cardElement.container.draggable = destination.options.draggable;
    destination.container.appendChild(cardElement.container);

    // eslint-disable-next-line prefer-const
    let { translate, scale, rotate } = cardElement.transform;
    translate = `translate(${destinationCascade[0]}px, ${destinationCascade[1]}px)`;
    cardElement.transform.translate = translate;
    cardElement.container.style.transform = `${translate} ${scale} ${rotate}`;

    // add the new card element to destination
    const index = cardElements.findIndex((element) => {
      return JSON.stringify(element) === JSON.stringify(cardElement);
    });
    if (index === -1)
      return Promise.reject("couldnt find cardElement in source cardElements");
    if (index !== cardElements.length - 1) {
      //      for (let i = index; i < cardElements.length-1; i++)
      cardElements.splice(cardElements.indexOf(cardElement), 1);
      //! I dont know why cascade was below... but it was now breaking shit?
      //cascade();
    } else {
      cardElements.splice(cardElements.indexOf(cardElement), 1);
    }
    destination.cardElements.push(cardElement);
    adjustZIndex(destination.cardElements);

    // adjust the ZIndex of this piles cardElements
    adjustZIndex(cardElements);

    return Promise.resolve(true);

    //! I dont think this ever worked?
    /*
    function resizeContainer(deckBase) {
      const cardHeight = parseFloat(deckBase.deck.cards[0].card.offsetHeight);
      const cardWidth = parseFloat(deckBase.deck.cards[0].card.offsetWidth);
      const deckLength = deckBase.deck.cards.length;
      const newHeight =
        cardHeight * deckLength * Math.abs(deckBase.cascadePercent[1]) +
        cardHeight * (1 - Math.abs(deckBase.cascadePercent[1]));
      const newWidth =
        cardWidth * deckLength * Math.abs(deckBase.cascadePercent[0]) +
        cardWidth * (1 - Math.abs(deckBase.cascadePercent[0]));
      deckBase.container.style.height = `${newHeight}px`;
      deckBase.container.style.width = `${newWidth}px`;

      const deltaX = newWidth - cardWidth;
      const deltaY = newHeight - cardWidth;

      const container = deckBase.container;

      if (deckBase.cascadePercent[0] < 0) {
        // If x is a negative percent
      } else {
        // If x is a positive percent
      }
      if (deckBase.cascadePercent[1] < 0) {
        // If y is a negative percent
      } else {
        // If y is a positive percent
      }
    }
      */
    ///////////////////////////////////////////////////
  }
  // resets the container of the DeckBase
  const reset = () => {
    while (container.firstElementChild) {
      container.removeChild(container.firstElementChild);
    }

    for (let i = 0; i < cardElements.length; i++) {
      const card = cardElements[i];
      cardElements[i].container.style.zIndex = String(i);
      cardElements[i].container.draggable = draggable;
      container.appendChild(card.container);
    }
  };

  const adjustZIndex = (cardElements: CardElement<T>[]) => {
    for (let index = 0; index < cardElements.length; index++) {
      const card = cardElements[index];
      card.container.style.zIndex = String(index);
    }
  };

  const findCardContainer = (element: HTMLElement) => {
    if (element.classList.contains("card-container"))
      return cardElements[parseInt(element.style.zIndex)];
    if (element.classList.contains("deck-base")) return null;
    else if (element.parentElement)
      return findCardContainer(element.parentElement);
    else throw "something went wrong in find card container";
  };

  const findPileElement = (id: string) => {
    return deck.pileElements.filter((item) => item.container.id === id)[0];
  };

  return {
    type,
    get pile() {
      return pile;
    },
    get cards() {
      return pile.cards;
    },
    get options() {
      return options;
    },
    cardElements,
    container,
    cascadePercent,
    cascadeDuration,
    getTopCardElement,
    moveCardToPile,
    cascade,
    cascadeValueSetter,
    reset,
    animateMoveCardToNewDeck,
    findCardContainer,
    get topCard() {
      return cardElements[cardElements.length - 1];
    },
  };
};
