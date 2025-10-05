import tesseractShardImage from "@/assets/tesseract-shard.png";

interface TesseractShardProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export const TesseractShard = ({ position }: TesseractShardProps) => {
  const positionClasses = {
    "top-left": "top-8 left-8",
    "top-right": "top-8 right-8",
    "bottom-left": "bottom-8 left-8",
    "bottom-right": "bottom-8 right-8",
  };

  const rotations = {
    "top-left": "rotate-12",
    "top-right": "-rotate-12",
    "bottom-left": "-rotate-12",
    "bottom-right": "rotate-12",
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} pointer-events-none z-0 animate-pulse-glow`}
    >
      <img
        src={tesseractShardImage}
        alt="Tesseract Shard"
        className={`w-32 h-32 opacity-30 ${rotations[position]} animate-float`}
      />
    </div>
  );
};
