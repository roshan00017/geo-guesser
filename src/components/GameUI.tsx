import { motion } from 'framer-motion'

export function GameUI({
  title,
  currentItem,
  score,
  round,
  totalRounds,
  message,
  gameOver,
  onRestart,
}: {
  title: string
  currentItem: { name: string } | null
  score: number
  round: number
  totalRounds: number
  message: string
  gameOver: boolean
  onRestart: () => void
}) {
  return (
    <>
      <header className="bg-blue-800 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">{title}</h1>
      </header>

      <div className="p-4">
        <div className="flex justify-between bg-white p-3 rounded-lg shadow mb-4">
          <div className="font-semibold">Score: <span className="text-blue-600">{score}</span></div>
          <div className="font-semibold">Round: <span className="text-blue-600">{round}/{totalRounds}</span></div>
        </div>

        {currentItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-4 rounded-lg shadow text-center mb-4"
          >
            <h2 className="text-xl font-semibold">Where is {currentItem.name}?</h2>
          </motion.div>
        )}

        {message && (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`p-3 rounded-lg text-center mb-4 ${
              message.startsWith('Correct') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message}
          </motion.div>
        )}
      </div>

      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white p-6 rounded-lg max-w-md w-full mx-4"
          >
            <h2 className="text-2xl font-bold text-center mb-4">Game Over!</h2>
            <p className="text-center text-lg mb-6">
              Your final score: <span className="font-bold text-blue-600">{score}</span>
            </p>
            <button
              onClick={onRestart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
            >
              Play Again
            </button>
          </motion.div>
        </div>
      )}
    </>
  )
}