
initCanvas();

/**
 * Returns the given value `t` and asserts it is non-null.
 * If it is in fact null, throws `e` as an exception.
 * 
 * Might act strangely if `T` contains valid but falsey values.
 */
function expect<T>(t: T | null, e: any): T {
    if (!t) {
        throw e;
    } else {
        return t;
    }
}

function initCanvas() {
    const canvasHtml = document.getElementById("canvas");
    if (!canvasHtml) {
        throw "Canvas not found";
    }
    const canvas = <HTMLCanvasElement>canvasHtml;
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    
    const context = canvas.getContext("2d");
    context?.fillRect(10, 10, 50, 50);

}

