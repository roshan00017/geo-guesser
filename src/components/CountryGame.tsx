import { COUNTRIES } from "../data/countries";
import { useGeoGame } from "../hooks/useGeoGame";
import { GameUI } from "./GameUI";
import { MapInterface } from "./MapInterface";

export function CountryGame() {
  const {
    currentItem,
    score,
    highScore,
    timeLeft,
    gameOver,
    message,
    userGuess,
    isAnswerLocked,
    handleGuess,
    restartGame,
    mapCenter,
    mapZoom,
  } = useGeoGame(COUNTRIES);

  const markers = [];
  if (userGuess)
    markers.push({
      position: userGuess,
      label: "Your guess",
      color: "red", // Add color for wrong guess
    });
  if (currentItem && message) {
    markers.push({
      position: currentItem.position,
      label: currentItem.name,
      color: "green", // Add color for correct location
    });
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <GameUI
        title="Guess the Country"
        currentItem={currentItem}
        score={score}
        highScore={highScore}
        timeLeft={timeLeft}
        message={message}
        gameOver={gameOver}
        onRestart={restartGame}
      />

      <div className="flex-grow p-4">
        <MapInterface
          center={mapCenter}
          zoom={mapZoom}
          onMapClick={!isAnswerLocked ? handleGuess : undefined}
          markers={[
            ...(userGuess
              ? [
                  {
                    position: userGuess,
                    label: "Your guess",
                    color: "red" as const,
                  },
                ]
              : []),
            ...(currentItem && message
              ? [
                  {
                    position: currentItem.position,
                    label: currentItem.name,
                    color: "green" as const,
                  },
                ]
              : []),
          ]}
          animateToLocation={Boolean(message)} // Animate when showing answer
        />
      </div>
    </div>
  );
}
