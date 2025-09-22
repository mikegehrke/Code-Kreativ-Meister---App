import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Lock, Ticket, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venue: {
    name: string;
    price: number;
    currency: string;
  };
  onSuccess: () => void;
}

export const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  onOpenChange,
  venue,
  onSuccess,
}) => {
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardHolder) {
      toast({
        title: "Fehlende Daten",
        description: "Bitte füllen Sie alle Felder aus.",
        variant: "destructive",
      });
      return;
    }

    setPaymentStep('processing');

    // Simulate payment processing
    setTimeout(() => {
      setPaymentStep('success');
      toast({
        title: "Zahlung erfolgreich",
        description: `Buchung für ${venue.name} bestätigt!`,
      });
      
      setTimeout(() => {
        onSuccess();
        onOpenChange(false);
        // Reset form after dialog closes
        setTimeout(() => {
          setPaymentStep('form');
          setFormData({
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            cardHolder: '',
          });
        }, 300);
      }, 2000);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Venue Entry - {venue.name}
          </DialogTitle>
        </DialogHeader>

        {paymentStep === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Eintritt</span>
                  <span className="text-2xl">{venue.currency}{venue.price}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Einmalige Zahlung für den Venue-Eintritt
                </p>
              </CardContent>
            </Card>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                Sichere Zahlung mit Stripe
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="cardHolder">Karteninhaber</Label>
                  <Input
                    id="cardHolder"
                    placeholder="Max Mustermann"
                    value={formData.cardHolder}
                    onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="cardNumber">Kartennummer</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                      maxLength={19}
                    />
                    <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expiryDate">Ablaufdatum</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent">
                <Lock className="h-4 w-4 mr-2" />
                Jetzt bezahlen {venue.currency}{venue.price}
              </Button>
            </div>
          </form>
        )}

        {paymentStep === 'processing' && (
          <div className="text-center py-8 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <h3 className="text-lg font-semibold">Zahlung wird verarbeitet...</h3>
            <p className="text-sm text-muted-foreground">
              Bitte warten Sie einen Moment
            </p>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold text-green-600">Zahlung erfolgreich!</h3>
            <p className="text-sm text-muted-foreground">
              Ihre Buchung für {venue.name} wurde bestätigt.
            </p>
            <div className="bg-muted rounded-lg p-4 text-left">
              <h4 className="font-semibold mb-2">Buchungsdetails</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Venue:</span>
                  <span>{venue.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Betrag:</span>
                  <span>{venue.currency}{venue.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-green-600">Bestätigt</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};