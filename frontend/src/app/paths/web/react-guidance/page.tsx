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
    "key": "codesandbox-intro",
    "title": "CodeSandboxを使ってみよう",
    "lessons": [
      {
        "id": "codesandbox-basics",
        "title": "CodeSandboxの使い方",
        "summary": "ブラウザ上でReact開発ができるオンライン環境を使ってみましょう。",
        "content": [
          {
            "type": "p",
            "text": "CodeSandbox（コードサンドボックス）は、インストール不要でブラウザ上からReactやNext.jsなどの開発ができるオンラインエディタです。自分のパソコンに環境を構築しなくても、すぐに実験や学習を始めることができます。"
          },
          {
            "type": "img",
            "src": "/images/react-0.png",
            "alt": "CodeSandboxのトップページ",
            "caption": "CodeSandboxのトップページ。まずは公式サイトにアクセスしましょう。"
          },
          {
            "type": "p",
            "text": "トップページにアクセスしたら、画面中央または上部の「Explore Templates」ボタンをクリックします。テンプレートとは、すぐに使えるプロジェクトのひな形です。ReactやNext.jsなど、目的に応じたテンプレートを選べます。"
          },
          {
            "type": "img",
            "src": "/images/react-00.png",
            "alt": "Explore Templatesボタンをクリック",
            "caption": "「Explore Templates」をクリックしてテンプレート一覧へ進みます。"
          },
          {
            "type": "p",
            "text": "テンプレート一覧の中から「React」を選択しましょう。これで、Reactプロジェクトのサンプルが自動的に開きます。右側にはプレビュー画面、左側にはソースコードが表示されます。"
          },
          {
            "type": "img",
            "src": "/images/react-000.png",
            "alt": "Reactテンプレートを選択",
            "caption": "Reactテンプレートを選ぶと、即座にReactの開発環境が起動します。"
          },
          {
            "type": "p",
            "text": "これで準備完了です。CodeSandboxでは、ブラウザ上でファイルを編集したり、新しいコンポーネントを追加したりすることができます。変更内容は自動で保存され、右側のプレビュー画面で即時に結果を確認できます。"
          },
          {
            "type": "ul",
            "items": [
              "画面左：ソースコードやフォルダ構成",
              "画面右：実行結果のプレビュー",
              "上部ツールバー：実行・共有・設定などの操作ボタン"
            ]
          },
          {
            "type": "p",
            "text": "このように、CodeSandboxを使えばReact学習を手軽に始められます。次のセクションでは、実際にJSXを使って画面を表示してみましょう。"
          }
        ]
      },
      {
        "id": "jsx-editing",
        "title": "JSX記法を試してみよう",
        "summary": "CodeSandbox上でJSXを実際に編集しながらReactの基本構文を学びます。",
        "content": [
          {
            "type": "p",
            "text": "ここでは、CodeSandbox上でJSXを直接編集しながらReactの基本記法を体験していきます。ReactではJSXを使ってUIを構築しますが、まずは環境を整理してシンプルなコードから始めましょう。"
          },
          {
            "type": "img",
            "src": "/images/react-1.png",
            "alt": "CodeSandboxへのログイン",
            "caption": "右上のアイコンをクリックしてログインしましょう。ログインしないとファイル削除などの操作ができません。"
          },
          {
            "type": "p",
            "text": "ログイン後、左側のファイル一覧で `src` フォルダを開き、`index.js` 以外のファイルをすべて削除します。最初はシンプルな状態から始めることで、Reactの構文を理解しやすくなります。"
          },
          {
            "type": "img",
            "src": "/images/react-3.png",
            "alt": "srcフォルダ内の整理",
            "caption": "ログイン後、srcフォルダ内のindex.js以外のファイルを削除して環境を整えます。"
          },
          {
            "type": "p",
            "text": "次に、`index.js` の中身を編集します。以下のように、`return null` として一旦何も表示しない状態を作ります。"
          },
          {
            "type": "img",
            "src": "/images/react-4.png",
            "alt": "return null のコード例",
            "caption": "returnの中をnullにすると、右側のプレビューには何も表示されません。"
          },
          {
            "type": "p",
            "text": "次に、`return null` を以下のように書き換えてみましょう。"
          },
          {
            "type": "code",
            "filename": "index.js",
            "lang": "jsx",
            "code": "return <h1>こんにちは！</h1>;"
          },
          {
            "type": "img",
            "src": "/images/react-5.png",
            "alt": "JSXで文字を表示",
            "caption": "returnの中に<h1>タグを追加すると、右側のプレビュー画面に文字が表示されます。"
          },
          {
            "type": "p",
            "text": "React 18以降では、古い書き方である `ReactDOM.render(<App />, document.getElementById('root'))` は使用できません。代わりに、以下のように `createRoot` を使う必要があります。"
          },
          {
            "type": "img",
            "src": "/images/react-6.png",
            "alt": "ReactDOM.renderエラーの注意点",
            "caption": "古い構文のReactDOM.render()を使うとエラーが発生します。"
          },
          {
            "type": "code",
            "filename": "index.js",
            "lang": "jsx",
            "code": "import React from 'react';\nimport { createRoot } from 'react-dom/client';\n\nconst root = createRoot(document.getElementById('root'));\nroot.render(<h1>こんにちは！</h1>);"
          },
          {
            "type": "p",
            "text": "複数行の要素を表示したい場合は、すべてを1つのタグで囲む必要があります。タグを使わずに複数行のJSXを書くとエラーになります。"
          },
          {
            "type": "img",
            "src": "/images/react-7.png",
            "alt": "複数要素を囲む例",
            "caption": "複数の要素をreturnする場合は、<div>などのタグで全体を囲みましょう。"
          },
          {
            "type": "code",
            "filename": "index.js",
            "lang": "jsx",
            "code": "return (\n  <div>\n    <h1>こんにちは！</h1>\n    <p>Reactの学習を始めましょう。</p>\n  </div>\n);"
          },
          {
            "type": "p",
            "text": "また、タグで囲む代わりに「Fragment（フラグメント）」という特別な構文を使うこともできます。これは不要なタグを増やさずに要素をまとめるための仕組みです。"
          },
          {
            "type": "img",
            "src": "/images/react-8.png",
            "alt": "Fragmentを使う例",
            "caption": "Fragmentをimportして使うと、不要な<div>を増やさずに複数要素をまとめられます。"
          },
          {
            "type": "code",
            "filename": "index.js",
            "lang": "jsx",
            "code": "import React, { Fragment } from 'react';\n\nfunction App() {\n  return (\n    <Fragment>\n      <h1>こんにちは！</h1>\n      <p>Fragmentを使う例です。</p>\n    </Fragment>\n  );\n}"
          },
          {
            "type": "p",
            "text": "さらに簡単な書き方として、`<>` と `</>` を使ってFragmentを省略記法で書くこともできます。"
          },
          {
            "type": "img",
            "src": "/images/react-9.png",
            "alt": "短縮記法のFragment",
            "caption": "importなしで使用できる省略形のFragment記法。"
          },
          {
            "type": "code",
            "filename": "index.js",
            "lang": "jsx",
            "code": "function App() {\n  return (\n    <>\n      <h1>こんにちは！</h1>\n      <p>こちらは短縮記法のFragmentです。</p>\n    </>\n  );\n}\n\nexport default App;"
          },
          {
            "type": "p",
            "text": "以上のように、JSXではreturn内でHTMLのような構文を書けますが、正しいタグ構造を守ることが重要です。次の章では、コンポーネントを分割してUIを構築する方法を学びます。"
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
            Reactの学習
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