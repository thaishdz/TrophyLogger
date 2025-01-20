
import { AchievementPlayerData } from "./achievement";

export interface GameAchievementsInfo {
    gameId: number,
    name: string,
    cover: string,
    totalLocked: number,
    achievements: AchievementsLockedData[]
}



