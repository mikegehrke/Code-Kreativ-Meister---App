import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Layout/Header";
import { EventCard } from "@/components/Events/EventCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Calendar as CalendarIcon, MapPin, Filter, Sparkles } from "lucide-react";

// Mock events data
const mockEvents = [
  {
    id: "event1",
    title: "Electric Dreams: The Ultimate Techno Experience",
    description: "Join us for an unforgettable night of pulsating beats and electrifying performances. Featuring world-renowned DJs and stunning visual effects that will transport you to another dimension.",
    image: "/api/placeholder/400/300",
    date: "2024-01-15",
    time: "22:00",
    venue: {
      name: "Warehouse 23",
      address: "123 Industrial Ave, Berlin, Germany",
      capacity: 2000,
    },
    organizer: {
      name: "Techno Collective",
      avatar: "/api/placeholder/40/40",
      verified: true,
      tier: "vip" as const,
    },
    pricing: {
      minPrice: 25,
      maxPrice: 75,
      currency: "€",
      availableTickets: 450,
    },
    category: "Music",
    tags: ["techno", "electronic", "rave", "berlin", "warehouse"],
    rating: 4.8,
    attendees: 1550,
    isLiked: false,
    isFeatured: true,
  },
  {
    id: "event2",
    title: "Rooftop Jazz & Cocktails",
    description: "An elegant evening of smooth jazz and craft cocktails on our exclusive rooftop terrace. Dress code: Smart casual. Limited seating available.",
    image: "/api/placeholder/400/300",
    date: "2024-01-12",
    time: "19:30",
    venue: {
      name: "Sky Lounge",
      address: "456 High Street, Manhattan, NY",
      capacity: 150,
    },
    organizer: {
      name: "Jazz & Spirits Co.",
      avatar: "/api/placeholder/40/40",
      verified: false,
      tier: "premium" as const,
    },
    pricing: {
      minPrice: 45,
      maxPrice: 85,
      currency: "$",
      availableTickets: 32,
    },
    category: "Music",
    tags: ["jazz", "cocktails", "rooftop", "elegant", "manhattan"],
    rating: 4.6,
    attendees: 118,
    isLiked: true,
    isFeatured: false,
  },
  {
    id: "event3",
    title: "Underground Hip-Hop Showcase",
    description: "Discover the freshest underground hip-hop talent in the city. Multiple artists, one incredible night. Support local music and witness the next big stars.",
    image: "/api/placeholder/400/300",
    date: "2024-01-18",
    time: "21:00",
    venue: {
      name: "The Underground",
      address: "789 Metro Blvd, Los Angeles, CA",
      capacity: 500,
    },
    organizer: {
      name: "Urban Beats",
      avatar: "/api/placeholder/40/40",
      verified: true,
      tier: "premium" as const,
    },
    pricing: {
      minPrice: 15,
      maxPrice: 35,
      currency: "$",
      availableTickets: 89,
    },
    category: "Music",
    tags: ["hip-hop", "underground", "showcase", "local", "urban"],
    rating: 4.4,
    attendees: 411,
    isLiked: false,
    isFeatured: false,
  },
  {
    id: "event4",
    title: "Masquerade Ball: Venetian Dreams",
    description: "Step into a world of mystery and elegance at our annual masquerade ball. Live orchestra, gourmet dining, and dancing until dawn. Masks provided.",
    image: "/api/placeholder/400/300",
    date: "2024-01-20",
    time: "20:00",
    venue: {
      name: "Grand Ballroom Hotel",
      address: "321 Palace Way, Vienna, Austria",
      capacity: 800,
    },
    organizer: {
      name: "Elite Events International",
      avatar: "/api/placeholder/40/40",
      verified: true,
      tier: "vip" as const,
    },
    pricing: {
      minPrice: 120,
      maxPrice: 250,
      currency: "€",
      availableTickets: 156,
    },
    category: "Formal",
    tags: ["masquerade", "ball", "formal", "elegant", "vienna"],
    rating: 4.9,
    attendees: 644,
    isLiked: false,
    isFeatured: true,
  },
  {
    id: "event5",
    title: "Street Food & Music Festival",
    description: "A celebration of global street food and live music performances. Family-friendly event with over 50 food vendors and 3 music stages.",
    image: "/api/placeholder/400/300",
    date: "2024-01-25",
    time: "14:00",
    venue: {
      name: "Central Park West",
      address: "Central Park, New York, NY",
      capacity: 5000,
    },
    organizer: {
      name: "City Festival Group",
      avatar: "/api/placeholder/40/40",
      verified: true,
      tier: "premium" as const,
    },
    pricing: {
      minPrice: 0,
      maxPrice: 25,
      currency: "$",
      availableTickets: 2340,
    },
    category: "Festival",
    tags: ["food", "festival", "family", "music", "outdoor"],
    rating: 4.5,
    attendees: 2660,
    isLiked: true,
    isFeatured: false,
  },
  {
    id: "event6",
    title: "Exclusive Wine Tasting Evening",
    description: "An intimate wine tasting experience featuring rare vintages from renowned vineyards. Expert sommeliers will guide you through each selection.",
    image: "/api/placeholder/400/300",
    date: "2024-01-22",
    time: "18:00",
    venue: {
      name: "Le Château Wine Bar",
      address: "567 Vineyard Lane, Napa Valley, CA",
      capacity: 60,
    },
    organizer: {
      name: "Wine Connoisseurs Society",
      avatar: "/api/placeholder/40/40",
      verified: false,
      tier: "premium" as const,
    },
    pricing: {
      minPrice: 95,
      maxPrice: 95,
      currency: "$",
      availableTickets: 12,
    },
    category: "Lifestyle",
    tags: ["wine", "tasting", "exclusive", "intimate", "napa"],
    rating: 4.7,
    attendees: 48,
    isLiked: false,
    isFeatured: false,
  },
];

const categories = ["All", "Music", "Festival", "Formal", "Lifestyle", "Sports", "Comedy", "Art"];

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState(mockEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [sortBy, setSortBy] = useState("date");
  const [priceRange, setPriceRange] = useState("all");

  const filteredEvents = events
    .filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
      
      const matchesDate = !selectedDate || 
                         new Date(event.date).toDateString() === selectedDate.toDateString();

      const matchesPrice = priceRange === "all" ||
                          (priceRange === "free" && event.pricing.minPrice === 0) ||
                          (priceRange === "low" && event.pricing.minPrice > 0 && event.pricing.minPrice <= 30) ||
                          (priceRange === "medium" && event.pricing.minPrice > 30 && event.pricing.minPrice <= 100) ||
                          (priceRange === "high" && event.pricing.minPrice > 100);
      
      return matchesSearch && matchesCategory && matchesDate && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "popularity":
          return b.attendees - a.attendees;
        case "price":
          return a.pricing.minPrice - b.pricing.minPrice;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const featuredEvents = events.filter(event => event.isFeatured);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Events
              </h1>
              <p className="text-muted-foreground">
                Discover amazing nightlife events in your city and beyond
              </p>
            </div>
          </div>
        </div>

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <h2 className="text-xl font-semibold">Featured Events</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, venues, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Categories */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Category:</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-xs"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Date Picker */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Date:</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {selectedDate ? selectedDate.toLocaleDateString() : "Any Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                  <div className="p-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setSelectedDate(undefined)}
                    >
                      Clear Date
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Price Range */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Price:</span>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="low">Under $30</SelectItem>
                  <SelectItem value="medium">$30 - $100</SelectItem>
                  <SelectItem value="high">Over $100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Sort:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">By Date</SelectItem>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="price">By Price</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {selectedCategory === "All" ? "All Events" : `${selectedCategory} Events`}
            </h2>
            <Badge variant="secondary">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedDate(undefined);
                  setPriceRange("all");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Create Event CTA */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-8 text-center">
          <CalendarIcon className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Host Your Own Event</h3>
          <p className="text-muted-foreground mb-6">
            Create unforgettable experiences and connect with your community
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300"
              onClick={() => navigate('/create')}
            >
              <CalendarIcon className="h-5 w-5 mr-2" />
              Create Event
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/marketing')}
            >
              Learn More
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}