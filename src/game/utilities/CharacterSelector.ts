import { PlayerDTO } from '../dto/PlayerDTO';
import { ButtonDTO } from '../dto/ButtonDTO';
import { textStyle2 } from './TextStyle';

export default class CharacterSelector {
    scene: Phaser.Scene;
    characters: PlayerDTO[];
    selectedCharacter: PlayerDTO | null;
    selectedButton: Phaser.GameObjects.Text | null;
    selectedCharacterImage: Phaser.GameObjects.Image | null;
    characterDescriptionText: Phaser.GameObjects.Text | null;

    constructor(scene: Phaser.Scene, characters: PlayerDTO[]) {
        this.scene = scene;
        this.characters = characters;
        this.selectedCharacter = null;
        this.selectedButton = null;
        this.selectedCharacterImage = null;
        this.characterDescriptionText = null;
    }

    createCharacterButtons() {
        this.characters.forEach((character, index) => {
            const x = this.scene.cameras.main.centerX - 150 + (index * 150);
            const y = this.scene.cameras.main.centerY - 70;

            const characterImage = this.scene.add.image(x, y, character.avatar)
                .setOrigin(0.5)
                .setDisplaySize(100, 100)
                .setInteractive();

            const characterButtonDTO = new ButtonDTO(`characterButton${index}`, character.name, x, y + 100, () => {
                this.handleCharacterSelect(character, characterButton);
            });

            const characterButton = this.scene.add.text(characterButtonDTO.positionX, characterButtonDTO.positionY, characterButtonDTO.text, textStyle2)
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', characterButtonDTO.onClick);

            characterButton.on('pointerover', () => characterButton.setStyle({ fill: '#ff0' }));
            characterButton.on('pointerout', () => {
                if (characterButton !== this.selectedButton) {
                    characterButton.setStyle({ fill: '#fff' });
                }
            });
        });
    }

    handleCharacterSelect(character: PlayerDTO, characterButton: Phaser.GameObjects.Text) {
        if (this.selectedButton) {
            this.selectedButton.setStyle({ fill: '#fff' });
        }

        this.selectedButton = characterButton;
        this.selectedCharacter = character;

        this.selectedButton.setStyle({ fill: '#ff0' });

        if (this.selectedCharacterImage) {
            this.selectedCharacterImage.destroy();
        }
        if (this.characterDescriptionText) {
            this.characterDescriptionText.destroy();
        }

        this.selectedCharacterImage = this.scene.add.image(this.scene.cameras.main.centerX, 470, character.avatar)
            .setOrigin(0.5)
            .setDisplaySize(100, 100);

        this.characterDescriptionText = this.scene.add.text(this.scene.cameras.main.centerX, 550, character.description, textStyle2)
            .setOrigin(0.5);
    }

    getSelectedCharacter(): PlayerDTO | null {
        return this.selectedCharacter;
    }
}
