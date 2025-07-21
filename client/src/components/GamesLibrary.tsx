import GameCard from "./GameCard";
import SearchBox from "./SearchBox";
import GameStatusTabs from "./GameStatusTabs";


export interface Game {
  name: string
  percent: number
  totalAchievements: string
}

function GamesLibrary() {

  const gameList: Game[] = [];
  
  return (
    <>
      <h1 className="text-4xl font-extrabold">Games Library</h1>
        <SearchBox />

        <GameStatusTabs activeStatus="all" onStatusChange={() => {}} />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {
            gameList?.length ? gameList.map(game => 
            (<GameCard key={game.name} game={game} />))
            : 
            <div>Esto está muy vacío...</div>
          }
        </div>
    </>
  );
}

export default GamesLibrary;
