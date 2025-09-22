import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Crown,
  Sparkles
} from "lucide-react";

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: string;
    creator: {
      name: string;
      handle: string;
      avatar: string;
      verified: boolean;
      tier: "free" | "premium" | "vip";
    };
    stats: {
      views: number;
      likes: number;
      comments: number;
    };
    tags: string[];
    isPremium: boolean;
    isLive?: boolean;
  };
}

export const VideoCard = ({ video }: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
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
    <div className="relative bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-glow transition-all duration-300 group">
      {/* Video Container */}
      <div className="relative aspect-[9/16] sm:aspect-video bg-black overflow-hidden">
        {/* Video Thumbnail/Player */}
        <div className="relative w-full h-full">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          
          {/* Video Overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
          
          {/* Play Button */}
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className="bg-black/50 rounded-full p-4 backdrop-blur-sm">
              {isPlaying ? (
                <Pause className="h-6 w-6 text-white" />
              ) : (
                <Play className="h-6 w-6 text-white ml-1" />
              )}
            </div>
          </button>

          {/* Controls */}
          <div className="absolute bottom-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
              onClick={handleMuteToggle}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-white" />
              ) : (
                <Volume2 className="h-4 w-4 text-white" />
              )}
            </Button>
          </div>

          {/* Duration */}
          <Badge className="absolute bottom-4 left-4 bg-black/70 text-white">
            {video.duration}
          </Badge>

          {/* Live Badge */}
          {video.isLive && (
            <Badge className="absolute top-4 left-4 bg-red-500 text-white animate-pulse">
              🔴 LIVE
            </Badge>
          )}

          {/* Premium Badge */}
          {video.isPremium && (
            <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Creator Info */}
        <div className="flex items-start space-x-3 mb-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={video.creator.avatar} alt={video.creator.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {video.creator.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {video.creator.tier !== "free" && (
              <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r ${getTierColor(video.creator.tier)} flex items-center justify-center`}>
                {getTierIcon(video.creator.tier)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-sm truncate">
                {video.creator.name}
              </h3>
              {video.creator.verified && (
                <Badge variant="secondary" className="h-4 w-4 p-0 rounded-full bg-blue-500">
                  ✓
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              @{video.creator.handle}
            </p>
          </div>

          <Button variant="outline" size="sm" className="shrink-0">
            Follow
          </Button>
        </div>

        {/* Video Info */}
        <div className="space-y-2">
          <h4 className="font-medium line-clamp-2 leading-tight">
            {video.title}
          </h4>
          
          {video.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {video.description}
            </p>
          )}

          {/* Tags */}
          {video.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {video.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {video.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{video.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{video.stats.views.toLocaleString()} views</span>
            <span>2h ago</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 ${isLiked ? 'text-red-500' : ''}`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              {video.stats.likes.toLocaleString()}
            </Button>
            
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              {video.stats.comments.toLocaleString()}
            </Button>
            
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className={isSaved ? 'text-primary' : ''}
            onClick={() => setIsSaved(!isSaved)}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>
    </div>
  );
};