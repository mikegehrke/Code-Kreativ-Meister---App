import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  Calendar,
  Music,
  Heart,
  Share,
  Ticket,
  Video,
  MessageCircle
} from "lucide-react";

interface Event {
  id: string;
  name: string;
  time: string;
  date: string;
  dj: string;
  venue?: any;
  venueId?: string;
}

const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { event?: Event } };
  const [isLiked, setIsLiked] = useState(false);
  const [isAttending, setIsAttending] = useState(false);
  
  const event = location.state?.event || {
    id: eventId,
    name: "Live Event",
    time: "22:00",
    date: "Tonight",
    dj: "DJ Unknown"
  };

  // Mock event details
  const eventDetails = {
    ...event,
    description: "Join us for an unforgettable night of music and entertainment. Experience premium sound, amazing atmosphere, and world-class DJs.",
    image: "/api/placeholder/400/300",
    attendees: Math.floor(Math.random() * 500) + 100,
    maxCapacity: 1000,
    price: 15,
    currency: "€",
    category: "Electronic Music",
    features: ["Live DJ Set", "Premium Sound", "Light Show", "VIP Area Available"],
    lineup: [
      { name: event.dj, time: event.time, isMainAct: true },
      { name: "DJ Support Act", time: "20:30", isMainAct: false },
      { name: "Opening DJ", time: "19:00", isMainAct: false }
    ]
  };

  useEffect(() => {
    document.title = `${event.name} | Event`;
  }, [event.name]);

  const handleShare = () => {
    const url = window.location.href;
    const text = `Join me at ${event.name} with ${event.dj}!`;
    
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: text,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
    }
  };

  const handleJoinEvent = () => {
    setIsAttending(true);
    // Here you could trigger a payment flow or registration
  };

  const handleGoToVenue = () => {
    if (event.venueId) {
      navigate(`/venue/${event.venueId}`, {
        state: { venue: event.venue }
      });
    }
  };

  const handleWatchLive = () => {
    navigate(`/event/${event.id}/live`, {
      state: { 
        event: event,
        venue: event.venue
      }
    });
  };

  const handleLiveChat = () => {
    navigate(`/event/${event.id}/chat`, {
      state: {
        event: event,
        venue: event.venue
      }
    });
  };

  const handleArtistClick = (artistName: string) => {
    // Create a handle from artist name (remove spaces, lowercase)
    const handle = artistName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    navigate(`/u/${handle}`, {
      state: {
        isArtist: true,
        artistName: artistName,
        event: event
      }
    });
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
            <h1 className="font-semibold">Event Details</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsLiked(!isLiked)}>
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="pb-20">
        {/* Hero Image */}
        <section className="relative h-64 bg-muted">
          <img 
            src={eventDetails.image} 
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Live Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-red-500 text-white animate-pulse">
              🔴 LIVE EVENT
            </Badge>
          </div>

          {/* Event Stats */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{eventDetails.attendees} attending</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{event.time}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Event Info */}
        <section className="px-4 py-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{event.name}</h2>
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Music className="h-4 w-4" />
              <span className="text-sm">with {event.dj}</span>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{event.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{event.time}</span>
              </div>
            </div>

            {event.venue && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGoToVenue}
                className="mb-4"
              >
                <MapPin className="h-4 w-4 mr-2" />
                {event.venue.name}
              </Button>
            )}
            
            <Badge variant="outline" className="text-xs mb-4">
              {eventDetails.category}
            </Badge>
            
            <p className="text-sm leading-relaxed mb-4">{eventDetails.description}</p>
            
            {/* Price & Join */}
            <div className="bg-muted rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Ticket className="h-4 w-4" />
                    <span className="text-lg font-bold">
                      {eventDetails.currency}{eventDetails.price}
                    </span>
                    <span className="text-sm text-muted-foreground">entry</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Includes welcome drink</p>
                </div>
                
                <Button 
                  onClick={handleJoinEvent}
                  disabled={isAttending}
                  className="bg-gradient-to-r from-primary to-accent hover:shadow-lg"
                >
                  {isAttending ? 'Attending!' : 'Join Event'}
                </Button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">What to Expect</h3>
            <div className="flex flex-wrap gap-2">
              {eventDetails.features.map((feature: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          {/* Lineup */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Lineup</h3>
            <div className="space-y-3">
              {eventDetails.lineup.map((act: any, index: number) => (
                <div 
                  key={index} 
                  className="bg-muted rounded-lg p-4 cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => handleArtistClick(act.name)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/api/placeholder/40/40`} />
                        <AvatarFallback>{act.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{act.name}</h4>
                        <p className="text-sm text-muted-foreground">{act.time}</p>
                      </div>
                    </div>
                    {act.isMainAct && (
                      <Badge className="bg-gradient-to-r from-primary to-accent">
                        Headliner
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleWatchLive}
            >
              <Video className="h-4 w-4" />
              Watch Live
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleLiveChat}
            >
              <MessageCircle className="h-4 w-4" />
              Live Chat
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EventDetail;