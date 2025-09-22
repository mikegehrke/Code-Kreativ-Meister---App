import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PaymentFlow } from "@/components/Payment/PaymentFlow";
import {
  MapPin,
  Users,
  Clock,
  Star,
  Heart,
  Share,
  Calendar,
  Euro,
  Shield,
  Wifi,
  Music,
  Camera,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface VenueCardProps {
  venue: {
    id: string;
    name: string;
    type: string;
    description: string;
    images: string[];
    location: {
      city: string;
      address: string;
      coordinates: { lat: number; lng: number };
    };
    capacity: number;
    amenities: string[];
    pricing: {
      hourlyRate: number;
      currency: string;
      deposit: number;
      minimumHours: number;
    };
    availability: Array<{
      date: string;
      slots: string[];
    }>;
    owner: {
      name: string;
      avatar: string;
      verified: boolean;
      rating: number;
      responseTime: string;
    };
    stats: {
      bookings: number;
      rating: number;
      reviews: number;
    };
    tags: string[];
    features: string[];
    rules: string[];
    cancellationPolicy: string;
  };
}

const getAmenityIcon = (amenity: string) => {
  const icons: { [key: string]: any } = {
    "Sound System": Music,
    "WiFi": Wifi,
    "LED Walls": Camera,
    "Natural Light": Camera,
    "Kitchen Access": Users,
    "VIP Area": Shield,
    "Bar": Users,
    "DJ Booth": Music,
    "Vintage Décor": Camera
  };
  
  const IconComponent = icons[amenity] || Users;
  return <IconComponent className="h-3 w-3" />;
};

export const VenueCard = ({ venue }: VenueCardProps) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === venue.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? venue.images.length - 1 : prev - 1
    );
  };

  const availableToday = venue.availability.find(
    av => av.date === new Date().toISOString().split('T')[0]
  );

  const handleViewDetails = () => {
    navigate(`/venue/${venue.id}`, {
      state: { venue }
    });
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    // Could show success toast here
  };

  return (
    <>
      <Card 
        className="overflow-hidden hover:shadow-glow transition-all duration-300 group cursor-pointer"
        onClick={handleViewDetails}
      >
      {/* Image Carousel */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={venue.images[currentImageIndex]}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Image Navigation */}
        {venue.images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </Button>
            
            {/* Image Dots */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {venue.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </>
        )}

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        
        {/* Type Badge */}
        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
          {venue.type}
        </Badge>

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
            className="h-8 w-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <Share className="h-4 w-4 text-white" />
          </Button>
        </div>

        {/* Price */}
        <div className="absolute bottom-4 left-4">
          <Badge className="bg-black/70 text-white text-sm px-3 py-1">
            {venue.pricing.currency}{venue.pricing.hourlyRate}/hour
          </Badge>
        </div>

        {/* Availability Indicator */}
        {availableToday && (
          <Badge className="absolute bottom-4 right-4 bg-green-500 text-white">
            Available Today
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        {/* Venue Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-1 mb-1">
              {venue.name}
            </CardTitle>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{venue.location.address}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 ml-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-sm">{venue.stats.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({venue.stats.reviews})
            </span>
          </div>
        </div>

        {/* Description */}
        <CardDescription className="line-clamp-2 mb-3">
          {venue.description}
        </CardDescription>

        {/* Specs */}
        <div className="flex items-center space-x-4 mb-3 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{venue.capacity} people</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{venue.pricing.minimumHours}h minimum</span>
          </div>
          <div className="flex items-center space-x-1">
            <Euro className="h-4 w-4" />
            <span>{venue.pricing.currency}{venue.pricing.deposit} deposit</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {(showAllAmenities ? venue.amenities : venue.amenities.slice(0, 4)).map((amenity, index) => (
              <Badge key={index} variant="secondary" className="text-xs gap-1">
                {getAmenityIcon(amenity)}
                {amenity}
              </Badge>
            ))}
            {venue.amenities.length > 4 && !showAllAmenities && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setShowAllAmenities(true)}
              >
                +{venue.amenities.length - 4} more
              </Button>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {venue.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
          {venue.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{venue.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Owner Info */}
        <div className="flex items-center space-x-3 mb-4 p-2 bg-muted/50 rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarImage src={venue.owner.avatar} alt={venue.owner.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {venue.owner.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className="font-medium text-sm">{venue.owner.name}</p>
              {venue.owner.verified && (
                <Badge variant="secondary" className="h-4 w-4 p-0 rounded-full bg-blue-500">
                  ✓
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>Response: {venue.owner.responseTime}</span>
              <span>•</span>
              <span>{venue.stats.bookings} bookings</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{venue.owner.rating}</span>
          </div>
        </div>

        {/* Available Slots Today */}
        {availableToday && (
          <div className="mb-4 p-2 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-2 mb-1">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                Available Today
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {availableToday.slots.map((slot, index) => (
                <Badge key={index} variant="outline" className="text-xs border-green-300 text-green-700 dark:text-green-400">
                  {slot}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300"
            onClick={handleBookNow}
          >
            Book Now
          </Button>
          
          <Button 
            variant="outline" 
            className="px-6"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>

    {/* Payment Dialog */}
    {showPayment && (
      <PaymentFlow
        type="room"
        item={{
          id: venue.id,
          name: venue.name,
          description: venue.description,
          price: venue.pricing.hourlyRate,
          currency: venue.pricing.currency
        }}
        onSuccess={handlePaymentSuccess}
        open={showPayment}
        onOpenChange={setShowPayment}
      />
    )}
    </>
  );
};