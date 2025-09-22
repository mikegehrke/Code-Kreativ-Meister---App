import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaymentFlow } from "@/components/Payment/PaymentFlow";
import { 
  Crown, 
  Users, 
  Clock, 
  Euro, 
  Star, 
  Wifi, 
  Camera, 
  Mic,
  Gift,
  Zap,
  Ticket
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number; // in hours
  maxViewers: number;
  category: string;
  features: string[];
  tier: "basic" | "premium" | "vip";
  image: string;
  rating: number;
  totalBooked: number;
}

const mockRooms: Room[] = [
  {
    id: "basic-1",
    name: "Cozy Lounge",
    description: "Perfekt für kleine, intime Streams mit bis zu 50 Zuschauern",
    price: 15,
    currency: "€",
    duration: 2,
    maxViewers: 50,
    category: "Basic",
    features: ["HD Stream", "Live Chat", "Recording"],
    tier: "basic",
    image: "/placeholder.svg",
    rating: 4.2,
    totalBooked: 89
  },
  {
    id: "premium-1", 
    name: "Neon Club Studio",
    description: "Professional streaming setup mit Neon-Beleuchtung und DJ-Equipment",
    price: 45,
    currency: "€",
    duration: 3,
    maxViewers: 200,
    category: "Premium",
    features: ["4K Stream", "Professional Lighting", "DJ Equipment", "Green Screen", "Multi-Camera"],
    tier: "premium",
    image: "/placeholder.svg",
    rating: 4.8,
    totalBooked: 234
  },
  {
    id: "vip-1",
    name: "VIP Penthouse Suite",
    description: "Luxuriöse Penthouse-Atmosphäre mit Stadtblick und Premium-Features",
    price: 120,
    currency: "€", 
    duration: 4,
    maxViewers: 1000,
    category: "VIP",
    features: ["8K Stream", "City View", "Professional Staff", "Catering Service", "VIP Chat Mods", "Custom Branding"],
    tier: "vip",
    image: "/placeholder.svg",
    rating: 4.9,
    totalBooked: 67
  },
  {
    id: "techno-1",
    name: "Underground Rave Bunker",
    description: "Authentische Underground-Atmosphäre mit Techno-Sound-System",
    price: 35,
    currency: "€",
    duration: 4,
    maxViewers: 300,
    category: "Niche",
    features: ["Pro Sound System", "Smoke Machine", "Laser Lights", "Underground Vibe"],
    tier: "premium",
    image: "/placeholder.svg",
    rating: 4.7,
    totalBooked: 156
  },
  {
    id: "rooftop-1",
    name: "Rooftop Sunset Terrace",
    description: "Spektakuläre Sonnenuntergang-Location mit Skyline-Blick",
    price: 80,
    currency: "€",
    duration: 3,
    maxViewers: 500,
    category: "Premium",
    features: ["Sunset View", "Skyline Background", "Weather Protection", "Cocktail Bar"],
    tier: "vip",
    image: "/placeholder.svg",
    rating: 4.9,
    totalBooked: 98
  }
];

interface RoomSelectorProps {
  onSelect?: (room: Room) => void;
}

export const RoomSelector = ({ onSelect }: RoomSelectorProps) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [actionType, setActionType] = useState<"room" | "ticket">("room");
  const navigate = useNavigate();

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "vip": return "from-yellow-400 to-orange-500";
      case "premium": return "from-purple-400 to-pink-500";
      default: return "from-gray-400 to-gray-600";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "vip": return <Crown className="h-4 w-4" />;
      case "premium": return <Star className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const handleRoomAction = (room: Room, type: "room" | "ticket") => {
    setSelectedRoom(room);
    setActionType(type);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (ticketCode?: string) => {
    if (selectedRoom) {
      if (actionType === "room") {
        // Room booking success
        navigate('/go-live', { 
          state: { 
            bookedRoom: { ...selectedRoom, ticketCode },
            isRoomBooked: true 
          } 
        });
      } else {
        // Ticket purchase success -> Navigate to event live room
        navigate(`/event/${selectedRoom.id}/live`, {
          state: {
            event: { id: selectedRoom.id, name: selectedRoom.name, dj: "Host" },
            ticketCode
          }
        });
        toast.success(`Ticket für "${selectedRoom.name}" erhalten!`);
      }
      setShowPayment(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Room auswählen & mieten</h2>
        <p className="text-muted-foreground">
          Wähle den perfekten Room für deinen Live-Stream
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockRooms.map((room) => (
          <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src={room.image} 
                alt={room.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3">
                <Badge className={`bg-gradient-to-r ${getTierColor(room.tier)} text-white`}>
                  {getTierIcon(room.tier)}
                  <span className="ml-1">{room.category}</span>
                </Badge>
              </div>
              <div className="absolute top-3 right-3">
                <Badge className="bg-black/70 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  {room.rating}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{room.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {room.description}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  {room.maxViewers} max
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {room.duration}h
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {room.features.slice(0, 3).map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {room.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{room.features.length - 3} mehr
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-lg font-bold">
                  {room.currency}{room.price}
                  <span className="text-sm text-muted-foreground font-normal">
                    /{room.duration}h
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleRoomAction(room, "ticket")}
                  >
                    <Ticket className="h-4 w-4 mr-1" />
                    Ticket
                  </Button>
                  <Button 
                    onClick={() => handleRoomAction(room, "room")}
                    className={`bg-gradient-to-r ${getTierColor(room.tier)} hover:opacity-90`}
                  >
                    Room mieten
                  </Button>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                {room.totalBooked}x gebucht
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Flow */}
      {selectedRoom && (
        <PaymentFlow
          type={actionType}
          item={{
            id: selectedRoom.id,
            name: selectedRoom.name,
            price: selectedRoom.price,
            currency: selectedRoom.currency,
            duration: selectedRoom.duration,
            image: selectedRoom.image,
            description: selectedRoom.description
          }}
          onSuccess={handlePaymentSuccess}
          open={showPayment}
          onOpenChange={setShowPayment}
        />
      )}
    </div>
  );
};