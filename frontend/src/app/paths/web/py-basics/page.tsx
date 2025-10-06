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
    "key": "intro-python",
    "title": "Pythonの紹介",
    "lessons": [
      {
        "id": "what-is-python",
        "title": "Pythonとは",
        "summary": "Python は、読みやすく書きやすい構文を持つ高水準の汎用プログラミング言語です。",
        "content": [
          {
            "type": "p",
            "text": "Python（パイソン）は 1991 年に Guido van Rossum によって開発された **高水準・汎用・インタプリタ型のプログラミング言語** です。シンプルで直感的な文法が特徴で、初心者からプロフェッショナルまで幅広く使われています。"
          },
          {
            "type": "p",
            "text": "Python は「人間が読みやすく書きやすいコード」を重視して設計されており、少ない行数で多くの処理を表現できます。そのため、教育用途だけでなく、AI・データ分析・Web開発・自動化など、さまざまな分野で活用されています。"
          },
          {
            "type": "code",
            "filename": "hello-python.py",
            "lang": "python",
            "code": `# 最初の Python プログラム
  print("Hello, Python!")`
          },
          {
            "type": "p",
            "text": "Python のコードは非常に読みやすく、上の例のように 1 行で文字列を出力できます。C 言語や Java に比べて記述量が少なく、自然言語に近い書き方ができるのが特徴です。"
          },
          {
            "type": "ul",
            "items": [
              "**高水準言語**：人間が理解しやすい文法で書ける",
              "**インタプリタ言語**：コンパイル不要で、すぐに実行できる",
              "**汎用言語**：Web、AI、データ分析、自動化など幅広い分野に対応",
              "**豊富なライブラリ**：NumPy、Pandas、Django、FastAPI など強力なエコシステム",
              "**マルチプラットフォーム**：Windows / macOS / Linux などあらゆる環境で動作"
            ]
          },
          {
            "type": "p",
            "text": "Python は「初心者でも学びやすく、上級者でも強力に使える」言語です。特に近年は AI・機械学習・データサイエンス分野での需要が高く、エンジニアだけでなく研究者やビジネス職の人材にも広く使われています。"
          },
          {
            "type": "p",
            "text": "■ TypeScriptとの比較"
          },
          {
            "type": "p",
            "text": "Python と TypeScript はどちらも人気の高いプログラミング言語ですが、**用途・特徴・設計思想** に明確な違いがあります。TypeScript は JavaScript を拡張した静的型付き言語であり、主に Web フロントエンドやバックエンド開発に使われる一方、Python は幅広い分野に対応する汎用スクリプト言語です。"
          },
          {
            "type": "ul",
            "items": [
              "**型システム**：Python は動的型付け（実行時に型が決まる）、TypeScript は静的型付け（コンパイル時に型をチェック）",
              "**記述量**：Python は簡潔で短く書ける、TypeScript は厳密な型指定によりやや長くなる",
              "**主な用途**：Python は AI・機械学習・データ分析・自動化・Web バックエンド、TypeScript は Web フロントエンドや SPA 開発",
              "**実行方式**：Python はインタプリタ（逐次実行）、TypeScript はコンパイル（JavaScript に変換して実行）",
              "**学習コスト**：Python は低く初心者向け、TypeScript はやや高く JavaScript の知識が前提",
              "**代表的なフレームワーク**：Python は Django / FastAPI / Flask、TypeScript は Next.js / Angular / NestJS"
            ]
          },
          {
            "type": "p",
            "text": "つまり、**Python は「何でもできる万能スクリプト言語」**、**TypeScript は「大規模 Web アプリ向けの型安全な言語」** という位置づけです。両者は競合関係ではなく、たとえば「バックエンドは Python、フロントエンドは TypeScript」といった形で共存させるケースが多くなっています。"
          }
        ],
        "level": "basic",
        "estMin": 15
      }
    ]
  },
  {
    "key": "python-data-structures",
    "title": "Pythonのデータ構造",
    "lessons": [
      {
        "id": "primitive-types",
        "title": "プリミティブ型",
        "summary": "Python の基本的なデータ型には、数値型・文字列型・ブール型などがあります。",
        "content": [
          {
            "type": "p",
            "text": "Python のプリミティブ型（基本型）は、プログラムの基礎を構成する最も単純なデータ型です。代表的なものには数値型（int, float）、文字列型（str）、ブール型（bool）などがあります。"
          },
          {
            "type": "code",
            "filename": "primitive-types.py",
            "lang": "python",
            "code": `# 数値型
x = 42        # int（整数）
y = 3.14      # float（浮動小数点数）
  
# 文字列型
name = "Python"
  
# ブール型
is_active = True
  
print(type(x))       # <class 'int'>
print(type(y))       # <class 'float'>
print(type(name))    # <class 'str'>
print(type(is_active))  # <class 'bool'>`
          },
          {
            "type": "ul",
            "items": [
              "`int`：整数を表す",
              "`float`：小数を表す",
              "`str`：文字列を表す",
              "`bool`：True / False の論理値を表す"
            ]
          },
          {
            "type": "p",
            "text": "Python ではすべてがオブジェクトとして扱われますが、これらのプリミティブ型は最も基本的なデータ構造として、複雑な型の基盤になります。"
          }
        ],
        "level": "basic",
        "estMin": 7
      },
      {
        "id": "list",
        "title": "リスト",
        "summary": "複数の要素を順序付きで格納できる可変長のデータ構造です。",
        "content": [
          {
            "type": "p",
            "text": "リスト（list）は、複数の値を順序付きで格納できるデータ構造です。**ミュータブル（可変）** なため、要素の追加・削除・変更が可能です。"
          },
          {
            "type": "code",
            "filename": "list-basic.py",
            "lang": "python",
            "code": `fruits = ["apple", "banana", "orange"]
print(fruits[0])  # "apple"
  
# 要素の追加
fruits.append("grape")
  
# 要素の変更
fruits[1] = "mango"
  
# 要素の削除
del fruits[2]
  
print(fruits)  # ['apple', 'mango', 'grape']`
          },
          {
            "type": "ul",
            "items": [
              "インデックスでアクセス可能（0 始まり）",
              "append(), insert(), remove() などで操作可能",
              "ミュータブル（可変）なので後から変更できる"
            ]
          }
        ],
        "level": "basic",
        "estMin": 7
      },
      {
        "id": "tuple",
        "title": "タプル",
        "summary": "リストに似ていますが、**イミュータブル（不変）** なデータ構造です。",
        "content": [
          {
            "type": "p",
            "text": "タプル（tuple）は、複数の値を順序付きで格納できる点でリストと似ていますが、**イミュータブル（作成後に変更できない）** という大きな違いがあります。"
          },
          {
            "type": "code",
            "filename": "tuple-basic.py",
            "lang": "python",
            "code": `point = (10, 20)
print(point[0])  # 10
  
# point[0] = 30  # ❌ エラー: タプルは変更不可
  
# アンパックも可能
x, y = point
print(x, y)  # 10 20`
          },
          {
            "type": "ul",
            "items": [
              "要素は順序付き・重複可",
              "イミュータブルで安全性が高い",
              "辞書のキーなど変更不可能な構造が必要な場合に便利"
            ]
          }
        ],
        "level": "basic",
        "estMin": 6
      },
      {
        "id": "sequence",
        "title": "シーケンス",
        "summary": "リスト・タプル・文字列など、順序を持つデータ型の総称です。",
        "content": [
          {
            "type": "p",
            "text": "シーケンス（sequence）とは、**順序を持つデータ型の共通的な性質** をまとめた概念です。リスト、タプル、文字列などが含まれ、インデックスアクセスやスライスなどが共通して使えます。"
          },
          {
            "type": "code",
            "filename": "sequence.py",
            "lang": "python",
            "code": `seq = [10, 20, 30, 40]
  
# インデックスアクセス
print(seq[1])   # 20
  
# スライス
print(seq[1:3]) # [20, 30]
  
# in 演算子
print(30 in seq)  # True
  
# 長さ
print(len(seq))  # 4`
          },
          {
            "type": "ul",
            "items": [
              "インデックスアクセスが可能",
              "スライス構文 `[start:end]` が使える",
              "in / len() など共通の操作が可能"
            ]
          }
        ],
        "level": "basic",
        "estMin": 6
      },
      {
        "id": "set",
        "title": "集合型",
        "summary": "重複のない要素を持つデータ構造で、集合演算が可能です。",
        "content": [
          {
            "type": "p",
            "text": "集合型（set）は、**重複しない要素の集まり** を表すデータ構造です。順序は保持しませんが、和・積・差といった集合演算を高速に行えます。"
          },
          {
            "type": "code",
            "filename": "set-basic.py",
            "lang": "python",
            "code": `a = {1, 2, 3}
b = {3, 4, 5}
  
print(a | b)  # 和集合: {1, 2, 3, 4, 5}
print(a & b)  # 積集合: {3}
print(a - b)  # 差集合: {1, 2}
  
# 要素の追加・削除
a.add(4)
a.remove(2)`
          },
          {
            "type": "ul",
            "items": [
              "重複のないデータ集合を扱える",
              "和・積・差などの集合演算が可能",
              "順序は保証されない（インデックスアクセス不可）"
            ]
          }
        ],
        "level": "basic",
        "estMin": 7
      },
      {
        "id": "dict",
        "title": "辞書型",
        "summary": "キーと値のペアでデータを管理する柔軟なデータ構造です。",
        "content": [
          {
            "type": "p",
            "text": "辞書型（dict）は、**キーと値のペア** でデータを格納するデータ構造です。キーはユニークでなければならず、値はどんな型でも格納できます。"
          },
          {
            "type": "code",
            "filename": "dict-basic.py",
            "lang": "python",
            "code": `person = {
  "name": "Alice",
  "age": 25,
  "city": "Tokyo"
}
  
print(person["name"])  # Alice
  
# 要素の追加・更新
person["age"] = 26
  
# 要素の削除
del person["city"]
  
# キーと値の取得
for key, value in person.items():
    print(key, value)`
          },
          {
            "type": "ul",
            "items": [
              "キーで値にアクセスする（順序付き・ユニーク）",
              "ミュータブルなので追加・削除・更新が可能",
              "JSON などデータ交換形式とも相性がよい"
            ]
          }
        ],
        "level": "basic",
        "estMin": 8
      },
      {
        "id": "stack",
        "title": "スタック",
        "summary": "後入れ先出し（LIFO）の原則でデータを管理する構造です。",
        "content": [
          {
            "type": "p",
            "text": "スタック（stack）は、**後入れ先出し（LIFO: Last In, First Out）** の原則に従ってデータを扱うデータ構造です。最後に追加した要素が最初に取り出されます。関数呼び出しの履歴や戻り処理など、順序が重要な場面でよく使われます。Pythonではリストでスタックを実現できます。"
          },
          {
            "type": "code",
            "filename": "stack-basic.py",
            "lang": "python",
            "code": `stack = []
      
      # 要素の追加（push）
      stack.append(1)
      stack.append(2)
      stack.append(3)
      print(stack)  # [1, 2, 3]
      
      # 要素の取り出し（pop） - 最後に入れたものから
      top = stack.pop()
      print(top)    # 3
      print(stack)  # [1, 2]`
          },
          {
            "type": "ul",
            "items": [
              "後入れ先出し（LIFO）の構造を持つ",
              "append() で追加、pop() で取り出す",
              "関数コールスタックや取り消し操作などに利用される"
            ]
          }
        ],
        "level": "basic",
        "estMin": 6
      },
      {
        "id": "queue",
        "title": "キュー",
        "summary": "先入れ先出し（FIFO）の原則でデータを管理する構造です。",
        "content": [
          {
            "type": "p",
            "text": "キュー（queue）は、**先入れ先出し（FIFO: First In, First Out）** の原則に従ってデータを扱うデータ構造です。最初に追加した要素が最初に取り出されます。タスク処理やデータの順次処理などに適しています。Pythonではcollections.dequeを使うとキューを実現できます。"
          },
          {
            "type": "code",
            "filename": "queue-basic.py",
            "lang": "python",
            "code": `from collections import deque
      
queue = deque()
      
# 要素の追加（enqueue）
queue.append("A")
queue.append("B")
queue.append("C")
print(queue)  # deque(['A', 'B', 'C'])
      
# 要素の取り出し（dequeue） - 最初に入れたものから
first = queue.popleft()
print(first)  # A
print(queue)  # deque(['B', 'C'])`
          },
          {
            "type": "ul",
            "items": [
              "先入れ先出し（FIFO）の構造を持つ",
              "append() で追加、popleft() で取り出す",
              "タスクスケジューラやイベント処理キューなどに利用される"
            ]
          }
        ],
        "level": "basic",
        "estMin": 6
      }
      
    ]
  },
  {
    "key": "python-control-flow",
    "title": "Pythonの制御構文",
    "lessons": [
      {
        "id": "variable-declaration",
        "title": "変数宣言",
        "summary": "Python では型を明示せずに変数を宣言でき、代入と同時に型が決まります。",
        "content": [
          {
            "type": "p",
            "text": "Python の変数宣言は非常にシンプルで、**型を明示する必要がなく代入によって自動的に型が決まる** のが特徴です。キーワード `let` や `const` を使う TypeScript とは異なり、変数名に値を代入するだけで宣言が完了します。"
          },
          {
            "type": "code",
            "filename": "variable-basic.py",
            "lang": "python",
            "code": `# 変数の宣言と代入
x = 10          # 整数
name = "Alice"  # 文字列
is_valid = True # ブール値
  
print(x, name, is_valid)  # 10 Alice True`
          },
          {
            "type": "p",
            "text": "Python 3.6 以降では、型ヒント（型アノテーション）を付けて宣言することも可能です。型チェックには影響しませんが、静的解析ツールや補完機能を強化できます。"
          },
          {
            "type": "code",
            "filename": "variable-annotation.py",
            "lang": "python",
            "code": `# 型ヒント付きの宣言
age: int = 25
height: float = 172.5
message: str = "Hello"
  
print(age, height, message)`
          },
          {
            "type": "ul",
            "items": [
              "Python では代入と同時に変数が作成される（型宣言は不要）",
              "同じ変数に異なる型の値を代入することも可能（動的型付け）",
              "型ヒントを使うとコードの可読性と保守性が向上する"
            ]
          }
        ],
        "level": "basic",
        "estMin": 6
      },
      {
        "id": "if-statement",
        "title": "if 文",
        "summary": "条件に応じて処理を分岐するための基本構文です。",
        "content": [
          {
            "type": "p",
            "text": "`if` 文は、条件式が `True` のときにだけ特定の処理を実行します。`elif` や `else` を使って複数条件を扱うことも可能です。"
          },
          {
            "type": "code",
            "filename": "if-basic.py",
            "lang": "python",
            "code": `score = 85
  
if score >= 90:
    print("Aランク")
elif score >= 70:
    print("Bランク")
else:
    print("Cランク")`
          },
          {
            "type": "ul",
            "items": [
              "`if`：条件が True の場合に実行",
              "`elif`：他の条件を追加する場合に使用",
              "`else`：どの条件にも当てはまらない場合に実行"
            ]
          }
        ],
        "level": "basic",
        "estMin": 5
      },
      {
        "id": "for-loop",
        "title": "for 文",
        "summary": "繰り返し処理を行うための構文です。",
        "content": [
          {
            "type": "p",
            "text": "`for` 文は、シーケンス（リスト、文字列など）の要素を順に取り出して処理を繰り返すために使われます。"
          },
          {
            "type": "code",
            "filename": "for-basic.py",
            "lang": "python",
            "code": `fruits = ["apple", "banana", "orange"]
  
  for fruit in fruits:
      print(fruit)`
          },
          {
            "type": "p",
            "text": "インデックスが必要な場合は、`enumerate()` を使うと便利です。"
          },
          {
            "type": "code",
            "filename": "for-enumerate.py",
            "lang": "python",
            "code": `for i, fruit in enumerate(fruits):
      print(i, fruit)`
          }
        ],
        "level": "basic",
        "estMin": 6
      },
      {
        "id": "range-function",
        "title": "range() 関数",
        "summary": "数値の連続した範囲を生成するイテラブルを返す関数です。",
        "content": [
          {
            "type": "p",
            "text": "`range()` は数値の範囲を生成する関数で、`for` 文と組み合わせて指定回数のループ処理を行う際によく使われます。"
          },
          {
            "type": "code",
            "filename": "range-basic.py",
            "lang": "python",
            "code": `# 0 から 4 まで出力
for i in range(5):
    print(i)
  
# 開始値とステップを指定
for i in range(2, 10, 2):
    print(i)  # 2, 4, 6, 8`
          },
          {
            "type": "ul",
            "items": [
              "`range(stop)`：0 から stop-1 まで",
              "`range(start, stop)`：start から stop-1 まで",
              "`range(start, stop, step)`：step ごとに増加"
            ]
          }
        ],
        "level": "basic",
        "estMin": 5
      },
      {
        "id": "break-continue",
        "title": "break 文と continue 文",
        "summary": "ループの途中で処理を終了したりスキップしたりします。",
        "content": [
          {
            "type": "p",
            "text": "`break` はループを途中で終了し、`continue` はその反復をスキップして次の周回へ進みます。"
          },
          {
            "type": "code",
            "filename": "break-continue.py",
            "lang": "python",
            "code": `for i in range(10):
    if i == 5:
        break  # ループを終了
    if i % 2 == 0:
        continue  # 偶数のときはスキップ
    print(i)`
          },
          {
            "type": "ul",
            "items": [
              "`break`：ループ全体を即座に終了する",
              "`continue`：その周の残り処理をスキップして次へ進む"
            ]
          }
        ],
        "level": "basic",
        "estMin": 6
      },
      {
        "id": "loop-else",
        "title": "ループの else 節",
        "summary": "ループが最後まで正常に終了したときに実行されるブロックです。",
        "content": [
          {
            "type": "p",
            "text": "`for` や `while` ループには `else` を付けることができ、**`break` で中断されなかった場合のみ** 実行されます。"
          },
          {
            "type": "code",
            "filename": "loop-else.py",
            "lang": "python",
            "code": `for i in range(5):
    if i == 3:
        break
else:
    print("break されなければ実行される")
  
# この例では break があるため else は実行されない`
          },
          {
            "type": "ul",
            "items": [
              "`break` が実行されなかった場合にのみ `else` が実行される",
              "検索などで「見つからなかった場合の処理」に便利"
            ]
          }
        ],
        "level": "basic",
        "estMin": 5
      },
      {
        "id": "pass-statement",
        "title": "pass 文",
        "summary": "構文上文が必要な場所で何もしないためのプレースホルダーです。",
        "content": [
          {
            "type": "p",
            "text": "`pass` は、**「何もしない」ことを明示するための文** です。まだ実装していない関数や条件分岐などのプレースホルダーとして使われます。"
          },
          {
            "type": "code",
            "filename": "pass-basic.py",
            "lang": "python",
            "code": `def todo_function():
    pass  # ここは後で実装予定
  
if True:
    pass  # 条件はあるが今は何もしない`
          },
          {
            "type": "ul",
            "items": [
              "構文上文が必要だが処理したくないときに使う",
              "未実装箇所の目印としてよく使われる"
            ]
          }
        ],
        "level": "basic",
        "estMin": 4
      },
      {
        "id": "match-statement",
        "title": "match 文",
        "summary": "Python 3.10 以降で導入されたパターンマッチ構文です。",
        "content": [
          {
            "type": "p",
            "text": "`match` 文は Python 3.10 以降で導入された構文で、**値のパターンに基づいて分岐処理** を行います。`switch` に似ていますが、より強力なマッチングが可能です。"
          },
          {
            "type": "code",
            "filename": "match-basic.py",
            "lang": "python",
            "code": `status = 404
  
match status:
    case 200:
        print("OK")
    case 404:
        print("Not Found")
    case 500:
        print("Server Error")
    case _:
          print("Unknown Status")`
          },
          {
            "type": "ul",
            "items": [
              "`match` は値や構造に基づく分岐を記述できる",
              "`_` はワイルドカードとしてどんな値にもマッチ",
              "Python 3.10 以降で利用可能"
            ]
          }
        ],
        "level": "basic",
        "estMin": 7
      }
    ]
  },
  {
    "key": "python-functions",
    "title": "Pythonの関数",
    "lessons": [
      {
        "id": "function-definition",
        "title": "関数の定義方法",
        "summary": "`def` キーワードを使って関数を定義します。",
        "content": [
          {
            "type": "p",
            "text": "Python の関数は `def` キーワードで定義し、処理をまとめて再利用可能にします。関数は引数（パラメータ）を受け取り、`return` で値を返すことができます。"
          },
          {
            "type": "code",
            "filename": "function-basic.py",
            "lang": "python",
            "code": `def greet(name):
    return f"Hello, {name}!"
  
message = greet("Alice")
print(message)  # Hello, Alice!`
          },
          {
            "type": "ul",
            "items": [
              "`def` の後に関数名と引数リストを書く",
              "関数内の処理はインデントで表す",
              "`return` で値を返す（省略すると `None` が返る）"
            ]
          }
        ],
        "level": "basic",
        "estMin": 5
      },
      {
        "id": "default-args",
        "title": "デフォルトの引数値",
        "summary": "引数にデフォルト値を設定すると、省略時にも動作します。",
        "content": [
          {
            "type": "p",
            "text": "引数にデフォルト値を設定すると、呼び出し時に値を渡さなくてもそのデフォルト値が使われます。"
          },
          {
            "type": "code",
            "filename": "default-args.py",
            "lang": "python",
            "code": `def greet(name="World"):
    print(f"Hello, {name}!")
  
greet()           # Hello, World!
greet("Python")   # Hello, Python!`
          },
          {
            "type": "ul",
            "items": [
              "デフォルト値は右から順に設定する必要がある",
              "ミュータブル（例: リスト）をデフォルト値に使うときは注意が必要"
            ]
          }
        ],
        "level": "basic",
        "estMin": 5
      },
      {
        "id": "keyword-args",
        "title": "キーワード引数",
        "summary": "引数名を指定して渡すと、順番に関係なく引数を渡せます。",
        "content": [
          {
            "type": "p",
            "text": "キーワード引数を使うと、引数の順序を気にせず名前付きで渡せるため、コードの可読性が向上します。"
          },
          {
            "type": "code",
            "filename": "keyword-args.py",
            "lang": "python",
            "code": `def introduce(name, age):
    print(f"{name} は {age} 歳です")
  
introduce(age=25, name="Alice")`
          }
        ],
        "level": "basic",
        "estMin": 4
      },
      {
        "id": "special-params",
        "title": "特殊なパラメータ",
        "summary": "Python では関数の引数にさまざまな制約を指定できます。",
        "content": [
          {
            "type": "p",
            "text": "Python 3.8 以降では、`/` や `*` を使って「位置専用」「キーワード専用」などのパラメータを定義できます。"
          }
        ],
        "level": "basic",
        "estMin": 3
      },
      {
        "id": "positional-or-keyword",
        "title": "位置またはキーワード引数",
        "summary": "通常の引数は位置・キーワードのどちらでも指定可能です。",
        "content": [
          {
            "type": "code",
            "filename": "positional-or-keyword.py",
            "lang": "python",
            "code": `def power(x, y):
    return x ** y
  
print(power(2, 3))       # 位置引数
print(power(x=2, y=3))   # キーワード引数`
          }
        ],
        "level": "basic",
        "estMin": 4
      },
      {
        "id": "positional-only",
        "title": "位置専用引数",
        "summary": "`/` を使うと、その前の引数は位置引数のみ許可されます。",
        "content": [
          {
            "type": "code",
            "filename": "positional-only.py",
            "lang": "python",
            "code": `def add(x, y, /):
    return x + y
  
print(add(1, 2))      # OK
# print(add(x=1, y=2)) # ❌ エラー`
          }
        ],
        "level": "basic",
        "estMin": 4
      },
      {
        "id": "keyword-only",
        "title": "キーワード専用引数",
        "summary": "`*` の後の引数はキーワード引数でしか渡せません。",
        "content": [
          {
            "type": "code",
            "filename": "keyword-only.py",
            "lang": "python",
            "code": `def greet(*, name):
      print(f"Hello, {name}!")
  
  greet(name="Alice")  # OK
  # greet("Alice")     # ❌ エラー`
          }
        ],
        "level": "basic",
        "estMin": 4
      },
      {
        "id": "function-example",
        "title": "関数の例",
        "summary": "位置専用・キーワード専用を組み合わせた関数の例です。",
        "content": [
          {
            "type": "code",
            "filename": "function-example.py",
            "lang": "python",
            "code": `def example(a, b, /, c, *, d):
    print(a, b, c, d)
  
example(1, 2, 3, d=4)   # OK`
          }
        ],
        "level": "basic",
        "estMin": 4
      },
      {
        "id": "special-summary",
        "title": "要約",
        "summary": "特殊パラメータの記号と意味を整理します。",
        "content": [
          {
            "type": "ul",
            "items": [
              "`/` の前：位置専用引数のみ",
              "`*` の後：キーワード専用引数のみ",
              "通常の引数：どちらでも指定可能"
            ]
          }
        ],
        "level": "basic",
        "estMin": 3
      },
      {
        "id": "varargs",
        "title": "任意引数リスト",
        "summary": "`*args` で任意個数の位置引数を受け取ります。",
        "content": [
          {
            "type": "code",
            "filename": "varargs.py",
            "lang": "python",
            "code": `def total(*numbers):
    return sum(numbers)
  
print(total(1, 2, 3))    # 6`
          },
          {
            "type": "ul",
            "items": [
              "`*args` はタプルとして受け取る",
              "0 個以上の位置引数に対応可能"
            ]
          }
        ],
        "level": "basic",
        "estMin": 5
      },
      {
        "id": "unpack-args",
        "title": "引数リストのアンパック",
        "summary": "シーケンスや辞書を `*` や `**` で展開して渡せます。",
        "content": [
          {
            "type": "code",
            "filename": "unpack-args.py",
            "lang": "python",
            "code": `def add(a, b, c):
    return a + b + c
  
nums = [1, 2, 3]
print(add(*nums))    # 6
  
params = {"a": 4, "b": 5, "c": 6}
print(add(**params)) # 15`
          }
        ],
        "level": "basic",
        "estMin": 5
      },
      {
        "id": "lambda",
        "title": "ラムダ式",
        "summary": "小さな無名関数をその場で定義できます。",
        "content": [
          {
            "type": "code",
            "filename": "lambda-basic.py",
            "lang": "python",
            "code": `square = lambda x: x * x
print(square(5))  # 25
  
# 高階関数と組み合わせて
nums = [1, 2, 3, 4]
squares = list(map(lambda x: x ** 2, nums))
print(squares)  # [1, 4, 9, 16]`
          }
        ],
        "level": "basic",
        "estMin": 5
      },
      {
        "id": "docstring",
        "title": "ドキュメンテーション文字列",
        "summary": "関数の説明を文字列として定義し、`help()` で参照できます。",
        "content": [
          {
            "type": "code",
            "filename": "docstring.py",
            "lang": "python",
            "code": `def greet(name):
    """名前を受け取り、挨拶文を返す関数"""
    return f"Hello, {name}!"
  
print(help(greet))`
          },
          {
            "type": "ul",
            "items": [
              "関数の最初の行に三重クォートで記述",
              "`help()` 関数で自動的に表示される",
              "Sphinx などのドキュメント生成にも利用可能"
            ]
          }
        ],
        "level": "basic",
        "estMin": 4
      },
      {
        "id": "function-annotations",
        "title": "関数のアノテーション",
        "summary": "引数や戻り値に型情報を付けることで、可読性と保守性が向上します。",
        "content": [
          {
            "type": "code",
            "filename": "annotations.py",
            "lang": "python",
            "code": `def add(x: int, y: int) -> int:
    return x + y
  
print(add(3, 5))`
          },
          {
            "type": "ul",
            "items": [
              "アノテーションは型チェックには影響しない（実行時は無視される）",
              "静的解析ツールや IDE の補完で活用される",
              "戻り値の型は `-> 型名` で指定する"
            ]
          }
        ],
        "level": "basic",
        "estMin": 4
      }
    ]
  },
  {
    "key": "python-modules",
    "title": "Pythonのモジュール",
    "lessons": [
      {
        "id": "module",
        "title": "モジュール",
        "summary": "モジュールとは、Python コードをまとめたファイルで、再利用や整理を目的としています。",
        "content": [
          {
            "type": "p",
            "text": "モジュール（module）とは、**Python のコードを機能ごとに分割して再利用可能にしたファイル** のことです。1 つの `.py` ファイルが 1 つのモジュールになります。モジュールを使うと、コードの見通しがよくなり、他のプロジェクトでも簡単に再利用できます。"
          },
          {
            "type": "code",
            "filename": "my_module.py",
            "lang": "python",
            "code": `# my_module.py
def greet(name):
    return f"Hello, {name}!"
  
PI = 3.14159`
          },
          {
            "type": "p",
            "text": "上記のようなファイルを作成すると、それがモジュールになります。別のファイルから `import` 文で読み込んで使用できます。"
          },
          {
            "type": "code",
            "filename": "use_module.py",
            "lang": "python",
            "code": `import my_module
  
print(my_module.greet("Alice"))  # Hello, Alice!
print(my_module.PI)              # 3.14159
  
# 特定の要素だけをインポートすることも可能
from my_module import greet
print(greet("Bob"))`
          },
          {
            "type": "ul",
            "items": [
              "モジュール = `.py` ファイル 1 つ",
              "`import` で読み込むことで関数や定数を再利用可能",
              "`from ... import ...` を使うと一部だけを取り込める",
              "`as` で別名をつけてインポートできる（例：`import numpy as np`）"
            ]
          }
        ],
        "level": "basic",
        "estMin": 8
      },
      {
        "id": "package",
        "title": "パッケージ",
        "summary": "パッケージは複数のモジュールをまとめて構造化したものです。",
        "content": [
          {
            "type": "p",
            "text": "パッケージ（package）は、**複数のモジュールをまとめて階層構造で管理する仕組み** です。ディレクトリの中に `__init__.py` ファイルがあると、そのディレクトリはパッケージとして認識されます。"
          },
          {
            "type": "code",
            "filename": "package-structure.txt",
            "lang": "text",
            "code": `my_package/
├── __init__.py
├── math_utils.py
└── string_utils.py`
          },
          {
            "type": "code",
            "filename": "math_utils.py",
            "lang": "python",
            "code": `# my_package/math_utils.py
def add(a, b):
    return a + b`
          },
          {
            "type": "p",
            "text": "パッケージを使うときは、モジュール名の前にパッケージ名を付けてインポートします。"
          },
          {
            "type": "code",
            "filename": "use_package.py",
            "lang": "python",
            "code": `import my_package.math_utils
  
print(my_package.math_utils.add(2, 3))  # 5
  
# 部分的にインポートすることも可能
from my_package import math_utils
print(math_utils.add(5, 7))`
          },
          {
            "type": "p",
            "text": "`__init__.py` は空でもかまいませんが、パッケージの初期化処理や外部に公開するシンボルを定義する場所としても使えます。"
          },
          {
            "type": "ul",
            "items": [
              "パッケージ = 複数モジュールの集合（フォルダ単位）",
              "`__init__.py` があるディレクトリがパッケージとして認識される",
              "ネームスペースを階層的に整理できる",
              "大規模プロジェクトや外部ライブラリでは必須の仕組み"
            ]
          }
        ],
        "level": "basic",
        "estMin": 10
      }
    ]
  },
  {
    "key": "python-io",
    "title": "Pythonの入力と出力",
    "lessons": [
      {
        "id": "input-output",
        "title": "入力と出力",
        "summary": "Python では `print()` 関数で出力し、`input()` 関数でユーザーから入力を受け取れます。",
        "content": [
          {
            "type": "p",
            "text": "Python の基本的な出力は `print()` 関数で行い、入力は `input()` 関数を使って標準入力から受け取ります。"
          },
          {
            "type": "code",
            "filename": "basic-io.py",
            "lang": "python",
            "code": `# 出力
print("Hello, World!")
  
# 入力
name = input("あなたの名前は？: ")
print("こんにちは,", name)`
          },
          {
            "type": "ul",
            "items": [
              "`print()` は複数の値をカンマで区切って出力可能",
              "`input()` は常に文字列として入力を受け取る（必要に応じて型変換する）",
              "例えば `int(input(\"数値を入力: \"))` のようにして数値入力も可能"
            ]
          }
        ],
        "level": "basic",
        "estMin": 5
      },
      {
        "id": "formatting-output",
        "title": "出力を見やすくフォーマットする",
        "summary": "Python では文字列を柔軟に整形して出力できます。",
        "content": [
          {
            "type": "p",
            "text": "複雑な出力を行う場合、文字列のフォーマット機能を使うと見やすく整理された出力ができます。"
          }
        ],
        "level": "basic",
        "estMin": 3
      },
      {
        "id": "f-string",
        "title": "フォーマット済み文字列リテラル",
        "summary": "Python 3.6 以降で導入された f-string は、最も簡潔な文字列フォーマット方法です。",
        "content": [
          {
            "type": "p",
            "text": "f-string（フォーマット済み文字列リテラル）は、文字列の前に `f` を付けて `{}` 内に式を書くだけで埋め込みができる構文です。"
          },
          {
            "type": "code",
            "filename": "f-string.py",
            "lang": "python",
            "code": `name = "Alice"
age = 25
print(f"{name} は {age} 歳です")  # Alice は 25 歳です`
          },
          {
            "type": "ul",
            "items": [
              "Python 3.6 以降で使用可能",
              "式を直接埋め込める（計算式などもOK）",
              "`{変数:指定}` で桁数や小数点のフォーマットも可能"
            ]
          }
        ],
        "level": "basic",
        "estMin": 5
      },
      {
        "id": "format-method",
        "title": "文字列の format() メソッド",
        "summary": "Python 2 系からある柔軟なフォーマット方法です。",
        "content": [
          {
            "type": "p",
            "text": "`format()` メソッドを使うと、文字列内に `{}` をプレースホルダとして値を埋め込めます。"
          },
          {
            "type": "code",
            "filename": "format-method.py",
            "lang": "python",
            "code": `name = "Bob"
age = 30
print("名前: {}, 年齢: {}".format(name, age))
print("名前: {n}, 年齢: {a}".format(n=name, a=age))`
          },
          {
            "type": "ul",
            "items": [
              "位置引数とキーワード引数の両方が使用可能",
              "桁数指定や整列も可能：`{:<10}`, `{:>10}`, `{:.2f}` など"
            ]
          }
        ],
        "level": "basic",
        "estMin": 5
      },
      {
        "id": "manual-format",
        "title": "文字列の手作業でのフォーマット",
        "summary": "文字列結合や `+` 演算子でシンプルなフォーマットも可能です。",
        "content": [
          {
            "type": "p",
            "text": "もっとも単純な方法として、`+` や `,` を使って文字列と変数を結合する方法もあります。"
          },
          {
            "type": "code",
            "filename": "manual-format.py",
            "lang": "python",
            "code": `name = "Charlie"
age = 28
print("名前: " + name + ", 年齢: " + str(age))`
          },
          {
            "type": "p",
            "text": "ただし、この方法は可読性が低く、型変換も必要になるため、f-string や `format()` の方が推奨されます。"
          }
        ],
        "level": "basic",
        "estMin": 4
      },
      {
        "id": "old-formatting",
        "title": "古い文字列書式設定方法",
        "summary": "`%` 演算子を使った C 言語風のフォーマットです。",
        "content": [
          {
            "type": "p",
            "text": "古い形式のフォーマット方法として `%` 演算子を使う方法もありますが、現在では f-string や `format()` が推奨されています。"
          },
          {
            "type": "code",
            "filename": "old-format.py",
            "lang": "python",
            "code": `name = "Diana"
age = 22
print("名前: %s, 年齢: %d" % (name, age))`
          }
        ],
        "level": "basic",
        "estMin": 3
      },
      {
        "id": "file-io",
        "title": "ファイルを読み書きする",
        "summary": "Python では `open()` を使って簡単にファイル操作ができます。",
        "content": [
          {
            "type": "p",
            "text": "`open()` 関数を使ってファイルを開き、`read()` や `write()` メソッドで読み書きします。ファイルは使い終わったら必ず閉じるようにしましょう（`with` を使うと自動で閉じられます）。"
          },
          {
            "type": "code",
            "filename": "file-io.py",
            "lang": "python",
            "code": `# 書き込み
with open("example.txt", "w", encoding="utf-8") as f:
    f.write("Hello, File!")
  
# 読み込み
with open("example.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print(content)`
          },
          {
            "type": "ul",
            "items": [
              "`open(path, mode)` でファイルを開く（`w`: 書き込み, `r`: 読み込み, `a`: 追記）",
              "`with` を使うと自動的にファイルが閉じられる",
              "`read()`, `readline()`, `readlines()` などで読み込み可能"
            ]
          }
        ],
        "level": "basic",
        "estMin": 6
      },
      {
        "id": "file-methods",
        "title": "ファイルオブジェクトのメソッド",
        "summary": "ファイルオブジェクトには多くの便利なメソッドがあります。",
        "content": [
          {
            "type": "p",
            "text": "主なファイルメソッドは以下の通りです："
          },
          {
            "type": "ul",
            "items": [
              "`f.read(size)`：指定サイズ分読み込む（未指定なら全体）",
              "`f.readline()`：1 行だけ読み込む",
              "`f.readlines()`：全行をリストとして読み込む",
              "`f.write(text)`：文字列を書き込む",
              "`f.writelines(list)`：複数行をまとめて書き込む",
              "`f.close()`：ファイルを閉じる（`with` 使用時は不要）"
            ]
          }
        ],
        "level": "basic",
        "estMin": 4
      },
      {
        "id": "json-io",
        "title": "json による構造化されたデータの保存",
        "summary": "Python の辞書やリストを JSON ファイルとして保存・読み込みできます。",
        "content": [
          {
            "type": "p",
            "text": "JSON（JavaScript Object Notation）は、軽量なデータ交換形式です。Python の `json` モジュールを使うと、辞書やリストなどの構造化データを簡単に保存・読み込みできます。"
          },
          {
            "type": "code",
            "filename": "json-io.py",
            "lang": "python",
            "code": `import json
  
data = {"name": "Alice", "age": 25}
  
# 保存
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
  
# 読み込み
with open("data.json", "r", encoding="utf-8") as f:
    loaded = json.load(f)
  
print(loaded["name"])  # Alice`
          },
          {
            "type": "ul",
            "items": [
              "`json.dump(obj, file)`：オブジェクトを JSON 形式でファイルに書き込む",
              "`json.load(file)`：JSON ファイルから Python オブジェクトを読み込む",
              "`indent` を指定すると整形された JSON を出力可能"
            ]
          }
        ],
        "level": "basic",
        "estMin": 7
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
            プログラミング言語学習（Python）
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