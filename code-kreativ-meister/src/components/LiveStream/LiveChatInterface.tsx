import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, Gift, Users, Crown, Diamond, X, Send, Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Clock, Lock, Euro } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { PaymentFlow } from "@/components/Payment/PaymentFlow";
import { TippingDialog } from "./TippingDialog";
import { GiftDialog } from "./GiftDialog";
import { ExtendTimeDialog } from "./ExtendTimeDialog";
import { PrivateRoomDialog } from "./PrivateRoomDialog";
import CallOverlay from "@/components/Call/CallOverlay";
import { useWebRTC } from "@/hooks/useWebRTC";
import { CallSignaling } from "@/components/Call/CallSignaling";

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

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isMuted?: boolean;
  isHost?: boolean;
  tier?: 'bronze' | 'silver' | 'gold' | 'diamond';
}

interface LiveChatInterfaceProps {
  hostName: string;
  hostAvatar: string;
  hostFollowers: string;
  viewerCount: number;
  isLive: boolean;
  roomTitle?: string;
  category?: string;
  creatorUserId?: string;
  onEndCall?: () => void;
  onToggleMute?: () => void;
  onToggleVideo?: () => void;
  isMuted?: boolean;
  isVideoOn?: boolean;
  showBattle?: boolean;
  battleOpponent?: {
    name: string;
    avatar: string;
    score: number;
  };
  currentUserScore?: number;
  battleTimeLeft?: string;
  eventId?: string;
  onStartVoiceCall?: () => void;
  onStartVideoCall?: () => void;
  onPrivateRoomBooked?: (roomDetails: { roomId: string; hostName: string; packageType: string; duration: number }) => void;
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

const mockParticipants: Participant[] = [
  { id: '1', name: 'Host', avatar: '/placeholder.svg', isHost: true, tier: 'diamond' },
  { id: '2', name: 'Sarah', avatar: '/placeholder.svg', tier: 'gold' },
  { id: '3', name: 'Alex', avatar: '/placeholder.svg', isMuted: true, tier: 'silver' },
  { id: '4', name: 'Mike', avatar: '/placeholder.svg' },
  { id: '5', name: 'Lisa', avatar: '/placeholder.svg', tier: 'bronze' },
  { id: '6', name: 'Tom', avatar: '/placeholder.svg' },
  { id: '7', name: 'Emma', avatar: '/placeholder.svg', tier: 'gold' },
  { id: '8', name: 'David', avatar: '/placeholder.svg', isMuted: true },
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
    default: return null;
  }
};

export default function LiveChatInterface({
  hostName,
  hostAvatar,
  hostFollowers,
  viewerCount,
  isLive,
  roomTitle,
  category,
  creatorUserId,
  onEndCall,
  onToggleMute,
  onToggleVideo,
  isMuted = false,
  isVideoOn = true,
  showBattle = false,
  battleOpponent,
  currentUserScore = 0,
  battleTimeLeft = "04:08",
  eventId,
  onStartVoiceCall,
  onStartVideoCall,
  onPrivateRoomBooked
}: LiveChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [showExtendDialog, setShowExtendDialog] = useState(false);
  const [showPrivateDialog, setShowPrivateDialog] = useState(false);
  const [showTippingDialog, setShowTippingDialog] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');
  const [callEndedToastShown, setCallEndedToastShown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // WebRTC integration
  const {
    localStream,
    remoteStream,
    isConnected: isWebRTCConnected,
    isMuted: isWebRTCMuted,
    isVideoEnabled,
    error: webRTCError,
    startCall,
    answerCall,
    endCall,
    toggleMute,
    toggleVideo,
    localVideoRef,
    remoteVideoRef,
  } = useWebRTC({
    onRemoteStream: (stream) => {
      console.log('Remote stream received:', stream);
    },
    onCallEnd: () => {
      setIsCallActive(false);
      if (!callEndedToastShown) {
        toast.info('Anruf beendet', { id: 'call-ended' });
        setCallEndedToastShown(true);
      }
    }
  });

  // Mock user ID for signaling
  const currentUserId = 'user-' + Math.random().toString(36).substr(2, 9);

  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Only auto-scroll if user is not manually scrolling
    if (!isUserScrolling) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isUserScrolling]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Handle scroll detection
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsUserScrolling(true);
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Reset user scrolling after 3 seconds of no scroll activity
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 3000);
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

  const handleStartVoiceCall = async () => {
    try {
      setCallType('voice');
      setCallEndedToastShown(false);
      setIsCallActive(true);
      await startCall(false); // false for voice only
      toast.success('Sprachanruf gestartet');
    } catch (error) {
      console.error('Error starting voice call:', error);
      toast.error('Fehler beim Starten des Sprachanrufs');
      setIsCallActive(false);
    }
  };

  const handleStartVideoCall = async () => {
    try {
      setCallType('video');
      setCallEndedToastShown(false);
      setIsCallActive(true);
      await startCall(true); // true for video call
      toast.success('Videoanruf gestartet');
    } catch (error) {
      console.error('Error starting video call:', error);
      toast.error('Fehler beim Starten des Videoanrufs');
      setIsCallActive(false);
    }
  };

  const handleEndCall = () => {
    endCall();
    setIsCallActive(false);
    onEndCall?.();
  };

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Video Background/Stream Area */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50">
        {showBattle && battleOpponent ? (
          // Battle Mode Layout
          <div className="relative h-full">
            {/* Battle Timer and Scores */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
              <div className="bg-black/80 rounded-full px-4 py-2 flex items-center gap-3">
                <span className="text-pink-400 font-bold text-lg">{currentUserScore}</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-mono text-sm">{battleTimeLeft}</span>
                </div>
                <span className="text-blue-400 font-bold text-lg">{battleOpponent.score}</span>
              </div>
            </div>

            {/* Split Screen Battle */}
            <div className="flex h-full">
              <div className="flex-1 relative">
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">WIN x{currentUserScore}</span>
                </div>
                <div className="w-full h-full bg-gradient-to-br from-pink-600 to-purple-700 flex items-center justify-center">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={hostAvatar} />
                    <AvatarFallback>{hostName[0]}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              
              <div className="flex-1 relative">
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">WIN x{battleOpponent.score}</span>
                </div>
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-cyan-700 flex items-center justify-center">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={battleOpponent.avatar} />
                    <AvatarFallback>{battleOpponent.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>

            {/* Battle Progress Bars */}
            <div className="absolute bottom-40 left-0 right-0 px-4">
              <div className="flex items-center gap-2">
                <div className="text-pink-400 font-bold text-sm w-8">{currentUserScore}</div>
                <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-pink-400 transition-all duration-300"
                    style={{ width: `${(currentUserScore / (currentUserScore + battleOpponent.score)) * 100}%` }}
                  />
                </div>
                <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-300 ml-auto"
                    style={{ width: `${(battleOpponent.score / (currentUserScore + battleOpponent.score)) * 100}%` }}
                  />
                </div>
                <div className="text-blue-400 font-bold text-sm w-8">{battleOpponent.score}</div>
              </div>
            </div>
          </div>
        ) : (
          // Regular Stream Layout
          <div className="w-full h-full bg-gradient-to-br from-purple-800 to-pink-800 flex items-center justify-center">
            <Avatar className="w-48 h-48">
              <AvatarImage src={hostAvatar} />
              <AvatarFallback className="text-4xl">{hostName[0]}</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 ring-2 ring-white/30">
              <AvatarImage src={hostAvatar} />
              <AvatarFallback>{hostName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm">{hostName}</span>
                <Crown className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-3 h-3 text-pink-400" />
                <span className="text-white/80 text-xs">{hostFollowers}</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "text-xs font-bold border-2 transition-all",
                isFollowing 
                  ? "bg-gray-600 border-gray-500 text-white" 
                  : "bg-pink-600 border-pink-500 text-white hover:bg-pink-700"
              )}
              onClick={() => setIsFollowing(!isFollowing)}
            >
              {isFollowing ? "✓ Folgen" : "+ Folgen"}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-black/50 rounded-full px-3 py-1">
              <Users className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">{viewerCount}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={onEndCall}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Category and Room Info */}
        <div className="flex items-center gap-2 mt-2">
          {isLive && (
            <Badge className="bg-red-600 text-white text-xs font-bold animate-pulse">
              ● LIVE
            </Badge>
          )}
          {category && (
            <Badge className="bg-white/20 text-white text-xs">
              {category}
            </Badge>
          )}
          {roomTitle && (
            <span className="text-white/90 text-sm">{roomTitle}</span>
          )}
        </div>
      </div>

      {/* Participants Grid */}
      <div className="absolute top-32 right-4 z-20">
        <div className="grid grid-cols-2 gap-2 max-w-[120px]">
          {mockParticipants.slice(0, 8).map((participant) => (
            <div key={participant.id} className="relative">
              <Avatar className={cn(
                "w-12 h-12 ring-2",
                participant.isHost ? "ring-yellow-400" : "ring-white/30"
              )}>
                <AvatarImage src={participant.avatar} />
                <AvatarFallback className="text-xs">{participant.name[0]}</AvatarFallback>
              </Avatar>
              
              {participant.isHost && (
                <div className="absolute -top-1 -left-1 bg-yellow-400 text-black text-xs font-bold px-1 rounded">
                  Host
                </div>
              )}
              
              {participant.tier && (
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white",
                  "bg-gradient-to-r", getTierColor(participant.tier)
                )}>
                  {getTierIcon(participant.tier)}
                </div>
              )}
              
              {participant.isMuted && (
                <div className="absolute bottom-0 right-0 bg-red-500 rounded-full p-0.5">
                  <MicOff className="w-2 h-2 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="absolute left-0 right-0 z-20 px-4" style={{ bottom: 'calc(env(safe-area-inset-bottom) + 72px)' }}>
        <div 
          className="max-h-64 overflow-y-auto space-y-2"
          onScroll={handleScroll}
        >
          {messages.slice(-10).map((message) => (
            <div key={message.id} className="flex items-start gap-2">
              {message.type === 'join' ? (
                <div className="bg-black/60 rounded-lg px-3 py-1 max-w-xs">
                  <span className="text-gray-300 text-sm">
                    👋 <span className="text-blue-400 font-medium">{message.user.name}</span> ist beigetreten
                  </span>
                </div>
              ) : message.type === 'gift' ? (
                <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg px-3 py-2 max-w-xs">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={message.user.avatar} />
                      <AvatarFallback className="text-xs">{message.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-white text-sm font-medium">{message.user.name}</span>
                    <Gift className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-bold text-sm">{message.giftValue}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-black/60 rounded-lg px-3 py-2 max-w-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={message.user.avatar} />
                      <AvatarFallback className="text-xs">{message.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className={cn(
                      "text-sm font-medium",
                      message.user.tier ? `bg-gradient-to-r ${getTierColor(message.user.tier)} bg-clip-text text-transparent` : "text-white"
                    )}>
                      {message.user.name}
                    </span>
                    {message.user.verified && (
                      <Crown className="w-3 h-3 text-yellow-400" />
                    )}
                  </div>
                  <p className="text-white text-sm">{message.message}</p>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute left-0 right-0 z-30 p-4" style={{ bottom: 'calc(env(safe-area-inset-bottom) + 0px)' }}>
        <div className="flex items-center gap-3">
          {/* Message Input */}
          <div className="flex-1 flex items-center gap-2 bg-black/60 rounded-full px-4 py-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Nachricht eingeben..."
              className="bg-transparent border-none text-white placeholder:text-gray-400 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSendMessage}
              className="text-white hover:bg-white/20 p-1"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Like Button */}
            <Button
              size="icon"
              variant="ghost"
              onClick={handleLike}
              className="text-white hover:bg-pink-600/50 relative"
            >
              <Heart className="w-5 h-5" />
              {likes > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {likes}
                </span>
              )}
            </Button>

            {/* Gift Button */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowGiftDialog(true)}
              className="text-white hover:bg-purple-600/50"
            >
              <Gift className="w-5 h-5" />
            </Button>

            {/* Tipping Button */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowTippingDialog(true)}
              className="text-white hover:bg-green-600/50"
            >
              <Euro className="w-5 h-5" />
            </Button>

            {/* Extend Time Button */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowExtendDialog(true)}
              className="text-white hover:bg-yellow-600/50"
            >
              <Clock className="w-5 h-5" />
            </Button>

            {/* Private Room Button */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowPrivateDialog(true)}
              className="text-white hover:bg-indigo-600/50"
            >
              <Lock className="w-5 h-5" />
            </Button>

            {/* Voice Call Button */}
            <Button
              size="icon"
              variant="ghost"
              onClick={handleStartVoiceCall}
              disabled={isCallActive}
              className="text-white hover:bg-green-600/50"
            >
              <Phone className="w-5 h-5" />
            </Button>

            {/* Video Call Button */}
            <Button
              size="icon"
              variant="ghost"
              onClick={handleStartVideoCall}
              disabled={isCallActive}
              className="text-white hover:bg-blue-600/50"
            >
              <Video className="w-5 h-5" />
            </Button>

            {/* Mute Button (when in call) */}
            {isCallActive && (
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleMute}
                className={cn(
                  "text-white hover:bg-red-600/50",
                  isWebRTCMuted && "bg-red-600"
                )}
              >
                {isWebRTCMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
            )}

            {/* Video Toggle Button (when in video call) */}
            {isCallActive && callType === 'video' && (
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleVideo}
                className={cn(
                  "text-white hover:bg-blue-600/50",
                  !isVideoEnabled && "bg-blue-600"
                )}
              >
                {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>
            )}

            {/* End Call Button */}
            <Button
              size="icon"
              variant="destructive"
              onClick={isCallActive ? handleEndCall : onEndCall}
              className="bg-red-600 hover:bg-red-700"
            >
              <PhoneOff className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Battle Mode Bottom Participants */}
      {showBattle && (
        <div className="absolute bottom-32 left-4 right-4 z-20">
          <div className="flex justify-between">
            <div className="flex -space-x-2">
              {mockParticipants.slice(0, 4).map((participant, index) => (
                <Avatar key={participant.id} className="w-8 h-8 border-2 border-pink-500">
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback className="text-xs">{participant.name[0]}</AvatarFallback>
                  {index < 3 && (
                    <div className="absolute -bottom-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {index + 1}
                    </div>
                  )}
                </Avatar>
              ))}
            </div>
            
            <div className="flex -space-x-2">
              {mockParticipants.slice(4, 8).map((participant, index) => (
                <Avatar key={participant.id} className="w-8 h-8 border-2 border-blue-500">
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback className="text-xs">{participant.name[0]}</AvatarFallback>
                  {index < 3 && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {index + 1}
                    </div>
                  )}
                </Avatar>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Call Overlay */}
      {isCallActive && (
        <CallOverlay
          isOpen={isCallActive}
          callType={callType}
          isIncoming={false}
          isConnected={isWebRTCConnected}
          callerName={hostName}
          callerAvatar={hostAvatar}
          onAccept={() => {}}
          onDecline={handleEndCall}
          onToggleMute={toggleMute}
          onToggleVideo={toggleVideo}
          onToggleSpeaker={() => {}}
          isMuted={isWebRTCMuted}
          isVideoEnabled={isVideoEnabled}
          isSpeakerEnabled={true}
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          callDuration="00:00"
        />
      )}

      {/* All Dialog Components */}
      <TippingDialog
        open={showTippingDialog}
        onOpenChange={setShowTippingDialog}
        hostName={hostName}
        hostAvatar={hostAvatar}
        creatorUserId={creatorUserId}
      />

      <GiftDialog
        open={showGiftDialog}
        onOpenChange={setShowGiftDialog}
        hostName={hostName}
      />

      <ExtendTimeDialog
        open={showExtendDialog}
        onOpenChange={setShowExtendDialog}
        currentTimeLeft={45} // Mock current time left in minutes
        eventName={roomTitle || "Live Event"}
      />

      <PrivateRoomDialog
        open={showPrivateDialog}
        onOpenChange={setShowPrivateDialog}
        hostName={hostName}
        hostAvatar={hostAvatar}
        onPrivateRoomBooked={onPrivateRoomBooked}
      />

      {/* Battle Mode Bottom Participants */}
      {showBattle && (
        <div className="absolute bottom-32 left-4 right-4 z-20">
          <div className="flex justify-between">
            <div className="flex -space-x-2">
              {mockParticipants.slice(0, 4).map((participant, index) => (
                <Avatar key={participant.id} className="w-8 h-8 border-2 border-pink-500">
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback className="text-xs">{participant.name[0]}</AvatarFallback>
                  {index < 3 && (
                    <div className="absolute -bottom-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {index + 1}
                    </div>
                  )}
                </Avatar>
              ))}
            </div>
            
            <div className="flex -space-x-2">
              {mockParticipants.slice(4, 8).map((participant, index) => (
                <Avatar key={participant.id} className="w-8 h-8 border-2 border-blue-500">
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback className="text-xs">{participant.name[0]}</AvatarFallback>
                  {index < 3 && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {index + 1}
                    </div>
                  )}
                </Avatar>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mission/Challenge Overlay */}
      {showBattle && (
        <div className="absolute bottom-72 left-1/2 transform -translate-x-1/2 z-25">
          <div className="bg-black/80 rounded-lg px-4 py-2 text-center">
            <span className="text-white text-sm">Bonusmission beendet</span>
          </div>
        </div>
      )}
    </div>
  );
}