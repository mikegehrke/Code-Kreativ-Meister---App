import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, Star, ArrowRight, Check } from "lucide-react";
import { PaymentFlow } from "@/components/Payment/PaymentFlow";
import { MarketingVideoUpload } from "./MarketingVideoUpload";
import { MarketingDashboard } from "./MarketingDashboard";

interface MarketingPackage {
  type: string;
  name: string;
  price: number;
  budget: number;
  features: string[];
  description: string;
  icon: React.ReactNode;
  popular?: boolean;
}

export function MarketingFlow() {
  const [currentStep, setCurrentStep] = useState<'select' | 'payment' | 'upload' | 'dashboard'>('select');
  const [selectedPackage, setSelectedPackage] = useState<MarketingPackage | null>(null);

  const marketingPackages: MarketingPackage[] = [
    {
      type: 'for_you_boost',
      name: 'For You Video Boost',
      price: 20,
      budget: 50,
      description: 'Bringe dein Video in die For You Feeds und erreiche mehr Zuschauer',
      icon: <TrendingUp className="h-6 w-6" />,
      features: [
        'Platzierung in For You Algorithmus',
        'Zielgruppen-Targeting',
        '2-3 Tage Laufzeit',
        'Basic Analytics',
        'Bis zu 5.000 Views garantiert'
      ]
    },
    {
      type: 'video_campaign',
      name: 'Video Werbekampagne',
      price: 35,
      budget: 100,
      description: 'Professionelle Werbekampagne mit erweiterten Targeting-Optionen',
      icon: <Zap className="h-6 w-6" />,
      popular: true,
      features: [
        'Premium Targeting & Demographics',
        'Cross-Platform Bewerbung', 
        '5-7 Tage Laufzeit',
        'Erweiterte Analytics',
        'Bis zu 15.000 Views garantiert',
        'A/B Testing verfügbar'
      ]
    },
    {
      type: 'viral_package',
      name: 'Viral Video Paket',
      price: 75,
      budget: 200,
      description: 'Maximale Reichweite mit Viral-Potential und Premium-Features',
      icon: <Star className="h-6 w-6" />,
      features: [
        'Viral-Optimierung & Trending Boost',
        'Multi-Platform Distribution',
        '10-14 Tage Laufzeit',
        'Premium Analytics & Reports',
        'Bis zu 50.000 Views garantiert',
        'Influencer Network Integration',
        'Priority Support'
      ]
    }
  ];

  const handlePackageSelect = (pkg: MarketingPackage) => {
    setSelectedPackage(pkg);
    setCurrentStep('payment');
  };

  const handlePaymentSuccess = () => {
    setCurrentStep('upload');
  };

  const handleUploadComplete = () => {
    setCurrentStep('dashboard');
  };

  if (currentStep === 'payment' && selectedPackage) {
    return (
      <PaymentFlow
        type="ticket"
        item={{
          id: selectedPackage.type,
          name: selectedPackage.name,
          description: selectedPackage.description,
          price: selectedPackage.price,
          currency: "€"
        }}
        onSuccess={handlePaymentSuccess}
        open={true}
        onOpenChange={(open) => {
          if (!open) setCurrentStep('select');
        }}
      />
    );
  }

  if (currentStep === 'upload' && selectedPackage) {
    return (
      <MarketingVideoUpload
        selectedPackage={selectedPackage}
        onUploadComplete={handleUploadComplete}
        onBack={() => setCurrentStep('select')}
      />
    );
  }

  if (currentStep === 'dashboard') {
    return <MarketingDashboard />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Video Marketing Pakete</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Booste deine Videos mit unseren professionellen Marketing-Paketen und erreiche deine Zielgruppe
        </p>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {marketingPackages.map((pkg) => (
          <Card 
            key={pkg.type} 
            className={`relative transition-all duration-200 hover:shadow-lg ${
              pkg.popular ? 'ring-2 ring-primary shadow-lg scale-105' : ''
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-3 py-1">
                  Beliebteste Wahl
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  {pkg.icon}
                </div>
              </div>
              <CardTitle className="text-xl">{pkg.name}</CardTitle>
              <CardDescription className="text-sm">
                {pkg.description}
              </CardDescription>
              <div className="pt-4">
                <div className="text-3xl font-bold">€{pkg.price}</div>
                <div className="text-sm text-muted-foreground">
                  Werbe-Budget: €{pkg.budget}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className="w-full"
                onClick={() => handlePackageSelect(pkg)}
                variant={pkg.popular ? "default" : "outline"}
              >
                Paket auswählen
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Professionelle Bewerbung</h3>
              <p className="text-sm text-muted-foreground">
                Deine Videos werden professionell in den relevanten Zielgruppen beworben
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">24h Review-Prozess</h3>
              <p className="text-sm text-muted-foreground">
                Alle Videos werden binnen 24 Stunden überprüft und freigegeben
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Detaillierte Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Verfolge Views, Likes, Follower-Wachstum und Engagement in Echtzeit
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}