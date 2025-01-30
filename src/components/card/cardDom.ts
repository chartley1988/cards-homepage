import type { CardDom, DeckBase } from "../../types/card.types";

export const createCard = (): CardDom => {
  // PROPERTIES
  let faceUp = false;
  let flipEnabled: boolean = true;
  let state: "available" = "available";
  let location: DeckBase | null = null;
  // location will be a deckBase, when added to one. Need a type for this

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

  // - This creates the parent DOM container.
  // - It contains both the front and the back as children.
  // - The container is necessary because for card flipping to work,
  //   a parent needs to have position: relative, and the child position absolute.
  const container = (() => {
    const container = document.createElement("div");
    container.classList.add("card-container");
    return container;
  })();

  (function buildCard() {
    container.appendChild(parent);
    parent.appendChild(back);
    front.classList.toggle("flipped");
    back.classList.toggle("flipped");
  })();

  function flipCard(this: CardDom, delay = 0) {
    // flipEnabled stops the user from flipping a card rapidly over and over.
    if (this.flipEnabled === true) {
      this.flipEnabled = false;

      if (this.faceUp === false) {
        this.parent.appendChild(this.front);
      }

      setTimeout(() => {
        this.front.classList.toggle("flipped");
        this.back.classList.toggle("flipped");
      }, delay);

      if (this.faceUp === false) {
        this.faceUp = true;
        const waitForFlip = () => {
          this.flipEnabled = true;
          this.container.removeEventListener("transitionend", waitForFlip);
        };
        this.container.addEventListener("transitionend", waitForFlip);
      } else {
        const removeFront = () => {
          this.container.removeEventListener("transitionend", removeFront);
          this.parent.removeChild(this.front);
          this.faceUp = false;
          this.flipEnabled = true;
        };
        this.container.addEventListener("transitionend", removeFront);
      }
    }
  }

  function getFlipSpeed() {
    const styles = window.getComputedStyle(document.body);
    const speed = styles.getPropertyValue("--card-flip-speed");
    return speed;
  }

  function blindFlip(this: CardDom) {
    if (this.faceUp === false) {
      parent.appendChild(this.front);
    }

    this.back.classList.toggle("flipped");

    if (this.faceUp === false) {
      this.faceUp = true;
    } else {
      this.parent.removeChild(this.front);
      this.faceUp = false;
    }
    this.front.classList.toggle("flipped");
  }

  return {
    // Properties
    faceUp,
    flipEnabled,
    state,
    location,

    // Properties that are Dom related
    front,
    back,
    parent,
    container,

    // Functions
    flipCard,
    getFlipSpeed,
    blindFlip,
  };
};
