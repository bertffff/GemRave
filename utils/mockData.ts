import { Room, ServiceType, User, Achievement, RoomPrivacy } from '../types';

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'First Watch', description: 'Watched your first movie together', icon: '🍿', unlockedAt: Date.now() - 10000000 },
  { id: '2', title: 'Party Host', description: 'Created 5 rooms', icon: '🏠', unlockedAt: Date.now() - 5000000 },
  { id: '3', title: 'Night Owl', description: 'Watched a movie after 2 AM', icon: '🦉', unlockedAt: undefined },
  { id: '4', title: 'Marathoner', description: 'Watched 5 hours in a row', icon: '🏃‍♂️', unlockedAt: undefined },
];

export const MOCK_USERS: User[] = [
  { 
    id: '1', 
    name: 'Alice', 
    avatar: 'https://picsum.photos/id/1011/50/50',
    stats: { hoursWatched: 120, roomsCreated: 10, roomsJoined: 45, moviesWatched: 30 },
    achievements: [MOCK_ACHIEVEMENTS[0]]
  },
  { 
    id: '2', 
    name: 'Bob', 
    avatar: 'https://picsum.photos/id/1012/50/50',
    stats: { hoursWatched: 45, roomsCreated: 2, roomsJoined: 12, moviesWatched: 8 } 
  },
  { id: '3', name: 'Charlie', avatar: 'https://picsum.photos/id/1025/50/50' },
  { id: '4', name: 'Dave', avatar: 'https://picsum.photos/id/1005/50/50' },
  { id: '5', name: 'Eve', avatar: 'https://picsum.photos/id/1027/50/50' },
  { 
    id: 'me', 
    name: 'Alex Raider', 
    avatar: 'https://picsum.photos/id/64/150/150',
    stats: { hoursWatched: 124, roomsCreated: 15, roomsJoined: 238, moviesWatched: 42 },
    achievements: [MOCK_ACHIEVEMENTS[0], MOCK_ACHIEVEMENTS[1]]
  }
];

export const MOCK_ROOMS: Room[] = [
  {
    id: 'room-1',
    title: 'Gravity Falls Marathon',
    thumbnail: 'https://picsum.photos/id/10/400/225',
    serviceIcon: 'youtube',
    users: [MOCK_USERS[0], MOCK_USERS[1], MOCK_USERS[2]],
    viewerCount: 51,
    currentVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    privacy: RoomPrivacy.Public,
    messages: [],
    videoState: { isPlaying: false, currentTime: 0, timestamp: Date.now() }
  },
  {
    id: 'room-2',
    title: 'SpongeBob Season 1',
    thumbnail: 'https://picsum.photos/id/14/400/225',
    serviceIcon: 'netflix',
    users: [MOCK_USERS[3], MOCK_USERS[4]],
    viewerCount: 26,
    currentVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    privacy: RoomPrivacy.Public,
    messages: [],
    videoState: { isPlaying: false, currentTime: 0, timestamp: Date.now() }
  },
  {
    id: 'room-3',
    title: 'Chernobyl: Exclusion Zone',
    thumbnail: 'https://picsum.photos/id/18/400/225',
    serviceIcon: 'web',
    users: [MOCK_USERS[0], MOCK_USERS[4]],
    viewerCount: 13,
    currentVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    privacy: RoomPrivacy.FriendsOnly,
    messages: [],
    videoState: { isPlaying: false, currentTime: 0, timestamp: Date.now() }
  },
  {
    id: 'room-4',
    title: 'Late Night Music Mix',
    thumbnail: 'https://picsum.photos/id/20/400/225',
    serviceIcon: 'youtube',
    users: [MOCK_USERS[1]],
    viewerCount: 115,
    currentVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    privacy: RoomPrivacy.Public,
    messages: [],
    videoState: { isPlaying: false, currentTime: 0, timestamp: Date.now() }
  }
];

export const SERVICES = [
  { name: ServiceType.YouTube, icon: 'Play' },
  { name: ServiceType.Netflix, icon: 'Film' },
  { name: ServiceType.Web, icon: 'Globe' },
  { name: ServiceType.Twitch, icon: 'Twitch' },
  { name: ServiceType.Drive, icon: 'HardDrive' },
  { name: ServiceType.Vimeo, icon: 'Video' },
];