import Pile from "../pile/pile";
import Card from "./card";

export type CardElement<T extends Card> = {
  card: T;
  location: Pile<T> | null;
  front: HTMLDivElement;
  back: HTMLDivElement;
  container: HTMLDivElement;
  faceUp: Boolean;
  transform: {
    active: Boolean;
    translate: string;
    scale: string;
    rotate: string;
  };
  flip: () => void;
  getFlipSpeed: () => string;
  blindFlip: () => void;
};

export const CardElement = <T extends Card>(
  thisCard = new Card() as T,
  _front = document.createElement("div"),
  _back = document.createElement("div")
): CardElement<T> => {
  const card = thisCard;
  let flipEnabled = true;
  const location = null;
  const front = _front;
  const back = _back;
  const listenerList = [
    "click",
    "touch",
    "dblclick",
    "keydown",
    "focus",
    "mousedown",
    "mouseenter",
    "mouseexit",
  ];
  const transform = {
    active: false,
    translate: "translate(0px, 0px)",
    scale: `scale(1)`,
    rotate: `rotate(0deg)`,
  };

  // FUNCTIONS
  const parent = (() => {
    const parent = document.createElement("div");
    parent.classList.add("card-parent");
    return parent;
  })();

  const container = (() => {
    const container = document.createElement("div");
    container.classList.add("card-container");
    return container;
  })();

  (() => {
    container.appendChild(parent);
    front.classList.add("card-front");
    back.classList.add("card-back");
    parent.appendChild(back);
    front.classList.toggle("flipped");
    back.classList.toggle("flipped");
    container.addEventListener("animationstart", () => {
      transform.active = true;
      stopPropagation();
    });
    container.addEventListener("animationend", () => {
      transform.active = false;
      startPropagation();
    });
  })();

  const flip = (delay = 0) => {
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
          container.removeEventListener("transitionend", waitForFlip);
        };
        container.addEventListener("transitionend", waitForFlip);
      } else {
        const removeFront = () => {
          container.removeEventListener("transitionend", removeFront);
          parent.removeChild(front);
          card.flip();
          flipEnabled = true;
        };
        container.addEventListener("transitionend", removeFront);
      }
    }
  };

  const stopProp = (e: Event) => {
    e.stopPropagation();
  };
  const stopPropagation = () => {
    listenerList.forEach((listener) => {
      container.addEventListener(listener, stopProp);
    });
  };
  const startPropagation = () => {
    listenerList.forEach((listener) => {
      container.removeEventListener(listener, stopProp);
    });
  };

  //! Is this ever used?
  const getFlipSpeed = () => {
    const styles = window.getComputedStyle(document.body);
    const speed = styles.getPropertyValue("--card-flip-speed");
    return speed;
  };

  //! Can we incorporate this into regular flip?
  //! It is showing animation when flipping from faceup to facedown still
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
    get front() {
      return front;
    },
    get back() {
      return back;
    },
    get faceUp() {
      return card.faceUp;
    },
    //! I think we want to keep this as only a getter?
    /*
    set front(newFront) {
      if (!card.faceUp) {
        newFront.classList.add("flipped");
      }
      newFront.classList.add("card-front");
      front = newFront;
    },
    set back(newBack) {
      if (card.faceUp) {
        newBack.classList.add("flipped");
      }
      newBack.classList.add("card-back");
      back = newBack;
    },
    */
    container,
    transform,
    flip,
    getFlipSpeed,
    blindFlip,
  };
};
