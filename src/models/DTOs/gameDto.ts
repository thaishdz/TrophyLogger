

export interface GameDetailsDto extends GameDto {
    achievements: AchievementsDto
}

export interface GameDto {
    gameId: number,
    name: string,
    cover: string
}

export interface AchievementsDto {
    total: number,
    playerLockedAchievements: AchievementDto[];
}

export interface AchievementDto {
    name: string;
    value: string;
    description: string;
    icon: string;
    achieved: boolean;
}

