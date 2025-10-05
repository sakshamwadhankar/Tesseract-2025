import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import brokenTesseract from "@/assets/broken-tesseract.jpg";

export const HydraScreen = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  const [isDestroying, setIsDestroying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Optional alarm sound (you can uncomment this if you want sound)
    // audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3");
    // audioRef.current.loop = true;
    // audioRef.current.play().catch(() => {});

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsDestroying(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleRetreat = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    navigate("/");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[hsl(var(--glitch-bg))]">
      {/* Static noise background */}
      <div
        className="absolute inset-0 opacity-10 animate-static-noise"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Red overlay */}
      <div className="absolute inset-0 bg-[hsl(var(--alert))] opacity-10 mix-blend-multiply" />

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-1 bg-gradient-to-b from-transparent via-[hsl(var(--alert))] to-transparent opacity-30 animate-scanline" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Broken Tesseract */}
        <div className="relative mb-8 animate-glitch">
          <img
            src={brokenTesseract}
            alt="Broken Tesseract"
            className="w-full max-w-2xl rounded-lg opacity-80 mix-blend-screen"
            style={{
              filter: "hue-rotate(340deg) saturate(1.5) contrast(1.2)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--alert))]/20 to-transparent mix-blend-overlay" />
        </div>

        {/* Warning text */}
        <div className="text-center mb-12">
          <h1
            className="text-6xl md:text-8xl font-bold text-[hsl(var(--alert))] mb-4 animate-glitch-text tracking-wider"
            style={{
              fontFamily: "monospace",
              textShadow: "0.05em 0 0 hsl(var(--glitch-red)), -0.05em -0.025em 0 hsl(var(--glitch-cyan))",
            }}
          >
            WARNING
          </h1>
          <p
            className="text-2xl md:text-4xl text-[hsl(var(--warning))] animate-pulse font-mono tracking-wide"
            style={{
              textShadow: "0 0 10px hsl(var(--alert))",
            }}
          >
            HYDRA INTRUSION DETECTED
          </p>
          <div className="mt-4 text-[hsl(var(--foreground))] text-sm font-mono opacity-70">
            [SECURITY PROTOCOL: OMEGA-RED INITIATED]
          </div>
        </div>

        {/* Countdown */}
        <div className="mb-8">
          <div
            className={`text-8xl font-bold font-mono text-[hsl(var(--alert))] animate-pulse-red ${
              isDestroying ? "animate-glitch" : ""
            }`}
            style={{
              textShadow: "0 0 30px hsl(var(--alert))",
            }}
          >
            {countdown > 0 ? countdown : "///"}
          </div>
          <p className="text-center text-[hsl(var(--muted-foreground))] font-mono mt-2 text-sm tracking-widest">
            {countdown > 0 ? "SELF-DESTRUCT SEQUENCE" : "SYSTEM BREACH"}
          </p>
        </div>

        {/* Retreat button */}
        <Button
          onClick={handleRetreat}
          variant="destructive"
          size="lg"
          className="animate-pulse-red font-mono text-lg px-8 py-6 tracking-widest border-2 border-[hsl(var(--alert))]"
          style={{
            background: "hsl(var(--destructive))",
            boxShadow: "0 0 20px hsl(var(--alert) / 0.5)",
          }}
        >
          RETREAT TO SAFE ZONE
        </Button>

        {/* Bottom warning bars */}
        <div className="fixed bottom-0 left-0 right-0 h-2 bg-[hsl(var(--alert))] animate-pulse" />
        <div className="fixed bottom-4 left-0 right-0 text-center text-[hsl(var(--alert))] text-xs font-mono tracking-widest opacity-70">
          ACCESS DENIED /// UNAUTHORIZED PERSONNEL /// PERIMETER BREACH
        </div>
      </div>
    </div>
  );
};
