import { ButtonDTO } from "../dto/ButtonDTO";
import Button from "../utilities/Button";
import { textStyle1 } from "../utilities/TextStyle";
import SoundManager from "../utilities/SoundManager";
import BackgroundLoader from "../utilities/BackgroundLoader";
import { Scene } from "phaser";

export default class GamePlayScene extends Scene {
    public soundManager: SoundManager | null;

    constructor() {
        super({ key: "GamePlayScene" });
        this.soundManager = null;
    }

    preload(): void {
        this.soundManager = new SoundManager(this, ["bgMusic"]);
        this.soundManager.preload();

        this.load.image("bgMenu", "assets/img/bgMenu.png");
    }

    create(): void {
        const backgroundLoader = new BackgroundLoader(
            this,
            "bgMenu",
            this.cameras.main.centerX,
            this.cameras.main.centerY
        );
        backgroundLoader.loadBackground();

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
