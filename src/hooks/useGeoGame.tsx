import { useState, useEffect } from 'react'

export function useGeoGame<T extends { name: string; position: [number, number] }>(
  items: T[],
  rounds: number
) {
  const [currentItem, setCurrentItem] = useState<T | null>(null)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')
  const [userGuess, setUserGuess] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (items.length > 0) selectRandomItem()
  }, [items])

  const selectRandomItem = () => {
    const randomIndex = Math.floor(Math.random() * items.length)
    setCurrentItem(items[randomIndex])
    setUserGuess(null)
  }

  const handleGuess = (guess: [number, number]) => {
    if (!currentItem) return
    
    setUserGuess(guess)
    const distance = calculateDistance(guess, currentItem.position)
    const isCorrect = distance < (rounds === 10 ? 10 : 5) // Adjust threshold based on game mode
    
    if (isCorrect) {
      setScore(score + 100)
      setMessage(`Correct! It's ${currentItem.name}`)
    } else {
      setMessage(`Wrong! Try again. (${currentItem.name})`)
    }
    
    if (round >= rounds) {
      setGameOver(true)
    } else {
      setTimeout(() => {
        selectRandomItem()
        setRound(round + 1)
        setMessage('')
      }, 2000)
    }
  }

  return {
    currentItem,
    score,
    round,
    gameOver,
    message,
    userGuess,
    handleGuess,
    selectRandomItem,
    restartGame: () => {
      setScore(0)
      setRound(1)
      setGameOver(false)
      selectRandomItem()
    },
  }
}

function calculateDistance([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]) {
  // Simple distance calculation for demo
  return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2))
}