import type { CardNumber, Symbols } from "./definitions";
import { score, scoreDealerVisual, scorePlayerVisual, globalScoreDealer, globalScorePlayer, counting } from "./main";

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
                updateVisualScore(type, "hands");
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

export function updateVisualScore(type: "dealer" | "player" | "tie", scope: "global" | "hands") {

    if (scope === "hands") {
        if (type === "dealer") {
            scoreDealerVisual.innerText = (score.dealer).toString();
        } else {
            scorePlayerVisual.innerText = (score.player).toString();
        }
    } else {
        if (type === "dealer") {
            let currentScore = Number(globalScoreDealer.innerText);
            globalScoreDealer.innerText = (currentScore += 1).toString();
        } else if (type === "player") {
            let currentScore = Number(globalScorePlayer.innerText);
            globalScorePlayer.innerText = (currentScore += 1).toString();
        } 
    }
    // do nothing if tie.
    return;
}

// Any strategy can be hard coded here.
// What could be done is having a strategy argument and having multiple counting strategy and chosing at will.
export function cardCounting(num: number) {
    if (num > 2 && num < 7) {
        counting.counter += 1;
    } if (num >= 10 || num === 1) {
        counting.counter -= 1;
    }

    const visualCountingIndicator = document.getElementById("cardCountingCounter") as HTMLSpanElement;

    visualCountingIndicator.innerText = counting.counter.toString();

    return;
}