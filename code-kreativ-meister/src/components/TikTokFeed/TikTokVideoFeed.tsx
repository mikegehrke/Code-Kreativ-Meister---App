import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { TikTokVideoCard } from "./TikTokVideoCard";
import { Search, Crown, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

// Mock data with venue integration
const mockTikTokVideos = [
  {
    id: "1",
    title: "🔥 Epic Night at Club Paradiso - You Won't Believe What Happened!",
    description: "The most insane night ever! DJ Martin brought the house down with this exclusive set. Premium members get access to backstage content!",
    videoUrl: "/api/placeholder/video.mp4",
    thumbnail: "/api/placeholder/400/800",
    creator: {
      name: "DJ Sarah Moon",
      handle: "sarahmoon",
      avatar: "/api/placeholder/40/40",
      verified: true,
      tier: "vip" as const,
    },
    venue: {
      id: "paradiso",
      name: "Club Paradiso Room",
      address: "Berlin, Germany",
      price: 25,
      currency: "€",
      isOpen: true,
      category: "Nightclub",
      rating: 4.8,
    },
    stats: {
      views: 125000,
      likes: 8400,
      comments: 342,
    },
    tags: ["house", "techno", "live", "paradiso", "epic"],
    isPremium: true,
    isLive: false,
    profileVisitor: false,
  },
  {
    id: "2",
    title: "🎵 LIVE: Berlin Underground Rave",
    description: "Broadcasting live from Berlin's hottest underground venue. Join the rave! This is happening right now!",
    videoUrl: "/api/placeholder/video.mp4",
    thumbnail: "/api/placeholder/400/800",
    creator: {
      name: "Marco Berlin",
      handle: "marcoberlin",
      avatar: "/api/placeholder/40/40",
      verified: true,
      tier: "premium" as const,
    },
    venue: {
      id: "underground",
      name: "Berlin Underground Room",
      address: "Underground Berlin, Germany",
      price: 20,
      currency: "€",
      isOpen: true,
      category: "Underground Club",
      rating: 4.9,
    },
    stats: {
      views: 2850,
      likes: 190,
      comments: 45,
    },
    tags: ["berlin", "underground", "techno", "live"],
    isPremium: false,
    isLive: true,
    profileVisitor: true,
  },
  {
    id: "3",
    title: "🍹 Signature Cocktails with World's Best Bartenders",
    description: "Learn signature cocktails from award-winning bartenders. Perfect for your home bar setup!",
    videoUrl: "/api/placeholder/video.mp4",
    thumbnail: "/api/placeholder/400/800",
    creator: {
      name: "Lisa Cocktails",
      handle: "lisacocktails",
      avatar: "/api/placeholder/40/40",
      verified: false,
      tier: "free" as const,
    },
    venue: {
      id: "skybar",
      name: "SkyBar VIP Room",
      address: "New York, USA",
      price: 35,
      currency: "$",
      isOpen: true,
      category: "Rooftop Bar",
      rating: 4.6,
    },
    stats: {
      views: 45000,
      likes: 2100,
      comments: 156,
    },
    tags: ["cocktails", "bartender", "recipes", "drinks"],
    isPremium: false,
    isLive: false,
    profileVisitor: false,
  },
  {
    id: "4",
    title: "👗 EXCLUSIVE: Fashion Week After Party VIP Access",
    description: "VIP access to the most exclusive after party of Fashion Week. See celebrities, fashion icons, and incredible performances!",
    videoUrl: "/api/placeholder/video.mp4",
    thumbnail: "/api/placeholder/400/800",
    creator: {
      name: "VIP Events",
      handle: "vipevents",
      avatar: "/api/placeholder/40/40",
      verified: true,
      tier: "vip" as const,
    },
    venue: {
      id: "luxe",
      name: "Luxe Private Suite",
      address: "Milan, Italy",  
      price: 150,
      currency: "€",
      isOpen: true,
      category: "VIP Lounge",
      rating: 4.9,
    },
    stats: {
      views: 89000,
      likes: 5600,
      comments: 280,
    },
    tags: ["fashion", "vip", "exclusive", "party", "celebrities"],
    isPremium: true,
    isLive: false,
    profileVisitor: true,
  },
  {
    id: "5",
    title: "🌮 Late Night Food Tour: Best After-Party Eats",
    description: "Discover the best street food spots open late night. Perfect for after-party munchies!",
    videoUrl: "/api/placeholder/video.mp4",
    thumbnail: "/api/placeholder/400/800",
    creator: {
      name: "Food Explorer",
      handle: "foodexplorer",
      avatar: "/api/placeholder/40/40",
      verified: false,
      tier: "free" as const,
    },
    venue: null,
    stats: {
      views: 67000,
      likes: 3200,
      comments: 189,
    },
    tags: ["food", "street food", "late night", "tour"],
    isPremium: false,
    isLive: false,
    profileVisitor: false,
  },
  {
    id: "6",
    title: "🎪 LIVE: Ibiza Sunset Party",
    description: "Live from the most famous sunset party in Ibiza! The energy is unreal right now! 🌅",
    videoUrl: "/api/placeholder/video.mp4",
    thumbnail: "/api/placeholder/400/800",
    creator: {
      name: "Ibiza Vibes",
      handle: "ibizavibes",
      avatar: "/api/placeholder/40/40",
      verified: true,
      tier: "premium" as const,
    },
    venue: {
      id: "cafedelmar",
      name: "Café del Mar Sunset Room",
      address: "Ibiza, Spain",
      price: 45,
      currency: "€",
      isOpen: true,
      category: "Beach Club",
      rating: 4.9,
    },
    stats: {
      views: 156000,
      likes: 12400,
      comments: 567,
    },
    tags: ["ibiza", "sunset", "beach", "live", "party"],
    isPremium: true,
    isLive: true,
    profileVisitor: true,
  },
  {
    id: "7",
    title: "🎹 Jazz Night: Intimate Performance",
    description: "Incredible jazz performance in London's most intimate venue. This saxophonist is absolutely amazing!",
    videoUrl: "/api/placeholder/video.mp4",
    thumbnail: "/api/placeholder/400/800",
    creator: {
      name: "Jazz Nights",
      handle: "jazznights",
      avatar: "/api/placeholder/40/40",
      verified: false,
      tier: "free" as const,
    },
    venue: null,
    stats: {
      views: 23000,
      likes: 1800,
      comments: 94,
    },
    tags: ["jazz", "live music", "intimate", "london", "saxophone"],
    isPremium: false,
    isLive: false,
    profileVisitor: true,
  },
  {
    id: "8",
    title: "💎 Dubai Luxury Night: Gold & Champagne",
    description: "The most luxurious night out in Dubai! Champagne showers, gold everything, and the best views in the city!",
    videoUrl: "/api/placeholder/video.mp4",
    thumbnail: "/api/placeholder/400/800",
    creator: {
      name: "Dubai Luxury",
      handle: "dubailuxury",
      avatar: "/api/placeholder/40/40",
      verified: true,
      tier: "vip" as const,
    },
    venue: {
      id: "atmburj",
      name: "Burj Khalifa Gold Room",
      address: "Dubai, UAE",
      price: 200,
      currency: "$",
      isOpen: true,
      category: "Luxury Lounge",
      rating: 4.8,
    },
    stats: {
      views: 234000,
      likes: 18900,
      comments: 1200,
    },
    tags: ["dubai", "luxury", "champagne", "burj khalifa", "vip"],
    isPremium: true,
    isLive: false,
    profileVisitor: false,
  },
  {
    id: "9",
    title: "🎤 Underground Hip-Hop Cypher",
    description: "Raw talent! Underground hip-hop cypher in Brooklyn. These artists are incredible!",
    videoUrl: "/api/placeholder/video.mp4",
    thumbnail: "/api/placeholder/400/800",
    creator: {
      name: "Hip Hop Culture",
      handle: "hiphopculture",
      avatar: "/api/placeholder/40/40",
      verified: false,
      tier: "free" as const,
    },
    venue: {
      id: "brooklyn",
      name: "Brooklyn Studio Room",
      address: "Brooklyn, NYC",
      price: 10,
      currency: "$",
      isOpen: true,
      category: "Underground Venue",
      rating: 4.6,
    },
    stats: {
      views: 78000,
      likes: 6700,
      comments: 234,
    },
    tags: ["hip hop", "cypher", "brooklyn", "underground", "rap"],
    isPremium: false,
    isLive: false,
    profileVisitor: true,
  },
  {
    id: "10",
    title: "🌟 LIVE: Celebrity Birthday Bash",
    description: "LIVE from a major celebrity's birthday party! Can't believe who just walked in! 🎉",
    videoUrl: "/api/placeholder/video.mp4",
    thumbnail: "/api/placeholder/400/800",
    creator: {
      name: "Celebrity Insider",
      handle: "celebinsider",
      avatar: "/api/placeholder/40/40",
      verified: true,
      tier: "vip" as const,
    },
    venue: {
      id: "beverlyhills",
      name: "Beverly Hills Private Room",
      address: "Beverly Hills, CA",
      price: 500,
      currency: "$",
      isOpen: true,
      category: "Private Event",
      rating: 5.0,
    },
    stats: {
      views: 345000,
      likes: 28900,
      comments: 2100,
    },
    tags: ["celebrity", "birthday", "exclusive", "live", "hollywood"],
    isPremium: true,
    isLive: true,
    profileVisitor: false,
  },
];

export const TikTokVideoFeed = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Für dich");
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileViews, setProfileViews] = useState(128);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const categories = [
    "Go Live",
    "Entdecke",
    "Gefolgt",
    "Für dich",
    "👁️ Besucher",
    "Rooms"
  ];

  // Determine which videos to render based on selected category
  const followedHandles = new Set(["sarahmoon", "marcoberlin", "ibizavibes"]);
  let videosToRender = [...mockTikTokVideos];
  
  switch (selectedCategory) {
    case "Go Live":
      videosToRender = mockTikTokVideos.filter(v => v.isLive);
      break;
    case "Gefolgt":
      videosToRender = mockTikTokVideos.filter(v => followedHandles.has(v.creator.handle));
      break;
    case "Entdecke":
      // Show trending content sorted by engagement
      videosToRender = [...mockTikTokVideos].sort((a, b) => 
        (b.stats.likes + b.stats.comments) - (a.stats.likes + a.stats.comments)
      );
      break;
    case "Rooms":
      // Show videos from venues/rooms that exist and are open
      videosToRender = mockTikTokVideos.filter(v => 
        v.venue && 
        v.venue.name.toLowerCase().includes('room') || 
        (v.venue && v.venue.category && v.venue.isOpen)
      );
      break;
    case "👁️ Besucher":
      // Show videos from people who visited your profile recently
      videosToRender = mockTikTokVideos.filter(v => v.profileVisitor === true);
      break;
    case "Für dich":
    default:
      // Personalized feed algorithm (mock)
      videosToRender = [...mockTikTokVideos].sort((a, b) => {
        const scoreA = a.stats.likes * 0.7 + a.stats.comments * 0.3 + (a.isPremium ? 100 : 0);
        const scoreB = b.stats.likes * 0.7 + b.stats.comments * 0.3 + (b.isPremium ? 100 : 0);
        return scoreB - scoreA;
      });
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const idx = Math.round(container.scrollTop / container.clientHeight);
      const clamped = Math.max(0, Math.min(idx, videosToRender.length - 1));
      setCurrentVideoIndex(clamped);
    };

    // Touch event handlers for swipe navigation
    const onTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
      setTouchStartX(e.touches[0].clientX);
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartY === null || touchStartX === null) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaY = touchStartY - touchEndY;
      const deltaX = Math.abs(touchStartX - touchEndX);
      
      // Only handle vertical swipes (ignore horizontal swipes)
      if (deltaX > 50) return;
      
      // Minimum swipe distance
      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          // Swipe up - next video
          if (currentVideoIndex < videosToRender.length - 1) {
            container.scrollTo({ 
              top: (currentVideoIndex + 1) * container.clientHeight, 
              behavior: 'smooth' 
            });
          }
        } else {
          // Swipe down - previous video
          if (currentVideoIndex > 0) {
            container.scrollTo({ 
              top: (currentVideoIndex - 1) * container.clientHeight, 
              behavior: 'smooth' 
            });
          }
        }
      }
      
      setTouchStartY(null);
      setTouchStartX(null);
    };

    // Keyboard navigation
    const onKeyDown = (e: KeyboardEvent) => {
      if (showSearch) return; // Don't handle keyboard if search is open
      
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const direction = e.key === 'ArrowUp' ? -1 : 1;
        const newIndex = Math.max(0, Math.min(currentVideoIndex + direction, videosToRender.length - 1));
        
        if (newIndex !== currentVideoIndex) {
          container.scrollTo({ 
            top: newIndex * container.clientHeight, 
            behavior: 'smooth' 
          });
        }
      }
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    
    return () => {
      container.removeEventListener('scroll', onScroll);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [videosToRender, currentVideoIndex, touchStartY, touchStartX, showSearch]);

  const scrollToById = (id: string) => {
    const el = containerRef.current;
    if (!el) return;
    setSelectedCategory("Für dich");
    requestAnimationFrame(() => {
      const idx = mockTikTokVideos.findIndex(v => v.id === id);
      if (idx >= 0) {
        el.scrollTo({ top: idx * el.clientHeight, behavior: 'smooth' });
        setShowSearch(false);
        setSearchQuery("");
      }
    });
  };

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* TikTok-style Top Header - Minimal Overlay */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-[env(safe-area-inset-top)]">
        {/* Top bar with Premium, Nightlife, Search, Heart */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/50 to-transparent">
          {/* Premium Button */}
          <Button 
            variant="ghost"
            size="sm"
            className="bg-black/40 border border-amber-500/50 text-amber-400 hover:bg-black/60 rounded-full px-3 py-1 backdrop-blur-sm"
          >
            <Crown className="h-3 w-3 mr-1" />
            <span className="text-xs font-medium">Premium</span>
          </Button>

          {/* Nightlife Title - Smaller and more subtle */}
          <h1 className="text-white text-lg font-semibold tracking-wide drop-shadow-lg">Nightlife</h1>

          {/* Right Icons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full h-8 w-8 backdrop-blur-sm" onClick={() => setShowSearch(true)}>
              <Search className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full h-8 w-8 backdrop-blur-sm relative">
                  <Eye className="h-4 w-4" />
                  {profileViews > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-green-500 text-[10px] leading-4 text-white text-center">
                      {profileViews}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56">
                <div className="text-sm font-medium mb-1">Profilaufrufe</div>
                <div className="text-2xl font-bold">{profileViews}</div>
                <p className="text-xs text-muted-foreground">heute</p>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Category Pills - More subtle */}
        <div className="flex items-center justify-start space-x-2 px-4 pb-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm relative ${
                selectedCategory === category
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/90 hover:text-white hover:bg-white/20 bg-black/20'
              }`}
            >
              {category}
              {selectedCategory === category && videosToRender.length !== mockTikTokVideos.length && (
                <span className="ml-1 text-xs opacity-70">({videosToRender.length})</span>
              )}
            </button>
          ))}
        </div>
        
        {/* Category Status */}
        {videosToRender.length === 0 && (
          <div className="px-4 pb-2">
            <div className="bg-yellow-500/20 text-yellow-300 text-xs px-3 py-1 rounded-full text-center">
              Keine Videos in "{selectedCategory}" gefunden
            </div>
          </div>
        )}
      </div>

      {/* Search Overlay */}
      {showSearch && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 pt-16">
          <div className="max-w-md mx-auto">
            <div className="relative mb-4">
              <Input
                autoFocus
                placeholder="Suche Videos, Creator, Hashtags, Venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-24 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 text-sm"
                onClick={() => setShowSearch(false)}
              >
                Schließen
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {mockTikTokVideos
                .filter(v => {
                  const q = searchQuery.toLowerCase();
                  return (
                    v.title.toLowerCase().includes(q) ||
                    v.creator.name.toLowerCase().includes(q) ||
                    v.creator.handle.toLowerCase().includes(q) ||
                    v.tags.some(t => t.toLowerCase().includes(q)) ||
                    (v.venue && (
                      v.venue.name.toLowerCase().includes(q) ||
                      v.venue.address.toLowerCase().includes(q)
                    ))
                  );
                })
                .slice(0, 20)
                .map(v => (
                  <button
                    key={v.id}
                    onClick={() => scrollToById(v.id)}
                    className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
                  >
                    <div className="text-white font-medium truncate">{v.title}</div>
                    <div className="text-xs text-white/70 truncate">@{v.creator.handle} • {v.venue?.name || 'Kein Venue'}</div>
                  </button>
                ))}

              {searchQuery && mockTikTokVideos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <div className="text-center text-white/70 py-8">Keine Ergebnisse</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Video Feed */}
      <div 
        ref={containerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videosToRender.length > 0 ? (
          videosToRender.map((video, index) => (
            <div
              key={video.id}
              className="w-full h-full snap-start relative"
            >
              <TikTokVideoCard
                video={video}
                isActive={index === currentVideoIndex}
                onNext={() => {
                  const el = containerRef.current;
                  if (el && index < videosToRender.length - 1) {
                    el.scrollTo({ top: (index + 1) * el.clientHeight, behavior: 'smooth' });
                  }
                }}
              />
            </div>
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="text-center text-white/80 p-8">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold mb-2">Keine Videos gefunden</h3>
              <p className="text-white/60 mb-4">
                {selectedCategory === "Go Live" && "Momentan ist niemand live"}
                {selectedCategory === "Gefolgt" && "Folge Creatorn um ihre Videos zu sehen"}
                {selectedCategory === "👁️ Besucher" && "Noch niemand hat dein Profil besucht"}
                {selectedCategory === "Rooms" && "Keine Rooms sind momentan verfügbar"}
                {!["Go Live", "Gefolgt", "👁️ Besucher", "Rooms"].includes(selectedCategory) && "Wähle eine andere Kategorie"}
              </p>
              <button
                onClick={() => setSelectedCategory("Für dich")}
                className="px-4 py-2 bg-white/20 text-white rounded-full text-sm hover:bg-white/30 transition-colors"
              >
                Zurück zu "Für dich"
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Instructions */}
      <div className="absolute bottom-24 left-4 z-30 text-white/70 text-xs space-y-1">
        <div className="flex items-center space-x-2">
          <span>📱</span>
          <span>Scroll or use arrow keys</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>👆</span>
          <span>Swipe up/down on mobile</span>
        </div>
        {selectedCategory !== "Für dich" && (
          <div className="flex items-center space-x-2">
            <span>🎯</span>
            <span>{selectedCategory}: {videosToRender.length} Videos</span>
          </div>
        )}
      </div>
    </div>
  );
};