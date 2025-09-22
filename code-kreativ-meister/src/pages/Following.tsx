import { useState, useEffect } from "react";
import { TikTokVideoCard } from "@/components/TikTokFeed/TikTokVideoCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock following videos data
const mockFollowingVideos = [
  {
    id: "follow1",
    title: "Live from Berlin Nightclub 🔥",
    description: "#berlin #techno #nightlife #underground #rave",
    videoUrl: "/api/placeholder/400/600",
    thumbnail: "/api/placeholder/400/600",
    creator: {
      name: "DJ Marcus Berlin",
      handle: "marcusberlin",
      avatar: "/api/placeholder/40/40",
      verified: true,
      tier: "vip" as const,
    },
    venue: {
      id: "berghain",
      name: "Berghain Club",
      address: "Berlin, Germany",
      price: 25,
      currency: "EUR",
      isOpen: true,
      category: "Nightclub",
      rating: 4.8,
    },
    stats: {
      likes: 24567,
      comments: 1234,
      shares: 567,
      views: 125000,
    },
    tags: ["techno", "berlin", "underground", "rave"],
    isLiked: false,
    isPremium: false,
    timestamp: "2 hours ago",
  },
  {
    id: "follow2", 
    title: "Cocktail Making Tutorial 🍸",
    description: "Learn to make the perfect Moscow Mule! #cocktails #bartending #mixology",
    videoUrl: "/api/placeholder/400/600",
    thumbnail: "/api/placeholder/400/600",
    creator: {
      name: "Sarah Mixologist", 
      handle: "sarahmix",
      avatar: "/api/placeholder/40/40",
      verified: false,
      tier: "premium" as const,
    },
    venue: {
      id: "rooftop-nyc",
      name: "Rooftop Bar NYC", 
      address: "New York, USA",
      price: 35,
      currency: "USD",
      isOpen: true,
      category: "Rooftop Bar",
      rating: 4.5,
    },
    stats: {
      likes: 8934,
      comments: 456,
      shares: 234,
      views: 45000,
    },
    tags: ["cocktails", "bartending", "tutorial"],
    isLiked: true,
    isPremium: true,
    timestamp: "5 hours ago",
  },
  {
    id: "follow3",
    title: "VIP Room Tour Miami 🌴",
    description: "Exclusive look inside Miami's hottest VIP room #miami #vip #luxury #party",
    videoUrl: "/api/placeholder/400/600",
    thumbnail: "/api/placeholder/400/600",
    creator: {
      name: "Miami Nights",
      handle: "miaminights",
      avatar: "/api/placeholder/40/40",
      verified: true,
      tier: "vip" as const,
    },
    venue: {
      id: "liv-miami",
      name: "LIV Nightclub",
      address: "Miami, FL", 
      price: 75,
      currency: "USD",
      isOpen: true,
      category: "VIP Club",
      rating: 4.9,
    },
    stats: {
      likes: 56789,
      comments: 2345,
      shares: 890,
      views: 234000,
    },
    tags: ["miami", "vip", "luxury", "party"],
    isLiked: false,
    isPremium: true,
    timestamp: "1 day ago",
  },
];

const Following = () => {
  const [videos, setVideos] = useState(mockFollowingVideos);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    document.title = "Folge ich | Nightlife";
  }, []);

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    const handleScroll = () => {
      const videoElements = document.querySelectorAll('[data-video-id]');
      let currentIndex = 0;
      
      videoElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
          currentIndex = index;
        }
      });
      
      setCurrentVideoIndex(currentIndex);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Folge ich</h1>
            <Badge className="bg-primary/20 text-primary">
              {filteredVideos.length}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              className="text-white hover:bg-white/20"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Overlay */}
        {showSearch && (
          <div className="mt-4">
            <Input
              placeholder="Suche in deinen gefolgten Inhalten..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/50 border-white/20 text-white placeholder:text-white/60"
              autoFocus
            />
          </div>
        )}
      </header>

      {/* Video Feed */}
      <main className="pt-20">
        {filteredVideos.length > 0 ? (
          <div className="relative">
            {filteredVideos.map((video, index) => (
              <div
                key={video.id}
                data-video-id={video.id}
                className="h-screen snap-start snap-always"
              >
                <TikTokVideoCard
                  video={video}
                  isActive={index === currentVideoIndex}
                  onNext={() => {
                    if (index < filteredVideos.length - 1) {
                      setCurrentVideoIndex(index + 1);
                      const nextElement = document.querySelector(`[data-video-id="${filteredVideos[index + 1].id}"]`);
                      if (nextElement) {
                        nextElement.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  }}
                />
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <Search className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Keine Ergebnisse</h3>
            <p className="text-muted-foreground text-center">
              Keine Videos von gefolgten Creatorn gefunden für "{searchQuery}"
            </p>
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
              className="mt-4"
            >
              Suche löschen
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-screen">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Folge Creatorn</h3>
            <p className="text-muted-foreground text-center px-8">
              Folge deinen Lieblings-Creatorn, um ihre neuesten Videos hier zu sehen
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/live'}
              className="mt-4"
            >
              Creator entdecken
            </Button>
          </div>
        )}
      </main>

      {/* Instructions */}
      {filteredVideos.length > 0 && (
        <div className="fixed bottom-20 left-4 right-4 z-40">
          <div className="text-center text-white/60 text-xs">
            Swipe nach oben/unten für nächstes Video
          </div>
        </div>
      )}
    </div>
  );
};

export default Following;