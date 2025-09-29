'use client';

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
  Handle,
  NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";

/** ---------- Data model ---------- */
type Step = {
  id: string;
  label: string;
  href?: string;
  summary?: string;     // ← 在这里填“说明文字”
};

type Track = {
  key: "web" | "sier" | "consulting";
  title: string;
  color: string;
  steps: Step[];
};

const tracks: Track[] = [
  {
    key: "web",
    title: "Web系IT",
    color: "sky-500",
    steps: [
      {
        id: "web-1",
        label: "日本Web系IT業界の現状",
        href: "/paths/web/ts-basics",
        summary: "既存職種、選考フロー、代表企業、選考準備等の紹介",
      },
      {
        id: "web-2",
        label: "プログラミング言語学習（Typescript）",
        href: "/paths/web/react-next",
        summary: "特徴、文、値、変数、関数、非同期処理、モジュール",
      },
      { id: "web-3", label: "プログラミング言語学習（Python）", href: "/paths/web/api-auth", summary: "文、データ構造、クラス" },
      { id: "web-4", label: "開発ツールと流れの紹介", href: "/paths/web/deploy", summary: "アジャイル開発、Vs Code" },
      { id: "web-5", label: "開発フレームワークの紹介", href: "/paths/web/deploy", summary: "Next.js、React、FastApi" },
      // …可以继续添加更多步骤
    ],
  },
  {
    key: "sier",
    title: "SIer企業",
    color: "amber-500",
    steps: [
      { id: "sier-1", label: "日本SIer業界の現状", href: "/paths/sier/fundamentals", summary: "既存職種、選考フロー、代表企業、選考準備等の紹介" },
      { id: "sier-2", label: "Java/DB/設計", href: "/paths/sier/java-db", summary: "RDB/ER図/ORM/レイヤード設計" },
      { id: "sier-3", label: "テスト/品質管理", href: "/paths/sier/qa", summary: "単体〜結合, コードレビュー, 品質指標" },
      { id: "sier-4", label: "運用保守/ITIL", href: "/paths/sier/ops", summary: "監視, 変更管理, 障害対応" },
    ],
  },
  {
    key: "consulting",
    title: "ITコンサル",
    color: "violet-500",
    steps: [
      { id: "con-1", label: "日本ITコンサル業界の現状", href: "/paths/consulting/foundation", summary: "既存職種、選考フロー、代表企業、選考準備等の紹介" },
      { id: "con-2", label: "要件×業務理解", href: "/paths/consulting/domain", summary: "業務フロー, As-Is→To-Be, ユースケース" },
      { id: "con-3", label: "設計/PoC", href: "/paths/consulting/poc", summary: "仕様書, プロトタイピング, 成功基準" },
      { id: "con-4", label: "提案/PM", href: "/paths/consulting/pm", summary: "WBS, 見積, 合意形成, リスク管理" },
    ],
  },
];

// 跨泳道的额外连线（可选）
type ExtraEdge = { source: string; target: string; animated?: boolean };
const extraEdges: ExtraEdge[] = [
  // { source: "web-2", target: "con-3" },
];

/** ---------- Layout constants ---------- */
const LANE_HEIGHT = 220;
const NODE_W = 280;
const GAP_X = 120;
const START_X = 80;
const START_Y = 80;

/** ---------- Custom Node: StepNode（显示标题+说明） ---------- */
function StepNode({ data }: NodeProps<{ label: string; summary?: string; href?: string; color?: string }>) {
  return (
    <div className="rounded-2xl border bg-white/90 dark:bg-zinc-900/90 dark:border-zinc-700 shadow-sm p-3 md:p-4 max-w-[320px]">
      {/* 左侧彩色竖条（按路线着色） */}
      <div className={`absolute -left-1 top-2 h-6 w-1 rounded bg-${data.color || "sky-500"}`}></div>
      <div className="text-[15px] md:text-base font-semibold leading-tight">{data.label}</div>
      {data.summary && (
        <div className="mt-1 text-xs md:text-sm opacity-70 leading-snug">{data.summary}</div>
      )}
      {/* 连接柄 */}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

const nodeTypes = { step: StepNode } as const;

/** ---------- Build nodes & edges ---------- */
function toNodesAndEdges(allTracks: Track[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  allTracks.forEach((track, laneIdx) => {
    const y = START_Y + laneIdx * LANE_HEIGHT;

    // lane label
    nodes.push({
      id: `${track.key}-lane-label`,
      position: { x: START_X - 60, y: y - 40 },
      data: { label: track.title },
      style: {
        width: 120, height: 28,
        border: "1px solid var(--color-border)",
        borderRadius: 14, padding: 6, fontWeight: 600,
        background: "var(--color-lane-bg)",
      },
      draggable: false, selectable: false,
    });

    track.steps.forEach((step, i) => {
      const x = START_X + i * (NODE_W + GAP_X);
      nodes.push({
        id: step.id,
        type: "step",
        position: { x, y },
        data: { label: step.label, summary: step.summary, href: step.href, color: track.color },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });

      // 同一条路线内部的顺序箭头
      const next = track.steps[i + 1];
      if (next) {
        edges.push({
          id: `${step.id}->${next.id}`,
          source: step.id,
          target: next.id,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
          animated: false,
          style: { strokeWidth: 2 },
        });
      }
    });
  });

  // 跨泳道连线
  extraEdges.forEach((e, i) => {
    edges.push({
      id: `x-${i}-${e.source}->${e.target}`,
      source: e.source,
      target: e.target,
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
      animated: !!e.animated,
      style: { strokeWidth: 2 },
    });
  });

  return { nodes, edges };
}

/** ---------- Component ---------- */
export default function LearningPathsGraph() {
  const router = useRouter();
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => toNodesAndEdges(tracks), []);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const href = (node.data as any)?.href;
    if (href) router.push(href);
  }, [router]);

  const fitViewOptions = { padding: 0.2, minZoom: 0.2, maxZoom: 1.75 } as const;

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
        nodeTypes={nodeTypes}                  // ← 注册自定义节点
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
