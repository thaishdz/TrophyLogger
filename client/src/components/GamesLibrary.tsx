import GameCard from './GameCard'
import SearchBox from './SearchBox'
import GameStatusTabs from './GameStatusTabs'
import ErrorModal from './ErrorModal'
import { useState } from 'react'
import { GameData } from '../types/game'


function GamesLibrary() {
  const [games, setGames] = useState<GameData[]>([])
  const [error, setError] = useState<string | null>(null)

  return (
    <>
      <h1 className="text-4xl font-extrabold">Games Library</h1>
      <SearchBox onSearchResults={setGames} onError={setError} />

      <ErrorModal message={error} onClose={() => setError(null)} />

      <GameStatusTabs activeStatus="All" onStatusChange={() => {}} />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {
          games.length ? games.map(game =>
            (<GameCard key={game.gameId} game={game} />))
            :
            <div>Esto está muy vacío...</div>
        }
      </div>
    </>
  )
}

export default GamesLibrary
