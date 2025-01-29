import Pile from "./pile";
import Card from "../card/card";
import { CardElement } from "../card/cardElement";

type PileElement<T extends Card> = {
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
    degrees: string,
    duration: number
  ) => Promise<Animation>;
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
const pileElement = <T extends Card>(
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
  let translate: string = "";
  let scale = `scale(1)`;
  let rotate = `rotate(0deg)`;
  let transform = `${translate} ${scale} ${rotate}`;
  const slideCard = async (
    cardElement: CardElement<T>,
    vector2: number[],
    duration: number
  ) => {
    if (vector2.length !== 2) {
      console.error("Error: vector2 must be an array of 2 values, x and y.");
    }

    translate = `translate(${vector2[0]}px, ${vector2[1]}px)`;
    transform = `${translate} ${scale} ${rotate}`;

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
  };

  const spinCard = async (
    cardElement: CardElement<T>,
    degrees: string,
    duration: number
  ) => {
    rotate = `rotate(${degrees}deg)`;
    transform = `${translate} ${scale} ${rotate}`;

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
    await anim.finished.then(() => {
      cardElement.wrapper.style.transform = transform;
    });

    return anim;
  };

  const zoomCard = async (
    cardElement: CardElement<T>,
    factor: number,
    duration: number
  ) => {
    scale = `scale(${factor})`;
    transform = `${translate} ${scale} ${rotate}`;

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

  const slideDeck = async (vector2: number[], duration: number) => {
    if (vector2.length !== 2) {
      console.error("Error: vector2 must be an array of 2 values, x and y.");
    }

    translate = `translate(${vector2[0]}px, ${vector2[1]}px)`;
    transform = `${translate} ${scale} ${rotate}`;

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
  //
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
    //! I dont like card.state
    /*
    if (card.state !== "available") {
      return false;
    }
      */
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

    //! I dont like card.state
    // card.state = "busy";

    // if the animation callback is set to null, don't animate anything and return
    if (animationCallback === null) {
      cardElements.splice(cardElements.indexOf(cardElement), 1);
      cascade();
      destinationPile.cascade();
      //! I dont like card.state
      //card.state = "available";
      return true;
    }

    // the card got passed, and this is the animation we want to show.

    animationCallback(destinationPile, cardElement).then(() => {
      //! I dont like card.state
      // card.state = "available";
      cardElements.splice(cardElements.indexOf(cardElement), 1);
      return true;
    });

    // card.state isn't true until animationCallback is done

    return true;
  };

  // Only to do with animations.
  // I had to now reference where things used to be in objects, because the card
  // has been moved in the Objects, but not visually on the screen
  async function animateMoveCardToNewDeck(
    destination: PileElement<T>,
    cardThatWasPassed: CardElement<T>
  ) {
    let topCard = cardThatWasPassed;
    topCard.stopPropagation();
    topCard.wrapper.style.zIndex = String(destination.cards.length + 1000);
    const sourceBox = container.getBoundingClientRect();
    const destinationBox = destination.container.getBoundingClientRect();
    const destinationOffset = calculateOffset(
      topCard,
      destination,
      cardElements.length - 1
    );

    const vector2 = [];
    vector2[0] = destinationBox.x + destinationOffset[0] - sourceBox.x;
    vector2[1] = destinationBox.y + destinationOffset[1] - sourceBox.y;

    await slideCard(topCard, vector2, 600);
    destination.container.appendChild(topCard.wrapper);
    await slideCard(topCard, destinationOffset, 0);
    //spinCard(topCard, "0", 0);

    topCard.wrapper.style.zIndex = String(destination.cardElements.length);

    for (let index = 0; index < destination.cardElements.length; index++) {
      const card = destination.cardElements[index];
      card.wrapper.style.zIndex = String(index);
    }
    destination.cardElements.push(cardThatWasPassed);
    topCard.startPropagation();

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

export default pileElement;
