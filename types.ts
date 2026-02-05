export interface UserStats {
  hoursWatched: number;
  roomsCreated: number;
  roomsJoined: number;
  moviesWatched: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number; // timestamp
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  isSpeaking?: boolean;
  stats?: UserStats;
  achievements?: Achievement[];
}

export interface Message {
  id: string;
  userId: string;
  text: string;
  timestamp: number;
  type: 'text' | 'system';
}

export enum RoomPrivacy {
  Public = 'public',
  Private = 'private',
  FriendsOnly = 'friends_only'
}

export interface VideoState {
  isPlaying: boolean;
  currentTime: number;
  timestamp: number; // When this state was updated
}

export interface Room {
  id: string;
  title: string;
  thumbnail: string;
  serviceIcon: string; // e.g., 'youtube', 'netflix'
  users: User[];
  currentVideoUrl?: string;
  viewerCount: number;
  privacy?: RoomPrivacy;
  messages: Message[]; // Chat history
  videoState: VideoState; // For sync
}

export enum ServiceType {
  YouTube = 'YouTube',
  Netflix = 'Netflix',
  Web = 'Web',
  Drive = 'Drive',
  Vimeo = 'Vimeo',
  Twitch = 'Twitch'
}