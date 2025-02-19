import { setTheme, greenFelt } from "@/components/table/themes";
import StandardDeckOfCards from "@/components/card/playingCard/standardDeckOfCards";
import "./styles.css";

const body = document.querySelector("body");
if (body) {
  setTheme(greenFelt, body);
}

const deck = StandardDeckOfCards(); // StandardDeckOfCards(true) will provide 2 jokers
const discardPile = deck.createPileElement("discardPile");
const drawPile = deck.createPileElement("drawPile", deck.cards); // initiate all cards here
const playerHand = deck.createPileElement("Hand"); // will begin with no cards

const discardDiv = document.getElementById("discardPile");
discardDiv.appendChild(discardPile.container);

const drawDiv = document.getElementById("drawPile");
drawDiv.appendChild(drawPile.container);

const handDiv = document.getElementById("hand");
handDiv.appendChild(playerHand.container);

drawPile.shuffle();
window.addEventListener("DOMContentLoaded", async () => {
  drawPile.cascade();
  drawPile.container.addEventListener("click", () => {
    drawPile.topCardElement.flip();
  });
  playerHand.applyCascadeLayout("cascade");
  drawPile.container.addEventListener("click", () => {
    drawPile.topCardElement.flip();
  });
  playerHand.container.addEventListener("click", (e) => {
    if (!(e.target instanceof HTMLElement)) return;
    const cardElement = playerHand.findCardContainer(e.target);
    if (cardElement === null) return;
    if (cardElement.faceUp) return;
    cardElement.flip();
  });
  playerHand.options.groupDrag = false;
});
