import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Lock, Clock, Crown, Users, Heart, Gift, Send, Sparkles, Star, Diamond } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified?: boolean;
    tier?: 'bronze' | 'silver' | 'gold' | 'diamond';
  };
  message: string;
  timestamp: Date;
  type: 'message' | 'gift' | 'join' | 'like';
  giftValue?: number;
}

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    user: { name: 'Sarah_M', avatar: '/placeholder.svg', verified: true, tier: 'gold' },
    message: 'Hallo und willkommen! 🎉',
    timestamp: new Date(),
    type: 'message'
  },
  {
    id: '2', 
    user: { name: 'Alex_K', avatar: '/placeholder.svg', tier: 'silver' },
    message: 'sent a gift',
    timestamp: new Date(),
    type: 'gift',
    giftValue: 50
  },
  {
    id: '3',
    user: { name: 'Mike_R', avatar: '/placeholder.svg' },
    message: 'joined the stream',
    timestamp: new Date(),
    type: 'join'
  },
  {
    id: '4',
    user: { name: 'Lisa_W', avatar: '/placeholder.svg', tier: 'diamond' },
    message: 'Amazing stream! Keep it up! 💖',
    timestamp: new Date(),
    type: 'message'
  }
];

const getTierColor = (tier?: string) => {
  switch (tier) {
    case 'diamond': return 'from-blue-400 to-purple-600';
    case 'gold': return 'from-yellow-400 to-orange-500';
    case 'silver': return 'from-gray-300 to-gray-500';
    case 'bronze': return 'from-orange-400 to-red-500';
    default: return 'from-gray-400 to-gray-600';
  }
};

const getTierIcon = (tier?: string) => {
  switch (tier) {
    case 'diamond': return <Diamond className="w-3 h-3" />;
    case 'gold': return <Crown className="w-3 h-3" />;
    case 'silver': return <Star className="w-3 h-3" />;
    default: return null;
  }
};

export default function PrivateChat() {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [likes, setLikes] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get room data from navigation state
  const roomData = location.state || {};
  const {
    hostName = "Creator",
    hostAvatar = "/placeholder.svg",
    packageType = "Privat Chat",
    duration = 10,
    message = "",
    isPrivate = true
  } = roomData;

  // Initialize timer
  useEffect(() => {
    if (duration > 0) {
      setTimeRemaining(duration * 60); // Convert minutes to seconds
    }
  }, [duration]);

  // Countdown timer
  useEffect(() => {
    if (timeRemaining > 0 && isActive) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false);
            toast.error("Private Chat-Zeit ist abgelaufen!");
            // Auto-redirect after 5 seconds
            setTimeout(() => {
              navigate(-1);
            }, 5000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, isActive, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndChat = () => {
    setIsActive(false);
    toast.success("Private Chat beendet");
    navigate(-1);
  };

  const handleExtendTime = () => {
    toast.info("Zeit verlängern wird bald verfügbar sein!");
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      user: { name: 'Du', avatar: '/placeholder.svg', tier: 'gold' },
      message: newMessage,
      timestamp: new Date(),
      type: 'message'
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleLike = () => {
    setLikes(prev => prev + 1);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex flex-col safe-area-inset">
      {/* Mobile Header */}
      <div className="bg-background/95 backdrop-blur-sm border-b border-border/50 p-4 pt-safe">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-foreground hover:bg-muted rounded-full px-3 sm:px-6 py-2"
            >
              <ArrowLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Zurück</span>
            </Button>

            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              <div className="relative">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-primary/30">
                  <AvatarImage src={hostAvatar} alt={hostName} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm">
                    {hostName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-background"></div>
              </div>
              
              <div className="min-w-0 flex-1">
                <h1 className="font-bold text-foreground text-sm sm:text-lg truncate">{hostName}</h1>
                <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                  <Lock className="h-2 w-2 sm:h-3 sm:w-3" />
                  <span className="truncate">Privater Chat</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Timer Display */}
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-mono",
              timeRemaining < 120 ? 'bg-destructive/20 text-destructive' : 'bg-accent/20 text-accent'
            )}>
              <Clock className="h-3 w-3" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
            
            <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
          </div>
        </div>

        {/* Timer warning */}
        {timeRemaining < 120 && timeRemaining > 0 && (
          <div className="mt-3 flex items-center justify-center gap-2 text-destructive text-xs sm:text-sm animate-pulse">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Nur noch {formatTime(timeRemaining)} verbleibend!</span>
          </div>
        )}
      </div>

      {/* Chat expired overlay */}
      {!isActive && timeRemaining === 0 && (
        <div className="absolute inset-0 bg-background/90 backdrop-blur-lg z-50 flex items-center justify-center">
          <Card className="max-w-md mx-4">
            <CardContent className="p-8 text-center">
              <Clock className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Chat beendet</h2>
              <p className="text-muted-foreground mb-6">Die Zeit ist abgelaufen.</p>
              <div className="space-y-2">
                <Button onClick={handleExtendTime} className="w-full">
                  Neuen Chat buchen
                </Button>
                <Button variant="outline" onClick={() => navigate(-1)} className="w-full">
                  Zurück
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Avatar Area - Mobile Responsive */}
      <div className="flex-1 flex items-center justify-center relative bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 mb-20 sm:mb-16">
        <div className="relative">
          {/* Avatar with ring - Responsive sizing */}
          <div className="relative">
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 p-2">
              <Avatar className="w-full h-full">
                <AvatarImage src={hostAvatar} alt={hostName} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-4xl sm:text-5xl md:text-6xl">
                  {hostName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            
            {/* Heart icon - Mobile friendly */}
            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
              <Button
                size="sm"
                onClick={handleLike}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-lg active:scale-95 transition-transform"
              >
                <Heart className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" />
              </Button>
              {likes > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {likes}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Area - Mobile Optimized */}
      <div className="bg-background/80 backdrop-blur-sm border-t border-border/50 pb-safe">
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 pb-28 sm:pb-24">
          {messages.map((msg) => (
            <div key={msg.id} className="animate-fade-in">
              {msg.type === 'gift' ? (
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-white inline-flex items-center gap-1.5 sm:gap-2 max-w-fit text-xs sm:text-sm">
                  <Avatar className="w-4 h-4 sm:w-6 sm:h-6">
                    <AvatarImage src={msg.user.avatar} />
                    <AvatarFallback className="text-xs">{msg.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{msg.user.name}</span>
                  <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-bold">{msg.giftValue}</span>
                </div>
              ) : msg.type === 'join' ? (
                <div className="bg-muted/60 rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 inline-flex items-center gap-1.5 sm:gap-2 max-w-fit text-xs sm:text-sm">
                  <span>👋</span>
                  <span className="font-medium">{msg.user.name}</span>
                  <span className="text-muted-foreground">ist beigetreten</span>
                </div>
              ) : (
                <div className="bg-muted/80 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 max-w-xs sm:max-w-sm">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                    <Avatar className="w-4 h-4 sm:w-5 sm:h-5">
                      <AvatarImage src={msg.user.avatar} />
                      <AvatarFallback className="text-xs">{msg.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs sm:text-sm font-medium">{msg.user.name}</span>
                    {msg.user.tier === 'diamond' && <Diamond className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-500" />}
                  </div>
                  <p className="text-xs sm:text-sm">{msg.message}</p>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
      </div>

      <GiftDialog open={giftOpen} onOpenChange={setGiftOpen} hostName={hostName} />
      <TippingDialog open={tipOpen} onOpenChange={setTipOpen} hostName={hostName} hostAvatar={hostAvatar} creatorUserId={roomId || ""} />
    </div>

      {/* Mobile-Optimized Message Input - Fixed Position */}
      <div className="fixed bottom-20 sm:bottom-16 left-0 right-0 p-3 sm:p-4 bg-background/95 backdrop-blur-sm border-t border-border/30 z-50">
        <div className="flex items-center gap-2 bg-card rounded-full px-3 sm:px-4 py-3 border border-border shadow-lg">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nachricht schreiben..."
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm placeholder:text-muted-foreground flex-1 min-h-[32px]"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setGiftOpen(true)}
              className="text-accent hover:bg-accent/10 p-1.5 sm:p-2 rounded-full active:scale-95 transition-transform"
            >
              <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setTipOpen(true)}
              className="text-primary hover:bg-primary/10 p-1.5 sm:p-2 rounded-full active:scale-95 transition-transform"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLike}
              className="text-pink-500 hover:bg-pink-500/10 p-1.5 sm:p-2 rounded-full active:scale-95 transition-transform"
            >
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
            
            <Button
              size="sm"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 rounded-full px-3 sm:px-4 active:scale-95 transition-transform"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}