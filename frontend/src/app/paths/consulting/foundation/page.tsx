"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Search, BookOpen, ChevronRight, Sun, Moon } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import Link from "next/link"; // ← 在文件最上方加上这个
import Image from "next/image";


/** ---------- 内容数据类型 ---------- */
type PNode = { type: "p"; text: string };
type CodeNode = { type: "code"; code: string; lang?: string; filename?: string };
type ListNode = { type: "ul"; items: string[] };

/** ✅ 新增：图片节点 */
type ImgNode = {
  type: "img";
  src: string;         // 例如: "/images/system-collaboration-webit.png"
  alt: string;         // 无障碍/SEO
  caption?: string;    // 说明文字（可选）
  width?: number;      // 用 next/image 时推荐
  height?: number;     // 用 next/image 时推荐
};
/** ---------- 内容数据类型 ---------- */
type ContentNode = PNode | CodeNode | ListNode | ImgNode;

type Lesson = {
  id: string;
  title: string;
  summary?: string;
  content: ContentNode[];
  level?: "basic" | "intermediate" | "advanced";
  estMin?: number;
};

type Chapter = {
  key: string;
  title: string;
  lessons: Lesson[];
};

/** ---------- 示例课程大纲 ---------- */
const CURRICULUM: Chapter[] = [
  {
    "key": "what-is-it-consulting",
    "title": "ITコンサルとは何か",
    "lessons": [
      {
        "id": "what-it-consultants-do",
        "title": "ITコンサルとは何をしているのか",
        "summary": "企業の経営課題をITの力で解決する専門家であり、業務分析から改革提案、システム導入支援まで一貫して関わる職種です。",
        "content": [
          {
            "type": "p",
            "text": "ITコンサルタント（IT Consultant）は、企業が抱える経営課題や業務課題を、ITの導入・活用を通じて解決する専門家です。ITの知識だけでなく、ビジネス構造・業務フロー・組織課題などを理解した上で、「どのようにITで企業を変革するか」を提案する役割を担います。"
          },
          {
            "type": "p",
            "text": "ITコンサルの重要な特徴は「技術者」ではなく「経営・業務の変革パートナー」である点です。そのため、プログラミングよりも、業務要件整理、課題分析、プロジェクトの推進などが主な仕事内容となります。"
          },
          {
            "type": "p",
            "text": "多くのプロジェクトは企業の大規模な業務改革（BPR）、基幹システム刷新、デジタル戦略立案、データ活用基盤の構築などと結びついており、企業の経営層から現場担当者まで幅広いステークホルダーと連携しながら進められます。"
          },
          {
            "type": "ul",
            "items": [
              "企業の業務・組織・IT環境の課題を分析する（現状分析）",
              "経営戦略に基づいたIT戦略を立案する（ITロードマップ）",
              "新システムの構想、要件定義を実施する",
              "クラウド・AI・データ活用などの導入方針を策定する",
              "プロジェクトマネジメント（PMO）として全体進行を支援する",
              "システム導入後の運用改善や定着化を支援する"
            ]
          },
          {
            "type": "p",
            "text": "ITコンサルは、単にITを導入するのではなく、企業の業務効率化・売上向上・コスト削減などの成果を最大化することを目的とします。そのため、論理的思考力、課題解決力、コミュニケーション力が非常に重要となります。"
          }
        ]
      },
      {
        "id": "difference-from-sier",
        "title": "SIerとの違い",
        "summary": "ITコンサルは上流の課題解決・戦略立案を中心に行い、SIerはシステムの設計・開発・運用を中心に担当します。役割・視点・成果物が大きく異なります。",
        "content": [
          {
            "type": "p",
            "text": "ITコンサルとSIerはどちらも企業のIT導入に関わる職種ですが、担当する領域や役割は大きく異なります。ITコンサルは「何を実現するべきか」「ビジネスをどう変革するか」を考える役割であり、SIerは「どのようにシステムとして実装するか」を担います。"
          },
          {
            "type": "p",
            "text": "ITコンサルは、経営課題の整理、業務フローの再設計（BPR）、IT戦略立案、システム構想策定など、上流の企画・設計フェーズに深く関わります。一方、SIerは要件定義以降の設計・開発・テスト・運用保守を中心とした工程に携わり、具体的なシステムを構築する立場です。"
          },
          {
            "type": "ul",
            "items": [
              "ITコンサル：企業の経営課題・業務課題の分析から解決策の提案を担当",
              "SIer：決定された要件に基づき、システムの設計・開発・運用を担当"
            ]
          },
          {
            "type": "p",
            "text": "また、クライアントとの関わり方も異なります。ITコンサルは経営層・部門長など意思決定者と協議し、改革方針や投資判断に影響を与える役割が大きいです。SIerはプロジェクト実行段階で実務的な調整を行い、システムが仕様通りに動くよう確実に構築することに責任を持ちます。"
          },
          {
            "type": "ul",
            "items": [
              "視点の違い：ITコンサル＝ビジネス視点、SIer＝システム視点",
              "成果物の違い：ITコンサル＝提案書・業務設計書、SIer＝システムそのもの",
              "関わる工程：ITコンサル＝構想・企画、SIer＝設計・開発・運用"
            ]
          },
          {
            "type": "p",
            "text": "このように、ITコンサルとSIerは互いに補完的な関係にあり、役割を分担しながら企業のITプロジェクトを推進しています。"
          }
        ]
      }
      
    ]
  },

  
  
  
  
  
  
  
  
  
  
  
  
  
];


/** ---------- 难度徽章样式 ---------- */
const levelBadge: Record<NonNullable<Lesson["level"]>, string> = {
  basic: "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 dark:text-emerald-300",
  intermediate: "bg-sky-500/20 text-sky-600 border border-sky-500/30 dark:text-sky-300",
  advanced: "bg-violet-500/20 text-violet-600 border border-violet-500/30 dark:text-violet-300",
};

/** ---------- 滚动联动 ---------- */
function useScrollSpy(ids: string[], offset = 120) {
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {
    const handler = () => {
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= offset) current = id;
        else break;
      }
      setActiveId(current ?? ids[0] ?? null);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [ids, offset]);
  return activeId;
}

/** ---------- 页面组件 ---------- */
export default function TsBasicsPage() {
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // 切换主题
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // 搜索过滤
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CURRICULUM;
    return CURRICULUM.map((c) => ({
      ...c,
      lessons: c.lessons.filter(
        (lsn) =>
          lsn.title.toLowerCase().includes(q) ||
          (lsn.summary ?? "").toLowerCase().includes(q) ||
          lsn.content.some((node) => {
            if (node.type === "p") return node.text.toLowerCase().includes(q);
            if (node.type === "code")
              return node.code.toLowerCase().includes(q) || (node.filename ?? "").toLowerCase().includes(q);
            if (node.type === "ul") return node.items.some((t) => t.toLowerCase().includes(q));
            return false;
          })
      ),
    })).filter((c) => c.lessons.length > 0);
  }, [query]);

  // ScrollSpy
  const allIds = useMemo(() => filtered.flatMap((c) => c.lessons.map((l) => l.id)), [filtered]);
  const activeId = useScrollSpy(allIds);

  return (
    <div className={`${theme === "dark" ? "bg-neutral-950 text-neutral-100" : "bg-white text-neutral-900"} min-h-screen transition-colors`}>
      {/* 顶部条 */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur ${
          theme === "dark"
            ? "border-white/10 bg-neutral-950/70"
            : "border-neutral-200 bg-white/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* ✅ 新增：返回首页按钮 */}
          <Link
            href="/"
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-sm transition ${
              theme === "dark"
                ? "border-white/20 hover:bg-white/10 text-white"
                : "border-neutral-300 hover:bg-neutral-100 text-neutral-800"
            }`}
          >
            <ChevronRight className="w-4 h-4 -rotate-180" />
            <span>トップページ</span>
          </Link>

          <BookOpen className="w-5 h-5 opacity-80 ml-2" />
          <h1 className="text-lg font-semibold tracking-wide">
            日本ITコンサル業界の現状
          </h1>

          <button
            onClick={toggleTheme}
            className={`ml-auto flex items-center gap-1 px-2 py-1 rounded-lg border transition ${
              theme === "dark"
                ? "border-white/20 hover:bg-white/10"
                : "border-neutral-300 hover:bg-neutral-100"
            }`}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="text-sm">{theme === "dark" ? "昼" : "夜"}</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">
        {/* ✅ 左侧目录：aside 自身 sticky + overflow，独立滚动 */}
        <aside
          className={`
            col-span-12 lg:col-span-4 xl:col-span-3
            sticky top-[72px]
            max-h-[calc(100vh-72px)]
            overflow-y-auto overscroll-contain
            pr-2 pb-10
          `}
        >
          <label
            className={`flex items-center gap-2 rounded-xl px-3 py-2 border mb-3 ${
              theme === "dark"
                ? "bg-white/5 border-white/10 focus-within:border-white/20"
                : "bg-neutral-100 border-neutral-300 focus-within:border-neutral-400"
            }`}
          >
            <Search className="w-4 h-4 opacity-70" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="キーワードを検索…"
              className={`bg-transparent outline-none w-full text-sm ${
                theme === "dark" ? "placeholder:text-neutral-400" : "placeholder:text-neutral-500"
              }`}
            />
          </label>

          <nav className="space-y-5">
            {filtered.map((chapter) => (
              <div key={chapter.key} className="space-y-2">
                <div
                  className={`text-xs uppercase tracking-wider ${
                    theme === "dark" ? "text-neutral-400" : "text-neutral-500"
                  }`}
                >
                  {chapter.title}
                </div>
                <ul className="space-y-1">
                  {chapter.lessons.map((l) => (
                    <li key={l.id}>
                      <a
                        href={`#${l.id}`}
                        className={`group flex items-center gap-2 rounded-lg px-3 py-2 border text-sm transition-all ${
                          activeId === l.id
                            ? theme === "dark"
                              ? "border-white/30 bg-white/10"
                              : "border-neutral-400 bg-neutral-100"
                            : theme === "dark"
                            ? "border-white/10 hover:border-white/20 hover:bg-white/5"
                            : "border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50"
                        }`}
                      >
                        <ChevronRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                        <span className="flex-1">{l.title}</span>
                        {l.level && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${levelBadge[l.level]}`}>
                            {l.level}
                          </span>
                        )}
                        {typeof l.estMin === "number" && (
                          <span
                            className={`text-[10px] ${
                              theme === "dark" ? "text-neutral-300/80" : "text-neutral-500"
                            }`}
                          >
                            {l.estMin}m
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* 右侧内容 */}
        <section className="col-span-12 lg:col-span-8 xl:col-span-9">
          <article className="space-y-10">
            {filtered.map((chapter) => (
              <div key={chapter.key} className="space-y-8">
                {chapter.lessons.map((l) => (
                  <section key={l.id} id={l.id} className="scroll-mt-24">
                    <header className="mb-3">
                      <h2 className="text-2xl font-semibold">{l.title}</h2>
                      {l.summary && (
                        <p
                          className={`mt-1 ${
                            theme === "dark" ? "text-neutral-300" : "text-neutral-600"
                          }`}
                        >
                          {l.summary}
                        </p>
                      )}
                    </header>

                    <div className="prose max-w-none space-y-4">
                      {l.content.map((node, idx) => {
                        if (node.type === "p") {
                          return <p key={idx}>{node.text}</p>;
                        }

                        if (node.type === "ul") {
                          return (
                            <ul key={idx} className="list-disc pl-5 space-y-1">
                              {node.items.map((it, i) => (
                                <li key={i}>{it}</li>
                              ))}
                            </ul>
                          );
                        }

                        if (node.type === "code") {
                          return (
                            <CodeBlock
                              key={idx}
                              code={node.code}
                              lang={node.lang}
                              filename={node.filename}
                              appearance={theme}  // 跟随主题
                            />
                          );
                        }

                        // ✅ 新增：图片节点渲染（用 next/image）
                        if (node.type === "img") {
                          const width = node.width ?? 1200;
                          const height = node.height ?? 800;
                          return (
                            <figure key={idx} className="my-6">
                              <Image
                                src={node.src}
                                alt={node.alt}
                                width={width}
                                height={height}
                                className="rounded-md border border-neutral-200"
                                priority={false}
                              />
                              {node.caption && (
                                <figcaption className="mt-2 text-sm text-neutral-600">
                                  {node.caption}
                                </figcaption>
                              )}
                            </figure>
                          );
                        }

                        return null;
                      })}
                    </div>

                  </section>
                ))}
              </div>
            ))}
          </article>
        </section>
      </main>
    </div>
  );
}