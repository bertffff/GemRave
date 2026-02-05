import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, Globe, Lock, Users, ArrowLeft, PlayCircle } from 'lucide-react';
import { RoomPrivacy } from '../types';
import { useAppState } from '../context/StateContext';

const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const { createRoom } = useAppState();
  
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [privacy, setPrivacy] = useState<RoomPrivacy>(RoomPrivacy.Public);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = () => {
    if (!url || !title) return;
    
    setIsLoading(true);
    // Simulate network delay for realism
    setTimeout(() => {
      const newRoomId = createRoom(title, url, privacy);
      setIsLoading(false);
      navigate(`/room/${newRoomId}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-4 pb-24 px-6 md:pt-10 md:px-0">
      <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
               <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold">Create Room</h1>
          </div>

          <div className="space-y-8 bg-rave-light/20 p-6 rounded-3xl border border-white/5">
            {/* URL Input */}
            <div className="space-y-3">
               <label className="text-sm font-medium text-gray-300 ml-1">Video Link</label>
               <div className="relative group">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rave-neon transition-colors">
                   <Link size={18} />
                 </div>
                 <input 
                   type="text" 
                   value={url}
                   onChange={(e) => setUrl(e.target.value)}
                   placeholder="Paste YouTube, Netflix or Web URL..." 
                   className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-rave-neon transition-all focus:bg-black/40"
                 />
               </div>
               <p className="text-xs text-gray-500 ml-1">Supported: Direct MP4, WebM (YouTube demo only supports direct links in this version)</p>
            </div>

            {/* Title Input */}
            <div className="space-y-3">
               <label className="text-sm font-medium text-gray-300 ml-1">Room Title</label>
               <input 
                 type="text" 
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 placeholder="e.g. Movie Night 🍿" 
                 className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-rave-neon transition-all focus:bg-black/40"
               />
            </div>

            {/* Privacy Selection */}
            <div className="space-y-3">
               <label className="text-sm font-medium text-gray-300 ml-1">Privacy</label>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                 {[
                    { type: RoomPrivacy.Public, icon: Globe, label: 'Public', desc: 'Anyone can join', color: 'blue' },
                    { type: RoomPrivacy.FriendsOnly, icon: Users, label: 'Friends', desc: 'Friends only', color: 'yellow' },
                    { type: RoomPrivacy.Private, icon: Lock, label: 'Private', desc: 'Invite only', color: 'red' }
                 ].map((opt) => (
                     <button 
                        key={opt.type}
                        onClick={() => setPrivacy(opt.type)}
                        className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all hover:bg-white/5 ${privacy === opt.type 
                            ? `bg-rave-mid/50 border-${opt.color}-500/50 shadow-[0_0_15px_rgba(0,0,0,0.2)] scale-[1.02]` 
                            : 'bg-white/5 border-transparent opacity-70'}`}
                     >
                        <div className={`w-10 h-10 rounded-full bg-${opt.color}-500/20 flex items-center justify-center text-${opt.color}-400`}>
                          <opt.icon size={20} />
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-sm">{opt.label}</div>
                          <div className="text-xs text-gray-400">{opt.desc}</div>
                        </div>
                     </button>
                 ))}
               </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
              <button 
                disabled={!url || !title || isLoading}
                onClick={handleCreate}
                className="w-full md:w-auto bg-gradient-to-r from-rave-accent to-rave-neon text-white font-bold py-4 px-12 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:shadow-purple-500/25 transition-all transform hover:-translate-y-1"
              >
                {isLoading ? 'Creating...' : (
                  <>
                    <PlayCircle size={22} />
                    Start Party
                  </>
                )}
              </button>
          </div>
      </div>
    </div>
  );
};

export default CreateRoom;