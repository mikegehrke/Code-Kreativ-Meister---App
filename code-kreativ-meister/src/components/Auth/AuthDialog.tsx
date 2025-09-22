import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Crown, Sparkles } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [name, setName] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSupabaseConfigured() || !supabase) {
      toast.error("Supabase ist nicht konfiguriert. Bitte verbinde dein Supabase-Projekt.");
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Erfolgreich eingeloggt!");
      onOpenChange(false);
      // Reset form
      setEmail("");
      setPassword("");
    } catch (error: any) {
      toast.error(error.message || "Login fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSupabaseConfigured() || !supabase) {
      toast.error("Supabase ist nicht konfiguriert. Bitte verbinde dein Supabase-Projekt.");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwörter stimmen nicht überein");
      return;
    }

    if (password.length < 6) {
      toast.error("Passwort muss mindestens 6 Zeichen lang sein");
      return;
    }

    if (!handle.match(/^[a-zA-Z0-9_]+$/)) {
      toast.error("Handle darf nur Buchstaben, Zahlen und Unterstriche enthalten");
      return;
    }

    setLoading(true);

    try {
      // Check if handle is available
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('handle')
        .eq('handle', handle)
        .single();

      if (existingProfile) {
        throw new Error("Handle ist bereits vergeben");
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            handle,
            name,
          }
        }
      });

      if (error) throw error;

      toast.success("Account erstellt! Bitte bestätige deine E-Mail.");
      onOpenChange(false);
      // Reset form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setHandle("");
      setName("");
    } catch (error: any) {
      toast.error(error.message || "Registrierung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-black/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to NightHub
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            <TabsTrigger value="login" className="text-white data-[state=active]:bg-primary data-[state=active]:text-white">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="text-white data-[state=active]:bg-primary data-[state=active]:text-white">
              Registrieren
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="deine@email.com"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Einloggen
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-6">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dein Name"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="handle" className="text-white">Handle</Label>
                  <Input
                    id="handle"
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="username"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-white">E-Mail</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="deine@email.com"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-white">Passwort</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-white">Passwort bestätigen</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Account erstellen
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Premium Features Preview */}
        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
          <h4 className="text-white font-semibold mb-2 flex items-center">
            <Crown className="h-4 w-4 mr-2 text-yellow-400" />
            Premium Features
          </h4>
          <div className="text-white/70 text-sm space-y-1">
            <div className="flex items-center">
              <Sparkles className="h-3 w-3 mr-2 text-purple-400" />
              Exklusive Live-Events
            </div>
            <div className="flex items-center">
              <Sparkles className="h-3 w-3 mr-2 text-purple-400" />
              VIP-Venue Zugang
            </div>
            <div className="flex items-center">
              <Sparkles className="h-3 w-3 mr-2 text-purple-400" />
              Premium Video-Content
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};