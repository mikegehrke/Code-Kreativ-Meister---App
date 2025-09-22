import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, 
  Smile, 
  Gift, 
  Heart, 
  ThumbsUp, 
  Fire, 
  Star,
  Crown,
  Zap,
  Music,
  Camera,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  Shield,
  Ban,
  Clock,
  Globe,
  Eye,
  EyeOff,
  Reply,
  Copy,
  Flag,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'emoji' | 'gift' | 'super_chat' | 'voice' | 'system';
  isVip?: boolean;
  isModerator?: boolean;
  isCreator?: boolean;
  giftValue?: number;
  superChatAmount?: number;
  voiceUrl?: string;
  voiceDuration?: number;
  reactions?: { [emoji: string]: number };
  replyTo?: string;
  isTranslated?: boolean;
  originalLanguage?: string;
}

interface EnhancedLiveChatProps {
  streamId: string;
  isCreator?: boolean;
  isModerator?: boolean;
  isVip?: boolean;
  viewerCount: number;
  onSendMessage?: (message: string, type?: string) => void;
  onSendGift?: (giftId: string, amount: number) => void;
  onSuperChat?: (message: string, amount: number) => void;
}

const quickReactions = ['❤️', '👍', '🔥', '😂', '😍', '👏', '🎉', '💯'];

const giftOptions = [
  { id: 'heart', name: 'Herz', emoji: '❤️', cost: 1 },
  { id: 'rose', name: 'Rose', emoji: '🌹', cost: 5 },
  { id: 'crown', name: 'Krone', emoji: '👑', cost: 10 },
  { id: 'diamond', name: 'Diamant', emoji: '💎', cost: 50 },
  { id: 'rocket', name: 'Rakete', emoji: '🚀', cost: 100 },
];

export const EnhancedLiveChat: React.FC<EnhancedLiveChatProps> = ({
  streamId,
  isCreator = false,
  isModerator = false,
  isVip = false,
  viewerCount,
  onSendMessage,
  onSendGift,
  onSuperChat
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [showSuperChat, setShowSuperChat] = useState(false);
  const [superChatAmount, setSuperChatAmount] = useState(5);
  const [slowModeEnabled, setSlowModeEnabled] = useState(false);
  const [slowModeDelay, setSlowModeDelay] = useState(5);
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const [mutedUsers, setMutedUsers] = useState<Set<string>>(new Set());
  const [pinnedMessage, setPinnedMessage] = useState<ChatMessage | null>(null);
  const [chatSettings, setChatSettings] = useState({
    autoTranslate: false,
    showTimestamps: true,
    soundEnabled: true,
    vipOnly: false,
    followersOnly: false
  });
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Mock messages for demonstration
  useEffect(() => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        userId: 'user1',
        username: 'MusicLover23',
        avatar: '/api/placeholder/32/32',
        message: 'Incredible performance! 🔥',
        timestamp: new Date(Date.now() - 300000),
        type: 'text',
        reactions: { '❤️': 5, '🔥': 3 }
      },
      {
        id: '2',
        userId: 'user2',
        username: 'VIPFan',
        avatar: '/api/placeholder/32/32',
        message: 'This is amazing! Keep it up!',
        timestamp: new Date(Date.now() - 240000),
        type: 'super_chat',
        isVip: true,
        superChatAmount: 10,
        reactions: { '👍': 8, '🎉': 4 }
      },
      {
        id: '3',
        userId: 'user3',
        username: 'NightOwl',
        avatar: '/api/placeholder/32/32',
        message: 'Greetings from Berlin! 🇩🇪',
        timestamp: new Date(Date.now() - 180000),
        type: 'text',
        isTranslated: true,
        originalLanguage: 'de'
      }
    ];
    setMessages(mockMessages);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim()) return;

    // Check slow mode
    if (slowModeEnabled && !isCreator && !isModerator) {
      const now = Date.now();
      if (now - lastMessageTime < slowModeDelay * 1000) {
        toast.error(`Slow Mode aktiv. Warte noch ${Math.ceil((slowModeDelay * 1000 - (now - lastMessageTime)) / 1000)} Sekunden.`);
        return;
      }
      setLastMessageTime(now);
    }

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current_user',
      username: 'Du',
      avatar: '/api/placeholder/32/32',
      message: newMessage,
      timestamp: new Date(),
      type: 'text',
      isCreator,
      isModerator,
      isVip,
      replyTo: replyingTo?.id
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setReplyingTo(null);
    onSendMessage?.(newMessage);

    if (chatSettings.soundEnabled) {
      // Play send sound
      const audio = new Audio('/sounds/message-send.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  }, [newMessage, slowModeEnabled, slowModeDelay, lastMessageTime, isCreator, isModerator, isVip, replyingTo, onSendMessage, chatSettings.soundEnabled]);

  // Handle quick reactions
  const handleQuickReaction = (emoji: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current_user',
      username: 'Du',
      avatar: '/api/placeholder/32/32',
      message: emoji,
      timestamp: new Date(),
      type: 'emoji',
      isCreator,
      isModerator,
      isVip
    };

    setMessages(prev => [...prev, message]);
    onSendMessage?.(emoji, 'emoji');
  };

  // Handle gift sending
  const handleSendGift = (gift: typeof giftOptions[0]) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current_user',
      username: 'Du',
      avatar: '/api/placeholder/32/32',
      message: `hat ein ${gift.name} ${gift.emoji} gesendet!`,
      timestamp: new Date(),
      type: 'gift',
      giftValue: gift.cost,
      isCreator,
      isModerator,
      isVip
    };

    setMessages(prev => [...prev, message]);
    setShowGiftPanel(false);
    onSendGift?.(gift.id, gift.cost);
    toast.success(`${gift.name} für ${gift.cost} Coins gesendet!`);
  };

  // Handle Super Chat
  const handleSuperChat = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current_user',
      username: 'Du',
      avatar: '/api/placeholder/32/32',
      message: newMessage,
      timestamp: new Date(),
      type: 'super_chat',
      superChatAmount,
      isCreator,
      isModerator,
      isVip
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setShowSuperChat(false);
    onSuperChat?.(newMessage, superChatAmount);
    toast.success(`Super Chat für €${superChatAmount} gesendet!`);
  };

  // Voice recording
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const message: ChatMessage = {
          id: Date.now().toString(),
          userId: 'current_user',
          username: 'Du',
          avatar: '/api/placeholder/32/32',
          message: 'Sprachnachricht',
          timestamp: new Date(),
          type: 'voice',
          voiceUrl: audioUrl,
          voiceDuration: 5, // Mock duration
          isCreator,
          isModerator,
          isVip
        };

        setMessages(prev => [...prev, message]);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingVoice(true);
    } catch (error) {
      toast.error('Mikrofon-Zugriff verweigert');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
    }
  };

  // Message actions
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

  const handleReply = (message: ChatMessage) => {
    setReplyingTo(message);
    inputRef.current?.focus();
  };

  const handleMuteUser = (userId: string) => {
    setMutedUsers(prev => new Set([...prev, userId]));
    toast.success('Benutzer stummgeschaltet');
  };

  const handlePinMessage = (message: ChatMessage) => {
    setPinnedMessage(message);
    toast.success('Nachricht angepinnt');
  };

  // Render message component
  const renderMessage = (message: ChatMessage) => {
    if (mutedUsers.has(message.userId)) return null;

    const isSystem = message.type === 'system';
    const isSuperChat = message.type === 'super_chat';
    const isGift = message.type === 'gift';
    const isVoice = message.type === 'voice';

    return (
      <div
        key={message.id}
        className={`flex items-start space-x-2 p-2 rounded-lg transition-colors hover:bg-white/5 ${
          isSuperChat ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' :
          isGift ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30' :
          isSystem ? 'bg-blue-500/10 border border-blue-500/20' : ''
        }`}
      >
        {!isSystem && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={message.avatar} />
            <AvatarFallback>{message.username[0]}</AvatarFallback>
          </Avatar>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            {!isSystem && (
              <>
                <span className={`font-medium text-sm ${
                  message.isCreator ? 'text-red-400' :
                  message.isModerator ? 'text-green-400' :
                  message.isVip ? 'text-yellow-400' : 'text-white'
                }`}>
                  {message.username}
                </span>
                
                {message.isCreator && <Crown className="h-3 w-3 text-red-400" />}
                {message.isModerator && <Shield className="h-3 w-3 text-green-400" />}
                {message.isVip && <Star className="h-3 w-3 text-yellow-400" />}
                
                {isSuperChat && (
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 text-xs">
                    €{message.superChatAmount}
                  </Badge>
                )}
                
                {isGift && (
                  <Badge variant="secondary" className="bg-pink-500/20 text-pink-300 text-xs">
                    {message.giftValue} Coins
                  </Badge>
                )}
              </>
            )}
            
            {chatSettings.showTimestamps && (
              <span className="text-xs text-gray-400">
                {message.timestamp.toLocaleTimeString('de-DE', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            )}
          </div>
          
          {message.replyTo && (
            <div className="text-xs text-gray-400 mb-1 pl-2 border-l-2 border-gray-600">
              Antwort auf Nachricht
            </div>
          )}
          
          <div className="text-sm text-white break-words">
            {isVoice ? (
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-2">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Volume2 className="h-3 w-3" />
                </Button>
                <div className="flex-1 h-1 bg-white/20 rounded-full">
                  <div className="h-full w-1/3 bg-blue-500 rounded-full"></div>
                </div>
                <span className="text-xs">{message.voiceDuration}s</span>
              </div>
            ) : (
              <>
                {message.message}
                {message.isTranslated && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    <Globe className="h-2 w-2 mr-1" />
                    Übersetzt
                  </Badge>
                )}
              </>
            )}
          </div>
          
          {message.reactions && Object.keys(message.reactions).length > 0 && (
            <div className="flex items-center space-x-1 mt-2">
              {Object.entries(message.reactions).map(([emoji, count]) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(message.id, emoji)}
                  className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 rounded-full px-2 py-1 text-xs transition-colors"
                >
                  <span>{emoji}</span>
                  <span>{count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {!isSystem && (isCreator || isModerator) && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleReply(message)}
                >
                  <Reply className="h-3 w-3 mr-2" />
                  Antworten
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handlePinMessage(message)}
                >
                  <Star className="h-3 w-3 mr-2" />
                  Anpinnen
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-red-400"
                  onClick={() => handleMuteUser(message.userId)}
                >
                  <Ban className="h-3 w-3 mr-2" />
                  Stummschalten
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-300">{viewerCount.toLocaleString()}</span>
          </div>
          {slowModeEnabled && (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-2 w-2 mr-1" />
              Slow {slowModeDelay}s
            </Badge>
          )}
        </div>
        
        {(isCreator || isModerator) && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <Tabs defaultValue="moderation">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="moderation">Moderation</TabsTrigger>
                  <TabsTrigger value="settings">Einstellungen</TabsTrigger>
                </TabsList>
                
                <TabsContent value="moderation" className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Slow Mode</span>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={slowModeDelay}
                        onChange={(e) => setSlowModeDelay(Number(e.target.value))}
                        className="w-16 h-8"
                        min="1"
                        max="300"
                      />
                      <Button
                        size="sm"
                        variant={slowModeEnabled ? "default" : "outline"}
                        onClick={() => setSlowModeEnabled(!slowModeEnabled)}
                      >
                        {slowModeEnabled ? 'An' : 'Aus'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nur VIPs</span>
                    <Button
                      size="sm"
                      variant={chatSettings.vipOnly ? "default" : "outline"}
                      onClick={() => setChatSettings(prev => ({ ...prev, vipOnly: !prev.vipOnly }))}
                    >
                      {chatSettings.vipOnly ? 'An' : 'Aus'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nur Follower</span>
                    <Button
                      size="sm"
                      variant={chatSettings.followersOnly ? "default" : "outline"}
                      onClick={() => setChatSettings(prev => ({ ...prev, followersOnly: !prev.followersOnly }))}
                    >
                      {chatSettings.followersOnly ? 'An' : 'Aus'}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-Übersetzung</span>
                    <Button
                      size="sm"
                      variant={chatSettings.autoTranslate ? "default" : "outline"}
                      onClick={() => setChatSettings(prev => ({ ...prev, autoTranslate: !prev.autoTranslate }))}
                    >
                      {chatSettings.autoTranslate ? 'An' : 'Aus'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Zeitstempel</span>
                    <Button
                      size="sm"
                      variant={chatSettings.showTimestamps ? "default" : "outline"}
                      onClick={() => setChatSettings(prev => ({ ...prev, showTimestamps: !prev.showTimestamps }))}
                    >
                      {chatSettings.showTimestamps ? 'An' : 'Aus'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Chat-Sounds</span>
                    <Button
                      size="sm"
                      variant={chatSettings.soundEnabled ? "default" : "outline"}
                      onClick={() => setChatSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                    >
                      {chatSettings.soundEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Pinned Message */}
      {pinnedMessage && (
        <div className="p-2 bg-yellow-500/10 border-b border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-3 w-3 text-yellow-400" />
              <span className="text-xs text-yellow-300">Angepinnt:</span>
              <span className="text-xs text-white truncate">{pinnedMessage.message}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={() => setPinnedMessage(null)}
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Reactions */}
      <div className="flex items-center justify-center space-x-1 p-2 border-t border-white/10">
        {quickReactions.map((emoji) => (
          <button
            key={emoji}
            onClick={() => handleQuickReaction(emoji)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-lg"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Reply Banner */}
      {replyingTo && (
        <div className="flex items-center justify-between p-2 bg-blue-500/10 border-t border-blue-500/20">
          <div className="flex items-center space-x-2">
            <Reply className="h-3 w-3 text-blue-400" />
            <span className="text-xs text-blue-300">Antwort an {replyingTo.username}</span>
            <span className="text-xs text-gray-400 truncate max-w-32">{replyingTo.message}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={() => setReplyingTo(null)}
          >
            ×
          </Button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center space-x-2">
          {/* Voice Recording */}
          <Button
            variant="ghost"
            size="sm"
            className={`${isRecordingVoice ? 'bg-red-500/20 text-red-400' : ''}`}
            onMouseDown={startVoiceRecording}
            onMouseUp={stopVoiceRecording}
            onMouseLeave={stopVoiceRecording}
          >
            {isRecordingVoice ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Nachricht eingeben..."
              className="pr-20 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              maxLength={500}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <span className="text-xs text-gray-400">{newMessage.length}/500</span>
            </div>
          </div>

          {/* Emoji Picker */}
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <div className="grid grid-cols-8 gap-2 p-2">
                {['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setNewMessage(prev => prev + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="p-2 hover:bg-white/10 rounded text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Gift Panel */}
          <Popover open={showGiftPanel} onOpenChange={setShowGiftPanel}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Gift className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Geschenke senden</h4>
                <div className="grid grid-cols-2 gap-2">
                  {giftOptions.map((gift) => (
                    <button
                      key={gift.id}
                      onClick={() => handleSendGift(gift)}
                      className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <span className="text-lg">{gift.emoji}</span>
                      <div className="text-left">
                        <div className="text-sm font-medium">{gift.name}</div>
                        <div className="text-xs text-gray-400">{gift.cost} Coins</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Super Chat */}
          <Popover open={showSuperChat} onOpenChange={setShowSuperChat}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="text-yellow-400">
                <Zap className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Super Chat</h4>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Betrag (€)</label>
                  <div className="flex space-x-2">
                    {[5, 10, 25, 50, 100].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setSuperChatAmount(amount)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          superChatAmount === amount 
                            ? 'bg-yellow-500 text-black' 
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        €{amount}
                      </button>
                    ))}
                  </div>
                </div>
                <Button 
                  onClick={handleSuperChat}
                  disabled={!newMessage.trim()}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  Super Chat für €{superChatAmount} senden
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Send Button */}
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
