import './style.css'
import { createRoundedRectangle } from "./drawingUtilities";


// Yes it's dirty but the "proper" way is even more dirty.
export type CardNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type Symbols = "C" | "S" | "H" | "D";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
// Asserting otherwise it persist to say it can be null.
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D ;

const linkSymbolImage = {
    "C": "./assets/Cards/Clubs.png",
    "S": "./assets/Cards/Spades.png",
    "H": "./assets/Cards/Hearts.png",
    "D": "./assets/Cards/Diamonds.png",
}

const linkBackImage = {
    Card: "./assets/Cards/Card_Back.png",
    Deck: "./assets/Cards/Card_Deck_Back.png",
}


// TODO: Implement a way to know which card have been picked, so they can't be re-picked.
// TODO: Shuffle the 54 card and then take them in order (Don't pick them randomly) (Probably initialize an array then take the last and pop).
// TODO: Minor: Add some styles to the board.
// TODO: Look into how to refresh the canvas when adding new drawing on the screen


async function draw() {

    if (!canvas.getContext) {
        // TODO: Putting something if canvas is not supported.
    }

    // Object with key/value as Symbols: HTMlImage.
    const loadedSymbolImages = await loadAllImage<Symbols>(linkSymbolImage);
    const loadedBackImages = await loadAllImage<string>(linkBackImage);

    // --------------- MAIN LOGIC START ------------------------


    ctx.fillStyle = "rgb(200 0 0)";
    ctx.fillRect(25,25, 100, 100);
    ctx.clearRect(45, 45, 60, 60);
    ctx.strokeRect(50, 50, 50, 50)

    drawCard("H", 4, 500, 300);
    drawCard("C", 2, 550, 260);
    drawCard("C", 5, 800, 300);
    drawCard("C", 4, 200, 300);
    drawBackDeck(100, 300);

    // --------------- MAIN LOGIC END ------------------------


    function drawCard(symbol: Symbols, num: CardNumber, x: number, y: number, ratio: number = 4) {
        // Card base resolution = W: 84, H: 124.
        // Greatest common factor is 21:31.

        // -- MAIN LOGIC CARD DRAW --
        createRoundedRectangle(x, y, ratio);
        const { xOffset, yOffset } = offsetCalculation(num);
        initializeNewImage<Symbols>(loadedSymbolImages, symbol, x, y, xOffset, yOffset, ratio);
        ctx.restore()
        // -- MAIN LOGIC CARD DRAW --

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

    function drawBackDeck(x: number, y: number, ratio: number = 4) {
        createRoundedRectangle(x, y, ratio);
        initializeNewImage<string>(loadedBackImages, "Deck", x, y, 0, 0, undefined, undefined, 140);
        ctx.restore();
    }

    // TODO: To complete
    function drawBackCard(x: number, y: number, ratio: number = 4) {

    }

    
    function initializeNewImage<T extends string>(object: Record<T, HTMLImageElement>, value: T, x: number, y: number, xOffset: number, yOffset: number, ratio: number = 4, wImage: number = 88, hImage: number = 124): void {

        ctx.drawImage(object[value], xOffset, yOffset, wImage, hImage, x, y, 21 * ratio, 31 * ratio);

        return;
    }


}

async function loadAllImage<T extends string>(objectImageLink: Record<T, string>): Promise<Record<T, HTMLImageElement>> {
    type TupleGenericImage = [T, HTMLImageElement];

    let promiseArray: Promise<TupleGenericImage>[] = [];

    // Necessary to assert with [T, string][], because key is always a string when initiated.
    // NOTE: We could do Object.keys() then objectImageLink[key] but I feel like it would be less efficient.
    for (const [key, value] of (Object.entries(objectImageLink) as [T, string][])) {
        const loadedImage = loadImage(key, value);
        promiseArray.push(loadedImage);
    }

    const resolvedArray = await Promise.all(promiseArray);
    let returnedObject = {} as Record<T, HTMLImageElement>;

    for (let i = 0;i < resolvedArray.length;i++) {
        const [key, value] = resolvedArray[i];
        Object.assign(returnedObject, { [key]: value });
    }

    return returnedObject;
    

    function loadImage(key: T, src: string): Promise<TupleGenericImage> {

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve([key, img]);
            img.onerror = () => reject(new Error(`Couldn't load the image: ${src}`))
            img.src = src
        })
    }
}


draw()

