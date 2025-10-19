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
    "key": "swap-setup",
    "title": "EC2でのSwap領域の設定",
    "lessons": [
      {
        "id": "create-swapfile",
        "title": "Swapファイルの作成",
        "content": [
          {
            "type": "p",
            "text": "メモリが少ないEC2インスタンスでは、コンパイルやDockerビルド時にメモリ不足（Out of Memory）が発生することがあります。そのため、Swap領域を作成して仮想メモリを確保します。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "sudo fallocate -l 4G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=4096 status=progress"
          },
          {
            "type": "p",
            "text": "まず、4GBのSwapファイルを作成します。`fallocate`が使えない環境では`dd`コマンドで代替します。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "sudo chmod 600 /swapfile"
          },
          {
            "type": "p",
            "text": "ファイルのパーミッションを600に変更し、rootユーザーのみがアクセスできるようにします。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "sudo mkswap /swapfile"
          },
          {
            "type": "p",
            "text": "作成したファイルをSwap領域として初期化します。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "sudo swapon /swapfile"
          },
          {
            "type": "p",
            "text": "`swapon`コマンドでSwap領域を有効化します。"
          }
        ]
      },
      {
        "id": "verify-swap",
        "title": "Swap領域の確認",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "swapon --show"
          },
          {
            "type": "p",
            "text": "現在有効なSwap領域を確認します。`/swapfile` が表示されていれば成功です。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "free -h"
          },
          {
            "type": "p",
            "text": "メモリとSwapの使用状況を確認します。`Swap`に4.0GiBが表示されていれば設定完了です。"
          }
        ]
      },
      {
        "id": "persist-swap",
        "title": "再起動後もSwapを有効にする設定",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "grep -q '^/swapfile ' /etc/fstab || echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab"
          },
          {
            "type": "p",
            "text": "`/etc/fstab` にSwap設定を追記し、再起動後も自動的に有効になるようにします。"
          }
        ]
      },
      {
        "id": "tune-swap",
        "title": "Swapのパフォーマンス調整",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "echo 10 | sudo tee /proc/sys/vm/swappiness\n\necho 50 | sudo tee /proc/sys/vm/vfs_cache_pressure"
          },
          {
            "type": "p",
            "text": "`swappiness`はスワップを使い始める閾値（低いほど物理メモリを優先）、`vfs_cache_pressure`はキャッシュの解放優先度を示します。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "echo 'vm.swappiness=10' | sudo tee /etc/sysctl.d/99-swappiness.conf\necho 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.d/99-swappiness.conf"
          },
          {
            "type": "p",
            "text": "これらの設定を永続化するため、`/etc/sysctl.d/99-swappiness.conf` に書き込みます。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "sudo sysctl --system"
          },
          {
            "type": "p",
            "text": "設定を即時反映させます。"
          },
          {
            "type": "img",
            "src": "/images/frontend-1.png",
            "alt": "EC2でのSwap領域の設定1",
            "caption": "EC2でのSwap領域の設定1"
          },
          {
            "type": "img",
            "src": "/images/frontend-2.png",
            "alt": "EC2でのSwap領域の設定2",
            "caption": "EC2でのSwap領域の設定2"
          },
        ]
      }
    ]
  },
  {
    "key": "frontend-init-docker",
    "title": "フロントエンドの初期化とDocker化",
    "lessons": [
      {
        "id": "init-frontend",
        "title": "Next.jsプロジェクトの初期化",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "cd ~/code-share\nmkdir frontend && cd frontend"
          },
          {
            "type": "p",
            "text": "まず、`frontend`ディレクトリを作成し、そこに移動します。ここにNext.jsアプリを構築します。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -"
          },
          {
            "type": "p",
            "text": "Node.js 20系のリポジトリを追加します。これによりAmazon Linux 2023上でも最新のNode.jsを利用できます。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "sudo dnf install -y nodejs"
          },
          {
            "type": "p",
            "text": "Node.jsとnpmをインストールします。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "node -v\nnpm -v"
          },
          {
            "type": "p",
            "text": "インストール後にバージョンを確認します。`v20.x.x` と `10.x.x` が表示されれば成功です。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "sudo npm install -g yarn@1.22.22\nyarn -v"
          },
          {
            "type": "p",
            "text": "Yarn（クラシック版）をインストールします。"
          },
          {
            "type": "img",
            "src": "/images/frontend-3.png",
            "alt": "必要なフロントエンドツールをインストール(1)",
            "caption": "必要なフロントエンドツールをインストール(1)"
          },
          {
            "type": "img",
            "src": "/images/frontend-4.png",
            "alt": "必要なフロントエンドツールをインストール(2)",
            "caption": "必要なフロントエンドツールをインストール(2)"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "export NODE_OPTIONS=\"--max_old_space_size=2048\""
          },
          {
            "type": "p",
            "text": "Node.jsのメモリ上限を2GBに設定し、ビルド時のメモリエラーを防止します。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "yarn create next-app . \\\n  --typescript \\\n  --eslint \\\n  --app \\\n  --src-dir \\\n  --import-alias \"@/*\""
          },
          {
            "type": "p",
            "text": "Next.jsアプリをTypeScript構成で初期化します。Turbopackは「Yes」を選び、Tailwind CSSは後で追加するため「No」を選びます。"
          },
          {
            "type": "img",
            "src": "/images/frontend-5.png",
            "alt": "Next.jsアプリをTypeScript構成で初期化する",
            "caption": "Next.jsアプリをTypeScript構成で初期化する"
          },
        ]
      },
      {
        "id": "fix-turbopack-error",
        "title": "Turbopackの監視制限エラー修正",
        "content": [
          {
            "type": "p",
            "text": "`yarn dev` 実行時に `Error [TurbopackInternalError]: OS file watch limit reached.` が出る場合、これはAmazon Linux 2023のデフォルト設定でファイル監視数が少ないためです。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf\nsudo sysctl -p"
          },
          {
            "type": "p",
            "text": "上記のコマンドで監視上限を引き上げ、変更を反映させます。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "cat /proc/sys/fs/inotify/max_user_watches"
          },
          {
            "type": "p",
            "text": "値が `524288` と表示されれば修正完了です。"
          },
          {
            "type": "img",
            "src": "/images/frontend-6.png",
            "alt": "Turbopackの監視制限エラー修正",
            "caption": "Turbopackの監視制限エラー修正"
          },
          {
            "type": "img",
            "src": "/images/frontend-7.png",
            "alt": "監視制限エラー修正後、ブラウザで動作確認",
            "caption": "監視制限エラー修正後、ブラウザで動作確認"
          },
        ]
      },
      {
        "id": "dockerize-frontend",
        "title": "フロントエンドのDocker化",
        "content": [
          {
            "type": "p",
            "text": "`~/code-share/frontend/Dockerfile` に以下の内容を記述します。これにより、Next.jsアプリを3段階のマルチステージビルドでDocker化します。"
          },
          {
            "type": "code",
            "filename": "Dockerfile",
            "lang": "dockerfile",
            "code": "# -----------------------------\n# Stage 1: Build dependencies\n# -----------------------------\nFROM node:20-alpine AS deps\n\nWORKDIR /app\n\n# 依存関係ファイルをコピー\nCOPY package.json yarn.lock ./\n\n# 依存関係をインストール（Yarnクラシック版使用）\nRUN yarn install --frozen-lockfile\n\n\n# -----------------------------\n# Stage 2: Build application\n# -----------------------------\nFROM node:20-alpine AS builder\n\nWORKDIR /app\n\n# ソースコードと依存関係をコピー\nCOPY --from=deps /app/node_modules ./node_modules\nCOPY . .\n\n# 環境変数設定\nARG NEXT_PUBLIC_API_BASE\nENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE\n\n# Next.jsをビルド（.nextに出力）\nRUN yarn build\n\n\n# -----------------------------\n# Stage 3: Run in production\n# -----------------------------\nFROM node:20-alpine AS runner\n\nWORKDIR /app\n\n# 環境変数（本番用）\nENV NODE_ENV=production\nENV NEXT_TELEMETRY_DISABLED=1\n\n# ビルド成果物と依存関係をコピー\nCOPY --from=builder /app/public ./public\nCOPY --from=builder /app/.next ./.next\nCOPY --from=builder /app/node_modules ./node_modules\nCOPY --from=builder /app/package.json ./package.json\n\n# ポート公開\nEXPOSE 3000\n\n# Next.js起動\nCMD [\"yarn\", \"start\", \"-H\", \"0.0.0.0\", \"-p\", \"3000\"]"
          }
        ]
      },
      {
        "id": "docker-compose-update",
        "title": "docker-compose.ymlの設定変更",
        "content": [
          {
            "type": "p",
            "text": "`docker-compose.yml` にフロントエンドサービスを追加し、バックエンド・DBと連携できるように設定します。"
          },
          {
            "type": "code",
            "filename": "docker-compose.yml",
            "lang": "yaml",
            "code": "services:\n  db:\n    image: postgres:16\n    container_name: csb-postgres\n    environment:\n      POSTGRES_USER: cs_user\n      POSTGRES_PASSWORD: cs_pass\n      POSTGRES_DB: cs_app\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n    ports:\n      - \"5432:5432\"\n    restart: unless-stopped\n    healthcheck:\n      test: [\"CMD-SHELL\", \"pg_isready -U cs_user -d cs_app\"]\n      interval: 5s\n      timeout: 3s\n      retries: 10\n\n  backend:\n    build: ./backend\n    container_name: csb-backend\n    env_file:\n      - ./backend/.env\n    volumes:\n      - ./backend:/app\n    ports:\n      - \"8000:8000\"\n    depends_on:\n      db:\n        condition: service_healthy\n    restart: unless-stopped\n\n  frontend:\n    build:\n      context: ./frontend\n      # ⚠️ Next.js の public 環境変数は「ビルド時」に注入\n      args:\n        NEXT_PUBLIC_API_BASE: http://backend:8000\n    container_name: csb-frontend\n    environment:\n      NODE_ENV: production\n      # 実行時にも保持（サーバーコンポーネント等で使用）\n      NEXT_PUBLIC_API_BASE: http://backend:8000\n    ports:\n      - \"3000:3000\"\n    depends_on:\n      - backend\n    restart: unless-stopped\n\nvolumes:\n  pgdata:"
          }
        ]
      },
      {
        "id": "run-docker",
        "title": "コンテナの起動",
        "content": [
          {
            "type": "p",
            "text": "すべての設定が完了したら、プロジェクトのルート（`~/code-share/`）で以下を実行してコンテナを起動します。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "cd ~/code-share\nsudo docker-compose up -d --build"
          },
          {
            "type": "p",
            "text": "これでフロントエンド（Next.js）、バックエンド（FastAPI）、データベース（PostgreSQL）の3つがDockerで連携して起動します。"
          },
          {
            "type": "img",
            "src": "/images/frontend-8.png",
            "alt": "sudo docker-compose up -d --buildのコマンドを実行",
            "caption": "sudo docker-compose up -d --buildのコマンドを実行"
          },
        ]
      },
      {
        "id": "open-security-group",
        "title": "セキュリティグループのポート開放",
        "content": [
          {
            "type": "p",
            "text": "Dockerでバックエンドやフロントエンドを起動した後、外部からアクセスできるようにするには、EC2インスタンスのセキュリティグループでポートを開放する必要があります。"
          },
          {
            "type": "ul",
            "items": [
              "AWSコンソールにログイン → EC2 → Instances（インスタンス一覧）",
              "対象インスタンスを選択 → Security → Security groups（セキュリティグループ）",
              "Inbound rules（インバウンドルール） → Edit inbound rules（編集）",
              "Add rule（ルール追加）で以下の設定を追加："
            ]
          },
          {
            "type": "img",
            "src": "/images/frontend-9.png",
            "alt": "対象インスタンスを選択 → Security → Security groups（セキュリティグループ）",
            "caption": "対象インスタンスを選択 → Security → Security groups（セキュリティグループ）"
          },
          {
            "type": "img",
            "src": "/images/frontend-10.png",
            "alt": "Inbound rules（インバウンドルール） → Edit inbound rules（編集）",
            "caption": "Inbound rules（インバウンドルール） → Edit inbound rules（編集）"
          },
          {
            "type": "ul",
            "items": [
              "Type: Custom TCP",
              "Port range: 8000（※フロントエンド用に3000も追加することを推奨）",
              "Source: My IP（開発中は自分のグローバルIPを指定。0.0.0.0/0は避ける）"
            ]
          },
          {
            "type": "img",
            "src": "/images/frontend-11.png",
            "alt": "Port range: 8000（※フロントエンド用に3000も追加することを推奨）",
            "caption": "Port range: 8000（※フロントエンド用に3000も追加することを推奨）"
          },
          {
            "type": "p",
            "text": "設定を保存した後、ポートが正しく開放されているか確認します。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "curl http://<あなたのパブリックIP>:8000/health"
          },
          {
            "type": "p",
            "text": "次のようなレスポンスが返れば成功です。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "json",
            "code": "{\"status\": \"ok\"}"
          },
          {
            "type": "img",
            "src": "/images/frontend-12.png",
            "alt": "http://<あなたのパブリックIP>:8000/healthのレスボンスを確認する",
            "caption": "http://<あなたのパブリックIP>:8000/healthのレスボンスを確認する"
          },
          {
            "type": "img",
            "src": "/images/frontend-13.png",
            "alt": "http://<あなたのパブリックIP>:8000のレスボンスを確認する",
            "caption": "http://<あなたのパブリックIP>:8000のレスボンスを確認する"
          },
          {
            "type": "img",
            "src": "/images/frontend-14.png",
            "alt": "http://<あなたのパブリックIP>:8000/notesのレスボンスを確認する",
            "caption": "http://<あなたのパブリックIP>:8000/notesのレスボンスを確認する"
          },

        ]
      }      
    ]
  },
  {
    "key": "frontend-env-setup",
    "title": "フロントエンド環境変数設定と認証ページ構築",
    "lessons": [
      {
        "id": "set-env-local",
        "title": ".env.localの設定（ブラウザ用）",
        "content": [
          {
            "type": "p",
            "text": "フロントエンドからバックエンドAPIにアクセスするために、Next.jsプロジェクトの環境変数ファイル `.env.local` を設定します。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "cat > code-share/frontend/.env.local << 'EOF'\nNEXT_PUBLIC_API_BASE=http://54.250.207.1:8000\nEOF"
          },
          {
            "type": "p",
            "text": "`NEXT_PUBLIC_*` で始まる環境変数は、ブラウザ用のバンドルに含まれます。そのため `localhost` ではなく、EC2のグローバルIPを使用してください。"
          }
        ]
      },
      {
        "id": "update-compose-env",
        "title": "docker-compose.ymlの環境変数を同期",
        "content": [
          {
            "type": "p",
            "text": "Next.jsのビルド時と実行時で同じAPIエンドポイントを使うために、`docker-compose.yml` の `frontend` サービスに指定する環境変数をグローバルIPに変更します。"
          },
          {
            "type": "ul",
            "items": [
              "args 内の `NEXT_PUBLIC_API_BASE: http://backend:8000` を以下に変更：",
              "NEXT_PUBLIC_API_BASE: \"http://<あなたのパブリックIP>:8000\"  # ブラウザから直接アクセス可能なURL",
              "INTERNAL_API_BASE: \"http://backend:8000\"          # コンテナ内部通信用"
            ]
          }
        ]
      },
      {
        "id": "create-homepage",
        "title": "テスト用ページの作成",
        "content": [
          {
            "type": "p",
            "text": "まず動作確認のため、Next.jsのルートページを作成し、バックエンドの `/health` エンドポイントと通信できるかを確認します。"
          },
          {
            "type": "code",
            "filename": "src/app/page.tsx",
            "lang": "typescript",
            "code": "export default async function HomePage() {\n  const apiBase = process.env.NEXT_PUBLIC_API_BASE!;\n  let ok = \"unknown\";\n\n  try {\n    const res = await fetch(`${apiBase}/health`, { cache: \"no-store\" });\n    ok = res.ok ? \"ok\" : `HTTP ${res.status}`;\n  } catch (e: unknown) {\n    if (e instanceof Error) {\n      ok = `error: ${e.message}`;\n    } else {\n      ok = \"unknown error\";\n    }\n  }\n\n  return (\n    <main style={{ maxWidth: 720, margin: \"40px auto\", padding: \"0 16px\" }}>\n      <h1>Code Share Frontend</h1>\n      <p>Backend: {apiBase}</p>\n      <p>Health: {ok}</p>\n    </main>\n  );\n}"
          },
          {
            "type": "p",
            "text": "ファイルを保存したら再度ビルドを行い、ブラウザで `http://<あなたのパブリックIP>:3000` にアクセスします。以下のように表示されれば成功です："
          },
          {
            "type": "code",
            "filename": "output",
            "lang": "text",
            "code": "Backend: http://<あなたのパブリックIP>:8000\nHealth: ok"
          },
          {
            "type": "img",
            "src": "/images/frontend-16.png",
            "alt": "http://<あなたのパブリックIP>:3000の確認",
            "caption": "http://<あなたのパブリックIP>:3000の確認"
          },
        ]
      },
      {
        "id": "create-auth-pages",
        "title": "ログイン・登録ページの作成",
        "content": [
          {
            "type": "p",
            "text": "Next.jsの `src/app/` ディレクトリに以下の4ページを作成します："
          },
          {
            "type": "ul",
            "items": [
              "src/app/login/page.tsx",
              "src/app/register/page.tsx",
              "src/app/notes/page.tsx",
              "src/app/notes/new/page.tsx"
            ]
          },
          {
            "type": "p",
            "text": "まず `src/app/register/page.tsx` の内容を以下のように作成します。"
          },
          {
            "type": "code",
            "filename": "src/app/register/page.tsx",
            "lang": "typescript",
            "code": "'use client';\n\nimport { useState } from 'react';\nimport { useRouter } from 'next/navigation';\nimport { apiRequest } from '@/lib/api';\n\nexport default function RegisterPage() {\n  const router = useRouter();\n  const [email, setEmail] = useState('');\n  const [password, setPassword] = useState('');\n  const [message, setMessage] = useState('');\n\n  async function handleRegister() {\n    try {\n      const data = await apiRequest<{ access_token: string }>(\n        '/auth/register',\n        'POST',\n        { email, password }\n      );\n\n      localStorage.setItem('token', data.access_token);\n      setMessage('登録成功。ノート一覧に移動中...');\n      router.push('/notes');\n    } catch (err: unknown) {\n      setMessage('登録失敗。メールまたはパスワードが既に使用されている可能性があります。');\n      console.error(err);\n    }\n  }\n\n  return (\n    <main style={{ maxWidth: 400, margin: '40px auto', padding: '0 16px' }}>\n      <h1>登録</h1>\n      <input\n        type=\"email\"\n        placeholder=\"Email\"\n        value={email}\n        onChange={(e) => setEmail(e.target.value)}\n        style={{ display: 'block', marginBottom: 12, width: '100%' }}\n      />\n      <input\n        type=\"password\"\n        placeholder=\"パスワード\"\n        value={password}\n        onChange={(e) => setPassword(e.target.value)}\n        style={{ display: 'block', marginBottom: 12, width: '100%' }}\n      />\n      <button onClick={handleRegister} style={{ width: '100%' }}>\n        登録\n      </button>\n      <p>{message}</p>\n    </main>\n  );\n}"
          },
          {
            "type": "p",
            "text": "次に `src/app/login/page.tsx` の内容を以下のように作成します。"
          },
          {
            "type": "code",
            "filename": "src/app/login/page.tsx",
            "lang": "typescript",
            "code": "'use client';\n\nimport { useState } from 'react';\nimport { useRouter } from 'next/navigation';\nimport { apiRequest } from '@/lib/api';\n\nexport default function LoginPage() {\n  const router = useRouter();\n  const [email, setEmail] = useState('');\n  const [password, setPassword] = useState('');\n  const [message, setMessage] = useState('');\n\n  async function handleLogin() {\n    try {\n      const data = await apiRequest<{ access_token: string }>(\n        '/auth/login',\n        'POST',\n        { email, password }\n      );\n\n      localStorage.setItem('token', data.access_token);\n      setMessage('ログイン成功。ノート一覧に移動中...');\n      router.push('/notes');\n    } catch (err: unknown) {\n      setMessage('ログイン失敗。メールまたはパスワードを確認してください。');\n      console.error(err);\n    }\n  }\n\n  return (\n    <main style={{ maxWidth: 400, margin: '40px auto', padding: '0 16px' }}>\n      <h1>ログイン</h1>\n      <input\n        type=\"email\"\n        placeholder=\"Email\"\n        value={email}\n        onChange={(e) => setEmail(e.target.value)}\n        style={{ display: 'block', marginBottom: 12, width: '100%' }}\n      />\n      <input\n        type=\"password\"\n        placeholder=\"パスワード\"\n        value={password}\n        onChange={(e) => setPassword(e.target.value)}\n        style={{ display: 'block', marginBottom: 12, width: '100%' }}\n      />\n      <button onClick={handleLogin} style={{ width: '100%' }}>\n        ログイン\n      </button>\n      <p>{message}</p>\n    </main>\n  );\n}"
          }
        ]
      },
      {
        "id": "update-api-lib",
        "title": "APIユーティリティファイルの修正",
        "content": [
          {
            "type": "p",
            "text": "`src/lib/api.ts` を以下の内容で上書きします。ブラウザ環境とサーバー環境で異なるAPIベースURLを自動的に切り替えられるようにします。"
          },
          {
            "type": "code",
            "filename": "src/lib/api.ts",
            "lang": "typescript",
            "code": "/**\n * 環境区分：\n * - PUBLIC_API_BASE：ブラウザアクセス用（例: http://54.250.xxx.xxx:8000）\n * - INTERNAL_API_BASE：コンテナ / SSR 内部呼び出し用\n */\nexport const PUBLIC_API_BASE =\n  process.env.NEXT_PUBLIC_API_BASE ?? \"http://localhost:8000\";\nexport const INTERNAL_API_BASE =\n  process.env.INTERNAL_API_BASE ?? PUBLIC_API_BASE;\n\nfunction getApiBase(): string {\n  if (typeof window !== \"undefined\") return PUBLIC_API_BASE;\n  return INTERNAL_API_BASE;\n}\n\nasync function request<T = unknown>(\n  path: string,\n  init: RequestInit = {},\n  token?: string\n): Promise<T> {\n  const base = getApiBase();\n\n  const headers: Record<string, string> = {\n    \"Content-Type\": \"application/json\",\n    ...(init.headers as Record<string, string> | undefined),\n    ...(token ? { Authorization: `Bearer ${token}` } : {}),\n  };\n\n  const res = await fetch(`${base}${path}`, {\n    ...init,\n    headers,\n    cache: \"no-store\",\n  });\n\n  if (!res.ok) {\n    const text = await res.text().catch(() => \"\");\n    throw new Error(text || `HTTP ${res.status}`);\n  }\n\n  return (await res.json()) as T;\n}\n\nexport const api = {\n  get: <T = unknown>(path: string, token?: string) =>\n    request<T>(path, { method: \"GET\" }, token),\n  post: <T = unknown>(path: string, body: Record<string, unknown>, token?: string) =>\n    request<T>(path, { method: \"POST\", body: JSON.stringify(body) }, token),\n};\n\nexport async function apiRequest<T = unknown>(\n  path: string,\n  method: string = \"GET\",\n  body?: Record<string, unknown>,\n  token?: string\n): Promise<T> {\n  const headers: Record<string, string> = { \"Content-Type\": \"application/json\" };\n  if (token) headers.Authorization = `Bearer ${token}`;\n\n  const res = await fetch(`${getApiBase()}${path}`, {\n    method,\n    headers,\n    body: body ? JSON.stringify(body) : undefined,\n    cache: \"no-store\",\n  });\n\n  if (!res.ok) {\n    const text = await res.text();\n    throw new Error(`HTTP ${res.status}: ${text}`);\n  }\n\n  return (await res.json()) as T;\n}"
          }
        ]
      },
      {
        "id": "rebuild-test",
        "title": "再ビルドと動作確認",
        "content": [
          {
            "type": "p",
            "text": "設定後、フロントエンドを再度ビルドして起動します。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "sudo docker-compose up -d --build frontend"
          },
          {
            "type": "p",
            "text": "次のURLで動作を確認します："
          },
          {
            "type": "ul",
            "items": [
              "http://<あなたのパブリックIP>:3000/register",
              "http://<あなたのパブリックIP>:3000/login"
            ]
          },
        ]
      }
    ]
  },
  {
    "key": "notes-new-and-ui-polish",
    "title": "スタイル美化",
    "lessons": [
      {
        "id": "style-login",
        "title": "src/app/login/page.tsx の美化",
        "content": [
          {
            "type": "p",
            "text": "以下のコードをそのまま適用して、ログインページのUIを美しく整えます（内容は変更せずにそのまま使用してください）。"
          },
          {
            "type": "code",
            "filename": "src/app/login/page.tsx",
            "lang": "typescript",
            "code": "'use client';\n\nimport { useState, type ReactElement } from 'react';\nimport { useRouter } from 'next/navigation';\nimport { apiRequest } from '@/lib/api';\n\nexport default function LoginPage(): ReactElement {\n  const router = useRouter();\n  const [email, setEmail] = useState<string>('');\n  const [password, setPassword] = useState<string>('');\n  const [message, setMessage] = useState<string>('');\n  const [loading, setLoading] = useState<boolean>(false);\n\n  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {\n    e.preventDefault();\n    setLoading(true);\n    setMessage('正在登录…');\n    try {\n      const data = await apiRequest<{ access_token: string }>('/auth/login', 'POST', { email, password });\n      localStorage.setItem('token', data.access_token);\n      setMessage('登录成功，正在跳转…');\n      router.push('/notes');\n    } catch (err: unknown) {\n      setMessage(err instanceof Error ? `登录失败：${err.message}` : '登录失败：未知错误');\n    } finally {\n      setLoading(false);\n    }\n  }\n\n  return (\n    <main className=\"mx-auto my-10 max-w-md px-4\">\n      <div className=\"rounded-2xl border border-neutral-200/70 p-6 shadow-sm\">\n        <h1 className=\"mb-6 text-2xl font-semibold\">登录</h1>\n        <form onSubmit={handleSubmit} className=\"space-y-4\">\n          <div>\n            <label className=\"mb-1 block text-sm\">邮箱</label>\n            <input\n              type=\"email\"\n              value={email}\n              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}\n              required\n              className=\"w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500\"\n              placeholder=\"you@example.com\"\n              autoComplete=\"email\"\n            />\n          </div>\n          <div>\n            <label className=\"mb-1 block text-sm\">密码</label>\n            <input\n              type=\"password\"\n              value={password}\n              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}\n              required\n              className=\"w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500\"\n              placeholder=\"••••••••\"\n              autoComplete=\"current-password\"\n            />\n          </div>\n\n          <button\n            type=\"submit\"\n            disabled={loading}\n            className=\"w-full rounded-xl border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60\"\n            aria-busy={loading}\n          >\n            {loading ? '登录中…' : '登录'}\n          </button>\n        </form>\n\n        <p className=\"mt-4 text-sm text-neutral-600\">{message}</p>\n\n        <div className=\"mt-6 text-sm\">\n          还没有账号？{' '}\n          <button\n            className=\"text-indigo-600 underline underline-offset-2 hover:text-indigo-700\"\n            onClick={() => router.push('/register')}\n          >\n            去注册\n          </button>\n        </div>\n      </div>\n    </main>\n  );\n}\n"
          },
          {
            "type": "img",
            "src": "/images/frontend-17.png",
            "alt": "src/app/login/page.tsx の美化",
            "caption": "src/app/login/page.tsx の美化"
          },
        ]
      },
      {
        "id": "style-register",
        "title": "src/app/register/page.tsx の美化",
        "content": [
          {
            "type": "p",
            "text": "以下のコードをそのまま適用して、登録ページのUIを美しく整えます（内容は変更せずにそのまま使用してください）。"
          },
          {
            "type": "code",
            "filename": "src/app/register/page.tsx",
            "lang": "typescript",
            "code": "'use client';\n\nimport { useState, type ReactElement } from 'react';\nimport { useRouter } from 'next/navigation';\nimport { apiRequest } from '@/lib/api';\n\nexport default function RegisterPage(): ReactElement {\n  const router = useRouter();\n  const [email, setEmail] = useState<string>('');\n  const [password, setPassword] = useState<string>('');\n  const [message, setMessage] = useState<string>('');\n  const [loading, setLoading] = useState<boolean>(false);\n\n  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {\n    e.preventDefault();\n    setLoading(true);\n    setMessage('正在注册中…');\n    try {\n      const data = await apiRequest<{ access_token: string }>('/auth/register', 'POST', { email, password });\n      localStorage.setItem('token', data.access_token);\n      setMessage('注册成功，正在跳转…');\n      router.push('/notes');\n    } catch (err: unknown) {\n      setMessage(err instanceof Error ? `注册失败：${err.message}` : '注册失败：未知错误');\n    } finally {\n      setLoading(false);\n    }\n  }\n\n  return (\n    <main className=\"mx-auto my-10 max-w-md px-4\">\n      <div className=\"rounded-2xl border border-neutral-200/70 p-6 shadow-sm\">\n        <h1 className=\"mb-6 text-2xl font-semibold\">注册账号</h1>\n        <form onSubmit={handleSubmit} className=\"space-y-4\">\n          <div>\n            <label className=\"mb-1 block text-sm\">邮箱</label>\n            <input\n              type=\"email\"\n              value={email}\n              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}\n              required\n              className=\"w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500\"\n              placeholder=\"you@example.com\"\n              autoComplete=\"email\"\n            />\n          </div>\n          <div>\n            <label className=\"mb-1 block text-sm\">密码</label>\n            <input\n              type=\"password\"\n              value={password}\n              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}\n              required\n              className=\"w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500\"\n              placeholder=\"至少 8 位\"\n              autoComplete=\"new-password\"\n            />\n          </div>\n\n          <button\n            type=\"submit\"\n            disabled={loading}\n            className=\"w-full rounded-xl border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60\"\n            aria-busy={loading}\n          >\n            {loading ? '注册中…' : '注册'}\n          </button>\n        </form>\n\n        <p className=\"mt-4 text-sm text-neutral-600\">{message}</p>\n\n        <div className=\"mt-6 text-sm\">\n          已有账号？{' '}\n          <button\n            className=\"text-indigo-600 underline underline-offset-2 hover:text-indigo-700\"\n            onClick={() => router.push('/login')}\n          >\n            去登录\n          </button>\n        </div>\n      </div>\n    </main>\n  );\n}\n"
          },
          {
            "type": "img",
            "src": "/images/frontend-20.png",
            "alt": "src/app/register/page.tsx の美化",
            "caption": "src/app/register/page.tsx の美化"
          },
        ]
      }
    ]
  },
  {
    "key": "notes-pages-build",
    "title": "ノート一覧・新規作成ページの実装",
    "lessons": [
      {
        "id": "notes-new-page",
        "title": "新規ノート作成ページ（/notes/new）の実装",
        "content": [
          {
            "type": "p",
            "text": "以下をファイルに保存してください：src/app/notes/new/page.tsx"
          },
          {
            "type": "code",
            "filename": "src/app/notes/new/page.tsx",
            "lang": "typescript",
            "code": "'use client';\n\nimport React, { useEffect, useState, type ReactElement } from 'react';\nimport { useRouter } from 'next/navigation';\n\n/** ---- バックエンドの NoteCreate に合わせた型 ----\n * title, project_type, frontend_stack, backend_stack は必須\n * description は任意\n */\ntype NoteCreate = {\n  title: string;\n  project_type: string;\n  frontend_stack: string;\n  backend_stack: string;\n  description?: string;\n};\n\n/** 認証付き POST /notes */\nasync function createNoteWithToken(\n  baseURL: string,\n  token: string,\n  payload: NoteCreate\n): Promise<void> {\n  const res = await fetch(`${baseURL}/notes`, {\n    method: 'POST',\n    headers: {\n      'Authorization': `Bearer ${token}`,\n      'Content-Type': 'application/json',\n    },\n    body: JSON.stringify(payload),\n  });\n\n  if (!res.ok) {\n    const text = await res.text();\n    throw new Error(`${res.status} ${res.statusText} - ${text}`);\n  }\n}\n\nexport default function NewNotePage(): ReactElement {\n  const router = useRouter();\n\n  // フォーム状態\n  const [title, setTitle] = useState<string>('');\n  const [projectType, setProjectType] = useState<string>('静的'); // 初期値はお好みで\n  const [frontendStack, setFrontendStack] = useState<string>('TypeScript, Next.js');\n  const [backendStack, setBackendStack] = useState<string>('Python, FastAPI');\n  const [description, setDescription] = useState<string>('');\n\n  // UI 状態\n  const [loading, setLoading] = useState<boolean>(false);\n  const [message, setMessage] = useState<string>('');\n\n  // トークン未所持ならログインへ\n  useEffect(() => {\n    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;\n    if (!token) {\n      router.replace('/login');\n    }\n  }, [router]);\n\n  function validate(): string | null {\n    if (title.trim().length < 2) return 'タイトルは2文字以上で入力してください。';\n    if (projectType.trim() === '') return '種別を選択してください。';\n    if (frontendStack.trim() === '') return 'フロントエンド技術スタックを入力してください。';\n    if (backendStack.trim() === '') return 'バックエンド技術スタックを入力してください。';\n    return null;\n  }\n\n  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {\n    e.preventDefault();\n    const err = validate();\n    if (err) {\n      setMessage(err);\n      return;\n    }\n\n    const token = localStorage.getItem('token');\n    if (!token) {\n      router.replace('/login');\n      return;\n    }\n\n    const base = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8000';\n    const payload: NoteCreate = {\n      title: title.trim(),\n      project_type: projectType.trim(),\n      frontend_stack: frontendStack.trim(),\n      backend_stack: backendStack.trim(),\n      description: description.trim() === '' ? undefined : description.trim(),\n    };\n\n    setLoading(true);\n    setMessage('投稿中…');\n\n    try {\n      await createNoteWithToken(base, token, payload);\n      setMessage('作成に成功しました。一覧へ移動します…');\n      router.push('/notes');\n    } catch (err: unknown) {\n      if (err instanceof Error) {\n        // 401 ならログインへ\n        if (err.message.startsWith('401')) {\n          localStorage.removeItem('token');\n          router.replace('/login');\n          return;\n        }\n        setMessage(`作成に失敗しました：${err.message}`);\n      } else {\n        setMessage('作成に失敗しました：未知のエラー');\n      }\n    } finally {\n      setLoading(false);\n    }\n  }\n\n  return (\n    <main className=\"mx-auto my-10 max-w-2xl px-4\">\n      <div className=\"rounded-2xl border border-neutral-200/70 p-6 shadow-sm\">\n        <header className=\"mb-6 flex items-center justify-between\">\n          <h1 className=\"text-2xl font-semibold\">新規ノート作成</h1>\n          <div className=\"flex gap-2\">\n            <button\n              className=\"rounded-xl border px-3 py-2 hover:bg-neutral-50\"\n              onClick={() => router.push('/notes')}\n            >\n              一覧へ戻る\n            </button>\n          </div>\n        </header>\n\n        <form onSubmit={handleSubmit} className=\"space-y-5\">\n          {/* タイトル */}\n          <div>\n            <label className=\"mb-1 block text-sm\">タイトル <span className=\"text-red-600\">*</span></label>\n            <input\n              type=\"text\"\n              value={title}\n              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}\n              required\n              minLength={2}\n              placeholder=\"例）ポートフォリオ用ミニブログ\"\n              className=\"w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500\"\n            />\n          </div>\n\n          {/* 種別 */}\n          <div>\n            <label className=\"mb-1 block text-sm\">種別 <span className=\"text-red-600\">*</span></label>\n            <select\n              value={projectType}\n              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setProjectType(e.target.value)}\n              className=\"w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500\"\n            >\n              <option value=\"静的\">静的（Static）</option>\n              <option value=\"動的\">動的（Dynamic）</option>\n              <option value=\"Web API\">Web API</option>\n              <option value=\"フルスタック\">フルスタック</option>\n              <option value=\"その他\">その他</option>\n            </select>\n            <p className=\"mt-1 text-xs text-neutral-500\">\n              バックエンド無しの静的サイト、API 中心のサービス、フルスタック等から選択してください（自由に編集可）。\n            </p>\n          </div>\n\n          {/* フロントエンド技術スタック */}\n          <div>\n            <label className=\"mb-1 block text-sm\">フロントエンド技術スタック <span className=\"text-red-600\">*</span></label>\n            <input\n              type=\"text\"\n              value={frontendStack}\n              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFrontendStack(e.target.value)}\n              required\n              placeholder=\"例）TypeScript, Next.js, Tailwind CSS\"\n              className=\"w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500\"\n            />\n            <p className=\"mt-1 text-xs text-neutral-500\">カンマ区切りで複数入力できます。</p>\n          </div>\n\n          {/* バックエンド技術スタック */}\n          <div>\n            <label className=\"mb-1 block text-sm\">バックエンド技術スタック <span className=\"text-red-600\">*</span></label>\n            <input\n              type=\"text\"\n              value={backendStack}\n              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBackendStack(e.target.value)}\n              required\n              placeholder=\"例）Python, FastAPI, PostgreSQL\"\n              className=\"w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500\"\n            />\n            <p className=\"mt-1 text-xs text-neutral-500\">こちらもカンマ区切りで入力可能です。</p>\n          </div>\n\n          {/* 説明（任意） */}\n          <div>\n            <label className=\"mb-1 block text-sm\">説明（任意）</label>\n            <textarea\n              value={description}\n              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}\n              rows={5}\n              placeholder=\"プロジェクトの概要、目的、学んだ点などを記入してください。\"\n              className=\"w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500\"\n            />\n          </div>\n\n          {/* ボタン行 */}\n          <div className=\"flex items-center justify-end gap-2\">\n            <button\n              type=\"button\"\n              className=\"rounded-xl border px-4 py-2 hover:bg-neutral-50\"\n              onClick={() => router.push('/notes')}\n            >\n              キャンセル\n            </button>\n            <button\n              type=\"submit\"\n              disabled={loading}\n              className=\"rounded-xl border border-transparent bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60\"\n              aria-busy={loading}\n            >\n              {loading ? '作成中…' : '作成する'}\n            </button>\n          </div>\n\n          {/* メッセージ */}\n          {message && <p className=\"text-sm text-neutral-600\">{message}</p>}\n        </form>\n      </div>\n    </main>\n  );\n}\n"
          },
          {
            "type": "img",
            "src": "/images/frontend-22.png",
            "alt": "新規ノート作成ページ（/notes/new）の実装",
            "caption": "新規ノート作成ページ（/notes/new）の実装"
          },

        ]
      },
      {
        "id": "notes-index-page",
        "title": "ノート一覧ページ（/notes）の実装",
        "content": [
          {
            "type": "p",
            "text": "以下をファイルに保存してください：src/app/notes/page.tsx"
          },
          {
            "type": "code",
            "filename": "src/app/notes/page.tsx",
            "lang": "typescript",
            "code": "'use client';\n\nimport React, { useEffect, useMemo, useState, type ReactElement } from 'react';\nimport { useRouter } from 'next/navigation';\n\n/** ====== 後端スキーマに合わせた型 ======\n * FastAPI の NoteOut をフロント側で表現\n */\ntype Note = {\n  id: number;\n  owner_id: number;\n  title: string;\n  project_type: string;\n  frontend_stack: string;\n  backend_stack: string;\n  description?: string;\n};\n\ntype FetchNotesResponse = Note[] | { items: Note[] };\n\n/** ====== 型ガード・正規化ユーティリティ ====== */\nfunction isRecord(x: unknown): x is Record<string, unknown> {\n  return typeof x === 'object' && x !== null;\n}\n\nfunction pickString(obj: Record<string, unknown>, keys: string[]): string | undefined {\n  for (const k of keys) {\n    const v = obj[k];\n    if (typeof v === 'string' && v.trim() !== '') return v;\n  }\n  return undefined;\n}\n\nfunction pickNumber(obj: Record<string, unknown>, keys: string[]): number | undefined {\n  for (const k of keys) {\n    const v = obj[k];\n    if (typeof v === 'number') return v;\n    if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v);\n  }\n  return undefined;\n}\n\nfunction hasItemsArray(x: unknown): x is { items: unknown[] } {\n  if (!isRecord(x)) return false;\n  return Array.isArray((x as Record<string, unknown>).items);\n}\n\n/** 後端が想定スキーマで返す/多少ズレても吸収できるように正規化 */\nfunction normalizeNote(raw: unknown): Note | null {\n  if (!isRecord(raw)) return null;\n\n  const id = pickNumber(raw, ['id', 'note_id']) ?? Math.floor(Math.random() * 1e9);\n  const owner_id = pickNumber(raw, ['owner_id', 'ownerId']) ?? 0;\n\n  const title =\n    pickString(raw, ['title', 'name', 'subject']) ?? '(無題)';\n  const project_type =\n    pickString(raw, ['project_type', 'projectType', 'type']) ?? '不明';\n  const frontend_stack =\n    pickString(raw, ['frontend_stack', 'frontendStack', 'frontend']) ?? '未指定';\n  const backend_stack =\n    pickString(raw, ['backend_stack', 'backendStack', 'backend']) ?? '未指定';\n  const description =\n    pickString(raw, ['description', 'content', 'body', 'text', 'detail', 'message']);\n\n  return { id, owner_id, title, project_type, frontend_stack, backend_stack, description };\n}\n\n/** ====== API ====== */\nasync function fetchNotesWithToken(baseURL: string, token: string): Promise<Note[]> {\n  const res = await fetch(`${baseURL}/notes`, {\n    method: 'GET',\n    headers: { Authorization: `Bearer ${token}` },\n  });\n  if (!res.ok) {\n    const text = await res.text();\n    throw new Error(`${res.status} ${res.statusText} - ${text}`);\n  }\n\n  const data: unknown = await res.json();\n  const arr: unknown[] = Array.isArray(data)\n    ? data\n    : hasItemsArray(data)\n      ? (data as { items: unknown[] }).items\n      : [];\n\n  const normalized: Note[] = [];\n  for (const item of arr) {\n    const n = normalizeNote(item);\n    if (n) normalized.push(n);\n  }\n  return normalized;\n}\n\n/** ====== 表示用ヘルパ ====== */\nfunction badgeColorByProjectType(t: string): string {\n  const key = t.toLowerCase();\n  if (key.includes('静') || key.includes('static')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';\n  if (key.includes('動') || key.includes('dynamic')) return 'bg-sky-100 text-sky-700 border-sky-200';\n  return 'bg-neutral-100 text-neutral-700 border-neutral-200';\n}\n\nfunction splitStack(s: string): string[] {\n  return s\n    .split(/[\\,\\|/、\\s]+/g)\n    .map((x) => x.trim())\n    .filter((x) => x.length > 0);\n}\n\n/** ====== ページ本体 ====== */\nexport default function NotesPage(): ReactElement {\n  const router = useRouter();\n  const [notes, setNotes] = useState<Note[]>([]);\n  const [loading, setLoading] = useState<boolean>(true);\n  const [error, setError] = useState<string | null>(null);\n  const [q, setQ] = useState<string>('');\n\n  useEffect(() => {\n    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;\n    if (!token) {\n      router.replace('/login');\n      return;\n    }\n\n    const base = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8000';\n\n    (async () => {\n      try {\n        const data = await fetchNotesWithToken(base, token);\n        setNotes(data);\n      } catch (err: unknown) {\n        if (err instanceof Error && err.message.startsWith('401')) {\n          localStorage.removeItem('token');\n          router.replace('/login');\n          return;\n        }\n        setError(err instanceof Error ? err.message : '未知のエラー');\n      } finally {\n        setLoading(false);\n      }\n    })();\n  }, [router]);\n\n  const filtered = useMemo<Note[]>(\n    () =>\n      notes.filter((n) => {\n        const k = q.toLowerCase().trim();\n        if (k === '') return true;\n        return (\n          n.title.toLowerCase().includes(k) ||\n          (n.description?.toLowerCase().includes(k) ?? false) ||\n          n.frontend_stack.toLowerCase().includes(k) ||\n          n.backend_stack.toLowerCase().includes(k) ||\n          n.project_type.toLowerCase().includes(k)\n        );\n      }),\n    [notes, q]\n  );\n\n  if (loading) return <div className=\"p-6 text-lg\">読み込み中…</div>;\n\n  if (error) {\n    return (\n      <div className=\"p-6\">\n        <h1 className=\"mb-3 text-xl font-semibold\">ノート一覧</h1>\n        <p className=\"text-red-600\">エラー: {error}</p>\n        <button\n          className=\"mt-4 rounded-xl border px-3 py-2 hover:bg-neutral-50\"\n          onClick={() => router.push('/login')}\n        >\n          ログインへ\n        </button>\n      </div>\n    );\n  }\n\n  return (\n    <div className=\"mx-auto max-w-5xl p-6\">\n      {/* ヘッダー */}\n      <header className=\"mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between\">\n        <h1 className=\"text-2xl font-semibold\">ノート一覧</h1>\n        <div className=\"flex flex-col gap-3 sm:flex-row sm:items-center\">\n          <div className=\"relative\">\n            <input\n              value={q}\n              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}\n              placeholder=\"タイトル・説明・技術スタックで検索…\"\n              className=\"w-full rounded-xl border border-neutral-300 px-3 py-2 pr-8 outline-none focus:ring-2 focus:ring-indigo-500 sm:w-80\"\n            />\n            {q !== '' && (\n              <button\n                aria-label=\"クリア\"\n                className=\"absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-500 hover:bg-neutral-100\"\n                onClick={() => setQ('')}\n              >\n                ×\n              </button>\n            )}\n          </div>\n          <div className=\"flex gap-2\">\n            <button\n              className=\"rounded-xl border px-3 py-2 hover:bg-neutral-50\"\n              onClick={() => router.push('/')}\n            >\n              ホーム\n            </button>\n            <button\n              className=\"rounded-xl border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700\"\n              onClick={() => router.push('/notes/new')}\n              title=\"※ 後で /notes/new ページを作成して投稿できるようにできます\"\n            >\n              新規ノート\n            </button>\n            <button\n              className=\"rounded-xl border px-3 py-2 hover:bg-neutral-50\"\n              onClick={() => {\n                localStorage.removeItem('token');\n                router.replace('/login');\n              }}\n            >\n              ログアウト\n            </button>\n          </div>\n        </div>\n      </header>\n\n      {/* リスト */}\n      {filtered.length === 0 ? (\n        <p className=\"rounded-xl border border-dashed p-6 text-neutral-600\">\n          条件に一致するノートがありません{q ? '（検索条件あり）' : ''}。\n        </p>\n      ) : (\n        <ul className=\"grid grid-cols-1 gap-4 sm:grid-cols-2\">\n          {filtered.map((n) => {\n            const fe = splitStack(n.frontend_stack);\n            const be = splitStack(n.backend_stack);\n            const badgeCls = `inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${badgeColorByProjectType(\n              n.project_type\n            )}`;\n\n            return (\n              <li\n                key={n.id}\n                className=\"rounded-2xl border border-neutral-200/70 p-5 shadow-sm transition hover:shadow-md\"\n              >\n                {/* タイトル＋種別 */}\n                <div className=\"mb-3 flex items-start justify-between gap-3\">\n                  <h2 className=\"text-lg font-semibold leading-snug\">{n.title}</h2>\n                  <span className={badgeCls} title={`owner_id: ${n.owner_id}`}>\n                    {n.project_type}\n                  </span>\n                </div>\n\n                {/* 説明 */}\n                {n.description ? (\n                  <p className=\"whitespace-pre-wrap text-sm text-neutral-700\">\n                    {n.description.length > 180 ? `${n.description.slice(0, 180)}…` : n.description}\n                  </p>\n                ) : (\n                  <p className=\"text-sm text-neutral-500\">（説明なし）</p>\n                )}\n\n                {/* 技術スタック */}\n                <div className=\"mt-4 space-y-2 text-sm\">\n                  <div className=\"flex flex-wrap items-start gap-2\">\n                    <span className=\"shrink-0 rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-700\">\n                      Frontend\n                    </span>\n                    <div className=\"flex flex-wrap gap-2\">\n                      {fe.length > 0 ? (\n                        fe.map((t, i) => (\n                          <span\n                            key={`${n.id}-fe-${i}-${t}`}\n                            className=\"rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700 ring-1 ring-indigo-100\"\n                          >\n                            {t}\n                          </span>\n                        ))\n                      ) : (\n                        <span className=\"text-neutral-500\">未指定</span>\n                      )}\n                    </div>\n                  </div>\n\n                  <div className=\"flex flex-wrap items-start gap-2\">\n                    <span className=\"shrink-0 rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-700\">\n                      Backend\n                    </span>\n                    <div className=\"flex flex-wrap gap-2\">\n                      {be.length > 0 ? (\n                        be.map((t, i) => (\n                          <span\n                            key={`${n.id}-be-${i}-${t}`}\n                            className=\"rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 ring-1 ring-emerald-100\"\n                          >\n                            {t}\n                          </span>\n                        ))\n                      ) : (\n                        <span className=\"text-neutral-500\">未指定</span>\n                      )}\n                    </div>\n                  </div>\n                </div>\n\n                {/* 予備のアクション行（後で詳細ページを作る場合） */}\n                {/* <div className=\"mt-4 text-right\">\n                  <button\n                    className=\"text-sm text-indigo-600 underline underline-offset-2 hover:text-indigo-700\"\n                    onClick={() => router.push(`/notes/${n.id}`)}\n                  >\n                    詳細を見る\n                  </button>\n                </div> */}\n              </li>\n            );\n          })}\n        </ul>\n      )}\n    </div>\n  );\n}\n"
          },
          {
            "type": "img",
            "src": "/images/frontend-21.png",
            "alt": "ノート一覧ページ（/notes）の実装",
            "caption": "ノート一覧ページ（/notes）の実装"
          },
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
            フルスタック開発実践（フロントエンド）
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