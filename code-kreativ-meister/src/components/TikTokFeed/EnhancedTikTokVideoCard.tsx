import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  Volume2,
  VolumeX,
  Crown,
  Sparkles,
  MapPin,
  Ticket,
  Star,
  Clock,
  Plus,
  MoreHorizontal,
  Music,
  Repeat2,
  Check,
  Copy,
  Flag,
  UserPlus,
  UserMinus,
  Download,
  Scissors,
  Layers,
  Wand2,
  Gift,
  Zap,
  Eye,
  EyeOff,
  Camera,
  Mic,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Maximize,
  Send,
  Smile,
  ThumbsUp,
  ThumbsDown,
  Laugh,
  Angry,
  Sad,
  Surprised
} from "lucide-react";
import { toast } from "sonner";
import { DuetCreator } from '../Video/DuetCreator';
import { ARFilterEngine } from '../Video/ARFilterEngine';

interface EnhancedTikTokVideoCardProps {
  video: {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnail: string;
    creator: {
      name: string;
      handle: string;
      avatar: string;
      verified: boolean;
      tier: "free" | "premium" | "vip";
      followers?: number;
      isLive?: boolean;
    };
    venue?: {
      id: string;
      name: string;
      address: string;
      price: number;
      currency: string;
      isOpen: boolean;
      category: string;
      rating: number;
    } | null;
    stats: {
      views: number;
      likes: number;
      comments: number;
      shares: number;
      duets: number;
      saves: number;
    };
    tags: string[];
    isPremium: boolean;
    isLive?: boolean;
    sound?: {
      id: string;
      name: string;
      artist: string;
      duration: number;
      isOriginal: boolean;
    };
    effects?: string[];
    challenges?: string[];
    canDuet?: boolean;
    canStitch?: boolean;
    allowComments?: boolean;
    allowDownload?: boolean;
  };
  isActive: boolean;
  onNext: () => void;
}

const quickReactions = [
  { emoji: '❤️', name: 'Love', color: 'text-red-400' },
  { emoji: '👍', name: 'Like', color: 'text-blue-400' },
  { emoji: '😂', name: 'Laugh', color: 'text-yellow-400' },
  { emoji: '😮', name: 'Wow', color: 'text-purple-400' },
  { emoji: '😢', name: 'Sad', color: 'text-blue-300' },
  { emoji: '😡', name: 'Angry', color: 'text-red-500' }
];

const giftOptions = [
  { id: 'rose', name: 'Rose', emoji: '🌹', cost: 1, animation: 'bounce' },
  { id: 'heart', name: 'Herz', emoji: '❤️', cost: 5, animation: 'pulse' },
  { id: 'crown', name: 'Krone', emoji: '👑', cost: 10, animation: 'spin' },
  { id: 'diamond', name: 'Diamant', emoji: '💎', cost: 50, animation: 'sparkle' },
  { id: 'rocket', name: 'Rakete', emoji: '🚀', cost: 100, animation: 'fly' }
];

export const EnhancedTikTokVideoCard: React.FC<EnhancedTikTokVideoCardProps> = ({ 
  video, 
  isActive, 
  onNext 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showDuetCreator, setShowDuetCreator] = useState(false);
  const [showARFilters, setShowARFilters] = useState(false);
  const [showGifts, setShowGifts] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [comments, setComments] = useState([
    {
      id: '1',
      user: { name: 'MusicFan', avatar: '/api/placeholder/32/32' },
      text: 'Incredible performance! 🔥',
      timestamp: new Date(Date.now() - 300000),
      likes: 12,
      replies: 2
    },
    {
      id: '2',
      user: { name: 'NightOwl', avatar: '/api/placeholder/32/32' },
      text: 'This venue looks amazing! Where is it?',
      timestamp: new Date(Date.now() - 180000),
      likes: 8,
      replies: 1
    }
  ]);
  const [newComment, setNewComment] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  // Auto-play when card becomes active
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  // Update time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration || 0);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateTime);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateTime);
    };
  }, []);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Like entfernt' : 'Video geliked!');
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Aus Favoriten entfernt' : 'Zu Favoriten hinzugefügt!');
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? `${video.creator.handle} entfolgt` : `${video.creator.handle} gefolgt!`);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link kopiert!');
    }
  };

  const handleRepost = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReposted(!isReposted);
    toast.success(isReposted ? 'Repost entfernt' : 'Video repostet!');
  };

  const handleDuet = () => {
    if (!video.canDuet) {
      toast.error('Duetts sind für dieses Video nicht erlaubt');
      return;
    }
    setShowDuetCreator(true);
  };

  const handleStitch = () => {
    if (!video.canStitch) {
      toast.error('Stitches sind für dieses Video nicht erlaubt');
      return;
    }
    toast.success('Stitch-Editor wird geöffnet...');
  };

  const handleDownload = () => {
    if (!video.allowDownload) {
      toast.error('Download ist für dieses Video nicht erlaubt');
      return;
    }
    
    const link = document.createElement('a');
    link.href = video.videoUrl;
    link.download = `${video.creator.handle}-${video.id}.mp4`;
    link.click();
    toast.success('Download gestartet!');
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  const handleSeek = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
    }
  };

  const handleReaction = (emoji: string) => {
    setSelectedReaction(emoji);
    toast.success(`Reaktion ${emoji} gesendet!`);
    
    // Auto-remove reaction after 3 seconds
    setTimeout(() => setSelectedReaction(null), 3000);
  };

  const handleSendGift = (gift: typeof giftOptions[0]) => {
    toast.success(`${gift.name} ${gift.emoji} für ${gift.cost} Coins gesendet!`);
    setShowGifts(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now().toString(),
      user: { name: 'Du', avatar: '/api/placeholder/32/32' },
      text: newComment,
      timestamp: new Date(),
      likes: 0,
      replies: 0
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment('');
    toast.success('Kommentar hinzugefügt!');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="relative w-full h-full bg-black group">
        {/* Video */}
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnail}
          className="w-full h-full object-cover"
          loop
          playsInline
          muted={isMuted}
          onClick={handlePlayPause}
        />

        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Button
              variant="ghost"
              size="lg"
              className="bg-black/50 hover:bg-black/70 text-white rounded-full h-16 w-16"
              onClick={handlePlayPause}
            >
              <Play className="h-8 w-8 ml-1" />
            </Button>
          </div>
        )}

        {/* Top Overlay - Creator Info */}
        <div className="absolute top-4 left-4 right-20 z-20">
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12 border-2 border-white">
              <AvatarImage src={video.creator.avatar} />
              <AvatarFallback>{video.creator.name[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-white text-sm truncate">
                  @{video.creator.handle}
                </h3>
                {video.creator.verified && (
                  <Badge variant="secondary" className="bg-blue-500 text-white text-xs px-1 py-0">
                    ✓
                  </Badge>
                )}
                {video.creator.tier === "vip" && <Crown className="h-3 w-3 text-yellow-400" />}
                {video.creator.tier === "premium" && <Star className="h-3 w-3 text-purple-400" />}
                {video.creator.isLive && (
                  <Badge variant="destructive" className="text-xs animate-pulse">LIVE</Badge>
                )}
              </div>
              
              <p className="text-white text-sm opacity-90 line-clamp-2 mb-2">
                {video.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-2">
                {video.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-white text-xs bg-black/30 px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
              
              {/* Sound Info */}
              {video.sound && (
                <div className="flex items-center space-x-2 text-white text-xs bg-black/30 rounded-full px-3 py-1 max-w-fit">
                  <Music className="h-3 w-3" />
                  <span className="truncate">
                    {video.sound.isOriginal ? 'Original Sound' : `${video.sound.name} - ${video.sound.artist}`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-20 top-1/2 -translate-y-1/2 z-20">
          <div className="flex flex-col items-center space-y-4">
            {/* Follow Button */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12 p-0"
                onClick={handleFollow}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={video.creator.avatar} />
                  <AvatarFallback>{video.creator.name[0]}</AvatarFallback>
                </Avatar>
              </Button>
              {!isFollowing && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 hover:bg-red-600 rounded-full h-6 w-6 p-0"
                  onClick={handleFollow}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Like */}
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="sm"
                className={`bg-black/50 hover:bg-black/70 rounded-full h-12 w-12 p-0 ${
                  isLiked ? 'text-red-500' : 'text-white'
                }`}
                onClick={handleLike}
              >
                <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              <span className="text-white text-xs mt-1">{formatNumber(video.stats.likes + (isLiked ? 1 : 0))}</span>
            </div>

            {/* Comments */}
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="sm"
                className="bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12 p-0"
                onClick={() => setShowComments(true)}
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
              <span className="text-white text-xs mt-1">{formatNumber(video.stats.comments)}</span>
            </div>

            {/* Duet */}
            {video.canDuet && (
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12 p-0"
                  onClick={handleDuet}
                >
                  <Layers className="h-6 w-6" />
                </Button>
                <span className="text-white text-xs mt-1">{formatNumber(video.stats.duets)}</span>
              </div>
            )}

            {/* Share */}
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="sm"
                className="bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12 p-0"
                onClick={handleShare}
              >
                <Share className="h-6 w-6" />
              </Button>
              <span className="text-white text-xs mt-1">{formatNumber(video.stats.shares)}</span>
            </div>

            {/* Save */}
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="sm"
                className={`bg-black/50 hover:bg-black/70 rounded-full h-12 w-12 p-0 ${
                  isSaved ? 'text-yellow-500' : 'text-white'
                }`}
                onClick={handleSave}
              >
                <Bookmark className={`h-6 w-6 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
              <span className="text-white text-xs mt-1">{formatNumber(video.stats.saves + (isSaved ? 1 : 0))}</span>
            </div>

            {/* More Actions */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12 p-0"
                >
                  <MoreHorizontal className="h-6 w-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-48">
                <div className="space-y-1">
                  {video.canStitch && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={handleStitch}
                    >
                      <Scissors className="h-4 w-4 mr-2" />
                      Stitch
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setShowARFilters(true)}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    AR-Filter
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setShowGifts(true)}
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    Geschenk senden
                  </Button>
                  {video.allowDownload && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Link kopieren
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-red-400"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Melden
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="bg-black/50 hover:bg-black/70 text-white rounded-full h-10 w-10 p-0"
                onClick={handleMuteToggle}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="bg-black/50 hover:bg-black/70 text-white rounded-full h-10 w-10 p-0"
                onClick={() => handleSeek(-10)}
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="bg-black/50 hover:bg-black/70 text-white rounded-full h-10 w-10 p-0"
                onClick={() => handleSeek(10)}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
              
              {/* Speed Control */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-black/50 hover:bg-black/70 text-white rounded-full px-3 py-1 text-xs"
                  >
                    {playbackSpeed}x
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-32">
                  <div className="space-y-1">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                      <Button
                        key={speed}
                        variant={playbackSpeed === speed ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleSpeedChange(speed)}
                      >
                        {speed}x
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 mx-4">
              <div className="flex items-center space-x-2 text-white text-xs">
                <span>{formatTime(currentTime)}</span>
                <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-100"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right Info */}
            <div className="flex items-center space-x-2 text-white text-xs">
              <Eye className="h-4 w-4" />
              <span>{formatNumber(video.stats.views)}</span>
            </div>
          </div>
        </div>

        {/* Quick Reactions */}
        {selectedReaction && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
            <div className="text-6xl animate-bounce">
              {selectedReaction}
            </div>
          </div>
        )}

        {/* Venue Info */}
        {video.venue && (
          <div className="absolute bottom-20 left-4 right-20 z-20">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-white" />
                  <div>
                    <h4 className="text-white text-sm font-medium">{video.venue.name}</h4>
                    <p className="text-white/70 text-xs">{video.venue.address}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate(`/venue/${video.venue?.id}`)}
                >
                  <Ticket className="h-3 w-3 mr-1" />
                  {video.venue.currency}{video.venue.price}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Live Indicator */}
        {video.isLive && (
          <div className="absolute top-4 right-4 z-20">
            <Badge variant="destructive" className="animate-pulse">
              ● LIVE
            </Badge>
          </div>
        )}
      </div>

      {/* Comments Dialog */}
      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="max-w-md h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Kommentare ({comments.length})</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.user.avatar} />
                  <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">{comment.user.name}</span>
                    <span className="text-xs text-gray-400">
                      {comment.timestamp.toLocaleTimeString('de-DE', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <button className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white">
                      <Heart className="h-3 w-3" />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="text-xs text-gray-400 hover:text-white">
                      Antworten
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center space-x-2 pt-3 border-t">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Kommentar hinzufügen..."
              className="flex-1 bg-gray-700 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <Button
              size="sm"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="rounded-full"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Reactions */}
      <div className="fixed bottom-32 right-4 z-30 flex flex-col space-y-2">
        {quickReactions.map((reaction) => (
          <Button
            key={reaction.emoji}
            variant="ghost"
            size="sm"
            className="bg-black/50 hover:bg-black/70 text-white rounded-full h-10 w-10 p-0"
            onClick={() => handleReaction(reaction.emoji)}
          >
            <span className="text-lg">{reaction.emoji}</span>
          </Button>
        ))}
      </div>

      {/* Duet Creator Dialog */}
      <Dialog open={showDuetCreator} onOpenChange={setShowDuetCreator}>
        <DialogContent className="max-w-6xl h-[90vh] p-0">
          <DuetCreator
            originalVideo={{
              id: video.id,
              title: video.title,
              creator: video.creator,
              videoUrl: video.videoUrl,
              thumbnail: video.thumbnail,
              duration: duration || 30,
              audioUrl: video.sound?.name
            }}
            onSave={(duetData) => {
              console.log('Duet saved:', duetData);
              setShowDuetCreator(false);
              toast.success('Duett erfolgreich erstellt!');
            }}
            onCancel={() => setShowDuetCreator(false)}
          />
        </DialogContent>
      </Dialog>

      {/* AR Filter Dialog */}
      <Dialog open={showARFilters} onOpenChange={setShowARFilters}>
        <DialogContent className="max-w-6xl h-[90vh] p-0">
          <ARFilterEngine
            onFilterChange={(filters) => console.log('Filters changed:', filters)}
            onRecordStart={() => toast.success('AR-Aufnahme gestartet!')}
            onRecordStop={() => toast.success('AR-Aufnahme beendet!')}
          />
        </DialogContent>
      </Dialog>

      {/* Gifts Dialog */}
      <Dialog open={showGifts} onOpenChange={setShowGifts}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Geschenk senden</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-3">
            {giftOptions.map((gift) => (
              <button
                key={gift.id}
                onClick={() => handleSendGift(gift)}
                className="flex flex-col items-center space-y-2 p-4 border border-gray-600 rounded-lg hover:border-gray-400 transition-colors"
              >
                <span className="text-3xl">{gift.emoji}</span>
                <span className="font-medium">{gift.name}</span>
                <span className="text-sm text-gray-400">{gift.cost} Coins</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
