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
    "key": "programming-language-and-framework",
    "title": "プログラミング言語と開発フレームワーク",
    "lessons": [
      {
        "id": "language-framework-app-overview",
        "title": "プログラミング言語と開発フレームワークとは",
        "summary": "フレームワークは「車輪の再発明」を防ぎ、開発を劇的に効率化する仕組みです。",
        "content": [
          {
            "type": "p",
            "text": "アプリケーション開発の世界では、「プログラミング言語」「開発フレームワーク」「アプリケーション」という3つの概念が密接に関係しています。その中でも特に重要なのが、開発フレームワークです。"
          },
          {
            "type": "p",
            "text": "開発フレームワークとは、ソフトウェア開発でよく使われる機能や構造をあらかじめ用意し、「車輪の再発明（同じ機能を一から書き直すこと）」を防ぐための仕組みです。フレームワークを使うことで、開発者は共通部分をゼロから作り直す必要がなくなり、本質的なロジックやサービス内容の開発に集中できます。"
          },
          {
            "type": "ul",
            "items": [
              "フレームワークは開発の土台となる共通機能を提供する",
              "「車輪の再発明」を防ぎ、開発スピードと品質を大幅に向上させる",
              "開発者は本質的なロジックやサービス部分に集中できる"
            ]
          }
        ]
      },
      {
        "id": "framework-examples",
        "title": "代表的なフレームワークの例",
        "summary": "どの言語にも、それを支える代表的なフレームワークが存在します。",
        "content": [
          {
            "type": "p",
            "text": "例えば、PythonにはFastAPIやDjango、RubyにはRuby on Rails、JavaScriptにはReactやNext.jsなどがあり、いずれも開発者が基本機能を一から作らなくても済むように設計されています。これらを使うことで、アプリ開発の初期構築が圧倒的に速くなり、チーム開発でも統一された構造が保たれます。"
          },
          {
            "type": "ul",
            "items": [
              "FastAPI（Python）：API開発を高速化する軽量フレームワーク",
              "Ruby on Rails（Ruby）：Webアプリの標準機能を網羅した強力なフレームワーク",
              "React / Next.js（JavaScript）：UI構築を効率化するライブラリ・フレームワーク"
            ]
          }
        ]
      },
      {
        "id": "three-layer-structure",
        "title": "言語・フレームワーク・アプリの三層構造",
        "summary": "この3つは階層的な関係で成り立っています。",
        "content": [
          {
            "type": "p",
            "text": "プログラミング言語・開発フレームワーク・アプリケーションは、それぞれ独立したものではなく、下から順に積み上げられる“階層構造”として理解すると分かりやすいです。"
          },
          {
            "type": "p",
            "text": "最下層の「プログラミング言語」はコンピュータに命令を伝える基本の言葉です。その上に「開発フレームワーク」があり、言語を効率的に使ってソフトウェアを組み立てるための骨格を提供します。そして最上層の「アプリケーション」は、それらを用いて構築され、ユーザーが実際に利用する最終形態です。"
          },
          {
            "type": "ul",
            "items": [
              "① プログラミング言語：命令を記述するための基礎",
              "② 開発フレームワーク：共通機能を提供し開発を効率化する仕組み",
              "③ アプリケーション：言語とフレームワークを用いて作られた完成品"
            ]
          }
        ]
      },
      {
        "id": "framework-pyramid-diagram",
        "title": "三層構造の図解",
        "summary": "プログラミング言語・フレームワーク・アプリケーションの関係を図で理解しましょう。",
        "content": [
          {
            "type": "p",
            "text": "これまで学んだ「プログラミング言語」「開発フレームワーク」「アプリケーション」の三者関係は、下から上へと積み重なるピラミッド構造として理解すると非常にわかりやすくなります。最下層の言語の上にフレームワークがあり、その上にアプリケーションが構築されます。"
          },
          {
            "type": "img",
            "src": "/images/web-engineer-framework.png",
            "alt": "プログラミング言語・フレームワーク・アプリケーションの三層構造を示す図"
          }
        ]
      }
      
    ]
  },
  {
    "key": "popular-frameworks",
    "title": "よく使うフレームワーク",
    "lessons": [
      {
        "id": "python-fastapi",
        "title": "Python / FastAPI",
        "summary": "軽量かつ高速なAPIサーバー開発が可能なモダンフレームワークです。",
        "content": [
          {
            "type": "p",
            "text": "FastAPIは、PythonでWeb APIやバックエンドサービスを開発する際によく使われる軽量フレームワークです。非同期処理（async/await）を標準サポートしており、非常に高速なAPIサーバーを構築できます。"
          },
          {
            "type": "p",
            "text": "型ヒント（type hints）を活用した自動ドキュメント生成機能も大きな特徴で、開発者が書いたコードからSwagger UIやOpenAPI仕様を自動生成してくれます。マイクロサービスやバックエンドAPIなど、軽量でスピード重視の開発に向いています。"
          },
          {
            "type": "ul",
            "items": [
              "非同期処理による高速なAPIレスポンス",
              "型ヒントを利用した自動ドキュメント生成",
              "少ないコードでシンプルなAPI設計が可能",
              "マイクロサービスやAPIサーバー開発に最適"
            ]
          }
        ]
      },
      {
        "id": "python-django",
        "title": "Python / Django",
        "summary": "「全部入り」のオールインワン型フレームワークで、大規模Webアプリ開発に強いです。",
        "content": [
          {
            "type": "p",
            "text": "Djangoは、Pythonで最も歴史があり広く使われているWebフレームワークの一つです。「バッテリー同梱（batteries included）」という思想のもと、認証、管理画面、ORM、テンプレートエンジンなどWeb開発に必要な機能をほぼすべて内蔵しています。"
          },
          {
            "type": "p",
            "text": "FastAPIが“軽量・高速なAPIサーバー”に特化しているのに対し、Djangoは“総合的なWebアプリケーション”を一括で構築できるのが特徴です。たとえば管理画面（Django Admin）やユーザー認証機能が最初から使えるため、開発初期の生産性が非常に高く、企業システムや大規模サービスで多く採用されています。"
          },
          {
            "type": "p",
            "text": "【FastAPIとの主な違い】"
          },
          {
            "type": "ul",
            "items": [
              "思想の違い：FastAPIは軽量API向け、Djangoは総合Webアプリ向け",
              "機能範囲：Djangoは管理画面・認証・テンプレートなどを標準搭載、FastAPIは必要機能を組み合わせる構成",
              "パフォーマンス：FastAPIは非同期処理で高速、Djangoは同期型が中心（ただし拡張で非同期も可能）",
              "適用規模：FastAPIはマイクロサービスやAPIバックエンドに最適、Djangoは大規模Webサービスや企業システムに強い"
            ]
          },
          {
            "type": "ul",
            "items": [
              "「バッテリー同梱」思想で必要機能を標準装備",
              "Django Adminによる強力な管理画面を自動生成",
              "大規模サービスや企業システム開発に広く採用",
              "総合的なWebアプリケーション構築に最適"
            ]
          }
        ]
      },
      {
        "id": "ruby-rails",
        "title": "Ruby / Ruby on Rails",
        "summary": "「作らないことに価値がある」を体現する生産性重視のWebフレームワークです。",
        "content": [
          {
            "type": "p",
            "text": "Ruby on Rails（通称Rails）は、Ruby言語の代表的なWebアプリケーションフレームワークで、「設定より規約（Convention over Configuration）」という思想のもと、最低限のコードで多くの機能を実現できる点が最大の特徴です。"
          },
          {
            "type": "p",
            "text": "データベースとの連携、ユーザー認証、ルーティングなど、Webアプリに必要な機能があらかじめ揃っており、開発者は本質的なビジネスロジックに集中できます。スタートアップや新規サービスの立ち上げに特に向いています。"
          },
          {
            "type": "ul",
            "items": [
              "「設定より規約」による高い生産性",
              "Webアプリ開発に必要な機能を標準搭載",
              "短期間でサービスを立ち上げやすい",
              "スタートアップやMVP開発に最適"
            ]
          }
        ]
      },
      {
        "id": "javascript-react",
        "title": "JavaScript / React",
        "summary": "UI構築に革命を起こしたコンポーネント指向のフロントエンドライブラリです。",
        "content": [
          {
            "type": "p",
            "text": "Reactは、JavaScriptで動的なユーザーインターフェース（UI）を構築するためのライブラリです。Facebook（現Meta）によって開発され、コンポーネントという小さな部品を組み合わせて複雑なUIを効率的に作ることができます。"
          },
          {
            "type": "p",
            "text": "仮想DOM（Virtual DOM）による高速な再描画や、状態管理のしやすさ、豊富なエコシステムなどが特徴です。SPA（Single Page Application）開発に最適で、現代のWeb開発ではほぼ標準となっています。"
          },
          {
            "type": "ul",
            "items": [
              "コンポーネント指向による再利用性の高いUI設計",
              "Virtual DOMで高速な描画更新が可能",
              "SPA開発に最適でエコシステムも豊富",
              "大規模フロントエンド開発の標準ライブラリ"
            ]
          }
        ]
      },
      {
        "id": "javascript-nextjs",
        "title": "JavaScript / Next.js",
        "summary": "ReactをベースにSSRや静的生成を簡単に実現できるフレームワークです。",
        "content": [
          {
            "type": "p",
            "text": "Next.jsは、Reactを基盤としたフレームワークで、サーバーサイドレンダリング（SSR）や静的サイト生成（SSG）を簡単に取り入れられるのが特徴です。SEOへの強さとパフォーマンスの高さから、近年はWebアプリ開発の定番になっています。"
          },
          {
            "type": "p",
            "text": "ルーティングやデータフェッチなどの機能も標準搭載されており、React単体よりも開発効率が高くなります。中〜大規模なWebサービスではNext.jsを採用するケースが増えています。"
          },
          {
            "type": "ul",
            "items": [
              "SSR・SSGを標準サポートしSEOにも強い",
              "ルーティングやAPI連携などを自動化",
              "Reactの生産性をさらに高める設計",
              "本格的なWebサービスや企業サイト開発に最適"
            ]
          }
        ]
      },
      {
        "id": "java-spring",
        "title": "Java / Spring",
        "summary": "エンタープライズ開発で定番の強力なバックエンドフレームワークです。",
        "content": [
          {
            "type": "p",
            "text": "Spring Frameworkは、Javaの代表的なWebアプリケーションフレームワークで、大規模な業務システムや企業向けサービスの開発で広く使われています。DI（依存性注入）やAOP（アスペクト指向プログラミング）などの高度な機能を備え、拡張性・保守性が高いのが特徴です。"
          },
          {
            "type": "p",
            "text": "Spring Bootを使えば複雑な設定を自動化でき、迅速な開発も可能になります。安定性と信頼性を重視する大規模システム開発では今もなお定番の選択肢です。"
          },
          {
            "type": "ul",
            "items": [
              "エンタープライズ開発に強い堅牢なフレームワーク",
              "DIやAOPなど高度な設計手法をサポート",
              "Spring Bootで設定を自動化し高速開発が可能",
              "大規模・長期運用の業務システムに最適"
            ]
          }
        ]
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
            開発フレームワークの紹介
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