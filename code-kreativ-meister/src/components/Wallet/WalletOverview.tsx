import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target,
  Gift,
  Ticket,
  Building,
  Zap
} from "lucide-react";

interface WalletOverviewProps {
  walletData: {
    balance: {
      coins: number;
      euro: number;
      pending: number;
    };
    subscription: {
      active: boolean;
      plan: string;
      nextBilling: string;
      price: number;
    };
    creator: {
      isCreator: boolean;
      earnings: {
        thisMonth: number;
        lastMonth: number;
        total: number;
      };
      pendingPayout: number;
      nextPayout: string;
    };
    stats: {
      totalSpent: number;
      totalEarned: number;
      tipsSent: number;
      tipsReceived: number;
      ticketsPurchased: number;
      venuesBooked: number;
    };
  };
  recentTransactions: Array<{
    id: string;
    type: string;
    description: string;
    amount: number;
    coins: number;
    date: string;
    status: string;
  }>;
}

export const WalletOverview = ({ walletData, recentTransactions }: WalletOverviewProps) => {
  const earningsChange = walletData.creator.isCreator
    ? ((walletData.creator.earnings.thisMonth - walletData.creator.earnings.lastMonth) / walletData.creator.earnings.lastMonth) * 100
    : 0;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "tip_sent":
      case "tip_received":
        return Gift;
      case "ticket_purchase":
        return Ticket;
      case "venue_booking":
        return Building;
      case "coin_purchase":
        return Zap;
      default:
        return ArrowUpRight;
    }
  };

  const getTransactionColor = (type: string, amount: number) => {
    if (amount > 0) return "text-green-500";
    if (type === "coin_purchase") return "text-blue-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{walletData.balance.euro.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {walletData.balance.coins.toLocaleString()} coins available
            </p>
            <div className="mt-4">
              <Button size="sm" className="w-full">
                Add Funds
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Earnings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{walletData.balance.pending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Processing payments
            </p>
            <div className="mt-4">
              <Progress value={65} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Available in 2-3 days
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Earnings (for creators) */}
        {walletData.creator.isCreator && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">
                {earningsChange >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{walletData.creator.earnings.thisMonth.toFixed(2)}</div>
              <p className={`text-xs ${earningsChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {earningsChange >= 0 ? '+' : ''}{earningsChange.toFixed(1)}% from last month
              </p>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Status (for non-creators) */}
        {!walletData.creator.isCreator && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscription</CardTitle>
              <Badge variant={walletData.subscription.active ? "default" : "secondary"}>
                {walletData.subscription.active ? "Active" : "Free"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {walletData.subscription.active ? walletData.subscription.plan : "Free Plan"}
              </div>
              <p className="text-xs text-muted-foreground">
                {walletData.subscription.active 
                  ? `Next billing: ${new Date(walletData.subscription.nextBilling).toLocaleDateString()}`
                  : "Upgrade for premium features"
                }
              </p>
              <div className="mt-4">
                <Button variant={walletData.subscription.active ? "outline" : "default"} size="sm" className="w-full">
                  {walletData.subscription.active ? "Manage Plan" : "Upgrade Now"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Gift className="h-6 w-6 mx-auto mb-2 text-pink-500" />
            <div className="text-lg font-bold">€{walletData.stats.tipsSent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Tips Sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Gift className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <div className="text-lg font-bold">€{walletData.stats.tipsReceived.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Tips Received</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Ticket className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <div className="text-lg font-bold">{walletData.stats.ticketsPurchased}</div>
            <p className="text-xs text-muted-foreground">Tickets Bought</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Building className="h-6 w-6 mx-auto mb-2 text-purple-500" />
            <div className="text-lg font-bold">{walletData.stats.venuesBooked}</div>
            <p className="text-xs text-muted-foreground">Venues Booked</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest transactions and earnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => {
              const IconComponent = getTransactionIcon(transaction.type);
              const colorClass = getTransactionColor(transaction.type, transaction.amount);
              
              return (
                <div
                  key={transaction.id}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    transaction.amount > 0 ? 'bg-green-500/10' : 
                    transaction.type === 'coin_purchase' ? 'bg-blue-500/10' : 'bg-red-500/10'
                  }`}>
                    <IconComponent className={`h-5 w-5 ${colorClass}`} />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()} at{' '}
                      {new Date(transaction.date).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-sm font-medium ${colorClass}`}>
                      {transaction.amount > 0 ? '+' : ''}€{Math.abs(transaction.amount).toFixed(2)}
                    </div>
                    {transaction.coins !== 0 && (
                      <div className="text-xs text-muted-foreground">
                        {transaction.coins > 0 ? '+' : ''}{transaction.coins} coins
                      </div>
                    )}
                  </div>
                  
                  <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                    {transaction.status}
                  </Badge>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full">
              View All Transactions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Creator Payout Info */}
      {walletData.creator.isCreator && walletData.creator.pendingPayout > 0 && (
        <Card className="border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-400">
              Payout Available
            </CardTitle>
            <CardDescription>
              You have earnings ready for withdrawal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                  €{walletData.creator.pendingPayout.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Next automatic payout: {new Date(walletData.creator.nextPayout).toLocaleDateString()}
                </p>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                Request Payout Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};