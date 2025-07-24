import type { CardNumber, Symbols, GameStateType } from "./definitions";
import { gameState, scorePlayer, scoreDealer } from "./main";

export function addNewCardState(type: "player" | "dealer" | "back", x: number, y: number, ratio: number = 4, cardNumber?: CardNumber, symbol?: Symbols) {


    if (cardNumber) {
        let numberToAdd;

        if (cardNumber > 10) {
            numberToAdd = 10;
        } else {
            numberToAdd = cardNumber;
        }

        // FIXME: It doesn't work with import, I need to find something else.
        if (type === "player") {
            scorePlayer += numberToAdd;
        } else if (type === "dealer") {
            scoreDealer += numberToAdd;
        }
    }

    
    return {    cardType: type,
                xPos: x,
                yPos: y,
                ratio: ratio,
                cardNumber: cardNumber,
                symbol: symbol,
    }
}

export function cleanState(gameState: GameStateType[], scorePlayer: number, scoreDealer: number) {
    gameState = [];
    scorePlayer = 0;
    scoreDealer = 0;
    return;
}