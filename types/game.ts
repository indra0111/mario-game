export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface GameObject {
  position: Position;
  width: number;
  height: number;
}

export interface Player extends GameObject {
  velocity: Velocity;
  isJumping: boolean;
  direction: 'left' | 'right';
  state: 'idle' | 'run' | 'jump';
  coins: number;
  lives: number;
}

export interface Platform extends GameObject {
  type: 'normal' | 'brick' | 'question' | 'spike' | 'barrier';
  hasCoin?: boolean;
}

export interface Enemy extends GameObject {
  type: 'goomba' | 'koopa';
  direction: 'left' | 'right';
}

export type SweetType = 'dhokla' | 'mithai' | 'vadapav' | 'jalebi' | 'ladoo';

export interface Sweet {
  id: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  collected: boolean;
  type: SweetType;
}

export type GameState = 'menu' | 'playing' | 'gameOver' | 'victory'; 