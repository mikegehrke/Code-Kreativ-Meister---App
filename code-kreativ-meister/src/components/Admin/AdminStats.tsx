import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  DollarSign,
  AlertTriangle,
  Activity,
  Server,
  TrendingUp,
} from "lucide-react";

interface AdminStatsProps {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  pendingReports: number;
  systemHealth: string;
  serverLoad: number;
}

export const AdminStats = ({ 
  totalUsers, 
  activeUsers, 
  totalRevenue, 
  pendingReports, 
  systemHealth, 
  serverLoad 
}: AdminStatsProps) => {
  const getHealthColor = (health: string) => {
    switch (health) {
      case "good": return "bg-green-500";
      case "warning": return "bg-yellow-500";
      case "critical": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getLoadColor = (load: number) => {
    if (load < 50) return "text-green-500";
    if (load < 80) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-lg font-bold">{totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-lg font-bold">{activeUsers.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-lg font-bold">€{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Reports</p>
              <p className="text-lg font-bold">{pendingReports}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Server className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">System Health</p>
              <div className="flex items-center space-x-2">
                <Badge className={`text-white ${getHealthColor(systemHealth)}`}>
                  {systemHealth}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Server Load</p>
              <p className={`text-lg font-bold ${getLoadColor(serverLoad)}`}>
                {serverLoad}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};