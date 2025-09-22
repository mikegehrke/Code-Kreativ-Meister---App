import { Link, useLocation } from "react-router-dom";
import { Home, Search, Video, User, Zap, Plus, MessageSquare } from "lucide-react";

export const BottomNav = () => {
  const { pathname } = useLocation();
  
  // Always use dark theme for TikTok-like appearance
  const navBg = 'bg-black/90';
  const borderColor = 'border-white/10';
  
  const navItems = [
    { to: '/', icon: Home, label: 'Für dich' },
    { to: '/following', icon: User, label: 'Folge ich' }, 
    { to: '/live', icon: Video, label: 'Live' },
    { to: '/rooms', icon: Search, label: 'Rooms' },
    { to: '/creators', icon: User, label: 'Profil' },
  ];

  return (
    <>
      {/* Main Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 z-30 ${navBg} backdrop-blur-md border-t ${borderColor}`}>
        <div className="flex items-center justify-between py-1.5 px-4 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
          {/* Left side nav items */}
          <div className="flex items-center justify-around flex-1">
            {navItems.slice(0, 2).map(({ to, icon: Icon, label }) => {
              const active = pathname === to;
              return (
                <Link 
                  key={to}
                  to={to} 
                  className="flex flex-col items-center space-y-0.5 p-1 transition-all duration-200 flex-1 max-w-[60px]"
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-white/60'} transition-colors duration-200`} />
                  <span className={`text-[9px] font-medium ${active ? 'text-white' : 'text-white/60'} transition-colors duration-200`}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
          
          {/* Center Plus Button */}
          <div className="flex-shrink-0 mx-2">
            <Link
              to="/create"
              className="relative flex flex-col items-center p-1"
            >
              <div className="h-8 w-8 bg-white rounded-md flex items-center justify-center">
                <Plus className="h-5 w-5 text-black" />
              </div>
            </Link>
          </div>
          
          {/* Right side nav items */}
          <div className="flex items-center justify-around flex-1">
            {navItems.slice(2).map(({ to, icon: Icon, label }) => {
              const active = pathname === to;
              return (
                <Link 
                  key={to}
                  to={to} 
                  className="flex flex-col items-center space-y-0.5 p-1 transition-all duration-200 flex-1 max-w-[60px]"
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-white/60'} transition-colors duration-200`} />
                  <span className={`text-[9px] font-medium ${active ? 'text-white' : 'text-white/60'} transition-colors duration-200`}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};