import React, { createContext, useContext, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Crown, 
  Star, 
  Zap, 
  Gift, 
  Check, 
  X, 
  Loader2,
  Shield,
  Lock,
  Smartphone,
  Globe,
  Users,
  Video,
  MessageCircle,
  Filter,
  Download,
  Upload,
  Clock,
  Infinity,
  TrendingUp,
  Award,
  Heart,
  Eye,
  Share,
  Music,
  Palette,
  Wand2,
  Camera,
  Mic,
  Settings,
  BarChart3,
  DollarSign,
  Coins
} from 'lucide-react';
import { toast } from 'sonner';

// Stripe types (in real implementation, use @stripe/stripe-js)
interface StripeConfig {
  publishableKey: string;
  secretKey?: string; // Only for server-side
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

interface Subscription {
  id: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

interface PaymentContextType {
  isConfigured: boolean;
  isLoading: boolean;
  subscription: Subscription | null;
  paymentMethods: PaymentMethod[];
  configure: (config: StripeConfig) => Promise<void>;
  subscribe: (planId: string, paymentMethodId?: string) => Promise<boolean>;
  cancelSubscription: () => Promise<boolean>;
  addPaymentMethod: (paymentMethod: Omit<PaymentMethod, 'id'>) => Promise<boolean>;
  removePaymentMethod: (id: string) => Promise<boolean>;
  setDefaultPaymentMethod: (id: string) => Promise<boolean>;
  purchaseCredits: (amount: number, paymentMethodId?: string) => Promise<boolean>;
  sendGift: (recipientId: string, giftId: string, paymentMethodId?: string) => Promise<boolean>;
}

const PaymentContext = createContext<PaymentContextType | null>(null);

// Subscription plans
const subscriptionPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'EUR',
    interval: 'month',
    features: [
      'Bis zu 5 Minuten Videos',
      'Grundlegende Filter',
      'Standard-Chat',
      'Basis-Funktionen',
      'Community-Support'
    ],
    limits: {
      videoLength: 300, // 5 minutes
      videosPerDay: 10,
      storageGB: 1,
      filters: 'basic',
      chatFeatures: 'basic'
    },
    color: 'gray',
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    currency: 'EUR',
    interval: 'month',
    features: [
      'Bis zu 30 Minuten Videos',
      'Alle Filter & Effekte',
      'Erweiterte Chat-Features',
      'HD-Export (1080p)',
      'Prioritäts-Support',
      'Keine Werbung',
      'Duett & Stitch',
      'Voice Messages'
    ],
    limits: {
      videoLength: 1800, // 30 minutes
      videosPerDay: 100,
      storageGB: 50,
      filters: 'premium',
      chatFeatures: 'premium'
    },
    color: 'blue',
    popular: true
  },
  {
    id: 'creator',
    name: 'Creator',
    price: 19.99,
    currency: 'EUR',
    interval: 'month',
    features: [
      'Bis zu 60 Minuten Videos',
      'Alle Premium-Features',
      'Erweiterte Analytics',
      '4K-Export',
      'Live-Streaming',
      'Monetarisierung',
      'API-Zugang',
      'Dedicated Support',
      'Custom Branding',
      'Advanced Video Editor'
    ],
    limits: {
      videoLength: 3600, // 60 minutes
      videosPerDay: 'unlimited',
      storageGB: 500,
      filters: 'all',
      chatFeatures: 'all'
    },
    color: 'purple',
    popular: false
  },
  {
    id: 'business',
    name: 'Business',
    price: 49.99,
    currency: 'EUR',
    interval: 'month',
    features: [
      'Alle Creator-Features',
      'Team-Management',
      'White-Label-Lösung',
      'Enterprise-Support',
      'Custom Integrations',
      'Advanced Security',
      'Bulk Operations',
      'Priority Processing',
      'Custom Analytics',
      'Dedicated Account Manager'
    ],
    limits: {
      videoLength: 'unlimited',
      videosPerDay: 'unlimited',
      storageGB: 'unlimited',
      filters: 'all',
      chatFeatures: 'all'
    },
    color: 'gold',
    popular: false
  }
];

// Credit packages
const creditPackages = [
  { id: 'credits_100', amount: 100, price: 0.99, bonus: 0 },
  { id: 'credits_500', amount: 500, price: 4.99, bonus: 50 },
  { id: 'credits_1000', amount: 1000, price: 9.99, bonus: 150 },
  { id: 'credits_2500', amount: 2500, price: 19.99, bonus: 500 },
  { id: 'credits_5000', amount: 5000, price: 39.99, bonus: 1250 },
  { id: 'credits_10000', amount: 10000, price: 79.99, bonus: 3000 }
];

// Gift options
const giftOptions = [
  { id: 'rose', name: 'Rose', emoji: '🌹', cost: 1, animation: 'bounce' },
  { id: 'heart', name: 'Herz', emoji: '❤️', cost: 5, animation: 'pulse' },
  { id: 'kiss', name: 'Kuss', emoji: '💋', cost: 10, animation: 'float' },
  { id: 'crown', name: 'Krone', emoji: '👑', cost: 25, animation: 'spin' },
  { id: 'diamond', name: 'Diamant', emoji: '💎', cost: 50, animation: 'sparkle' },
  { id: 'rocket', name: 'Rakete', emoji: '🚀', cost: 100, animation: 'fly' },
  { id: 'unicorn', name: 'Einhorn', emoji: '🦄', cost: 200, animation: 'rainbow' },
  { id: 'castle', name: 'Schloss', emoji: '🏰', cost: 500, animation: 'majestic' }
];

export const StripePaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stripeConfig, setStripeConfig] = useState<StripeConfig | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  // Check if Stripe is already configured (from localStorage or environment)
  useEffect(() => {
    const savedConfig = localStorage.getItem('stripe_config');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setStripeConfig(config);
        setIsConfigured(true);
      } catch (error) {
        console.error('Failed to parse saved Stripe config:', error);
      }
    }
    
    // Check for environment variable
    const envKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
    if (envKey && !savedConfig) {
      const config = { publishableKey: envKey };
      setStripeConfig(config);
      setIsConfigured(true);
    }
  }, []);

  const configure = async (config: StripeConfig): Promise<void> => {
    setIsLoading(true);
    try {
      // Validate the key format
      if (!config.publishableKey.startsWith('pk_')) {
        throw new Error('Invalid publishable key format');
      }
      
      // Save configuration
      setStripeConfig(config);
      localStorage.setItem('stripe_config', JSON.stringify(config));
      setIsConfigured(true);
      
      toast.success('Stripe erfolgreich konfiguriert!');
    } catch (error) {
      toast.error('Stripe-Konfiguration fehlgeschlagen');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const subscribe = async (planId: string, paymentMethodId?: string): Promise<boolean> => {
    if (!isConfigured) {
      toast.error('Stripe nicht konfiguriert');
      return false;
    }

    setIsLoading(true);
    try {
      // Mock subscription process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newSubscription: Subscription = {
        id: `sub_${Date.now()}`,
        planId,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        cancelAtPeriodEnd: false
      };
      
      setSubscription(newSubscription);
      toast.success('Abonnement erfolgreich abgeschlossen!');
      return true;
    } catch (error) {
      toast.error('Abonnement fehlgeschlagen');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async (): Promise<boolean> => {
    if (!subscription) return false;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscription(prev => prev ? { ...prev, cancelAtPeriodEnd: true } : null);
      toast.success('Abonnement gekündigt');
      return true;
    } catch (error) {
      toast.error('Kündigung fehlgeschlagen');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addPaymentMethod = async (paymentMethod: Omit<PaymentMethod, 'id'>): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPaymentMethod: PaymentMethod = {
        ...paymentMethod,
        id: `pm_${Date.now()}`
      };
      
      setPaymentMethods(prev => [...prev, newPaymentMethod]);
      toast.success('Zahlungsmethode hinzugefügt');
      return true;
    } catch (error) {
      toast.error('Hinzufügen fehlgeschlagen');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removePaymentMethod = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
      toast.success('Zahlungsmethode entfernt');
      return true;
    } catch (error) {
      toast.error('Entfernen fehlgeschlagen');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const setDefaultPaymentMethod = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPaymentMethods(prev => prev.map(pm => ({
        ...pm,
        isDefault: pm.id === id
      })));
      toast.success('Standard-Zahlungsmethode aktualisiert');
      return true;
    } catch (error) {
      toast.error('Aktualisierung fehlgeschlagen');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseCredits = async (amount: number, paymentMethodId?: string): Promise<boolean> => {
    if (!isConfigured) {
      toast.error('Stripe nicht konfiguriert');
      return false;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`${amount} Credits erfolgreich gekauft!`);
      return true;
    } catch (error) {
      toast.error('Credit-Kauf fehlgeschlagen');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendGift = async (recipientId: string, giftId: string, paymentMethodId?: string): Promise<boolean> => {
    if (!isConfigured) {
      toast.error('Stripe nicht konfiguriert');
      return false;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const gift = giftOptions.find(g => g.id === giftId);
      toast.success(`${gift?.name} ${gift?.emoji} erfolgreich gesendet!`);
      return true;
    } catch (error) {
      toast.error('Geschenk senden fehlgeschlagen');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: PaymentContextType = {
    isConfigured,
    isLoading,
    subscription,
    paymentMethods,
    configure,
    subscribe,
    cancelSubscription,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    purchaseCredits,
    sendGift
  };

  return (
    <PaymentContext.Provider value={contextValue}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within StripePaymentProvider');
  }
  return context;
};

// Stripe Configuration Component
export const StripeConfigDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [publishableKey, setPublishableKey] = useState('');
  const { configure, isLoading, isConfigured } = usePayment();

  const handleConfigure = async () => {
    if (!publishableKey.trim()) {
      toast.error('Bitte geben Sie einen gültigen Publishable Key ein');
      return;
    }

    try {
      await configure({ publishableKey: publishableKey.trim() });
      setIsOpen(false);
      setPublishableKey('');
    } catch (error) {
      // Error is handled in configure function
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={isConfigured ? "outline" : "default"} size="sm">
          <CreditCard className="h-4 w-4 mr-2" />
          {isConfigured ? 'Stripe konfiguriert' : 'Stripe konfigurieren'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Stripe konfigurieren</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Sicher & Einfach</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Geben Sie nur Ihren Stripe Publishable Key ein. Dieser ist öffentlich und sicher zu verwenden.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="publishable-key">Stripe Publishable Key</Label>
            <Input
              id="publishable-key"
              type="text"
              placeholder="pk_test_..."
              value={publishableKey}
              onChange={(e) => setPublishableKey(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Beginnt mit "pk_test_" (Test) oder "pk_live_" (Live)
            </p>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-2">Wo finde ich meinen Key?</h4>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Gehen Sie zu stripe.com und loggen Sie sich ein</li>
              <li>2. Navigieren Sie zu "Developers" → "API keys"</li>
              <li>3. Kopieren Sie den "Publishable key"</li>
            </ol>
          </div>
          
          <Button
            onClick={handleConfigure}
            disabled={isLoading || !publishableKey.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Konfiguriere...
              </>
            ) : (
              'Konfigurieren'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Subscription Plans Component
export const SubscriptionPlans: React.FC = () => {
  const { subscribe, subscription, isLoading } = usePayment();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    setSelectedPlan(planId);
    await subscribe(planId);
    setSelectedPlan(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {subscriptionPlans.map((plan) => (
        <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
          {plan.popular && (
            <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-500">
              Beliebt
            </Badge>
          )}
          
          <CardHeader className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
              plan.color === 'gray' ? 'bg-gray-100' :
              plan.color === 'blue' ? 'bg-blue-100' :
              plan.color === 'purple' ? 'bg-purple-100' :
              'bg-yellow-100'
            }`}>
              {plan.id === 'free' && <Users className="h-6 w-6 text-gray-600" />}
              {plan.id === 'premium' && <Star className="h-6 w-6 text-blue-600" />}
              {plan.id === 'creator' && <Crown className="h-6 w-6 text-purple-600" />}
              {plan.id === 'business' && <Award className="h-6 w-6 text-yellow-600" />}
            </div>
            
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <div className="text-3xl font-bold">
              {plan.price === 0 ? 'Kostenlos' : `€${plan.price}`}
              {plan.price > 0 && <span className="text-sm font-normal text-gray-500">/Monat</span>}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button
              onClick={() => handleSubscribe(plan.id)}
              disabled={isLoading || subscription?.planId === plan.id}
              className="w-full"
              variant={plan.id === 'free' ? 'outline' : 'default'}
            >
              {isLoading && selectedPlan === plan.id ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Abonniere...
                </>
              ) : subscription?.planId === plan.id ? (
                'Aktueller Plan'
              ) : plan.id === 'free' ? (
                'Kostenlos starten'
              ) : (
                'Abonnieren'
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Credit Purchase Component
export const CreditPurchase: React.FC = () => {
  const { purchaseCredits, isLoading } = usePayment();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const handlePurchase = async (packageData: typeof creditPackages[0]) => {
    setSelectedPackage(packageData.id);
    await purchaseCredits(packageData.amount + packageData.bonus);
    setSelectedPackage(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {creditPackages.map((pkg) => (
        <Card key={pkg.id} className="text-center">
          <CardHeader>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mb-4 mx-auto">
              <Coins className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle className="text-lg">
              {pkg.amount.toLocaleString()} Credits
            </CardTitle>
            {pkg.bonus > 0 && (
              <Badge variant="secondary" className="mx-auto">
                +{pkg.bonus} Bonus
              </Badge>
            )}
            <div className="text-2xl font-bold">€{pkg.price}</div>
          </CardHeader>
          
          <CardContent>
            <Button
              onClick={() => handlePurchase(pkg)}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading && selectedPackage === pkg.id ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Kaufe...
                </>
              ) : (
                'Kaufen'
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Gift Sending Component
export const GiftSender: React.FC<{ recipientId: string; onClose?: () => void }> = ({ 
  recipientId, 
  onClose 
}) => {
  const { sendGift, isLoading } = usePayment();
  const [selectedGift, setSelectedGift] = useState<string | null>(null);

  const handleSendGift = async (gift: typeof giftOptions[0]) => {
    setSelectedGift(gift.id);
    const success = await sendGift(recipientId, gift.id);
    if (success) {
      onClose?.();
    }
    setSelectedGift(null);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {giftOptions.map((gift) => (
        <button
          key={gift.id}
          onClick={() => handleSendGift(gift)}
          disabled={isLoading}
          className="flex flex-col items-center space-y-2 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors disabled:opacity-50"
        >
          <span className="text-3xl">{gift.emoji}</span>
          <span className="font-medium text-sm">{gift.name}</span>
          <span className="text-xs text-gray-500">{gift.cost} Credits</span>
          {isLoading && selectedGift === gift.id && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
        </button>
      ))}
    </div>
  );
};

// Payment Methods Management
export const PaymentMethodsManager: React.FC = () => {
  const { paymentMethods, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod, isLoading } = usePayment();
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const handleAddCard = async () => {
    if (!cardData.number || !cardData.expiry || !cardData.cvc || !cardData.name) {
      toast.error('Bitte füllen Sie alle Felder aus');
      return;
    }

    const success = await addPaymentMethod({
      type: 'card',
      last4: cardData.number.slice(-4),
      brand: 'visa', // Mock
      expiryMonth: parseInt(cardData.expiry.split('/')[0]),
      expiryYear: parseInt('20' + cardData.expiry.split('/')[1]),
      isDefault: paymentMethods.length === 0
    });

    if (success) {
      setShowAddCard(false);
      setCardData({ number: '', expiry: '', cvc: '', name: '' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Zahlungsmethoden</h3>
        <Button onClick={() => setShowAddCard(true)} size="sm">
          <CreditCard className="h-4 w-4 mr-2" />
          Karte hinzufügen
        </Button>
      </div>

      {paymentMethods.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Keine Zahlungsmethoden vorhanden</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <Card key={method.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">
                      {method.brand?.toUpperCase()} •••• {method.last4}
                    </div>
                    <div className="text-sm text-gray-500">
                      Läuft ab {method.expiryMonth?.toString().padStart(2, '0')}/{method.expiryYear}
                    </div>
                  </div>
                  {method.isDefault && (
                    <Badge variant="secondary">Standard</Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {!method.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDefaultPaymentMethod(method.id)}
                      disabled={isLoading}
                    >
                      Als Standard
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePaymentMethod(method.id)}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Card Dialog */}
      <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Kreditkarte hinzufügen</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Kartennummer</Label>
              <Input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardData.number}
                onChange={(e) => setCardData(prev => ({ ...prev, number: e.target.value }))}
                maxLength={19}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Gültig bis</Label>
                <Input
                  type="text"
                  placeholder="MM/YY"
                  value={cardData.expiry}
                  onChange={(e) => setCardData(prev => ({ ...prev, expiry: e.target.value }))}
                  maxLength={5}
                />
              </div>
              <div>
                <Label>CVC</Label>
                <Input
                  type="text"
                  placeholder="123"
                  value={cardData.cvc}
                  onChange={(e) => setCardData(prev => ({ ...prev, cvc: e.target.value }))}
                  maxLength={4}
                />
              </div>
            </div>
            
            <div>
              <Label>Name auf der Karte</Label>
              <Input
                type="text"
                placeholder="Max Mustermann"
                value={cardData.name}
                onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Lock className="h-4 w-4" />
              <span>Ihre Daten werden sicher verschlüsselt übertragen</span>
            </div>
            
            <Button onClick={handleAddCard} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Hinzufügen...
                </>
              ) : (
                'Karte hinzufügen'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
