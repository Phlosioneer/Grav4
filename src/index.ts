import { BoundingBox, squareFit } from "gridBoxes";

const [canvas, context] = initCanvas();






drawGrid(squareFit(new BoundingBox(20,20,canvas.width - 40, canvas.height - 40)), 10, 10);



/**
 * Returns the given value `t` and asserts it is non-null.
 * If it is in fact null, throws `e` as an exception.
 */
function expect<T>(t: T | null, error?: Error | string | null, context?: object | null): asserts t is T {
    if (t === null || t === undefined) {
        var e: any;
        if (typeof error === "string") {
            e = new Error(error);
        } else if (error && error instanceof Error) {
            e = error;
        } else {
            e = new Error("Expected non-null value");
        }
        if (context) {
            // Approximation to Object.assign
            Object.keys(context).forEach(key => e[key] = (<any>context)[key]);
        }
        throw e;
    }
}

function drawGrid(bounds: BoundingBox, columns: number, rows: number) {
    const columnWidth = bounds.width / columns;
    const rowHeight = bounds.height / rows;
    for (let xIndex = 0; xIndex <= columns; xIndex++) {
        context.beginPath();
        context.moveTo(bounds.x + xIndex * columnWidth, bounds.y);
        context.lineTo(bounds.x + xIndex * columnWidth, bounds.y + bounds.height);
        context.stroke();
    }

    for (let yIndex = 0; yIndex <= rows; yIndex++) {
        context.beginPath();
        context.moveTo(bounds.x, bounds.y + yIndex * rowHeight);
        context.lineTo(bounds.x + bounds.width, bounds.y + yIndex * rowHeight);
        context.stroke();
    }
}

function initCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
    
    const canvasHtml = document.getElementById("canvas");
    expect(canvasHtml, "Canvas not found");
    const canvas = <HTMLCanvasElement>canvasHtml;
    
    resizeCanvas(canvas);
    const context = canvas.getContext("2d");
    expect(context, "2d context unavailable");
    
    window.onresize = () => resizeCanvas(canvas);
    return [canvas, context];
}

function resizeCanvas(canvas: HTMLCanvasElement) {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
}

