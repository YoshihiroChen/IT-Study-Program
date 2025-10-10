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
    "key": "vscode-local-dev",
    "title": "Local開発の準備",
    "lessons": [
      {
        "id": "install",
        "title": "VS Codeのインストール",
        "summary": "Visual Studio Codeをダウンロードしてローカル開発環境を整えます。",
        "content": [
          {
            "type": "p",
            "text": "Visual Studio Code（VS Code）は、Web開発からPython、機械学習、クラウド開発まで幅広く利用されている軽量かつ高機能なエディタです。この教材では、VS Codeを使ってローカル開発を行う方法を学びます。"
          },
          {
            "type": "p",
            "text": "まずは公式サイトからVS Codeをダウンロードします。自分のOS（macOS / Windows / Linux）に合ったインストーラーを選んでください。"
          },
          {
            "type": "p",
            "text": "👉 [Visual Studio Code公式サイト](https://code.visualstudio.com/)"
          },
          {
            "type": "img",
            "src": "/images/vs-code-0.png",
            "alt": "VS Code公式サイトのトップページ",
            "caption": "公式サイトから「Download」をクリックしてインストールします。"
          },
          {
            "type": "p",
            "text": "インストールが完了したら、VS Codeを起動してみましょう。最初に表示されるのが次のような「Welcome画面」です。ここから新しいファイルを作成したり、既存のフォルダーを開いたりできます。"
          },
          {
            "type": "img",
            "src": "/images/vs-code-1.png",
            "alt": "VS CodeのWelcome画面",
            "caption": "起動直後のWelcomeページ。左上のExplorerをクリックします。"
          }
        ]
      },
      {
        "id": "open-folder",
        "title": "フォルダーを開いてプロジェクトを始める",
        "summary": "エクスプローラーを使って開発するフォルダーを選びましょう。",
        "content": [
          {
            "type": "p",
            "text": "VS Codeで開発を始める基本は、まず「フォルダーを開く」ことです。これは、プロジェクト全体を1つのフォルダーとして管理するためです。"
          },
          {
            "type": "img",
            "src": "/images/vs-code-2.png",
            "alt": "エクスプローラーを開く",
            "caption": "左側の（Open Folder）をクリックすると、プロジェクト全体を1つのフォルダーとして管理します"
          },
          {
            "type": "p",
            "text": "「Open Folder...」をクリックすると、フォルダー選択ダイアログが表示されます。ここで、自分の開発用フォルダー（例：example-projectなど）を選びましょう。"
          },
          {
            "type": "img",
            "src": "/images/vs-code-3.png",
            "alt": "Open Folderのダイアログ",
            "caption": "フォルダー選択画面。プロジェクト用に新しいフォルダーを作ることもできます。"
          },
          {
            "type": "p",
            "text": "フォルダーを開くとき、「このフォルダー内のファイルの作者を信頼しますか？」というメッセージが表示される場合があります。"
          },
          {
            "type": "img",
            "src": "/images/vs-code-4.png",
            "alt": "Trust the authors ダイアログ",
            "caption": "信頼できるフォルダーであれば「Yes, I trust the authors」を選択してください。"
          },
          {
            "type": "p",
            "text": "フォルダーを開くと、左側にファイルツリー（ディレクトリ構成）が表示されます。これが開発のスタート地点になります。"
          },
          {
            "type": "img",
            "src": "/images/vs-code-5.png",
            "alt": "フォルダーを開いた後のエクスプローラー画面",
            "caption": "左側にファイル構成が表示され、ここからファイルを作成・編集できます。"
          }
        ]
      },
      {
        "id": "command-terminal",
        "title": "コマンドパレットとターミナルの使い方",
        "summary": "開発中に必要なターミナルやコマンドをVS Code内で開く方法を学びます。",
        "content": [
          {
            "type": "p",
            "text": "VS Codeでは、開発中にさまざまなコマンド（例：ファイル作成、実行、設定変更）を「コマンドパレット」から実行できます。"
          },
          {
            "type": "img",
            "src": "/images/vs-code-6.png",
            "alt": "コマンドパレットの開き方",
            "caption": "上部の検索バーをクリックするか、ショートカット（Mac：⌘ + Shift + P / Windows：Ctrl + Shift + P）で開けます。"
          },
          {
            "type": "p",
            "text": "「Show and Run Commands」と入力すると、VS Codeが提供するすべてのコマンド一覧が表示されます。ここから「Create New Terminal」を選びます。"
          },
          {
            "type": "img",
            "src": "/images/vs-code-7.png",
            "alt": "Create New Terminalを選択",
            "caption": "コマンドパレットから「Terminal: Create New Terminal」を選ぶと、下部にターミナルが開きます。"
          },
          {
            "type": "p",
            "text": "「Create New Terminal」をクリックすると、シェル（コマンド実行環境）を選択することができます。bash、zsh、PowerShell、またはJavaScript Debug Terminalなどから選べます。"
          },
          {
            "type": "img",
            "src": "/images/vs-code-8.png",
            "alt": "ターミナルの種類選択画面",
            "caption": "ターミナル種別の選択。macOSではbashやzsh、WindowsではPowerShellが一般的です。"
          },
          {
            "type": "p",
            "text": "VS Codeで新しいターミナルを開くときは、使用するシェル（Shell）を選択できます。ここでは、開発でよく使われる3つのターミナルを紹介します。"
          },
          {
            "type": "ul",
            "items": [
              "bash（バッシュ）：LinuxやmacOSで標準的に使われるシェル。EC2などのサーバーでも一般的で、ファイル操作・Git・プログラム実行など多用途に使われます。",
              "zsh（ゼットシェル）：macOSの新しいデフォルトシェル。bashとほぼ同じ操作ができ、補完機能やカスタマイズ性が高いのが特徴です。",
              "JavaScript Debug Terminal：Node.jsアプリケーションをデバッグするための特別なターミナル。コードを実行すると同時に、ブレークポイントや変数の状態をVS Code上で確認できます。"
            ]
          },
          {
            "type": "p",
            "text": "通常の開発作業ではbashまたはzshを使い、JavaScript Debug TerminalはNode.jsやNext.jsのデバッグ時に利用します。"
          },
          {
            "type": "img",
            "src": "/images/vs-code-8.png",
            "alt": "ターミナルの種類選択画面",
            "caption": "bash、zsh、JavaScript Debug Terminalなどから選択できます。macOSではzsh、Linuxではbashが一般的です。"
          },
          {
            "type": "p",
            "text": "ターミナルが表示されたら、コマンドを入力して操作できます。ここの例として、「pwd」というコマンドを実行します"
          },
          {
            "type": "img",
            "src": "/images/vs-code-9.png",
            "alt": "ターミナルの画面"
          },
          
          {
            "type": "p",
            "text": "これで、VS Codeを使ってローカル開発を始める準備が整いました。次の章では、クラウド（AWS EC2）に接続して開発する方法を学びます。"
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
            VsCodeの使用ガイダンス
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