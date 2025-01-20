import { createCard } from "../../src/components/card/card";
import "../../src/styles/card.css";
import "./styles.css";

function instanceCard() {
	const card = createCard();
	card.wrapper.addEventListener("click", () => {
		card.flipCard();
	});

	return card;
}

const app = document.getElementById("app");
if (app) {
	const testCard = instanceCard();
	app.appendChild(testCard.wrapper);
}
