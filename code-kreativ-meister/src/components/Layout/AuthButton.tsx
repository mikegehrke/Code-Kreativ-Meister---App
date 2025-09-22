import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Wallet, Crown, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/Auth/AuthDialog";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Link } from "react-router-dom";

export const AuthButton = () => {
  const { user, profile, signOut } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // If Supabase is not configured, show a setup message
  if (!isSupabaseConfigured()) {
    return (
      <Button 
        variant="outline"
        onClick={() => alert('Bitte verbinde zuerst dein Supabase-Projekt über den grünen Supabase-Button oben rechts.')}
      >
        Setup Required
      </Button>
    );
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "vip": return <Crown className="h-3 w-3 text-yellow-400" />;
      case "premium": return <Sparkles className="h-3 w-3 text-purple-400" />;
      default: return null;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "vip": return "from-yellow-400 to-orange-500";
      case "premium": return "from-purple-400 to-pink-500";
      default: return "from-gray-400 to-gray-600";
    }
  };

  if (!user || !profile) {
    return (
      <>
        <Button 
          onClick={() => setShowAuthDialog(true)}
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80"
        >
          Login
        </Button>
        <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile.avatar || undefined} alt={profile.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {profile.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {profile.tier !== "free" && (
            <div className={`absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r ${getTierColor(profile.tier)} flex items-center justify-center border border-white`}>
              {getTierIcon(profile.tier)}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className="px-2 py-1.5">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">{profile.name}</p>
            {profile.verified && (
              <Badge variant="secondary" className="h-4 w-4 p-0 rounded-full bg-blue-500">
                ✓
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">@{profile.handle}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={`/u/${profile.handle}`} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/wallet" className="cursor-pointer">
            <Wallet className="mr-2 h-4 w-4" />
            Wallet
            <Badge className="ml-auto bg-accent">{profile.coins} Coins</Badge>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Einstellungen
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-destructive cursor-pointer" 
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Abmelden
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};