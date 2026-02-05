import React from 'react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { User, Clock, Film, Star, Trophy, LayoutGrid, LogOut } from 'lucide-react';
import { useAppState } from '../context/StateContext';

const Profile: React.FC = () => {
  const { currentUser, logout } = useAppState();

  if (!currentUser) return null;

  const stats = currentUser.stats || { hoursWatched: 0, roomsCreated: 0, roomsJoined: 0, moviesWatched: 0 };

  // Generate dynamic chart data based on user stats
  // In a real app, this would come from a historical log.
  // Here we distribute the total hours loosely across the week for visual consistency.
  const totalHours = stats.hoursWatched;
  const base = Math.max(1, Math.floor(totalHours / 7));
  const data = [
    { name: 'Mon', hours: base * 0.5 },
    { name: 'Tue', hours: base * 1.2 },
    { name: 'Wed', hours: base * 0.8 },
    { name: 'Thu', hours: base * 1.5 },
    { name: 'Fri', hours: base * 2 },
    { name: 'Sat', hours: base * 2.5 },
    { name: 'Sun', hours: base * 1.8 },
  ];

  return (
    <div className="pb-24 pt-8 px-4 md:px-8 max-w-5xl mx-auto">
      {/* Header Profile */}
      <div className="flex flex-col items-center mb-10 md:mb-14">
        <div className="relative group cursor-pointer">
           <img 
              src={currentUser.avatar}
              alt="Profile" 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-rave-mid shadow-2xl object-cover group-hover:opacity-90 transition-all group-hover:scale-105" 
           />
           <div className="absolute bottom-1 right-1 w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full border-4 border-rave-dark"></div>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold mt-4 md:mt-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">{currentUser.name}</h1>
        <p className="text-gray-400 text-sm md:text-base mt-1">@user_{currentUser.id.slice(-4)}</p>
        
        <button 
            onClick={logout}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-sm text-red-400 hover:bg-white/10 transition-colors"
        >
            <LogOut size={14} />
            Logout
        </button>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
         {/* Total Hours */}
        <div className="bg-rave-light/50 p-4 md:p-6 rounded-2xl flex items-center gap-4 border border-white/5 hover:border-white/10 transition-colors">
           <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
               <Clock size={24} />
           </div>
           <div>
               <div className="text-2xl font-bold">{stats.hoursWatched}h</div>
               <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide">Watch Time</div>
           </div>
        </div>

        {/* Rooms Created */}
        <div className="bg-rave-light/50 p-4 md:p-6 rounded-2xl flex items-center gap-4 border border-white/5 hover:border-white/10 transition-colors">
           <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
               <LayoutGrid size={24} />
           </div>
           <div>
               <div className="text-2xl font-bold">{stats.roomsCreated}</div>
               <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide">Created</div>
           </div>
        </div>

        {/* Movies Watched */}
        <div className="bg-rave-light/50 p-4 md:p-6 rounded-2xl flex items-center gap-4 border border-white/5 hover:border-white/10 transition-colors">
           <div className="p-3 bg-pink-500/20 rounded-xl text-pink-400">
               <Film size={24} />
           </div>
           <div>
               <div className="text-2xl font-bold">{stats.moviesWatched}</div>
               <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide">Movies</div>
           </div>
        </div>

        {/* Rooms Joined */}
        <div className="bg-rave-light/50 p-4 md:p-6 rounded-2xl flex items-center gap-4 border border-white/5 hover:border-white/10 transition-colors">
           <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
               <User size={24} />
           </div>
           <div>
               <div className="text-2xl font-bold">{stats.roomsJoined}</div>
               <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide">Joined</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Achievements Section */}
          <div className="bg-rave-light/30 rounded-2xl p-6 border border-white/5">
             <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Trophy size={20} className="text-yellow-500" />
                    Achievements
                </h3>
                <span className="text-xs font-bold text-gray-400 bg-white/5 px-2 py-1 rounded-md">{currentUser.achievements?.length || 0} / 50</span>
             </div>
             
             <div className="grid grid-cols-3 gap-3">
                {currentUser.achievements?.map((ach) => (
                    <div key={ach.id} className="bg-white/5 rounded-xl p-3 flex flex-col items-center text-center border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-colors cursor-help">
                        <div className="text-3xl mb-2 filter drop-shadow-lg transform group-hover:scale-110 transition-transform">{ach.icon}</div>
                        <div className="text-xs font-bold truncate w-full">{ach.title}</div>
                    </div>
                ))}
                {/* Locked Achievement Placeholder */}
                <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center text-center border border-white/5 opacity-40 grayscale">
                    <div className="text-3xl mb-2">🔒</div>
                    <div className="text-xs font-bold">Mystery</div>
                </div>
             </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-rave-light/30 rounded-2xl p-6 border border-white/5">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Star size={20} className="text-rave-neon" />
              Weekly Activity
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis 
                    dataKey="name" 
                    tick={{fill: '#9ca3af', fontSize: 12}} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                    itemStyle={{color: '#fff'}}
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  />
                  <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 5 ? '#a855f7' : '#475569'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Profile;