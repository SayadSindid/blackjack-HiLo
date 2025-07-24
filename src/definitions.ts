
// Yes it's dirty but the "proper" way is even more dirty.
export type CardNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type Symbols = "C" | "S" | "H" | "D";

export type Card = [CardNumber, Symbols];

export type GameStateType = {
    cardType: "player" | "dealer" | "back",
    xPos: number,
    yPos: number,
    ratio: number,
    cardNumber?: CardNumber,
    symbol?: Symbols,
}
