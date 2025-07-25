import type { CardNumber, Symbols, GameStateType } from "./definitions";
import { score } from "./main";

export function addNewCardState(type: "player" | "dealer" | "back", x: number, y: number, ratio: number = 4, cardNumber?: CardNumber, symbol?: Symbols, updateScore: boolean = true) {
    let numberToAdd: number = 0;


    if (cardNumber) {

        if (cardNumber > 10) {
            numberToAdd = 10;
        } else {
            // Aces rule for the player
            if (type === "player") {
                if (score.player >= 11 && cardNumber === 1) {
                    numberToAdd = 1;
                } else if (score.player < 11 && cardNumber === 1){
                    numberToAdd = 11;
                } else {
                    numberToAdd = cardNumber;
                }
            } else {
                numberToAdd = cardNumber;
            }
        }

        if (updateScore) {
            if (type === "player") {
                score.player += numberToAdd;
            } else if (type === "dealer") {
                score.dealer += numberToAdd;
            }
            
                if (type !== "back" && cardNumber) {
                updateVisualScore(type);
            }
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

function updateVisualScore(type: "dealer" | "player") {
    const scoreDealerVisual = document.getElementById("scoreDealer") as HTMLSpanElement;
    const scorePlayerVisual = document.getElementById("scorePlayer")  as HTMLSpanElement;

    if (type === "dealer") {
        scoreDealerVisual.innerText = (score.dealer).toString();
    } else {
        scorePlayerVisual.innerText = (score.player).toString();
    }

    return;
}
