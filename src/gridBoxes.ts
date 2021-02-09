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


    top(): number { return this.y; }
    bottom(): number { return this.y + this.height; }
    left(): number { return this.x; }
    right(): number {return this.x + this.width; }

    fromCorners(x1: number, y1: number, x2: number, y2: number): BoundingBox {
        return new BoundingBox(x1, y1, x2 - x1, y2 - y1);
    }

    yankBy(d: Direction, dist: number) {
        switch (d) {
            case Direction.Down:
                this.height += dist;
                break;
            case Direction.Up:
                this.height += dist;
                this.y -= dist;
                break;
            case Direction.Left:
                this.width += dist;
                this.x -= dist;
                break;
            case Direction.Right:
                this.width += dist;
                break;
        }
    }

    shrink(dist: number) {
        this.x += dist;
        this.y += dist;
        this.width -= 2 * dist;
        this.height -= 2 * dist;
    }
}

export class ConcreteGrid {
    bounds: BoundingBox;
    rows: number;
    columns: number;
    
    constructor(bbox: BoundingBox, rows: number, columns: number) {
        this.bounds = bbox;
        this.rows = Math.abs(Math.round(rows));
        this.columns = Math.abs(Math.round(columns));
    }

    columnWidth(): number {
        return this.bounds.width / this.columns;
    }

    rowHeight(): number {
        return this.bounds.height / this.rows;
    }

    toGridCoords(x: number, y: number): {column: number, row: number} {
        return { column: Math.floor((x - this.bounds.x) / this.columnWidth()),
                 row: Math.floor((y - this.bounds.y) / this.rowHeight()) };
    }

    toGridIndex(x: number, y: number): GridIndex | null {
        let gi = this.toGridCoords(x,y);
        if (gi.row < 0 || gi.row >= this.rows || gi.column < 0 || gi.column >= this.columns) {
            return null;
        } else {
            return gi;
        }
    }

    fromGridIndex(i: GridIndex): BoundingBox {
        let l = this.bounds.left();
        let u = this.bounds.top();
        let w = this.columnWidth();
        let h = this.rowHeight();
        return new BoundingBox(l + i.column * w, u + i.row * h, w, h);
    }

    draw(context: CanvasRenderingContext2D) {
        for (let xIndex = 0; xIndex <= this.columns; xIndex++) {
            context.beginPath();
            context.moveTo(this.bounds.x + xIndex * this.columnWidth(), this.bounds.top());
            context.lineTo(this.bounds.x + xIndex * this.columnWidth(), this.bounds.bottom());
            context.stroke();
        }
    
        for (let yIndex = 0; yIndex <= this.columns; yIndex++) {
            context.beginPath();
            context.moveTo(this.bounds.left(), this.bounds.y + yIndex * this.rowHeight());
            context.lineTo(this.bounds.right(), this.bounds.y + yIndex * this.rowHeight());
            context.stroke();
        }
    }
}

export enum Tile {
    Empty,
    P1,
    P2,
    Solid,
}

export interface GridIndex {
    row: number,
    column: number,
}

export enum Player {
    P1, P2,
}

export enum Direction {
    Up, Down, Left, Right,
}

export function opposite(d: Direction): Direction {
    switch (d) {
        case Direction.Up:
            return Direction.Down;
        case Direction.Down:
            return Direction.Up;
        case Direction.Left:
            return Direction.Right;
        case Direction.Right:
            return Direction.Left;
    }
}

export function clockwise(d: Direction): Direction {
    switch (d) {
        case Direction.Up:
            return Direction.Right;
        case Direction.Down:
            return Direction.Left;
        case Direction.Left:
            return Direction.Up;
        case Direction.Right:
            return Direction.Down;
    }
}

export class GameBoard {
    grid: ConcreteGrid;
    tiles: Tile[][];
    hoveredSquare: GridIndex | null;

    currentPlayer: Player = Player.P1;
    aimDirection: Direction = Direction.Down;

    constructor(bbox: BoundingBox, rows: number, columns: number) {
        this.grid = new ConcreteGrid(bbox, rows, columns);
        this.tiles = new Array(rows);
        for (let row in this.tiles) {
            let r = new Array(columns);
            for (let col in r) {
                r[col] = Tile.Empty;
            }
            this.tiles[row] = r;
        }
        this.hoveredSquare = null;
    }

    hover(x: number, y: number) {
        this.hoveredSquare = this.grid.toGridIndex(x,y);
    }

    draw(context: CanvasRenderingContext2D) {
        if (this.hoveredSquare) {
            context.fillStyle = "rgba(0,0,0,0.2)";
            let r = this.grid.fromGridIndex(this.hoveredSquare);
            r.shrink(10);
            context.fillRect(r.x, r.y, r.width, r.height);
            let j = 0;
            switch (this.aimDirection) {
                case Direction.Up:
                    j = r.bottom() - this.grid.bounds.bottom();
                    break;
                case Direction.Down:
                    j =  r.top() - this.grid.bounds.top();
                    break;
                case Direction.Left:
                    j = r.right() - this.grid.bounds.right();
                    break;
                case Direction.Right:
                    j = r.left() - this.grid.bounds.left();
                    break;
            }
            r.yankBy(opposite(this.aimDirection), Math.abs(j));
            context.fillStyle = "rgba(0%,80%,60%,0.5)";
            context.fillRect(r.x, r.y, r.width, r.height);
        }

        this.grid.draw(context);
    }
}

export function squareFit(bbox: BoundingBox): BoundingBox {
    if (bbox.height > bbox.width) {
        return new BoundingBox(bbox.x, (bbox.height - bbox.width) / 2, bbox.width, bbox.width);
    } else {
        return new BoundingBox((bbox.width - bbox.height) / 2, bbox.y, bbox.height, bbox.height);
    }
}
