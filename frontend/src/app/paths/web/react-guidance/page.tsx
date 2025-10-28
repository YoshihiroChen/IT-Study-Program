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
            "text": "以上のように、JSXではreturn内でHTMLのような構文を書けますが、正しいタグ構造を守ることが重要です。"
          }
        ]
      },
      {
        "id": "react-components",
        "title": "コンポーネントの使い方",
        "summary": "Reactの基本単位であるコンポーネントを作成し、再利用する方法を学びましょう。",
        "content": [
          {
            "type": "p",
            "text": "ReactにおいてコンポーネントはUIを構成する最小の部品です。1つの画面は複数のコンポーネントを組み合わせて構築されます。ここでは、新しいファイルを作成してコンポーネントを定義し、実際に呼び出してみましょう。"
          },
          {
            "type": "img",
            "src": "/images/react-10.png",
            "alt": "新しいapp.jsファイルを作成",
            "caption": "まず、srcフォルダ内に新しいファイル「app.js」を作成します。"
          },
          {
            "type": "p",
            "text": "次に、作成した app.js に以下のようにReactコンポーネントを記述します。Reactでは関数を使ってUIを定義し、export文で外部から利用できるようにします。"
          },
          {
            "type": "img",
            "src": "/images/react-11.png",
            "alt": "app.jsファイルの内容を編集",
            "caption": "app.jsにReactコンポーネントを定義しましょう。"
          },
          {
            "type": "p",
            "text": "次に、index.jsファイルを編集して、このAppコンポーネントを読み込み、実際に画面に表示させます。"
          },
          {
            "type": "img",
            "src": "/images/react-12.png",
            "alt": "index.jsの編集例",
            "caption": "index.jsにAppコンポーネントをimportし、レンダリングします。"
          },
          {
            "type": "p",
            "text": "これで、AppコンポーネントがReactアプリのメイン画面として表示されるようになりました。Reactでは、コンポーネント名を大文字で始める必要があります。小文字から始めると、HTMLタグとして認識されてしまうので注意しましょう。"
          },
          {
            "type": "img",
            "src": "/images/react-13.png",
            "alt": "app.jsxへの変更",
            "caption": "ファイル名を「app.jsx」に変更しても同様に動作します。Reactは.jsx拡張子を自動的に認識してJSX構文を扱います。"
          },
          {
            "type": "p",
            "text": "Reactでは、.jsファイルでもJSXを使うことができますが、コンポーネントを多く作成するプロジェクトでは、視覚的に区別しやすい.jsx拡張子を使うことが推奨されます。"
          },
          {
            "type": "ul",
            "items": [
              "コンポーネント名は必ず大文字で始める（例：App, Header, Button）",
              "1つのコンポーネントは1つの機能・役割に集中させる",
              "JSXを含むファイルは .jsx 拡張子を使用するとわかりやすい"
            ]
          },
          {
            "type": "p",
            "text": "このように、ReactではUIの要素を小さな関数として定義し、それらを組み合わせることで柔軟なWebアプリケーションを構築します。次の章では、このコンポーネントに動きをつける「イベント処理」について学びます。"
          }
        ]
      },
      {
        "id": "react-events",
        "title": "イベントを使ってみよう",
        "summary": "ボタンをクリックしたときなど、ユーザーの操作に反応させるイベント処理を学びます。",
        "content": [
          {
            "type": "p",
            "text": "Reactでは、ボタンのクリックや入力フォームの変更など、ユーザーの操作（イベント）に応じて処理を実行することができます。ここでは、Appコンポーネントにボタンを追加して、クリック時にアラートを表示させる簡単な例を作ってみましょう。"
          },
          {
            "type": "img",
            "src": "/images/react-14.png",
            "alt": "app.jsxにボタンを追加",
            "caption": "app.jsxにボタンを追加し、クリックイベント用の関数を定義します。"
          },
          {
            "type": "p",
            "text": "まず、app.jsxファイルを開き、以下のようにボタンとイベント関数を追加します。関数名は「onClickButton」のようにキャメルケース（小文字＋大文字）で書くのがReactの一般的なルールです。"
          },
          {
            "type": "p",
            "text": "ボタンをクリックすると、アラートダイアログが表示されるはずです。これがReactでの基本的なイベント処理の仕組みです。イベントを活用することで、動的でインタラクティブなWebアプリケーションを作ることができます。"
          },
          {
            "type": "p",
            "text": "次の章では、イベントに合わせてデータを変化させる「State（useState）」の使い方を学びましょう。"
          }
        ]
      },
      {
        "id": "react-props",
        "title": "Props（プロップス）を使ってみよう",
        "summary": "親コンポーネントから子コンポーネントへデータ（見た目や文字列など）を渡す仕組みを学びます。",
        "content": [
          {
            "type": "p",
            "text": "Props（プロップス）は、親コンポーネントから子コンポーネントへ値を渡すための仕組みです。HTMLの属性のように記述し、子側では引数（props）として受け取ります。ここでは、まずapp.jsxにスタイルを定義し、次にColoredMessageという子コンポーネントを作って、最終的にpropsで色や文言を切り替えられるようにしていきます。"
          },
      
          {
            "type": "img",
            "src": "/images/react-15.png",
            "alt": "app.jsxにcontentPinkStyleを追加して、文言を表示",
            "caption": "app.jsxにconst contentPinkStyleを定義し、画面に「元気です！」を表示します。"
          },
          {
            "type": "img",
            "src": "/images/react-16.png",
            "alt": "componentsフォルダを作り、ColoredMessage.jsxを追加",
            "caption": "src配下にcomponentsフォルダを作成し、ColoredMessage.jsxを追加します。"
          },
          {
            "type": "img",
            "src": "/images/react-17.png",
            "alt": "ColoredMessage.jsxを編集（まずは固定色）",
            "caption": "最初は固定の色でテキストを表示するだけのシンプルなコンポーネントにします。"
          },
          {
            "type": "img",
            "src": "/images/react-18.png",
            "alt": "app.jsxからColoredMessage.jsxを読み込み・表示",
            "caption": "app.jsxでColoredMessageを読み込み、画面に表示してみます。"
          },      
          {
            "type": "img",
            "src": "/images/react-21.png",
            "alt": "ColoredMessage.jsxでpropsを受け取るように変更",
            "caption": "ColoredMessage.jsxを修正し、propsで色や文言を受け取れるようにします。"
          },      
          {
            "type": "img",
            "src": "/images/react-23.png",
            "alt": "app.jsx側でpropsを渡す",
            "caption": "app.jsxで色や文言をpropsとして渡してみます。childrenとmessageのどちらでも指定可能。"
          },      
          {
            "type": "p",
            "text": "ポイント：Propsは読み取り専用です。子コンポーネント内でpropsの値を直接書き換えるのではなく、必要があれば親側で値を更新して再度渡します。また、スタイルのプロパティ名はキャメルケース（fontSize, backgroundColor など）で表記し、関数名やイベント名（onClick など）もキャメルケースで統一するのがReactの慣習です。"
          },
          {
            "type": "ul",
            "items": [
              "propsは親から子へデータを渡すための“引数”",
              "子側では関数引数（props）として受け取り、JSX内で利用する",
              "propsは読み取り専用（不変）",
              "childrenを使うと、タグで挟んだ中身を子に渡せる",
              "スタイル・関数・イベント名はキャメルケースで記述"
            ]
          }
        ]
      },
      {
        "id": "react-children",
        "title": "childrenを使ってみよう",
        "summary": "Propsの一種であるchildrenを使って、タグの中身を柔軟に子コンポーネントへ渡す方法を学びます。",
        "content": [
          {
            "type": "p",
            "text": "Reactでは、親コンポーネントから子コンポーネントへ文字列や要素を渡す方法として「children」という特別なプロパティが用意されています。これを使うと、より柔軟なコンポーネント設計が可能になります。"
          },
          {
            "type": "img",
            "src": "/images/react-24.png",
            "alt": "app.jsxのreturn部分を変更",
            "caption": "まずはapp.jsxのreturn部分を修正し、ColoredMessageコンポーネントのタグの中に直接テキストを記述します。"
          },
          {
            "type": "p",
            "text": "このように書くことで、<ColoredMessage>タグで囲まれた中身が自動的にchildrenとして渡されます。propsとして明示的にmessageを渡すのではなく、タグの中に入れた要素を柔軟に受け取ることができるようになります。"
          },
          {
            "type": "img",
            "src": "/images/react-25.png",
            "alt": "ColoredMessage.jsxの修正",
            "caption": "次に、ColoredMessage.jsxの内容を修正します。これまでprops.messageを使っていた部分をprops.childrenに置き換えましょう。"
          },
          {
            "type": "p",
            "text": "props.childrenを使用することで、ColoredMessageコンポーネントは任意の文字列や要素を受け取り、それをそのまま表示できます。これにより、再利用性の高い柔軟なUIパーツを作ることができます。"
          },
          {
            "type": "ul",
            "items": [
              "childrenはタグの中身を受け取るための特別なprops",
              "props.messageのように固定値を渡す代わりに、より自由な表現が可能",
              "テキストだけでなく、HTMLタグや他のReactコンポーネントも渡せる"
            ]
          },
          {
            "type": "p",
            "text": "このようにchildrenを活用することで、コンポーネント設計の柔軟性が大きく向上します。次の章では、動的に値を変化させるState（useState）について学びましょう。"
          }
        ]
      },
      {
        "id": "react-usestate",
        "title": "State（useState）を使ってみよう",
        "summary": "コンポーネント内で値を保持・更新し、動的に画面を変化させる方法を学びます。",
        "content": [
          {
            "type": "p",
            "text": "Reactでは、コンポーネント内で変化する値（状態）を管理するために「State（ステート）」という仕組みを使います。Stateを使うと、ボタンをクリックしたときなどに画面の表示内容を動的に変えることができます。"
          },
          {
            "type": "img",
            "src": "/images/react-26.png",
            "alt": "app.jsxでuseStateを使って状態管理を追加",
            "caption": "app.jsxファイルを修正し、useStateフックを使って状態（num）を定義します。ボタンをクリックするたびに値が1ずつ増えるように設定します。"
          },
          {
            "type": "p",
            "text": "Stateを定義するには、`useState`というReactのフックを使用します。フックとは、関数コンポーネント内でReactの機能を利用するための仕組みです。useStateは「現在の値」と「値を更新する関数」の2つをセットで返します。"
          },
          {
            "type": "ul",
            "items": [
              "useState(初期値) を呼び出して、状態変数を作成する",
              "配列の1つ目が現在の値、2つ目が更新用関数",
              "更新用関数を呼ぶと、自動的に再レンダリングされて画面が更新される"
            ]
          },
          {
            "type": "p",
            "text": "この例では、`const [num, setNum] = useState(0);` と書くことで、`num`に現在の数値、`setNum`に値を更新する関数が格納されています。ボタンのクリックイベントで `setNum(num + 1)` を呼び出すことで、カウントが1ずつ増えていくようになります。"
          },
          {
            "type": "p",
            "text": "このように、useStateを使うことでユーザーの操作に応じた動的なUIを簡単に実現できます。Reactのコンポーネントが“再描画される”という仕組みを体験できる大切なステップです。"
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