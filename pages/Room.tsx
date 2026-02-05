import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MessageSquare, Mic, MicOff, Settings, 
  Share2, Play, Pause, Volume2, Volume1, VolumeX, Send, LayoutPanelLeft 
} from 'lucide-react';
import { useAppState } from '../context/StateContext';

const RoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, getRoom, joinRoom, leaveRoom, sendMessage, updateVideoState } = useAppState();
  
  // Local state for immediate UI feedback
  const room = id ? getRoom(id) : undefined;
  
  // Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // UI States
  const [showChat, setShowChat] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Voice Chat States
  const [isMicOn, setIsMicOn] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [activeSpeakers, setActiveSpeakers] = useState<Set<string>>(new Set());

  // Text Chat States
  const [inputValue, setInputValue] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 1. Handle Join/Leave Logic
  useEffect(() => {
    if (id && room) {
      joinRoom(id);
      return () => leaveRoom(id);
    }
  }, [id]);

  // 2. Responsive UI Init
  useEffect(() => {
    if (window.innerWidth < 768) {
      setShowChat(false);
    }
  }, []);

  // 3. Scroll Chat to Bottom
  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    // Handle unread badges
    if (!showChat && room?.messages && room.messages.length > 0) {
        const lastMsg = room.messages[room.messages.length - 1];
        if (lastMsg.userId !== currentUser?.id) {
            setUnreadCount(prev => prev + 1);
        }
    }
  }, [room?.messages, showChat, currentUser]);

  useEffect(() => {
      if (showChat) setUnreadCount(0);
  }, [showChat]);

  // 4. Voice Chat Toggle
  const toggleMic = async () => {
    if (isMicOn) {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      }
      setIsMicOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMediaStream(stream);
        setIsMicOn(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Could not access microphone. Please check permissions.");
      }
    }
  };

  // 5. Simulated Active Speakers
  useEffect(() => {
    const interval = setInterval(() => {
       const newSpeakers = new Set<string>();
       if (isMicOn) newSpeakers.add(currentUser?.id || 'me');
       if (room) {
           room.users.forEach(u => {
               if (u.id !== currentUser?.id && Math.random() > 0.85) newSpeakers.add(u.id);
           });
       }
       setActiveSpeakers(newSpeakers);
    }, 1500);
    return () => clearInterval(interval);
  }, [isMicOn, room, currentUser]);

  // 6. Video Sync: Listen to Global State changes from "others"
  useEffect(() => {
      if (room?.videoState && videoRef.current) {
          const { isPlaying: remoteIsPlaying, currentTime, timestamp } = room.videoState;
          
          // Basic sync logic: only sync if difference is significant to avoid stutter
          const timeDiff = Math.abs(videoRef.current.currentTime - currentTime);
          const isFresh = (Date.now() - timestamp) < 2000; // Only sync recent events

          if (isFresh && timeDiff > 1) {
              videoRef.current.currentTime = currentTime;
          }

          if (isFresh && remoteIsPlaying !== !videoRef.current.paused) {
             if (remoteIsPlaying) videoRef.current.play().catch(() => {});
             else videoRef.current.pause();
             setIsPlaying(remoteIsPlaying);
          }
      }
  }, [room?.videoState]);

  // 7. Video Controls
  const handlePlayPause = () => {
    if (!videoRef.current || !id) return;
    const newState = !isPlaying;
    
    if (newState) videoRef.current.play();
    else videoRef.current.pause();
    
    setIsPlaying(newState);
    updateVideoState(id, newState, videoRef.current.currentTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVol = parseFloat(e.target.value);
      setVolume(newVol);
      if (videoRef.current) {
          videoRef.current.volume = newVol;
      }
      if (newVol === 0) setIsMuted(true);
      else setIsMuted(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !id) return;
    sendMessage(id, inputValue);
    setInputValue('');
  };

  if (!room) return <div className="flex h-screen items-center justify-center text-white">Room not found</div>;

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden relative group/ui">
      
      {/* Top Bar (Overlay) */}
      <div className={`absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center transition-all duration-300 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
        <button onClick={() => navigate('/')} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-3">
           {/* Desktop Chat Toggle */}
          <button 
             onClick={() => setShowChat(!showChat)}
             className={`hidden md:flex p-2 rounded-full text-white hover:bg-white/20 transition-colors ${showChat ? 'bg-white/20' : 'bg-black/40 backdrop-blur-md'}`}
          >
             <LayoutPanelLeft size={20} />
          </button>

          <button className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors">
            <Settings size={20} />
          </button>
          <button className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-500 shadow-lg shadow-blue-500/30 flex gap-2 items-center px-4 transition-transform hover:scale-105">
            <Share2 size={16} />
            <span className="text-xs font-bold hidden sm:inline">Invite</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        
        {/* Video Player */}
        <div className={`relative flex-1 bg-black flex items-center justify-center transition-all duration-300 ${showChat ? 'h-[40vh] md:h-full md:w-2/3' : 'h-full w-full'}`}>
          <video
            ref={videoRef}
            src={room.currentVideoUrl}
            className="w-full h-full object-contain"
            loop
            onClick={() => {
                if(window.innerWidth < 768) setShowChat(prev => !prev)
                else handlePlayPause()
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          
          {/* Custom Controls Overlay */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={handlePlayPause} className="text-white hover:text-blue-400 transition-colors">
                  {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                </button>
                <div className="text-sm font-mono text-gray-300">
                  {/* Mock Time Display */}
                   LIVE
                </div>
              </div>
              
              <div className="flex items-center gap-3 group">
                 <button onClick={() => {
                     setIsMuted(!isMuted);
                     if (videoRef.current) videoRef.current.muted = !isMuted;
                 }} className="text-white hover:text-blue-400 transition-colors">
                    {isMuted || volume === 0 ? <VolumeX size={24} /> : volume < 0.5 ? <Volume1 size={24} /> : <Volume2 size={24} />}
                 </button>
                 {/* Volume Slider */}
                 <div className="w-0 overflow-hidden group-hover:w-24 transition-all duration-300 flex items-center">
                    <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1" 
                        value={isMuted ? 0 : volume} 
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500" 
                    />
                 </div>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-3 w-full h-1 bg-gray-600 rounded-full overflow-hidden cursor-pointer hover:h-2 transition-all group/progress">
              <div className="h-full bg-blue-500 w-[27%] relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md scale-0 group-hover/progress:scale-100 transition-transform"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat / Sidebar */}
        <div className={`bg-rave-dark border-t md:border-t-0 md:border-l border-white/10 flex flex-col transition-all duration-500 ease-in-out
          ${showChat ? 'h-[60vh] md:h-full md:w-[350px] lg:w-[400px] opacity-100 translate-x-0' : 'h-0 opacity-0 overflow-hidden md:w-0 translate-x-full'}`}>
          
          {/* Active Users (Voice Chat Header) */}
          <div className="p-3 border-b border-white/5 bg-rave-mid/30 flex items-center gap-3 overflow-x-auto no-scrollbar">
            {/* Self User */}
            <div className="relative shrink-0 flex flex-col items-center cursor-pointer group" onClick={toggleMic}>
                <div className={`w-12 h-12 rounded-full border-2 relative transition-all ${isMicOn ? 'border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.6)]' : 'border-transparent group-hover:border-white/30'}`}>
                  <img src={currentUser?.avatar} alt="Me" className="w-full h-full rounded-full" />
                  <div className={`absolute bottom-0 right-0 p-1 rounded-full transition-colors ${isMicOn ? 'bg-green-500 text-black' : 'bg-gray-700 text-white'}`}>
                      {isMicOn ? <Mic size={10} /> : <MicOff size={10} />}
                  </div>
                </div>
                <span className="text-[10px] mt-1 text-gray-300">You</span>
            </div>

            {/* Other Users */}
            {room.users.map((u) => {
               if (u.id === currentUser?.id) return null;
               const isSpeaking = activeSpeakers.has(u.id);
               return (
                  <div key={u.id} className="relative shrink-0 flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full border-2 transition-all ${isSpeaking ? 'border-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)] scale-110' : 'border-transparent'}`}>
                      <img src={u.avatar} alt={u.name} className="w-full h-full rounded-full" />
                    </div>
                    <span className="text-[10px] mt-1 text-gray-400">{u.name}</span>
                  </div>
               );
            })}
          </div>

          {/* Messages Area */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {room.messages.map((msg) => {
              if (msg.type === 'system') {
                  return (
                      <div key={msg.id} className="text-center text-[10px] text-gray-500 uppercase tracking-wider my-2">
                          {msg.text}
                      </div>
                  )
              }
              const user = room.users.find(u => u.id === msg.userId) || { name: 'Unknown', avatar: '' };
              const isMe = msg.userId === currentUser?.id;
              return (
                <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                  {!isMe && <img src={user.avatar} className="w-8 h-8 rounded-full bg-gray-700" alt="avatar" />}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm break-words ${isMe ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-200'}`}>
                    <p className="text-[10px] font-bold mb-0.5 opacity-70">{isMe ? 'You' : user.name}</p>
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-rave-dark/95 border-t border-white/5 flex items-center gap-2">
             <form onSubmit={handleSendMessage} className="flex-1 flex gap-2">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Say something..." 
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button type="submit" className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-500 transition-colors">
                  <Send size={18} />
                </button>
             </form>
          </div>
        </div>
      </div>
      
      {/* Mobile Floating Chat Toggle (When chat hidden) */}
      {!showChat && (
        <button 
          onClick={() => setShowChat(true)}
          className="absolute bottom-6 right-6 z-30 w-12 h-12 bg-rave-mid/80 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg border border-white/10 md:hidden animate-bounce"
        >
          <MessageSquare size={20} />
          {unreadCount > 0 && (
             <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-black animate-pulse">
                 {unreadCount}
             </span>
          )}
        </button>
      )}
    </div>
  );
};

export default RoomPage;