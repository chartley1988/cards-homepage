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

  const titleCards = deck.createPileElement("title");

  dealer.createCascadeLayout("spread", [0.4, 0]);
  dealer.applyCascadeLayout("spread");

  const section1 = document.createElement("section");
  app.appendChild(section1);
  section1.appendChild(dealer.container);
  section1.appendChild(titleCards.container);

  window.addEventListener("DOMContentLoaded", async () => {
    dealer.cascade();
    titleCards.cascade();
    deal(8, dealer, titleCards);

    const fanSpread = 60;
    const startAngle = -fanSpread / 2;

    console.log(typeof titleCards.cardElements);

    titleCards.cardElements.forEach((card, index) => {
      const rotation =
        startAngle + (fanSpread / (titleCards.cardElements.length - 1)) * index;
      card.container.style.transform = `rotate(${rotation}deg)`;
    });
  });
}
