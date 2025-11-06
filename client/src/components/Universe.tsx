import { useEffect, useRef, useState } from "react";
import { allPlanets } from "@/lib/planetData";
import { calculateShortestPaths, type PathResult } from "@/lib/graphAlgorithms";
import PlanetSidePanel from "./PlanetSidePanel";
import type { Planet } from "@shared/schema";
import { Input } from "@/components/ui/input";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

export default function Universe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [createdPlanets, setCreatedPlanets] = useState<Set<number>>(new Set([1, 2, 5, 10, 42]));
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [pathResult, setPathResult] = useState<PathResult | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [stars, setStars] = useState<Star[]>([]);
  const animationRef = useRef<number>();
  const planetAnglesRef = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    const generatedStars: Star[] = [];
    for (let i = 0; i < 200; i++) {
      generatedStars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.3,
        twinkleSpeed: Math.random() * 0.0005 + 0.0002,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
    setStars(generatedStars);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 - 50;

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "hsl(var(--background))";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
        const currentOpacity = star.opacity + twinkle * 0.15;
        
        ctx.fillStyle = `rgba(255, 248, 230, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      const sunRadius = 60;
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, sunRadius * 1.8);
      gradient.addColorStop(0, "#FDB813");
      gradient.addColorStop(0.5, "#FDB81380");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sunRadius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FDB813";
      ctx.shadowBlur = 30;
      ctx.shadowColor = "#FDB813";
      ctx.beginPath();
      ctx.arc(centerX, centerY, sunRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      createdPlanets.forEach((planetNumber) => {
        const planet = allPlanets[planetNumber - 1];
        
        if (!planetAnglesRef.current.has(planetNumber)) {
          planetAnglesRef.current.set(planetNumber, Math.random() * Math.PI * 2);
        }
        
        const currentAngle = planetAnglesRef.current.get(planetNumber)!;
        const newAngle = currentAngle + (Math.PI * 2) / (planet.orbitSpeed * 1000);
        planetAnglesRef.current.set(planetNumber, newAngle);

        const x = centerX + Math.cos(newAngle) * planet.orbitRadius;
        const y = centerY + Math.sin(newAngle) * planet.orbitRadius;

        ctx.strokeStyle = "hsl(var(--border) / 0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, planet.orbitRadius, 0, Math.PI * 2);
        ctx.stroke();

        const planetGradient = ctx.createRadialGradient(
          x - planet.size / 4,
          y - planet.size / 4,
          0,
          x,
          y,
          planet.size
        );
        planetGradient.addColorStop(0, planet.color + "FF");
        planetGradient.addColorStop(0.7, planet.color);
        planetGradient.addColorStop(1, planet.color + "CC");

        ctx.fillStyle = planetGradient;
        ctx.shadowBlur = 8;
        ctx.shadowColor = planet.color + "40";
        ctx.beginPath();
        ctx.arc(x, y, planet.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = "hsl(var(--foreground) / 0.8)";
        ctx.font = "11px var(--font-mono)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(planet.name, x, y + planet.size + 12);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [createdPlanets, stars]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 - 50;

    let clickedPlanet: Planet | null = null;

    createdPlanets.forEach((planetNumber) => {
      const planet = allPlanets[planetNumber - 1];
      const angle = planetAnglesRef.current.get(planetNumber) || 0;
      const x = centerX + Math.cos(angle) * planet.orbitRadius;
      const y = centerY + Math.sin(angle) * planet.orbitRadius;

      const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);

      if (distance <= planet.size + 5) {
        clickedPlanet = planet;
      }
    });

    if (clickedPlanet !== null) {
      setSelectedPlanet(clickedPlanet);
      const result = calculateShortestPaths(clickedPlanet.number, createdPlanets);
      setPathResult(result);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(inputValue);
    if (num >= 1 && num <= 100) {
      setCreatedPlanets(prev => new Set(Array.from(prev).concat(num)));
      setInputValue("");
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="absolute inset-0 cursor-pointer"
        data-testid="canvas-universe"
      />

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <form onSubmit={handleInputSubmit} className="pointer-events-auto">
          <Input
            type="number"
            min="1"
            max="100"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter 1-100"
            className="w-[200px] bg-background/20 backdrop-blur-sm border-foreground/20 text-foreground placeholder:text-foreground/40 text-center"
            data-testid="input-planet-number"
          />
        </form>
      </div>

      {selectedPlanet && pathResult && (
        <PlanetSidePanel
          planet={selectedPlanet}
          pathResult={pathResult}
          onClose={() => setSelectedPlanet(null)}
          createdPlanets={createdPlanets}
        />
      )}
    </div>
  );
}
