import type { Symbols, CardNumber, Card } from "./definitions"


export function createDeck() {
    const symbol: Symbols[] = ["C", "D", "H", "S"];
    // We increment starting from 1 (k+1) to a length of 13 so we are guarranted to have the array as CardNumber[].
    const numCard = Array.from({length: 13}, (_v, k) => k+1) as CardNumber[];
    const deck: Card[]= [];

    for (let i = 0;i < symbol.length;i++) {
        const currentSymbol = symbol[i];
        for (let j = 0;j < numCard.length;j++) {
            const currentNum = numCard[j];
                deck.push([currentNum, currentSymbol]);
        }
    }

    return deck;

}

export function shuffle(deck: Card[]) {
    // TODO: Look into Fisher-Yates Shuffle
    let j: number;
    const lengthDeck = deck.length;
    for (let i = 0;i < lengthDeck;i++) {
        j = Math.round(Math.random() * lengthDeck);
        [deck[i], deck[j]] = [deck[j], deck[i]]
    }

    return deck;
}
