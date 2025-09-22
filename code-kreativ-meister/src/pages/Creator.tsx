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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Header } from "@/components/Layout/Header";
import { CreatorStats } from "@/components/Creator/CreatorStats";
import { ContentManager } from "@/components/Creator/ContentManager";
import { LivestreamManager } from "@/components/Creator/LivestreamManager";
import { EarningsOverview } from "@/components/Creator/EarningsOverview";
import { FanEngagement } from "@/components/Creator/FanEngagement";
import {
  Users,
  Video,
  DollarSign,
  TrendingUp,
  Settings,
  Upload,
  Calendar,
  MessageCircle,
  Bell,
  Crown,
} from "lucide-react";

const Creator = () => {
  const [notifications] = useState(12);
  const [liveStatus] = useState<"live" | "offline">("offline");

  // Mock creator data
  const creatorData = {
    name: "DJ NightMix",
    username: "@nightmix_official",
    avatar: "/placeholder.svg",
    followerCount: 15420,
    totalEarnings: 2847.50,
    monthlyGrowth: 23.5,
    isVerified: true,
    tier: "Pro Creator"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Creator Profile Header */}
        <Card className="relative overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent"></div>
          <CardContent className="relative -mt-16 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-end space-x-4">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage src={creatorData.avatar} />
                  <AvatarFallback className="text-2xl">DJ</AvatarFallback>
                </Avatar>
                <div className="pb-2">
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold">{creatorData.name}</h1>
                    {creatorData.isVerified && (
                      <Crown className="h-5 w-5 text-yellow-500" />
                    )}
                    <Badge variant="secondary">{creatorData.tier}</Badge>
                  </div>
                  <p className="text-muted-foreground">{creatorData.username}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-muted-foreground">
                      {creatorData.followerCount.toLocaleString()} followers
                    </span>
                    <div className="flex items-center space-x-1">
                      <div className={`h-2 w-2 rounded-full ${liveStatus === "live" ? "bg-red-500 animate-pulse" : "bg-gray-400"}`}></div>
                      <span className="text-sm text-muted-foreground">
                        {liveStatus === "live" ? "Live" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" className="relative">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                  {notifications > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                      {notifications}
                    </Badge>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button size="sm" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Content
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <CreatorStats 
          totalEarnings={creatorData.totalEarnings}
          followerCount={creatorData.followerCount}
          monthlyGrowth={creatorData.monthlyGrowth}
        />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button className="h-20 flex-col gap-2" variant="outline">
            <Video className="h-6 w-6" />
            <span>Start Live Stream</span>
          </Button>
          <Button className="h-20 flex-col gap-2" variant="outline">
            <Upload className="h-6 w-6" />
            <span>Upload Content</span>
          </Button>
          <Button className="h-20 flex-col gap-2" variant="outline">
            <Calendar className="h-6 w-6" />
            <span>Schedule Event</span>
          </Button>
          <Button className="h-20 flex-col gap-2" variant="outline">
            <MessageCircle className="h-6 w-6" />
            <span>Message Fans</span>
          </Button>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <Upload className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="live" className="gap-2">
              <Video className="h-4 w-4" />
              Live
            </TabsTrigger>
            <TabsTrigger value="earnings" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Earnings
            </TabsTrigger>
            <TabsTrigger value="fans" className="gap-2">
              <Users className="h-4 w-4" />
              Fans
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              <CreatorStats 
                totalEarnings={creatorData.totalEarnings}
                followerCount={creatorData.followerCount}
                monthlyGrowth={creatorData.monthlyGrowth}
              />
              
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest interactions and earnings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-3 rounded-lg border">
                      <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Received tip from @musiclover123</p>
                        <p className="text-sm text-muted-foreground">2 hours ago</p>
                      </div>
                      <span className="font-medium text-green-500">+€25.50</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-3 rounded-lg border">
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">New follower: @party_animal</p>
                        <p className="text-sm text-muted-foreground">4 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-3 rounded-lg border">
                      <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <Video className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Live stream ended - 234 viewers</p>
                        <p className="text-sm text-muted-foreground">Yesterday at 11:30 PM</p>
                      </div>
                      <span className="font-medium text-purple-500">2h 15m</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <ContentManager />
          </TabsContent>

          <TabsContent value="live">
            <LivestreamManager />
          </TabsContent>

          <TabsContent value="earnings">
            <EarningsOverview />
          </TabsContent>

          <TabsContent value="fans">
            <FanEngagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Creator;