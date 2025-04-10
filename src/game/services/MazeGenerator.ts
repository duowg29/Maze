import { WallDTO } from "../dto/WallDTO";
import { Scene } from "phaser";

export class MazeGenerator {
    static generateMaze(rows: number, cols: number): number[][] {
        const maze = new Array(rows + 2)
            .fill(0)
            .map(() => new Array(cols + 2).fill(false));

        const directions = [
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
        ];

        function isValid(x: number, y: number): boolean {
            return x > 0 && y > 0 && x < cols + 1 && y < rows + 1;
        }

        function shuffle(array: any[]): void {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        function carve(x: number, y: number): void {
            maze[y][x] = true;
            shuffle(directions);

            directions.forEach((dir) => {
                const newX = x + dir.x * 2;
                const newY = y + dir.y * 2;
                if (isValid(newX, newY) && !maze[newY][newX]) {
                    maze[y + dir.y][x + dir.x] = true;
                    carve(newX, newY);
                }
            });
        }

        for (let i = 0; i < cols + 2; i++) {
            maze[0][i] = false;
            maze[rows + 1][i] = false;
        }
        for (let i = 0; i < rows + 2; i++) {
            maze[i][0] = false;
            maze[i][cols + 1] = false;
        }

        carve(1, 1);

        for (let y = 1; y <= rows - 1; y++) {
            for (let x = 1; x <= cols - 1; x++) {
                if (
                    !maze[y][x] &&
                    !maze[y + 1][x] &&
                    !maze[y][x + 1] &&
                    !maze[y + 1][x + 1]
                ) {
                    const positions = [
                        { x, y },
                        { x: x + 1, y },
                        { x, y: y + 1 },
                        { x: x + 1, y: y + 1 },
                    ];
                    shuffle(positions);
                    maze[positions[0].y][positions[0].x] = true;
                    maze[positions[1].y][positions[1].x] = true;
                    maze[positions[2].y][positions[2].x] = true;
                }
            }
        }

        return maze;
    }

    static drawMaze(
        scene: Scene & { mazeArray: number[][]; cellSize: number }
    ): void {
        scene.children.list.forEach((child) => {
            if (child && child.name === "wall") {
                child.destroy();
            }
        });

        for (let y = 0; y < scene.mazeArray.length; y++) {
            for (let x = 0; x < scene.mazeArray[y].length; x++) {
                if (!scene.mazeArray[y][x]) {
                    const wall = new WallDTO("wall", x, y);
                    scene.add
                        .image(
                            wall.wallX * scene.cellSize,
                            wall.wallY * scene.cellSize,
                            "wall"
                        )
                        .setOrigin(0, 0)
                        .setDisplaySize(scene.cellSize, scene.cellSize)
                        .setName(wall.key);
                }
            }
        }
    }
}
