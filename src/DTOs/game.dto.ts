


export class GameDTO {
    id: number;
    name: string;
    cover: string;
    achivements: Array<object>;

    constructor(id: number, name: string, cover: string, achievements: Array<object>) {
        this.id = id;
        this.name = name;
        this.cover = cover;
        this.achivements = achievements;
    }
}