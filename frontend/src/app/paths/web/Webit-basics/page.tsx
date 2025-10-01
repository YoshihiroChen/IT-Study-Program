"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Search, BookOpen, ChevronRight, Sun, Moon } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import Link from "next/link"; // ← 在文件最上方加上这个

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
    key: "existing-roles",
    title: "既存職種",
    lessons: [
      {
        id: "frontend-engineer",
        title: "フロントエンドエンジニア",
        summary: "ユーザーが直接触れる部分を設計・実装し、快適な操作体験を提供する役割です。",
        content: [
          {
            type: "p",
            text: "フロントエンドエンジニアは、WebサイトやWebアプリケーションの「見える部分」を担当する職種です。HTML・CSS・JavaScriptを中心に、最近ではTypeScriptやReact、Next.jsといったモダンフレームワークを用いて、ユーザーが直接操作する画面やインターフェースを設計・実装します。",
          },
          {
            type: "p",
            text: "単に画面を作るだけでなく、UI/UXデザイナーと連携して操作性やパフォーマンスを最適化するのも重要な役割です。また、アクセシビリティ対応やレスポンシブデザイン、SEO対策など幅広い知識も求められます。",
          },
          {
            type: "ul",
            items: [
              "HTML/CSS/JavaScript/TypeScriptによるUIの構築",
              "ReactやVue.jsなどのフレームワークを用いたSPA開発",
              "デザイナーとの協働によるUX最適化",
              "パフォーマンスチューニングやアクセシビリティ対応",
            ],
          },
        ],
  
      },
      {
        id: "backend-engineer",
        title: "バックエンドエンジニア",
        summary: "アプリケーションの裏側でデータ処理やビジネスロジックを支える職種です。",
        content: [
          {
            type: "p",
            text: "バックエンドエンジニアは、ユーザーには見えないサーバーサイドで動作する処理を担当します。データベースとの連携、ビジネスロジックの実装、APIの設計などが主な業務です。言語としてはPython、Ruby、Go、Java、Node.jsなどが使われ、フレームワークやクラウドインフラの知識も必要です。",
          },
          {
            type: "p",
            text: "堅牢でスケーラブルなシステムを構築するためには、セキュリティやパフォーマンス、トランザクション管理など、フロントエンドとは異なる観点が求められます。",
          },
          {
            type: "ul",
            items: [
              "データベース設計・操作とAPI開発",
              "認証・認可などのセキュリティ機能の実装",
              "スケーラビリティとパフォーマンスを意識した設計",
              "クラウド環境やインフラとの連携",
            ],
          },
        ],
    
      },
      {
        id: "fullstack-engineer",
        title: "フルスタックエンジニア",
        summary: "フロントとバック両方をカバーし、サービス全体を横断的に開発できるエンジニアです。",
        content: [
          {
            type: "p",
            text: "フルスタックエンジニアは、UIの構築からサーバーサイドのロジック、データベース、さらにはインフラ設定まで幅広い領域を一貫して扱えるエンジニアです。小規模スタートアップやプロトタイプ開発で特に重宝されます。",
          },
          {
            type: "p",
            text: "専門分野が浅くなりがちな一方で、サービス全体の構造を理解し、チーム間の橋渡し役として重要な役割を果たすことができます。最近ではNext.jsやNestJSのようなフルスタック指向のフレームワークが登場し、活躍の場が広がっています。",
          },
          {
            type: "ul",
            items: [
              "フロントエンドとバックエンドの両方を開発",
              "データベース・インフラ構築も含めた横断的な設計",
              "サービス全体のアーキテクチャ設計への関与",
              "小規模開発・新規サービス立ち上げでの活躍",
            ],
          },
        ],
    
      },
      {
        id: "ai-engineer",
        title: "AIエンジニア",
        summary: "機械学習モデルや生成AIを活用し、知能的な機能をサービスに組み込む職種です。",
        content: [
          {
            type: "p",
            text: "AIエンジニアは、機械学習・深層学習のアルゴリズムを活用し、画像認識・自然言語処理・生成モデルなどの機能を開発します。PythonやPyTorch、TensorFlowといったライブラリが主に使われ、データ前処理からモデル学習、API化まで幅広い工程に関わります。",
          },
          {
            type: "p",
            text: "最近では生成AIや大規模言語モデル（LLM）を活用したアプリケーション開発の需要が急増しており、AIエンジニアはWebサービスの中核機能を担うことも増えています。",
          },
          {
            type: "ul",
            items: [
              "データ収集・前処理・特徴量設計",
              "機械学習・深層学習モデルの構築と評価",
              "モデルのAPI化・サービスへの統合",
              "生成AI・LLMの活用による新機能開発",
            ],
          },
        ],
    
      },
      {
        id: "algorithm-engineer",
        title: "アルゴリズムエンジニア",
        summary: "数理的な最適化や検索・推薦など、サービスの根幹を支えるアルゴリズムを設計する職種です。",
        content: [
          {
            type: "p",
            text: "アルゴリズムエンジニアは、膨大なデータを効率的に処理し、サービスの中核となるロジックを設計する専門家です。探索・推薦・最適化・グラフ計算・確率モデルなど、数学・統計・計算機科学の知識が必要になります。",
          },
          {
            type: "p",
            text: "AIエンジニアがモデル構築を主とするのに対し、アルゴリズムエンジニアは“ロジックそのもの”の効率や精度を追求します。検索エンジン、マッチングプラットフォーム、物流最適化などで特に重要です。",
          },
          {
            type: "ul",
            items: [
              "探索・推薦・最適化などのアルゴリズム設計",
              "計算量・データ構造を意識した高効率な実装",
              "機械学習モデルとの組み合わせによる性能向上",
              "理論検証と実装の両立",
            ],
          },
        ],
    
      },
      {
        id: "infra-engineer",
        title: "インフラエンジニア",
        summary: "アプリケーションが安定して動くための基盤を設計・運用する職種です。",
        content: [
          {
            type: "p",
            text: "インフラエンジニアは、アプリケーションを支えるサーバーやネットワーク、クラウド環境の設計・構築・運用を担当します。AWSやGCPなどのクラウドサービス、DockerやKubernetesなどのコンテナ技術、CI/CDパイプラインなどの知識が求められます。",
          },
          {
            type: "p",
            text: "障害対応やセキュリティ対策、スケーラビリティ確保など、表には見えない部分でサービスの安定性と信頼性を支える重要な役割です。DevOpsの考え方を取り入れて開発と運用を橋渡しするケースも増えています。",
          },
          {
            type: "ul",
            items: [
              "クラウド・サーバー・ネットワークの設計と構築",
              "セキュリティ対策と監視・運用管理",
              "インフラ自動化やIaC（Infrastructure as Code）の活用",
              "開発チームとの連携によるDevOps実践",
            ],
          },
        ],
  
      },
      {
        id: "data-scientist",
        title: "データサイエンティスト",
        summary: "データから価値を引き出し、意思決定や事業戦略に貢献する専門家です。",
        content: [
          {
            type: "p",
            text: "データサイエンティストは、膨大なデータを収集・分析し、そこからビジネス上の洞察や意思決定の根拠を導き出す職種です。統計学、機械学習、データ可視化などのスキルに加え、ビジネス課題を構造化する力が求められます。",
          },
          {
            type: "p",
            text: "AIエンジニアやアルゴリズムエンジニアが「仕組みやモデルの実装」に重点を置くのに対し、データサイエンティストは「ビジネス課題をデータで解決する」ことに主眼を置きます。分析結果を経営層に提案し、サービス改善や新規事業立案に直結させる役割も担います。",
          },
          {
            type: "ul",
            items: [
              "ビジネス課題の整理とデータ分析方針の設計",
              "統計解析・機械学習モデルを用いたデータ分析",
              "可視化・レポーティングによる意思決定支援",
              "事業戦略やサービス改善へのデータ活用提案",
            ],
          },
        ],
      },
      {
        id: "security-engineer",
        title: "セキュリティエンジニア",
        summary: "システムやデータを脅威から守り、安全なサービス運用を支える専門家です。",
        content: [
          {
            type: "p",
            text: "セキュリティエンジニアは、サイバー攻撃や不正アクセス、情報漏洩などの脅威からシステムやサービスを守る役割を担います。脆弱性診断や侵入テストを通じてリスクを洗い出し、セキュリティポリシーや対策の設計・実装を行います。",
          },
          {
            type: "p",
            text: "業務はシステム開発のあらゆる段階に関わり、設計段階でのセキュリティレビュー、運用段階での監視・検知・対応まで多岐にわたります。クラウド環境やゼロトラストなど新しい技術動向への対応力も重要です。",
          },
          {
            type: "ul",
            items: [
              "脆弱性診断・ペネトレーションテストによるリスク評価",
              "アクセス制御・暗号化などのセキュリティ設計と実装",
              "ログ監視やインシデント対応による運用フェーズでの防御",
              "最新の攻撃手法・脅威インテリジェンスの調査と対策",
            ],
          },
        ],
      }
      
    ]
  }
  
  
  
  
  
  
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
            日本Web系IT業界の現状
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
                        if (node.type === "p") return <p key={idx}>{node.text}</p>;
                        if (node.type === "ul")
                          return (
                            <ul key={idx} className="list-disc pl-5 space-y-1">
                              {node.items.map((it, i) => (
                                <li key={i}>{it}</li>
                              ))}
                            </ul>
                          );
                        if (node.type === "code")
                          return (
                            <CodeBlock
                              key={idx}
                              code={node.code}
                              lang={node.lang}
                              filename={node.filename}
                              appearance={theme}  // 跟随主题
                            />
                          );
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
