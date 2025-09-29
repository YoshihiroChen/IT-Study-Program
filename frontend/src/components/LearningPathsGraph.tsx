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
  summary?: string;

  // ↓ 可选：分支定位
  col?: number;     // 覆盖水平“列”（从 0 开始；不填则用 steps 的索引）
  row?: number;     // 垂直偏移行：0=本行，-1=上面一行，+1=下面一行
  chain?: boolean;  // 参与默认左右相邻连线；分支节点设为 false
};


type Track = {
  key: "web" | "sier" | "consulting";
  title: string;
  color: string;
  steps: Step[];
};

const ACCENTS: Record<Track['key'], string> = {
  web: "bg-sky-500",
  sier: "bg-amber-500",
  consulting: "bg-violet-500",
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
      {
        id: "web-2a",
        label: "補講：フロント環境 & ES Modules",
        href: "/paths/web/ts-bootcamp",
        summary: "Node.js/npm, bundler 入門, 開発環境の整え方",
        col: 1,     // ← 和 web-2 同一“列”（web-1 是 0，web-2 是 1）
        row: -1,    // ← 放在该路线的上一行（可改为 +1 放在下方）
        chain: false, // ← 不参与默认左右相邻连线（只走我们手动加的分支线）
      }
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
  { source: "web-2",  target: "web-2a", animated: true }, // 从 TS 主节点分支到补讲卡片

];

/** ---------- Layout constants ---------- */
const LANE_HEIGHT = 220;
const ROW_HEIGHT = 160; // 同一路线内“分支行”的上下间距

const NODE_W = 280;
const GAP_X = 120;
const START_X = 80;
const START_Y = 80;


import { /* ... */ NodeProps } from "reactflow";

/** 泳道标题用的小牌子节点（不带连线端点） */
function LaneLabelNode({ data }: NodeProps<{ title: string }>) {
  return (
    <div
      className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold"
      style={{
        background: "var(--color-lane-bg)",
        borderColor: "var(--color-border)",
      }}
    >
      {data.title}
    </div>
  );
}


/** ---------- Custom Node: StepNode（显示标题+说明） ---------- */
function StepNode({
  data,
}: NodeProps<{ label: string; summary?: string; href?: string; accent: string }>) {
  return (
    <div className="relative w-[280px] rounded-2xl border bg-white/90 dark:bg-zinc-900/90 dark:border-zinc-700 shadow-sm p-3 md:p-4">
      {/* 左侧彩色竖条（使用固定类名而不是动态模板） */}
      <div className={`absolute -left-1 top-2 h-6 w-1 rounded ${data.accent}`} />
      <div className="text-[15px] md:text-base font-semibold leading-tight break-words">
        {data.label}
      </div>
      {data.summary && (
        <div className="mt-1 text-xs md:text-sm opacity-70 leading-snug break-words">
          {data.summary}
        </div>
      )}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}


const nodeTypes = { step: StepNode, lane: LaneLabelNode } as const;


/** ---------- Build nodes & edges ---------- */
function toNodesAndEdges(allTracks: Track[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  allTracks.forEach((track, laneIdx) => {
    const yBase = START_Y + laneIdx * LANE_HEIGHT; // ← 原来是 y
  
    // lane label...
    nodes.push({
      id: `${track.key}-lane-label`,
      type: "lane",                          // ⬅️ 使用自定义的 lane 节点
      position: { x: START_X - 60, y: yBase - 40 },
      data: { title: track.title },          // ⬅️ 用 title 字段
      draggable: false,
      selectable: false,
    });
    
  
    track.steps.forEach((step, i) => {
      const col = step.col ?? i;                 // 列：可覆盖
      const row = step.row ?? 0;                 // 行偏移：可覆盖
      const x = START_X + col * (NODE_W + GAP_X);
      const y = yBase + row * ROW_HEIGHT;        // 最终 y
  
      nodes.push({
        id: step.id,
        type: "step",
        position: { x, y },
        data: { label: step.label, summary: step.summary, href: step.href, accent: ACCENTS[track.key] },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });
  
      // 默认左右相邻的连线：任一端 chain === false 时跳过
      const next = track.steps[i + 1];
      if (next && (step.chain !== false) && (next.chain !== false)) {
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
