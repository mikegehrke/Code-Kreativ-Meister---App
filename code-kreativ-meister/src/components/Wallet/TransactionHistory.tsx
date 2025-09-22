import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Gift,
  Ticket,
  Building,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Download,
  Calendar
} from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  description: string;
  amount: number;
  coins: number;
  date: string;
  status: string;
  recipient?: string;
  reference?: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [sortBy, setSortBy] = useState("date");

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

  const getTransactionBgColor = (type: string, amount: number) => {
    if (amount > 0) return "bg-green-500/10";
    if (type === "coin_purchase") return "bg-blue-500/10";
    return "bg-red-500/10";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "failed": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const formatTransactionType = (type: string) => {
    switch (type) {
      case "tip_sent": return "Tip Sent";
      case "tip_received": return "Tip Received";
      case "ticket_purchase": return "Ticket Purchase";
      case "venue_booking": return "Venue Booking";
      case "coin_purchase": return "Coin Purchase";
      case "payout": return "Payout";
      case "refund": return "Refund";
      default: return type;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.reference?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || transaction.type === filterType;
    
    let matchesPeriod = true;
    if (filterPeriod !== "all") {
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      
      switch (filterPeriod) {
        case "today":
          matchesPeriod = transactionDate.toDateString() === now.toDateString();
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesPeriod = transactionDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesPeriod = transactionDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesType && matchesPeriod;
  }).sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "amount":
        return Math.abs(b.amount) - Math.abs(a.amount);
      case "type":
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <ArrowDownRight className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-lg font-bold text-green-500">€{totalIncome.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                <ArrowUpRight className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-lg font-bold text-red-500">€{totalExpenses.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Filter className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-lg font-bold">{filteredTransactions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            View and filter all your financial activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="tip_sent">Tips Sent</SelectItem>
                <SelectItem value="tip_received">Tips Received</SelectItem>
                <SelectItem value="ticket_purchase">Tickets</SelectItem>
                <SelectItem value="venue_booking">Venue Bookings</SelectItem>
                <SelectItem value="coin_purchase">Coin Purchases</SelectItem>
                <SelectItem value="payout">Payouts</SelectItem>
              </SelectContent>
            </Select>

            {/* Period Filter */}
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>

            {/* Export */}
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Transaction List */}
          <div className="space-y-2">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => {
                const IconComponent = getTransactionIcon(transaction.type);
                const colorClass = getTransactionColor(transaction.type, transaction.amount);
                const bgColorClass = getTransactionBgColor(transaction.type, transaction.amount);
                
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${bgColorClass}`}>
                      <IconComponent className={`h-5 w-5 ${colorClass}`} />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium leading-none">
                          {transaction.description}
                        </p>
                        <div className="text-right">
                          <div className={`font-medium ${colorClass}`}>
                            {transaction.amount > 0 ? '+' : ''}€{Math.abs(transaction.amount).toFixed(2)}
                          </div>
                          {transaction.coins !== 0 && (
                            <div className="text-xs text-muted-foreground">
                              {transaction.coins > 0 ? '+' : ''}{transaction.coins} coins
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {formatTransactionType(transaction.type)}
                          </Badge>
                          {transaction.recipient && (
                            <span>to {transaction.recipient}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span>
                            {new Date(transaction.date).toLocaleDateString()} at{' '}
                            {new Date(transaction.date).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          <Badge 
                            className={`text-white ${getStatusColor(transaction.status)}`}
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                      
                      {transaction.reference && (
                        <p className="text-xs text-muted-foreground">
                          Ref: {transaction.reference}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Load More */}
          {filteredTransactions.length > 0 && (
            <div className="mt-6 text-center">
              <Button variant="outline">
                Load More Transactions
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};