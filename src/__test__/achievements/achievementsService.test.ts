import ApiHandlerService from "../../services/api/apiHandler.service";
import AchievementsService from "../../services/achievements.service";
import { ServiceError } from "../../errors/serviceError";
import { GameAchievementsResponse } from "../../types/achievement";
import { ApiResponse } from "../../types/apiResponse";


describe("AchievementsService --- Steam API", () => {
    let apiServiceMock: jest.Mocked<ApiHandlerService>;
    let achievementsService: AchievementsService;
    
    beforeEach(() => {
        apiServiceMock = new ApiHandlerService() as jest.Mocked<ApiHandlerService>;
        achievementsService = new AchievementsService(apiServiceMock);
    });

    it("should combine unachieved stats and achievement details into locked achievements data", async () => {

        const apiMockResponse: ApiResponse<GameAchievementsResponse> = {
            data: {
                gameName: "Horizon Zero Dawn",
                achievements: [
                    {
                        apiname: "You're the best",
                        achieved: 0,
                        unlocktime: 1111111
                    }
                ]
            }
        }

        // Definir el mock
        jest.spyOn(apiServiceMock, 'getPlayerAchievements')
            .mockImplementation( async (gameId) => {
                return apiMockResponse;
        });

        const expectResult = [{
            name: "You're the best",
            value: "",
            description: "Beat the game on hard difficulty",
            icon: "https://icon.png",
            achieved: 0,
        }];
        const result = achievementsService.getLockedAchievementsDataForPlayer(1);

        expect(result).toEqual(expectResult);
        // Verificar que la función privada fue llamada 
        expect(achievementsService['getLockedAchievementsData']).toHaveBeenCalledWith(1);
    });


    it("should return the details of each achievement", async () => {});
});