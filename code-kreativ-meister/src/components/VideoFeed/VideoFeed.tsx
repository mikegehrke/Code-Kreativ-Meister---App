import { VideoCard } from "./VideoCard";

// Mock data - later this will come from API/database
const mockVideos = [
  {
    id: "1",
    title: "🔥 Epic Night at Club Paradiso - You Won't Believe What Happened!",
    description: "The most insane night ever! DJ Martin brought the house down with this exclusive set. Premium members get access to backstage content!",
    thumbnail: "/api/placeholder/400/600",
    duration: "5:24",
    creator: {
      name: "DJ Sarah Moon",
      handle: "sarahmoon",
      avatar: "/api/placeholder/40/40",
      verified: true,
      tier: "vip" as const,
    },
    stats: {
      views: 125000,
      likes: 8400,
      comments: 342,
    },
    tags: ["house", "techno", "live", "paradiso", "epic"],
    isPremium: true,
    isLive: false,
  },
  {
    id: "2",
    title: "Live from Berlin Underground 🎵",
    description: "Broadcasting live from Berlin's hottest underground venue. Join the rave!",
    thumbnail: "/api/placeholder/400/600",
    duration: "LIVE",
    creator: {
      name: "Marco Berlin",
      handle: "marcoberlin",
      avatar: "/api/placeholder/40/40",
      verified: true,
      tier: "premium" as const,
    },
    stats: {
      views: 2850,
      likes: 190,
      comments: 45,
    },
    tags: ["berlin", "underground", "techno", "live"],
    isPremium: false,
    isLive: true,
  },
  {
    id: "3",
    title: "Best Cocktail Recipes from Top Bartenders",
    description: "Learn how to make signature cocktails from the world's best bartenders. Perfect for your home bar setup!",
    thumbnail: "/api/placeholder/400/600",
    duration: "12:45",
    creator: {
      name: "Lisa Cocktails",
      handle: "lisacocktails",
      avatar: "/api/placeholder/40/40",
      verified: false,
      tier: "free" as const,
    },
    stats: {
      views: 45000,
      likes: 2100,
      comments: 156,
    },
    tags: ["cocktails", "bartender", "recipes", "drinks"],
    isPremium: false,
    isLive: false,
  },
  {
    id: "4",
    title: "Exclusive: Behind the Scenes at Fashion Week After Party",
    description: "VIP access to the most exclusive after party of Fashion Week. See celebrities, fashion icons, and incredible performances!",
    thumbnail: "/api/placeholder/400/600",
    duration: "8:30",
    creator: {
      name: "VIP Events",
      handle: "vipevents",
      avatar: "/api/placeholder/40/40",
      verified: true,
      tier: "vip" as const,
    },
    stats: {
      views: 89000,
      likes: 5600,
      comments: 280,
    },
    tags: ["fashion", "vip", "exclusive", "party", "celebrities"],
    isPremium: true,
    isLive: false,
  },
  {
    id: "5",
    title: "Street Food Tour: Best Late Night Eats",
    description: "Discover the best street food spots that are open late night. Perfect for after-party munchies!",
    thumbnail: "/api/placeholder/400/600",
    duration: "15:20",
    creator: {
      name: "Food Explorer",
      handle: "foodexplorer",
      avatar: "/api/placeholder/40/40",
      verified: false,
      tier: "free" as const,
    },
    stats: {
      views: 67000,
      likes: 3200,
      comments: 189,
    },
    tags: ["food", "street food", "late night", "tour"],
    isPremium: false,
    isLive: false,
  },
  {
    id: "6",
    title: "🎭 Exclusive: Masquerade Ball at Grand Hotel",
    description: "Step into a world of mystery and elegance at the most exclusive masquerade ball of the year. Premium content includes full event coverage.",
    thumbnail: "/api/placeholder/400/600",
    duration: "22:15",
    creator: {
      name: "Elite Events",
      handle: "eliteevents",
      avatar: "/api/placeholder/40/40",
      verified: true,
      tier: "vip" as const,
    },
    stats: {
      views: 156000,
      likes: 12000,
      comments: 450,
    },
    tags: ["masquerade", "ball", "exclusive", "elegant", "mystery"],
    isPremium: true,
    isLive: false,
  },
];

export const VideoFeed = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          Discover Tonight
        </h1>
        <p className="text-muted-foreground">
          The hottest nightlife content from creators worldwide
        </p>
      </div>

      {/* Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center mt-12">
        <button className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:shadow-glow transition-all duration-300">
          Load More Videos
        </button>
      </div>
    </div>
  );
};