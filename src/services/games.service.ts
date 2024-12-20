import { ApiStoreRepository } from '../repositories/api.store.repository';

// Actúa como intermediario entre el repositorio y la lógica de negocio.
export class GameService {

    private apiStoreRepository: ApiStoreRepository;

    constructor() {
        this.apiStoreRepository = new ApiStoreRepository();
    }
}