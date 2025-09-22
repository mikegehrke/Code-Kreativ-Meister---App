import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, Euro, Gift } from "lucide-react";
import { toast } from "sonner";
import { PaymentFlow } from "@/components/Payment/PaymentFlow";
import { useCreatorServices, type CreatorService } from "@/hooks/useCreatorServices";

interface TippingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hostName: string;
  hostAvatar: string;
  creatorUserId?: string; // New prop for dynamic pricing
}

const tipAmounts = [
  { amount: 1, icon: "💸", label: "Kleiner Tip" },
  { amount: 5, icon: "💰", label: "Netter Tip" },
  { amount: 10, icon: "🎉", label: "Großer Tip" },
  { amount: 20, icon: "🔥", label: "Super Tip" },
  { amount: 50, icon: "💎", label: "VIP Tip" },
  { amount: 100, icon: "👑", label: "König Tip" },
];

export const TippingDialog = ({ open, onOpenChange, hostName, hostAvatar, creatorUserId }: TippingDialogProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<CreatorService | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  
  // Load creator services dynamically
  const { services, loading } = useCreatorServices(creatorUserId);
  const tipServices = services.filter(service => service.service_type === 'tip' && service.is_active);

  const handleTip = () => {
    let amount = 0;
    let serviceName = "";

    if (selectedService) {
      amount = selectedService.price;
      serviceName = selectedService.service_name;
    } else if (customAmount) {
      amount = parseFloat(customAmount);
      serviceName = "Eigener Betrag";
    }
    
    if (!amount || amount < 1) {
      toast.error("Bitte wähle einen gültigen Betrag");
      return;
    }

    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    const amount = selectedService?.price || parseFloat(customAmount);
    toast.success(`${amount}€ Trinkgeld an ${hostName} gesendet!`);
    
    // Reset form
    setSelectedAmount(null);
    setSelectedService(null);
    setCustomAmount("");
    setMessage("");
    setShowPayment(false);
    onOpenChange(false);
  };

  const finalAmount = selectedService?.price || parseFloat(customAmount) || 0;

  return (
    <>
      <Dialog open={open && !showPayment} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md w-[92vw] max-h-[85svh] overflow-y-auto" style={{ maxHeight: '85svh', paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Trinkgeld für {hostName}
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
              <div>
                <h3 className="font-semibold">{hostName}</h3>
                <p className="text-sm text-muted-foreground">Live Creator</p>
              </div>
            </div>

            {/* Tip Amounts - Dynamic from Creator Services */}
            <div>
              <h4 className="font-medium mb-3">
                Betrag wählen 
                {loading && <span className="text-sm text-muted-foreground ml-2">(lädt...)</span>}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {tipServices.map((service) => (
                  <div
                    key={service.id}
                    className={`cursor-pointer transition-all duration-200 rounded-lg border-2 p-3 text-center hover:scale-105 ${
                      selectedService?.id === service.id 
                        ? 'ring-2 ring-primary bg-primary/10 border-primary' 
                        : 'border-muted hover:bg-muted/50 hover:border-primary/50'
                    }`}
                    onClick={() => {
                      setSelectedService(service);
                      setSelectedAmount(service.price);
                      setCustomAmount("");
                    }}
                  >
                    <div className="text-lg mb-1">{service.icon}</div>
                    <div className="font-semibold">{service.price}€</div>
                    <div className="text-xs text-muted-foreground">{service.service_name}</div>
                  </div>
                ))}
              </div>
              
              {tipServices.length === 0 && !loading && (
                <div className="text-center py-4 text-muted-foreground">
                  <p>Dieser Creator hat noch keine Tip-Preise festgelegt.</p>
                  <p className="text-sm">Verwende den eigenen Betrag unten.</p>
                </div>
              )}
            </div>

            {/* Custom Amount */}
            <div>
              <h4 className="font-medium mb-2">Oder eigener Betrag</h4>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="0"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                    setSelectedService(null);
                  }}
                  className="pl-10"
                  min="1"
                  step="0.50"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <h4 className="font-medium mb-2">Nachricht (optional)</h4>
              <Input
                placeholder={`Dank dir ${hostName}! 🎉`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={100}
              />
            </div>

            {/* Total */}
            {finalAmount > 0 && (
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <span className="font-medium">Gesamt:</span>
                <Badge variant="secondary" className="text-lg">
                  {finalAmount.toFixed(2)}€
                </Badge>
              </div>
            )}

            {/* Actions */}
            <div className="sticky bottom-0 left-0 right-0 pt-2 bg-gradient-to-t from-background via-background/95 to-transparent" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Abbrechen
                </Button>
                <Button
                  onClick={handleTip}
                  disabled={finalAmount < 1}
                  className="flex-1"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  Tip senden
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PaymentFlow
        open={showPayment}
        onOpenChange={setShowPayment}
        type="ticket"
        item={{
          id: `tip-${Date.now()}`,
          name: `Trinkgeld für ${hostName}`,
          price: finalAmount,
          currency: "EUR",
          description: message || `Tip für ${hostName}`,
        }}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};