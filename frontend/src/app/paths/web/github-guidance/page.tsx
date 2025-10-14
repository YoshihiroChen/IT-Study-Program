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
    "key": "git-structure",
    "title": "Gitの構造と基本コマンド",
    "lessons": [
      {
        "id": "git-architecture",
        "title": "Gitの4つの領域（エリア）",
        "summary": "Gitは4つの領域でデータを管理し、それぞれの間をコマンドで移動させる仕組みを持っています。",
        "content": [
          {
            "type": "p",
            "text": "Gitでは、コードの変更が次の4つの領域（エリア）を通して管理されます。それぞれのエリアは、変更の段階を表しています。"
          },
          {
            "type": "ul",
            "items": [
              "① Working Directory（作業ディレクトリ）：実際にファイルを編集する場所。まだGitに記録されていない生の状態。",
              "② Staging Area（ステージングエリア）：次に記録する変更を一時的に置いておく準備エリア。",
              "③ Local Repository（ローカルリポジトリ）：自分のパソコン上に保存される履歴データベース。",
              "④ Remote Repository（リモートリポジトリ）：GitHubなどのサーバー上で他の人と共有するリポジトリ。"
            ]
          },
          {
            "type": "img",
            "src": "/images/github-1.png",
            "alt": "Gitの4つの領域とデータの流れを示す図"
          },
          {
            "type": "p",
            "text": "下図のように、変更は左から右へ（Working → Remote）流れ、取得や復元は右から左へ（Remote → Working）流れます。"
          }
        ]
      },
      {
        "id": "git-flow-commands",
        "title": "Gitの操作とコマンドの流れ",
        "summary": "各エリア間の移動には、対応するコマンドがあります。この流れを理解するとGitの全体像がつかめます。",
        "content": [
          {
            "type": "p",
            "text": "ここでは、図にある矢印に対応する主要なコマンドを順番に説明します。"
          },
          {
            "type": "ul",
            "items": [
              "① **git add**：Working Directory → Staging Area。編集したファイルを「次に記録する候補」として登録します。",
              "② **git commit**：Staging Area → Local Repo。登録した変更を確定し、履歴として保存します。",
              "③ **git push**：Local Repo → Remote Repo。ローカルの履歴をリモート（GitHubなど）へ送信します。",
              "④ **git fetch**：Remote Repo → Local Repo。リモートの最新データを取得しますが、まだ作業ディレクトリには反映されません。",
              "⑤ **git pull**：Remote Repo → Working Directory（内部的にはfetch + merge）。リモートの変更を自分の作業環境に取り込みます。",
              "⑥ **git merge**：他のブランチやリモートの変更を、現在の作業ブランチに統合します。",
              "⑦ **git checkout**：ブランチや過去の履歴に切り替え、作業ディレクトリの内容を変更します。",
              "⑧ **git clone**：Remote Repo → Working Directory。リモート上のリポジトリをまるごと自分の環境に複製します。"
            ]
          },
          {
            "type": "p",
            "text": "つまり、ファイルの変更は以下のように流れます："
          },
          {
            "type": "code",
            "filename": "git-flow.txt",
            "lang": "bash",
            "code": "Working Directory --(git add)--> Staging Area --(git commit)--> Local Repo --(git push)--> Remote Repo"
          },
          {
            "type": "p",
            "text": "逆方向では、他の人の変更を取得するために「git pull」や「git fetch」を使います。"
          }
        ]
      },
      {
        "id": "git-typical-workflow",
        "title": "実際の作業フロー",
        "summary": "実務でよく使われる一連のGit操作を体験してみましょう。",
        "content": [
          {
            "type": "p",
            "text": "以下は、一般的なGitの作業手順です。最初はこの流れを覚えるのがポイントです。"
          },
          {
            "type": "ul",
            "items": [
              " 1. ファイルを編集（Working Directory）",
              " 2. git add で変更をステージに追加",
              " 3. git commit -m '変更内容を記述' で履歴を保存",
              " 4. git push origin main でGitHubへアップロード",
              " 5. 他の人の変更を取り込む場合は git pull"
            ]
          },
          {
            "type": "p",
            "text": "これらを理解すると、図の中の矢印の意味が自然にわかるようになります。Gitは「どのエリアのデータをどこへ移動させたいか」を明示するシステムなのです。"
          }
        ]
      }
    ]
  },
  {
    "key": "github-basics",
    "title": "GitHubの使い方",
    "lessons": [
      {
        "id": "what-is-github",
        "title": "GitHubとは",
        "summary": "GitHubは、Gitリポジトリをオンラインで管理・共有するためのプラットフォームです。",
        "content": [
          {
            "type": "p",
            "text": "GitHubは、ソフトウェア開発者が自分のコードを保存し、チームや世界中の人と共同作業を行うためのクラウドサービスです。Gitで管理しているプロジェクトをインターネット上に公開し、複数人が同時に開発できるようになります。"
          },
          {
            "type": "ul",
            "items": [
              "ソースコードのバックアップ・共有",
              "複数人での開発（共同編集・レビュー）",
              "変更履歴（commit log）の可視化",
              "Pull Request（変更提案）の管理",
              "Issue（課題管理）やWikiなどの補助機能"
            ]
          },
          {
            "type": "p",
            "text": "GitHubは、個人開発から大規模なオープンソースプロジェクトまで幅広く利用されています。"
          }
        ]
      },
      {
        "id": "create-repo",
        "title": "GitHubで新しいリポジトリを作成する",
        "summary": "GitHubのウェブサイトから新しいリポジトリを作成して、プロジェクトを登録します。",
        "content": [
          {
            "type": "ul",
            "items": [
              "① GitHubにログイン（https://github.com）",
              "② 右上の「＋」→「New repository」をクリック",
              "③ Repository name：リポジトリ名（例：my-first-project）を入力",
              "④ Description：任意（プロジェクトの説明）",
              "⑤ Public / Private：公開設定を選択",
              "⑥ 「Add a README file」をチェックすると説明ファイルが自動生成されます",
              "⑦ 最後に「Create repository」をクリック"
            ]
          },
          {
            "type": "p",
            "text": "これで、新しいリポジトリのページが表示されます。URL（例：https://github.com/ユーザー名/リポジトリ名）を後で使うのでコピーしておきましょう。"
          },
          {
            "type": "img",
            "src": "/images/github-2.png",
            "alt": "Githubの公式サイトでまずはアカウント作成",
            "caption": "Githubの公式サイトでまずはアカウント作成"
          },
          {
            "type": "img",
            "src": "/images/github-3.png",
            "alt": "Githubの公式サイトでまずはアカウント作成",
            "caption": "そしてログインする"
          },
          {
            "type": "img",
            "src": "/images/github-4.png",
            "alt": "Githubの公式サイトでまずはアカウント作成",
            "caption": "ログインしたらマイページに到達する"
          },
          {
            "type": "img",
            "src": "/images/github-5.png",
            "alt": "Githubの公式サイトでまずはアカウント作成",
            "caption": "マイページで右上のプラスボタンをクリックする"
          },
          {
            "type": "img",
            "src": "/images/github-6.png",
            "alt": "Githubの公式サイトでまずはアカウント作成",
            "caption": "リポジトリの設定を行う"
          },
        ]
      },
      {
        "id": "connect-local",
        "title": "ローカル環境とGitHubを接続する",
        "summary": "ローカルリポジトリをGitHub上のリモートリポジトリに接続します。",
        "content": [
          {
            "type": "p",
            "text": "すでにローカルでGitリポジトリを作っている場合、GitHub上のリポジトリと紐づけることで、push・pullなどの操作が可能になります。"
          },
          {
            "type": "code",
            "filename": "connect-github.sh",
            "lang": "bash",
            "code": "git remote add origin https://github.com/ユーザー名/リポジトリ名.git\ngit branch -M main\ngit push -u origin main"
          },
          {
            "type": "p",
            "text": "これで、ローカルのmainブランチとGitHub上のリモートブランチが接続されます。以後は以下のコマンドで同期が可能です："
          },
          {
            "type": "code",
            "filename": "sync.sh",
            "lang": "bash",
            "code": "git push    # ローカル→GitHub\ngit pull    # GitHub→ローカル"
          }
        ]
      },
      {
        "id": "clone-repo",
        "title": "GitHubのリポジトリをクローンする",
        "summary": "他の人のリポジトリや自分のリモートリポジトリをローカルにコピーします。",
        "content": [
          {
            "type": "p",
            "text": "GitHubのリポジトリページで「Code」ボタンをクリックし、表示されたURLをコピーします。次に、ローカルのターミナルで以下を実行します："
          },
          {
            "type": "code",
            "filename": "git-clone.sh",
            "lang": "bash",
            "code": "git clone https://github.com/ユーザー名/リポジトリ名.git"
          },
          {
            "type": "p",
            "text": "これで、リポジトリがローカルに複製され、作業ディレクトリ内で開発を開始できます。"
          }
        ]
      },
      {
        "id": "branch-and-merge",
        "title": "ブランチを使った開発",
        "summary": "複数人で同時開発する際は、ブランチを分けて作業し、後で統合します。",
        "content": [
          {
            "type": "ul",
            "items": [
              "① mainブランチは安定版（公開用）として保護する",
              "② 新機能を開発する際はブランチを作成して作業",
              "③ テスト後にmainブランチへマージ"
            ]
          },
          {
            "type": "code",
            "filename": "branch-example.sh",
            "lang": "bash",
            "code": "git switch -c feature/add-login\n# コードを編集\ngit add .\ngit commit -m 'ログイン機能追加'\ngit push -u origin feature/add-login"
          },
          {
            "type": "p",
            "text": "GitHubのリポジトリページにアクセスすると、ブランチが追加されているのが確認できます。"
          }
        ]
      },
      {
        "id": "pull-request",
        "title": "Pull Requestを作成する",
        "summary": "自分のブランチで行った変更を、mainブランチに反映するための「変更提案」を送ります。",
        "content": [
          {
            "type": "p",
            "text": "Pull Request（略してPR）は、他の人に「この変更をマージしてもいいですか？」と提案する機能です。"
          },
          {
            "type": "ul",
            "items": [
              "① GitHubのリポジトリページで「Compare & pull request」をクリック",
              "② タイトルと説明を入力（例：「ログイン機能の追加」）",
              "③ 「Create pull request」をクリック",
              "④ 他のメンバーがレビューし、問題なければ「Merge pull request」をクリック"
            ]
          },
          {
            "type": "p",
            "text": "マージ後は、不要になったブランチを削除してリポジトリを整理します："
          },
          {
            "type": "code",
            "filename": "delete-branch.sh",
            "lang": "bash",
            "code": "git branch -d feature/add-login\ngit push origin --delete feature/add-login"
          }
        ]
      },
      {
        "id": "sync-collaboration",
        "title": "チーム開発での同期と注意点",
        "summary": "共同開発では、他の人の変更と衝突しないようにこまめに同期を取りましょう。",
        "content": [
          {
            "type": "ul",
            "items": [
              "作業前に必ず git pull で最新状態を取得する",
              "作業後は git add → git commit → git push の順で更新",
              "衝突（conflict）が発生した場合は、ファイル内で差分を確認し、手動で解決",
              "大規模開発では main ブランチを直接編集しない",
              "チームでは「Pull Request」を通してのみ反映させるルールを作る"
            ]
          },
          {
            "type": "p",
            "text": "これらを守ることで、複数人で同時に作業しても安全にコードを共有できます。"
          }
        ]
      },
      {
        "id": "github-summary",
        "title": "まとめ：GitHub操作の全体フロー",
        "summary": "GitHubを使った開発の全体像をまとめます。",
        "content": [
          {
            "type": "code",
            "filename": "github-flow.txt",
            "lang": "bash",
            "code": "1. GitHubでリポジトリを作成\n2. git clone でローカルに取得\n3. git switch -c feature/◯◯ でブランチを作成\n4. コードを編集 → git add → git commit\n5. git push でGitHubにアップロード\n6. Pull Requestを作成\n7. レビュー後、Merge\n8. mainブランチを最新に更新 (git pull)"
          },
          {
            "type": "p",
            "text": "GitHubは「チームで安全にコードを共有し、品質を高める」ための基盤です。基本操作をマスターすれば、どんな開発プロジェクトにも参加できるようになります。"
          }
        ]
      }
    ]
  },
  {
    "key": "github-interface",
    "title": "GitHubリポジトリ画面の構成と各機能",
    "lessons": [
      {
        "id": "overview",
        "title": "リポジトリ画面の全体構成",
        "summary": "GitHubのリポジトリ画面には、多くのタブと情報が整理されています。それぞれの意味を理解することで、開発状況を把握できます。",
        "content": [
          {
            "type": "p",
            "text": "GitHubのリポジトリページは、プロジェクトのすべてを管理する中心的な場所です。上部にあるタブや右側のサイドバーには、開発状況やコラボレーションのための重要な機能が集まっています。"
          },
          {
            "type": "ul",
            "items": [
              "① Code：ソースコードとファイル構造を表示するメインタブ。",
              "② Issues：バグ報告や改善提案などの課題を管理する機能。",
              "③ Pull requests：他のブランチやメンバーからの変更提案を管理するページ。",
              "④ Actions：CI/CD（自動テスト・自動デプロイなど）の設定と実行状況。",
              "⑤ Projects：タスク管理ボード（Kanban形式）で進捗を可視化。",
              "⑥ Wiki：ドキュメントや開発手順をまとめる社内用のWiki機能。",
              "⑦ Security：脆弱性スキャンや依存関係チェック。",
              "⑧ Insights：コミット数、貢献者、トラフィックなどの統計情報。",
              "⑨ Settings：リポジトリの基本設定（公開・非公開、ブランチ保護、連携設定など）。"
            ]
          },
          {
            "type": "img",
            "src": "/images/github-8.png",
            "alt": "GitHubリポジトリの上部にあるタブ"
          },
        ]
      },
      {
        "id": "repo-top-info",
        "title": "リポジトリ上部の情報エリア",
        "summary": "リポジトリ名、公開設定、ブランチ数、タグ数などが表示されています。",
        "content": [
          {
            "type": "ul",
            "items": [
              "Repository Name（例：git-practice）：プロジェクトの名前。",
              "Public / Private：公開リポジトリか非公開リポジトリかを示す。",
              "Branches（例：2 Branches）：存在するブランチの数（main, topic1など）。",
              "Tags（例：0 Tags）：特定のリリースに付けるバージョンラベル。"
            ]
          },
          {
            "type": "p",
            "text": "ブランチを切り替えたいときは、左上のブランチメニュー（`main ▼`）から選択します。"
          },
          {
            "type": "img",
            "src": "/images/github-9.png",
            "alt": "リポジトリ上部の情報エリア"
          },
        ]
      },
      {
        "id": "readme-section",
        "title": "README.mdファイルの役割",
        "summary": "リポジトリのトップページに表示される説明文です。",
        "content": [
          {
            "type": "p",
            "text": "README.md は、プロジェクトの概要や使い方を説明するMarkdownファイルです。GitHubでは自動的に画面下部に表示され、他の人が最初に見る情報になります。"
          },
          {
            "type": "ul",
            "items": [
              "プロジェクトの目的・概要を書く",
              "インストール方法や実行手順を記載",
              "ライセンス情報を明記する",
              "他の開発者へのメッセージを書く"
            ]
          },
          {
            "type": "code",
            "filename": "README.md",
            "lang": "markdown",
            "code": "# git-practice\nこのリポジトリはGitHubの練習用です。\n\n## 使い方\n```\ngit clone https://github.com/xxxxxxxxxxxxx/git-practice.git\ncd git-practice\n```"
          },
          {
            "type": "img",
            "src": "/images/github-10.png",
            "alt": "リポジトリのREADME.mdファイル"
          },
        ]
      },
      {
        "id": "right-sidebar",
        "title": "右側のサイドバー（About, Releases, Packages）",
        "summary": "プロジェクトの概要、公開情報、活動状況などを確認できます。",
        "content": [
          {
            "type": "ul",
            "items": [
              "About：プロジェクトの説明文（Description）、公式サイトURL、トピックタグを設定可能。",
              "Packages：GitHub Packagesに公開したライブラリやDockerイメージなど。",
              "Readme / Activity：最近の変更内容や更新履歴。",
              "Star：リポジトリを「お気に入り登録」したユーザー数（人気度指標）。",
              "Fork：他のユーザーがこのリポジトリを複製した回数（派生数）。",
              "watch：このリポジトリをフォローする"
            ]
          },
          {
            "type": "p",
            "text": "特に「Star」と「Fork」はGitHubでの人気と貢献度を示す重要な指標です。"
          },
          {
            "type": "img",
            "src": "/images/github-11.png",
            "alt": "右側のサイドバー（About, Releases, Packages）"
          },
        ]
      },
      {
        "id": "social-metrics",
        "title": "Star / Fork / Watch / Contributionsとは",
        "summary": "GitHubにおける貢献度や人気度を表す重要な指標です。",
        "content": [
          {
            "type": "ul",
            "items": [
              "Star：プロジェクトを気に入ったときに押す「いいね」のようなボタン。人気プロジェクトの目安になります。",
              "Fork：他の人のリポジトリを自分のアカウントにコピーして改良・派生開発を行うための機能。",
              "Watch：特定のリポジトリの更新情報を受け取る機能（Pull RequestやIssueなどの通知）。",
              "Contributions（貢献度）：自分がどのリポジトリにどれだけcommit・PR・レビューなどを行ったかを示す統計。GitHubのプロフィールページで可視化されます。"
            ]
          },
          {
            "type": "p",
            "text": "例えば、毎日のコミットやPull Requestを続けると、GitHubプロフィールに緑の貢献マップ（contribution graph）が表示され、活動量の証明になります。"
          },
          {
            "type": "img",
            "src": "/images/github-7.png",
            "alt": "ユーザーのプロフィールページの貢献度"
          },
        ]
      },
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