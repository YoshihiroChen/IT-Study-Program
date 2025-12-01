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
    "key": "java-basics",
    "title": "Javaの基本構造",
    "lessons": [
      {
        "id": "class",
        "title": "クラスとは",
        "summary": "クラスは Java プログラムの基本単位であり、オブジェクトの設計図にあたります。",
        "content": [
          {
            "type": "p",
            "text": "Java におけるクラス（class）は、オブジェクトを作るための設計図です。プログラム内で扱うデータや振る舞い（メソッド）をまとめる役割を持ちます。"
          },
          {
            "type": "p",
            "text": "Java のプログラムは必ず 1 つ以上のクラスで構成され、クラスの中にフィールド（変数）やメソッド（関数）を定義します。"
          },
          {
            "type": "code",
            "filename": "MyClass.java",
            "lang": "java",
            "code": "public class MyClass {\n    // ここにフィールドやメソッドを書く\n}"
          },
          {
            "type": "ul",
            "items": [
              "クラスは「オブジェクトの設計図」",
              "クラスの中にフィールド（データ）とメソッド（処理）を記述",
              "Java プログラムはクラスを単位として構成される"
            ]
          }
        ],
        "level": "basic",
        "estMin": 8
      },
      {
        "id": "method",
        "title": "メソッドとは",
        "summary": "メソッドは、クラスに属する処理（関数）であり、オブジェクトの振る舞いを定義します。",
        "content": [
          {
            "type": "p",
            "text": "メソッドとは、Java のクラスの中に書かれる「処理のまとまり」です。Java では関数という言葉ではなく“メソッド”と呼びます。"
          },
          {
            "type": "p",
            "text": "引数・戻り値・アクセス修飾子などを指定して、機能を定義します。"
          },
          {
            "type": "code",
            "filename": "MethodExample.java",
            "lang": "java",
            "code": "public class MethodExample {\n    public void greet(String name) {\n        System.out.println(\"Hello, \" + name);\n    }\n}"
          },
          {
            "type": "ul",
            "items": [
              "メソッドはクラスに属する処理",
              "引数を受け取り、処理を実行し、結果を返すことができる",
              "アクセス修飾子（public / private など）を指定できる"
            ]
          }
        ],
        "level": "basic",
        "estMin": 8
      },
      {
        "id": "field",
        "title": "フィールドとは",
        "summary": "フィールドはクラスが持つデータ（値）を保持する変数です。",
        "content": [
          {
            "type": "p",
            "text": "フィールド（field）とは、クラスが持つデータを表す変数です。オブジェクトの状態（state）を表す重要な要素になります。"
          },
          {
            "type": "p",
            "text": "フィールドには型（int, String など）とアクセス修飾子を付けることができます。"
          },
          {
            "type": "code",
            "filename": "FieldExample.java",
            "lang": "java",
            "code": "public class FieldExample {\n    private int age;          // 数値のフィールド\n    public String name;       // 文字列のフィールド\n}"
          },
          {
            "type": "ul",
            "items": [
              "フィールドはクラスが持つデータ（変数）",
              "オブジェクトの状態を表す",
              "アクセス修飾子により外部からの見え方を制御できる"
            ]
          }
        ],
        "level": "basic",
        "estMin": 6
      },
      {
        "id": "main-method",
        "title": "mainメソッドとは",
        "summary": "Java プログラムの実行開始地点であり、必ずこのメソッドから処理が始まります。",
        "content": [
          {
            "type": "p",
            "text": "Java では、プログラムの実行は必ず main メソッドから開始されます。Java アプリケーションを作成する際には、必ずこのメソッドを含むクラスが必要です。"
          },
          {
            "type": "p",
            "text": "main メソッドは決められた形式で書く必要があります。"
          },
          {
            "type": "code",
            "filename": "Main.java",
            "lang": "java",
            "code": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello Java!\");\n    }\n}"
          },
          {
            "type": "ul",
            "items": [
              "Javaアプリケーションは main メソッドから実行される",
              "形式は必ず `public static void main(String[] args)`",
              "プログラムの開始点として最も重要なメソッド"
            ]
          }
        ],
        "level": "basic",
        "estMin": 10
      }
    ]
  },
  {
    "key": "java-literals",
    "title": "リテラル（Literal）",
    "lessons": [
      {
        "id": "char-literal",
        "title": "文字リテラルと文字コード",
        "summary": "文字リテラルは単一の文字を表し、内部的には Unicode（UTF-16）で管理されています。",
        "content": [
          {
            "type": "p",
            "text": "Java の文字リテラルは、単一の文字をシングルクォート（' '）で囲んで表現します。Java の char 型は Unicode（UTF-16）で表されており、世界中の文字を扱うことができます。"
          },
          {
            "type": "code",
            "filename": "CharLiteral.java",
            "lang": "java",
            "code": "char a = 'A';\nchar digit = '7';\nchar jp = '日';"
          },
          {
            "type": "p",
            "text": "Java の char 型は 16 ビットで、内部的には Unicode のコードポイントが格納されます。例えば 'A' は 65、'0' は 48 といった数値で表現されています。"
          },
          {
            "type": "ul",
            "items": [
              "単一文字は 'A' のようにシングルクォートで囲む",
              "Java の char は UTF-16（16ビット）で管理",
              "あらゆる言語の文字を表現可能"
            ]
          }
        ],
        "level": "basic",
        "estMin": 10
      },
      {
        "id": "string-literal",
        "title": "文字列リテラル",
        "summary": "文字列リテラルはダブルクォートで囲む連続した文字列です。",
        "content": [
          {
            "type": "p",
            "text": "Java では、文字列リテラルはダブルクォート（\" \"）で囲んで表現します。文字列は String クラスのインスタンスであり、文字の集まりを扱うために使用します。"
          },
          {
            "type": "code",
            "filename": "StringLiteral.java",
            "lang": "java",
            "code": "String msg = \"Hello Java\";\nString jp = \"こんにちは\";"
          },
          {
            "type": "p",
            "text": "Java の String は不変（immutable）であり、一度作られた文字列の内容は変更できません。"
          },
          {
            "type": "ul",
            "items": [
              "文字列は \"Hello\" のようにダブルクォートで囲む",
              "String はオブジェクト（クラス型）",
              "文字列は不変（immutable）で安全に扱える"
            ]
          }
        ],
        "level": "basic",
        "estMin": 8
      },
      {
        "id": "escape-sequence",
        "title": "エスケープシーケンスを使った特殊な文字の表現",
        "summary": "エスケープシーケンスにより、改行やタブなど通常入力できない文字を表現できます。",
        "content": [
          {
            "type": "p",
            "text": "文字列リテラルや文字リテラルの中で表現できない特殊な文字は、エスケープシーケンスを使って記述します。バックスラッシュ（\\\\）に続く記号で特別な意味を持たせます。"
          },
          {
            "type": "code",
            "filename": "EscapeExample.java",
            "lang": "java",
            "code": "System.out.println(\"Hello\\nWorld\"); // 改行\nSystem.out.println(\"A\\tB\");       // タブ\nchar c = '\\'';                      // シングルクォート\nString q = \"\\\"Java\\\"\";            // ダブルクォート"
          },
          {
            "type": "ul",
            "items": [
              "\\n  改行",
              "\\t  タブ",
              "\\\"  ダブルクォート",
              "\\'  シングルクォート",
              "\\\\  バックスラッシュ自身"
            ]
          }
        ],
        "level": "basic",
        "estMin": 10
      },
      {
        "id": "integer-literal",
        "title": "整数リテラル",
        "summary": "整数リテラルは int を基本とし、10進・2進・8進・16進で表現できます。",
        "content": [
          {
            "type": "p",
            "text": "Java の整数リテラルはデフォルトで int 型として扱われます。数値は 10 進数だけでなく、2 進数・8 進数・16 進数でも記述できます。"
          },
          {
            "type": "code",
            "filename": "IntegerLiteral.java",
            "lang": "java",
            "code": "int dec = 100;     // 10進数\nint bin = 0b1101;  // 2進数（prefix: 0b）\nint oct = 0123;    // 8進数（prefix: 0）\nint hex = 0x1A3F;  // 16進数（prefix: 0x）"
          },
          {
            "type": "ul",
            "items": [
              "整数リテラルの基本型は int",
              "0b で始まれば 2 進数",
              "0 で始まれば 8 進数",
              "0x で始まれば 16 進数"
            ]
          }
        ],
        "level": "basic",
        "estMin": 8
      },
      {
        "id": "float-literal",
        "title": "浮動小数点数リテラル",
        "summary": "浮動小数点数はデフォルトで double 型として扱われ、小数や指数表現を記述できます。",
        "content": [
          {
            "type": "p",
            "text": "Java の浮動小数点数リテラルはデフォルトで double 型として解釈されます。通常の小数表記に加えて、指数表記（1.23e4 のような形式）も利用できます。"
          },
          {
            "type": "code",
            "filename": "FloatLiteral.java",
            "lang": "java",
            "code": "double a = 3.14;\ndouble b = 1.2e3;   // 1.2 × 10^3 = 1200\nfloat  c = 3.14F;    // float は F を付ける"
          },
          {
            "type": "ul",
            "items": [
              "浮動小数点数の基本型は double",
              "指数表記（e または E）を使える",
              "float 型にする場合は F または f のサフィックスを付ける"
            ]
          }
        ],
        "level": "basic",
        "estMin": 10
      },
      {
        "id": "suffix-number",
        "title": "数値リテラルにサフィックスを付けて型を指定する",
        "summary": "数値リテラルには L, F, D などのサフィックスを付けて型を明示できます。",
        "content": [
          {
            "type": "p",
            "text": "Java の数値リテラルは、サフィックスを付けることで型を明示的に指定できます。整数では long を指定するために L、浮動小数点では float のために F を付けます。"
          },
          {
            "type": "code",
            "filename": "SuffixLiteral.java",
            "lang": "java",
            "code": "long big = 10000000000L; // L は long を表す\nfloat pi = 3.14F;          // F は float\ndouble d1 = 3.14;          // double（デフォルト）\ndouble d2 = 3.14D;         // D と明示してもよい"
          },
          {
            "type": "p",
            "text": "特に long の場合、int の範囲を超える数値は L を付けないとコンパイルエラーになります。"
          },
          {
            "type": "ul",
            "items": [
              "L または l：long 型",
              "F または f：float 型",
              "D または d：double 型（省略可能）",
              "デフォルトは整数＝int、浮動小数点＝double"
            ]
          }
        ],
        "level": "basic",
        "estMin": 12
      }
    ]
  },
  {
    "key": "java-variables-types",
    "title": "変数とデータ型",
    "lessons": [
      {
        "id": "what-is-variable",
        "title": "Javaにおける変数とは",
        "summary": "変数とは、プログラム中で値を一時的に保存するための“名前の付いた箱”です。",
        "content": [
          {
            "type": "p",
            "text": "Java における変数とは、値を保存するための領域に付けられた名前のことです。変数を使うことで、計算結果を保存したり、値を更新したり、他の処理に渡したりすることができます。"
          },
          {
            "type": "code",
            "filename": "VariableExample.java",
            "lang": "java",
            "code": "int number = 10;\nString msg = \"Hello\";"
          },
          {
            "type": "ul",
            "items": [
              "変数は値を保存するための“名前の付いた箱”",
              "変数には型があり、保持できる値の種類が決まっている",
              "プログラム中で何度でも値を変更できる"
            ]
          }
        ],
        "level": "basic",
        "estMin": 6
      },
      {
        "id": "declare-variable",
        "title": "変数を宣言する",
        "summary": "変数を使う前には、型と名前を指定して宣言する必要があります。",
        "content": [
          {
            "type": "p",
            "text": "Java では、変数を使用する前に必ず「型」と「変数名」を指定して宣言しなければなりません。"
          },
          {
            "type": "code",
            "filename": "DeclareVariable.java",
            "lang": "java",
            "code": "int age;\nString name;\ndouble price;"
          },
          {
            "type": "ul",
            "items": [
              "変数宣言は「型 + 変数名」で行う",
              "宣言だけでは値は入っていない",
              "後から代入することも可能"
            ]
          }
        ],
        "level": "basic",
        "estMin": 6
      },
      {
        "id": "identifier",
        "title": "変数名のつけ方（識別子）",
        "summary": "変数名は識別子と呼ばれ、命名には一定のルールがあります。",
        "content": [
          {
            "type": "p",
            "text": "変数名（識別子）には、Java の文法上のルールとコーディング規約があります。以下のルールを必ず守る必要があります。"
          },
          {
            "type": "ul",
            "items": [
              "先頭は英字、アンダースコア、またはドル記号で始める（数字で始めてはならない）",
              "2文字目以降は英数字とアンダースコアが使用可能",
              "予約語（class, int, if など）は使用不可",
              "一般的には lowerCamelCase を用いる"
            ]
          },
          {
            "type": "code",
            "filename": "IdentifierExample.java",
            "lang": "java",
            "code": "int studentCount;\nString userName;\ndouble totalPrice;"
          }
        ],
        "level": "basic",
        "estMin": 8
      },
      {
        "id": "primitive-types",
        "title": "基本のデータ型",
        "summary": "Java には 8 種類の基本データ型があり、数値・文字・真偽値などを扱います。",
        "content": [
          {
            "type": "p",
            "text": "Java のデータ型は大きく「基本データ型（プリミティブ型）」と「参照型」に分かれます。基本データ型は 8 種類あり、値そのものを直接保持します。"
          },
          {
            "type": "code",
            "filename": "PrimitiveTypes.java",
            "lang": "java",
            "code": "// 整数型\nbyte b = 10;\nshort s = 20;\nint i = 30;\nlong l = 40L;\n\n// 浮動小数点\nfloat f = 3.14F;\ndouble d = 6.28;\n\n// 文字型\nchar c = 'A';\n\n// 真偽値\nboolean flag = true;"
          },
          {
            "type": "ul",
            "items": [
              "整数型：byte, short, int, long",
              "浮動小数点型：float, double",
              "文字型：char",
              "真偽値型：boolean"
            ]
          }
        ],
        "level": "basic",
        "estMin": 10
      },
      {
        "id": "init-assign",
        "title": "変数の初期化と変数への値の代入",
        "summary": "変数は宣言だけでは中身が無いため、値を代入する必要があります。",
        "content": [
          {
            "type": "p",
            "text": "変数は宣言しただけでは値が入っていません。実際に使用する前には、必ず値を代入（初期化）する必要があります。"
          },
          {
            "type": "code",
            "filename": "InitAssign.java",
            "lang": "java",
            "code": "int age;\nage = 20;          // 代入\n\nint count = 5;      // 宣言と初期化を同時に行う"
          }
        ],
        "level": "basic",
        "estMin": 6
      },
      {
        "id": "read-variable",
        "title": "変数の値を取り出す",
        "summary": "変数に代入した値は、式の中などで自由に利用できます。",
        "content": [
          {
            "type": "p",
            "text": "代入した値は、計算式やメソッド呼び出しなど、さまざまな箇所で使用できます。"
          },
          {
            "type": "code",
            "filename": "ReadVariable.java",
            "lang": "java",
            "code": "int a = 10;\nint b = a + 5;\nSystem.out.println(b);  // 15"
          }
        ],
        "level": "basic",
        "estMin": 5
      },
      {
        "id": "type-inference",
        "title": "変数宣言で型推論を利用する",
        "summary": "Java 10 以降では var を使った型推論が可能です。",
        "content": [
          {
            "type": "p",
            "text": "Java 10 以降では、var キーワードを使って型推論を行うことができます。コンパイラが右辺から変数の型を自動的に判断します。"
          },
          {
            "type": "code",
            "filename": "TypeInference.java",
            "lang": "java",
            "code": "var n = 10;          // int と推論\nvar msg = \"Hello\";   // String と推論\nvar d = 3.14;         // double と推論"
          },
          {
            "type": "ul",
            "items": [
              "var はローカル変数にのみ使用可能",
              "可読性の低下を防ぐため、過度な使用は避ける",
              "型推論であっても静的型付けであり、動的型付けではない"
            ]
          }
        ],
        "level": "basic",
        "estMin": 10
      },
      {
        "id": "final-variable",
        "title": "final変数を定数として利用する",
        "summary": "final を付けた変数は値を変更できず、定数として扱えます。",
        "content": [
          {
            "type": "p",
            "text": "final キーワードを変数につけると、その変数は一度値を代入した後に変更できなくなります。これは定数として利用する場合に便利です。"
          },
          {
            "type": "code",
            "filename": "FinalVariable.java",
            "lang": "java",
            "code": "final int MAX_USERS = 100;\n// MAX_USERS = 200;  // ❌ エラー：再代入は不可"
          },
          {
            "type": "ul",
            "items": [
              "final 変数は一度代入した後に変更不可",
              "定数名は一般的に大文字のスネークケースで書く",
              "不変値を安全に扱える"
            ]
          }
        ],
        "level": "basic",
        "estMin": 8
      },
      {
        "id": "cast-operator",
        "title": "キャスト演算子と型変換ルール",
        "summary": "キャストにより異なる型の値を変換できますが、場合によっては情報が失われます。",
        "content": [
          {
            "type": "p",
            "text": "Java では、異なるデータ型の値を変換するためにキャスト演算子（型）を使用します。特に大きな型から小さな型に変換するときは明示的キャストが必要です。"
          },
          {
            "type": "code",
            "filename": "CastExample.java",
            "lang": "java",
            "code": "int i = 100;\nlong l = i;          // 暗黙の型変換（拡大）\n\nlong x = 1000L;\nint y = (int)x;       // 明示的キャスト（縮小）"
          },
          {
            "type": "ul",
            "items": [
              "拡大変換：小さい型 → 大きい型（自動）",
              "縮小変換：大きい型 → 小さい型（キャストが必要）",
              "縮小変換では値が失われる可能性がある"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 12
      },
      {
        "id": "automatic-conversion",
        "title": "演算の時に自動的に行われる型変換",
        "summary": "異なる型の値を混ぜて演算すると、より大きい型へ自動的に変換されます。",
        "content": [
          {
            "type": "p",
            "text": "整数と浮動小数点数を混ぜて演算する場合など、Java では自動的に型変換が行われます。これは式全体を正しい型へ広げるための仕組みです。"
          },
          {
            "type": "code",
            "filename": "AutoConvert.java",
            "lang": "java",
            "code": "int a = 10;\ndouble b = 2.5;\n\ndouble result = a + b;   // a が double に自動変換される"
          },
          {
            "type": "ul",
            "items": [
              "byte → short → int → long → float → double の順に拡大",
              "演算の結果は、より大きい型に変換される",
              "文字（char）も Unicode 数値として演算に参加する"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 10
      },
      {
        "id": "wrapper-class",
        "title": "ラッパークラスの利用",
        "summary": "ラッパークラスはプリミティブ型をオブジェクトとして扱うためのクラスです。",
        "content": [
          {
            "type": "p",
            "text": "Java では、基本データ型をオブジェクトとして扱うために「ラッパークラス（Wrapper Class）」が用意されています。例えば int には Integer、double には Double などがあります。"
          },
          {
            "type": "code",
            "filename": "WrapperExample.java",
            "lang": "java",
            "code": "int n = 10;\nInteger obj = Integer.valueOf(n);  // オートボクシング\nint m = obj;                        // アンボクシング"
          },
          {
            "type": "ul",
            "items": [
              "プリミティブ型をオブジェクトとして扱える",
              "コレクション（List, Map など）に利用できる",
              "オートボクシング／アンボクシングにより自動変換される"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 12
      }
    ]
  },
  {
    "key": "java-operators",
    "title": "演算子",
    "lessons": [
      {
        "id": "what-is-operator",
        "title": "演算子とは",
        "summary": "演算子は、値同士の計算や比較、論理判定などを行うための記号です。",
        "content": [
          {
            "type": "p",
            "text": "演算子（オペレーター）は、値と値のあいだで何らかの操作を行うための記号です。例えば足し算の + や、大小比較の >、論理演算の && などが演算子にあたります。"
          },
          {
            "type": "p",
            "text": "Java では、算術演算子・比較演算子・論理演算子・代入演算子・ビット演算子など多くの種類があり、それぞれ役割が異なります。"
          },
          {
            "type": "code",
            "filename": "OperatorOverview.java",
            "lang": "java",
            "code": "int a = 5 + 3;          // 算術演算子\nboolean b = a > 5;       // 比較演算子\nboolean c = b && true;   // 論理演算子"
          },
          {
            "type": "ul",
            "items": [
              "演算子は「値に対して操作を行う記号」",
              "算術・比較・論理・代入・ビットなどのカテゴリがある",
              "演算子を理解することで、式の意味が読み解きやすくなる"
            ]
          }
        ],
        "level": "basic",
        "estMin": 6
      },
      {
        "id": "arithmetic-operators",
        "title": "算術演算子（+ - * / %）",
        "summary": "足し算・引き算・掛け算・割り算・剰余を行う基本的な演算子です。",
        "content": [
          {
            "type": "p",
            "text": "算術演算子は、数値同士の四則演算や剰余（余り）を計算するために使います。結果の型はオペランドの型によって変化します。"
          },
          {
            "type": "code",
            "filename": "ArithmeticOperators.java",
            "lang": "java",
            "code": "int a = 10;\nint b = 3;\n\nint sum  = a + b;  // 13\nint diff = a - b;  // 7\nint prod = a * b;  // 30\nint div  = a / b;  // 3  （整数同士の割り算は小数切り捨て）\nint mod  = a % b;  // 1  （剰余・余り）"
          },
          {
            "type": "p",
            "text": "整数同士の割り算では小数部分は切り捨てられます。小数点を含む結果が欲しい場合は、どちらか一方を double や float にする必要があります。"
          },
          {
            "type": "code",
            "filename": "DivisionDouble.java",
            "lang": "java",
            "code": "int a = 10;\nint b = 3;\n\ndouble result = a / (double)b;  // 3.3333..."
          },
          {
            "type": "ul",
            "items": [
              "+：加算",
              "-：減算",
              "*：乗算",
              "/：除算（整数同士だと小数は切り捨て）",
              "%：剰余（割り算の余り）"
            ]
          }
        ],
        "level": "basic",
        "estMin": 10
      },
      {
        "id": "assignment-operators",
        "title": "代入演算子と複合代入演算子",
        "summary": "値を変数に代入する「=」と、計算と代入を同時に行う複合代入演算子について説明します。",
        "content": [
          {
            "type": "p",
            "text": "代入演算子 = は、右辺の値を左辺の変数に代入する演算子です。Java では「右辺 → 左辺」の向きで値がコピーされ、左辺の変数の中身が更新されます。"
          },
          {
            "type": "code",
            "filename": "AssignmentBasic.java",
            "lang": "java",
            "code": "int a = 5;\na = 10;  // a の値を 10 に更新"
          },
          {
            "type": "p",
            "text": "複合代入演算子は、算術演算と代入をまとめて書ける記法です。例えば a += 3 は a = a + 3 と同じ意味になります。コードを簡潔に書ける反面、使いすぎると読みづらくなるので注意が必要です。"
          },
          {
            "type": "code",
            "filename": "CompoundAssignment.java",
            "lang": "java",
            "code": "int x = 10;\nx += 5;  // x = x + 5;   → x は 15\nx -= 2;  // x = x - 2;   → x は 13\nx *= 3;  // x = x * 3;   → x は 39\nx /= 4;  // x = x / 4;   → x は 9\nx %= 5;  // x = x % 5;   → x は 4"
          },
          {
            "type": "ul",
            "items": [
              "代入演算子 = は「右辺を左辺にコピー」する",
              "複合代入演算子（+=, -=, *=, /=, %= など）で記述を簡略化",
              "読みやすさとのバランスを意識して使う"
            ]
          }
        ],
        "level": "basic",
        "estMin": 10
      },
      {
        "id": "relational-operators",
        "title": "比較演算子（関係演算子）",
        "summary": "2 つの値の大小や等しさを比較し、boolean 型の結果を返す演算子です。",
        "content": [
          {
            "type": "p",
            "text": "比較演算子（関係演算子）は、2 つの値の大小関係や等しさを調べるために使用します。結果は必ず boolean 型（true または false）になります。"
          },
          {
            "type": "code",
            "filename": "RelationalOperators.java",
            "lang": "java",
            "code": "int a = 5;\nint b = 10;\n\nboolean r1 = (a == b);  // 等しい\nboolean r2 = (a != b);  // 等しくない\nboolean r3 = (a < b);   // より小さい\nboolean r4 = (a <= b);  // 以下\nboolean r5 = (a > b);   // より大きい\nboolean r6 = (a >= b);  // 以上"
          },
          {
            "type": "p",
            "text": "注意点として、オブジェクト（String など）の比較に == を使うと「同じインスタンスかどうか（参照の等価性）」を比較してしまいます。文字列の内容を比較する場合は equals メソッドを使います。"
          },
          {
            "type": "code",
            "filename": "StringCompare.java",
            "lang": "java",
            "code": "String s1 = \"Java\";\nString s2 = \"Java\";\n\nboolean a1 = (s1 == s2);        // 参照の比較\nboolean a2 = s1.equals(s2);     // 内容の比較（こちらを使う）"
          },
          {
            "type": "ul",
            "items": [
              "比較演算子の結果は boolean 型になる",
              "数値や char の比較に使う",
              "オブジェクトの内容比較には equals を使用する"
            ]
          }
        ],
        "level": "basic",
        "estMin": 12
      },
      {
        "id": "logical-operators",
        "title": "論理演算子（&& || !）と短絡評価",
        "summary": "真偽値同士の AND / OR / NOT を表す演算子と、その評価順序について説明します。",
        "content": [
          {
            "type": "p",
            "text": "論理演算子は、boolean 型の値を組み合わせて複雑な条件を表現するために使います。主なものは AND（&&）、OR（||）、NOT（!）です。"
          },
          {
            "type": "code",
            "filename": "LogicalOperators.java",
            "lang": "java",
            "code": "boolean a = true;\nboolean b = false;\n\nboolean r1 = a && b;  // AND：両方 true のときだけ true\nboolean r2 = a || b;  // OR ：どちらかが true なら true\nboolean r3 = !a;      // NOT：true ⇔ false を反転"
          },
          {
            "type": "p",
            "text": "Java の && と || は「短絡評価（ショートサーキット）」を行います。例えば、a && b の場合、a が false のとき b は評価されません。これにより、例外を避けるための安全な条件式を記述できます。"
          },
          {
            "type": "code",
            "filename": "ShortCircuit.java",
            "lang": "java",
            "code": "String s = null;\n\n// s が null でないかどうか先に確認する\nif (s != null && s.length() > 0) {\n    System.out.println(\"空でない文字列です\");\n}"
          },
          {
            "type": "ul",
            "items": [
              "&&：両方が true のときに true（AND）",
              "||：どちらかが true なら true（OR）",
              "! ：true と false を反転（NOT）",
              "短絡評価により、不要な評価や例外を防げる"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 14
      },
      {
        "id": "inc-dec-operators",
        "title": "インクリメント・デクリメント演算子",
        "summary": "変数の値を 1 ずつ増減させる ++ と -- 演算子について学びます。",
        "content": [
          {
            "type": "p",
            "text": "インクリメント演算子（++）とデクリメント演算子（--）は、変数の値を 1 だけ増減させるための演算子です。for 文などでカウンタとしてよく使われます。"
          },
          {
            "type": "code",
            "filename": "IncDecBasic.java",
            "lang": "java",
            "code": "int x = 5;\n\nx++;   // x = x + 1; → 6\nx--;   // x = x - 1; → 5"
          },
          {
            "type": "p",
            "text": "前置（++x）と後置（x++）では「式として評価したとき」のタイミングが異なります。単独で使うぶんには大きな違いはありませんが、式の中で使うと挙動が変わるので注意が必要です。"
          },
          {
            "type": "code",
            "filename": "IncDecOrder.java",
            "lang": "java",
            "code": "int a = 5;\nint b = a++;  // b に 5 が代入された後、a が 6 になる\n\nint c = 5;\nint d = ++c;  // c が 6 になってから、d に 6 が代入される"
          },
          {
            "type": "ul",
            "items": [
              "++：1 を加算するインクリメント演算子",
              "--：1 を減算するデクリメント演算子",
              "前置と後置で評価タイミングが異なるので注意"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 12
      },
      {
        "id": "conditional-operator",
        "title": "条件演算子（三項演算子）",
        "summary": "if-else を 1 行で書けるコンパクトな条件式を表現する演算子です。",
        "content": [
          {
            "type": "p",
            "text": "条件演算子（? :）は、if-else 文を簡潔に書くための演算子です。「条件 ? 真のときの値 : 偽のときの値」という形で記述し、式として値を返します。"
          },
          {
            "type": "code",
            "filename": "ConditionalOperator.java",
            "lang": "java",
            "code": "int score = 80;\nString result = (score >= 70) ? \"合格\" : \"不合格\";\nSystem.out.println(result);  // 「合格」と表示"
          },
          {
            "type": "p",
            "text": "条件演算子は 1 行で書ける反面、ネスト（入れ子）にすると読みにくくなります。複雑な条件分岐は通常の if-else 文を使うほうが安全です。"
          },
          {
            "type": "ul",
            "items": [
              "構文：条件式 ? 条件が true のときの値 : false のときの値",
              "式として値を返すので、変数の初期化などに便利",
              "複雑になりすぎる場合は if-else に戻した方がよい"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 10
      },
      {
        "id": "bitwise-operators",
        "title": "ビット演算子とシフト演算子",
        "summary": "整数値をビット単位で操作する演算子の概要を学びます。",
        "content": [
          {
            "type": "p",
            "text": "ビット演算子は、数値の「ビット列」に対して AND や OR などの処理を行う演算子です。低レベルな処理やフラグ管理などで使われます。"
          },
          {
            "type": "code",
            "filename": "BitwiseOperators.java",
            "lang": "java",
            "code": "int a = 0b0101;   // 5\nint b = 0b0011;   // 3\n\nint and  = a & b;  // 0b0001 = 1\nint or   = a | b;  // 0b0111 = 7\nint xor  = a ^ b;  // 0b0110 = 6\nint not  = ~a;     // ビット反転"
          },
          {
            "type": "p",
            "text": "シフト演算子は、ビット列を左や右にずらす演算子です。<< は左シフト、>> は符号付き右シフト、>>> は符号なし右シフトを表します。"
          },
          {
            "type": "code",
            "filename": "ShiftOperators.java",
            "lang": "java",
            "code": "int x = 1;        // 0b0001\nint y = x << 2;   // 0b0100 = 4\nint z = y >> 1;   // 0b0010 = 2"
          },
          {
            "type": "ul",
            "items": [
              "&, |, ^, ~：ビット単位の AND / OR / XOR / NOT",
              "<<, >>, >>>：ビットシフト演算子",
              "フラグ管理・高速な計算などで利用される"
            ]
          }
        ],
        "level": "advanced",
        "estMin": 15
      },
      {
        "id": "string-concat",
        "title": "文字列連結演算子としての +",
        "summary": "+ は数値の加算だけでなく、文字列を連結する演算子としても使われます。",
        "content": [
          {
            "type": "p",
            "text": "Java では、+ 演算子は数値の加算だけでなく、文字列同士、または文字列と他の型の値を連結するためにも使われます。"
          },
          {
            "type": "code",
            "filename": "StringConcat.java",
            "lang": "java",
            "code": "String name = \"Java\";\nint version = 17;\nString msg = name + \" \" + version;\nSystem.out.println(msg);  // \"Java 17\""
          },
          {
            "type": "p",
            "text": "片方が文字列であれば、もう片方の値は toString 相当の文字列に変換された上で連結されます。ただし、多数の連結を繰り返すとパフォーマンスに影響するため、必要に応じて StringBuilder を使います。"
          },
          {
            "type": "code",
            "filename": "StringBuilderExample.java",
            "lang": "java",
            "code": "StringBuilder sb = new StringBuilder();\nsb.append(\"Hello\");\nsb.append(\" \");\nsb.append(\"Java\");\nString result = sb.toString();"
          },
          {
            "type": "ul",
            "items": [
              "+ は数値の加算と文字列連結の 2 つの意味を持つ",
              "片方が文字列なら、もう片方も文字列に変換される",
              "大量連結には StringBuilder の利用を検討する"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 10
      },
      {
        "id": "precedence",
        "title": "演算子の優先順位と括弧",
        "summary": "複数の演算子が混ざった式では、優先順位と結合規則を意識する必要があります。",
        "content": [
          {
            "type": "p",
            "text": "1 つの式の中に複数の演算子が含まれている場合、Java は「演算子の優先順位」と「結合規則」に従って評価を行います。例えば、乗算・除算は加算・減算よりも優先されます。"
          },
          {
            "type": "code",
            "filename": "Precedence.java",
            "lang": "java",
            "code": "int a = 2 + 3 * 4;      // 2 + (3 * 4) = 14\nint b = (2 + 3) * 4;    // (2 + 3) * 4 = 20"
          },
          {
            "type": "p",
            "text": "優先順位をすべて暗記する必要はありませんが、少しでもあいまいに感じたら括弧で明示することが推奨されます。括弧を使うことで、自分にも他人にも意図が伝わりやすくなります。"
          },
          {
            "type": "ul",
            "items": [
              "* / % は + - より優先される",
              "比較演算子は算術演算子より後に評価される",
              "あいまいな式は括弧で意図を明確にするのがベストプラクティス"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 12
      }
    ]
  },
  {
    "key": "java-loops",
    "title": "繰り返し処理",
    "lessons": [
      {
        "id": "loops-overview",
        "title": "繰り返し処理とは",
        "summary": "同じ処理を何度も実行するための仕組みが「繰り返し処理（ループ）」です。",
        "content": [
          {
            "type": "p",
            "text": "プログラムでは「1〜10 まで足し合わせる」「リストの中身を順番に表示する」など、同じパターンの処理を何度も実行したい場面がよくあります。こうした処理を簡潔に書くための仕組みが繰り返し処理（ループ）です。"
          },
          {
            "type": "p",
            "text": "Java では主に while 文、do-while 文、for 文、拡張 for 文（for-each）といった構文を使って繰り返し処理を行います。"
          },
          {
            "type": "code",
            "filename": "LoopOverview.java",
            "lang": "java",
            "code": "int i = 0;\nwhile (i < 5) {\n    System.out.println(i);\n    i++;\n}"
          },
          {
            "type": "ul",
            "items": [
              "同じパターンの処理を何度も実行するためにループを使う",
              "代表的な構文は while, do-while, for, 拡張for",
              "ループには必ず「終了条件」を設けることが重要"
            ]
          }
        ],
        "level": "basic",
        "estMin": 8
      },
      {
        "id": "while-loop",
        "title": "while文の基本",
        "summary": "while 文は「条件が true のあいだ繰り返す」シンプルなループです。",
        "content": [
          {
            "type": "p",
            "text": "while 文は、最も基本的な繰り返し構文の一つです。条件式が true のあいだ、ブロック内の処理を繰り返し実行します。条件が最初から false の場合、1 回も実行されません。"
          },
          {
            "type": "code",
            "filename": "WhileBasic.java",
            "lang": "java",
            "code": "int i = 0;\nwhile (i < 3) {\n    System.out.println(\"i = \" + i);\n    i++;   // カウンタを更新しないと無限ループになる\n}"
          },
          {
            "type": "ul",
            "items": [
              "構文：while (条件式) { 繰り返したい処理 }",
              "ループに入る前に条件式が評価される（前判定）",
              "変数の更新を忘れると無限ループの原因になる"
            ]
          }
        ],
        "level": "basic",
        "estMin": 10
      },
      {
        "id": "do-while-loop",
        "title": "do-while文（必ず1回は実行されるループ）",
        "summary": "do-while 文は、少なくとも 1 回は必ず実行される繰り返し構文です。",
        "content": [
          {
            "type": "p",
            "text": "do-while 文は、処理ブロックを先に実行し、その後に条件式を評価するループ構文です。そのため、条件が最初から false であっても、必ず 1 回は実行されます。"
          },
          {
            "type": "code",
            "filename": "DoWhileBasic.java",
            "lang": "java",
            "code": "int i = 5;\ndo {\n    System.out.println(\"i = \" + i);\n    i++;\n} while (i < 3);  // 条件は false だが、1 回は実行される"
          },
          {
            "type": "ul",
            "items": [
              "構文：do { 処理 } while (条件式);",
              "後判定型のループ：少なくとも 1 回は処理が行われる",
              "ユーザー入力を 1 回は必ず受け取りたい場合などに有効"
            ]
          }
        ],
        "level": "basic",
        "estMin": 10
      },
      {
        "id": "for-loop-basic",
        "title": "for文の基本構造",
        "summary": "for 文は「初期化・条件・更新」を 1 行にまとめて書けるループです。",
        "content": [
          {
            "type": "p",
            "text": "for 文は、カウンタを使った繰り返しに適した構文です。「初期化」「繰り返し条件」「カウンタの更新」を 1 行にまとめて書くことができます。"
          },
          {
            "type": "code",
            "filename": "ForBasic.java",
            "lang": "java",
            "code": "for (int i = 0; i < 5; i++) {\n    System.out.println(\"i = \" + i);\n}"
          },
          {
            "type": "p",
            "text": "for 文のカッコ内には、セミコロンで区切って 3 つの部分を書きます。"
          },
          {
            "type": "ul",
            "items": [
              "初期化式：ループ開始時に一度だけ実行される（例：int i = 0）",
              "条件式：各ループ前に評価され、true の間だけ繰り返す（例：i < 5）",
              "更新式：ループの最後に実行される（例：i++）"
            ]
          }
        ],
        "level": "basic",
        "estMin": 12
      },
      {
        "id": "enhanced-for",
        "title": "拡張for文（for-each文）",
        "summary": "配列やコレクションの全要素を順番に処理するのに便利な構文です。",
        "content": [
          {
            "type": "p",
            "text": "拡張 for 文（for-each 文）は、配列や List などの全要素を順番に取り出して処理する場合に便利な構文です。インデックスを自分で管理する必要がなく、コードが簡潔になります。"
          },
          {
            "type": "code",
            "filename": "EnhancedFor.java",
            "lang": "java",
            "code": "int[] numbers = {1, 2, 3, 4};\nfor (int n : numbers) {\n    System.out.println(n);\n}"
          },
          {
            "type": "ul",
            "items": [
              "構文：for (要素の型 変数名 : 配列またはコレクション) { 処理 }",
              "インデックス操作が不要で読みやすい",
              "要素を変更したり、添字が必要な場合は通常の for 文を使う"
            ]
          }
        ],
        "level": "basic",
        "estMin": 10
      },
      {
        "id": "nested-loops",
        "title": "ネストしたループ（多重ループ）",
        "summary": "ループの中にさらにループを入れることで、二重・三重の繰り返し処理を表現できます。",
        "content": [
          {
            "type": "p",
            "text": "ループの中に別のループを書くことをネスト（入れ子）と呼びます。二重ループは、2 次元の表や九九のような繰り返しに向いています。"
          },
          {
            "type": "code",
            "filename": "NestedLoop.java",
            "lang": "java",
            "code": "for (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= 3; j++) {\n        System.out.println(\"i=\" + i + \", j=\" + j);\n    }\n}"
          },
          {
            "type": "ul",
            "items": [
              "二重ループは「外側の周回 × 内側の周回」の回数だけ実行される",
              "ネストが深くなると可読性・性能が低下しやすい",
              "必要以上に三重・四重ループを増やさない設計も重要"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 12
      },
      {
        "id": "break-continue",
        "title": "break文とcontinue文",
        "summary": "ループを途中で抜けたり、次の周回へスキップするための制御構文です。",
        "content": [
          {
            "type": "p",
            "text": "break 文と continue 文は、ループの流れを制御するためのキーワードです。条件に応じてループを途中で終わらせたり、一部の処理をスキップしたりできます。"
          },
          {
            "type": "code",
            "filename": "BreakContinue.java",
            "lang": "java",
            "code": "for (int i = 0; i < 10; i++) {\n    if (i == 5) {\n        break;           // ループ全体を抜ける\n    }\n    if (i % 2 == 0) {\n        continue;        // 以下をスキップして次の i へ\n    }\n    System.out.println(i); // 奇数のみ表示\n}"
          },
          {
            "type": "ul",
            "items": [
              "break：一番内側のループから即座に抜ける",
              "continue：その周回の残り処理をスキップし、次の周回へ進む",
              "乱用するとコードの読みやすさが下がるので、ロジック整理も合わせて検討する"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 14
      },
      {
        "id": "infinite-loops",
        "title": "無限ループと終了条件の設計",
        "summary": "終了条件を誤るとループが止まらなくなるため、条件設計が重要です。",
        "content": [
          {
            "type": "p",
            "text": "繰り返し処理では「いつ終わるのか」を明確に設計することが非常に重要です。終了条件の記述やカウンタの更新を間違えると、処理が永久に終わらない無限ループになってしまいます。"
          },
          {
            "type": "code",
            "filename": "InfiniteLoop.java",
            "lang": "java",
            "code": "// 意図的な無限ループの例\nwhile (true) {\n    // 何らかの処理\n    if (shouldStop()) {\n        break;   // 条件を満たしたら抜ける\n    }\n}"
          },
          {
            "type": "p",
            "text": "ユーザー入力待ちやサーバー常駐処理など、あえて無限ループを使うケースもありますが、その場合でも必ず「抜ける条件」や「終了処理」を設けるべきです。"
          },
          {
            "type": "ul",
            "items": [
              "カウンタの更新漏れが典型的な無限ループの原因",
              "条件式は「いつ false になるのか」を意識して設計する",
              "意図的な無限ループにも終了条件・安全装置を入れるのが基本"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 12
      }
    ]
  },
  {
    "key": "java-conditions",
    "title": "条件分岐",
    "lessons": [
      {
        "id": "conditions-overview",
        "title": "条件分岐とは",
        "summary": "条件分岐は「状況に応じて実行する処理を変える」ための仕組みです。",
        "content": [
          {
            "type": "p",
            "text": "条件分岐（ブランチ）は、プログラムに「もし〜なら〜する、そうでなければ〜する」という選択を与える構文です。ユーザーの入力や変数の値に応じて処理内容を変えることで、柔軟なロジックを実現できます。"
          },
          {
            "type": "p",
            "text": "Java では代表的な条件分岐として if 文と switch 文があります。if 文は柔軟な条件表現に、switch 文は限られた値の分岐を簡潔に書くのに適しています。"
          },
          {
            "type": "code",
            "filename": "ConditionOverview.java",
            "lang": "java",
            "code": "int score = 80;\n\nif (score >= 70) {\n    System.out.println(\"合格\");\n} else {\n    System.out.println(\"不合格\");\n}"
          },
          {
            "type": "ul",
            "items": [
              "条件分岐は「状況に応じた処理の切り替え」を行う",
              "if 文：柔軟な条件式を扱える",
              "switch 文：特定の値ごとの分岐を簡潔に書ける"
            ]
          }
        ],
        "level": "basic",
        "estMin": 8
      },
      {
        "id": "if-basic",
        "title": "if文の基本",
        "summary": "if 文は、条件が true のときだけ処理を実行する最も基本的な条件分岐構文です。",
        "content": [
          {
            "type": "p",
            "text": "if 文は「条件が true のときだけブロック内の処理を実行する」構文です。条件式には boolean 型の式（true または false を返す式）を書く必要があります。"
          },
          {
            "type": "code",
            "filename": "IfBasic.java",
            "lang": "java",
            "code": "int age = 20;\n\nif (age >= 18) {\n    System.out.println(\"成人です\");\n}"
          },
          {
            "type": "ul",
            "items": [
              "構文：if (条件式) { 実行したい処理 }",
              "条件式は boolean 型（true / false）でなければならない",
              "条件が false の場合は、ブロック内の処理は一切実行されない"
            ]
          }
        ],
        "level": "basic",
        "estMin": 8
      },
      {
        "id": "if-else-elseif",
        "title": "if-else文とelse-ifによる多分岐",
        "summary": "if-else と else-if を組み合わせることで「条件に応じて複数パターンの処理」を書くことができます。",
        "content": [
          {
            "type": "p",
            "text": "if-else 文は「条件が true のとき」と「それ以外のとき」の 2 パターンの処理を切り替える構文です。また、else-if を使うことで 3 パターン以上の多分岐も表現できます。"
          },
          {
            "type": "code",
            "filename": "IfElseBasic.java",
            "lang": "java",
            "code": "int score = 75;\n\nif (score >= 80) {\n    System.out.println(\"とても良い\");\n} else if (score >= 60) {\n    System.out.println(\"普通\");\n} else {\n    System.out.println(\"頑張りましょう\");\n}"
          },
          {
            "type": "p",
            "text": "上から順に条件が評価され、最初に true になったブロックだけが実行されます。一度どこかが実行されると、残りの条件は評価されません。"
          },
          {
            "type": "ul",
            "items": [
              "if-else：true と false の 2 パターンを切り替える",
              "else-if：条件を順番にチェックし、最初に一致したものを実行",
              "条件の順番や範囲が重ならないように設計することが重要"
            ]
          }
        ],
        "level": "basic",
        "estMin": 10
      },
      {
        "id": "nested-if",
        "title": "ネストしたif文とガード節",
        "summary": "if の中にさらに if を書くネストを理解しつつ、読みやすい書き方（ガード節）も学びます。",
        "content": [
          {
            "type": "p",
            "text": "if 文の中に別の if 文を書くことをネスト（入れ子）と呼びます。条件が増えるほどネストが深くなりやすく、読みづらくなることがあります。"
          },
          {
            "type": "code",
            "filename": "NestedIf.java",
            "lang": "java",
            "code": "int age = 20;\nboolean hasTicket = true;\n\nif (age >= 18) {\n    if (hasTicket) {\n        System.out.println(\"入場できます\");\n    }\n}"
          },
          {
            "type": "p",
            "text": "ネストが深くなりすぎる場合は、「ガード節」と呼ばれる書き方で、早めに条件を否定して return や break することで、分岐を平らにするのが有効です。"
          },
          {
            "type": "code",
            "filename": "GuardClause.java",
            "lang": "java",
            "code": "void enter(int age, boolean hasTicket) {\n    if (age < 18) {\n        System.out.println(\"未成年は入場できません\");\n        return;   // ここで終了\n    }\n    if (!hasTicket) {\n        System.out.println(\"チケットが必要です\");\n        return;\n    }\n    System.out.println(\"入場できます\");\n}"
          },
          {
            "type": "ul",
            "items": [
              "ネストした if が増えるとロジックが追いにくくなる",
              "ガード節で「ダメな条件」を先に弾くと読みやすくなる",
              "早期 return / continue / break を活用して分岐を整理する"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 12
      },
      {
        "id": "switch-basic",
        "title": "switch文の基本",
        "summary": "switch 文は、一つの値に対して複数の候補から処理を切り替えるときに便利な構文です。",
        "content": [
          {
            "type": "p",
            "text": "switch 文は、ある式の値に応じて複数の分岐から 1 つを選ぶ構文です。if-else-if が長くなる場合、switch を使うことで可読性が向上することがあります。"
          },
          {
            "type": "code",
            "filename": "SwitchBasic.java",
            "lang": "java",
            "code": "int day = 3;\n\nswitch (day) {\n    case 1:\n        System.out.println(\"月曜日\");\n        break;\n    case 2:\n        System.out.println(\"火曜日\");\n        break;\n    case 3:\n        System.out.println(\"水曜日\");\n        break;\n    default:\n        System.out.println(\"その他の曜日\");\n        break;\n}"
          },
          {
            "type": "p",
            "text": "各 case の最後に break を書かないと、次の case に「そのまま流れてしまう（フォールスルー）」ので注意が必要です。これをあえて利用する書き方もありますが、慣れないうちは基本的に各 case ごとに break を書きます。"
          },
          {
            "type": "ul",
            "items": [
              "switch (式) に指定できるのは限定された型（int, enum, String など）",
              "各 case ラベルには重複しない定数値を指定する",
              "default はどの case にも一致しなかったときの処理（省略可能）"
            ]
          }
        ],
        "level": "basic",
        "estMin": 12
      },
      {
        "id": "switch-string-enum",
        "title": "String・enumでのswitch文",
        "summary": "Java では整数だけでなく、文字列や列挙型（enum）に対しても switch が利用できます。",
        "content": [
          {
            "type": "p",
            "text": "Java では、int だけでなく String や enum 型に対しても switch 文を使うことができます。文字列の値ごとの分岐や、列挙型の状態ごとの処理分けに便利です。"
          },
          {
            "type": "code",
            "filename": "SwitchString.java",
            "lang": "java",
            "code": "String command = \"start\";\n\nswitch (command) {\n    case \"start\":\n        System.out.println(\"開始します\");\n        break;\n    case \"stop\":\n        System.out.println(\"停止します\");\n        break;\n    default:\n        System.out.println(\"不明なコマンドです\");\n        break;\n}"
          },
          {
            "type": "code",
            "filename": "SwitchEnum.java",
            "lang": "java",
            "code": "enum State { READY, RUNNING, FINISHED }\n\nState state = State.RUNNING;\n\nswitch (state) {\n    case READY:\n        System.out.println(\"準備中\");\n        break;\n    case RUNNING:\n        System.out.println(\"実行中\");\n        break;\n    case FINISHED:\n        System.out.println(\"完了\");\n        break;\n}"
          },
          {
            "type": "ul",
            "items": [
              "String の switch は if-else の連続よりもスッキリ書ける",
              "enum と switch は相性が良く、状態遷移の表現に向いている",
              "どのケースにも当てはまらない場合は default を用意しておく"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 14
      },
      {
        "id": "switch-expression",
        "title": "switch式（モダンな書き方）",
        "summary": "Java 14 以降で導入された switch 式を使うと、分岐結果をそのまま値として受け取ることができます。",
        "content": [
          {
            "type": "p",
            "text": "Java 14 以降では、switch を「文」ではなく「式」として使うことができます。switch 式は分岐の結果として値を返すため、変数の初期化やメソッドの戻り値としてそのまま利用できます。"
          },
          {
            "type": "code",
            "filename": "SwitchExpression.java",
            "lang": "java",
            "code": "int day = 3;\n\nString label = switch (day) {\n    case 1 -> \"月\";\n    case 2 -> \"火\";\n    case 3 -> \"水\";\n    case 4 -> \"木\";\n    case 5 -> \"金\";\n    case 6, 7 -> \"週末\";\n    default -> \"不明\";\n};\n\nSystem.out.println(label);"
          },
          {
            "type": "p",
            "text": "switch 式では -> を使った矢印構文を用い、通常は break が不要になります。また、複数の値を 1 つのケースにまとめることも簡単です。"
          },
          {
            "type": "ul",
            "items": [
              "switch を「式」として使い、その結果を変数に代入できる",
              "矢印構文（case X -> ...）では break が不要",
              "Java のバージョンにより利用可否が異なる点に注意"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 14
      },
      {
        "id": "conditions-best-practices",
        "title": "条件分岐を読みやすく書くコツ",
        "summary": "ネストを浅く保ち、意味のある条件名・順番を意識することで、読みやすい条件分岐を書けます。",
        "content": [
          {
            "type": "p",
            "text": "条件分岐が増えると、コードがすぐに読みづらくなります。将来の自分や他人が理解しやすいように、条件式の書き方や構造を工夫することが重要です。"
          },
          {
            "type": "ul",
            "items": [
              "ネストを減らすためにガード節（早期 return）を活用する",
              "複雑な条件式は一度変数に代入し、名前で意味を明示する",
              "条件の順番を「発生しやすい / 重要なもの」から書く",
              "同じ分岐が増えてきたら、switch や別メソッドへの切り出しを検討する"
            ]
          },
          {
            "type": "code",
            "filename": "ReadableCondition.java",
            "lang": "java",
            "code": "boolean isAdult = age >= 18;\nboolean hasTicket = ticketCount > 0;\n\nif (!isAdult) {\n    System.out.println(\"未成年は入場できません\");\n    return;\n}\n\nif (!hasTicket) {\n    System.out.println(\"チケットが必要です\");\n    return;\n}\n\nSystem.out.println(\"入場できます\");"
          }
        ],
        "level": "intermediate",
        "estMin": 12
      }
    ]
  },
  {
    "key": "java-arrays",
    "title": "配列",
    "lessons": [
      {
        "id": "arrays-overview",
        "title": "配列とは",
        "summary": "配列は「同じ型の複数の値をまとめて管理する」ための仕組みです。",
        "content": [
          {
            "type": "p",
            "text": "配列（array）は、複数の値を一つの変数名でまとめて扱うためのデータ構造です。Java の配列は「同じデータ型」の値を、固定長で連続的に管理します。"
          },
          {
            "type": "p",
            "text": "配列はリストやコレクションと異なり、最初に作成した後で「長さを変更する」ことはできません。その分、軽量で高速なデータアクセスが可能です。"
          },
          {
            "type": "code",
            "filename": "ArrayOverview.java",
            "lang": "java",
            "code": "int[] scores = { 80, 70, 90 };\nSystem.out.println(scores[1]); // 70"
          },
          {
            "type": "ul",
            "items": [
              "複数の値をまとめて管理できる",
              "すべての要素は同じ型",
              "長さは固定（後から変更不可）",
              "インデックスは 0 から始まる"
            ]
          }
        ],
        "level": "basic",
        "estMin": 8
      },
      {
        "id": "array-declare-init",
        "title": "配列の宣言と初期化",
        "summary": "配列は「型」「[]」「変数名」を記述して宣言し、new で生成するか、リテラルで初期化します。",
        "content": [
          {
            "type": "p",
            "text": "配列は次のように宣言します。型の後に [] を付けることで「その型の配列」であることを示します。"
          },
          {
            "type": "code",
            "filename": "ArrayDeclare.java",
            "lang": "java",
            "code": "// 配列の宣言\nint[] numbers;\n\n// 生成と初期化\nnumbers = new int[3]; // 長さ 3 の配列が生成される\n\n// 初期値は型に応じたデフォルト値になる\n// int → 0, double → 0.0, boolean → false, 参照型 → null"
          },
          {
            "type": "p",
            "text": "宣言と同時に初期化することもできます。配列リテラルを使うと簡単に書けます。"
          },
          {
            "type": "code",
            "filename": "ArrayLiteral.java",
            "lang": "java",
            "code": "int[] scores = { 50, 60, 70, 80 };\nString[] names = { \"Aki\", \"Mina\", \"Taro\" };"
          },
          {
            "type": "ul",
            "items": [
              "型 + [] を付けて宣言する",
              "new 型[長さ] で生成する",
              "リテラル { ... } を使うと即値で初期化できる"
            ]
          }
        ],
        "level": "basic",
        "estMin": 10
      },
      {
        "id": "array-access",
        "title": "配列要素へのアクセス",
        "summary": "配列の要素へは 0 から始まるインデックス番号でアクセスします。",
        "content": [
          {
            "type": "p",
            "text": "配列の各要素には、インデックス番号を使ってアクセスします。Java の配列は 0 から始まるため、最初の要素は index 0 です。"
          },
          {
            "type": "code",
            "filename": "ArrayAccess.java",
            "lang": "java",
            "code": "int[] scores = { 90, 80, 70 };\n\nSystem.out.println(scores[0]); // 90\nscores[1] = 85;               // 要素を更新\nSystem.out.println(scores[1]); // 85"
          },
          {
            "type": "p",
            "text": "存在しないインデックスにアクセスすると、実行時に例外（ArrayIndexOutOfBoundsException）が発生します。"
          },
          {
            "type": "code",
            "filename": "ArrayException.java",
            "lang": "java",
            "code": "int[] arr = new int[3];\nSystem.out.println(arr[3]); // ❌ 例外発生"
          }
        ],
        "level": "basic",
        "estMin": 8
      },
      {
        "id": "array-length",
        "title": "配列の長さを取得する",
        "summary": "配列の長さは length フィールドで取得できます（メソッドではない）。",
        "content": [
          {
            "type": "p",
            "text": "配列の長さは length というフィールドで取得できます。Java の配列の length はメソッドではないため、() は不要です。"
          },
          {
            "type": "code",
            "filename": "ArrayLength.java",
            "lang": "java",
            "code": "int[] scores = { 10, 20, 30, 40 };\nSystem.out.println(scores.length); // 4"
          },
          {
            "type": "ul",
            "items": [
              "配列の長さは変更不可",
              "length はフィールド（scores.length）",
              "String.length() と混同しないよう注意"
            ]
          }
        ],
        "level": "basic",
        "estMin": 5
      },
      {
        "id": "loop-array",
        "title": "配列とループ",
        "summary": "配列の処理は for 文や拡張 for を組み合わせることが多いです。",
        "content": [
          {
            "type": "p",
            "text": "配列の全要素を処理するときは、for 文や拡張 for 文（for-each）を使うのが一般的です。"
          },
          {
            "type": "code",
            "filename": "ArrayLoop.java",
            "lang": "java",
            "code": "int[] scores = { 80, 70, 60 };\n\n// 通常の for 文\nfor (int i = 0; i < scores.length; i++) {\n    System.out.println(scores[i]);\n}\n\n// 拡張 for 文\nfor (int s : scores) {\n    System.out.println(s);\n}"
          },
          {
            "type": "ul",
            "items": [
              "インデックスが必要な場合は通常の for 文",
              "単純な全走査なら拡張 for 文が便利",
              "length を使って動的にループ回数を設定"
            ]
          }
        ],
        "level": "basic",
        "estMin": 10
      },
      {
        "id": "multi-dimensional-array",
        "title": "多次元配列（2次元配列など）",
        "summary": "配列の中に配列を持たせることで、多次元のデータ（表・行列など）を表現できます。",
        "content": [
          {
            "type": "p",
            "text": "Java では「配列の配列」を作ることで、多次元配列（2 次元、3 次元など）を表現できます。典型例は 2 次元の表データです。"
          },
          {
            "type": "code",
            "filename": "TwoDim.java",
            "lang": "java",
            "code": "int[][] matrix = {\n    {1, 2, 3},\n    {4, 5, 6},\n    {7, 8, 9}\n};\n\nSystem.out.println(matrix[1][2]); // 6"
          },
          {
            "type": "p",
            "text": "Java の多次元配列は「行ごとに長さを変える」こともできます（ジャグ配列）。"
          },
          {
            "type": "code",
            "filename": "JaggedArray.java",
            "lang": "java",
            "code": "int[][] jagged = {\n    {1, 2},\n    {3, 4, 5},\n};\nSystem.out.println(jagged[1][2]); // 5"
          },
          {
            "type": "ul",
            "items": [
              "Java の多次元配列は「配列の配列」",
              "行ごとに要素数を変えられる（ジャグ配列）",
              "二重 for 文で処理するケースが多い"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 14
      },
      {
        "id": "array-utils",
        "title": "配列を便利に扱うためのユーティリティ",
        "summary": "Arrays クラスを使うとソートや検索、文字列表現などが簡単に行えます。",
        "content": [
          {
            "type": "p",
            "text": "java.util.Arrays クラスには、配列を便利に操作するためのユーティリティメソッドが多数用意されています。"
          },
          {
            "type": "code",
            "filename": "ArraysUtil.java",
            "lang": "java",
            "code": "import java.util.Arrays;\n\nint[] nums = { 3, 1, 4 };\n\nArrays.sort(nums);                  // ソート\nSystem.out.println(Arrays.toString(nums)); // [1, 3, 4]\n\nint idx = Arrays.binarySearch(nums, 3); // 二分探索\nSystem.out.println(idx);                // 1"
          },
          {
            "type": "ul",
            "items": [
              "Arrays.sort()：ソート",
              "Arrays.toString()：配列の文字列表現",
              "Arrays.binarySearch()：二分探索",
              "Arrays.fill()：一括値埋め"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 12
      }
    ]
  },
  {
    "key": "java-exceptions",
    "title": "例外処理",
    "lessons": [
      {
        "id": "exceptions-overview",
        "title": "例外処理とは",
        "summary": "例外処理は、実行中に発生するエラーを検知し、プログラムの異常終了を防ぐ仕組みです。",
        "content": [
          {
            "type": "p",
            "text": "Java のプログラムを実行していると、0 で割る、存在しない配列の要素にアクセスする、ファイルが見つからないなど、予期しないエラーが発生することがあります。このような実行時のエラーを「例外（Exception）」と呼びます。"
          },
          {
            "type": "p",
            "text": "例外処理は、プログラムの異常終了を防ぎ、エラーメッセージを適切に表示したり、復旧処理を行ったりするための重要な仕組みです。Java では try-catch-finally を使って例外を安全に扱います。"
          },
          {
            "type": "code",
            "filename": "ExceptionOverview.java",
            "lang": "java",
            "code": "try {\n    int result = 10 / 0; // 例外発生\n} catch (ArithmeticException e) {\n    System.out.println(\"0で割ることはできません\");\n}"
          },
          {
            "type": "ul",
            "items": [
              "例外（Exception）は実行時に発生するエラー",
              "異常終了を防ぐために例外処理が必要",
              "基本構文は try-catch-finally"
            ]
          }
        ],
        "level": "basic",
        "estMin": 8
      },
      {
        "id": "exception-types",
        "title": "例外の種類（チェック例外・非チェック例外）",
        "summary": "Java にはコンパイル時に確認される例外（チェック例外）と、実行時に発生する例外（非チェック例外）の2種類があります。",
        "content": [
          {
            "type": "p",
            "text": "Java の例外は大きく「チェック例外（Checked Exception）」と「非チェック例外（Unchecked Exception）」に分類されます。"
          },
          {
            "type": "ul",
            "items": [
              "チェック例外：コンパイル時に必ず対処が求められる例外（例：IOException）",
              "非チェック例外：実行時に発生する RuntimeException のサブクラス（例：NullPointerException）"
            ]
          },
          {
            "type": "code",
            "filename": "ExceptionKinds.java",
            "lang": "java",
            "code": "import java.io.FileReader;\n\n// チェック例外：必ず try-catch が必要\ntry {\n    FileReader fr = new FileReader(\"data.txt\");\n} catch (IOException e) {\n    System.out.println(\"ファイルが見つかりません\");\n}\n\n// 非チェック例外（RuntimeException）\nString s = null;\nSystem.out.println(s.length()); // NullPointerException"
          },
          {
            "type": "p",
            "text": "チェック例外は必ず捕捉（catch）するか、throws で呼び出し元へ投げる必要がありますが、非チェック例外はコンパイル時に強制されません。"
          }
        ],
        "level": "basic",
        "estMin": 12
      },
      {
        "id": "try-catch",
        "title": "try-catch文による例外処理",
        "summary": "try ブロックに例外が発生しうる処理を書き、catch でそれを受け止めます。",
        "content": [
          {
            "type": "p",
            "text": "try-catch は例外処理の基本構文です。try ブロック内の処理で例外が発生すると、その例外に対応する catch ブロックが実行されます。"
          },
          {
            "type": "code",
            "filename": "TryCatch.java",
            "lang": "java",
            "code": "try {\n    int[] nums = {1, 2, 3};\n    System.out.println(nums[5]); // 例外発生\n} catch (ArrayIndexOutOfBoundsException e) {\n    System.out.println(\"配列の範囲外です\");\n}"
          },
          {
            "type": "p",
            "text": "catch ブロックでは Exception 型の変数を受け取り、エラーメッセージの表示やログ記録、復旧処理などを実行できます。"
          }
        ],
        "level": "basic",
        "estMin": 10
      },
      {
        "id": "catch-multiple",
        "title": "複数の例外を捕捉する",
        "summary": "catch を複数並べることで、発生する例外ごとに処理を分けることができます。",
        "content": [
          {
            "type": "p",
            "text": "1つの try ブロックに対して複数の catch を並べると、それぞれの例外に応じた処理が可能になります。"
          },
          {
            "type": "code",
            "filename": "CatchMultiple.java",
            "lang": "java",
            "code": "try {\n    int a = Integer.parseInt(\"ABC\"); // NumberFormatException\n} catch (NumberFormatException e) {\n    System.out.println(\"数値に変換できません\");\n} catch (Exception e) {\n    System.out.println(\"その他の例外\");\n}"
          },
          {
            "type": "p",
            "text": "Java 7 以降では複数の例外を 1つの catch にまとめる記述もできます。"
          },
          {
            "type": "code",
            "filename": "MultiCatch.java",
            "lang": "java",
            "code": "try {\n    // 何らかの処理\n} catch (IOException | NumberFormatException e) {\n    System.out.println(\"複数の例外をまとめて捕捉\");\n}"
          }
        ],
        "level": "intermediate",
        "estMin": 12
      },
      {
        "id": "finally-block",
        "title": "finallyブロック",
        "summary": "finally ブロックは例外の有無に関わらず必ず実行されるため、リソース解放などに使われます。",
        "content": [
          {
            "type": "p",
            "text": "finally ブロックは、try-catch の最後に書くことができ、「例外が発生しても発生しなくても必ず実行される」処理を記述します。"
          },
          {
            "type": "code",
            "filename": "Finally.java",
            "lang": "java",
            "code": "try {\n    int x = 10 / 0; // 例外発生\n} catch (ArithmeticException e) {\n    System.out.println(\"計算エラー\");\n} finally {\n    System.out.println(\"必ず実行されます\");\n}"
          },
          {
            "type": "p",
            "text": "ファイルを閉じる、DB コネクションを解放するなど、後処理に利用されます。"
          }
        ],
        "level": "intermediate",
        "estMin": 10
      },
      {
        "id": "throws-declaration",
        "title": "throwsによる例外のスロー",
        "summary": "メソッドの宣言に throws を付けることで、例外処理を呼び出し元へ委譲することができます。",
        "content": [
          {
            "type": "p",
            "text": "メソッド内でチェック例外が発生する可能性がある場合、そのメソッドに try-catch を書く代わりに、throws を使って呼び出し元へ例外処理を委譲することもできます。"
          },
          {
            "type": "code",
            "filename": "ThrowsExample.java",
            "lang": "java",
            "code": "import java.io.*;\n\nvoid readFile() throws IOException {\n    FileReader fr = new FileReader(\"info.txt\");\n}"
          },
          {
            "type": "p",
            "text": "throws を使ったメソッドは、呼び出し元側で try-catch を書く必要があります。"
          }
        ],
        "level": "intermediate",
        "estMin": 10
      },
      {
        "id": "throw-new",
        "title": "throw文で例外を発生させる",
        "summary": "throw 文を使うと、任意のタイミングで例外を発生させることができます。",
        "content": [
          {
            "type": "p",
            "text": "throw 文を使えば、条件が満たされなかった場合などに、自分で例外を発生させることができます。"
          },
          {
            "type": "code",
            "filename": "ThrowNew.java",
            "lang": "java",
            "code": "void checkAge(int age) {\n    if (age < 18) {\n        throw new IllegalArgumentException(\"未成年は利用できません\");\n    }\n    System.out.println(\"利用可能です\");\n}"
          },
          {
            "type": "ul",
            "items": [
              "throw new 例外型(\"メッセージ\") で例外を投げる",
              "事前条件チェック（バリデーション）などによく使われる"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 10
      },
      {
        "id": "custom-exception",
        "title": "独自の例外クラスを作る",
        "summary": "Exception クラスを継承すれば、自分専用の例外クラスを作成できます。",
        "content": [
          {
            "type": "p",
            "text": "Java では Exception クラスを継承することで、独自の例外クラスを作成できます。特定のドメインにおけるエラーを明確に区別したい場合に有効です。"
          },
          {
            "type": "code",
            "filename": "CustomException.java",
            "lang": "java",
            "code": "// 独自の例外クラス\nclass InvalidUserException extends Exception {\n    public InvalidUserException(String msg) {\n        super(msg);\n    }\n}\n\n// 使用例\nvoid login(String user) throws InvalidUserException {\n    if (!user.equals(\"admin\")) {\n        throw new InvalidUserException(\"無効なユーザーです\");\n    }\n}"
          },
          {
            "type": "ul",
            "items": [
              "Exception または RuntimeException を継承して作成",
              "業務エラーやルール違反時の例外に使える",
              "チェック例外として設計するか、非チェック例外とするかを設計目的で選ぶ"
            ]
          }
        ],
        "level": "advanced",
        "estMin": 15
      },
      {
        "id": "try-with-resources",
        "title": "try-with-resources構文",
        "summary": "Java 7 以降の try-with-resources を使うと、確実にリソース解放が行われます。",
        "content": [
          {
            "type": "p",
            "text": "try-with-resources 構文を使うと、ファイルやネットワークなどのリソースを自動的に close してくれます。finally に close() を書く必要がなくなり、安全かつ簡潔です。"
          },
          {
            "type": "code",
            "filename": "TryWithResources.java",
            "lang": "java",
            "code": "import java.io.*;\n\ntry (FileReader fr = new FileReader(\"data.txt\")) {\n    int n = fr.read();\n    System.out.println(n);\n} catch (IOException e) {\n    System.out.println(\"読み込みエラー\");\n}"
          },
          {
            "type": "ul",
            "items": [
              "AutoCloseable を実装したクラスなら自動 close が可能",
              "finally で close() を書く必要がなく、コードが簡潔",
              "リソースリーク（close し忘れ）を防止できる"
            ]
          }
        ],
        "level": "advanced",
        "estMin": 12
      }
    ]
  },
  {
    "key": "java-regex",
    "title": "正規表現",
    "lessons": [
      {
        "id": "regex-overview",
        "title": "正規表現とは",
        "summary": "正規表現（Regex）は、文字列のパターンを表現し、検索・一致判定・置換などを効率的に行うための仕組みです。",
        "content": [
          {
            "type": "p",
            "text": "正規表現（Regular Expression）は、文字列のパターンを記述する特別な記法です。メールアドレス形式の判定、特定の文字列の抽出、置換処理など、文字列に関する高度な処理を簡潔に記述できます。"
          },
          {
            "type": "p",
            "text": "Java では `java.util.regex.Pattern` と `Matcher` クラスを使用して正規表現を扱います。また、String クラスにも正規表現を使った便利なメソッドが多数用意されています。"
          },
          {
            "type": "code",
            "filename": "RegexOverview.java",
            "lang": "java",
            "code": "import java.util.regex.*;\n\nPattern p = Pattern.compile(\"abc\");\nMatcher m = p.matcher(\"123abc456\");\n\nif (m.find()) {\n    System.out.println(\"一致しました\");\n}"
          },
          {
            "type": "ul",
            "items": [
              "文字列パターンの検索や一致判定が簡潔に書ける",
              "Pattern / Matcher クラス、または String のメソッドで利用する",
              "複雑な条件をコードなしで表現できるため強力"
            ]
          }
        ],
        "level": "basic",
        "estMin": 8
      },
      {
        "id": "regex-basic-syntax",
        "title": "基本的な正規表現の記法",
        "summary": "正規表現の最も基本となる記号やメタ文字を学びます。",
        "content": [
          {
            "type": "p",
            "text": "正規表現には、文字単体だけでなく、特別な記号（メタ文字）を組み合わせて複雑なパターンを作れます。"
          },
          {
            "type": "ul",
            "items": [
              ".：任意の1文字",
              "\\d：数字（0〜9）",
              "\\w：英数字またはアンダースコア",
              "\\s：空白文字",
              "[]：文字クラス（例： [abc] ）",
              "[0-9]：範囲指定",
              "^：行頭",
              "$：行末",
              "|：OR条件",
              "()：グループ化"
            ]
          },
          {
            "type": "code",
            "filename": "RegexBasic.java",
            "lang": "java",
            "code": "String s = \"User42\";\n\nif (s.matches(\"User\\\\d+\")) {\n    System.out.println(\"User＋数字の形式です\");\n}"
          },
          {
            "type": "p",
            "text": "`String#matches()` は完全一致（全文一致）である点に注意が必要です。部分一致には Matcher#find() を使います。"
          }
        ],
        "level": "basic",
        "estMin": 12
      },
      {
        "id": "quantifiers",
        "title": "量指定子（繰り返し）",
        "summary": "量指定子を使うと、文字の繰り返し回数をパターンで指定できます。",
        "content": [
          {
            "type": "p",
            "text": "量指定子（Quantifier）を使うと、特定の文字やグループが繰り返される回数を指定できます。"
          },
          {
            "type": "ul",
            "items": [
              "*：0回以上",
              "+：1回以上",
              "?：0回または1回",
              "{n}：ちょうど n 回",
              "{n,}：n 回以上",
              "{n,m}：n〜m 回"
            ]
          },
          {
            "type": "code",
            "filename": "Quantifiers.java",
            "lang": "java",
            "code": "String s = \"aaaa\";\n\nSystem.out.println(s.matches(\"a+\"));     // true（1回以上のa）\nSystem.out.println(s.matches(\"a{2,4}\")); // true（2〜4回のa）"
          },
          {
            "type": "p",
            "text": "量指定子は非常に強力で、簡単な記述で複雑な繰り返し条件を表現できます。"
          }
        ],
        "level": "basic",
        "estMin": 10
      },
      {
        "id": "regex-string-methods",
        "title": "Stringクラスで使える正規表現メソッド",
        "summary": "Java の String クラスは正規表現を使った検索・分割・置換メソッドを多数提供しています。",
        "content": [
          {
            "type": "p",
            "text": "Java の String クラスには、正規表現を使った便利なメソッドが備わっています。"
          },
          {
            "type": "ul",
            "items": [
              "matches()：文字列全体が正規表現に一致するか",
              "replaceAll()：正規表現に一致した部分を置換",
              "replaceFirst()：最初に一致した部分を置換",
              "split()：正規表現で区切って配列に分割"
            ]
          },
          {
            "type": "code",
            "filename": "StringRegexMethods.java",
            "lang": "java",
            "code": "String text = \"apple,banana,orange\";\nString[] fruits = text.split(\",\");\n\nString masked = \"090-1234-5678\".replaceAll(\"\\\\d\", \"*\");"
          },
          {
            "type": "p",
            "text": "String の正規表現メソッドは簡潔で扱いやすいので、Pattern / Matcher を使う必要がない場面も多いです。"
          }
        ],
        "level": "basic",
        "estMin": 12
      },
      {
        "id": "pattern-matcher",
        "title": "PatternとMatcherによる高度な正規表現処理",
        "summary": "Pattern / Matcher クラスを使うと、部分一致検索や複数マッチの処理など高度な操作が可能になります。",
        "content": [
          {
            "type": "p",
            "text": "部分一致検索、複数箇所の抽出、グループとの連携など、より高度な正規表現処理には Pattern / Matcher を使用します。"
          },
          {
            "type": "code",
            "filename": "PatternMatcher.java",
            "lang": "java",
            "code": "import java.util.regex.*;\n\nString text = \"User12, User45, User999\";\nPattern p = Pattern.compile(\"User(\\\\d+)\");\nMatcher m = p.matcher(text);\n\nwhile (m.find()) {\n    System.out.println(\"一致: \" + m.group());       // User12\n    System.out.println(\"数字部分: \" + m.group(1));  // 12\n}"
          },
          {
            "type": "ul",
            "items": [
              "find()：部分一致を順番に探す",
              "group()：一致した全文を取得",
              "group(n)：n番目のグループを取得",
              "start() / end()：一致範囲のインデックスを取得"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 15
      },
      {
        "id": "escape-rules",
        "title": "Javaでのエスケープの注意点",
        "summary": "Java の文字列リテラルで正規表現を使う場合、バックスラッシュを二重に書く必要があります。",
        "content": [
          {
            "type": "p",
            "text": "Java の文字列リテラルでは `\\` がエスケープ文字であるため、正規表現で使う場合には `\\\\` のように二重に書く必要があります。"
          },
          {
            "type": "code",
            "filename": "EscapeExample.java",
            "lang": "java",
            "code": "// 正規表現で \\d を使いたい\nString pattern = \"\\\\d+\";   // Java文字列 → 実際の正規表現は \\d\nSystem.out.println(\"123\".matches(pattern));"
          },
          {
            "type": "p",
            "text": "この点は Java 特有のポイントであり、多くの初学者がつまずきやすい部分です。"
          }
        ],
        "level": "intermediate",
        "estMin": 8
      },
      {
        "id": "regex-advanced-techniques",
        "title": "よく使われる正規表現の実用例",
        "summary": "メールアドレス・郵便番号・電話番号など、実務でよく登場するパターンを紹介します。",
        "content": [
          {
            "type": "p",
            "text": "実務では、入力チェックやデータ解析などで正規表現を使うケースが多くあります。特に以下のパターンは頻出です。"
          },
          {
            "type": "ul",
            "items": [
              "メールアドレス：`^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+$`",
              "郵便番号：`^\\d{3}-\\d{4}$`",
              "電話番号：`^0\\d{1,3}-\\d{2,4}-\\d{4}$`",
              "日付（簡易版）：`^\\d{4}/\\d{1,2}/\\d{1,2}$`"
            ]
          },
          {
            "type": "code",
            "filename": "RegexExamples.java",
            "lang": "java",
            "code": "String email = \"test@example.com\";\nif (email.matches(\"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+$\")) {\n    System.out.println(\"メール形式です\");\n}"
          },
          {
            "type": "p",
            "text": "ただし、仕様が厳密な場合（RFC準拠メールアドレスなど）は、正規表現だけで完全な検証を行うのは難しい場合があります。"
          }
        ],
        "level": "advanced",
        "estMin": 15
      }
    ]
  },
  {
    "key": "java-oop",
    "title": "オブジェクト指向",
    "lessons": [
      {
        "id": "oop-overview",
        "title": "オブジェクト指向とは",
        "summary": "オブジェクト指向（OOP）は「データ（状態）と処理（振る舞い）を1つのまとまりとして扱う」考え方で、Java の根幹となる重要な概念です。",
        "content": [
          {
            "type": "p",
            "text": "オブジェクト指向（Object-Oriented Programming）は、現実世界のものごとを「オブジェクト（＝モノ）」として捉え、そのオブジェクト同士の関係や振る舞いをプログラムで表現する手法です。Java はオブジェクト指向を中心に設計された言語であり、クラス・インスタンス・メソッド・フィールドといった概念を理解することが重要です。"
          },
          {
            "type": "ul",
            "items": [
              "現実世界に近いモデルで考えられるため理解しやすい",
              "プログラムの再利用性が高まる",
              "複雑な処理を整理しやすくなる"
            ]
          },
          {
            "type": "code",
            "filename": "OopOverview.java",
            "lang": "java",
            "code": "class Dog {\n    String name;\n    void bark() {\n        System.out.println(name + \" が吠えました！\");\n    }\n}\n\nDog d = new Dog();\nd.name = \"Pochi\";\nd.bark();"
          }
        ],
        "level": "basic",
        "estMin": 10
      },
      {
        "id": "oop-class-and-instance",
        "title": "クラスとインスタンス",
        "summary": "クラスは設計図、インスタンスはその実体。Java のオブジェクト指向の基本となる概念です。",
        "content": [
          {
            "type": "p",
            "text": "クラス（class）はオブジェクトの設計図、インスタンスはその具体的な実体（オブジェクト）です。1 つのクラスを元に、複数のインスタンスを生成できます。"
          },
          {
            "type": "code",
            "filename": "ClassInstance.java",
            "lang": "java",
            "code": "class Person {\n    String name;\n    int age;\n}\n\nPerson p1 = new Person();\np1.name = \"Taro\";\np1.age = 20;\n\nPerson p2 = new Person();\np2.name = \"Hanako\";\np2.age = 22;"
          },
          {
            "type": "ul",
            "items": [
              "クラス：属性（フィールド）と機能（メソッド）をまとめた概念",
              "インスタンス：new を使って生成する実体",
              "同じクラスから複数のインスタンスを作成できる"
            ]
          }
        ],
        "level": "basic",
        "estMin": 12
      },
      {
        "id": "constructor",
        "title": "コンストラクタ",
        "summary": "コンストラクタはインスタンス生成時に自動で実行されるメソッドで、初期化処理を担当します。",
        "content": [
          {
            "type": "p",
            "text": "コンストラクタはクラスと同名の特殊なメソッドで、インスタンス生成時に自動的に呼び出され、初期化処理を行います。"
          },
          {
            "type": "code",
            "filename": "ConstructorExample.java",
            "lang": "java",
            "code": "class Person {\n    String name;\n    int age;\n\n    Person(String name, int age) {\n        this.name = name;\n        this.age = age;\n    }\n}\n\nPerson p = new Person(\"Taro\", 20);"
          },
          {
            "type": "ul",
            "items": [
              "戻り値は書かない",
              "クラス名と同じ名前",
              "インスタンス生成時に必ず呼ばれる"
            ]
          }
        ],
        "level": "basic",
        "estMin": 10
      },
      {
        "id": "encapsulation",
        "title": "カプセル化",
        "summary": "カプセル化は、データを保護しつつ必要な操作だけを公開する考え方です。",
        "content": [
          {
            "type": "p",
            "text": "カプセル化（Encapsulation）は、オブジェクトの内部状態（フィールド）を隠蔽し、外部から直接アクセスさせず、必要なメソッドだけを公開する考え方です。"
          },
          {
            "type": "code",
            "filename": "Encapsulation.java",
            "lang": "java",
            "code": "class BankAccount {\n    private int balance;\n\n    public void deposit(int amount) {\n        balance += amount;\n    }\n\n    public int getBalance() {\n        return balance;\n    }\n}"
          },
          {
            "type": "ul",
            "items": [
              "フィールドを private にする",
              "必要な操作は public メソッドとして提供する",
              "安全性が高まり、データの一貫性が保たれる"
            ]
          }
        ],
        "level": "basic",
        "estMin": 12
      },
      {
        "id": "inheritance",
        "title": "継承",
        "summary": "継承は、既存のクラスを拡張して新しいクラスを作る仕組みです。",
        "content": [
          {
            "type": "p",
            "text": "継承（Inheritance）は、既存クラス（スーパークラス）をベースにして新しいクラス（サブクラス）を作る仕組みです。"
          },
          {
            "type": "code",
            "filename": "Inheritance.java",
            "lang": "java",
            "code": "class Animal {\n    void move() {\n        System.out.println(\"動く\");\n    }\n}\n\nclass Dog extends Animal {\n    void bark() {\n        System.out.println(\"吠える\");\n    }\n}\n\nDog d = new Dog();\nd.move();\nd.bark();"
          },
          {
            "type": "ul",
            "items": [
              "コードの再利用性を高める",
              "共通処理をスーパークラスにまとめられる",
              "DogはAnimalの機能を引き継ぎつつ独自の機能追加が可能"
            ]
          }
        ],
        "level": "basic",
        "estMin": 12
      },
      {
        "id": "polymorphism",
        "title": "ポリモーフィズム",
        "summary": "ポリモーフィズムは、同じメソッド呼び出しでも実際の振る舞いがオブジェクトごとに変わる性質です。",
        "content": [
          {
            "type": "p",
            "text": "ポリモーフィズム（Polymorphism）とは、メソッドの振る舞いがオブジェクトの型によって変わる性質のことです。主に「オーバーライド」と「オーバーロード」があります。"
          },
          {
            "type": "ul",
            "items": [
              "オーバーロード：同名メソッドで引数違いを複数定義",
              "オーバーライド：スーパークラスのメソッドをサブクラスで上書き"
            ]
          },
          {
            "type": "code",
            "filename": "Polymorphism.java",
            "lang": "java",
            "code": "class Animal {\n    void cry() { System.out.println(\"???\"); }\n}\n\nclass Dog extends Animal {\n    @Override\n    void cry() { System.out.println(\"ワンワン\"); }\n}\n\nclass Cat extends Animal {\n    @Override\n    void cry() { System.out.println(\"ニャー\"); }\n}\n\nAnimal a = new Dog();\na.cry();  // 実際には Dog の cry() が呼ばれる"
          }
        ],
        "level": "intermediate",
        "estMin": 15
      },
      {
        "id": "abstraction",
        "title": "抽象クラスとインターフェース",
        "summary": "抽象クラスとインターフェースは、多態性をさらに強力にするための仕組みです。",
        "content": [
          {
            "type": "p",
            "text": "Java の抽象化には抽象クラス（abstract class）とインターフェース（interface）の 2 つがあります。どちらも設計の柔軟性と拡張性を高めます。"
          },
          {
            "type": "code",
            "filename": "Abstraction.java",
            "lang": "java",
            "code": "abstract class Shape {\n    abstract void draw();\n}\n\nclass Circle extends Shape {\n    void draw() { System.out.println(\"円\"); }\n}\n\ninterface Worker {\n    void work();\n}\n\nclass Programmer implements Worker {\n    public void work() { System.out.println(\"コードを書く\"); }\n}"
          },
          {
            "type": "ul",
            "items": [
              "抽象クラス：共通部分＋未実装メソッドを含められる",
              "インターフェース：実装すべきメソッド仕様だけを定義",
              "Java は多重継承は不可だがインターフェースは複数実装可能"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 18
      },
      {
        "id": "oop-design",
        "title": "オブジェクト指向設計の考え方",
        "summary": "現実の問題をどのようにクラスとして設計するか、基本的な考え方を学びます。",
        "content": [
          {
            "type": "p",
            "text": "オブジェクト指向では、現実世界の問題を「責務（何を担当するか）」ごとに分割し、それぞれをクラスとして設計します。"
          },
          {
            "type": "ul",
            "items": [
              "クラスは「固有の責務（できること、持つべき情報）」でまとめる",
              "重複する処理はスーパークラスやユーティリティに集約",
              "データは必要以上に公開しない（カプセル化）",
              "拡張しやすい設計（継承・ポリモーフィズム）を意識する"
            ]
          },
          {
            "type": "code",
            "filename": "OopDesign.java",
            "lang": "java",
            "code": "class Order {\n    private List<Item> items;\n    public int totalPrice() {\n        return items.stream().mapToInt(i -> i.price).sum();\n    }\n}"
          },
          {
            "type": "p",
            "text": "オブジェクト指向設計は難しく感じることもありますが、現実世界をそのままプログラムに落とし込むという発想を持つと、自然に考えられるようになります。"
          }
        ],
        "level": "intermediate",
        "estMin": 15
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
            プログラミング言語学習（Java）
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

