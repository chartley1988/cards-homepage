import "./components/navMenu/navMenu";
import "./styles/style.css";
import "./styles/theme.css";
import "./styles/card.css";
import { setTheme, redFelt } from "./components/table/themes";
import StandardDeckOfCards from "./components/card/playingCard/standardDeckOfCards";
import { deal } from "./components/animate/animate";
import "./styles/home.css";

const app = document.getElementById("app");
if (app) {
  setTheme(redFelt, app);
  const deck = StandardDeckOfCards();

  const dealer = deck.createPileElement("dealer", deck.cards);
  dealer.shuffle();
  const titleCards = deck.createPileElement("title");

  (function createTitle() {
    const titleContainer = document.createElement("div");
    titleContainer.classList.add("title-container");
    titleContainer.style.position = "relative";
    titleContainer.style.display = "flex";
    titleContainer.style.justifyContent = "center";
    titleContainer.style.alignItems = "center";

    const h1 = document.createElement("h1");
    h1.textContent = "CardsJS";
    h1.style.position = "relative";
    h1.style.zIndex = "100";

    const fan = titleCards.container;
    fan.style.position = "absolute";
    fan.style.bottom = "-50%";
    fan.style.right = "-35%";

    titleContainer.appendChild(h1);
    h1.appendChild(fan);

    app.appendChild(titleContainer);

    const fontSize = parseFloat(window.getComputedStyle(h1).fontSize);
    const resizeCards = (size: number) => size / 150;
    const scale = resizeCards(fontSize);

    titleCards.container.style.transformOrigin = "bottom left";
    titleCards.container.style.zIndex = "-1";

    titleCards.container.style.transform = `
  scale(${scale})
`;

    // If you need it to update on window resize:
    window.addEventListener("resize", () => {
      const fontSize = parseFloat(window.getComputedStyle(h1).fontSize);
      const scale = resizeCards(fontSize);
      titleCards.container.style.transform = `
    scale(${scale})
  `;
    });
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
    await fanTitleCards();
    async function flipTitleCards() {
      const totalCards = titleCards.cardElements.length;
      await new Promise((resolve) => setTimeout(resolve, 400));

      for (let index = totalCards - 1; index > -1; index--) {
        const card = titleCards.cardElements[index];
        card.flip();

        // Wait for transition to complete before moving to next card
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }
    flipTitleCards();
  });
}
