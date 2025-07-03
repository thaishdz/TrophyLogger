import {Game} from './GamesLibrary';

interface GameCardProps {
  game: Game
}

function GameCard({game}: GameCardProps) {
  return (
    <div className="bg-gray-100 p-6 rounded-lg mt-5">
      <div className="mb-4">
        <div className="w-8 h-8 rounded-full flex items-center justify-center">
          <svg className="h-5 w-5 text-yellow-500"
            width="24" height="24" viewBox="0 0 24 24" 
            stroke-width="2" stroke="currentColor" fill="none" 
            stroke-linecap="round" stroke-linejoin="round">  
            <path stroke="none" d="M0 0h24v24H0z"/>  
            <rect x="2" y="6" width="20" height="12" rx="2" />  
            <path d="M6 12h4m-2 -2v4" />  
            <line x1="15" y1="11" x2="15" y2="11.01" />  
            <line x1="18" y1="13" x2="18" y2="13.01" />
          </svg>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-1">{game.name}</h2>
      <p className="text-gray-600 mb-4">{game.percent}% Complete • {game.totalAchievements} Achievements</p>
      <button className="bg-[#e9b872] px-4 py-2 rounded-md border-3 cursor-pointer">
        View Details
      </button>
    </div>
  );
}


export default GameCard;


