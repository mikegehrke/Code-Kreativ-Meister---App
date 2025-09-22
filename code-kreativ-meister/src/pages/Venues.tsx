import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Layout/Header";
import { VenueCard } from "@/components/Venues/VenueCard";
import { VenueFilters } from "@/components/Venues/VenueFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Filter, Calendar, Plus } from "lucide-react";

const Venues = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [priceRange, setPriceRange] = useState("all");

  // Mock venue data
  const venues = [
    {
      id: "1",
      name: "Club Neon",
      type: "Nightclub",
      description: "Premium nightclub in the heart of Berlin with state-of-the-art sound system",
      images: ["/api/placeholder/400/300"],
      location: {
        city: "Berlin",
        address: "Friedrichstraße 120, Berlin",
        coordinates: { lat: 52.5200, lng: 13.4050 }
      },
      capacity: 500,
      amenities: ["Sound System", "LED Walls", "VIP Area", "Bar", "DJ Booth"],
      pricing: {
        hourlyRate: 200,
        currency: "€",
        deposit: 1000,
        minimumHours: 4
      },
      availability: [
        { date: "2024-01-15", slots: ["20:00-02:00", "22:00-06:00"] },
        { date: "2024-01-16", slots: ["18:00-24:00"] }
      ],
      owner: {
        name: "Max Weber",
        avatar: "/api/placeholder/40/40",
        verified: true,
        rating: 4.8,
        responseTime: "< 1 hour"
      },
      stats: {
        bookings: 142,
        rating: 4.7,
        reviews: 89
      },
      tags: ["Electronic", "House", "Techno"],
      features: ["Rooftop", "VIP Lounge", "Professional Lighting"],
      rules: ["No outside drinks", "21+ only", "Dress code enforced"],
      cancellationPolicy: "Free cancellation 48h before event"
    },
    {
      id: "2",
      name: "Vintage Café Studio",
      type: "Café/Bar",
      description: "Cozy café perfect for intimate events and content creation",
      images: ["/api/placeholder/400/300"],
      location: {
        city: "Munich",
        address: "Marienplatz 8, Munich",
        coordinates: { lat: 48.1351, lng: 11.5820 }
      },
      capacity: 80,
      amenities: ["WiFi", "Kitchen Access", "Natural Light", "Vintage Décor"],
      pricing: {
        hourlyRate: 75,
        currency: "€",
        deposit: 300,
        minimumHours: 2
      },
      availability: [
        { date: "2024-01-15", slots: ["10:00-18:00"] },
        { date: "2024-01-17", slots: ["14:00-22:00"] }
      ],
      owner: {
        name: "Anna Schmidt",
        avatar: "/api/placeholder/40/40",
        verified: true,
        rating: 4.9,
        responseTime: "< 30 min"
      },
      stats: {
        bookings: 67,
        rating: 4.9,
        reviews: 34
      },
      tags: ["Acoustic", "Jazz", "Intimate"],
      features: ["Instagram-worthy", "Natural Light", "Kitchen"],
      rules: ["No smoking", "Keep noise reasonable", "Clean up required"],
      cancellationPolicy: "Free cancellation 24h before event"
    }
  ];

  const cities = ["All Cities", "Berlin", "Munich", "Hamburg", "Cologne"];
  const venueTypes = ["All Types", "Nightclub", "Café/Bar", "Studio", "Rooftop", "Gallery"];

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === "all" || venue.location.city === selectedCity;
    const matchesType = selectedType === "all" || venue.type === selectedType;
    
    return matchesSearch && matchesCity && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="container max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Rent the Perfect Venue
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            From intimate cafés to premium nightclubs - find and book the ideal space for your next event or content creation.
          </p>
          
          <Button 
            size="lg" 
            className="gap-2 bg-gradient-to-r from-primary to-accent hover:shadow-glow"
            onClick={() => navigate('/create-room')}
          >
            <Plus className="h-5 w-5" />
            List Your Venue
          </Button>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 border-b bg-card/50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search venues, locations, or event types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-background"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-40 h-12">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city === "All Cities" ? "all" : city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40 h-12">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {venueTypes.map((type) => (
                    <SelectItem key={type} value={type === "All Types" ? "all" : type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40 h-12"
              />

              <Button variant="outline" className="gap-2 h-12">
                <Calendar className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery("")} className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5">
                  ×
                </button>
              </Badge>
            )}
            {selectedCity !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {selectedCity}
                <button onClick={() => setSelectedCity("all")} className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5">
                  ×
                </button>
              </Badge>
            )}
            {selectedType !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {selectedType}
                <button onClick={() => setSelectedType("all")} className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5">
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <main className="py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {filteredVenues.length} Venues Available
            </h2>
            
            <Select defaultValue="recommended">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredVenues.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No venues found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setSelectedCity("all");
                setSelectedType("all");
                setSelectedDate("");
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Venues;