import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Heart, 
  MessageCircle, 
  Share, 
  MapPin, 
  Calendar, 
  Music, 
  Camera, 
  Star, 
  Award, 
  Crown, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Eye, 
  ThumbsUp, 
  Coffee, 
  Utensils, 
  Car, 
  Plane, 
  Home, 
  Building, 
  Store, 
  Phone, 
  Mail, 
  Instagram, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Youtube, 
  Twitch, 
  Discord, 
  Spotify, 
  Apple, 
  Search, 
  Filter, 
  SortAsc, 
  MoreHorizontal, 
  Settings, 
  Info, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Brain,
  Zap,
  Globe,
  Clock,
  Hash,
  AtSign,
  Bookmark,
  Flag,
  Send,
  UserMinus,
  Shield,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Scan,
  QrCode,
  Gift,
  DollarSign,
  Euro,
  ShoppingCart,
  Package,
  Truck,
  Bike,
  Walk,
  Headphones,
  Speaker,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Shuffle,
  Download,
  Upload,
  Save,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  Rocket,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Cpu,
  Database,
  Cloud,
  Wifi,
  Smartphone,
  Monitor,
  Video,
  Image,
  FileText,
  Mic,
  Volume2,
  Scissors,
  Palette,
  Wand2
} from 'lucide-react';
import { toast } from 'sonner';

interface FriendRecommendation {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  videos: number;
  isVerified: boolean;
  isPremium: boolean;
  location?: string;
  interests: string[];
  mutualFriends: number;
  compatibilityScore: number;
  reasonForRecommendation: string[];
  lastActive: string;
  joinedDate: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    spotify?: string;
  };
  stats: {
    totalLikes: number;
    totalViews: number;
    avgEngagement: number;
    topHashtags: string[];
  };
  connectionStrength: 'weak' | 'medium' | 'strong';
  recommendationType: 'ai' | 'mutual' | 'location' | 'interests' | 'trending' | 'similar';
}

interface MutualFriend {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  connectionDate: string;
}

interface FriendRequest {
  id: string;
  fromUser: FriendRecommendation;
  message?: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
}

interface SocialConnection {
  platform: string;
  username: string;
  followers: number;
  verified: boolean;
}

export const FriendRecommendationSystem: React.FC = () => {
  const [recommendations, setRecommendations] = useState<FriendRecommendation[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('recommendations');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('compatibility');

  // Generate AI-powered friend recommendations
  const generateRecommendations = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockRecommendations: FriendRecommendation[] = [
        {
          id: '1',
          username: 'nightlife_sarah',
          displayName: 'Sarah Martinez',
          avatar: '/api/placeholder/150/150',
          bio: 'Berlin Nightlife Explorer 🌃 | DJ & Content Creator | Club Reviews & Party Tips',
          followers: 45200,
          following: 1200,
          videos: 234,
          isVerified: true,
          isPremium: true,
          location: 'Berlin, Deutschland',
          interests: ['Nightlife', 'DJing', 'Electronic Music', 'Club Culture', 'Party Planning'],
          mutualFriends: 12,
          compatibilityScore: 94,
          reasonForRecommendation: [
            'Ähnliche Interessen: Nightlife & Electronic Music',
            '12 gemeinsame Freunde',
            'Beide in Berlin aktiv',
            'Ähnlicher Content-Stil',
            'Hohe Engagement-Rate'
          ],
          lastActive: '2 Stunden',
          joinedDate: 'März 2023',
          socialLinks: {
            instagram: '@nightlife_sarah',
            spotify: 'Sarah Martinez',
            youtube: 'SarahNightlife'
          },
          stats: {
            totalLikes: 2100000,
            totalViews: 15600000,
            avgEngagement: 8.7,
            topHashtags: ['#BerlinNightlife', '#ClubLife', '#DJSet', '#PartyVibes']
          },
          connectionStrength: 'strong',
          recommendationType: 'ai'
        },
        {
          id: '2',
          username: 'dj_maxpower',
          displayName: 'Max Power',
          avatar: '/api/placeholder/150/150',
          bio: 'Professional DJ 🎧 | Techno & House | Resident @Berghain | Booking: max@djbooking.com',
          followers: 89500,
          following: 890,
          videos: 156,
          isVerified: true,
          isPremium: true,
          location: 'Berlin, Deutschland',
          interests: ['DJing', 'Techno', 'House Music', 'Music Production', 'Club Events'],
          mutualFriends: 8,
          compatibilityScore: 91,
          reasonForRecommendation: [
            'Professioneller DJ wie du',
            'Ähnliche Musik-Genres',
            '8 gemeinsame Freunde',
            'Hohe Interaktionsrate',
            'Berghain Connection'
          ],
          lastActive: '1 Stunde',
          joinedDate: 'Januar 2023',
          socialLinks: {
            instagram: '@djmaxpower',
            spotify: 'DJ Max Power',
            youtube: 'MaxPowerDJ'
          },
          stats: {
            totalLikes: 3400000,
            totalViews: 22100000,
            avgEngagement: 12.3,
            topHashtags: ['#Techno', '#Berghain', '#DJLife', '#ElectronicMusic']
          },
          connectionStrength: 'strong',
          recommendationType: 'interests'
        },
        {
          id: '3',
          username: 'party_princess',
          displayName: 'Luna Schmidt',
          avatar: '/api/placeholder/150/150',
          bio: 'Party Lifestyle Blogger ✨ | Event Photographer | Fashion & Nightlife | Collaborations: luna@party.com',
          followers: 67800,
          following: 2100,
          videos: 445,
          isVerified: false,
          isPremium: true,
          location: 'München, Deutschland',
          interests: ['Party Photography', 'Fashion', 'Lifestyle', 'Events', 'Travel'],
          mutualFriends: 15,
          compatibilityScore: 87,
          reasonForRecommendation: [
            '15 gemeinsame Freunde',
            'Ähnlicher Content-Stil',
            'Event-Fotografie Interesse',
            'Hohe Community-Interaktion',
            'Lifestyle-Content-Creator'
          ],
          lastActive: '30 Minuten',
          joinedDate: 'Mai 2023',
          socialLinks: {
            instagram: '@party_princess',
            twitter: '@lunaparty'
          },
          stats: {
            totalLikes: 1800000,
            totalViews: 12400000,
            avgEngagement: 9.2,
            topHashtags: ['#PartyLife', '#Fashion', '#Events', '#Photography']
          },
          connectionStrength: 'medium',
          recommendationType: 'mutual'
        },
        {
          id: '4',
          username: 'club_reviewer',
          displayName: 'Tom Weber',
          avatar: '/api/placeholder/150/150',
          bio: 'Club & Event Reviewer 📝 | Nightlife Journalist | 500+ Venues reviewed | Press: tom@nightlife.media',
          followers: 34500,
          following: 890,
          videos: 189,
          isVerified: true,
          isPremium: false,
          location: 'Hamburg, Deutschland',
          interests: ['Club Reviews', 'Nightlife Journalism', 'Event Coverage', 'Music Industry', 'Travel'],
          mutualFriends: 6,
          compatibilityScore: 83,
          reasonForRecommendation: [
            'Nightlife-Experte wie du',
            'Professioneller Content-Creator',
            'Ähnliche Zielgruppe',
            'Kollaborations-Potenzial',
            'Branchenverbindungen'
          ],
          lastActive: '4 Stunden',
          joinedDate: 'Februar 2023',
          socialLinks: {
            instagram: '@clubreviewer',
            twitter: '@tomweber_clubs',
            linkedin: 'Tom Weber'
          },
          stats: {
            totalLikes: 890000,
            totalViews: 6700000,
            avgEngagement: 7.8,
            topHashtags: ['#ClubReview', '#Nightlife', '#Events', '#Music']
          },
          connectionStrength: 'medium',
          recommendationType: 'similar'
        },
        {
          id: '5',
          username: 'festival_hunter',
          displayName: 'Anna Müller',
          avatar: '/api/placeholder/150/150',
          bio: 'Festival Enthusiast 🎪 | Music Lover | Travel Blogger | 50+ Festivals visited | Next: Tomorrowland 2024',
          followers: 28900,
          following: 1500,
          videos: 312,
          isVerified: false,
          isPremium: false,
          location: 'Köln, Deutschland',
          interests: ['Festivals', 'Electronic Music', 'Travel', 'Photography', 'Music Events'],
          mutualFriends: 4,
          compatibilityScore: 79,
          reasonForRecommendation: [
            'Festival & Event-Interesse',
            'Electronic Music Fan',
            'Travel Content-Creator',
            'Ähnliche Altersgruppe',
            'Community-Engagement'
          ],
          lastActive: '6 Stunden',
          joinedDate: 'April 2023',
          socialLinks: {
            instagram: '@festivalhunter',
            youtube: 'Anna Festival'
          },
          stats: {
            totalLikes: 650000,
            totalViews: 4200000,
            avgEngagement: 6.4,
            topHashtags: ['#Festival', '#Music', '#Travel', '#EDM']
          },
          connectionStrength: 'weak',
          recommendationType: 'trending'
        },
        {
          id: '6',
          username: 'vinyl_collector',
          displayName: 'Marcus Klein',
          avatar: '/api/placeholder/150/150',
          bio: 'Vinyl Collector & Music Historian 🎵 | Rare Records | Music Education | 2000+ Vinyl Collection',
          followers: 19200,
          following: 650,
          videos: 98,
          isVerified: false,
          isPremium: true,
          location: 'Frankfurt, Deutschland',
          interests: ['Vinyl Records', 'Music History', 'Collecting', 'Audio Equipment', 'Music Education'],
          mutualFriends: 3,
          compatibilityScore: 75,
          reasonForRecommendation: [
            'Musik-Enthusiast',
            'Nischen-Content-Creator',
            'Hohe Content-Qualität',
            'Bildungs-Content',
            'Authentische Community'
          ],
          lastActive: '1 Tag',
          joinedDate: 'Juni 2023',
          socialLinks: {
            youtube: 'Vinyl Marcus',
            spotify: 'Marcus Klein'
          },
          stats: {
            totalLikes: 420000,
            totalViews: 2800000,
            avgEngagement: 11.2,
            topHashtags: ['#Vinyl', '#Music', '#Collecting', '#Audio']
          },
          connectionStrength: 'weak',
          recommendationType: 'interests'
        }
      ];

      // Generate friend requests
      const mockRequests: FriendRequest[] = [
        {
          id: '1',
          fromUser: mockRecommendations[0],
          message: 'Hey! Ich liebe deinen Nightlife-Content! Lass uns connecten! 🎉',
          timestamp: '2 Stunden',
          status: 'pending'
        },
        {
          id: '2',
          fromUser: mockRecommendations[2],
          message: 'Wir haben so viele gemeinsame Freunde! Würde gerne deine Events sehen 📸',
          timestamp: '5 Stunden',
          status: 'pending'
        },
        {
          id: '3',
          fromUser: {
            id: '7',
            username: 'music_producer',
            displayName: 'Alex Beats',
            avatar: '/api/placeholder/150/150',
            bio: 'Music Producer & Beat Maker',
            followers: 15600,
            following: 890,
            videos: 67,
            isVerified: false,
            isPremium: false,
            interests: ['Music Production'],
            mutualFriends: 2,
            compatibilityScore: 72,
            reasonForRecommendation: ['Music Interest'],
            lastActive: '3 Stunden',
            joinedDate: 'Juli 2023',
            stats: {
              totalLikes: 230000,
              totalViews: 1500000,
              avgEngagement: 8.9,
              topHashtags: ['#Beats', '#Producer']
            },
            connectionStrength: 'weak',
            recommendationType: 'interests'
          },
          timestamp: '1 Tag',
          status: 'pending'
        }
      ];

      setRecommendations(mockRecommendations);
      setFriendRequests(mockRequests);
      
      toast.success('Neue Freunde-Empfehlungen geladen!');
      
    } catch (error) {
      toast.error('Fehler beim Laden der Empfehlungen');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle friend request actions
  const handleFriendRequest = async (action: 'send' | 'accept' | 'decline', userId: string, requestId?: string) => {
    try {
      if (action === 'send') {
        toast.success('Freundschaftsanfrage gesendet!');
        // Update UI to show request sent
        setRecommendations(prev => 
          prev.map(rec => 
            rec.id === userId 
              ? { ...rec, requestSent: true } 
              : rec
          )
        );
      } else if (action === 'accept' && requestId) {
        toast.success('Freundschaftsanfrage angenommen!');
        setFriendRequests(prev => 
          prev.filter(req => req.id !== requestId)
        );
      } else if (action === 'decline' && requestId) {
        toast.info('Freundschaftsanfrage abgelehnt');
        setFriendRequests(prev => 
          prev.filter(req => req.id !== requestId)
        );
      }
    } catch (error) {
      toast.error('Aktion fehlgeschlagen');
    }
  };

  // Filter and sort recommendations
  const filteredRecommendations = recommendations
    .filter(rec => {
      if (filterType === 'all') return true;
      return rec.recommendationType === filterType;
    })
    .filter(rec => 
      rec.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.bio.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'compatibility':
          return b.compatibilityScore - a.compatibilityScore;
        case 'followers':
          return b.followers - a.followers;
        case 'mutual':
          return b.mutualFriends - a.mutualFriends;
        case 'recent':
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
        default:
          return b.compatibilityScore - a.compatibilityScore;
      }
    });

  // Auto-load recommendations on mount
  useEffect(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getConnectionStrengthIcon = (strength: string) => {
    switch (strength) {
      case 'strong': return <Zap className="h-4 w-4 text-green-500" />;
      case 'medium': return <Target className="h-4 w-4 text-yellow-500" />;
      case 'weak': return <Eye className="h-4 w-4 text-gray-500" />;
      default: return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRecommendationTypeIcon = (type: string) => {
    switch (type) {
      case 'ai': return <Brain className="h-4 w-4 text-purple-500" />;
      case 'mutual': return <Users className="h-4 w-4 text-blue-500" />;
      case 'location': return <MapPin className="h-4 w-4 text-green-500" />;
      case 'interests': return <Heart className="h-4 w-4 text-red-500" />;
      case 'trending': return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'similar': return <Star className="h-4 w-4 text-yellow-500" />;
      default: return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <Users className="h-8 w-8" />
            <span>Intelligentes Freunde-System</span>
            <Sparkles className="h-6 w-6 animate-pulse" />
          </CardTitle>
          <p className="text-blue-100">
            KI-gestützte Freunde-Empfehlungen basierend auf Interessen, Aktivitäten und sozialen Verbindungen
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={generateRecommendations} 
              disabled={isLoading}
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  KI analysiert...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Neue Empfehlungen
                </>
              )}
            </Button>
            
            <div className="flex items-center space-x-2 text-blue-100">
              <Activity className="h-4 w-4" />
              <span className="text-sm">{recommendations.length} Empfehlungen</span>
            </div>
            
            <div className="flex items-center space-x-2 text-blue-100">
              <UserPlus className="h-4 w-4" />
              <span className="text-sm">{friendRequests.length} Anfragen</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Suche nach Namen, Username oder Interessen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">Alle Typen</option>
                <option value="ai">KI-Empfehlungen</option>
                <option value="mutual">Gemeinsame Freunde</option>
                <option value="location">Standort</option>
                <option value="interests">Interessen</option>
                <option value="trending">Trending</option>
                <option value="similar">Ähnlich</option>
              </select>
              
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="compatibility">Kompatibilität</option>
                <option value="followers">Follower</option>
                <option value="mutual">Gemeinsame Freunde</option>
                <option value="recent">Zuletzt aktiv</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">
            Empfehlungen ({filteredRecommendations.length})
          </TabsTrigger>
          <TabsTrigger value="requests">
            Anfragen ({friendRequests.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecommendations.map((recommendation) => (
              <Card key={recommendation.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  {/* User Header */}
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={recommendation.avatar} />
                        <AvatarFallback>{recommendation.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {recommendation.isVerified && (
                        <CheckCircle className="absolute -top-1 -right-1 h-5 w-5 text-blue-500 bg-white rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold truncate">{recommendation.displayName}</h4>
                        {recommendation.isPremium && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">@{recommendation.username}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getRecommendationTypeIcon(recommendation.recommendationType)}
                        {getConnectionStrengthIcon(recommendation.connectionStrength)}
                        <span className={`text-xs px-2 py-1 rounded-full ${getCompatibilityColor(recommendation.compatibilityScore)}`}>
                          {recommendation.compatibilityScore}% Match
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {recommendation.bio}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center mb-3">
                    <div>
                      <div className="font-semibold text-sm">{(recommendation.followers / 1000).toFixed(1)}K</div>
                      <div className="text-xs text-gray-500">Follower</div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{recommendation.videos}</div>
                      <div className="text-xs text-gray-500">Videos</div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{recommendation.mutualFriends}</div>
                      <div className="text-xs text-gray-500">Gemeinsam</div>
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {recommendation.interests.slice(0, 3).map((interest, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                    {recommendation.interests.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{recommendation.interests.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Recommendation Reasons */}
                  <Alert className="mb-3 border-blue-500 bg-blue-50">
                    <Brain className="h-4 w-4 text-blue-500" />
                    <AlertDescription className="text-blue-800 text-xs">
                      <strong>KI-Empfehlung:</strong> {recommendation.reasonForRecommendation[0]}
                    </AlertDescription>
                  </Alert>

                  {/* Location & Activity */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    {recommendation.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{recommendation.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Aktiv vor {recommendation.lastActive}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleFriendRequest('send', recommendation.id)}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Hinzufügen
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Friend Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-blue-500" />
                <span>Freundschaftsanfragen</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {friendRequests.map((request) => (
                  <div key={request.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={request.fromUser.avatar} />
                      <AvatarFallback>{request.fromUser.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{request.fromUser.displayName}</h4>
                        {request.fromUser.isVerified && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                        <Badge variant="outline" className="text-xs">
                          {request.fromUser.mutualFriends} gemeinsame
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">@{request.fromUser.username}</p>
                      {request.message && (
                        <p className="text-sm text-gray-700 mt-1 italic">"{request.message}"</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">vor {request.timestamp}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm"
                        onClick={() => handleFriendRequest('accept', request.fromUser.id, request.id)}
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Annehmen
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleFriendRequest('decline', request.fromUser.id, request.id)}
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Ablehnen
                      </Button>
                    </div>
                  </div>
                ))}
                
                {friendRequests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <UserPlus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Keine neuen Freundschaftsanfragen</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">156</div>
                <div className="text-sm text-gray-600">Gesamte Freunde</div>
                <div className="text-xs text-green-600">+12 diese Woche</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">89%</div>
                <div className="text-sm text-gray-600">Annahmerate</div>
                <div className="text-xs text-green-600">+5% vs. letzter Monat</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">23</div>
                <div className="text-sm text-gray-600">Neue Empfehlungen</div>
                <div className="text-xs text-blue-600">KI-generiert</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">94%</div>
                <div className="text-sm text-gray-600">Ø Kompatibilität</div>
                <div className="text-xs text-green-600">Sehr hoch</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                <span>Freunde-Netzwerk Analyse</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Nightlife Community</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Music Creators</span>
                    <span>32%</span>
                  </div>
                  <Progress value={32} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Event Organizers</span>
                    <span>18%</span>
                  </div>
                  <Progress value={18} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Andere</span>
                    <span>5%</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
