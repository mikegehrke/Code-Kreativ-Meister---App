import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Shield, 
  Bell, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share, 
  Download, 
  Globe, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Monitor, 
  Wifi, 
  Battery, 
  HardDrive, 
  Cpu, 
  MemoryStick, 
  Camera, 
  Mic, 
  Video, 
  Music, 
  Palette, 
  Type, 
  Filter, 
  Zap, 
  Crown, 
  Star, 
  Gift, 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  Users, 
  UserPlus, 
  UserMinus, 
  UserCheck, 
  UserX, 
  Lock, 
  Unlock, 
  Key, 
  Fingerprint, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  HelpCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Languages, 
  Flag, 
  Settings, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Check, 
  Plus, 
  Minus, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink, 
  Copy, 
  QrCode, 
  Scan, 
  Upload, 
  Image, 
  FileText, 
  Folder, 
  Archive, 
  RefreshCw, 
  LogOut, 
  Power,
  Paintbrush,
  Wand2,
  Sparkles,
  Rainbow,
  Contrast,
  Brightness,
  Saturation,
  Blur,
  Focus,
  Crop,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Layers,
  Move,
  Resize,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
  FontSize,
  LineHeight,
  LetterSpacing
} from 'lucide-react';
import { toast } from 'sonner';
import { usePayment, StripeConfigDialog, SubscriptionPlans, CreditPurchase, PaymentMethodsManager } from '@/components/Payment/StripePaymentProvider';

interface UserSettings {
  // Profile
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  coverImage: string;
  website: string;
  location: string;
  birthday: string;
  
  // Privacy
  isPrivateAccount: boolean;
  allowComments: 'everyone' | 'friends' | 'nobody';
  allowDuets: 'everyone' | 'friends' | 'nobody';
  allowStitches: 'everyone' | 'friends' | 'nobody';
  allowDownloads: boolean;
  showOnlineStatus: boolean;
  allowDirectMessages: 'everyone' | 'friends' | 'nobody';
  allowMentions: 'everyone' | 'friends' | 'nobody';
  
  // Notifications
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  notifyLikes: boolean;
  notifyComments: boolean;
  notifyFollows: boolean;
  notifyMentions: boolean;
  notifyDirectMessages: boolean;
  notifyLiveStreams: boolean;
  
  // Content & Display
  autoplay: boolean;
  showCaptions: boolean;
  reducedMotion: boolean;
  darkMode: boolean;
  language: string;
  region: string;
  contentLanguages: string[];
  
  // Audio & Video
  defaultVideoQuality: '720p' | '1080p' | '4K';
  autoplaySound: boolean;
  volumeLevel: number;
  microphoneAccess: boolean;
  cameraAccess: boolean;
  
  // Creator Tools
  analyticsEnabled: boolean;
  creatorFundEnabled: boolean;
  liveStreamingEnabled: boolean;
  commercialContentEnabled: boolean;
  
  // Safety & Security
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  deviceManagement: boolean;
  dataDownload: boolean;
  accountDeletion: boolean;
  
  // Advanced
  developerMode: boolean;
  betaFeatures: boolean;
  diagnostics: boolean;
  performanceMode: 'auto' | 'performance' | 'quality';
}

const defaultSettings: UserSettings = {
  username: 'user123',
  displayName: 'User Name',
  bio: '',
  avatar: '/api/placeholder/150/150',
  coverImage: '/api/placeholder/800/200',
  website: '',
  location: '',
  birthday: '',
  
  isPrivateAccount: false,
  allowComments: 'everyone',
  allowDuets: 'everyone',
  allowStitches: 'everyone',
  allowDownloads: true,
  showOnlineStatus: true,
  allowDirectMessages: 'everyone',
  allowMentions: 'everyone',
  
  pushNotifications: true,
  emailNotifications: true,
  smsNotifications: false,
  notifyLikes: true,
  notifyComments: true,
  notifyFollows: true,
  notifyMentions: true,
  notifyDirectMessages: true,
  notifyLiveStreams: true,
  
  autoplay: true,
  showCaptions: false,
  reducedMotion: false,
  darkMode: true,
  language: 'de',
  region: 'DE',
  contentLanguages: ['de', 'en'],
  
  defaultVideoQuality: '1080p',
  autoplaySound: false,
  volumeLevel: 75,
  microphoneAccess: true,
  cameraAccess: true,
  
  analyticsEnabled: true,
  creatorFundEnabled: false,
  liveStreamingEnabled: true,
  commercialContentEnabled: false,
  
  twoFactorEnabled: false,
  loginAlerts: true,
  deviceManagement: true,
  dataDownload: true,
  accountDeletion: true,
  
  developerMode: false,
  betaFeatures: false,
  diagnostics: false,
  performanceMode: 'auto'
};

const languages = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];

const regions = [
  { code: 'DE', name: 'Deutschland', flag: '🇩🇪' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'CN', name: 'China', flag: '🇨🇳' }
];

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { subscription, isConfigured } = usePayment();

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('user_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  // Update settings and mark as changed
  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  // Save settings
  const saveSettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('user_settings', JSON.stringify(settings));
      setHasUnsavedChanges(false);
      toast.success('Einstellungen gespeichert!');
    } catch (error) {
      toast.error('Fehler beim Speichern');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset settings
  const resetSettings = () => {
    setSettings(defaultSettings);
    setHasUnsavedChanges(true);
    toast.success('Einstellungen zurückgesetzt');
  };

  // Delete account
  const deleteAccount = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Account gelöscht');
      // In real app, redirect to login
    } catch (error) {
      toast.error('Löschung fehlgeschlagen');
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  // Get current plan info
  const currentPlan = subscription?.planId || 'free';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Einstellungen</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Verwalten Sie Ihr Konto und Ihre Präferenzen
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {hasUnsavedChanges && (
              <Badge variant="secondary">
                Ungespeicherte Änderungen
              </Badge>
            )}
            <Button onClick={saveSettings} disabled={isLoading || !hasUnsavedChanges}>
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Speichere...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Speichern
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="privacy">Privatsphäre</TabsTrigger>
            <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
            <TabsTrigger value="content">Inhalte</TabsTrigger>
            <TabsTrigger value="creator">Creator</TabsTrigger>
            <TabsTrigger value="payments">Zahlungen</TabsTrigger>
            <TabsTrigger value="security">Sicherheit</TabsTrigger>
            <TabsTrigger value="advanced">Erweitert</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profil-Informationen</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar & Cover */}
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={settings.coverImage}
                      alt="Cover"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Cover ändern
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={settings.avatar} />
                      <AvatarFallback>{settings.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Avatar ändern
                    </Button>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Benutzername</Label>
                    <Input
                      id="username"
                      value={settings.username}
                      onChange={(e) => updateSetting('username', e.target.value)}
                      placeholder="@benutzername"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="displayName">Anzeigename</Label>
                    <Input
                      id="displayName"
                      value={settings.displayName}
                      onChange={(e) => updateSetting('displayName', e.target.value)}
                      placeholder="Ihr Name"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={settings.bio}
                      onChange={(e) => updateSetting('bio', e.target.value)}
                      placeholder="Erzählen Sie etwas über sich..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={settings.website}
                      onChange={(e) => updateSetting('website', e.target.value)}
                      placeholder="https://ihre-website.de"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Standort</Label>
                    <Input
                      id="location"
                      value={settings.location}
                      onChange={(e) => updateSetting('location', e.target.value)}
                      placeholder="Berlin, Deutschland"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="birthday">Geburtstag</Label>
                    <Input
                      id="birthday"
                      type="date"
                      value={settings.birthday}
                      onChange={(e) => updateSetting('birthday', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Language & Region */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Sprache & Region</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Sprache</Label>
                    <select
                      value={settings.language}
                      onChange={(e) => updateSetting('language', e.target.value)}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label>Region</Label>
                    <select
                      value={settings.region}
                      onChange={(e) => updateSetting('region', e.target.value)}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
                    >
                      {regions.map((region) => (
                        <option key={region.code} value={region.code}>
                          {region.flag} {region.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label>Bevorzugte Inhaltssprachen</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                    {languages.map((lang) => (
                      <label key={lang.code} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.contentLanguages.includes(lang.code)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateSetting('contentLanguages', [...settings.contentLanguages, lang.code]);
                            } else {
                              updateSetting('contentLanguages', settings.contentLanguages.filter(l => l !== lang.code));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{lang.flag} {lang.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Privatsphäre-Einstellungen</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Privates Konto</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Nur genehmigte Follower können Ihre Inhalte sehen
                    </p>
                  </div>
                  <Switch
                    checked={settings.isPrivateAccount}
                    onCheckedChange={(checked) => updateSetting('isPrivateAccount', checked)}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Kommentare erlauben</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Wer kann Ihre Videos kommentieren
                      </p>
                    </div>
                    <select
                      value={settings.allowComments}
                      onChange={(e) => updateSetting('allowComments', e.target.value as any)}
                      className="p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
                    >
                      <option value="everyone">Jeder</option>
                      <option value="friends">Nur Freunde</option>
                      <option value="nobody">Niemand</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Duetts erlauben</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Wer kann Duetts mit Ihren Videos erstellen
                      </p>
                    </div>
                    <select
                      value={settings.allowDuets}
                      onChange={(e) => updateSetting('allowDuets', e.target.value as any)}
                      className="p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
                    >
                      <option value="everyone">Jeder</option>
                      <option value="friends">Nur Freunde</option>
                      <option value="nobody">Niemand</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Stitches erlauben</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Wer kann Teile Ihrer Videos in eigenen Videos verwenden
                      </p>
                    </div>
                    <select
                      value={settings.allowStitches}
                      onChange={(e) => updateSetting('allowStitches', e.target.value as any)}
                      className="p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
                    >
                      <option value="everyone">Jeder</option>
                      <option value="friends">Nur Freunde</option>
                      <option value="nobody">Niemand</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Downloads erlauben</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Andere können Ihre Videos herunterladen
                      </p>
                    </div>
                    <Switch
                      checked={settings.allowDownloads}
                      onCheckedChange={(checked) => updateSetting('allowDownloads', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Online-Status anzeigen</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Anderen zeigen, wann Sie online sind
                      </p>
                    </div>
                    <Switch
                      checked={settings.showOnlineStatus}
                      onCheckedChange={(checked) => updateSetting('showOnlineStatus', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Direktnachrichten</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Wer kann Ihnen private Nachrichten senden
                      </p>
                    </div>
                    <select
                      value={settings.allowDirectMessages}
                      onChange={(e) => updateSetting('allowDirectMessages', e.target.value as any)}
                      className="p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
                    >
                      <option value="everyone">Jeder</option>
                      <option value="friends">Nur Freunde</option>
                      <option value="nobody">Niemand</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Benachrichtigungen</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push-Benachrichtigungen</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Benachrichtigungen auf diesem Gerät erhalten
                      </p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">E-Mail-Benachrichtigungen</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Benachrichtigungen per E-Mail erhalten
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMS-Benachrichtigungen</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Wichtige Benachrichtigungen per SMS
                      </p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
                    />
                  </div>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                <div className="space-y-4">
                  <h4 className="font-medium">Benachrichtigen bei:</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>Likes</span>
                      </div>
                      <Switch
                        checked={settings.notifyLikes}
                        onCheckedChange={(checked) => updateSetting('notifyLikes', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                        <span>Kommentare</span>
                      </div>
                      <Switch
                        checked={settings.notifyComments}
                        onCheckedChange={(checked) => updateSetting('notifyComments', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <UserPlus className="h-4 w-4 text-green-500" />
                        <span>Neue Follower</span>
                      </div>
                      <Switch
                        checked={settings.notifyFollows}
                        onCheckedChange={(checked) => updateSetting('notifyFollows', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-purple-500" />
                        <span>Erwähnungen</span>
                      </div>
                      <Switch
                        checked={settings.notifyMentions}
                        onCheckedChange={(checked) => updateSetting('notifyMentions', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-orange-500" />
                        <span>Direktnachrichten</span>
                      </div>
                      <Switch
                        checked={settings.notifyDirectMessages}
                        onCheckedChange={(checked) => updateSetting('notifyDirectMessages', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Video className="h-4 w-4 text-red-600" />
                        <span>Live-Streams</span>
                      </div>
                      <Switch
                        checked={settings.notifyLiveStreams}
                        onCheckedChange={(checked) => updateSetting('notifyLiveStreams', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content & Display */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="h-5 w-5" />
                  <span>Inhalte & Anzeige</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Automatische Wiedergabe</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Videos automatisch abspielen
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoplay}
                      onCheckedChange={(checked) => updateSetting('autoplay', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Untertitel anzeigen</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Automatisch generierte Untertitel einblenden
                      </p>
                    </div>
                    <Switch
                      checked={settings.showCaptions}
                      onCheckedChange={(checked) => updateSetting('showCaptions', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Reduzierte Bewegungen</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Animationen und Effekte reduzieren
                      </p>
                    </div>
                    <Switch
                      checked={settings.reducedMotion}
                      onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Dunkler Modus</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Dunkles Design verwenden
                      </p>
                    </div>
                    <Switch
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => updateSetting('darkMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Standard-Videoqualität</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Bevorzugte Auflösung für Videos
                      </p>
                    </div>
                    <select
                      value={settings.defaultVideoQuality}
                      onChange={(e) => updateSetting('defaultVideoQuality', e.target.value as any)}
                      className="p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
                    >
                      <option value="720p">720p (HD)</option>
                      <option value="1080p">1080p (Full HD)</option>
                      <option value="4K">4K (Ultra HD)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Ton automatisch abspielen</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Videos mit Ton starten
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoplaySound}
                      onCheckedChange={(checked) => updateSetting('autoplaySound', checked)}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Standard-Lautstärke</h4>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {settings.volumeLevel}%
                      </span>
                    </div>
                    <Slider
                      value={[settings.volumeLevel]}
                      onValueChange={([value]) => updateSetting('volumeLevel', value)}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Device Permissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <span>Geräte-Berechtigungen</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Camera className="h-4 w-4" />
                    <div>
                      <h4 className="font-medium">Kamera-Zugriff</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Für Video-Aufnahmen und AR-Filter
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.cameraAccess}
                    onCheckedChange={(checked) => updateSetting('cameraAccess', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mic className="h-4 w-4" />
                    <div>
                      <h4 className="font-medium">Mikrofon-Zugriff</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Für Audio-Aufnahmen und Voice-Chat
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.microphoneAccess}
                    onCheckedChange={(checked) => updateSetting('microphoneAccess', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Creator Tools */}
          <TabsContent value="creator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="h-5 w-5" />
                  <span>Creator-Tools</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="h-5 w-5 text-blue-500" />
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">
                      Aktueller Plan: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
                    </h4>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {currentPlan === 'free' 
                      ? 'Upgraden Sie für erweiterte Creator-Features'
                      : 'Sie haben Zugang zu allen Creator-Tools'
                    }
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Analytics aktiviert</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Detaillierte Statistiken zu Ihren Inhalten
                      </p>
                    </div>
                    <Switch
                      checked={settings.analyticsEnabled}
                      onCheckedChange={(checked) => updateSetting('analyticsEnabled', checked)}
                      disabled={currentPlan === 'free'}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Creator Fund</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Monetarisierung durch den Creator Fund
                      </p>
                    </div>
                    <Switch
                      checked={settings.creatorFundEnabled}
                      onCheckedChange={(checked) => updateSetting('creatorFundEnabled', checked)}
                      disabled={currentPlan === 'free'}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Live-Streaming</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Live-Übertragungen für Ihre Follower
                      </p>
                    </div>
                    <Switch
                      checked={settings.liveStreamingEnabled}
                      onCheckedChange={(checked) => updateSetting('liveStreamingEnabled', checked)}
                      disabled={currentPlan === 'free'}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Kommerzielle Inhalte</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Markierung für gesponserte Inhalte
                      </p>
                    </div>
                    <Switch
                      checked={settings.commercialContentEnabled}
                      onCheckedChange={(checked) => updateSetting('commercialContentEnabled', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Zahlungen & Abonnements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isConfigured && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                        Stripe nicht konfiguriert
                      </h4>
                    </div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                      Konfigurieren Sie Stripe, um Zahlungen zu verarbeiten.
                    </p>
                    <StripeConfigDialog />
                  </div>
                )}

                {/* Subscription Plans */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Abonnement-Pläne</h3>
                  <SubscriptionPlans />
                </div>

                {/* Credit Purchase */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Credits kaufen</h3>
                  <CreditPurchase />
                </div>

                {/* Payment Methods */}
                <PaymentMethodsManager />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>Sicherheit</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Zwei-Faktor-Authentifizierung</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Zusätzliche Sicherheit für Ihr Konto
                      </p>
                    </div>
                    <Switch
                      checked={settings.twoFactorEnabled}
                      onCheckedChange={(checked) => updateSetting('twoFactorEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Login-Benachrichtigungen</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Bei neuen Anmeldungen benachrichtigen
                      </p>
                    </div>
                    <Switch
                      checked={settings.loginAlerts}
                      onCheckedChange={(checked) => updateSetting('loginAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Geräteverwaltung</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Angemeldete Geräte verwalten
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Geräte anzeigen
                    </Button>
                  </div>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                <div className="space-y-4">
                  <h4 className="font-medium">Passwort & Anmeldung</h4>
                  
                  <Button variant="outline" className="w-full">
                    <Key className="h-4 w-4 mr-2" />
                    Passwort ändern
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Fingerprint className="h-4 w-4 mr-2" />
                    Biometrische Anmeldung einrichten
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Data & Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5" />
                  <span>Daten & Datenschutz</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Meine Daten herunterladen
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Archive className="h-4 w-4 mr-2" />
                  Datenverarbeitungsrichtlinie
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Datenschutzerklärung
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Hilfe & Support
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Erweiterte Einstellungen</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Entwicklermodus</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Erweiterte Debugging-Optionen aktivieren
                      </p>
                    </div>
                    <Switch
                      checked={settings.developerMode}
                      onCheckedChange={(checked) => updateSetting('developerMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Beta-Features</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Neue Features vor der offiziellen Veröffentlichung testen
                      </p>
                    </div>
                    <Switch
                      checked={settings.betaFeatures}
                      onCheckedChange={(checked) => updateSetting('betaFeatures', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Diagnose-Daten</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Anonyme Nutzungsdaten zur Verbesserung senden
                      </p>
                    </div>
                    <Switch
                      checked={settings.diagnostics}
                      onCheckedChange={(checked) => updateSetting('diagnostics', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Performance-Modus</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Balance zwischen Qualität und Performance
                      </p>
                    </div>
                    <select
                      value={settings.performanceMode}
                      onChange={(e) => updateSetting('performanceMode', e.target.value as any)}
                      className="p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
                    >
                      <option value="auto">Automatisch</option>
                      <option value="performance">Performance</option>
                      <option value="quality">Qualität</option>
                    </select>
                  </div>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                <div className="space-y-4">
                  <h4 className="font-medium text-red-600 dark:text-red-400">Gefährlicher Bereich</h4>
                  
                  <Button variant="outline" onClick={resetSettings} className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Alle Einstellungen zurücksetzen
                  </Button>
                  
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Account löschen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Account Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-red-600">Account löschen</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <h4 className="font-medium text-red-900 dark:text-red-100">
                    Warnung: Diese Aktion ist unwiderruflich
                  </h4>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Alle Ihre Daten, Videos, Follower und Nachrichten werden permanent gelöscht.
                </p>
              </div>
              
              <div>
                <Label>Geben Sie "LÖSCHEN" ein, um zu bestätigen:</Label>
                <Input
                  type="text"
                  placeholder="LÖSCHEN"
                  className="mt-1"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                  className="flex-1"
                >
                  Abbrechen
                </Button>
                <Button
                  variant="destructive"
                  onClick={deleteAccount}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Lösche...' : 'Account löschen'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
