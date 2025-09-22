import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Crown, 
  Users, 
  Euro, 
  Zap, 
  Settings, 
  BarChart3, 
  Eye,
  MessageCircle,
  Gift,
  Star,
  Play,
  Palette,
  Camera
} from "lucide-react";

interface RoomManagementProps {
  roomData: any;
}

export const RoomManagement = ({ roomData }: RoomManagementProps) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSales: 0,
    ticketsSold: 0,
    currentViewers: 0,
    totalRevenue: 0,
  });

  const [isCustomizing, setIsCustomizing] = useState(false);

  useEffect(() => {
    // Simulate some sales data
    const mockStats = {
      totalSales: Math.floor(Math.random() * 50) + 10,
      ticketsSold: Math.floor(Math.random() * 30) + 5,
      currentViewers: Math.floor(Math.random() * 20),
      totalRevenue: Math.floor(Math.random() * 500) + 100,
    };
    setStats(mockStats);
  }, []);

  const startLiveStream = () => {
    navigate('/go-live', { 
      state: { 
        roomData,
        isRoomOwner: true,
        stats 
      }
    });
  };

  const customizeRoom = () => {
    setIsCustomizing(true);
    // This would open the room customization interface
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Crown className="h-6 w-6 text-yellow-500" />
          <h1 className="text-2xl font-bold">{roomData.title}</h1>
        </div>
        <Badge className="bg-green-500/10 text-green-600">
          Room erfolgreich erstellt
        </Badge>
        <p className="text-muted-foreground mt-2">
          Dein Premium-Room ist bereit! Passe das Design an und gehe dann Live.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{stats.ticketsSold}</div>
            <div className="text-xs text-muted-foreground">Tickets verkauft</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Euro className="h-5 w-5 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">€{stats.totalRevenue}</div>
            <div className="text-xs text-muted-foreground">Gesamtumsatz</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="h-5 w-5 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{stats.currentViewers}</div>
            <div className="text-xs text-muted-foreground">Online jetzt</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-5 w-5 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{Math.round(stats.totalRevenue / stats.ticketsSold || 0)}</div>
            <div className="text-xs text-muted-foreground">Ø Ticketpreis</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Play className="h-5 w-5" />
              Live gehen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Starte deinen Live-Stream in diesem Premium-Room
            </p>
            <Button 
              onClick={startLiveStream}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Camera className="h-4 w-4 mr-2" />
              Jetzt Live gehen
            </Button>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Palette className="h-5 w-5" />
              Room Design
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Passe das Aussehen deines Rooms an
            </p>
            <Button 
              onClick={customizeRoom}
              variant="outline"
              className="w-full border-purple-500/20 text-purple-600 hover:bg-purple-50"
            >
              <Settings className="h-4 w-4 mr-2" />
              Room anpassen
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Room Details */}
      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Einstellungen</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle>Deine Ticket-Stufen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roomData.ticketTiers?.map((tier: any, index: number) => (
                  <Card key={tier.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{tier.name}</h3>
                        <div className="text-right">
                          <div className="text-lg font-bold">€{tier.price}</div>
                          <div className="text-xs text-muted-foreground">
                            {Math.floor(Math.random() * 10) + 1} verkauft
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{tier.description}</p>
                      <div className="space-y-1">
                        {tier.features.map((feature: string, featureIndex: number) => (
                          <div key={featureIndex} className="flex items-center text-xs">
                            <Star className="h-3 w-3 text-yellow-500 mr-2" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      {/* Sales Progress */}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Verkauft</span>
                          <span>{Math.floor(Math.random() * 100)}%</span>
                        </div>
                        <Progress value={Math.floor(Math.random() * 100)} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Room Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Umsatz Übersicht</h3>
                  <div className="h-32 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Analytics Charts würden hier erscheinen</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Top Features</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Geschenke: €{Math.floor(Math.random() * 100) + 50}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Tips: €{Math.floor(Math.random() * 200) + 100}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Room Einstellungen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Grundinformationen</h3>
                  <p className="text-sm text-muted-foreground mb-1">Titel: {roomData.title}</p>
                  <p className="text-sm text-muted-foreground mb-1">Max. Zuschauer: {roomData.maxViewers}</p>
                  <p className="text-sm text-muted-foreground">Erstellt: {new Date(roomData.createdAt).toLocaleDateString('de-DE')}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Beschreibung</h3>
                  <p className="text-sm text-muted-foreground">{roomData.description}</p>
                </div>

                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Einstellungen bearbeiten
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Room Customization Modal would go here when isCustomizing is true */}
      {isCustomizing && (
        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardHeader>
            <CardTitle className="text-purple-700">Room Design Anpassung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Palette className="h-16 w-16 mx-auto mb-4 text-purple-500" />
              <h3 className="text-lg font-semibold mb-2">Design Studio</h3>
              <p className="text-muted-foreground mb-4">
                Hier würdest du dein Room-Design anpassen können: 
                Farben, Layouts, Hintergründe, Animationen und mehr.
              </p>
              <Button 
                onClick={() => setIsCustomizing(false)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Design fertig
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};