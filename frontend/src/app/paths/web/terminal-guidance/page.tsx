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
    key: "terminal-basics",
    title: "ターミナルについて",
    lessons: [
      {
        id: "what-is-terminal",
        title: "ターミナルとは",
        summary: "コンピュータに直接命令を伝えるためのインターフェースです。",
        content: [
          {
            type: "p",
            text: "ターミナル（Terminal）とは、キーボードでコマンドを入力し、文字ベースでコンピュータを操作するためのツールです。マウス操作に頼らず、直接システムに命令を伝えることができるため、開発者にとって非常に重要な作業環境です。"
          },
          {
            type: "p",
            text: "ターミナルを通じてファイルの操作、プログラムの実行、パッケージの管理、サーバーへの接続など、あらゆる開発作業を行うことができます。GUI（グラフィカルユーザーインターフェース）よりも高速かつ柔軟に操作できる点が特徴です。"
          },
          {
            type: "ul",
            items: [
              "例：cd（ディレクトリ移動）、ls（ファイル一覧）、mkdir（フォルダ作成）など",
              "Macでは「ターミナル.app」、Windowsでは「PowerShell」や「Windows Terminal」",
              "開発者はVS Codeなどの統合環境に内蔵されたターミナルをよく利用"
            ]
          }
        ]
      },
      {
        id: "common-commands",
        title: "基本的なコマンド",
        summary: "日常的に使用する代表的なUNIX系コマンドを紹介します。",
        content: [
          {
            type: "p",
            text: "ターミナルでは、コマンドラインを通じてさまざまな操作を行います。ここでは最も基本的でよく使うコマンドをまとめます。"
          },
          {
            type: "ul",
            items: [
              "pwd：現在の作業ディレクトリを表示",
              "ls：ファイルやフォルダの一覧を表示",
              "cd ディレクトリ名：指定したディレクトリに移動",
              "mkdir ディレクトリ名：新しいフォルダを作成",
              "rm ファイル名：ファイルを削除",
              "cp 元 先：ファイルをコピー",
              "mv 元 先：ファイルやフォルダを移動または名前変更"
            ]
          },
          {
            type: "p",
            text: "これらの操作をスムーズに行えるようになると、GUIを使わずに効率的にプロジェクトを管理できるようになります。"
          }
        ]
      },
      {
        id: "terminal-shortcuts",
        title: "便利なショートカットキー",
        summary: "ターミナル操作を効率化するためのキーボードショートカットを覚えましょう。",
        content: [
          {
            type: "p",
            text: "ターミナルではキーボードショートカットを活用することで、入力作業の効率が大幅に向上します。以下は代表的なショートカットです。"
          },
          {
            type: "ul",
            items: [
              "Ctrl + C：現在実行中のコマンドを強制終了",
              "Ctrl + L：画面をクリア（clearコマンドと同じ）",
              "↑ / ↓：過去に入力したコマンドの履歴を呼び出す",
              "Tab：途中まで入力したコマンドやファイル名を自動補完",
              "Ctrl + A：行の先頭へ移動、Ctrl + E：行の末尾へ移動"
            ]
          },
          {
            type: "p",
            text: "Macの場合はCommandキーではなくControlキーを使用する点に注意しましょう。"
          }
        ]
      },
      {
        id: "terminal-and-development",
        title: "開発におけるターミナルの役割",
        summary: "ターミナルは開発者の“基盤ツール”として欠かせません。",
        content: [
          {
            type: "p",
            text: "プログラミング開発では、ターミナルを使って環境構築やプログラムの実行を行います。特にWeb開発では、Node.jsやPythonなどの言語環境、Gitによるバージョン管理、Dockerによる仮想環境の操作など、ほとんどの作業がターミナル経由で実施されます。"
          },
          {
            type: "p",
            text: "慣れるまでは難しく感じるかもしれませんが、ターミナル操作をマスターすることで、システムの仕組みをより深く理解し、効率的に開発を進めることができます。"
          },
          {
            type: "ul",
            items: [
              "Node.js や Python のスクリプト実行：`node app.js`、`python main.py`",
              "Git によるソース管理：`git add .`、`git commit -m`、`git push`",
              "Docker の操作：`docker compose up`、`docker ps` など"
            ]
          }
        ]
      },
      {
        id: "terminal-customization",
        title: "ターミナルのカスタマイズ",
        summary: "テーマやプロンプトを変更して、作業しやすい環境を作りましょう。",
        content: [
          {
            type: "p",
            text: "ターミナルは見た目や動作を自由にカスタマイズできます。配色テーマ、フォント、プロンプト表示などを変更することで、視認性や作業効率が大きく向上します。"
          },
          {
            type: "ul",
            items: [
              "Powerlevel10k や Oh My Zsh を使ったカスタマイズ（Mac/Linux）",
              "Windows Terminal の配色テーマやフォント設定",
              "VS Code 内蔵ターミナルでのフォントサイズ・配色変更"
            ]
          },
          {
            type: "p",
            text: "自分の作業スタイルに合ったターミナル設定を整えることで、日々の開発体験を快適にすることができます。"
          }
        ]
      }
      
    ]
  },
  {
    "key": "terminal-practice",
    "title": "ターミナルを使ってみよう",
    "lessons": [
      {
        "id": "open-terminal",
        "title": "ターミナルを開く",
        "summary": "まずは自分の環境でターミナルを起動してみましょう。",
        "content": [
          {
            "type": "p",
            "text": "ここでは実際にターミナルを開いて操作してみます。Macでは「アプリケーション → ユーティリティ → ターミナル」、Windowsでは「スタートメニュー → PowerShell または Windows Terminal」から起動できます。"
          },
          {
            "type": "ul",
            "items": [
              "Macの場合：Spotlight検索（⌘ + スペース）で「terminal」と入力して起動",
              "Windowsの場合：検索バーに「PowerShell」または「cmd」と入力して起動",
              "VS Codeの場合：メニューから「表示 → ターミナル」またはショートカット Ctrl + `（バッククォート）"
            ]
          }
        ],
      },
      {
        "id": "basic-commands-practice",
        "title": "基本コマンドを試してみる",
        "summary": "前章で学んだ基本コマンドを実際に入力して確認しましょう。",
        "content": [
          {
            "type": "p",
            "text": "ここでは、ディレクトリの移動・作成・削除など、最も基本的な操作を実際に行ってみます。以下のコマンドを順番に入力し、表示結果を確認してください。"
          },
          {
            "type": "code",
            "filename": "terminal-practice-1.txt",
            "lang": "bash",
            "code": `pwd                # 現在のディレクトリを確認
mkdir test_dir      # 新しいフォルダを作成
cd test_dir         # 作成したフォルダに移動
echo "Hello Terminal!" > hello.txt   # ファイルを作成
ls                  # ファイル一覧を表示
cat hello.txt       # ファイルの中身を表示
cd ..               # 一つ上の階層に戻る
rm -r test_dir      # フォルダごと削除`
          },
          {
            "type": "p",
            "text": "コマンドの前に「#」が付いている部分はコメントであり、実際には入力する必要はありません。"
          }
        ],
      },
      {
        "id": "try-git-commands",
        "title": "Gitコマンドの体験",
        "summary": "バージョン管理の基本操作をターミナルで試してみましょう。",
        "content": [
          {
            "type": "p",
            "text": "ここでは、Gitを使った簡単なバージョン管理を体験します。まだGitをインストールしていない場合は、事前にインストールしておきましょう。"
          },
          {
            "type": "code",
            "filename": "git-practice.txt",
            "lang": "bash",
            "code": `git init              # 新しいリポジトリを作成
echo "first line" > sample.txt
git add sample.txt     # ファイルをステージに追加
git commit -m "first commit"   # コミットを作成
echo "second line" >> sample.txt
git diff               # 変更内容を確認
git log                # コミット履歴を確認`
          },
          {
            "type": "p",
            "text": "これらの操作を通じて、Gitの仕組みやターミナルでの開発フローを体験できます。"
          }
        ],
      },
      {
        "id": "explore-help",
        "title": "ヘルプとマニュアルを使ってみる",
        "summary": "困ったときはヘルプコマンドで調べましょう。",
        "content": [
          {
            "type": "p",
            "text": "ターミナルでは、ほとんどのコマンドにヘルプ機能があります。オプションの意味や使い方を調べたいときに便利です。"
          },
          {
            "type": "code",
            "filename": "help-command.txt",
            "lang": "bash",
            "code": `ls --help     # lsコマンドの使い方を表示
man cd        # cdコマンドのマニュアルを開く
q             # マニュアル画面から抜ける`
          },
          {
            "type": "p",
            "text": "開発者として自分で調べる習慣を身につけることが、学習を継続するための第一歩です。"
          }
        ],
      },
      {
        "id": "summary-practice",
        "title": "まとめ：コマンド練習のポイント",
        "summary": "手を動かして覚えることで、ターミナル操作が自然になります。",
        "content": [
          {
            "type": "ul",
            "items": [
              "実際に入力し、エラーが出たら調べてみる",
              "同じコマンドを複数回試して挙動を確認する",
              "履歴（↑キー）を活用して効率的に操作する",
              "慣れてきたら、シェルスクリプトにも挑戦してみましょう"
            ]
          },
          {
            "type": "p",
            "text": "ターミナル操作は最初は地味に感じますが、開発者としての基礎体力をつけるための最重要スキルです。"
          }
        ],
      }
    ]
  },
  {
    "key": "local-vs-cloud-terminal",
    "title": "ローカルターミナルとクラウドターミナルの違い",
    "lessons": [
      {
        "id": "concept-difference",
        "title": "ローカルとクラウドの基本的な違い",
        "summary": "同じ「ターミナル」でも、動いている場所と操作対象が異なります。",
        "content": [
          {
            "type": "p",
            "text": "ローカルターミナルとは、自分のパソコン上（macOS / Windows / Linux）で直接動いているターミナルのことです。実際に操作しているのは「自分のマシンの中のファイルシステム」であり、ファイルを作成したり、アプリを実行したりすると、その結果は自分のPC内に反映されます。"
          },
          {
            "type": "p",
            "text": "一方で、クラウドターミナル（リモートターミナル）は、インターネット上にある別のサーバー上で動作しています。AWS EC2、GitHub Codespaces、Gitpodなどが代表的な例です。VS Codeを使ってSSH接続を行う場合、見た目は同じでも、実際の処理はクラウド上のLinuxマシンで実行されています。"
          },
          {
            "type": "ul",
            "items": [
              "ローカルターミナル：自分のPCのCPU・メモリを使用",
              "クラウドターミナル：サーバー（例：AWS EC2）のCPU・メモリを使用",
              "同じコマンドでも、実行結果や環境が異なる場合がある"
            ]
          }
        ]
      },
      {
        "id": "file-system-difference",
        "title": "ファイルシステムとパスの違い",
        "summary": "どのコンピュータの中でファイルを扱っているのかを意識しましょう。",
        "content": [
          {
            "type": "p",
            "text": "ローカルターミナルでは、`/Users/username/`（Mac）や `C:\\Users\\username\\`（Windows）といった自分のパソコン上のディレクトリを操作しています。"
          },
          {
            "type": "p",
            "text": "一方、VS Codeでリモート接続しているクラウドターミナルでは、`/home/ec2-user/` や `/workspace/` のように、サーバー上のLinuxファイルシステムが操作対象になります。見た目は似ていても、まったく別のコンピュータの中です。"
          },
          {
            "type": "code",
            "filename": "compare-paths.txt",
            "lang": "bash",
            "code": `# ローカルターミナル（Mac）
pwd
# => /Users/yourname/projects/myapp
  
# クラウドターミナル（AWS EC2）
pwd
# => /home/ec2-user/myapp`
          },
          {
            "type": "p",
            "text": "この違いを理解せずにファイル操作をすると、意図しない環境にファイルを作成・削除してしまうことがあります。"
          }
        ]
      },
      {
        "id": "execution-environment",
        "title": "プログラムの実行環境の違い",
        "summary": "ローカルとクラウドでは、使われるOSやインストール済みソフトが異なります。",
        "content": [
          {
            "type": "p",
            "text": "ローカルでは、自分がインストールしたPythonやNode.jsのバージョンが使われます。一方クラウドターミナルでは、サーバー側のLinuxにインストールされた環境が使われるため、同じコマンドでも結果が違うことがあります。"
          },
          {
            "type": "code",
            "filename": "compare-version.txt",
            "lang": "bash",
            "code": `# ローカル環境
python3 --version
# => Python 3.12.2
  
# クラウド環境（例：AWS EC2）
python3 --version
# => Python 3.11.9`
          },
          {
            "type": "ul",
            "items": [
              "ローカル環境：自分のマシンに依存",
              "クラウド環境：開発チーム共有の設定が反映",
              "依存関係やパスの違いに注意（特にNode.js, Docker, Poetryなど）"
            ]
          }
        ]
      },
      {
        "id": "data-persistence",
        "title": "データの保存場所と永続性",
        "summary": "クラウド環境では、停止や再構築でデータが消えることもあります。",
        "content": [
          {
            "type": "p",
            "text": "ローカル環境では、ファイルを保存すれば基本的に永続的に残ります。しかしクラウド環境では、インスタンス（サーバー）が削除・再構築されるとファイルも失われることがあります。特にGitHub Codespacesや一時的なEC2では注意が必要です。"
          },
          {
            "type": "ul",
            "items": [
              "クラウド環境では、重要なファイルはGitHubにpushして保管する",
              "Dockerやコンテナ環境では、停止すると変更が消える場合がある",
              "ローカルとの同期（例：VS CodeのRemote機能）を理解することが大切"
            ]
          }
        ]
      },
      {
        "id": "security-and-access",
        "title": "セキュリティとアクセス権の違い",
        "summary": "クラウドでは公開環境ゆえのセキュリティ意識が求められます。",
        "content": [
          {
            "type": "p",
            "text": "ローカル環境は自分のPC内部のため、基本的には自分だけがアクセスできます。しかしクラウドターミナルは、インターネット経由でアクセスするため、SSH鍵や認証設定が必須です。"
          },
          {
            "type": "ul",
            "items": [
              "SSH接続では秘密鍵（private key）を厳重に管理する",
              "公開サーバーではroot権限の操作を慎重に行う",
              "クラウドのIP制限やファイアウォール設定を理解する"
            ]
          },
          {
            "type": "p",
            "text": "VS Codeでクラウドターミナルに接続する場合も、裏ではSSH経由で通信が行われています。そのため、接続エラーや認証失敗が起きたときは、ネットワークや鍵設定を確認しましょう。"
          }
        ]
      },
      {
        "id": "summary-local-vs-cloud",
        "title": "まとめ：どちらも開発に欠かせない環境",
        "summary": "ローカルとクラウド、それぞれに利点があります。",
        "content": [
          {
            "type": "ul",
            "items": [
              "ローカル：軽量・即時性が高く、実験や小規模開発に最適",
              "クラウド：チーム共有や本番環境に近い環境構築が可能",
              "VS CodeのRemote開発機能で、両者をシームレスに活用できる"
            ]
          },
          {
            "type": "p",
            "text": "開発者としては、どちらのターミナルで作業しているかを常に意識し、環境差を理解した上でコマンドを実行することが重要です。"
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
            ターミナルの使用ガイダンス
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