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

/** ============== 使用指南模态（中/日双语 + 语言切换） ============== */
const GUIDE_VERSION = "v1";
const LS_KEY = `lp_guide_seen_${GUIDE_VERSION}`;
const LS_LANG_KEY = "lp_guide_lang"; // zh | ja

function GuideModal({
  open,
  onClose,
  onNeverShow,
}: {
  open: boolean;
  onClose: () => void;
  onNeverShow: () => void;
}) {
  const [lang, setLang] = React.useState<"zh" | "ja">("zh");

  // 初始化语言（从 localStorage 读取）
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_LANG_KEY) as "zh" | "ja" | null;
      if (saved === "zh" || saved === "ja") setLang(saved);
    } catch {}
  }, []);

  const toggleLang = React.useCallback(() => {
    setLang((prev) => {
      const next = prev === "zh" ? "ja" : "zh";
      try {
        localStorage.setItem(LS_LANG_KEY, next);
      } catch {}
      return next;
    });
  }, []);

  if (!open) return null;

  // —— 文案：中文 & 日文 ——
  const text = {
    zh: {
      title: "使用指南",
      lines: [
        "本网站根据日本就职的特点，区分了三条不同的就职路线。",
      ],
      bullets: [
        ["蓝色路线：Web系IT企业（拥有自己的互联网产品）开发岗", "bg-sky-500"],
        ["橙色路线：SIer企业（为甲方客户开发软件）SE岗", "bg-amber-500"],
        ["紫色路线：IT咨询（为甲方客户提供IT改革的方案，并协助软件开发）咨询岗", "bg-violet-500"],
      ] as [string, string][],
      para2:
        "以上三条就职路线虽然都属于IT领域，但由于工作内容大不相同，且企业的选考内容也大不相同，因此需要采取完全不同的准备策略。",
      para3:
        "Web系IT企业（例如美国的 Google、Amazon，中国的 Tencent、Bytedance，日本的 Mercari、リクルート）要求学生有极强的技术力，在选考中也会有 coding 的笔试与技术性面试，因此该路线的准备内容大多为学习技术以及积攒项目经验。",
      para4:
        "SIer 企业以及 IT 咨询企业不要求学生拥有项目经验或者是技术力，但要求学生对其业界有着极强的志望动机以及语言能力。在选考中主要围绕学生个人的性格、过往的经历、语言沟通能力以及对业界的了解程度进行考察，因此这两条路线的学习重点在于凸显自己的志望度，并且提高自己的语言能力。",
      para5:
        "各位同学可以根据自己的就职方向来选择相应的路线进行学习。",
      btnClose: "知道了（本次不再提示）",
      btnNever: "下次不再显示",
      btnToggle: "日本語に切り替え",
    },
    ja: {
      title: "ご利用ガイド",
      lines: [
        "本サイトは日本の就職事情に合わせて、3つの就職ルートに分けて学べる構成になっています。",
      ],
      bullets: [
        ["青ルート：Web系IT（自社のインターネット製品を持つ企業）開発職", "bg-sky-500"],
        ["橙ルート：SIer（クライアントのためにソフトウェアを受託開発）SE職", "bg-amber-500"],
        ["紫ルート：ITコンサル（IT改革の提案を行い、開発を支援）コンサルタント職", "bg-violet-500"],
      ] as [string, string][],
      para2:
        "いずれもIT領域ですが、日々の業務内容や選考内容が大きく異なるため、準備戦略はまったく別物になります。",
      para3:
        "Web系IT（例：Google、Amazon、Tencent、Bytedance、メルカリ、リクルート）は高い技術力を重視し、選考ではコーディング筆記や技術面接が行われます。そのため学習の中心は技術力の習得とプロジェクト経験の蓄積です。",
      para4:
        "一方、SIer と ITコンサルはプロジェクト経験や高度な技術力を必須とはせず、業界への強い志望動機と言語運用能力を重視します。選考では、人物面・過去の経験・コミュニケーション・業界理解が主に評価されるため、学習の焦点は志望度の訴求と言語力の向上になります。",
      para5:
        "自身の志向に合わせて相応しいルートを選び、学習を進めてください。",
      btnClose: "了解（今回は閉じる）",
      btnNever: "次回から表示しない",
      btnToggle: "切换到中文",
    },
  }[lang];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-title"
      className="fixed inset-0 z-[100] flex items-center justify-center"
    >
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 弹窗卡片 */}
      <div className="relative mx-4 max-w-3xl w-full rounded-2xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 shadow-xl p-6">
        {/* 标题 + 语言切换 */}
        <div className="flex items-start justify-between gap-4">
          <h2 id="guide-title" className="text-xl font-semibold">
            {text.title}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="rounded-lg border bg-white/90 dark:bg-zinc-900/90 dark:border-zinc-700 px-3 py-1.5 text-xs md:text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
              title="切换语言 / 言語切替"
            >
              {text.btnToggle}
            </button>
            <button
              aria-label="close"
              onClick={onClose}
              className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="关闭 / 閉じる"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 正文 */}
        <p className="mt-2 text-sm opacity-80">{text.lines[0]}</p>

        <ul className="mt-3 list-disc pl-5 space-y-1 text-sm">
          {text.bullets.map(([label, color]) => (
            <li key={label} className="flex items-start">
              <span className={`mt-1 inline-block w-2.5 h-2.5 rounded-full ${color} mr-2 flex-shrink-0`} />
              <span className="align-middle">{label}</span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-sm opacity-80">{text.para2}</p>
        <p className="mt-3 text-sm opacity-80">{text.para3}</p>
        <p className="mt-3 text-sm opacity-80">{text.para4}</p>
        <p className="mt-3 text-sm font-medium">{text.para5}</p>

        {/* 底部按钮 */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 justify-end">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            {text.btnClose}
          </button>
          <button
            onClick={onNeverShow}
            className="inline-flex items-center justify-center rounded-lg bg-zinc-900 text-white px-4 py-2 text-sm dark:bg-white dark:text-zinc-900"
          >
            {text.btnNever}
          </button>
        </div>
      </div>
    </div>
  );
}

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
  key: "web" | "sier" | "consulting"| "others";
  title: string;
  color: string;
  steps: Step[];
};

const ACCENTS: Record<Track["key"], string> = {
  web: "bg-sky-500",
  sier: "bg-amber-500",
  consulting: "bg-violet-500",
  others: "bg-slate-400",
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
      {
        id: "web-6a",
        label: "スクラム開発法の学習",
        href: "/paths/web/scrum-basics",
        summary: "スクラム開発の方法について学習する",
        col: 5,
        row: -1,
        chain: false,
      },
      {
        id: "web-6b",
        label: "チーム開発の実践",
        href: "/paths/web/team-development",
        summary: "チーム開発の注意点と進め方を学ぶ",
        col: 5,
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
      { id: "sier-2", label: "System Engineerの紹介", href: "/paths/sier/system-engineer", summary: "SEの仕事内容、選考準備" },
      { id: "sier-3", label: "ITパスポートの問題集", href: "/paths/sier/it-passport", summary: "ITパスポートの練習をする" },
      { id: "sier-4", label: "基本情報技術者の問題集", href: "/paths/sier/basic-information", summary: "基本情報技術者試験の練習をする" },
      { id: "sier-5", label: "プログラミング言語学習（Java）", href: "/paths/sier/java-basics", summary: "Javaの基礎的な知識を学ぶ" },
      { id: "sier-6", label: "業務システムの開発実践", href: "/paths/sier/work-system", summary: "仮想的な業務環境で、システムの開発を行う" },
      { id: "sier-4a", label: "応用情報技術者の問題集", href: "/paths/sier/appli-information", summary: "応用情報技術者試験の練習をする",col: 3,
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
      { id: "con-2", label: "ケーススタディの学習", href: "/paths/consulting/case-study", summary: "コンサルティング業界でのケース分析法を学ぶ" },
      { id: "con-3", label: "ITコンサルの企業分析法", href: "/paths/consulting/company-analysis", summary: "コンサルティング業界での企業分析例" },
      { id: "con-4", label: "AIコンサルの学習", href: "/paths/consulting/advance-it", summary: "IT技術が各業界での応用を学習する" },
      { id: "con-5", label: "資格取得：プロジェクトマネージャ", href: "/paths/consulting/project-manager", summary: "国家試験「プロジェクトマネージャ」に合格する" },
      {
        id: "con-2a",
        label: "ITコンサルのケーススタディ集",
        href: "/paths/consulting/case-study-set",
        summary: "まとめたITコンサルのケーススタディ集",
        col: 1,
        row: 0.9,
        chain: false,
      },
      {
        id: "con-3a",
        label: "ITコンサルの企業分析集",
        href: "/paths/web/company-analysis-set",
        summary: "まとめた有名企業の分析集",
        col: 2,
        row: 0.9,
        chain: false,
      },
    ],
  },
  {
    key: "others",
    title: "その他",
    color: "slate-500",
    steps: [
      { id: "oth-1", label: "データベースの学習", href: "/paths/others/database", summary: "開発におけるデータベースの学習" },
      { id: "oth-2", label: "SQLの学習", href: "/paths/others/sql", summary: "データベースを操作するSQL言語を学習する" },
      { id: "oth-3", label: "アルゴリズムの学習", href: "/paths/others/company-analysis", summary: "Javaにおけるアルゴリズムを学習する" },
      { id: "oth-4", label: "インフラの学習", href: "/paths/others/infra", summary: "インフラエンジニアに関する知識を学習する" },
      { id: "oth-5", label: "資格取得：プロジェクトマネージャ", href: "/paths/others/project-manager", summary: "国家試験「プロジェクトマネージャ」に合格する" },
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
  { source: "web-6", target: "web-6a", sourceHandle: "top", targetHandle: "bottom", type: "straight", animated: true },
  { source: "web-6", target: "web-6b", sourceHandle: "bottom-out", targetHandle: "top-in", type: "straight", animated: true },
  { source: "sier-4", target: "sier-4a", sourceHandle: "bottom-out", targetHandle: "top-in", type: "straight", animated: true },
  { source: "con-3", target: "con-3a", sourceHandle: "bottom-out", targetHandle: "top-in", type: "straight", animated: true },
  { source: "con-2", target: "con-2a", sourceHandle: "bottom-out", targetHandle: "top-in", type: "straight", animated: true },
  

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

  /** ============== 使用指南显示控制（新增） ============== */
  const [showGuide, setShowGuide] = React.useState(false);

  React.useEffect(() => {
    try {
      const seen = localStorage.getItem(LS_KEY);
      if (!seen) setShowGuide(true);
    } catch {
      // 隐私模式禁用 localStorage 时忽略
    }
  }, []);

  const handleGuideCloseOnce = React.useCallback(() => {
    // 本次会话内关闭（不写入持久标记）
    setShowGuide(false);
  }, []);

  const handleGuideNeverShow = React.useCallback(() => {
    try {
      localStorage.setItem(LS_KEY, "1");
    } catch {}
    setShowGuide(false);
  }, []);


  return (
    <div className="h-[calc(100vh-4rem)] w-full bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 rounded-xl overflow-hidden">
      {themeVars}

      {/* （新增）一次性使用指南模态 */}
      <GuideModal
        open={showGuide}
        onClose={handleGuideCloseOnce}
        onNeverShow={handleGuideNeverShow}
      />

      {/* （新增）右上角“使用指南”按钮，用户可随时再看 */}
      <div className="absolute right-4 top-4 z-[60]">
        <button
          onClick={() => setShowGuide(true)}
          className="rounded-full border bg-white/90 dark:bg-zinc-900/90 dark:border-zinc-700 px-3 py-1.5 text-xs md:text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
          title="使用指南"
        >
          ヘルプ
        </button>
      </div>

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

