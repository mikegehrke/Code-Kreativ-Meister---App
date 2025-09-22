import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Gift,
  Video,
  Music,
  Image,
  Users,
  Download,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface EarningData {
  date: string;
  tips: number;
  subscriptions: number;
  content: number;
  events: number;
  total: number;
}

interface Transaction {
  id: string;
  type: "tip" | "subscription" | "content_sale" | "event_ticket" | "payout";
  description: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "processing";
  from?: string;
}

export const EarningsOverview = () => {
  const [timeRange, setTimeRange] = useState("7d");
  
  const earningsData: EarningData[] = [
    { date: "2024-01-10", tips: 45.50, subscriptions: 89.99, content: 23.50, events: 150.00, total: 308.99 },
    { date: "2024-01-11", tips: 67.25, subscriptions: 89.99, content: 45.00, events: 200.00, total: 402.24 },
    { date: "2024-01-12", tips: 34.75, subscriptions: 89.99, content: 12.50, events: 0.00, total: 137.24 },
    { date: "2024-01-13", tips: 89.50, subscriptions: 89.99, content: 67.25, events: 300.00, total: 546.74 },
    { date: "2024-01-14", tips: 123.25, subscriptions: 89.99, content: 89.50, events: 450.00, total: 752.74 },
    { date: "2024-01-15", tips: 76.50, subscriptions: 89.99, content: 34.75, events: 250.00, total: 451.24 },
    { date: "2024-01-16", tips: 98.75, subscriptions: 89.99, content: 56.25, events: 180.00, total: 424.99 },
  ];

  const recentTransactions: Transaction[] = [
    {
      id: "1",
      type: "tip",
      description: "Tip from @musiclover123",
      amount: 25.50,
      date: "2024-01-16T14:30:00",
      status: "completed",
      from: "musiclover123"
    },
    {
      id: "2",
      type: "event_ticket",
      description: "Club Night Ticket Sale",
      amount: 45.00,
      date: "2024-01-16T12:15:00",
      status: "completed"
    },
    {
      id: "3",
      type: "content_sale",
      description: "Exclusive Track Purchase",
      amount: 12.99,
      date: "2024-01-16T09:45:00",
      status: "completed"
    },
    {
      id: "4",
      type: "payout",
      description: "Weekly Payout",
      amount: -450.75,
      date: "2024-01-15T18:00:00",
      status: "processing"
    },
    {
      id: "5",
      type: "subscription",
      description: "Monthly Subscription",
      amount: 9.99,
      date: "2024-01-15T16:20:00",
      status: "completed"
    }
  ];

  const pieData = [
    { name: "Tips", value: 535.5, color: "#10B981" },
    { name: "Subscriptions", value: 629.93, color: "#3B82F6" },
    { name: "Content Sales", value: 329.25, color: "#8B5CF6" },
    { name: "Events", value: 1530.0, color: "#F59E0B" },
  ];

  const totalEarnings = earningsData.reduce((sum, day) => sum + day.total, 0);
  const averageDaily = totalEarnings / earningsData.length;
  const pendingPayouts = recentTransactions
    .filter(t => t.type === "payout" && t.status === "pending")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "tip": return Gift;
      case "subscription": return Users;
      case "content_sale": return Music;
      case "event_ticket": return Calendar;
      case "payout": return CreditCard;
      default: return DollarSign;
    }
  };

  const getTransactionColor = (type: string, amount: number) => {
    if (amount < 0) return "text-red-500";
    switch (type) {
      case "tip": return "text-green-500";
      case "subscription": return "text-blue-500";
      case "content_sale": return "text-purple-500";
      case "event_ticket": return "text-yellow-500";
      default: return "text-green-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "processing": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-lg font-bold">€{totalEarnings.toFixed(2)}</p>
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
                <p className="text-sm text-muted-foreground">Daily Average</p>
                <p className="text-lg font-bold">€{averageDaily.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Payouts</p>
                <p className="text-lg font-bold">€{pendingPayouts.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Gift className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-lg font-bold">€{(totalEarnings * 4.3).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Timeline */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Earnings Timeline</CardTitle>
                <CardDescription>Daily earnings breakdown</CardDescription>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [`€${value.toFixed(2)}`, ""]}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Sources</CardTitle>
            <CardDescription>Breakdown by income type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `€${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest earnings and payouts</CardDescription>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => {
                const IconComponent = getTransactionIcon(transaction.type);
                const colorClass = getTransactionColor(transaction.type, transaction.amount);
                
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          {transaction.from && (
                            <p className="text-xs text-muted-foreground">from @{transaction.from}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {transaction.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`font-medium flex items-center ${colorClass}`}>
                        {transaction.amount > 0 ? (
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                        )}
                        {transaction.amount > 0 ? '+' : ''}€{Math.abs(transaction.amount).toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-white ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString()} at{' '}
                      {new Date(transaction.date).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};