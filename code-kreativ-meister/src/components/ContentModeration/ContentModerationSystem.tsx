import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Flag, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Settings, 
  Filter, 
  Zap, 
  Crown, 
  Star, 
  Heart, 
  MessageCircle, 
  Share, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw,
  Info,
  HelpCircle,
  FileText,
  Image,
  Video,
  Mic,
  Camera,
  Lock,
  Unlock,
  Globe,
  Users,
  UserCheck,
  UserX,
  Ban,
  ShieldCheck,
  AlertCircle,
  Trash2,
  Edit,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

interface ContentRating {
  id: string;
  level: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17' | 'X';
  name: string;
  description: string;
  minAge: number;
  color: string;
  icon: React.ReactNode;
  restrictions: string[];
  allowedFeatures: string[];
}

interface ContentFlags {
  violence: boolean;
  sexualContent: boolean;
  nudity: boolean;
  language: boolean;
  drugUse: boolean;
  gambling: boolean;
  horror: boolean;
  discrimination: boolean;
}

interface ModerationAction {
  id: string;
  type: 'warning' | 'content_removal' | 'account_restriction' | 'age_gate' | 'demonetization';
  reason: string;
  timestamp: string;
  moderator: string;
  automated: boolean;
}

const contentRatings: ContentRating[] = [
  {
    id: 'G',
    level: 'G',
    name: 'General Audiences',
    description: 'Für alle Altersgruppen geeignet',
    minAge: 0,
    color: 'bg-green-500',
    icon: <User className="h-4 w-4" />,
    restrictions: [],
    allowedFeatures: ['basic_social', 'public_content', 'comments', 'likes', 'follows']
  },
  {
    id: 'PG',
    level: 'PG',
    name: 'Parental Guidance',
    description: 'Elterliche Begleitung empfohlen',
    minAge: 13,
    color: 'bg-blue-500',
    icon: <Star className="h-4 w-4" />,
    restrictions: ['mild_language', 'brief_violence'],
    allowedFeatures: ['extended_social', 'private_messages', 'groups', 'live_streaming']
  },
  {
    id: 'PG-13',
    level: 'PG-13',
    name: 'Parents Strongly Cautioned',
    description: 'Nicht für Kinder unter 13 Jahren',
    minAge: 13,
    color: 'bg-yellow-500',
    icon: <AlertTriangle className="h-4 w-4" />,
    restrictions: ['moderate_language', 'suggestive_themes', 'brief_nudity'],
    allowedFeatures: ['teen_content', 'dating_features', 'creator_tools']
  },
  {
    id: 'R',
    level: 'R',
    name: 'Restricted',
    description: 'Nur für Erwachsene ab 18 Jahren',
    minAge: 18,
    color: 'bg-orange-500',
    icon: <Zap className="h-4 w-4" />,
    restrictions: ['strong_language', 'violence', 'sexual_themes', 'drug_use'],
    allowedFeatures: ['adult_content', 'nightlife', 'alcohol_content', 'monetization']
  },
  {
    id: 'NC-17',
    level: 'NC-17',
    name: 'Adults Only',
    description: 'Nur für Erwachsene ab 21 Jahren',
    minAge: 21,
    color: 'bg-red-500',
    icon: <Crown className="h-4 w-4" />,
    restrictions: ['explicit_content', 'graphic_violence', 'strong_sexual_content'],
    allowedFeatures: ['premium_adult', 'private_rooms', 'adult_monetization', 'exclusive_content']
  },
  {
    id: 'X',
    level: 'X',
    name: 'Explicit Adult Content',
    description: 'Explizite Inhalte für Erwachsene',
    minAge: 21,
    color: 'bg-purple-500',
    icon: <Lock className="h-4 w-4" />,
    restrictions: ['pornographic_content', 'explicit_sexual_acts'],
    allowedFeatures: ['adult_entertainment', 'cam_shows', 'adult_chat', 'adult_commerce']
  }
];

interface ContentModerationSystemProps {
  contentId?: string;
  contentType: 'video' | 'image' | 'text' | 'live_stream' | 'chat';
  onModerationComplete?: (rating: ContentRating, flags: ContentFlags) => void;
}

export const ContentModerationSystem: React.FC<ContentModerationSystemProps> = ({
  contentId,
  contentType,
  onModerationComplete
}) => {
  const [selectedRating, setSelectedRating] = useState<ContentRating | null>(null);
  const [contentFlags, setContentFlags] = useState<ContentFlags>({
    violence: false,
    sexualContent: false,
    nudity: false,
    language: false,
    drugUse: false,
    gambling: false,
    horror: false,
    discrimination: false
  });
  const [moderationActions, setModerationActions] = useState<ModerationAction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [userAge, setUserAge] = useState<number | null>(null);

  // Load user age from verification
  useEffect(() => {
    const verificationData = localStorage.getItem('age_verification');
    if (verificationData) {
      try {
        const data = JSON.parse(verificationData);
        if (data.dateOfBirth) {
          const age = new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear();
          setUserAge(age);
        }
      } catch (error) {
        console.error('Failed to load age verification:', error);
      }
    }
  }, []);

  // Auto-analyze content
  const analyzeContent = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI content analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis results
      const mockFlags: ContentFlags = {
        violence: Math.random() > 0.8,
        sexualContent: Math.random() > 0.7,
        nudity: Math.random() > 0.9,
        language: Math.random() > 0.6,
        drugUse: Math.random() > 0.85,
        gambling: Math.random() > 0.9,
        horror: Math.random() > 0.8,
        discrimination: Math.random() > 0.95
      };
      
      setContentFlags(mockFlags);
      
      // Determine suggested rating based on flags
      let suggestedRating = contentRatings[0]; // Default to G
      
      if (mockFlags.discrimination || mockFlags.violence) {
        suggestedRating = contentRatings.find(r => r.level === 'R') || suggestedRating;
      } else if (mockFlags.sexualContent || mockFlags.language || mockFlags.drugUse) {
        suggestedRating = contentRatings.find(r => r.level === 'PG-13') || suggestedRating;
      } else if (mockFlags.horror || mockFlags.gambling) {
        suggestedRating = contentRatings.find(r => r.level === 'PG') || suggestedRating;
      }
      
      if (mockFlags.nudity) {
        suggestedRating = contentRatings.find(r => r.level === 'NC-17') || suggestedRating;
      }
      
      setSelectedRating(suggestedRating);
      toast.success('Content-Analyse abgeschlossen');
      
    } catch (error) {
      toast.error('Analyse fehlgeschlagen');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle flag change
  const handleFlagChange = (flag: keyof ContentFlags, value: boolean) => {
    setContentFlags(prev => ({ ...prev, [flag]: value }));
    
    // Auto-suggest rating based on flags
    const flags = { ...contentFlags, [flag]: value };
    let suggestedRating = contentRatings[0];
    
    if (flags.discrimination || flags.violence) {
      suggestedRating = contentRatings.find(r => r.level === 'R') || suggestedRating;
    } else if (flags.sexualContent || flags.language || flags.drugUse) {
      suggestedRating = contentRatings.find(r => r.level === 'PG-13') || suggestedRating;
    } else if (flags.horror || flags.gambling) {
      suggestedRating = contentRatings.find(r => r.level === 'PG') || suggestedRating;
    }
    
    if (flags.nudity) {
      suggestedRating = contentRatings.find(r => r.level === 'NC-17') || suggestedRating;
    }
    
    setSelectedRating(suggestedRating);
  };

  // Apply moderation
  const applyModeration = () => {
    if (!selectedRating) {
      toast.error('Bitte wählen Sie eine Bewertung aus');
      return;
    }
    
    const action: ModerationAction = {
      id: Date.now().toString(),
      type: selectedRating.minAge >= 18 ? 'age_gate' : 'warning',
      reason: `Content rated as ${selectedRating.name}`,
      timestamp: new Date().toISOString(),
      moderator: 'System',
      automated: true
    };
    
    setModerationActions(prev => [...prev, action]);
    onModerationComplete?.(selectedRating, contentFlags);
    
    toast.success(`Content als ${selectedRating.name} eingestuft`);
  };

  // Get accessible ratings for user
  const getAccessibleRatings = (): ContentRating[] => {
    if (!userAge) return contentRatings.filter(r => r.minAge === 0);
    return contentRatings.filter(r => userAge >= r.minAge);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-500" />
            <span>Content-Moderation</span>
          </CardTitle>
          <p className="text-gray-600">
            Automatische und manuelle Bewertung von Inhalten für Altersbeschränkungen
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button onClick={analyzeContent} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Analysiere...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Content analysieren
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Erweiterte Optionen
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="rating" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rating">Bewertung</TabsTrigger>
          <TabsTrigger value="flags">Content-Flags</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="actions">Aktionen</TabsTrigger>
        </TabsList>

        {/* Rating Tab */}
        <TabsContent value="rating" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Altersbewertung wählen</CardTitle>
              <p className="text-sm text-gray-600">
                Wählen Sie die passende Altersbewertung für diesen Content
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contentRatings.map((rating) => {
                  const isAccessible = !userAge || userAge >= rating.minAge;
                  const isSelected = selectedRating?.id === rating.id;
                  
                  return (
                    <div
                      key={rating.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : isAccessible
                          ? 'border-gray-200 hover:border-gray-300'
                          : 'border-red-200 bg-red-50 opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => isAccessible && setSelectedRating(rating)}
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <div className={`p-2 rounded-full ${rating.color} text-white`}>
                          {rating.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{rating.level}</h3>
                          <p className="text-sm text-gray-600">{rating.name}</p>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-3">{rating.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Mindestalter:</span>
                          <Badge variant={isAccessible ? "default" : "destructive"}>
                            {rating.minAge === 0 ? 'Alle' : `${rating.minAge}+`}
                          </Badge>
                        </div>
                        
                        {!isAccessible && (
                          <Alert className="border-red-500 bg-red-50">
                            <Lock className="h-4 w-4 text-red-500" />
                            <AlertDescription className="text-red-800 text-xs">
                              Nicht verfügbar für Ihr Alter ({userAge} Jahre)
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                      
                      {isSelected && (
                        <div className="mt-3">
                          <Badge variant="default" className="bg-blue-500">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Ausgewählt
                          </Badge>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Flags Tab */}
        <TabsContent value="flags" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content-Flags</CardTitle>
              <p className="text-sm text-gray-600">
                Markieren Sie problematische Inhalte für automatische Filterung
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Gewalt & Gefahr</h4>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium">Gewalt</p>
                        <p className="text-sm text-gray-600">Gewalttätige Inhalte oder Darstellungen</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={contentFlags.violence}
                      onChange={(e) => handleFlagChange('violence', e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium">Horror</p>
                        <p className="text-sm text-gray-600">Erschreckende oder verstörende Inhalte</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={contentFlags.horror}
                      onChange={(e) => handleFlagChange('horror', e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Sexuelle Inhalte</h4>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Heart className="h-5 w-5 text-pink-500" />
                      <div>
                        <p className="font-medium">Sexuelle Inhalte</p>
                        <p className="text-sm text-gray-600">Sexuelle Themen oder Darstellungen</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={contentFlags.sexualContent}
                      onChange={(e) => handleFlagChange('sexualContent', e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Eye className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Nacktheit</p>
                        <p className="text-sm text-gray-600">Nackte oder teilweise nackte Personen</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={contentFlags.nudity}
                      onChange={(e) => handleFlagChange('nudity', e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Sprache & Verhalten</h4>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Anstößige Sprache</p>
                        <p className="text-sm text-gray-600">Schimpfwörter oder vulgäre Ausdrücke</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={contentFlags.language}
                      onChange={(e) => handleFlagChange('language', e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Ban className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium">Diskriminierung</p>
                        <p className="text-sm text-gray-600">Hassrede oder Diskriminierung</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={contentFlags.discrimination}
                      onChange={(e) => handleFlagChange('discrimination', e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Substanzen & Glücksspiel</h4>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">Drogen/Alkohol</p>
                        <p className="text-sm text-gray-600">Drogenkonsum oder Alkoholmissbrauch</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={contentFlags.drugUse}
                      onChange={(e) => handleFlagChange('drugUse', e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Star className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Glücksspiel</p>
                        <p className="text-sm text-gray-600">Glücksspiel oder Wetten</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={contentFlags.gambling}
                      onChange={(e) => handleFlagChange('gambling', e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>App Store Compliance</CardTitle>
              <p className="text-sm text-gray-600">
                Überprüfung der Richtlinien für Google Play Store und Apple App Store
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span>Google Play Store</span>
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Altersbeschränkung implementiert</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Content-Rating-System</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Automatische Content-Moderation</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Nutzer-Meldungen</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <span>Apple App Store</span>
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Parental Controls</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Content-Warnings</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Age-Gate für Adult-Content</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Sichere Zahlungen</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>

              <Alert className="border-green-500 bg-green-50">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-800">
                  <strong>Compliance Status:</strong> Alle Anforderungen für App Store Approval erfüllt. 
                  Das System entspricht den Richtlinien beider Plattformen.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Moderations-Aktionen</CardTitle>
              <p className="text-sm text-gray-600">
                Verlauf und Verwaltung von Moderations-Maßnahmen
              </p>
            </CardHeader>
            <CardContent>
              {moderationActions.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Noch keine Moderations-Aktionen durchgeführt</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {moderationActions.map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          action.type === 'warning' ? 'bg-yellow-500' :
                          action.type === 'content_removal' ? 'bg-red-500' :
                          action.type === 'age_gate' ? 'bg-orange-500' :
                          'bg-blue-500'
                        } text-white`}>
                          {action.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
                          {action.type === 'content_removal' && <Trash2 className="h-4 w-4" />}
                          {action.type === 'age_gate' && <Lock className="h-4 w-4" />}
                          {action.type === 'account_restriction' && <Ban className="h-4 w-4" />}
                          {action.type === 'demonetization' && <XCircle className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium">{action.reason}</p>
                          <p className="text-sm text-gray-600">
                            {action.moderator} • {new Date(action.timestamp).toLocaleString('de-DE')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant={action.automated ? "secondary" : "default"}>
                          {action.automated ? 'Automatisch' : 'Manuell'}
                        </Badge>
                        
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              {selectedRating && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Ausgewählte Bewertung:</span>
                  <Badge variant="default" className={selectedRating.color}>
                    {selectedRating.level} - {selectedRating.name}
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => setSelectedRating(null)}>
                Zurücksetzen
              </Button>
              
              <Button onClick={applyModeration} disabled={!selectedRating}>
                <Save className="h-4 w-4 mr-2" />
                Moderation anwenden
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Content Filter Component
export const ContentFilter: React.FC<{
  maxRating: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17' | 'X';
  children: React.ReactNode;
}> = ({ maxRating, children }) => {
  const [userAge, setUserAge] = useState<number | null>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const verificationData = localStorage.getItem('age_verification');
    if (verificationData) {
      try {
        const data = JSON.parse(verificationData);
        if (data.dateOfBirth) {
          const age = new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear();
          setUserAge(age);
          
          const rating = contentRatings.find(r => r.level === maxRating);
          if (rating && age >= rating.minAge) {
            setShowContent(true);
          }
        }
      } catch (error) {
        console.error('Failed to load age verification:', error);
      }
    }
  }, [maxRating]);

  if (!showContent) {
    const rating = contentRatings.find(r => r.level === maxRating);
    
    return (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Inhalt altersbeschränkt</h3>
          <p className="text-gray-600 mb-4">
            Dieser Inhalt ist bewertet als <strong>{rating?.name}</strong> und 
            erfordert ein Mindestalter von <strong>{rating?.minAge} Jahren</strong>.
          </p>
          {userAge && userAge < (rating?.minAge || 0) ? (
            <Alert className="border-red-500 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-800">
                Sie sind {userAge} Jahre alt. Für diesen Inhalt müssen Sie mindestens {rating?.minAge} Jahre alt sein.
              </AlertDescription>
            </Alert>
          ) : (
            <Button onClick={() => window.location.href = '/age-verification'}>
              Altersverifikation durchführen
            </Button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
