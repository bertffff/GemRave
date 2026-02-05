import React from 'react';
import { 
  Languages, Moon, Bell, Shield, EyeOff, FileText, 
  ChevronRight, Mic, Volume2 
} from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="pb-24 pt-8 px-4 md:px-0">
      <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Preferences</h1>

          {/* Section: General */}
          <div className="space-y-8">
            <div className="space-y-2">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-2">General</h2>
                <div className="bg-rave-light/30 rounded-2xl overflow-hidden border border-white/5 backdrop-blur-sm">
                  <SettingItem icon={<Languages />} label="Language" value="English" hasArrow />
                  <SettingItem icon={<Moon />} label="Theme" value="Dark - Rave" hasArrow />
                </div>
            </div>

            <div className="space-y-2">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-2">Privacy & Alerts</h2>
                <div className="bg-rave-light/30 rounded-2xl overflow-hidden border border-white/5 backdrop-blur-sm">
                   <SettingItem icon={<Bell />} label="Notifications" hasToggle defaultChecked />
                   <SettingItem icon={<Shield />} label="Privacy & Invite Limits" hasToggle />
                   <SettingItem icon={<EyeOff />} label="Hide NSFW Content" hasToggle defaultChecked />
                </div>
            </div>

            {/* Section: Audio */}
            <div className="space-y-2">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-2">Audio & Voice</h2>
                <div className="bg-rave-light/30 rounded-2xl p-5 border border-white/5 backdrop-blur-sm">
                   <div className="space-y-6">
                      <div className="flex items-center gap-4">
                         <div className="p-2 bg-white/5 rounded-lg">
                             <Volume2 size={20} className="text-gray-300" />
                         </div>
                         <div className="flex-1">
                            <div className="flex justify-between text-sm mb-2">
                               <span className="font-medium">Master Volume</span>
                               <span className="text-gray-400">80%</span>
                            </div>
                            <input type="range" className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="p-2 bg-white/5 rounded-lg">
                             <Mic size={20} className="text-gray-300" />
                         </div>
                         <div className="flex-1">
                            <div className="text-sm mb-2 font-medium">Microphone Input</div>
                            <select className="w-full bg-black/30 border border-white/10 text-sm rounded-xl p-3 text-gray-300 focus:outline-none focus:border-blue-500 transition-colors">
                               <option>Default - MacBook Pro Mic</option>
                               <option>AirPods Pro</option>
                            </select>
                         </div>
                      </div>
                   </div>
                </div>
            </div>

            <div className="bg-rave-light/30 rounded-2xl overflow-hidden border border-white/5 backdrop-blur-sm">
               <SettingItem icon={<FileText />} label="Terms of Service" hasArrow />
               <div className="p-6 text-center">
                  <p className="text-xs text-gray-500">TeleRave v1.0.2 (Beta)</p>
               </div>
            </div>
          </div>
      </div>
    </div>
  );
};

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  hasArrow?: boolean;
  hasToggle?: boolean;
  defaultChecked?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, label, value, hasArrow, hasToggle, defaultChecked }) => (
  <div className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 active:bg-white/10 cursor-pointer transition-colors">
    <div className="flex items-center gap-4">
      <div className="text-gray-400">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-sm text-gray-400">{value}</span>}
      {hasArrow && <ChevronRight size={18} className="text-gray-500" />}
      {hasToggle && (
        <div className={`w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${defaultChecked ? 'bg-blue-600' : 'bg-gray-700'}`}>
           <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 shadow-sm ${defaultChecked ? 'left-6' : 'left-1'}`}></div>
        </div>
      )}
    </div>
  </div>
);

export default Settings;
