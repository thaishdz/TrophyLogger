
import { ApiResponse } from "../../../shared/types/apiResponse";
import { AchievementDetails, AchievementDetailsResponse, GameAchievementsResponse } from "../../../shared/types/achievement";

export const gameAchieveResponseMock: ApiResponse<GameAchievementsResponse> = {
    data: {
        gameName: "Horizon Zero Dawn",
        achievements: [
            {
                apiname: "NEW_ACHIEVEMENT_5_2",
                achieved: 0,
                unlocktime: 1692438616
            }
        ]
    }
}

export const achievementDetailsResponseMock: ApiResponse<AchievementDetailsResponse[]> = {
    data: [
     {
        name: "ACHIEVEMENT_56",
        defaultvalue: 0,
        displayName: "You're the best",
        hidden: 0,
        description: "Beat the game on hard difficulty",
        icon: "https://icon.png",
        icongray: "https://icon-gray.png",
    },
    {
        name: "ACHIEVEMENT_3",
        defaultvalue: 0,
        displayName: "Killed 15 Scorchers",
        hidden: 0,
        description: "Killed 15 Scorchers machines",
        icon: "https://icon.png",
        icongray: "https://icon-gray.png",
    }
 ]};

 export const mockAchievementsDetails: AchievementDetails[] = [
    {
        name: "You're the best",
        value: "ACHIEVEMENT_56",
        description: "Beat the game on hard difficulty",
        icon: "https://icon-gray.png",
    },
    {
        name: "Killed 15 Scorchers",
        value: "ACHIEVEMENT_3",
        description: "Killed 15 Scorchers machines",
        icon: "https://icon-gray.png",
    },
];

export const mockLockedAchievementData = {
    data: 
    [
        {
            name: "ACHIEVEMENT_56",
            defaultvalue: 0,
            displayName: "You're the best",
            hidden: 0,
            description: "Beat the game on hard difficulty",
            icon: "https://icon.png",
            icongray: "https://icon-gray.png",
            achieved: 0
       },
       {
            name: "ACHIEVEMENT_3",
            defaultvalue: 0,
            displayName: "Killed 15 Scorchers",
            hidden: 0,
            description: "Killed 15 Scorchers machines",
            icon: "https://icon.png",
            icongray: "https://icon-gray.png",
            achieved: 0
        }
    ]
}

    