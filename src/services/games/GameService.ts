import Fuse, { FuseResult } from "fuse.js"; // mi santo grial para realizar las búsquedas
import ApiHandlerService from "../api/ApiHandlerService";
import { GameData } from "../../shared/types/game";

import { ApiResponse } from "../../shared/types/apiResponse";
import { GameLibraryResponse } from "../../shared/types/game";
import { ApiError } from "../../shared/errors/ApiError";

class GameService {
  /*
   ** Al usar inyección de dependencias (DI) no solo desacoplamos la fuente de datos,
   ** siendo vital en caso de que un día queramos sustituirla
   ** también facilita mockear en los tests
   */

  constructor(private apiService: ApiHandlerService) {}

  async getGamesLibrary(): Promise<GameData[]> {
    const { data }: ApiResponse<GameLibraryResponse[]> =
      await this.apiService.getOwnedGames();

    if (!Array.isArray(data)) {
      throw new ApiError("Invalid response: expected an array", 400);
    }

    //REFACTOR: Usar Promise.allSettled para manejar errores de forma que no se detenga la ejecución de las promesas
    const gamesInfo: GameData[] = await Promise.all(
      data.map(async (game: GameLibraryResponse) => ({
        gameId: game.appid,
        name: game.name,
      })),
    );
    return gamesInfo;
  }

  findGames(gameName: string, gamesLibrary: GameData[]): GameData[] {
    const options = {
      keys: ["name"], // La búsqueda es por la clave "name"
      isCaseSensitive: false,
      threshold: 0.2, // - Reducir para ser más exacto | + Aumentar para que se le vaya la bola
    };

    const fuse = new Fuse(gamesLibrary, options);

    const results: FuseResult<GameData>[] = fuse.search(gameName);
    const games: GameData[] = results.map((result) => result.item);

    return games;
  }
}

export default GameService;
