import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Zap,
  CreditCard,
  Smartphone,
  Gift,
  Star,
  Crown,
  Sparkles,
  ShieldCheck
} from "lucide-react";

interface CoinPurchaseProps {
  currentBalance: number;
}

export const CoinPurchase = ({ currentBalance }: CoinPurchaseProps) => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isGift, setIsGift] = useState(false);
  const [giftRecipient, setGiftRecipient] = useState("");

  const coinPackages = [
    {
      id: "starter",
      name: "Starter Pack",
      coins: 500,
      price: 4.99,
      bonus: 0,
      popular: false,
      icon: Zap,
      color: "from-blue-400 to-blue-600",
      description: "Perfect for trying out tipping"
    },
    {
      id: "popular",
      name: "Popular Choice",
      coins: 1000,
      price: 9.99,
      bonus: 100,
      popular: true,
      icon: Star,
      color: "from-green-400 to-green-600",
      description: "Best value for regular users"
    },
    {
      id: "premium",
      name: "Premium Pack",
      coins: 2500,
      price: 19.99,
      bonus: 500,
      popular: false,
      icon: Crown,
      color: "from-purple-400 to-purple-600",
      description: "For the ultimate experience"
    },
    {
      id: "vip",
      name: "VIP Bundle",
      coins: 5000,
      price: 39.99,
      bonus: 1500,
      popular: false,
      icon: Sparkles,
      color: "from-yellow-400 to-orange-500",
      description: "Maximum coins, maximum fun"
    }
  ];

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, American Express"
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: ShieldCheck,
      description: "Pay with your PayPal account"
    },
    {
      id: "apple",
      name: "Apple Pay",
      icon: Smartphone,
      description: "Quick payment with Touch ID"
    },
    {
      id: "google",
      name: "Google Pay",
      icon: Smartphone,
      description: "Pay with Google account"
    }
  ];

  const selectedPackageData = selectedPackage 
    ? coinPackages.find(pkg => pkg.id === selectedPackage)
    : null;

  const calculateTotal = () => {
    if (selectedPackageData) {
      return {
        coins: selectedPackageData.coins + selectedPackageData.bonus,
        price: selectedPackageData.price
      };
    }
    
    if (customAmount) {
      const amount = parseFloat(customAmount);
      const coins = Math.floor(amount * 100); // 1€ = 100 coins
      const bonus = amount >= 20 ? Math.floor(coins * 0.2) : 0; // 20% bonus for 20€+
      return {
        coins: coins + bonus,
        price: amount
      };
    }
    
    return { coins: 0, price: 0 };
  };

  const total = calculateTotal();

  const handlePurchase = () => {
    // Integrate with Stripe or other payment processor
    console.log("Processing payment:", {
      selectedPackage,
      customAmount,
      paymentMethod,
      isGift,
      giftRecipient,
      total
    });
    
    // Mock payment processing
    alert(`Processing payment of €${total.price} for ${total.coins} coins`);
  };

  return (
    <div className="space-y-6">
      {/* Current Balance */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Current Balance</h3>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold">{currentBalance.toLocaleString()}</span>
                <span className="text-muted-foreground">coins</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Equivalent to</p>
              <p className="text-lg font-semibold">€{(currentBalance / 100).toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coin Packages */}
      <div>
        <h3 className="text-xl font-bold mb-4">Choose a Coin Package</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {coinPackages.map((pkg) => {
            const IconComponent = pkg.icon;
            const isSelected = selectedPackage === pkg.id;
            
            return (
              <Card
                key={pkg.id}
                className={`cursor-pointer transition-all duration-200 relative overflow-hidden ${
                  isSelected 
                    ? 'ring-2 ring-primary shadow-lg' 
                    : 'hover:shadow-md hover:scale-105'
                } ${pkg.popular ? 'border-primary' : ''}`}
                onClick={() => {
                  setSelectedPackage(pkg.id);
                  setCustomAmount("");
                }}
              >
                {pkg.popular && (
                  <Badge className="absolute top-2 right-2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-2">
                  <div className={`h-12 w-12 rounded-full bg-gradient-to-r ${pkg.color} flex items-center justify-center mx-auto mb-2`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="text-center">
                  <div className="mb-4">
                    <div className="text-3xl font-bold">{pkg.coins.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">coins</div>
                    {pkg.bonus > 0 && (
                      <Badge variant="secondary" className="mt-1">
                        +{pkg.bonus} bonus
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-2xl font-bold text-primary mb-2">
                    €{pkg.price}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {(pkg.coins / pkg.price).toFixed(0)} coins per €1
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Custom Amount */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Amount</CardTitle>
          <CardDescription>
            Enter a custom amount (minimum €5, maximum €500)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="custom-amount">Amount in EUR</Label>
              <Input
                id="custom-amount"
                type="number"
                min="5"
                max="500"
                step="0.01"
                placeholder="Enter amount..."
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedPackage(null);
                }}
                className="text-lg"
              />
            </div>
            
            {customAmount && parseFloat(customAmount) >= 5 && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">You will receive:</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-lg font-bold">
                        {Math.floor(parseFloat(customAmount) * 100).toLocaleString()} coins
                      </span>
                    </div>
                  </div>
                  {parseFloat(customAmount) >= 20 && (
                    <Badge className="bg-green-500">
                      +{Math.floor(parseFloat(customAmount) * 20)} bonus
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gift Option */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="h-5 w-5 text-pink-500" />
            <span>Send as Gift</span>
          </CardTitle>
          <CardDescription>
            Send coins to another user as a gift
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="gift-toggle"
                checked={isGift}
                onChange={(e) => setIsGift(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="gift-toggle">Send as gift</Label>
            </div>
            
            {isGift && (
              <div>
                <Label htmlFor="gift-recipient">Recipient username</Label>
                <Input
                  id="gift-recipient"
                  placeholder="@username"
                  value={giftRecipient}
                  onChange={(e) => setGiftRecipient(e.target.value)}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>
            Choose your preferred payment method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <SelectItem key={method.id} value={method.id}>
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {method.description}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Purchase Summary */}
      {total.price > 0 && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Purchase Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Coins</span>
                <span className="font-medium">{total.coins.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Price</span>
                <span className="font-medium">€{total.price.toFixed(2)}</span>
              </div>
              {isGift && (
                <div className="flex justify-between">
                  <span>Recipient</span>
                  <span className="font-medium">{giftRecipient || "Not specified"}</span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-xl font-bold text-primary">
                    €{total.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <Button
              className="w-full mt-6 bg-gradient-to-r from-primary to-accent hover:shadow-glow"
              size="lg"
              onClick={handlePurchase}
              disabled={total.price === 0 || (isGift && !giftRecipient)}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              {isGift ? "Send Gift" : "Purchase Coins"}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center mt-2">
              Secure payment powered by Stripe. Your payment information is encrypted and secure.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};