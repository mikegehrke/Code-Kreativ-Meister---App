import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  Check
} from "lucide-react";
import { toast } from "sonner";
interface TikTokVideoCardProps {
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
    };
    tags: string[];
    isPremium: boolean;
    isLive?: boolean;
  };
  isActive: boolean;
  onNext: () => void;
}

export const TikTokVideoCard = ({ video, isActive, onNext }: TikTokVideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
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

  const handleVenueBooking = () => {
    // Here you would integrate with your booking system
    if (video.venue) {
      alert(`Booking ${video.venue.name} for ${video.venue.currency}${video.venue.price}`);
    }
  };

  const handleRepost = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReposted(!isReposted);
    if (!isReposted) {
      toast.success("Video wieder veröffentlicht!");
    } else {
      toast.success("Wieder veröffentlichung rückgängig gemacht!");
    }
    // Here you would integrate with your repost API
    console.log(`${isReposted ? 'Unreposting' : 'Reposting'} video: ${video.id} by @${video.creator.handle}`);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "vip": return "from-yellow-400 to-orange-500";
      case "premium": return "from-purple-400 to-pink-500";
      default: return "from-gray-400 to-gray-600";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "vip": return <Crown className="h-3 w-3" />;
      case "premium": return <Sparkles className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* Top Content */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-8">
        {/* Live Badge */}
        {video.isLive && (
          <Badge className="bg-red-500/90 text-white animate-pulse backdrop-blur-sm mb-2">
            🔴 LIVE
          </Badge>
        )}

        {/* Premium Badge */}
        {video.isPremium && (
          <Badge className="bg-gradient-to-r from-yellow-400/90 to-orange-500/90 text-black backdrop-blur-sm">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        )}
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-3 bottom-16 z-40 space-y-5">
        {/* Like Button */}
        <div className="flex flex-col items-center space-y-2">
          <Button
            variant="ghost"
            size="icon"
            className={`h-12 w-12 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 border border-white/20 hover:scale-110 transition-all duration-200 ${
              isLiked ? 'text-red-500 hover:text-red-400' : 'text-white hover:text-white'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
              if (!isLiked) {
                toast.success("Video liked!");
              } else {
                toast.success("Like entfernt!");
              }
            }}
          >
            <Heart className={`h-7 w-7 transition-all duration-200 ${isLiked ? 'fill-red-500 text-red-500' : 'fill-none text-white'}`} />
          </Button>
          <span className="text-white text-xs font-bold drop-shadow-lg">
            {(video.stats.likes + (isLiked ? 1 : 0)).toLocaleString()}
          </span>
        </div>

        {/* Comments Button */}
        <div className="flex flex-col items-center space-y-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 border border-white/20 text-white hover:scale-110 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              toast.info("Comments coming soon!");
            }}
          >
            <MessageCircle className="h-7 w-7" />
          </Button>
          <span className="text-white text-xs font-bold drop-shadow-lg">
            {video.stats.comments.toLocaleString()}
          </span>
        </div>

        {/* Repost Button */}
        <div className="flex flex-col items-center space-y-2">
          <Button
            variant="ghost"
            size="icon"
            className={`h-12 w-12 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 border border-white/20 ${
              isReposted ? 'text-green-400' : 'text-white'
            } hover:scale-110 transition-all duration-200`}
            onClick={handleRepost}
          >
            <Repeat2 className={`h-7 w-7 ${isReposted ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Bookmark Button */}
        <div className="flex flex-col items-center space-y-2">
          <Button
            variant="ghost"
            size="icon"
            className={`h-12 w-12 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 border border-white/20 ${
              isSaved ? 'text-yellow-400' : 'text-white'
            } hover:scale-110 transition-all duration-200`}
            onClick={(e) => {
              e.stopPropagation();
              setIsSaved(!isSaved);
              if (!isSaved) {
                toast.success("Video saved!");
              }
            }}
          >
            <Bookmark className={`h-7 w-7 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Creator Avatar with Follow Button - Moved lower */}
        <div className="relative flex flex-col items-center mt-4">
          <Avatar 
            className="h-14 w-14 border-2 border-white cursor-pointer hover:scale-105 transition-transform duration-200" 
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.vibrate) navigator.vibrate(50);
              navigate(`/u/${video.creator.handle}`, { state: { creator: video.creator } });
            }}
          >
            <AvatarImage src={video.creator.avatar} alt={video.creator.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              {video.creator.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          {/* Follow Button - Now shows following status */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            {!isFollowing ? (
              <Button
                size="icon"
                className="h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white border-2 border-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFollowing(true);
                  toast.success(`Du folgst jetzt @${video.creator.handle}!`);
                }}
              >
                <Plus className="h-3 w-3" />
              </Button>
            ) : (
              <div className="h-6 w-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          {/* Tier Badge */}
          {video.creator.tier !== "free" && (
            <div className={`absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r ${getTierColor(video.creator.tier)} flex items-center justify-center border border-white`}>
              {getTierIcon(video.creator.tier)}
            </div>
          )}
        </div>

        {/* Music Button (spinning record effect) */}
        <div className="flex flex-col items-center space-y-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 border border-white/20 text-white hover:scale-110 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.vibrate) navigator.vibrate(50);
              const title = `Original Sound - ${video.creator.name}`;
              const slug = `original-${video.id}`;
              navigate(`/sound/${slug}`, { state: { title, artist: video.creator } });
            }}
          >
            <div className="relative">
              <Music className="h-7 w-7 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </Button>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-8">
        <div className="max-w-80">
          {/* Small Repost Indicator - Bottom Left */}
          {isReposted && (
            <div className="flex items-center space-x-1 mb-2">
              <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                <Repeat2 className="h-2.5 w-2.5 text-white" />
              </div>
              <span className="text-white/90 text-xs font-medium">Wieder veröffentlicht</span>
            </div>
          )}

          {/* Creator Info */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-white font-semibold">@{video.creator.handle}</span>
            {video.creator.verified && (
              <Badge variant="secondary" className="h-4 w-4 p-0 rounded-full bg-blue-500">
                ✓
              </Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="text-white font-medium mb-2 leading-tight">
            {video.title}
          </h3>

          {/* Description */}
          {video.description && (
            <p className={`text-white/90 text-sm leading-relaxed mb-3 ${
              showDescription ? '' : 'line-clamp-2'
            }`}>
              {video.description}
              {!showDescription && video.description.length > 100 && (
                <button
                  className="text-white/70 ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDescription(true);
                  }}
                >
                  more
                </button>
              )}
            </p>
          )}

          {/* Tags */}
          {video.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {video.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-white/80 text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Venue Information */}
          {video.venue && (
            <div 
              className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10 cursor-pointer hover:bg-black/50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/venue/${video.venue.id}`, { state: { venue: video.venue } });
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-white font-semibold">{video.venue.name}</h4>
                    <Badge className={`text-xs ${video.venue.isOpen ? 'bg-green-500' : 'bg-red-500'}`}>
                      {video.venue.isOpen ? 'OPEN' : 'CLOSED'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-3 w-3 text-white/70" />
                    <span className="text-white/70 text-xs">{video.venue.address}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-white/70">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span>{video.venue.rating}</span>
                    </div>
                    <span>{video.venue.category}</span>
                  </div>
                </div>
              </div>

              {/* Booking Section */}
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <span className="text-lg font-bold">
                    {video.venue.currency}{video.venue.price}
                  </span>
                  <span className="text-sm text-white/70 ml-1">per person</span>
                </div>
                
                <div className="text-white/70 text-xs">
                  👆 Tap to enter venue
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};