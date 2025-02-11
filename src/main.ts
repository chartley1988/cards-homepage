import "./components/navMenu/navMenu";
import "./styles/style.css";
import "./styles/theme.css";
import "./styles/card.css";
import { setTheme, redFelt } from "./components/table/themes";
import StandardDeckOfCards from "./components/card/playingCard/standardDeckOfCards";

const app = document.getElementById("app");
if (app) {
  setTheme(redFelt);

  const deck = StandardDeckOfCards();
  const dealer = deck.createPileElement("dealer", deck.cards);

  dealer.cascade();
  dealer.createCascadeLayout("spread", [0.4, 0]);
  dealer.applyCascadeLayout("spread");
  dealer.cascade();
  console.log(dealer.cascadeOffset);

  const section1 = document.createElement("section");
  app.appendChild(section1);
  section1.appendChild(dealer.container);
}
