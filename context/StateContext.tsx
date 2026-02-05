import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Room, User, Message, RoomPrivacy, VideoState, ServiceType } from '../types';
import { MOCK_ROOMS, MOCK_USERS } from '../utils/mockData';

interface StateContextType {
  currentUser: User | null;
  rooms: Room[];
  login: (name: string) => void;
  logout: () => void;
  createRoom: (title: string, url: string, privacy: RoomPrivacy) => string;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendMessage: (roomId: string, text: string) => void;
  updateVideoState: (roomId: string, isPlaying: boolean, currentTime: number) => void;
  getRoom: (roomId: string) => Room | undefined;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

// Initial Mock State with proper typing for new fields
const INITIAL_ROOMS: Room[] = MOCK_ROOMS.map(r => ({
  ...r,
  messages: [],
  videoState: { isPlaying: false, currentTime: 0, timestamp: Date.now() }
}));

// Safe storage helper
const safeStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('LocalStorage access denied, using memory state.');
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // Ignore write errors
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // Ignore write errors
    }
  }
};

export const StateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from safeStorage or use initial mock
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = safeStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = safeStorage.getItem('rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  // Persist updates
  useEffect(() => {
    if (currentUser) safeStorage.setItem('currentUser', JSON.stringify(currentUser));
    else safeStorage.removeItem('currentUser');
  }, [currentUser]);

  useEffect(() => {
    safeStorage.setItem('rooms', JSON.stringify(rooms));
  }, [rooms]);

  const login = (name: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      stats: { hoursWatched: 12, roomsCreated: 0, roomsJoined: 0, moviesWatched: 3 },
      achievements: []
    };
    setCurrentUser(newUser);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const createRoom = (title: string, url: string, privacy: RoomPrivacy) => {
    if (!currentUser) throw new Error("Must be logged in");
    
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      title,
      currentVideoUrl: url,
      thumbnail: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&q=80', // Generic cinema placeholder
      serviceIcon: 'web', // Simplified for demo
      users: [currentUser],
      viewerCount: 1,
      privacy,
      messages: [{
        id: 'sys-init',
        userId: 'system',
        text: `Room created by ${currentUser.name}`,
        timestamp: Date.now(),
        type: 'system'
      }],
      videoState: { isPlaying: false, currentTime: 0, timestamp: Date.now() }
    };

    setRooms(prev => [newRoom, ...prev]);
    
    // Update stats
    setCurrentUser(prev => prev ? ({
      ...prev,
      stats: { ...prev.stats!, roomsCreated: prev.stats!.roomsCreated + 1 }
    }) : null);

    return newRoom.id;
  };

  const joinRoom = (roomId: string) => {
    if (!currentUser) return;
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        // Prevent duplicate join
        if (room.users.some(u => u.id === currentUser.id)) return room;
        return {
          ...room,
          users: [...room.users, currentUser],
          viewerCount: room.viewerCount + 1
        };
      }
      return room;
    }));
    
    // Update user stats
    setCurrentUser(prev => prev ? ({
        ...prev,
        stats: { ...prev.stats!, roomsJoined: prev.stats!.roomsJoined + 1 }
    }) : null);
  };

  const leaveRoom = (roomId: string) => {
    if (!currentUser) return;
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          users: room.users.filter(u => u.id !== currentUser.id),
          viewerCount: Math.max(0, room.viewerCount - 1)
        };
      }
      return room;
    }));
  };

  const sendMessage = (roomId: string, text: string) => {
    if (!currentUser) return;
    const msg: Message = {
      id: `msg-${Date.now()}`,
      userId: currentUser.id,
      text,
      timestamp: Date.now(),
      type: 'text'
    };

    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return { ...room, messages: [...room.messages, msg] };
      }
      return room;
    }));
  };

  const updateVideoState = (roomId: string, isPlaying: boolean, currentTime: number) => {
     setRooms(prev => prev.map(room => {
         if (room.id === roomId) {
             return {
                 ...room,
                 videoState: { isPlaying, currentTime, timestamp: Date.now() }
             };
         }
         return room;
     }));
  };

  const getRoom = (roomId: string) => rooms.find(r => r.id === roomId);

  return (
    <StateContext.Provider value={{
      currentUser,
      rooms,
      login,
      logout,
      createRoom,
      joinRoom,
      leaveRoom,
      sendMessage,
      updateVideoState,
      getRoom
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(StateContext);
  if (!context) throw new Error("useAppState must be used within StateProvider");
  return context;
};