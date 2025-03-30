import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface Character {
  position: { x: number; y: number };
  isJumping: boolean;
  isRunning: boolean;
  coins: number;
  lives: number;
}

interface GameContextType {
  character: Character;
  moveForward: () => void;
  jump: () => void;
  coins: number;
  lives: number;
  addCoin: () => void;
  loseLife: () => void;
  characterRef: React.RefObject<Character>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [character, setCharacter] = useState<Character>({
    position: { x: 100, y: 400 },
    isJumping: false,
    isRunning: true,
    coins: 0,
    lives: 3
  });

  const characterRef = useRef<Character>(character);

  // Update ref when character state changes
  useEffect(() => {
    characterRef.current = character;
  }, [character]);

  const moveForward = () => {
    setCharacter(prev => ({
      ...prev,
      position: { ...prev.position, x: prev.position.x + 3 }
    }));
  };

  const jump = () => {
    if (!character.isJumping) {
      setCharacter(prev => ({
        ...prev,
        isJumping: true,
        position: { ...prev.position, y: prev.position.y - 100 }
      }));

      // Reset jump after animation
      setTimeout(() => {
        setCharacter(prev => ({
          ...prev,
          isJumping: false,
          position: { ...prev.position, y: 400 }
        }));
      }, 500);
    }
  };

  const addCoin = () => {
    setCharacter(prev => ({
      ...prev,
      coins: prev.coins + 1
    }));
  };

  const loseLife = () => {
    setCharacter(prev => ({
      ...prev,
      lives: prev.lives - 1
    }));
  };

  // Auto-run effect
  useEffect(() => {
    const interval = setInterval(moveForward, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <GameContext.Provider value={{
      character,
      moveForward,
      jump,
      coins: character.coins,
      lives: character.lives,
      addCoin,
      loseLife,
      characterRef
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}