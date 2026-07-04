import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationNodeDatum,
} from 'd3-force';

interface LayoutNode extends SimulationNodeDatum {
  id: string;
  width: number;
  height: number;
}

export const applyForceLayout = (
  nodes: LayoutNode[],
  edges: { source: string; target: string }[],
  width: number,
  height: number,
): Map<string, { x: number; y: number }> => {
  const nodeById = new Map(
    nodes.map((node) => {
      return [node.id, node];
    }),
  );

  nodes.forEach((node) => {
    node.x ??= Math.random() * width;
    node.y ??= Math.random() * height;
  });

  const links = edges
    .map((edge) => {
      return {
        source: nodeById.get(edge.source),
        target: nodeById.get(edge.target),
      };
    })
    .filter((link) => {
      return link.source && link.target;
    });

  const simulation = forceSimulation(nodes)
    .force(
      'link',
      forceLink(links)
        .id((node) => {
          return (node as LayoutNode).id;
        })
        .distance(140)
        .strength(0.6),
    )
    .force('charge', forceManyBody().strength(-420))
    .force('center', forceCenter(width / 2, height / 2))
    .force(
      'collide',
      forceCollide<LayoutNode>().radius((node) => {
        return Math.max(node.width, node.height) / 2 + 12;
      }),
    )
    .stop();

  for (let tick = 0; tick < 320; tick += 1) {
    simulation.tick();
  }

  return new Map(
    nodes.map((node) => {
      return [
        node.id,
        { x: node.x ?? width / 2, y: node.y ?? height / 2 },
      ];
    }),
  );
};
