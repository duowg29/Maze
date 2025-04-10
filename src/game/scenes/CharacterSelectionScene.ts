import { ButtonDTO } from "../dto/ButtonDTO";
import Button from "../utilities/Button";
import BackgroundLoader from "../utilities/BackgroundLoader";
import SoundManager from "../utilities/SoundManager";
import CharacterSelector from "../utilities/CharacterSelector";
import { textStyle2 } from "../utilities/TextStyle";
import { PlayerDTO } from "../dto/PlayerDTO";
import { Scene } from "phaser";

export default class CharacterSelectionScene extends Scene {
    public characterSelector: CharacterSelector | null = null;
    public backgroundLoader: BackgroundLoader | null = null;
    public soundManager: SoundManager | null = null;

    constructor() {
        super({ key: "CharacterSelectionScene" });
    }

    preload(): void {
        this.load.image("rocket", "assets/img/rocket.png");
        this.load.image("apple", "assets/img/apple.png");
        this.load.image("ship", "assets/img/ship.png");
        this.load.image("bgMenu", "assets/img/bgMenu.png");

        this.soundManager = new SoundManager(this, ["bgMusic"]);
        this.soundManager.preload();
    }

    create(): void {
        this.backgroundLoader = new BackgroundLoader(
            this,
            "bgMenu",
            this.cameras.main.centerX,
            this.cameras.main.centerY
        );
        this.backgroundLoader.loadBackground();

        if (this.soundManager) {
            this.soundManager.play("bgMusic", true);
        }

        this.add
            .text(
                this.cameras.main.centerX,
                200,
                "Pick your player",
                textStyle2
            )
            .setOrigin(0.5);

        const characters = [
            new PlayerDTO(
                "rocket",
                "Rocket",
                100,
                200,
                0,
                "rocket",
                "A fast-moving rocket"
            ),
            new PlayerDTO(
                "apple",
                "Apple",
                150,
                200,
                0,
                "apple",
                "A healthy apple"
            ),
            new PlayerDTO("ship", "Ship", 200, 200, 0, "ship", "A strong ship"),
        ];

        this.characterSelector = new CharacterSelector(this, characters);
        this.characterSelector.createCharacterButtons();

        const startButtonDTO = new ButtonDTO(
            "startButton",
            "Start Game",
            this.cameras.main.centerX,
            600,
            () => {
                let selectedCharacter =
                    this.characterSelector?.getSelectedCharacter();

                if (!selectedCharacter) {
                    selectedCharacter = characters.find(
                        (character) => character.key === "rocket"
                    )!;
                }

                this.soundManager?.stop("bgMusic");
                this.scene.start("GameScene", { character: selectedCharacter });
            }
        );

        new Button(this, startButtonDTO);
    }
}
