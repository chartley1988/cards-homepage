import Card from "../card/card";
import { PileElementType } from "../../types/pile.types";
import { CardElementType } from "../../types/card.types";

export const slideCard = async <T extends Card>(
  cardElement: CardElementType<T>,
  vector2: number[],
  duration: number,
) => {
  if (cardElement.transform.active) return;
  if (vector2.length !== 2) {
    console.error("Error: vector2 must be an array of 2 values, x and y.");
  }
  const { scale, rotate } = cardElement.transform;
  const newTranslate = `translate(${vector2[0]}px, ${vector2[1]}px)`;
  cardElement.transform.translate = newTranslate;

  const transform = `${newTranslate} ${scale} ${rotate}`;

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

export const spinCard = async <T extends Card>(
  cardElement: CardElementType<T>,
  duration: number,
) => {
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
  return await anim.finished.then(() => {
    cardElement.container.style.transform = transform;
    cardElement.container.dispatchEvent(new Event("animationend"));
    return Promise.resolve(true);
  });
};

//! I haven't tested this
export const zoomCard = async <T extends Card>(
  cardElement: CardElementType<T>,
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
export const slideDeck = async <T extends Card>(
  pile: PileElementType<T>,
  vector2: number[],
  duration: number,
) => {
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

  const anim = pile.container.animate(keys, options);
  await anim.finished.then(() => {
    pile.container.style.transform = transform;
  });
};

/**
 *
 * @param numberOfCards The number of cards to deal out
 * @param from The pile the cards are coming from
 * @param to The pile(s?) the cards are going to
 * @param delayTime The delay between dealing cards
 */
export async function deal<T extends Card>(
  numberOfCards: number,
  from: PileElementType<T>,
  to: PileElementType<T>[] | PileElementType<T>,
  delayTime: number = 200,
) {
  const piles = Array.isArray(to) ? to : [to];
  const promises: Promise<boolean>[] = [];

  for (let i = 0; i < numberOfCards * piles.length; i++) {
    const currentPile = piles[i % piles.length];

    // ✅ Store each move promise
    const movePromise = from.moveCardToPile(currentPile);
    if (movePromise === false) return;
    promises.push(movePromise);

    if (i < numberOfCards * piles.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayTime));
    }
  }

  // ✅ Ensure all cards finish moving before returning
  await Promise.all(promises);
}
