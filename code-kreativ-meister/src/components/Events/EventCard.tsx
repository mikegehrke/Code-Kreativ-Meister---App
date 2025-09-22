import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PaymentFlow } from "@/components/Payment/PaymentFlow";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  Heart,
  Share,
  Ticket,
  Crown,
  Sparkles
} from "lucide-react";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    image: string;
    date: string;
    time: string;
    venue: {
      name: string;
      address: string;
      capacity: number;
    };
    organizer: {
      name: string;
      avatar: string;
      verified: boolean;
      tier: "free" | "premium" | "vip";
    };
    pricing: {
      minPrice: number;
      maxPrice: number;
      currency: string;
      availableTickets: number;
    };
    category: string;
    tags: string[];
    rating: number;
    attendees: number;
    isLiked?: boolean;
    isFeatured?: boolean;
  };
}

export const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(event.isLiked || false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

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

  const formatPrice = (min: number, max: number, currency: string) => {
    if (min === max) return `${currency}${min}`;
    return `${currency}${min} - ${currency}${max}`;
  };

  const getAvailabilityColor = (available: number, capacity: number) => {
    const percentage = (available / capacity) * 100;
    if (percentage > 50) return "text-green-500";
    if (percentage > 20) return "text-yellow-500";
    return "text-red-500";
  };

  const handleCardClick = () => {
    navigate(`/event/${event.id}`, {
      state: { event }
    });
  };

  const handleTicketPurchase = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    // Could show success toast here
  };

  return (
    <>
      <div 
        className="relative bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-glow transition-all duration-300 group cursor-pointer"
        onClick={handleCardClick}
      >
      {/* Event Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Featured Badge */}
        {event.isFeatured && (
          <Badge className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        )}

        {/* Category */}
        <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
          {event.category}
        </Badge>

        {/* Quick Actions */}
        <div className="absolute bottom-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
          >
            <Heart className={`h-4 w-4 text-white ${isLiked ? 'fill-current' : ''}`} />
          </Button>
          
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <Share className="h-4 w-4 text-white" />
          </Button>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-4 left-4">
          <Badge className="bg-black/70 text-white text-sm px-3 py-1">
            {formatPrice(event.pricing.minPrice, event.pricing.maxPrice, event.pricing.currency)}
          </Badge>
        </div>
      </div>

      {/* Event Info */}
      <div className="p-4">
        {/* Title & Rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg line-clamp-2 leading-tight flex-1">
            {event.title}
          </h3>
          {event.rating > 0 && (
            <div className="flex items-center space-x-1 ml-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{event.rating}</span>
            </div>
          )}
        </div>

        {/* Date & Time */}
        <div className="flex items-center space-x-4 mb-3 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{event.time}</span>
          </div>
        </div>

        {/* Venue */}
        <div className="flex items-start space-x-2 mb-3">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="font-medium text-sm">{event.venue.name}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {event.venue.address}
            </p>
          </div>
        </div>

        {/* Organizer */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src={event.organizer.avatar} alt={event.organizer.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {event.organizer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {event.organizer.tier !== "free" && (
              <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r ${getTierColor(event.organizer.tier)} flex items-center justify-center`}>
                {getTierIcon(event.organizer.tier)}
              </div>
            )}
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center space-x-1">
              <p className="font-medium text-sm truncate">
                {event.organizer.name}
              </p>
              {event.organizer.verified && (
                <Badge variant="secondary" className="h-3 w-3 p-0 rounded-full bg-blue-500">
                  ✓
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Organizer</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {event.description}
        </p>

        {/* Tags */}
        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {event.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {event.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{event.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{event.attendees} going</span>
          </div>
          
          <div className={`flex items-center space-x-1 ${getAvailabilityColor(event.pricing.availableTickets, event.venue.capacity)}`}>
            <Ticket className="h-4 w-4" />
            <span className="font-medium">
              {event.pricing.availableTickets} left
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300"
            onClick={handleTicketPurchase}
          >
            <Ticket className="h-4 w-4 mr-2" />
            Get Tickets
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />
          </Button>
        </div>
      </div>
    </div>

    {/* Payment Dialog */}
    {showPayment && (
      <PaymentFlow
        type="ticket"
        item={{
          id: event.id,
          name: event.title,
          description: event.description,
          price: event.pricing.minPrice,
          currency: event.pricing.currency
        }}
        onSuccess={handlePaymentSuccess}
        open={showPayment}
        onOpenChange={setShowPayment}
      />
    )}
    </>
  );
};