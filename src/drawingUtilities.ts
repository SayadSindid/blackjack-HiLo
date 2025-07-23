import { ctx } from "./main";

export function createRoundedRectangle(x: number, y: number, ratio: number = 4) {
    const WidthCard = 21 * ratio;
    const HeightCard = 31 * ratio;
    const roundingCard = 10;

    ctx.save()
    ctx.beginPath();
    ctx.roundRect(x, y, WidthCard, HeightCard, roundingCard)
    ctx.clip();
    ctx.stroke();


}
