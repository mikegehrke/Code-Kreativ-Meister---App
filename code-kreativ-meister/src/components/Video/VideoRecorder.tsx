import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  Video, 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  FlipHorizontal, 
  FlipVertical, 
  Zap, 
  Sun, 
  Moon, 
  Filter, 
  Palette, 
  Sparkles, 
  Crown, 
  Star, 
  Heart, 
  Smile, 
  Eye, 
  Wand2, 
  Timer, 
  Clock, 
  Settings, 
  Download, 
  Upload, 
  Save, 
  X, 
  Check, 
  AlertCircle, 
  Info, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  RotateCw, 
  Move, 
  ZoomIn, 
  ZoomOut, 
  Grid, 
  Crosshair, 
  Focus, 
  Aperture, 
  Contrast, 
  Brightness, 
  Saturation, 
  Blur, 
  Sharpen, 
  Music, 
  Headphones, 
  Radio, 
  Disc, 
  PlayCircle, 
  PauseCircle, 
  StopCircle, 
  SkipBack, 
  SkipForward, 
  FastForward, 
  Rewind,
  Layers,
  Image,
  Type,
  PenTool,
  Eraser,
  Paintbrush,
  Scissors,
  Copy,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { usePayment } from '@/components/Payment/StripePaymentProvider';

interface VideoRecorderProps {
  onVideoSaved?: (videoData: RecordedVideoData) => void;
  onCancel?: () => void;
  maxDuration?: number; // in seconds
  allowedDurations?: number[]; // available time limits
}

interface RecordedVideoData {
  id: string;
  blob: Blob;
  url: string;
  duration: number;
  thumbnail: string;
  metadata: {
    resolution: string;
    fps: number;
    bitrate: number;
    format: string;
    filters: string[];
    effects: string[];
  };
}

interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  sharpen: number;
  vintage: number;
  vignette: number;
}

interface RecordingSettings {
  resolution: '720p' | '1080p' | '4K';
  fps: 24 | 30 | 60;
  bitrate: number;
  format: 'mp4' | 'webm';
  quality: 'low' | 'medium' | 'high' | 'ultra';
}

const timeOptions = [
  { value: 300, label: '5 Minuten', premium: false, icon: Clock },
  { value: 600, label: '10 Minuten', premium: false, icon: Clock },
  { value: 960, label: '16 Minuten', premium: true, icon: Crown },
  { value: 1200, label: '20 Minuten', premium: true, icon: Crown },
  { value: 1560, label: '26 Minuten', premium: true, icon: Crown },
  { value: 1800, label: '30 Minuten', premium: true, icon: Crown },
  { value: 3600, label: '60 Minuten', premium: true, icon: Star }
];

const beautyFilters = [
  { id: 'smooth', name: 'Hautglättung', intensity: 50 },
  { id: 'brighten', name: 'Aufhellen', intensity: 30 },
  { id: 'slim', name: 'Gesicht schmaler', intensity: 20 },
  { id: 'eyes', name: 'Augen vergrößern', intensity: 25 },
  { id: 'lips', name: 'Lippen betonen', intensity: 15 }
];

const arFilters = [
  { id: 'none', name: 'Kein Filter', emoji: '🚫' },
  { id: 'dog', name: 'Hund', emoji: '🐶' },
  { id: 'cat', name: 'Katze', emoji: '🐱' },
  { id: 'bunny', name: 'Hase', emoji: '🐰' },
  { id: 'crown', name: 'Krone', emoji: '👑' },
  { id: 'glasses', name: 'Brille', emoji: '🕶️' },
  { id: 'mustache', name: 'Schnurrbart', emoji: '👨' },
  { id: 'unicorn', name: 'Einhorn', emoji: '🦄' },
  { id: 'devil', name: 'Teufel', emoji: '😈' },
  { id: 'angel', name: 'Engel', emoji: '😇' }
];

const colorFilters = [
  { id: 'none', name: 'Original', preview: 'bg-gray-200' },
  { id: 'vintage', name: 'Vintage', preview: 'bg-yellow-200' },
  { id: 'bw', name: 'Schwarz-Weiß', preview: 'bg-gray-400' },
  { id: 'sepia', name: 'Sepia', preview: 'bg-yellow-600' },
  { id: 'cool', name: 'Kühl', preview: 'bg-blue-200' },
  { id: 'warm', name: 'Warm', preview: 'bg-orange-200' },
  { id: 'dramatic', name: 'Dramatisch', preview: 'bg-purple-300' },
  { id: 'neon', name: 'Neon', preview: 'bg-pink-300' }
];

export const VideoRecorder: React.FC<VideoRecorderProps> = ({
  onVideoSaved,
  onCancel,
  maxDuration = 300,
  allowedDurations = [300, 600, 960, 1200, 1560, 1800, 3600]
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(maxDuration);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [isMuted, setIsMuted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedARFilter, setSelectedARFilter] = useState('none');
  const [selectedColorFilter, setSelectedColorFilter] = useState('none');
  const [beautySettings, setBeautySettings] = useState(
    beautyFilters.reduce((acc, filter) => ({ ...acc, [filter.id]: filter.intensity }), {} as Record<string, number>)
  );
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    sharpen: 0,
    vintage: 0,
    vignette: 0
  });
  const [recordingSettings, setRecordingSettings] = useState<RecordingSettings>({
    resolution: '1080p',
    fps: 30,
    bitrate: 5000,
    format: 'mp4',
    quality: 'high'
  });
  const [hasPermissions, setHasPermissions] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { subscription } = usePayment();
  const currentPlan = subscription?.planId || 'free';

  // Initialize camera
  useEffect(() => {
    initializeCamera();
    return () => {
      cleanup();
    };
  }, [cameraFacing]);

  // Timer effect
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= selectedDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused, selectedDuration]);

  const initializeCamera = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: recordingSettings.fps }
        },
        audio: !isMuted
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setHasPermissions(true);
      setupCanvas();
    } catch (error) {
      console.error('Camera initialization failed:', error);
      toast.error('Kamera-Zugriff fehlgeschlagen');
      setHasPermissions(false);
    }
  };

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;
    
    canvas.width = 1920;
    canvas.height = 1080;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawFrame = () => {
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        requestAnimationFrame(drawFrame);
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply filters
      let filterString = '';
      if (filterSettings.brightness !== 100) filterString += `brightness(${filterSettings.brightness}%) `;
      if (filterSettings.contrast !== 100) filterString += `contrast(${filterSettings.contrast}%) `;
      if (filterSettings.saturation !== 100) filterString += `saturate(${filterSettings.saturation}%) `;
      if (filterSettings.hue !== 0) filterString += `hue-rotate(${filterSettings.hue}deg) `;
      if (filterSettings.blur > 0) filterString += `blur(${filterSettings.blur}px) `;
      
      ctx.filter = filterString || 'none';
      
      // Draw video
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Apply AR filter overlay (simplified)
      if (selectedARFilter !== 'none') {
        drawARFilter(ctx);
      }
      
      // Apply color filter
      if (selectedColorFilter !== 'none') {
        applyColorFilter(ctx);
      }
      
      requestAnimationFrame(drawFrame);
    };
    
    drawFrame();
  };

  const drawARFilter = (ctx: CanvasRenderingContext2D) => {
    // Simplified AR filter rendering
    const filter = arFilters.find(f => f.id === selectedARFilter);
    if (!filter) return;
    
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(filter.emoji, ctx.canvas.width / 2, ctx.canvas.height / 2);
  };

  const applyColorFilter = (ctx: CanvasRenderingContext2D) => {
    if (selectedColorFilter === 'none') return;
    
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;
    
    switch (selectedColorFilter) {
      case 'bw':
        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
        }
        break;
      case 'sepia':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
          data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
          data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
        }
        break;
      // Add more color filters as needed
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const startRecording = async () => {
    if (!streamRef.current || !canvasRef.current) {
      toast.error('Kamera nicht bereit');
      return;
    }

    try {
      // Create stream from canvas for filtered recording
      const canvasStream = canvasRef.current.captureStream(recordingSettings.fps);
      
      // Add audio track if not muted
      if (!isMuted && streamRef.current.getAudioTracks().length > 0) {
        canvasStream.addTrack(streamRef.current.getAudioTracks()[0]);
      }

      const mediaRecorder = new MediaRecorder(canvasStream, {
        mimeType: `video/${recordingSettings.format}`,
        videoBitsPerSecond: recordingSettings.bitrate * 1000
      });

      mediaRecorderRef.current = mediaRecorder;
      setRecordedChunks([]);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };

      mediaRecorder.onstop = () => {
        handleRecordingComplete();
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setRecordingTime(0);
      
      toast.success('Aufnahme gestartet!');
    } catch (error) {
      console.error('Recording start failed:', error);
      toast.error('Aufnahme konnte nicht gestartet werden');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      toast.success('Aufnahme beendet!');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        toast.success('Aufnahme fortgesetzt');
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        toast.success('Aufnahme pausiert');
      }
    }
  };

  const handleRecordingComplete = async () => {
    if (recordedChunks.length === 0) return;

    const blob = new Blob(recordedChunks, { type: `video/${recordingSettings.format}` });
    const url = URL.createObjectURL(blob);
    
    // Generate thumbnail
    const thumbnail = await generateThumbnail(url);
    
    const videoData: RecordedVideoData = {
      id: Date.now().toString(),
      blob,
      url,
      duration: recordingTime,
      thumbnail,
      metadata: {
        resolution: recordingSettings.resolution,
        fps: recordingSettings.fps,
        bitrate: recordingSettings.bitrate,
        format: recordingSettings.format,
        filters: [selectedColorFilter, selectedARFilter].filter(f => f !== 'none'),
        effects: Object.entries(beautySettings)
          .filter(([_, value]) => value > 0)
          .map(([key, _]) => key)
      }
    };

    onVideoSaved?.(videoData);
  };

  const generateThumbnail = async (videoUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.onloadedmetadata = () => {
        canvas.width = 320;
        canvas.height = 180;
        video.currentTime = Math.min(1, video.duration / 2);
      };
      
      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        }
      };
      
      video.src = videoUrl;
    });
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const switchCamera = () => {
    setCameraFacing(prev => prev === 'user' ? 'environment' : 'user');
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getAvailableTimeOptions = () => {
    return timeOptions.filter(option => {
      if (option.premium && currentPlan === 'free') {
        return false;
      }
      return allowedDurations.includes(option.value);
    });
  };

  const progressPercentage = (recordingTime / selectedDuration) * 100;

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Timer className="h-4 w-4" />
            <span className="font-mono text-lg">
              {formatTime(recordingTime)} / {formatTime(selectedDuration)}
            </span>
          </div>
          
          {isRecording && (
            <Badge variant="destructive" className="animate-pulse">
              ● REC
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={() => setShowFilters(true)}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Video Preview */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
        />
        
        {/* Canvas for filtered output */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ display: hasPermissions ? 'block' : 'none' }}
        />

        {/* Permission Request */}
        {!hasPermissions && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <Card className="max-w-md mx-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-5 w-5" />
                  <span>Kamera-Berechtigung erforderlich</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Bitte erlauben Sie den Zugriff auf Kamera und Mikrofon, um Videos aufzunehmen.
                </p>
                <Button onClick={initializeCamera} className="w-full">
                  Berechtigung erteilen
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Progress Bar */}
        {isRecording && (
          <div className="absolute top-4 left-4 right-4">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {/* Time Selection */}
        {!isRecording && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
              {getAvailableTimeOptions().map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedDuration(option.value)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedDuration === option.value
                      ? 'bg-white text-black'
                      : 'bg-transparent text-white hover:bg-white/20'
                  }`}
                >
                  {option.premium && <Crown className="h-3 w-3 inline mr-1" />}
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex items-center space-x-6">
            {/* Flip Camera */}
            <Button
              variant="ghost"
              size="lg"
              onClick={switchCamera}
              className="bg-black/50 hover:bg-black/70 rounded-full h-12 w-12"
              disabled={isRecording}
            >
              <RotateCw className="h-6 w-6" />
            </Button>

            {/* Record Button */}
            <div className="relative">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={!hasPermissions}
                className={`rounded-full h-20 w-20 border-4 border-white transition-all ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-transparent hover:bg-white/20'
                }`}
              >
                {isRecording ? (
                  <Square className="h-8 w-8" />
                ) : (
                  <div className="h-16 w-16 bg-red-500 rounded-full" />
                )}
              </Button>
              
              {isRecording && (
                <Button
                  onClick={pauseRecording}
                  className="absolute -right-16 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full h-12 w-12"
                >
                  {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
                </Button>
              )}
            </div>

            {/* Mute Toggle */}
            <Button
              variant="ghost"
              size="lg"
              onClick={toggleMute}
              className={`bg-black/50 hover:bg-black/70 rounded-full h-12 w-12 ${
                isMuted ? 'text-red-400' : 'text-white'
              }`}
            >
              {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Dialog */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Filter & Effekte</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* AR Filters */}
            <div>
              <h3 className="text-lg font-medium mb-3">AR-Filter</h3>
              <div className="grid grid-cols-5 gap-3">
                {arFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedARFilter(filter.id)}
                    className={`p-4 rounded-lg border-2 text-center transition-colors ${
                      selectedARFilter === filter.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{filter.emoji}</div>
                    <div className="text-sm">{filter.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filters */}
            <div>
              <h3 className="text-lg font-medium mb-3">Farbfilter</h3>
              <div className="grid grid-cols-4 gap-3">
                {colorFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedColorFilter(filter.id)}
                    className={`p-4 rounded-lg border-2 text-center transition-colors ${
                      selectedColorFilter === filter.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-12 rounded mb-2 ${filter.preview}`}></div>
                    <div className="text-sm">{filter.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Beauty Filters */}
            <div>
              <h3 className="text-lg font-medium mb-3">Beauty-Filter</h3>
              <div className="space-y-4">
                {beautyFilters.map((filter) => (
                  <div key={filter.id}>
                    <div className="flex items-center justify-between mb-2">
                      <Label>{filter.name}</Label>
                      <span className="text-sm text-gray-500">
                        {beautySettings[filter.id]}%
                      </span>
                    </div>
                    <Slider
                      value={[beautySettings[filter.id]]}
                      onValueChange={([value]) => 
                        setBeautySettings(prev => ({ ...prev, [filter.id]: value }))
                      }
                      max={100}
                      step={5}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Manual Adjustments */}
            <div>
              <h3 className="text-lg font-medium mb-3">Manuelle Anpassungen</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Helligkeit</Label>
                    <span className="text-sm text-gray-500">
                      {filterSettings.brightness}%
                    </span>
                  </div>
                  <Slider
                    value={[filterSettings.brightness]}
                    onValueChange={([value]) => 
                      setFilterSettings(prev => ({ ...prev, brightness: value }))
                    }
                    min={50}
                    max={150}
                    step={5}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Kontrast</Label>
                    <span className="text-sm text-gray-500">
                      {filterSettings.contrast}%
                    </span>
                  </div>
                  <Slider
                    value={[filterSettings.contrast]}
                    onValueChange={([value]) => 
                      setFilterSettings(prev => ({ ...prev, contrast: value }))
                    }
                    min={50}
                    max={150}
                    step={5}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Sättigung</Label>
                    <span className="text-sm text-gray-500">
                      {filterSettings.saturation}%
                    </span>
                  </div>
                  <Slider
                    value={[filterSettings.saturation]}
                    onValueChange={([value]) => 
                      setFilterSettings(prev => ({ ...prev, saturation: value }))
                    }
                    min={0}
                    max={200}
                    step={5}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Farbton</Label>
                    <span className="text-sm text-gray-500">
                      {filterSettings.hue}°
                    </span>
                  </div>
                  <Slider
                    value={[filterSettings.hue]}
                    onValueChange={([value]) => 
                      setFilterSettings(prev => ({ ...prev, hue: value }))
                    }
                    min={-180}
                    max={180}
                    step={5}
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Aufnahme-Einstellungen</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Auflösung</Label>
              <select
                value={recordingSettings.resolution}
                onChange={(e) => setRecordingSettings(prev => ({ 
                  ...prev, 
                  resolution: e.target.value as any 
                }))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="720p">720p (HD)</option>
                <option value="1080p">1080p (Full HD)</option>
                <option value="4K">4K (Ultra HD)</option>
              </select>
            </div>

            <div>
              <Label>Framerate</Label>
              <select
                value={recordingSettings.fps}
                onChange={(e) => setRecordingSettings(prev => ({ 
                  ...prev, 
                  fps: parseInt(e.target.value) as any 
                }))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value={24}>24 FPS</option>
                <option value={30}>30 FPS</option>
                <option value={60}>60 FPS</option>
              </select>
            </div>

            <div>
              <Label>Qualität</Label>
              <select
                value={recordingSettings.quality}
                onChange={(e) => setRecordingSettings(prev => ({ 
                  ...prev, 
                  quality: e.target.value as any 
                }))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
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
                value={recordingSettings.format}
                onChange={(e) => setRecordingSettings(prev => ({ 
                  ...prev, 
                  format: e.target.value as any 
                }))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="mp4">MP4</option>
                <option value="webm">WebM</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Bitrate</Label>
                <span className="text-sm text-gray-500">
                  {recordingSettings.bitrate} kbps
                </span>
              </div>
              <Slider
                value={[recordingSettings.bitrate]}
                onValueChange={([value]) => 
                  setRecordingSettings(prev => ({ ...prev, bitrate: value }))
                }
                min={1000}
                max={20000}
                step={500}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
