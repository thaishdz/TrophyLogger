
import ApiHandlerService from "../../services/api/apiHandler.service";
import GameService from "../../services/games.service";
import { ApiResponse } from "../../types/apiResponse";
import { GameData } from "../../types/game";

jest.mock("../../services/api/apiHandler.service");

describe('Retrieves the list of games owned by a Steam player from their library', () => {
    let gameService: GameService;
    let apiServiceMock: jest.Mocked<ApiHandlerService>;

    beforeEach(() => {
        apiServiceMock = new ApiHandlerService() as jest.Mocked<ApiHandlerService>;
        gameService = new GameService(apiServiceMock);
    });

    //FIXME: Arreglar el test porque gameId da undefined 
    it('should fetch and return the list of games owned by the player', async() =>{

        const apiMockResponse: ApiResponse<GameData[]> = { 
            data: [
                {gameId: 1, name: "Game 1"},
                {gameId: 2, name: "Game 2"},
            ]};
        
        apiServiceMock.getOwnedGames.mockResolvedValue(apiMockResponse); // simulamos llamar a al API

        const gameData: GameData[] = [
            {gameId: 1, name: "Game 1"},
            {gameId: 2, name: "Game 2"},
        ];

        const result = await gameService.getGamesLibrary();

        expect(result).toEqual(gameData);

        // Verifica que getOwnedGames fue llamado 1 vez
        expect(apiServiceMock.getOwnedGames).toHaveBeenCalledTimes(1);
    });

    // TODO: crear test si el jugador no tiene juegos y si falla la API steam

    /**
     *  it("should return an empty array if the player has no games", async () => {
        // Test logic here...
    });

    it("should throw an error if the API request fails", async () => {
        // Test logic here...
    });
     */
});