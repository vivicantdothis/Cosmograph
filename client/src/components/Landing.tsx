import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="text-center z-10 px-8 max-w-3xl">
        <p className="text-sm tracking-[0.3em] uppercase mb-6 text-foreground/70">
          For the
        </p>
        
        <h1 className="font-script text-7xl md:text-8xl mb-8 text-foreground">
          Number Universe
        </h1>
        
        <p className="text-base md:text-lg mb-12 max-w-2xl mx-auto leading-relaxed text-foreground/80">
          You're about to embark on a journey where numbers transform into celestial bodies. 
          Each number from 1 to 100 has its own planet, waiting to be discovered in the cosmic expanse.
        </p>
        
        <Button
          size="lg"
          onClick={() => setLocation("/universe")}
          className="px-12 py-6 text-base tracking-wider"
          data-testid="button-enter-universe"
        >
          ENTER THE UNIVERSE
        </Button>
        
        <p className="mt-8 text-sm text-muted-foreground italic">
          Discover the synesthetic beauty where mathematics meets the cosmos
        </p>
      </div>
    </div>
  );
}
