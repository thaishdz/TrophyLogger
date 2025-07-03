import GameCard from "./GameCard";
import SearchBox from "./SearchBox";
import GameStatusTabs from "./GameStatusTabs";

export interface Game {
  name: string
  percent: number
  totalAchievements: string
}

function GamesLibrary() {
  const gamesList: Game[] = [
    {
      name: "Hades",
      percent: 71,
      totalAchievements: "35/49"
    }, 
    {
      name: "Dishonored",
      percent: 32,
      totalAchievements: "26/80"
    }, 
    {
      name: "Darkest Dungeon",
      percent: 52,
      totalAchievements: "63/120"
    }
  ];
  return (
    <>
      <h1 className="text-4xl font-extrabold">Games Library</h1>
      <SearchBox />

      <GameStatusTabs activeStatus="all" onStatusChange={() => {}} />
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gamesList.map(game => {
          return <GameCard game={game}/>
        })}
      </div>
    </>
  );
}

export default GamesLibrary;
