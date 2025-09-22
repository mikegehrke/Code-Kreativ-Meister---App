import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, MessageCircle, Crown, Sparkles } from "lucide-react";

interface Visitor {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  verified?: boolean;
  tier?: "free" | "premium" | "vip";
  visitedAt: string;
  isFollowing?: boolean;
  allowsChat?: boolean;
}

// Mock visitors data
const mockVisitors: Visitor[] = [
  {
    id: "1",
    name: "Sarah Chen",
    handle: "sarahchen",
    avatar: "/api/placeholder/40/40",
    verified: true,
    tier: "vip",
    visitedAt: "2 min ago",
    isFollowing: false,
    allowsChat: true,
  },
  {
    id: "2", 
    name: "Max Müller",
    handle: "maxmueller",
    avatar: "/api/placeholder/40/40",
    verified: false,
    tier: "premium",
    visitedAt: "15 min ago",
    isFollowing: true,
    allowsChat: true,
  },
  {
    id: "3",
    name: "Tokyo Nights",
    handle: "tokyonights",
    avatar: "/api/placeholder/40/40",
    verified: true,
    tier: "vip",
    visitedAt: "1 h ago",
    isFollowing: false,
    allowsChat: false,
  },
  {
    id: "4",
    name: "Lisa Park",
    handle: "lisapark",
    avatar: "/api/placeholder/40/40",
    verified: false,
    tier: "free",
    visitedAt: "2 h ago",
    isFollowing: false,
    allowsChat: true,
  },
  {
    id: "5",
    name: "DJ Alex",
    handle: "djalex",
    avatar: "/api/placeholder/40/40",
    verified: true,
    tier: "premium",
    visitedAt: "3 h ago",
    isFollowing: true,
    allowsChat: true,
  },
];

const ProfileVisitors = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState(mockVisitors);

  useEffect(() => {
    document.title = "Profilbesucher | Nightlife";
  }, []);

  const getTierIcon = (tier: string) => {
    if (tier === "vip") return Crown;
    if (tier === "premium") return Sparkles;
    return null;
  };

  const getTierColor = (tier: string) => {
    if (tier === "vip") return "from-yellow-400 to-orange-500";
    if (tier === "premium") return "from-purple-400 to-pink-500";
    return "from-gray-400 to-gray-500";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="font-semibold">Profilbesucher</h1>
            <p className="text-xs text-muted-foreground">{visitors.length} Besucher heute</p>
          </div>
          <div className="w-10" /> {/* Spacer for center alignment */}
        </div>
      </header>

      <main className="pb-20">
        {/* Stats Section */}
        <section className="px-4 py-6 border-b">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Eye className="h-8 w-8 text-primary" />
            <div className="text-center">
              <h2 className="text-2xl font-bold">{visitors.length}</h2>
              <p className="text-sm text-muted-foreground">Besucher heute</p>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Sieh dir an, wer dein Profil besucht hat
          </p>
        </section>

        {/* Visitors List */}
        <section className="px-4 py-2">
          {visitors.length > 0 ? (
            <div className="space-y-3">
              {visitors.map((visitor) => {
                const TierIcon = getTierIcon(visitor.tier || "free");
                return (
                  <div key={visitor.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Link 
                      to={`/u/${visitor.handle}`}
                      className="flex items-center gap-3 flex-1"
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={visitor.avatar} alt={visitor.name} />
                          <AvatarFallback>{visitor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {TierIcon && (
                          <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r ${getTierColor(visitor.tier || "free")} flex items-center justify-center border-2 border-background`}>
                            <TierIcon className="h-2.5 w-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm">{visitor.name}</h3>
                          {visitor.verified && (
                            <Badge className="bg-blue-500 text-white text-xs px-1">✓</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">@{visitor.handle}</p>
                        <p className="text-xs text-muted-foreground">{visitor.visitedAt}</p>
                      </div>
                    </Link>

                    <div className="flex items-center gap-2">
                      {visitor.allowsChat && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => navigate(`/inbox?chat=${visitor.handle}`)}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button 
                        variant={visitor.isFollowing ? "secondary" : "default"}
                        size="sm"
                        className="text-xs px-3"
                      >
                        {visitor.isFollowing ? "Folge ich" : "Folgen"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Eye className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Keine Besucher</h3>
              <p className="text-muted-foreground">
                Noch niemand hat dein Profil besucht
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ProfileVisitors;