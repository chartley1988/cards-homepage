import "./style.scss";
import { interfaceUI, makeFlop } from "./scripts/showUI";
import TableDeck from "./scripts/tableDeckClass";
import { make54 } from "./scripts/deckBuilding";

// Debug Commands

const Table = new TableDeck();
Table.deck = make54();

const target = document.body;
const testFlop = makeFlop(target);

Table.deck.forEach((card) => {
  testFlop.appendChild(card.card);
  card.setParent(testFlop);
});


