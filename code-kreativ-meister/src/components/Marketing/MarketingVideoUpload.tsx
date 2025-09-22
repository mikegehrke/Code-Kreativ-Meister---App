import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Video, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface MarketingPackage {
  type: string;
  name: string;
  price: number;
  budget: number;
}

interface MarketingVideoUploadProps {
  selectedPackage: MarketingPackage;
  onUploadComplete: (videoData: any) => void;
  onBack: () => void;
}

export function MarketingVideoUpload({ selectedPackage, onUploadComplete, onBack }: MarketingVideoUploadProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAudience: "",
    videoFile: null as File | null,
    thumbnailFile: null as File | null
  });

  const handleFileUpload = (file: File, type: 'video' | 'thumbnail') => {
    if (type === 'video') {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast({
          title: "Datei zu groß",
          description: "Video darf maximal 100MB groß sein",
          variant: "destructive"
        });
        return;
      }
      setFormData(prev => ({ ...prev, videoFile: file }));
    } else {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Datei zu groß", 
          description: "Thumbnail darf maximal 5MB groß sein",
          variant: "destructive"
        });
        return;
      }
      setFormData(prev => ({ ...prev, thumbnailFile: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !formData.videoFile) {
      toast({
        title: "Fehler",
        description: "Bitte Video auswählen",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload video file
      const videoFileName = `marketing-videos/${user.id}/${Date.now()}-${formData.videoFile.name}`;
      const { data: videoUpload, error: videoError } = await supabase.storage
        .from('marketing-videos')
        .upload(videoFileName, formData.videoFile);

      if (videoError) throw videoError;

      // Upload thumbnail if provided
      let thumbnailUrl = null;
      if (formData.thumbnailFile) {
        const thumbnailFileName = `marketing-thumbnails/${user.id}/${Date.now()}-${formData.thumbnailFile.name}`;
        const { data: thumbnailUpload, error: thumbnailError } = await supabase.storage
          .from('marketing-videos')
          .upload(thumbnailFileName, formData.thumbnailFile);
        
        if (!thumbnailError) {
          const { data: thumbnailUrlData } = supabase.storage
            .from('marketing-videos')
            .getPublicUrl(thumbnailUpload.path);
          thumbnailUrl = thumbnailUrlData.publicUrl;
        }
      }

      // Get video URL
      const { data: videoUrlData } = supabase.storage
        .from('marketing-videos')
        .getPublicUrl(videoUpload.path);

      // Create marketing video record
      const { data: marketingVideo, error: dbError } = await supabase
        .from('marketing_videos')
        .insert({
          user_id: user.id,
          package_type: selectedPackage.type,
          title: formData.title,
          description: formData.description,
          target_audience: formData.targetAudience,
          video_url: videoUrlData.publicUrl,
          thumbnail_url: thumbnailUrl,
          total_budget: selectedPackage.budget,
          status: 'pending'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast({
        title: "Video hochgeladen!",
        description: "Dein Video wird jetzt überprüft und dann freigegeben.",
      });

      onUploadComplete(marketingVideo);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload fehlgeschlagen",
        description: "Bitte versuche es erneut",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" onClick={onBack}>
          ← Zurück
        </Button>
        <div>
          <h2 className="text-xl font-semibold">Marketing Video hochladen</h2>
          <p className="text-sm text-muted-foreground">
            {selectedPackage.name} - €{selectedPackage.price}
          </p>
        </div>
      </div>

      {/* Package Info */}
      <Card>
        <CardHeader>
          <CardTitle>Ausgewähltes Paket</CardTitle>
          <CardDescription>
            {selectedPackage.name} mit einem Budget von €{selectedPackage.budget} für die Bewerbung
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle>Video Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Video Titel *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Gib deinem Video einen catchy Titel"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Beschreibe dein Video und was die Zuschauer erwarten können..."
                rows={3}
              />
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <Label htmlFor="audience">Zielgruppe</Label>
              <Select value={formData.targetAudience} onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Wähle deine Zielgruppe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-25">18-25 Jahre</SelectItem>
                  <SelectItem value="26-35">26-35 Jahre</SelectItem>
                  <SelectItem value="36-45">36-45 Jahre</SelectItem>
                  <SelectItem value="46+">46+ Jahre</SelectItem>
                  <SelectItem value="all">Alle Altersgruppen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Video Upload */}
            <div className="space-y-2">
              <Label>Video Upload *</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                {formData.videoFile ? (
                  <div className="space-y-2">
                    <Video className="h-8 w-8 mx-auto text-primary" />
                    <p className="text-sm font-medium">{formData.videoFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(formData.videoFile.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, videoFile: null }))}
                    >
                      Entfernen
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('video-upload')?.click()}
                      >
                        Video auswählen
                      </Button>
                      <input
                        id="video-upload"
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'video');
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      MP4, MOV, AVI (max. 100MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <Label>Thumbnail (optional)</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                {formData.thumbnailFile ? (
                  <div className="space-y-2">
                    <img 
                      src={URL.createObjectURL(formData.thumbnailFile)} 
                      alt="Thumbnail preview"
                      className="h-20 w-32 object-cover mx-auto rounded"
                    />
                    <p className="text-sm font-medium">{formData.thumbnailFile.name}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, thumbnailFile: null }))}
                    >
                      Entfernen
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('thumbnail-upload')?.click()}
                    >
                      Thumbnail auswählen
                    </Button>
                    <input
                      id="thumbnail-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'thumbnail');
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG (max. 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Review Process Info */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-medium">Review-Prozess</h4>
                    <p className="text-sm text-muted-foreground">
                      Dein Video wird innerhalb von 24 Stunden überprüft und dann automatisch als Werbevideo gestartet.
                      Du erhältst eine Benachrichtigung, sobald die Bewerbung beginnt.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isUploading || !formData.videoFile || !formData.title}
            >
              {isUploading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Video wird hochgeladen...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Video zur Überprüfung einreichen
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}