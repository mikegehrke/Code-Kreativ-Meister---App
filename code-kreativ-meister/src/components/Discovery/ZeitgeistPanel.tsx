import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, TrendingUp, ArrowUpRight } from "lucide-react";

interface ZeitgeistPanelProps {
  onSelectTag?: (tag: string) => void;
}

export const ZeitgeistPanel = ({ onSelectTag }: ZeitgeistPanelProps) => {
  const trends = useMemo(() => (
    [
      { tag: "berlin", label: "Berlin Techno", delta: 142, type: "Hot" as const },
      { tag: "vip", label: "VIP Parties", delta: 98, type: "Rising" as const },
      { tag: "sunset", label: "Sunset Sessions", delta: 76, type: "Rising" as const },
      { tag: "cocktails", label: "Craft Cocktails", delta: 64, type: "Hot" as const },
      { tag: "underground", label: "Underground Raves", delta: 59, type: "Hot" as const },
    ]
  ), []);

  return (
    <Card className="border-primary/20">
      <CardHeader className="py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Flame className="h-4 w-4 text-accent" /> Zeitgeist – Trending Now
          </CardTitle>
          <Badge variant="secondary" className="text-[10px]">Live</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {trends.map((t) => (
            <Button
              key={t.tag}
              variant="outline"
              size="sm"
              className="justify-between w-full"
              onClick={() => onSelectTag?.(t.tag)}
            >
              <span className="text-sm">#{t.tag}</span>
              <span className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1" />+{t.delta}%
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
