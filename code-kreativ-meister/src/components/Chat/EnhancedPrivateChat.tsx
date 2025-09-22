import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Send, 
  Smile, 
  Paperclip, 
  Image, 
  Video, 
  Mic, 
  MicOff,
  Phone,
  VideoIcon,
  MoreHorizontal,
  Search,
  Settings,
  Lock,
  Unlock,
  Download,
  Copy,
  Reply,
  Forward,
  Trash2,
  Edit,
  Clock,
  Check,
  CheckCheck,
  Eye,
  EyeOff,
  Camera,
  FileText,
  Music,
  MapPin,
  Calendar,
  Star,
  Heart,
  ThumbsUp,
  Laugh,
  Angry,
  Sad,
  Zap,
  Shield,
  AlertTriangle,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'location' | 'contact' | 'sticker' | 'gif';
  timestamp: Date;
  isRead: boolean;
  isDelivered: boolean;
  isEdited?: boolean;
  editedAt?: Date;
  replyTo?: string;
  forwardedFrom?: string;
  reactions?: { [userId: string]: string };
  isEncrypted: boolean;
  expiresAt?: Date;
  mediaUrl?: string;
  mediaSize?: number;
  mediaDuration?: number;
  thumbnailUrl?: string;
  fileName?: string;
  fileSize?: number;
  location?: { lat: number; lng: number; address?: string };
  contact?: { name: string; phone: string; avatar?: string };
}

interface ChatUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: Date;
  isTyping: boolean;
  isBlocked: boolean;
  isVerified: boolean;
}

interface EnhancedPrivateChatProps {
  currentUserId: string;
  chatUser: ChatUser;
  onSendMessage?: (message: Omit<ChatMessage, 'id' | 'timestamp' | 'isRead' | 'isDelivered'>) => void;
  onStartCall?: (type: 'audio' | 'video') => void;
  onBlockUser?: (userId: string) => void;
  onDeleteChat?: () => void;
}

const messageReactions = ['❤️', '👍', '😂', '😮', '😢', '😡'];

const stickers = [
  { id: '1', url: '/stickers/thumbs-up.png', name: 'Thumbs Up' },
  { id: '2', url: '/stickers/heart.png', name: 'Heart' },
  { id: '3', url: '/stickers/laugh.png', name: 'Laugh' },
  { id: '4', url: '/stickers/cool.png', name: 'Cool' },
  { id: '5', url: '/stickers/party.png', name: 'Party' },
  { id: '6', url: '/stickers/fire.png', name: 'Fire' },
];

export const EnhancedPrivateChat: React.FC<EnhancedPrivateChatProps> = ({
  currentUserId,
  chatUser,
  onSendMessage,
  onStartCall,
  onBlockUser,
  onDeleteChat
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [chatSettings, setChatSettings] = useState({
    encryptionEnabled: true,
    disappearingMessages: false,
    disappearingTime: 24, // hours
    readReceipts: true,
    typingIndicators: true,
    mediaAutoDownload: true,
    soundEnabled: true,
    theme: 'dark'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mock messages for demonstration
  useEffect(() => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        senderId: chatUser.id,
        receiverId: currentUserId,
        content: 'Hey! Wie geht es dir?',
        type: 'text',
        timestamp: new Date(Date.now() - 3600000),
        isRead: true,
        isDelivered: true,
        isEncrypted: true,
        reactions: { [currentUserId]: '👍' }
      },
      {
        id: '2',
        senderId: currentUserId,
        receiverId: chatUser.id,
        content: 'Alles gut! Danke der Nachfrage 😊',
        type: 'text',
        timestamp: new Date(Date.now() - 3500000),
        isRead: true,
        isDelivered: true,
        isEncrypted: true
      },
      {
        id: '3',
        senderId: chatUser.id,
        receiverId: currentUserId,
        content: 'Schau dir das mal an!',
        type: 'image',
        timestamp: new Date(Date.now() - 3000000),
        isRead: true,
        isDelivered: true,
        isEncrypted: true,
        mediaUrl: '/api/placeholder/300/200',
        thumbnailUrl: '/api/placeholder/150/100'
      },
      {
        id: '4',
        senderId: currentUserId,
        receiverId: chatUser.id,
        content: 'Wow, das sieht fantastisch aus! 🔥',
        type: 'text',
        timestamp: new Date(Date.now() - 2800000),
        isRead: false,
        isDelivered: true,
        isEncrypted: true,
        replyTo: '3'
      }
    ];
    setMessages(mockMessages);
  }, [chatUser.id, currentUserId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Typing indicator
  useEffect(() => {
    if (newMessage && chatSettings.typingIndicators) {
      setIsTyping(true);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [newMessage, chatSettings.typingIndicators]);

  // Handle sending messages
  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim()) return;

    const message: Omit<ChatMessage, 'id' | 'timestamp' | 'isRead' | 'isDelivered'> = {
      senderId: currentUserId,
      receiverId: chatUser.id,
      content: newMessage,
      type: 'text',
      isEncrypted: chatSettings.encryptionEnabled,
      replyTo: replyingTo?.id,
      expiresAt: chatSettings.disappearingMessages 
        ? new Date(Date.now() + chatSettings.disappearingTime * 60 * 60 * 1000)
        : undefined
    };

    const fullMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false,
      isDelivered: false
    };

    setMessages(prev => [...prev, fullMessage]);
    setNewMessage('');
    setReplyingTo(null);
    onSendMessage?.(message);

    // Simulate delivery and read status
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === fullMessage.id ? { ...msg, isDelivered: true } : msg
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === fullMessage.id ? { ...msg, isRead: true } : msg
      ));
    }, 3000);

    if (chatSettings.soundEnabled) {
      const audio = new Audio('/sounds/message-send.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  }, [newMessage, currentUserId, chatUser.id, chatSettings, replyingTo, onSendMessage]);

  // Handle editing messages
  const handleEditMessage = useCallback(() => {
    if (!editingMessage || !newMessage.trim()) return;

    setMessages(prev => prev.map(msg => 
      msg.id === editingMessage.id 
        ? { 
            ...msg, 
            content: newMessage, 
            isEdited: true, 
            editedAt: new Date() 
          }
        : msg
    ));

    setNewMessage('');
    setEditingMessage(null);
    toast.success('Nachricht bearbeitet');
  }, [editingMessage, newMessage]);

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
          senderId: currentUserId,
          receiverId: chatUser.id,
          content: 'Sprachnachricht',
          type: 'audio',
          timestamp: new Date(),
          isRead: false,
          isDelivered: false,
          isEncrypted: chatSettings.encryptionEnabled,
          mediaUrl: audioUrl,
          mediaDuration: 5 // Mock duration
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

  // File upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    let messageType: ChatMessage['type'] = 'file';

    if (file.type.startsWith('image/')) {
      messageType = 'image';
    } else if (file.type.startsWith('video/')) {
      messageType = 'video';
    } else if (file.type.startsWith('audio/')) {
      messageType = 'audio';
    }

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUserId,
      receiverId: chatUser.id,
      content: messageType === 'file' ? file.name : `${messageType} gesendet`,
      type: messageType,
      timestamp: new Date(),
      isRead: false,
      isDelivered: false,
      isEncrypted: chatSettings.encryptionEnabled,
      mediaUrl: fileUrl,
      fileName: file.name,
      fileSize: file.size,
      thumbnailUrl: messageType === 'image' ? fileUrl : undefined
    };

    setMessages(prev => [...prev, message]);
    setShowMediaPicker(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Message actions
  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions };
        if (reactions[currentUserId] === emoji) {
          delete reactions[currentUserId];
        } else {
          reactions[currentUserId] = emoji;
        }
        return { ...msg, reactions };
      }
      return msg;
    }));
  };

  const handleReply = (message: ChatMessage) => {
    setReplyingTo(message);
    inputRef.current?.focus();
  };

  const handleEdit = (message: ChatMessage) => {
    setEditingMessage(message);
    setNewMessage(message.content);
    inputRef.current?.focus();
  };

  const handleDelete = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    toast.success('Nachricht gelöscht');
  };

  const handleForward = (message: ChatMessage) => {
    // Implementation for forwarding message
    toast.success('Nachricht weitergeleitet');
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Text kopiert');
  };

  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const handleBulkDelete = () => {
    setMessages(prev => prev.filter(msg => !selectedMessages.has(msg.id)));
    setSelectedMessages(new Set());
    toast.success(`${selectedMessages.size} Nachrichten gelöscht`);
  };

  // Search messages
  const filteredMessages = searchQuery 
    ? messages.filter(msg => 
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  // Render message status
  const renderMessageStatus = (message: ChatMessage) => {
    if (message.senderId !== currentUserId) return null;

    if (message.isRead) {
      return <CheckCheck className="h-3 w-3 text-blue-400" />;
    } else if (message.isDelivered) {
      return <CheckCheck className="h-3 w-3 text-gray-400" />;
    } else {
      return <Check className="h-3 w-3 text-gray-400" />;
    }
  };

  // Render message content
  const renderMessageContent = (message: ChatMessage) => {
    switch (message.type) {
      case 'image':
        return (
          <div className="relative">
            <img 
              src={message.mediaUrl} 
              alt="Shared image" 
              className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.mediaUrl, '_blank')}
            />
            {message.content !== 'image gesendet' && (
              <p className="mt-2 text-sm">{message.content}</p>
            )}
          </div>
        );
      
      case 'video':
        return (
          <div className="relative">
            <video 
              src={message.mediaUrl} 
              controls 
              className="max-w-xs rounded-lg"
              poster={message.thumbnailUrl}
            />
            {message.content !== 'video gesendet' && (
              <p className="mt-2 text-sm">{message.content}</p>
            )}
          </div>
        );
      
      case 'audio':
        return (
          <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3 max-w-xs">
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Music className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <div className="h-1 bg-white/20 rounded-full">
                <div className="h-full w-1/3 bg-blue-500 rounded-full"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0:00</span>
                <span>{message.mediaDuration}s</span>
              </div>
            </div>
          </div>
        );
      
      case 'file':
        return (
          <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3 max-w-xs">
            <FileText className="h-8 w-8 text-blue-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.fileName}</p>
              <p className="text-xs text-gray-400">
                {message.fileSize ? `${(message.fileSize / 1024 / 1024).toFixed(1)} MB` : 'Datei'}
              </p>
            </div>
            <Button size="sm" variant="ghost">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        );
      
      default:
        return <p className="text-sm break-words">{message.content}</p>;
    }
  };

  // Render message component
  const renderMessage = (message: ChatMessage) => {
    const isOwn = message.senderId === currentUserId;
    const replyMessage = message.replyTo ? messages.find(m => m.id === message.replyTo) : null;

    return (
      <div
        key={message.id}
        className={`flex items-end space-x-2 mb-4 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''} ${
          selectedMessages.has(message.id) ? 'bg-blue-500/10 rounded-lg p-2' : ''
        }`}
        onClick={() => selectedMessages.size > 0 && toggleMessageSelection(message.id)}
      >
        {!isOwn && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={chatUser.avatar} />
            <AvatarFallback>{chatUser.name[0]}</AvatarFallback>
          </Avatar>
        )}
        
        <div className={`max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
          {/* Reply indicator */}
          {replyMessage && (
            <div className={`text-xs text-gray-400 mb-1 p-2 bg-white/5 rounded border-l-2 ${
              isOwn ? 'border-blue-500' : 'border-gray-500'
            }`}>
              <div className="font-medium">{replyMessage.senderId === currentUserId ? 'Du' : chatUser.name}</div>
              <div className="truncate">{replyMessage.content}</div>
            </div>
          )}
          
          {/* Message bubble */}
          <div
            className={`relative px-4 py-2 rounded-2xl ${
              isOwn 
                ? 'bg-blue-600 text-white rounded-br-md' 
                : 'bg-white/10 text-white rounded-bl-md'
            } ${message.expiresAt ? 'border border-yellow-500/30' : ''}`}
          >
            {renderMessageContent(message)}
            
            {/* Message reactions */}
            {message.reactions && Object.keys(message.reactions).length > 0 && (
              <div className="flex items-center space-x-1 mt-2 -mb-1">
                {Object.entries(message.reactions).map(([userId, emoji]) => (
                  <span key={userId} className="text-xs bg-white/20 rounded-full px-1">
                    {emoji}
                  </span>
                ))}
              </div>
            )}
            
            {/* Message actions */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 bg-white/10 hover:bg-white/20"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-48">
                <div className="space-y-1">
                  <div className="flex space-x-1 p-1">
                    {messageReactions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(message.id, emoji)}
                        className="p-1 hover:bg-white/10 rounded text-sm"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-white/10 pt-1">
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
                      onClick={() => handleCopy(message.content)}
                    >
                      <Copy className="h-3 w-3 mr-2" />
                      Kopieren
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleForward(message)}
                    >
                      <Forward className="h-3 w-3 mr-2" />
                      Weiterleiten
                    </Button>
                    {isOwn && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleEdit(message)}
                        >
                          <Edit className="h-3 w-3 mr-2" />
                          Bearbeiten
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-red-400"
                          onClick={() => handleDelete(message.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Löschen
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Message info */}
          <div className={`flex items-center space-x-1 mt-1 text-xs text-gray-400 ${
            isOwn ? 'flex-row-reverse space-x-reverse' : ''
          }`}>
            <span>
              {message.timestamp.toLocaleTimeString('de-DE', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            {message.isEdited && (
              <span className="text-gray-500">bearbeitet</span>
            )}
            {message.isEncrypted && (
              <Lock className="h-2 w-2" />
            )}
            {message.expiresAt && (
              <Clock className="h-2 w-2 text-yellow-400" />
            )}
            {renderMessageStatus(message)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={chatUser.avatar} />
            <AvatarFallback>{chatUser.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-white">{chatUser.name}</h3>
              {chatUser.isVerified && <Badge variant="secondary" className="text-xs">✓</Badge>}
            </div>
            <p className="text-xs text-gray-400">
              {chatUser.isOnline ? (
                chatUser.isTyping ? 'tippt...' : 'online'
              ) : (
                chatUser.lastSeen ? `zuletzt online ${chatUser.lastSeen.toLocaleString('de-DE')}` : 'offline'
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Search */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className={showSearch ? 'bg-white/10' : ''}
          >
            <Search className="h-4 w-4" />
          </Button>
          
          {/* Voice Call */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStartCall?.('audio')}
          >
            <Phone className="h-4 w-4" />
          </Button>
          
          {/* Video Call */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStartCall?.('video')}
          >
            <VideoIcon className="h-4 w-4" />
          </Button>
          
          {/* Settings */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <Tabs defaultValue="settings">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="settings">Einstellungen</TabsTrigger>
                  <TabsTrigger value="actions">Aktionen</TabsTrigger>
                </TabsList>
                
                <TabsContent value="settings" className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Verschlüsselung</span>
                    <Button
                      size="sm"
                      variant={chatSettings.encryptionEnabled ? "default" : "outline"}
                      onClick={() => setChatSettings(prev => ({ ...prev, encryptionEnabled: !prev.encryptionEnabled }))}
                    >
                      {chatSettings.encryptionEnabled ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Verschwindende Nachrichten</span>
                    <Button
                      size="sm"
                      variant={chatSettings.disappearingMessages ? "default" : "outline"}
                      onClick={() => setChatSettings(prev => ({ ...prev, disappearingMessages: !prev.disappearingMessages }))}
                    >
                      {chatSettings.disappearingMessages ? 'An' : 'Aus'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Lesebestätigungen</span>
                    <Button
                      size="sm"
                      variant={chatSettings.readReceipts ? "default" : "outline"}
                      onClick={() => setChatSettings(prev => ({ ...prev, readReceipts: !prev.readReceipts }))}
                    >
                      {chatSettings.readReceipts ? 'An' : 'Aus'}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="actions" className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedMessages(new Set(messages.map(m => m.id)))}
                  >
                    <CheckCheck className="h-3 w-3 mr-2" />
                    Alle auswählen
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-red-400"
                    onClick={() => onBlockUser?.(chatUser.id)}
                  >
                    <Shield className="h-3 w-3 mr-2" />
                    Benutzer blockieren
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-red-400"
                    onClick={onDeleteChat}
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Chat löschen
                  </Button>
                </TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="p-3 border-b border-white/10 bg-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nachrichten durchsuchen..."
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedMessages.size > 0 && (
        <div className="flex items-center justify-between p-3 bg-blue-600/20 border-b border-blue-500/30">
          <span className="text-sm text-blue-300">
            {selectedMessages.size} Nachricht{selectedMessages.size !== 1 ? 'en' : ''} ausgewählt
          </span>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedMessages(new Set())}
            >
              Abbrechen
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Löschen
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-1">
          {filteredMessages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Reply Banner */}
      {replyingTo && (
        <div className="flex items-center justify-between p-3 bg-blue-500/10 border-t border-blue-500/20">
          <div className="flex items-center space-x-2">
            <Reply className="h-3 w-3 text-blue-400" />
            <span className="text-xs text-blue-300">Antwort an {replyingTo.senderId === currentUserId ? 'dich' : chatUser.name}</span>
            <span className="text-xs text-gray-400 truncate max-w-32">{replyingTo.content}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={() => setReplyingTo(null)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Edit Banner */}
      {editingMessage && (
        <div className="flex items-center justify-between p-3 bg-yellow-500/10 border-t border-yellow-500/20">
          <div className="flex items-center space-x-2">
            <Edit className="h-3 w-3 text-yellow-400" />
            <span className="text-xs text-yellow-300">Nachricht bearbeiten</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={() => {
              setEditingMessage(null);
              setNewMessage('');
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="flex items-end space-x-2">
          {/* Media Picker */}
          <Popover open={showMediaPicker} onOpenChange={setShowMediaPicker}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Paperclip className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="ghost"
                  className="flex flex-col items-center space-y-2 h-16"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image className="h-5 w-5" />
                  <span className="text-xs">Foto</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex flex-col items-center space-y-2 h-16"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Video className="h-5 w-5" />
                  <span className="text-xs">Video</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex flex-col items-center space-y-2 h-16"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-xs">Datei</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex flex-col items-center space-y-2 h-16"
                  onClick={() => {
                    // Location sharing implementation
                    toast.success('Standort wird geteilt...');
                    setShowMediaPicker(false);
                  }}
                >
                  <MapPin className="h-5 w-5" />
                  <span className="text-xs">Standort</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
          />

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
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (editingMessage) {
                    handleEditMessage();
                  } else {
                    handleSendMessage();
                  }
                }
              }}
              placeholder="Nachricht eingeben..."
              className="pr-20 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              maxLength={1000}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <span className="text-xs text-gray-400">{newMessage.length}/1000</span>
            </div>
          </div>

          {/* Emoji & Stickers */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <Tabs defaultValue="emoji">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="emoji">Emoji</TabsTrigger>
                  <TabsTrigger value="stickers">Sticker</TabsTrigger>
                </TabsList>
                
                <TabsContent value="emoji">
                  <div className="grid grid-cols-8 gap-2 p-2 max-h-64 overflow-y-auto">
                    {['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setNewMessage(prev => prev + emoji)}
                        className="p-2 hover:bg-white/10 rounded text-lg"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="stickers">
                  <div className="grid grid-cols-3 gap-2 p-2">
                    {stickers.map((sticker) => (
                      <button
                        key={sticker.id}
                        onClick={() => {
                          // Send sticker as message
                          const message: ChatMessage = {
                            id: Date.now().toString(),
                            senderId: currentUserId,
                            receiverId: chatUser.id,
                            content: sticker.name,
                            type: 'sticker',
                            timestamp: new Date(),
                            isRead: false,
                            isDelivered: false,
                            isEncrypted: chatSettings.encryptionEnabled,
                            mediaUrl: sticker.url
                          };
                          setMessages(prev => [...prev, message]);
                        }}
                        className="p-2 hover:bg-white/10 rounded"
                      >
                        <img src={sticker.url} alt={sticker.name} className="w-16 h-16 object-contain" />
                      </button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>

          {/* Send Button */}
          <Button
            onClick={editingMessage ? handleEditMessage : handleSendMessage}
            disabled={!newMessage.trim()}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {editingMessage ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
