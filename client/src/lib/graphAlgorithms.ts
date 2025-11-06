export interface GraphEdge {
  from: number;
  to: number;
  weight: number;
}

export interface PathResult {
  path: number[];
  distances: Map<number, number>;
  edges: GraphEdge[];
}

export function calculateShortestPaths(
  sourceNumber: number,
  createdNumbers: Set<number>
): PathResult {
  const nodes = Array.from(createdNumbers);
  
  if (!nodes.includes(sourceNumber)) {
    return { path: [], distances: new Map(), edges: [] };
  }
  
  const distances = new Map<number, number>();
  const previous = new Map<number, number | null>();
  const unvisited = new Set(nodes);
  const edges: GraphEdge[] = [];
  
  nodes.forEach(node => {
    distances.set(node, Infinity);
    previous.set(node, null);
  });
  
  distances.set(sourceNumber, 0);
  
  function getEdgeWeight(a: number, b: number): number {
    const diff = Math.abs(a - b);
    const gcd = calculateGCD(a, b);
    const lcm = (a * b) / gcd;
    
    return diff + (gcd / 10) + (lcm / 1000);
  }
  
  function calculateGCD(a: number, b: number): number {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }
  
  while (unvisited.size > 0) {
    let currentNode: number | null = null;
    let minDistance = Infinity;
    
    unvisited.forEach(node => {
      const dist = distances.get(node)!;
      if (dist < minDistance) {
        minDistance = dist;
        currentNode = node;
      }
    });
    
    if (currentNode === null || minDistance === Infinity) {
      break;
    }
    
    unvisited.delete(currentNode);
    
    nodes.forEach(neighbor => {
      if (neighbor === currentNode || !unvisited.has(neighbor)) return;
      
      const weight = getEdgeWeight(currentNode!, neighbor);
      const altDistance = distances.get(currentNode!)! + weight;
      
      if (altDistance < distances.get(neighbor)!) {
        distances.set(neighbor, altDistance);
        previous.set(neighbor, currentNode);
      }
    });
  }
  
  nodes.forEach(node => {
    if (node === sourceNumber) return;
    
    let current: number | null = node;
    const pathToNode: number[] = [];
    
    while (current !== null) {
      pathToNode.unshift(current);
      current = previous.get(current)!;
    }
    
    if (pathToNode.length > 1 && pathToNode[0] === sourceNumber) {
      for (let i = 0; i < pathToNode.length - 1; i++) {
        const from = pathToNode[i];
        const to = pathToNode[i + 1];
        const weight = getEdgeWeight(from, to);
        
        if (!edges.some(e => 
          (e.from === from && e.to === to) || 
          (e.from === to && e.to === from)
        )) {
          edges.push({ from, to, weight });
        }
      }
    }
  });
  
  return {
    path: nodes.sort((a, b) => a - b),
    distances,
    edges,
  };
}
