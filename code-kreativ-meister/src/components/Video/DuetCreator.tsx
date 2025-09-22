import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff,
  Camera,
  CameraOff,
  Maximize,
  Minimize,
  Download,
  Share,
  Settings,
  Layers,
  Scissors,
  Music,
  Palette,
  Sparkles,
  Timer,
  Zap,
  Eye,
  EyeOff,
  MoreHorizontal,
  Check,
  X,
  Upload,
  Film,
  Wand2
} from 'lucide-react';
import { toast } from 'sonner';

interface OriginalVideo {
  id: string;
  title: string;
  creator: {
    name: string;
    handle: string;
    avatar: string;
  };
  videoUrl: string;
  thumbnail: string;
  duration: number;
  audioUrl?: string;
}

interface DuetCreatorProps {
  originalVideo: OriginalVideo;
  onSave?: (duetData: any) => void;
  onCancel?: () => void;
}

interface RecordingSettings {
  layout: 'side-by-side' | 'split-screen' | 'picture-in-picture' | 'overlay';
  audioMix: 'both' | 'original-only' | 'duet-only' | 'custom';
  originalVolume: number;
  duetVolume: number;
  syncMode: 'auto' | 'manual';
  startTime: number;
  duration: number;
  quality: '720p' | '1080p' | '4K';
  effects: string[];
}

const layoutOptions = [
  { id: 'side-by-side', name: 'Nebeneinander', icon: Layers },
  { id: 'split-screen', name: 'Geteilter Bildschirm', icon: Scissors },
  { id: 'picture-in-picture', name: 'Bild-in-Bild', icon: Maximize },
  { id: 'overlay', name: 'Überlagerung', icon: Eye }
];

const effectOptions = [
  { id: 'beauty', name: 'Beauty Filter', icon: Sparkles },
  { id: 'blur-bg', name: 'Hintergrund unscharf', icon: Eye },
  { id: 'green-screen', name: 'Green Screen', icon: Palette },
  { id: 'vintage', name: 'Vintage', icon: Film },
  { id: 'neon', name: 'Neon', icon: Zap },
  { id: 'black-white', name: 'Schwarz-Weiß', icon: Palette }
];

export const DuetCreator: React.FC<DuetCreatorProps> = ({
  originalVideo,
  onSave,
  onCancel
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedTime, setRecordedTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  
  const [settings, setSettings] = useState<RecordingSettings>({
    layout: 'side-by-side',
    audioMix: 'both',
    originalVolume: 80,
    duetVolume: 100,
    syncMode: 'auto',
    startTime: 0,
    duration: originalVideo.duration,
    quality: '1080p',
    effects: []
  });

  const originalVideoRef = useRef<HTMLVideoElement>(null);
  const duetVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number>();

  // Initialize camera and microphone
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30 }
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        
        streamRef.current = stream;
        if (duetVideoRef.current) {
          duetVideoRef.current.srcObject = stream;
        }
        setHasPermissions(true);
      } catch (error) {
        console.error('Media access denied:', error);
        toast.error('Kamera- und Mikrofon-Zugriff erforderlich');
      }
    };

    initializeMedia();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Canvas rendering for duet layout
  const renderDuetFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const originalVideo = originalVideoRef.current;
    const duetVideo = duetVideoRef.current;
    
    if (!canvas || !originalVideo || !duetVideo) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Apply effects
    if (settings.effects.includes('blur-bg')) {
      ctx.filter = 'blur(10px)';
    }
    if (settings.effects.includes('black-white')) {
      ctx.filter = 'grayscale(100%)';
    }
    if (settings.effects.includes('vintage')) {
      ctx.filter = 'sepia(100%) contrast(1.2) brightness(1.1)';
    }

    // Render based on layout
    switch (settings.layout) {
      case 'side-by-side':
        // Original video on left
        ctx.drawImage(originalVideo, 0, 0, canvasWidth / 2, canvasHeight);
        // Duet video on right
        ctx.drawImage(duetVideo, canvasWidth / 2, 0, canvasWidth / 2, canvasHeight);
        break;
        
      case 'split-screen':
        // Original video on top
        ctx.drawImage(originalVideo, 0, 0, canvasWidth, canvasHeight / 2);
        // Duet video on bottom
        ctx.drawImage(duetVideo, 0, canvasHeight / 2, canvasWidth, canvasHeight / 2);
        break;
        
      case 'picture-in-picture':
        // Original video full screen
        ctx.drawImage(originalVideo, 0, 0, canvasWidth, canvasHeight);
        // Duet video as small overlay
        const pipWidth = canvasWidth * 0.3;
        const pipHeight = canvasHeight * 0.3;
        ctx.drawImage(duetVideo, canvasWidth - pipWidth - 20, 20, pipWidth, pipHeight);
        break;
        
      case 'overlay':
        // Blend both videos
        ctx.globalAlpha = 0.7;
        ctx.drawImage(originalVideo, 0, 0, canvasWidth, canvasHeight);
        ctx.globalAlpha = 0.5;
        ctx.drawImage(duetVideo, 0, 0, canvasWidth, canvasHeight);
        ctx.globalAlpha = 1.0;
        break;
    }

    // Add effects overlay
    if (settings.effects.includes('neon')) {
      ctx.shadowColor = '#00ff00';
      ctx.shadowBlur = 20;
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
      ctx.shadowBlur = 0;
    }

    if (isRecording && !isPaused) {
      animationFrameRef.current = requestAnimationFrame(renderDuetFrame);
    }
  }, [settings, isRecording, isPaused]);

  // Start recording
  const startRecording = async () => {
    if (!hasPermissions || !canvasRef.current) {
      toast.error('Berechtigung erforderlich');
      return;
    }

    try {
      // Start original video
      if (originalVideoRef.current) {
        originalVideoRef.current.currentTime = settings.startTime;
        await originalVideoRef.current.play();
      }

      // Setup canvas stream
      const canvasStream = canvasRef.current.captureStream(30);
      
      // Add audio from both sources
      const audioContext = new AudioContext();
      const destination = audioContext.createMediaStreamDestination();
      
      // Original video audio
      if (originalVideoRef.current && settings.audioMix !== 'duet-only') {
        const originalSource = audioContext.createMediaElementSource(originalVideoRef.current);
        const originalGain = audioContext.createGain();
        originalGain.gain.value = settings.originalVolume / 100;
        originalSource.connect(originalGain).connect(destination);
      }
      
      // Duet audio
      if (streamRef.current && settings.audioMix !== 'original-only') {
        const duetSource = audioContext.createMediaStreamSource(streamRef.current);
        const duetGain = audioContext.createGain();
        duetGain.gain.value = settings.duetVolume / 100;
        duetSource.connect(duetGain).connect(destination);
      }

      // Combine video and audio streams
      const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...destination.stream.getAudioTracks()
      ]);

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm;codecs=vp9,opus',
        videoBitsPerSecond: settings.quality === '4K' ? 8000000 : 
                           settings.quality === '1080p' ? 4000000 : 2000000
      });

      recordedChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        setIsPreviewMode(true);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Record in 100ms chunks
      
      setIsRecording(true);
      setRecordedTime(0);
      renderDuetFrame();
      
      toast.success('Aufnahme gestartet!');
    } catch (error) {
      console.error('Recording failed:', error);
      toast.error('Aufnahme fehlgeschlagen');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (originalVideoRef.current) {
        originalVideoRef.current.pause();
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      toast.success('Aufnahme beendet!');
    }
  };

  // Pause/Resume recording
  const togglePause = () => {
    if (!isRecording) return;
    
    if (isPaused) {
      if (originalVideoRef.current) {
        originalVideoRef.current.play();
      }
      renderDuetFrame();
      setIsPaused(false);
    } else {
      if (originalVideoRef.current) {
        originalVideoRef.current.pause();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setIsPaused(true);
    }
  };

  // Play/Pause original video
  const toggleOriginalVideo = () => {
    if (!originalVideoRef.current) return;
    
    if (isPlaying) {
      originalVideoRef.current.pause();
    } else {
      originalVideoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Save duet
  const saveDuet = () => {
    if (!recordedBlob) return;
    
    const duetData = {
      originalVideoId: originalVideo.id,
      recordedBlob,
      settings,
      duration: recordedTime,
      timestamp: new Date()
    };
    
    onSave?.(duetData);
    toast.success('Duett gespeichert!');
  };

  // Download duet
  const downloadDuet = () => {
    if (!recordedBlob) return;
    
    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `duet-${originalVideo.id}-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Download gestartet!');
  };

  // Update effect
  const toggleEffect = (effectId: string) => {
    setSettings(prev => ({
      ...prev,
      effects: prev.effects.includes(effectId)
        ? prev.effects.filter(e => e !== effectId)
        : [...prev.effects, effectId]
    }));
  };

  // Time update handler
  useEffect(() => {
    const interval = setInterval(() => {
      if (isRecording && !isPaused) {
        setRecordedTime(prev => prev + 0.1);
      }
      
      if (originalVideoRef.current) {
        setCurrentTime(originalVideoRef.current.currentTime);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  // Auto-stop recording when duration reached
  useEffect(() => {
    if (recordedTime >= settings.duration && isRecording) {
      stopRecording();
    }
  }, [recordedTime, settings.duration, isRecording]);

  if (!hasPermissions) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Duett erstellen</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="space-y-4">
            <div className="text-6xl">📹</div>
            <h3 className="text-xl font-semibold">Kamera- und Mikrofon-Zugriff erforderlich</h3>
            <p className="text-gray-400">
              Um ein Duett zu erstellen, benötigen wir Zugriff auf deine Kamera und dein Mikrofon.
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
              <Layers className="h-5 w-5" />
              <span>Duett mit @{originalVideo.creator.handle}</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{settings.quality}</Badge>
              <Badge variant="outline">{settings.layout}</Badge>
              {isRecording && (
                <Badge variant="destructive" className="animate-pulse">
                  ● REC {Math.floor(recordedTime / 60)}:{Math.floor(recordedTime % 60).toString().padStart(2, '0')}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Video Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Video Preview */}
          <Card>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {/* Canvas for combined output */}
                <canvas
                  ref={canvasRef}
                  width={1920}
                  height={1080}
                  className="w-full h-full object-contain"
                />
                
                {/* Hidden video elements */}
                <video
                  ref={originalVideoRef}
                  src={originalVideo.videoUrl}
                  className="hidden"
                  muted={settings.audioMix === 'duet-only'}
                  onLoadedMetadata={() => {
                    if (originalVideoRef.current) {
                      originalVideoRef.current.currentTime = settings.startTime;
                    }
                  }}
                />
                
                <video
                  ref={duetVideoRef}
                  className="hidden"
                  autoPlay
                  muted={settings.audioMix === 'original-only'}
                />

                {/* Recording overlay */}
                {isRecording && (
                  <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-sm font-medium">
                      {Math.floor(recordedTime / 60)}:{Math.floor(recordedTime % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                )}

                {/* Layout preview overlay */}
                {!isRecording && !isPreviewMode && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-4xl mb-4">🎬</div>
                      <h3 className="text-xl font-semibold mb-2">Bereit für dein Duett!</h3>
                      <p className="text-gray-300">Layout: {layoutOptions.find(l => l.id === settings.layout)?.name}</p>
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
                {!isRecording && !isPreviewMode && (
                  <Button
                    onClick={startRecording}
                    size="lg"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Aufnahme starten
                  </Button>
                )}
                
                {isRecording && (
                  <>
                    <Button
                      onClick={togglePause}
                      size="lg"
                      variant="outline"
                    >
                      {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                    </Button>
                    
                    <Button
                      onClick={stopRecording}
                      size="lg"
                      variant="destructive"
                    >
                      <Square className="h-5 w-5 mr-2" />
                      Stopp
                    </Button>
                  </>
                )}
                
                {isPreviewMode && recordedBlob && (
                  <>
                    <Button
                      onClick={saveDuet}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-5 w-5 mr-2" />
                      Speichern
                    </Button>
                    
                    <Button
                      onClick={downloadDuet}
                      size="lg"
                      variant="outline"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download
                    </Button>
                    
                    <Button
                      onClick={() => {
                        setIsPreviewMode(false);
                        setRecordedBlob(null);
                        setRecordedTime(0);
                      }}
                      size="lg"
                      variant="outline"
                    >
                      <RotateCcw className="h-5 w-5 mr-2" />
                      Neu aufnehmen
                    </Button>
                  </>
                )}
                
                <Button
                  onClick={onCancel}
                  size="lg"
                  variant="ghost"
                >
                  <X className="h-5 w-5 mr-2" />
                  Abbrechen
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Original Video Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={originalVideo.thumbnail}
                  alt={originalVideo.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{originalVideo.title}</h4>
                  <p className="text-sm text-gray-400">von @{originalVideo.creator.handle}</p>
                  <p className="text-xs text-gray-500">
                    {Math.floor(originalVideo.duration / 60)}:{(originalVideo.duration % 60).toString().padStart(2, '0')}
                  </p>
                </div>
                <Button
                  onClick={toggleOriginalVideo}
                  variant="outline"
                  size="sm"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Einstellungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="layout">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="layout">Layout</TabsTrigger>
                  <TabsTrigger value="audio">Audio</TabsTrigger>
                </TabsList>
                
                <TabsContent value="layout" className="space-y-4">
                  {/* Layout Selection */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Layout</label>
                    <div className="grid grid-cols-2 gap-2">
                      {layoutOptions.map((layout) => (
                        <button
                          key={layout.id}
                          onClick={() => setSettings(prev => ({ ...prev, layout: layout.id as any }))}
                          className={`p-3 rounded-lg border text-center transition-colors ${
                            settings.layout === layout.id
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <layout.icon className="h-5 w-5 mx-auto mb-1" />
                          <div className="text-xs">{layout.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Qualität</label>
                    <div className="grid grid-cols-3 gap-1">
                      {['720p', '1080p', '4K'].map((quality) => (
                        <button
                          key={quality}
                          onClick={() => setSettings(prev => ({ ...prev, quality: quality as any }))}
                          className={`p-2 rounded text-xs transition-colors ${
                            settings.quality === quality
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                        >
                          {quality}
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="audio" className="space-y-4">
                  {/* Audio Mix */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Audio-Mix</label>
                    <div className="space-y-2">
                      {[
                        { id: 'both', name: 'Beide' },
                        { id: 'original-only', name: 'Nur Original' },
                        { id: 'duet-only', name: 'Nur Duett' }
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSettings(prev => ({ ...prev, audioMix: option.id as any }))}
                          className={`w-full p-2 rounded text-sm transition-colors ${
                            settings.audioMix === option.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Volume Controls */}
                  {settings.audioMix === 'both' && (
                    <>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Original Lautstärke: {settings.originalVolume}%
                        </label>
                        <Slider
                          value={[settings.originalVolume]}
                          onValueChange={([value]) => setSettings(prev => ({ ...prev, originalVolume: value }))}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Duett Lautstärke: {settings.duetVolume}%
                        </label>
                        <Slider
                          value={[settings.duetVolume]}
                          onValueChange={([value]) => setSettings(prev => ({ ...prev, duetVolume: value }))}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Effects */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Effekte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {effectOptions.map((effect) => (
                  <button
                    key={effect.id}
                    onClick={() => toggleEffect(effect.id)}
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      settings.effects.includes(effect.id)
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <effect.icon className="h-4 w-4 mx-auto mb-1" />
                    <div className="text-xs">{effect.name}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Startzeit: {Math.floor(settings.startTime / 60)}:{(settings.startTime % 60).toString().padStart(2, '0')}
                </label>
                <Slider
                  value={[settings.startTime]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, startTime: value }))}
                  max={originalVideo.duration}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Dauer: {Math.floor(settings.duration / 60)}:{(settings.duration % 60).toString().padStart(2, '0')}
                </label>
                <Slider
                  value={[settings.duration]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, duration: value }))}
                  min={5}
                  max={Math.min(60, originalVideo.duration - settings.startTime)}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
