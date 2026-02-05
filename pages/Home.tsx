import React from 'react';
import { Search, Globe, Youtube, Tv, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/StateContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { rooms } = useAppState();

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'youtube': return <Youtube size={16} />;
      case 'netflix': return <Tv size={16} />;
      case 'web': return <Globe size={16} />;
      default: return <Video size={16} />;
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 md:px-8">
      {/* Header / Search */}
      <div className="sticky top-0 z-30 bg-rave-dark/80 backdrop-blur-md py-4 -mx-4 px-4 md:-mx-8 md:px-8 border-b border-white/5 md:border-none">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search video, movie or URL..." 
            className="w-full bg-white/10 border border-white/5 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all hover:bg-white/15"
          />
        </div>
      </div>

      {/* Services Row */}
      <div className="flex gap-6 overflow-x-auto py-8 no-scrollbar md:flex-wrap">
        {['YouTube', 'VK Video', 'Netflix', 'Disney+', 'Web', 'Drive', 'Twitch'].map((s) => (
          <div key={s} className="flex flex-col items-center min-w-[70px] space-y-2 opacity-80 hover:opacity-100 transition-all cursor-pointer group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-blue-500/20">
              {s === 'YouTube' ? <Youtube className="text-red-500 w-8 h-8" /> : 
               s === 'Web' ? <Globe className="text-blue-400 w-8 h-8" /> : 
               s === 'Netflix' ? <span className="text-red-600 font-bold text-3xl">N</span> :
               <Video className="text-white w-8 h-8" />}
            </div>
            <span className="text-xs font-medium text-gray-300 whitespace-nowrap group-hover:text-white">{s}</span>
          </div>
        ))}
      </div>

      {/* Public Rooms Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Globe size={20} className="text-blue-400" />
          <h2 className="text-xl font-bold">Active Rooms</h2>
        </div>
        <div className="flex items-center gap-2">
           <label className="text-sm text-gray-400 cursor-pointer select-none">Hide NSFW</label>
           <div className="w-9 h-5 bg-rave-mid rounded-full relative cursor-pointer hover:bg-rave-mid/80 transition-colors">
              <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
           </div>
        </div>
      </div>

      {/* Room Grid - Responsive Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <div 
            key={room.id} 
            onClick={() => navigate(`/room/${room.id}`)}
            className="group relative bg-rave-light/50 rounded-2xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all hover:translate-y-[-4px] shadow-lg hover:shadow-2xl"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video">
              <img src={room.thumbnail} alt={room.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs border border-white/10">
                 {getServiceIcon(room.serviceIcon)}
                 <span className="capitalize font-medium">{room.serviceIcon}</span>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Video fill="white" size={24} />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-bold text-white truncate text-lg">{room.title}</h3>
              
              <div className="flex justify-between items-center mt-4">
                {/* Overlapping Avatars */}
                <div className="flex items-center pl-2">
                  {room.users.slice(0, 4).map((user, idx) => (
                    <img 
                      key={user.id} 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-9 h-9 rounded-full border-2 border-rave-light -ml-3 z-10 hover:z-20 hover:scale-110 transition-transform" 
                      style={{ zIndex: 5 - idx }}
                    />
                  ))}
                  <div className="w-9 h-9 rounded-full bg-rave-mid border-2 border-rave-light -ml-3 z-0 flex items-center justify-center text-[10px] font-bold">
                    +{room.viewerCount}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;