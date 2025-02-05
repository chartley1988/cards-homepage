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

export const cascade = <T extends Card>(
  pileElement: PileElementType<T>,
  duration = pileElement.cascadeDuration,
) => {
  pileElement.reset();
  const promise = new Promise((resolve) => {
    const arrayFinished = []; // Array of .finished promises returned by animate
    for (let i = 0; i < pileElement.cardElements.length; i++) {
      const vector2 = [];
      const cardElement = pileElement.cardElements[i].container;
      vector2[0] = pileElement.cascadeOffset[0] * cardElement.offsetWidth * i;
      vector2[1] = pileElement.cascadeOffset[1] * cardElement.offsetHeight * i;
      const slide = slideCard(pileElement.cardElements[i], vector2, duration);
      arrayFinished.push(slide);
    }
    resolve(Promise.all(arrayFinished).then(() => {}));
  });
  return promise;
};
