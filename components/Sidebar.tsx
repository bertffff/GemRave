import React from 'react';
import { Home, Users, Settings, PlusCircle, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppState } from '../context/StateContext';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAppState();

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ path, icon: Icon, label, isPrimary = false }: any) => (
    <button 
      onClick={() => navigate(path)}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
        ${isActive(path) 
          ? 'bg-white/10 text-blue-400 font-medium shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }
        ${isPrimary ? 'mt-4 bg-gradient-to-r from-rave-accent to-rave-neon text-white hover:opacity-90 shadow-lg' : ''}
      `}
    >
      <Icon size={isPrimary ? 24 : 20} className={isPrimary ? '' : isActive(path) ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'} />
      <span className={isPrimary ? 'font-bold' : ''}>{label}</span>
      {isActive(path) && !isPrimary && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
      )}
    </button>
  );

  return (
    <div className="w-72 flex-shrink-0 bg-rave-dark/80 backdrop-blur-xl border-r border-white/5 flex flex-col p-6 h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rave-accent to-rave-neon flex items-center justify-center shadow-lg">
          <div className="w-0 h-0 border-l-[10px] border-l-white border-y-[6px] border-y-transparent ml-1"></div>
        </div>
        <div>
           <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">TeleRave</h1>
           <span className="text-xs text-gray-500 font-mono tracking-widest">DESKTOP BETA</span>
        </div>
      </div>

      {/* Nav Items */}
      <div className="space-y-2 flex-1">
        <NavItem path="/" icon={Home} label="Lobby" />
        <NavItem path="/profile" icon={Users} label="Friends & Stats" />
        <NavItem path="/settings" icon={Settings} label="Settings" />
        
        <div className="pt-4 pb-2">
           <div className="h-px bg-white/10 mx-2"></div>
        </div>

        <NavItem path="/create" icon={PlusCircle} label="Create Room" isPrimary />
      </div>

      {/* User Mini Profile */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
           <img src={currentUser?.avatar} className="w-10 h-10 rounded-full border border-white/10" alt="Profile" />
           <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{currentUser?.name}</div>
              <div className="text-xs text-green-400 flex items-center gap-1">
                 <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                 Online
              </div>
           </div>
           <button onClick={logout} className="text-gray-500 hover:text-red-400 transition-colors">
              <LogOut size={16} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;