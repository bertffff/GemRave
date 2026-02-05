import React from 'react';
import { Home, Users, Settings, PlusCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-rave-dark/90 backdrop-blur-md border-t border-white/10 px-6 py-3 flex justify-between items-center z-50">
      <button 
        onClick={() => navigate('/')}
        className={`flex flex-col items-center ${isActive('/') ? 'text-blue-400' : 'text-gray-400'}`}
      >
        <Home size={24} />
        <span className="text-xs mt-1">Lobby</span>
      </button>

      <button 
        onClick={() => navigate('/create')}
        className="flex flex-col items-center text-rave-neon"
      >
        <PlusCircle size={40} className="filter drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" fill="currentColor" color="#0f0c29" />
      </button>

      <button 
        onClick={() => navigate('/profile')}
        className={`flex flex-col items-center ${isActive('/profile') ? 'text-blue-400' : 'text-gray-400'}`}
      >
        <Users size={24} />
        <span className="text-xs mt-1">Friends</span>
      </button>

      <button 
        onClick={() => navigate('/settings')}
        className={`flex flex-col items-center ${isActive('/settings') ? 'text-blue-400' : 'text-gray-400'}`}
      >
        <Settings size={24} />
        <span className="text-xs mt-1">Settings</span>
      </button>
    </div>
  );
};

export default BottomNav;
