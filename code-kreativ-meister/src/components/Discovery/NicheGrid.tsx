import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NicheGridProps {
  onSelect?: (tag: string) => void;
}

const niches = [
  { tag: "techno", title: "Berlin Techno", emoji: "🎛️", active: 128 },
  { tag: "jazz", title: "Jazz Speakeasy", emoji: "🎷", active: 42 },
  { tag: "underground", title: "Underground Rave", emoji: "🕳️", active: 67 },
  { tag: "luxury", title: "Luxury Nights", emoji: "💎", active: 23 },
  { tag: "streetfood", title: "Street Food", emoji: "🌮", active: 51 },
  { tag: "rooftop", title: "Rooftop Vibes", emoji: "🌇", active: 34 },
];

export const NicheGrid = ({ onSelect }: NicheGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {niches.map((n) => (
        <Card
          key={n.tag}
          className="cursor-pointer hover:shadow-glow transition-all border-primary/10"
          onClick={() => onSelect?.(n.tag)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <span>{n.emoji}</span> {n.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Badge variant="secondary" className="text-[10px]">{n.active} live</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
