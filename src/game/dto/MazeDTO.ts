export class MazeDTO {
    key: string;
    name: string;
    levelKey: string;
    goalX: number;
    goalY: number;
    duration: number;

    constructor(key: string, name: string, levelKey: string, goalX: number, goalY: number, duration: number) {
        this.key = key;
        this.name = name;
        this.levelKey = levelKey;
        this.goalX = goalX;
        this.goalY = goalY;
        this.duration = duration;
    }
}
