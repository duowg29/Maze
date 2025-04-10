import { PowerUpDTO } from "../dto/PowerUpDTO";
import Phaser from "phaser";
import Utils from "../utilities/Utils";
import { PlayerDTO } from "../dto/PlayerDTO";
import { Timer } from "../utilities/Timer";

interface PowerUpObject {
    sprite: Phaser.GameObjects.Image;
    powerUp: PowerUpDTO;
    position: { x: number; y: number };
}

export class PowerUp {
    public cellSize: number;
    public scene: Phaser.Scene;
    public mazeArray: number[][];
    public powerUps: PowerUpDTO[];
    public activePowerUps: PowerUpObject[];
    public timer: Timer | null = null;
    constructor(scene: Phaser.Scene, mazeArray: number[][], cellSize: number) {
        this.scene = scene;
        this.mazeArray = mazeArray;
        this.cellSize = cellSize;

        this.powerUps = [
            new PowerUpDTO(
                "scorePowerUp",
                "Score PowerUp",
                this.increaseScore.bind(this),
                1
            ),
            new PowerUpDTO(
                "timePowerUp",
                "Time PowerUp",
                this.increaseTime.bind(this),
                10
            ),
        ];

        this.activePowerUps = [];
        this.generateRandomPowerUps();
    }

    generateRandomPowerUps() {
        const usedPositions = new Set<string>();

        for (let i = 0; i < 2; i++) {
            let randomPos;

            do {
                randomPos = Utils.getRandomPosition(this.mazeArray);
            } while (
                usedPositions.has(`${randomPos.x},${randomPos.y}`) ||
                this.mazeArray[randomPos.y][randomPos.x] === 1
            );

            usedPositions.add(`${randomPos.x},${randomPos.y}`);

            const powerUpType =
                this.powerUps[Math.floor(Math.random() * this.powerUps.length)];
            const powerUpSprite = this.scene.add
                .image(
                    randomPos.x * this.cellSize,
                    randomPos.y * this.cellSize,
                    powerUpType.key
                )
                .setOrigin(0, 0)
                .setDisplaySize(this.cellSize, this.cellSize);

            this.activePowerUps.push({
                sprite: powerUpSprite,
                powerUp: powerUpType,
                position: randomPos,
            });
        }
    }

    collectPowerUp(player: PlayerDTO) {
        this.activePowerUps.forEach((powerUpObj, index) => {
            if (
                player.positionX === powerUpObj.position.x &&
                player.positionY === powerUpObj.position.y
            ) {
                powerUpObj.powerUp.effect.call(this.scene);
                powerUpObj.sprite.destroy();
                this.activePowerUps.splice(index, 1);
            }
        });
    }

    private increaseScore() {
        (this.scene as any).updateScore(1);
    }

    public increaseTime() {
        if ((this.scene as any).timer) {
            (this.scene as any).timer.addTime(10);
        }
    }
}
