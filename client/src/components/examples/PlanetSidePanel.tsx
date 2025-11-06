import PlanetSidePanel from "../PlanetSidePanel";
import { allPlanets } from "@/lib/planetData";

export default function PlanetSidePanelExample() {
  const planet = allPlanets[41];
  const pathResult = {
    path: [1, 42, 50],
    distances: new Map([
      [1, 41.5],
      [42, 0],
      [50, 8.2],
    ]),
    edges: [
      { from: 1, to: 42, weight: 41.5 },
      { from: 42, to: 50, weight: 8.2 },
    ],
  };
  
  return (
    <div className="relative h-screen">
      <PlanetSidePanel
        planet={planet}
        pathResult={pathResult}
        onClose={() => console.log("Close panel")}
        createdPlanets={new Set([1, 42, 50])}
      />
    </div>
  );
}
