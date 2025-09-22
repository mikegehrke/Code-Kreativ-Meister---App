import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { VideoService } from "@/services/VideoService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Upload, Video, Crown, Loader2, X } from "lucide-react";

interface VideoUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const VideoUpload = ({ open, onOpenChange, onSuccess }: VideoUploadProps) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 10) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) {
      toast.error("Bitte logge dich ein");
      return;
    }

    if (!videoFile) {
      toast.error("Bitte wähle ein Video aus");
      return;
    }

    if (!title.trim()) {
      toast.error("Bitte gib einen Titel ein");
      return;
    }

    setLoading(true);

    try {
      // Upload video
      const videoUrl = await VideoService.uploadVideo(videoFile);
      if (!videoUrl) {
        throw new Error("Video upload failed");
      }

      // Upload thumbnail if provided
      let thumbnailUrl = "";
      if (thumbnailFile) {
        const uploadedThumbnail = await VideoService.uploadThumbnail(thumbnailFile);
        if (uploadedThumbnail) {
          thumbnailUrl = uploadedThumbnail;
        }
      }

      // Create video record
      const video = await VideoService.createVideo({
        title: title.trim(),
        description: description.trim() || undefined,
        video_url: videoUrl,
        thumbnail: thumbnailUrl || `/api/placeholder/400/800`,
        creator_id: user.id,
        tags,
        is_premium: isPremium,
        is_live: isLive,
      });

      if (!video) {
        throw new Error("Failed to create video record");
      }

      toast.success("Video erfolgreich hochgeladen! 🎉");
      
      // Reset form
      setTitle("");
      setDescription("");
      setTags([]);
      setTagInput("");
      setIsPremium(false);
      setIsLive(false);
      setVideoFile(null);
      setThumbnailFile(null);
      
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error uploading video:', error);
      toast.error("Fehler beim Hochladen des Videos");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast.error("Video darf maximal 100MB groß sein");
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('video/')) {
        toast.error("Bitte wähle eine Videodatei aus");
        return;
      }
      
      setVideoFile(file);
    }
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Thumbnail darf maximal 5MB groß sein");
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Bitte wähle ein Bild aus");
        return;
      }
      
      setThumbnailFile(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-black/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Video hochladen
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video Upload */}
          <div className="space-y-2">
            <Label htmlFor="video" className="text-white flex items-center">
              <Video className="h-4 w-4 mr-2" />
              Video auswählen *
            </Label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/20 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-white/60" />
                  <p className="mb-2 text-sm text-white/80">
                    {videoFile ? videoFile.name : "Klicke zum Hochladen oder ziehe Dateien hierher"}
                  </p>
                  <p className="text-xs text-white/60">MP4, AVI, MOV (max. 100MB)</p>
                </div>
                <input
                  id="video"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoFileChange}
                  required
                />
              </label>
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail" className="text-white">
              Thumbnail (optional)
            </Label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-white/20 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex flex-col items-center justify-center pt-3 pb-3">
                  <Upload className="w-6 h-6 mb-1 text-white/60" />
                  <p className="text-xs text-white/80">
                    {thumbnailFile ? thumbnailFile.name : "Thumbnail hochladen"}
                  </p>
                </div>
                <input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailFileChange}
                />
              </label>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Titel *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Gib deinem Video einen catchy Titel..."
              maxLength={100}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <p className="text-xs text-white/60">{title.length}/100 Zeichen</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Beschreibung</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beschreibe dein Video..."
              maxLength={500}
              rows={3}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <p className="text-xs text-white/60">{description.length}/500 Zeichen</p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-white">Tags</Label>
            <div className="flex space-x-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Tag hinzufügen..."
                maxLength={20}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 10}
                variant="outline"
              >
                Hinzufügen
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-primary/20 text-primary hover:bg-primary/30"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <p className="text-xs text-white/60">{tags.length}/10 Tags</p>
          </div>

          {/* Premium and Live Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Crown className="h-4 w-4 text-yellow-400" />
                <Label htmlFor="premium" className="text-white">Premium Content</Label>
              </div>
              <Switch
                id="premium"
                checked={isPremium}
                onCheckedChange={setIsPremium}
                disabled={profile?.tier === 'free'}
              />
            </div>
            {profile?.tier === 'free' && (
              <p className="text-xs text-white/60">Premium Content erfordert Premium Account</p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                <Label htmlFor="live" className="text-white">Live Stream</Label>
              </div>
              <Switch
                id="live"
                checked={isLive}
                onCheckedChange={setIsLive}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80"
            disabled={loading || !videoFile || !title.trim()}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Video wird hochgeladen..." : "Video veröffentlichen"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};