import { BoundingBox, squareFit, GameBoard, ConcreteGrid, clockwise } from "gridBoxes";

const [canvas, context] = initCanvas();




const gameBoard: GameBoard = new GameBoard(squareFit(new BoundingBox(40,40,canvas.width - 80, canvas.height - 80)), 10, 10);
gameBoard.hoveredSquare = { row: 2, column: 2 };

gameBoard.draw(context);

document.onmousemove = (e) => {
    gameBoard.hover(e.clientX, e.clientY);
    context.clearRect(0,0,canvas.width,canvas.height);
    gameBoard.draw(context);
};

document.onkeydown = (e) => {
    console.log(e.key);
    if (e.key === " ") {
        gameBoard.aimDirection = clockwise(gameBoard.aimDirection);
    }
}

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

