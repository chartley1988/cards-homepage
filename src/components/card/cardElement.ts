import Pile from "../pile/pile";
import Card from "./card";
type CardElement<T extends Card> = {
  card: T;
  location: Pile<T> | null;
  front: HTMLDivElement;
  back: HTMLDivElement;
  parent: HTMLDivElement;
  wrapper: HTMLDivElement;
  flipCard: () => void;
  getFlipSpeed: () => string;
  blindFlip: () => void;
};

export const CardElement = <T extends Card>(thisCard: T): CardElement<T> => {
  let card = thisCard;
  let flipEnabled = true;
  let location = null;

  // FUNCTIONS
  const front = (() => {
    const frontDom = document.createElement("div");
    frontDom.classList.add("front"); // Generic to all cards
    frontDom.dataset.number = "front";
    return frontDom;
  })();

  const back = (() => {
    const backDom = document.createElement("div");
    backDom.classList.add("back");
    backDom.dataset.number = "back";
    return backDom;
  })();

  const parent = (() => {
    const parent = document.createElement("div");
    parent.classList.add("card");
    return parent;
  })();

  const wrapper = (() => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("card-wrapper");
    return wrapper;
  })();

  (() => {
    wrapper.appendChild(parent);
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
    parent,
    wrapper,
    flipCard,
    getFlipSpeed,
    blindFlip,
  };
};
