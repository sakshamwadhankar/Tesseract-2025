import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface ProjectCardProps {
  id: string;
  teamName: string;
  iframeUrl: string;
  isLocked: boolean;
  votes: number;
}

export const ProjectCard = ({ id, teamName, iframeUrl, isLocked, votes }: ProjectCardProps) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleVote = () => {
    if (isLocked || hasVoted) return;

    setIsAnimating(true);
    setTimeout(() => {
      setHasVoted(true);
      toast.success("VOTE RECORDED BY S.H.I.E.L.D.", {
        description: `Your vote for ${teamName} has been secured.`,
        icon: "✓",
      });
      setIsAnimating(false);
    }, 600);
  };

  return (
    <Card className="relative overflow-hidden bg-card border-hologram shadow-[var(--shadow-card)] hover:scale-105 transition-all duration-300 animate-float">
      {/* Locked overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center space-y-4">
            <Lock className="w-16 h-16 mx-auto text-destructive opacity-80" />
            <div className="text-destructive font-bold text-2xl tracking-widest transform -rotate-12">
              CLASSIFIED
            </div>
          </div>
        </div>
      )}

      {/* Energy burst animation */}
      {isAnimating && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 rounded-full bg-secondary/50 animate-energy-burst" />
        </div>
      )}

      <div className="p-6 space-y-4">
        {/* Team name */}
        <h3 className="text-2xl font-bold tracking-widest text-metallic text-center">
          {teamName}
        </h3>

        {/* Iframe container */}
        <div 
          className="relative aspect-video rounded-lg overflow-hidden border-hologram bg-muted cursor-pointer group"
          onClick={() => !isLocked && setIsPreviewOpen(true)}
        >
          <iframe
            src={iframeUrl}
            className="w-full h-full pointer-events-none"
            title={teamName}
            loading="lazy"
          />
          {!isLocked && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
              <span className="text-white text-sm font-bold tracking-wider">CLICK TO ENLARGE</span>
            </div>
          )}
        </div>

        {/* Vote button */}
        <Button
          onClick={handleVote}
          disabled={isLocked || hasVoted}
          variant={hasVoted ? "secondary" : "default"}
          className="w-full font-bold tracking-wider text-lg relative overflow-hidden group"
        >
          <span className="relative z-10">
            {hasVoted ? "VOTE CAST" : "CAST YOUR VOTE"}
          </span>
          {!hasVoted && !isLocked && (
            <div className="absolute inset-0 glow-repulsor opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </Button>

        {/* Vote count */}
        <div className="text-center text-sm text-muted-foreground">
          <span className="text-primary font-semibold">{votes}</span> votes
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-6xl h-[85vh] p-0">
          <iframe
            src={iframeUrl}
            className="w-full h-full rounded-lg"
            title={`${teamName} - Full Preview`}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};
