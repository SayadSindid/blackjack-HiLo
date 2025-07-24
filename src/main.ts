import './style.css'
import { shuffle, createDeck } from "./deck";
import { drawCard, drawBackCard, drawBackDeck } from "./drawingUtilities";
import { loadAllImage, linkSymbolImage, linkBackImage } from "./imagesLoading";
import type { Symbols , GameStateType } from "./definitions";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
// Asserting otherwise it persist to say it can be null.
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const drawButton = document.getElementById("drawButton");
const settleButton = document.getElementById("settleButton");


// Object with key/value as Symbols: HTMlImage.
export const loadedSymbolsImages = await loadAllImage<Symbols>(linkSymbolImage);
export const loadedBackImages = await loadAllImage<string>(linkBackImage);



// TODO: Implement a way to know which card have been picked, so they can't be re-picked.
// TODO: Shuffle the 54 card and then take them in order (Don't pick them randomly) (Probably initialize an array then take the last and pop).
// TODO: Minor: Add some styles to the board.
// TODO: Look into how to refresh the canvas when adding new drawing on the screen
// TODO: If Decksize < 10 remake a deck?
// TODO: Make face card count as 10.
// FIXME: Introduce/modify current state management in order to know what has been drawn.

export let gameState: GameStateType[] = [];
export let scorePlayer = 0;
export let scoreDealer = 0;


async function draw() {

    if (!canvas.getContext) {
        // TODO: Putting something if canvas is not supported.
    }

    if (!drawButton) throw new Error("Couldn't initialize draw Button")
    if (!settleButton) throw new Error("Couldn't initialize settle Button")
        

    let xCurrentPlayerCardPos = 475;
    let yCurrentPlayerCardPos = 375;


    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let deck = shuffle(createDeck());

    ctx.fillStyle = "rgb(200 0 0)";
    ctx.fillRect(25,25, 100, 100);
    ctx.clearRect(45, 45, 60, 60);
    ctx.strokeRect(50, 50, 50, 50)


    // Deck image
    drawBackDeck(800, 50);

    function startingState() {
        drawCard(deck, 450, 400, "player");
        drawCard(deck, 475, 375, "player");
    
        drawCard(deck, 512, 20, "dealer");
        // Overlapping a Card with a Back card
        drawCard(deck, 412, 20, "dealer");
        drawBackCard(412, 20)

    }

    startingState();

    drawButton.addEventListener("click", function () {
        xCurrentPlayerCardPos += 25;
        yCurrentPlayerCardPos -= 25;
        drawCard(deck, xCurrentPlayerCardPos, yCurrentPlayerCardPos, "player");
    })



    return;

}



// Vite stuff (don't know why but it's bugged);
if (import.meta.hot) {
    if (!import.meta.hot.data.initialized) {
        draw();
        import.meta.hot.data.initialized = true;
    }

    import.meta.hot.dispose(() => 
    draw())
} else {
    draw();
}
