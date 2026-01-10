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
    "key": "python-basic-preparation",
    "title": "基礎知識点の準備",
    "lessons": [
      {
        "id": "variable-declaration",
        "title": "変数の宣言（代入）",
        "summary": "値を名前に紐づけて保存する基本操作を学びます。",
        "content": [
          {
            "type": "p",
            "text": "プログラムでは、値をそのまま使うのではなく、**名前（変数）を付けて保存** します。Python では `=` を使って変数に値を代入します。これを「変数の宣言（代入）」と呼びます。"
          },
          {
            "type": "code",
            "filename": "variable-basic.py",
            "lang": "python",
            "code": "a = 12\nname = \"Alice\"\nis_valid = True\n\nprint(a)\nprint(name)\nprint(is_valid)"
          },
          {
            "type": "p",
            "text": "Python では、変数を使う前に型を宣言する必要はありません。**代入された値によって自動的に型が決まる** のが特徴です。"
          },
          {
            "type": "ul",
            "items": [
              "`=` は「等しい」ではなく「代入」を意味する",
              "変数は値に名前を付けるためのもの",
              "同じ変数に別の値を代入することもできる"
            ]
          }
        ]
      },
      {
        "id": "program-input-output",
        "title": "入力と出力（input / print）",
        "summary": "ユーザーとやり取りするための基本機能を学びます。",
        "content": [
          {
            "type": "p",
            "text": "アプリケーションを作るためには、**ユーザーから情報を受け取り、その結果を画面に表示する** 必要があります。Python では `input()` を使って入力を受け取り、`print()` を使って出力します。"
          },
          {
            "type": "code",
            "filename": "input-output-basic.py",
            "lang": "python",
            "code": "name = input(\"名前を入力してください：\")\nprint(\"こんにちは\", name)"
          },
          {
            "type": "ul",
            "items": [
              "`input()` は必ず文字列（str）を返す",
              "`print()` は複数の値を表示できる",
              "入力待ちの状態ではプログラムは停止して見える"
            ]
          }
        ]
      },
      {
        "id": "data-types-and-structures",
        "title": "データ型とデータ構造",
        "summary": "情報をどの形で管理するかを学びます。",
        "content": [
          {
            "type": "p",
            "text": "プログラムでは情報を保存・管理する必要があります。就活 Todo アプリでは、**1 件の選考情報をまとめて扱い、複数件を一覧として管理** します。"
          },
          {
            "type": "code",
            "filename": "data-structure-basic.py",
            "lang": "python",
            "code": "todo = {\n    \"company\": \"A社\",\n    \"role\": \"エンジニア\",\n    \"status\": \"TODO\"\n}\n\ntodos = [todo]"
          },
          {
            "type": "ul",
            "items": [
              "`str`：会社名・職種・状態などの文字情報",
              "`int`：ID などの数値",
              "`dict`：1 件の選考情報をまとめる",
              "`list`：複数の選考情報を管理する"
            ]
          }
        ]
      },
      {
        "id": "if-conditional",
        "title": "条件分岐（if 文）",
        "summary": "条件によって処理を切り替える方法を学びます。",
        "content": [
          {
            "type": "p",
            "text": "`if` 文は、**ユーザーの入力や状態に応じて処理を変える** ために使われます。メニュー選択や入力チェックで必須の構文です。"
          },
          {
            "type": "code",
            "filename": "if-basic.py",
            "lang": "python",
            "code": "choice = \"1\"\n\nif choice == \"1\":\n    print(\"新規追加\")\nelif choice == \"2\":\n    print(\"一覧表示\")\nelse:\n    print(\"無効な選択\")"
          },
          {
            "type": "ul",
            "items": [
              "条件式は True / False で評価される",
              "`elif` は複数条件を分けたいときに使用",
              "入力チェックの基本になる"
            ]
          }
        ]
      },
      {
        "id": "while-loop",
        "title": "繰り返し処理（while 文）",
        "summary": "プログラムを動き続けさせる仕組みを学びます。",
        "content": [
          {
            "type": "p",
            "text": "`while` 文を使うと、**ユーザーが終了を選ぶまでプログラムを動かし続ける** ことができます。メニュー型アプリの中核です。"
          },
          {
            "type": "code",
            "filename": "while-basic.py",
            "lang": "python",
            "code": "while True:\n    print(\"メニュー表示\")\n    cmd = input(\"0 を入力すると終了：\")\n    if cmd == \"0\":\n        break"
          },
          {
            "type": "ul",
            "items": [
              "`while True` は無限ループを作る",
              "`break` によってループを終了できる",
              "アプリケーションの「常駐動作」を実現する"
            ]
          }
        ]
      },
      {
        "id": "function-definition",
        "title": "関数による処理の分割",
        "summary": "機能ごとに処理をまとめる方法を学びます。",
        "content": [
          {
            "type": "p",
            "text": "実際のアプリケーションでは、**処理を機能ごとに分けて管理** します。Python では `def` を使って関数を定義します。"
          },
          {
            "type": "code",
            "filename": "function-basic.py",
            "lang": "python",
            "code": "def add_todo():\n    print(\"選考を追加します\")\n\ndef list_todos():\n    print(\"一覧を表示します\")"
          },
          {
            "type": "ul",
            "items": [
              "1 つの関数 = 1 つの機能",
              "処理の見通しがよくなる",
              "後から機能を追加しやすくなる"
            ]
          }
        ]
      },
      {
        "id": "input-validation",
        "title": "入力チェックの考え方",
        "summary": "不正な入力を防ぐための基本的な考え方を学びます。",
        "content": [
          {
            "type": "p",
            "text": "ユーザー入力は常に正しいとは限りません。そのため、**形式や内容をチェックする処理** が重要になります。"
          },
          {
            "type": "code",
            "filename": "input-validation-basic.py",
            "lang": "python",
            "code": "text = input(\"数字を入力：\")\n\nif not text.isdigit():\n    print(\"数字ではありません\")"
          },
          {
            "type": "ul",
            "items": [
              "入力値は必ずチェックする",
              "形式チェックと内容チェックは別物",
              "実務では必須の考え方"
            ]
          }
        ]
      }
    ]
  },
  {
    "key": "python-program-design-from-features",
    "title": "機能から考えるプログラム設計",
    "lessons": [
      {
        "id": "what-is-program-design",
        "title": "プログラム設計とは何か",
        "summary": "コードを書く前に考えるべきことを整理します。",
        "content": [
          {
            "type": "p",
            "text": "プログラム設計とは、**いきなりコードを書くことではありません**。まず「何を作りたいのか」「どんな機能が必要なのか」を言葉で整理することから始まります。"
          },
          {
            "type": "p",
            "text": "実務では、いきなり実装に入ると構造が崩れやすく、後から修正しづらくなります。そのため、**機能 → 構造 → 実装** の順で考えることが重要です。"
          },
          {
            "type": "ul",
            "items": [
              "プログラム設計はコードを書く前の準備段階",
              "最初に「何ができる必要があるか」を整理する",
              "設計ができてから実装に入ると失敗しにくい"
            ]
          }
        ]
      },
      {
        "id": "list-required-features",
        "title": "必要な機能を書き出す",
        "summary": "アプリに必要な機能を洗い出します。",
        "content": [
          {
            "type": "p",
            "text": "まずは、このプログラムで **ユーザーが何をしたいか** を考えます。ここでは「就活選考を管理する」という目的から、必要な機能を整理します。"
          },
          {
            "type": "ul",
            "items": [
              "選考情報を新しく追加できる",
              "登録した選考情報を一覧で確認できる",
              "選考の状態（TODO / DOING / DONE）を更新できる",
              "プログラムを終了できる"
            ]
          },
          {
            "type": "p",
            "text": "この段階では、**どうやって実装するかは考えません**。できる・できないではなく、「やりたいこと」をそのまま書き出します。"
          }
        ]
      },
      {
        "id": "design-data-structure",
        "title": "データの形を設計する",
        "summary": "機能を支えるデータ構造を考えます。",
        "content": [
          {
            "type": "p",
            "text": "次に、これらの機能を実現するために **どんな情報を保存する必要があるか** を考えます。1 件の選考には複数の情報がまとまって存在します。"
          },
          {
            "type": "code",
            "filename": "todo-data-design.py",
            "lang": "python",
            "code": "todo = {\n    \"id\": 1,\n    \"company\": \"A社\",\n    \"role\": \"エンジニア\",\n    \"stage\": \"ES\",\n    \"deadline\": \"2026-01-20\",\n    \"status\": \"TODO\"\n}"
          },
          {
            "type": "p",
            "text": "さらに、選考は複数件存在するため、**これらをまとめて管理する入れ物** が必要になります。"
          },
          {
            "type": "ul",
            "items": [
              "1 件の選考情報は dict で表す",
              "複数の選考情報は list で管理する",
              "ID を持たせることで特定の選考を操作できる"
            ]
          }
        ]
      },
      {
        "id": "split-features-into-functions",
        "title": "機能を関数に分解する",
        "summary": "1 機能 1 関数の考え方を学びます。",
        "content": [
          {
            "type": "p",
            "text": "次に、洗い出した機能を **それぞれ独立した関数** として考えます。これにより、プログラム全体の構造が分かりやすくなります。"
          },
          {
            "type": "code",
            "filename": "function-design.py",
            "lang": "python",
            "code": "def add_todo():\n    pass\n\ndef list_todos():\n    pass\n\ndef update_status():\n    pass"
          },
          {
            "type": "ul",
            "items": [
              "1 つの関数は 1 つの役割を持つ",
              "処理の流れが追いやすくなる",
              "後から修正・追加がしやすくなる"
            ]
          }
        ]
      },
      {
        "id": "design-main-loop",
        "title": "全体の流れ（メインループ）を考える",
        "summary": "アプリ全体を動かす構造を設計します。",
        "content": [
          {
            "type": "p",
            "text": "最後に、これらの機能を **どの順番で、どのように呼び出すか** を考えます。メニュー型アプリでは、ループ構造が中心になります。"
          },
          {
            "type": "code",
            "filename": "main-loop-design.py",
            "lang": "python",
            "code": "while True:\n    print(\"1) 追加\")\n    print(\"2) 一覧\")\n    print(\"3) 状態更新\")\n    print(\"0) 終了\")\n\n    choice = input(\"選択：\")\n\n    if choice == \"1\":\n        add_todo()\n    elif choice == \"2\":\n        list_todos()\n    elif choice == \"3\":\n        update_status()\n    elif choice == \"0\":\n        break"
          },
          {
            "type": "ul",
            "items": [
              "while ループがアプリの土台になる",
              "ユーザー入力によって処理を切り替える",
              "ここまででアプリ全体の設計が完成する"
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
            Githubの使用ガイダンス
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