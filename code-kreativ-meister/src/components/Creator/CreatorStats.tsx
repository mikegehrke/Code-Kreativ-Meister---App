import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Gift,
  Calendar,
} from "lucide-react";

interface CreatorStatsProps {
  totalEarnings: number;
  followerCount: number;
  monthlyGrowth: number;
}

export const CreatorStats = ({ totalEarnings, followerCount, monthlyGrowth }: CreatorStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-lg font-bold">€{totalEarnings.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Followers</p>
              <p className="text-lg font-bold">{followerCount.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Growth</p>
              <p className="text-lg font-bold">+{monthlyGrowth}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
              <Eye className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Views</p>
              <p className="text-lg font-bold">127.5K</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};