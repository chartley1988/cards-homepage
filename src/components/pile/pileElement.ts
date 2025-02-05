import Pile from "./pile";
import { CardElementType } from "../../types/card.types";

import Card from "../card/card";
import "../../styles/pile.css";
import type { Layout, PileElement } from "../../types/pile.types";

// These are recipes for cascade()
const layout: Layout = {
  stack: {
    offset: [-0.003, -0.003],
  },
  cascade: {
    offset: [0.18, 0],
  },
};

// Adds a base the size of the card to be the basis of deck layouts.\
export const pileElement = <T extends Card>(
  pile: Pile<T>,
  cardElements: CardElementType<T>[] = [],
  type: "stack" | "cascade" = "stack",
): PileElement<T> => {
  let cascadeOffset = layout[type].offset;
  let cascadeDuration = 0;

  const cards = pile.cards;

  const container = document.createElement("div");
  container.classList.add("deck-base");

  //?  Chartley: Should some of these animations be here?
  //?  Perhaps zoomCard, spinCard, and slideCard should
  //?  live in base card class with flip(). Deck based
  //?  animations should stay here, such as cascade.

  const slideCard = async (
    cardElement: CardElementType<T>,
    vector2: [number, number],
    duration: number,
  ): Promise<Animation | undefined> => {
    if (cardElement.transform.active) return;

    const transform = `
      translate(${vector2[0]}px, ${vector2[1]}px) 
      ${cardElement.transform.scale} 
      ${cardElement.transform.rotate}
    `;

    const anim = cardElement.container.animate(
      {
        transform: transform,
      },
      {
        duration: duration,
        easing: "ease-out",
        delay: 0,
        direction: "normal" as PlaybackDirection,
      },
    );

    await anim.finished.then(() => {
      cardElement.container.style.transform = transform;
    });

    return anim.finished;
  };

  const spinCard = async (
    cardElement: CardElementType<T>,
    duration: number,
  ): Promise<Animation | undefined> => {
    if (cardElement === undefined || cardElement.transform.active) return;

    cardElement.transform.rotate =
      cardElement.transform.rotate === `rotate(0deg)`
        ? "rotate(90deg)"
        : "rotate(0deg)";

    const { translate, scale, rotate } = cardElement.transform;
    const transform = `${translate} ${scale} ${rotate}`;

    const anim = cardElement.container.animate(
      {
        transform: transform,
      },

      {
        duration: duration,
        easing: "linear",
        delay: 0,
        direction: "normal" as PlaybackDirection,
      },
    );

    await anim.finished.then(() => {
      cardElement.container.style.transform = transform;
    });

    return anim;
  };

  //! I haven't tested this
  const zoomCard = async (
    cardElement: CardElementType<T>,
    factor: number,
    duration: number,
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

  const cascade = (duration = cascadeDuration) => {
    reset();
    const animations = cardElements.map((cardElement, i) => {
      const vector2: [number, number] = [
        cascadeOffset[0] * cardElement.container.offsetWidth * i,
        cascadeOffset[1] * cardElement.container.offsetHeight * i,
      ];

      return slideCard(cardElement, vector2, duration);
    });

    return Promise.all(animations);
  };

  // sets a new value to the percent of cascade, and a one time use duration
  // then performs the cascade and resets duration to 0

  //? So far, we've had this function trigger cascade() at the end.
  //? Seems kinda impure. It's probably a redundant function anyway
  //? when we can just update the .cascadeOffset property anyway.
  //? Perhaps we should make a setCascadeType function where you
  //? could choose from the prset "cascade" or "stack" options.

  const cascadeValueSetter = (percent: [number, number], duration: number) => {
    cascadeOffset = percent;
    cascadeDuration = duration;
    cascade();
    cascadeDuration = 0;
  };

  /**
   * Card Elements have animations, and must remain part of the original Pile until the animation is complete. The card objects are moved instantly, this function checks for top card object, and returns matching cardElement.
   * @returns The cardElement that is on the top of the pile
   */
  const getTopCardElementType = (): CardElementType<T> => {
    const topCard = cards[cards.length - 1];
    return cardElements.filter((element) => element.card === topCard)[0];
  };

  // slimmed down move card to deck
  const moveCardToPile = (
    destinationPile: PileElement<T>,
    cardElement = getTopCardElementType(),
    gameRules = true, // ability to pass in rules for passing the card from one deckbase to another
    animationCallback = animateMoveCardToNewPile, // probably un-needed arg... but allows us to change the animation, or use null to not animate the move
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
  async function animateMoveCardToNewPile(
    destination: PileElement<T>,
    cardElement: CardElementType<T>,
  ) {
    cardElement.container.style.zIndex = String(
      destination.cards.length + 1000,
    );
    const sourceBox = container.getBoundingClientRect();
    const destinationBox = destination.container.getBoundingClientRect();

    const destinationCascade = [
      destination.cascadeOffset[0] *
        cardElement.container.offsetWidth *
        (destination.cards.length - 1),
      destination.cascadeOffset[1] *
        cardElement.container.offsetHeight *
        (destination.cards.length - 1),
    ];

    const vector2: [number, number] = [
      destinationBox.x - sourceBox.x + destinationCascade[0],
      destinationBox.y - sourceBox.y + destinationCascade[1],
    ];

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
  }

  // resets the container of the DeckBase
  const reset = () => {
    while (container.firstElementChild) {
      container.removeChild(container.firstElementChild);
    }

    for (let i = 0; i < cardElements.length; i++) {
      const card = cardElements[i];
      container.appendChild(card.container);
    }
  };

  function adjustZIndex(cardElements: CardElementType<T>[]) {
    for (let index = 0; index < cardElements.length; index++) {
      const card = cardElements[index];
      card.container.style.zIndex = String(index);
    }
  }

  const findCardContainer = (element: HTMLElement) => {
    if (element.classList.contains("card-container"))
      return cardElements[parseInt(element.style.zIndex)];
    if (element.classList.contains("deck-base")) return null;
    else if (element.parentElement)
      return findCardContainer(element.parentElement);
    else throw "something went wrong in find card container";
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
    cascadeOffset,
    cascadeDuration,
    getTopCardElementType,
    slideCard,
    spinCard,
    zoomCard,
    slideDeck,
    moveCardToPile,
    cascade,
    cascadeValueSetter,
    reset,
    findCardContainer,
  };
};
