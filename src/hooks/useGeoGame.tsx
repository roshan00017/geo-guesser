import { useState, useEffect, useCallback } from "react";

const GAME_DURATION = 60; // 60 seconds
const HIGH_SCORE_KEY = "geoGuessHighScore";

export function useGeoGame<
  T extends { name: string; position: [number, number] }
>(items: T[]) {
  const [currentItem, setCurrentItem] = useState<T | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem(HIGH_SCORE_KEY) || "0");
  });
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [userGuess, setUserGuess] = useState<[number, number] | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);

  const selectRandomItem = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * items.length);
    setCurrentItem(items[randomIndex]);
    setUserGuess(null);
    setIsAnswerLocked(false);
  }, [items]);

  // Initialize game
  useEffect(() => {
    if (items.length > 0) selectRandomItem();
  }, [items, selectRandomItem]);

  // Timer logic
  useEffect(() => {
    if (!gameOver && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem(HIGH_SCORE_KEY, score.toString());
      }
    }
  }, [timeLeft, gameOver, score, highScore]);

  const handleGuess = (guess: [number, number]) => {
    if (!currentItem || gameOver || isAnswerLocked) return;

    setUserGuess(guess);
    setIsAnswerLocked(true);
    const distance = calculateDistance(guess, currentItem.position);
    const isCorrect = distance < 10; // 10 degrees threshold

    if (isCorrect) {
      setScore(score + 100);
      setMessage(`Correct! It's ${currentItem.name}`);
    } else {
      setMessage(`Wrong! It's ${currentItem.name}`);
    }

    setTimeout(() => {
      selectRandomItem();
      setMessage("");
    }, 2000);
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameOver(false);
    setMessage("");
    selectRandomItem();
  };

  return {
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
  };
}

function calculateDistance(
  [lat1, lon1]: [number, number],
  [lat2, lon2]: [number, number]
) {
  return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2));
}
