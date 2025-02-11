import "./components/navMenu/navMenu";
import "./styles/style.css";
import "./styles/theme.css";
import "./styles/card.css";
import { setTheme, redFelt } from "./components/table/themes";
import StandardDeckOfCards from "./components/card/playingCard/standardDeckOfCards";
import { deal } from "./components/animate/animate";

const app = document.getElementById("app");
if (app) {
  setTheme(redFelt);
  const deck = StandardDeckOfCards();

  const dealer = deck.createPileElement("dealer", deck.cards);
  dealer.shuffle();
  const titleCards = deck.createPileElement("title");

  (function createTitle() {
    const titleContainer = document.createElement("div");
    titleContainer.style.position = "relative";
    titleContainer.style.display = "flex";
    titleContainer.style.justifyContent = "center";

    const h1 = document.createElement("h1");
    h1.textContent = "CardsJS";
    h1.style.position = "relative";
    h1.style.zIndex = "100";

    const fan = titleCards.container;
    fan.style.position = "relative";
    // fan.style.left = "65%";
    // fan.style.top = "0px";
    fan.style.scale = "80%";

    titleContainer.appendChild(h1);
    titleContainer.appendChild(fan);

    app.appendChild(titleContainer);
  })();

  window.addEventListener("DOMContentLoaded", async () => {
    titleCards.cascade();
    await deal(3, dealer, titleCards);

    async function fanTitleCards() {
      const totalCards = titleCards.cardElements.length;
      const fanSpread = 30; // Total angle of the fan (degrees)
      const startAngle = -fanSpread / 2; // Start from negative angle to center the fan
      const fanTilt = 30; // Overall tilt of the entire fan

      for (let index = 0; index < totalCards; index++) {
        const card = titleCards.cardElements[index];

        // Calculate rotation for this card + the overall fan tilt
        const rotation =
          startAngle + (fanSpread / (totalCards - 1)) * index + fanTilt;

        // Calculate slight vertical offset for arc effect
        const yOffset = Math.abs(rotation - fanTilt) * 0.5; // Subtract fanTilt to keep arc based on relative positions

        // Apply all transformations in one style
        card.container.style.position = "absolute";
        card.container.style.transformOrigin = "bottom center";
        card.container.style.transitionDuration = "0.2s";
        card.container.style.transform = `
      translate(-50%, 0)
      rotate(${rotation}deg)
      translateY(${yOffset}px)
    `;

        // Add a tiny z-index adjustment so cards stack properly left to right
        card.container.style.zIndex = `${index}`;

        // Wait for transition to complete before moving to next card
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    fanTitleCards();
    (async function flipTitleCards() {
      const totalCards = titleCards.cardElements.length;

      for (let index = totalCards - 1; index > -1; index--) {
        const card = titleCards.cardElements[index];
        card.flip();

        // Wait for transition to complete before moving to next card
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    })();
  });
}
