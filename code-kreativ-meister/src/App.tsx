import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { BottomNav } from "@/components/Layout/BottomNav";
import { StripePaymentProvider } from "@/components/Payment/StripePaymentProvider";
import { WebSocketProvider, WebSocketStatus } from "@/hooks/useWebSocket";
import Index from "./pages/Index";
import Live from "./pages/Live";
import Events from "./pages/Events";
import Venues from "./pages/Venues";
import Wallet from "./pages/Wallet";
import Creator from "./pages/Creator";
import Create from "./pages/Create";
import Inbox from "./pages/Inbox";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Sound from "./pages/Sound";
import VenueDetail from "./pages/VenueDetail";
import EventDetail from "./pages/EventDetail";
import EventLive from "./pages/EventLive";
import EventChat from "./pages/EventChat";
import ProfileVisitors from "./pages/ProfileVisitors";
import Following from "./pages/Following";
import Rooms from "./pages/Rooms";
import RentRoom from "./pages/RentRoom";
import CreateRoom from "./pages/CreateRoom";
import GoLive from "./pages/GoLive";
import Marketing from "./pages/Marketing";
import PrivateChat from "./pages/PrivateChat";
import { Settings } from "./pages/Settings";
import { AdvancedAnalyticsDashboard } from "./components/Analytics/AdvancedAnalyticsDashboard";
import AgeVerification from "./pages/AgeVerification";
import ContentModeration from "./pages/ContentModeration";
import AIAssistant from "./pages/AIAssistant";
import Friends from "./pages/Friends";
import { useEffect } from "react";
import { notificationManager } from "./services/NotificationService";

const queryClient = new QueryClient();

// PWA Installation and Service Worker Setup
const setupPWA = () => {
  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          
          // Handle service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, prompt user to refresh
                  if (confirm('Neue Version verfügbar! Seite neu laden?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }

  // Handle PWA install prompt
  let deferredPrompt: any;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show custom install button/banner
    const installBanner = document.createElement('div');
    installBanner.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; background: #3B82F6; color: white; padding: 12px; text-align: center; z-index: 9999;">
        <span>Code-Kreativ-Meister als App installieren?</span>
        <button id="install-btn" style="margin-left: 12px; background: white; color: #3B82F6; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
          Installieren
        </button>
        <button id="dismiss-btn" style="margin-left: 8px; background: transparent; color: white; border: 1px solid white; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
          Später
        </button>
      </div>
    `;
    document.body.appendChild(installBanner);

    document.getElementById('install-btn')?.addEventListener('click', async () => {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      deferredPrompt = null;
      installBanner.remove();
    });

    document.getElementById('dismiss-btn')?.addEventListener('click', () => {
      installBanner.remove();
    });
  });

  // Handle successful installation
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    // Track installation analytics
  });
};

// Network Status Handler
const NetworkStatusHandler = () => {
  useEffect(() => {
    const handleOnline = () => {
      console.log('App is online');
      // Sync offline data
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SYNC_OFFLINE_DATA'
        });
      }
    };

    const handleOffline = () => {
      console.log('App is offline');
      // Show offline indicator
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null;
};

// Notification Setup
const NotificationSetup = () => {
  useEffect(() => {
    // Initialize notification manager
    const initNotifications = async () => {
      if (notificationManager.isSupported()) {
        const permission = notificationManager.getPermissionStatus();
        if (permission.default) {
          // Show notification permission request after user interaction
          setTimeout(() => {
            const requestPermission = async () => {
              try {
                await notificationManager.subscribe();
                console.log('Notifications enabled');
              } catch (error) {
                console.log('Notifications denied');
              }
            };
            
            // Show a subtle prompt
            const banner = document.createElement('div');
            banner.innerHTML = `
              <div style="position: fixed; bottom: 20px; right: 20px; background: white; border: 1px solid #ccc; border-radius: 8px; padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 9999; max-width: 300px;">
                <h4 style="margin: 0 0 8px 0; font-size: 16px;">Benachrichtigungen aktivieren?</h4>
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #666;">Erhalte Updates zu neuen Nachrichten und Aktivitäten.</p>
                <div style="display: flex; gap: 8px;">
                  <button id="enable-notifications" style="flex: 1; background: #3B82F6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                    Aktivieren
                  </button>
                  <button id="dismiss-notifications" style="flex: 1; background: #f5f5f5; color: #666; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                    Später
                  </button>
                </div>
              </div>
            `;
            document.body.appendChild(banner);

            document.getElementById('enable-notifications')?.addEventListener('click', () => {
              requestPermission();
              banner.remove();
            });

            document.getElementById('dismiss-notifications')?.addEventListener('click', () => {
              banner.remove();
            });

            // Auto-dismiss after 10 seconds
            setTimeout(() => {
              if (banner.parentNode) {
                banner.remove();
              }
            }, 10000);
          }, 3000); // Show after 3 seconds
        }
      }
    };

    initNotifications();
  }, []);

  return null;
};

const App = () => {
  useEffect(() => {
    setupPWA();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StripePaymentProvider>
        <WebSocketProvider userId="current-user-id" autoConnect={true}>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <NetworkStatusHandler />
              <NotificationSetup />
              <WebSocketStatus />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/live" element={<Live />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/venues" element={<Venues />} />
                  <Route path="/wallet" element={<Wallet />} />
                  <Route path="/creators" element={<Creator />} />
                  <Route path="/create" element={<Create />} />
                  <Route path="/inbox" element={<Inbox />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/u/:handle" element={<Profile />} />
                  <Route path="/sound/:slug" element={<Sound />} />
                  <Route path="/venue/:venueId" element={<VenueDetail />} />
                  <Route path="/event/:eventId" element={<EventDetail />} />
                  <Route path="/event/:eventId/live" element={<EventLive />} />
                  <Route path="/event/:eventId/chat" element={<EventChat />} />
                  <Route path="/profile-visitors" element={<ProfileVisitors />} />
                  <Route path="/following" element={<Following />} />
                  <Route path="/rooms" element={<Rooms />} />
                  <Route path="/rent-room" element={<RentRoom />} />
                  <Route path="/create-room" element={<CreateRoom />} />
                  <Route path="/go-live" element={<GoLive />} />
                  <Route path="/marketing" element={<Marketing />} />
                  <Route path="/private-chat/:roomId" element={<PrivateChat />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/analytics" element={<AdvancedAnalyticsDashboard />} />
                  <Route path="/age-verification" element={<AgeVerification />} />
                  <Route path="/content-moderation/:contentId?" element={<ContentModeration />} />
                  <Route path="/ai-assistant" element={<AIAssistant />} />
                  <Route path="/friends" element={<Friends />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <BottomNav />
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </WebSocketProvider>
      </StripePaymentProvider>
    </QueryClientProvider>
  );
};

export default App;
