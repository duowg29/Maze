export class PlayerDTO {
    key: string;
    name: string;
    positionX: number;
    positionY: number;
    score: number;
    avatar: string;
    description: string;

    constructor(
        key: string,
        name: string,
        positionX: number,
        positionY: number,
        score: number,
        avatar: string,
        description: string
    ) {
        this.key = key;
        this.name = name;
        this.positionX = positionX;
        this.positionY = positionY;
        this.score = score;
        this.avatar = avatar;
        this.description = description;
    }
}
