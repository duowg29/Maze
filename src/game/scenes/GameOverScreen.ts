import { ButtonDTO } from '../dto/ButtonDTO';
import { textStyle1, textStyle2 } from '../utilities/TextStyle';
import { Scene } from 'phaser';
import BackgroundLoader from '../utilities/BackgroundLoader';

export default class GameOverScreen extends Scene {
    public score: number;
    public selectedCharacter: any;

    constructor() {
        super({ key: 'GameOverScreen' });
        this.score = 0;
        this.selectedCharacter = null;
    }

    init(data: { score: number; character: any }): void {
        this.score = data.score;
        this.selectedCharacter = data.character;
    }

    create(): void {
        this.load.image('bgGame', 'assets/img/bgGame.png');
        const backgroundLoader = new BackgroundLoader(this, 'bgGame', this.cameras.main.centerX, this.cameras.main.centerY);
        backgroundLoader.loadBackground();
        
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 20, `Game Over!`, textStyle1)
            .setOrigin(0.5);
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 20, `Score: ${this.score}`, textStyle2)
            .setOrigin(0.5);

        const exitButtonDTO = new ButtonDTO('exitButton', 'Exit', this.cameras.main.centerX, this.cameras.main.centerY + 80, () => {
            location.reload();
        });

        const exitButton = this.add.text(exitButtonDTO.positionX, exitButtonDTO.positionY, exitButtonDTO.text, textStyle2)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', exitButtonDTO.onClick)
            .on('pointerover', function (this: Phaser.GameObjects.Text) {
                this.setStyle({ fill: '#ff0' });
            })
            .on('pointerout', function (this: Phaser.GameObjects.Text) {
                this.setStyle({ fill: '#f00' });
            });
    }
}
