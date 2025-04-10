export class WallDTO {
    key: string;
    wallX: number;
    wallY: number;

    constructor(key: string, wallX: number, wallY: number) {
        this.key = key;
        this.wallX = wallX;
        this.wallY = wallY;
    }
}
