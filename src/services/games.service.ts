import ApiRepository from '../repositories/api.repository';

// Actúa como intermediario entre el repositorio y la lógica de negocio.
export class GameService {

    private apiRepository: ApiRepository;

    constructor() {
        this.apiRepository = new ApiRepository();
    }

    public async getGamesWithLockedAchievements(name: string) {
        console.log("Estoy en el SERVICIO y me ha llegado esto:", name)
        const games = await this.apiRepository.getGameWithAchievements(name); // devuelve una maldita promesa el getGames por eso el await pa que se resuelva
        //console.log("GameListService:", gameList);
     

        return games;

    }
}