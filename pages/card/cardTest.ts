import "../../src/styles/style.css";
import "../../src/styles/card.css";
import "../../src/styles/theme.css";
import "./styles.css";
import "../../src/components/navMenu/navMenu";
import StandardDeckOfCards from "../../src/components/card/playingCard/standardDeckOfCards";
import Player from "../../src/components/player/player";
import { CardElementType } from "../../src/types/card.types";
import PlayingCard from "../../src/components/card/playingCard/playingCardClass";
import { deal, slideDeck } from "../../src/components/animate/animate";
import { PileElementType } from "../../src/types/pile.types";
import { greenFelt, setTheme } from "../../src/components/table/themes";

const app = document.getElementById("app");
if (app) {
  setTheme(greenFelt);

  const deck = StandardDeckOfCards();

  const player1 = new Player("dave", deck, [
    {
      name: "hand",
      options: { draggable: true, groupDrag: false, layout: "cascade" },
    },
  ]);
  const main = new Player(
    "main",
    deck,
    [{ name: "draw" }, { name: "discard" }],
    "draw",
  );
  const player2 = new Player("hups", deck, [
    { name: "hand", options: { layout: "cascade" } },
  ]);

  const hand1 = player1.getPile("hand");
  document.getElementById("p1Hand")?.appendChild(hand1.container);

  const hand2 = player2.getPile("hand");
  document.getElementById("p2Hand")?.appendChild(hand2.container);

  const draw = main.getPile("draw");
  document.getElementById("mainDraw")?.appendChild(draw.container);

  const discard = main.getPile("discard");
  document.getElementById("mainDiscard")?.appendChild(discard.container);

  let currentPlayer = player1;
  player1.getPile("hand").applyCascadeLayout("visibleStack");
  player1.getPile("hand").createCascadeLayout("flop", [0.5, 0.5]);
  player2.getPile("hand").applyCascadeLayout("visibleStack");
  //player1.getPile("hand").cascadeOffset = [0.3, 0];

  draw.cascade();

  window.addEventListener("DOMContentLoaded", () => {
    deal(5, draw, [hand1, hand2]);
  });

  draw.container.addEventListener("dblclick", () => {
    main.getPile("draw").moveCardToPile(currentPlayer.getPile("hand"));
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  });

  main.getPile("draw").container.addEventListener("click", () => {
    if (!main.getPile("draw").getTopCardElement().faceUp)
      main.getPile("draw").getTopCardElement().flip();
  });

  hand1.container.addEventListener("dblclick", () => {
    slideDeck(hand1, [-100, -300], 1000);
  });
  hand1.container.addEventListener("click", (e) => {
    if (e.target instanceof HTMLElement) {
      const card = hand1.findCardContainer(e.target);
      if (card === null) return;
      card.flip();
    }
  });

  hand2.container.addEventListener("dblclick", (e) => {
    if (e.target instanceof HTMLElement) {
      const card = hand2.findCardContainer(e.target);
      if (card === null) return;
      hand2.moveCardToPile(discard, card, rules(hand2, discard, card));
    }
  });

  hand2.container.addEventListener("click", (e) => {
    if (e.target instanceof HTMLElement) {
      const card = hand2.findCardContainer(e.target);
      if (card === null) return;
      if (card.faceUp) return;
      card.flip();
    }
  });

  const rules = (
    sourcePile: PileElementType<PlayingCard>,
    destinationPile: PileElementType<PlayingCard>,
    card: CardElementType<PlayingCard>,
  ): boolean => {
    if (!card.faceUp) return false;
    if (card.card.value < 6) return true;
    else return true;
  };
}
