import { useEffect, useRef, useState } from "react";
import { allPlanets } from "@/lib/planetData";
import { calculateShortestPaths, type PathResult } from "@/lib/graphAlgorithms";
import PlanetSidePanel from "./PlanetSidePanel";
import type { Planet } from "@shared/schema";
import { Home } from "lucide-react";
import { useLocation } from "wouter";

interface Star { x: number; y: number; size: number; opacity: number; }
interface Comet { angle: number; distance: number; speed: number; size: number; glow: number; }
interface PlanetFeature { type: "rings" | "asteroids" | "moon" | "cluster" | null; }

const astronautQuotes = [
  "TO THE STARS AND BACK",
  "COSMIC ADVENTURE AWAITS",
  "EVERY NUMBER TELLS A STORY",
  "EXPLORE YOUR UNIVERSE",
];

export default function Universe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [createdPlanets, setCreatedPlanets] = useState<Set<number>>(new Set([1, 2, 5, 10, 42]));
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [pathResult, setPathResult] = useState<PathResult | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [stars, setStars] = useState<Star[]>([]);
  const [comets, setComets] = useState<Comet[]>([]);
  const [astronautBounceFast, setAstronautBounceFast] = useState(false);
  const animationRef = useRef<number>();
  const planetAnglesRef = useRef<Map<number, number>>(new Map());
  const planetFeaturesRef = useRef<Map<number, PlanetFeature>>(new Map());
  const [, setLocation] = useLocation();
  const zoomRef = useRef(1);

  // Quote cycling
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex(prev => (prev + 1) % astronautQuotes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Stars generation
  useEffect(() => {
    const generatedStars: Star[] = [];
    for (let i = 0; i < 400; i++) {
      generatedStars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.3 + 0.1
      });
    }
    setStars(generatedStars);
  }, []);

  // Zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomRef.current *= e.deltaY < 0 ? 1.1 : 0.9;
      zoomRef.current = Math.min(1, zoomRef.current);
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  // Canvas animation (planets, stars, comets)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Universe background
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(zoomRef.current, zoomRef.current);
      ctx.translate(-centerX, -centerY);

      // Stars
      stars.forEach((star) => {
        ctx.shadowBlur = 2;
        ctx.shadowColor = "#FFFFFF";
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Sun
      const sunRadius = 70;
      const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, sunRadius);
      sunGradient.addColorStop(0, "#FFFFFF");
      sunGradient.addColorStop(0.5, "#FFFFEE");
      sunGradient.addColorStop(1, "#FFE0B2");
      ctx.shadowBlur = 100;
      ctx.shadowColor = "#FFFFFF";
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sunRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Comets
      comets.forEach((comet) => {
        comet.angle += comet.speed;
        const x = centerX + Math.cos(comet.angle) * comet.distance;
        const y = centerY + Math.sin(comet.angle) * comet.distance;
        ctx.shadowBlur = comet.glow;
        ctx.shadowColor = "#FF9900";
        ctx.fillStyle = "#FF8800";
        ctx.beginPath();
        ctx.arc(x, y, comet.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Planet edges
      const planetArray = Array.from(createdPlanets);
      const edges: { from: number; to: number; weight: number }[] = [];
      planetArray.forEach((a) => {
        planetArray.forEach((b) => {
          if (a !== b && (a % b === 0 || b % a === 0)) edges.push({ from: a, to: b, weight: Math.abs(a - b) });
        });
      });

      edges.forEach((edge) => {
        const planet1 = allPlanets[edge.from - 1];
        const planet2 = allPlanets[edge.to - 1];
        const angle1 = planetAnglesRef.current.get(edge.from) || 0;
        const angle2 = planetAnglesRef.current.get(edge.to) || 0;
        const x1 = centerX + Math.cos(angle1) * planet1.orbitRadius;
        const y1 = centerY + Math.sin(angle1) * planet1.orbitRadius;
        const x2 = centerX + Math.cos(angle2) * planet2.orbitRadius;
        const y2 = centerY + Math.sin(angle2) * planet2.orbitRadius;

        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(edge.weight.toString(), midX, midY);
      });

      // Planets
      createdPlanets.forEach((planetNumber) => {
        const planet = allPlanets[planetNumber - 1];
        if (!planetAnglesRef.current.has(planetNumber)) planetAnglesRef.current.set(planetNumber, Math.random() * Math.PI * 2);
        if (!planetFeaturesRef.current.has(planetNumber)) {
          const features: PlanetFeature["type"][] = ["rings", "asteroids", "moon", "cluster"];
          planetFeaturesRef.current.set(planetNumber, { type: features[Math.floor(Math.random() * features.length)] });
        }

        const angle = planetAnglesRef.current.get(planetNumber)!;
        const newAngle = angle + (Math.PI * 2) / (planet.orbitSpeed * 500);
        planetAnglesRef.current.set(planetNumber, newAngle);

        const x = centerX + Math.cos(newAngle) * planet.orbitRadius;
        const y = centerY + Math.sin(newAngle) * planet.orbitRadius;

        // Orbit
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, planet.orbitRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Planet gradient
        const planetGradient = ctx.createRadialGradient(x - planet.size / 3, y - planet.size / 3, 0, x, y, planet.size);
        const lighterColor = adjustColorBrightness(planet.color, 30);
        const darkerColor = adjustColorBrightness(planet.color, -20);
        planetGradient.addColorStop(0, lighterColor);
        planetGradient.addColorStop(0.7, planet.color);
        planetGradient.addColorStop(1, darkerColor);

        ctx.fillStyle = planetGradient;
        ctx.shadowBlur = 20;
        ctx.shadowColor = planet.color;
        ctx.beginPath();
        ctx.arc(x, y, planet.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Features
        const feature = planetFeaturesRef.current.get(planetNumber)?.type;
        if (feature === "rings") {
          ctx.strokeStyle = "rgba(255,255,255,0.5)";
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
          ctx.shadowBlur = 15;
          ctx.shadowColor = "#FFFFAA";
          ctx.beginPath();
          ctx.arc(x, y, planet.size * 1.8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.shadowBlur = 0;
        } else if (feature === "asteroids") {
          ctx.fillStyle = adjustColorBrightness(planet.color, -30);
          for (let i = 0; i < 5; i++) {
            const angleA = (i / 5) * Math.PI * 2 + newAngle * 2;
            const distance = planet.size * 1.8;
            ctx.beginPath();
            ctx.arc(x + Math.cos(angleA) * distance, y + Math.sin(angleA) * distance, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (feature === "moon") {
          const moonAngle = newAngle * 3;
          ctx.fillStyle = "#CCCCCC";
          ctx.beginPath();
          ctx.arc(x + Math.cos(moonAngle) * (planet.size + 5), y + Math.sin(moonAngle) * (planet.size + 5), 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (feature === "cluster") {
          for (let i = 0; i < 3; i++) {
            const offsetX = Math.random() * 10 - 5;
            const offsetY = Math.random() * 10 - 5;
            ctx.fillStyle = planet.color;
            ctx.beginPath();
            ctx.arc(x + offsetX, y + offsetY, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      ctx.restore();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => { window.removeEventListener("resize", resizeCanvas); if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [createdPlanets, stars, comets]);

  function adjustColorBrightness(hex: string, percent: number): string {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent));
    const b = Math.min(255, Math.max(0, (num & 0xff) + percent));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / zoomRef.current;
    const clickY = (e.clientY - rect.top) / zoomRef.current;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const sunRadius = 70;
    if (Math.sqrt((clickX - centerX) ** 2 + (clickY - centerY) ** 2) <= sunRadius) {
      setComets((prev) => [...prev, { angle: Math.random() * Math.PI * 2, distance: Math.random() * 200 + 50, speed: Math.random() * 0.05 + 0.01, size: Math.random() * 2 + 1, glow: Math.random() * 10 + 5 }]);
    }

    // Planet click
    let clickedPlanet: Planet | null = null;
    createdPlanets.forEach((planetNumber) => {
      const planet = allPlanets[planetNumber - 1];
      const angle = planetAnglesRef.current.get(planetNumber) || 0;
      const x = centerX + Math.cos(angle) * planet.orbitRadius;
      const y = centerY + Math.sin(angle) * planet.orbitRadius;
      if (Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2) <= planet.size + 5) clickedPlanet = planet;
    });

    if (clickedPlanet) {
      setSelectedPlanet(clickedPlanet);
      setPathResult(calculateShortestPaths(clickedPlanet.number, createdPlanets));
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(inputValue);
    if (!isNaN(num) && num >= 1 && num <= 100) {
      setCreatedPlanets((prev) => new Set([...Array.from(prev), num]));
      setInputValue("");
      setAstronautBounceFast(true);
      setTimeout(() => setAstronautBounceFast(false), 1000);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-mono text-white">
      <canvas ref={canvasRef} onClick={handleCanvasClick} className="absolute inset-0 z-0 cursor-pointer" />

      {/* Home button top-right */}
      <button onClick={() => setLocation("/")} className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 rounded-full border border-white/30">
        <Home className="w-5 h-5 text-white" />
      </button>

{/* Retro vertical info panel with bouncing astronaut */}
<div className="absolute left-4 top-4 z-20 flex flex-col items-center font-[Retrobyte] space-y-3">
  {/* Bouncing astronaut above panel */}
  <img
    src="/astronaut_pixel.png"
    className={`w-28 h-28 ${astronautBounceFast ? "animate-bounce-fast" : "animate-bounce-slow"}`}
    alt="Retro Astronaut"
  />

  {/* Main info window */}
  <div className="w-52 p-4 bg-black border-2 border-white rounded-2xl flex flex-col justify-start items-center text-center text-white font-[Retrobyte] text-sm leading-snug">
    
    {/* Cycling quote */}
    <p className="mb-2 font-bold">{astronautQuotes[currentQuoteIndex]}</p>

    {/* Main info text */}
    <p className="px-2">
      Welcome explorer! Add a number to see the cosmic paths reveal themselves. Click planets or sun to interact. Enter your number in the input field below and watch the universe come alive with cosmic connections and adventures!
    </p>

    {/* Number input */}
    <form onSubmit={handleInputSubmit} className="mt-auto w-full flex justify-center px-2">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value.replace(/\D/, ""))}
        placeholder="ENTER A NUMBER"
        className="w-full bg-transparent text-center text-base font-bold focus:outline-none pb-1 transition-all font-[Retrobyte] text-white placeholder-white"
      />
    </form>
  </div>

  {/* Total Planets Info Box (styled same as main panel) */}
  <div className="w-52 p-4 bg-black border-2 border-white rounded-2xl flex flex-col justify-center items-center text-center font-[Retrobyte] space-y-0">
    <p className="text-m text-white-600 select-none">Total Planets in Universe</p>
    <p className="text-lg font-bold text-white-300">{createdPlanets.size}</p>
  </div>
</div>



      {selectedPlanet && pathResult && (
        <PlanetSidePanel
          planet={selectedPlanet}
          pathResult={pathResult}
          onClose={() => setSelectedPlanet(null)}
          createdPlanets={createdPlanets}
        />
      )}

      <style jsx>{`
        @keyframes bounce-slow { 0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);} }
        @keyframes bounce-fast { 0%,100%{transform:translateY(0);}50%{transform:translateY(-15px);} }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-bounce-fast { animation: bounce-fast 0.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
