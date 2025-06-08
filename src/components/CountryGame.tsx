import { MapInterface } from './MapInterface'
import { GameUI } from './GameUI'
import { useGeoGame } from '../hooks/useGeoGame'
import { COUNTRIES } from '../data/countries'

export function CountryGame() {
  const {
    currentItem,
    score,
    round,
    gameOver,
    message,
    userGuess,
    handleGuess,
    restartGame,
  } = useGeoGame(COUNTRIES, 10)

  const markers = []
  if (userGuess) markers.push({ position: userGuess, label: 'Your guess' })
  if (currentItem && message.includes('Correct')) {
    markers.push({ position: currentItem.position, label: currentItem.name })
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <GameUI
        title="Guess the Country"
        currentItem={currentItem}
        score={score}
        round={round}
        totalRounds={10}
        message={message}
        gameOver={gameOver}
        onRestart={restartGame}
      />
      
      <div className="flex-grow p-4">
        <MapInterface
          center={[20, 0]}
          zoom={2}
          onMapClick={handleGuess}
          markers={markers}
        />
      </div>
    </div>
  )
}