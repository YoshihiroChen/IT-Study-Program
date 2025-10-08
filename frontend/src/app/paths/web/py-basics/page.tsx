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
  },
  {
    "key": "python-errors-exceptions",
    "title": "Pythonのエラーと例外",
    "lessons": [
      {
        "id": "exceptions-overview",
        "title": "例外とは",
        "summary": "例外は、プログラム実行中に発生する“異常事態”を表すオブジェクトです。",
        "content": [
          {
            "type": "p",
            "text": "例外（Exception）は、**通常の処理フローを中断してエラーハンドリングへ制御を移す仕組み** です。Python では例外もオブジェクトであり、型（クラス）を持ちます。発生時にはスタックを遡って（伝播して）対応する `except` が見つかるまで探索します。"
          },
          {
            "type": "code",
            "filename": "exception-overview.py",
            "lang": "python",
            "code": `def div(a, b):
    return a / b  # b=0 のとき ZeroDivisionError
  
print(div(10, 2))
print(div(10, 0))  # ここで例外が発生してプログラムは中断する`
          },
          {
            "type": "ul",
            "items": [
              "例外はクラス階層を持つ（基底は Exception）",
              "未処理の例外はプログラムをクラッシュさせる",
              "try/except で捕捉し、適切に処理・ログ化・再送出できる"
            ]
          }
        ],
        "level": "basic",
        "estMin": 6
      },
      {
        "id": "try-except",
        "title": "try/except の基本",
        "summary": "エラーが起こりうる処理を `try` に入れ、`except` で捕捉します。",
        "content": [
          {
            "type": "p",
            "text": "最小構成は `try:` と `except 例外型:` の組み合わせです。例外オブジェクトは `as e` で受け取れます。"
          },
          {
            "type": "code",
            "filename": "try-except-basic.py",
            "lang": "python",
            "code": `try:
    n = int(input("数字を入力: "))
    print(100 // n)
except ValueError as e:
    print("数字に変換できません:", e)
except ZeroDivisionError:
    print("0 で割ることはできません")`
          },
          {
            "type": "ul",
            "items": [
              "複数の例外を並べて個別に処理できる",
              "タプルでまとめて捕捉も可能：`except (TypeError, ValueError): ...`",
              "例外の型はできるだけ具体的に（広すぎる捕捉は避ける）"
            ]
          }
        ],
        "level": "basic",
        "estMin": 7
      },
      {
        "id": "else-finally",
        "title": "else / finally 節",
        "summary": "`else` は例外が起きなかったときに、`finally` は結果に関わらず必ず実行されます。",
        "content": [
          {
            "type": "p",
            "text": "`else` は try ブロックが成功した場合だけ実行され、`finally` はクリーンアップ処理のために常に実行されます。"
          },
          {
            "type": "code",
            "filename": "else-finally.py",
            "lang": "python",
            "code": `try:
    f = open("data.txt", "r", encoding="utf-8")
    content = f.read()
except FileNotFoundError:
    print("ファイルがありません")
else:
    print("読み込み成功:", len(content))
finally:
    # f が存在する場合のみ閉じる
    try:
        f.close()
    except NameError:
        pass`
          },
          {
            "type": "ul",
            "items": [
              "`else` は “成功時の後処理” を書く場所",
              "`finally` はリソース解放・接続終了などに最適",
              "try ブロックは最小限の範囲にする（読みやすさ向上）"
            ]
          }
        ],
        "level": "basic",
        "estMin": 7
      },
      {
        "id": "raise-reraise",
        "title": "例外を送出・再送出する (`raise`)",
        "summary": "`raise` で意図的に例外を送出できます。`raise` 単独で再送出も可能です。",
        "content": [
          {
            "type": "p",
            "text": "バリデーションや不正状態の通知に `raise` を使います。`except` 内で `raise` 単独を使うと “同じ例外” を再送出できます。"
          },
          {
            "type": "code",
            "filename": "raise-reraise.py",
            "lang": "python",
            "code": `def positive(n: int) -> int:
    if n <= 0:
        raise ValueError("n must be positive")
    return n
  
try:
    positive(-3)
except ValueError as e:
    print("ログだけ残して再送出")
    raise  # スタック情報を保ったまま再送出`
          },
          {
            "type": "ul",
            "items": [
              "入力チェック・契約違反の検知に `raise` を使う",
              "再送出は上位レイヤに判断を委ねるときに有効",
              "ユーザー向けメッセージとログ向け技術情報は分離するのが理想"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 7
      },
      {
        "id": "exception-chaining",
        "title": "例外の連鎖（`raise ... from ...`）",
        "summary": "元の原因となった例外を保持したまま新しい例外へ変換できます。",
        "content": [
          {
            "type": "p",
            "text": "`raise NewError(...) from original` を使うと、**原因となった例外（cause）** を保ったまま文脈に適した例外へ変換できます。"
          },
          {
            "type": "code",
            "filename": "exception-chaining.py",
            "lang": "python",
            "code": `def parse_age(raw: str) -> int:
      try:
          return int(raw)
      except ValueError as e:
          raise ValueError("年齢の形式が不正です") from e`
          },
          {
            "type": "ul",
            "items": [
              "低レベル例外を高レベルのドメイン例外へマッピング可能",
              "デバッグ時に “本当の原因” がたどれるので有用"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 6
      },
      {
        "id": "custom-exceptions",
        "title": "ユーザー定義例外",
        "summary": "独自のドメインエラーを作るには Exception を継承します。",
        "content": [
          {
            "type": "p",
            "text": "プロジェクト固有の失敗を区別したい場合は、**独自の例外クラス** を定義します。用途別に階層を切ると保守しやすくなります。"
          },
          {
            "type": "code",
            "filename": "custom-exceptions.py",
            "lang": "python",
            "code": `class AppError(Exception):
    """アプリ共通の基底例外"""
  
class ConfigError(AppError):
    pass
  
class NetworkError(AppError):
    pass
  
def load_config(path: str) -> dict:
    if path.endswith(".json") is False:
        raise ConfigError("設定ファイルは .json のみ対応")
    return {"ok": True}`
          },
          {
            "type": "ul",
            "items": [
              "基底クラスを 1 つ用意しておくと “アプリ全例外” を一括捕捉できる",
              "例外メッセージはユーザー／開発者の双方に伝わる表現を心掛ける"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 7
      },
      {
        "id": "cleanup-with",
        "title": "クリーンアップと with 文（コンテキスト管理）",
        "summary": "`with` を使うと例外の有無に関係なく安全にリソースを解放できます。",
        "content": [
          {
            "type": "p",
            "text": "`try/finally` のパターンは `with` で簡潔に書けます。ファイル、ロック、DB 接続など“開いたら閉じる”資源で必須です。"
          },
          {
            "type": "code",
            "filename": "with-cleanup.py",
            "lang": "python",
            "code": `# ファイルは with で自動クローズ
  with open("log.txt", "a", encoding="utf-8") as f:
      f.write("entry\\n")  # 例外が起きても必ず閉じられる`
          },
          {
            "type": "ul",
            "items": [
              "コンテキストマネージャは `__enter__` / `__exit__` で実装される",
              "自作も可能（contextlib やクラス実装）"
            ]
          }
        ],
        "level": "basic",
        "estMin": 5
      },
      {
        "id": "assertions",
        "title": "アサーション（`assert`）",
        "summary": "開発時の不変条件チェックに使います（本番では無効化されうる）。",
        "content": [
          {
            "type": "p",
            "text": "`assert 条件, メッセージ` は条件が偽のとき `AssertionError` を送出します。**最適化モード（`python -O`）では無効化** される点に注意。"
          },
          {
            "type": "code",
            "filename": "assertion.py",
            "lang": "python",
            "code": `def normalized(p: float) -> float:
      assert 0.0 <= p <= 1.0, "p は 0..1 の範囲"
      return p`
          },
          {
            "type": "ul",
            "items": [
              "ユーザー入力の検証には `assert` ではなく通常のバリデーション＋例外を使う",
              "アサーションは“バグ検出用”"
            ]
          }
        ],
        "level": "basic",
        "estMin": 5
      },
      {
        "id": "logging",
        "title": "エラーロギングとデバッグ",
        "summary": "`logging` を使うとスタックトレース付きの診断ログを残せます。",
        "content": [
          {
            "type": "p",
            "text": "`print()` ではなく `logging` を使うと、レベル管理・出力先切替・フォーマット統一が可能です。例外時は `logger.exception()` が便利です。"
          },
          {
            "type": "code",
            "filename": "logging-errors.py",
            "lang": "python",
            "code": `import logging
  
logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s %(levelname)s %(message)s")
  
logger = logging.getLogger(__name__)
  
try:
    1 / 0
except Exception:
    logger.exception("計算に失敗しました")  # スタックトレース付きで出力`
          },
          {
            "type": "ul",
            "items": [
              "`logger.exception()` は except 節で使うと自動で traceback を付与",
              "ユーザー向け表示とログの詳細は分ける（情報漏洩対策）"
            ]
          }
        ],
        "level": "basic",
        "estMin": 6
      },
      {
        "id": "suppress-and-pitfalls",
        "title": "例外の抑制と落とし穴",
        "summary": "必要最小限の捕捉・`contextlib.suppress`・“素手の except” の回避。",
        "content": [
          {
            "type": "p",
            "text": "“何でも捕る” はバグ隠しになります。**広すぎる捕捉や空の except は避ける** のが原則です。どうしても無視したい一時的な例外は `contextlib.suppress` を使います。"
          },
          {
            "type": "code",
            "filename": "suppress-pitfalls.py",
            "lang": "python",
            "code": `from contextlib import suppress
  
# NG: 何でも捕ると KeyboardInterrupt 等も飲み込む恐れ
# try:
#     risky()
# except Exception:
#     pass  # 事故の元
  
# OK: 特定の例外だけを明示して抑制
with suppress(FileNotFoundError):
    open("maybe_missing.txt").read()`
          },
          {
            "type": "ul",
            "items": [
              "`except Exception:` でも広すぎることが多い（必要ならログして再送出）",
              "`except:` は BaseException まで捕るため原則禁止（SystemExit/KeyboardInterrupt を飲む）",
              "“捕って何もしない” は最終手段。最低限ログを残す"
            ]
          }
        ],
        "level": "intermediate",
        "estMin": 7
      },
      {
        "id": "builtin-exceptions",
        "title": "よく使う組み込み例外",
        "summary": "代表的な例外と発生場面を把握しておくと、迅速に原因を特定できます。",
        "content": [
          {
            "type": "p",
            "text": "頻出の組み込み例外と典型的な発生条件："
          },
          {
            "type": "ul",
            "items": [
              "`TypeError`：引数の型が不正（例: `len(10)`）",
              "`ValueError`：型は合っているが値が不正（例: `int('abc')`）",
              "`KeyError`：辞書にキーが存在しない",
              "`IndexError`：シーケンスの範囲外アクセス",
              "`FileNotFoundError`：指定ファイルが存在しない",
              "`ZeroDivisionError`：0 除算",
              "`TimeoutError`：タイムアウト関連の失敗",
              "`AssertionError`：`assert` が失敗"
            ]
          }
        ],
        "level": "basic",
        "estMin": 5
      },
      {
        "id": "best-practices",
        "title": "要約とベストプラクティス",
        "summary": "例外設計・捕捉・ログ・再送出の基本指針を整理します。",
        "content": [
          {
            "type": "ul",
            "items": [
              "try の範囲は最小限にし、成功フローは `else` に逃がす",
              "具体的な例外型だけを捕捉し、意味のある回復・再試行・メッセージを提供",
              "ユーザー向けメッセージと内部ログを分ける（`logging` を活用）",
              "低レベル→高レベルへは `raise ... from ...` で文脈を保つ",
              "独自例外の基底クラスを作り、階層化して保守性を上げる",
              "リソース解放は `with` または `finally` を徹底",
              "`assert` はバグ検出用、入力検証には使わない"
            ]
          }
        ],
        "level": "basic",
        "estMin": 6
      }
    ]
  },
  {
    "key": "python-classes",
    "title": "Pythonのクラス",
    "lessons": [
      {
        "id": "names-and-objects",
        "title": "名前とオブジェクトについて",
        "summary": "Python のすべての値はオブジェクトであり、名前はそれを指すラベルのようなものです。",
        "content": [
          {
            "type": "p",
            "text": "Python では、**すべてがオブジェクト** です。整数や文字列だけでなく、関数、クラス、モジュールまでもがオブジェクトです。そして変数は「オブジェクトを指すラベル」に過ぎません。"
          },
          {
            "type": "code",
            "filename": "names-objects.py",
            "lang": "python",
            "code": `a = [1, 2, 3]
b = a  # b は a と同じリストを指す
b.append(4)
print(a)  # [1, 2, 3, 4]`
          },
          {
            "type": "ul",
            "items": [
              "変数はオブジェクトそのものではなく、オブジェクトへの参照（名前）",
              "複数の名前が同じオブジェクトを指すことも可能",
              "`id()` でオブジェクトの識別子を確認できる"
            ]
          }
        ],
        "level": "basic",
        "estMin": 5
      },
      {
        "id": "scope-namespace",
        "title": "Python のスコープと名前空間",
        "summary": "スコープは名前が有効な範囲、名前空間は名前とオブジェクトの対応表です。",
        "content": [
          {
            "type": "p",
            "text": "Python では名前が有効な範囲（スコープ）と、それがどのオブジェクトを指すかを管理する名前空間（namespace）が密接に関係しています。名前解決は LEGB ルール（Local → Enclosing → Global → Built-in）に従って行われます。"
          },
          {
            "type": "code",
            "filename": "scope-namespace.py",
            "lang": "python",
            "code": `x = "global"
  
def outer():
    x = "enclosing"
    def inner():
        x = "local"
        print(x)  # local
    inner()
    print(x)  # enclosing
  
outer()
print(x)  # global`
          }
        ],
        "level": "basic",
        "estMin": 6
      },
      {
        "id": "scope-example",
        "title": "スコープと名前空間の例",
        "summary": "ローカル・グローバル・ビルトインなど、スコープの例です。",
        "content": [
          {
            "type": "code",
            "filename": "scope-example.py",
            "lang": "python",
            "code": `x = 10  # グローバルスコープ
  
def func():
    y = 5  # ローカルスコープ
    print(x + y)
  
func()`
          },
          {
            "type": "ul",
            "items": [
              "ローカル: 関数内で定義された変数",
              "グローバル: モジュール全体で有効な変数",
              "ビルトイン: Python が提供する名前空間（例: `len`, `print`）"
            ]
          }
        ],
        "level": "basic",
        "estMin": 4
      },
      {
        "id": "class-intro",
        "title": "クラス初見",
        "summary": "クラスはオブジェクト指向の中心的な構造で、データと処理をひとまとめにします。",
        "content": [
          {
            "type": "p",
            "text": "クラスは、**データ（属性）と動作（メソッド）をまとめて扱う** ための仕組みです。Python では `class` キーワードを使って定義します。"
          }
        ],
        "level": "basic",
        "estMin": 4
      },
      {
        "id": "class-syntax",
        "title": "クラス定義の構文",
        "summary": "`class` キーワードでクラスを定義します。",
        "content": [
          {
            "type": "code",
            "filename": "class-basic.py",
            "lang": "python",
            "code": `class Person:
    def __init__(self, name):
        self.name = name
  
    def greet(self):
        print(f"こんにちは、{self.name}です")
  
p = Person("Alice")
p.greet()`
          },
          {
            "type": "ul",
            "items": [
              "`__init__` はコンストラクタで、インスタンス生成時に呼ばれる",
              "`self` はインスタンス自身を指す",
              "属性は `self.属性名` として定義・アクセスする"
            ]
          }
        ],
        "level": "basic",
        "estMin": 6
      },
      {
        "id": "class-object",
        "title": "クラスオブジェクト",
        "summary": "クラスもオブジェクトであり、動的に操作できます。",
        "content": [
          {
            "type": "p",
            "text": "Python ではクラスそのものもオブジェクトであり、他の関数に渡したり、属性を動的に追加することが可能です。"
          }
        ],
        "level": "intermediate",
        "estMin": 4
      },
      {
        "id": "instance-object",
        "title": "インスタンスオブジェクト",
        "summary": "クラスを呼び出すとインスタンスが生成されます。",
        "content": [
          {
            "type": "p",
            "text": "クラスを関数のように呼ぶと、そのクラスのインスタンスが生成されます。インスタンスはクラスの属性やメソッドにアクセスできます。"
          }
        ],
        "level": "basic",
        "estMin": 4
      },
      {
        "id": "method-object",
        "title": "メソッドオブジェクト",
        "summary": "インスタンスメソッドは、呼び出されると自動的に `self` を受け取ります。",
        "content": [
          {
            "type": "code",
            "filename": "method-object.py",
            "lang": "python",
            "code": `class Counter:
    def __init__(self, start=0):
        self.value = start
  
    def increment(self):
        self.value += 1
  
c = Counter()
c.increment()
print(c.value)  # 1`
          }
        ],
        "level": "basic",
        "estMin": 5
      },
      {
        "id": "class-instance-vars",
        "title": "クラスとインスタンス変数",
        "summary": "クラス変数は全インスタンスで共有され、インスタンス変数はそれぞれに固有です。",
        "content": [
          {
            "type": "code",
            "filename": "class-vs-instance-vars.py",
            "lang": "python",
            "code": `class Dog:
    species = "犬"  # クラス変数（共有）
  
    def __init__(self, name):
        self.name = name  # インスタンス変数（個別）
  
a = Dog("ポチ")
b = Dog("ハチ")
  
print(a.species, b.species)  # 犬 犬
a.species = "オオカミ"
print(a.species, b.species)  # オオカミ 犬`
          }
        ],
        "level": "basic",
        "estMin": 5
      },
      {
        "id": "class-cautions",
        "title": "いろいろな注意点",
        "summary": "ミュータブルなクラス変数や動的属性追加に注意。",
        "content": [
          {
            "type": "p",
            "text": "クラス変数にリストや辞書などミュータブルなオブジェクトを使うと、すべてのインスタンスで共有されるため意図しない挙動になることがあります。"
          }
        ],
        "level": "intermediate",
        "estMin": 4
      },
      {
        "id": "inheritance",
        "title": "継承",
        "summary": "既存のクラスを拡張して新しいクラスを作成できます。",
        "content": [
          {
            "type": "code",
            "filename": "inheritance.py",
            "lang": "python",
            "code": `class Animal:
    def speak(self):
        print("...")
  
class Dog(Animal):
    def speak(self):
        print("ワン！")
  
Dog().speak()  # ワン！`
          }
        ],
        "level": "basic",
        "estMin": 6
      },
      {
        "id": "multiple-inheritance",
        "title": "多重継承",
        "summary": "複数のクラスから継承することも可能です。",
        "content": [
          {
            "type": "code",
            "filename": "multiple-inheritance.py",
            "lang": "python",
            "code": `class A:
    def greet(self):
        print("A")
  
class B:
    def greet(self):
        print("B")
  
class C(A, B):
    pass
  
C().greet()  # A （MRO に従う）`
          }
        ],
        "level": "intermediate",
        "estMin": 5
      },
      {
        "id": "private-vars",
        "title": "プライベート変数",
        "summary": "名前の前に `__` を付けると外部からアクセスしづらくなります。",
        "content": [
          {
            "type": "code",
            "filename": "private-vars.py",
            "lang": "python",
            "code": `class Account:
    def __init__(self, balance):
        self.__balance = balance
  
    def get_balance(self):
        return self.__balance
  
a = Account(100)
print(a.get_balance())
# print(a.__balance)  # AttributeError`
          }
        ],
        "level": "basic",
        "estMin": 5
      },
      {
        "id": "others",
        "title": "残りのはしばし",
        "summary": "クラスは動的に定義したり、属性を追加することも可能です。",
        "content": [
          {
            "type": "p",
            "text": "Python のクラスは柔軟で、定義後に属性やメソッドを追加することもできます。これは他の静的型言語との大きな違いです。"
          }
        ],
        "level": "intermediate",
        "estMin": 4
      },
      {
        "id": "iterator",
        "title": "イテレータ (iterator)",
        "summary": "`__iter__` と `__next__` を実装すると、オブジェクトを反復処理可能にできます。",
        "content": [
          {
            "type": "code",
            "filename": "iterator.py",
            "lang": "python",
            "code": `class Counter:
    def __init__(self, stop):
        self.current = 0
        self.stop = stop
  
    def __iter__(self):
        return self
  
    def __next__(self):
        if self.current >= self.stop:
            raise StopIteration
        self.current += 1
        return self.current
  
for i in Counter(3):
    print(i)  # 1, 2, 3`
          }
        ],
        "level": "intermediate",
        "estMin": 6
      },
      {
        "id": "generator",
        "title": "ジェネレータ (generator)",
        "summary": "`yield` を使って簡単にイテレータを作成できます。",
        "content": [
          {
            "type": "code",
            "filename": "generator.py",
            "lang": "python",
            "code": `def countdown(n):
    while n > 0:
        yield n
        n -= 1
  
for i in countdown(3):
    print(i)  # 3, 2, 1`
          }
        ],
        "level": "basic",
        "estMin": 5
      },
      {
        "id": "generator-expr",
        "title": "ジェネレータ式",
        "summary": "内包表記のような簡潔な構文でジェネレータを生成できます。",
        "content": [
          {
            "type": "code",
            "filename": "generator-expr.py",
            "lang": "python",
            "code": `squares = (x * x for x in range(5))
for n in squares:
    print(n)`
          },
          {
            "type": "ul",
            "items": [
              "リスト内包表記に似ているが、即時実行されず遅延評価される",
              "メモリ効率がよく、大量データ処理に向いている"
            ]
          }
        ],
        "level": "basic",
        "estMin": 5
      }
    ]
  },
  {
    "key": "python-venv-packages",
    "title": "仮想環境とパッケージ",
    "lessons": [
      {
        "id": "what-is-venv",
        "title": "仮想環境とは",
        "summary": "プロジェクトごとに独立した Python 実行環境を構築できる仕組みです。",
        "content": [
          {
            "type": "p",
            "text": "仮想環境（virtual environment）とは、**プロジェクトごとに独立した Python 実行環境を作る仕組み** です。これにより、異なるプロジェクト間で使用するライブラリやバージョンが衝突しないようにできます。"
          },
          {
            "type": "p",
            "text": "たとえば、あるプロジェクトでは Django 3.2 を使い、別のプロジェクトでは Django 4.0 を使いたい場合、仮想環境を使えば両方を同じマシン上で共存させられます。"
          },
          {
            "type": "code",
            "filename": "check-python-env.py",
            "lang": "bash",
            "code": "# 現在の Python のパス確認\necho $(which python3)\n\n# 現在インストールされているパッケージ一覧\npip list"
          },
          {
            "type": "ul",
            "items": [
              "仮想環境は Python の標準機能として提供されている（`venv` モジュール）",
              "各プロジェクトで必要なパッケージを独立して管理できる",
              "グローバル環境を汚さず、安全に開発できる"
            ]
          }
        ],
        "level": "basic",
        "estMin": 6
      },
      {
        "id": "create-venv",
        "title": "仮想環境の作成",
        "summary": "`venv` モジュールを使ってプロジェクトごとに独立した環境を作成します。",
        "content": [
          {
            "type": "p",
            "text": "`python -m venv` コマンドで簡単に仮想環境を作成できます。通常はプロジェクトディレクトリ直下に `venv` フォルダを作成します。"
          },
          {
            "type": "code",
            "filename": "create-venv.sh",
            "lang": "bash",
            "code": "# 仮想環境の作成\npython3 -m venv venv\n\n# 仮想環境の有効化（macOS / Linux）\nsource venv/bin/activate\n\n# 仮想環境の有効化（Windows）\nvenv\\Scripts\\activate"
          },
          {
            "type": "p",
            "text": "仮想環境が有効になると、コマンドラインの先頭に `(venv)` のような表示が出て、使用される Python や pip がその環境内のものに切り替わります。"
          },
          {
            "type": "code",
            "filename": "check-env.sh",
            "lang": "bash",
            "code": "# 現在の Python パスを確認\nwhich python3\n\n# 仮想環境を終了\ndeactivate"
          },
          {
            "type": "ul",
            "items": [
              "`python -m venv venv` で環境を作成",
              "`source venv/bin/activate`（macOS / Linux）または `venv\\Scripts\\activate`（Windows）で有効化",
              "`deactivate` でいつでも元に戻せる"
            ]
          }
        ],
        "level": "basic",
        "estMin": 7
      },
      {
        "id": "pip-package-management",
        "title": "pipを使ったパッケージ管理",
        "summary": "pip は Python 標準のパッケージ管理ツールで、ライブラリのインストール・更新・削除ができます。",
        "content": [
          {
            "type": "p",
            "text": "`pip` は Python 標準のパッケージ管理ツールで、外部ライブラリのインストールやバージョン管理を行います。仮想環境内で使用することで、プロジェクトごとに依存関係を分離できます。"
          },
          {
            "type": "code",
            "filename": "pip-commands.sh",
            "lang": "bash",
            "code": "# パッケージのインストール\npip install requests\n\n# バージョン指定でインストール\npip install django==4.2.0\n\n# インストール済みパッケージの一覧\npip list\n\n# パッケージのアップグレード\npip install --upgrade requests\n\n# パッケージのアンインストール\npip uninstall requests"
          },
          {
            "type": "p",
            "text": "プロジェクトの依存関係を共有したいときは、`requirements.txt` に一覧を書き出して共有するのが一般的です。"
          },
          {
            "type": "code",
            "filename": "requirements.sh",
            "lang": "bash",
            "code": "# 現在の環境のパッケージを保存\npip freeze > requirements.txt\n\n# 別の環境で同じ構成を再現\npip install -r requirements.txt"
          },
          {
            "type": "ul",
            "items": [
              "`pip install パッケージ名` でインストール",
              "`pip list` や `pip show` で状態確認",
              "`requirements.txt` を使うと環境を簡単に再現できる",
              "仮想環境と pip を組み合わせるのが Python 開発の基本"
            ]
          }
        ],
        "level": "basic",
        "estMin": 8
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