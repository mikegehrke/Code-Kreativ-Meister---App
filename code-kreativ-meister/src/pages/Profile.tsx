import { useEffect, useState } from "react";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  MoreHorizontal, 
  UserPlus, 
  UserCheck,
  Heart,
  Eye,
  Crown,
  Sparkles,
  Play,
  Lock
} from "lucide-react";

interface Creator {
  name: string;
  handle: string;
  avatar: string;
  verified?: boolean;
  tier?: "free" | "premium" | "vip";
}

// Mock profile data
const getProfileData = (handle: string) => ({
  followers: Math.floor(Math.random() * 1000000) + 10000,
  following: Math.floor(Math.random() * 1000) + 50,
  likes: Math.floor(Math.random() * 10000000) + 100000,
  bio: `🎵 Creator & Nightlife Enthusiast\n📍 Based in ${['Berlin', 'New York', 'London', 'Paris', 'Dubai'][Math.floor(Math.random() * 5)]}\n✨ Premium Content Available`,
  videos: Array.from({ length: 12 }, (_, i) => ({
    id: `${handle}-video-${i + 1}`,
    thumbnail: "/api/placeholder/300/400",
    views: Math.floor(Math.random() * 1000000) + 1000,
    isPremium: Math.random() > 0.7,
    isLive: i === 0 && Math.random() > 0.8,
  })),
  likedVideos: Array.from({ length: 8 }, (_, i) => ({
    id: `liked-video-${i + 1}`,
    thumbnail: "/api/placeholder/300/400",
    views: Math.floor(Math.random() * 500000) + 1000,
    creator: `creator${i + 1}`,
  })),
  rooms: Array.from({ length: 6 }, (_, i) => ({
    id: `room-${i + 1}`,
    name: ['VIP Lounge', 'Main Stage', 'Rooftop Bar', 'Private Suite', 'Dance Floor', 'Chill Zone'][i],
    thumbnail: "/api/placeholder/300/400",
    isActive: Math.random() > 0.5,
    viewers: Math.floor(Math.random() * 1000) + 10,
  }))
});

const Profile = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { creator?: Creator } };
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");
  
  const creator: Creator = location.state?.creator || {
    name: handle?.replace(/^\w/, c => c.toUpperCase()) || "Creator",
    handle: handle || "creator",
    avatar: "/api/placeholder/80/80",
    verified: Math.random() > 0.5,
    tier: ["free", "premium", "vip"][Math.floor(Math.random() * 3)] as "free" | "premium" | "vip",
  };

  const profileData = getProfileData(creator.handle);

  useEffect(() => {
    document.title = `@${creator.handle} | Profile`;
  }, [creator.handle]);

  const getTierBadge = () => {
    if (creator.tier === "vip") return { icon: Crown, color: "from-yellow-400 to-orange-500", text: "VIP" };
    if (creator.tier === "premium") return { icon: Sparkles, color: "from-purple-400 to-pink-500", text: "Premium" };
    return null;
  };

  const tierBadge = getTierBadge();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="font-semibold">{creator.name}</h1>
            <p className="text-xs text-muted-foreground">@{creator.handle}</p>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="pb-20">
        {/* Profile Section */}
        <section className="px-4 py-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={creator.avatar} alt={creator.name} />
                <AvatarFallback className="text-2xl">{creator.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
              </Avatar>
              {tierBadge && (
                <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-r ${tierBadge.color} flex items-center justify-center border-2 border-background`}>
                  <tierBadge.icon className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-bold">{creator.name}</h2>
                {creator.verified && (
                  <Badge className="bg-blue-500 text-white text-xs px-1">✓</Badge>
                )}
                {tierBadge && (
                  <Badge className={`bg-gradient-to-r ${tierBadge.color} text-white text-xs`}>
                    {tierBadge.text}
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-6 text-sm mb-3">
                <div className="text-center">
                  <div className="font-bold">{profileData.followers.toLocaleString()}</div>
                  <div className="text-muted-foreground">Follower</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{profileData.following.toLocaleString()}</div>
                  <div className="text-muted-foreground">Folge ich</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{profileData.likes.toLocaleString()}</div>
                  <div className="text-muted-foreground flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    Likes
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm mb-4 whitespace-pre-line leading-relaxed">{profileData.bio}</p>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              className={`flex-1 ${isFollowing ? 'bg-muted text-muted-foreground hover:bg-muted/80' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
              onClick={() => setIsFollowing(!isFollowing)}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Folge ich
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Folgen
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/profile-visitors')}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-12 bg-background border-b rounded-none">
            <TabsTrigger value="videos" className="flex-1">Videos</TabsTrigger>
            <TabsTrigger value="likes" className="flex-1">♥ Likes</TabsTrigger>
            <TabsTrigger value="rooms" className="flex-1">🏠 Rooms</TabsTrigger>
          </TabsList>

          {/* Videos Tab */}
          <TabsContent value="videos" className="p-0">
            <div className="grid grid-cols-3 gap-1 p-4">
              {profileData.videos.map((video) => (
                <div key={video.id} className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden group cursor-pointer">
                  <img 
                    src={video.thumbnail} 
                    alt={`Video ${video.id}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  
                  {video.isLive && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-500 text-white text-xs animate-pulse">🔴 LIVE</Badge>
                    </div>
                  )}
                  
                  {video.isPremium && (
                    <div className="absolute top-2 right-2">
                      <Lock className="h-4 w-4 text-yellow-400" />
                    </div>
                  )}
                  
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-white text-xs">
                        <Play className="h-3 w-3" />
                        {video.views.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Likes Tab */}
          <TabsContent value="likes" className="p-0">
            <div className="grid grid-cols-3 gap-1 p-4">
              {profileData.likedVideos.map((video) => (
                <div key={video.id} className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden group cursor-pointer">
                  <img 
                    src={video.thumbnail} 
                    alt={`Liked video ${video.id}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-white text-xs">
                        <Play className="h-3 w-3" />
                        {video.views.toLocaleString()}
                      </div>
                      <div className="text-white text-xs">@{video.creator}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Rooms Tab */}
          <TabsContent value="rooms" className="p-0">
            <div className="grid grid-cols-2 gap-3 p-4">
              {profileData.rooms.map((room) => (
                <div key={room.id} className="relative aspect-[4/3] bg-muted rounded-xl overflow-hidden group cursor-pointer">
                  <img 
                    src={room.thumbnail} 
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {room.isActive && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-green-500 text-white text-xs">🟢 Active</Badge>
                    </div>
                  )}
                  
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-semibold text-sm mb-1">{room.name}</h3>
                    <div className="flex items-center gap-1 text-white/80 text-xs">
                      <Eye className="h-3 w-3" />
                      {room.viewers} viewers
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <link rel="canonical" href={`${window.location.origin}/u/${creator.handle}`} />
    </div>
  );
};

export default Profile;