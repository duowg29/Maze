export default class Utils {

    getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    static getRandomPosition(maze: number[][]): { x: number, y: number } {
        let x: number, y: number;
        do {
            x = Math.floor(Math.random() * (maze[0].length - 2)) + 1;
            y = Math.floor(Math.random() * (maze.length - 2)) + 1;
        } while (!maze[y][x]);

        return { x, y };
    }
}
