import { GameData } from '@trophylogger-types';
import SteamService from '../steam';
import GameService from "./GameService";

// Simulo el comportamiento de la función, pero no me enfoco en la llamada HTTP de eso se encarga otro test
jest.mock("../../services/steam/SteamService");

describe("GameService --- Steam API", () => {
  let gameService: GameService;
  let apiServiceMock: jest.Mocked<SteamService>;

  beforeEach(() => {
    apiServiceMock = new SteamService() as jest.Mocked<SteamService>;
    gameService = new GameService(apiServiceMock);
  });

  it("should return the list of games owned by the player", async () => {
    const apiMockResponse = {
      data: [
        { appid: 1, name: "Game 1" },
        { appid: 2, name: "Game 2" },
      ],
    };

    apiServiceMock.getOwnedGames.mockResolvedValue(apiMockResponse); // simulamos llamar a la API

    const gameData: GameData[] = [
      { gameId: 1, name: "Game 1" },
      { gameId: 2, name: "Game 2" },
    ];

    const result = await gameService.getGamesLibrary();

    expect(result).toEqual(gameData);

    // Verifica que getOwnedGames fue llamado 1 vez
    expect(apiServiceMock.getOwnedGames).toHaveBeenCalledTimes(1);
  });

  it("should return found games", async () => {
    const pattern = "zero";
    const gamesLibraryMock: GameData[] = [
      {
        gameId: 1,
        name: "The Witcher 3",
        cover: "",
      },
      {
        gameId: 2,
        name: "Cuphead",
        cover: "",
      },
      {
        gameId: 3,
        name: "Horizon Zero Dawn",
        cover: "",
      },
    ];

    const resultExpect = [
      {
        gameId: 3,
        name: "Horizon Zero Dawn",
        cover: "",
      },
    ];

    const result = gameService.findGames(pattern, gamesLibraryMock);
    expect(result).toEqual(resultExpect);
  });
});
