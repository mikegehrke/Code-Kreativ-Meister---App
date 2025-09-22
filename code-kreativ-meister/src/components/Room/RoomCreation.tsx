import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Crown, Star, Gift, Users, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentFlow } from "@/components/Payment/PaymentFlow";

interface TicketTier {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  maxQuantity?: number;
}

interface PaymentItem {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  duration?: number;
  image?: string;
  ticketTiers?: TicketTier[];
}

interface RoomCreationProps {
  onRoomCreated?: (roomData: any) => void;
}

export const RoomCreation = ({ onRoomCreated }: RoomCreationProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [roomData, setRoomData] = useState({
    title: "",
    description: "",
    category: "",
    maxViewers: 100,
    selectedPlan: "basic",
    selectedMarketing: [],
  });

  const subscriptionPlans = [
    {
      id: "basic",
      name: "Basic Room",
      price: 25,
      maxViewers: 100,
      ticketFee: 20,
      features: [
        "Bis zu 100 Zuschauer",
        "Standard Streaming Qualität",
        "Basic Chat Features", 
        "Ticket Verkauf (20% Gebühr)",
        "24/7 Support"
      ],
      color: "blue"
    },
    {
      id: "premium", 
      name: "Premium Room",
      price: 50,
      maxViewers: 500,
      ticketFee: 15,
      features: [
        "Bis zu 500 Zuschauer",
        "HD Streaming Qualität",
        "Premium Chat & Emojis",
        "Ticket Verkauf (15% Gebühr)",
        "Geschenke & Tips",
        "Priority Support",
        "Analytics Dashboard"
      ],
      color: "purple",
      popular: true
    },
    {
      id: "pro",
      name: "Pro Room", 
      price: 99,
      maxViewers: 1000,
      ticketFee: 12,
      features: [
        "Bis zu 1000 Zuschauer",
        "4K Streaming Qualität",
        "VIP Chat Features",
        "Ticket Verkauf (12% Gebühr)",
        "Alle Premium Features",
        "Multi-Stream zu anderen Plattformen",
        "Dedicated Account Manager",
        "Erweiterte Analytics"
      ],
      color: "yellow"
    }
  ];

  const marketingPackages = [
    {
      id: "social_boost",
      name: "Social Media Boost",
      price: 15,
      duration: "monatlich",
      category: "social",
      features: [
        "Promotion auf unseren Social Media",
        "Featured in App Empfehlungen", 
        "Push Notifications an relevante User",
        "Instagram & TikTok Stories"
      ]
    },
    {
      id: "homepage_feature",
      name: "Homepage Feature",
      price: 25,
      duration: "pro Event",
      category: "placement",
      features: [
        "Featured auf der Startseite",
        "Top Position in Room Liste",
        "Highlight Badge",
        "Email Newsletter Feature"
      ]
    },
    {
      id: "influencer_network",
      name: "Influencer Netzwerk",
      price: 50,
      duration: "monatlich",
      category: "partnership", 
      features: [
        "Promotion durch Partner Influencer",
        "Cross-Promotion mit anderen Rooms",
        "Kollaborations-Möglichkeiten",
        "PR & Media Outreach"
      ]
    },
    {
      id: "video_for_you_boost",
      name: "For You Video Boost",
      price: 20,
      duration: "pro Video",
      category: "video",
      features: [
        "Video in For You Feed hochschieben",
        "Algorithmus Boost für mehr Views",
        "Trending Section Placement",
        "24h Featured Status"
      ]
    },
    {
      id: "video_ad_campaign",
      name: "Video Werbekampagne",
      price: 35,
      duration: "pro Kampagne",
      category: "video",
      features: [
        "Kurze Video Clips als Werbung",
        "Gezielte Zielgruppen-Ansprache",
        "Analytics & Performance Reports",
        "A/B Testing verschiedener Clips"
      ]
    },
    {
      id: "viral_video_package",
      name: "Viral Video Paket",
      price: 75,
      duration: "monatlich",
      category: "video",
      features: [
        "Professionelle Video Clip Erstellung",
        "Multi-Plattform Distribution",
        "Influencer Video Kollaborationen",
        "Viral Marketing Strategien"
      ]
    }
  ];

  const roomCategories = [
    { id: "music", name: "Music & DJ", icon: "🎵", description: "Live DJ Sets, Konzerte, Musikproduktion" },
    { id: "party", name: "Party & Events", icon: "🎉", description: "Private Parties, Celebrations, Nightlife" },
    { id: "food", name: "Food & Drinks", icon: "🍸", description: "Kochshows, Cocktail Making, Restaurant Tours" },
    { id: "fashion", name: "Fashion & Beauty", icon: "👗", description: "Fashion Shows, Makeup Tutorials, Styling" },
    { id: "gaming", name: "Gaming", icon: "🎮", description: "Live Gaming, Esports, Gaming Reviews" },
    { id: "fitness", name: "Fitness & Health", icon: "💪", description: "Workouts, Yoga, Health Tips" },
    { id: "education", name: "Education & Learning", icon: "📚", description: "Tutorials, Workshops, Online Courses" },
    { id: "lifestyle", name: "Lifestyle & Vlog", icon: "✨", description: "Daily Life, Travel, Lifestyle Content" },
    { id: "business", name: "Business & Finance", icon: "💼", description: "Business Talks, Investment, Networking" },
    { id: "art", name: "Art & Creative", icon: "🎨", description: "Art Creation, Design, Creative Process" },
  ];

  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>([
    {
      id: "basic",
      name: "Basic Ticket",
      description: "Grundzugang zum Room",
      price: 5,
      features: ["Zugang zum Stream", "Chat Nachrichten", "Basic Emojis"],
    },
    {
      id: "premium",
      name: "Premium Ticket", 
      description: "Erweiterte Features",
      price: 15,
      features: ["Alle Basic Features", "Geschenke senden", "Priority Chat", "Exklusive Emojis"],
    },
    {
      id: "vip",
      name: "VIP Ticket",
      description: "VIP Erlebnis mit allen Features",
      price: 30,
      features: ["Alle Premium Features", "Direktnachrichten", "VIP Badge", "Highlight Messages", "Tip Bonus"],
    },
  ]);

  const [showPayment, setShowPayment] = useState(false);
  const [selectedPaymentTier, setSelectedPaymentTier] = useState<PaymentItem | null>(null);

  const updateTicketTier = (id: string, field: keyof TicketTier, value: any) => {
    setTicketTiers(tiers =>
      tiers.map(tier =>
        tier.id === id ? { ...tier, [field]: value } : tier
      )
    );
  };

  const addTicketTier = () => {
    const newTier: TicketTier = {
      id: `tier_${Date.now()}`,
      name: "Neues Ticket",
      description: "Beschreibung eingeben...",
      price: 10,
      features: ["Feature eingeben..."],
    };
    setTicketTiers([...ticketTiers, newTier]);
  };

  const removeTicketTier = (id: string) => {
    if (ticketTiers.length > 1) {
      setTicketTiers(tiers => tiers.filter(tier => tier.id !== id));
    }
  };

  const addFeature = (tierId: string) => {
    setTicketTiers(tiers =>
      tiers.map(tier =>
        tier.id === tierId
          ? { ...tier, features: [...tier.features, "Neues Feature..."] }
          : tier
      )
    );
  };

  const updateFeature = (tierId: string, featureIndex: number, value: string) => {
    setTicketTiers(tiers =>
      tiers.map(tier =>
        tier.id === tierId
          ? {
              ...tier,
              features: tier.features.map((f, i) => i === featureIndex ? value : f)
            }
          : tier
      )
    );
  };

  const removeFeature = (tierId: string, featureIndex: number) => {
    setTicketTiers(tiers =>
      tiers.map(tier =>
        tier.id === tierId
          ? { ...tier, features: tier.features.filter((_, i) => i !== featureIndex) }
          : tier
      )
    );
  };

  const handleCreateRoom = () => {
    if (!roomData.title || !roomData.description || !roomData.category) {
      alert("Bitte fülle alle Pflichtfelder aus (Titel, Beschreibung, Kategorie)");
      return;
    }

    const selectedPlan = subscriptionPlans.find(p => p.id === roomData.selectedPlan);
    const marketingCosts = roomData.selectedMarketing.reduce((total, packageId) => {
      const pkg = marketingPackages.find(p => p.id === packageId);
      return total + (pkg ? pkg.price : 0);
    }, 0);

    // Set room subscription with selected plan + marketing
    const roomSubscription = {
      id: "room_subscription",
      name: `${selectedPlan?.name}: ${roomData.title}`,
      price: (selectedPlan?.price || 25) + marketingCosts,
      currency: "€",
      description: `${selectedPlan?.name} + Marketing Pakete`,
      duration: 1,
      image: "",
      isSubscription: true,
      plan: selectedPlan,
      marketingPackages: roomData.selectedMarketing.map(id => 
        marketingPackages.find(p => p.id === id)
      ),
      ticketTiers: ticketTiers
    };

    setSelectedPaymentTier(roomSubscription);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentData: any) => {
    // Create room after successful payment
    const fullRoomData = {
      ...roomData,
      ticketTiers: ticketTiers,
      roomId: `room_${Date.now()}`,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    setShowPayment(false);
    
    toast({
      title: "Room erfolgreich erstellt!",
      description: "Du wirst jetzt zum Live Chat weitergeleitet.",
    });
    
    // Redirect to live chat with room data
    navigate('/live', { 
      state: { 
        createdRoom: fullRoomData,
        isNewRoom: true,
        isRoomOwner: true
      }
    });
  };

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case "basic": return <Users className="h-4 w-4" />;
      case "premium": return <Star className="h-4 w-4" />;
      case "vip": return <Crown className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };

  const getTierColor = (tierId: string) => {
    switch (tierId) {
      case "basic": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "premium": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "vip": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      default: return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Eigenen Room erstellen</h1>
        <p className="text-muted-foreground">
          Erstelle deinen eigenen Premium-Room mit personalisierten Ticket-Optionen
        </p>
      </div>

      {/* Room Plans Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Room Plan auswählen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => (
              <Card 
                key={plan.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  roomData.selectedPlan === plan.id 
                    ? 'border-primary shadow-md bg-primary/5' 
                    : 'hover:border-primary/50'
                } ${plan.popular ? 'border-purple-500/50 bg-purple-500/5' : ''}`}
                onClick={() => setRoomData({...roomData, selectedPlan: plan.id, maxViewers: plan.maxViewers})}
              >
                <CardContent className="p-4 relative">
                  {plan.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-500 text-white text-xs">BELIEBT</Badge>
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <div className="text-3xl font-bold text-primary">€{plan.price}</div>
                    <div className="text-sm text-muted-foreground">pro Monat</div>
                  </div>
                  
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Star className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {roomData.selectedPlan === plan.id && (
                    <div className="mt-3 text-center">
                      <Badge className="bg-green-500 text-white">Ausgewählt</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Room Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Room Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="room-title">Room Titel *</Label>
            <Input
              id="room-title"
              placeholder="z.B. Exklusive VIP Lounge Experience"
              value={roomData.title}
              onChange={(e) => setRoomData({ ...roomData, title: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="room-description">Room Beschreibung *</Label>
            <Textarea
              id="room-description"
              placeholder="Beschreibe was dein Room bietet, welche besonderen Features es gibt, was Besucher erwarten können..."
              value={roomData.description}
              onChange={(e) => setRoomData({ ...roomData, description: e.target.value })}
              className="min-h-[120px]"
            />
          </div>

          <div>
            <Label htmlFor="room-category">Room Kategorie *</Label>
            <Select 
              value={roomData.category} 
              onValueChange={(value) => setRoomData({ ...roomData, category: value })}
            >
              <SelectTrigger className="bg-background border-input">
                <SelectValue placeholder="Wähle eine Kategorie für deinen Room" />
              </SelectTrigger>
              <SelectContent className="bg-background border-input shadow-lg z-50">
                {roomCategories.map((category) => (
                  <SelectItem 
                    key={category.id} 
                    value={category.id}
                    className="hover:bg-accent focus:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{category.icon}</span>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-muted-foreground">{category.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="max-viewers">Maximale Zuschauer</Label>
            <Input
              id="max-viewers"
              type="number"
              min="10"
              max="1000"
              value={roomData.maxViewers}
              onChange={(e) => setRoomData({ ...roomData, maxViewers: parseInt(e.target.value) || 100 })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Ticket Tiers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Ticket Preise & Features
            </CardTitle>
            <Button variant="outline" size="sm" onClick={addTicketTier}>
              <Plus className="h-4 w-4 mr-1" />
              Ticket hinzufügen
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ticketTiers.map((tier, index) => (
              <Card key={tier.id} className={`${getTierColor(tier.id)}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTierIcon(tier.id)}
                      <Input
                        value={tier.name}
                        onChange={(e) => updateTicketTier(tier.id, "name", e.target.value)}
                        className="font-semibold bg-transparent border-0 p-0 h-auto focus-visible:ring-0"
                      />
                    </div>
                    {ticketTiers.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTicketTier(tier.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Textarea
                      placeholder="Beschreibung des Tickets..."
                      value={tier.description}
                      onChange={(e) => updateTicketTier(tier.id, "description", e.target.value)}
                      className="bg-background/50 border-white/10"
                    />

                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">Preis:</Label>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min="1"
                          step="0.5"
                          value={tier.price}
                          onChange={(e) => updateTicketTier(tier.id, "price", parseFloat(e.target.value) || 0)}
                          className="w-20 h-8"
                        />
                        <span className="text-sm font-medium">€</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">Features:</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addFeature(tier.id)}
                          className="h-6 text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Feature
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {tier.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <Input
                              value={feature}
                              onChange={(e) => updateFeature(tier.id, featureIndex, e.target.value)}
                              className="flex-1 h-8 text-sm bg-background/50"
                              placeholder="Feature beschreiben..."
                            />
                            {tier.features.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFeature(tier.id, featureIndex)}
                                className="h-8 w-8 text-red-500"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ticket Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Vorschau</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ticketTiers.map((tier) => (
              <Card key={tier.id} className="relative overflow-hidden">
                <CardContent className="p-4">
                  <div className="text-center mb-3">
                    <Badge className={getTierColor(tier.id)} variant="secondary">
                      {tier.name}
                    </Badge>
                    <div className="text-2xl font-bold mt-2">€{tier.price}</div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 text-center">
                    {tier.description}
                  </p>
                  
                  <Separator className="mb-3" />
                  
                  <div className="space-y-1">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-xs">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Marketing Packages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-purple-500" />
            Marketing Pakete (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Boost deine Reichweite mit unseren Marketing-Paketen
          </p>
          
          {/* Marketing Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard Marketing */}
            <div>
              <h4 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Standard Marketing
              </h4>
              <div className="space-y-3">
                {marketingPackages.filter(pkg => pkg.category !== 'video').map((pkg) => (
                  <Card 
                    key={pkg.id}
                    className={`cursor-pointer transition-all hover:shadow-sm ${
                      roomData.selectedMarketing.includes(pkg.id)
                        ? 'border-purple-500/50 bg-purple-500/5'
                        : 'hover:border-purple-500/30'
                    }`}
                    onClick={() => {
                      const isSelected = roomData.selectedMarketing.includes(pkg.id);
                      const newSelection = isSelected
                        ? roomData.selectedMarketing.filter(id => id !== pkg.id)
                        : [...roomData.selectedMarketing, pkg.id];
                      setRoomData({...roomData, selectedMarketing: newSelection});
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium text-sm">{pkg.name}</h5>
                            {roomData.selectedMarketing.includes(pkg.id) && (
                              <Badge className="bg-purple-500 text-white text-xs">AKTIV</Badge>
                            )}
                          </div>
                          <div className="space-y-1">
                            {pkg.features.map((feature, index) => (
                              <div key={index} className="flex items-center text-xs text-muted-foreground">
                                <div className="h-1 w-1 bg-purple-500 rounded-full mr-2" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="text-right ml-3">
                          <div className="font-bold">€{pkg.price}</div>
                          <div className="text-xs text-muted-foreground">{pkg.duration}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Video Marketing */}
            <div>
              <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                <Gift className="h-4 w-4" />
                Video Marketing
              </h4>
              <div className="space-y-3">
                {marketingPackages.filter(pkg => pkg.category === 'video').map((pkg) => (
                  <Card 
                    key={pkg.id}
                    className={`cursor-pointer transition-all hover:shadow-sm ${
                      roomData.selectedMarketing.includes(pkg.id)
                        ? 'border-red-500/50 bg-red-500/5'
                        : 'hover:border-red-500/30'
                    }`}
                    onClick={() => {
                      const isSelected = roomData.selectedMarketing.includes(pkg.id);
                      const newSelection = isSelected
                        ? roomData.selectedMarketing.filter(id => id !== pkg.id)
                        : [...roomData.selectedMarketing, pkg.id];
                      setRoomData({...roomData, selectedMarketing: newSelection});
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium text-sm">{pkg.name}</h5>
                            {roomData.selectedMarketing.includes(pkg.id) && (
                              <Badge className="bg-red-500 text-white text-xs">AKTIV</Badge>
                            )}
                          </div>
                          <div className="space-y-1">
                            {pkg.features.map((feature, index) => (
                              <div key={index} className="flex items-center text-xs text-muted-foreground">
                                <div className="h-1 w-1 bg-red-500 rounded-full mr-2" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="text-right ml-3">
                          <div className="font-bold">€{pkg.price}</div>
                          <div className="text-xs text-muted-foreground">{pkg.duration}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Summary */}
      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Crown className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800">Kostenübersicht</h3>
              <p className="text-sm text-yellow-700">
                Monatliche Kosten für deinen Premium-Room (jederzeit kündbar)
              </p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{subscriptionPlans.find(p => p.id === roomData.selectedPlan)?.name}</span>
              <span className="font-semibold">€{subscriptionPlans.find(p => p.id === roomData.selectedPlan)?.price}</span>
            </div>
            
            {roomData.selectedMarketing.length > 0 && (
              <div className="border-t pt-2 mt-2">
                <div className="text-purple-700 font-medium mb-1">Marketing Pakete:</div>
                {roomData.selectedMarketing.map(packageId => {
                  const pkg = marketingPackages.find(p => p.id === packageId);
                  return pkg ? (
                    <div key={pkg.id} className="flex justify-between text-purple-600 ml-4">
                      <span>+ {pkg.name}</span>
                      <span>€{pkg.price}/{pkg.duration === 'monatlich' ? 'Monat' : 'Event'}</span>
                    </div>
                  ) : null;
                })}
              </div>
            )}
            
            <div className="border-t pt-2 mt-3">
              <div className="flex justify-between items-center text-lg font-bold text-yellow-600">
                <span>Gesamt pro Monat:</span>
                <span>
                  €{(subscriptionPlans.find(p => p.id === roomData.selectedPlan)?.price || 25) + 
                    roomData.selectedMarketing.reduce((total, packageId) => {
                      const pkg = marketingPackages.find(p => p.id === packageId);
                      return total + (pkg ? pkg.price : 0);
                    }, 0)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Room Button */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t pt-4 -mx-6 px-6">
        <Button
          onClick={handleCreateRoom}
          className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold"
          disabled={!roomData.title || !roomData.description || !roomData.category}
        >
          <Crown className="h-5 w-5 mr-2" />
          Room Abo starten - €{(subscriptionPlans.find(p => p.id === roomData.selectedPlan)?.price || 25) + 
            roomData.selectedMarketing.reduce((total, packageId) => {
              const pkg = marketingPackages.find(p => p.id === packageId);
              return total + (pkg ? pkg.price : 0);
            }, 0)}/Monat
        </Button>
      </div>

      {/* Payment Flow */}
      {showPayment && selectedPaymentTier && (
        <PaymentFlow
          open={showPayment}
          onOpenChange={setShowPayment}
          type="room"
          item={selectedPaymentTier}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};