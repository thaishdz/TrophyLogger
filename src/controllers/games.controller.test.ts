
const request = require('supertest'); // simulará el server
import { createApp } from '../app';
import { GameData } from '../types/game';
import GameService from '../services/games/games.service'; 

// Mockea los métodos del servicio
jest.mock('../services/games/games.service', () => {
    getGamesLibrary: jest.fn() // Mockea la función getGamesLibrary  
});

describe('[API Endpoints]', () => {
    
    const app = createApp();


    it('should return matching games', async () => {

        const game = 'zero';
        const endpoint = `/api/v1/search?game=${game}`;

        const mockGames: GameData[] = [
            { gameId: 1111111, name: 'Horizon Zero Dawn™ Complete Edition' },
            { gameId: 6666666, name: 'Katana zero' }
        ];

        //FIX: ver cómo demonios mockear esto
        (GameService.getGamesLibrary as jest.Mock).mockResolvedValue(mockGames);

        const responseMock = {
            "matchedGames": [{ "gameId": 1111111, "name": "Horizon Zero Dawn™ Complete Edition"}]
        }

        const response = await request(app)
            .get(endpoint)
            .set('Accept', 'application/json') // el cliente le dice al servidor que espera un JSON 
            .expect(200)
            .expect('Content-Type', /json/); // el servidor le manda un JSON al cliente
    
        expect(response.body).toHaveProperty('matchedGames');
        expect(response.body).toEqual(responseMock);
    });

});