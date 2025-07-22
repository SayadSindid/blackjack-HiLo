import type { Symbols, CardNumber } from "./main"

type Deck = [CardNumber, Symbols];

export function createDeck() {
    const symbol: Symbols[] = ["C", "D", "H", "S"];
    // We increment starting from 1 (k+1) to a length of 13 so we are guarranted to have the array as CardNumber[].
    const numCard = Array.from({length: 13}, (_v, k) => k+1) as CardNumber[];
    const deck: Deck[]= [];

    for (let i = 0;i < symbol.length;i++) {
        const currentSymbol = symbol[i];
        for (let j = 0;j < numCard.length;j++) {
            const currentNum = numCard[j];
                deck.push([currentNum, currentSymbol]);
        }
    }

    return deck;

}


function shuffle(deck: Deck[]) {
    // TODO: Look into Fisher-Yates Shuffle
}