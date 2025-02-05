
import ApiHandlerService from "../../services/api/apiHandler.service";
import GameService from "../../services/games.service";
import { GameData } from "../../types/game";

// Simulo el comportamiento de la función, pero no me enfoco en la llamada HTTP de eso se encarga otro test
jest.mock("../../services/api/apiHandler.service");

describe('Retrieves the list of games owned by a Steam player from their library', () => {
    let gameService: GameService;
    let apiServiceMock: jest.Mocked<ApiHandlerService>;

    beforeEach(() => {
        apiServiceMock = new ApiHandlerService() as jest.Mocked<ApiHandlerService>;
        gameService = new GameService(apiServiceMock);
    });

    it('should fetch and return the list of games owned by the player', async() =>{

        const apiMockResponse = { 
            data: [
                {appid: 1, name: "Game 1"},
                {appid: 2, name: "Game 2"},
            ]
        };
        
        apiServiceMock.getOwnedGames.mockResolvedValue(apiMockResponse); // simulamos llamar a la API

        const gameData: GameData[] = [
            {gameId: 1, name: "Game 1"},
            {gameId: 2, name: "Game 2"},
        ];

        const result = await gameService.getGamesLibrary();

        expect(result).toEqual(gameData);

        // Verifica que getOwnedGames fue llamado 1 vez
        expect(apiServiceMock.getOwnedGames).toHaveBeenCalledTimes(1);
    });


    it("should throw an error if the player has no games", async () => {
        
        const apiMockResponse = { data: [] };
        apiServiceMock.getOwnedGames.mockResolvedValue(apiMockResponse); 

        const result = gameService.getGamesLibrary();

        await expect(result).rejects.toThrow();
    });
});