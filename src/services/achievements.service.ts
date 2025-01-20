

import ApiRepository from '../repositories/api.repository';
import { ApiResponse } from '../types/apiResponse';

import { AchievementDetails, 
    GameAchievementsResponse, 
    AchievementDetailsResponse, 
    AchievementPlayerAchievedStats,
    AchievementPlayerData,
    AchievementsLockedData
} from '../types/achievement';


class AchievementsService {

    private apiRepository: ApiRepository;

    constructor() {
        this.apiRepository = new ApiRepository();
    }

    public async getPlayerLockedAchievements(gameId: number): Promise<AchievementPlayerData> {
        try {
            const { data }: ApiResponse<GameAchievementsResponse> = await this.apiRepository.getPlayerAchievements(gameId);
            const { gameName, achievements } = data;
            
            const achievementsDetails: AchievementDetails[] = await this.getAchievementsDetails(gameId);

            const playerLockedAchievementsData: AchievementsLockedData[] = this.getAchievementsLockedData(achievements, achievementsDetails);            
            const totalAchievementsLocked: number = playerLockedAchievementsData.length;

            const playerLockedAchievements: AchievementPlayerData = {
                gameName, 
                totalLocked: totalAchievementsLocked,
                playerAchievementsData: playerLockedAchievementsData
            };

            return playerLockedAchievements;
           
        } catch (error) {
            throw new ServiceError("Error fetching player locked achievements data");
        }
    }

    private getAchievementsLockedData(
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
            const { data }: ApiResponse<AchievementDetailsResponse[]> = await this.apiRepository.getAchievementsDetails(gameId);

            return data.map((achievement: AchievementDetailsResponse): AchievementDetails => ({
                name: achievement.displayName,
                value: achievement.name,
                description: achievement.description,
                icon: achievement.icongray
            }));
            
        } catch (error) {
            throw new ServiceError("Error fetching achievements details");
        }
    }
}

export default AchievementsService;