import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { Play } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAppState();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      login(name);
    }
  };

  return (
    <div className="min-h-screen bg-rave-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="z-10 w-full max-w-sm text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-rave-accent to-rave-neon rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)] mb-8 transform rotate-12">
           <Play fill="white" size={40} className="text-white transform -rotate-12" />
        </div>
        
        <h1 className="text-4xl font-bold mb-2">TeleRave</h1>
        <p className="text-gray-400 mb-10">Watch together, anywhere.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What's your name?" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-center text-white text-lg placeholder-gray-500 focus:outline-none focus:border-rave-neon focus:bg-white/10 transition-all"
              autoFocus
            />
          </div>
          
          <button 
            type="submit" 
            disabled={!name.trim()}
            className="w-full bg-white text-black font-bold py-4 rounded-2xl text-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;