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
    key: "jupyter-notebook",
    title: "Jupyternotebookの使用方法",
    lessons: [
      {
        id: "install",
        title: "インストール",
        summary: "Anacondaを利用してJupyter Notebookを簡単に導入する方法を解説します。",
        content: [
          {
            type: "p",
            text: "Jupyter Notebookは、Pythonの学習やデータ分析、機械学習の実験などに広く使われているインタラクティブな開発環境です。ブラウザ上でコードの実行、グラフの描画、メモの記録などを行えるため、初学者にも扱いやすいツールです。"
          },
          {
            type: "p",
            text: "最も簡単な導入方法は、Pythonの実行環境と多数のデータ分析ライブラリがまとめてインストールできる「Anaconda」を利用することです。以下の公式サイトから自分のOSに合ったインストーラーをダウンロードしてインストールしてください："
          },
          {
            type: "p",
            text: "👉 [Anaconda公式サイト](https://www.anaconda.com/)"
          },
          {
            type: "p",
            text: "インストールが完了すると、アプリケーション一覧の中に「Anaconda Navigator」というツールが追加されます。ここから「Jupyter Notebook」を起動すると、ブラウザが自動的に開き、開発環境が使えるようになります。"
          },
          {
            type: "p",
            text: "以下は、Anacondaの公式サイトとインストール画面、そしてAnaconda Navigatorの起動画面の例です。"
          },
          {
            type: "img",
            src: "/images/web-engineer-anaconda-1.png",
            alt: "Anaconda公式サイトのトップページ",
            caption: "Anaconda公式サイトのトップページ、右上のダウンロードボタンを押してください。"
          },
          {
            type: "img",
            src: "/images/web-engineer-anaconda-2.png",
            alt: "Anacondaのインストーラー画面",
            caption: "Get Startedをクリックしてください。"
          },
          {
            type: "img",
            src: "/images/web-engineer-anaconda-3.png",
            alt: "Anaconda Navigatorの選択画面",
            caption: "Distribution Installersは完全版で、環境の設定は不要で、これをインストールしてください。"
          },
          {
            type: "img",
            src: "/images/web-engineer-anaconda-4.png",
            alt: "Jupyter Notebookの起動画面",
            caption: "インストールが完了すると、アプリケーション一覧の中に「Anaconda Navigator」というツールが追加されます。このツールを開くと、以上の画面が表示され、「Jupyter Notebook」を起動してください。"
          }
        ]
      },
      {
        id: "basic-usage",
        title: "基本操作",
        summary: "Jupyter Notebookの基本的な画面構成と使い方について解説します。",
        content: [
          {
            type: "p",
            text: "Jupyter Notebookを起動すると、まず最初に「ホーム画面（ファイルブラウザ）」が表示されます。ここではフォルダを移動したり、新しいノートブックを作成したり、既存のファイルを開いたりできます。"
          },
          {
            type: "img",
            src: "/images/web-engineer-anaconda-5.png",
            alt: "Jupyter Notebookのホーム画面",
            caption: "起動直後のホーム画面。ここでファイルの管理や新規Notebookの作成ができます。"
          },
          {
            type: "p",
            text: "画面右上の「New」ボタンをクリックすると、いくつかの選択肢が表示されます。それぞれの意味は以下の通りです："
          },
          {
            type: "ul",
            items: [
              "Notebook：Pythonなどのカーネルを使ってコードを実行するインタラクティブな開発環境（最もよく使われる）",
              "Terminal：UNIXシェルのようなコマンドライン環境を開き、ファイル操作やパッケージインストールなどができる",
              "Console：Notebookより軽量な対話型Python実行環境（補助的な使い方に向く）",
              "New File：空のテキストファイルを作成できる（メモやスクリプトの下書きなどに便利）",
              "New Folder：新しいフォルダを作成し、プロジェクトやデータを整理できる"
            ]
          },
          {
            type: "img",
            src: "/images/web-engineer-anaconda-6.png",
            alt: "Newメニューの各オプション",
            caption: "「New」メニューからNotebookやTerminalなどを選択できます。開発の目的に応じて使い分けましょう。"
          },
          {
            type: "p",
            text: "ホーム画面上部の「Running」タブでは、現在起動中のNotebook・Terminal・Consoleを一覧で確認し、必要に応じて停止させることができます。Notebookを閉じたつもりでもプロセスが動いていることがあるので、ここで管理するのが安全です。"
          },
          {
            type: "img",
            src: "/images/web-engineer-anaconda-7.png",
            alt: "Runningタブ",
            caption: "Runningタブでは、起動中のセッションを一覧表示し、不要なものを停止できます。"
          },
          {
            type: "p",
            text: "Notebookを新規作成すると、セル（Cell）と呼ばれるコード実行単位が並ぶエディタ画面に入ります。Shift + Enter でセルを実行でき、Ctrl + Enter で実行のみ、Alt + Enter で実行後に新しいセルを追加できます。セルにはコードセル（Pythonなどのコードを実行）とMarkdownセル（説明文や見出しを書く）があり、用途に応じて使い分けます。"
          },
          {
            type: "p",
            text: "よく使うショートカットキー（Mac）："
          },
          {
            type: "ul",
            items: [
              "Shift + Enter：現在のセルを実行し、次のセルへ移動",
              "Control + Enter：現在のセルを実行のみ",
              "Option + Enter：現在のセルを実行して下に新しいセルを追加",
              "A：上に新しいセルを追加（コマンドモード時）",
              "B：下に新しいセルを追加（コマンドモード時）",
              "M：セルをMarkdownに変更",
              "Y：セルをコードに変更"
            ]
          },
          {
            type: "p",
            text: "よく使うショートカットキー（Windows）："
          },
          {
            type: "ul",
            items: [
              "Shift + Enter：現在のセルを実行し、次のセルへ移動",
              "Ctrl + Enter：現在のセルを実行のみ",
              "Alt + Enter：現在のセルを実行して下に新しいセルを追加",
              "A：上に新しいセルを追加（コマンドモード時）",
              "B：下に新しいセルを追加（コマンドモード時）",
              "M：セルをMarkdownに変更",
              "Y：セルをコードに変更"
            ]
          },
          {
            type: "img",
            src: "/images/web-engineer-anaconda-8.png",
            alt: "Notebookエディタ画面",
            caption: "Notebookエディタ画面の例。セルごとにコードを実行したりMarkdownで説明を加えたりできます。"
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
            Pythonコーディング環境：Jupyternotebook
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