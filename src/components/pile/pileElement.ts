import Pile from "./pile";
import Card from "../card/card";
import { CardElement } from "../card/cardElement";
import "../../styles/pile.css";
import Deck from "../deck/deck";

export type pileOptions<T extends Card> = {
  cardElements: CardElement<T>[];
  type: "stack" | "cascade";
  draggable: boolean;
  rules: () => boolean;
};

export const createDefaultOptions = <T extends Card>(): pileOptions<T> => ({
  cardElements: [],
  type: "stack",
  draggable: true,
  rules: () => true,
});

export type PileElement<T extends Card> = {
  type: "stack" | "cascade";
  pile: Pile<T>;
  cards: T[];
  cardElements: CardElement<T>[];
  container: HTMLDivElement;
  cascadePercent: number[];
  cascadeDuration: number;
  cascade: () => Promise<unknown>;
  slideCard: (
    cardElement: CardElement<T>,
    vector2: number[],
    duration: number,
  ) => void;
  getTopCardElement: () => CardElement<T>;
  spinCard: (
    cardElement: CardElement<T>,
    duration: number,
  ) => Promise<Animation> | Promise<unknown>;
  zoomCard: (
    cardElement: CardElement<T>,
    factor: number,
    duration: number,
  ) => Promise<Animation>;
  slideDeck: (vector2: number[], duration: number) => void;
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
  options: Partial<pileOptions<T>> = {},
): PileElement<T> => {
  const mergedOptions: pileOptions<T> = {
    ...createDefaultOptions(),
    ...options,
  };
  const { type, cardElements, draggable, rules } = mergedOptions;

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
    const cardElement = findCardContainer(e.target);
    if (cardElement === null) return;
    cardElement.container.classList.add("card-dragging");
    const data = {
      index: cardElement.container.style.zIndex,
      sourcePileContainerId: container.id,
    };
    e.dataTransfer?.setData("application/json", JSON.stringify(data));
  };
  const dragend = (e: DragEvent) => {
    if (!(e.target instanceof HTMLElement)) return;
    const cardElement = findCardContainer(e.target);
    if (cardElement === null || cardElement === undefined) return;
    cardElement.container.classList.remove("card-dragging");
  };
  const drop = (e: DragEvent) => {
    e.preventDefault();
    if (!(e.target instanceof HTMLElement)) return;
    const jsonData = e.dataTransfer?.getData("application/json");
    if (!jsonData) throw "no json data... source probably isnt draggable";
    const { index, sourcePileContainerId } = JSON.parse(jsonData);
    if (!index || !sourcePileContainerId) {
      throw "no card index during drop";
    }
    const sourcePile = findPileElement(sourcePileContainerId);
    const thisPile = findPileElement(container.id);
    if (sourcePile.container.id === container.id) {
      return "cant drop in own container";
    }
    sourcePile.cardElements[parseInt(index)].container.classList.remove(
      "card-dragging",
    );
    sourcePile.moveCardToPile(
      thisPile,
      sourcePile.cardElements[parseInt(index)],
      rules(),
    );
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
  const slideCard = async (
    cardElement: CardElement<T>,
    vector2: number[],
    duration: number,
  ) => {
    if (cardElement.transform.active) return;
    if (vector2.length !== 2) {
      console.error("Error: vector2 must be an array of 2 values, x and y.");
    }
    //! This should be a func
    // eslint-disable-next-line prefer-const
    let { translate, scale, rotate } = cardElement.transform;
    translate = `translate(${vector2[0]}px, ${vector2[1]}px)`;
    cardElement.transform.translate = translate;
    //! This should be a func

    const transform = `${translate} ${scale} ${rotate}`;

    const keys = {
      transform: transform,
    };

    const options = {
      duration: duration,
      easing: "ease-out",
      delay: 0,
      direction: "normal" as PlaybackDirection,
    };

    const anim = cardElement.container.animate(keys, options);
    cardElement.container.dispatchEvent(new Event("animationstart"));
    await anim.finished.then(() => {
      cardElement.container.style.transform = transform;
      cardElement.container.dispatchEvent(new Event("animationend"));
    });
  };

  const spinCard = async (cardElement: CardElement<T>, duration: number) => {
    if (cardElement === undefined) return new Promise(() => undefined);
    if (cardElement.transform.active) return new Promise(() => undefined);

    cardElement.transform.rotate =
      cardElement.transform.rotate === `rotate(0deg)`
        ? "rotate(90deg)"
        : "rotate(0deg)";

    const { translate, scale, rotate } = cardElement.transform;
    const transform = `${translate} ${scale} ${rotate}`;

    const keys = {
      transform: transform,
    };

    const options = {
      duration: duration,
      easing: "linear",
      delay: 0,
      direction: "normal" as PlaybackDirection,
    };

    const anim = cardElement.container.animate(keys, options);
    cardElement.container.dispatchEvent(new Event("animationstart"));
    await anim.finished.then(() => {
      cardElement.container.style.transform = transform;
      cardElement.container.dispatchEvent(new Event("animationend"));
    });

    return anim;
  };

  //! I haven't tested this
  const zoomCard = async (
    cardElement: CardElement<T>,
    factor: number,
    duration: number,
  ) => {
    // eslint-disable-next-line prefer-const
    let { translate, scale, rotate } = cardElement.transform;

    scale = `scale(${factor})`;
    const transform = `${translate} ${scale} ${rotate}`;

    const keys = {
      transform: transform,
    };

    const options = {
      duration: duration,
      easing: "ease-out",
      delay: 0,
      direction: "normal" as PlaybackDirection,
    };

    const anim = cardElement.container.animate(keys, options);
    await anim.finished.then(() => {
      cardElement.container.style.transform = transform;
    });

    return anim;
  };

  //! I havent tested this
  const slideDeck = async (vector2: number[], duration: number) => {
    if (vector2.length !== 2) {
      console.error("Error: vector2 must be an array of 2 values, x and y.");
    }

    const translate = `translate(${vector2[0]}px, ${vector2[1]}px)`;
    const transform = `${translate} scale(1) rotate(0deg)`;

    const keys = {
      transform: transform,
    };

    const options = {
      duration: duration,
      easing: "ease-out",
      delay: 0,
      direction: "normal" as PlaybackDirection,
    };

    const anim = container.animate(keys, options);
    await anim.finished.then(() => {
      container.style.transform = transform;
    });
  };

  //! Seems to not work on cards that have been passed
  const cascade = (duration = cascadeDuration) => {
    reset();
    const promise = new Promise((resolve) => {
      const arrayFinished = []; // Array of .finished promises returned by animate
      for (let i = 0; i < cardElements.length; i++) {
        const vector2 = [];
        const cardElement = cardElements[i].container;
        vector2[0] = cascadePercent[0] * cardElement.offsetWidth * i;
        vector2[1] = cascadePercent[1] * cardElement.offsetHeight * i;
        const slide = slideCard(cardElements[i], vector2, duration);
        arrayFinished.push(slide);
      }
      resolve(Promise.all(arrayFinished).then(() => {}));
    });
    return promise;
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
    destination.container.appendChild(cardElement.container);

    // eslint-disable-next-line prefer-const
    let { translate, scale, rotate } = cardElement.transform;
    translate = `translate(${destinationCascade[0]}px, ${destinationCascade[1]}px)`;
    cardElement.transform.translate = translate;
    cardElement.container.style.transform = `${translate} ${scale} ${rotate}`;

    cardElement.container.style.zIndex = String(
      destination.cardElements.length,
    );

    // add the new card element to destination
    const index = cardElements.findIndex((element) => {
      return JSON.stringify(element) === JSON.stringify(cardElement);
    });
    if (index === -1) return Promise.reject(false);
    if (index !== cardElements.length - 1) {
      //      for (let i = index; i < cardElements.length-1; i++)
      cardElements.splice(cardElements.indexOf(cardElement), 1);
      cascade(400);
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
    cardElements,
    container,
    cascadePercent,
    cascadeDuration,
    getTopCardElement,
    slideCard,
    spinCard,
    zoomCard,
    slideDeck,
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
