'use client';

import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
  Handle,
} from "reactflow";
import type {
  Node as RFNode,
  Edge as RFEdge,
  NodeProps as RFNodeProps,
} from "reactflow";
import "reactflow/dist/style.css";

/** ---------- Data model ---------- */
type Step = {
  id: string;
  label: string;
  href?: string;
  summary?: string;
  // 可选：分支定位
  col?: number;   // 覆盖水平列（从 0 开始；不填则用 i）
  row?: number;   // 垂直偏移行：0=本行，-1=上面，+1=下面
  chain?: boolean;// 是否参与默认左右相邻连线
};

type Track = {
  key: "web" | "sier" | "consulting";
  title: string;
  color: string;
  steps: Step[];
};

const ACCENTS: Record<Track["key"], string> = {
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
        href: "/paths/web/Webit-basics",
        summary: "既存職種、選考フロー、代表企業、選考準備等の紹介",
      },
      {
        id: "web-2",
        label: "プログラミング言語学習（Typescript）",
        href: "/paths/web/tsbasics",
        summary: "特徴、文、値、変数、関数、非同期処理、モジュール",
      },
      { id: "web-3", label: "プログラミング言語学習（Python）", href: "/paths/web/py-basics", summary: "文、データ構造、クラス" },
      { id: "web-4", label: "開発フローとツールの紹介", href: "/paths/web/deploy-flow", summary: "アジャイル開発、ウォーターフォール開発、VsCode、Github等" },
      { id: "web-5", label: "開発フレームワークの紹介", href: "/paths/web/deploy-framework", summary: "Next.js、React、FastApi" },
      { id: "web-6", label: "分離式のフルスタック開発実践", href: "/paths/web/fullstack-development", summary: "バックエンドおよびデータベースの開発実践" },
      { id: "web-7", label: "分離式のフルスタック開発実践", href: "/paths/web/fullstack-development-2", summary: "フロントエンドの開発実践" },
      // 分支补讲：与 web-2 同列，位于上一行，不参与默认横向连线
      {
        id: "web-2a",
        label: "模擬面接：Typescript",
        href: "/paths/web/ts-problems",
        summary: "専門的な技術面接でTSの学習結果を確認",
        col: 1,
        row: -1,
        chain: false,
      },
      {
        id: "web-3a",
        label: "模擬面接：Python",
        href: "/paths/web/py-problems",
        summary: "専門的な技術面接でPyの学習結果を確認",
        col: 2,
        row: -1,
        chain: false,
      },
      {
        id: "web-3b",
        label: "資格取得：python3 エンジニア認定基礎試験",
        href: "/paths/web/py-certificates",
        summary: "オフラインの資格試験",
        col: 2,
        row: 0.9,
        chain: false,
      },
      {
        id: "web-3c",
        label: "Pythonコーディング環境：Jupyternotebook",
        href: "/paths/web/py-jupyternotebook",
        summary: "オフラインの資格試験",
        col: 2,
        row: -2,
        chain: false,
      },
      {
        id: "web-3d",
        label: "Pythonコーディング問題演習",
        href: "/paths/web/py-coding-problems",
        summary: "jupyternotebookによりパイソン問題を解く",
        col: 1,
        row: -2,
        chain: false,
      },
      {
        id: "web-4b",
        label: "VsCodeの使用ガイダンス",
        href: "/paths/web/vs-code-guidance",
        summary: "VsCodeを使って開発する基本的な手法を習得する",
        col: 3,
        row: -1,
        chain: false,
      },
      {
        id: "web-4c",
        label: "Githubの使用ガイダンス",
        href: "/paths/web/github-guidance",
        summary: "Githubを使ってソースコードを管理する基本的な手法を習得する",
        col: 3,
        row: -2,
        chain: false,
      },
      {
        id: "web-4d",
        label: "AWSの使用ガイダンス",
        href: "/paths/web/aws-guidance",
        summary: "AWSを使ってクラウド開発環境を構築する",
        col: 4,
        row: -2,
        chain: false,
      },
      {
        id: "web-4e",
        label: "ターミナルの使用ガイダンス",
        href: "/paths/web/terminal-guidance",
        summary: "ターミナルを使ってパソコンを操作する方法を習得する",
        col: 3,
        row: 0.9,
        chain: false,
      },
      {
        id: "web-5a",
        label: "Fastapiの学習",
        href: "/paths/web/fastapi",
        summary: "Fastapiの特徴と基本操作を学習する",
        col: 4,
        row: -1,
        chain: false,
      },
      {
        id: "web-5b",
        label: "Reactの学習",
        href: "/paths/web/react-guidance",
        summary: "Reactというフロントエンドフレームワークを学習する",
        col: 4,
        row: 0.9,
        chain: false,
      },
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
      { id: "sier-4a", label: "運用保守/ITIL", href: "/paths/sier/ops", summary: "監視, 変更管理, 障害対応",col: 1,
        row: 0.75,
        chain: false, },
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

/** 额外连线（跨泳道 / 竖直分支等） */
type Side =
  | "left" | "right" | "top" | "bottom"| "left-in" | "right-out"
  | "top-in" | "top-out" | "bottom-in" | "bottom-out"
  | "left-out" | "right-in";


type ExtraEdge = {
  source: string;
  target: string;
  animated?: boolean;
  type?: "straight" | "smoothstep" | "default" | "step" | "bezier";
  sourceHandle?: Side;
  targetHandle?: Side;
};
const extraEdges: ExtraEdge[] = [
  // 竖直分支：从 web-2 顶部 → web-2a 底部，用直线，带轻微动画
  { source: "web-2", target: "web-2a", sourceHandle: "top", targetHandle: "bottom", type: "straight", animated: true },
  // （可选）补讲后再接回主线：
  // { source: "web-2a", target: "web-3", sourceHandle: "right", targetHandle: "left", type: "smoothstep" },
  { source: "web-3", target: "web-3a", sourceHandle: "top", targetHandle: "bottom", type: "straight", animated: true },
  { source: "web-3", target: "web-3b", sourceHandle: "bottom-out", targetHandle: "top-in", type: "straight", animated: true },
  { source: "web-3b", target: "web-3c", sourceHandle: "top", targetHandle: "bottom", type: "straight", animated: true },
  {
    source: "web-3c",
    target: "web-3d",
    sourceHandle: "left-out",
    targetHandle: "right-in",
    type: "straight",
    animated: true,
  },
  {
    source: "web-4",
    target: "web-4b",
    sourceHandle: "top",
    targetHandle: "bottom",
    type: "straight",
    animated: true,
  },
  { source: "web-4b", target: "web-4c", sourceHandle: "top", targetHandle: "bottom", type: "straight", animated: true },
  { source: "web-4c", target: "web-4d", sourceHandle: "right-out", targetHandle: "left-in", type: "straight", animated: true },
  { source: "web-4", target: "web-4e", sourceHandle: "bottom-out", targetHandle: "top-in", type: "straight", animated: true },
  { source: "web-5", target: "web-5a", sourceHandle: "top", targetHandle: "bottom", type: "straight", animated: true },
  { source: "web-5", target: "web-5b", sourceHandle: "bottom-out", targetHandle: "top-in", type: "straight", animated: true },
  

];

/** ---------- Layout constants ---------- */
const LANE_HEIGHT = 300;
const ROW_HEIGHT = 160; // 同一路线内“分支行”的上下间距
const NODE_W = 280;
const GAP_X = 120;
const START_X = 80;
const START_Y = 80;

/** 泳道标题用的小牌子节点（不带连线端点） */
function LaneLabelNode({ data }: RFNodeProps<{ title: string }>) {
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

/** 自定义节点：标题 + 说明 + 四个连接点（左右/上下） */
function StepNode({ data }: RFNodeProps<{ label: string; summary?: string; href?: string; accent: string }>) {
  return (
    <div className="relative w-[280px] rounded-2xl border bg-white/90 dark:bg-zinc-900/90 dark:border-zinc-700 shadow-sm p-3 md:p-4">
      <div className={`absolute -left-1 top-2 h-6 w-1 rounded ${data.accent}`} />
      <div className="text-[15px] md:text-base font-semibold leading-tight break-words">{data.label}</div>
      {data.summary && <div className="mt-1 text-xs md:text-sm opacity-70 leading-snug break-words">{data.summary}</div>}
      {/* 主链左右 */}
      <Handle type="target" position={Position.Left} id="left-in" />
      <Handle type="source" position={Position.Right} id="right-out" />
      {/* 竖直分支上下 */}
      <Handle type="source" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Bottom} id="bottom" />
      {/* 竖直分支（双向） */}
      <Handle type="source" position={Position.Top} id="top-out" />
      <Handle type="target" position={Position.Top} id="top-in" />
      <Handle type="source" position={Position.Bottom} id="bottom-out" />
      <Handle type="target" position={Position.Bottom} id="bottom-in" />
      {/* 左右双向（新增） */}
      <Handle type="source" position={Position.Left}  id="left-out"  />
      <Handle type="target" position={Position.Right} id="right-in"  />

    </div>
  );
}

const nodeTypes = { step: StepNode, lane: LaneLabelNode } as const;

/** ---------- Build nodes & edges ---------- */
function toNodesAndEdges(allTracks: Track[]): { nodes: RFNode[]; edges: RFEdge[] } {
  const nodes: RFNode[] = [];
  const edges: RFEdge[] = [];

  allTracks.forEach((track, laneIdx) => {
    const yBase = START_Y + laneIdx * LANE_HEIGHT;

    // 泳道标题
    nodes.push({
      id: `${track.key}-lane-label`,
      type: "lane",
      position: { x: START_X - 60, y: yBase - 40 },
      data: { title: track.title },
      draggable: false,
      selectable: false,
    });

    // 步骤节点
    track.steps.forEach((step, i) => {
      const col = step.col ?? i;
      const row = step.row ?? 0;
      const x = START_X + col * (NODE_W + GAP_X);
      const y = yBase + row * ROW_HEIGHT;

      nodes.push({
        id: step.id,
        type: "step",
        position: { x, y },
        data: { label: step.label, summary: step.summary, href: step.href, accent: ACCENTS[track.key] },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });

      // 默认左右相邻连线（如有分支可通过 chain:false 关闭）
      const next = track.steps[i + 1];
      if (next && step.chain !== false && next.chain !== false) {
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

  // 额外连线（跨泳道 / 竖直分支）
  extraEdges.forEach((e, i) => {
    edges.push({
      id: `x-${i}-${e.source}->${e.target}`,
      source: e.source,
      target: e.target,
      type: e.type ?? "smoothstep",
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
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

  const onNodeClick = useCallback((_: React.MouseEvent, node: RFNode) => {
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
        nodeTypes={nodeTypes}
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

