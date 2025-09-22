import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, MessageCircle, Heart, UserPlus, Video, Image, Send } from "lucide-react";

const mockMessages = [
  {
    id: "1",
    user: {
      name: "DJ Sarah Moon", 
      handle: "sarahmoon",
      avatar: "/api/placeholder/40/40",
      verified: true,
      isOnline: true,
    },
    lastMessage: "Hey! Loved your comment on my latest video! 🔥",
    timestamp: "2m",
    unread: 2,
    type: "message"
  },
  {
    id: "2", 
    user: {
      name: "Marco Berlin",
      handle: "marcoberlin", 
      avatar: "/api/placeholder/40/40",
      verified: true,
      isOnline: false,
    },
    lastMessage: "Thanks for joining my live stream!",
    timestamp: "1h",
    unread: 0,
    type: "message"
  },
  {
    id: "3",
    user: {
      name: "Lisa Cocktails",
      handle: "lisacocktails",
      avatar: "/api/placeholder/40/40", 
      verified: false,
      isOnline: true,
    },
    lastMessage: "Want to collab on a cocktail tutorial?",
    timestamp: "3h",
    unread: 1,
    type: "message"
  }
];

const mockFriendRequests = [
  {
    id: "fr1",
    user: {
      name: "VIP Events",
      handle: "vipevents", 
      avatar: "/api/placeholder/40/40",
      verified: true,
      mutualFriends: 12,
    },
    type: "friend_request"
  },
  {
    id: "fr2", 
    user: {
      name: "Miami Nights",
      handle: "miaminights",
      avatar: "/api/placeholder/40/40",
      verified: true,
      mutualFriends: 8,
    },
    type: "friend_request"
  }
];

const Inbox = () => {
  const [activeTab, setActiveTab] = useState<"messages" | "requests">("messages");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "messages", label: "Nachrichten", icon: MessageCircle },
    { id: "requests", label: "Freunde", icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Inbox</h1>
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Suche nach Freunden oder Nachrichten..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.id === "requests" && mockFriendRequests.length > 0 && (
                <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                  {mockFriendRequests.length}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        {activeTab === "messages" && (
          <div className="space-y-1">
            {mockMessages.map((message) => (
              <div
                key={message.id}
                className="flex items-center space-x-3 p-4 hover:bg-accent rounded-lg cursor-pointer transition-colors duration-200"
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={message.user.avatar} alt={message.user.name} />
                    <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {message.user.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-sm truncate">
                      {message.user.name}
                    </span>
                    {message.user.verified && (
                      <Badge variant="secondary" className="h-4 w-4 p-0 rounded-full bg-blue-500">
                        ✓
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      @{message.user.handle}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {message.lastMessage}
                  </p>
                </div>

                <div className="flex flex-col items-end space-y-1">
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp}
                  </span>
                  {message.unread > 0 && (
                    <Badge variant="destructive" className="h-5 min-w-5 text-xs">
                      {message.unread}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "requests" && (
          <div className="space-y-1">
            <div className="flex items-center justify-between py-4">
              <h3 className="font-semibold text-sm text-muted-foreground">
                FREUNDSCHAFTSANFRAGEN
              </h3>
              <Badge variant="secondary">{mockFriendRequests.length}</Badge>
            </div>

            {mockFriendRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center space-x-3 p-4 bg-accent/50 rounded-lg"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={request.user.avatar} alt={request.user.name} />
                  <AvatarFallback>{request.user.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-sm truncate">
                      {request.user.name}
                    </span>
                    {request.user.verified && (
                      <Badge variant="secondary" className="h-4 w-4 p-0 rounded-full bg-blue-500">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    @{request.user.handle} • {request.user.mutualFriends} gemeinsame Freunde
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="h-8 px-3">
                    Ablehnen
                  </Button>
                  <Button size="sm" className="h-8 px-3 bg-blue-500 hover:bg-blue-600">
                    Annehmen
                  </Button>
                </div>
              </div>
            ))}

            {/* Suggested Friends */}
            <div className="mt-8">
              <h3 className="font-semibold text-sm text-muted-foreground mb-4">
                VORGESCHLAGENE FREUNDE
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Jazz Nights", handle: "jazznights", avatar: "/api/placeholder/40/40" },
                  { name: "Dubai Luxury", handle: "dubailuxury", avatar: "/api/placeholder/40/40" },
                  { name: "Hip Hop Culture", handle: "hiphopculture", avatar: "/api/placeholder/40/40" },
                  { name: "Beer Explorer", handle: "beerexplorer", avatar: "/api/placeholder/40/40" }
                ].map((user, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center space-y-2 p-4 bg-card rounded-lg border hover:bg-accent transition-colors duration-200"
                  >
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="font-semibold text-sm truncate w-full">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        @{user.handle}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="w-full h-8">
                      <UserPlus className="h-3 w-3 mr-1" />
                      Folgen
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;