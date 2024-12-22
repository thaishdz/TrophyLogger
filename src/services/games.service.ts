import ApiRepository from '../repositories/api.repository';

// Actúa como intermediario entre el repositorio y la lógica de negocio.
export class GameService {

    private apiRepository: ApiRepository;

    constructor() {
        this.apiRepository = new ApiRepository();
    }

     public async getGames(name: string) {
        console.log("Estoy en el Servicio y me ha llegado esto:", name)
        const gameList = await this.apiRepository.getGames(name); // devuelve una maldita promesa el getGames por eso el await pa que se resuelva
        console.log("GameList:", gameList);
        return gameList;

    }
}