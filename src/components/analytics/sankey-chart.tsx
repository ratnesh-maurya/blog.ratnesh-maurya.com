'use client';

import { useMemo } from 'react';

export interface FlowRow {
  source: string;
  content_type: string;
  count: number;
}

interface SankeyNode {
  id: string;
  label: string;
  total: number;
  color: string;
  x: number;
  y: number;
  height: number;
}

interface SankeyLink {
  sourceNode: SankeyNode;
  targetNode: SankeyNode;
  count: number;
  sourceY: number; // offset within source node
  targetY: number; // offset within target node
  thickness: number;
  color: string;
}

const SOURCE_COLORS: Record<string, string> = {
  linkedin:  'var(--accent-500)',
  twitter:   'var(--accent-400)',
  x:         'var(--text-primary)',
  peerlist:  'var(--accent-600)',
  reddit:    'var(--accent-300)',
  github:    'var(--accent-700)',
  google:    'var(--accent-200)',
  direct:    'var(--text-muted)',
  other:     'var(--text-muted)',
};

const CONTENT_COLORS: Record<string, string> = {
  blog:               'var(--accent-500)',
  news:               'var(--accent-400)',
  'technical-terms':  'var(--accent-600)',
  'silly-questions':  'var(--accent-300)',
  til:                'var(--accent-700)',
  cheatsheets:        'var(--accent-200)',
  about:              'var(--accent-100)',
  now:                'var(--accent-800, var(--accent-700))',
  other:              'var(--text-muted)',
};

const CONTENT_LABELS: Record<string, string> = {
  blog:               'Blog',
  news:               'News',
  'technical-terms':  'Tech Terms',
  'silly-questions':  'Silly Q',
  til:                'TIL',
  cheatsheets:        'Cheatsheets',
  about:              'About',
  now:                'Now',
  other:              'Other',
};

function getSourceColor(src: string): string {
  const key = src.toLowerCase();
  for (const [k, v] of Object.entries(SOURCE_COLORS)) {
    if (key.includes(k)) return v;
  }
  return SOURCE_COLORS.other;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const NODE_WIDTH = 18;
const NODE_GAP = 10;
const MIN_NODE_HEIGHT = 24;
const PAD_V = 16; // vertical padding top/bottom

function buildSankey(flows: FlowRow[], width: number, height: number) {
  if (flows.length === 0) return { sourceNodes: [], targetNodes: [], links: [] };

  const usableH = height - PAD_V * 2;

  // Aggregate source totals
  const sourceTotals = new Map<string, number>();
  const targetTotals = new Map<string, number>();
  for (const f of flows) {
    sourceTotals.set(f.source, (sourceTotals.get(f.source) ?? 0) + f.count);
    targetTotals.set(f.content_type, (targetTotals.get(f.content_type) ?? 0) + f.count);
  }

  const grandTotal = Array.from(sourceTotals.values()).reduce((a, b) => a + b, 0);
  if (grandTotal === 0) return { sourceNodes: [], targetNodes: [], links: [] };

  // Sort nodes by total desc
  const sortedSources = [...sourceTotals.entries()].sort((a, b) => b[1] - a[1]);
  const sortedTargets = [...targetTotals.entries()].sort((a, b) => b[1] - a[1]);

  function layoutNodes(
    entries: [string, number][],
    x: number,
    isTarget: boolean
  ): SankeyNode[] {
    const totalCount = entries.reduce((s, [, c]) => s + c, 0);
    const totalGap = NODE_GAP * (entries.length - 1);
    const availH = Math.max(usableH - totalGap, entries.length * MIN_NODE_HEIGHT);

    const nodes: SankeyNode[] = [];
    let curY = PAD_V;
    for (const [id, count] of entries) {
      const rawH = (count / totalCount) * availH;
      const nodeH = Math.max(rawH, MIN_NODE_HEIGHT);
      nodes.push({
        id,
        label: isTarget ? (CONTENT_LABELS[id] ?? capitalize(id)) : capitalize(id),
        total: count,
        color: isTarget ? (CONTENT_COLORS[id] ?? CONTENT_COLORS.other) : getSourceColor(id),
        x,
        y: curY,
        height: nodeH,
      });
      curY += nodeH + NODE_GAP;
    }
    return nodes;
  }

  const midX = width / 2;
  const leftX = 0;
  const rightX = width - NODE_WIDTH;

  const sourceNodes = layoutNodes(sortedSources, leftX, false);
  const targetNodes = layoutNodes(sortedTargets, rightX, true);

  const sourceMap = new Map(sourceNodes.map((n) => [n.id, n]));
  const targetMap = new Map(targetNodes.map((n) => [n.id, n]));

  // Track offsets for stacking ribbons within each node
  const sourceOffsets = new Map(sourceNodes.map((n) => [n.id, 0]));
  const targetOffsets = new Map(targetNodes.map((n) => [n.id, 0]));

  // Sort flows so they render cleanly (largest first)
  const sortedFlows = [...flows].sort((a, b) => b.count - a.count);

  const links: SankeyLink[] = [];
  for (const f of sortedFlows) {
    const sn = sourceMap.get(f.source);
    const tn = targetMap.get(f.content_type);
    if (!sn || !tn) continue;

    const sTotal = sourceTotals.get(f.source) ?? 1;
    const tTotal = targetTotals.get(f.content_type) ?? 1;

    const sH = (f.count / sTotal) * sn.height;
    const tH = (f.count / tTotal) * tn.height;
    const thickness = Math.max(sH, tH, 2);

    const sOff = sourceOffsets.get(f.source) ?? 0;
    const tOff = targetOffsets.get(f.content_type) ?? 0;

    links.push({
      sourceNode: sn,
      targetNode: tn,
      count: f.count,
      sourceY: sn.y + sOff,
      targetY: tn.y + tOff,
      thickness,
      color: sn.color,
    });

    sourceOffsets.set(f.source, sOff + sH);
    targetOffsets.set(f.content_type, tOff + tH);
  }

  return { sourceNodes, targetNodes, links, midX };
}

function RibbonPath({ link, midX }: { link: SankeyLink; midX: number }) {
  const x0 = link.sourceNode.x + NODE_WIDTH;
  const x1 = link.targetNode.x;
  const y0top = link.sourceY;
  const y0bot = link.sourceY + link.thickness;
  const y1top = link.targetY;
  const y1bot = link.targetY + link.thickness;

  // Cubic bezier control points at midX
  const cx = midX;

  const d = [
    `M ${x0} ${y0top}`,
    `C ${cx} ${y0top}, ${cx} ${y1top}, ${x1} ${y1top}`,
    `L ${x1} ${y1bot}`,
    `C ${cx} ${y1bot}, ${cx} ${y0bot}, ${x0} ${y0bot}`,
    'Z',
  ].join(' ');

  return (
    <path
      d={d}
      fill={link.color}
      opacity={0.35}
      className="transition-opacity duration-150 hover:opacity-70"
    >
      <title>{`${link.sourceNode.label} → ${link.targetNode.label}: ${link.count}`}</title>
    </path>
  );
}

interface Props {
  flows: FlowRow[];
  width?: number;
  height?: number;
}

export function SankeyChart({ flows, width = 600, height = 380 }: Props) {
  const { sourceNodes, targetNodes, links, midX } = useMemo(
    () => buildSankey(flows, width, height),
    [flows, width, height]
  );

  if (flows.length === 0 || sourceNodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-40" style={{ color: 'var(--text-muted)' }}>
        <p className="text-sm">No flow data for this period.</p>
      </div>
    );
  }

  const LABEL_PAD = 6;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      style={{ overflow: 'visible' }}
      aria-label="Traffic flow Sankey diagram"
    >
      {/* Ribbons */}
      {links.map((link, i) => (
        <RibbonPath key={i} link={link} midX={midX ?? width / 2} />
      ))}

      {/* Source nodes */}
      {sourceNodes.map((n) => (
        <g key={n.id}>
          <rect
            x={n.x}
            y={n.y}
            width={NODE_WIDTH}
            height={n.height}
            rx={4}
            fill={n.color}
          />
          <text
            x={n.x - LABEL_PAD}
            y={n.y + n.height / 2}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize={11}
            fontWeight={600}
            fill="var(--text-secondary)"
          >
            {n.label}
          </text>
          <text
            x={n.x - LABEL_PAD}
            y={n.y + n.height / 2 + 13}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize={10}
            fill="var(--text-muted)"
          >
            {n.total}
          </text>
        </g>
      ))}

      {/* Target nodes */}
      {targetNodes.map((n) => (
        <g key={n.id}>
          <rect
            x={n.x}
            y={n.y}
            width={NODE_WIDTH}
            height={n.height}
            rx={4}
            fill={n.color}
          />
          <text
            x={n.x + NODE_WIDTH + LABEL_PAD}
            y={n.y + n.height / 2}
            textAnchor="start"
            dominantBaseline="middle"
            fontSize={11}
            fontWeight={600}
            fill="var(--text-secondary)"
          >
            {n.label}
          </text>
          <text
            x={n.x + NODE_WIDTH + LABEL_PAD}
            y={n.y + n.height / 2 + 13}
            textAnchor="start"
            dominantBaseline="middle"
            fontSize={10}
            fill="var(--text-muted)"
          >
            {n.total}
          </text>
        </g>
      ))}
    </svg>
  );
}
