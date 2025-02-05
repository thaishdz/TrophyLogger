import ApiHandlerService from "../../services/api/apiHandler.service";
import axios from 'axios';
import config from '../../config';

jest.mock("axios"); 

describe('Make calls to Steam API', () => {

    let apiHandlerService: ApiHandlerService;
    const mockedAxios = axios as jest.Mocked<typeof axios> // Necesitamos testear que nuestra App interactua bien con la API

    beforeEach(() => {
        apiHandlerService = new ApiHandlerService();
    });

    it('should call getOwnedGames once and return games', async () => {

        const apiMockResponse = { 
            data: [
                {appid: 1, name: "Game 1"},
                {appid: 2, name: "Game 2"},
            ]
        };

        mockedAxios.get.mockResolvedValue(apiMockResponse);

        const result = await apiHandlerService.getOwnedGames();
        
        // Verifica que axios haya sido llamado con un 1 argumento, sin importar su valor exacto.
        expect(mockedAxios.get).toHaveBeenCalledWith(expect.anything());

        // Obtenemos la URL que se pasó en la llamada mockeada
        const url = mockedAxios.get.mock.calls[0][0];

        // Verificamos que la URL contenga los parámetros esperados
        expect(url).toContain('key=' + config.API_KEY);
        expect(url).toContain('steamid=' + config.STEAM_ID);
        expect(url).toContain('include_appinfo=' + true);
        expect(url).toContain('include_played_free_games=' + true);
        
        expect(result).toEqual(apiMockResponse);
        expect(mockedAxios.get).toHaveBeenCalledTimes(1); // se ha llamado 1 vez a la API

    });

    it("should throw an error if the API request fails", async () => {
        
    });
});
