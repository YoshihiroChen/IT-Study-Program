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
      },
      {
        "id": "rerender-and-useeffect",
        "title": "再レンダリングと副作用 useEffect",
        "summary": "Stateの更新で再レンダリングが起きる仕組みと、副作用（データ取得・タイマー・イベント購読など）をuseEffectで安全に扱う方法を学びます。",
        "content": [
          {
            "type": "p",
            "text": "Reactは「StateやPropsが変わると再レンダリング」します。再レンダリング自体はDOMの全再描画ではなく、差分のみを反映します。副作用（データ取得・タイマー・購読登録など）はrenderの外で管理する必要があり、useEffectを用いてライフサイクルに沿って安全に実行・後片付けを行います。"
          },
          {
            "type": "ul",
            "items": [
              "レンダリングが起きる主な条件：Props変更 / State更新 / 親の再レンダリング",
              "useEffectは“描画の結果がDOMに反映された後”に実行される",
              "依存配列で実行タイミングを制御（毎回 / 初回のみ / 特定の値が変わったとき）",
              "クリーンアップ関数でタイマーや購読を解除（メモリリーク防止）"
            ]
          },
          {
            "type": "code",
            "filename": "Effect-every-render.jsx",
            "lang": "jsx",
            "code": "import React, { useState, useEffect } from 'react';\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n\n  // 依存配列なし：毎回のレンダリング後に実行\n  useEffect(() => {\n    console.log('render後に毎回実行: count=', count);\n  });\n\n  return (\n    <div>\n      <p>count: {count}</p>\n      <button onClick={() => setCount(c => c + 1)}>+1</button>\n    </div>\n  );\n}"
          },
          {
            "type": "code",
            "filename": "Effect-mount-once.jsx",
            "lang": "jsx",
            "code": "import React, { useEffect, useState } from 'react';\n\nexport default function FetchUser() {\n  const [user, setUser] = useState(null);\n\n  // 空配列：初回マウント時だけ実行（データ取得に向いている）\n  useEffect(() => {\n    let ignore = false;\n    async function run() {\n      const res = await fetch('https://jsonplaceholder.typicode.com/users/1');\n      const data = await res.json();\n      if (!ignore) setUser(data);\n    }\n    run();\n    return () => { ignore = true; }; // アンマウント時の中断フラグ\n  }, []);\n\n  return <pre>{user ? JSON.stringify(user, null, 2) : 'Loading...'}</pre>;\n}"
          },
          {
            "type": "code",
            "filename": "Effect-with-deps-and-cleanup.jsx",
            "lang": "jsx",
            "code": "import React, { useEffect, useState } from 'react';\n\nexport default function Clock({ intervalMs = 1000 }) {\n  const [now, setNow] = useState(() => new Date());\n\n  // 依存配列にintervalMs：この値が変わるたびにタイマーを再作成\n  useEffect(() => {\n    const id = setInterval(() => setNow(new Date()), intervalMs);\n    // クリーンアップ：アンマウント時や依存が変わる前に古いタイマーを解除\n    return () => clearInterval(id);\n  }, [intervalMs]);\n\n  return <p>{now.toLocaleTimeString()}</p>;\n}"
          },
          {
            "type": "p",
            "text": "ベストプラクティス：副作用はuseEffect内に閉じ込め、必要に応じてクリーンアップを返す関数で後処理を行います。Stateを更新すると再レンダリングが起きるため、頻繁な更新は間引き（debounce/throttle）も検討しましょう。"
          }
        ]
      },
      {
        "id": "export-types",
        "title": "exportの種類（default / named / 再エクスポート）",
        "summary": "モジュールの公開方法を整理し、プロジェクトの可読性と拡張性を高めます。",
        "content": [
          {
            "type": "p",
            "text": "JavaScriptモジュールは主に「default export」と「named export」の2種があります。更に再エクスポートで取り回しを良くできます。使い分けを理解すると、コンポーネント設計やライブラリ構成が明快になります。"
          },
          {
            "type": "ul",
            "items": [
              "default export：モジュールの“主役”を1つだけ公開。import側は任意の名前で受け取れる",
              "named export：複数の公開シンボルを名前付きで提供。import側も同じ名前で受け取る",
              "再エクスポート：モジュール集約（barrel）でimportの経路を簡潔にする"
            ]
          },
          {
            "type": "code",
            "filename": "DefaultExport.jsx",
            "lang": "jsx",
            "code": "export default function Button({ children }) {\n  return <button>{children}</button>;\n}\n\n// import側（任意名OK）\n// import Btn from './DefaultExport';\n// <Btn>OK</Btn>"
          },
          {
            "type": "code",
            "filename": "NamedExport.jsx",
            "lang": "jsx",
            "code": "export function PrimaryButton({ children }) {\n  return <button className=\"primary\">{children}</button>;\n}\n\nexport function SecondaryButton({ children }) {\n  return <button className=\"secondary\">{children}</button>;\n}\n\n// import側（名前を合わせる必要がある）\n// import { PrimaryButton, SecondaryButton } from './NamedExport';"
          },
          {
            "type": "code",
            "filename": "MixedExport.jsx",
            "lang": "jsx",
            "code": "export default function Card({ children }) {\n  return <div className=\"card\">{children}</div>;\n}\nexport const CardHeader = ({ title }) => <h3>{title}</h3>;\nexport const CardBody = ({ children }) => <div>{children}</div>;\n\n// import側\n// import Card, { CardHeader, CardBody } from './MixedExport';"
          },
          {
            "type": "code",
            "filename": "barrel/index.js",
            "lang": "js",
            "code": "// 再エクスポート：コンポーネントを集約\nexport { default as Button } from '../ui/Button';\nexport { PrimaryButton, SecondaryButton } from '../ui/Buttons';\nexport { default as Card, CardHeader, CardBody } from '../ui/Card';\n\n// これで利用側は  import { Button, PrimaryButton, Card } from './barrel';  と書ける"
          },
          {
            "type": "ul",
            "items": [
              "小規模：default中心でもOK／大規模：named中心＋barrelで整理すると拡張しやすい",
              "ライブラリ的に複数APIを提供するならnamedを基本にする",
              "“1ファイル＝1主役コンポーネント”の時はdefaultが分かりやすい"
            ]
          }
        ]
      }
            
    ]
  },
  {
    "key": "react-and-css",
    "title": "ReactとCSSの使い方",
    "lessons": [
      {
        "id": "react-css-inline",
        "title": "Inline Styles（インラインスタイル）",
        "summary": "コンポーネント内で直接スタイルを定義し、動的に見た目を変更する方法を学びます。",
        "content": [
          {
            "type": "p",
            "text": "Reactでは、CSSファイルを使わずにコンポーネント内部でスタイルを直接記述することができます。これを「インラインスタイル（Inline Styles）」と呼びます。HTMLのstyle属性と似ていますが、Reactではオブジェクト形式で記述します。"
          },
          {
            "type": "ul",
            "items": [
              "スタイルはJavaScriptのオブジェクトで記述",
              "プロパティ名はキャメルケース（例：fontSize, backgroundColor）",
              "値は文字列として指定（例：'20px', 'blue'）",
              "動的な値も直接埋め込むことが可能"
            ]
          },
          {
            "type": "code",
            "filename": "InlineStyleBasic.jsx",
            "lang": "jsx",
            "code": "function Greeting() {\n  const style = {\n    color: 'blue',\n    fontSize: '24px',\n    backgroundColor: 'lightgray',\n    padding: '10px'\n  };\n\n  return <p style={style}>こんにちは！これはインラインスタイルの例です。</p>;\n}\n\nexport default Greeting;"
          },
          {
            "type": "p",
            "text": "このように、スタイルを変数にまとめてからstyle属性に渡すことで、コンポーネントごとに独立した見た目を定義できます。"
          },
          {
            "type": "p",
            "text": "また、StateやPropsを利用して動的にスタイルを切り替えることもできます。例えば、クリックで色が変わるボタンを作ることができます。"
          },
          {
            "type": "code",
            "filename": "DynamicInlineStyle.jsx",
            "lang": "jsx",
            "code": "import React, { useState } from 'react';\n\nfunction ColorButton() {\n  const [isActive, setIsActive] = useState(false);\n\n  const buttonStyle = {\n    backgroundColor: isActive ? 'tomato' : 'skyblue',\n    color: 'white',\n    border: 'none',\n    padding: '10px 20px',\n    borderRadius: '8px',\n    cursor: 'pointer'\n  };\n\n  return (\n    <button style={buttonStyle} onClick={() => setIsActive(!isActive)}>\n      {isActive ? '赤ボタン' : '青ボタン'}\n    </button>\n  );\n}\n\nexport default ColorButton;"
          },
          {
            "type": "p",
            "text": "インラインスタイルは小規模なスタイル変更や動的デザインに向いていますが、コンポーネントが増えると可読性が低下することがあります。そのため、大規模なプロジェクトではCSS ModulesやStyled Componentsなどと併用するのが一般的です。"
          }
        ]
      },
      {
        "id": "react-css-modules",
        "title": "CSS Modules（.module.scss を使う）",
        "summary": "クラス名をローカルスコープ化して、コンポーネント単位で安全にスタイリングする方法を学びます。",
        "content": [
          {
            "type": "p",
            "text": "CSS Modulesを使うと、クラス名の重複を気にせずに、コンポーネントごとに独立したスタイルを適用できます。ファイル名を「.module.scss」または「.module.css」とするだけで、自動的にローカルスコープが適用されます。"
          },
          {
            "type": "p",
            "text": "まず、Greetingコンポーネント専用のスタイルファイルを作成します。Sass（SCSS）を使う場合は、事前に`sass`をインストールしておきましょう。"
          },
          {
            "type": "code",
            "filename": "src/Greeting.module.scss",
            "lang": "scss",
            "code": ".greeting {\n  color: blue;\n  font-size: 24px;\n  background-color: lightgray;\n  padding: 10px;\n  border-radius: 6px;\n  font-weight: bold;\n}"
          },
          {
            "type": "p",
            "text": "次に、このSCSSファイルをReactコンポーネント内で読み込み、スタイルを適用します。CSS Modulesでは`import styles from './Greeting.module.scss'`のようにインポートし、`className={styles.クラス名}`で指定します。"
          },
          {
            "type": "code",
            "filename": "src/Greeting.jsx",
            "lang": "jsx",
            "code": "import React from 'react';\nimport styles from './Greeting.module.scss';\n\nfunction Greeting() {\n  return <p className={styles.greeting}>こんにちは！これはCSS Modulesの例です。</p>;\n}\n\nexport default Greeting;"
          },
          {
            "type": "p",
            "text": "このように、同じスタイルでもCSS Modulesを使うとクラス名が自動で変換されるため、他のコンポーネントとクラス名が衝突する心配がありません。"
          },
          {
            "type": "ul",
            "items": [
              "クラス名は `styles.クラス名` で指定する",
              "複数クラスを結合する場合はテンプレートリテラル（例：`${styles.a} ${styles.b}`）を使う",
              "Sass（.scss）を使えば変数やネストも利用可能",
              "Next.js や Vite などでは標準でサポートされている"
            ]
          },
          {
            "type": "p",
            "text": "CSS Modulesは、コンポーネント単位での再利用性や保守性を高める方法として非常に有用です。大規模なアプリケーション開発では、インラインスタイルよりもこちらが推奨されることが多いです。"
          }
        ]
      },
      {
        "id": "react-styled-jsx",
        "title": "Styled JSX（Next.js標準のスタイル記法）",
        "summary": "コンポーネントごとにスコープされたCSSをJSX内に直接記述する方法を学びます。",
        "content": [
          {
            "type": "p",
            "text": "Styled JSXは、Next.jsに標準搭載されているスタイリング手法で、コンポーネント内に<style jsx>タグを記述して、その中でCSSを書くことができます。スタイルは自動的にそのコンポーネントにスコープされるため、他のコンポーネントとクラス名が衝突することはありません。"
          },
          {
            "type": "p",
            "text": "同じGreetingコンポーネントの例を、Styled JSXで書くと以下のようになります。"
          },
          {
            "type": "code",
            "filename": "src/Greeting.jsx",
            "lang": "jsx",
            "code": "function Greeting() {\n  return (\n    <>\n      <p className=\"greeting\">こんにちは！これはStyled JSXの例です。</p>\n\n      <style jsx>{`\n        .greeting {\n          color: blue;\n          font-size: 24px;\n          background-color: lightgray;\n          padding: 10px;\n          border-radius: 6px;\n          font-weight: bold;\n        }\n      `}</style>\n    </>\n  );\n}\n\nexport default Greeting;"
          },
          {
            "type": "p",
            "text": "このように、CSSをコンポーネント内部に直接書けるため、スタイルをコンポーネント単位で閉じ込めることができます。特にNext.jsでは標準でサポートされているため、追加の設定は不要です。"
          },
          {
            "type": "ul",
            "items": [
              "クラス名はコンポーネント内だけに適用され、他コンポーネントに影響しない",
              "<style jsx> タグを使う（Next.jsでは標準機能）",
              "Sassなどのプリプロセッサを使わずに完結できる",
              "JavaScript変数を埋め込んで動的なスタイルを記述することも可能"
            ]
          },
          {
            "type": "code",
            "filename": "src/GreetingDynamic.jsx",
            "lang": "jsx",
            "code": "function Greeting({ isBlue }) {\n  const textColor = isBlue ? 'blue' : 'crimson';\n  return (\n    <>\n      <p className=\"greeting\">こんにちは！色が動的に変わります。</p>\n\n      <style jsx>{`\n        .greeting {\n          color: ${textColor};\n          font-size: 24px;\n          background-color: lightgray;\n          padding: 10px;\n          border-radius: 6px;\n          font-weight: bold;\n        }\n      `}</style>\n    </>\n  );\n}\n\nexport default Greeting;"
          },
          {
            "type": "p",
            "text": "Styled JSXは、Next.jsで軽量にCSSを扱いたい場合に最適です。CSS Modulesのように外部ファイルを作る必要がなく、コンポーネント内で完結する点が特徴です。"
          }
        ]
      },
      {
        "id": "react-styled-components",
        "title": "Styled Components（CSS-in-JSの代表的ライブラリ）",
        "summary": "JavaScript内でスタイルを定義し、コンポーネント単位で再利用できる強力なスタイリング手法を学びます。",
        "content": [
          {
            "type": "p",
            "text": "Styled Componentsは、Reactで最も広く使われている「CSS-in-JS」ライブラリのひとつです。JavaScriptファイル内でスタイルを記述でき、コンポーネントごとにスタイルをカプセル化できます。クラス名の衝突を防ぎ、Propsを使って動的にスタイルを切り替えることも可能です。"
          },
          {
            "type": "code",
            "filename": "インストール",
            "lang": "bash",
            "code": "npm install styled-components"
          },
          {
            "type": "p",
            "text": "同じGreetingコンポーネントの例を、Styled Componentsを使って書くと以下のようになります。"
          },
          {
            "type": "code",
            "filename": "src/Greeting.jsx",
            "lang": "jsx",
            "code": "import styled from 'styled-components';\n\nconst StyledGreeting = styled.p`\n  color: blue;\n  font-size: 24px;\n  background-color: lightgray;\n  padding: 10px;\n  border-radius: 6px;\n  font-weight: bold;\n`;\n\nfunction Greeting() {\n  return <StyledGreeting>こんにちは！これはStyled Componentsの例です。</StyledGreeting>;\n}\n\nexport default Greeting;"
          },
          {
            "type": "p",
            "text": "このように、`styled.p`のようにHTMLタグを関数として呼び出すことで、そのタグ専用のスタイル付きコンポーネントを生成します。コンポーネント名は通常、`StyledButton`や`StyledGreeting`のように「Styled + 名称」で書くことが多いです。"
          },
          {
            "type": "p",
            "text": "さらに、Propsを渡すことで動的にスタイルを変更することも可能です。"
          },
          {
            "type": "code",
            "filename": "src/GreetingDynamic.jsx",
            "lang": "jsx",
            "code": "import styled from 'styled-components';\n\nconst StyledGreeting = styled.p`\n  color: ${(props) => (props.isBlue ? 'blue' : 'crimson')};\n  font-size: 24px;\n  background-color: lightgray;\n  padding: 10px;\n  border-radius: 6px;\n  font-weight: bold;\n`;\n\nfunction Greeting({ isBlue }) {\n  return (\n    <StyledGreeting isBlue={isBlue}>\n      こんにちは！色が{isBlue ? '青' : '赤'}になっています。\n    </StyledGreeting>\n  );\n}\n\nexport default Greeting;"
          },
          {
            "type": "ul",
            "items": [
              "CSSをJavaScriptファイル内に直接記述できる",
              "Propsを使って動的にスタイルを切り替えられる",
              "クラス名は自動生成されるため、他のコンポーネントと衝突しない",
              "複雑なコンポーネント構成でもスタイルをコンポーネント単位で管理できる"
            ]
          },
          {
            "type": "p",
            "text": "Styled Componentsは、再利用性・保守性・動的デザインの柔軟さに優れており、大規模なReactプロジェクトでもよく採用されています。"
          }
        ]
      },
      {
        "id": "react-emotion",
        "title": "Emotion（軽量で柔軟なCSS-in-JSライブラリ）",
        "summary": "Emotionは、styled-componentsと同様に人気のあるCSS-in-JSライブラリで、複数の記法に対応しています。",
        "content": [
          {
            "type": "p",
            "text": "Emotionは、軽量かつ高性能なCSS-in-JSライブラリで、Reactアプリケーションで柔軟にスタイルを記述できます。特徴として、Inline Styles・Styled JSX・Styled Componentsの3つの記法すべてをサポートしており、開発者の好みに応じて選べます。"
          },
          {
            "type": "code",
            "filename": "インストール",
            "lang": "bash",
            "code": "npm install @emotion/react @emotion/styled"
          },
          {
            "type": "p",
            "text": "ここでも同じGreetingコンポーネントの例を使って、Emotionでの3つの記法を見てみましょう。"
          },
          {
            "type": "p",
            "text": "① Inline Styles風に書く方法（`css` プロップ）"
          },
          {
            "type": "code",
            "filename": "src/GreetingInline.jsx",
            "lang": "jsx",
            "code": "import { css } from '@emotion/react';\n\nfunction Greeting() {\n  return (\n    <p\n      css={css`\n        color: blue;\n        font-size: 24px;\n        background-color: lightgray;\n        padding: 10px;\n        border-radius: 6px;\n        font-weight: bold;\n      `}\n    >\n      こんにちは！これはEmotionのInline Style風の例です。\n    </p>\n  );\n}\n\nexport default Greeting;"
          },
          {
            "type": "p",
            "text": "② Styled JSX風に書く方法（`css`関数をそのまま使う）"
          },
          {
            "type": "code",
            "filename": "src/GreetingJsxLike.jsx",
            "lang": "jsx",
            "code": "import { css } from '@emotion/react';\n\nfunction Greeting() {\n  const style = css`\n    color: blue;\n    font-size: 24px;\n    background-color: lightgray;\n    padding: 10px;\n    border-radius: 6px;\n    font-weight: bold;\n  `;\n\n  return <p css={style}>こんにちは！これはEmotionのStyled JSX風の例です。</p>;\n}\n\nexport default Greeting;"
          },
          {
            "type": "p",
            "text": "③ Styled Components風に書く方法（`@emotion/styled`）"
          },
          {
            "type": "code",
            "filename": "src/GreetingStyled.jsx",
            "lang": "jsx",
            "code": "import styled from '@emotion/styled';\n\nconst StyledGreeting = styled.p`\n  color: blue;\n  font-size: 24px;\n  background-color: lightgray;\n  padding: 10px;\n  border-radius: 6px;\n  font-weight: bold;\n`;\n\nfunction Greeting() {\n  return <StyledGreeting>こんにちは！これはEmotionのStyled Components風の例です。</StyledGreeting>;\n}\n\nexport default Greeting;"
          },
          {
            "type": "p",
            "text": "このように、Emotionは一つのライブラリで複数の書き方をサポートしている点が大きな特徴です。開発チームのスタイルや既存コードベースに合わせて、柔軟に採用できます。"
          },
          {
            "type": "ul",
            "items": [
              "Inline風（cssプロップ）: コンポーネント内で即記述可能",
              "Styled JSX風（css変数）: 複数のスタイルをまとめて再利用可能",
              "Styled Components風（@emotion/styled）: 再利用性が高く、Propsで動的スタイルも可能"
            ]
          },
          {
            "type": "p",
            "text": "Emotionは柔軟性と軽量さを兼ね備えたモダンなCSS-in-JSライブラリであり、React開発において多様なスタイル戦略を統一的に扱うことができます。"
          }
        ]
      },
      {
        "id": "react-tailwind",
        "title": "Tailwind CSS（ユーティリティファーストのCSSフレームワーク）",
        "summary": "Tailwind CSSを使って、HTMLタグに直接クラス名を付与するスタイル設計を学びます。",
        "content": [
          {
            "type": "p",
            "text": "Tailwind CSSは、CSSを直接書く代わりに、あらかじめ定義されたクラス名をHTMLやJSX内に書いてスタイルを指定する「ユーティリティファースト（utility-first）」なフレームワークです。Reactと非常に相性が良く、簡潔に美しいデザインを実装できます。"
          },
          {
            "type": "code",
            "filename": "インストール（Vite / CRAなど）",
            "lang": "bash",
            "code": "npm install -D tailwindcss postcss autoprefixer\nnpx tailwindcss init -p"
          },
          {
            "type": "p",
            "text": "設定ファイル `tailwind.config.js` で、適用対象をReactプロジェクトの全ファイルに指定します。"
          },
          {
            "type": "code",
            "filename": "tailwind.config.js",
            "lang": "js",
            "code": "export default {\n  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n};"
          },
          {
            "type": "p",
            "text": "続いて、`src/index.css` にTailwindの基本ディレクティブを追加します。"
          },
          {
            "type": "code",
            "filename": "src/index.css",
            "lang": "css",
            "code": "@tailwind base;\n@tailwind components;\n@tailwind utilities;"
          },
          {
            "type": "p",
            "text": "これで準備完了です。同じGreetingコンポーネントをTailwindで書くと以下のようになります。"
          },
          {
            "type": "code",
            "filename": "src/Greeting.jsx",
            "lang": "jsx",
            "code": "function Greeting() {\n  return (\n    <p className=\"text-blue-600 text-2xl bg-gray-200 p-3 rounded-md font-bold\">\n      こんにちは！これはTailwind CSSの例です。\n    </p>\n  );\n}\n\nexport default Greeting;"
          },
          {
            "type": "p",
            "text": "Tailwindでは、クラス名を組み合わせることで、自由にスタイルを構築できます。`text-blue-600` は文字色、`bg-gray-200` は背景色、`p-3` はpadding、`rounded-md` は角丸、`font-bold` は太字を意味します。"
          },
          {
            "type": "p",
            "text": "動的にスタイルを変更したい場合は、ReactのStateや条件式と組み合わせてクラスを切り替えることもできます。"
          },
          {
            "type": "code",
            "filename": "src/GreetingDynamic.jsx",
            "lang": "jsx",
            "code": "import { useState } from 'react';\n\nfunction Greeting() {\n  const [isBlue, setIsBlue] = useState(true);\n\n  return (\n    <div className=\"p-4\">\n      <p\n        className={`text-2xl font-bold p-3 rounded-md ${\n          isBlue ? 'text-blue-600 bg-gray-200' : 'text-red-600 bg-yellow-100'\n        }`}\n      >\n        こんにちは！色が切り替わります。\n      </p>\n      <button\n        className=\"mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600\"\n        onClick={() => setIsBlue(!isBlue)}\n      >\n        切り替え\n      </button>\n    </div>\n  );\n}\n\nexport default Greeting;"
          },
          {
            "type": "ul",
            "items": [
              "設定後はクラス名だけでスタイルを適用できる（CSSファイル不要）",
              "複数のクラスを組み合わせて柔軟にデザイン可能",
              "Stateや条件式を使って動的なデザインを簡単に実現",
              "`hover:`, `md:`, `dark:` などの修飾子でレスポンシブ・テーマ対応も可能"
            ]
          },
          {
            "type": "p",
            "text": "Tailwind CSSは、開発スピードを大幅に上げつつ、統一感のあるデザインを維持できる現代的なスタイリング手法です。Reactとの組み合わせで、コードの可読性と保守性の両立が可能になります。"
          }
        ]
      },
      {
        "id": "react-css-summary",
        "title": "Reactにおけるスタイリング手法のまとめ",
        "summary": "これまで紹介した6つのスタイリング方法の特徴と分類を整理します。",
        "content": [
          {
            "type": "p",
            "text": "Reactでは、アプリケーションの規模や開発チームの方針に応じて、さまざまなスタイリング手法を選択できます。それぞれの方法には「使いどころ」や「特徴的なメリット」があります。ここでは、Inline Styles・CSS Modules・Styled JSX・Styled Components・Emotion・Tailwind CSS の6つを比較し、どのような技術分類に属するのかを整理します。"
          },
          {
            "type": "p",
            "text": "① Inline Styles（インラインスタイル）"
          },
          {
            "type": "p",
            "text": "JavaScriptのオブジェクトでスタイルを指定する、最も基本的な方法です。Reactの標準機能として提供されており、追加ライブラリは不要です。"
          },
          {
            "type": "ul",
            "items": [
              "分類：Reactの標準機能（追加パッケージ不要）",
              "特徴：コンポーネント内で直接オブジェクトとして指定できる",
              "用途：小規模・動的スタイル・試作時など"
            ]
          },
          {
            "type": "p",
            "text": "② CSS Modules（.module.scss / .module.css）"
          },
          {
            "type": "p",
            "text": "ReactやNext.js、Viteなどのビルドツールで標準的にサポートされるCSSスコープ化の仕組みです。ファイル名を`.module.css`または`.module.scss`にすることで、クラス名が自動的にローカルスコープ化されます。"
          },
          {
            "type": "ul",
            "items": [
              "分類：ビルド機能によるモジュール化されたCSS方式",
              "特徴：追加ライブラリ不要（ツール側でサポート）",
              "用途：中〜大規模アプリ、チーム開発での安全なスタイル管理"
            ]
          },
          {
            "type": "p",
            "text": "③ Styled JSX"
          },
          {
            "type": "p",
            "text": "Next.jsに標準搭載されているスタイル機能で、JSX内の`<style jsx>`タグでCSSを書くことができます。CSSが自動的にそのコンポーネントにスコープされます。"
          },
          {
            "type": "ul",
            "items": [
              "分類：Next.jsに内蔵されたスタイル機能（パッケージ：`styled-jsx`）",
              "特徴：HTMLと同じ感覚でスタイルを記述可能",
              "用途：Next.js環境で小〜中規模のスタイル管理"
            ]
          },
          {
            "type": "p",
            "text": "④ Styled Components"
          },
          {
            "type": "p",
            "text": "代表的なCSS-in-JSライブラリの一つで、`styled-components`というパッケージを使ってスタイルをJavaScript内で記述します。Propsを使って動的にスタイルを切り替えることができ、再利用性が非常に高いです。"
          },
          {
            "type": "ul",
            "items": [
              "分類：CSS-in-JSライブラリ（パッケージ）",
              "特徴：タグ付きテンプレートリテラルを使ってスタイルを記述",
              "用途：中〜大規模開発、デザインシステム構築、動的スタイル"
            ]
          },
          {
            "type": "p",
            "text": "⑤ Emotion"
          },
          {
            "type": "p",
            "text": "軽量で柔軟なCSS-in-JSライブラリ。`@emotion/react` と `@emotion/styled` を利用し、Inline風・Styled JSX風・Styled Components風の3種類の記法をサポートしています。"
          },
          {
            "type": "ul",
            "items": [
              "分類：CSS-in-JSライブラリ（パッケージ）",
              "特徴：柔軟で高速、複数の記法をサポート",
              "用途：動的スタイルが多い中〜大規模開発"
            ]
          },
          {
            "type": "p",
            "text": "⑥ Tailwind CSS"
          },
          {
            "type": "p",
            "text": "CSSを直接書かずに、HTMLタグにユーティリティクラスを並べてスタイルを適用するフレームワークです。設定ファイルを使って独自テーマを定義でき、Reactでも人気が高いです。"
          },
          {
            "type": "ul",
            "items": [
              "分類：CSSフレームワーク（パッケージ）",
              "特徴：クラス名ベースのユーティリティファースト設計",
              "用途：迅速なUI構築、デザインの統一、プロトタイプ制作"
            ]
          },
          {
            "type": "p",
            "text": "まとめ：6つのスタイリング手法の分類"
          },
          {
            "type": "code",
            "filename": "styling-methods-summary.txt",
            "lang": "text",
            "code": "Inline Styles       → Reactの標準機能\nCSS Modules         → ビルドツール内蔵機能（module化CSS）\nStyled JSX          → Next.js標準機能（styled-jsxパッケージ）\nStyled Components   → 外部ライブラリ（CSS-in-JS）\nEmotion             → 外部ライブラリ（軽量CSS-in-JS）\nTailwind CSS        → 外部フレームワーク（ユーティリティCSS）"
          },
          {
            "type": "p",
            "text": "このように、Reactにおけるスタイリング手法は「CSS-in-JS系（Styled Components, Emotion）」「モジュールCSS系（CSS Modules, Styled JSX）」「ユーティリティ系（Tailwind CSS）」の3つに大別できます。開発目的やチームの方針に応じて、適切な方式を選択することが重要です。"
          }
        ]
      }
      
      
      
      
      
      
      
      
    ]
  },
  {
    "key": "react-re-rendering-and-optimization",
    "title": "再レンダリングと最適化",
    "lessons": [
      {
        "id": "react-re-rendering-conditions",
        "title": "再レンダリングの条件",
        "summary": "Reactコンポーネントがどのようなときに再レンダリング（再描画）されるのかを理解します。",
        "content": [
          {
            "type": "p",
            "text": "Reactでは、コンポーネントは「状態（state）」や「プロパティ（props）」が変化したときに再レンダリングされます。つまり、同じ見た目でも内部でデータが更新されると、Reactはその変更を反映するために再描画を行います。"
          },
          {
            "type": "p",
            "text": "再レンダリングが起きる主な条件は次の3つです："
          },
          {
            "type": "ul",
            "items": [
              "① State（状態）が更新されたとき",
              "② Props（親コンポーネントから渡された値）が変化したとき",
              "③ 親コンポーネントが再レンダリングされたとき"
            ]
          },
          {
            "type": "p",
            "text": "まずは、Stateによって再レンダリングが起きる例を見てみましょう。"
          },
          {
            "type": "code",
            "filename": "StateExample.jsx",
            "lang": "jsx",
            "code": "import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  console.log('Counterコンポーネントが再レンダリングされました');\n\n  return (\n    <div>\n      <p>現在のカウント: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n    </div>\n  );\n}\n\nexport default Counter;"
          },
          {
            "type": "p",
            "text": "上の例では、ボタンをクリックして`setCount`が呼ばれるたびに、`count`の値が変化します。その結果、Reactは再レンダリングを行い、画面上の数値が更新されます。"
          },
          {
            "type": "p",
            "text": "次に、Propsの変更による再レンダリングの例を見てみましょう。"
          },
          {
            "type": "code",
            "filename": "PropsExample.jsx",
            "lang": "jsx",
            "code": "import { useState } from 'react';\n\nfunction Message({ text }) {\n  console.log('Messageコンポーネントが再レンダリングされました');\n  return <p>{text}</p>;\n}\n\nfunction App() {\n  const [msg, setMsg] = useState('こんにちは！');\n\n  return (\n    <div>\n      <Message text={msg} />\n      <button onClick={() => setMsg('こんばんは！')}>メッセージを変更</button>\n    </div>\n  );\n}\n\nexport default App;"
          },
          {
            "type": "p",
            "text": "この場合、親コンポーネントAppでmsgが変更されると、子コンポーネントMessageのprops（text）が変化し、再レンダリングが発生します。以下にその流れを詳しく説明します。"
          },
          {
            "type": "p",
            "text": "【再レンダリングの逐次プロセス】"
          },
          {
            "type": "ul",
            "items": [
              "① 初回レンダリング時、Appのmsgは「こんにちは！」で、Messageにtext=\"こんにちは！\"が渡されます。",
              "② ユーザーがボタンをクリックすると、setMsg('こんばんは！')が呼ばれ、Appのstateが更新されます。",
              "③ ReactはAppを再レンダリングし、新しいprops（text=\"こんばんは！\"）をMessageに渡します。",
              "④ Messageは前回のpropsと異なる値を受け取ったため、再レンダリングされ、画面の表示が「こんばんは！」に更新されます。"
            ]
          },
          {
            "type": "p",
            "text": "このように、親のstate更新が子に伝わり、子の表示内容が変化するのがReactのデータフロー（one-way data flow）です。"
          },
          {
            "type": "p",
            "text": "【補足①】もしsetMsgで同じ値（\"こんにちは！\"）を再設定した場合、Reactは内部でObject.isによる比較を行い、値が変わらないと判断して再レンダリングをスキップします。"
          },
          {
            "type": "p",
            "text": "【補足②】親コンポーネントが再レンダリングされると、子コンポーネントも巻き込まれて再レンダリングされることがあります。これを防ぐためには、React.memoを使用してpropsが変わらない限り再レンダリングをスキップさせることができます。"
          },
          {
            "type": "code",
            "filename": "MemoExample.jsx",
            "lang": "jsx",
            "code": "import React, { memo, useState } from 'react';\n\nconst Message = memo(function Message({ text }) {\n  console.log('Messageが再レンダリングされました'); // propsが変化しない限り呼ばれない\n  return <p>{text}</p>;\n});\n\nfunction App() {\n  const [msg, setMsg] = useState('こんにちは！');\n\n  return (\n    <div>\n      <Message text={msg} />\n      <button onClick={() => setMsg('こんにちは！')}>同じ値を設定</button>\n      <button onClick={() => setMsg('こんばんは！')}>新しい値を設定</button>\n    </div>\n  );\n}\n\nexport default App;"
          },
          {
            "type": "p",
            "text": "上の例では、React.memoによってMessageがpropsの浅い比較を行い、同じ文字列が渡された場合には再レンダリングをスキップします。"
          },
          {
            "type": "p",
            "text": "また、親の再レンダリングに巻き込まれる例を見てみましょう。"
          },
          {
            "type": "code",
            "filename": "ParentChildExample.jsx",
            "lang": "jsx",
            "code": "import { useState } from 'react';\n\nfunction Child() {\n  console.log('Childコンポーネントが再レンダリングされました');\n  return <p>子コンポーネントです</p>;\n}\n\nfunction Parent() {\n  const [count, setCount] = useState(0);\n  console.log('Parentコンポーネントが再レンダリングされました');\n\n  return (\n    <div>\n      <Child />\n      <button onClick={() => setCount(count + 1)}>+1</button>\n    </div>\n  );\n}\n\nexport default Parent;"
          },
          {
            "type": "p",
            "text": "上記の例では、ボタンをクリックしてParentのstateが更新されるたびに、Childも再レンダリングされてしまいます。propsが変わっていなくても、親の再レンダリングに巻き込まれるのがReactの基本動作です。"
          },
          {
            "type": "p",
            "text": "まとめると、Reactの再レンダリングは「データの変化をUIに反映するため」に行われます。理解しておくべき重要ポイントは以下の通りです。"
          },
          {
            "type": "ul",
            "items": [
              "Stateが変わると、そのコンポーネントが再レンダリングされる",
              "Propsが変わると、その値を受け取るコンポーネントが再レンダリングされる",
              "親が再レンダリングされると、子も再レンダリングされる（デフォルト動作）",
              "React.memoを使うと不要な再レンダリングを防ぐことができる"
            ]
          },
          {
            "type": "p",
            "text": "次の節では、これらの再レンダリングを最適化するための手法（React.memo、useMemo、useCallbackなど）について学びます。"
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