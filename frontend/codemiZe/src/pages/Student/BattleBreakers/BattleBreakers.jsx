import React, { useState } from 'react';
import GameLayout from '../GameLayout/GameLayout';
import StartGameComponent from '../../../components/Games/StartGameComponent';

export default function BattleBreakers() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartGame = () => {
    setIsLoading(true);
    // Simulate loading time
    setTimeout(() => {
      setIsGameStarted(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <GameLayout>
      {!isGameStarted ? (
        <StartGameComponent
          title="Battle Breakers"
          iconSrc="/Battle breakers logo 1.png"
          iconAlt="Battle Breakers"
          onStart={handleStartGame}
          isLoading={isLoading}
        />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-4xl font-bold text-white mb-6">Battle Breakers</h1>
          {/* Actual game content will go here */}
          <div className="text-white">Game content goes here...</div>
        </div>
      )}
    </GameLayout>
  );
}
