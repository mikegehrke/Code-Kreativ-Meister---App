import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Video,
  Users,
  Calendar,
  Clock,
  DollarSign,
  Settings,
  Play,
  Square,
  Pause,
  Eye,
  MessageCircle,
  Gift,
  Plus,
  MoreHorizontal,
} from "lucide-react";

interface LiveStream {
  id: string;
  title: string;
  status: "live" | "scheduled" | "ended" | "draft";
  viewers: number;
  maxViewers: number;
  duration: string;
  revenue: number;
  tips: number;
  scheduledFor?: string;
  endedAt?: string;
  category: string;
  thumbnail?: string;
}

export const LivestreamManager = () => {
  const [streams, setStreams] = useState<LiveStream[]>([
    {
      id: "1",
      title: "Friday Night Mix Session",
      status: "live",
      viewers: 234,
      maxViewers: 456,
      duration: "2h 15m",
      revenue: 125.50,
      tips: 67,
      category: "Music",
      thumbnail: "/placeholder.svg"
    },
    {
      id: "2",
      title: "Saturday Night Club Experience",
      status: "scheduled",
      viewers: 0,
      maxViewers: 0,
      duration: "0m",
      revenue: 0,
      tips: 0,
      scheduledFor: "2024-01-20T21:00:00",
      category: "Entertainment"
    },
    {
      id: "3",
      title: "Behind the Decks",
      status: "ended",
      viewers: 0,
      maxViewers: 189,
      duration: "1h 45m",
      revenue: 89.30,
      tips: 34,
      endedAt: "2024-01-15T23:30:00",
      category: "Music"
    }
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [currentStream, setCurrentStream] = useState<LiveStream | null>(
    streams.find(s => s.status === "live") || null
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "bg-red-500";
      case "scheduled": return "bg-blue-500";
      case "ended": return "bg-gray-500";
      case "draft": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const totalRevenue = streams.reduce((sum, stream) => sum + stream.revenue, 0);
  const totalTips = streams.reduce((sum, stream) => sum + stream.tips, 0);
  const completedStreams = streams.filter(s => s.status === "ended").length;

  return (
    <div className="space-y-6">
      {/* Live Stream Control */}
      {currentStream && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                <CardTitle className="text-red-500">Currently Live</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
                <Button variant="destructive" size="sm">
                  <Square className="h-4 w-4 mr-2" />
                  End Stream
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Stream Title</p>
                <p className="font-medium">{currentStream.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Viewers</p>
                <p className="font-medium flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {currentStream.viewers}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {currentStream.duration}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Earnings</p>
                <p className="font-medium flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  €{currentStream.revenue.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Video className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Streams</p>
                <p className="text-lg font-bold">{streams.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-lg font-bold">€{totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Gift className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tips</p>
                <p className="text-lg font-bold">{totalTips}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-lg font-bold">{completedStreams}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stream Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Stream Management</CardTitle>
              <CardDescription>Manage your live streams and schedule new ones</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Stream Settings
              </Button>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Schedule Stream
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Schedule New Stream</DialogTitle>
                    <DialogDescription>
                      Set up your upcoming live stream
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Stream Title</label>
                      <Input placeholder="Enter stream title..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea placeholder="Describe your stream..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="music">Music</SelectItem>
                            <SelectItem value="entertainment">Entertainment</SelectItem>
                            <SelectItem value="talk">Talk Show</SelectItem>
                            <SelectItem value="gaming">Gaming</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Privacy</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select privacy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="subscribers">Subscribers Only</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Date</label>
                        <Input type="date" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Time</label>
                        <Input type="time" />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                        Cancel
                      </Button>
                      <Button>Schedule Stream</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stream</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Viewers</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Tips</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {streams.map((stream) => (
                <TableRow key={stream.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <Video className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{stream.title}</p>
                        <p className="text-xs text-muted-foreground">{stream.category}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-white ${getStatusColor(stream.status)}`}>
                      {stream.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{stream.viewers}</span>
                      {stream.maxViewers > 0 && (
                        <span className="text-xs text-muted-foreground">
                          (max: {stream.maxViewers})
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{stream.duration}</TableCell>
                  <TableCell>€{stream.revenue.toFixed(2)}</TableCell>
                  <TableCell>{stream.tips}</TableCell>
                  <TableCell>
                    {stream.scheduledFor && (
                      <div className="text-sm">
                        <p>Scheduled</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(stream.scheduledFor).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {stream.endedAt && (
                      <div className="text-sm">
                        <p>Ended</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(stream.endedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {stream.status === "live" && (
                      <div className="text-sm">
                        <p className="text-red-500">Live Now</p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};