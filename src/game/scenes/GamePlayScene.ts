import { ButtonDTO } from "../dto/ButtonDTO";
import Button from "../utilities/Button";
import { textStyle1 } from "../utilities/TextStyle";
import SoundManager from "../utilities/SoundManager";
import { Scene } from "phaser";

export default class GamePlayScene extends Scene {
    public soundManager: SoundManager | null;

    constructor() {
        super({ key: "GamePlayScene" });
        this.soundManager = null;
    }

    preload(): void {
        this.load.image("rocket", "assets/img/rocket.png");
        this.load.image("apple", "assets/img/apple.png");
        this.load.image("ship", "assets/img/ship.png");
        this.load.image("wall", "assets/img/wall.png");
        this.load.image("goal", "assets/img/earth.png");
        this.load.image("scorePowerUp", "assets/img/scorePowerUp.png");
        this.load.image("timePowerUp", "assets/img/timePowerUp.png");
        this.soundManager = new SoundManager(this, ["bgMusic"]);
        this.soundManager.preload();
        this.load.image("backgroundGame", "assets/img/bgGame.png");
        this.load.image("backgroundMenu", "assets/img/bgMenu.png");
    }

    create(): void {
        this.add
            .image(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                "backgroundMenu"
            )
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        this.soundManager?.play("bgMusic", true);
        this.add
            .text(this.cameras.main.centerX, 200, "Maze Game", textStyle1)
            .setOrigin(0.5);

        const startButtonDTO = new ButtonDTO(
            "startButton",
            "Start Game",
            this.cameras.main.centerX,
            600,
            () => {
                this.soundManager?.stop("bgMusic");
                this.scene.start("CharacterSelectionScene");
            }
        );

        new Button(this, startButtonDTO);
    }
}
