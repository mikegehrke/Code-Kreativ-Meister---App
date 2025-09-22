import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentFlow } from "@/components/Payment/PaymentFlow";
import { 
  Search, 
  Filter, 
  Plus, 
  Users, 
  Eye, 
  Star, 
  Crown, 
  Sparkles,
  MapPin,
  Clock,
  Ticket,
  MessageCircle,
  Gift
} from "lucide-react";

interface Room {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  owner: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
    tier: "free" | "premium" | "vip";
  };
  stats: {
    viewers: number;
    likes: number;
    rating: number;
  };
  isLive: boolean;
  isPaid: boolean;
  ticketPrice?: number;
  features: string[];
  location: string;
  maxCapacity: number;
  currentOccupancy: number;
}

// Mock rooms data
const mockRooms: Room[] = [
  {
    id: "room1",
    name: "Berlin Techno Underground",
    category: "Music",
    description: "Authentic techno experience with world-class DJs and underground vibes",
    thumbnail: "/api/placeholder/400/300",
    owner: {
      name: "DJ Marcus Berlin",
      handle: "marcusberlin",
      avatar: "/api/placeholder/40/40",
      verified: true,
      tier: "vip",
    },
    stats: {
      viewers: 2847,
      likes: 15620,
      rating: 4.8,
    },
    isLive: true,
    isPaid: true,
    ticketPrice: 15,
    features: ["Live DJ", "Chat", "Drinks", "Private Rooms"],
    location: "Berlin, Germany",
    maxCapacity: 500,
    currentOccupancy: 387,
  },
  {
    id: "room2", 
    name: "Cocktail Masterclass Lounge",
    category: "Education",
    description: "Learn mixology from professional bartenders in an intimate setting",
    thumbnail: "/api/placeholder/400/300",
    owner: {
      name: "Sarah Mixologist",
      handle: "sarahmix", 
      avatar: "/api/placeholder/40/40",
      verified: false,
      tier: "premium",
    },
    stats: {
      viewers: 156,
      likes: 892,
      rating: 4.9,
    },
    isLive: true,
    isPaid: false,
    features: ["Interactive Learning", "Chat", "Recipes"],
    location: "New York, USA",
    maxCapacity: 50,
    currentOccupancy: 32,
  },
  {
    id: "room3",
    name: "VIP Miami Beach Club",
    category: "Party",
    description: "Exclusive VIP experience with premium drinks and ocean views",
    thumbnail: "/api/placeholder/400/300",
    owner: {
      name: "Miami Nights",
      handle: "miaminights",
      avatar: "/api/placeholder/40/40", 
      verified: true,
      tier: "vip",
    },
    stats: {
      viewers: 5672,
      likes: 28450,
      rating: 4.7,
    },
    isLive: true,
    isPaid: true,
    ticketPrice: 50,
    features: ["VIP Access", "Premium Drinks", "Private Chat", "Concierge"],
    location: "Miami, FL",
    maxCapacity: 100,
    currentOccupancy: 89,
  },
];

const categories = ["All", "Music", "Party", "Education", "Food", "Fashion", "Gaming", "Lifestyle"];

const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState(mockRooms);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("viewers");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [actionType, setActionType] = useState<"ticket" | "room">("ticket");

  useEffect(() => {
    document.title = "Rooms | Nightlife";
  }, []);

  const filteredRooms = rooms
    .filter((room) => {
      const matchesSearch = 
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.owner.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "All" || room.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "viewers":
          return b.stats.viewers - a.stats.viewers;
        case "rating":
          return b.stats.rating - a.stats.rating;
        case "price":
          return (b.ticketPrice || 0) - (a.ticketPrice || 0);
        default:
          return 0;
      }
    });

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

  const openPayment = (room: Room, type: "ticket" | "room" = "ticket") => {
    setSelectedRoom(room);
    setActionType(type);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (ticketCode?: string) => {
    if (selectedRoom) {
      navigate(`/event/${selectedRoom.id}/live`, {
        state: {
          event: { id: selectedRoom.id, name: selectedRoom.name, dj: selectedRoom.owner.name, isPaid: selectedRoom.isPaid },
          ticketCode,
          paid: true
        }
      });
    }
    setShowPayment(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Rooms</h1>
              <p className="text-xs text-muted-foreground">{filteredRooms.length} verfügbar</p>
            </div>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-accent">
                <Plus className="h-4 w-4 mr-2" />
                Room erstellen
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Neuen Room erstellen</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input placeholder="Room Name" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategorie auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input placeholder="Beschreibung" />
                <Input placeholder="Ticket Preis (optional)" type="number" />
                <Button className="w-full bg-gradient-to-r from-primary to-accent">
                  Room erstellen & Bezahlen
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="pb-20">
        {/* Search & Filters */}
        <section className="px-4 py-4 border-b">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rooms, Creator oder Kategorie suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-4 overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewers">Meiste Zuschauer</SelectItem>
                  <SelectItem value="rating">Höchste Bewertung</SelectItem>
                  <SelectItem value="price">Höchster Preis</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </section>

        {/* Live Stats */}
        <section className="px-4 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">{rooms.filter(r => r.isLive).length} Live</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  {rooms.reduce((sum, room) => sum + room.stats.viewers, 0).toLocaleString()} Zuschauer
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Rooms Grid */}
        <section className="px-4 py-4">
          {filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRooms.map((room) => {
                const TierIcon = getTierIcon(room.owner.tier);
                const occupancyPercentage = (room.currentOccupancy / room.maxCapacity) * 100;
                
                return (
                  <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative">
                      <img 
                        src={room.thumbnail && room.thumbnail.includes('/api/placeholder') ? '/placeholder.svg' : room.thumbnail}
                        alt={room.name}
                        className="w-full h-48 object-cover"
                      />
                      
                      {room.isLive && (
                        <Badge className="absolute top-3 left-3 bg-red-500 text-white animate-pulse">
                          🔴 LIVE
                        </Badge>
                      )}
                      
                      {room.isPaid && (
                        <Badge className="absolute top-3 right-3 bg-yellow-500 text-black">
                          <Ticket className="h-3 w-3 mr-1" />
                          €{room.ticketPrice}
                        </Badge>
                      )}

                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center justify-between text-white text-sm">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {room.stats.viewers.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current text-yellow-400" />
                            {room.stats.rating}
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="relative">
                          <img 
                            src={room.owner.avatar && room.owner.avatar.includes('/api/placeholder') ? '/placeholder.svg' : room.owner.avatar}
                            alt={room.owner.name}
                            className="h-10 w-10 rounded-full"
                          />
                          {TierIcon && (
                            <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r ${getTierColor(room.owner.tier)} flex items-center justify-center border-2 border-background`}>
                              <TierIcon className="h-2 w-2 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{room.name}</h3>
                          <div className="flex items-center gap-1">
                            <p className="text-xs text-muted-foreground">@{room.owner.handle}</p>
                            {room.owner.verified && (
                              <Badge className="bg-blue-500 text-white text-xs px-1 h-4">✓</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {room.description}
                      </p>

                      <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {room.location}
                      </div>

                      {/* Occupancy Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Auslastung</span>
                          <span className="font-medium">
                            {room.currentOccupancy}/{room.maxCapacity}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full transition-all duration-300 ${
                              occupancyPercentage > 90 ? 'bg-red-500' :
                              occupancyPercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${occupancyPercentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {room.features.slice(0, 2).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {room.features.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{room.features.length - 2}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {room.isPaid ? (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openPayment(room, "ticket");
                                }}
                              >
                                <Ticket className="h-3 w-3 mr-1" />
                                Ticket
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-primary to-accent"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openPayment(room, "ticket");
                                }}
                              >
                                €{room.ticketPrice}
                              </Button>
                            </>
                          ) : (
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-primary to-accent"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/event/${room.id}/live`);
                              }}
                            >
                              Betreten
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Keine Rooms gefunden</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Versuche andere Suchbegriffe" : "Noch keine Rooms verfügbar"}
              </p>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-gradient-to-r from-primary to-accent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ersten Room erstellen
              </Button>
            </div>
          )}
        </section>

        {/* Payment Flow */}
        {selectedRoom && (
          <PaymentFlow
            type={actionType}
            item={{
              id: selectedRoom.id,
              name: selectedRoom.name,
              price: selectedRoom.ticketPrice || 0,
              currency: "€",
              duration: 1,
              image: selectedRoom.thumbnail?.includes('/api/placeholder') ? '/placeholder.svg' : selectedRoom.thumbnail,
              description: selectedRoom.description
            }}
            onSuccess={handlePaymentSuccess}
            open={showPayment}
            onOpenChange={setShowPayment}
          />
        )}
      </main>
    </div>
  );
};

export default Rooms;