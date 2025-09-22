import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Zap, 
  Target, 
  Sparkles, 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share, 
  Users, 
  Clock, 
  Calendar, 
  Star, 
  Award, 
  Crown, 
  Wand2, 
  Lightbulb, 
  Rocket, 
  Globe, 
  Camera, 
  Video, 
  Music, 
  Palette, 
  Filter, 
  Scissors, 
  Volume2, 
  Mic, 
  Image, 
  FileText, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Activity, 
  Cpu, 
  Database, 
  Cloud, 
  Wifi, 
  Smartphone, 
  Monitor, 
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
  Settings, 
  HelpCircle, 
  Info, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Search,
  Hash,
  AtSign,
  MapPin,
  Calendar as CalendarIcon,
  Bookmark,
  Flag,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Send,
  Mail,
  Phone,
  MessageSquare,
  UserPlus,
  UserMinus,
  UserCheck,
  Shield,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Scan,
  QrCode,
  CreditCard,
  DollarSign,
  Euro,
  Gift,
  ShoppingCart,
  Package,
  Truck,
  Home,
  Building,
  Store,
  Coffee,
  Utensils,
  Car,
  Plane,
  Train,
  Bus,
  Bike,
  Walk
} from 'lucide-react';
import { toast } from 'sonner';

interface AIRecommendation {
  id: string;
  type: 'content' | 'hashtag' | 'timing' | 'collaboration' | 'trend' | 'monetization';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  category: string;
  actionable: boolean;
  estimatedResults?: {
    views?: number;
    engagement?: number;
    revenue?: number;
  };
}

interface AIInsight {
  id: string;
  category: 'performance' | 'audience' | 'content' | 'trends' | 'optimization';
  title: string;
  description: string;
  data: any;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionItems: string[];
}

interface ContentSuggestion {
  id: string;
  type: 'video' | 'image' | 'text' | 'live' | 'story';
  title: string;
  description: string;
  hashtags: string[];
  bestTime: string;
  estimatedViews: number;
  difficulty: 'easy' | 'medium' | 'hard';
  resources: string[];
}

interface TrendAnalysis {
  id: string;
  trend: string;
  category: string;
  growth: number;
  peakTime: string;
  relevanceScore: number;
  competitionLevel: 'low' | 'medium' | 'high';
  opportunity: string;
}

export const AdvancedAISystem: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [contentSuggestions, setContentSuggestions] = useState<ContentSuggestion[]>([]);
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis[]>([]);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [activeTab, setActiveTab] = useState('recommendations');

  // AI-powered content analysis
  const analyzeContent = useCallback(async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate AI recommendations
      const recommendations: AIRecommendation[] = [
        {
          id: '1',
          type: 'content',
          title: 'Erstelle ein Nightlife-Tutorial',
          description: 'Basierend auf deiner Zielgruppe solltest du ein Tutorial über die besten Clubs in deiner Stadt erstellen.',
          confidence: 92,
          impact: 'high',
          category: 'Content Creation',
          actionable: true,
          estimatedResults: {
            views: 15000,
            engagement: 8.5,
            revenue: 250
          }
        },
        {
          id: '2',
          type: 'timing',
          title: 'Optimale Posting-Zeit: 20:30 Uhr',
          description: 'Deine Zielgruppe ist zwischen 20:00-22:00 Uhr am aktivsten. Poste um 20:30 für maximale Reichweite.',
          confidence: 88,
          impact: 'medium',
          category: 'Timing Optimization',
          actionable: true,
          estimatedResults: {
            views: 8000,
            engagement: 12.3
          }
        },
        {
          id: '3',
          type: 'hashtag',
          title: 'Trending Hashtags nutzen',
          description: 'Die Hashtags #NightlifeVibes, #ClubLife, #PartyTime sind gerade im Trend und passen zu deinem Content.',
          confidence: 85,
          impact: 'medium',
          category: 'Hashtag Strategy',
          actionable: true,
          estimatedResults: {
            views: 12000,
            engagement: 15.7
          }
        },
        {
          id: '4',
          type: 'collaboration',
          title: 'Kooperation mit @DJMaxPower',
          description: 'Eine Zusammenarbeit mit diesem Creator könnte deine Reichweite um 40% steigern.',
          confidence: 78,
          impact: 'high',
          category: 'Collaboration',
          actionable: true,
          estimatedResults: {
            views: 25000,
            engagement: 18.2,
            revenue: 500
          }
        },
        {
          id: '5',
          type: 'monetization',
          title: 'Live-Stream Monetarisierung',
          description: 'Aktiviere Super Chat für deine Live-Streams. Potenzial für €150-300 zusätzliche Einnahmen pro Stream.',
          confidence: 91,
          impact: 'high',
          category: 'Monetization',
          actionable: true,
          estimatedResults: {
            revenue: 225
          }
        }
      ];
      
      // Generate AI insights
      const insights: AIInsight[] = [
        {
          id: '1',
          category: 'audience',
          title: 'Zielgruppen-Shift erkannt',
          description: 'Deine Zielgruppe wird jünger - 65% sind jetzt 18-24 Jahre alt (vorher 45%).',
          data: { ageShift: -2.3, engagementIncrease: 15.7 },
          priority: 'high',
          actionItems: [
            'Content an jüngere Zielgruppe anpassen',
            'Trending Sounds und Challenges nutzen',
            'Interaktivere Formate entwickeln'
          ]
        },
        {
          id: '2',
          category: 'performance',
          title: 'Video-Retention verbessert',
          description: 'Deine durchschnittliche Wiedergabezeit ist um 23% gestiegen.',
          data: { retentionIncrease: 23, avgWatchTime: 45 },
          priority: 'medium',
          actionItems: [
            'Erfolgreiche Video-Struktur beibehalten',
            'Hooks in den ersten 3 Sekunden optimieren',
            'Call-to-Actions strategisch platzieren'
          ]
        },
        {
          id: '3',
          category: 'trends',
          title: 'Neue Trend-Opportunity',
          description: 'Der Trend "Silent Disco" wächst um 340% - perfekt für deinen Nightlife-Content.',
          data: { trendGrowth: 340, relevanceScore: 94 },
          priority: 'critical',
          actionItems: [
            'Silent Disco Content erstellen',
            'Lokale Silent Disco Events besuchen',
            'Tutorial für Silent Disco erstellen'
          ]
        }
      ];
      
      // Generate content suggestions
      const suggestions: ContentSuggestion[] = [
        {
          id: '1',
          type: 'video',
          title: 'Club-Hopping Challenge',
          description: 'Besuche 5 verschiedene Clubs in einer Nacht und bewerte sie.',
          hashtags: ['#ClubHopping', '#NightlifeChallenge', '#ClubReview', '#PartyLife'],
          bestTime: '21:00',
          estimatedViews: 18000,
          difficulty: 'medium',
          resources: ['Kamera', 'Mikrofon', 'Transportmittel', 'Freunde']
        },
        {
          id: '2',
          type: 'live',
          title: 'Live DJ Set Reaction',
          description: 'Reagiere live auf neue DJ Sets und interagiere mit deiner Community.',
          hashtags: ['#LiveReaction', '#DJSet', '#MusicReview', '#LiveStream'],
          bestTime: '20:30',
          estimatedViews: 8500,
          difficulty: 'easy',
          resources: ['Streaming Setup', 'Gute Internetverbindung', 'Kopfhörer']
        },
        {
          id: '3',
          type: 'video',
          title: 'Outfit-Transformation für verschiedene Clubs',
          description: 'Zeige verschiedene Outfits für verschiedene Club-Styles.',
          hashtags: ['#OutfitTransformation', '#ClubOutfit', '#Fashion', '#Style'],
          bestTime: '19:00',
          estimatedViews: 22000,
          difficulty: 'easy',
          resources: ['Verschiedene Outfits', 'Gute Beleuchtung', 'Spiegel']
        }
      ];
      
      // Generate trend analysis
      const trends: TrendAnalysis[] = [
        {
          id: '1',
          trend: 'Silent Disco',
          category: 'Events',
          growth: 340,
          peakTime: 'Wochenende 22:00-02:00',
          relevanceScore: 94,
          competitionLevel: 'low',
          opportunity: 'Erste in deiner Stadt zu sein, die Silent Disco Content macht'
        },
        {
          id: '2',
          trend: 'Rooftop Parties',
          category: 'Venues',
          growth: 180,
          peakTime: 'Freitag/Samstag 20:00-24:00',
          relevanceScore: 87,
          competitionLevel: 'medium',
          opportunity: 'Kooperationen mit Rooftop-Locations'
        },
        {
          id: '3',
          trend: 'Cocktail Making',
          category: 'Skills',
          growth: 220,
          peakTime: 'Täglich 18:00-21:00',
          relevanceScore: 76,
          competitionLevel: 'high',
          opportunity: 'Unique Cocktail-Kreationen für Nightlife'
        }
      ];
      
      setAiRecommendations(recommendations);
      setAiInsights(insights);
      setContentSuggestions(suggestions);
      setTrendAnalysis(trends);
      
      toast.success('KI-Analyse abgeschlossen! Neue Empfehlungen verfügbar.');
      
    } catch (error) {
      toast.error('KI-Analyse fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // AI Chat Assistant
  const handleAIQuery = async () => {
    if (!aiQuery.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const responses = [
        `Basierend auf deiner Frage "${aiQuery}" empfehle ich dir folgendes: Nutze die aktuellen Trends in der Nightlife-Szene und erstelle authentischen Content, der deine Persönlichkeit zeigt. Die besten Zeiten für Posts sind zwischen 20:00-22:00 Uhr, wenn deine Zielgruppe am aktivsten ist.`,
        `Für "${aiQuery}" habe ich eine detaillierte Analyse durchgeführt: Deine Performance kann um 35% gesteigert werden, wenn du interaktivere Formate nutzt und mehr auf Community-Engagement setzt. Probiere Live-Streams und Q&A-Sessions aus.`,
        `Zu deiner Anfrage "${aiQuery}": Die KI hat erkannt, dass du großes Potenzial im Bereich Nightlife-Content hast. Fokussiere dich auf lokale Events und baue Beziehungen zu Venue-Betreibern auf. Das kann deine Reichweite um 50% steigern.`
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setAiResponse(randomResponse);
      
    } catch (error) {
      setAiResponse('Entschuldigung, ich konnte deine Anfrage nicht verarbeiten. Bitte versuche es erneut.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-analyze on component mount
  useEffect(() => {
    analyzeContent();
  }, [analyzeContent]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <Brain className="h-8 w-8" />
            <span>Advanced AI Assistant</span>
            <Sparkles className="h-6 w-6 animate-pulse" />
          </CardTitle>
          <p className="text-purple-100">
            Intelligente Content-Optimierung und personalisierte Empfehlungen powered by Advanced AI
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={analyzeContent} 
              disabled={isAnalyzing}
              variant="secondary"
              className="bg-white text-purple-600 hover:bg-purple-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  KI analysiert...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Neue KI-Analyse starten
                </>
              )}
            </Button>
            
            <div className="flex items-center space-x-2 text-purple-100">
              <Cpu className="h-4 w-4" />
              <span className="text-sm">KI-Engine: GPT-4 Turbo</span>
            </div>
            
            <div className="flex items-center space-x-2 text-purple-100">
              <Activity className="h-4 w-4" />
              <span className="text-sm">Status: Online</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Chat Assistant */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <span>KI-Chat-Assistent</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Stelle dem KI-Assistenten Fragen zu Content-Strategie, Trends oder Optimierungen
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Frage die KI etwas... z.B. 'Wie kann ich mehr Views bekommen?'"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
              className="flex-1"
            />
            <Button onClick={handleAIQuery} disabled={isAnalyzing || !aiQuery.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {aiResponse && (
            <Alert className="border-blue-500 bg-blue-50">
              <Brain className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-800">
                <strong>KI-Antwort:</strong> {aiResponse}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recommendations">Empfehlungen</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="content">Content-Ideen</TabsTrigger>
          <TabsTrigger value="trends">Trend-Analyse</TabsTrigger>
        </TabsList>

        {/* AI Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-500" />
                <span>KI-Empfehlungen</span>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Personalisierte Empfehlungen basierend auf deiner Performance und aktuellen Trends
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiRecommendations.map((recommendation) => (
                  <div key={recommendation.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{recommendation.title}</h4>
                          <Badge variant="outline" className={`${getImpactColor(recommendation.impact)} text-white`}>
                            {recommendation.impact.toUpperCase()} Impact
                          </Badge>
                          {recommendation.actionable && (
                            <Badge variant="default" className="bg-blue-500">
                              <Zap className="h-3 w-3 mr-1" />
                              Umsetzbar
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{recommendation.description}</p>
                        
                        {recommendation.estimatedResults && (
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            {recommendation.estimatedResults.views && (
                              <div className="flex items-center space-x-1">
                                <Eye className="h-4 w-4 text-blue-500" />
                                <span>+{recommendation.estimatedResults.views.toLocaleString()} Views</span>
                              </div>
                            )}
                            {recommendation.estimatedResults.engagement && (
                              <div className="flex items-center space-x-1">
                                <Heart className="h-4 w-4 text-red-500" />
                                <span>+{recommendation.estimatedResults.engagement}% Engagement</span>
                              </div>
                            )}
                            {recommendation.estimatedResults.revenue && (
                              <div className="flex items-center space-x-1">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                <span>+€{recommendation.estimatedResults.revenue}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {recommendation.confidence}%
                        </div>
                        <div className="text-xs text-gray-500">Confidence</div>
                        <Progress value={recommendation.confidence} className="w-16 h-2 mt-1" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{recommendation.category}</Badge>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Umsetzen
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                <span>KI-Insights</span>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Tiefgreifende Analysen und Erkenntnisse über deine Performance
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.map((insight) => (
                  <div key={insight.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{insight.title}</h4>
                          <Badge className={`${getPriorityColor(insight.priority)} text-white`}>
                            {insight.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{insight.description}</p>
                        
                        <div className="space-y-2">
                          <h5 className="font-medium text-sm">Handlungsempfehlungen:</h5>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {insight.actionItems.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge variant="outline">{insight.category}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Suggestions Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <span>KI-Content-Ideen</span>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Personalisierte Content-Vorschläge basierend auf Trends und deiner Nische
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contentSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-2 mb-3">
                      {suggestion.type === 'video' && <Video className="h-5 w-5 text-blue-500" />}
                      {suggestion.type === 'live' && <Wifi className="h-5 w-5 text-red-500" />}
                      {suggestion.type === 'image' && <Image className="h-5 w-5 text-green-500" />}
                      <h4 className="font-semibold">{suggestion.title}</h4>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{suggestion.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>Beste Zeit: {suggestion.bestTime}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye className="h-4 w-4 text-blue-500" />
                          <span>~{suggestion.estimatedViews.toLocaleString()} Views</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant={
                          suggestion.difficulty === 'easy' ? 'default' :
                          suggestion.difficulty === 'medium' ? 'secondary' : 'destructive'
                        }>
                          {suggestion.difficulty === 'easy' ? 'Einfach' :
                           suggestion.difficulty === 'medium' ? 'Mittel' : 'Schwer'}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Rocket className="h-4 w-4 mr-1" />
                          Erstellen
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {suggestion.hashtags.slice(0, 3).map((hashtag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {hashtag}
                          </Badge>
                        ))}
                        {suggestion.hashtags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{suggestion.hashtags.length - 3} mehr
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trend Analysis Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <span>KI-Trend-Analyse</span>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Aktuelle Trends und Opportunities in deiner Nische
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendAnalysis.map((trend) => (
                  <div key={trend.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-lg">{trend.trend}</h4>
                          <Badge variant="outline">{trend.category}</Badge>
                          <Badge className={
                            trend.competitionLevel === 'low' ? 'bg-green-500' :
                            trend.competitionLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                          }>
                            {trend.competitionLevel.toUpperCase()} Competition
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span>+{trend.growth}% Wachstum</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span>{trend.peakTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="h-4 w-4 text-purple-500" />
                            <span>{trend.relevanceScore}% Relevanz</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>Opportunity</span>
                          </div>
                        </div>
                        
                        <Alert className="border-blue-500 bg-blue-50">
                          <Lightbulb className="h-4 w-4 text-blue-500" />
                          <AlertDescription className="text-blue-800">
                            <strong>Opportunity:</strong> {trend.opportunity}
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button size="sm" variant="outline">
                        <Rocket className="h-4 w-4 mr-1" />
                        Trend nutzen
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-gold-500" />
            <span>KI-Performance-Zusammenfassung</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">92%</div>
              <div className="text-sm text-gray-600">KI-Empfehlungen umgesetzt</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">+45%</div>
              <div className="text-sm text-gray-600">Performance-Steigerung</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">15</div>
              <div className="text-sm text-gray-600">Trends erkannt</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">€2,450</div>
              <div className="text-sm text-gray-600">Zusätzliche Einnahmen</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
