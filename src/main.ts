import './style.css'
import { shuffle, createDeck } from "./deck";
import { drawCard, drawBackCard, drawBackDeck } from "./drawingUtilities";
import { loadAllImage, linkSymbolImage, linkBackImage } from "./imagesLoading";
import type { Symbols , GameStateType } from "./definitions";
import { cardCounting, updateVisualScore } from "./gameState";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
// Asserting otherwise it persist to say it can be null.
// FIXME: Find a solution for this.
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

export const scoreDealerVisual = document.getElementById("scoreDealer") as HTMLSpanElement;
export const scorePlayerVisual = document.getElementById("scorePlayer")  as HTMLSpanElement;

export const globalScorePlayer = document.getElementById("scorePlayerGlobal") as HTMLSpanElement;
export const globalScoreDealer = document.getElementById("scoreDealerGlobal") as HTMLSpanElement;


const drawButton = document.getElementById("drawButton") as HTMLButtonElement;
const settleButton = document.getElementById("settleButton") as HTMLButtonElement;
const winner = document.getElementById("winner") as HTMLLabelElement;

// Object with key/value as Symbols: HTMlImage.
export const loadedSymbolsImages = await loadAllImage<Symbols>(linkSymbolImage);
export const loadedBackImages = await loadAllImage<string>(linkBackImage);

// TODO: Minor: Add some styles to the board.
// TODO: Add an option to not see the face down card of the dealer.

export let counting = {
    counter: 0,
}
export let gameState: GameStateType[] = [];

let deck = shuffle(createDeck());
console.log(deck)

export let score = {
    dealer: 0,
    player: 0,
}

let numberOfHandPlayed: number = 0;

async function draw() {

    if (!canvas.getContext) {
        // TODO: Putting something if canvas is not supported.
    }

    let xCurrentPlayerCardPos = 475;
    let yCurrentPlayerCardPos = 375;
    let xCurrentDealerCardPos = 412;
    let yCurrentDealerCardPos = 20;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    drawButton.addEventListener("click", await playerDrawCard)

    async function playerDrawCard(): Promise<(this: HTMLButtonElement, ev: MouseEvent) => any> {
        xCurrentPlayerCardPos += 25;
        yCurrentPlayerCardPos -= 25;
        drawCard(deck, xCurrentPlayerCardPos, yCurrentPlayerCardPos, "player");
        if (score.player > 21) {
            winner.innerText = "dealer";
            updateVisualScore("dealer", "global")
            await cleanState();
        }
        return () => {};
    }

    settleButton.addEventListener("click", await playerSettle)

    async function playerSettle() {
        drawButton.disabled = true;
        if (!gameState.some(value => value.cardType === "back")) {
            console.log("gg")
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackDeck(800, 50);
        const tempGameState = gameState;
        gameState = [];
        for (let i = 0;i < tempGameState.length;i++) {
            const card = tempGameState[i];
            if (card.cardType === "back") {
                continue;
            }
            drawCard(deck, card.xPos, card.yPos, card.cardType, card.ratio, true, card.symbol, card.cardNumber)
        }

        const finalScore = await makeDealerPlay();
        winner.innerText = finalScore;
        updateVisualScore(finalScore, "global");
        await cleanState();
    }
    
    async function makeDealerPlay(): Promise<"dealer" | "player" | "tie"> {
        
        return new Promise(function(resolve) {
            if (score.dealer < 17 ) {
                const dealerPlaying = setInterval(function () {
                    if (score.dealer >= 17) {
                        clearInterval(dealerPlaying);
                        resolve(compareScore());
                    } else {
                        xCurrentDealerCardPos -= 100;
                        drawCard(deck, xCurrentDealerCardPos, yCurrentDealerCardPos, "dealer");
                    }
                }, 1500)
            } else {
                return resolve(compareScore());
            }
        })

        

        function compareScore(): "dealer" | "player" | "tie" {
            if (score.dealer > score.player && score.dealer <= 21) {
                return "dealer";
            } else if (score.dealer < score.player && score.player <= 21) {
                return "player";
            } else if (score.dealer > 21) {
                return "player";
            } else if (score.player > 21) {
                return "dealer";
            } else {
                return "tie";
            }
        }

    }

    async function cleanState() {
        // Prevent the player to mess with the game
        drawButton.disabled = true;
        settleButton.disabled = true;
        await wait(3000);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Shuffle every 6 hand played.
        if (numberOfHandPlayed >= 6) {
            deck = shuffle(createDeck());
            numberOfHandPlayed = 0;
            counting.counter = 0;
            cardCounting(8);
        } else {
            numberOfHandPlayed++;
        }
        gameState = [];
        score.player = 0;
        score.dealer = 0;
        scoreDealerVisual.innerText = "";
        scorePlayerVisual.innerText = "";
        winner.innerText = "";
        drawButton.disabled = false;
        settleButton.disabled = false;
        drawButton.removeEventListener("click", await playerDrawCard);
        settleButton.removeEventListener("click", await playerSettle);
        draw();
        return;
    }
    

    return;

}

function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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