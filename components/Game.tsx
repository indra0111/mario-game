"use client"
import { useEffect, useRef, useState } from 'react';
import { Player, Platform, Enemy, GameState, Sweet, SweetType } from '../types/game';
import GameMenu from './GameMenu';
import { createPlaceholderSprite, createMarioSprite, createRunningMarioSprite } from '../utils/createSprites';
import Obstacles from './Obstacles';
import Sweets from './Sweets';
import Background from './Background';

const GRAVITY = 0.5;
const JUMP_FORCE = -15;
const MOVEMENT_SPEED = 5;
const AUTO_MOVE_SPEED = 3;
const OBSTACLE_SPAWN_RATE = 0.005;
const BACKGROUND_SCROLL_SPEED = 0.5; // Slower than foreground elements

const OBSTACLE_TYPES = ['brick', 'spike', 'barrier'] as const;
const OBSTACLE_PATTERNS = ['single', 'double', 'triple', 'wall'] as const;

type ObstacleType = typeof OBSTACLE_TYPES[number];
type ObstaclePattern = typeof OBSTACLE_PATTERNS[number];

interface ObstacleConfig {
  type: ObstacleType;
  pattern: ObstaclePattern;
  width: number;
  height: number;
  color: string;
}

const OBSTACLE_CONFIGS: Record<ObstacleType, ObstacleConfig> = {
  brick: {
    type: 'brick',
    pattern: 'single',
    width: 40,
    height: 40,
    color: '#8B4513'
  },
  spike: {
    type: 'spike',
    pattern: 'single',
    width: 24,
    height: 24,
    color: '#FF0000'
  },
  barrier: {
    type: 'barrier',
    pattern: 'single',
    width: 40,
    height: 40,
    color: '#4A4A4A'
  }
};

// Move createSprite outside of createGameSprites
const createSprite = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  return { canvas, ctx };
};

// Move createObstacleSprite outside of createGameSprites
const createObstacleSprite = (type: ObstacleType) => {
  const { canvas, ctx } = createSprite(32, 32);
  const config = OBSTACLE_CONFIGS[type];
  
  ctx.fillStyle = config.color;
  
  switch (type) {
    case 'brick':
      // Draw brick pattern
      ctx.fillRect(0, 0, config.width, config.height);
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, config.width, config.height);
      break;
      
    case 'spike':
      // Draw spike
      ctx.beginPath();
      ctx.moveTo(config.width / 2, 0);
      ctx.lineTo(config.width, config.height);
      ctx.lineTo(0, config.height);
      ctx.closePath();
      ctx.fill();
      break;
      
    case 'barrier':
      // Draw barrier with warning stripes
      ctx.fillRect(0, 0, config.width, config.height);
      ctx.fillStyle = '#FF0000';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(0, i * 8, config.width, 4);
      }
      break;
  }
  
  return canvas.toDataURL();
};

const createGameSprites = () => {
  // Create player sprites
  const createPlayerSprite = (state: 'idle' | 'run' | 'jump') => {
    const { canvas, ctx } = createSprite(96, 160);
    
    // Set background to transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw character body
    ctx.fillStyle = '#FFA07A'; // Light salmon for skin tone
    
    // Head
    ctx.beginPath();
    ctx.arc(48, 40, 20, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillRect(35, 60, 26, 40);

    // Arms with different positions based on state
    if (state === 'run') {
      // Running arms
      ctx.fillRect(25, 65, 10, 30);
      ctx.fillRect(61, 65, 10, 30);
    } else if (state === 'jump') {
      // Jumping arms
      ctx.fillRect(20, 60, 10, 35);
      ctx.fillRect(66, 60, 10, 35);
    } else {
      // Idle arms
      ctx.fillRect(30, 65, 10, 30);
      ctx.fillRect(56, 65, 10, 30);
    }

    // Legs with different positions based on state
    if (state === 'run') {
      // Running legs
      ctx.fillRect(40, 100, 10, 50);
      ctx.fillRect(46, 100, 10, 50);
    } else if (state === 'jump') {
      // Jumping legs
      ctx.fillRect(35, 100, 10, 45);
      ctx.fillRect(51, 100, 10, 45);
    } else {
      // Idle legs
      ctx.fillRect(40, 100, 10, 45);
      ctx.fillRect(46, 100, 10, 45);
    }

    // Face
    ctx.fillStyle = '#000';
    
    // Eyes
    ctx.beginPath();
    ctx.arc(42, 35, 3, 0, Math.PI * 2);
    ctx.arc(54, 35, 3, 0, Math.PI * 2);
    ctx.fill();

    // Mouth based on state
    if (state === 'jump') {
      // Surprised mouth
      ctx.beginPath();
      ctx.arc(48, 45, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (state === 'run') {
      // Determined mouth
      ctx.beginPath();
      ctx.moveTo(42, 45);
      ctx.lineTo(54, 45);
      ctx.stroke();
    } else {
      // Normal smile
      ctx.beginPath();
      ctx.arc(48, 45, 5, 0, Math.PI);
      ctx.fill();
    }

    // Hair
    ctx.fillStyle = '#4A4A4A';
    ctx.beginPath();
    ctx.arc(48, 25, 22, 0, Math.PI * 2);
    ctx.fill();

    // Clothes
    ctx.fillStyle = '#4169E1'; // Royal blue for clothes
    ctx.fillRect(35, 60, 26, 40);

    // Add some details
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 60, 26, 40);

    return canvas.toDataURL();
  };

  // Create platform sprites
  const createPlatformSprite = (width: number, height: number, color: string) => {
    const { canvas, ctx } = createSprite(width, height);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    return canvas.toDataURL();
  };

  // Create coin sprite
  const createCoinSprite = () => {
    const { canvas, ctx } = createSprite(16, 16);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(8, 8, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 2;
    ctx.stroke();
    return canvas.toDataURL();
  };

  return {
  player: {
      idle: createPlayerSprite('idle'),
      run: createPlayerSprite('run'),
      jump: createPlayerSprite('jump')
  },
  platforms: {
      normal: createPlatformSprite(64, 16, '#4CAF50'),
      brick: createPlatformSprite(32, 32, '#8B4513'),
      question: createPlatformSprite(32, 32, '#FFD700')
    },
    coin: createCoinSprite(),
    obstacle: createObstacleSprite('brick')
  };
};

// Add this new component at the top of the file, after the imports
const PlayerCharacter = ({ position, state, direction }: { 
  position: { x: number, y: number }, 
  state: 'idle' | 'run' | 'jump',
  direction: 'left' | 'right'
}) => {
  return (
    <div 
      className={`absolute transition-transform duration-100 ${direction === 'left' ? 'scale-x-[-1]' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '96px',
        height: '160px',
        transform: `${direction === 'left' ? 'scaleX(-1)' : ''} ${state === 'jump' ? 'translateY(-20px)' : ''}`
      }}
    >
      {/* Character Body */}
      <div className="relative w-full h-full">
        {/* Head */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#FFA07A] rounded-full">
          {/* Face */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
            {/* Eyes */}
            <div className="absolute top-1/3 left-1/4 w-1.5 h-1.5 bg-black rounded-full"></div>
            <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-black rounded-full"></div>
            
            {/* Mouth */}
            <div className={`absolute bottom-1/4 left-1/2 -translate-x-1/2 ${
              state === 'jump' ? 'w-2.5 h-2.5 bg-black rounded-full' :
              state === 'run' ? 'w-3 h-0.5 bg-black' :
              'w-3 h-1.5 bg-black rounded-b-full'
            }`}></div>
          </div>
        </div>

        {/* Body */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-6 h-10 bg-[#4169E1] rounded-sm"></div>

        {/* Arms */}
        <div className={`absolute top-12 ${
          state === 'run' ? 'left-0 right-0' :
          state === 'jump' ? '-left-1 -right-1' :
          'left-1 right-1'
        } flex justify-between`}>
          <div className={`w-2.5 h-8 bg-[#FFA07A] rounded-full ${
            state === 'run' ? 'animate-run-arm-left' :
            state === 'jump' ? 'animate-jump-arm-left' :
            ''
          }`}></div>
          <div className={`w-2.5 h-8 bg-[#FFA07A] rounded-full ${
            state === 'run' ? 'animate-run-arm-right' :
            state === 'jump' ? 'animate-jump-arm-right' :
            ''
          }`}></div>
        </div>

        {/* Legs */}
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${
          state === 'run' ? 'w-4' :
          state === 'jump' ? 'w-6' :
          'w-4'
        } flex justify-between`}>
          <div className={`w-2.5 h-12 bg-[#FFA07A] rounded-full ${
            state === 'run' ? 'animate-run-leg-left' :
            state === 'jump' ? 'animate-jump-leg-left' :
            ''
          }`}></div>
          <div className={`w-2.5 h-12 bg-[#FFA07A] rounded-full ${
            state === 'run' ? 'animate-run-leg-right' :
            state === 'jump' ? 'animate-jump-leg-right' :
            ''
          }`}></div>
        </div>
      </div>
    </div>
  );
};

// Add background element types
type BackgroundElementType = 'TEMPLE' | 'TREE' | 'CLOUD';

interface BackgroundElementConfig {
  width: number;
  height: number;
  color?: string;
  roofColor?: string;
  shadowColor?: string;
  trunkColor?: string;
  leavesColor?: string;
}

const BACKGROUND_ELEMENTS: Record<BackgroundElementType, BackgroundElementConfig> = {
  TEMPLE: {
    width: 200,
    height: 300,
    color: '#8B4513',
    roofColor: '#CD853F',
    shadowColor: '#654321'
  },
  TREE: {
    width: 100,
    height: 150,
    trunkColor: '#8B4513',
    leavesColor: '#228B22',
    shadowColor: '#006400'
  },
  CLOUD: {
    width: 120,
    height: 40,
    color: '#FFFFFF',
    shadowColor: '#E0E0E0'
  }
};

// Add sweet types constant
const SWEET_TYPES: SweetType[] = ['dhokla', 'mithai', 'vadapav', 'jalebi', 'ladoo'];

// Add sweet weightages constant
const SWEET_WEIGHTAGES: Record<SweetType, number> = {
  dhokla: 1,
  mithai: 2,
  vadapav: 3,
  jalebi: 4,
  ladoo: 5
};

// Add obstacle spawn interval constant
const OBSTACLE_SPAWN_INTERVAL = 8000; // Spawn obstacles every 2 seconds

// Add coupon code constant
const VICTORY_COUPON_CODE = "SWEET20";

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>('menu');
  const [highScore, setHighScore] = useState(0);
  const [spritesLoaded, setSpritesLoaded] = useState(false);
  const spritesRef = useRef<{ [key: string]: HTMLImageElement }>({});
  
  const [player, setPlayer] = useState<Player>({
    position: { x: 100, y: 100 },
    width: 32,
    height: 48,
    velocity: { x: 0, y: 0 },
    isJumping: false,
    direction: 'right',
    state: 'idle',
    coins: 0,
    lives: 3
  });

  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      position: { x: 0, y: 500 },
      width: 800,
      height: 32,
      type: 'normal',
    },
    {
      position: { x: 300, y: 400 },
      width: 100,
      height: 32,
      type: 'question',
      hasCoin: true,
    }
  ]);

  const [coins, setCoins] = useState<Sweet[]>([]);
  const coinsRef = useRef<Sweet[]>([]);
  const obstaclesRef = useRef<Platform[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);

  // Add state for obstacles
  const [obstacles, setObstacles] = useState<Platform[]>([]);
  
  // Add game score
  const [distance, setDistance] = useState(0);

  // Use refs for frequently updating values
  const playerRef = useRef<Player>(player);
  const gameStateRef = useRef<GameState>(gameState);
  const animationFrameRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  // Add keyboard state tracking
  const keys = useRef<{ [key: string]: boolean }>({});

  // Add background state
  const [backgroundElements, setBackgroundElements] = useState<Array<{
    type: BackgroundElementType;
    position: { x: number; y: number };
    width: number;
    height: number;
  }>>([]);

  // Add last obstacle spawn time ref
  const lastObstacleSpawnRef = useRef<number>(0);

  // Add victory state
  const [showVictory, setShowVictory] = useState(false);

  // Add function to spawn background elements
  const spawnBackgroundElement = () => {
    const types: BackgroundElementType[] = ['TEMPLE', 'TREE', 'CLOUD'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    // Calculate position based on type
    let y = 0;
    switch (type) {
      case 'TEMPLE':
        y = 200; // Temples appear higher in the background
        break;
      case 'TREE':
        y = 300; // Trees appear at medium height
        break;
      case 'CLOUD':
        y = 100; // Clouds appear at the top
        break;
    }

    const element = {
      type,
      position: { x: 800, y },
      width: BACKGROUND_ELEMENTS[type].width,
      height: BACKGROUND_ELEMENTS[type].height
    };

    setBackgroundElements(prev => [...prev, element]);
  };

  // Add function to draw background elements
  const drawBackgroundElements = (ctx: CanvasRenderingContext2D) => {
    backgroundElements.forEach(element => {
      const config = BACKGROUND_ELEMENTS[element.type];
      
      switch (element.type) {
        case 'TEMPLE':
          // Draw temple base
          ctx.fillStyle = config.color || '#8B4513';
          ctx.fillRect(
            element.position.x,
            element.position.y,
            element.width,
            element.height
          );

          // Draw temple roof
          ctx.fillStyle = config.roofColor || '#CD853F';
          ctx.beginPath();
          ctx.moveTo(element.position.x - 20, element.position.y);
          ctx.lineTo(element.position.x + element.width + 20, element.position.y);
          ctx.lineTo(element.position.x + element.width / 2, element.position.y - 60);
          ctx.closePath();
          ctx.fill();

          // Draw temple details
          ctx.strokeStyle = config.shadowColor || '#654321';
          ctx.lineWidth = 2;
          ctx.strokeRect(
            element.position.x,
            element.position.y,
            element.width,
            element.height
          );

          // Draw temple entrance
          ctx.fillStyle = '#000000';
          ctx.fillRect(
            element.position.x + element.width / 2 - 20,
            element.position.y + element.height - 80,
            40,
            60
          );
          break;

        case 'TREE':
          // Draw tree trunk
          ctx.fillStyle = config.trunkColor || '#8B4513';
          ctx.fillRect(
            element.position.x + element.width / 2 - 10,
            element.position.y + element.height - 40,
            20,
            40
          );

          // Draw tree leaves
          ctx.fillStyle = config.leavesColor || '#228B22';
          ctx.beginPath();
          ctx.arc(
            element.position.x + element.width / 2,
            element.position.y + element.height - 60,
            30,
            0,
            Math.PI * 2
          );
          ctx.fill();

          // Draw tree shadow
          ctx.fillStyle = config.shadowColor || '#006400';
          ctx.beginPath();
          ctx.arc(
            element.position.x + element.width / 2,
            element.position.y + element.height - 40,
            25,
            0,
            Math.PI * 2
          );
          ctx.fill();
          break;

        case 'CLOUD':
          // Draw cloud body
          ctx.fillStyle = config.color || '#FFFFFF';
          ctx.beginPath();
          ctx.arc(element.position.x + 30, element.position.y + 20, 20, 0, Math.PI * 2);
          ctx.arc(element.position.x + 60, element.position.y + 20, 20, 0, Math.PI * 2);
          ctx.arc(element.position.x + 90, element.position.y + 20, 20, 0, Math.PI * 2);
          ctx.fill();

          // Draw cloud shadow
          ctx.fillStyle = config.shadowColor || '#E0E0E0';
          ctx.beginPath();
          ctx.arc(element.position.x + 30, element.position.y + 25, 20, 0, Math.PI * 2);
          ctx.arc(element.position.x + 60, element.position.y + 25, 20, 0, Math.PI * 2);
          ctx.arc(element.position.x + 90, element.position.y + 25, 20, 0, Math.PI * 2);
          ctx.fill();
          break;
      }
    });
  };

  // Load sprites when component mounts
  useEffect(() => {
    console.log("use loadSprites")
    const loadSprites = async () => {
      const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      };

      try {
        const sprites = createGameSprites();
        
        // Load player sprites
        spritesRef.current.playerIdle = await loadImage(sprites.player.idle);
        spritesRef.current.playerRun = await loadImage(sprites.player.run);
        spritesRef.current.playerJump = await loadImage(sprites.player.jump);

        // Load platform sprites
        spritesRef.current.platformNormal = await loadImage(sprites.platforms.normal);
        spritesRef.current.platformBrick = await loadImage(sprites.platforms.brick);
        spritesRef.current.platformQuestion = await loadImage(sprites.platforms.question);

        // Load coin sprite
        spritesRef.current.coin = await loadImage(sprites.coin);

        // Load obstacle sprites
        for (const type of OBSTACLE_TYPES) {
          spritesRef.current[`obstacle${type}`] = await loadImage(createObstacleSprite(type));
        }

        setSpritesLoaded(true);
      } catch (error) {
        console.error('Failed to load sprites:', error);
      }
    };

    loadSprites();
  }, []);

  // Update the refs when state changes
  useEffect(() => {
    console.log("useEffect player")
    playerRef.current = player;
  }, [player]);

  useEffect(() => {
    console.log("use Initial12 Gamestate in useEffect", gameState)
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    coinsRef.current = coins;
  }, [coins]);

  useEffect(() => {
    obstaclesRef.current = obstacles;
  }, [obstacles]);

  // Update the startGame function
  const startGame = () => {
    setGameState('playing');
    setPlayer({
      position: { x: 100, y: 100 },
      width: 32,
      height: 48,
      velocity: { x: AUTO_MOVE_SPEED, y: 0 },
      isJumping: false,
      direction: 'right',
      state: 'run',
      coins: 0,
      lives: 3
    });

    // Reset obstacles, coins, and background elements
    setObstacles([]);
    setBackgroundElements([]);
    setDistance(0);
    
    // Set up initial sweets with proper spacing
    const initialSweets = Array.from({ length: 5 }, (_, i) => ({
      id: `sweet-${i}`,
      position: { 
        x: 300 + (i * 150),
        y: 350 - (i % 2 * 50)
      },
      width: 32,
      height: 32,
      collected: false,
      type: SWEET_TYPES[Math.floor(Math.random() * SWEET_TYPES.length)]
    }));
    setCoins(initialSweets);
  };

  // Handle keyboard events
  useEffect(() => {
    console.log("useEffect player jumping")
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key] = true;
      
      // Handle jump only on keydown to prevent holding space
      if (e.key === ' ' && !player.isJumping) {
        setPlayer(prev => ({
          ...prev,
          velocity: { ...prev.velocity, y: JUMP_FORCE },
          isJumping: true,
          state: 'jump'
        }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [player.isJumping]);

  // Update the spawnObstacle function
  const spawnObstacle = (currentTime: number) => {
    if (currentTime - lastObstacleSpawnRef.current >= OBSTACLE_SPAWN_INTERVAL) {
      lastObstacleSpawnRef.current = currentTime;
      
      const obstacleType = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
      const pattern = OBSTACLE_PATTERNS[Math.floor(Math.random() * OBSTACLE_PATTERNS.length)];
      const config = OBSTACLE_CONFIGS[obstacleType];
      
      let obstacles: Platform[] = [];
      const baseY = Math.random() * 300 + 200;
      const baseX = 800;

      switch (pattern) {
        case 'single':
          obstacles.push({
            position: { x: baseX, y: baseY },
            width: config.width,
            height: config.height,
            type: obstacleType
          });
          break;

        case 'double':
          obstacles.push(
            {
              position: { x: baseX, y: baseY },
              width: config.width,
              height: config.height,
              type: obstacleType
            },
            {
              position: { x: baseX + config.width + 10, y: baseY },
              width: config.width,
              height: config.height,
              type: obstacleType
            }
          );
          break;

        case 'triple':
          obstacles.push(
            {
              position: { x: baseX, y: baseY },
              width: config.width,
              height: config.height,
              type: obstacleType
            },
            {
              position: { x: baseX + config.width + 10, y: baseY },
              width: config.width,
              height: config.height,
              type: obstacleType
            },
            {
              position: { x: baseX + (config.width + 10) * 2, y: baseY },
              width: config.width,
              height: config.height,
              type: obstacleType
            }
          );
          break;

        case 'wall':
          // Create a vertical wall of obstacles
          const wallHeight = 3;
          for (let i = 0; i < wallHeight; i++) {
            obstacles.push({
              position: {
                x: baseX, 
                y: baseY - (config.height + 5) * i 
              },
              width: config.width,
              height: config.height,
              type: obstacleType
            });
          }
          break;
      }

      setObstacles(prev => [...prev, ...obstacles]);
    }
  };

  // Update the game loop
  useEffect(() => {
    if (gameState !== 'playing' || !spritesLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let lastTime = 0;
    const fps = 60;
    const frameInterval = 1000 / fps;

    const gameLoop = (timestamp: number) => {
      // Check if game is still playing
      if (gameStateRef.current !== 'playing') {
        return;
      }

      const deltaTime = timestamp - lastTime;

      if (deltaTime >= frameInterval) {
        lastTime = timestamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        ctx.fillStyle = '#6B8CFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Spawn and update background elements
        if (Math.random() < 0.01) { // 1% chance to spawn a background element each frame
          spawnBackgroundElement();
        }

        // Move background elements
        setBackgroundElements(prev => prev
          .map(element => ({
            ...element,
            position: {
              ...element.position,
              x: element.position.x - BACKGROUND_SCROLL_SPEED
            }
          }))
          .filter(element => element.position.x > -element.width)
        );

        // Draw background elements
        drawBackgroundElements(ctx);

        // Spawn obstacles with fixed interval
        spawnObstacle(timestamp);

        // Update game elements
        updateGameElements();

        // Update player position
        updatePlayerPosition();

        // Check collisions
        checkCollisions();

        // Draw game elements
        drawPlayer(ctx);
        drawPlatforms(ctx);
        drawUI(ctx);

        // Update distance
        setDistance(prev => prev + AUTO_MOVE_SPEED);
      }

      if (gameStateRef.current === 'playing') {
        requestAnimationFrame(gameLoop);
      }
    };

    const animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [gameState, spritesLoaded]);

  // Update the checkCollisions function
  const checkCollisions = (forceUpdate: boolean = false) => {
    const newPlayer = { ...playerRef.current };
    let isOnPlatform = false;

    // Platform collisions
    [...platforms, ...obstacles].forEach((platform) => {
      if (
        newPlayer.position.y + newPlayer.height >= platform.position.y &&
        newPlayer.position.y + newPlayer.height <= platform.position.y + platform.height &&
        newPlayer.position.x + newPlayer.width >= platform.position.x &&
        newPlayer.position.x <= platform.position.x + platform.width
      ) {
        // Hit obstacle - game over
        if (obstacles.includes(platform)) {
          // Update high score if current distance is higher
          if (distance > highScore) {
            setHighScore(distance);
          }
          // Set game state to game over
          setGameState('gameOver');
          // Stop player movement
          newPlayer.velocity = { x: 0, y: 0 };
          setPlayer(newPlayer);
          playerRef.current = newPlayer;
          return;
        }

        // Land on platform
        newPlayer.position.y = platform.position.y - newPlayer.height;
        newPlayer.velocity.y = 0;
        newPlayer.isJumping = false;
        isOnPlatform = true;
      }
    });

    // Check for sweet collisions
    const currentSweets = coinsRef.current;
    const touchedSweets = currentSweets.filter(sweet => {
      if (sweet.collected) return false;

      const horizontalCollision = 
        newPlayer.position.x < sweet.position.x + sweet.width &&
        newPlayer.position.x + newPlayer.width > sweet.position.x;
      
      const verticalCollision = 
        newPlayer.position.y < sweet.position.y + sweet.height &&
        newPlayer.position.y + newPlayer.height > sweet.position.y;

      return horizontalCollision && verticalCollision;
    });

    if (touchedSweets.length > 0) {
      // Calculate total points from collected sweets
      const totalPoints = touchedSweets.reduce((sum, sweet) => 
        sum + SWEET_WEIGHTAGES[sweet.type], 0);

      // Immediately remove collected sweets
      const remainingSweets = currentSweets.filter(sweet => 
        !touchedSweets.some(touched => 
          touched.position.x === sweet.position.x && 
          touched.position.y === sweet.position.y
        )
      );

      // Update sweets state
      setCoins(remainingSweets);
      coinsRef.current = remainingSweets;

      // Update player's coin count with weighted points
      const newCoins = newPlayer.coins + totalPoints;
      newPlayer.coins = newCoins;

      // Check for victory condition
      if (newCoins >= 50 && !showVictory) {
        setShowVictory(true);
        setGameState('victory');
        newPlayer.velocity = { x: 0, y: 0 };
      }
    }

    if (!isOnPlatform && newPlayer.velocity.y >= 0) {
      newPlayer.isJumping = true;
    }

    if(!forceUpdate) {
      setPlayer(newPlayer);
      playerRef.current = newPlayer;
    }
  };

  // Update the updateGameElements function
  const updateGameElements = () => {
    // Move and filter obstacles
    setObstacles(prev => prev
      .map(obstacle => ({
        ...obstacle,
        position: {
          ...obstacle.position,
          x: obstacle.position.x - AUTO_MOVE_SPEED
        }
      }))
      .filter(obstacle => obstacle.position.x > -obstacle.width)
    );

    // Move sweets
    const currentSweets = coinsRef.current;
    const movedSweets = currentSweets
      .map(sweet => ({
        ...sweet,
        position: {
          ...sweet.position,
          x: sweet.position.x - AUTO_MOVE_SPEED
        }
      }))
      .filter(sweet => sweet.position.x > -sweet.width);

    // Spawn new sweets if needed
    const lastSweetX = Math.max(...movedSweets.map(s => s.position.x), 800);
    let updatedSweets = [...movedSweets];
    
    if (lastSweetX < 1000) {
      const newSweets = Array.from({ length: 2 }, (_, i) => ({
        id: `sweet-${Date.now()}-${i}`,
        position: {
          x: lastSweetX + 200 + (i * 150),
          y: Math.random() * 200 + 150
        },
        width: 32,
        height: 32,
        collected: false,
        type: SWEET_TYPES[Math.floor(Math.random() * SWEET_TYPES.length)]
      }));
      updatedSweets = [...movedSweets, ...newSweets];
    }

    setCoins(updatedSweets);
    coinsRef.current = updatedSweets;
  };

  // Drawing functions
  const drawPlayer = (ctx: CanvasRenderingContext2D) => {
    if (!spritesLoaded) return;

    // Instead of drawing the player sprite, we'll render the PlayerCharacter component
    // The component will be rendered by React's DOM system
  };

  const drawPlatforms = (ctx: CanvasRenderingContext2D) => {
    if (!spritesLoaded) return;
    console.log("Plat in drawPlatforms", platforms)
    platforms.forEach((platform) => {
      const sprite = platform.type === 'normal' 
        ? spritesRef.current.platformNormal
        : platform.type === 'brick'
          ? spritesRef.current.platformBrick
          : spritesRef.current.platformQuestion;

      ctx.drawImage(
        sprite,
        platform.position.x,
        platform.position.y,
        platform.width,
        platform.height
      );
    });
  };

  const drawUI = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
  };

  // Update the updatePlayerPosition function
  const updatePlayerPosition = () => {
    const newPlayer = { ...playerRef.current };

    // Handle horizontal movement
    let newVelocityX = newPlayer.velocity.x;
    if (keys.current['ArrowLeft']) {
      newVelocityX = -MOVEMENT_SPEED;
    } else if (keys.current['ArrowRight']) {
      newVelocityX = MOVEMENT_SPEED;
    } else {
      newVelocityX *= 0.8;
    }

    // Update player direction and state
    newPlayer.direction = newVelocityX < 0 ? 'left' : 
                         newVelocityX > 0 ? 'right' : 
                         newPlayer.direction;

    newPlayer.state = newPlayer.isJumping ? 'jump' :
                     Math.abs(newVelocityX) > 0.1 ? 'run' : 
                     'idle';

    // Update position
    newPlayer.position.x += newVelocityX;
    newPlayer.position.y += newPlayer.velocity.y;
    newPlayer.velocity.y += GRAVITY;

    // Bounds checking
    newPlayer.position.x = Math.max(0, Math.min(newPlayer.position.x, 800 - newPlayer.width));
    newPlayer.position.y = Math.max(0, Math.min(newPlayer.position.y, 600 - newPlayer.height));

    // Update velocity
    newPlayer.velocity.x = newVelocityX;

    // Batch state updates
    setPlayer(newPlayer);
    playerRef.current = newPlayer;
  };

  return (
    <div className="relative overflow-hidden">
      <canvas
        ref={canvasRef}
        width={1300}
        height={600}
        className="rounded-lg shadow-2xl overflow-hidden"
      />
      
      {/* Add the PlayerCharacter component */}
      {gameState === 'playing' && (
        <>
          <PlayerCharacter
            position={player.position}
            state={player.state}
            direction={player.direction}
          />
          <Obstacles obstacles={obstacles} />
          <Sweets coins={coins} />
          <Background />
        </>
      )}
      
      {!spritesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-white text-2xl">Loading sprites...</div>
        </div>
      )}
      
      {spritesLoaded && gameState === 'menu' && (
        <GameMenu onStart={startGame} highScore={highScore} />
      )}
      
      {gameState === 'playing' && (
        <div className="absolute top-4 left-4 flex gap-4">
          <div className="bg-black/50 text-white px-4 py-2 rounded-full">
            Coins: {player.coins}/50
          </div>
          <div className="bg-black/50 text-white px-4 py-2 rounded-full">
            Lives: {player.lives}
          </div>
          <div className="bg-black/50 text-white px-4 py-2 rounded-full">
            Distance: {Math.floor(distance)}m
          </div>
        </div>
      )}
      
      {gameState === 'gameOver' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
          <h2 className="text-4xl font-bold text-white mb-4">Game Over</h2>
          <p className="text-xl text-yellow-400 mb-4">Score: {player.coins}</p>
          <button
            onClick={startGame}
            className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {gameState === 'victory' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-purple-900/90 to-pink-900/90">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl transform transition-all duration-500 hover:scale-105">
            <div className="text-center">
              <h2 className="text-5xl font-bold text-white mb-6 animate-bounce">🎉 Victory! 🎉</h2>
              <p className="text-2xl text-yellow-300 mb-8">Congratulations! You've collected 50 coins!</p>
              
              <div className="bg-white/20 p-6 rounded-xl mb-8">
                <p className="text-lg text-white mb-2">Your Coupon Code:</p>
                <div className="bg-white/30 p-4 rounded-lg">
                  <code className="text-3xl font-mono font-bold text-yellow-300 tracking-wider">
                    {VICTORY_COUPON_CODE}
                  </code>
                </div>
                <p className="text-sm text-white/80 mt-2">20% off on your next purchase!</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                >
                  Play Again
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(VICTORY_COUPON_CODE);
                    alert('Coupon code copied to clipboard!');
                  }}
                  className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  Copy Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 