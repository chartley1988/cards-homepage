import { CardElementType } from "../../types/card.types";
import { PileElementType } from "../../types/pile.types";
import Card from "../card/card";

export const slideCard = async <T extends Card>(
  cardElement: CardElementType<T>,
  vector2: [number, number],
  duration: number,
): Promise<Animation | undefined> => {
  if (cardElement.transform.active) return;
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
  return anim.finished;
};

export const spinCard = async <T extends Card>(
  cardElement: CardElementType<T>,
  duration: number,
): Promise<Animation | undefined> => {
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
export const zoomCard = async <T extends Card>(
  cardElement: CardElementType<T>,
  factor: number,
  duration: number,
) => {
  const { translate, rotate } = cardElement.transform;

  const scale = `scale(${factor})`;
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
  return anim;
};
