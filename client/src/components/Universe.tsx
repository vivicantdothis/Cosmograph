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
    for (let i = 0; i < 400; i++) {
      generatedStars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.3 + 0.1,
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

      if (pathResult) {
        pathResult.edges.forEach((edge) => {
          const planet1 = allPlanets[edge.from - 1];
          const planet2 = allPlanets[edge.to - 1];
          
          const angle1 = planetAnglesRef.current.get(edge.from) || 0;
          const angle2 = planetAnglesRef.current.get(edge.to) || 0;
          
          const x1 = centerX + Math.cos(angle1) * planet1.orbitRadius;
          const y1 = centerY + Math.sin(angle1) * planet1.orbitRadius;
          const x2 = centerX + Math.cos(angle2) * planet2.orbitRadius;
          const y2 = centerY + Math.sin(angle2) * planet2.orbitRadius;
          
          ctx.strokeStyle = "rgba(255, 215, 0, 0.4)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;
          ctx.fillStyle = "rgba(255, 215, 0, 0.9)";
          ctx.font = "bold 12px Montserrat, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(edge.weight.toString(), midX, midY);
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

        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, planet.orbitRadius, 0, Math.PI * 2);
        ctx.stroke();

        const planetGradient = ctx.createRadialGradient(
          x - planet.size / 3,
          y - planet.size / 3,
          0,
          x,
          y,
          planet.size
        );
        
        const lighterColor = adjustColorBrightness(planet.color, 30);
        const darkerColor = adjustColorBrightness(planet.color, -20);
        planetGradient.addColorStop(0, lighterColor);
        planetGradient.addColorStop(0.7, planet.color);
        planetGradient.addColorStop(1, darkerColor);

        ctx.shadowBlur = 15;
        ctx.shadowColor = planet.color;
        ctx.fillStyle = planetGradient;
        ctx.beginPath();
        ctx.arc(x, y, planet.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (planet.feature === "rings") {
          ctx.strokeStyle = adjustColorBrightness(planet.color, -30);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(x, y, planet.size * 1.5, planet.size * 0.5, 0, 0, Math.PI * 2);
          ctx.stroke();
        } else if (planet.feature === "spots") {
          ctx.fillStyle = adjustColorBrightness(planet.color, -40);
          for (let i = 0; i < 3; i++) {
            const spotX = x + (Math.cos(i * 2) * planet.size * 0.5);
            const spotY = y + (Math.sin(i * 2) * planet.size * 0.5);
            ctx.beginPath();
            ctx.arc(spotX, spotY, planet.size * 0.2, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (planet.feature === "asteroids") {
          ctx.fillStyle = adjustColorBrightness(planet.color, -30);
          for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 + newAngle * 2;
            const distance = planet.size * 1.8;
            const asteroidX = x + Math.cos(angle) * distance;
            const asteroidY = y + Math.sin(angle) * distance;
            ctx.beginPath();
            ctx.arc(asteroidX, asteroidY, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
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
  }, [createdPlanets, stars, pathResult]);

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
        className="absolute top-6 left-6 z-20 bg-[#F4EFD3]/20 hover:bg-[#F4EFD3]/30 backdrop-blur-sm p-3 rounded-full transition-colors border-2 border-white/30"
        data-testid="button-home"
      >
        <Home className="w-6 h-6 text-white" />
      </button>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 text-center">
        <h2 className="font-script text-4xl text-white mb-4 pointer-events-none" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          THE COSMIC BALANCE LIES IN YOUR HANDS
        </h2>
        <form onSubmit={handleInputSubmit} className="pointer-events-auto">
          <input
            type="number"
            min="1"
            max="100"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="ENTER A NUMBER"
            className="w-[280px] bg-transparent text-white placeholder:text-white/60 text-center text-xl font-bold tracking-wide focus:outline-none focus:ring-0 border-b-2 border-white/40 focus:border-white/80 pb-2 transition-colors"
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
