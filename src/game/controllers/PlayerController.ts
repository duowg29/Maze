import { PlayerDTO } from "../dto/PlayerDTO";
import Phaser from "phaser";

interface Direction {
    x: number;
    y: number;
}

export default class PlayerController {
    public scene: Phaser.Scene;
    public player: PlayerDTO;
    public playerSprite: Phaser.GameObjects.Sprite;
    public mazeArray: number[][];
    public currentDirection: Direction | null = null;
    public isMoving: boolean = false;
    public cellSize: number;

    constructor(
        scene: Phaser.Scene,
        playerDTO: PlayerDTO,
        playerSprite: Phaser.GameObjects.Sprite,
        mazeArray: number[][],
        cellSize: number
    ) {
        this.scene = scene;
        this.player = playerDTO;
        this.playerSprite = playerSprite;
        this.mazeArray = mazeArray;
        this.cellSize = cellSize;
    }

    handleKeyDown(event: KeyboardEvent) {
        if (this.isMoving) return;

        const key = event.keyCode;
        if (key === Phaser.Input.Keyboard.KeyCodes.LEFT) {
            this.currentDirection = { x: -1, y: 0 };
        } else if (key === Phaser.Input.Keyboard.KeyCodes.RIGHT) {
            this.currentDirection = { x: 1, y: 0 };
        } else if (key === Phaser.Input.Keyboard.KeyCodes.UP) {
            this.currentDirection = { x: 0, y: -1 };
        } else if (key === Phaser.Input.Keyboard.KeyCodes.DOWN) {
            this.currentDirection = { x: 0, y: 1 };
        }

        if (this.currentDirection && !this.isMoving) {
            this.movePlayer(this.currentDirection.x, this.currentDirection.y);
            this.isMoving = true;
        }
    }

    handleKeyUp(event: KeyboardEvent) {
        const key = event.keyCode;

        if (
            key >= Phaser.Input.Keyboard.KeyCodes.LEFT &&
            key <= Phaser.Input.Keyboard.KeyCodes.DOWN
        ) {
            this.isMoving = false;
        }
    }

    handlePointerDown(pointer: Phaser.Input.Pointer) {
        const screenWidth = this.scene.cameras.main.width;
        const screenHeight = this.scene.cameras.main.height;

        const centerX = screenWidth / 2;
        const centerY = screenHeight / 2;

        const touchX = pointer.x;
        const touchY = pointer.y;

        const deltaX = touchX - centerX;
        const deltaY = touchY - centerY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            this.currentDirection = { x: deltaX > 0 ? 1 : -1, y: 0 };
        } else {
            this.currentDirection = { x: 0, y: deltaY > 0 ? 1 : -1 };
        }
        if (this.currentDirection && !this.isMoving) {
            this.movePlayer(this.currentDirection.x, this.currentDirection.y);
        }
    }

    movePlayer(deltaX: number, deltaY: number) {
        const newX = this.player.positionX + deltaX;
        const newY = this.player.positionY + deltaY;

        if (
            newY >= 0 &&
            newY < this.mazeArray.length &&
            newX >= 0 &&
            newX < this.mazeArray[newY].length &&
            this.mazeArray[newY][newX]
        ) {
            this.player.positionX = newX;
            this.player.positionY = newY;
            this.playerSprite.setPosition(
                newX * this.cellSize,
                newY * this.cellSize
            );
            this.scene.events.emit("checkWin");
        }

        (this.scene as any).powerUps.collectPowerUp(this.player);
    }

    update() {}
}
