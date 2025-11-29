
export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  prize: string;
  difficulty: 'easy' | 'medium' | 'hard';
  // New fields for study organization
  subject: string;
  chapter: string;
  lesson: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Stored in plain text for this demo only
  role: 'admin' | 'user';
  totalEarnings: number; // Score/Money accumulated
  avatar?: string; // Base64 image string
  volume?: number; // Audio volume preference (0-100)
  theme?: 'light' | 'dark'; // Theme preference
}

export enum GameState {
  AUTH = 'AUTH',
  START = 'START',
  SELECTION = 'SELECTION',
  ADMIN = 'ADMIN',
  PLAYING = 'PLAYING',
  VICTORY = 'VICTORY',
  GAME_OVER = 'GAME_OVER',
}

export interface Lifelines {
  fiftyFifty: boolean;
  askAudience: boolean;
  callFriend: boolean;
}

export interface MoneyTier {
  level: number;
  amount: string;
  isSafeHaven: boolean;
  value: number; // Numeric value for scoring
}

export interface GameSelection {
  subject: string;
  chapter: string;
  lesson: string;
}