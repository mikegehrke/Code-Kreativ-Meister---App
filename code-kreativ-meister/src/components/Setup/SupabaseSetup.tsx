import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Database, ExternalLink, CheckCircle, X } from "lucide-react";

export const SupabaseSetup = () => {
  const [dismissed, setDismissed] = useState(false);
  const isConfigured = isSupabaseConfigured();

  if (isConfigured || dismissed) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-primary/20">
        <CardHeader className="relative pb-2">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={() => setDismissed(true)}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm">Supabase Setup</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Verbinde dein Supabase-Projekt für alle Features
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <Alert className="py-2">
            <AlertDescription className="text-xs">
              Klicke den grünen <strong>Supabase</strong> Button oben rechts → "Nightlife" Projekt wählen
            </AlertDescription>
          </Alert>
          
          <div className="text-xs text-muted-foreground">
            <strong>Dann verfügbar:</strong>
            <ul className="text-xs space-y-0.5 mt-1">
              <li>• Login/Registrierung</li>
              <li>• Echte Profile & Daten</li>
              <li>• Video-Uploads</li>
              <li>• Live-Chat</li>
            </ul>
          </div>

          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 text-xs"
              onClick={() => setDismissed(true)}
            >
              Später
            </Button>
            <Button 
              size="sm"
              className="flex-1 text-xs"
              onClick={() => window.open('https://docs.lovable.dev/integrations/supabase/', '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};