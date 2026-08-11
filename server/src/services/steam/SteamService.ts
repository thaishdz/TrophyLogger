import axios from "axios";

import config from "../../config";

import { HTTP_RESPONSE_STATUS } from "@/common/http";
import { ApiResponse, GameLibraryResponse } from '@trophylogger-types';
import { SteamApiError } from '@/exceptions';

class SteamService {
  private API_URL: string;
  private API_URL_STORE: string;
  private API_KEY: string;
  private STEAM_ID: string;

  constructor() {
    this.API_URL = config.API_URL;
    this.API_URL_STORE = config.API_URL_STORE;
    this.API_KEY = config.API_KEY;
    this.STEAM_ID = config.STEAM_ID;
  }

  async getOwnedGames(): Promise<ApiResponse<GameLibraryResponse[]>> {
    const baseUrl = `${this.API_URL}/IPlayerService/GetOwnedGames/v1/`
    const params = new URLSearchParams({ 
      key: this.API_KEY,
      steamid: this.STEAM_ID,
      include_appinfo: 'true', // URLSearchParams expects strings, not booleans
      include_played_free_games: 'true'
    });

    const url = `${baseUrl}?${params.toString()}`;

    try {
      const response = await axios.get(url);
      const gamesLibrary = response.data.response?.games;

      if (gamesLibrary === undefined) {
        return { data: [] };
      }
      return { data: gamesLibrary };
    } catch (error: any) {
      throw new SteamApiError(
        error.response?.status || HTTP_RESPONSE_STATUS.SERVER_ERROR, 
        "Failed fetching games from Steam API",
        {error}
      );
    }
  }

  async getPlayerAchievements<T>(gameId: number): Promise<ApiResponse<T>> {
    try {
      const baseUrl = `${this.API_URL}/ISteamUserStats/GetPlayerAchievements/v1/`;
      const params = new URLSearchParams({
        appid: gameId.toString(),
        key: this.API_KEY,
        steamid: this.STEAM_ID
      });
      const url = `${baseUrl}?${params.toString()}`;

      const response = await axios.get(url);
      const playerAchievementsData = response.data.playerstats;
      
      const totalAchievements = playerAchievementsData.achievements.length;

      return {
        data: {
          ...playerAchievementsData,
          totalGameAchievements: totalAchievements
        }
      } 
      
    } catch (error: any) {
      throw new SteamApiError(
          error.response?.status || HTTP_RESPONSE_STATUS.SERVER_ERROR, 
          "Failed fetching achievements from SteamAPI", 
        {error}
      );
    }
  }

  async getAchievementsDetails<T>(appId: number): Promise<ApiResponse<T>> {
    try {

      const baseUrl = `${this.API_URL}/ISteamUserStats/GetSchemaForGame/v2/`;
      const params = new URLSearchParams({
        key: this.API_KEY,
        appid: appId.toString(),
      });

      const url = `${baseUrl}?${params.toString()}`;
      
      const response = await axios.get(url);
      const achievementsDetails: T = response.data.game.availableGameStats.achievements;

      return { data: achievementsDetails };
    } catch (error: any) {
        throw new SteamApiError(
          error.response?.status || HTTP_RESPONSE_STATUS.SERVER_ERROR, 
          "Failed fetching SchemaForGame from SteamAPI"
        );
    }
  }

  //TODO: Get cover from IGDB
  async getCoverGame(gameName: string, gameId: number): Promise<string> {
    try {
      const response = await axios.get(
        `${this.API_URL_STORE}/storesearch?term=${gameName}&cc=es`,
      );

      const game = response.data.items.find(
        (item: { id: number }) => item.id === gameId,
      );
      return game?.tiny_image || ""; // la cover, retorna '' si game es undefined
    } catch (error: any) {
      throw new SteamApiError(
        error.response?.status || HTTP_RESPONSE_STATUS.SERVER_ERROR, 
        "Failed fetching Cover game from SteamAPI"
      );
    }
  }
}

export default SteamService;
