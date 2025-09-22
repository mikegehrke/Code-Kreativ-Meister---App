import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  Video, 
  Image, 
  Music, 
  MapPin, 
  Users, 
  Hash, 
  X, 
  Upload, 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Sparkles,
  Timer,
  Zap
} from "lucide-react";

const Create = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState<"video" | "live">("video");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const venues = [
    { id: "paradiso", name: "Club Paradiso", location: "Berlin, Germany", category: "Nightclub" },
    { id: "underground", name: "Berlin Underground", location: "Berlin, Germany", category: "Underground" },
    { id: "skybar", name: "SkyBar Rooftop", location: "New York, USA", category: "Rooftop Bar" },
    { id: "luxe", name: "Luxe Fashion Lounge", location: "Milan, Italy", category: "VIP Lounge" },
  ];

  const popularTags = [
    "techno", "house", "party", "nightlife", "dj", "live", "berlin", "club", 
    "cocktails", "rooftop", "vip", "music", "dance", "weekend"
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handlePost = () => {
    toast({
      title: "Video wird hochgeladen! 🚀",
      description: "Dein Video wurde erfolgreich hochgeladen und wird verarbeitet.",
    });
    
    // Reset form
    setUploadedFile(null);
    setTitle("");
    setDescription("");
    setSelectedVenue(null);
    setTags([]);
    
    // Navigate back to feed
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handleGoLive = () => {
    navigate("/go-live");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Erstellen</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Einstellungen
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1 mt-4">
          <button
            onClick={() => setSelectedTab("video")}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              selectedTab === "video"
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Video className="h-4 w-4" />
            <span>Video</span>
          </button>
          <button
            onClick={() => setSelectedTab("live")}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              selectedTab === "live"
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Zap className="h-4 w-4" />
            <span>Live Stream</span>
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {selectedTab === "video" && (
          <>
            {/* Video Upload Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Video hochladen</h3>
              
              {!uploadedFile ? (
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Video auswählen</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    MP4, MOV, AVI bis zu 100MB
                  </p>
                  <Button className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600">
                    <Video className="h-4 w-4 mr-2" />
                    Datei auswählen
                  </Button>
                </div>
              ) : (
                <div className="relative bg-black rounded-lg overflow-hidden aspect-[9/16] max-w-xs mx-auto">
                  <video
                    ref={videoRef}
                    src={URL.createObjectURL(uploadedFile)}
                    className="w-full h-full object-cover"
                    muted={isMuted}
                    loop
                  />
                  
                  {/* Video Controls Overlay */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
                      onClick={() => {
                        if (videoRef.current) {
                          if (isPlaying) {
                            videoRef.current.pause();
                          } else {
                            videoRef.current.play();
                          }
                          setIsPlaying(!isPlaying);
                        }
                      }}
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                  </div>

                  {/* Controls */}
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                      onClick={() => {
                        setUploadedFile(null);
                        setTitle("");
                        setDescription("");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Title & Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Titel</label>
                <Input
                  placeholder="Beschreibe dein Video..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {title.length}/100 Zeichen
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Beschreibung</label>
                <Textarea
                  placeholder="Erzähle mehr über dein Video..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {description.length}/500 Zeichen
                </p>
              </div>
            </div>

            {/* Venue Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                <MapPin className="h-4 w-4 inline mr-2" />
                Venue taggen
              </label>
              <div className="grid grid-cols-1 gap-2">
                {venues.map((venue) => (
                  <button
                    key={venue.id}
                    onClick={() => setSelectedVenue(selectedVenue === venue.id ? null : venue.id)}
                    className={`flex items-center space-x-3 p-3 rounded-lg border text-left transition-all duration-200 ${
                      selectedVenue === venue.id
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    <div className="h-10 w-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{venue.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {venue.location} • {venue.category}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                <Hash className="h-4 w-4 inline mr-2" />
                Tags hinzufügen
              </label>
              
              {/* Current Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeTag(tag)}
                    >
                      #{tag}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add Tag */}
              <div className="flex space-x-2">
                <Input
                  placeholder="Tag eingeben..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addTag(newTag);
                    }
                  }}
                />
                <Button
                  onClick={() => addTag(newTag)}
                  disabled={!newTag || tags.includes(newTag) || tags.length >= 10}
                >
                  Hinzufügen
                </Button>
              </div>

              {/* Popular Tags */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Beliebte Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => addTag(tag)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Post Button */}
            <Button
              onClick={handlePost}
              disabled={!uploadedFile || !title}
              className="w-full h-12 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Video posten
            </Button>
          </>
        )}

        {selectedTab === "live" && (
          <div className="text-center py-12 space-y-4">
            <div className="h-24 w-24 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
              <Zap className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-xl font-bold">Live Stream starten</h3>
            <p className="text-muted-foreground">
              Teile deine Nightlife-Erlebnisse live mit deinen Followern!
            </p>
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3"
              onClick={handleGoLive}
            >
              <Zap className="h-5 w-5 mr-2" />
              Live gehen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Create;