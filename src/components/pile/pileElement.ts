import Pile from "./pile";
import { CardElementType } from "../../types/card.types";
import { DragData } from "../../types/pile.types";
import { pileOptionsType } from "../../types/pile.types";
import Card from "../card/card";
import "../../styles/pile.css";
import type { Layout, Offset, PileElementType } from "../../types/pile.types";
import Deck from "../deck/deck";
import { denyMove, slideCard } from "../animate/animate";
import { Rules } from "../rules/rules";

// These are recipes for cascade()
const layouts: Layout = {
  stack: {
    offset: [-0.003, -0.003],
  },
  cascade: {
    offset: [0.4, 0],
  },
  visibleStack: {
    offset: [0, 0.25],
  },
};

export const createDefaultOptions = <T extends Card>(): pileOptionsType<T> => ({
  cardElements: [],
  layout: "stack",
  rules: new Rules(),
  draggable: true,
  groupDrag: true,
  receiveCardCallback: () => true,
  passCardCallback: () => true,
});

// Adds a base the size of the card to be the basis of deck layouts.\
export const pileElement = <T extends Card>(
  pile: Pile<T>,
  deck: Deck<T>,
  partialOptions: Partial<pileOptionsType<T>> = {},
): PileElementType<T> => {
  const options: pileOptionsType<T> = {
    ...createDefaultOptions(),
    ...partialOptions,
  };

  const cascadeOffset = [0, 0] as [number, number];
  const cascadeDuration = 0;
  applyCascadeLayout(options.layout);
  const container = document.createElement("div");
  container.classList.add("deck-base");
  container.id = Math.random().toString(36).slice(2, 11);

  const { cardElements } = options;

  const updateShadows = () => {
    if (cardElements.length <= 0) return;
    for (let i = 0; i < cardElements.length; i++) {
      const front = cardElements[i].front;
      const back = cardElements[i].back;
      if (
        Math.abs(cascadeOffset[0]) > 0.04 ||
        Math.abs(cascadeOffset[1]) > 0.04 ||
        i === cardElements.length - 1
      ) {
        if (front) {
          front.classList.add("card-shadow");
        }
        back.classList.add("card-shadow");
      } else {
        if (front) {
          front.classList.remove("card-shadow");
        }
        back.classList.remove("card-shadow");
      }
    }
    if (cardElements[0].front) {
      cardElements[0].front.classList.add("card-shadow");
    }
    cardElements[0].back.classList.add("card-shadow");
  };

  const cascade = (duration = cascadeDuration) => {
    reset();
    const arrayFinished = [];
    for (let i = 0; i < cardElements.length; i++) {
      const vector2 = [];
      const cardElement = cardElements[i].container;
      vector2[0] = cascadeOffset[0] * cardElement.offsetWidth * i;
      vector2[1] = cascadeOffset[1] * cardElement.offsetHeight * i;

      const slide = slideCard(cardElements[i], vector2, duration);
      arrayFinished.push(slide);
    }
    return Promise.all(arrayFinished);
  };

  function applyCascadeLayout(layoutName: string) {
    const newOffset = layouts[layoutName].offset.slice();
    if (Object.keys(layouts).includes(layoutName)) {
      cascadeOffset[0] = newOffset[0];
      cascadeOffset[1] = newOffset[1];
    } else {
      throw new Error(`No cascade layout with that name found: ${layouts}`);
    }
  }

  function createCascadeLayout(layoutName: string, offset: Offset) {
    if (Object.keys(layouts).includes(layoutName)) {
      throw new Error("A layout with that name already exists");
    } else {
      Object.defineProperty(layouts, layoutName, {
        value: { offset },
        enumerable: true, // So it shows up in Object.keys() for your existence check
      });
    }
  }

  /**
   *
   * @param destinationPile PileElement that the card is moving to
   * @param cardElement The card being moved. Defaults to the top card of source pile
   * @param gameRules ability to pass specific rules for this card moving. Defaults to the piles rules which defaults: () => true
   * @param animationCallback Allows you to change the default animation, null for no animation
   * @returns
   */
  function moveCardToPile(
    this: PileElementType<T>,
    destinationPile: PileElementType<T>,
    cardElement = cardElements[cardElements.length - 1],
    gameRules = options.rules, // ability to pass in rules for passing the card from one deckbase to another
    groupOffset: number = 0,
    animationCallback = animateMoveCardToNewPile, // probably un-needed arg... but allows us to change the animation, or use null to not animate the move
  ) {
    if (cardElements.indexOf(cardElement) === -1) return false;

    // will return either the card that got passed, or false if the rules aren't "true"

    if (gameRules.canPass(this, destinationPile, cardElement) === false) {
      return false;
    }
    if (
      destinationPile.options.rules.canReceive(
        this,
        destinationPile,
        cardElement,
      ) === false
    ) {
      return false;
    }
    const cardPassed = pile.passCard(destinationPile.pile, cardElement.card);

    // if the attempt to pass the card is a fail, return immediately
    if (cardPassed === false) {
      return false;
    }

    // hit the callbacks for both passing and recieving cards
    options.passCardCallback();
    destinationPile.options.receiveCardCallback();

    // if the animation callback is set to null, don't animate anything and return
    //! untested
    if (animationCallback === null) {
      destinationPile.cardElements.push(
        cardElements.splice(cardElements.indexOf(cardElement), 1)[0],
      );
      cascade();
      destinationPile.cascade();
      return false;
    }

    // the card got passed, and this is the animation we want to show.
    this.updateShadows();
    destinationPile.updateShadows();
    return animationCallback(destinationPile, cardElement, groupOffset);
  }

  // Only to do with animations.
  // I had to now reference where things used to be in objects, because the card
  // has been moved in the Objects, but not visually on the screen
  async function animateMoveCardToNewPile(
    destination: PileElementType<T>,
    cardElement: CardElementType<T>,
    groupOffset: number = 0,
  ) {
    cardElement.container.style.zIndex = String(
      destination.cards.length + 1000,
    );

    destination.container.appendChild(cardElement.container);
    destination.cardElements.push(cardElement);

    const sourceBox = container.getBoundingClientRect();
    const destinationBox = destination.container.getBoundingClientRect();
    // add the new card element to destination
    const index = cardElements.findIndex((element) => {
      return JSON.stringify(element) === JSON.stringify(cardElement);
    });
    // Should never be -1, but if the index wasn't found abort
    if (index === -1) return Promise.reject(false);
    // If the card wasn't the top card, cascade the hand back together.
    // If group Drag is on, it will cause unneccesary shifting, as the whole pile it leaving anyways
    if (index !== cardElements.length - 1 && options.groupDrag === false) {
      cardElements.splice(cardElements.indexOf(cardElement), 1);
      cascade(300);
    } else {
      cardElements.splice(cardElements.indexOf(cardElement), 1);
    }
    // The calculation for how far the card needs to be determined by the cascade vectors of the destination pile and the number of cards.
    const destinationCascade = [
      destination.cascadeOffset[0] *
        cardElement.container.offsetWidth *
        (destination.cards.length - 1),
      destination.cascadeOffset[1] *
        cardElement.container.offsetHeight *
        (destination.cards.length - 1),
    ];
    // When the card is appeneded to the new pile, and keeps the old transform, it will move that far away again.
    const sourceCascade = [
      cascadeOffset[0] *
        cardElement.container.offsetWidth *
        (index + groupOffset),
      cascadeOffset[1] *
        cardElement.container.offsetHeight *
        (index + groupOffset),
    ];

    const { scale, rotate } = cardElement.transform;
    const translate = `translate(${sourceBox.x - destinationBox.x + sourceCascade[0]}px, ${sourceBox.y - destinationBox.y + sourceCascade[1]}px)`;
    cardElement.transform.translate = translate;
    cardElement.container.style.transform = `${translate} ${scale} ${rotate}`;

    const vector2: [number, number] = [
      destinationCascade[0],
      destinationCascade[1],
    ];
    cardElement.container.draggable = false;

    const returnPromise = await slideCard(cardElement, vector2, 600).then(
      (animation) => {
        cardElement.container.draggable = destination.options.draggable;
        adjustZIndex(destination.cardElements);
        // adjust the ZIndex of this piles cardElements
        adjustZIndex(cardElements);
        return animation;
      },
    );
    // wait for the card to move, adjust the draggable setting to that of the new pile
    cardElement.container.draggable = destination.options.draggable;

    // We must adjust the transform on the card to be that of the destinations cascade now.
    cardElement.transform.translate = `translate(${destinationCascade[0]}px, ${destinationCascade[1]}px)`;
    cardElement.container.style.transform = `${`translate(${destinationCascade[0]}px, ${destinationCascade[1]}px)`} ${scale} ${rotate}`;
    return returnPromise;
  }

  // resets the container of the DeckBase
  const reset = () => {
    while (container.firstElementChild) {
      container.removeChild(container.firstElementChild);
    }

    for (let i = 0; i < cardElements.length; i++) {
      const card = cardElements[i];
      cardElements[i].container.style.zIndex = String(i);
      cardElements[i].container.draggable = options.draggable;
      container.appendChild(card.container);
    }
  };

  const adjustZIndex = (cardElements: CardElementType<T>[]) => {
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

  // Define the function before it's used
  const allowDrop = (e: DragEvent) => {
    e.preventDefault();
  };

  function drag(e: DragEvent) {
    if (cardElements[cardElements.length - 1].transform.active === true) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (!(e.target instanceof HTMLElement)) return;

    // Find the main card container.
    const cardElement = findCardContainer(e.target);
    if (cardElement === null) return;
    if (
      options.rules.canPass(
        findPileElement(container.id),
        undefined,
        cardElement,
      ) === false
    ) {
      denyMove(cardElement);
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    // Prepare your drag data.
    const data = {
      indexs: [cardElement.container.style.zIndex],
      sourcePileContainerId: container.id,
    };

    if (options.groupDrag) {
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
      dragImage.style.zIndex = "1";
      document.body.appendChild(dragImage);

      e.dataTransfer?.setDragImage(dragImage, 0, 0);
    }
    e.dataTransfer?.setData("application/json", JSON.stringify(data));
  }

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
    const destinationPile = findPileElement(container.id);

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
      destinationPile,
      sourcePile.cardElements[parseInt(indexs[0])],
    );
    if (attemptPrimaryMove === false) {
      cardElements.forEach((element) => {
        denyMove(element);
      });
    }

    // if the first card is successful, pass the rest
    else {
      cardElements.splice(0, 1);
      cardElements.forEach((element, index) => {
        sourcePile.moveCardToPile(
          destinationPile,
          element,
          sourcePile.options.rules,
          index + 1,
        );
      });
    }
  };

  container.id = Math.random().toString(36).slice(2, 11);
  if (options.draggable) {
    container.ondragstart = drag;
    container.ondragend = dragend;
    container.ondrop = drop;
    container.ondragover = allowDrop;
  }

  const shuffle = () => {
    pile.shuffle();
    // Sort cardElements[] to match the shuffled order of cards[]
    cardElements.sort(
      (a, b) => pile.cards.indexOf(a.card) - pile.cards.indexOf(b.card),
    );
    cascade();
  };

  return {
    get pile() {
      return pile;
    },
    get cards() {
      return pile.cards;
    },
    get cascadeOffset() {
      return cascadeOffset;
    },
    get topCardElement() {
      return cardElements[cardElements.length - 1];
    },
    cardElements,
    container,
    cascadeDuration,
    options,
    moveCardToPile,
    updateShadows,
    cascade,
    applyCascadeLayout,
    createCascadeLayout,
    reset,
    findCardContainer,
    shuffle,
  };
};
