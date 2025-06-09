import { useState, useEffect, useCallback } from "react";

const GAME_DURATION = 60; // 60 seconds game duration
const HIGH_SCORE_KEY = "geoGuessHighScore";
const ZOOM_LEVEL = {
  DEFAULT: 2,
  GUESS: 4,
};

interface GeoItem {
  name: string;
  position: [number, number];
}

export function useGeoGame<T extends GeoItem>(items: T[]) {
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
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [mapZoom, setMapZoom] = useState(ZOOM_LEVEL.DEFAULT);

  const selectRandomItem = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * items.length);
    setCurrentItem(items[randomIndex]);
    setUserGuess(null);
    setIsAnswerLocked(false);
    setMapCenter([20, 0]);
    setMapZoom(ZOOM_LEVEL.DEFAULT);
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
      // Update high score if current score is higher
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem(HIGH_SCORE_KEY, score.toString());
      }
    }
  }, [timeLeft, gameOver, score, highScore]);

  const calculateDistance = (
    [lat1, lon1]: [number, number],
    [lat2, lon2]: [number, number]
  ): number => {
    // Simple distance calculation (you might want to use a more accurate formula)
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2));
  };

  const handleGuess = (guess: [number, number]) => {
    if (!currentItem || gameOver || isAnswerLocked) return;

    setUserGuess(guess);
    setIsAnswerLocked(true);
    const distance = calculateDistance(guess, currentItem.position);
    const isCorrect = distance < 10; // 10 degrees threshold for correct guess

    if (isCorrect) {
      setScore(score + 100);
      setMessage(`Correct! That's ${currentItem.name}`);
      setMapCenter(currentItem.position);
      setMapZoom(ZOOM_LEVEL.GUESS);
    } else {
      setMessage(`Wrong! That was ${currentItem.name}`);
      setMapCenter(currentItem.position);
      setMapZoom(ZOOM_LEVEL.GUESS);
    }

    // Show the result for 3 seconds before moving to next question
    setTimeout(() => {
      selectRandomItem();
      setMessage("");
    }, 3000);
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameOver(false);
    setMessage("");
    setUserGuess(null);
    setIsAnswerLocked(false);
    setMapCenter([20, 0]);
    setMapZoom(ZOOM_LEVEL.DEFAULT);
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
    mapCenter,
    mapZoom,
  };
}
