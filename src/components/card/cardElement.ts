import Pile from "../pile/pile";
import Card from "./card";

type CardElement<T extends Card> = {
  card: T;
  location: Pile<T> | null;
  front: HTMLDivElement | null;
  back: HTMLDivElement | null;
  wrapper: HTMLDivElement;
  flipCard: () => void;
  getFlipSpeed: () => string;
  blindFlip: () => void;
};

export const CardElement = <T extends Card>(
  front: HTMLDivElement = document.createElement("div"),
  back: HTMLDivElement = document.createElement("div"),
  thisCard: T = new Card() as T
): CardElement<T> => {
  let card = thisCard;
  let flipEnabled = true;
  let location = null;

  // FUNCTIONS
  const parent = (() => {
    const parent = document.createElement("div");
    parent.classList.add("card-parent");
    return parent;
  })();

  const wrapper = (() => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("card-wrapper");
    return wrapper;
  })();

  (() => {
    wrapper.appendChild(parent);
    front.classList.add("card-front");
    back.classList.add("card-back");
    parent.appendChild(back);
    front.classList.toggle("flipped");
    back.classList.toggle("flipped");
  })();

  const flipCard = (delay = 0) => {
    if (flipEnabled === false) return;
    else {
      flipEnabled = false;

      if (card.faceUp === false) {
        parent.appendChild(front);
      }

      setTimeout(() => {
        front.classList.toggle("flipped");
        back.classList.toggle("flipped");
      }, delay);

      if (card.faceUp === false) {
        card.flip();
        const waitForFlip = () => {
          flipEnabled = true;
          wrapper.removeEventListener("transitionend", waitForFlip);
        };
        wrapper.addEventListener("transitionend", waitForFlip);
      } else {
        const removeFront = () => {
          wrapper.removeEventListener("transitionend", removeFront);
          parent.removeChild(front);
          card.flip();
          flipEnabled = true;
        };
        wrapper.addEventListener("transitionend", removeFront);
      }
    }
  };

  //! Is this ever used?
  const getFlipSpeed = () => {
    const styles = window.getComputedStyle(document.body);
    const speed = styles.getPropertyValue("--card-flip-speed");
    return speed;
  };

  //! Can we incorporate this into regular flip?
  const blindFlip = () => {
    if (card.faceUp === false) {
      parent.appendChild(front);
    }

    back.classList.toggle("flipped");

    if (card.faceUp === false) {
      card.flip();
    } else {
      parent.removeChild(front);
      card.flip();
    }
    front.classList.toggle("flipped");
  };

  return {
    get card() {
      return card;
    },
    get location() {
      return location;
    },
    front,
    back,
    wrapper,
    flipCard,
    getFlipSpeed,
    blindFlip,
  };
};
