import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Heart,
  MessageCircle,
  Share,
  Volume2,
  VolumeX,
  Crown,
  Sparkles,
  Gift
} from "lucide-react";

interface LiveCardProps {
  stream: {
    id: string;
    title: string;
    category: string;
    thumbnail: string;
    viewerCount: number;
    creator: {
      name: string;
      handle: string;
      avatar: string;
      verified: boolean;
      tier: "free" | "premium" | "vip";
    };
    tags: string[];
    isPaid: boolean;
    price?: number;
    startedAt: string;
  };
}

export const LiveCard = ({ stream }: LiveCardProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

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
    <div className="relative bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-glow transition-all duration-300 group cursor-pointer">
      {/* Live Video Container */}
      <div className="relative aspect-video bg-black overflow-hidden">
        {/* Video Thumbnail/Stream */}
        <img
          src={stream.thumbnail}
          alt={stream.title}
          className="w-full h-full object-cover"
        />
        
        {/* Live Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        
        {/* Live Indicator */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <Badge className="bg-red-500 text-white animate-pulse">
            🔴 LIVE
          </Badge>
          <Badge className="bg-black/70 text-white">
            <Users className="h-3 w-3 mr-1" />
            {stream.viewerCount.toLocaleString()}
          </Badge>
        </div>

        {/* Paid Stream Badge */}
        {stream.isPaid && (
          <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
            <Crown className="h-3 w-3 mr-1" />
            ${stream.price}
          </Badge>
        )}

        {/* Audio Control */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-4 right-4 h-8 w-8 bg-black/70 hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4 text-white" />
          ) : (
            <Volume2 className="h-4 w-4 text-white" />
          )}
        </Button>

        {/* Category */}
        <Badge className="absolute bottom-4 left-4 bg-primary text-primary-foreground">
          {stream.category}
        </Badge>
      </div>

      {/* Stream Info */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-base line-clamp-2 mb-2 leading-tight">
          {stream.title}
        </h3>

        {/* Creator Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={stream.creator.avatar} alt={stream.creator.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {stream.creator.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {stream.creator.tier !== "free" && (
                <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r ${getTierColor(stream.creator.tier)} flex items-center justify-center`}>
                  {getTierIcon(stream.creator.tier)}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-1">
                <p className="font-medium text-sm truncate">
                  {stream.creator.name}
                </p>
                {stream.creator.verified && (
                  <Badge variant="secondary" className="h-3 w-3 p-0 rounded-full bg-blue-500 text-[10px]">
                    ✓
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                @{stream.creator.handle}
              </p>
            </div>
          </div>

          <Button
            variant={isFollowing ? "secondary" : "outline"}
            size="sm"
            className="shrink-0 text-xs px-3"
            onClick={(e) => {
              e.stopPropagation();
              setIsFollowing(!isFollowing);
            }}
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
        </div>

        {/* Tags */}
        {stream.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {stream.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {stream.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{stream.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs px-2 h-7"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="h-3 w-3" />
              Like
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs px-2 h-7"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="h-3 w-3" />
              Chat
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-xs px-2 h-7"
              onClick={(e) => e.stopPropagation()}
            >
              <Share className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-xs px-2 h-7 text-accent hover:text-accent/80"
            onClick={(e) => e.stopPropagation()}
          >
            <Gift className="h-3 w-3" />
            Tip
          </Button>
        </div>

        {/* Stream Duration */}
        <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
          Started {new Date(stream.startedAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};