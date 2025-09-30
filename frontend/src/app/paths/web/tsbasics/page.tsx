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
        summary: "TypeScript は JavaScript を拡張したプログラミング言語で、静的型付けや高度な開発支援機能を提供します。",
        content: [
          {
            type: "p",
            text: "TypeScript（略して TS）は、Microsoft によって開発されたオープンソースのプログラミング言語で、JavaScript（JS）の上位互換です。つまり、既存の JavaScript コードはそのまま TypeScript として動作しつつ、さらに型システムや開発支援機能を追加して、より安全で大規模な開発を可能にします。",
          },
          {
            type: "p",
            text: "JavaScript は動的型付け言語であり、柔軟性が高い一方で、型の不一致によるバグが実行時まで発見できないという欠点があります。TypeScript はこの問題を解決し、コンパイル時に型エラーを検出することで、コードの信頼性と保守性を大きく向上させます。",
          },
          {
            type: "p",
            text: "さらに、TypeScript は豊富な型注釈や型推論、インターフェース、ジェネリクスなどの強力な機能を備えており、大規模なチーム開発や複雑なアプリケーション開発において強力な武器となります。また、tsconfig.json による柔軟なコンパイル設定や、エディタとの連携による自動補完・リファクタリング支援など、開発体験も大きく向上します。",
          },
          {
            type: "ul",
            items: [
              "JavaScript の上位互換として既存コードをそのまま活用可能",
              "静的型チェックにより実行前にバグを検出しやすくなる",
              "型推論・インターフェース・ジェネリクスなど高度な言語機能を提供",
              "エディタ補完・ジャンプ・リファクタリング支援などの開発体験が向上",
              "大規模開発や長期運用において特に効果を発揮する",
            ],
          },
        ],
        level: "basic",
        estMin: 8,
      }
      
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
        title: "プリミティブ型（Primitive Types）",
        summary: "JavaScript／TypeScript における最も基本的なデータ型で、値そのものを直接表現します。",
        content: [
          {
            type: "p",
            text: "プリミティブ型（primitive types）は、JavaScript および TypeScript における最も基本的なデータ型です。変数が値そのものを保持し、オブジェクトのように複雑な構造を持たないのが特徴です。JavaScript のデータ型は大きく分けて「プリミティブ型」と「オブジェクト型」の2つに分類されます。",
          },
          {
            type: "p",
            text: "プリミティブ型の重要な特徴の1つは「イミュータブル（immutable）」であることです。つまり、一度作成した値自体は変更できません。例えば、文字列 \"hello\" の一部だけを書き換えることはできず、新しい文字列を作成する必要があります。これに対して、オブジェクトは「ミュータブル（mutable）」であり、内部の値を後から変更できます。",
          },
          {
            type: "p",
            text: "もう一つの特徴は、プリミティブ型そのものは基本的にプロパティやメソッドを持たない点です。特に `null` や `undefined` はプロパティを持たず、メソッド呼び出しを行うとエラーになります。しかし、`string` や `number` は内部的に「オートボクシング（autoboxing）」という仕組みによって、一時的にオブジェクト化されることで、メソッドやプロパティを利用できます。",
          },
          {
            type: "p",
            text: "このオートボクシングのおかげで、たとえば文字列リテラルであっても `.length` プロパティを参照したり、数値であってもメソッドを呼び出すことが可能になります。これは JavaScript の特徴的な振る舞いであり、TypeScript においても同様に活用されます。",
          },
          {
            type: "ul",
            items: [
              "boolean型（真偽値）: `true` または `false` を表す",
              "number型（数値）: 整数や浮動小数点数などの数値を表す",
              "string型（文字列）: テキストデータを表す",
              "undefined型: 変数が宣言されたが値が未定義であることを表す",
              "null型: 明示的に「値が存在しない」ことを表す",
              "symbol型（シンボル）: 一意で不変な値を表す",
              "bigint型（長整数）: 通常の number では扱えない大きな整数を表す",
            ],
          },
          {
            type: "p",
            text: "これら 7 種類のプリミティブ型以外は、すべてオブジェクト型に分類されます。配列、関数、正規表現などもすべてオブジェクトです。TypeScript ではこれらの基本型に型注釈を付与することで、より安全で予測可能なコードを書くことができます。",
          },
        ],
        level: "basic",
        estMin: 12,
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
        id: "unknown-type",
        title: "unknown型",
        summary: "any より安全な「未知の値」を表す型で、型チェックを強制できます。",
        content: [
          {
            type: "p",
            text: "`unknown` は「まだ型がわからない値」を表すための型です。`any` と同様にどんな値も代入できますが、使用する際には型チェックが必要となるため、安全性が高まります。",
          },
          {
            type: "code",
            filename: "unknown.ts",
            lang: "ts",
            code: `let value: unknown;
  value = 42;
  value = "hello";
  
  // console.log(value.toUpperCase()); // ❌ エラー: 'unknown' 型にはこのプロパティがない
  
  // ✅ 使用する前に型チェックが必要
  if (typeof value === "string") {
    console.log(value.toUpperCase()); // OK
  }`,
          },
          {
            type: "ul",
            items: [
              "どんな値でも代入可能だが、使用時には型チェックが必須",
              "`any` より安全で、型安全性を損なわない",
              "外部データやユーザー入力など、型が不明な値に適している",
            ],
          },
        ],
        level: "intermediate",
        estMin: 10,
      },
      {
        id: "never-type",
        title: "never型",
        summary: "決して値を返さないことを示す特殊な型で、到達不能なコードを表現します。",
        content: [
          {
            type: "p",
            text: "`never` は「決して発生しない」ことを意味する型です。通常、例外を投げる関数や無限ループなど、値が返らない場面で使用されます。また、型が網羅されていない箇所を検出するためにも役立ちます。",
          },
          {
            type: "code",
            filename: "never.ts",
            lang: "ts",
            code: `function fail(message: string): never {
    throw new Error(message);
  }
  
  function loopForever(): never {
    while (true) {}
  }
  
  // 型の網羅性チェックにも利用可能
  type Shape = "circle" | "square";
  
  function area(shape: Shape) {
    switch (shape) {
      case "circle":
        return 3.14;
      case "square":
        return 4;
      default:
        const _exhaustiveCheck: never = shape; // ❌ 新しい値が追加されたらエラー
        return _exhaustiveCheck;
    }
  }`,
          },
          {
            type: "ul",
            items: [
              "値を「絶対に返さない」関数の戻り値型として使われる",
              "例外や無限ループなど特殊な制御フローに対応",
              "型の網羅性チェックにより安全性を高めることができる",
            ],
          },
        ],
        level: "intermediate",
        estMin: 12,
      },
      {
        id: "enum-type",
        title: "列挙型（enum）",
        summary: "列挙型を使うと、意味のある定数の集合を型として表現できます。",
        content: [
          {
            type: "p",
            text: "列挙型（enum）は、関連する定数値の集合に名前を付けて管理するための構文です。数値や文字列のリテラルを直接使うよりも、コードの可読性と保守性を高められます。",
          },
          {
            type: "code",
            filename: "enum.ts",
            lang: "ts",
            code: `enum Direction {
        Up,
        Down,
        Left,
        Right
      }
      
      let move: Direction = Direction.Up; // ✅ OK
      
      // 文字列列挙型も可能
      enum Color {
        Red = "RED",
        Green = "GREEN",
        Blue = "BLUE",
      }
      
      let c: Color = Color.Green;`,
          },
          {
            type: "ul",
            items: [
              "関連する定数を論理的にまとめられる",
              "数値・文字列いずれの列挙型も定義可能",
              "コードの可読性・意図の明確化に役立つ",
              "switch文などと組み合わせて安全な分岐が可能",
            ],
          },
        ],
        level: "intermediate",
        estMin: 10,
      },
      {
        id: "union-type",
        title: "ユニオン型（Union Types）",
        summary: "複数の型のいずれかを受け取れる柔軟な型表現です。",
        content: [
          {
            type: "p",
            text: "ユニオン型（|）は、「A または B のどちらか」というように、複数の型のいずれかを受け入れる柔軟な型を表現できます。複数の可能性を持つ引数や値を安全に扱いたい場合に有効です。",
          },
          {
            type: "code",
            filename: "union.ts",
            lang: "ts",
            code: `function printId(id: string | number) {
        console.log("ID:", id);
      }
      
      printId(101);      // ✅ OK
      printId("abc123"); // ✅ OK
      // printId(true);  // ❌ エラー: 'boolean' は許可されていない`,
          },
          {
            type: "ul",
            items: [
              "複数の型のいずれかを表現できる柔軟な型",
              "ユーザー入力や API レスポンスなど多様な型に対応可能",
              "型ガード（typeof / in / instanceof）と組み合わせて安全に扱える",
              "リテラル型との組み合わせで状態の種類を限定できる",
            ],
          },
        ],
        level: "basic",
        estMin: 10,
      },
      {
        id: "intersection-type",
        title: "インターセクション型（Intersection Types）",
        summary: "複数の型の性質をすべて持つ複合的な型を表現します。",
        content: [
          {
            type: "p",
            text: "インターセクション型（&）は、「A かつ B」というように、複数の型を結合してすべてのプロパティを持つ新しい型を定義できます。複数の性質をまとめて扱いたいときに便利です。",
          },
          {
            type: "code",
            filename: "intersection.ts",
            lang: "ts",
            code: `interface Person {
        name: string;
      }
      
      interface Contact {
        email: string;
      }
      
      type Employee = Person & Contact;
      
      const staff: Employee = {
        name: "Alice",
        email: "alice@example.com"
      };`,
          },
          {
            type: "ul",
            items: [
              "複数の型を組み合わせて新しい型を作成できる",
              "すべてのプロパティを持つことが保証される",
              "オブジェクトの役割が増える場面でよく使われる",
              "ジェネリクスやユニオン型と組み合わせるとさらに強力",
            ],
          },
        ],
        level: "intermediate",
        estMin: 10,
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
