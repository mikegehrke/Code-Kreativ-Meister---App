import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw,
  Crop,
  Type,
  Music,
  Sparkles,
  Filter,
  Download,
  Upload,
  Scissors,
  Volume2,
  VolumeX,
  Mic
} from "lucide-react";

interface VideoEditorProps {
  videoUrl?: string;
  onSave?: (editedVideo: any) => void;
}

const VideoEditor: React.FC<VideoEditorProps> = ({ videoUrl, onSave }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);

  const [editorState, setEditorState] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0,
    rotation: 0,
    scale: 1,
    selectedFilter: "none",
  });

  const [textOverlays, setTextOverlays] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("trim");

  const filters = [
    { id: "none", name: "Original", preview: "brightness(1)" },
    { id: "vintage", name: "Vintage", preview: "sepia(0.5) contrast(1.2)" },
    { id: "bw", name: "Schwarz-Weiß", preview: "grayscale(1)" },
    { id: "warm", name: "Warm", preview: "hue-rotate(15deg) saturate(1.2)" },
    { id: "cool", name: "Cool", preview: "hue-rotate(-15deg) saturate(1.1)" },
    { id: "dramatic", name: "Dramatisch", preview: "contrast(1.3) brightness(0.9)" },
  ];

  const musicTracks = [
    { id: "1", name: "Upbeat Techno", duration: "3:24", genre: "Electronic" },
    { id: "2", name: "Chill Vibes", duration: "2:45", genre: "Ambient" },
    { id: "3", name: "Party Anthem", duration: "3:12", genre: "Dance" },
    { id: "4", name: "Jazz Night", duration: "4:01", genre: "Jazz" },
  ];

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const applyFilter = (filter: any) => {
    setEditorState({ ...editorState, selectedFilter: filter.id });
  };

  const addTextOverlay = () => {
    const newText = {
      id: Date.now(),
      text: "Neuer Text",
      x: 50,
      y: 50,
      fontSize: 24,
      color: "#ffffff",
      fontFamily: "Arial",
    };
    setTextOverlays([...textOverlays, newText]);
  };

  const exportVideo = () => {
    // Mock export functionality
    const exportSettings = {
      ...editorState,
      textOverlays,
      volume,
      duration: currentTime,
    };
    
    console.log("Exporting video with settings:", exportSettings);
    onSave?.(exportSettings);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Video Preview */}
      <Card>
        <CardContent className="p-0">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-[9/16] max-h-[600px] mx-auto">
            <video
              ref={videoRef}
              src={videoUrl || "/api/placeholder/400/600"}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              style={{
                filter: `
                  brightness(${1 + editorState.brightness / 100}) 
                  contrast(${1 + editorState.contrast / 100}) 
                  saturate(${1 + editorState.saturation / 100}) 
                  blur(${editorState.blur}px)
                  ${filters.find(f => f.id === editorState.selectedFilter)?.preview || ""}
                `,
                transform: `rotate(${editorState.rotation}deg) scale(${editorState.scale})`,
              }}
            />
            
            {/* Text Overlays */}
            {textOverlays.map((overlay) => (
              <div
                key={overlay.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${overlay.x}%`,
                  top: `${overlay.y}%`,
                  fontSize: `${overlay.fontSize}px`,
                  color: overlay.color,
                  fontFamily: overlay.fontFamily,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                }}
              >
                {overlay.text}
              </div>
            ))}

            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="space-y-3">
                {/* Progress Bar */}
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="w-full"
                />
                
                {/* Control Buttons */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={togglePlay}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    
                    <Slider
                      value={[volume]}
                      max={100}
                      onValueChange={handleVolumeChange}
                      className="w-20"
                    />
                  </div>

                  <div className="text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {[
          { id: "trim", label: "Trimmen", icon: Scissors },
          { id: "filters", label: "Filter", icon: Filter },
          { id: "adjust", label: "Anpassen", icon: Sparkles },
          { id: "text", label: "Text", icon: Type },
          { id: "music", label: "Musik", icon: Music },
          { id: "effects", label: "Effekte", icon: Sparkles },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Editor Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trim Panel */}
        {activeTab === "trim" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scissors className="h-5 w-5" />
                Video trimmen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Start Zeit</label>
                <Input type="number" placeholder="0" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">End Zeit</label>
                <Input type="number" placeholder={duration.toString()} className="mt-1" />
              </div>
              <Button className="w-full">
                <Scissors className="h-4 w-4 mr-2" />
                Trimmen anwenden
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Filters Panel */}
        {activeTab === "filters" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter auswählen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {filters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={editorState.selectedFilter === filter.id ? "default" : "outline"}
                    onClick={() => applyFilter(filter)}
                    className="h-auto p-3 flex flex-col items-center gap-2"
                  >
                    <div 
                      className="w-12 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded"
                      style={{ filter: filter.preview }}
                    />
                    <span className="text-xs">{filter.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Adjust Panel */}
        {activeTab === "adjust" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Anpassungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium">Helligkeit</label>
                <Slider
                  value={[editorState.brightness]}
                  onValueChange={(value) => setEditorState({...editorState, brightness: value[0]})}
                  min={-100}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Kontrast</label>
                <Slider
                  value={[editorState.contrast]}
                  onValueChange={(value) => setEditorState({...editorState, contrast: value[0]})}
                  min={-100}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Sättigung</label>
                <Slider
                  value={[editorState.saturation]}
                  onValueChange={(value) => setEditorState({...editorState, saturation: value[0]})}
                  min={-100}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditorState({...editorState, rotation: editorState.rotation - 90})}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditorState({...editorState, rotation: editorState.rotation + 90})}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Text Panel */}
        {activeTab === "text" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Text hinzufügen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={addTextOverlay} className="w-full">
                <Type className="h-4 w-4 mr-2" />
                Text hinzufügen
              </Button>
              
              {textOverlays.map((overlay, index) => (
                <div key={overlay.id} className="p-3 border rounded-lg space-y-2">
                  <Input
                    value={overlay.text}
                    onChange={(e) => {
                      const updated = [...textOverlays];
                      updated[index].text = e.target.value;
                      setTextOverlays(updated);
                    }}
                  />
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={overlay.color}
                      onChange={(e) => {
                        const updated = [...textOverlays];
                        updated[index].color = e.target.value;
                        setTextOverlays(updated);
                      }}
                      className="w-8 h-8 rounded border"
                    />
                    <Input
                      type="number"
                      value={overlay.fontSize}
                      onChange={(e) => {
                        const updated = [...textOverlays];
                        updated[index].fontSize = parseInt(e.target.value);
                        setTextOverlays(updated);
                      }}
                      className="w-20"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Music Panel */}
        {activeTab === "music" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Hintergrundmusik
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {musicTracks.map((track) => (
                <div key={track.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm">{track.name}</h4>
                    <p className="text-xs text-muted-foreground">{track.genre} • {track.duration}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Hinzufügen
                  </Button>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Eigene Musik hochladen
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Video exportieren
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Video ist bereit zum Exportieren</p>
              <p className="text-sm text-muted-foreground">
                Qualität: HD 1080p • Format: MP4
              </p>
            </div>
            <Button onClick={exportVideo} className="bg-gradient-to-r from-primary to-accent">
              <Download className="h-4 w-4 mr-2" />
              Exportieren
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoEditor;