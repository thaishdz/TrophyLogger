import GameCard from "./GameCard";
import SearchBox from "./SearchBox";
import GameStatusTabs from "./GameStatusTabs";
import { useEffect,useState } from "react";


export interface Game {
  name: string
  percent: number
  totalAchievements: string
}

function GamesLibrary() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
  console.log("🧠 Estado games actualizado:", games);
}, [games]);
  
  return (
    <>
      <h1 className="text-4xl font-extrabold">Games Library</h1>
        <SearchBox onSearchResults={setGames} />

        <GameStatusTabs activeStatus="all" onStatusChange={() => {}} />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {
            games.length ? games.map(game => 
            (<GameCard key={game.name} game={game} />))
            : 
            <div>Esto está muy vacío...</div>
          }
        </div>
    </>
  );
}

export default GamesLibrary;
