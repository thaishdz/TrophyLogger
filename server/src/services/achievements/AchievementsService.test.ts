import { HTTP_RESPONSE_STATUS } from "@common/http";
import { SteamApiError } from "@exceptions";
import SteamService from "../steam/SteamService";
import AchievementsService from "./AchievementsService";

import {
  gameAchieveResponseMock,
  achievementDetailsResponseMock,
  mockAchievementsDetails,
} from "./__fixtures__/dataMock";

jest.mock("@services/steam/SteamService");

describe("AchievementsService --- Steam API", () => {
  let steamServiceMock: jest.Mocked<SteamService>;
  let achievementsService: AchievementsService;

  beforeEach(() => {
    jest.clearAllMocks();
    steamServiceMock = new SteamService() as jest.Mocked<SteamService>;
    achievementsService = new AchievementsService(steamServiceMock);
  });

  //TODO: Mejorar este test para que dé la info de los achievements
  it("should combine unachieved stats and achievement details into locked achievements data", async () => {
    steamServiceMock.getPlayerAchievements.mockResolvedValue(
      gameAchieveResponseMock,
    );
    const spyAchievementsDetails = jest
      .spyOn(achievementsService, "getAchievementsDetails")
      .mockResolvedValue(mockAchievementsDetails);

    const expectResult = {
      gameName: "Horizon Zero Dawn",
      playerAchievementsData: [],
      totalLocked: 0,
    };

    const result =
      await achievementsService.getLockedAchievementsDataForPlayer(1);

    expect(result).toEqual(expectResult);
    expect(spyAchievementsDetails).toHaveBeenCalled();
  });

  it("should return the details of each achievement", async () => {
    const gameId = 1;
    steamServiceMock.getAchievementsDetails.mockResolvedValue(
      achievementDetailsResponseMock,
    );

    const result = await achievementsService.getAchievementsDetails(gameId);

    const expectResult = [
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
    expect(result).toEqual(expectResult);
  });

  it("should return an error if there are no achievement details", async () => {
    const apiError = new SteamApiError(HTTP_RESPONSE_STATUS.SERVER_ERROR, "Error fetching achievements details");

    steamServiceMock.getAchievementsDetails.mockRejectedValue(apiError);

    const result = achievementsService.getAchievementsDetails(6);

    await expect(result).rejects.toThrow(SteamApiError);

    expect(steamServiceMock.getAchievementsDetails).toHaveBeenCalledTimes(1);
  });
});
