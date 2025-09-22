import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Eye,
  Trash2,
  Flag,
  Check,
  X,
  AlertTriangle,
  Video,
  Image,
  Music,
  FileText,
} from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  type: "video" | "image" | "audio" | "text";
  creator: string;
  creatorAvatar?: string;
  status: "published" | "flagged" | "removed" | "pending";
  reports: number;
  uploadDate: string;
  views: number;
  reason?: string;
  thumbnail?: string;
}

export const ContentModeration = () => {
  const [contents, setContents] = useState<ContentItem[]>([
    {
      id: "1",
      title: "Friday Night Mix Session",
      type: "video",
      creator: "nightdj_official",
      creatorAvatar: "/placeholder.svg",
      status: "flagged",
      reports: 3,
      uploadDate: "2024-01-15",
      views: 15420,
      reason: "Inappropriate content",
      thumbnail: "/placeholder.svg"
    },
    {
      id: "2",
      title: "Behind the Scenes",
      type: "image",
      creator: "musiclover123",
      status: "published",
      reports: 0,
      uploadDate: "2024-01-14",
      views: 8930
    },
    {
      id: "3",
      title: "Party Night Photos",
      type: "image",
      creator: "party_animal",
      status: "pending",
      reports: 1,
      uploadDate: "2024-01-16",
      views: 0,
      reason: "Pending review"
    },
    {
      id: "4",
      title: "Exclusive Track Preview",
      type: "audio",
      creator: "nightdj_official",
      status: "removed",
      reports: 5,
      uploadDate: "2024-01-13",
      views: 3421,
      reason: "Copyright violation"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("flagged");

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return Video;
      case "image": return Image;
      case "audio": return Music;
      case "text": return FileText;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-500";
      case "flagged": return "bg-yellow-500";
      case "removed": return "bg-red-500";
      case "pending": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.creator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || content.type === filterType;
    const matchesStatus = filterStatus === "all" || content.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleContentAction = (contentId: string, action: "approve" | "remove") => {
    setContents(prev => prev.map(content => 
      content.id === contentId 
        ? { 
            ...content, 
            status: action === "approve" ? "published" : "removed",
            reports: action === "approve" ? 0 : content.reports
          }
        : content
    ));
  };

  const flaggedCount = contents.filter(c => c.status === "flagged").length;
  const pendingCount = contents.filter(c => c.status === "pending").length;
  const removedCount = contents.filter(c => c.status === "removed").length;
  const totalReports = contents.reduce((sum, c) => sum + c.reports, 0);

  return (
    <div className="space-y-6">
      {/* Moderation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Flag className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Flagged Content</p>
                <p className="text-lg font-bold">{flaggedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Eye className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-lg font-bold">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                <Trash2 className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Removed</p>
                <p className="text-lg font-bold">{removedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-lg font-bold">{totalReports}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Moderation */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Content Moderation</CardTitle>
              <CardDescription>Review and moderate platform content</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="removed">Removed</SelectItem>
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
                <TableHead>Creator</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reports</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContents.map((content) => {
                const TypeIcon = getTypeIcon(content.type);
                
                return (
                  <TableRow key={content.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <TypeIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{content.title}</p>
                          {content.reason && (
                            <p className="text-xs text-red-500">{content.reason}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={content.creatorAvatar} />
                          <AvatarFallback className="text-xs">
                            {content.creator.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">@{content.creator}</span>
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
                    <TableCell>
                      {content.reports > 0 ? (
                        <Badge variant="destructive">{content.reports}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(content.uploadDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{content.views.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {(content.status === "flagged" || content.status === "pending") && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleContentAction(content.id, "approve")}
                              className="gap-1"
                            >
                              <Check className="h-3 w-3" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleContentAction(content.id, "remove")}
                              className="gap-1"
                            >
                              <X className="h-3 w-3" />
                              Remove
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
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