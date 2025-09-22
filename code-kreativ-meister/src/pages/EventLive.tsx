import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LiveChatInterface from "@/components/LiveStream/LiveChatInterface";
import { useAuth } from "@/hooks/useAuth";
import { 
  ArrowLeft, 
  Volume2,
  VolumeX,
  Maximize,
  MessageCircle,
  Heart,
  Share,
  Users,
  Eye,
  Settings,
  MoreHorizontal
} from "lucide-react";

const EventLive = () => {
  const { user } = useAuth();
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { event?: any; venue?: any } };
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewerCount, setViewerCount] = useState(Math.floor(Math.random() * 2000) + 500);
  const [isLiked, setIsLiked] = useState(false);
  const [showChat, setShowChat] = useState(true);
  
  const event = location.state?.event || {
    id: eventId,
    name: "Live Event",
    dj: "DJ Unknown"
  };

  const venue = location.state?.venue;

  useEffect(() => {
    document.title = `🔴 LIVE: ${event.name}`;
    
    // Simulate viewer count changes
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 10) - 5);
    }, 3000);

    return () => clearInterval(interval);
  }, [event.name]);

  // Payment gate: redirect if event requires payment and user has no ticket
  useEffect(() => {
    const paidRooms = new Set(['room1','room3']);
    const isPaidEvent = Boolean(location.state?.event?.isPaid) || paidRooms.has(eventId || '');
    const hasTicket = Boolean((location.state as any)?.ticketCode);
    const paid = Boolean((location.state as any)?.paid);

    if (isPaidEvent && !(hasTicket || paid)) {
      navigate('/rooms', { replace: true });
    }
  }, [location.state, navigate, eventId]);

  const handleShare = () => {
    const url = window.location.href;
    const text = `🔴 Watch LIVE: ${event.name} with ${event.dj}!`;
    
    if (navigator.share) {
      navigator.share({
        title: `LIVE: ${event.name}`,
        text: text,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleGoToChat = () => {
    setShowChat(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      {!isFullscreen && (
        <header className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-red-500">LIVE</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={handleShare} className="text-white hover:bg-white/10">
                <Share className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>
      )}

      {/* Live Video Container */}
      <div className="relative bg-black">
        {/* Mock Video Stream */}
        <div className="aspect-video bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 relative overflow-hidden">
          {/* Animated background to simulate video */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
          
          {/* Video Controls Overlay */}
          <div className="absolute inset-0 flex items-center justify-center group">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
            
            {/* Center Play/Pause Area */}
            <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                <div className="w-6 h-6 bg-white rounded-sm"></div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  <div className="text-sm text-white/80">
                    {event.name} • {event.dj}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleFullscreen}
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Live Stats - Top Right */}
            <div className="absolute top-4 right-4 z-10">
              <div className="flex items-center gap-3">
                <div className="bg-black/50 backdrop-blur rounded-full px-3 py-1 flex items-center gap-1">
                  <Eye className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">{viewerCount.toLocaleString()}</span>
                </div>
                <Badge className="bg-red-500 text-white animate-pulse">
                  🔴 LIVE
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Event Info Bar */}
        {!isFullscreen && (
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/api/placeholder/48/48" />
                  <AvatarFallback>{event.dj?.charAt(0) || 'D'}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-bold text-lg">{event.name}</h2>
                  <p className="text-white/80 text-sm">with {event.dj}</p>
                  {venue && (
                    <p className="text-white/60 text-xs">at {venue.name}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsLiked(!isLiked)}
                  className="text-white hover:bg-white/10"
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      {!isFullscreen && (
        <div className="fixed bottom-20 left-0 right-0 z-50 bg-black/90 backdrop-blur border-t border-white/10 p-4">
          <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
            <Button 
              onClick={handleGoToChat}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Live Chat
            </Button>
            
            <Button 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Users className="h-4 w-4 mr-2" />
              {viewerCount.toLocaleString()} viewers
            </Button>
          </div>
        </div>
      )}

      {/* Floating Chat FAB (mobile) */}
      {!isFullscreen && (
        <div className="fixed bottom-4 right-4 z-50 md:hidden">
          <Button 
            size="icon" 
            className="rounded-full h-12 w-12 bg-gradient-to-r from-purple-600 to-pink-600"
            onClick={handleGoToChat}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}
      <Dialog open={showChat} onOpenChange={setShowChat}>
        <DialogContent className="p-0 w-[100vw] h-[100svh] max-w-[100vw] max-h-[100svh] bg-black border-none">
          <LiveChatInterface
            hostName={event.dj}
            hostAvatar="/placeholder.svg"
            hostFollowers="124k"
            viewerCount={viewerCount}
            isLive
            roomTitle={event.name}
            category="Music"
            creatorUserId={user?.id}
            onEndCall={() => setShowChat(false)}
            onToggleMute={() => setIsMuted(!isMuted)}
            onToggleVideo={() => {}}
            isMuted={isMuted}
            isVideoOn={true}
            eventId={eventId}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventLive;