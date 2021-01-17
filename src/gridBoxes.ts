export class BoundingBox {
    // X, Y are from the top-left of the canvas.
    x: number;
    y: number;
    // Width and height are always positive.
    width: number;
    height: number;
    
    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = Math.abs(width);
        this.height = Math.abs(height);
    }
}

export function squareFit(bbox: BoundingBox): BoundingBox {
    if (bbox.height > bbox.width) {
        return new BoundingBox(0, (bbox.height - bbox.width) / 2, bbox.width, bbox.width);
    } else {
        return new BoundingBox((bbox.width - bbox.height) / 2, 0, bbox.height, bbox.height);
    }
}


export function toGridCoords(bbox: BoundingBox,
    columns: number, rows: number, 
    pos: {x: number, y:number}): { column: number, row: number } {
        const columnWidth = bbox.width / columns;
        const rowHeight = bbox.height / rows;
        return { column: Math.floor(pos.x / columnWidth), row: Math.floor(pos.y / rowHeight) };
}