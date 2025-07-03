import ApiHandlerService from "./SteamService";
import axios from "axios";
import config from "../../config";
import { SteamApiError } from "../../exceptions/SteamApiError";
import { HTTP_RESPONSE_STATUS } from "../../common/http/constants";


jest.mock("axios");

// Necesitamos testear que nuestra App interactua bien con la API
describe("Make requests to the Steam API", () => {
  let apiHandlerService: ApiHandlerService;
  const mockedAxios = axios as jest.Mocked<typeof axios>; // mockeamos la llamada axios (no hará la solicitud real)
  beforeEach(() => {
    // INFO:
    /**
     * Al hacer esto primero, conseguimos aislar cada test
     * evitando contaminar la instancia de clase con residuos
     * de mocks anteriores
     */
    jest.clearAllMocks(); // Limpia los mocks antes de cada test
    apiHandlerService = new ApiHandlerService();
  });

  it("should fetch and return the players owned games", async () => {
    const apiMockResponse = {
      data: {
        response: {
          games: [
            { appid: 1, name: "Game 1" },
            { appid: 2, name: "Game 2" },
          ],
        },
      },
    };

    // INFO:
    /**
     * “Hey, cuando alguien llame a .get,
     * finge que hiciste la solicitud
     * y devuelve este objeto apiMockResponse como respuesta (promesa resuelta).”
     */
    mockedAxios.get.mockResolvedValue(apiMockResponse);

    const result = await apiHandlerService.getOwnedGames();

    // Verifica que axios haya sido llamado con un 1 argumento, sin importar su valor exacto.
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.anything());

    // Obtenemos la URL que se pasó en la llamada mockeada
    const url = mockedAxios.get.mock.calls[0][0];

    // Verificamos que la URL contenga los parámetros esperados
    expect(url).toContain("key=" + config.API_KEY);
    expect(url).toContain("steamid=" + config.STEAM_ID);
    expect(url).toContain("include_appinfo=" + true);
    expect(url).toContain("include_played_free_games=" + true);

    // Comparamos objetos ya transformados
    expect(result).toEqual({
      data: [
        { appid: 1, name: "Game 1" },
        { appid: 2, name: "Game 2" },
      ],
    });

    expect(mockedAxios.get).toHaveBeenCalledTimes(1); // se ha llamado 1 vez a la API
  });

  it("should throw an fetch error if the API request fails", async () => {
    const apiError = new SteamApiError(HTTP_RESPONSE_STATUS.SERVER_ERROR, "Failed to fetch Games Library from Steam API");
    /**
     * 	“Cuando se llame a axios.get, en vez de resolver la promesa,
     *  recházala y lanza este error.”
     */
    mockedAxios.get.mockRejectedValue(apiError);

    const result = apiHandlerService.getOwnedGames();

    await expect(result).rejects.toThrow(apiError);

    // Verifica que la API fue llamada
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  it("should fetch and return player achievements", async () => {
    const apiMockResponse = {
      data: {
        playerstats: [
          {
            steamID: "11111111111111111",
            gameName: "Horizon Zero Dawn™ Complete Edition",
            achievements: [
              {
                apiname: "NEW_ACHIEVEMENT_4_21",
                achieved: 1,
                unlocktime: 11111111,
              },
              {
                apiname: "NEW_ACHIEVEMENT_5_10",
                achieved: 1,
                unlocktime: 11111111,
              },
            ],
          },
        ],
      },
    };
    // 1. Configuración del mock antes de la llamada
    mockedAxios.get.mockResolvedValue(apiMockResponse);

    // 2. Llamada a la función que internamente usará el mock
    const result = await apiHandlerService.getPlayerAchievements(1);

    // 3. Verificaciones de la llamada
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.anything());

    // Obtenemos la URL que se pasó en la llamada mockeada
    const url = mockedAxios.get.mock.calls[0][0];

    // Verificamos que la URL contenga los parámetros esperados
    expect(url).toContain("key=" + config.API_KEY);
    expect(url).toContain("steamid=" + config.STEAM_ID);

    const resultExpected = {
      data: [
        {
          steamID: "11111111111111111",
          gameName: "Horizon Zero Dawn™ Complete Edition",
          achievements: [
            {
              apiname: "NEW_ACHIEVEMENT_4_21",
              achieved: 1,
              unlocktime: 11111111,
            },
            {
              apiname: "NEW_ACHIEVEMENT_5_10",
              achieved: 1,
              unlocktime: 11111111,
            },
          ],
        },
      ],
    };

    expect(result).toEqual(resultExpected);

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  it("should throw an fetch error if the Achievements request fails", async () => {
    const apiError = new SteamApiError(HTTP_RESPONSE_STATUS.SERVER_ERROR, "Failed fetching achievements from Steam API");

    mockedAxios.get.mockRejectedValue(apiError);

    const result = apiHandlerService.getPlayerAchievements(1);

    await expect(result).rejects.toThrow(apiError);

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  it("should return the achievement details.", async () => {
    const apiMockResponse = {
      data: {
        game: {
          availableGameStats: {
            achievements: [
              {
                name: "NEW_ACHIEVEMENT",
                defaultvalue: 0,
                displayName: "All achievements obtained",
                hidden: 0,
                description: "Obtained all Horizon Zero Dawn achievements.",
                icon: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/1151640/90105bcb9db3651e3830bf56a45834eab69ac01d.jpg",
                icongray:
                  "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/1151640/7ec4a9bed1bc7d1edbf73ddde28120c221169873.jpg",
              },
            ],
          },
        },
      },
    };

    mockedAxios.get.mockResolvedValue(apiMockResponse);

    const result = await apiHandlerService.getAchievementsDetails(1151640);

    expect(mockedAxios.get).toHaveBeenCalledWith(expect.anything());

    // Obtenemos la URL que se pasó en la llamada mockeada
    const url = mockedAxios.get.mock.calls[0][0];

    // Verificamos que la URL contenga los parámetros esperados
    expect(url).toContain("key=" + config.API_KEY);

    const resultExpected = {
      data: [
        {
          name: "NEW_ACHIEVEMENT",
          defaultvalue: 0,
          displayName: "All achievements obtained",
          hidden: 0,
          description: "Obtained all Horizon Zero Dawn achievements.",
          icon: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/1151640/90105bcb9db3651e3830bf56a45834eab69ac01d.jpg",
          icongray:
            "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/1151640/7ec4a9bed1bc7d1edbf73ddde28120c221169873.jpg",
        },
      ],
    };

    expect(result).toEqual(resultExpected);

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  it("should return the games cover image.", async () => {
    const apiMockResponse = {
      data: {
        items: [
          {
            type: "app",
            name: "Horizon Zero Dawn™ Complete Edition",
            id: 1151640,
            tiny_image:
              "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1151640/capsule_231x87.jpg?t=1736534555",
            metascore: "",
            platforms: { windows: true, mac: false, linux: false },
            streamingvideo: false,
            controller_support: "full",
          },
        ],
      },
    };

    mockedAxios.get.mockResolvedValue(apiMockResponse);

    const result = await apiHandlerService.getCoverGame("Horizon", 1151640);

    const resultExpected =
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1151640/capsule_231x87.jpg?t=1736534555";

    expect(result).toBe(resultExpected);

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });
});
