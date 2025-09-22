import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CreditCard, 
  Smartphone, 
  Euro, 
  Shield, 
  Download, 
  QrCode,
  Check,
  Copy,
  Share,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface PaymentFlowProps {
  type: "room" | "ticket";
  item: {
    id: string;
    name: string;
    price: number;
    currency: string;
    duration?: number;
    image?: string;
    description?: string;
  };
  onSuccess?: (ticketCode?: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const paymentMethods = [
  { id: "card", name: "Kreditkarte", icon: CreditCard, description: "Visa, Mastercard, Amex" },
  { id: "paypal", name: "PayPal", icon: Euro, description: "Schnell & sicher" },
  { id: "apple", name: "Apple Pay", icon: Smartphone, description: "Touch ID" },
  { id: "google", name: "Google Pay", icon: Smartphone, description: "Schnelle Zahlung" },
];

export const PaymentFlow = ({ type, item, onSuccess, open, onOpenChange }: PaymentFlowProps) => {
  const [step, setStep] = useState<"payment" | "processing" | "success" | "error">("payment");
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [ticketCode, setTicketCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    cardHolder: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const validatePayment = () => {
    if (selectedPayment === "card") {
      if (!paymentData.cardNumber || paymentData.cardNumber.length < 16) {
        return "Bitte geben Sie eine gültige Kartennummer ein";
      }
      if (!paymentData.expiryDate || !paymentData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
        return "Bitte geben Sie ein gültiges Ablaufdatum ein (MM/YY)";
      }
      if (!paymentData.cvc || paymentData.cvc.length < 3) {
        return "Bitte geben Sie eine gültige CVC ein";
      }
      if (!paymentData.cardHolder || paymentData.cardHolder.length < 2) {
        return "Bitte geben Sie den Karteninhaber ein";
      }
    }
    return null;
  };

  const handlePayment = async () => {
    // Validate payment data only for Kreditkarte
    if (selectedPayment === "card") {
      const validationError = validatePayment();
      if (validationError) {
        setErrorMessage(validationError);
        setStep("error");
        return;
      }
    }

    setStep("processing");
    setErrorMessage("");
    
    // Simulate payment processing with validation
    setTimeout(() => {
      // Simulate payment success/failure (90% success rate for demo)
      const paymentSuccess = Math.random() > 0.1;
      
      if (paymentSuccess) {
        const generatedCode = `TIX${Date.now().toString().slice(-6)}`;
        const qrUrl = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${generatedCode}`;
        
        setTicketCode(generatedCode);
        setQrCodeUrl(qrUrl);
        setStep("success");
        
        toast.success(type === "room" ? "Room erfolgreich gebucht!" : "Ticket erfolgreich gekauft!");
        onSuccess?.(generatedCode);
      } else {
        setErrorMessage("Zahlung fehlgeschlagen. Bitte überprüfen Sie Ihre Zahlungsdaten und versuchen Sie es erneut.");
        setStep("error");
        toast.error("Zahlung fehlgeschlagen!");
      }
    }, 3000);
  };

  const copyTicketCode = () => {
    navigator.clipboard.writeText(ticketCode);
    toast.success("Ticket-Code kopiert!");
  };

  const downloadTicket = () => {
    // Create a downloadable ticket
    const ticketData = {
      code: ticketCode,
      item: item.name,
      price: `${item.currency}${item.price}`,
      date: new Date().toLocaleDateString(),
      qr: qrCodeUrl
    };
    
    const dataStr = JSON.stringify(ticketData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `ticket-${ticketCode}.json`;
    link.click();
    
    toast.success("Ticket heruntergeladen!");
  };

  const shareTicket = () => {
    if (navigator.share) {
      navigator.share({
        title: `Ticket: ${item.name}`,
        text: `Mein Ticket-Code: ${ticketCode}`,
        url: window.location.href
      });
    } else {
      copyTicketCode();
    }
  };

  if (step === "error") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center gap-3 mb-4 p-6 pb-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setStep("payment");
                setErrorMessage("");
              }}
              className="h-10 w-10 border shadow-sm hover:bg-accent"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 text-center font-semibold">Zahlung fehlgeschlagen</div>
            <div className="w-10" />
          </div>
          <div className="text-center py-8 px-6">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-red-600">Zahlung fehlgeschlagen</h3>
            <p className="text-muted-foreground mb-4">{errorMessage}</p>
            <Button onClick={() => {
              setStep("payment");
              setErrorMessage("");
            }} className="w-full">
              Erneut versuchen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === "processing") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center gap-3 mb-4 p-6 pb-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setStep("payment");
              }}
              className="h-10 w-10 border shadow-sm hover:bg-accent"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 text-center font-semibold">Zahlung verarbeiten</div>
            <div className="w-10" /> {/* Spacer */}
          </div>
          <div className="text-center py-8 px-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Zahlung wird verarbeitet...</h3>
            <p className="text-muted-foreground">Bitte warten Sie einen Moment</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === "success") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-10 w-10 border shadow-sm hover:bg-accent"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center justify-center flex-1">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="w-10" /> {/* Spacer */}
            </div>
            <DialogTitle className="text-center">
              {type === "room" ? "Room gebucht!" : "Ticket erhalten!"}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[70vh] px-6">
            <div className="space-y-6 pb-6">
            {/* Ticket Details */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
              <CardContent className="p-4">
                <div className="text-center mb-4">
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-muted-foreground">{item.currency}{item.price}</p>
                </div>
                
                {/* QR Code */}
                <div className="flex justify-center mb-4">
                  <img src={qrCodeUrl} alt="QR Code" className="h-32 w-32" />
                </div>
                
                {/* Ticket Code */}
                <div className="bg-white/50 rounded-lg p-3 text-center">
                  <Label className="text-xs text-muted-foreground">Ticket-Code</Label>
                  <div className="font-mono text-lg font-bold tracking-wider">
                    {ticketCode}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Actions */}
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={copyTicketCode}>
                <Copy className="h-4 w-4 mr-1" />
                Kopieren
              </Button>
              <Button variant="outline" size="sm" onClick={downloadTicket}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={shareTicket}>
                <Share className="h-4 w-4 mr-1" />
                Teilen
              </Button>
            </div>
            
            <div className="space-y-2">
              {type === "room" ? (
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-accent"
                  onClick={() => {
                    onOpenChange(false);
                    navigate('/go-live', { 
                      state: { 
                        bookedRoom: { ...item, ticketCode },
                        isRoomBooked: true,
                        paid: true
                      } 
                    });
                  }}
                >
                  Jetzt Live gehen
                </Button>
              ) : (
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-accent"
                  onClick={() => {
                    onOpenChange(false);
                    navigate(`/event/${item.id}/live`, {
                      state: {
                        event: { id: item.id, name: item.name, dj: "Host" },
                        ticketCode
                      }
                    });
                  }}
                >
                  Room betreten
                </Button>
              )}
              
              <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                Schließen
              </Button>
            </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }

  const isCardValid = paymentData.cardNumber.replace(/\s/g, '').length >= 16 
    && /^\d{2}\/\d{2}$/.test(paymentData.expiryDate)
    && paymentData.cvc.length >= 3
    && paymentData.cardHolder.length >= 2;
  const isPayDisabled = selectedPayment === 'card' && !isCardValid;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-10 w-10 border shadow-sm hover:bg-accent"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <DialogTitle className="flex-1 text-center">
              {type === "room" ? "Room buchen" : "Ticket kaufen"}
            </DialogTitle>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] px-6">
          <div className="space-y-6 pb-6">
          {/* Item Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold">{item.name}</h4>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                  {item.duration && (
                    <Badge variant="secondary" className="mt-2">
                      {item.duration}h Zugang
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{item.currency}{item.price}</div>
                  {type === "room" && item.duration && (
                    <div className="text-sm text-muted-foreground">pro {item.duration}h</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Zahlungsmethode wählen</Label>
            <div className="grid grid-cols-1 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <Card 
                    key={method.id}
                    className={`cursor-pointer transition-colors ${
                      selectedPayment === method.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className={`h-4 w-4 rounded-full border-2 ${
                        selectedPayment === method.id ? 'border-primary bg-primary' : 'border-muted-foreground'
                      }`}>
                        {selectedPayment === method.id && (
                          <div className="h-full w-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <Icon className="h-5 w-5" />
                      <div className="flex-1">
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-muted-foreground">{method.description}</div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Card Details (if card selected) */}
          {selectedPayment === "card" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Kartennummer</Label>
                  <Input 
                    placeholder="1234 5678 9012 3456" 
                    value={paymentData.cardNumber}
                    onChange={(e) => setPaymentData(prev => ({...prev, cardNumber: e.target.value}))}
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Ablaufdatum</Label>
                    <Input 
                      placeholder="MM/YY" 
                      value={paymentData.expiryDate}
                      onChange={(e) => setPaymentData(prev => ({...prev, expiryDate: e.target.value}))}
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label>CVC</Label>
                    <Input 
                      placeholder="123" 
                      value={paymentData.cvc}
                      onChange={(e) => setPaymentData(prev => ({...prev, cvc: e.target.value}))}
                      maxLength={4}
                    />
                  </div>
                </div>
                <div>
                  <Label>Karteninhaber</Label>
                  <Input 
                    placeholder="Max Mustermann" 
                    value={paymentData.cardHolder}
                    onChange={(e) => setPaymentData(prev => ({...prev, cardHolder: e.target.value}))}
                  />
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Total & Pay Button */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Gesamt</span>
              <span>{item.currency}{item.price}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              Sichere Zahlung mit SSL-Verschlüsselung
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-primary to-accent"
              onClick={handlePayment}
              disabled={isPayDisabled}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Jetzt bezahlen - {item.currency}{item.price}
            </Button>
          </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};