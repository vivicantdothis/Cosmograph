import { useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";

interface Sprite {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
}

const thoughtImages = ["/thought1.png", "/thought2.png", "/thought3.png"];

export default function Landing() {
  const [, setLocation] = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sprites, setSprites] = useState<Sprite[]>([]);
  const [astroY, setAstroY] = useState(0);
  const [astroDir, setAstroDir] = useState(1);
  const [thoughtIndex, setThoughtIndex] = useState(0);

  // Initialize background sprites
  useEffect(() => {
    const colors = ["#FFED99", "#FFF2B2", "#FFE4B5", "#FFDDAA"];
    const newSprites: Sprite[] = [];
    for (let i = 0; i < 120; i++) {
      newSprites.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.2 + 0.05,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setSprites(newSprites);
  }, []);

  // Animate background sprites
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

    const animate = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      sprites.forEach((sprite) => {
        sprite.y += sprite.speed;
        if (sprite.y > canvas.height) sprite.y = -sprite.size;

        ctx.fillStyle = sprite.color;
        ctx.fillRect(sprite.x, sprite.y, sprite.size, sprite.size);
      });

      requestAnimationFrame(animate);
    };

    animate();
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [sprites]);

  // Animate bouncing astronaut & cycle thought images faster
  useEffect(() => {
    const interval = setInterval(() => {
      setAstroY((prev) => {
        if (prev >= 20) setAstroDir(-1);
        if (prev <= 0) setAstroDir(1);
        return prev + astroDir;
      });
    }, 50);

    const thoughtInterval = setInterval(() => {
      setThoughtIndex((prev) => (prev + 1) % thoughtImages.length);
    }, 2000); // faster cycle (every 2 seconds)

    return () => {
      clearInterval(interval);
      clearInterval(thoughtInterval);
    };
  }, [astroDir]);

  return (
    <div className="w-screen h-screen relative bg-black overflow-hidden flex flex-col items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo with reduced overlap */}
        <img
          src="/logo.png"
          alt="Logo"
          className="w-64 md:w-80 z-10" // slightly less overlap
          style={{ position: "relative", top: "20px"}}
        />

        {/* Astronaut bouncing sprite with thought bubble */}
        <div className="flex flex-col items-center space-y-1">
          <img
            src="/astronaut_pixel.png"
            alt="Astronaut"
            className="w-32 md:w-40"
            style={{ transform: `translateY(${astroY}px)` }}
          />

          <img
            src={thoughtImages[thoughtIndex]}
            alt="Thought bubble"
            className="w-48 md:w-56"
          />
        </div>

        {/* Text overlapping the thought bubble */}
        <img
          src="/text.png"
          alt="Landing Text"
          className="w-96 md:w-[700px] -mt-6 mb-2 z-10"
        />

        {/* Enter Universe Button overlapping text */}
        <img
          src="/button.png"
          alt="Enter Universe Button"
          className="w-48 md:w-60 -mt-4 z-10 cursor-pointer"
          onClick={() => setLocation("/universe")}
        />
      </div>
    </div>
  );
}
