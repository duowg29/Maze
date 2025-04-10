export class PowerUpDTO {
    key: string;
    name: string;
    effect: () => void;
    duration: number;

    constructor(key: string, name: string, effect: () => void, duration: number) {
        this.key = key;
        this.name = name;
        this.effect = effect;
        this.duration = duration;
    }
}
