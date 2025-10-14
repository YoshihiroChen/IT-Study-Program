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
    "key": "fastapi-intro",
    "title": "FastAPI入門：PythonでモダンなWeb APIを作る",
    "lessons": [
      {
        "id": "overview",
        "title": "FastAPIとは",
        "summary": "FastAPIは、Pythonで高速かつ型安全なWeb APIを構築できる次世代フレームワークです。",
        "content": [
          {
            "type": "p",
            "text": "FastAPIは、Pythonの型ヒントを活用して自動的にAPIドキュメントを生成するモダンなWebフレームワークです。FlaskやDjangoに比べて非同期処理に強く、開発速度と実行性能の両立を目指しています。"
          },
          {
            "type": "ul",
            "items": [
              "高速（StarletteとPydanticによる高性能な処理）",
              "型ヒントを利用した自動バリデーションと補完",
              "Swagger UIによる自動ドキュメント生成",
              "同期・非同期（async/await）の両方に対応",
              "データモデル定義が容易（Pydanticベース）"
            ]
          }
        ]
      },
      {
        "id": "install",
        "title": "FastAPIのインストール",
        "summary": "Python環境にFastAPIとUvicornをインストールします。",
        "content": [
          {
            "type": "p",
            "text": "FastAPI自体はアプリケーションのロジックを提供するフレームワークであり、実際のサーバー実行にはASGIサーバーであるUvicornを使います。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "pip install fastapi uvicorn"
          },
          {
            "type": "p",
            "text": "インストール後、`uvicorn --version` と入力して動作確認できます。"
          }
        ]
      },
      {
        "id": "hello-world",
        "title": "最初のFastAPIアプリを作る",
        "summary": "FastAPIの基本構造を理解するために、シンプルな“Hello World”アプリを作成します。",
        "content": [
          {
            "type": "code",
            "filename": "main.py",
            "lang": "python",
            "code": "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get(\"/\")\ndef read_root():\n    return {\"message\": \"Hello, FastAPI!\"}"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "uvicorn main:app --reload"
          },
          {
            "type": "p",
            "text": "実行後、ブラウザで `http://127.0.0.1:8000` にアクセスすると、JSON形式のメッセージが表示されます。"
          },
          {
            "type": "ul",
            "items": [
              "URL `/` にGETリクエストが来ると `read_root()` が呼ばれる",
              "戻り値は自動的にJSONに変換される",
              "`--reload` はコード変更を自動的に反映させるオプション"
            ]
          }
        ]
      },
      {
        "id": "path-params",
        "title": "パスパラメータとクエリパラメータ",
        "summary": "APIで動的なURLや条件付き検索を実現する方法を学びます。",
        "content": [
          {
            "type": "code",
            "filename": "main.py",
            "lang": "python",
            "code": "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get(\"/items/{item_id}\")\ndef read_item(item_id: int, q: str | None = None):\n    return {\"item_id\": item_id, \"query\": q}"
          },
          {
            "type": "p",
            "text": "`/items/3?q=apple` のようにアクセスすると、`item_id=3`, `q='apple'` が返されます。"
          },
          {
            "type": "ul",
            "items": [
              "URLの一部を `{item_id}` のように変数で指定できる",
              "クエリパラメータは `?key=value` 形式で指定する",
              "型ヒントにより自動バリデーションが行われる"
            ]
          }
        ]
      },
      {
        "id": "request-body",
        "title": "リクエストボディとPydanticモデル",
        "summary": "POSTリクエストでデータを受け取る方法と、Pydanticでデータ型を定義する方法を解説します。",
        "content": [
          {
            "type": "code",
            "filename": "main.py",
            "lang": "python",
            "code": "from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Item(BaseModel):\n    name: str\n    price: float\n    is_offer: bool | None = None\n\n@app.post(\"/items/\")\ndef create_item(item: Item):\n    return {\"item_name\": item.name, \"price\": item.price}"
          },
          {
            "type": "ul",
            "items": [
              "Pydanticモデルを使うと、型安全にデータを受け取れる",
              "無効なデータが送られた場合は自動的にエラーが返る",
              "データは自動的にPythonオブジェクトとして扱える"
            ]
          },
          {
            "type": "p",
            "text": "FastAPIは自動的にOpenAPI仕様に基づくリクエストスキーマを生成します。"
          }
        ]
      },
      {
        "id": "docs",
        "title": "自動ドキュメント（Swagger UIとReDoc）",
        "summary": "FastAPIは自動的にAPIドキュメントを生成します。",
        "content": [
          {
            "type": "ul",
            "items": [
              "Swagger UI: `http://127.0.0.1:8000/docs`",
              "ReDoc: `http://127.0.0.1:8000/redoc`"
            ]
          },
          {
            "type": "p",
            "text": "これらのドキュメントは自動生成され、リクエスト送信もGUI上で行えます。"
          }
        ]
      },
      {
        "id": "async",
        "title": "非同期処理（async/await）",
        "summary": "FastAPIはPythonのasync/await構文に完全対応しています。",
        "content": [
          {
            "type": "code",
            "filename": "main.py",
            "lang": "python",
            "code": "import asyncio\nfrom fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get(\"/wait\")\nasync def wait_task():\n    await asyncio.sleep(2)\n    return {\"message\": \"2秒待ちました\"}"
          },
          {
            "type": "p",
            "text": "非同期関数を使うと、複数リクエストを同時に効率的に処理できます。特にI/O処理（API呼び出しやDBアクセス）で性能差が大きくなります。"
          }
        ]
      },
      {
        "id": "dependency",
        "title": "依存性注入（Dependency Injection）",
        "summary": "FastAPIの強力な機能である依存性注入を使って、共通処理や認証を整理します。",
        "content": [
          {
            "type": "code",
            "filename": "main.py",
            "lang": "python",
            "code": "from fastapi import Depends, FastAPI\n\napp = FastAPI()\n\ndef common_parameters(q: str | None = None):\n    return {\"q\": q}\n\n@app.get(\"/items/\")\ndef read_items(commons: dict = Depends(common_parameters)):\n    return commons"
          },
          {
            "type": "p",
            "text": "`Depends()` を使うと、共通のロジック（例：認証・DB接続・ロギングなど）を整理して再利用できます。"
          }
        ]
      },
      {
        "id": "summary",
        "title": "まとめ：FastAPIの魅力",
        "summary": "FastAPIはPython開発者にとって強力かつ簡潔なAPIフレームワークです。",
        "content": [
          {
            "type": "ul",
            "items": [
              "型ヒントに基づく高い開発効率と安全性",
              "非同期処理に最適化された設計",
              "自動生成されるドキュメント",
              "Pydanticによる強力なデータバリデーション",
              "依存性注入によりスケーラブルな設計が可能"
            ]
          },
          {
            "type": "p",
            "text": "FastAPIは、モダンなWeb API開発の標準になりつつあります。次のステップとして、データベース連携・認証・Dockerデプロイなどの実践的な内容に進みましょう。"
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
            FASTAPIの学習
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