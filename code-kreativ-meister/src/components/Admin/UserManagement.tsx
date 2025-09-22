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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  Ban,
  Check,
  X,
  Crown,
  Star,
  Calendar,
  DollarSign,
} from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: "user" | "creator" | "admin";
  status: "active" | "suspended" | "banned" | "pending";
  joinedDate: string;
  lastActive: string;
  totalSpent: number;
  totalEarned?: number;
  verificationStatus: "verified" | "pending" | "none";
  reports: number;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      username: "nightdj_official",
      email: "dj@example.com",
      avatar: "/placeholder.svg",
      role: "creator",
      status: "active",
      joinedDate: "2023-08-15",
      lastActive: "2024-01-16T14:30:00",
      totalSpent: 0,
      totalEarned: 2847.50,
      verificationStatus: "verified",
      reports: 0
    },
    {
      id: "2",
      username: "musiclover123",
      email: "music@example.com",
      role: "user",
      status: "active",
      joinedDate: "2023-11-20",
      lastActive: "2024-01-16T12:15:00",
      totalSpent: 245.50,
      verificationStatus: "verified",
      reports: 0
    },
    {
      id: "3",
      username: "party_animal",
      email: "party@example.com",
      role: "user",
      status: "suspended",
      joinedDate: "2024-01-05",
      lastActive: "2024-01-15T18:45:00",
      totalSpent: 89.99,
      verificationStatus: "none",
      reports: 3
    },
    {
      id: "4",
      username: "club_manager",
      email: "manager@example.com",
      role: "creator",
      status: "pending",
      joinedDate: "2024-01-16",
      lastActive: "2024-01-16T10:00:00",
      totalSpent: 0,
      totalEarned: 0,
      verificationStatus: "pending",
      reports: 0
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return Shield;
      case "creator": return Crown;
      case "user": return Users;
      default: return Users;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "text-red-500";
      case "creator": return "text-purple-500";
      case "user": return "text-blue-500";
      default: return "text-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "suspended": return "bg-yellow-500";
      case "banned": return "bg-red-500";
      case "pending": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "verified": return "text-green-500";
      case "pending": return "text-yellow-500";
      case "none": return "text-gray-500";
      default: return "text-gray-500";
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserAction = (userId: string, action: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: action as User['status'] }
        : user
    ));
  };

  return (
    <div className="space-y-6">
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-lg font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Crown className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Creators</p>
                <p className="text-lg font-bold">
                  {users.filter(u => u.role === "creator").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <Check className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-lg font-bold">
                  {users.filter(u => u.verificationStatus === "verified").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Ban className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Suspended</p>
                <p className="text-lg font-bold">
                  {users.filter(u => u.status === "suspended" || u.status === "banned").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage platform users and their permissions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">Users</SelectItem>
                <SelectItem value="creator">Creators</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>

          {/* Users Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Reports</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                const roleColor = getRoleColor(user.role);
                
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">@{user.username}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <RoleIcon className={`h-4 w-4 ${roleColor}`} />
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-white ${getStatusColor(user.status)}`}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {user.verificationStatus === "verified" && (
                          <Check className={`h-4 w-4 ${getVerificationColor(user.verificationStatus)}`} />
                        )}
                        <span className={`text-sm ${getVerificationColor(user.verificationStatus)}`}>
                          {user.verificationStatus}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(user.joinedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{new Date(user.lastActive).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(user.lastActive).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.reports > 0 ? (
                        <Badge variant="destructive">{user.reports}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>User Details</DialogTitle>
                            <DialogDescription>
                              Manage user account and permissions
                            </DialogDescription>
                          </DialogHeader>
                          {selectedUser && (
                            <div className="space-y-6">
                              <div className="flex items-center space-x-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage src={selectedUser.avatar} />
                                  <AvatarFallback className="text-2xl">
                                    {selectedUser.username.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="text-lg font-semibold">@{selectedUser.username}</h3>
                                  <p className="text-muted-foreground">{selectedUser.email}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant="outline">{selectedUser.role}</Badge>
                                    <Badge>{selectedUser.status}</Badge>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Joined Date</p>
                                  <p className="font-medium">
                                    {new Date(selectedUser.joinedDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Last Active</p>
                                  <p className="font-medium">
                                    {new Date(selectedUser.lastActive).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Total Spent</p>
                                  <p className="font-medium">€{selectedUser.totalSpent.toFixed(2)}</p>
                                </div>
                                {selectedUser.totalEarned !== undefined && (
                                  <div>
                                    <p className="text-sm text-muted-foreground">Total Earned</p>
                                    <p className="font-medium">€{selectedUser.totalEarned.toFixed(2)}</p>
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-end space-x-2">
                                {selectedUser.status === "active" && (
                                  <Button 
                                    variant="outline" 
                                    onClick={() => handleUserAction(selectedUser.id, "suspended")}
                                  >
                                    Suspend User
                                  </Button>
                                )}
                                {selectedUser.status === "suspended" && (
                                  <Button 
                                    onClick={() => handleUserAction(selectedUser.id, "active")}
                                  >
                                    Reactivate User
                                  </Button>
                                )}
                                <Button variant="destructive">
                                  Ban User
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
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