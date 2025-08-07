
// I know ... this is a mess ...


export interface AchievementPlayerData {
    gameName: string,
    totalGameAchievements: number,
    achievements: AchievementsLockedData[]
}

export interface AchievementsLockedData extends AchievementDetails {
    achieved: 0 | 1;
}

export interface AchievementDetails {
    name: string;
    value: string;
    description: string;
    icon: string;
}


export interface AchievementDetailsResponse {
    name: string,
    defaultvalue: number, // solo he visto que setean a 0 pero vete a saber si no es un boolean
    displayName: string,
    hidden: 0 | 1,
    description: string,
    icon: string,
    icongray: string,
}

export interface AchievementPlayerAchievedStats {
    apiname: string,
    achieved: 0 | 1,
    unlocktime: number
}

export interface GameAchievementsResponse {
    gameName: string,
    totalGameAchievements: number,
    achievements: AchievementPlayerAchievedStats[];
}
