
import { AchievementPlayerData } from "./achievement";

export interface GameLibraryResponse {
    appid: number,
    name: string,
    playtime_forever: number,
    img_icon_url: string,
    has_community_visible_stats: boolean,
    playtime_windows_forever: number,
    playtime_mac_forever: number,
    playtime_linux_forever: number,
    playtime_deck_forever: number,
    rtime_last_played: number,
    content_descriptorids: Array,
    playtime_disconnected: boolean
}

export interface GameAchievementsReponse {
    data: GameData,
    achievements: AchievementPlayerData
}
export interface GameData {
    gameId: number,
    name: string,
    cover: string
}