
import { Achievement } from "./achievement";

export interface Game {
    gameId: number,
    name: string,
    cover: string,
    achievements: Achievement[]
}



