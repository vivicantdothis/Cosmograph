import { useEffect, useRef, useState } from "react";
import { allPlanets } from "@/lib/planetData";
import { calculateShortestPaths, type PathResult } from "@/lib/graphAlgorithms";
import PlanetSidePanel from "./PlanetSidePanel";
import type { Planet } from "@shared/schema";
import { Home } from "lucide-react";
import { useLocation } from "wouter";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
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
  const [, setLocation] = useLocation();

  useEffect(() => {
    const generatedStars: Star[] = [];
    for (let i = 0; i < 300; i++) {
      generatedStars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
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
    const centerY = canvas.height / 2;

    const animate = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (pathResult && selectedPlanet) {
        pathResult.edges.forEach((edge) => {
          const planet1 = allPlanets[edge.from - 1];
          const planet2 = allPlanets[edge.to - 1];
          
          const angle1 = planetAnglesRef.current.get(edge.from) || 0;
          const angle2 = planetAnglesRef.current.get(edge.to) || 0;
          
          const x1 = centerX + Math.cos(angle1) * planet1.orbitRadius;
          const y1 = centerY + Math.sin(angle1) * planet1.orbitRadius;
          const x2 = centerX + Math.cos(angle2) * planet2.orbitRadius;
          const y2 = centerY + Math.sin(angle2) * planet2.orbitRadius;
          
          ctx.strokeStyle = "rgba(255, 215, 0, 0.3)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        });
      }

      const sunRadius = 70;
      const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, sunRadius);
      sunGradient.addColorStop(0, "#FFE484");
      sunGradient.addColorStop(0.5, "#FF9C42");
      sunGradient.addColorStop(1, "#FF6B35");
      
      ctx.shadowBlur = 40;
      ctx.shadowColor = "#FFA500";
      ctx.fillStyle = sunGradient;
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

        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, planet.orbitRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        const planetGradient = ctx.createRadialGradient(
          x - planet.size / 3,
          y - planet.size / 3,
          0,
          x,
          y,
          planet.size
        );
        
        const lighterColor = adjustColorBrightness(planet.color, 40);
        planetGradient.addColorStop(0, lighterColor);
        planetGradient.addColorStop(0.6, planet.color);
        planetGradient.addColorStop(1, adjustColorBrightness(planet.color, -30));

        ctx.shadowBlur = 20;
        ctx.shadowColor = planet.color;
        ctx.fillStyle = planetGradient;
        ctx.beginPath();
        ctx.arc(x, y, planet.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#000000";
        ctx.font = "bold 11px Montserrat, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(planetNumber.toString(), x, y);
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
  }, [createdPlanets, stars, pathResult, selectedPlanet]);

  function adjustColorBrightness(hex: string, percent: number): string {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent));
    const b = Math.min(255, Math.max(0, (num & 0xff) + percent));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

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

    if (clickedPlanet) {
      const planet = clickedPlanet;
      setSelectedPlanet(planet);
      const result = calculateShortestPaths(planet.number, createdPlanets);
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
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="absolute inset-0 cursor-pointer"
        data-testid="canvas-universe"
      />

      <button
        onClick={() => setLocation("/")}
        className="absolute top-6 left-6 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-colors"
        data-testid="button-home"
      >
        <Home className="w-6 h-6 text-white" />
      </button>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <form onSubmit={handleInputSubmit} className="pointer-events-auto">
          <input
            type="number"
            min="1"
            max="100"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter 1-100"
            className="w-[200px] bg-transparent text-white placeholder:text-white/50 text-center text-lg font-['Montserrat'] focus:outline-none focus:ring-2 focus:ring-white/30 rounded-lg px-4 py-2"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
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
