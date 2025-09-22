import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { WalletOverview } from "@/components/Wallet/WalletOverview";
import { CoinPurchase } from "@/components/Wallet/CoinPurchase";
import { TransactionHistory } from "@/components/Wallet/TransactionHistory";
import { PayoutSettings } from "@/components/Wallet/PayoutSettings";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Wallet as WalletIcon,
  CreditCard,
  History,
  Settings,
  TrendingUp,
  DollarSign,
  Gift,
  Zap,
  ShieldCheck
} from "lucide-react";

const Wallet = () => {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock user wallet data
  const walletData = {
    balance: {
      coins: 2450,
      euro: 245.00,
      pending: 150.00
    },
    subscription: {
      active: true,
      plan: "Premium",
      nextBilling: "2024-02-15",
      price: 19.99
    },
    creator: {
      isCreator: true,
      earnings: {
        thisMonth: 1250.80,
        lastMonth: 890.50,
        total: 15420.00
      },
      pendingPayout: 342.20,
      nextPayout: "2024-01-20"
    },
    stats: {
      totalSpent: 1230.50,
      totalEarned: 890.20,
      tipsSent: 145.30,
      tipsReceived: 234.80,
      ticketsPurchased: 12,
      venuesBooked: 3
    }
  };

  const quickActions = [
    {
      id: "buy-coins",
      label: "Buy Coins",
      description: "Purchase coins to tip creators",
      icon: Zap,
      color: "from-yellow-400 to-orange-500",
      action: () => setSelectedTab("purchase")
    },
    {
      id: "request-payout",
      label: "Request Payout",
      description: "Withdraw your earnings",
      icon: DollarSign,
      color: "from-green-400 to-blue-500",
      action: () => setSelectedTab("payouts"),
      disabled: !walletData.creator.isCreator || walletData.creator.pendingPayout < 50
    },
    {
      id: "premium",
      label: "Upgrade to Premium",
      description: "Unlock exclusive features",
      icon: ShieldCheck,
      color: "from-purple-400 to-pink-500",
      action: () => {},
      hidden: walletData.subscription.active
    },
    {
      id: "gift",
      label: "Send Gift",
      description: "Gift coins to friends",
      icon: Gift,
      color: "from-pink-400 to-rose-500",
      action: () => {}
    }
  ];

  const recentTransactions = [
    {
      id: "1",
      type: "tip_sent",
      description: "Tip to @djmax_berlin",
      amount: -25.00,
      coins: -250,
      date: "2024-01-15T10:30:00Z",
      status: "completed"
    },
    {
      id: "2", 
      type: "coin_purchase",
      description: "Coin package purchase",
      amount: -50.00,
      coins: +500,
      date: "2024-01-14T15:20:00Z", 
      status: "completed"
    },
    {
      id: "3",
      type: "tip_received",
      description: "Tip from @musiclover23",
      amount: +15.00,
      coins: +150,
      date: "2024-01-14T09:15:00Z",
      status: "completed"
    },
    {
      id: "4",
      type: "ticket_purchase",
      description: "Club Neon - Saturday Night",
      amount: -85.00,
      coins: 0,
      date: "2024-01-13T18:45:00Z",
      status: "completed"
    },
    {
      id: "5",
      type: "venue_booking",
      description: "Studio rental - 4 hours",
      amount: -300.00,
      coins: 0,
      date: "2024-01-12T12:00:00Z",
      status: "completed"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-12 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-background border-b">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className="relative">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <WalletIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 blur animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Your Wallet
              </h1>
              <p className="text-muted-foreground">
                Manage your coins, earnings, and payments
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{walletData.balance.coins.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Coins</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">€{walletData.balance.euro}</p>
                    <p className="text-xs text-muted-foreground">Balance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

        {walletData.creator.isCreator && (
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">€{walletData.creator.earnings.thisMonth}</p>
                  <p className="text-xs text-muted-foreground">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-bold">
                      {walletData.subscription.active ? walletData.subscription.plan : "Free"}
                    </p>
                    <p className="text-xs text-muted-foreground">Plan</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.filter(action => !action.hidden).map((action) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-center space-y-2 ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-glow'}`}
                  onClick={action.action}
                  disabled={action.disabled}
                >
                  <div className={`h-8 w-8 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center`}>
                    <IconComponent className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="purchase" className="gap-2">
                <CreditCard className="h-4 w-4" />
                Buy Coins
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
              {walletData.creator.isCreator && (
                <TabsTrigger value="payouts" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Payouts
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <WalletOverview 
                walletData={walletData}
                recentTransactions={recentTransactions.slice(0, 5)}
              />
            </TabsContent>

            <TabsContent value="purchase" className="mt-6">
              <CoinPurchase currentBalance={walletData.balance.coins} />
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <TransactionHistory transactions={recentTransactions} />
            </TabsContent>

            {walletData.creator.isCreator && (
              <TabsContent value="payouts" className="mt-6">
                <PayoutSettings creatorData={walletData.creator} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Wallet;