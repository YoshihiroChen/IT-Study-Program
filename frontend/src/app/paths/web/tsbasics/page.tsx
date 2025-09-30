"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Search, BookOpen, ChevronRight, Sun, Moon } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";

/** ---------- 内容数据类型 ---------- */
type PNode = { type: "p"; text: string };
type CodeNode = { type: "code"; code: string; lang?: string; filename?: string };
type ListNode = { type: "ul"; items: string[] };
type ContentNode = PNode | CodeNode | ListNode;

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
    key: "basics",
    title: "TypeScriptの紹介",
    lessons: [
      {
        id: "ts-intro",
        title: "TypeScriptとは",
        summary: "TS は JS の上位互換であり、静的型付けと強力なツール機能を導入します。",
        content: [
          {
            type: "p",
            text: "TypeScript は JavaScript に型システムと開発時のチェック機能を追加し、大規模プロジェクトの保守性を大幅に向上させます。",
          },
          {
            type: "code",
            filename: "hello.ts",
            lang: "ts",
            code: `let message: string = "Hello TypeScript";
console.log(message);`,
          },
          {
            type: "ul",
            items: [
              "tsconfig.json からコンパイル動作を設定",
              "ESLint / Prettier と組み合わせて一貫性と可読性を向上",
              "エディタ内での型補完やジャンプ機能が最大のメリットの一つ",
            ],
          },
        ],
        level: "basic",
        estMin: 8,
      },
      {
        id: "ts-primitive",
        title: "基本型とリテラル型",
        content: [
          {
            type: "p",
            text: "string / number / boolean / null / undefined / symbol / bigint やリテラル型の使い方を理解します。",
          },
          {
            type: "code",
            filename: "primitive.ts",
            lang: "ts",
            code: `let id: number = 42;
let mode: "light" | "dark" = "light";
mode = "dark"; // OK
// mode = "system"; // ❌ 型が一致しない`,
          },
        ],
        level: "basic",
        estMin: 10,
      },
    ],
  },
  {
    key: "features",
    title: "TypeScriptの特徴",
    lessons: [
      {
        id: "static-typing",
        title: "静的型付け",
        summary: "TS はコンパイル時に型エラーを検出し、実行時エラーを事前に防ぎます。",
        content: [
          {
            type: "p",
            text: "TypeScript は JavaScript に静的型システムを導入し、型の不一致をコンパイル段階で検出できます。これにより、実行時にバグが発生する前に防ぐことができます。",
          },
          {
            type: "code",
            filename: "static-typing.ts",
            lang: "ts",
            code: `function greet(name: string) {
  return "Hello " + name;
}

greet("Alice");    // ✅ 正常
greet(42);         // ❌ コンパイルエラー：型 'number' を 'string' に代入できない`,
          },
        ],
        level: "basic",
        estMin: 8,
      },
      {
        id: "transpile",
        title: "トランスパイル（変換）",
        summary: "TS コードは標準の JS にコンパイルされ、あらゆる JS 環境で実行されます。",
        content: [
          {
            type: "p",
            text: "TypeScript 自体はブラウザや Node.js で直接実行できません。tsc コンパイラによって標準的な JavaScript にトランスパイル（変換）され、その後実行環境で動作します。",
          },
          {
            type: "code",
            filename: "transpile.ts",
            lang: "ts",
            code: `// TypeScript ソースコード
let count: number = 10;
console.log(count * 2);`,
          },
          {
            type: "code",
            filename: "transpile.js",
            lang: "js",
            code: `// トランスパイル後の JavaScript
var count = 10;
console.log(count * 2);`,
          },
        ],
        level: "basic",
        estMin: 6,
      },
      {
        id: "type-inference",
        title: "型推論",
        summary: "TS はコンテキストから自動的に型を推論し、明示的な宣言が不要な場合もあります。",
        content: [
          {
            type: "p",
            text: "TypeScript の型システムは非常に賢く、型注釈を書かなくても初期値や文脈から型を自動的に推論します。",
          },
          {
            type: "code",
            filename: "inference.ts",
            lang: "ts",
            code: `let msg = "hello";  // string と推論される
msg = "world";      // ✅ OK
// msg = 42;        // ❌ エラー：型 'number' は 'string' に代入できない`,
          },
          {
            type: "ul",
            items: [
              "可能な限り型推論を活用して重複する注釈を減らす",
              "関数の戻り値など重要な箇所では明示的な注釈を推奨",
              "推論がうまくいかない場合は型アサーションや明示的宣言を使用",
            ],
          },
        ],
        level: "basic",
        estMin: 10,
      },
      {
        id: "structural-typing",
        title: "構造的部分型システム",
        summary: "TS は型名ではなく構造の互換性によって型が一致するかを判断します。",
        content: [
          {
            type: "p",
            text: "TypeScript は構造的部分型システム（structural typing）、別名「ダックタイピング」を採用しています。構造が一致すれば型が互換とみなされ、型名が一致する必要はありません。",
          },
          {
            type: "code",
            filename: "structural.ts",
            lang: "ts",
            code: `interface Person {
  name: string;
}

let user = { name: "Alice", age: 20 };

let p: Person = user;  // ✅ OK。構造に name: string があれば互換とみなされる`,
          },
          {
            type: "ul",
            items: [
              "「形の互換性」を重視し、「名前の一致」は不要",
              "大規模システムでの疎結合や拡張性に適している",
              "名義型システム（nominal typing）とは異なる考え方",
            ],
          },
        ],
        level: "basic",
        estMin: 12,
      },

      {
        id: "superset",
        title: "JavaScript の上位互換",
        summary: "TS は JS の上位互換であり、既存の JS コードもそのまま動作します。",
        content: [
          {
            type: "p",
            text: "TypeScript は JavaScript の上位互換（superset）として設計されており、すべての JS 構文がそのまま有効です。段階的な導入が可能なため、大規模な既存プロジェクトにも適用しやすいという特徴があります。",
          },
          {
            type: "code",
            filename: "superset.ts",
            lang: "ts",
            code: `// 既存の JavaScript コードもそのまま動作
  function add(a, b) {
    return a + b;
  }
  
  // 型を追加することで安全性と補完性が向上
  function addTyped(a: number, b: number): number {
    return a + b;
  }`,
          },
          {
            type: "ul",
            items: [
              "既存の JS から段階的に移行可能",
              "JS のすべての機能をそのまま利用可能",
              "型付けによって開発体験が向上",
            ],
          },
        ],
        level: "basic",
        estMin: 8,
      },
      {
        id: "generics",
        title: "ジェネリクス（Generics）",
        summary: "ジェネリクスを使うと、型安全性を保ちながら再利用性の高いコードを書けます。",
        content: [
          {
            type: "p",
            text: "ジェネリクス（Generics）は、関数・クラス・インターフェースを型に依存しない形で設計しつつ、使用時には具体的な型情報を保持できる強力な仕組みです。型安全性と柔軟性の両立が可能です。",
          },
          {
            type: "code",
            filename: "generics.ts",
            lang: "ts",
            code: `function identity<T>(value: T): T {
    return value;
  }
  
  let num = identity<number>(42);  // 推論されても OK
  let str = identity("hello");     // 型が "string" として保持される`,
          },
          {
            type: "ul",
            items: [
              "型の再利用と抽象化を両立できる",
              "ライブラリやユーティリティ関数で広く活用される",
              "型推論と組み合わせることで柔軟な設計が可能",
            ],
          },
        ],
        level: "intermediate",
        estMin: 12,
      },
      {
        id: "class-interface",
        title: "クラスとインターフェース",
        summary: "TS はクラスベースの OOP をサポートし、インターフェースで設計意図を明確化できます。",
        content: [
          {
            type: "p",
            text: "TypeScript はクラスや継承などのオブジェクト指向構文をサポートします。また、インターフェース（interface）によってオブジェクトの形や契約を定義し、実装と分離した設計が可能になります。",
          },
          {
            type: "code",
            filename: "class-interface.ts",
            lang: "ts",
            code: `interface Animal {
    name: string;
    speak(): void;
  }
  
  class Dog implements Animal {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
    speak() {
      console.log(this.name + " says woof!");
    }
  }
  
  const dog = new Dog("Pochi");
  dog.speak(); // "Pochi says woof!"`,
          },
          {
            type: "ul",
            items: [
              "クラスによるオブジェクト指向設計が可能",
              "インターフェースで型の契約を明示できる",
              "実装と型定義を分離することで保守性が向上",
            ],
          },
        ],
        level: "intermediate",
        estMin: 14,
      },
      {
        id: "async",
        title: "非同期処理と Promise / async/await",
        summary: "TS は JS の非同期構文を型安全に扱えます。",
        content: [
          {
            type: "p",
            text: "TypeScript は JavaScript の非同期処理（Promise、async/await）を完全にサポートし、型情報を付与することで安全なエラーハンドリングや補完が可能になります。",
          },
          {
            type: "code",
            filename: "async.ts",
            lang: "ts",
            code: `async function fetchData(url: string): Promise<string> {
    const res = await fetch(url);
    return await res.text();
  }
  
  fetchData("https://example.com")
    .then(data => console.log(data))
    .catch(err => console.error(err));`,
          },
          {
            type: "ul",
            items: [
              "async/await による同期的な記述が可能",
              "Promise の型指定でエラーハンドリングが明確化",
              "非同期処理の安全性と可読性が向上",
            ],
          },
        ],
        level: "intermediate",
        estMin: 12,
      },
      {
        id: "single-thread",
        title: "シングルスレッドモデル",
        summary: "JS と同様に TS もシングルスレッドで動作し、非同期で並行性を実現します。",
        content: [
          {
            type: "p",
            text: "TypeScript は JavaScript の実行モデルを継承しており、シングルスレッド上で動作します。イベントループと非同期処理を組み合わせることで、ブロッキングを避けながら高い並行性を実現します。",
          },
          {
            type: "code",
            filename: "eventloop.ts",
            lang: "ts",
            code: `console.log("A");
  
  setTimeout(() => {
    console.log("B");
  }, 0);
  
  console.log("C");
  
  // 出力順: A → C → B`,
          },
          {
            type: "ul",
            items: [
              "単一スレッドでもイベントループで高い並行性を実現",
              "非同期タスクとコールバックキューの理解が重要",
              "Web Worker や Node.js の Worker Threads でマルチスレッドも可能",
            ],
          },
        ],
        level: "intermediate",
        estMin: 10,
      },
    ],
  },
  {
    key: "data-structures",
    title: "TypeScriptのデータ構造",
    lessons: [
      {
        id: "primitive-types",
        title: "プリミティブ型",
        summary: "TS で基本となる 7 種類のプリミティブ型を理解します。",
        content: [
          {
            type: "p",
            text: "プリミティブ型（基本型）は、TypeScript の最も基本的なデータ型です。これらは値そのものを直接保持し、オブジェクトとは異なります。",
          },
          {
            type: "code",
            filename: "primitive.ts",
            lang: "ts",
            code: `let name: string = "Alice";
  let age: number = 25;
  let isAdmin: boolean = true;
  let big: bigint = 9007199254740991n;
  let sym: symbol = Symbol("id");
  let nothing: null = null;
  let notDefined: undefined = undefined;`,
          },
          {
            type: "ul",
            items: [
              "string / number / boolean は最も基本的な型",
              "bigint は大きな整数を扱うための型",
              "symbol は一意な識別子を表す",
              "null と undefined は「値がない」ことを明示する",
            ],
          },
        ],
        level: "basic",
        estMin: 10,
      },
      {
        id: "literal-types",
        title: "リテラル型",
        summary: "特定の値そのものを型として扱い、より厳密な制約を加えます。",
        content: [
          {
            type: "p",
            text: "リテラル型は、文字列や数値などの具体的な値そのものを型として扱います。これにより、値の取りうる範囲を限定することができます。",
          },
          {
            type: "code",
            filename: "literal.ts",
            lang: "ts",
            code: `let theme: "light" | "dark" = "light";
  theme = "dark";    // ✅ OK
  // theme = "system"; // ❌ エラー: 型 '"system"' は '\"light\" | \"dark\"' に代入できない`,
          },
          {
            type: "ul",
            items: [
              "特定の値だけを許可する型制約が可能",
              "ユニオン型と組み合わせて柔軟な設計ができる",
              "状態管理や設定値などでよく使われる",
            ],
          },
        ],
        level: "basic",
        estMin: 8,
      },
      {
        id: "any-type",
        title: "any型",
        summary: "型チェックを無効にし、あらゆる値を代入できる特別な型です。",
        content: [
          {
            type: "p",
            text: "any 型は、どんな型の値でも代入可能であり、型チェックをスキップします。便利な一方で安全性が失われるため、使用は最小限に抑えることが推奨されます。",
          },
          {
            type: "code",
            filename: "any.ts",
            lang: "ts",
            code: `let value: any = 42;
  value = "hello";     // ✅ OK
  value = true;        // ✅ OK
  value.toUpperCase(); // ✅ 実行時エラーになる可能性あり`,
          },
          {
            type: "ul",
            items: [
              "どんな値でも代入可能で、型チェックが行われない",
              "既存の JS コードを移行する際などに一時的に利用",
              "安全性が低いため、unknown 型などの代替を検討することが望ましい",
            ],
          },
        ],
        level: "basic",
        estMin: 8,
      },
      {
        id: "arrays",
        title: "配列（Array）",
        summary: "複数の同じ型の値をまとめて扱うことができるデータ構造です。",
        content: [
          {
            type: "p",
            text: "配列は同じ型のデータを一括して扱えるコレクションです。要素の型を指定することで、誤ったデータの混入を防ぎます。",
          },
          {
            type: "code",
            filename: "array.ts",
            lang: "ts",
            code: `let numbers: number[] = [1, 2, 3];
  numbers.push(4);      // ✅ OK
  // numbers.push("5"); // ❌ エラー: 'string' は 'number' に代入できない
  
  let strings: Array<string> = ["a", "b", "c"];`,
          },
          {
            type: "ul",
            items: [
              "型安全な配列を定義できる（number[] / Array<number>）",
              "push / pop などのメソッドも型チェックされる",
              "要素が複数の型を取る場合はユニオン型を使用",
            ],
          },
        ],
        level: "basic",
        estMin: 10,
      },
      {
        id: "tuples",
        title: "タプル（Tuple）",
        summary: "異なる型の要素を固定順序で格納できる特殊な配列です。",
        content: [
          {
            type: "p",
            text: "タプルは、配列の一種でありながら、要素の数や型が固定されている点が特徴です。位置ごとに異なる型を持たせたい場合に便利です。",
          },
          {
            type: "code",
            filename: "tuple.ts",
            lang: "ts",
            code: `let user: [string, number] = ["Alice", 25];
  user[0] = "Bob";   // ✅ OK
  // user[1] = "25"; // ❌ エラー: 'string' は 'number' に代入できない`,
          },
          {
            type: "ul",
            items: [
              "各要素の型と順序が固定される",
              "返り値が複数ある関数などでよく使われる",
              "読みやすさ・意図の明確化にも役立つ",
            ],
          },
        ],
        level: "basic",
        estMin: 10,
      },
    ],
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
  const [theme, setTheme] = useState<"light" | "dark">("dark");

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
          <BookOpen className="w-5 h-5 opacity-80" />
          <h1 className="text-lg font-semibold tracking-wide">プログラミング言語学習：TypeScript</h1>

          <button
            onClick={toggleTheme}
            className={`ml-auto flex items-center gap-1 px-2 py-1 rounded-lg border transition ${
              theme === "dark"
                ? "border-white/20 hover:bg-white/10"
                : "border-neutral-300 hover:bg-neutral-100"
            }`}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="text-sm">{theme === "dark" ? "白天模式" : "夜间模式"}</span>
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
              placeholder="搜索课程 / 关键词…"
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
