import { COUNTRIES } from "../data/countries";
import { useGeoGame } from "../hooks/useGeoGame";
import { GameUI } from "./GameUI";
import { MapInterface } from "./MapInterface";
import { motion } from "framer-motion";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden"
        >
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-3xl font-bold text-white text-center">
              Geography Challenge
            </h1>
          </div>

          {/* Stats Grid */}
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4 text-center shadow-sm">
                <p className="text-sm text-blue-600 font-semibold uppercase tracking-wide">
                  Score
                </p>
                <p className="text-3xl font-bold text-blue-800">{score}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center shadow-sm">
                <p className="text-sm text-purple-600 font-semibold uppercase tracking-wide">
                  Best
                </p>
                <p className="text-3xl font-bold text-purple-800">
                  {highScore}
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center shadow-sm">
                <p className="text-sm text-green-600 font-semibold uppercase tracking-wide">
                  Time
                </p>
                <p className="text-3xl font-bold text-green-800">{timeLeft}s</p>
              </div>
            </div>

            {/* Current Question */}
            {currentItem && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 mb-6 text-center shadow-sm"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Where is {currentItem.name}?
                </h2>
                <p className="text-gray-600">
                  Click on the map to make your guess
                </p>
              </motion.div>
            )}

            {/* Feedback Message */}
            {message && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={`p-4 rounded-xl mb-6 text-center ${
                  message.includes("Correct")
                    ? "bg-green-100 text-green-800 border-2 border-green-200"
                    : "bg-red-100 text-red-800 border-2 border-red-200"
                }`}
              >
                <p className="font-semibold text-lg">{message}</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Map Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          style={{ height: "60vh", minHeight: "400px" }}
        >
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
            animateToLocation={Boolean(message)}
          />
        </motion.div>
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <h2 className="text-3xl font-bold text-center mb-4">Game Over!</h2>
            <p className="text-xl text-center mb-6">
              Final Score:{" "}
              <span className="font-bold text-blue-600">{score}</span>
            </p>
            <button
              onClick={restartGame}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg"
            >
              Play Again
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
