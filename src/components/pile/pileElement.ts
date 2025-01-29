import Pile from "./pile";
import Card from "../card/card";
import { CardElement } from "../card/cardElement";

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
    duration: number
  ) => void;
  getTopCardElement: () => CardElement<T>;
  spinCard: (
    cardElement: CardElement<T>,
    duration: number
  ) => Promise<Animation> | Promise<unknown>;
  zoomCard: (
    cardElement: CardElement<T>,
    factor: number,
    duration: number
  ) => Promise<Animation>;
  slideDeck: (vector2: number[], duration: number) => void;
  moveCardToPile: (
    destinationPile: PileElement<T>,
    cardElement?: CardElement<T>,
    gameRules?: () => boolean,
    animationCallback?: (
      destination: PileElement<T>,
      cardThatWasPassed: CardElement<T>
    ) => Promise<boolean>
  ) => Boolean;
  cascadeValueSetter: (percent: number[], duration: number) => void;
  reset: () => void;
  animateMoveCardToNewDeck: (
    destination: PileElement<T>,
    cardThatWasPassed: CardElement<T>
  ) => Promise<boolean>;
  topCard: CardElement<T>;
};

// Adds a base the size of the card to be the basis of deck layouts.\
export const pileElement = <T extends Card>(
  pile = new Pile<T>(),
  cardElements = [CardElement<T>()],
  type: "stack" | "cascade" = "stack"
): PileElement<T> => {
  let cascadePercent = [0, 0.001];
  let cascadeDuration = 0;
  if (type === "stack") {
    cascadePercent = [0, -0.003];
    cascadeDuration = 0;
  } else if (type === "cascade") {
    cascadePercent = [0, 0.18];
    cascadeDuration = 0;
  }
  const { cards } = pile;

  const container = document.createElement("div");
  container.classList.add("deck-base");

  // Animation Properties //! Find a better way to do all of this... I'm just trying to make it work...

  const slideCard = async (
    cardElement: CardElement<T>,
    vector2: number[],
    duration: number
  ) => {
    if (cardElement.transform.active) return;
    if (vector2.length !== 2) {
      console.error("Error: vector2 must be an array of 2 values, x and y.");
    }
    let { translate, scale, rotate } = cardElement.transform;
    translate = `translate(${vector2[0]}px, ${vector2[1]}px)`;
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

    const anim = cardElement.wrapper.animate(keys, options);
    cardElement.wrapper.dispatchEvent(new Event("animationstart"));
    await anim.finished.then(() => {
      cardElement.wrapper.style.transform = transform;
      cardElement.wrapper.dispatchEvent(new Event("animationend"));
    });
  };

  const spinCard = async (cardElement: CardElement<T>, duration: number) => {
    if (cardElement.transform.active) return new Promise(() => undefined);

    cardElement.transform.rotate === `rotate(0deg)`
      ? (cardElement.transform.rotate = "rotate(90deg)")
      : (cardElement.transform.rotate = "rotate(0deg)");

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

    const anim = cardElement.wrapper.animate(keys, options);
    cardElement.wrapper.dispatchEvent(new Event("animationstart"));
    await anim.finished.then(() => {
      cardElement.wrapper.style.transform = transform;
      cardElement.wrapper.dispatchEvent(new Event("animationend"));
    });

    return anim;
  };

  //! I haven't tested this
  const zoomCard = async (
    cardElement: CardElement<T>,
    factor: number,
    duration: number
  ) => {
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

    const anim = cardElement.wrapper.animate(keys, options);
    await anim.finished.then(() => {
      cardElement.wrapper.style.transform = transform;
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

  //! I havent tested this
  const cascade = () => {
    reset();
    const promise = new Promise((resolve) => {
      const arrayFinished = []; // Array of .finished promises returned by animate
      for (let i = 0; i < cardElements.length; i++) {
        const vector2 = [];
        const cardElement = cardElements[i].wrapper;
        vector2[0] = cascadePercent[0] * cardElement.offsetWidth * i;
        vector2[1] = cascadePercent[1] * cardElement.offsetHeight * i;
        const slide = slideCard(cardElements[i], vector2, cascadeDuration);
        arrayFinished.push(slide);
      }
      resolve(Promise.all(arrayFinished).then(() => {}));
    });
    return promise;
  };

  // sets a new value to the percent of cascade, and a one time use duration
  // then performs the cascade and resets duration to 0
  const cascadeValueSetter = (percent: number[], duration: number) => {
    cascadePercent = percent;
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
    let topCardElement = CardElement<T>();
    cardElements.forEach((element) => {
      if (element.card === topCard) topCardElement = element;
    });
    return topCardElement;
  };

  // slimmed down move card to deck
  const moveCardToPile = (
    destinationPile: PileElement<T>,
    cardElement = getTopCardElement(),
    gameRules = () => true, // ability to pass in rules for passing the card from one deckbase to another
    animationCallback = animateMoveCardToNewDeck // probably un-needed arg... but allows us to change the animation, or use null to not animate the move
  ) => {
    if (cardElements.indexOf(cardElement) === -1) return false;

    // will return either the card that got passed, or false if the rules aren't "true"
    const cardPassed = pile.passCard(
      destinationPile.pile,
      cardElement.card,
      gameRules
    );

    // if the attempt to pass the card is a fail, return immediately
    if (cardPassed === false) {
      return false;
    }

    // if the animation callback is set to null, don't animate anything and return
    //! untested
    if (animationCallback === null) {
      destinationPile.cardElements.push(
        cardElements.splice(cardElements.indexOf(cardElement), 1)[0]
      );
      cascade();
      destinationPile.cascade();
      return true;
    }

    // the card got passed, and this is the animation we want to show.
    cardElements.splice(cardElements.indexOf(cardElement), 1);
    animationCallback(destinationPile, cardElement);
    return true;
  };

  // Only to do with animations.
  // I had to now reference where things used to be in objects, because the card
  // has been moved in the Objects, but not visually on the screen
  async function animateMoveCardToNewDeck(
    destination: PileElement<T>,
    cardElement: CardElement<T>
  ) {
    cardElement.wrapper.style.zIndex = String(destination.cards.length + 1000);
    const sourceBox = container.getBoundingClientRect();
    const destinationBox = destination.container.getBoundingClientRect();
    const destinationOffset = calculateOffset(
      cardElement,
      destination,
      cardElements.length - 1
    );

    const vector2 = [];
    vector2[0] = destinationBox.x + destinationOffset[0] - sourceBox.x;
    vector2[1] = destinationBox.y + destinationOffset[1] - sourceBox.y;

    await slideCard(cardElement, vector2, 6000);
    destination.container.appendChild(cardElement.wrapper);
    await slideCard(cardElement, destinationOffset, 0);
    //spinCard(cardElement, "0", 0);

    cardElement.wrapper.style.zIndex = String(destination.cardElements.length);

    for (let index = 0; index < destination.cardElements.length; index++) {
      const card = destination.cardElements[index];
      card.wrapper.style.zIndex = String(index);
    }
    destination.cardElements.push(cardElement);

    return Promise.resolve(true);

    function calculateOffset(
      cardElement: CardElement<T>,
      pileElement: PileElement<T>,
      index: number
    ) {
      index < 0 ? (index = 1) : (index = index);
      const vector = [];
      vector[0] =
        pileElement.cascadePercent[0] * cardElement.wrapper.offsetWidth * index;
      vector[1] =
        pileElement.cascadePercent[1] *
        cardElement.wrapper.offsetHeight *
        index;
      return vector;
    }
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
      container.appendChild(card.wrapper);
    }
  };

  return {
    type,
    pile,
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
    get topCard() {
      return cardElements[cardElements.length - 1];
    },
  };
};
