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
    "key": "python-project-overview",
    "title": "作るプログラムの全体像",
    "lessons": [
      {
        "id": "what-we-will-build",
        "title": "この講座で作るもの",
        "summary": "この講座で完成させるプログラムの概要を説明します。",
        "content": [
          {
            "type": "p",
            "text": "この講座では、Python を使って **「就活の選考状況を管理する Todo プログラム」** を作成します。実際の就職活動を想定した、実用的なプログラムです。"
          },
          {
            "type": "p",
            "text": "完成したプログラムは、コマンドライン（ターミナルや Jupyter Notebook）上で動作し、ユーザーが入力した情報を元に選考状況を管理できます。"
          },
          {
            "type": "ul",
            "items": [
              "Python の基礎文法を使って動作する",
              "画面入力を通じて操作できる",
              "実務に近い考え方で設計されている"
            ]
          }
        ]
      },
      {
        "id": "program-features-overview",
        "title": "プログラムでできること",
        "summary": "完成後に使える機能を確認します。",
        "content": [
          {
            "type": "p",
            "text": "このプログラムでは、就職活動における選考情報を **一覧で管理し、状態を更新** できます。具体的には、次のような操作が可能です。"
          },
          {
            "type": "ul",
            "items": [
              "企業名・職種・選考段階を入力して新しい選考を登録する",
              "登録した選考情報を一覧で確認する",
              "選考の状態（TODO / DOING / DONE）を変更する",
              "操作を終了してプログラムを閉じる"
            ]
          }
        ]
      },
    ]
  },
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
      },
      {
        "id": "for-loop-basic",
        "title": "for 文による繰り返し処理",
        "summary": "リストなどの要素を1つずつ取り出して処理するための基本構文です。",
        "content": [
          {
            "type": "p",
            "text": "`for` 文は、**複数のデータを順番に処理したいとき** に使う制御構文です。Python では、リストや文字列などの「繰り返し可能なオブジェクト（イテラブル）」から要素を1つずつ取り出して処理を行います。"
          },
          {
            "type": "code",
            "filename": "for-basic.py",
            "lang": "python",
            "code": "fruits = [\"apple\", \"banana\", \"orange\"]\n\nfor fruit in fruits:\n    print(fruit)"
          },
          {
            "type": "p",
            "text": "この例では、`fruits` というリストの中身を先頭から順番に取り出し、変数 `fruit` に代入して処理しています。"
          },
          {
            "type": "ul",
            "items": [
              "`for 変数 in リスト`：リストの要素を1つずつ取り出す",
              "取り出された要素は、その都度 変数 に代入される",
              "リストの要素数だけ処理が繰り返される"
            ]
          },
          {
            "type": "p",
            "text": "`for` 文は、インデックス（番号）と一緒に要素を扱いたい場合にも使えます。その場合は `enumerate()` を利用します。"
          },
          {
            "type": "code",
            "filename": "for-enumerate.py",
            "lang": "python",
            "code": "fruits = [\"apple\", \"banana\", \"orange\"]\n\nfor i, fruit in enumerate(fruits):\n    print(i, fruit)"
          },
          {
            "type": "ul",
            "items": [
              "`enumerate(リスト)`：インデックスと要素を同時に取り出す",
              "`i`：0 から始まる番号（インデックス）",
              "`fruit`：リストの各要素"
            ]
          },
          {
            "type": "p",
            "text": "後の章で実装する就活Todoアプリでは、`for` 文を使って、登録された選考情報を1件ずつ表示したり、特定の条件に合うデータを探したりします。"
          }
        ]
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
        "id": "from-import-statement",
        "title": "from ... import ... 文",
        "summary": "モジュールの中から特定の機能だけを読み込むための構文です。",
        "content": [
          {
            "type": "p",
            "text": "Python では、機能ごとにコードをまとめた **モジュール（module）** を利用できます。`from ... import ...` は、そのモジュールの中から **必要なものだけを指定して読み込む** ための構文です。"
          },
          {
            "type": "p",
            "text": "通常の `import モジュール名` と異なり、`from` を使うことで、モジュール名を省略して直接機能を呼び出せるようになります。"
          },
          {
            "type": "code",
            "filename": "from-import-basic.py",
            "lang": "python",
            "code": "# datetime モジュール全体を読み込む場合\nimport datetime\n\nnow = datetime.datetime.now()\nprint(now)"
          },
          {
            "type": "p",
            "text": "一方で、`from ... import ...` を使うと、モジュール名を付けずにその機能を直接使用できます。"
          },
          {
            "type": "code",
            "filename": "from-import-direct.py",
            "lang": "python",
            "code": "# datetime モジュールから datetime クラスだけを読み込む\nfrom datetime import datetime\n\nnow = datetime.now()\nprint(now)"
          },
          {
            "type": "ul",
            "items": [
              "`import モジュール名`：モジュール全体を読み込む",
              "`from モジュール名 import 機能名`：必要な機能だけを読み込む",
              "`from` を使うとコードが短くなり、可読性が向上する"
            ]
          },
          {
            "type": "p",
            "text": "この教材で作成する就活Todoアプリでは、現在時刻を取得するために `from datetime import datetime` を使用します。これは、`datetime.now()` を簡潔に書くためです。"
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
  },
  {
    "key": "python-job-hunting-todo-implementation",
    "title": "就活Todoアプリの実装",
    "lessons": [
      {
        "id": "full-source-code",
        "title": "完成版プログラムの全体コード",
        "summary": "まずは完成した就活Todoアプリの全体像を確認します。",
        "content": [
          {
            "type": "p",
            "text": "この章では、これまで設計してきた内容をもとに、**就活選考を管理する Todo アプリ** を実際に実装します。まずは、完成版のプログラム全体を確認しましょう。"
          },
          {
            "type": "p",
            "text": "この時点では、すべてを理解できなくても問題ありません。**後続の小節で、各部分を順番に詳しく解説** していきます。"
          },
          {
            "type": "code",
            "filename": "job_hunting_todo.py",
            "lang": "python",
            "code": "from datetime import datetime\nimport re\n\n# ----------------------------\n# データコンテナ：すべての記録はここに保存される\n# ----------------------------\ntodos = []\nNEXT_ID = 1\n\nDATE_RE = re.compile(r\"^\\d{4}-\\d{2}-\\d{2}$\")\n\n# ----------------------------\n# ユーティリティ関数\n# ----------------------------\ndef now_str() -> str:\n    return datetime.now().strftime(\"%Y-%m-%d %H:%M\")\n\ndef input_nonempty(prompt: str) -> str:\n    while True:\n        s = input(prompt).strip()\n        if s:\n            return s\n        print(\"入力は空にできません。もう一度入力してください。\")\n\ndef input_choice(prompt: str, choices: list[str]) -> str:\n    choices_str = \"/\".join(choices)\n    while True:\n        s = input(f\"{prompt} ({choices_str}): \").strip()\n        if s in choices:\n            return s\n        print(f\"次のいずれかを入力してください：{choices_str}\")\n\ndef input_date_strict_or_empty(prompt: str) -> str:\n    while True:\n        s = input(prompt).strip()\n        if s == \"\":\n            return \"\"\n        if not DATE_RE.match(s):\n            print(\"形式は YYYY-MM-DD にしてください（例：2026-01-02）。\")\n            continue\n        try:\n            datetime.strptime(s, \"%Y-%m-%d\")\n            return s\n        except ValueError:\n            print(\"存在しない日付です。もう一度入力してください。\")\n\ndef find_by_id(todo_id: int):\n    for t in todos:\n        if t[\"id\"] == todo_id:\n            return t\n    return None\n\ndef deadline_to_date_or_none(deadline: str):\n    if not deadline:\n        return None\n    return datetime.strptime(deadline, \"%Y-%m-%d\").date()\n\ndef sort_key_deadline(t):\n    d = deadline_to_date_or_none(t[\"deadline\"])\n    return (d is None, d)\n\ndef pretty_print_list(items: list[dict]) -> None:\n    if not items:\n        print(\"（記録はありません）\")\n        return\n    print(\"-\" * 80)\n    for t in items:\n        print(f\"[{t['id']}] {t['company']} / {t['role']} / {t['stage']}  DDL={t['deadline'] or '未設定'}  状態={t['status']}\")\n        print(f\"    更新日時: {t['updated_at']}\")\n    print(\"-\" * 80)\n\ndef input_id(prompt: str) -> int | None:\n    s = input_nonempty(prompt)\n    if not s.isdigit():\n        print(\"ID は数字で入力してください。\")\n        return None\n    return int(s)\n\n# ----------------------------\n# 機能：追加 / 一覧表示 / 状態更新\n# ----------------------------\ndef add_todo():\n    global NEXT_ID\n    company = input_nonempty(\"企業名：\")\n    role = input_nonempty(\"職種：\")\n    stage = input_nonempty(\"選考段階：\")\n    deadline = input_date_strict_or_empty(\"締切日（YYYY-MM-DD、未設定可）：\")\n    status = input_choice(\"状態\", [\"TODO\", \"DOING\", \"DONE\"])\n\n    todo = {\n        \"id\": NEXT_ID,\n        \"company\": company,\n        \"role\": role,\n        \"stage\": stage,\n        \"deadline\": deadline,\n        \"status\": status,\n        \"created_at\": now_str(),\n        \"updated_at\": now_str(),\n    }\n    todos.append(todo)\n    NEXT_ID += 1\n    print(\"追加しました。\")\n\ndef list_todos():\n    items = sorted(todos, key=sort_key_deadline)\n    pretty_print_list(items)\n\ndef update_status():\n    todo_id = input_id(\"状態を更新する ID を入力してください：\")\n    if todo_id is None:\n        return\n    t = find_by_id(todo_id)\n    if not t:\n        print(\"指定された ID は見つかりませんでした。\")\n        return\n    new_status = input_choice(\"新しい状態\", [\"TODO\", \"DOING\", \"DONE\"])\n    t[\"status\"] = new_status\n    t[\"updated_at\"] = now_str()\n    print(\"状態を更新しました。\")\n\n# ----------------------------\n# メインループ\n# ----------------------------\ndef run_app():\n    print(\"=== 就活選考 Todo ===\")\n    while True:\n        print(\"\\n操作を選択してください：\")\n        print(\"1) 選考を新規追加\")\n        print(\"2) 一覧を表示\")\n        print(\"3) 状態を更新\")\n        print(\"0) 終了\")\n        choice = input(\"番号を入力：\").strip()\n        if choice == \"1\":\n            add_todo()\n        elif choice == \"2\":\n            list_todos()\n        elif choice == \"3\":\n            update_status()\n        elif choice == \"0\":\n            print(\"終了します。\")\n            break\n        else:\n            print(\"無効な入力です。\")\n\nrun_app()"
          }
        ]
      },
      {
        "id": "data-and-global-variables",
        "title": "データとグローバル変数の役割",
        "summary": "プログラム全体で使われるデータの管理方法を理解します。",
        "content": [
          {
            "type": "p",
            "text": "このプログラムでは、選考情報を **グローバル変数** として管理しています。これにより、複数の関数から同じデータにアクセスできます。"
          },
          {
            "type": "ul",
            "items": [
              "`todos`：すべての選考情報を保存するリスト",
              "`NEXT_ID`：新しい選考に割り当てる一意な ID",
              "グローバル変数は小規模アプリでは扱いやすい"
            ]
          }
        ]
      },
      
    ]
  },
  {
    "key": "python-utility-functions-explanation",
    "title": "ユーティリティ関数の文法解説",
    "lessons": [
      {
        "id": "now-str-function",
        "title": "現在時刻を文字列で取得する関数",
        "summary": "datetime の利用、関数定義、戻り値（return）を確認します。",
        "content": [
          {
            "type": "code",
            "filename": "now_str.py",
            "lang": "python",
            "code": "def now_str() -> str:\n    return datetime.now().strftime(\"%Y-%m-%d %H:%M\")"
          },
          {
            "type": "ul",
            "items": [
              "`def now_str()`：関数定義（名前は now_str）",
              "`-> str`：戻り値が文字列（str）であることを示す型ヒント（実行時の動作は変えない）",
              "`return`：関数の結果を呼び出し元に返して関数を終了する",
              "`datetime.now()`：現在の日時（datetime型）を取得する",
              "`.strftime(\"%Y-%m-%d %H:%M\")`：日時を指定フォーマットの文字列に変換する（例：2026-01-10 13:54）",
              "`.`（ドット）：オブジェクトのメソッド呼び出し（now() / strftime() のように連結できる）"
            ]
          }
        ]
      },
      {
        "id": "input-nonempty",
        "title": "空入力を防ぐ入力関数",
        "summary": "while / if / input / strip を使った入力検証を学びます。",
        "content": [
          {
            "type": "code",
            "filename": "input_nonempty.py",
            "lang": "python",
            "code": "def input_nonempty(prompt: str) -> str:\n    while True:\n        s = input(prompt).strip()\n        if s:\n            return s\n        print(\"入力は空にできません。もう一度入力してください。\")"
          },
          {
            "type": "ul",
            "items": [
              "`prompt: str`：引数 prompt は文字列型（型ヒント）",
              "`while True`：無限ループ（正しい入力が来るまで繰り返す）",
              "`input(prompt)`：ユーザー入力を受け取る（戻り値は必ず文字列）",
              "`.strip()`：前後の空白（スペースや改行など）を削除する",
              "`if s:`：空文字列 \"\" は False 扱い、空でなければ True 扱い（真偽値判定）",
              "`return s`：正しい入力が得られた瞬間に関数を終了して返す",
              "`print(...)`：再入力を促すメッセージを表示する"
            ]
          }
        ]
      },
      {
        "id": "input-choice",
        "title": "選択肢を限定する入力関数",
        "summary": "list / join / f文字列 / in 演算子を理解します。",
        "content": [
          {
            "type": "code",
            "filename": "input_choice.py",
            "lang": "python",
            "code": "def input_choice(prompt: str, choices: list[str]) -> str:\n    choices_str = \"/\".join(choices)\n    while True:\n        s = input(f\"{prompt} ({choices_str}): \").strip()\n        if s in choices:\n            return s\n        print(f\"次のいずれかを入力してください：{choices_str}\")"
          },
          {
            "type": "ul",
            "items": [
              "`choices: list[str]`：choices は「文字列のリスト」",
              "`\"/\".join(choices)`：リストの要素を `/` 区切りで連結し、1つの文字列にする",
              "`choices_str = ...`：変数への代入（宣言）",
              "`input(f\"...\")`：f文字列で、変数を埋め込んだプロンプトを表示する",
              "`if s in choices`：入力 s が choices の中に含まれるかを判定（in 演算子）",
              "不正入力の場合は `print(...)` してループ継続、正しい場合は return で終了"
            ]
          }
        ]
      },
      {
        "id": "input-date-strict",
        "title": "日付形式を厳密に検証する関数",
        "summary": "正規表現（re）と例外処理（try/except）で入力を守ります。",
        "content": [
          {
            "type": "code",
            "filename": "input_date_strict_or_empty.py",
            "lang": "python",
            "code": "def input_date_strict_or_empty(prompt: str) -> str:\n    while True:\n        s = input(prompt).strip()\n        if s == \"\":\n            return \"\"\n        if not DATE_RE.match(s):\n            print(\"形式は YYYY-MM-DD にしてください（例：2026-01-02）。\")\n            continue\n        try:\n            datetime.strptime(s, \"%Y-%m-%d\")\n            return s\n        except ValueError:\n            print(\"存在しない日付です。もう一度入力してください。\")"
          },
          {
            "type": "ul",
            "items": [
              "`if s == \"\"`：空入力なら未設定として \"\" を返す",
              "`if not ...`：条件の否定（not）",
              "`DATE_RE.match(s)`：正規表現で「YYYY-MM-DD（ゼロ埋め必須）」の形か検証する",
              "`continue`：その周の残り処理をスキップして次のループへ戻る",
              "`try:`：例外が起きる可能性がある処理を試す",
              "`datetime.strptime(s, \"%Y-%m-%d\")`：文字列を日付として解析（無効なら ValueError）",
              "`except ValueError:`：解析に失敗した場合の処理（エラーメッセージ表示）"
            ]
          }
        ]
      },
      {
        "id": "find-by-id",
        "title": "ID でデータを検索する関数",
        "summary": "for ループと dict アクセスで「探す」処理を作ります。",
        "content": [
          {
            "type": "code",
            "filename": "find_by_id.py",
            "lang": "python",
            "code": "def find_by_id(todo_id: int):\n    for t in todos:\n        if t[\"id\"] == todo_id:\n            return t\n    return None"
          },
          {
            "type": "ul",
            "items": [
              "`todo_id: int`：引数 todo_id は整数（型ヒント）",
              "`for t in todos`：リスト todos を先頭から順に取り出す",
              "`t[\"id\"]`：辞書（dict）のキー \"id\" の値を取得する",
              "`==`：等しいかどうかを比較する演算子",
              "見つかったら `return t`、最後まで見つからなければ `return None`"
            ]
          }
        ]
      },
      {
        "id": "deadline-to-date",
        "title": "締切文字列を日付に変換する関数",
        "summary": "空（未設定）を None として扱い、安全に型変換します。",
        "content": [
          {
            "type": "code",
            "filename": "deadline_to_date_or_none.py",
            "lang": "python",
            "code": "def deadline_to_date_or_none(deadline: str):\n    if not deadline:\n        return None\n    return datetime.strptime(deadline, \"%Y-%m-%d\").date()"
          },
          {
            "type": "ul",
            "items": [
              "`if not deadline`：空文字 \"\" は False 扱い → 未設定なら None を返す",
              "`None`：値が存在しないことを表す特別な値",
              "`datetime.strptime(deadline, \"%Y-%m-%d\")`：文字列を datetime に変換する",
              "`.date()`：datetime から日付部分だけを取り出す（date型）"
            ]
          }
        ]
      },
      {
        "id": "sort-key-deadline",
        "title": "締切順ソートのためのキー関数",
        "summary": "タプルの比較を利用して、未設定の締切を最後に回します。",
        "content": [
          {
            "type": "code",
            "filename": "sort_key_deadline.py",
            "lang": "python",
            "code": "def sort_key_deadline(t):\n    d = deadline_to_date_or_none(t[\"deadline\"])\n    return (d is None, d)"
          },
          {
            "type": "ul",
            "items": [
              "`t[\"deadline\"]`：辞書から締切文字列を取り出す",
              "`d = ...`：変数 d に変換結果（date または None）を代入する",
              "`d is None`：None かどうかを判定（is は同一性の比較）",
              "`return (d is None, d)`：2要素のタプルを返す",
              "タプルは左から順に比較されるため、`(False, 日付)` が先、`(True, None)` が後になる → 未設定は最後に並ぶ"
            ]
          }
        ]
      },
      {
        "id": "pretty-print-list",
        "title": "一覧を見やすく表示する関数",
        "summary": "f文字列と文字列演算で整形して表示します。",
        "content": [
          {
            "type": "code",
            "filename": "pretty_print_list.py",
            "lang": "python",
            "code": "def pretty_print_list(items: list[dict]) -> None:\n    if not items:\n        print(\"（記録はありません）\")\n        return\n    print(\"-\" * 80)\n    for t in items:\n        print(f\"[{t['id']}] {t['company']} / {t['role']} / {t['stage']}  DDL={t['deadline'] or '未設定'}  状態={t['status']}\")\n        print(f\"    更新日時: {t['updated_at']}\")\n    print(\"-\" * 80)"
          },
          {
            "type": "ul",
            "items": [
              "`items: list[dict]`：辞書のリストを受け取る（型ヒント）",
              "`-> None`：この関数は値を返さない（表示だけする）",
              "`if not items`：空リストなら True → 記録なし表示して return",
              "`\"-\" * 80`：文字列を 80 回繰り返して横線を作る",
              "`for t in items`：一覧の各要素（辞書）を順番に表示する",
              "`f\"...\"`：f文字列で辞書の値を埋め込んで表示する",
              "`t['deadline'] or '未設定'`：deadline が空なら '未設定' を使う（or によるフォールバック）"
            ]
          }
        ]
      },
      {
        "id": "input-id",
        "title": "ID を整数として受け取る関数",
        "summary": "isdigit と int 変換で「数値として安全に扱う」方法を学びます。",
        "content": [
          {
            "type": "code",
            "filename": "input_id.py",
            "lang": "python",
            "code": "def input_id(prompt: str) -> int | None:\n    s = input_nonempty(prompt)\n    if not s.isdigit():\n        print(\"ID は数字で入力してください。\")\n        return None\n    return int(s)"
          },
          {
            "type": "ul",
            "items": [
              "`-> int | None`：戻り値は「int か None」のどちらか（Union 型の表現）",
              "`s.isdigit()`：文字列が数字だけで構成されているかを判定する",
              "`if not ...`：数字でなければエラー表示し None を返す",
              "`int(s)`：文字列を整数に変換する（数字以外だと例外になるため事前チェックが重要）"
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