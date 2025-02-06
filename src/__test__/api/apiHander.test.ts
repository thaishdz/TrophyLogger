import ApiHandlerService from "../../services/api/apiHandler.service";
import axios from 'axios';
import config from '../../config';
import { ServiceError } from "../../errors/serviceError";

jest.mock("axios"); 

// Necesitamos testear que nuestra App interactua bien con la API
describe('Make requests to the Steam API', () => {

    let apiHandlerService: ApiHandlerService;
    const mockedAxios = axios as jest.Mocked<typeof axios> // mockeamos la llamada axios (no hará la solicitud real)
    beforeEach(() => {

        // INFO:
        /**
         * Al hacer esto primero, conseguimos aislar cada test
         * evitando contaminar la instancia de clase con residuos
         * de mocks anteriores
         */
        jest.clearAllMocks();  // Limpia los mocks antes de cada test
        apiHandlerService = new ApiHandlerService();
    });

    it('should fetch and return the players owned games', async () => {

        const apiMockResponse = { 
            data: {
                response: {
                    games :[
                        {appid: 1, name: "Game 1"},
                        {appid: 2, name: "Game 2"},
                    ]
                }
            }
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
        expect(url).toContain('key=' + config.API_KEY);
        expect(url).toContain('steamid=' + config.STEAM_ID);
        expect(url).toContain('include_appinfo=' + true);
        expect(url).toContain('include_played_free_games=' + true);
        
        // Comparamos objetos ya transformados
        expect(result).toEqual({
            data: [
                {appid: 1, name: "Game 1"},
                {appid: 2, name: "Game 2"},
            ]
        });
        
        expect(mockedAxios.get).toHaveBeenCalledTimes(1); // se ha llamado 1 vez a la API

    });

    it("should throw an error if the API request fails", async () => {
        
        const serviceError = new ServiceError("Failed to fetch Games Library from Steam API", "FETCH_ERROR");
        
        // INFO: Simula un error de red o caída del servidor genérica
        /**
         * 	“Cuando se llame a axios.get, en vez de resolver la promesa, 
         *  recházala y lanza este error.”
         */
        mockedAxios.get.mockRejectedValue(serviceError);

        const result = apiHandlerService.getOwnedGames();

        await expect(result).rejects.toThrow(ServiceError);

        // Verifica que la API fue llamada
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

        
    it("should fetch and return player achievements", async() =>{
        const apiMockResponse = {
            data: {
                playerstats : [
                    {}
                ]
            }
        }
    
        mockedAxios.get.mockResolvedValue(apiMockResponse);
    });
});


