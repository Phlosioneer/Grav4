"use strict";
initCanvas();
function initCanvas() {
    var canvasHtml = document.getElementById("canvas");
    if (!canvasHtml) {
        throw "Canvas not found";
    }
    var canvas = canvasHtml;
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    var context = canvas.getContext("2d");
    context === null || context === void 0 ? void 0 : context.fillRect(10, 10, 50, 50);
}
//# sourceMappingURL=index.js.map