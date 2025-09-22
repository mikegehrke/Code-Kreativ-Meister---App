import { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import CallOverlay from "@/components/Call/CallOverlay";
import { useWebRTC } from "@/hooks/useWebRTC";
import { 
  ArrowLeft, 
  Send,
  Heart,
  Gift,
  Settings,
  Users,
  Video,
  Smile,
  MoreHorizontal,
  Image,
  Mic,
  Camera,
  Link,
  Plus,
  Reply,
  Flag,
  Pin,
  Search,
  Paperclip,
  Phone,
  MapPin,
  PhoneCall
} from "lucide-react";

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  message: string;
  timestamp: string;
  isVip?: boolean;
  hearts?: number;
  isReply?: boolean;
  replyTo?: string;
  isPinned?: boolean;
  attachments?: Array<{
    type: 'image' | 'video' | 'audio' | 'file' | 'location';
    url: string;
    name?: string;
  }>;
  reactions?: Record<string, number>;
}

const EventChat = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { event?: any; venue?: any } };
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showAttachments, setShowAttachments] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video' | null>(null);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(false);
  const callStartTimeRef = useRef<number | null>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      user: "Sarah M.",
      avatar: "/api/placeholder/32/32",
      message: "Amazing set! The energy is incredible tonight! 🔥🔥🔥",
      timestamp: "22:34",
      hearts: 12,
      reactions: { "🔥": 5, "❤️": 7 }
    },
    {
      id: "2", 
      user: "DJ_Mike",
      avatar: "/api/placeholder/32/32",
      message: "Thanks for joining the stream everyone! This next track is going to be special. Get ready to dance! 🎵",
      timestamp: "22:35",
      isVip: true,
      hearts: 45,
      isPinned: true,
      reactions: { "🙌": 12, "💎": 8, "🔥": 15 }
    },
    {
      id: "3",
      user: "PartyLover99",
      avatar: "/api/placeholder/32/32", 
      message: "This track is absolutely insane! What's the track ID? I need this in my playlist ASAP!",
      timestamp: "22:36",
      hearts: 8,
      isReply: true,
      replyTo: "DJ_Mike",
      reactions: { "👀": 3, "🎵": 5 }
    },
    {
      id: "4",
      user: "MusicFan23",
      avatar: "/api/placeholder/32/32",
      message: "Best event of the year! The production quality is off the charts! 💎✨",
      timestamp: "22:37",
      hearts: 15,
      reactions: { "💎": 8, "✨": 6, "🙌": 4 }
    },
    {
      id: "5",
      user: "TechnoQueen",
      avatar: "/api/placeholder/32/32",
      message: "The bass line in this track is hitting different! My neighbors are probably not happy but I don't care! 🔊💃",
      timestamp: "22:38",
      hearts: 22,
      reactions: { "💃": 10, "🔊": 8, "😂": 5 }
    }
  ]);
  const [activeViewers] = useState(Math.floor(Math.random() * 800) + 200);
  
  // WebRTC Hook
  const {
    localStream,
    remoteStream,
    isConnected: isCallConnected,
    isMuted,
    isVideoEnabled,
    localVideoRef,
    remoteVideoRef,
    startCall,
    answerCall,
    toggleMute,
    toggleVideo,
    endCall
  } = useWebRTC({
    onCallEnd: () => {
      setIsInCall(false);
      setIsIncomingCall(false);
      setCallType(null);
      callStartTimeRef.current = null;
      setCallDuration(0);
    }
  });
  
  const event = location.state?.event || {
    id: eventId,
    name: "Live Event",
    dj: "DJ Unknown"
  };

  const venue = location.state?.venue;

  useEffect(() => {
    document.title = `💬 Chat: ${event.name}`;
    
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    
    // Simulate new messages with more variety
    const interval = setInterval(() => {
      const randomMessages = [
        "This is incredible! The sound quality is amazing! 🎵",
        "Love this track! What genre is this?",
        "When does the next set start? Can't wait!",
        "Amazing atmosphere! Wish I was there in person! ✨",
        "Best DJ ever! This mix is fire! 🙌",
        "Can't stop dancing! My living room is now a dancefloor! 💃",
        "What's this song called? Shazam isn't picking it up!",
        "Epic drop! My speakers are loving this! 🔥",
        "The lighting setup looks incredible from the stream!",
        "Anyone know if there are tickets still available for next week?",
        "This beat is making me want to learn how to DJ!",
        "The crowd energy is insane! Wish I could feel that bass!"
      ];
      
      const randomUsers = [
        "MusicLover42", "DanceQueen", "BeatDropper", "RaveKid", 
        "ElectroFan", "PartyAnimal", "SoundWave", "VibeChaser",
        "TechnoHead", "HouseMusic4Life", "EDMaddict", "BassHunter"
      ];
      
      const randomReactions = ["🔥", "❤️", "👏", "🎵", "💃", "🙌", "✨", "💎", "🎉", "⚡"];
      
      if (Math.random() > 0.6) {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          user: randomUsers[Math.floor(Math.random() * randomUsers.length)],
          avatar: "/api/placeholder/32/32",
          message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          timestamp: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
          hearts: Math.floor(Math.random() * 20),
          reactions: Math.random() > 0.7 ? {
            [randomReactions[Math.floor(Math.random() * randomReactions.length)]]: Math.floor(Math.random() * 10) + 1
          } : {}
        };
        
        setMessages(prev => [...prev.slice(-30), newMessage]);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [event.name]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isInCall && isCallConnected && callStartTimeRef.current) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - callStartTimeRef.current!) / 1000);
        setCallDuration(elapsed);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isInCall, isCallConnected]);

  // Format call duration
  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: "You",
      avatar: "/api/placeholder/32/32",
      message: message,
      timestamp: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      hearts: 0,
      isReply: replyingTo ? true : false,
      replyTo: replyingTo || undefined,
      reactions: {}
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage("");
    setReplyingTo(null);
    setIsTyping(false);
    
    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleReply = (messageId: string, username: string) => {
    setReplyingTo(username);
    inputRef.current?.focus();
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions };
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        return { ...msg, reactions };
      }
      return msg;
    }));
  };

  const handlePinMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isPinned: !msg.isPinned }
        : msg
    ));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachment = (type: string) => {
    // Simulate file upload
    const fileTypes = {
      Photo: "📷 Photo shared",
      Video: "🎥 Video shared", 
      Audio: "🎵 Audio shared",
      File: "📎 File shared"
    };
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: "You",
      avatar: "/api/placeholder/32/32",
      message: fileTypes[type as keyof typeof fileTypes] || "📎 File shared",
      timestamp: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      hearts: 0,
      reactions: {}
    };
    
    setMessages(prev => [...prev, newMessage]);
    setShowAttachments(false);
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  // File selection handlers
  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: "You",
      avatar: "/api/placeholder/32/32",
      message: "📷 Foto angehängt",
      timestamp: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      hearts: 0,
      reactions: {},
      attachments: [{ type: 'image', url, name: file.name }]
    };
    setMessages(prev => [...prev, newMessage]);
    setShowAttachments(false);
    e.target.value = "";
  };

  const handleVideoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: "You",
      avatar: "/api/placeholder/32/32",
      message: "🎥 Video angehängt",
      timestamp: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      hearts: 0,
      reactions: {},
      attachments: [{ type: 'video', url, name: file.name }]
    };
    setMessages(prev => [...prev, newMessage]);
    setShowAttachments(false);
    e.target.value = "";
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: "You",
      avatar: "/api/placeholder/32/32",
      message: "📎 Datei angehängt",
      timestamp: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      hearts: 0,
      reactions: {},
      attachments: [{ type: 'file', url, name: file.name }]
    };
    setMessages(prev => [...prev, newMessage]);
    setShowAttachments(false);
    e.target.value = "";
  };

  // Audio recording
  const handleToggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      recordedChunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          user: "You",
          avatar: "/api/placeholder/32/32",
          message: "🎤 Sprachnachricht",
          timestamp: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
          hearts: 0,
          reactions: {},
          attachments: [{ type: 'audio', url, name: 'voice-message.webm' }]
        };
        setMessages(prev => [...prev, newMessage]);
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied or not available', err);
    }
  };

  const quickEmojis = ["😀", "😂", "❤️", "🔥", "👏", "🎉", "💯", "✨", "👀", "🙌", "💃", "🎵", "⚡", "💎", "🚀", "🌟"];

  // Render text with clickable links
  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary hover:text-primary/80 break-all"
          >
            {part}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const handleQuickReaction = (emoji: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: "You",
      avatar: "/api/placeholder/32/32",
      message: emoji,
      timestamp: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      hearts: 0,
      reactions: {}
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleWatchLive = () => {
    navigate(`/event/${eventId}/live`, {
      state: { event, venue }
    });
  };

  // Real call functionality with WebRTC
  const handleStartCall = async (type: 'voice' | 'video') => {
    try {
      setIsInCall(true);
      setCallType(type);
      callStartTimeRef.current = Date.now();
      
      // Start WebRTC call
      await startCall(type === 'video');
      
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        user: "System",
        avatar: "/api/placeholder/32/32",
        message: `📞 ${type === 'voice' ? 'Sprachanruf' : 'Videoanruf'} wird verbunden...`,
        timestamp: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
        hearts: 0,
        reactions: {}
      };
      setMessages(prev => [...prev, newMessage]);
      setShowAttachments(false);
      
      // Simulate incoming call for demo (in real app, this would come via signaling server)
      setTimeout(() => {
        if (Math.random() > 0.3) { // 70% chance of call being "answered"
          callStartTimeRef.current = Date.now();
        }
      }, 2000);
      
    } catch (error) {
      console.error('Failed to start call:', error);
      setIsInCall(false);
      setCallType(null);
    }
  };

  const handleAcceptCall = async () => {
    try {
      setIsIncomingCall(false);
      callStartTimeRef.current = Date.now();
      
      // In a real app, you would answer with the received offer
      // await answerCall(receivedOffer, callType === 'video');
      
    } catch (error) {
      console.error('Failed to accept call:', error);
    }
  };

  const handleDeclineCall = () => {
    setIsIncomingCall(false);
    setIsInCall(false);
    setCallType(null);
    endCall();
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: "System",
      avatar: "/api/placeholder/32/32",
      message: `📞 ${callType === 'voice' ? 'Sprachanruf' : 'Videoanruf'} ${isIncomingCall ? 'abgelehnt' : 'beendet'} ${callDuration > 0 ? `(${formatCallDuration(callDuration)})` : ''}`,
      timestamp: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      hearts: 0,
      reactions: {}
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleToggleSpeaker = () => {
    setIsSpeakerEnabled(!isSpeakerEnabled);
  };

  // Real location sharing with live tracking
  const handleShareLocation = () => {
    if (navigator.geolocation) {
      // Get high accuracy position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const timestamp = new Date(position.timestamp);
          
          // Create location share message with map link
          const mapsViewLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
          const mapsRouteLink = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
          const newMessage: ChatMessage = {
            id: Date.now().toString(),
            user: "You",
            avatar: "/api/placeholder/32/32",
            message: `📍 Live-Standort geteilt\n📌 Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}\n🎯 Genauigkeit: ${Math.round(accuracy)}m\n⏰ ${timestamp.toLocaleString('de-DE')}\n\n🗺️ In Google Maps öffnen: ${mapsViewLink}\n➡️ Route anzeigen: ${mapsRouteLink}`,
            timestamp: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
            hearts: 0,
            reactions: {},
            attachments: [
              { type: 'location', url: mapsRouteLink, name: 'Route in Google Maps' }
            ]
          };
          setMessages(prev => [...prev, newMessage]);
          setShowAttachments(false);
          
          // Watch position for live updates (optional)
          const watchId = navigator.geolocation.watchPosition(
            (newPosition) => {
              if (Math.abs(newPosition.coords.latitude - latitude) > 0.001 || 
                  Math.abs(newPosition.coords.longitude - longitude) > 0.001) {
                const updateMessage: ChatMessage = {
                  id: Date.now().toString(),
                  user: "System",
                  avatar: "/api/placeholder/32/32",
                  message: `📍 Standort aktualisiert\n📌 ${newPosition.coords.latitude.toFixed(6)}, ${newPosition.coords.longitude.toFixed(6)}`,
                  timestamp: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
                  hearts: 0,
                  reactions: {}
                };
                setMessages(prev => [...prev, updateMessage]);
              }
            },
            null,
            { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 }
          );
          
          // Stop watching after 5 minutes
          setTimeout(() => navigator.geolocation.clearWatch(watchId), 300000);
        },
        (error) => {
          console.error('Location access denied', error);
          let errorMessage = "❌ Standortzugriff verweigert";
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "❌ Standortzugriff verweigert - Bitte Berechtigung in den Browser-Einstellungen aktivieren";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "❌ Standort nicht verfügbar - GPS/Netzwerk-Problem";
              break;
            case error.TIMEOUT:
              errorMessage = "❌ Standort-Timeout - Vorgang dauerte zu lange";
              break;
          }
          
          const newMessage: ChatMessage = {
            id: Date.now().toString(),
            user: "System",
            avatar: "/api/placeholder/32/32",
            message: errorMessage,
            timestamp: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
            hearts: 0,
            reactions: {}
          };
          setMessages(prev => [...prev, newMessage]);
          setShowAttachments(false);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 60000 
        }
      );
    } else {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        user: "System",
        avatar: "/api/placeholder/32/32",
        message: "❌ Geolocation wird von diesem Browser nicht unterstützt",
        timestamp: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
        hearts: 0,
        reactions: {}
      };
      setMessages(prev => [...prev, newMessage]);
      setShowAttachments(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <h1 className="font-semibold">Live Chat</h1>
            </div>
            <p className="text-xs text-muted-foreground">{event.name}</p>
          </div>
          <div className="flex gap-2">
            {!isInCall ? (
              <>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleStartCall('voice')}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <Phone className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleStartCall('video')}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Video className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleDeclineCall}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 animate-pulse"
              >
                <PhoneCall className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Event Info Bar */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/api/placeholder/32/32" />
              <AvatarFallback>{event.dj?.charAt(0) || 'D'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{event.dj}</p>
              {venue && (
                <p className="text-xs text-muted-foreground">at {venue.name}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-sm">{activeViewers}</span>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleWatchLive}
            >
              <Video className="h-4 w-4 mr-2" />
              Watch Live
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* Pinned Messages */}
        {messages.filter(msg => msg.isPinned).length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 mb-2">
              <Pin className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">Pinned Messages</span>
            </div>
            {messages.filter(msg => msg.isPinned).map(msg => (
              <div key={`pinned-${msg.id}`} className="text-sm">
                <span className="font-semibold">{msg.user}:</span> {msg.message}
              </div>
            ))}
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="group relative">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={msg.avatar} />
                <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{msg.user}</span>
                  {msg.isVip && (
                    <Badge className="bg-gradient-to-r from-primary to-accent text-xs">
                      VIP
                    </Badge>
                  )}
                  {msg.isPinned && (
                    <Pin className="h-3 w-3 text-yellow-500" />
                  )}
                  <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                </div>
                
                {/* Reply indicator */}
                {msg.isReply && msg.replyTo && (
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Reply className="h-3 w-3" />
                    Replying to {msg.replyTo}
                  </div>
                )}
                
                <div className="bg-muted/50 rounded-lg p-3 break-words">
                  <p className="text-sm whitespace-pre-wrap break-words">{renderTextWithLinks(msg.message)}</p>
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {msg.attachments.map((att, i) => (
                        <div key={i}>
                          {att.type === 'image' && (
                            <img
                              src={att.url}
                              alt={`Image attachment from ${msg.user}`}
                              className="max-h-48 rounded-lg"
                              loading="lazy"
                            />
                          )}
                          {att.type === 'video' && (
                            <video controls className="w-full max-h-56 rounded-lg">
                              <source src={att.url} />
                            </video>
                          )}
                          {att.type === 'audio' && (
                            <audio controls className="w-full">
                              <source src={att.url} />
                            </audio>
                          )}
                          {att.type === 'file' && (
                            <a
                              href={att.url}
                              download={att.name}
                              className="inline-flex items-center gap-2 text-sm underline"
                              target="_blank" rel="noopener noreferrer"
                            >
                              <Paperclip className="h-4 w-4" />
                              {att.name || 'Download file'}
                            </a>
                          )}
                          {att.type === 'location' && (
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm underline text-primary hover:text-primary/80"
                            >
                              Route in Google Maps öffnen
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Reactions */}
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div className="flex items-center gap-1 mt-2 flex-wrap">
                    {Object.entries(msg.reactions).map(([emoji, count]) => (
                      <Button
                        key={emoji}
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs rounded-full bg-muted hover:bg-muted/80"
                        onClick={() => handleReaction(msg.id, emoji)}
                      >
                        {emoji} {count}
                      </Button>
                    ))}
                  </div>
                )}
                
                {/* Hearts */}
                {msg.hearts && msg.hearts > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <Heart className="h-3 w-3 text-red-500 fill-current" />
                    <span className="text-xs text-muted-foreground">{msg.hearts}</span>
                  </div>
                )}
              </div>
              
              {/* Message Actions */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleReaction(msg.id, "❤️")}
                >
                  <Heart className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleReply(msg.id, msg.user)}
                >
                  <Reply className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handlePinMessage(msg.id)}
                >
                  <Pin className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reactions */}
      <div className="px-4 py-2 border-t bg-muted/50">
        <div className="flex gap-2 overflow-x-auto">
          {["🔥", "❤️", "👏", "🎵", "💃", "🙌", "✨", "💎"].map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              size="sm"
              className="flex-shrink-0 text-lg hover:bg-muted/80"
              onClick={() => handleQuickReaction(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Reply indicator */}
        {replyingTo && (
          <div className="px-4 py-2 bg-muted/80 border-b flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Reply className="h-4 w-4" />
              Replying to {replyingTo}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(null)}
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="px-4 py-1 text-xs text-muted-foreground bg-background/80">
            You are typing...
          </div>
        )}

        {/* Attachment options */}
        {showAttachments && (
          <div className="px-4 py-3 border-b bg-background/90">
            <div className="grid grid-cols-4 gap-3 mb-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex flex-col items-center gap-1 bg-muted/50"
                onClick={() => imageInputRef.current?.click()}
              >
                <Image className="h-5 w-5" />
                <span className="text-xs">Photo</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex flex-col items-center gap-1 bg-muted/50"
                onClick={() => videoInputRef.current?.click()}
              >
                <Video className="h-5 w-5" />
                <span className="text-xs">Video</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex flex-col items-center gap-1 bg-muted/50"
                onClick={handleToggleRecording}
              >
                <Mic className={`h-5 w-5 ${isRecording ? 'text-red-500' : ''}`} />
                <span className="text-xs">{isRecording ? 'Stop' : 'Audio'}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex flex-col items-center gap-1 bg-muted/50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-5 w-5" />
                <span className="text-xs">File</span>
              </Button>
            </div>
            
            {/* Call and Location options */}
            <div className="grid grid-cols-3 gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex flex-col items-center gap-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                onClick={() => handleStartCall('voice')}
                disabled={isInCall}
              >
                <Phone className="h-5 w-5" />
                <span className="text-xs">Anrufen</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex flex-col items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                onClick={() => handleStartCall('video')}
                disabled={isInCall}
              >
                <Video className="h-5 w-5" />
                <span className="text-xs">Video</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex flex-col items-center gap-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
                onClick={handleShareLocation}
              >
                <MapPin className="h-5 w-5" />
                <span className="text-xs">Standort</span>
              </Button>
            </div>
          </div>
        )}

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="px-4 py-3 border-b bg-background/90">
            <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
              {quickEmojis.map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  className="text-lg hover:bg-muted/50"
                  onClick={() => handleEmojiSelect(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-background">
          <div className="flex gap-2 items-end">
            <Button 
              variant="outline" 
              size="icon" 
              className="flex-shrink-0"
              onClick={() => {
                setShowAttachments(!showAttachments);
                setShowEmojiPicker(false);
              }}
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="flex-shrink-0"
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
                setShowAttachments(false);
              }}
            >
              <Smile className="h-5 w-5" />
            </Button>
            <div className="flex-1 relative">
              <Textarea
                ref={inputRef}
                placeholder="Nachricht schreiben... (Shift+Enter für neue Zeile)"
                value={message}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="min-h-[40px] max-h-[120px] resize-none pr-12 bg-background border-2 border-border focus:border-primary"
                rows={1}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                size="icon"
                className="absolute right-2 bottom-2 h-8 w-8 bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageSelected}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleVideoSelected}
      />
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* Spacer for fixed input */}
      <div className="h-24"></div>
      
      {/* Call Overlay */}
      <CallOverlay
        isOpen={isInCall || isIncomingCall}
        callType={callType || 'voice'}
        isIncoming={isIncomingCall}
        isConnected={isCallConnected}
        callerName={event.dj || 'DJ Unknown'}
        callerAvatar="/api/placeholder/32/32"
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
        onToggleSpeaker={handleToggleSpeaker}
        isMuted={isMuted}
        isVideoEnabled={isVideoEnabled}
        isSpeakerEnabled={isSpeakerEnabled}
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        callDuration={formatCallDuration(callDuration)}
      />
    </div>
  );
};

export default EventChat;