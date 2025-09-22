import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  DollarSign,
  Eye,
  TrendingUp,
  Calendar,
  Download,
  Filter,
} from "lucide-react";

interface AnalyticsData {
  date: string;
  users: number;
  revenue: number;
  pageViews: number;
  newUsers: number;
}

export const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState("30d");
  
  const analyticsData: AnalyticsData[] = [
    { date: "2024-01-01", users: 1240, revenue: 3245.50, pageViews: 15420, newUsers: 67 },
    { date: "2024-01-02", users: 1289, revenue: 3567.25, pageViews: 16832, newUsers: 89 },
    { date: "2024-01-03", users: 1356, revenue: 3789.75, pageViews: 17245, newUsers: 91 },
    { date: "2024-01-04", users: 1423, revenue: 4123.25, pageViews: 18567, newUsers: 78 },
    { date: "2024-01-05", users: 1487, revenue: 4356.50, pageViews: 19234, newUsers: 65 },
    { date: "2024-01-06", users: 1534, revenue: 4567.75, pageViews: 20123, newUsers: 89 },
    { date: "2024-01-07", users: 1598, revenue: 4789.25, pageViews: 21456, newUsers: 102 },
  ];

  const deviceData = [
    { name: "Desktop", value: 45, color: "#3B82F6" },
    { name: "Mobile", value: 35, color: "#10B981" },
    { name: "Tablet", value: 20, color: "#F59E0B" },
  ];

  const contentTypeData = [
    { type: "Videos", count: 1250, engagement: 78 },
    { type: "Images", count: 3420, engagement: 65 },
    { type: "Audio", count: 890, engagement: 82 },
    { type: "Events", count: 234, engagement: 91 },
  ];

  const revenueSourcesData = [
    { name: "Tips", value: 35, color: "#10B981" },
    { name: "Subscriptions", value: 25, color: "#3B82F6" },
    { name: "Events", value: 30, color: "#8B5CF6" },
    { name: "Commissions", value: 10, color: "#F59E0B" },
  ];

  const totalUsers = analyticsData[analyticsData.length - 1]?.users || 0;
  const totalRevenue = analyticsData.reduce((sum, day) => sum + day.revenue, 0);
  const totalPageViews = analyticsData.reduce((sum, day) => sum + day.pageViews, 0);
  const totalNewUsers = analyticsData.reduce((sum, day) => sum + day.newUsers, 0);

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>Platform performance and user insights</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-lg font-bold">{totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-500">+12.5% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-lg font-bold">€{totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-500">+8.2% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Eye className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Page Views</p>
                <p className="text-lg font-bold">{totalPageViews.toLocaleString()}</p>
                <p className="text-xs text-green-500">+15.7% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">New Users</p>
                <p className="text-lg font-bold">{totalNewUsers.toLocaleString()}</p>
                <p className="text-xs text-green-500">+23.1% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Daily active users over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#3B82F6" 
                  fill="#3B82F6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Daily revenue performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [`€${value.toFixed(2)}`, "Revenue"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: "#10B981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Device Usage</CardTitle>
            <CardDescription>User device preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Content Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Content Performance</CardTitle>
            <CardDescription>Content type engagement rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contentTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="engagement" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Sources</CardTitle>
          <CardDescription>Breakdown of revenue by source</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueSourcesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {revenueSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-4">
              {revenueSourcesData.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: source.color }}
                    ></div>
                    <span className="font-medium">{source.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{source.value}%</p>
                    <p className="text-sm text-muted-foreground">
                      €{((totalRevenue * source.value) / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};