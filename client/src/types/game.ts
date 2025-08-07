export interface Achievement {
  name: string;
  value: string;
  description: string;
  icon: string;
  achieved: number; // 0 = not achieved, 1 = achieved
}

export interface GameData {
  gameId: number;
  gameName: string;
  totalGameAchievements: number;
  achievements: Achievement[];
}
