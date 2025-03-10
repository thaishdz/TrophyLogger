import ApiHandlerService from "../api/apiHandler.service";
import AchievementsService from "./achievements.service";

import { 
    gameAchieveResponseMock, 
    achievementDetailsResponseMock,
    mockAchievementsDetails
 } from "./__fixtures__/dataMock";
import { ServiceError } from "../../shared/errors/serviceError";

jest.mock("../../services/api/apiHandler.service");

describe("AchievementsService --- Steam API", () => {
    let apiServiceMock: jest.Mocked<ApiHandlerService>;
    let achievementsService: AchievementsService;
    
    beforeEach(() => {
        jest.clearAllMocks();
        apiServiceMock = new ApiHandlerService() as jest.Mocked<ApiHandlerService>;
        achievementsService = new AchievementsService(apiServiceMock);
    });

    //TODO: Mejorar este test para que dé la info de los achievements
    it("should combine unachieved stats and achievement details into locked achievements data", async () => {

        apiServiceMock.getPlayerAchievements.mockResolvedValue(gameAchieveResponseMock);
        const spyAchievementsDetails = jest.spyOn(achievementsService,'getAchievementsDetails')
                                            .mockResolvedValue(mockAchievementsDetails);
        
        const expectResult = {
            "gameName": "Horizon Zero Dawn", 
            "playerAchievementsData": [], 
            "totalLocked": 0
        }

        const result = await achievementsService.getLockedAchievementsDataForPlayer(1);
        
        expect(result).toEqual(expectResult);
        expect(spyAchievementsDetails).toHaveBeenCalled();
    });
   


    it("should return the details of each achievement", async () => {

        const gameId = 1;
        apiServiceMock.getAchievementsDetails.mockResolvedValue(achievementDetailsResponseMock);

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

        const serviceError = new ServiceError("Error fetching achievements details", "FETCH_ERROR");
        
        apiServiceMock.getAchievementsDetails.mockRejectedValue(serviceError);

        const result = achievementsService.getAchievementsDetails(6);

        await expect(result).rejects.toThrow(ServiceError);

        expect(apiServiceMock.getAchievementsDetails).toHaveBeenCalledTimes(1);
    });
});