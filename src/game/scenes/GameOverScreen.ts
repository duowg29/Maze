import { ButtonDTO } from "../dto/ButtonDTO";
import { textStyle1, textStyle2 } from "../utilities/TextStyle";
import { Scene } from "phaser";

export default class GameOverScreen extends Scene {
    public score: number;
    public selectedCharacter: any;

    constructor() {
        super({ key: "GameOverScreen" });
        this.score = 0;
        this.selectedCharacter = null;
    }

    init(data: { score: number; character: any }): void {
        this.score = data.score;
        this.selectedCharacter = data.character;
    }

    create(): void {
        this.add
            .image(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                "backgroundGame"
            )
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY - 20,
                `Game Over!`,
                textStyle1
            )
            .setOrigin(0.5);
        this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 20,
                `Score: ${this.score}`,
                textStyle2
            )
            .setOrigin(0.5);

        const exitButtonDTO = new ButtonDTO(
            "exitButton",
            "Replay",
            this.cameras.main.centerX,
            this.cameras.main.centerY + 100,
            () => {
                const currentHighScore = this.registry.get("highScore") || 0;
                this.registry.set(
                    "highScore",
                    Math.max(currentHighScore, this.score)
                );
                this.registry.set("score", 0);
                this.registry.set("rows", 12);
                this.registry.set("cols", 12);
                if (this.selectedCharacter) {
                    this.selectedCharacter.score = 0;
                }
                this.scene.start("GamePlayScene");
            }
        );

        const replayButton = this.add
            .text(
                exitButtonDTO.positionX,
                exitButtonDTO.positionY,
                exitButtonDTO.text,
                textStyle2
            )
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerdown", exitButtonDTO.onClick)
            .on("pointerover", function (this: Phaser.GameObjects.Text) {
                this.setStyle({ fill: "#ff0" });
            })
            .on("pointerout", function (this: Phaser.GameObjects.Text) {
                this.setStyle({ fill: "#f00" });
            });
    }
}
