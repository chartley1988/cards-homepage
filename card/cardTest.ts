import { createCard } from "../src/components/card";
import "../src/styles/card.css";

const testCard = createCard();

document.body.appendChild(testCard.wrapper);

testCard.wrapper.addEventListener("click", () => {
	testCard.flipCard();
});
