/**
 * Utility to calculate the shortest distance between two stations in segments.
 */
// here I use BFS to find the shortest path in an unweighted graph represented by stations and segments.
// explaining the algorithm:
// 1. Build an adjacency list from the segments.
// 2. Use a queue to perform BFS starting from the startId. 
// 3. Keep track of visited stations to avoid cycles.
// 4. For each station, check its neighbors and add them to the queue if they haven't been visited.
// 5. If we reach the destId, return the distance. If the queue is exhausted without finding destId, return -1 (unreachable).

export function getShortestDistance(stations, segments, startId, destId) {
  if (startId === destId) return 0;

  const adj = new Map();
  segments.forEach((seg) => {
    if (!adj.has(seg.stationAId)) adj.set(seg.stationAId, []);
    if (!adj.has(seg.stationBId)) adj.set(seg.stationBId, []);
    adj.get(seg.stationAId).push(seg.stationBId);
    adj.get(seg.stationBId).push(seg.stationAId);
  });

  const queue = [[startId, 0]];
  const visited = new Set([startId]);

  while (queue.length > 0) {
    const [current, dist] = queue.shift();

    if (current === destId) return dist;

    const neighbors = adj.get(current) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, dist + 1]);
      }
    }
  }

  return -1; // Unreachable
}

/**
 * Validates the submitted route.
 * A route is valid when:
 * 1. It starts and ends at the assigned stations.
 * 2. Each segment is reachable through one of the lines.
 * 3. Line changes possible only at interchange stations.
 * 4. No segment is used more than once.
 */
export function validateRoute(route, startId, destId, lineStations, segments) {
  if (!route || route.length === 0) return false;

  // Check start and end
  if (route[0].fromId !== startId) return false;
  if (route[route.length - 1].toId !== destId) return false;

  // Check connectivity and single-use segments
  const usedSegments = new Set();
  for (let i = 0; i < route.length; i++) {
    const step = route[i];
    
    // Continuity check
    if (i > 0 && step.fromId !== route[i - 1].toId) return false;

    // Unique segment check (canonical order)
    const idA = Math.min(step.fromId, step.toId);
    const idB = Math.max(step.fromId, step.toId);
    const segKey = `${idA}-${idB}`;
    if (usedSegments.has(segKey)) return false;
    usedSegments.add(segKey);

    // Verify segment exists in DB
    const segmentExists = segments.some(
      (s) => s.stationAId === idA && s.stationBId === idB
    );
    if (!segmentExists) return false;
  }

  // Check line consistency and interchange rules
  // A simple way to check this is to ensure that for each segment,
  // there is at least one line that contains both stations consecutively.
  // And for line changes, they must happen at a station that belongs to both lines.
  
  // Build a map of station -> lines
  const stationLines = new Map();
  lineStations.forEach(ls => {
    if (!stationLines.has(ls.stationId)) stationLines.set(ls.stationId, new Set());
    stationLines.get(ls.stationId).add(ls.lineId);
  });

  // For each segment in the route, identify which lines it could belong to
  const possibleLinesPerStep = route.map(step => {
    const linesA = stationLines.get(step.fromId);
    const linesB = stationLines.get(step.toId);
    
    // A segment (A, B) belongs to a line if A and B are adjacent in that line
    const sharedLines = [...linesA].filter(lineId => {
      if (!linesB.has(lineId)) return false;
      const posA = lineStations.find(ls => ls.lineId === lineId && ls.stationId === step.fromId).position;
      const posB = lineStations.find(ls => ls.lineId === lineId && ls.stationId === step.toId).position;
      return Math.abs(posA - posB) === 1;
    });

    return new Set(sharedLines);
  });

  // Check if there's a valid sequence of lines
  // We can use a simple greedy approach or just check if possibleLinesPerStep[i] is empty
  for (let i = 0; i < possibleLinesPerStep.length; i++) {
    if (possibleLinesPerStep[i].size === 0) return false;
  }

  // Check line changes only at interchange stations
  // If we change from line L1 (used in step i-1) to line L2 (used in step i),
  // then the common station (route[i].fromId) must belong to both L1 and L2.
  // This is naturally handled by the stationLines map and the way possibleLinesPerStep is built.
  // But we must also ensure there exists a path of lines.
  
  let currentPossibleLines = possibleLinesPerStep[0];
  for (let i = 1; i < possibleLinesPerStep.length; i++) {
    const nextPossibleLines = possibleLinesPerStep[i];
    
    // Intersection of current lines and next lines
    const intersection = new Set([...currentPossibleLines].filter(x => nextPossibleLines.has(x)));
    
    if (intersection.size > 0) {
      // Continue on the same line(s)
      currentPossibleLines = intersection;
    } else {
      // Line change!
      // The interchange station is route[i].fromId.
      // We already checked that route[i].fromId belongs to both lines 
      // because we found shared lines for both segments (i-1) and (i).
      currentPossibleLines = nextPossibleLines;
    }
  }

  return true;
}
