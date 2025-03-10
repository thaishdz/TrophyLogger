import ApiHandlerService from '../api/apiHandler.service';
import { ApiResponse } from '../../shared/types/apiResponse';

import { AchievementDetails, 
    GameAchievementsResponse, 
    AchievementDetailsResponse, 
    AchievementPlayerAchievedStats,
    AchievementPlayerData,
    AchievementsLockedData
} from '../../shared/types/achievement';

import { ServiceError } from '../../shared/errors/serviceError';

class AchievementsService {

    constructor(private apiService: ApiHandlerService) {}

    public async getLockedAchievementsDataForPlayer(gameId: number): Promise<AchievementPlayerData> {
        try {
            const { data }: ApiResponse<GameAchievementsResponse> = await this.apiService.getPlayerAchievements(gameId);
            const { gameName, achievements } = data;
            
            const achievementsDetails: AchievementDetails[] = await this.getAchievementsDetails(gameId);

            const playerLockedAchievementsData: AchievementsLockedData[] = this.getLockedAchievementsData(achievements, achievementsDetails);            
            const totalAchievementsLocked: number = playerLockedAchievementsData.length;

            const achievementsPlayerData: AchievementPlayerData = {
                gameName, 
                totalLocked: totalAchievementsLocked,
                playerAchievementsData: playerLockedAchievementsData
            };

            return achievementsPlayerData;
           
        } catch (error) {
            throw new ServiceError("Error fetching player locked achievements data", "FETCH_ERROR", error);
        }
    }

    private getLockedAchievementsData(
        achievementPlayerAchievedStats: AchievementPlayerAchievedStats[],
        achievementsDetails: AchievementDetails[]
    ): AchievementsLockedData[] {

        const unachievedsFiltered: AchievementPlayerAchievedStats[] = achievementPlayerAchievedStats
            .filter((achievement: AchievementPlayerAchievedStats) => achievement.achieved === 0);

        const achievementsLockedData: AchievementsLockedData[]  = achievementsDetails
            .map((achievementDetail: AchievementDetails)  => { 

                const matchingUnachieved: AchievementPlayerAchievedStats | undefined = unachievedsFiltered
                    .find((unachieved: AchievementPlayerAchievedStats) => unachieved.apiname === achievementDetail.value);

                return matchingUnachieved ? {
                    ...achievementDetail, // crea una copia del obj con todas sus propiedades 
                    achieved: matchingUnachieved.achieved // y le añade esta 
                } : undefined
            })
            // con el filter nos aseguramos que el map siempre devuelva un valor
            .filter((lockedAchievementData): lockedAchievementData is AchievementsLockedData => lockedAchievementData !== undefined);          
        
        return achievementsLockedData;
    }

    public async getAchievementsDetails(gameId: number): Promise<AchievementDetails[]> {

        try {
            const { data }: ApiResponse<AchievementDetailsResponse[]> = await this.apiService.getAchievementsDetails(gameId);
            
            return data.map((achievement: AchievementDetailsResponse): AchievementDetails => ({
                name: achievement.displayName,
                value: achievement.name,
                description: achievement.description,
                icon: achievement.icongray
            }));

        } catch (error) {
            throw new ServiceError("Error fetching achievements details", "FETCH_ERROR", error);
        }
    }
}

export default AchievementsService;