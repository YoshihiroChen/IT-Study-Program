'use client';


import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Code2, ServerCog, Workflow } from "lucide-react";

// ---- Data model ------------------------------------------------------------

type Step = {
  id: string;
  label: string;
  href: string;
  summary?: string;
};

type Track = {
  key: "web" | "sier" | "consulting";
  title: string;
  color: string; // tailwind color class for accents
  icon: React.ReactNode;
  steps: Step[];
};

const tracks: Track[] = [
  {
    key: "web",
    title: "Web系IT",
    color: "from-sky-400 to-sky-600",
    icon: <Code2 className="h-5 w-5" aria-hidden />,
    steps: [
      { id: "web-1", label: "TypeScript基礎", href: "/paths/web/ts-basics", summary: "型・関数・モジュール" },
      { id: "web-2", label: "React/Next.js", href: "/paths/web/react-next", summary: "SPA/SSR, ルーティング" },
      { id: "web-3", label: "API & 認証", href: "/paths/web/api-auth", summary: "REST/JWT/OAuth" },
      { id: "web-4", label: "運用・デプロイ", href: "/paths/web/deploy", summary: "Docker/CI/CD" },
    ],
  },
  {
    key: "sier",
    title: "SIer企業",
    color: "from-amber-400 to-amber-600",
    icon: <ServerCog className="h-5 w-5" aria-hidden />,
    steps: [
      { id: "sier-1", label: "CS基礎/要件定義", href: "/paths/sier/fundamentals", summary: "計算機/ネットワーク" },
      { id: "sier-2", label: "Java/DB/設計", href: "/paths/sier/java-db", summary: "RDB/ER図/ORM" },
      { id: "sier-3", label: "テスト/品質管理", href: "/paths/sier/qa", summary: "単体〜結合/レビュー" },
      { id: "sier-4", label: "運用保守/ITIL", href: "/paths/sier/ops", summary: "監視/変更管理" },
    ],
  },
  {
    key: "consulting",
    title: "ITコンサル",
    color: "from-purple-400 to-purple-600",
    icon: <Workflow className="h-5 w-5" aria-hidden />,
    steps: [
      { id: "con-1", label: "基礎素養", href: "/paths/consulting/foundation", summary: "ロジック/財務/データ" },
      { id: "con-2", label: "要件×業務理解", href: "/paths/consulting/domain", summary: "業務フロー/As-Is→To-Be" },
      { id: "con-3", label: "設計/PoC", href: "/paths/consulting/poc", summary: "ユースケース/仕様書" },
      { id: "con-4", label: "提案/PM", href: "/paths/consulting/pm", summary: "WBS/見積/合意形成" },
    ],
  },
];

// ---- Components ------------------------------------------------------------

function NodeCard({ step, accent }: { step: Step; accent: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="group relative"
    >
      <Link
        href={step.href}
        className={`block rounded-2xl border bg-white/80 backdrop-blur p-4 shadow-sm transition-shadow hover:shadow-lg dark:bg-zinc-900/70 dark:border-zinc-700`}
      >
        <div className={`absolute -left-1 top-1 h-6 w-1 rounded-full bg-gradient-to-b ${accent}`} />
        <div className="flex items-start gap-2">
          <BookOpen className="h-4 w-4 mt-1 opacity-70" aria-hidden />
          <div>
            <div className="font-medium leading-tight">{step.label}</div>
            {step.summary && (
              <p className="text-xs opacity-70 mt-1">{step.summary}</p>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 text-sm opacity-70">
          <span>学習へ</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>
    </motion.div>
  );
}

function Connector({ count }: { count: number }) {
  // Horizontal connectors rendered between nodes
  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block">
      <svg className="h-full w-full" viewBox={`0 0 100 ${count * 40}`} preserveAspectRatio="none">
        {/* lines per row */}
        {Array.from({ length: count }).map((_, i) => (
          <line
            key={i}
            x1="15" x2="85"
            y1={20 + i * 40}
            y2={20 + i * 40}
            stroke="currentColor"
            className="opacity-20"
            strokeWidth={2}
            strokeDasharray="4 6"
          />
        ))}
      </svg>
    </div>
  );
}

export default function LearningPathsFlow() {
  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 md:mb-12"
        >
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
            学習ルート ナビゲーション
            <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">beta</span>
          </h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 max-w-3xl">
            日本の転職・未経験からのエンジニア転向を想定した3本の学習ルート。下のフローチャートから、
            各ステップへ進んでください。モバイルでは縦、PCでは横方向に流れるレイアウトです。
          </p>
        </motion.div>

        {/* Flowchart */}
        <div className="relative">
          <Connector count={tracks.length} />

          <div className="grid gap-8">
            {tracks.map((track) => (
              <section key={track.key} aria-labelledby={`${track.key}-title`} className="relative">
                {/* Track header */}
                <div className="mb-3 flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full bg-gradient-to-br ${track.color}`} />
                  <h2 id={`${track.key}-title`} className="text-lg md:text-xl font-semibold flex items-center gap-2">
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${track.color} text-white shadow-sm`}>
                      {track.icon}
                    </span>
                    {track.title}
                  </h2>
                </div>

                {/* Steps row */}
                <div className="relative">
                  <div className="md:flex md:flex-row md:items-stretch md:gap-4 grid grid-cols-1 gap-4">
                    {track.steps.map((step, idx) => (
                      <div key={step.id} className="relative md:flex-1">
                        {/* dotted connector between cards on desktop */}
                        {idx > 0 && (
                          <div className="hidden md:block absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-gradient-to-r from-transparent via-zinc-300/50 to-transparent" />
                        )}
                        <NodeCard step={step} accent={track.color} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Legend / Tips */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {tracks.map((t) => (
            <div key={t.key} className="rounded-2xl border bg-white/70 dark:bg-zinc-900/70 dark:border-zinc-700 p-4">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full bg-gradient-to-br ${t.color}`} />
                <div className="font-medium">{t.title} の例</div>
              </div>
              <p className="mt-2 text-sm opacity-80">
                左から右へ進みます。カードはリンクになっており、クリックすると詳細教材へ遷移します。
                ルートやステップ名は自由に差し替え可能です。
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
