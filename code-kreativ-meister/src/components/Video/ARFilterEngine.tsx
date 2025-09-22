import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Eye, 
  Smile, 
  Heart, 
  Star, 
  Zap,
  Palette,
  Wand2,
  Camera,
  Download,
  Settings,
  RotateCcw,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Sun,
  Moon,
  Snowflake,
  Flame,
  Crown,
  Glasses,
  Mustache,
  Cat,
  Dog,
  Rabbit,
  Bear,
  Unicorn,
  Dragon
} from 'lucide-react';
import { toast } from 'sonner';

interface ARFilter {
  id: string;
  name: string;
  category: 'beauty' | 'face' | 'background' | 'effects' | 'animals' | 'fantasy';
  icon: React.ComponentType<any>;
  description: string;
  intensity?: number;
  color?: string;
  isActive: boolean;
  isPremium?: boolean;
}

interface ARFilterEngineProps {
  onFilterChange?: (filters: ARFilter[]) => void;
  onRecordStart?: () => void;
  onRecordStop?: () => void;
  isRecording?: boolean;
}

const filterCategories = {
  beauty: {
    name: 'Beauty',
    icon: Sparkles,
    filters: [
      { id: 'smooth-skin', name: 'Glatte Haut', icon: Sparkles, description: 'Hautglättung und Porenverfeinierung' },
      { id: 'bright-eyes', name: 'Strahlende Augen', icon: Eye, description: 'Augen aufhellen und vergrößern' },
      { id: 'white-teeth', name: 'Weiße Zähne', icon: Smile, description: 'Zähne aufhellen' },
      { id: 'face-slim', name: 'Gesicht schmaler', icon: Heart, description: 'Gesichtskontur verfeinern' },
      { id: 'lip-enhance', name: 'Lippen betonen', icon: Heart, description: 'Lippen vergrößern und färben' }
    ]
  },
  face: {
    name: 'Gesicht',
    icon: Smile,
    filters: [
      { id: 'sunglasses', name: 'Sonnenbrille', icon: Glasses, description: 'Coole Sonnenbrille' },
      { id: 'mustache', name: 'Schnurrbart', icon: Mustache, description: 'Verschiedene Schnurrbärte' },
      { id: 'crown', name: 'Krone', icon: Crown, description: 'Königliche Krone' },
      { id: 'face-paint', name: 'Gesichtsbemalung', icon: Palette, description: 'Kreative Gesichtsbemalung' },
      { id: 'pirate-hat', name: 'Piratenhut', icon: Star, description: 'Piratenhut mit Totenkopf' }
    ]
  },
  animals: {
    name: 'Tiere',
    icon: Cat,
    filters: [
      { id: 'cat-ears', name: 'Katzenohren', icon: Cat, description: 'Süße Katzenohren und Schnurrhaare' },
      { id: 'dog-ears', name: 'Hundeohren', icon: Dog, description: 'Niedliche Hundeohren und Nase' },
      { id: 'rabbit-ears', name: 'Hasenohren', icon: Rabbit, description: 'Lange Hasenohren' },
      { id: 'bear-ears', name: 'Bärenohren', icon: Bear, description: 'Kuschelige Bärenohren' },
      { id: 'panda-face', name: 'Panda-Gesicht', icon: Bear, description: 'Komplettes Panda-Gesicht' }
    ]
  },
  fantasy: {
    name: 'Fantasy',
    icon: Unicorn,
    filters: [
      { id: 'unicorn-horn', name: 'Einhorn-Horn', icon: Unicorn, description: 'Magisches Einhorn-Horn', isPremium: true },
      { id: 'dragon-eyes', name: 'Drachen-Augen', icon: Dragon, description: 'Feurige Drachen-Augen', isPremium: true },
      { id: 'fairy-wings', name: 'Feenflügel', icon: Sparkles, description: 'Glitzernde Feenflügel', isPremium: true },
      { id: 'wizard-hat', name: 'Zauberhut', icon: Star, description: 'Magischer Zauberhut', isPremium: true },
      { id: 'angel-halo', name: 'Heiligenschein', icon: Sun, description: 'Goldener Heiligenschein' }
    ]
  },
  background: {
    name: 'Hintergrund',
    icon: Palette,
    filters: [
      { id: 'blur-bg', name: 'Unscharf', icon: Eye, description: 'Hintergrund unscharf stellen' },
      { id: 'green-screen', name: 'Green Screen', icon: Palette, description: 'Grüner Hintergrund für Chroma Key' },
      { id: 'neon-city', name: 'Neon Stadt', icon: Zap, description: 'Futuristische Neon-Stadt', isPremium: true },
      { id: 'beach-sunset', name: 'Strand Sonnenuntergang', icon: Sun, description: 'Romantischer Strand', isPremium: true },
      { id: 'space', name: 'Weltraum', icon: Star, description: 'Sterne und Galaxien', isPremium: true }
    ]
  },
  effects: {
    name: 'Effekte',
    icon: Zap,
    filters: [
      { id: 'sparkles', name: 'Glitzer', icon: Sparkles, description: 'Glitzernde Partikel' },
      { id: 'fire', name: 'Feuer', icon: Flame, description: 'Feurige Effekte' },
      { id: 'snow', name: 'Schnee', icon: Snowflake, description: 'Fallende Schneeflocken' },
      { id: 'hearts', name: 'Herzen', icon: Heart, description: 'Fliegende Herzen' },
      { id: 'lightning', name: 'Blitze', icon: Zap, description: 'Elektrische Blitze', isPremium: true }
    ]
  }
};

export const ARFilterEngine: React.FC<ARFilterEngineProps> = ({
  onFilterChange,
  onRecordStart,
  onRecordStop,
  isRecording = false
}) => {
  const [activeFilters, setActiveFilters] = useState<ARFilter[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof filterCategories>('beauty');
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [filterIntensity, setFilterIntensity] = useState(80);
  const [recordingTime, setRecordingTime] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  const faceDetectionRef = useRef<any>(null);

  // Initialize camera and face detection
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 },
            facingMode: 'user'
          }
        });
        
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermissions(true);
        
        // Initialize face detection (mock implementation)
        initializeFaceDetection();
      } catch (error) {
        console.error('Camera access denied:', error);
        toast.error('Kamera-Zugriff erforderlich für AR-Filter');
      }
    };

    initializeCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Mock face detection initialization
  const initializeFaceDetection = () => {
    // In a real implementation, this would use libraries like MediaPipe, face-api.js, or TensorFlow.js
    // For demo purposes, we'll simulate face detection
    const detectFaces = () => {
      // Simulate face detection with random success
      setFaceDetected(Math.random() > 0.3);
      setTimeout(detectFaces, 100);
    };
    detectFaces();
  };

  // Apply filters to canvas
  const applyFilters = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video || !faceDetected) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Apply active filters
    activeFilters.forEach(filter => {
      applyFilter(ctx, filter, canvas.width, canvas.height);
    });

    if (isPreviewMode) {
      animationFrameRef.current = requestAnimationFrame(applyFilters);
    }
  }, [activeFilters, faceDetected, isPreviewMode]);

  // Apply individual filter
  const applyFilter = (ctx: CanvasRenderingContext2D, filter: ARFilter, width: number, height: number) => {
    const intensity = (filter.intensity || filterIntensity) / 100;
    
    // Mock face landmarks (in real implementation, these would come from face detection)
    const face = {
      x: width * 0.5,
      y: height * 0.4,
      width: width * 0.3,
      height: height * 0.4,
      leftEye: { x: width * 0.42, y: height * 0.35 },
      rightEye: { x: width * 0.58, y: height * 0.35 },
      nose: { x: width * 0.5, y: height * 0.45 },
      mouth: { x: width * 0.5, y: height * 0.55 }
    };

    ctx.save();
    ctx.globalAlpha = intensity;

    switch (filter.id) {
      case 'smooth-skin':
        // Apply blur filter to face area
        ctx.filter = `blur(${intensity * 2}px)`;
        ctx.drawImage(canvasRef.current!, face.x - face.width/2, face.y - face.height/2, face.width, face.height, 
                     face.x - face.width/2, face.y - face.height/2, face.width, face.height);
        break;
        
      case 'bright-eyes':
        // Brighten eye areas
        ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.3})`;
        ctx.beginPath();
        ctx.arc(face.leftEye.x, face.leftEye.y, 15, 0, 2 * Math.PI);
        ctx.arc(face.rightEye.x, face.rightEye.y, 15, 0, 2 * Math.PI);
        ctx.fill();
        break;
        
      case 'cat-ears':
        // Draw cat ears
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        // Left ear
        ctx.moveTo(face.x - face.width/3, face.y - face.height/2);
        ctx.lineTo(face.x - face.width/4, face.y - face.height/2 - 40);
        ctx.lineTo(face.x - face.width/6, face.y - face.height/2);
        ctx.closePath();
        // Right ear
        ctx.moveTo(face.x + face.width/6, face.y - face.height/2);
        ctx.lineTo(face.x + face.width/4, face.y - face.height/2 - 40);
        ctx.lineTo(face.x + face.width/3, face.y - face.height/2);
        ctx.closePath();
        ctx.fill();
        
        // Inner ears
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.arc(face.x - face.width/4, face.y - face.height/2 - 20, 8, 0, 2 * Math.PI);
        ctx.arc(face.x + face.width/4, face.y - face.height/2 - 20, 8, 0, 2 * Math.PI);
        ctx.fill();
        break;
        
      case 'sunglasses':
        // Draw sunglasses
        ctx.fillStyle = '#000000';
        ctx.fillRect(face.leftEye.x - 25, face.leftEye.y - 15, 50, 30);
        ctx.fillRect(face.rightEye.x - 25, face.rightEye.y - 15, 50, 30);
        // Bridge
        ctx.fillRect(face.leftEye.x + 25, face.leftEye.y - 5, face.rightEye.x - face.leftEye.x - 50, 10);
        break;
        
      case 'crown':
        // Draw crown
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(face.x - face.width/2, face.y - face.height/2);
        ctx.lineTo(face.x - face.width/4, face.y - face.height/2 - 30);
        ctx.lineTo(face.x, face.y - face.height/2 - 50);
        ctx.lineTo(face.x + face.width/4, face.y - face.height/2 - 30);
        ctx.lineTo(face.x + face.width/2, face.y - face.height/2);
        ctx.lineTo(face.x + face.width/2, face.y - face.height/2 + 20);
        ctx.lineTo(face.x - face.width/2, face.y - face.height/2 + 20);
        ctx.closePath();
        ctx.fill();
        
        // Crown jewels
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(face.x, face.y - face.height/2 - 30, 8, 0, 2 * Math.PI);
        ctx.fill();
        break;
        
      case 'sparkles':
        // Draw sparkles around face
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 20; i++) {
          const x = face.x + (Math.random() - 0.5) * face.width * 2;
          const y = face.y + (Math.random() - 0.5) * face.height * 2;
          const size = Math.random() * 5 + 2;
          
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(Math.random() * Math.PI);
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.lineTo(size/3, -size/3);
          ctx.lineTo(size, 0);
          ctx.lineTo(size/3, size/3);
          ctx.lineTo(0, size);
          ctx.lineTo(-size/3, size/3);
          ctx.lineTo(-size, 0);
          ctx.lineTo(-size/3, -size/3);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        break;
        
      case 'blur-bg':
        // Create mask for face area
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(face.x, face.y, face.width/2, 0, 2 * Math.PI);
        ctx.fill();
        
        // Apply blur to background
        ctx.globalCompositeOperation = 'source-over';
        ctx.filter = `blur(${intensity * 10}px)`;
        ctx.drawImage(canvasRef.current!, 0, 0);
        break;
        
      default:
        // Generic effect
        ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.1})`;
        ctx.fillRect(0, 0, width, height);
    }

    ctx.restore();
  };

  // Start applying filters
  useEffect(() => {
    if (hasPermissions && videoRef.current && canvasRef.current) {
      applyFilters();
    }
  }, [hasPermissions, applyFilters]);

  // Toggle filter
  const toggleFilter = (categoryKey: keyof typeof filterCategories, filterId: string) => {
    const category = filterCategories[categoryKey];
    const filterDef = category.filters.find(f => f.id === filterId);
    
    if (!filterDef) return;
    
    if (filterDef.isPremium) {
      toast.error('Premium-Feature - Upgrade erforderlich');
      return;
    }

    setActiveFilters(prev => {
      const existing = prev.find(f => f.id === filterId);
      
      if (existing) {
        // Remove filter
        const updated = prev.filter(f => f.id !== filterId);
        onFilterChange?.(updated);
        return updated;
      } else {
        // Add filter
        const newFilter: ARFilter = {
          id: filterId,
          name: filterDef.name,
          category: categoryKey,
          icon: filterDef.icon,
          description: filterDef.description,
          intensity: filterIntensity,
          isActive: true,
          isPremium: filterDef.isPremium
        };
        const updated = [...prev, newFilter];
        onFilterChange?.(updated);
        return updated;
      }
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters([]);
    onFilterChange?.([]);
    toast.success('Alle Filter entfernt');
  };

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  if (!hasPermissions) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>AR-Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="space-y-4">
            <div className="text-6xl">📷</div>
            <h3 className="text-xl font-semibold">Kamera-Zugriff erforderlich</h3>
            <p className="text-gray-400">
              Um AR-Filter zu verwenden, benötigen wir Zugriff auf deine Kamera.
            </p>
            <Button onClick={() => window.location.reload()}>
              Erneut versuchen
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>AR-Filter Studio</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant={faceDetected ? "default" : "secondary"}>
                {faceDetected ? '👤 Gesicht erkannt' : '👤 Kein Gesicht'}
              </Badge>
              {activeFilters.length > 0 && (
                <Badge variant="outline">
                  {activeFilters.length} Filter aktiv
                </Badge>
              )}
              {isRecording && (
                <Badge variant="destructive" className="animate-pulse">
                  ● REC {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Video Preview */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {/* Original video (hidden) */}
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="hidden"
                />
                
                {/* Filtered canvas */}
                <canvas
                  ref={canvasRef}
                  width={1280}
                  height={720}
                  className="w-full h-full object-contain"
                />

                {/* Face detection overlay */}
                {faceDetected && (
                  <div className="absolute top-4 left-4 flex items-center space-x-2 bg-green-600/80 text-white px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-sm">Gesicht erkannt</span>
                  </div>
                )}

                {/* Active filters indicator */}
                {activeFilters.length > 0 && (
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-2">
                    <div className="flex flex-wrap gap-1">
                      {activeFilters.map(filter => (
                        <Badge key={filter.id} variant="secondary" className="text-xs">
                          {filter.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-4">
                {!isRecording ? (
                  <Button
                    onClick={onRecordStart}
                    size="lg"
                    className="bg-red-600 hover:bg-red-700"
                    disabled={!faceDetected}
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Aufnahme starten
                  </Button>
                ) : (
                  <Button
                    onClick={onRecordStop}
                    size="lg"
                    variant="destructive"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    Aufnahme stoppen
                  </Button>
                )}
                
                <Button
                  onClick={clearAllFilters}
                  size="lg"
                  variant="outline"
                  disabled={activeFilters.length === 0}
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Filter zurücksetzen
                </Button>
                
                <Button
                  onClick={() => {
                    const canvas = canvasRef.current;
                    if (canvas) {
                      const link = document.createElement('a');
                      link.download = `ar-filter-${Date.now()}.png`;
                      link.href = canvas.toDataURL();
                      link.click();
                    }
                  }}
                  size="lg"
                  variant="outline"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Screenshot
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Panel */}
        <div className="space-y-4">
          {/* Filter Intensity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter-Intensität</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Schwach</span>
                  <span>{filterIntensity}%</span>
                  <span>Stark</span>
                </div>
                <Slider
                  value={[filterIntensity]}
                  onValueChange={([value]) => setFilterIntensity(value)}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Filter Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="beauty">Beauty</TabsTrigger>
                  <TabsTrigger value="face">Gesicht</TabsTrigger>
                </TabsList>
                <TabsList className="grid w-full grid-cols-2 mt-2">
                  <TabsTrigger value="animals">Tiere</TabsTrigger>
                  <TabsTrigger value="fantasy">Fantasy</TabsTrigger>
                </TabsList>
                <TabsList className="grid w-full grid-cols-2 mt-2">
                  <TabsTrigger value="background">Hintergrund</TabsTrigger>
                  <TabsTrigger value="effects">Effekte</TabsTrigger>
                </TabsList>
                
                {Object.entries(filterCategories).map(([categoryKey, category]) => (
                  <TabsContent key={categoryKey} value={categoryKey} className="mt-4">
                    <div className="grid grid-cols-2 gap-2">
                      {category.filters.map((filter) => {
                        const isActive = activeFilters.some(f => f.id === filter.id);
                        return (
                          <button
                            key={filter.id}
                            onClick={() => toggleFilter(categoryKey as any, filter.id)}
                            className={`relative p-3 rounded-lg border text-center transition-all duration-200 ${
                              isActive
                                ? 'border-blue-500 bg-blue-500/20 scale-105'
                                : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
                            } ${filter.isPremium ? 'border-yellow-500/50' : ''}`}
                          >
                            <filter.icon className="h-5 w-5 mx-auto mb-1" />
                            <div className="text-xs font-medium">{filter.name}</div>
                            {filter.isPremium && (
                              <Crown className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400" />
                            )}
                            {isActive && (
                              <div className="absolute inset-0 border-2 border-blue-400 rounded-lg animate-pulse" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Aktive Filter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activeFilters.map((filter) => (
                    <div
                      key={filter.id}
                      className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <filter.icon className="h-4 w-4" />
                        <span className="text-sm">{filter.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleFilter(filter.category, filter.id)}
                        className="h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tipps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• Sorge für gute Beleuchtung</p>
                <p>• Halte dein Gesicht im Bildbereich</p>
                <p>• Bewege dich langsam für beste Ergebnisse</p>
                <p>• Kombiniere verschiedene Filter</p>
                <p>• Premium-Filter für erweiterte Effekte</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
