import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  Share2, 
  MessageCircle, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  Play,
  DollarSign
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MarketingVideo {
  id: string;
  title: string;
  description: string;
  package_type: string;
  status: string;
  video_url: string;
  thumbnail_url: string;
  total_budget: number;
  budget_used: number;
  created_at: string;
  start_date: string;
  end_date: string;
}

interface Analytics {
  views: number;
  likes: number;
  shares: number;
  comments: number;
  followers_gained: number;
  engagement_rate: number;
}

export function MarketingDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [marketingVideos, setMarketingVideos] = useState<MarketingVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<MarketingVideo | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [summary, setSummary] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalFollowers: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMarketingData();
    }
  }, [user]);

  const fetchMarketingData = async () => {
    try {
      // Fetch marketing videos
      const { data: videos, error: videosError } = await supabase
        .from('marketing_videos')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (videosError) throw videosError;

      setMarketingVideos(videos || []);

      // Fetch user analytics summary
      const { data: summaryData, error: summaryError } = await supabase
        .from('user_analytics_summary')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (!summaryError && summaryData) {
        setSummary({
          totalVideos: summaryData.total_marketing_videos,
          totalViews: summaryData.total_views,
          totalFollowers: summaryData.total_followers_gained,
          totalSpent: summaryData.total_spent
        });
      }

      // Set first video as selected if available
      if (videos && videos.length > 0) {
        setSelectedVideo(videos[0]);
        fetchVideoAnalytics(videos[0].id);
      }

    } catch (error) {
      console.error('Error fetching marketing data:', error);
      toast({
        title: "Fehler beim Laden",
        description: "Marketing-Daten konnten nicht geladen werden",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVideoAnalytics = async (videoId: string) => {
    try {
      const { data, error } = await supabase
        .from('marketing_analytics')
        .select('*')
        .eq('marketing_video_id', videoId)
        .single();

      if (!error && data) {
        setAnalytics({
          views: data.views,
          likes: data.likes,
          shares: data.shares,
          comments: data.comments,
          followers_gained: data.followers_gained,
          engagement_rate: data.engagement_rate
        });
      } else {
        // Set default values if no analytics data
        setAnalytics({
          views: 0,
          likes: 0,
          shares: 0,
          comments: 0,
          followers_gained: 0,
          engagement_rate: 0
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'under_review':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'active':
        return <Play className="h-4 w-4 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Wartend';
      case 'under_review': return 'In Überprüfung';
      case 'approved': return 'Genehmigt';
      case 'rejected': return 'Abgelehnt';
      case 'active': return 'Aktiv';
      case 'completed': return 'Abgeschlossen';
      default: return status;
    }
  };

  const getPackageName = (type: string) => {
    switch (type) {
      case 'for_you_boost': return 'For You Video Boost';
      case 'video_campaign': return 'Video Werbekampagne';
      case 'viral_package': return 'Viral Video Paket';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Marketing Dashboard</h1>
        <p className="text-muted-foreground">
          Verwalte deine Marketing-Kampagnen und verfolge die Performance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Play className="h-4 w-4 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Marketing Videos</p>
                <p className="text-2xl font-bold">{summary.totalVideos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Total Views</p>
                <p className="text-2xl font-bold">{summary.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Neue Follower</p>
                <p className="text-2xl font-bold">{summary.totalFollowers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Ausgegeben</p>
                <p className="text-2xl font-bold">€{summary.totalSpent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Kampagnen</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          {marketingVideos.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Play className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Keine Marketing-Videos</h3>
                <p className="text-muted-foreground mb-4">
                  Du hast noch keine Marketing-Kampagnen gestartet.
                </p>
                <Button>Erste Kampagne starten</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {marketingVideos.map((video) => (
                <Card key={video.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        setSelectedVideo(video);
                        fetchVideoAnalytics(video.id);
                      }}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{video.title}</h3>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getStatusIcon(video.status)}
                            {getStatusText(video.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getPackageName(video.package_type)}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Budget: €{video.total_budget}</span>
                          <span>Verwendet: €{video.budget_used}</span>
                          <span>Erstellt: {new Date(video.created_at).toLocaleDateString('de-DE')}</span>
                        </div>
                      </div>
                      
                      {video.thumbnail_url && (
                        <img 
                          src={video.thumbnail_url} 
                          alt={video.title}
                          className="w-24 h-16 object-cover rounded"
                        />
                      )}
                    </div>

                    {/* Budget Progress */}
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Budget-Verwendung</span>
                        <span>{Math.round((video.budget_used / video.total_budget) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(video.budget_used / video.total_budget) * 100} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {selectedVideo && analytics ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedVideo.title}</CardTitle>
                  <CardDescription>
                    Performance-Daten für deine {getPackageName(selectedVideo.package_type)} Kampagne
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">Views</p>
                        <p className="text-2xl font-bold">{analytics.views.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="text-sm font-medium">Likes</p>
                        <p className="text-2xl font-bold">{analytics.likes.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Share2 className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">Shares</p>
                        <p className="text-2xl font-bold">{analytics.shares.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="text-sm font-medium">Kommentare</p>
                        <p className="text-2xl font-bold">{analytics.comments.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="text-sm font-medium">Neue Follower</p>
                        <p className="text-2xl font-bold">{analytics.followers_gained}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-indigo-500" />
                      <div>
                        <p className="text-sm font-medium">Engagement Rate</p>
                        <p className="text-2xl font-bold">{analytics.engagement_rate}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Keine Analytics verfügbar</h3>
                <p className="text-muted-foreground">
                  Wähle ein Marketing-Video aus, um die Performance-Daten zu sehen.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}