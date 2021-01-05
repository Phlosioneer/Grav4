
initCanvas();

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

