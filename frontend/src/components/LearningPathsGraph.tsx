"use client";

import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Position,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

/**
 * Interactive flowchart / knowledge-map for the three learning tracks.
 * - Zoom / pan enabled
 * - Nodes are clickable and navigate to each step's href
 * - Auto-generates nodes & edges from a data model with unlimited steps
 * - Multi-lane layout (one lane per track)
 *
 * Usage:
 *   <LearningPathsGraph />
 *
 * Data: edit the `tracks` constant below or pass in via props in the future.
 */

// --------------------- Data model ---------------------

type Step = {
  id: string; // must be unique across all tracks
  label: string;
  href?: string; // optional; when missing we won't navigate
  summary?: string;
};

type Track = {
  key: "web" | "sier" | "consulting";
  title: string;
  color: string; // Tailwind color for lane accents
  steps: Step[]; // unlimited
};

const tracks: Track[] = [
  {
    key: "web",
    title: "Web系IT",
    color: "sky-500",
    steps: [
      { id: "web-1", label: "TypeScript基礎", href: "/paths/web/ts-basics" },
      { id: "web-2", label: "React/Next.js", href: "/paths/web/react-next" },
      { id: "web-3", label: "API & 認証", href: "/paths/web/api-auth" },
      { id: "web-4", label: "運用・デプロイ", href: "/paths/web/deploy" },
      // 你可以继续添加更多步骤...
    ],
  },
  {
    key: "sier",
    title: "SIer企業",
    color: "amber-500",
    steps: [
      { id: "sier-1", label: "CS基礎/要件定義", href: "/paths/sier/fundamentals" },
      { id: "sier-2", label: "Java/DB/設計", href: "/paths/sier/java-db" },
      { id: "sier-3", label: "テスト/品質管理", href: "/paths/sier/qa" },
      { id: "sier-4", label: "運用保守/ITIL", href: "/paths/sier/ops" },
    ],
  },
  {
    key: "consulting",
    title: "ITコンサル",
    color: "violet-500",
    steps: [
      { id: "con-1", label: "基礎素養", href: "/paths/consulting/foundation" },
      { id: "con-2", label: "要件×業務理解", href: "/paths/consulting/domain" },
      { id: "con-3", label: "設計/PoC", href: "/paths/consulting/poc" },
      { id: "con-4", label: "提案/PM", href: "/paths/consulting/pm" },
    ],
  },
];

// --------------------- Helpers ---------------------

const LANE_HEIGHT = 220; // vertical distance between tracks
const NODE_W = 240;
const NODE_H = 80;
const GAP_X = 120; // horizontal gap between nodes
const START_X = 80; // left padding
const START_Y = 80; // top padding

function toNodesAndEdges(allTracks: Track[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  allTracks.forEach((track, laneIdx) => {
    const y = START_Y + laneIdx * LANE_HEIGHT;

    // Lane label node (non-interactive)
    const laneNodeId = `${track.key}-lane-label`;
    nodes.push({
      id: laneNodeId,
      position: { x: START_X - 60, y: y - 40 },
      data: { label: track.title },
      style: {
        width: 120,
        height: 28,
        border: "1px solid var(--color-border)",
        borderRadius: 14,
        padding: 6,
        fontWeight: 600,
        background: "var(--color-lane-bg)",
      },
      draggable: false,
      selectable: false,
    });

    track.steps.forEach((step, i) => {
      const x = START_X + i * (NODE_W + GAP_X);
      const id = step.id;

      nodes.push({
        id,
        position: { x, y },
        data: { label: step.label, summary: step.summary, href: step.href, color: track.color },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: {
          width: NODE_W,
          height: NODE_H,
          borderRadius: 16,
          border: "1px solid var(--color-border)",
          background: "var(--color-node-bg)",
          boxShadow: "var(--shadow)",
          padding: 8,
        },
      });

      // edge to next step
      const next = track.steps[i + 1];
      if (next) {
        edges.push({
          id: `${id}->${next.id}`,
          source: id,
          target: next.id,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
          animated: false,
          style: { strokeWidth: 2 },
        });
      }
    });
  });

  return { nodes, edges };
}

// --------------------- Component ---------------------

export default function LearningPathsGraph() {
  const router = useRouter();

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => toNodesAndEdges(tracks),
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const href = (node.data as any)?.href;
      if (href) router.push(href);
    },
    [router]
  );

  // Nice default viewport so everything fits
  const fitViewOptions = { padding: 0.2, minZoom: 0.2, maxZoom: 1.75 } as const;

  // CSS variables for light/dark themes
  const themeVars = (
    <style>{`
      :root {
        --color-border: rgba(0,0,0,0.15);
        --color-node-bg: rgba(255,255,255,0.9);
        --color-lane-bg: rgba(0,0,0,0.04);
        --shadow: 0 2px 8px rgba(0,0,0,0.06);
      }
      .dark :root, .dark {
        --color-border: rgba(255,255,255,0.16);
        --color-node-bg: rgba(24,24,27,0.9);
        --color-lane-bg: rgba(255,255,255,0.06);
        --shadow: 0 2px 10px rgba(0,0,0,0.35);
      }
    `}</style>
  );

  return (
    <div className="h-[calc(100vh-4rem)] w-full bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 rounded-xl overflow-hidden">
      {themeVars}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={fitViewOptions}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ type: "smoothstep" }}
      >
        <Background gap={20} size={1} />
        <MiniMap pannable zoomable nodeStrokeWidth={2} />
        <Controls position="bottom-right" showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
