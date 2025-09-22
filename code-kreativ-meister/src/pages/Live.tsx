import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Layout/Header";
import LiveChatInterface from "@/components/LiveStream/LiveChatInterface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { 
  Play, 
  Users, 
  MessageCircle, 
  Settings, 
  Crown,
  Eye,
  Heart,
  Share2,
  Video,
  Square
} from "lucide-react";
import { toast } from "sonner";

export default function Live() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeRoom, setActiveRoom] = useState<any>(null);
  const [isLive, setIsLive] = useState(false);
  const [liveStats, setLiveStats] = useState({
    viewers: 0,
    likes: 0,
    messages: 0,
    revenue: 0
  });

  // Check if coming from room creation
  useEffect(() => {
    if (location.state?.createdRoom && location.state?.isNewRoom) {
      const roomData = location.state.createdRoom;
      setActiveRoom(roomData);
      
      toast.success("Room erfolgreich erstellt! Du kannst jetzt live gehen.");
      
      // Clear the state to prevent showing this message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    document.title = "Live Streaming | NightHub";
    const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    metaDesc.setAttribute('content', 'Starte deinen Live-Stream und interagiere mit deinen Zuschauern in Echtzeit auf NightHub.');
    document.head.appendChild(metaDesc);

    // Simulate live stats updates
    const interval = setInterval(() => {
      if (isLive) {
        setLiveStats(prev => ({
          viewers: prev.viewers + Math.floor(Math.random() * 3),
          likes: prev.likes + Math.floor(Math.random() * 2),
          messages: prev.messages + Math.floor(Math.random() * 4),
          revenue: prev.revenue + (Math.random() * 5)
        }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const startLiveStream = () => {
    if (!activeRoom) {
      toast.error("Kein Room ausgewählt");
      return;
    }

    setIsLive(true);
    setLiveStats({ viewers: 1, likes: 0, messages: 0, revenue: 0 });
    
    toast.success(`Live-Stream gestartet für "${activeRoom.title}"`);
  };

  const stopLiveStream = () => {
    setIsLive(false);
    toast.success("Live-Stream beendet");
  };

  const createNewRoom = () => {
    navigate('/create-room');
  };

  if (!activeRoom) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8 pb-32">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Live Streaming</h1>
              <p className="text-muted-foreground">
                Erstelle oder wähle einen Room um live zu gehen
              </p>
            </div>

            <Card className="max-w-md mx-auto">
              <CardContent className="p-6 text-center space-y-4">
                <Video className="h-12 w-12 mx-auto text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="font-semibold">Kein aktiver Room</h3>
                  <p className="text-sm text-muted-foreground">
                    Erstelle einen neuen Room um mit dem Streaming zu beginnen
                  </p>
                </div>
                <Button onClick={createNewRoom} className="w-full">
                  <Crown className="h-4 w-4 mr-2" />
                  Neuen Room erstellen
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-32">
        {/* Room Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{activeRoom.title}</h1>
              {isLive && (
                <Badge className="bg-red-500 text-white animate-pulse">
                  LIVE
                </Badge>
              )}
              {location.state?.isNewRoom && (
                <Badge className="bg-green-500 text-white">
                  NEU ERSTELLT
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{activeRoom.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Kategorie: {activeRoom.category}</span>
              <span>Max: {activeRoom.maxViewers} Zuschauer</span>
              <span>Plan: {activeRoom.selectedPlan}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isLive ? (
              <Button onClick={startLiveStream} className="bg-red-500 hover:bg-red-600">
                <Play className="h-4 w-4 mr-2" />
                Live gehen
              </Button>
            ) : (
              <Button onClick={stopLiveStream} variant="outline" className="text-red-500 border-red-500">
                <Square className="h-4 w-4 mr-2" />
                Live beenden
              </Button>
            )}
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Live Stats */}
        {isLive && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-2xl font-bold">{liveStats.viewers}</span>
                </div>
                <p className="text-sm text-muted-foreground">Zuschauer</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-2xl font-bold">{liveStats.likes}</span>
                </div>
                <p className="text-sm text-muted-foreground">Likes</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-2xl font-bold">{liveStats.messages}</span>
                </div>
                <p className="text-sm text-muted-foreground">Nachrichten</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  <span className="text-2xl font-bold">€{liveStats.revenue.toFixed(2)}</span>
                </div>
                <p className="text-sm text-muted-foreground">Einnahmen</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="stream" className="space-y-4">
          <TabsList>
            <TabsTrigger value="stream">Live Stream</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="settings">Einstellungen</TabsTrigger>
          </TabsList>

          <TabsContent value="stream" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Stream Area */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-0">
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                      {isLive ? (
                        <div className="text-white text-center space-y-2">
                          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                            <Video className="h-8 w-8" />
                          </div>
                          <p className="text-lg font-semibold">Live Stream aktiv</p>
                          <p className="text-sm opacity-75">{liveStats.viewers} Zuschauer</p>
                        </div>
                      ) : (
                        <div className="text-white text-center space-y-2">
                          <Video className="h-16 w-16 mx-auto opacity-50" />
                          <p className="text-lg">Stream offline</p>
                          <p className="text-sm opacity-75">Klicke "Live gehen" um zu starten</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chat Sidebar */}
              <div className="lg:col-span-1">
                <LiveChatInterface 
                  hostName="Du"
                  hostAvatar="/placeholder.svg"
                  hostFollowers="0"
                  viewerCount={liveStats.viewers}
                  isLive={isLive}
                  roomTitle={activeRoom.title}
                  category={activeRoom.category}
                  creatorUserId={user?.id}
                  onEndCall={stopLiveStream}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <LiveChatInterface 
              hostName="Du"
              hostAvatar="/placeholder.svg"
              hostFollowers="0"
              viewerCount={liveStats.viewers}
              isLive={isLive}
              roomTitle={activeRoom.title}
              category={activeRoom.category}
              creatorUserId={user?.id}
              onEndCall={stopLiveStream}
            />
          </TabsContent>

          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Verkäufe</CardTitle>
                <CardDescription>
                  Verwalte die Ticket-Tiers für deinen Room
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeRoom.ticketTiers?.map((tier: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{tier.name}</h4>
                        <p className="text-sm text-muted-foreground">{tier.description}</p>
                        <div className="flex gap-1 mt-2">
                          {tier.features?.slice(0, 3).map((feature: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">€{tier.price}</div>
                        <div className="text-sm text-green-600">0 verkauft</div>
                      </div>
                    </div>
                  ))}
                  
                  {!activeRoom.ticketTiers?.length && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Crown className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Keine Ticket-Tiers konfiguriert</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Room Einstellungen</CardTitle>
                <CardDescription>
                  Konfiguriere deinen Live-Stream Room
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Room Name</label>
                    <p className="text-sm text-muted-foreground p-2 bg-muted rounded">
                      {activeRoom.title}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Kategorie</label>
                    <p className="text-sm text-muted-foreground p-2 bg-muted rounded">
                      {activeRoom.category}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Zuschauer</label>
                    <p className="text-sm text-muted-foreground p-2 bg-muted rounded">
                      {activeRoom.maxViewers}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Plan</label>
                    <Badge className="p-2 text-sm">
                      {activeRoom.selectedPlan}
                    </Badge>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Room Status</h4>
                      <p className="text-sm text-muted-foreground">
                        Erstellt am {new Date(activeRoom.createdAt).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                    <Badge variant={activeRoom.isActive ? "default" : "secondary"}>
                      {activeRoom.isActive ? "Aktiv" : "Inaktiv"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}