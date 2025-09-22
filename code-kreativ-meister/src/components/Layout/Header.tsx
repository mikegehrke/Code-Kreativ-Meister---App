import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Bell,
  Video,
  Zap,
  Menu,
  X
} from "lucide-react";
import { AuthButton } from "./AuthButton";

export const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 blur animate-pulse" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            NightHub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Feed
          </Link>
          <Link to="/live" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Live
          </Link>
          <Link to="/events" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Events
          </Link>
          <Link to="/venues" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Venues
          </Link>
          <Link to="/creators" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Creators
          </Link>
          <Link to="/marketing" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Marketing
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, venues, creators..."
              className="pl-10 pr-4 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent">
              3
            </Badge>
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => navigate('/go-live')}
          >
            <Video className="h-4 w-4" />
            Go Live
          </Button>

          <AuthButton />
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events, venues, creators..."
                className="pl-10 pr-4 bg-muted/50 border-0"
              />
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-sm font-medium py-2 text-foreground hover:text-primary">
                Feed
              </Link>
              <Link to="/live" className="text-sm font-medium py-2 text-foreground hover:text-primary">
                Live
              </Link>
              <Link to="/events" className="text-sm font-medium py-2 text-foreground hover:text-primary">
                Events
              </Link>
              <Link to="/venues" className="text-sm font-medium py-2 text-foreground hover:text-primary">
                Venues
              </Link>
              <Link to="/creators" className="text-sm font-medium py-2 text-foreground hover:text-primary">
                Creators
              </Link>
              <Link to="/marketing" className="text-sm font-medium py-2 text-foreground hover:text-primary">
                Marketing
              </Link>
            </nav>

            <div className="flex items-center justify-between pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => navigate('/go-live')}
              >
                <Video className="h-4 w-4" />
                Go Live
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent">
                  3
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};