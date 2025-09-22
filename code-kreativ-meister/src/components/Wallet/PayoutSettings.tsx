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
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DollarSign,
  CreditCard,
  Building2,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  TrendingUp,
  Shield,
  ExternalLink
} from "lucide-react";

interface PayoutSettingsProps {
  creatorData: {
    isCreator: boolean;
    earnings: {
      thisMonth: number;
      lastMonth: number;
      total: number;
    };
    pendingPayout: number;
    nextPayout: string;
  };
}

export const PayoutSettings = ({ creatorData }: PayoutSettingsProps) => {
  const [payoutMethod, setPayoutMethod] = useState("bank");
  const [requestAmount, setRequestAmount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [kycStatus, setKycStatus] = useState<"pending" | "verified" | "rejected">("pending");

  // Mock payout history
  const payoutHistory = [
    {
      id: "1",
      amount: 450.80,
      date: "2024-01-10",
      status: "completed",
      method: "Bank Transfer",
      reference: "PO-2024-001"
    },
    {
      id: "2",
      amount: 320.50,
      date: "2024-01-03",
      status: "completed",
      method: "Bank Transfer",
      reference: "PO-2024-002"
    },
    {
      id: "3",
      amount: 150.00,
      date: "2023-12-27",
      status: "pending",
      method: "Bank Transfer",
      reference: "PO-2023-045"
    }
  ];

  const minPayoutAmount = 50;
  const maxInstantPayout = 1000;
  const payoutFee = 2.5; // percentage

  const calculatePayoutFee = (amount: number) => {
    return Math.max(1, (amount * payoutFee) / 100);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "rejected": return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "rejected": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const handleStripeConnect = () => {
    // Mock Stripe Connect onboarding
    console.log("Starting Stripe Connect onboarding...");
    // In real implementation, redirect to Stripe Connect
    setIsConnected(true);
    setKycStatus("verified");
  };

  const handlePayoutRequest = () => {
    const amount = parseFloat(requestAmount);
    if (amount < minPayoutAmount) {
      alert(`Minimum payout amount is €${minPayoutAmount}`);
      return;
    }
    
    if (amount > creatorData.pendingPayout) {
      alert("Amount exceeds available balance");
      return;
    }

    // Mock payout request
    console.log("Requesting payout:", { amount, method: payoutMethod });
    alert(`Payout request of €${amount} submitted successfully!`);
    setRequestAmount("");
  };

  return (
    <div className="space-y-6">
      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-lg font-bold text-green-500">
                  €{creatorData.pendingPayout.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-lg font-bold">€{creatorData.earnings.thisMonth.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Payout</p>
                <p className="text-sm font-medium">
                  {new Date(creatorData.nextPayout).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="request" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="request">Request Payout</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="history">Payout History</TabsTrigger>
        </TabsList>

        <TabsContent value="request" className="space-y-4">
          {/* KYC Status */}
          <Alert className={kycStatus === "verified" ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"}>
            <Shield className="h-4 w-4" />
            <AlertTitle>Account Verification Status</AlertTitle>
            <AlertDescription className="mt-2">
              {kycStatus === "verified" ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Your account is verified and ready for payouts</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span>Account verification in progress</span>
                  </div>
                  <Button size="sm" onClick={handleStripeConnect}>
                    Complete Verification
                  </Button>
                </div>
              )}
            </AlertDescription>
          </Alert>

          {/* Payout Request Form */}
          <Card>
            <CardHeader>
              <CardTitle>Request Payout</CardTitle>
              <CardDescription>
                Request withdrawal of your available earnings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payout-amount">Amount (EUR)</Label>
                  <Input
                    id="payout-amount"
                    type="number"
                    min={minPayoutAmount}
                    max={creatorData.pendingPayout}
                    step="0.01"
                    placeholder={`Min. €${minPayoutAmount}`}
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Available: €{creatorData.pendingPayout.toFixed(2)}
                  </p>
                </div>

                <div>
                  <Label htmlFor="payout-method">Payment Method</Label>
                  <Select value={payoutMethod} onValueChange={setPayoutMethod}>
                    <SelectTrigger id="payout-method">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="stripe" disabled={!isConnected}>
                        Stripe Express (Setup Required)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {requestAmount && parseFloat(requestAmount) >= minPayoutAmount && (
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Payout Amount:</span>
                    <span>€{parseFloat(requestAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Processing Fee ({payoutFee}%):</span>
                    <span>-€{calculatePayoutFee(parseFloat(requestAmount)).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-medium">
                      <span>You'll Receive:</span>
                      <span>€{(parseFloat(requestAmount) - calculatePayoutFee(parseFloat(requestAmount))).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {parseFloat(requestAmount) <= maxInstantPayout 
                      ? "Processing time: 1-2 business days"
                      : "Processing time: 3-5 business days"
                    }
                  </div>
                </div>
              )}

              <Button
                className="w-full"
                onClick={handlePayoutRequest}
                disabled={
                  !requestAmount ||
                  parseFloat(requestAmount) < minPayoutAmount ||
                  parseFloat(requestAmount) > creatorData.pendingPayout ||
                  kycStatus !== "verified"
                }
              >
                Request Payout
              </Button>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Minimum payout: €{minPayoutAmount}</p>
                <p>• Automatic payouts occur weekly on Fridays</p>
                <p>• Instant payouts available up to €{maxInstantPayout}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payout destinations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stripe Connect */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Stripe Express</h4>
                    <p className="text-sm text-muted-foreground">
                      Fast payouts to bank account or debit card
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={isConnected ? "default" : "secondary"}>
                    {isConnected ? "Connected" : "Not Connected"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleStripeConnect}
                    disabled={isConnected}
                  >
                    {isConnected ? "Manage" : "Connect"}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Bank Transfer */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Bank Transfer</h4>
                    <p className="text-sm text-muted-foreground">
                      Direct transfer to your bank account
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="default">Active</Badge>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </div>

              {/* PayPal */}
              <div className="flex items-center justify-between p-4 border rounded-lg opacity-60">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">PayPal</h4>
                    <p className="text-sm text-muted-foreground">
                      Coming soon - PayPal integration
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>
                Track all your past and pending payouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payoutHistory.map((payout) => (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(payout.status)}
                      <div>
                        <h4 className="font-medium">€{payout.amount.toFixed(2)}</h4>
                        <p className="text-sm text-muted-foreground">
                          {payout.method} • {new Date(payout.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`text-white ${getStatusColor(payout.status)}`}>
                        {payout.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {payout.reference}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {payoutHistory.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No payouts yet</h3>
                  <p className="text-muted-foreground">
                    Your payout history will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};