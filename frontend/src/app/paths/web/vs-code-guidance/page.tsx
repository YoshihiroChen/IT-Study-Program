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
    "key": "vscode-local-dev",
    "title": "Local開発の準備",
    "lessons": [
      {
        "id": "install",
        "title": "VS Codeのインストール",
        "summary": "Visual Studio Codeをダウンロードしてローカル開発環境を整えます。",
        "content": [
          {
            "type": "p",
            "text": "Visual Studio Code（VS Code）は、Web開発からPython、機械学習、クラウド開発まで幅広く利用されている軽量かつ高機能なエディタです。この教材では、VS Codeを使ってローカル開発を行う方法を学びます。"
          },
          {
            "type": "p",
            "text": "まずは公式サイトからVS Codeをダウンロードします。自分のOS（macOS / Windows / Linux）に合ったインストーラーを選んでください。"
          },
          {
            "type": "p",
            "text": "👉 [Visual Studio Code公式サイト](https://code.visualstudio.com/)"
          },
          {
            "type": "img",
            "src": "/images/vs-code-0.png",
            "alt": "VS Code公式サイトのトップページ",
            "caption": "公式サイトから「Download」をクリックしてインストールします。"
          },
          {
            "type": "p",
            "text": "インストールが完了したら、VS Codeを起動してみましょう。最初に表示されるのが次のような「Welcome画面」です。ここから新しいファイルを作成したり、既存のフォルダーを開いたりできます。"
          },
          {
            "type": "img",
            "src": "/images/vs-code-1.png",
            "alt": "VS CodeのWelcome画面",
            "caption": "起動直後のWelcomeページ。左上のExplorerをクリックします。"
          }
        ]
      },
      {
        "id": "open-folder",
        "title": "フォルダーを開いてプロジェクトを始める",
        "summary": "エクスプローラーを使って開発するフォルダーを選びましょう。",
        "content": [
          {
            "type": "p",
            "text": "VS Codeで開発を始める基本は、まず「フォルダーを開く」ことです。これは、プロジェクト全体を1つのフォルダーとして管理するためです。"
          },
          {
            "type": "img",
            "src": "/images/vs-code-2.png",
            "alt": "エクスプローラーを開く",
            "caption": "左側の（Open Folder）をクリックすると、プロジェクト全体を1つのフォルダーとして管理します"
          },
          {
            "type": "p",
            "text": "「Open Folder...」をクリックすると、フォルダー選択ダイアログが表示されます。ここで、自分の開発用フォルダー（例：example-projectなど）を選びましょう。"
          },
          {
            "type": "img",
            "src": "/images/vs-code-3.png",
            "alt": "Open Folderのダイアログ",
            "caption": "フォルダー選択画面。プロジェクト用に新しいフォルダーを作ることもできます。"
          },
          {
            "type": "p",
            "text": "フォルダーを開くとき、「このフォルダー内のファイルの作者を信頼しますか？」というメッセージが表示される場合があります。"
          },
          {
            "type": "img",
            "src": "/images/vs-code-4.png",
            "alt": "Trust the authors ダイアログ",
            "caption": "信頼できるフォルダーであれば「Yes, I trust the authors」を選択してください。"
          },
          {
            "type": "p",
            "text": "フォルダーを開くと、左側にファイルツリー（ディレクトリ構成）が表示されます。これが開発のスタート地点になります。"
          },
          {
            "type": "img",
            "src": "/images/vs-code-5.png",
            "alt": "フォルダーを開いた後のエクスプローラー画面",
            "caption": "左側にファイル構成が表示され、ここからファイルを作成・編集できます。"
          }
        ]
      },
      {
        "id": "command-terminal",
        "title": "コマンドパレットとターミナルの使い方",
        "summary": "開発中に必要なターミナルやコマンドをVS Code内で開く方法を学びます。",
        "content": [
          {
            "type": "p",
            "text": "VS Codeでは、開発中にさまざまなコマンド（例：ファイル作成、実行、設定変更）を「コマンドパレット」から実行できます。"
          },
          {
            "type": "img",
            "src": "/images/vs-code-6.png",
            "alt": "コマンドパレットの開き方",
            "caption": "上部の検索バーをクリックするか、ショートカット（Mac：⌘ + Shift + P / Windows：Ctrl + Shift + P）で開けます。"
          },
          {
            "type": "p",
            "text": "「Show and Run Commands」と入力すると、VS Codeが提供するすべてのコマンド一覧が表示されます。ここから「Create New Terminal」を選びます。"
          },
          {
            "type": "img",
            "src": "/images/vs-code-7.png",
            "alt": "Create New Terminalを選択",
            "caption": "コマンドパレットから「Terminal: Create New Terminal」を選ぶと、下部にターミナルが開きます。"
          },
          {
            "type": "p",
            "text": "「Create New Terminal」をクリックすると、シェル（コマンド実行環境）を選択することができます。bash、zsh、PowerShell、またはJavaScript Debug Terminalなどから選べます。"
          },
          {
            "type": "img",
            "src": "/images/vs-code-8.png",
            "alt": "ターミナルの種類選択画面",
            "caption": "ターミナル種別の選択。macOSではbashやzsh、WindowsではPowerShellが一般的です。"
          },
          {
            "type": "p",
            "text": "VS Codeで新しいターミナルを開くときは、使用するシェル（Shell）を選択できます。ここでは、開発でよく使われる3つのターミナルを紹介します。"
          },
          {
            "type": "ul",
            "items": [
              "bash（バッシュ）：LinuxやmacOSで標準的に使われるシェル。EC2などのサーバーでも一般的で、ファイル操作・Git・プログラム実行など多用途に使われます。",
              "zsh（ゼットシェル）：macOSの新しいデフォルトシェル。bashとほぼ同じ操作ができ、補完機能やカスタマイズ性が高いのが特徴です。",
              "JavaScript Debug Terminal：Node.jsアプリケーションをデバッグするための特別なターミナル。コードを実行すると同時に、ブレークポイントや変数の状態をVS Code上で確認できます。"
            ]
          },
          {
            "type": "p",
            "text": "通常の開発作業ではbashまたはzshを使い、JavaScript Debug TerminalはNode.jsやNext.jsのデバッグ時に利用します。"
          },
          {
            "type": "img",
            "src": "/images/vs-code-8.png",
            "alt": "ターミナルの種類選択画面",
            "caption": "bash、zsh、JavaScript Debug Terminalなどから選択できます。macOSではzsh、Linuxではbashが一般的です。"
          },
          {
            "type": "p",
            "text": "ターミナルが表示されたら、コマンドを入力して操作できます。ここの例として、「pwd」というコマンドを実行します"
          },
          {
            "type": "img",
            "src": "/images/vs-code-9.png",
            "alt": "ターミナルの画面"
          },
          
          {
            "type": "p",
            "text": "これで、VS Codeを使ってローカル開発を始める準備が整いました。次の章では、クラウド（AWS EC2）に接続して開発する方法を学びます。"
          }
        ]
      }
    ]
  },
  {
    "key": "vscode-cloud-dev",
    "title": "クラウド開発の準備",
    "lessons": [
      {
        "id": "ec2-create",
        "title": "AWSでEC2インスタンスを作成する",
        "summary": "AWSコンソールから新しいEC2インスタンスを立ち上げて、クラウド上の開発環境を準備します。",
        "content": [
          {
            "type": "p",
            "text": "まずはAWSの公式コンソールにログインし、サービス一覧から「EC2」を選択します。左上の「Instances」をクリックし、「Launch instances」を押すと新しいサーバーを作成する画面が開きます。"
          },
          {
            "type": "img",
            "src": "/images/aws-1.png",
            "alt": "GoogleでAWSを検索",
            "caption": "GoogleでAWSを検索、公式サイトを開きます。"
          },
          {
            "type": "img",
            "src": "/images/aws-2.png",
            "alt": "公式サイトでアカウント作成",
            "caption": "公式サイトでアカウント作成"
          },
          {
            "type": "img",
            "src": "/images/aws-3.png",
            "alt": "公式サイトで「コンソールにサインイン」をクリック",
            "caption": "アカウント作成したら公式サイトで「コンソールにサインイン」をクリック"
          },
          {
            "type": "img",
            "src": "/images/aws-4.png",
            "alt": "サインインした後はコンソールのトップページに到着",
            "caption": "サインインした後はコンソールのトップページに到着"
          },
          {
            "type": "img",
            "src": "/images/aws-5.png",
            "alt": "上側の検索バーでEC2を入力、EC2仮想サーバーを開く",
            "caption": "上側の検索バーでEC2を入力、EC2仮想サーバーを開く"
          },
          {
            "type": "img",
            "src": "/images/aws-6.png",
            "alt": "右上から地域を変更する",
            "caption": "右上から地域を変更する"
          },
          {
            "type": "img",
            "src": "/images/aws-7.png",
            "alt": "地域を変更した後は「Launch Instance」を開く",
            "caption": "地域を変更した後は「インスタンスを起動」をクリック"
          },
          {
            "type": "p",
            "text": "「インスタンスを起動」をクリックした後、以下の設定で"
          },
          
          {
            "type": "ul",
            "items": [
              "Name：任意（例：my-vscode-server）",
              "AMI（OS）：Amazon Linux 2023 Kernel-6.1 AMI",
              "Instance type：t2.micro（無料枠）または t3.small（性能重視）",
              "Key pair：新しく作成（.pemファイルを必ずダウンロード）",
              "Network settings：「からの SSH トラフィックを許可」にチェックを入れる",
              "Storage：8GB（必要に応じて拡張可）"
            ]
          },
          {
            "type": "p",
            "text": "設定が終わったら右下の「インスタンスを起動」をクリックし、インスタンスを起動します。"
          },
          {
            "type": "img",
            "src": "/images/aws-8.png",
            "alt": "AMI（OS）：Amazon Linux 2023 Kernel-6.1 AMI",
            "caption": "AMI（OS）：Amazon Linux 2023 Kernel-6.1 AMI"
          },
          {
            "type": "img",
            "src": "/images/aws-8.png",
            "alt": "AMI（OS）：Amazon Linux 2023 Kernel-6.1 AMI",
            "caption": "AMI（OS）：Amazon Linux 2023 Kernel-6.1 AMI"
          },
          {
            "type": "img",
            "src": "/images/aws-9.png",
            "alt": "Instance type：t2.micro（無料枠）または t3.small（性能重視）",
            "caption": "Instance type：t2.micro（無料枠）または t3.small（性能重視）"
          },
          {
            "type": "img",
            "src": "/images/aws-11.png",
            "alt": "Network settings：「からの SSH トラフィックを許可」にチェックを入れる",
            "caption": "Network settings：「からの SSH トラフィックを許可」にチェックを入れる"
          },
        ]
      },
      {
        "id": "keypair",
        "title": "Key Pair（秘密鍵）の作成",
        "summary": "SSH接続に必要な秘密鍵（.pemファイル）を作成し、安全に保管します。",
        "content": [
          {
            "type": "p",
            "text": "EC2に接続するには「Key Pair」と呼ばれる秘密鍵が必要です。これはサーバーへのログインを許可する“鍵”のようなものです。"
          },
          {
            "type": "ul",
            "items": [
              "Step 3: Key pair (login) の欄で「Create new key pair」を選択",
              "Key pair name：任意（自分で決める）",
              "Key pair type：RSA",
              "Private key file format：macOS / Linux → .pem、Windows（PuTTY使用時）→ .ppk"
            ]
          },
          {
            "type": "p",
            "text": "「Create key pair」をクリックすると、.pem ファイル（例：my-ec2-key.pem）が自動的にダウンロードされます。"
          },
          {
            "type": "p",
            "text": "このファイルは一度しかダウンロードできません。ここではDownloadsフォルダにダウンロードしてください。"
          },
          {
            "type": "ul",
            "items": [
              "mac / Linux：~/.ssh/<あなたのキーペア名>.pem",
              "Windows：C:\\Users\\あなたのユーザー名\\.ssh\\<あなたのキーペア名>.pem"
            ]
          },
          {
            "type": "img",
            "src": "/images/aws-10.png",
            "alt": "Create key pair",
            "caption": "Create key pair"
          },
        ]
      },
      {
        "id": "ec2-launch",
        "title": "インスタンスの起動とパブリックIP確認",
        "summary": "起動したインスタンスの状態とIPアドレスを確認します。",
        "content": [
          {
            "type": "p",
            "text": "インスタンスの設定が完了したら、「Launch instance」をクリックして起動します。数分後、ステータスが「Running」になれば成功です。"
          },
          {
            "type": "p",
            "text": "左のメニューから「Instances」を開き、起動したサーバーを選びましょう。「Public IPv4 address」に表示されている数値（例：xx.xxx.xx.xx）が接続に使うIPアドレスです。"
          },
          {
            "type": "img",
            "src": "/images/aws-12.png",
            "alt": "インスタンスを開く",
            "caption": "インスタンスを開く"
          },
          {
            "type": "img",
            "src": "/images/aws-13.png",
            "alt": "パブリックIPアドレスを確認する",
            "caption": "パブリックIPアドレスを確認する"
          },
          {
            "type": "p",
            "text": "このIPアドレスをメモしておきましょう。次のステップでSSH接続に使用します。"
          }
        ]
      },
      {
        "id": "ssh-connect",
        "title": "ターミナルからSSH接続を確認する",
        "summary": "ローカル端末からEC2にSSH接続できるか確認します。",
        "content": [
          {
            "type": "p",
            "text": "次に、自分のパソコンのターミナルを使ってEC2へ接続できるか確認します。まずはダウンロードした.pemファイルを適切な場所に移動し、アクセス権限を設定します。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "mv ~/Downloads/<あなたのキーペア名>.pem ~/.ssh/\nchmod 400 ~/.ssh/<あなたのキーペア名>.pem"
          },
          {
            "type": "p",
            "text": "次に、SSHコマンドでサーバーに接続します。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "ssh -i ~/.ssh/<あなたのキーペア名>.pem ec2-user@<あなたのPublic IP>\n\n# 例：\n# ssh -i ~/.ssh/あなたのキーペア名.pem ec2-user@<あなたのPublic IP>"
          },
          {
            "type": "p",
            "text": "接続に成功すると、次のようなプロンプトが表示されます。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "[ec2-user@ip-xx.xxx.xx.xx ~]$"
          },
          {
            "type": "p",
            "text": "これで、ローカル端末からクラウド上のEC2サーバーにログインできるようになりました。"
          }
        ]
      },
      {
        "id": "vscode-remote",
        "title": "VS CodeでEC2にリモート接続する",
        "summary": "VS CodeのRemote-SSH機能を使って、クラウドサーバーに直接接続します。",
        "content": [
          {
            "type": "p",
            "text": "VS Codeを開き、拡張機能（Extensions）から「Remote - SSH」を検索してインストールします。"
          },
          {
            "type": "img",
            "src": "/images/aws-14.png",
            "alt": "拡張機能（Extensions）から「Remote - SSH」を検索する",
            "caption": "拡張機能（Extensions）から「Remote - SSH」を検索する"
          },
          {
            "type": "p",
            "text": "次に、ショートカット（macOS：Cmd + Shift + P / Windows：Ctrl + Shift + P）でコマンドパレットを開き、「Remote-SSH: Add New SSH Host」を選択します。"
          },
          {
            "type": "p",
            "text": "表示された入力欄に以下のコマンドを入力し、自分の鍵とIPに置き換えます。"
          },
          {
            "type": "code",
            "filename": "ssh-config-example",
            "lang": "bash",
            "code": "ssh -i ~/.ssh/<あなたのキーペア名>.pem ec2-user@<あなたのPublic IP>"
          },
          {
            "type": "p",
            "text": "保存先は「Save to default SSH config file（~/.ssh/config）」を選びます。"
          },
          {
            "type": "p",
            "text": "再びコマンドパレットを開き、「Remote-SSH: Connect to Host」を実行し、保存したホストを選択します。"
          },
          {
            "type": "p",
            "text": "初回接続時はVS Codeが自動的に必要なサーバーコンポーネントをインストールします。1〜2分ほど待つと、左下に「SSH: <接続先名>」と表示され、クラウド上の環境に接続完了です。"
          },
          {
            "type": "ul",
            "items": [
              "リモート上のファイルを直接開ける",
              "VS Code内でリモートターミナルを利用できる",
              "クラウドとローカルを一体化した開発が可能"
            ]
          }
        ]
      }
    ]
  },
  {
    "key": "vscode-static-web",
    "title": "HTML+CSS +JavaScriptで静的アプリをLOCAL開発",
    "lessons": [
      {
        "id": "create-structure",
        "title": "プロジェクト構造を作る",
        "summary": "HTML、CSS、JavaScriptの3つのファイルを作成して、基本的な静的Webアプリの構造を理解します。",
        "content": [
          {
            "type": "p",
            "text": "ここでは、最もシンプルなWebアプリの開発方法として「HTML + CSS + JavaScript」を使った静的サイトを作ります。サーバーを使わず、VS Codeだけで実行・プレビューが可能です。"
          },
          {
            "type": "ul",
            "items": [
              "新しいフォルダーを作成（例：static-app）",
              "VS Codeでそのフォルダーを開く（File → Open Folder）",
              "以下の3つのファイルを作成：index.html、style.css、script.js"
            ]
          },
          {
            "type": "p",
            "text": "まずはHTMLファイルを作成し、ページの骨格を定義します。"
          },
          {
            "type": "code",
            "filename": "index.html",
            "lang": "html",
            "code": "<!DOCTYPE html>\n<html lang=\"ja\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>My Static App</title>\n    <link rel=\"stylesheet\" href=\"style.css\" />\n  </head>\n  <body>\n    <h1>こんにちは、VS Code！</h1>\n    <button id=\"btn\">クリックしてみよう</button>\n    <p id=\"message\"></p>\n    <script src=\"script.js\"></script>\n  </body>\n</html>"
          },
          {
            "type": "p",
            "text": "次にCSSファイルを作って、デザインを整えます。"
          },
          {
            "type": "code",
            "filename": "style.css",
            "lang": "css",
            "code": "body {\n  font-family: sans-serif;\n  text-align: center;\n  padding: 50px;\n  background-color: #f5f5f5;\n}\n\nh1 {\n  color: #333;\n}\n\nbutton {\n  background-color: #0078d7;\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 5px;\n  cursor: pointer;\n}\n\nbutton:hover {\n  background-color: #005ea2;\n}"
          },
          {
            "type": "p",
            "text": "最後にJavaScriptファイルで、ページに動きをつけます。"
          },
          {
            "type": "code",
            "filename": "script.js",
            "lang": "javascript",
            "code": "const button = document.getElementById('btn');\nconst message = document.getElementById('message');\n\nbutton.addEventListener('click', () => {\n  message.textContent = 'クリックありがとう！JavaScriptが動いています。';\n});"
          },
          {
            "type": "p",
            "text": "これで、最小構成の静的アプリが完成しました。"
          }
        ]
      },
      {
        "id": "run-preview",
        "title": "VS Codeでプレビューする",
        "summary": "Live Server拡張機能を使って、ブラウザでHTMLを表示・確認します。",
        "content": [
          {
            "type": "p",
            "text": "静的サイトはサーバーを起動しなくてもブラウザで直接開けますが、VS Codeの「Live Server」拡張機能を使うと変更を即時反映できて便利です。"
          },
          {
            "type": "ul",
            "items": [
              "拡張機能（Extensions）で「Live Server」を検索してインストール",
              "index.htmlを開き、右下の「Go Live」ボタンをクリック",
              "ブラウザが自動的に起動し、http://127.0.0.1:5500 でページが表示される"
            ]
          },
          {
            "type": "p",
            "text": "HTML・CSS・JavaScriptを保存するたびに自動で更新されます。これでリアルタイムにデザインや動作を確認できます。"
          },
          {
            "type": "p",
            "text": "次のようにボタンをクリックすると、JavaScriptが正しく動作してメッセージが表示されます。"
          },
          {
            "type": "code",
            "filename": "terminal-output.txt",
            "lang": "bash",
            "code": "クリックありがとう！JavaScriptが動いています。"
          },
          {
            "type": "p",
            "text": "このように、HTML + CSS + JavaScriptの構成で作るWebアプリは、もっとも基本的で軽量な開発方法です。今後ReactやNext.jsなどのフレームワークを学ぶ際にも、この構造を理解しておくことがとても重要です。"
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
            VsCodeの使用ガイダンス
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