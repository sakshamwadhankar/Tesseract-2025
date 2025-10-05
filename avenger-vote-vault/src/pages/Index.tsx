import { ProjectCard } from "@/components/ProjectCard";
import { TesseractShard } from "@/components/TesseractShard";

// Mock data - in a real app this would come from a backend
const mockProjects = [
  {
    id: "1",
    teamName: "STARK INDUSTRIES",
    iframeUrl: "https://lovable.dev",
    isLocked: false,
    votes: 142,
  },
  {
    id: "2",
    teamName: "ASGARD TECH",
    iframeUrl: "https://lovable.dev",
    isLocked: false,
    votes: 98,
  },
  {
    id: "3",
    teamName: "WAKANDA FOREVER",
    iframeUrl: "https://lovable.dev",
    isLocked: false,
    votes: 87,
  },
  {
    id: "4",
    teamName: "PROJECT INSIGHT",
    iframeUrl: "https://lovable.dev",
    isLocked: true,
    votes: 0,
  },
  {
    id: "5",
    teamName: "QUANTUM REALM LAB",
    iframeUrl: "https://lovable.dev",
    isLocked: false,
    votes: 56,
  },
  {
    id: "6",
    teamName: "GAMMA SQUAD",
    iframeUrl: "https://lovable.dev",
    isLocked: true,
    votes: 0,
  },
];

const Index = () => {

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Tesseract Shards in corners */}
      <TesseractShard position="top-left" />
      <TesseractShard position="top-right" />
      <TesseractShard position="bottom-left" />
      <TesseractShard position="bottom-right" />

      {/* Main content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <header className="text-center mb-12 space-y-4">
          <h1 className="text-6xl font-bold tracking-wider text-metallic drop-shadow-[0_0_30px_hsl(var(--tesseract-glow))]">
            AVENGERS INITIATIVE
          </h1>
          <p className="text-xl text-muted-foreground tracking-wide">
            Cast your vote for the next hero to join the team
          </p>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
        </header>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {mockProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
