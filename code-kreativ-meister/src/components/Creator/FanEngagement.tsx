import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Users,
  MessageCircle,
  Heart,
  Gift,
  Star,
  TrendingUp,
  Send,
  Bell,
  Crown,
  Zap,
  Calendar,
  Mail,
  Plus,
  Filter,
} from "lucide-react";

interface Fan {
  id: string;
  username: string;
  avatar?: string;
  tier: "basic" | "premium" | "vip";
  totalSpent: number;
  followedSince: string;
  lastActive: string;
  totalTips: number;
  messagesCount: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  fromUser: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: "message" | "tip" | "subscription";
  amount?: number;
}

interface EngagementData {
  date: string;
  followers: number;
  messages: number;
  tips: number;
  likes: number;
}

export const FanEngagement = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  
  const fans: Fan[] = [
    {
      id: "1",
      username: "musiclover123",
      avatar: "/placeholder.svg",
      tier: "vip",
      totalSpent: 245.50,
      followedSince: "2023-08-15",
      lastActive: "2024-01-16T14:30:00",
      totalTips: 15,
      messagesCount: 42,
      isOnline: true
    },
    {
      id: "2",
      username: "nightclub_fan",
      tier: "premium",
      totalSpent: 89.99,
      followedSince: "2023-11-20",
      lastActive: "2024-01-16T12:15:00",
      totalTips: 8,
      messagesCount: 23,
      isOnline: true
    },
    {
      id: "3",
      username: "party_animal",
      tier: "basic",
      totalSpent: 25.50,
      followedSince: "2024-01-05",
      lastActive: "2024-01-15T18:45:00",
      totalTips: 3,
      messagesCount: 12,
      isOnline: false
    }
  ];

  const messages: Message[] = [
    {
      id: "1",
      fromUser: "musiclover123",
      content: "Amazing performance last night! 🔥",
      timestamp: "2024-01-16T14:30:00",
      isRead: false,
      type: "message"
    },
    {
      id: "2",
      fromUser: "nightclub_fan",
      content: "Sent you a tip for the great show!",
      timestamp: "2024-01-16T12:15:00",
      isRead: true,
      type: "tip",
      amount: 15.50
    },
    {
      id: "3",
      fromUser: "party_animal",
      content: "When's your next live stream?",
      timestamp: "2024-01-16T09:45:00",
      isRead: true,
      type: "message"
    }
  ];

  const engagementData: EngagementData[] = [
    { date: "2024-01-10", followers: 234, messages: 45, tips: 12, likes: 89 },
    { date: "2024-01-11", followers: 238, messages: 52, tips: 18, likes: 102 },
    { date: "2024-01-12", followers: 241, messages: 38, tips: 8, likes: 76 },
    { date: "2024-01-13", followers: 245, messages: 67, tips: 25, likes: 134 },
    { date: "2024-01-14", followers: 249, messages: 73, tips: 31, likes: 156 },
    { date: "2024-01-15", followers: 253, messages: 89, tips: 28, likes: 178 },
    { date: "2024-01-16", followers: 256, messages: 94, tips: 35, likes: 201 },
  ];

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "vip": return Crown;
      case "premium": return Star;
      case "basic": return Users;
      default: return Users;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "vip": return "text-yellow-500";
      case "premium": return "text-purple-500";
      case "basic": return "text-blue-500";
      default: return "text-gray-500";
    }
  };

  const totalFollowers = fans.length;
  const totalMessages = messages.length;
  const unreadMessages = messages.filter(m => !m.isRead).length;
  const topFan = fans.reduce((prev, current) => 
    prev.totalSpent > current.totalSpent ? prev : current
  );

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Followers</p>
                <p className="text-lg font-bold">{totalFollowers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Messages</p>
                <p className="text-lg font-bold">{totalMessages}</p>
                {unreadMessages > 0 && (
                  <p className="text-xs text-red-500">{unreadMessages} unread</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Crown className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Top Fan</p>
                <p className="text-lg font-bold">@{topFan.username}</p>
                <p className="text-xs text-muted-foreground">€{topFan.totalSpent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <p className="text-lg font-bold">+12.5%</p>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b">
        <Button
          variant={selectedTab === "overview" ? "default" : "ghost"}
          onClick={() => setSelectedTab("overview")}
        >
          Overview
        </Button>
        <Button
          variant={selectedTab === "fans" ? "default" : "ghost"}
          onClick={() => setSelectedTab("fans")}
        >
          Fans
        </Button>
        <Button
          variant={selectedTab === "messages" ? "default" : "ghost"}
          onClick={() => setSelectedTab("messages")}
        >
          Messages
          {unreadMessages > 0 && (
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
              {unreadMessages}
            </Badge>
          )}
        </Button>
      </div>

      {/* Tab Content */}
      {selectedTab === "overview" && (
        <div className="space-y-6">
          {/* Engagement Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Overview</CardTitle>
              <CardDescription>Track your fan engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="followers" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Followers"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="messages" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Messages"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tips" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    name="Tips"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Fan Tier Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Fan Tier Distribution</CardTitle>
              <CardDescription>Breakdown of your fan base by tier</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { tier: "VIP", count: fans.filter(f => f.tier === "vip").length, color: "#F59E0B" },
                  { tier: "Premium", count: fans.filter(f => f.tier === "premium").length, color: "#8B5CF6" },
                  { tier: "Basic", count: fans.filter(f => f.tier === "basic").length, color: "#3B82F6" },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tier" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === "fans" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Fan Management</CardTitle>
                <CardDescription>Manage your followers and top supporters</CardDescription>
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter Fans
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fan</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Tips</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fans.map((fan) => {
                  const TierIcon = getTierIcon(fan.tier);
                  const tierColor = getTierColor(fan.tier);
                  
                  return (
                    <TableRow key={fan.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={fan.avatar} />
                            <AvatarFallback>
                              {fan.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">@{fan.username}</p>
                            <p className="text-xs text-muted-foreground">
                              Last active: {new Date(fan.lastActive).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <TierIcon className={`h-4 w-4 ${tierColor}`} />
                          <Badge variant="outline" className="capitalize">
                            {fan.tier}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>€{fan.totalSpent.toFixed(2)}</TableCell>
                      <TableCell>{fan.totalTips}</TableCell>
                      <TableCell>{fan.messagesCount}</TableCell>
                      <TableCell>
                        {new Date(fan.followedSince).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`h-2 w-2 rounded-full ${fan.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className="text-sm">{fan.isOnline ? 'Online' : 'Offline'}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedTab === "messages" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Communicate with your fans</CardDescription>
              </div>
              <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Compose
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Message</DialogTitle>
                    <DialogDescription>
                      Send a message to your fans
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Recipients</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select recipients" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Fans</SelectItem>
                          <SelectItem value="vip">VIP Fans Only</SelectItem>
                          <SelectItem value="premium">Premium Fans</SelectItem>
                          <SelectItem value="specific">Specific Fan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Subject</label>
                      <Input placeholder="Message subject..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Message</label>
                      <Textarea placeholder="Write your message..." />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                        Cancel
                      </Button>
                      <Button className="gap-2">
                        <Send className="h-4 w-4" />
                        Send Message
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg border ${!message.isRead ? 'bg-muted/50 border-primary/20' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {message.fromUser.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">@{message.fromUser}</span>
                      {message.type === "tip" && (
                        <Badge className="gap-1 bg-green-500">
                          <Gift className="h-3 w-3" />
                          Tip: €{message.amount}
                        </Badge>
                      )}
                      {!message.isRead && (
                        <Badge variant="secondary">New</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};