import { X } from "lucide-react";
import type { Planet } from "@shared/schema";
import type { PathResult } from "@/lib/graphAlgorithms";

interface PlanetSidePanelProps {
  planet: Planet;
  pathResult: PathResult;
  onClose: () => void;
  createdPlanets: Set<number>;
}

export default function PlanetSidePanel({
  planet,
  pathResult,
  onClose,
  createdPlanets,
}: PlanetSidePanelProps) {
  function adjustColorBrightness(hex: string, percent: number): string {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent));
    const b = Math.min(255, Math.max(0, (num & 0xff) + percent));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  }

  return (
    <div
      className="fixed right-0 top-0 h-full w-[400px] bg-black/95 backdrop-blur-md border-l-2 border-white z-50 overflow-y-auto font-[Retrobyte] text-[#FFF9C4] text-center"
    >
      <div className="p-6 flex flex-col items-center">
        {/* Header */}
        <div className="flex items-center justify-between w-full mb-6">
          <h2 className="text-3xl select-none">Planet {planet.number}</h2>
          <button
            onClick={onClose}
            className="text-[#FFF9C4] hover:text-yellow-300 transition-colors p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Planet graphic */}
        <div className="flex items-center justify-center mb-6">
          <div
            className="border-2 border-[#FFF9C4] rounded-full"
            style={{
              width: `${planet.size * 3}px`,
              height: `${planet.size * 3}px`,
              background: `radial-gradient(circle at 30% 30%, ${adjustColorBrightness(
                planet.color,
                40
              )}, ${planet.color} 60%, ${adjustColorBrightness(planet.color, -30)})`,
              boxShadow: `0 0 20px ${planet.color}60`,
            }}
          />
        </div>

        {/* Description & Explorer Note */}
        <div className="space-y-4 text-center">
          <div>
            <h3 className="uppercase tracking-wider mb-1 select-none">Description</h3>
            <p className="capitalize">{planet.description}</p>
          </div>

          <div>
            <h3 className="uppercase tracking-wider mb-1 select-none">Explorer's Note</h3>
            <p className="italic">{planet.explorerQuote}</p>
          </div>

          {/* Properties */}
          <div>
            <h3 className="uppercase tracking-wider mb-3 select-none">Properties</h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-black/70 p-3 rounded-md border border-white/30">
                <p className="text-xs mb-1 select-none">Category</p>
                <p className="text-sm">{planet.properties.category}</p>
              </div>
              <div className="bg-black/70 p-3 rounded-md border border-white/30">
                <p className="text-xs mb-1 select-none">Type</p>
                <p className="text-sm">{planet.properties.isPrime ? "Prime" : "Composite"}</p>
              </div>
              <div className="bg-black/70 p-3 rounded-md border border-white/30">
                <p className="text-xs mb-1 select-none">Parity</p>
                <p className="text-sm">{planet.properties.isEven ? "Even" : "Odd"}</p>
              </div>
              <div className="bg-black/70 p-3 rounded-md border border-white/30">
                <p className="text-xs mb-1 select-none">Digit Sum</p>
                <p className="text-sm">{planet.properties.digitSum}</p>
              </div>
            </div>

            {planet.properties.primeFactors.length > 0 && (
              <div className="bg-black/70 p-3 mt-3 rounded-md border border-white/30 text-center">
                <p className="text-xs mb-1 select-none">Prime Factors</p>
                <p className="text-sm font-mono">
                  {planet.properties.primeFactors.join(" × ")}
                </p>
              </div>
            )}
          </div>

          {/* Shortest Paths */}
          {createdPlanets.size > 1 && (
            <div className="mt-4">
              <h3 className="uppercase tracking-wider mb-3 select-none">Shortest Paths Network</h3>
              <div className="bg-black/70 p-4 rounded-md border border-white/30">
                <div className="space-y-2 max-h-[200px] overflow-y-auto text-center">
                  {pathResult.edges.map((edge, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm py-2 border-b border-white/20 last:border-0"
                    >
                      <span className="font-mono">{`P-${edge.from} ↔ P-${edge.to}`}</span>
                      <span className="font-mono text-xs bg-white/20 px-2 py-1 rounded">
                        {edge.weight}
                      </span>
                    </div>
                  ))}
                  {pathResult.edges.length === 0 && (
                    <p className="text-sm text-center py-4">No connections yet. Create more planets!</p>
                  )}
                </div>

                {pathResult.distances.size > 1 && (
                  <div className="mt-4 bg-black/70 p-4 rounded-md border border-white/30 text-center">
                    <p className="text-xs mb-2 select-none">Distances from Planet {planet.number}</p>
                    <div className="space-y-1 max-h-[150px] overflow-y-auto">
                      {Array.from(pathResult.distances.entries())
                        .filter(([num]) => num !== planet.number)
                        .sort(([, a], [, b]) => a - b)
                        .map(([num, dist]) => (
                          <div key={num} className="flex justify-between text-xs">
                            <span className="font-mono">P-{num}</span>
                            <span className="font-mono">{dist}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
