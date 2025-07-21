import './style.css'



function draw() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    // Asserting otherwise it persist to say it can be null.
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D ;

    if (!canvas.getContext) {
        // TODO: Putting something if canvas is not supported.
    }

    ctx.fillStyle = "rgb(200 0 0)";
    ctx.fillRect(10,10, 50, 50);

    ctx.fillStyle = "rgb(0 0 200 / 50%)";
    ctx.fillRect(30, 30, 50, 50);
    



}

draw()

