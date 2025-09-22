import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PaymentFlow } from "@/components/Payment/PaymentFlow";

interface GiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hostName: string;
}

const giftItems = [
  { 
    id: "rose", 
    name: "Rose", 
    price: 2, 
    icon: "🌹", 
    description: "Eine schöne Rose",
    animation: "fade-in"
  },
  { 
    id: "heart", 
    name: "Herz", 
    price: 5, 
    icon: "💖", 
    description: "Ein liebevolles Herz",
    animation: "bounce"
  },
  { 
    id: "diamond", 
    name: "Diamant", 
    price: 10, 
    icon: "💎", 
    description: "Ein funkelnder Diamant",
    animation: "sparkle"
  },
  { 
    id: "crown", 
    name: "Krone", 
    price: 20, 
    icon: "👑", 
    description: "Eine königliche Krone",
    animation: "royal"
  },
  { 
    id: "ferrari", 
    name: "Ferrari", 
    price: 50, 
    icon: "🏎️", 
    description: "Ein luxuriöser Sportwagen",
    animation: "zoom"
  },
  { 
    id: "yacht", 
    name: "Yacht", 
    price: 100, 
    icon: "🛥️", 
    description: "Eine elegante Yacht",
    animation: "wave"
  },
];

const drinkItems = [
  { 
    id: "coffee", 
    name: "Kaffee", 
    price: 3, 
    icon: "☕", 
    description: "Ein heißer Kaffee"
  },
  { 
    id: "cocktail", 
    name: "Cocktail", 
    price: 8, 
    icon: "🍹", 
    description: "Ein erfrischender Cocktail"
  },
  { 
    id: "champagne", 
    name: "Champagner", 
    price: 25, 
    icon: "🍾", 
    description: "Luxuriöser Champagner"
  },
  { 
    id: "wine", 
    name: "Wein", 
    price: 15, 
    icon: "🍷", 
    description: "Ein guter Wein"
  },
];

export const GiftDialog = ({ open, onOpenChange, hostName }: GiftDialogProps) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [activeTab, setActiveTab] = useState<"gifts" | "drinks">("gifts");

  const handleSendGift = (item: any) => {
    setSelectedItem(item);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    toast.success(`${selectedItem.name} an ${hostName} gesendet!`);
    
    // Add gift animation to chat (would be implemented with chat context)
    console.log(`Gift sent: ${selectedItem.name} to ${hostName}`);
    
    setSelectedItem(null);
    setShowPayment(false);
    onOpenChange(false);
  };

  const currentItems = activeTab === "gifts" ? giftItems : drinkItems;

  return (
    <>
      <Dialog open={open && !showPayment} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Geschenke & Getränke für {hostName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex gap-2">
              <Button
                variant={activeTab === "gifts" ? "default" : "outline"}
                onClick={() => setActiveTab("gifts")}
                className="flex-1"
              >
                <Gift className="h-4 w-4 mr-2" />
                Geschenke
              </Button>
              <Button
                variant={activeTab === "drinks" ? "default" : "outline"}
                onClick={() => setActiveTab("drinks")}
                className="flex-1"
              >
                🍹 Getränke
              </Button>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {currentItems.map((item) => (
                <Card 
                  key={item.id}
                  className="cursor-pointer hover:shadow-md transition-all hover:scale-105"
                  onClick={() => handleSendGift(item)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <h3 className="font-semibold mb-1">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {item.description}
                    </p>
                    <Badge variant="secondary" className="w-full">
                      {item.price}€
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Info */}
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground">
                Geschenke werden in der Live-Chat mit Animation angezeigt
              </p>
            </div>

            {/* Cancel */}
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Schließen
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {selectedItem && (
        <PaymentFlow
          open={showPayment}
          onOpenChange={setShowPayment}
          type="ticket"
          item={{
            id: selectedItem.id,
            name: `${selectedItem.name} für ${hostName}`,
            price: selectedItem.price,
            currency: "EUR",
            description: selectedItem.description,
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};