import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import CreateRoom from './pages/CreateRoom';
import Login from './pages/Login';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import { StateProvider, useAppState } from './context/StateContext';

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const isRoomPage = location.pathname.startsWith('/room/');
  const showNav = !isRoomPage;

  return (
    <div className="min-h-screen bg-rave-dark text-white font-sans antialiased selection:bg-purple-500 selection:text-white">
      <div className="flex min-h-screen relative overflow-hidden bg-gradient-to-br from-rave-dark via-[#131130] to-rave-dark">
         
         {/* Desktop Sidebar */}
         {showNav && (
            <div className="hidden md:block sticky top-0 h-screen z-40">
              <Sidebar />
            </div>
         )}

         {/* Main Content */}
         <main className={`flex-1 relative flex flex-col ${isRoomPage ? 'h-screen overflow-hidden' : 'min-h-screen overflow-y-auto overflow-x-hidden'}`}>
             {!isRoomPage && (
                <>
                  <div className="absolute top-0 left-0 w-full h-96 bg-purple-600/10 blur-[120px] pointer-events-none rounded-full -translate-y-1/2"></div>
                  <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 blur-[100px] pointer-events-none rounded-full translate-y-1/2"></div>
                </>
             )}
             
             <div className={`${isRoomPage ? 'h-full' : 'max-w-7xl mx-auto w-full'}`}>
                {children}
             </div>
             
             {showNav && <BottomNav />}
         </main>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentUser } = useAppState();
  
  // Telegram Integration Init
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#0f0c29'); 
    }
  }, []);

  if (!currentUser) {
    return <Login />;
  }

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:id" element={<Room />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/create" element={<CreateRoom />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

const App: React.FC = () => {
  return (
    <StateProvider>
      <AppContent />
    </StateProvider>
  );
};

export default App;