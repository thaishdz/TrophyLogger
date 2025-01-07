

export interface GameDetailsDto extends GameDto {
    achievements: AchievementDto[]
}

export interface GameDto {
    gameId: number,
    name: string
}

export interface AchievementDto {
    name: string,
    value: string,
    description: string,
    icon: string
    achieved: boolean
}

