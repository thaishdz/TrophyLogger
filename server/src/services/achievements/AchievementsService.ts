import SteamService from '../steam';
import { SteamApiError } from "@exceptions";
import { HTTP_RESPONSE_STATUS } from "@common/http/constants";

import {
  ApiResponse,
  AchievementDetails,
  GameAchievementsResponse,
  AchievementDetailsResponse,
  AchievementPlayerAchievedStats,
  AchievementPlayerData,
  AchievementsLockedData,
} from "@trophylogger-types";

class AchievementsService {
  constructor(private steamService: SteamService) {}

  public async getLockedAchievementsDataForPlayer(
    gameId: number,
  ): Promise<AchievementPlayerData> {
    try {
      const { data }: ApiResponse<GameAchievementsResponse> =
        await this.steamService.getPlayerAchievements(gameId);

      const { gameName, totalGameAchievements, achievements } = data;

      const achievementsDetails: AchievementDetails[] =
        await this.getAchievementsDetails(gameId);

      const playerLockedAchievementsData: AchievementsLockedData[] = 
        this.getLockedAchievementsData(achievements, achievementsDetails);
      
      const achievementsPlayerData: AchievementPlayerData = {
        gameName,
        totalGameAchievements,
        achievements: playerLockedAchievementsData,
      };

      return achievementsPlayerData;
    } catch (error) {
      throw new SteamApiError(HTTP_RESPONSE_STATUS.SERVER_ERROR, "Error fetching player locked achievements data");
    }
  }

  private getLockedAchievementsData(
    achievementPlayerAchievedStats: AchievementPlayerAchievedStats[],
    achievementsDetails: AchievementDetails[],
  ): AchievementsLockedData[] {
    const unachievedsFiltered: AchievementPlayerAchievedStats[] =
      achievementPlayerAchievedStats.filter(
        (achievement: AchievementPlayerAchievedStats) =>
          achievement.achieved === 0,
      );

    const achievementsLockedData: AchievementsLockedData[] = achievementsDetails
      .map((achievementDetail: AchievementDetails) => {
        const matchingUnachieved: AchievementPlayerAchievedStats | undefined =
          unachievedsFiltered.find(
            (unachieved: AchievementPlayerAchievedStats) =>
              unachieved.apiname === achievementDetail.value,
          );

        return matchingUnachieved
          ? {
              ...achievementDetail,
              achieved: matchingUnachieved.achieved,
            }
          : undefined;
      })
      
      .filter(
        (
          lockedAchievementData,
        ): lockedAchievementData is AchievementsLockedData =>
          lockedAchievementData !== undefined,
      );

    return achievementsLockedData;
  }

  public async getAchievementsDetails(
    gameId: number,
  ): Promise<AchievementDetails[]> {
    try {
      const { data }: ApiResponse<AchievementDetailsResponse[]> =
        await this.steamService.getAchievementsDetails(gameId);

      return data.map(
        (achievement: AchievementDetailsResponse): AchievementDetails => ({
          name: achievement.displayName,
          value: achievement.name,
          description: achievement.description,
          icon: achievement.icongray,
        }),
      );
    } catch (error) {
      throw new SteamApiError(HTTP_RESPONSE_STATUS.SERVER_ERROR, "Error fetching achievements details");
    }
  }
}

export default AchievementsService;
