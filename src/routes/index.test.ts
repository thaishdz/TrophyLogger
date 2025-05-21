import request from 'supertest'; // simulará el server
import app from '../app'

/**
 * En teoría esto es un E2E (test de integración), estoy probando que se llame
 * correctamente a estos endpoints
 */

describe('API Endpoints', () => {

    it('should return 200  [/search?game=]', (done) => {

        const game = 'zero';
        const endpoint = `/api/v1/search?game=${game}`;

        request(app)
            .get(endpoint)
            .set('Accept', 'application/json') // el cliente le dice al servidor que espera un JSON 
            .expect('Content-Type', /json/) // el servidor le manda un JSON al cliente
            .expect(200, done);
    });

    it('should return 200  [/gameAchievements/:gameId]', (done) => {

        const gameId = 1151640;
        const endpoint = `/api/v1/gameAchievements/${gameId}`;

        request(app)
            .get(endpoint)
            .set('Accept', 'application/json') 
            .expect('Content-Type', /json/) 
            .expect(200, done);
    });

    it('should return 500  [/gameAchievements/:gameId]', (done) => {

        const gameId = 1;
        const endpoint = `/api/v1/gameAchievements/${gameId}`;

        request(app)
            .get(endpoint)
            .set('Accept', 'application/json') 
            .expect('Content-Type', /json/) 
            .expect(500, done);
    });

});