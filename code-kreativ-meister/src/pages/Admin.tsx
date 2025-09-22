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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Header } from "@/components/Layout/Header";
import { AdminStats } from "@/components/Admin/AdminStats";
import { UserManagement } from "@/components/Admin/UserManagement";
import { ContentModeration } from "@/components/Admin/ContentModeration";
import { SystemSettings } from "@/components/Admin/SystemSettings";
import { AnalyticsDashboard } from "@/components/Admin/AnalyticsDashboard";
import {
  Shield,
  Users,
  FileText,
  Settings,
  BarChart3,
  AlertTriangle,
  Search,
  Bell,
  Download,
} from "lucide-react";

const Admin = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications] = useState(5);

  // Mock admin data
  const adminData = {
    totalUsers: 15420,
    activeUsers: 8930,
    totalRevenue: 125847.50,
    pendingReports: 23,
    systemHealth: "good",
    serverLoad: 65
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Admin Header */}
        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <CardTitle className="text-orange-500">Admin Dashboard</CardTitle>
                  <CardDescription>Manage and monitor the NightHub platform</CardDescription>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users, content, reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm" className="relative">
                  <Bell className="h-4 w-4 mr-2" />
                  Alerts
                  {notifications > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                      {notifications}
                    </Badge>
                  )}
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* System Status Alert */}
        {adminData.pendingReports > 0 && (
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    {adminData.pendingReports} pending reports require your attention
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Review and take action on reported content and users
                  </p>
                </div>
                <Button size="sm" variant="outline" className="ml-auto">
                  Review Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <AdminStats 
          totalUsers={adminData.totalUsers}
          activeUsers={adminData.activeUsers}
          totalRevenue={adminData.totalRevenue}
          pendingReports={adminData.pendingReports}
          systemHealth={adminData.systemHealth}
          serverLoad={adminData.serverLoad}
        />

        {/* Main Admin Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              <AdminStats 
                totalUsers={adminData.totalUsers}
                activeUsers={adminData.activeUsers}
                totalRevenue={adminData.totalRevenue}
                pendingReports={adminData.pendingReports}
                systemHealth={adminData.systemHealth}
                serverLoad={adminData.serverLoad}
              />
              
              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent User Activity</CardTitle>
                    <CardDescription>Latest user registrations and actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-3 rounded-lg border">
                        <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">New creator: @nightdj_official</p>
                          <p className="text-sm text-muted-foreground">2 hours ago</p>
                        </div>
                        <Badge variant="secondary">Creator</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 p-3 rounded-lg border">
                        <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">User verification: @musiclover123</p>
                          <p className="text-sm text-muted-foreground">4 hours ago</p>
                        </div>
                        <Badge variant="outline">Verified</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 p-3 rounded-lg border">
                        <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Report filed against @user123</p>
                          <p className="text-sm text-muted-foreground">6 hours ago</p>
                        </div>
                        <Badge variant="destructive">Pending</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                    <CardDescription>Current system status and performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Server Load</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-muted rounded-full">
                            <div 
                              className="h-2 bg-green-500 rounded-full transition-all"
                              style={{ width: `${adminData.serverLoad}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{adminData.serverLoad}%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Database Status</span>
                        <Badge className="bg-green-500">Healthy</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">CDN Status</span>
                        <Badge className="bg-green-500">Operational</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Payment Gateway</span>
                        <Badge className="bg-green-500">Connected</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Streaming Service</span>
                        <Badge className="bg-yellow-500">Maintenance</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="content">
            <ContentModeration />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;