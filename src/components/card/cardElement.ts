import Pile from "../pile/pile";
import Card from "./card";

export type CardElement<T extends Card> = {
  card: T;
  location: Pile<T> | null;
  front: HTMLDivElement;
  back: HTMLDivElement;
  wrapper: HTMLDivElement;
  flip: () => void;
  getFlipSpeed: () => string;
  blindFlip: () => void;
};

export const CardElement = <T extends Card>(
  _front = document.createElement("div"),
  _back = document.createElement("div"),
  thisCard = new Card() as T
): CardElement<T> => {
  let card = thisCard;
  let flipEnabled = true;
  let location = null;
  let front = _front;
  let back = _back;

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
    wrapper,
    flip,
    getFlipSpeed,
    blindFlip,
  };
};
