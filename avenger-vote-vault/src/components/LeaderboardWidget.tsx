import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface LeaderEntry {
  teamName: string;
  votes: number;
  rank: 1 | 2 | 3;
}

interface LeaderboardWidgetProps {
  topThree: LeaderEntry[];
}

export const LeaderboardWidget = ({ topThree }: LeaderboardWidgetProps) => {
  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-[hsl(var(--gold-medal))]";
      case 2:
        return "text-[hsl(var(--silver-medal))]";
      case 3:
        return "text-[hsl(var(--bronze-medal))]";
      default:
        return "text-muted-foreground";
    }
  };

  const getMedalGlow = (rank: number) => {
    switch (rank) {
      case 1:
        return "drop-shadow-[0_0_10px_hsl(var(--gold-medal))]";
      case 2:
        return "drop-shadow-[0_0_8px_hsl(var(--silver-medal))]";
      case 3:
        return "drop-shadow-[0_0_6px_hsl(var(--bronze-medal))]";
      default:
        return "";
    }
  };

  return (
    <Card className="bg-card/95 backdrop-blur-sm border-primary/30 p-4 space-y-3 animate-pulse-glow">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg tracking-wide text-metallic">TOP 3 HEROES</h3>
      </div>

      <div className="space-y-2">
        {topThree.map((entry) => (
          <div
            key={entry.rank}
            className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trophy className={`w-6 h-6 ${getMedalColor(entry.rank)} ${getMedalGlow(entry.rank)}`} />
              <span className="font-semibold text-sm">{entry.teamName}</span>
            </div>
            <span className="text-primary font-bold">{entry.votes}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
