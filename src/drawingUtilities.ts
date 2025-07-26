import { ctx } from "./main";
import { loadedBackImages, loadedSymbolsImages, gameState } from "./main";
import type { Symbols, CardNumber, Card } from "./definitions";
import { addNewCardState, cardCounting } from "./gameState";

export function createRoundedRectangle(x: number, y: number, ratio: number = 4) {
    const WidthCard = 21 * ratio;
    const HeightCard = 31 * ratio;
    const roundingCard = 10;

    ctx.save()
    ctx.beginPath();
    ctx.roundRect(x, y, WidthCard, HeightCard, roundingCard)
    ctx.clip();
    ctx.stroke();

    return;
}

// There is no way this implementation is good
export function drawCard(deck: Card[], x: number, y: number, cardPicker: "player"| "dealer",ratio: number = 4, reconstruct: boolean = false, symbol?: Symbols, num?: CardNumber) {
    // Card base resolution = W: 84, H: 124.
    // Greatest common factor is 21:31.

    // -- MAIN LOGIC CARD DRAW --
    createRoundedRectangle(x, y, ratio);
    if (!reconstruct) {
        const [cardNumber, cardSymbol] = getCardFromDeck(deck);
        cardCounting(cardNumber);
        gameState.push(addNewCardState(cardPicker, x, y, ratio, cardNumber, cardSymbol));
        const { xOffset, yOffset } = offsetCalculation(cardNumber);
        initializeNewImage<Symbols>(loadedSymbolsImages, cardSymbol, x, y, xOffset, yOffset, ratio);
        ctx.restore()
    } else if (symbol && num) {
        gameState.push(addNewCardState(cardPicker, x, y, ratio, num, symbol, false));
        const { xOffset, yOffset } = offsetCalculation(num);
        initializeNewImage<Symbols>(loadedSymbolsImages, symbol, x, y, xOffset, yOffset, ratio);
        ctx.restore()
    
    } else {
        ctx.restore();
    }
    // -- MAIN LOGIC CARD DRAW --

    function getCardFromDeck(deck: Card[]) {
        const card = deck[deck.length - 1];
        deck.pop();

        return card;
    }


    function offsetCalculation(num: CardNumber): { xOffset: number, yOffset: number } {

        // For the first 5 offset = 88 * (num - 1), 0
        // Next five = 88 * (num - 1 - 5), 124
        // Last 3 = 88 * (num - 1 - 10), 124 + 124
        let xOffset = 0;
        let yOffset = 0;
        const xOffsetAmount = 88;
        const yOffsetAmount = 124;

        for (let i = 1;i < num + 1;i++) {
            if (i === num) return { xOffset, yOffset };
            
            if (i % 5 === 0 && i) {
                yOffset += yOffsetAmount;
                xOffset = -xOffsetAmount; // 6 and 11 xOffset will increment so I need to balance it.
            }

            xOffset += xOffsetAmount;
        }

        return { xOffset, yOffset };
    }

}

export function drawBackDeck(x: number, y: number, ratio: number = 4) {
    createRoundedRectangle(x, y, ratio);
    // xOffset = 88 for red, 0 for blue
    initializeNewImage<string>(loadedBackImages, "Deck", x, y, 0, 0, ratio, undefined, 143);
    ctx.restore();

    return;
}

export function drawBackCard(x: number, y: number, ratio: number = 4) {
    gameState.push(addNewCardState("back", x, y, ratio));
    createRoundedRectangle(x, y, ratio);
    // xOffset = 0 for red, 88 for blue
    initializeNewImage<string>(loadedBackImages, "Card", x, y, 88, 0, ratio);
    ctx.restore();

    return;
}

export function initializeNewImage<T extends string>(object: Record<T, HTMLImageElement>, value: T, x: number, y: number, xOffset: number, yOffset: number, ratio: number = 4, wImage: number = 88, hImage: number = 124): void {

    ctx.drawImage(object[value], xOffset, yOffset, wImage, hImage, x, y, 21 * ratio, 31 * ratio);

    return;
}
