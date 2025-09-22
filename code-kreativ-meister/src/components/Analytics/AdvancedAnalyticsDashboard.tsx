import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share, 
  Users, 
  Clock, 
  Calendar, 
  DollarSign, 
  Target, 
  Award, 
  Zap, 
  Globe, 
  Smartphone, 
  Monitor, 
  MapPin, 
  Filter, 
  Download, 
  RefreshCw, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Activity, 
  UserPlus, 
  UserMinus, 
  PlayCircle, 
  PauseCircle, 
  SkipForward, 
  Volume2, 
  ThumbsUp, 
  MessageSquare, 
  Send, 
  Bookmark, 
  Star,
  Crown,
  Gift,
  Coins,
  CreditCard,
  TrendingUpIcon,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { de } from 'date-fns/locale';

interface AnalyticsData {
  overview: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalFollowers: number;
    totalVideos: number;
    totalRevenue: number;
    engagementRate: number;
    avgWatchTime: number;
    reachRate: number;
  };
  trends: {
    views: { date: string; value: number; }[];
    likes: { date: string; value: number; }[];
    comments: { date: string; value: number; }[];
    followers: { date: string; value: number; }[];
    revenue: { date: string; value: number; }[];
  };
  demographics: {
    age: { range: string; percentage: number; }[];
    gender: { type: string; percentage: number; }[];
    location: { country: string; percentage: number; }[];
    device: { type: string; percentage: number; }[];
  };
  content: {
    topVideos: {
      id: string;
      title: string;
      views: number;
      likes: number;
      comments: number;
      shares: number;
      revenue: number;
      thumbnail: string;
    }[];
    performance: {
      category: string;
      avgViews: number;
      avgLikes: number;
      avgComments: number;
      avgShares: number;
    }[];
  };
  engagement: {
    hourly: { hour: number; engagement: number; }[];
    daily: { day: string; engagement: number; }[];
    retention: { second: number; percentage: number; }[];
  };
  revenue: {
    sources: { source: string; amount: number; percentage: number; }[];
    monthly: { month: string; amount: number; }[];
    topGifts: { name: string; count: number; revenue: number; }[];
  };
}

interface TimeRange {
  label: string;
  value: string;
  days: number;
}

const timeRanges: TimeRange[] = [
  { label: 'Letzte 7 Tage', value: '7d', days: 7 },
  { label: 'Letzte 30 Tage', value: '30d', days: 30 },
  { label: 'Letzte 90 Tage', value: '90d', days: 90 },
  { label: 'Letztes Jahr', value: '1y', days: 365 }
];

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

// Mock data generator
const generateMockData = (timeRange: string): AnalyticsData => {
  const days = timeRanges.find(r => r.value === timeRange)?.days || 30;
  const dates = Array.from({ length: days }, (_, i) => 
    format(subDays(new Date(), days - i - 1), 'yyyy-MM-dd')
  );

  return {
    overview: {
      totalViews: Math.floor(Math.random() * 1000000) + 100000,
      totalLikes: Math.floor(Math.random() * 50000) + 5000,
      totalComments: Math.floor(Math.random() * 10000) + 1000,
      totalShares: Math.floor(Math.random() * 5000) + 500,
      totalFollowers: Math.floor(Math.random() * 100000) + 10000,
      totalVideos: Math.floor(Math.random() * 100) + 20,
      totalRevenue: Math.floor(Math.random() * 10000) + 1000,
      engagementRate: Math.floor(Math.random() * 10) + 5,
      avgWatchTime: Math.floor(Math.random() * 60) + 30,
      reachRate: Math.floor(Math.random() * 20) + 10
    },
    trends: {
      views: dates.map(date => ({ 
        date, 
        value: Math.floor(Math.random() * 10000) + 1000 
      })),
      likes: dates.map(date => ({ 
        date, 
        value: Math.floor(Math.random() * 1000) + 100 
      })),
      comments: dates.map(date => ({ 
        date, 
        value: Math.floor(Math.random() * 200) + 20 
      })),
      followers: dates.map(date => ({ 
        date, 
        value: Math.floor(Math.random() * 100) + 10 
      })),
      revenue: dates.map(date => ({ 
        date, 
        value: Math.floor(Math.random() * 500) + 50 
      }))
    },
    demographics: {
      age: [
        { range: '13-17', percentage: 15 },
        { range: '18-24', percentage: 35 },
        { range: '25-34', percentage: 25 },
        { range: '35-44', percentage: 15 },
        { range: '45+', percentage: 10 }
      ],
      gender: [
        { type: 'Weiblich', percentage: 60 },
        { type: 'Männlich', percentage: 35 },
        { type: 'Divers', percentage: 5 }
      ],
      location: [
        { country: 'Deutschland', percentage: 45 },
        { country: 'Österreich', percentage: 20 },
        { country: 'Schweiz', percentage: 15 },
        { country: 'USA', percentage: 10 },
        { country: 'Andere', percentage: 10 }
      ],
      device: [
        { type: 'Mobile', percentage: 80 },
        { type: 'Desktop', percentage: 15 },
        { type: 'Tablet', percentage: 5 }
      ]
    },
    content: {
      topVideos: Array.from({ length: 10 }, (_, i) => ({
        id: `video-${i}`,
        title: `Video ${i + 1}: Nightlife Adventure`,
        views: Math.floor(Math.random() * 100000) + 10000,
        likes: Math.floor(Math.random() * 5000) + 500,
        comments: Math.floor(Math.random() * 1000) + 100,
        shares: Math.floor(Math.random() * 500) + 50,
        revenue: Math.floor(Math.random() * 1000) + 100,
        thumbnail: `/api/placeholder/160/90`
      })),
      performance: [
        { category: 'Party', avgViews: 15000, avgLikes: 800, avgComments: 150, avgShares: 75 },
        { category: 'Club', avgViews: 12000, avgLikes: 600, avgComments: 120, avgShares: 60 },
        { category: 'Festival', avgViews: 20000, avgLikes: 1200, avgComments: 200, avgShares: 100 },
        { category: 'Bar', avgViews: 8000, avgLikes: 400, avgComments: 80, avgShares: 40 },
        { category: 'Event', avgViews: 18000, avgLikes: 1000, avgComments: 180, avgShares: 90 }
      ]
    },
    engagement: {
      hourly: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        engagement: Math.floor(Math.random() * 100) + 20
      })),
      daily: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => ({
        day,
        engagement: Math.floor(Math.random() * 100) + 30
      })),
      retention: Array.from({ length: 60 }, (_, i) => ({
        second: i,
        percentage: Math.max(0, 100 - (i * 2) + Math.random() * 20 - 10)
      }))
    },
    revenue: {
      sources: [
        { source: 'Geschenke', amount: 2500, percentage: 50 },
        { source: 'Super Chat', amount: 1500, percentage: 30 },
        { source: 'Creator Fund', amount: 800, percentage: 16 },
        { source: 'Sponsoring', amount: 200, percentage: 4 }
      ],
      monthly: dates.slice(-12).map((date, i) => ({
        month: format(new Date(date), 'MMM', { locale: de }),
        amount: Math.floor(Math.random() * 2000) + 500
      })),
      topGifts: [
        { name: 'Rose', count: 150, revenue: 150 },
        { name: 'Herz', count: 80, revenue: 400 },
        { name: 'Diamant', count: 20, revenue: 1000 },
        { name: 'Krone', count: 10, revenue: 500 },
        { name: 'Schloss', count: 2, revenue: 1000 }
      ]
    }
  };
};

export const AdvancedAnalyticsDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);

  // Load analytics data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(generateMockData(selectedTimeRange));
      setIsLoading(false);
    };

    loadData();
  }, [selectedTimeRange]);

  // Calculate growth rates
  const growthRates = useMemo(() => {
    if (!data) return {};

    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return 0;
      return ((current - previous) / previous) * 100;
    };

    // Mock previous period data for growth calculation
    const previousViews = data.overview.totalViews * 0.8;
    const previousLikes = data.overview.totalLikes * 0.9;
    const previousFollowers = data.overview.totalFollowers * 0.95;
    const previousRevenue = data.overview.totalRevenue * 0.85;

    return {
      views: calculateGrowth(data.overview.totalViews, previousViews),
      likes: calculateGrowth(data.overview.totalLikes, previousLikes),
      followers: calculateGrowth(data.overview.totalFollowers, previousFollowers),
      revenue: calculateGrowth(data.overview.totalRevenue, previousRevenue)
    };
  }, [data]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const GrowthIndicator: React.FC<{ value: number }> = ({ value }) => {
    if (value > 0) {
      return (
        <div className="flex items-center text-green-600">
          <ArrowUpRight className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">+{value.toFixed(1)}%</span>
        </div>
      );
    } else if (value < 0) {
      return (
        <div className="flex items-center text-red-600">
          <ArrowDownRight className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">{value.toFixed(1)}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-gray-600">
          <Minus className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">0%</span>
        </div>
      );
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Lade Analytics-Daten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Detaillierte Einblicke in deine Content-Performance
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          <Button
            onClick={() => setData(generateMockData(selectedTimeRange))}
            disabled={isLoading}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Aktualisieren
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="audience">Zielgruppe</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="revenue">Umsatz</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Aufrufe</p>
                    <p className="text-2xl font-bold">{formatNumber(data.overview.totalViews)}</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-500" />
                </div>
                <div className="mt-4">
                  <GrowthIndicator value={growthRates.views || 0} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Likes</p>
                    <p className="text-2xl font-bold">{formatNumber(data.overview.totalLikes)}</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
                <div className="mt-4">
                  <GrowthIndicator value={growthRates.likes || 0} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Follower</p>
                    <p className="text-2xl font-bold">{formatNumber(data.overview.totalFollowers)}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
                <div className="mt-4">
                  <GrowthIndicator value={growthRates.followers || 0} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Umsatz</p>
                    <p className="text-2xl font-bold">{formatCurrency(data.overview.totalRevenue)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="mt-4">
                  <GrowthIndicator value={growthRates.revenue || 0} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Engagement Rate</h3>
                  <Target className="h-5 w-5 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {data.overview.engagementRate}%
                </div>
                <Progress value={data.overview.engagementRate} className="h-2" />
                <p className="text-sm text-gray-600 mt-2">
                  Durchschnittliche Interaktionsrate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Ø Wiedergabezeit</h3>
                  <Clock className="h-5 w-5 text-orange-500" />
                </div>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {data.overview.avgWatchTime}s
                </div>
                <Progress value={(data.overview.avgWatchTime / 60) * 100} className="h-2" />
                <p className="text-sm text-gray-600 mt-2">
                  Durchschnittliche Sehdauer
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Reichweite</h3>
                  <Globe className="h-5 w-5 text-cyan-500" />
                </div>
                <div className="text-3xl font-bold text-cyan-600 mb-2">
                  {data.overview.reachRate}%
                </div>
                <Progress value={data.overview.reachRate} className="h-2" />
                <p className="text-sm text-gray-600 mt-2">
                  Anteil der erreichten Follower
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance-Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={data.trends.views.map((item, index) => ({
                  date: format(new Date(item.date), 'dd.MM'),
                  views: item.value,
                  likes: data.trends.likes[index]?.value || 0,
                  comments: data.trends.comments[index]?.value || 0,
                  revenue: data.trends.revenue[index]?.value || 0
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="views" fill="#3B82F6" name="Aufrufe" />
                  <Line yAxisId="left" type="monotone" dataKey="likes" stroke="#EF4444" name="Likes" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" name="Umsatz (€)" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          {/* Top Videos */}
          <Card>
            <CardHeader>
              <CardTitle>Top-performing Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.content.topVideos.slice(0, 5).map((video, index) => (
                  <div key={video.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-gray-400">
                      #{index + 1}
                    </div>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-20 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{video.title}</h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {formatNumber(video.views)}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {formatNumber(video.likes)}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {formatNumber(video.comments)}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {formatCurrency(video.revenue)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Performance by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Performance nach Kategorie</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.content.performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgViews" fill="#3B82F6" name="Ø Aufrufe" />
                  <Bar dataKey="avgLikes" fill="#EF4444" name="Ø Likes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Altersverteilung</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data.demographics.age}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="percentage"
                      nameKey="range"
                    >
                      {data.demographics.age.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gender Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Geschlechterverteilung</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data.demographics.gender}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="percentage"
                      nameKey="type"
                    >
                      {data.demographics.gender.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Location Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Geografische Verteilung</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.demographics.location.map((location, index) => (
                    <div key={location.country} className="flex items-center justify-between">
                      <span className="font-medium">{location.country}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={location.percentage} className="w-20 h-2" />
                        <span className="text-sm text-gray-600 w-12">
                          {location.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Geräte-Nutzung</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.demographics.device.map((device, index) => (
                    <div key={device.type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {device.type === 'Mobile' && <Smartphone className="h-5 w-5" />}
                        {device.type === 'Desktop' && <Monitor className="h-5 w-5" />}
                        {device.type === 'Tablet' && <Smartphone className="h-5 w-5" />}
                        <span className="font-medium">{device.type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={device.percentage} className="w-20 h-2" />
                        <span className="text-sm text-gray-600 w-12">
                          {device.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hourly Engagement */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement nach Tageszeit</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={data.engagement.hourly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="engagement" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Daily Engagement */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement nach Wochentag</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.engagement.daily}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="engagement" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Video Retention */}
          <Card>
            <CardHeader>
              <CardTitle>Video-Retention Kurve</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.engagement.retention}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="second" label={{ value: 'Sekunden', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Zuschauer (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="percentage" stroke="#EF4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Umsatz-Quellen</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data.revenue.sources}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="amount"
                      nameKey="source"
                    >
                      {data.revenue.sources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Gifts */}
            <Card>
              <CardHeader>
                <CardTitle>Beliebteste Geschenke</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.revenue.topGifts.map((gift, index) => (
                    <div key={gift.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {index === 0 && '🌹'}
                          {index === 1 && '❤️'}
                          {index === 2 && '💎'}
                          {index === 3 && '👑'}
                          {index === 4 && '🏰'}
                        </div>
                        <div>
                          <p className="font-medium">{gift.name}</p>
                          <p className="text-sm text-gray-600">{gift.count}x erhalten</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(gift.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Revenue */}
          <Card>
            <CardHeader>
              <CardTitle>Monatlicher Umsatz</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.revenue.monthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="amount" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span>Performance-Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Starke Performance</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Deine Videos in der Kategorie "Festival" performen 25% besser als der Durchschnitt.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Optimale Posting-Zeit</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Deine Zielgruppe ist zwischen 20-22 Uhr am aktivsten. Poste in diesem Zeitfenster für maximale Reichweite.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-800">Zielgruppen-Tipp</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    60% deiner Zuschauer sind weiblich und zwischen 18-24 Jahre alt. Erstelle Content, der diese Zielgruppe anspricht.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Growth Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-red-500" />
                  <span>Wachstums-Chancen</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageCircle className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Engagement steigern</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Beantworte mehr Kommentare! Videos mit aktiver Creator-Interaktion haben 40% höhere Engagement-Raten.
                  </p>
                </div>

                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-orange-800">Internationale Expansion</span>
                  </div>
                  <p className="text-sm text-orange-700">
                    10% deiner Zuschauer kommen aus den USA. Erstelle englische Untertitel für größere Reichweite.
                  </p>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-800">Monetarisierung</span>
                  </div>
                  <p className="text-sm text-red-700">
                    Deine Geschenke-Einnahmen sind um 15% gestiegen. Aktiviere Super Chat für zusätzliche Einnahmen.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-gold-500" />
                <span>Persönliche Empfehlungen</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-6 border rounded-lg">
                  <Calendar className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                  <h4 className="font-medium mb-2">Konsistenz</h4>
                  <p className="text-sm text-gray-600">
                    Poste 3-4 Videos pro Woche für optimales Wachstum
                  </p>
                </div>

                <div className="text-center p-6 border rounded-lg">
                  <Heart className="h-8 w-8 mx-auto mb-3 text-red-500" />
                  <h4 className="font-medium mb-2">Community</h4>
                  <p className="text-sm text-gray-600">
                    Interagiere täglich mit deinen Followern für stärkere Bindung
                  </p>
                </div>

                <div className="text-center p-6 border rounded-lg">
                  <TrendingUp className="h-8 w-8 mx-auto mb-3 text-green-500" />
                  <h4 className="font-medium mb-2">Trends</h4>
                  <p className="text-sm text-gray-600">
                    Nutze aktuelle Hashtags und Sounds für mehr Sichtbarkeit
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
