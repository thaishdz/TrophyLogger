
import { ServiceError } from "../../errors/serviceError";
import ApiHandlerService from "../api/apiHandler.service";
import GameService from "./games.service";
import { GameData } from "../../types/game";

// Simulo el comportamiento de la función, pero no me enfoco en la llamada HTTP de eso se encarga otro test
jest.mock("../../services/api/apiHandler.service");

describe('GameService --- Steam API', () => {
    let gameService: GameService;
    let apiServiceMock: jest.Mocked<ApiHandlerService>;

    beforeEach(() => {
        apiServiceMock = new ApiHandlerService() as jest.Mocked<ApiHandlerService>;
        gameService = new GameService(apiServiceMock);
    });

    it('should return the list of games owned by the player', async() => {

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
        
        const apiMockResponse = { 
            success: false,
            data: [] 
        };
        apiServiceMock.getOwnedGames.mockResolvedValue(apiMockResponse); 

        /**
         * 
         * Si pones el await aquí estás esperando que la promesa 
         * se resuelva o se rechace en ese momento.

         * 
         * Si la promesa se rechaza, el error será lanzado inmediatamente 
         * en esta línea, 
         * y el test fallará antes de llegar a la parte del expect.
         * 
         * Esto significa que el error no llegaría al 
         * expect(result).rejects.toThrow(), 
         * porque el test ya habría terminado con un fallo antes de tiempo.
         */
        const result = gameService.getGamesLibrary();

        /**
         * result tiene la promesa y se la pasas al expect 
         * ahora le dices a Jest:
	     * “Cuando esta promesa se rechace, 
         * asegúrate de que el error sea un ServiceError.”
         */
        await expect(result).rejects.toThrow(ServiceError); // Aquí Jest espera que falle
    });

    it("should throw an fetch error if the API request fails", async () => {
        
        const serviceError = new ServiceError("Failed to fetch Games Library from Steam API", "FETCH_ERROR");
        
        apiServiceMock.getOwnedGames.mockRejectedValue(serviceError);

        const result = gameService.getGamesLibrary();

        await expect(result).rejects.toThrow(ServiceError);

    });

    it("should return found games", async () =>{

        const pattern = 'zero';
        const gamesLibraryMock: GameData[] = [
            {
                gameId: 1,
                name: "The Witcher 3",
                cover: '',
            },
            {   
                gameId: 2,
                name: "Cuphead",
                cover: ''
            },
            {   
                gameId: 3,
                name: "Horizon Zero Dawn",
                cover: ''
            }
        ];

        const resultExpect = [{
            gameId: 3,
            name: "Horizon Zero Dawn",
            cover: ''
        }];

        const result = gameService.findGames(pattern, gamesLibraryMock);
        expect(result).toEqual(resultExpect);
    });

    it("should return a ServiceError when no games are returned", async() => {
        
        const pattern = 'zero';
        const gamesLibraryMock: GameData[] = [
            {
                gameId: 1,
                name: "The Witcher 3",
                cover: '',
            },
            {   
                gameId: 2,
                name: "Cuphead",
                cover: ''
            }
        ];

        const emptyResult: [] = []; // lol

        const result = gameService.findGames(pattern, gamesLibraryMock);
        expect(result).toEqual(emptyResult);
    });
});