import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Planet } from "@shared/schema";
import type { PathResult } from "@/lib/graphAlgorithms";

interface PlanetSidePanelProps {
  planet: Planet;
  pathResult: PathResult;
  onClose: () => void;
  createdPlanets: Set<number>;
}

export default function PlanetSidePanel({ planet, pathResult, onClose, createdPlanets }: PlanetSidePanelProps) {
  return (
    <div className="fixed right-0 top-0 h-full w-[400px] bg-background/95 backdrop-blur-md border-l shadow-xl z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <h2 className="font-script text-4xl text-foreground">{planet.name}</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            data-testid="button-close-panel"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex items-center justify-center mb-6">
          <div
            className="rounded-full shadow-lg"
            style={{
              width: `${planet.size * 2}px`,
              height: `${planet.size * 2}px`,
              backgroundColor: planet.color,
              boxShadow: `0 0 20px ${planet.color}40, inset 0 0 20px rgba(255,255,255,0.2)`,
            }}
            data-testid="img-planet-graphic"
          />
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 text-muted-foreground">
              Description
            </h3>
            <p className="text-foreground capitalize leading-relaxed">
              {planet.description}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 text-muted-foreground">
              Explorer's Note
            </h3>
            <p className="text-foreground/90 italic leading-relaxed">
              {planet.explorerQuote}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-muted-foreground">
              Properties
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card/50 p-3 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Category</p>
                <p className="text-sm font-medium text-foreground">{planet.properties.category}</p>
              </div>
              <div className="bg-card/50 p-3 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Type</p>
                <p className="text-sm font-medium text-foreground">
                  {planet.properties.isPrime ? "Prime" : "Composite"}
                </p>
              </div>
              <div className="bg-card/50 p-3 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Parity</p>
                <p className="text-sm font-medium text-foreground">
                  {planet.properties.isEven ? "Even" : "Odd"}
                </p>
              </div>
              <div className="bg-card/50 p-3 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Digit Sum</p>
                <p className="text-sm font-medium text-foreground">{planet.properties.digitSum}</p>
              </div>
            </div>
            {planet.properties.primeFactors.length > 0 && (
              <div className="bg-card/50 p-3 rounded-md mt-3">
                <p className="text-xs text-muted-foreground mb-1">Prime Factors</p>
                <p className="text-sm font-medium font-mono text-foreground">
                  {planet.properties.primeFactors.join(" × ")}
                </p>
              </div>
            )}
          </div>
          
          {createdPlanets.size > 1 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-muted-foreground">
                Shortest Paths Network
              </h3>
              <div className="bg-card/30 p-4 rounded-md">
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {pathResult.edges.map((edge, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between text-sm py-2 border-b border-border/30 last:border-0"
                      data-testid={`edge-${edge.from}-${edge.to}`}
                    >
                      <span className="font-mono text-foreground">
                        P-{edge.from} ↔ P-{edge.to}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded">
                        {edge.weight.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                {pathResult.edges.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No connections yet. Create more planets!
                  </p>
                )}
              </div>
              
              {pathResult.distances.size > 1 && (
                <div className="mt-4 bg-card/30 p-4 rounded-md">
                  <p className="text-xs text-muted-foreground mb-2">Distances from {planet.name}</p>
                  <div className="space-y-1 max-h-[150px] overflow-y-auto">
                    {Array.from(pathResult.distances.entries())
                      .filter(([num]) => num !== planet.number)
                      .sort(([, a], [, b]) => a - b)
                      .map(([num, dist]) => (
                        <div key={num} className="flex justify-between text-xs">
                          <span className="font-mono text-foreground">P-{num}</span>
                          <span className="font-mono text-muted-foreground">{dist.toFixed(2)}</span>
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
