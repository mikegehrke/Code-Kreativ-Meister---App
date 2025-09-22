import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Crown, Star, Users, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { PaymentFlow } from "@/components/Payment/PaymentFlow";
import { useNavigate } from "react-router-dom";

interface PrivateRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hostName: string;
  hostAvatar: string;
  onPrivateRoomBooked?: (roomDetails: { roomId: string; hostName: string; packageType: string; duration: number }) => void;
}

const privateRoomPackages = [
  {
    id: "basic",
    name: "Privat Chat",
    duration: 10,
    price: 15,
    icon: "💬",
    features: [
      "10 Minuten privater Chat",
      "Text-Nachrichten",
      "Exklusiver Zugang"
    ]
  },
  {
    id: "premium",
    name: "VIP Experience",
    duration: 20,
    price: 25,
    icon: "⭐",
    features: [
      "20 Minuten VIP-Zeit",
      "Video & Audio Chat",
      "Prioritäts-Support",
      "Geschenke inklusive"
    ],
    popular: true
  },
  {
    id: "exclusive",
    name: "Royal Package",
    duration: 30,
    price: 40,
    icon: "👑",
    features: [
      "30 Minuten exklusive Zeit",
      "HD Video & Audio",
      "Persönliche Nachricht",
      "Premium Geschenke",
      "Aufzeichnung möglich"
    ]
  }
];

export const PrivateRoomDialog = ({ open, onOpenChange, hostName, hostAvatar, onPrivateRoomBooked }: PrivateRoomDialogProps) => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [message, setMessage] = useState("");

  const handleBookPrivateRoom = (pkg: any) => {
    setSelectedPackage(pkg);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    toast.success(`Privatraum mit ${hostName} gebucht!`);
    
    // Generate unique room ID
    const roomId = `private-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`Private room booked: ${selectedPackage.name} with ${hostName}`);
    console.log(`Message: ${message}`);
    console.log(`Room ID: ${roomId}`);
    
    // Reset and close dialog
    setSelectedPackage(null);
    setMessage("");
    setShowPayment(false);
    onOpenChange(false);
    
    // Call callback if provided
    onPrivateRoomBooked?.({
      roomId,
      hostName,
      packageType: selectedPackage.name,
      duration: selectedPackage.duration
    });
    
    // Navigate to private room
    navigate(`/private-chat/${roomId}`, {
      state: {
        hostName,
        hostAvatar,
        packageType: selectedPackage.name,
        duration: selectedPackage.duration,
        message,
        isPrivate: true
      }
    });
  };

  return (
    <>
      <Dialog open={open && !showPayment} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg w-[92vw] max-h-[85svh] overflow-y-auto" style={{ maxHeight: '85svh', paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Privatraum mit {hostName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Host Info */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <img 
                src={hostAvatar} 
                alt={hostName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{hostName}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Live Creator
                </p>
              </div>
              <Badge variant="secondary">
                <Star className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </div>

            {/* Packages */}
            <div className="space-y-3">
              <h4 className="font-medium">Paket wählen</h4>
              {privateRoomPackages.map((pkg) => (
                <Card 
                  key={pkg.id}
                  className={`cursor-pointer transition-all hover:shadow-md relative ${
                    pkg.popular ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleBookPrivateRoom(pkg)}
                >
                  {pkg.popular && (
                    <Badge className="absolute -top-2 right-2 bg-primary">
                      Beliebt
                    </Badge>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{pkg.icon}</span>
                          <h3 className="font-semibold">{pkg.name}</h3>
                        </div>
                        <ul className="space-y-1">
                          {pkg.features.map((feature, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className="w-1 h-1 bg-primary rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-bold text-xl">{pkg.price}€</div>
                        <div className="text-sm text-muted-foreground">
                          {pkg.duration} Minuten
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Personal Message */}
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Persönliche Nachricht (optional)
              </h4>
              <Textarea
                placeholder={`Hallo ${hostName}, ich würde gerne...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={200}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {message.length}/200 Zeichen
              </p>
            </div>

            {/* Info */}
            <div className="p-3 bg-primary/10 rounded-lg">
              <p className="text-sm font-medium mb-1">Was passiert als nächstes?</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Nach der Zahlung wird ein privater Raum erstellt</li>
                <li>• Du und {hostName} erhalten eine Benachrichtigung</li>
                <li>• Der Timer startet wenn beide online sind</li>
              </ul>
            </div>

            {/* Cancel Button - Fixed at Bottom */}
            <div className="sticky bottom-0 left-0 right-0 pt-2 bg-gradient-to-t from-background via-background/95 to-transparent" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full"
              >
                Abbrechen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedPackage && (
        <PaymentFlow
          open={showPayment}
          onOpenChange={setShowPayment}
          type="room"
          item={{
            id: selectedPackage.id,
            name: `${selectedPackage.name} mit ${hostName}`,
            price: selectedPackage.price,
            currency: "EUR",
            duration: selectedPackage.duration,
            description: `${selectedPackage.duration} Minuten privater Raum mit ${hostName}`,
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};