import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Video, 
  ArrowLeft, 
  Users, 
  Eye, 
  Camera, 
  Mic, 
  Settings,
  Zap,
  Star,
  Crown,
  Gift,
  MessageCircle,
  CheckCircle2,
  Clock
} from "lucide-react";

const categories = [
  { id: "music", name: "Music", icon: "🎵" },
  { id: "party", name: "Party", icon: "🎉" },
  { id: "food", name: "Food & Drinks", icon: "🍸" },
  { id: "fashion", name: "Fashion", icon: "👗" },
  { id: "education", name: "Education", icon: "📚" },
  { id: "lifestyle", name: "Lifestyle", icon: "✨" },
];

const GoLive = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLive, setIsLive] = useState(false);
  const [bookedRoom, setBookedRoom] = useState(location.state?.paid ? location.state?.bookedRoom : null);
  const [isRoomBooked, setIsRoomBooked] = useState(Boolean(location.state?.paid && location.state?.isRoomBooked));
  const [liveSettings, setLiveSettings] = useState({
    title: "",
    description: "", 
    category: "",
    isPrivate: false,
    allowComments: true,
    allowTips: true,
  });

  const [mockStats, setMockStats] = useState({
    viewers: 0,
    likes: 0,
    comments: 0,
    tips: 0,
  });

  useEffect(() => {
    document.title = "Go Live | Nightlife";
  }, []);

  // Simulate live stats
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setMockStats(prev => ({
          viewers: prev.viewers + Math.floor(Math.random() * 5) - 2,
          likes: prev.likes + Math.floor(Math.random() * 3),
          comments: prev.comments + Math.floor(Math.random() * 2),
          tips: prev.tips + (Math.random() > 0.95 ? Math.floor(Math.random() * 10) + 1 : 0),
        }));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isLive]);

  const startLiveStream = () => {
    if (!liveSettings.title || !liveSettings.category) {
      alert("Bitte Titel und Kategorie auswählen");
      return;
    }
    
    setIsLive(true);
    setMockStats({
      viewers: Math.floor(Math.random() * 10) + 1,
      likes: 0,
      comments: 0,
      tips: 0,
    });
  };

  const endLiveStream = () => {
    setIsLive(false);
    setMockStats({ viewers: 0, likes: 0, comments: 0, tips: 0 });
    navigate('/live');
  };

  if (isLive) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Mock Video Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="h-32 w-32 bg-primary/30 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Live Controls Overlay */}
        <div className="relative z-10 p-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-red-500 text-white animate-pulse">
                🔴 LIVE
              </Badge>
              <div className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4" />
                {mockStats.viewers}
              </div>
            </div>
            
            <Button 
              variant="destructive" 
              size="sm"
              onClick={endLiveStream}
            >
              Stream beenden
            </Button>
          </div>

          {/* Stream Info */}
          <div className="bg-black/50 rounded-lg p-4 mb-4">
            <h2 className="font-bold text-lg">{liveSettings.title}</h2>
            <p className="text-white/80 text-sm">{liveSettings.description}</p>
            <Badge className="mt-2 bg-primary/20 text-primary">
              {categories.find(c => c.id === liveSettings.category)?.name}
            </Badge>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between bg-black/70 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm">{mockStats.comments}</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-yellow-400" />
                <span className="text-sm">€{mockStats.tips}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Mic className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Camera className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mock Chat Messages */}
        <div className="absolute right-4 bottom-24 w-64 max-h-80 overflow-y-auto">
          <div className="space-y-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="bg-black/50 rounded-lg p-2 text-sm">
                <span className="font-bold text-primary">User{i + 1}: </span>
                <span>Great stream! 🔥</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="font-semibold">Go Live</h1>
            <p className="text-xs text-muted-foreground">Live-Stream starten</p>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="pb-20 px-4 py-6">
        {/* Room Status */}
        {isRoomBooked && bookedRoom && (
          <Alert className="mb-6 border-green-500/20 bg-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700">
              <strong>Room gebucht:</strong> {bookedRoom.name} für {bookedRoom.duration}h 
              ({bookedRoom.currency}{bookedRoom.price})
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Start Options */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Live-Stream Optionen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer hover:shadow-md transition-shadow ${!isRoomBooked ? 'border-primary/50' : ''}`}
              onClick={() => {
                // Start free live stream
                if (!liveSettings.title || !liveSettings.category) {
                  alert("Bitte erst Titel und Kategorie eingeben");
                  return;
                }
                startLiveStream();
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Video className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">Kostenlos Live gehen</CardTitle>
                    <p className="text-xs text-muted-foreground">Sofort starten, keine Kosten</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Users className="h-3 w-3 mr-1" />
                    Bis zu 50 Zuschauer
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Basic Chat
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    2h Max-Dauer
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer hover:shadow-md transition-shadow ${isRoomBooked ? 'border-primary/50 bg-primary/5' : ''}`}
              onClick={() => {
                if (isRoomBooked) {
                  // Start premium stream with booked room
                  if (!liveSettings.title || !liveSettings.category) {
                    alert("Bitte erst Titel und Kategorie eingeben");
                    return;
                  }
                  startLiveStream();
                } else {
                  // Navigate to room rental
                  navigate('/rent-room');
                }
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">
                      {isRoomBooked ? `Premium Room: ${bookedRoom?.name}` : 'Premium Room mieten'}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {isRoomBooked ? 'Room bereit für Live-Stream' : 'Erweiterte Features & Monetarisierung'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {isRoomBooked ? (
                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Room gebucht ({bookedRoom?.duration}h)
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="h-3 w-3 mr-1" />
                      Bis zu {bookedRoom?.maxViewers} Zuschauer
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Premium Features aktiv
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Gift className="h-3 w-3 mr-1" />
                      Ticket-Verkauf
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Premium Features
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3 mb-2"
                      onClick={() => navigate('/rent-room')}
                    >
                      Room mieten
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate('/create-room')}
                    >
                      Eigenen Room erstellen
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Stream Setup */}
        <section className="space-y-6">
          <h2 className="text-lg font-semibold">Stream konfigurieren</h2>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Stream Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titel *</Label>
                <Input
                  id="title"
                  placeholder="z.B. Live aus der Bar in Berlin"
                  value={liveSettings.title}
                  onChange={(e) => setLiveSettings({...liveSettings, title: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  placeholder="Beschreibe deinen Live-Stream..."
                  value={liveSettings.description}
                  onChange={(e) => setLiveSettings({...liveSettings, description: e.target.value})}
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="category">Kategorie *</Label>
                <Select 
                  value={liveSettings.category} 
                  onValueChange={(value) => setLiveSettings({...liveSettings, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategorie auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Einstellungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Privater Stream</Label>
                  <p className="text-xs text-muted-foreground">Nur für Follower sichtbar</p>
                </div>
                <Switch
                  checked={liveSettings.isPrivate}
                  onCheckedChange={(checked) => setLiveSettings({...liveSettings, isPrivate: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Kommentare erlauben</Label>
                  <p className="text-xs text-muted-foreground">Zuschauer können kommentieren</p>
                </div>
                <Switch
                  checked={liveSettings.allowComments}
                  onCheckedChange={(checked) => setLiveSettings({...liveSettings, allowComments: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Tips erlauben</Label>
                  <p className="text-xs text-muted-foreground">Zuschauer können Tips senden</p>
                </div>
                <Switch
                  checked={liveSettings.allowTips}
                  onCheckedChange={(checked) => setLiveSettings({...liveSettings, allowTips: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Start Button */}
          <Button 
            onClick={startLiveStream}
            className="w-full h-12 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold"
            disabled={!liveSettings.title || !liveSettings.category}
          >
            <Video className="h-5 w-5 mr-2" />
            Live-Stream starten
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Durch das Starten akzeptierst du unsere Community-Richtlinien
          </p>
        </section>
      </main>
    </div>
  );
};

export default GoLive;