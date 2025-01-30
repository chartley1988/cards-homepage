import "../../src/styles/style.css";
import "../../src/styles/card.css";
import "../../src/styles/theme.css";
import "./styles.css";
import "../../src/components/navMenu/navMenu";
import StandardDeckOfCards from "../../src/components/card/playingCard/standardDeckOfCards";
import Handler from "../../src/components/handler/handler";
import PlayingCardElement from "../../src/components/card/playingCard/playingCardElement";
import Player from "../../src/components/player/player";

const app = document.getElementById("app");
if (app) {
  const deck = StandardDeckOfCards();
  const deck2 = StandardDeckOfCards();

  const player1 = new Player("dave", deck2, ["hand"], "hand");
  const main = new Player("main", deck, ["draw", "discard"], "draw");
  const player2 = new Player("hups", deck, ["hand"]);

  const hand1 = player1.getPile("hand");
  document.getElementById("p1Hand")?.appendChild(hand1.container);

  const hand2 = player2.getPile("hand");
  document.getElementById("p2Hand")?.appendChild(hand2.container);

  const draw = main.getPile("draw");
  document.getElementById("mainDraw")?.appendChild(draw.container);

  const discard = main.getPile("discard");
  document.getElementById("mainDiscard")?.appendChild(discard.container);

  let currentPlayer = player1;

  draw.cascade();
  hand1.cascade();

  draw.container.addEventListener("dblclick", () => {
    main.getPile("draw").moveCardToPile(currentPlayer.getPile("hand"));
    currentPlayer === player1
      ? (currentPlayer = player2)
      : (currentPlayer = player1);
  });

  main.getPile("draw").container.addEventListener("click", () => {
    if (!main.getPile("draw").getTopCardElement().faceUp)
      main.getPile("draw").getTopCardElement().flip();
  });
}
