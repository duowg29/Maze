import { textStyle2 } from "../utilities/TextStyle";

export class Timer {
    scene: Phaser.Scene;
    timeInSeconds: number;
    remainingTime: number;
    onComplete: () => void;
    timerText: Phaser.GameObjects.Text;
    timerEvent: Phaser.Time.TimerEvent | null;

    constructor(
        scene: Phaser.Scene,
        timeInSeconds: number,
        onComplete: () => void
    ) {
        this.scene = scene;
        this.timeInSeconds = timeInSeconds;
        this.remainingTime = timeInSeconds;
        this.onComplete = onComplete;
        this.timerText = this.scene.add.text(
            50,
            620,
            `Time: ${this.remainingTime}`,
            textStyle2
        );
        this.timerEvent = null;
    }

    start() {
        this.timerEvent = this.scene.time.addEvent({
            delay: 1500,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true,
        });
    }

    updateTimer() {
        this.remainingTime -= 1;
        this.timerText.setText(`Time: ${this.remainingTime}`);
        if (this.remainingTime <= 0) {
            this.timerEvent?.remove(false);
            this.onComplete();
        }
    }

    reset(newTimeInSeconds?: number) {
        this.remainingTime = newTimeInSeconds ?? this.timeInSeconds;
        this.timerText.setText(`Time: ${this.remainingTime}`);
    }

    stop() {
        this.timerEvent?.remove(false);
    }

    addTime(seconds: number) {
        this.remainingTime += seconds;
        this.timerText.setText(`Time: ${this.remainingTime}`);
    }
}
