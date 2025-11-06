import { X } from "lucide-react";
import type { Planet } from "@shared/schema";
import type { PathResult } from "@/lib/graphAlgorithms";

interface PlanetSidePanelProps {
  planet: Planet;
  pathResult: PathResult;
  onClose: () => void;
  createdPlanets: Set<number>;
}

export default function PlanetSidePanel({ planet, pathResult, onClose, createdPlanets }: PlanetSidePanelProps) {
  function adjustColorBrightness(hex: string, percent: number): string {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent));
    const b = Math.min(255, Math.max(0, (num & 0xff) + percent));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }

  return (
    <div 
      className="fixed right-0 top-0 h-full w-[400px] bg-black/95 backdrop-blur-md border-l border-white/20 shadow-xl z-50 overflow-y-auto"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <h2 className="font-bold text-3xl text-white">Planet {planet.number}</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-2"
            data-testid="button-close-panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center justify-center mb-6">
          <div
            className="rounded-full shadow-lg relative"
            style={{
              width: `${planet.size * 3}px`,
              height: `${planet.size * 3}px`,
              background: `radial-gradient(circle at 30% 30%, ${adjustColorBrightness(planet.color, 40)}, ${planet.color} 60%, ${adjustColorBrightness(planet.color, -30)})`,
              boxShadow: `0 0 40px ${planet.color}80, inset 0 0 30px rgba(255,255,255,0.2)`,
            }}
            data-testid="img-planet-graphic"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-black">{planet.number}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 text-white/60">
              Description
            </h3>
            <p className="text-white capitalize leading-relaxed">
              {planet.description}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 text-white/60">
              Explorer's Note
            </h3>
            <p className="text-white/90 italic leading-relaxed">
              {planet.explorerQuote}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-white/60">
              Properties
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 p-3 rounded-md border border-white/20">
                <p className="text-xs text-white/60 mb-1">Category</p>
                <p className="text-sm font-medium text-white">{planet.properties.category}</p>
              </div>
              <div className="bg-white/10 p-3 rounded-md border border-white/20">
                <p className="text-xs text-white/60 mb-1">Type</p>
                <p className="text-sm font-medium text-white">
                  {planet.properties.isPrime ? "Prime" : "Composite"}
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-md border border-white/20">
                <p className="text-xs text-white/60 mb-1">Parity</p>
                <p className="text-sm font-medium text-white">
                  {planet.properties.isEven ? "Even" : "Odd"}
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-md border border-white/20">
                <p className="text-xs text-white/60 mb-1">Digit Sum</p>
                <p className="text-sm font-medium text-white">{planet.properties.digitSum}</p>
              </div>
            </div>
            {planet.properties.primeFactors.length > 0 && (
              <div className="bg-white/10 p-3 rounded-md mt-3 border border-white/20">
                <p className="text-xs text-white/60 mb-1">Prime Factors</p>
                <p className="text-sm font-medium font-mono text-white">
                  {planet.properties.primeFactors.join(" × ")}
                </p>
              </div>
            )}
          </div>
          
          {createdPlanets.size > 1 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-white/60">
                Shortest Paths Network
              </h3>
              <div className="bg-white/5 p-4 rounded-md border border-white/20">
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {pathResult.edges.map((edge, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between text-sm py-2 border-b border-white/10 last:border-0"
                      data-testid={`edge-${edge.from}-${edge.to}`}
                    >
                      <span className="font-mono text-white">
                        P-{edge.from} ↔ P-{edge.to}
                      </span>
                      <span className="font-mono text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                        {edge.weight.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                {pathResult.edges.length === 0 && (
                  <p className="text-sm text-white/60 text-center py-4">
                    No connections yet. Create more planets!
                  </p>
                )}
              </div>
              
              {pathResult.distances.size > 1 && (
                <div className="mt-4 bg-white/5 p-4 rounded-md border border-white/20">
                  <p className="text-xs text-white/60 mb-2">Distances from Planet {planet.number}</p>
                  <div className="space-y-1 max-h-[150px] overflow-y-auto">
                    {Array.from(pathResult.distances.entries())
                      .filter(([num]) => num !== planet.number)
                      .sort(([, a], [, b]) => a - b)
                      .map(([num, dist]) => (
                        <div key={num} className="flex justify-between text-xs">
                          <span className="font-mono text-white">P-{num}</span>
                          <span className="font-mono text-white/60">{dist.toFixed(2)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
