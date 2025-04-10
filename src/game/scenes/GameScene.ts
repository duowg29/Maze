import { MazeGenerator } from "../services/MazeGenerator";
import { Timer } from "../utilities/Timer";
import { PlayerDTO } from "../dto/PlayerDTO";
import { PowerUp } from "../controllers/PowerUpManager";
import SoundManager from "../utilities/SoundManager";
import { textStyle2 } from "../utilities/TextStyle";
import { LevelDTO } from "../dto/LevelDTO";
import PlayerController from "../controllers/PlayerController";
import Utils from "../utilities/Utils";
import { Scene } from "phaser";

export default class GameScene extends Scene {
    public cellSize: number = 0;
    public player: PlayerDTO | null = null;
    public mazeArray: number[][] = [];
    public score: number = 0;
    public highScore: number = 0;
    public highScoreText: Phaser.GameObjects.Text | null = null;
    public scoreText: Phaser.GameObjects.Text | null = null;
    public soundManager: SoundManager | null = null;
    public isSpacePressed: boolean = false;
    public currentDirection: any = null;
    public level: LevelDTO = new LevelDTO("Level", 12, 12);
    public maxLevelSize: number = 18;
    public firstLevel: boolean = true;
    public gameOver: boolean = false;
    public selectedCharacter: any;
    public goal: Phaser.GameObjects.Image | null = null;
    public playerSprite: Phaser.GameObjects.Sprite | null = null;
    public timer: Timer | null = null;
    public playerController: PlayerController | null = null;
    public tipsText: Phaser.GameObjects.Text | null = null;
    public powerUps: PowerUp | null = null;

    constructor() {
        super({ key: "GameScene" });
    }

    init(data: { character: any }): void {
        this.selectedCharacter = data.character;
        this.score = this.registry.get("score") || 0;
        this.level.rows = this.registry.get("rows") || 12;
        this.level.cols = this.registry.get("cols") || 12;
        this.highScore = this.registry.get("highScore") || 0;
        if (!this.selectedCharacter) {
            console.error(
                "selectedCharacter is undefined. Make sure it is passed correctly from the previous scene."
            );
        }
    }

    preload(): void {
        this.soundManager = new SoundManager(this, ["gameMusic", "scoreSound"]);
        this.soundManager.preload();
    }

    create(): void {
        this.add
            .image(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                "backgroundGame"
            )
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        this.events.on("checkWin", this.checkWin, this);
        this.scoreText = this.add.text(
            50,
            650,
            `Score: ${this.score}`,
            textStyle2
        );
        this.highScoreText = this.add.text(
            350,
            650,
            `Highest Score: ${this.highScore}`,
            textStyle2
        );

        if (this.soundManager && !this.soundManager.isPlaying("gameMusic")) {
            this.soundManager.play("gameMusic", true);
        }

        this.timer = new Timer(this, 15, this.endGame.bind(this));
        this.timer.start();

        if (this.input.keyboard) {
            this.input.keyboard.on("keydown", (event: KeyboardEvent) => {
                if (
                    event.keyCode >= Phaser.Input.Keyboard.KeyCodes.LEFT &&
                    event.keyCode <= Phaser.Input.Keyboard.KeyCodes.DOWN
                ) {
                    event.preventDefault();
                }
            });
        }

        this.createNewLevel();

        if (this.player) {
            this.playerController = new PlayerController(
                this,
                this.player,
                this.playerSprite ??
                    new Phaser.GameObjects.Sprite(this, 0, 0, "defaultSprite"),
                this.mazeArray,
                this.cellSize
            );
        }

        if (this.input.keyboard) {
            if (this.playerController) {
                this.input.keyboard.on(
                    "keydown",
                    this.playerController.handleKeyDown.bind(
                        this.playerController
                    )
                );
                this.input.keyboard.on(
                    "keyup",
                    this.playerController.handleKeyUp.bind(
                        this.playerController
                    )
                );
            }
        }

        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            this.playerController?.handlePointerDown(pointer);
        });
        this.events.on("shutdown", this.onShutdown, this);
    }

    update(): void {
        if (this.gameOver) return;
        this.playerController?.update();
        this.checkWin();
    }

    checkWin(): void {
        if (this.playerSprite && this.goal) {
            const boundsPlayer = this.playerSprite.getBounds();
            const boundsGoal = this.goal.getBounds();

            const shrinkFactor = 0.6;
            const playerHitbox = new Phaser.Geom.Rectangle(
                boundsPlayer.x + (boundsPlayer.width * (1 - shrinkFactor)) / 2,
                boundsPlayer.y + (boundsPlayer.height * (1 - shrinkFactor)) / 2,
                boundsPlayer.width * shrinkFactor,
                boundsPlayer.height * shrinkFactor
            );
            const goalHitbox = new Phaser.Geom.Rectangle(
                boundsGoal.x + (boundsGoal.width * (1 - shrinkFactor)) / 2,
                boundsGoal.y + (boundsGoal.height * (1 - shrinkFactor)) / 2,
                boundsGoal.width * shrinkFactor,
                boundsGoal.height * shrinkFactor
            );

            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    playerHitbox,
                    goalHitbox
                )
            ) {
                this.updateScore(1);
                this.soundManager?.play("scoreSound", false);
                this.resetGame();
            }
        }
    }
    updateCellSize(): void {
        const canvas = this.game.scale.canvas;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const smallerDimension = Math.min(canvasWidth, canvasHeight);
        this.cellSize =
            smallerDimension /
            Math.max(this.level.cols + 2, this.level.rows + 2);

        console.log(this.game.scale.canvas.width);
        console.log(this.game.scale.canvas.height);

        console.log("Canvas Width:", canvasWidth);
        console.log("Canvas Height:", canvasHeight);
        console.log("Cell Size:", this.cellSize);
        console.log("Total Width:", this.cellSize * this.level.cols);
    }

    updateScore(points: number): void {
        this.score += points;
        this.registry.set("score", this.score);
        if (this.player) {
            this.player.score = this.score;
        }
        this.scoreText?.setText(`Score: ${this.score}`);
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreText?.setText(`High Score: ${this.highScore}`);
            this.registry.set("highScore", this.highScore);
        }
    }

    createNewLevel(): void {
        this.updateCellSize();

        this.mazeArray = MazeGenerator.generateMaze(
            this.level.rows,
            this.level.cols
        );
        MazeGenerator.drawMaze(this);

        const playerPos = Utils.getRandomPosition(this.mazeArray);
        const goalPos = Utils.getRandomPosition(this.mazeArray);

        this.goal = this.add
            .image(goalPos.x * this.cellSize, goalPos.y * this.cellSize, "goal")
            .setOrigin(0, 0)
            .setDisplaySize(this.cellSize, this.cellSize);

        this.player = new PlayerDTO(
            "player",
            this.selectedCharacter.name,
            playerPos.x,
            playerPos.y,
            this.score,
            this.selectedCharacter.avatar,
            this.selectedCharacter.description
        );
        this.playerSprite = this.add
            .sprite(
                this.player.positionX * this.cellSize,
                this.player.positionY * this.cellSize,
                this.selectedCharacter.avatar
            )
            .setOrigin(0, 0)
            .setDisplaySize(this.cellSize, this.cellSize);

        this.powerUps = new PowerUp(this, this.mazeArray, this.cellSize);
        this.powerUps.timer = this.timer;
    }

    resetGame(): void {
        this.updateCellSize();

        this.timer?.reset(15);
        this.scene.restart({ character: this.selectedCharacter });

        this.children.list.forEach((child) => {
            if (child && child.name === "wall") {
                child.destroy();
            }
        });

        this.checkLevelUp();
        if (this.player) {
            this.powerUps?.collectPowerUp(this.player);
        }
        this.powerUps?.activePowerUps.forEach((powerUp) => {
            if (powerUp && powerUp.sprite) {
                powerUp.sprite.destroy();
            }
        });
        if (this.powerUps) {
            this.powerUps.activePowerUps = [];
        }
        this.mazeArray = MazeGenerator.generateMaze(10, 10);

        const playerPos = Utils.getRandomPosition(this.mazeArray);
        const goalPos = Utils.getRandomPosition(this.mazeArray);

        if (this.player) {
            this.player.positionX = playerPos.x;
            this.player.positionY = playerPos.y;
            this.playerSprite?.setPosition(
                this.player.positionX * this.cellSize,
                this.player.positionY * this.cellSize
            );
        }

        this.goal?.destroy();
        this.goal = this.add
            .image(goalPos.x * this.cellSize, goalPos.y * this.cellSize, "goal")
            .setOrigin(0, 0)
            .setDisplaySize(this.cellSize, this.cellSize);
        this.powerUps = new PowerUp(this, this.mazeArray, this.cellSize);
        this.powerUps.timer = this.timer;
    }

    checkLevelUp(): void {
        if (
            this.level.cols < this.maxLevelSize &&
            this.level.rows < this.maxLevelSize
        ) {
            this.level.cols += 2;
            this.level.rows += 2;
            this.registry.set("rows", this.level.rows);
            this.registry.set("cols", this.level.cols);
        }
        console.log(this.level.cols);
        console.log(this.level.rows);

        this.createNewLevel();
    }

    endGame(): void {
        this.gameOver = true;
        if (this.soundManager) {
            this.soundManager.stop("gameMusic");
            console.log("Stopping gameMusic via SoundManager");
        }
        this.sound.stopAll();
        this.timer?.stop();
        this.scene.start("GameOverScreen", {
            score: this.score,
            character: this.selectedCharacter,
        });
    }
    onShutdown(): void {
        if (this.soundManager) {
            this.soundManager.stop("gameMusic");
            console.log("Stopping gameMusic on shutdown");
        }
        this.sound.stopAll();
        console.log("Stopping all sounds on shutdown");
    }
}
