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
      className="fixed right-0 top-0 h-full w-[400px] bg-[#F4EFD3]/95 backdrop-blur-md border-l-2 border-black/10 shadow-xl z-50 overflow-y-auto"
      style={{ fontFamily: 'Unbounded, sans-serif' }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-3xl text-[#C85A54]">Planet {planet.number}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 transition-colors p-2"
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
              boxShadow: `0 0 30px ${planet.color}60`,
            }}
            data-testid="img-planet-graphic"
          />
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm uppercase tracking-wider mb-2 text-gray-600">
              Description
            </h3>
            <p className="text-gray-800 capitalize leading-relaxed">
              {planet.description}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm uppercase tracking-wider mb-2 text-gray-600">
              Explorer's Note
            </h3>
            <p className="text-gray-700 italic leading-relaxed font-serif">
              {planet.explorerQuote}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm uppercase tracking-wider mb-3 text-gray-600">
              Properties
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/60 p-3 rounded-md border border-black/10">
                <p className="text-xs text-gray-600 mb-1">Category</p>
                <p className="text-sm text-gray-900">{planet.properties.category}</p>
              </div>
              <div className="bg-white/60 p-3 rounded-md border border-black/10">
                <p className="text-xs text-gray-600 mb-1">Type</p>
                <p className="text-sm text-gray-900">
                  {planet.properties.isPrime ? "Prime" : "Composite"}
                </p>
              </div>
              <div className="bg-white/60 p-3 rounded-md border border-black/10">
                <p className="text-xs text-gray-600 mb-1">Parity</p>
                <p className="text-sm text-gray-900">
                  {planet.properties.isEven ? "Even" : "Odd"}
                </p>
              </div>
              <div className="bg-white/60 p-3 rounded-md border border-black/10">
                <p className="text-xs text-gray-600 mb-1">Digit Sum</p>
                <p className="text-sm text-gray-900">{planet.properties.digitSum}</p>
              </div>
            </div>
            {planet.properties.primeFactors.length > 0 && (
              <div className="bg-white/60 p-3 rounded-md mt-3 border border-black/10">
                <p className="text-xs text-gray-600 mb-1">Prime Factors</p>
                <p className="text-sm font-mono text-gray-900">
                  {planet.properties.primeFactors.join(" × ")}
                </p>
              </div>
            )}
          </div>
          
          {createdPlanets.size > 1 && (
            <div>
              <h3 className="text-sm uppercase tracking-wider mb-3 text-gray-600">
                Shortest Paths Network
              </h3>
              <div className="bg-white/60 p-4 rounded-md border border-black/10">
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {pathResult.edges.map((edge, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between text-sm py-2 border-b border-gray-300 last:border-0"
                      data-testid={`edge-${edge.from}-${edge.to}`}
                    >
                      <span className="font-mono text-gray-800">
                        P-{edge.from} ↔ P-{edge.to}
                      </span>
                      <span className="font-mono text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded">
                        {edge.weight}
                      </span>
                    </div>
                  ))}
                </div>
                {pathResult.edges.length === 0 && (
                  <p className="text-sm text-gray-600 text-center py-4">
                    No connections yet. Create more planets!
                  </p>
                )}
              </div>
              
              {pathResult.distances.size > 1 && (
                <div className="mt-4 bg-white/60 p-4 rounded-md border border-black/10">
                  <p className="text-xs text-gray-600 mb-2">Distances from Planet {planet.number}</p>
                  <div className="space-y-1 max-h-[150px] overflow-y-auto">
                    {Array.from(pathResult.distances.entries())
                      .filter(([num]) => num !== planet.number)
                      .sort(([, a], [, b]) => a - b)
                      .map(([num, dist]) => (
                        <div key={num} className="flex justify-between text-xs">
                          <span className="font-mono text-gray-800">P-{num}</span>
                          <span className="font-mono text-gray-600">{dist}</span>
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
