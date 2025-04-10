export class LevelDTO {
    key: string;
    cols: number;
    rows: number;

    constructor(key: string, cols: number, rows: number) {
        this.key = key;
        this.cols = cols;
        this.rows = rows;
    }
}
