import './style.css'

// Yes it's dirty but the "proper" way is even more dirty.
export type CardNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type Symbols = "C" | "S" | "H" | "D";

// TODO: Implement a way to know which card have been picked, so they can't be re-picked.
// TODO: Shuffle the 54 card and then take them in order (Don't pick them randomly) (Probably initialize an array then take the last and pop).

// FIXME: So for the image, it's not possible to load all of them then get them fully loaded, I need to load them when I call draw() like with a callback

function draw() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    // Asserting otherwise it persist to say it can be null.
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D ;

    if (!canvas.getContext) {
        // TODO: Putting something if canvas is not supported.
    }

    const linkSymbolImage = {
        "C": "./assets/Cards/Clubs.png",
        "S": "./assets/Cards/Spades.png",
        "H": "./assets/Cards/Hearts.png",
        "D": "./assets/Cards/Diamond.png",
    }

    // FIXME: Doesn't work need to fix (see not above)
    async function loadAllImage(objectImageLink: { [key: string] : string} ) {
        
        const arrValueImageLink = Object.values(objectImageLink);


        let loadedImageObject: { [key: string]: any} = {};

        for (let i = 0;i < arrValueImageLink.length;i++) {
            const image = arrValueImageLink[i];
            const loadedImage = await loadImage(image);
            for (const [key, value] of Object.entries(objectImageLink)) {
                if (image === value) {
                    loadedImageObject[key] = loadedImage;
                }
            }
        }

        return loadedImageObject;

        async function loadImage(src: string) {

            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error(`Couldn't load the image: ${src}`))
                img.src = src
            })
    
        }

    }

    const loadedImageObject = loadAllImage(linkSymbolImage);


    ctx.fillStyle = "rgb(200 0 0)";
    ctx.fillRect(25,25, 100, 100);
    ctx.clearRect(45, 45, 60, 60);
    ctx.strokeRect(50, 50, 50, 50)

    drawCard("H", 9, 500, 300, 3);


    function drawCard(symbol: Symbols, num: CardNumber, x: number, y: number, ratio: number = 4) {
        // Card base = W: 84, H: 124
        // Greatest common factor is 21:31



        // -- MAIN LOGIC --
        createRoundedRectangle(x, y);
        const { xOffset, yOffset } = offsetCalculation(num);
        initializeNewImage(symbol, x, y, xOffset, yOffset);
        // -- MAIN LOGIC --

        function createRoundedRectangle(x: number, y: number) {
            const WidthCard = 21 * ratio;
            const HeightCard = 31 * ratio;
            const roundingCard = 10;

            ctx.beginPath();
            ctx.roundRect(x, y, WidthCard, HeightCard, roundingCard)
            ctx.clip();
            ctx.stroke();

            ctx.beginPath();
            ctx.roundRect(200, 300, WidthCard, HeightCard, roundingCard)
            ctx.clip();
            ctx.stroke();
        }

        function initializeNewImage(symbol: Symbols, x: number, y: number, xOffset: number, yOffset: number) {
            const img = new Image();

            img.src = linkImage[symbol];

            img.addEventListener("load", function () {
                ctx.drawImage(img, xOffset, yOffset, 88, 124, x, y, 21 * ratio, 31 * ratio);
            })

            return;
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

}

draw()

