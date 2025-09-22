import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { PaymentDialog } from "@/components/Venues/PaymentDialog";
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  Ticket,
  Heart,
  Share,
  Crown,
  Eye,
  Calendar,
  DollarSign,
  Search,
} from "lucide-react";

interface Venue {
  id: string;
  name: string;
  address: string;
  price: number;
  currency: string;
  isOpen: boolean;
  category: string;
  rating: number;
}

// Mock venue detail data
const getVenueDetails = (venueId: string) => ({
  ...mockVenues[venueId] || mockVenues.default,
  description: "Experience the ultimate nightlife at this exclusive venue. Premium drinks, world-class DJs, and an unforgettable atmosphere await you.",
  images: [
    "/api/placeholder/400/300",
    "/api/placeholder/400/300", 
    "/api/placeholder/400/300"
  ],
  features: ["Premium Bar", "VIP Area", "Live DJ", "Dance Floor", "Rooftop View"],
  currentGuests: Math.floor(Math.random() * 200) + 50,
  maxCapacity: 500,
  upcomingEvents: [
    {
      id: "event1",
      name: "Saturday Night Fever",
      time: "22:00",
      date: "Tonight",
      dj: "DJ Martin Garrix"
    },
    {
      id: "event2", 
      name: "VIP Exclusive Party",
      time: "23:30",
      date: "Tomorrow",
      dj: "DJ Tiësto"
    }
  ],
  reviews: [
    {
      id: "review1",
      user: "Sarah M.",
      avatar: "/api/placeholder/40/40",
      rating: 5,
      text: "Amazing venue! The music was incredible and the atmosphere was perfect.",
      time: "2 hours ago"
    },
    {
      id: "review2",
      user: "Mike R.",
      avatar: "/api/placeholder/40/40", 
      rating: 4,
      text: "Great place for a night out. A bit crowded but worth it!",
      time: "1 day ago"
    }
  ]
});

const mockVenues: Record<string, any> = {
  paradiso: {
    id: "paradiso",
    name: "Club Paradiso Room",
    address: "Berlin, Germany",
    price: 25,
    currency: "€",
    isOpen: true,
    category: "Nightclub", 
    rating: 4.8
  },
  underground: {
    id: "underground",
    name: "Berlin Underground Room", 
    address: "Underground Berlin, Germany",
    price: 20,
    currency: "€",
    isOpen: true,
    category: "Underground Club",
    rating: 4.9
  },
  beverlyhills: {
    id: "beverlyhills",
    name: "Beverly Hills Private Room",
    address: "Beverly Hills, CA",
    price: 500,
    currency: "$",
    isOpen: true,
    category: "Private Event",
    rating: 5.0
  },
  default: {
    id: "default",
    name: "Gold Room",
    address: "Dubai, UAE", 
    price: 200,
    currency: "$",
    isOpen: true,
    category: "Luxury Lounge",
    rating: 4.8
  }
};

const VenueDetail = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { venue?: Venue } };
  const [isLiked, setIsLiked] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("all"); // "all", "events", "reviews", "people"
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
  const venue = location.state?.venue || mockVenues[venueId || "default"];
  const venueDetails = getVenueDetails(venueId || "default");

  useEffect(() => {
    document.title = `${venue.name} | Venue`;
  }, [venue.name]);

  const handleBooking = () => {
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = () => {
    setIsBooked(true);
  };

  const handleShare = () => {
    const url = window.location.href;
    const text = `Check out ${venue.name} - ${venue.category} in ${venue.address}`;
    
    if (navigator.share) {
      navigator.share({
        title: venue.name,
        text: text,
        url: url,
      });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(`${text} ${url}`);
      // Here you could show a toast notification
    }
  };

  const handleJoinEvent = (event: any) => {
    // Navigate to event detail page
    navigate(`/event/${event.id}`, {
      state: { 
        event: {
          ...event,
          venue: venue,
          venueId: venueId
        }
      }
    });
  };

  // Filter search results
  const getSearchResults = () => {
    if (!searchQuery) return [];
    
    const results = [];
    const query = searchQuery.toLowerCase();
    
    if (searchFilter === "all" || searchFilter === "events") {
      venueDetails.upcomingEvents.forEach((event: any) => {
        if (event.name.toLowerCase().includes(query) || event.dj.toLowerCase().includes(query)) {
          results.push({ type: "event", data: event });
        }
      });
    }
    
    if (searchFilter === "all" || searchFilter === "reviews") {
      venueDetails.reviews.forEach((review: any) => {
        if (review.text.toLowerCase().includes(query) || review.user.toLowerCase().includes(query)) {
          results.push({ type: "review", data: review });
        }
      });
    }
    
    if (searchFilter === "all" || searchFilter === "people") {
      // Mock people search
      const mockPeople = [
        { name: "Sarah Johnson", handle: "sarahj", avatar: "/api/placeholder/40/40", isHere: true },
        { name: "Mike Rodriguez", handle: "mikero", avatar: "/api/placeholder/40/40", isHere: false },
        { name: "Lisa Chen", handle: "lisac", avatar: "/api/placeholder/40/40", isHere: true },
      ];
      
      mockPeople.forEach(person => {
        if (person.name.toLowerCase().includes(query) || person.handle.toLowerCase().includes(query)) {
          results.push({ type: "person", data: person });
        }
      });
    }
    
    return results.slice(0, 10); // Limit results
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
            <h1 className="font-semibold">{venue.name}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowSearch(!showSearch)}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsLiked(!isLiked)}>
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 pt-20">
          <div className="max-w-md mx-auto">
            <div className="relative mb-4">
              <Input
                autoFocus
                placeholder="Suche Events, Bewertungen, Personen..."
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

            {/* Search Filters */}
            <div className="flex gap-2 mb-4">
              {[
                { id: "all", label: "Alle" },
                { id: "events", label: "Events" },
                { id: "reviews", label: "Bewertungen" },
                { id: "people", label: "Personen" }
              ].map(filter => (
                <Button
                  key={filter.id}
                  size="sm"
                  variant={searchFilter === filter.id ? "default" : "outline"}
                  onClick={() => setSearchFilter(filter.id)}
                  className="text-xs"
                >
                  {filter.label}
                </Button>
              ))}
            </div>

            {/* Search Results */}
            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {searchQuery ? (
                getSearchResults().map((result, index) => (
                  <div
                    key={index}
                    className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                    onClick={() => {
                      if (result.type === "person") {
                        navigate(`/u/${result.data.handle}`);
                      }
                      setShowSearch(false);
                    }}
                  >
                    {result.type === "event" && (
                      <div>
                        <div className="text-white font-medium mb-1">{result.data.name}</div>
                        <div className="text-xs text-white/70">
                          Event • {result.data.dj} • {result.data.date} {result.data.time}
                        </div>
                      </div>
                    )}
                    
                    {result.type === "review" && (
                      <div>
                        <div className="text-white font-medium mb-1">Bewertung von {result.data.user}</div>
                        <div className="text-xs text-white/70 truncate">{result.data.text}</div>
                      </div>
                    )}
                    
                    {result.type === "person" && (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={result.data.avatar} />
                          <AvatarFallback>{result.data.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-white font-medium">{result.data.name}</div>
                          <div className="text-xs text-white/70 flex items-center gap-2">
                            @{result.data.handle}
                            {result.data.isHere && (
                              <Badge className="bg-green-500 text-white text-xs">Hier</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-white/70 py-4 text-sm">
                  Gib einen Suchbegriff ein um Events, Bewertungen und Personen zu finden
                </div>
              )}
              
              {searchQuery && getSearchResults().length === 0 && (
                <div className="text-center text-white/70 py-8">Keine Ergebnisse gefunden</div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="pb-20">
        {/* Hero Image */}
        <section className="relative h-64 bg-muted">
          <img 
            src={venueDetails.images[0]} 
            alt={venue.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <Badge className={`${venue.isOpen ? 'bg-green-500' : 'bg-red-500'} text-white`}>
              {venue.isOpen ? '🟢 OPEN' : '🔴 CLOSED'}
            </Badge>
          </div>

          {/* Live Stats */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{venueDetails.currentGuests}/{venueDetails.maxCapacity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm">{venue.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Venue Info */}
        <section className="px-4 py-6">
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{venue.name}</h2>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{venue.address}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {venue.category}
                </Badge>
              </div>
            </div>
            
            <p className="text-sm leading-relaxed mb-4">{venueDetails.description}</p>
            
            {/* Price & Booking */}
            <div className="bg-muted rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-lg font-bold">
                      {venue.currency}{venue.price}
                    </span>
                    <span className="text-sm text-muted-foreground">per person</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Entry fee includes welcome drink</p>
                </div>
                
                <Button 
                  onClick={handleBooking}
                  disabled={!venue.isOpen || isBooked}
                  className="bg-gradient-to-r from-primary to-accent hover:shadow-lg"
                >
                  <Ticket className="h-4 w-4 mr-2" />
                  {isBooked ? 'Booked!' : 'Enter Venue'}
                </Button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Features</h3>
            <div className="flex flex-wrap gap-2">
              {venueDetails.features.map((feature: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Upcoming Events</h3>
            <div className="space-y-3">
              {venueDetails.upcomingEvents.map((event: any) => (
                <div key={event.id} className="bg-muted rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{event.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">with {event.dj}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.time}
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleJoinEvent(event)}
                    >
                      Join Event
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Recent Reviews</h3>
            <div className="space-y-4">
              {venueDetails.reviews.map((review: any) => (
                <div key={review.id} className="bg-muted rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={review.avatar} alt={review.user} />
                      <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{review.user}</span>
                        <div className="flex items-center">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{review.time}</span>
                      </div>
                      <p className="text-sm">{review.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Payment Dialog */}
      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        venue={{
          name: venue.name,
          price: venue.price,
          currency: venue.currency
        }}
        onSuccess={handlePaymentSuccess}
      />

      <link rel="canonical" href={`${window.location.origin}/venue/${venueId}`} />
    </div>
  );
};

export default VenueDetail;