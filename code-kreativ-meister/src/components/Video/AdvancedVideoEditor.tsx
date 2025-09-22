import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Scissors,
  Copy,
  Trash2,
  Download,
  Upload,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Move,
  Type,
  Image,
  Music,
  Palette,
  Sparkles,
  Layers,
  Clock,
  Settings,
  Filter,
  Crop,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Brightness,
  Contrast,
  Saturation,
  Hue,
  Blur,
  Sharpen,
  Noise,
  Vignette,
  Film,
  Zap,
  Star,
  Heart,
  Smile,
  Eye,
  Sun,
  Moon,
  CloudRain,
  Snowflake,
  Flame,
  Leaf,
  Camera,
  Video,
  Mic,
  Headphones,
  Wand2,
  Magic,
  Paintbrush,
  Eraser,
  PenTool,
  MousePointer,
  Hand,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  FastForward,
  Rewind
} from 'lucide-react';
import { toast } from 'sonner';

interface VideoClip {
  id: string;
  name: string;
  url: string;
  duration: number;
  startTime: number;
  endTime: number;
  volume: number;
  speed: number;
  filters: VideoFilter[];
  position: { x: number; y: number };
  scale: number;
  rotation: number;
  opacity: number;
  layer: number;
}

interface AudioClip {
  id: string;
  name: string;
  url: string;
  duration: number;
  startTime: number;
  endTime: number;
  volume: number;
  fadeIn: number;
  fadeOut: number;
  layer: number;
}

interface TextElement {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  position: { x: number; y: number };
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor: string;
  animation: string;
  layer: number;
}

interface VideoFilter {
  id: string;
  name: string;
  type: 'color' | 'blur' | 'distort' | 'artistic' | 'vintage';
  intensity: number;
  parameters: { [key: string]: any };
}

interface AdvancedVideoEditorProps {
  maxDuration?: number; // in seconds: 300(5min), 600(10min), 960(16min), 1200(20min), 1560(26min), 1800(30min), 3600(60min)
  onSave?: (projectData: any) => void;
  onExport?: (videoBlob: Blob, settings: ExportSettings) => void;
}

interface ExportSettings {
  resolution: '720p' | '1080p' | '4K';
  fps: 24 | 30 | 60;
  bitrate: number;
  format: 'mp4' | 'webm' | 'mov';
  quality: 'low' | 'medium' | 'high' | 'ultra';
}

const timeOptions = [
  { value: 300, label: '5 Minuten', premium: false },
  { value: 600, label: '10 Minuten', premium: false },
  { value: 960, label: '16 Minuten', premium: true },
  { value: 1200, label: '20 Minuten', premium: true },
  { value: 1560, label: '26 Minuten', premium: true },
  { value: 1800, label: '30 Minuten', premium: true },
  { value: 3600, label: '60 Minuten', premium: true }
];

const videoFilters = [
  { id: 'brightness', name: 'Helligkeit', type: 'color', icon: Sun },
  { id: 'contrast', name: 'Kontrast', type: 'color', icon: Contrast },
  { id: 'saturation', name: 'Sättigung', type: 'color', icon: Saturation },
  { id: 'hue', name: 'Farbton', type: 'color', icon: Hue },
  { id: 'blur', name: 'Unschärfe', type: 'blur', icon: Blur },
  { id: 'sharpen', name: 'Schärfe', type: 'blur', icon: Sharpen },
  { id: 'vintage', name: 'Vintage', type: 'vintage', icon: Film },
  { id: 'vignette', name: 'Vignette', type: 'artistic', icon: Vignette },
  { id: 'noise', name: 'Rauschen', type: 'artistic', icon: Noise },
  { id: 'sepia', name: 'Sepia', type: 'vintage', icon: Leaf },
  { id: 'blackwhite', name: 'Schwarz-Weiß', type: 'vintage', icon: Moon },
  { id: 'neon', name: 'Neon', type: 'artistic', icon: Zap }
];

const textAnimations = [
  'none', 'fadeIn', 'slideIn', 'bounce', 'zoom', 'rotate', 'typewriter', 'glow'
];

const transitionEffects = [
  'cut', 'fade', 'dissolve', 'wipe', 'slide', 'zoom', 'spin', 'blur'
];

export const AdvancedVideoEditor: React.FC<AdvancedVideoEditorProps> = ({
  maxDuration = 300,
  onSave,
  onExport
}) => {
  const [videoClips, setVideoClips] = useState<VideoClip[]>([]);
  const [audioClips, setAudioClips] = useState<AudioClip[]>([]);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [projectName, setProjectName] = useState('Neues Projekt');
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    resolution: '1080p',
    fps: 30,
    bitrate: 5000,
    format: 'mp4',
    quality: 'high'
  });
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Timeline scale (pixels per second)
  const timelineScale = 50;

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 1920;
    canvas.height = 1080;
    renderCanvas();
  }, [videoClips, textElements, currentTime]);

  // Render canvas with all elements
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render video clips
    videoClips
      .filter(clip => currentTime >= clip.startTime && currentTime <= clip.endTime)
      .sort((a, b) => a.layer - b.layer)
      .forEach(clip => {
        renderVideoClip(ctx, clip);
      });

    // Render text elements
    textElements
      .filter(text => currentTime >= text.startTime && currentTime <= text.endTime)
      .sort((a, b) => a.layer - b.layer)
      .forEach(text => {
        renderTextElement(ctx, text);
      });
  }, [videoClips, textElements, currentTime]);

  // Render individual video clip
  const renderVideoClip = (ctx: CanvasRenderingContext2D, clip: VideoClip) => {
    ctx.save();
    
    // Apply transformations
    ctx.globalAlpha = clip.opacity;
    ctx.translate(clip.position.x, clip.position.y);
    ctx.scale(clip.scale, clip.scale);
    ctx.rotate((clip.rotation * Math.PI) / 180);

    // Apply filters
    let filterString = '';
    clip.filters.forEach(filter => {
      switch (filter.id) {
        case 'brightness':
          filterString += `brightness(${filter.intensity}%) `;
          break;
        case 'contrast':
          filterString += `contrast(${filter.intensity}%) `;
          break;
        case 'saturation':
          filterString += `saturate(${filter.intensity}%) `;
          break;
        case 'blur':
          filterString += `blur(${filter.intensity}px) `;
          break;
        case 'sepia':
          filterString += `sepia(${filter.intensity}%) `;
          break;
        case 'hue':
          filterString += `hue-rotate(${filter.intensity}deg) `;
          break;
      }
    });
    
    if (filterString) {
      ctx.filter = filterString;
    }

    // Draw placeholder rectangle (in real implementation, this would be video frame)
    ctx.fillStyle = '#333';
    ctx.fillRect(-100, -100, 200, 200);
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(clip.name, 0, 0);

    ctx.restore();
  };

  // Render text element
  const renderTextElement = (ctx: CanvasRenderingContext2D, text: TextElement) => {
    ctx.save();
    
    ctx.translate(text.position.x, text.position.y);
    ctx.font = `${text.fontSize}px ${text.fontFamily}`;
    ctx.fillStyle = text.color;
    ctx.textAlign = 'center';
    
    // Background
    if (text.backgroundColor !== 'transparent') {
      const metrics = ctx.measureText(text.text);
      ctx.fillStyle = text.backgroundColor;
      ctx.fillRect(-metrics.width/2 - 10, -text.fontSize - 5, metrics.width + 20, text.fontSize + 10);
    }
    
    // Text
    ctx.fillStyle = text.color;
    ctx.fillText(text.text, 0, 0);
    
    ctx.restore();
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'audio') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    
    if (type === 'video') {
      const newClip: VideoClip = {
        id: Date.now().toString(),
        name: file.name,
        url,
        duration: 10, // Mock duration
        startTime: currentTime,
        endTime: currentTime + 10,
        volume: 100,
        speed: 1,
        filters: [],
        position: { x: 960, y: 540 },
        scale: 1,
        rotation: 0,
        opacity: 1,
        layer: videoClips.length
      };
      
      setVideoClips(prev => [...prev, newClip]);
      saveToHistory();
    } else {
      const newAudio: AudioClip = {
        id: Date.now().toString(),
        name: file.name,
        url,
        duration: 10, // Mock duration
        startTime: currentTime,
        endTime: currentTime + 10,
        volume: 100,
        fadeIn: 0,
        fadeOut: 0,
        layer: audioClips.length
      };
      
      setAudioClips(prev => [...prev, newAudio]);
      saveToHistory();
    }
    
    toast.success(`${type === 'video' ? 'Video' : 'Audio'} hinzugefügt!`);
  };

  // Add text element
  const addTextElement = () => {
    const newText: TextElement = {
      id: Date.now().toString(),
      text: 'Neuer Text',
      startTime: currentTime,
      endTime: currentTime + 5,
      position: { x: 960, y: 540 },
      fontSize: 48,
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: 'transparent',
      animation: 'none',
      layer: textElements.length
    };
    
    setTextElements(prev => [...prev, newText]);
    saveToHistory();
    toast.success('Text hinzugefügt!');
  };

  // Apply filter to selected clip
  const applyFilter = (filterId: string, intensity: number = 100) => {
    if (!selectedClip) return;
    
    setVideoClips(prev => prev.map(clip => {
      if (clip.id === selectedClip) {
        const existingFilter = clip.filters.find(f => f.id === filterId);
        if (existingFilter) {
          existingFilter.intensity = intensity;
        } else {
          const filter = videoFilters.find(f => f.id === filterId);
          if (filter) {
            clip.filters.push({
              id: filterId,
              name: filter.name,
              type: filter.type as any,
              intensity,
              parameters: {}
            });
          }
        }
      }
      return clip;
    }));
    
    saveToHistory();
  };

  // Save to history for undo/redo
  const saveToHistory = () => {
    const state = {
      videoClips: [...videoClips],
      audioClips: [...audioClips],
      textElements: [...textElements],
      timestamp: Date.now()
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo
  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setVideoClips(prevState.videoClips);
      setAudioClips(prevState.audioClips);
      setTextElements(prevState.textElements);
      setHistoryIndex(historyIndex - 1);
    }
  };

  // Redo
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setVideoClips(nextState.videoClips);
      setAudioClips(nextState.audioClips);
      setTextElements(nextState.textElements);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Export video
  const exportVideo = async () => {
    setIsExporting(true);
    
    try {
      // Mock export process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create mock video blob
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            onExport?.(blob, exportSettings);
            toast.success('Video erfolgreich exportiert!');
          }
        }, `video/${exportSettings.format}`);
      }
    } catch (error) {
      toast.error('Export fehlgeschlagen');
    } finally {
      setIsExporting(false);
      setShowExportDialog(false);
    }
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get time option info
  const timeOption = timeOptions.find(opt => opt.value === maxDuration);

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Video Editor</h1>
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-gray-800 border-gray-600 text-white w-48"
          />
          <Badge variant={timeOption?.premium ? "default" : "secondary"}>
            Max: {timeOption?.label}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={undo} disabled={historyIndex <= 0}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
            <Redo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onSave?.({ videoClips, audioClips, textElements, projectName })}>
            <Save className="h-4 w-4 mr-2" />
            Speichern
          </Button>
          <Button size="sm" onClick={() => setShowExportDialog(true)}>
            <Download className="h-4 w-4 mr-2" />
            Exportieren
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tools */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <Tabs defaultValue="media" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="effects">Effekte</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
            </TabsList>
            
            <TabsContent value="media" className="p-4 space-y-4">
              <div className="space-y-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Video hinzufügen
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'video')}
                />
                
                <Button
                  onClick={() => audioInputRef.current?.click()}
                  className="w-full"
                  variant="outline"
                >
                  <Music className="h-4 w-4 mr-2" />
                  Audio hinzufügen
                </Button>
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'audio')}
                />
              </div>
              
              {/* Video Clips List */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Video Clips</h3>
                {videoClips.map((clip) => (
                  <div
                    key={clip.id}
                    className={`p-2 rounded border cursor-pointer ${
                      selectedClip === clip.id ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600'
                    }`}
                    onClick={() => setSelectedClip(clip.id)}
                  >
                    <div className="text-sm font-medium truncate">{clip.name}</div>
                    <div className="text-xs text-gray-400">
                      {formatTime(clip.startTime)} - {formatTime(clip.endTime)}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="text" className="p-4 space-y-4">
              <Button onClick={addTextElement} className="w-full" variant="outline">
                <Type className="h-4 w-4 mr-2" />
                Text hinzufügen
              </Button>
              
              {/* Text Elements List */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Text Elemente</h3>
                {textElements.map((text) => (
                  <div
                    key={text.id}
                    className="p-2 rounded border border-gray-600 cursor-pointer hover:border-gray-500"
                  >
                    <div className="text-sm font-medium truncate">{text.text}</div>
                    <div className="text-xs text-gray-400">
                      {formatTime(text.startTime)} - {formatTime(text.endTime)}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="effects" className="p-4 space-y-4">
              <h3 className="text-sm font-medium">Filter</h3>
              <div className="grid grid-cols-2 gap-2">
                {videoFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => applyFilter(filter.id)}
                    className="p-3 rounded border border-gray-600 hover:border-gray-500 text-center transition-colors"
                    disabled={!selectedClip}
                  >
                    <filter.icon className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-xs">{filter.name}</div>
                  </button>
                ))}
              </div>
              
              <h3 className="text-sm font-medium mt-6">Übergänge</h3>
              <div className="grid grid-cols-2 gap-2">
                {transitionEffects.map((effect) => (
                  <button
                    key={effect}
                    className="p-2 rounded border border-gray-600 hover:border-gray-500 text-center text-xs transition-colors"
                  >
                    {effect}
                  </button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="audio" className="p-4 space-y-4">
              <h3 className="text-sm font-medium">Audio Clips</h3>
              {audioClips.map((clip) => (
                <div
                  key={clip.id}
                  className="p-2 rounded border border-gray-600"
                >
                  <div className="text-sm font-medium truncate">{clip.name}</div>
                  <div className="text-xs text-gray-400">
                    {formatTime(clip.startTime)} - {formatTime(clip.endTime)}
                  </div>
                  <div className="mt-2">
                    <Label className="text-xs">Lautstärke: {clip.volume}%</Label>
                    <Slider
                      value={[clip.volume]}
                      onValueChange={([value]) => {
                        setAudioClips(prev => prev.map(a => 
                          a.id === clip.id ? { ...a, volume: value } : a
                        ));
                      }}
                      max={200}
                      step={5}
                      className="mt-1"
                    />
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Preview Area */}
          <div className="flex-1 bg-black flex items-center justify-center p-4">
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full border border-gray-600"
                style={{ aspectRatio: '16/9' }}
              />
              
              {/* Playback Controls Overlay */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-black/50 rounded-full px-4 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentTime(Math.min(maxDuration, currentTime + 10))}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
                
                <span className="text-sm text-white">
                  {formatTime(currentTime)} / {formatTime(maxDuration)}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="h-48 bg-gray-800 border-t border-gray-700 overflow-x-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">Timeline</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setZoomLevel(Math.max(25, zoomLevel - 25))}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">{zoomLevel}%</span>
                  <Button variant="ghost" size="sm" onClick={() => setZoomLevel(Math.min(400, zoomLevel + 25))}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div
                ref={timelineRef}
                className="relative h-32 bg-gray-900 rounded border border-gray-600"
                style={{ width: `${(maxDuration * timelineScale * zoomLevel) / 100}px` }}
              >
                {/* Time markers */}
                <div className="absolute top-0 left-0 right-0 h-4 border-b border-gray-600">
                  {Array.from({ length: Math.ceil(maxDuration / 10) + 1 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 h-full border-l border-gray-600 text-xs text-gray-400"
                      style={{ left: `${(i * 10 * timelineScale * zoomLevel) / 100}px` }}
                    >
                      <span className="ml-1">{formatTime(i * 10)}</span>
                    </div>
                  ))}
                </div>
                
                {/* Video tracks */}
                <div className="absolute top-4 left-0 right-0 h-6">
                  {videoClips.map((clip) => (
                    <div
                      key={clip.id}
                      className={`absolute h-full bg-blue-600 rounded border-2 cursor-pointer ${
                        selectedClip === clip.id ? 'border-blue-400' : 'border-blue-700'
                      }`}
                      style={{
                        left: `${(clip.startTime * timelineScale * zoomLevel) / 100}px`,
                        width: `${((clip.endTime - clip.startTime) * timelineScale * zoomLevel) / 100}px`
                      }}
                      onClick={() => setSelectedClip(clip.id)}
                    >
                      <div className="text-xs text-white p-1 truncate">{clip.name}</div>
                    </div>
                  ))}
                </div>
                
                {/* Audio tracks */}
                <div className="absolute top-12 left-0 right-0 h-6">
                  {audioClips.map((clip) => (
                    <div
                      key={clip.id}
                      className="absolute h-full bg-green-600 rounded border-2 border-green-700 cursor-pointer"
                      style={{
                        left: `${(clip.startTime * timelineScale * zoomLevel) / 100}px`,
                        width: `${((clip.endTime - clip.startTime) * timelineScale * zoomLevel) / 100}px`
                      }}
                    >
                      <div className="text-xs text-white p-1 truncate">{clip.name}</div>
                    </div>
                  ))}
                </div>
                
                {/* Text tracks */}
                <div className="absolute top-20 left-0 right-0 h-6">
                  {textElements.map((text) => (
                    <div
                      key={text.id}
                      className="absolute h-full bg-purple-600 rounded border-2 border-purple-700 cursor-pointer"
                      style={{
                        left: `${(text.startTime * timelineScale * zoomLevel) / 100}px`,
                        width: `${((text.endTime - text.startTime) * timelineScale * zoomLevel) / 100}px`
                      }}
                    >
                      <div className="text-xs text-white p-1 truncate">{text.text}</div>
                    </div>
                  ))}
                </div>
                
                {/* Playhead */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                  style={{ left: `${(currentTime * timelineScale * zoomLevel) / 100}px` }}
                >
                  <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Eigenschaften</h3>
            
            {selectedClip && (
              <div className="space-y-4">
                {(() => {
                  const clip = videoClips.find(c => c.id === selectedClip);
                  if (!clip) return null;
                  
                  return (
                    <>
                      <div>
                        <Label className="text-sm">Position X</Label>
                        <Slider
                          value={[clip.position.x]}
                          onValueChange={([value]) => {
                            setVideoClips(prev => prev.map(c => 
                              c.id === selectedClip ? { ...c, position: { ...c.position, x: value } } : c
                            ));
                          }}
                          max={1920}
                          step={1}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm">Position Y</Label>
                        <Slider
                          value={[clip.position.y]}
                          onValueChange={([value]) => {
                            setVideoClips(prev => prev.map(c => 
                              c.id === selectedClip ? { ...c, position: { ...c.position, y: value } } : c
                            ));
                          }}
                          max={1080}
                          step={1}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm">Skalierung: {Math.round(clip.scale * 100)}%</Label>
                        <Slider
                          value={[clip.scale]}
                          onValueChange={([value]) => {
                            setVideoClips(prev => prev.map(c => 
                              c.id === selectedClip ? { ...c, scale: value } : c
                            ));
                          }}
                          min={0.1}
                          max={3}
                          step={0.1}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm">Rotation: {clip.rotation}°</Label>
                        <Slider
                          value={[clip.rotation]}
                          onValueChange={([value]) => {
                            setVideoClips(prev => prev.map(c => 
                              c.id === selectedClip ? { ...c, rotation: value } : c
                            ));
                          }}
                          min={-180}
                          max={180}
                          step={1}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm">Deckkraft: {Math.round(clip.opacity * 100)}%</Label>
                        <Slider
                          value={[clip.opacity]}
                          onValueChange={([value]) => {
                            setVideoClips(prev => prev.map(c => 
                              c.id === selectedClip ? { ...c, opacity: value } : c
                            ));
                          }}
                          min={0}
                          max={1}
                          step={0.01}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm">Geschwindigkeit: {clip.speed}x</Label>
                        <Slider
                          value={[clip.speed]}
                          onValueChange={([value]) => {
                            setVideoClips(prev => prev.map(c => 
                              c.id === selectedClip ? { ...c, speed: value } : c
                            ));
                          }}
                          min={0.25}
                          max={4}
                          step={0.25}
                          className="mt-1"
                        />
                      </div>
                      
                      {/* Applied Filters */}
                      {clip.filters.length > 0 && (
                        <div>
                          <Label className="text-sm">Angewendete Filter</Label>
                          <div className="space-y-2 mt-2">
                            {clip.filters.map((filter, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                                <span className="text-sm">{filter.name}</span>
                                <div className="flex items-center space-x-2">
                                  <Slider
                                    value={[filter.intensity]}
                                    onValueChange={([value]) => {
                                      setVideoClips(prev => prev.map(c => {
                                        if (c.id === selectedClip) {
                                          c.filters[index].intensity = value;
                                        }
                                        return c;
                                      }));
                                    }}
                                    max={200}
                                    step={5}
                                    className="w-20"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setVideoClips(prev => prev.map(c => {
                                        if (c.id === selectedClip) {
                                          c.filters.splice(index, 1);
                                        }
                                        return c;
                                      }));
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Video exportieren</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Auflösung</Label>
              <select
                value={exportSettings.resolution}
                onChange={(e) => setExportSettings(prev => ({ ...prev, resolution: e.target.value as any }))}
                className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded"
              >
                <option value="720p">720p (1280x720)</option>
                <option value="1080p">1080p (1920x1080)</option>
                <option value="4K">4K (3840x2160)</option>
              </select>
            </div>
            
            <div>
              <Label>Framerate</Label>
              <select
                value={exportSettings.fps}
                onChange={(e) => setExportSettings(prev => ({ ...prev, fps: parseInt(e.target.value) as any }))}
                className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded"
              >
                <option value={24}>24 FPS</option>
                <option value={30}>30 FPS</option>
                <option value={60}>60 FPS</option>
              </select>
            </div>
            
            <div>
              <Label>Qualität</Label>
              <select
                value={exportSettings.quality}
                onChange={(e) => setExportSettings(prev => ({ ...prev, quality: e.target.value as any }))}
                className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded"
              >
                <option value="low">Niedrig</option>
                <option value="medium">Mittel</option>
                <option value="high">Hoch</option>
                <option value="ultra">Ultra</option>
              </select>
            </div>
            
            <div>
              <Label>Format</Label>
              <select
                value={exportSettings.format}
                onChange={(e) => setExportSettings(prev => ({ ...prev, format: e.target.value as any }))}
                className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded"
              >
                <option value="mp4">MP4</option>
                <option value="webm">WebM</option>
                <option value="mov">MOV</option>
              </select>
            </div>
            
            <Button
              onClick={exportVideo}
              disabled={isExporting}
              className="w-full"
            >
              {isExporting ? 'Exportiere...' : 'Exportieren'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
