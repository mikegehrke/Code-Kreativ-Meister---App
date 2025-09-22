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
  Plus,
  Upload,
  Video,
  Image,
  Music,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Filter,
  Calendar,
  DollarSign,
} from "lucide-react";

interface Content {
  id: string;
  title: string;
  type: "video" | "image" | "audio" | "event";
  status: "published" | "draft" | "scheduled" | "archived";
  views: number;
  likes: number;
  revenue: number;
  createdAt: string;
  scheduledFor?: string;
  thumbnail?: string;
}

export const ContentManager = () => {
  const [contents, setContents] = useState<Content[]>([
    {
      id: "1",
      title: "Live Performance Highlights",
      type: "video",
      status: "published",
      views: 15420,
      likes: 892,
      revenue: 245.80,
      createdAt: "2024-01-15",
      thumbnail: "/placeholder.svg"
    },
    {
      id: "2",
      title: "Behind the Scenes",
      type: "image",
      status: "published",
      views: 8930,
      likes: 567,
      revenue: 89.50,
      createdAt: "2024-01-14"
    },
    {
      id: "3",
      title: "New Track Preview",
      type: "audio",
      status: "scheduled",
      views: 0,
      likes: 0,
      revenue: 0,
      createdAt: "2024-01-16",
      scheduledFor: "2024-01-18T18:00:00"
    },
    {
      id: "4",
      title: "Exclusive Club Night",
      type: "event",
      status: "published",
      views: 3421,
      likes: 234,
      revenue: 1250.00,
      createdAt: "2024-01-13"
    }
  ]);

  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return Video;
      case "image": return Image;
      case "audio": return Music;
      case "event": return Calendar;
      default: return Video;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-500";
      case "draft": return "bg-gray-500";
      case "scheduled": return "bg-blue-500";
      case "archived": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const filteredContents = contents.filter(content => {
    const matchesType = filterType === "all" || content.type === filterType;
    const matchesStatus = filterStatus === "all" || content.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const totalRevenue = contents.reduce((sum, content) => sum + content.revenue, 0);
  const totalViews = contents.reduce((sum, content) => sum + content.views, 0);
  const publishedCount = contents.filter(c => c.status === "published").length;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Video className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Content</p>
                <p className="text-lg font-bold">{contents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <Eye className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-lg font-bold">{totalViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-blue-500" />
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
              <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-lg font-bold">{publishedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions and Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Content Library</CardTitle>
              <CardDescription>Manage your videos, images, audio, and events</CardDescription>
            </div>
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Upload Content
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Upload New Content</DialogTitle>
                  <DialogDescription>
                    Upload and configure your new content
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Content Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input placeholder="Enter content title..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea placeholder="Describe your content..." />
                  </div>
                  <div className="border-2 border-dashed border-muted-foreground rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop your files here, or click to browse
                    </p>
                    <Button variant="outline" size="sm">
                      Choose Files
                    </Button>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                      Cancel
                    </Button>
                    <Button>Upload & Publish</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="event">Events</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>

          {/* Content Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Content</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContents.map((content) => {
                const IconComponent = getTypeIcon(content.type);
                return (
                  <TableRow key={content.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{content.title}</p>
                          {content.scheduledFor && (
                            <p className="text-xs text-muted-foreground">
                              Scheduled: {new Date(content.scheduledFor).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {content.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-white ${getStatusColor(content.status)}`}>
                        {content.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{content.views.toLocaleString()}</TableCell>
                    <TableCell>{content.likes.toLocaleString()}</TableCell>
                    <TableCell>€{content.revenue.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(content.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};