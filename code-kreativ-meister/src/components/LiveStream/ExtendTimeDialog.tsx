import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Timer, Zap } from "lucide-react";
import { toast } from "sonner";
import { PaymentFlow } from "@/components/Payment/PaymentFlow";

interface ExtendTimeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTimeLeft: number; // in minutes
  eventName: string;
}

const timeExtensions = [
  { 
    minutes: 5, 
    price: 5, 
    icon: "⏰", 
    label: "Kurz verlängern",
    popular: false
  },
  { 
    minutes: 10, 
    price: 8, 
    icon: "⏱️", 
    label: "Standard verlängern",
    popular: true
  },
  { 
    minutes: 15, 
    price: 12, 
    icon: "⏲️", 
    label: "Lange verlängern",
    popular: false
  },
  { 
    minutes: 30, 
    price: 20, 
    icon: "🕐", 
    label: "Premium verlängern",
    popular: false
  },
];

export const ExtendTimeDialog = ({ open, onOpenChange, currentTimeLeft, eventName }: ExtendTimeDialogProps) => {
  const [selectedExtension, setSelectedExtension] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleExtendTime = (extension: any) => {
    setSelectedExtension(extension);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    toast.success(`Zeit um ${selectedExtension.minutes} Minuten verlängert!`);
    
    // Here you would update the actual event time
    console.log(`Extended time by ${selectedExtension.minutes} minutes for event: ${eventName}`);
    
    setSelectedExtension(null);
    setShowPayment(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open && !showPayment} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Zeit verlängern
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Current Time Info */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Verbleibende Zeit:</span>
              </div>
              <Badge variant="outline">
                {currentTimeLeft} Min
              </Badge>
            </div>

            <div className="text-center">
              <h3 className="font-semibold mb-1">{eventName}</h3>
              <p className="text-sm text-muted-foreground">
                Verlängere deine Zeit im Event
              </p>
            </div>

            {/* Time Extension Options */}
            <div className="space-y-3">
              {timeExtensions.map((extension) => (
                <Card 
                  key={extension.minutes}
                  className={`cursor-pointer transition-all hover:shadow-md relative ${
                    extension.popular ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleExtendTime(extension)}
                >
                  {extension.popular && (
                    <Badge className="absolute -top-2 right-2 bg-primary">
                      Beliebt
                    </Badge>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{extension.icon}</div>
                        <div>
                          <h3 className="font-semibold">+{extension.minutes} Minuten</h3>
                          <p className="text-sm text-muted-foreground">
                            {extension.label}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{extension.price}€</div>
                        <div className="text-xs text-muted-foreground">
                          {(extension.price / extension.minutes).toFixed(1)}€/Min
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Info */}
            <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
              <Zap className="h-4 w-4 text-primary" />
              <p className="text-sm">
                Die Zeit wird sofort nach der Zahlung hinzugefügt
              </p>
            </div>

            {/* Cancel */}
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Abbrechen
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {selectedExtension && (
        <PaymentFlow
          open={showPayment}
          onOpenChange={setShowPayment}
          type="ticket"
          item={{
            id: `extend-${selectedExtension.minutes}`,
            name: `Zeit verlängern (+${selectedExtension.minutes} Min)`,
            price: selectedExtension.price,
            currency: "EUR",
            description: `${selectedExtension.minutes} Minuten zusätzliche Zeit für ${eventName}`,
            duration: selectedExtension.minutes,
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};