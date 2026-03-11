
export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  BOSS = 'BOSS'
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  avatarUrl: string;
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  lastLogin: string;
}

export interface Concept {
  id: string;
  name: string;
  description: string;
  mastery: number; // 1-5
  connections: string[]; // IDs of related concepts
  status: 'WEAK' | 'LEARNING' | 'STRONG' | 'MASTERED';
}

export interface LearningMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'text' | 'youtube';
  content: string;
  summary: string;
  concepts: Concept[];
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: Difficulty;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface UserStats {
  accuracy: number;
  speed: number;
  retention: number;
  consistency: number;
  totalQuizzes: number;
  weakTopics: string[];
  xpHistory: { name: string; xp: number }[];
}

export interface AppState {
  user: UserProfile | null;
  materials: LearningMaterial[];
  stats: UserStats;
  isDarkMode: boolean;
  notificationsEnabled: boolean;
  chatHistory: ChatMessage[];
}
