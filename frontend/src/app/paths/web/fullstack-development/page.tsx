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
    "key": "backend-docker-install",
    "title": "Dockerのインストールと動作確認",
    "lessons": [
      {
        "id": "install-compose",
        "title": "Docker Composeのインストール",
        "summary": "まずはComposeコマンドを導入して、複数コンテナを一括管理できる環境を整えます。",
        "content": [
          {
            "type": "p",
            "text": "Docker Composeは、複数のサービス（例：FastAPI・PostgreSQL・Redisなど）をまとめて起動・停止できる便利なツールです。Amazon LinuxやCentOSなどの環境では、次の手順で手動インストールします。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "sudo curl -SL https://github.com/docker/compose/releases/download/v2.29.2/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose\nsudo chmod +x /usr/local/bin/docker-compose"
          },
          {
            "type": "p",
            "text": "インストールが完了したら、次のコマンドでバージョンを確認します。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "docker-compose version"
          },
          {
            "type": "ul",
            "items": [
              "バージョンが表示されればOK（例：Docker Compose version v2.29.2）",
              "もし `permission denied` などのエラーが出た場合は `sudo` を付けて再実行",
              "Compose v2では `docker compose` も同義で利用可能"
            ]
          }
        ]
      },
      {
        "id": "install-engine",
        "title": "Docker Engineのインストールと起動",
        "summary": "続いて、Docker本体（Engine）をインストールし、システム起動時に自動起動するよう設定します。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "# インストール（失敗した場合は繰り返し実行してもOK）\nsudo dnf -y install docker\n\n# 起動と自動起動設定\nsudo systemctl enable --now docker"
          },
          {
            "type": "p",
            "text": "Dockerサービスが正常に起動すれば、バックグラウンドで常にコンテナ管理が行える状態になります。"
          }
        ]
      },
      {
        "id": "user-group",
        "title": "一般ユーザーでの利用設定（sudo不要化）",
        "summary": "毎回sudoを付けずにDockerを使えるように、現在のユーザーをdockerグループに追加します。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "sudo usermod -aG docker ec2-user\nnewgrp docker   # グループ変更を即時反映"
          },
          {
            "type": "p",
            "text": "`newgrp docker` によりログアウトせずに権限が反映されます。これで以降は `sudo` なしでDockerコマンドを実行できます。"
          }
        ]
      },
      {
        "id": "verify",
        "title": "動作確認",
        "summary": "インストールと権限設定が終わったら、実際にDockerを動かして確認します。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "docker --version\ndocker ps\ndocker run --rm hello-world"
          },
          {
            "type": "p",
            "text": "最後のコマンドで “Hello from Docker!” が表示されれば、Docker Engineは正常に動作しています。"
          },
          {
            "type": "ul",
            "items": [
              "Docker Engineが正しくインストールされている",
              "Composeコマンド（`docker-compose`）も利用可能",
              "これで `docker-compose up -d` などの操作ができるようになります"
            ]
          },
          {
            "type": "img",
            "src": "/images/backend-1.png",
            "alt": "Docker Composeのインストール",
            "caption": "Docker Composeのインストール(1)"
          },
          {
            "type": "img",
            "src": "/images/backend-2.png",
            "alt": "Docker Composeのインストール-2",
            "caption": "Docker Composeのインストール(2)"
          },
        ]
      },
      {
        "id": "summary1",
        "title": "まとめ：開発基盤の準備完了",
        "summary": "ここまでで、バックエンド開発に必要なDocker環境が整いました。",
        "content": [
          {
            "type": "ul",
            "items": [
              "Docker Engine と Docker Compose の両方を導入",
              "sudo不要の権限設定も完了",
              "“Hello from Docker!” で動作確認済み"
            ]
          },
          {
            "type": "p",
            "text": "これで、FastAPIやPostgreSQLなどのサービスをコンテナで簡単に構築できます。次章では、実際にFastAPIアプリをDocker上で動かす方法を学びましょう。"
          }
        ]
      }
    ]
  },
  {
    "key": "backend-skeleton",
    "title": "バックエンド骨格の構築",
    "lessons": [
      {
        "id": "create-structure",
        "title": "ディレクトリ構成の作成",
        "summary": "FastAPIアプリの基礎フォルダ構成を作ります。",
        "content": [
          {
            "type": "p",
            "text": "まずは、開発ディレクトリ内に `backend` フォルダを作り、その中に `app/api` と `app/core` を用意します。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "mkdir -p ~/code-share/backend/app/{api,core}\ncd ~/code-share"
          },
          {
            "type": "p",
            "text": "これで FastAPI アプリの骨格ディレクトリができました。次は各ファイルをターミナル上で `cat` コマンドを使って作成します。"
          }
        ]
      },
      {
        "id": "dockerfile",
        "title": "Dockerfileの作成",
        "summary": "FastAPIをDocker上で動かすためのDockerfileをターミナルで作成します。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "cat > backend/Dockerfile <<'DOCKER'\nFROM python:3.11-slim\n\nENV PYTHONDONTWRITEBYTECODE=1 \\\n    PYTHONUNBUFFERED=1\n\nWORKDIR /app\n\n# 装最小依赖：FastAPI + Uvicorn + 配置\nRUN pip install --no-cache-dir fastapi uvicorn[standard] pydantic-settings\n\n# 复制源码\nCOPY app ./app\n\nEXPOSE 8000\n\n# 开发期用 --reload，生产再换成多进程方案\nCMD [\"uvicorn\", \"app.main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\", \"--reload\"]\nDOCKER"
          },
          {
            "type": "p",
            "text": "上記を入力後、Enterで改行、Ctrl + D で保存終了します。これでDockerfileが生成されます。"
          }
        ]
      },
      {
        "id": "app-core",
        "title": "設定ファイルの作成（core/config.py）",
        "summary": "Pydantic Settingsを使って設定をまとめます。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "cat > backend/app/core/config.py <<'PY'\nfrom pydantic_settings import BaseSettings\n\nclass Settings(BaseSettings):\n    PROJECT_NAME: str = \"Code Share API\"\n    # 先留好数据库配置位置，后面接 Postgres/SQLAlchemy\n    DATABASE_URL: str = \"postgresql://cs_user:cs_pass@db:5432/cs_app\"\n\nsettings = Settings()\nPY"
          },
          {
            "type": "p",
            "text": "このファイルでは後で環境変数（.env）も読み込めるようになります。"
          }
        ]
      },
      {
        "id": "app-routes",
        "title": "ルーティングファイルの作成（api/routes.py）",
        "summary": "APIのルートを定義するシンプルなサンプルを作ります。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "cat > backend/app/api/routes.py <<'PY'\nfrom fastapi import APIRouter\n\nrouter = APIRouter()\n\n@router.get(\"/health\")\ndef health():\n    return {\"status\": \"ok\"}\n\n@router.get(\"/notes\")\ndef list_notes():\n    return [\n        {\"id\": 1, \"title\": \"入门项目：Todo App\", \"type\": \"静态\", \"frontend\": \"Next.js(TypeScript)\", \"backend\": \"—\"},\n        {\"id\": 2, \"title\": \"博客系统\", \"type\": \"动态\", \"frontend\": \"Next.js(TypeScript)\", \"backend\": \"FastAPI + Postgres\"},\n    ]\nPY"
          },
          {
            "type": "p",
            "text": "`/health` は動作確認用、`/notes` は仮データを返すAPIです。"
          }
        ]
      },
      {
        "id": "app-main",
        "title": "メインアプリの作成（main.py）",
        "summary": "FastAPI本体を起動するエントリーポイントを作ります。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "cat > backend/app/main.py <<'PY'\nfrom fastapi import FastAPI\nfrom fastapi.middleware.cors import CORSMiddleware\nfrom .core.config import settings\nfrom .api.routes import router as api_router\n\napp = FastAPI(title=settings.PROJECT_NAME)\n\n# 先开放 CORS，方便前端联调；生产再收紧\napp.add_middleware(\n    CORSMiddleware,\n    allow_origins=[\"*\"],\n    allow_credentials=True,\n    allow_methods=[\"*\"],\n    allow_headers=[\"*\"],\n)\n\napp.include_router(api_router, prefix=\"\")\n\n@app.get(\"/\")\ndef root():\n    return {\"message\": \"Welcome to Code Share API\"}\nPY"
          },
          {
            "type": "p",
            "text": "この `main.py` がアプリの起動ポイントになります。CORSを開放しておくことで、後でフロントエンドとの連携が容易になります。"
          }
        ]
      },
      {
        "id": "docker-compose",
        "title": "docker-compose.ymlの作成と起動",
        "summary": "まずはバックエンド単体をDocker Composeで動かしてみます。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "cat > docker-compose.yml <<'YAML'\nservices:\n  backend:\n    build: ./backend\n    container_name: cs-backend-only\n    volumes:\n      - ./backend:/app\n    ports:\n      - \"8000:8000\"\n    restart: unless-stopped\nYAML"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "docker-compose up -d --build\ndocker logs -f cs-backend-only"
          },
          {
            "type": "p",
            "text": "ログに `Application startup complete.` と出れば起動成功です。"
          }
        ]
      },
      {
        "id": "verify",
        "title": "動作確認",
        "summary": "curlまたはブラウザでAPIの応答を確認します。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "curl http://localhost:8000/health\ncurl http://localhost:8000/notes"
          },
          {
            "type": "p",
            "text": "EC2で実行中の場合は、外部ブラウザで `http://<あなたのIP>:8000/health` にアクセスします。"
          },
          {
            "type": "ul",
            "items": [
              "“{\"status\":\"ok\"}” が返れば成功",
              "“/notes” で2件の仮データが表示されればOK",
              "見えない場合はセキュリティグループで TCP 8000 を開放"
            ]
          },
          {
            "type": "img",
            "src": "/images/backend-3.png",
            "alt": "curlまたはブラウザでAPIの応答を確認します。",
            "caption": "curlでAPIの応答を確認する"
          },
          {
            "type": "img",
            "src": "/images/backend-4.png",
            "alt": "ブラウザでAPIの応答を確認する(1)",
            "caption": "ブラウザでAPIの応答を確認する(1)"
          },
          {
            "type": "img",
            "src": "/images/backend-5.png",
            "alt": "ブラウザでAPIの応答を確認する(2)",
            "caption": "ブラウザでAPIの応答を確認する(2)"
          },
          {
            "type": "img",
            "src": "/images/backend-6.png",
            "alt": "ブラウザでAPIの応答を確認する(3)",
            "caption": "ブラウザでAPIの応答を確認する(3)"
          },
        ]
      },
      {
        "id": "summary2",
        "title": "まとめ：バックエンド骨格の完成",
        "summary": "Docker上で動作するFastAPIの最小構成が完成しました。",
        "content": [
          {
            "type": "ul",
            "items": [
              "FastAPIアプリのディレクトリを整備",
              "DockerfileとComposeでコンテナ化",
              "ヘルスチェックAPIの動作確認済み"
            ]
          },
          {
            "type": "p",
            "text": "次の章では、このバックエンドにPostgreSQLとJWT認証を加え、実際のユーザー管理を実装していきます。"
          }
        ]
      }
    ]
  },
  {
    "key": "backend-setup-postgres",
    "title": "PostgreSQLデータベースの接続とバックエンド構造の初期化",
    "lessons": [
      {
        "id": "compose-postgres",
        "title": "docker-compose に Postgres を追加する",
        "summary": "docker-compose.yml ファイルを上書きまたは更新し、db サービスを追加して、backend が db に依存するように設定する。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "# docker-compose.yml を上書き/更新（db サービスを追加し、backend が db に依存するように設定）\ncat > docker-compose.yml <<'YAML'\nservices:\n  db:\n    image: postgres:16\n    container_name: csb-postgres\n    environment:\n      POSTGRES_USER: cs_user\n      POSTGRES_PASSWORD: cs_pass\n      POSTGRES_DB: cs_app\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n    ports:\n      - \"5432:5432\"\n    restart: unless-stopped\n\n  backend:\n    build: ./backend\n    container_name: csb-backend\n    env_file:\n      - ./backend/.env\n    volumes:\n      - ./backend:/app\n    ports:\n      - \"8000:8000\"\n    depends_on:\n      - db\n    restart: unless-stopped\n\nvolumes:\n  pgdata:\nYAML"
          },
          {
            "type": "p",
            "text": "`.env` ファイルを作成（バックエンドがデータベース接続と JWT 設定を読み取るため）："
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "cat > backend/.env <<'ENV'\nDATABASE_URL=postgresql://cs_user:cs_pass@db:5432/cs_app\nJWT_SECRET=change_me_to_a_long_random_string\nJWT_ALG=HS256\nACCESS_TOKEN_EXPIRE_MINUTES=60\nENV"
          }
        ]
      },
      {
        "id": "install-deps",
        "title": "バックエンド依存関係のインストールとコード構造の追加",
        "summary": "Dockerfile を更新して SQLAlchemy、Passlib、JOSE をインストールし、バックエンドのディレクトリと主要ファイルを作成する。",
        "content": [
          {
            "type": "p",
            "text": "2.1 Dockerfile を更新（SQLAlchemy、Passlib、JOSE をインストール）："
          },
          {
            "type": "code",
            "filename": "backend/Dockerfile",
            "lang": "bash",
            "code": "cat > backend/Dockerfile <<'DOCKER'\nFROM python:3.11-slim\n\nENV PYTHONDONTWRITEBYTECODE=1 \\\n    PYTHONUNBUFFERED=1\n\nWORKDIR /app\n\n# 互換性を固定し、bcrypt 4.x による互換性問題を回避\nRUN pip install --no-cache-dir \\\n    fastapi==0.115.0 uvicorn[standard]==0.30.6 \\\n    pydantic[email]==2.9.2 pydantic-settings==2.5.2 \\\n    sqlalchemy==2.0.36 psycopg2-binary==2.9.9 \\\n    passlib[bcrypt]==1.7.4 bcrypt==4.0.1 \\\n    python-jose[cryptography]==3.3.0\n\nCOPY app ./app\n\nEXPOSE 8000\nCMD [\"uvicorn\", \"app.main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\", \"--reload\"]\nDOCKER"
          },
          {
            "type": "p",
            "text": "2.2 データベースおよびモデルファイルを追加："
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "mkdir -p backend/app/{api,core,db,models,schemas}"
          },
          {
            "type": "p",
            "text": "core/config.py ファイルを追加："
          },
          {
            "type": "code",
            "filename": "backend/app/core/config.py",
            "lang": "python",
            "code": "cat > backend/app/core/config.py <<'PY'\nfrom pydantic_settings import BaseSettings\n\nclass Settings(BaseSettings):\n    PROJECT_NAME: str = \"Code Share API\"\n    DATABASE_URL: str = \"postgresql://cs_user:cs_pass@db:5432/cs_app\"\n\n    JWT_SECRET: str = \"CHANGE_ME\"\n    JWT_ALG: str = \"HS256\"\n    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60\n\n    class Config:\n        env_file = \".env\"\n\nsettings = Settings()\nPY"
          },
          {
            "type": "p",
            "text": "db/session.py ファイルを追加："
          },
          {
            "type": "code",
            "filename": "backend/app/db/session.py",
            "lang": "python",
            "code": "cat > backend/app/db/session.py <<'PY'\nfrom sqlalchemy import create_engine\nfrom sqlalchemy.orm import sessionmaker, declarative_base\nfrom app.core.config import settings\n\nengine = create_engine(settings.DATABASE_URL, future=True)\nSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)\nBase = declarative_base()\nPY"
          },
          {
            "type": "p",
            "text": "models/user.py ファイルを追加："
          },
          {
            "type": "code",
            "filename": "backend/app/models/user.py",
            "lang": "python",
            "code": "cat > backend/app/models/user.py <<'PY'\nfrom sqlalchemy import Column, Integer, String, DateTime, func\nfrom app.db.session import Base\n\nclass User(Base):\n    __tablename__ = \"users\"\n    id = Column(Integer, primary_key=True, index=True)\n    email = Column(String(255), unique=True, index=True, nullable=False)\n    hashed_password = Column(String(255), nullable=False)\n    created_at = Column(DateTime(timezone=True), server_default=func.now())\nPY"
          },
          {
            "type": "p",
            "text": "models/note.py ファイルを追加："
          },
          {
            "type": "code",
            "filename": "backend/app/models/note.py",
            "lang": "python",
            "code": "cat > backend/app/models/note.py <<'PY'\nfrom sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func\nfrom sqlalchemy.orm import relationship\nfrom app.db.session import Base\n\nclass Note(Base):\n    __tablename__ = \"notes\"\n    id = Column(Integer, primary_key=True, index=True)\n    owner_id = Column(Integer, ForeignKey(\"users.id\"), nullable=False)\n\n    title = Column(String(200), nullable=False)\n    project_type = Column(String(20), nullable=False)  # 「静的」または「動的」\n    frontend_stack = Column(String(200), nullable=False)\n    backend_stack = Column(String(200), nullable=False)\n    description = Column(Text)\n\n    created_at = Column(DateTime(timezone=True), server_default=func.now())\n\n    owner = relationship(\"User\")\nPY"
          },
          {
            "type": "p",
            "text": "Pydantic スキーマファイルを追加："
          },
          {
            "type": "code",
            "filename": "backend/app/schemas/auth.py",
            "lang": "python",
            "code": "cat > backend/app/schemas/auth.py <<'PY'\nfrom pydantic import BaseModel, EmailStr\n\nclass RegisterIn(BaseModel):\n    email: EmailStr\n    password: str\n\nclass TokenOut(BaseModel):\n    access_token: str\n    token_type: str = \"bearer\"\nPY"
          },
          {
            "type": "code",
            "filename": "backend/app/schemas/note.py",
            "lang": "python",
            "code": "cat > backend/app/schemas/note.py <<'PY'\nfrom pydantic import BaseModel\nfrom typing import Optional\n\nclass NoteBase(BaseModel):\n    title: str\n    project_type: str\n    frontend_stack: str\n    backend_stack: str\n    description: Optional[str] = None\n\nclass NoteCreate(NoteBase):\n    pass\n\nclass NoteOut(NoteBase):\n    id: int\n    owner_id: int\n\n    class Config:\n        from_attributes = True\nPY"
          },
          {
            "type": "p",
            "text": "簡単なセキュリティユーティリティと依存関係を追加："
          },
          {
            "type": "code",
            "filename": "backend/app/core/security/hash.py",
            "lang": "python",
            "code": "mkdir -p backend/app/core/security\ncat > backend/app/core/security/hash.py <<'PY'\nfrom passlib.context import CryptContext\npwd_ctx = CryptContext(schemes=[\"bcrypt\"], deprecated=\"auto\")\n\ndef hash_password(p: str) -> str:\n    return pwd_ctx.hash(p)\n\ndef verify_password(p: str, hashed: str) -> bool:\n    return pwd_ctx.verify(p, hashed)\nPY"
          }
        ]
      }
    ]
  },
  {
    "key": "backend-auth-and-routes",
    "title": "認証、依存関係、およびルーティングモジュールの追加",
    "lessons": [
      {
        "id": "jwt-and-deps",
        "title": "JWT トークンと依存性注入の実装",
        "summary": "JWT トークン生成ツールを作成し、データベースセッションと現在のユーザー依存関係を設定する。",
        "content": [
          {
            "type": "p",
            "text": "JWT 生成モジュールを追加："
          },
          {
            "type": "code",
            "filename": "backend/app/core/security/jwt.py",
            "lang": "python",
            "code": "cat > backend/app/core/security/jwt.py <<'PY'\nfrom datetime import datetime, timedelta, timezone\nfrom jose import jwt\nfrom app.core.config import settings\n\ndef create_access_token(sub: str) -> str:\n    expire = datetime.now(tz=timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)\n    payload = {\"sub\": sub, \"exp\": expire}\n    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALG)\nPY"
          },
          {
            "type": "p",
            "text": "依存モジュールを追加：DB セッションと現在のユーザー"
          },
          {
            "type": "code",
            "filename": "backend/app/api/deps.py",
            "lang": "python",
            "code": "cat > backend/app/api/deps.py <<'PY'\nfrom typing import Generator, Optional\nfrom fastapi import Depends, HTTPException, status\nfrom fastapi.security import OAuth2PasswordBearer\nfrom jose import jwt, JWTError\nfrom sqlalchemy.orm import Session\nfrom app.db.session import SessionLocal\nfrom app.core.config import settings\nfrom app.models.user import User\n\noauth2_scheme = OAuth2PasswordBearer(tokenUrl=\"/auth/login\")\n\ndef get_db() -> Generator[Session, None, None]:\n    db = SessionLocal()\n    try:\n        yield db\n    finally:\n        db.close()\n\ndef get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:\n    credentials_error = HTTPException(\n        status_code=status.HTTP_401_UNAUTHORIZED,\n        detail=\"Could not validate credentials\",\n        headers={\"WWW-Authenticate\":\"Bearer\"},\n    )\n    try:\n        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALG])\n        sub: Optional[str] = payload.get(\"sub\")\n        if sub is None:\n            raise credentials_error\n    except JWTError:\n        raise credentials_error\n\n    user = db.query(User).filter(User.email == sub).first()\n    if not user:\n        raise credentials_error\n    return user\nPY"
          }
        ]
      },
      {
        "id": "auth-router",
        "title": "認証ルーターの追加",
        "summary": "登録およびログイン機能を実装し、JWT トークンで認証を管理する。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "mkdir -p backend/app/api/routers"
          },
          {
            "type": "code",
            "filename": "backend/app/api/routers/auth.py",
            "lang": "python",
            "code": "cat > backend/app/api/routers/auth.py <<'PY'\nfrom fastapi import APIRouter, Depends, HTTPException, status\nfrom sqlalchemy.orm import Session\nfrom app.api.deps import get_db\nfrom app.schemas.auth import RegisterIn, TokenOut\nfrom app.models.user import User\nfrom app.core.security.hash import hash_password, verify_password\nfrom app.core.security.jwt import create_access_token\n\nrouter = APIRouter(prefix=\"/auth\", tags=[\"auth\"])\n\n@router.post(\"/register\", response_model=TokenOut)\ndef register(data: RegisterIn, db: Session = Depends(get_db)):\n    if db.query(User).filter(User.email == data.email).first():\n        raise HTTPException(status_code=400, detail=\"Email already registered\")\n    new_user = User(email=data.email, hashed_password=hash_password(data.password))\n    db.add(new_user)\n    db.commit()\n    return TokenOut(access_token=create_access_token(new_user.email))\n\n@router.post(\"/login\", response_model=TokenOut)\ndef login(data: RegisterIn, db: Session = Depends(get_db)):\n    user = db.query(User).filter(User.email == data.email).first()\n    if not user or not verify_password(data.password, user.hashed_password):\n        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=\"Invalid credentials\")\n    return TokenOut(access_token=create_access_token(user.email))\nPY"
          }
        ]
      },
      {
        "id": "notes-router",
        "title": "ノートルーター（保護付き）の追加",
        "summary": "ノートの作成と一覧機能を実装し、認証済みユーザーのみアクセス可能にする。",
        "content": [
          {
            "type": "code",
            "filename": "backend/app/api/routers/notes.py",
            "lang": "python",
            "code": "cat > backend/app/api/routers/notes.py <<'PY'\nfrom fastapi import APIRouter, Depends\nfrom sqlalchemy.orm import Session\nfrom typing import List\nfrom app.api.deps import get_db, get_current_user\nfrom app.schemas.note import NoteCreate, NoteOut\nfrom app.models.note import Note\nfrom app.models.user import User\n\nrouter = APIRouter(prefix=\"/notes\", tags=[\"notes\"])\n\n@router.get(\"\", response_model=List[NoteOut])\ndef list_notes(db: Session = Depends(get_db), user: User = Depends(get_current_user)):\n    return db.query(Note).order_by(Note.id.desc()).all()\n\n@router.post(\"\", response_model=NoteOut)\ndef create_note(payload: NoteCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):\n    note = Note(\n        owner_id=user.id,\n        title=payload.title,\n        project_type=payload.project_type,\n        frontend_stack=payload.frontend_stack,\n        backend_stack=payload.backend_stack,\n        description=payload.description,\n    )\n    db.add(note)\n    db.commit()\n    db.refresh(note)\n    return note\nPY"
          }
        ]
      },
      {
        "id": "main-program",
        "title": "メインプログラム main.py の更新",
        "summary": "すべてのルーター、CORS ミドルウェア、および起動時のテーブル作成ロジックを統合する。",
        "content": [
          {
            "type": "code",
            "filename": "backend/app/main.py",
            "lang": "python",
            "code": "cat > backend/app/main.py <<'PY'\nfrom fastapi import FastAPI\nfrom fastapi.middleware.cors import CORSMiddleware\nfrom sqlalchemy import inspect\nfrom app.core.config import settings\nfrom app.db.session import Base, engine\nfrom app.api.routers.auth import router as auth_router\nfrom app.api.routers.notes import router as notes_router\n\napp = FastAPI(title=settings.PROJECT_NAME)\n\n# CORS：開発期間中は全許可\napp.add_middleware(\n    CORSMiddleware,\n    allow_origins=[\"*\"], allow_credentials=True,\n    allow_methods=[\"*\"], allow_headers=[\"*\"],\n)\n\n# 起動時にテーブルを作成（開発用；後に Alembic に切り替え可）\n@app.on_event(\"startup\")\ndef on_startup():\n    insp = inspect(engine)\n    # テーブルが存在しない場合は作成\n    Base.metadata.create_all(bind=engine)\n\n@app.get(\"/health\")\ndef health():\n    return {\"status\": \"ok\"}\n\napp.include_router(auth_router)\napp.include_router(notes_router)\nPY"
          }
        ]
      },
      {
        "id": "run-and-verify",
        "title": "起動と API 検証",
        "summary": "Docker Compose でバックエンドを起動し、curl を使って登録、ログイン、ノート投稿を検証する。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "# プロジェクトルート（~/code-share-backend）で実行\ndocker-compose up -d --build\ndocker logs -f csb-backend"
          },
          {
            "type": "p",
            "text": "ターミナルに “Application startup complete.” と表示されたら、起動成功。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "# ヘルスチェック\ncurl http://localhost:8000/health\n\n# 登録（access_token を返す）\ncurl -s -X POST http://localhost:8000/auth/register \\\n -H 'Content-Type: application/json' \\\n -d '{\"email\":\"test@example.com\",\"password\":\"pass1234\"}'\n\nTOKEN=\"上で返された access_token をここに貼り付ける\"\n\n# ノートを作成（Bearer Token が必要）\ncurl -s -X POST http://localhost:8000/notes \\\n -H \"Authorization: Bearer $TOKEN\" \\\n -H 'Content-Type: application/json' \\\n -d '{\n   \"title\":\"私の最初の転職プロジェクト\",\n   \"project_type\":\"動的\",\n   \"frontend_stack\":\"Next.js(TypeScript)\",\n   \"backend_stack\":\"FastAPI + Postgres\",\n   \"description\":\"ログイン後に投稿できるプロジェクト記録\"\n }'"
          },
          {
            "type": "p",
            "text": "以下のような JSON が出力されれば、API が正常に動作していることを意味する："
          },
          {
            "type": "code",
            "filename": "output",
            "lang": "json",
            "code": "[{\"title\":\"私の最初の転職プロジェクト\",\"project_type\":\"動的\",\"frontend_stack\":\"Next.js(TypeScript)\",\"backend_stack\":\"FastAPI + Postgres\",\"description\":\"Dockerで構築したフルスタックプロジェクト\",\"id\":1,\"owner_id\":1}]"
          },
          {
            "type": "img",
            "src": "/images/backend-7.png",
            "alt": "起動と API 検証",
            "caption": "起動と API 検証"
          },
        ]
      }
    ]
  },
  
  
  {
    "key": "backend-extend-apis",
    "title": "バックエンド機能の拡張：ログイン・ユーザー情報・ノート編集削除",
    "lessons": [
      {
        "id": "add-user-schema",
        "title": "ユーザー出力モデルの追加",
        "summary": "ユーザー情報を返す際に使用するUserOutモデルを追加します。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "cat > backend/app/schemas/user.py <<'PY'\nfrom pydantic import BaseModel, EmailStr\n\nclass UserOut(BaseModel):\n    id: int\n    email: EmailStr\n\n    class Config:\n        from_attributes = True\nPY"
          }
        ]
      },
      {
        "id": "update-auth-router",
        "title": "認証ルーターの更新（/auth/login と /me）",
        "summary": "ログイン機能とログイン中ユーザー情報取得機能を追加します。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "cat > backend/app/api/routers/auth.py <<'PY'\nfrom fastapi import APIRouter, Depends, HTTPException, status\nfrom sqlalchemy.orm import Session\nfrom app.api.deps import get_db, get_current_user\nfrom app.schemas.auth import RegisterIn, TokenOut\nfrom app.schemas.user import UserOut\nfrom app.models.user import User\nfrom app.core.security.hash import hash_password, verify_password\nfrom app.core.security.jwt import create_access_token\n\nrouter = APIRouter(prefix=\"/auth\", tags=[\"auth\"])\n\n@router.post(\"/register\", response_model=TokenOut)\ndef register(data: RegisterIn, db: Session = Depends(get_db)):\n    if db.query(User).filter(User.email == data.email).first():\n        raise HTTPException(status_code=400, detail=\"Email already registered\")\n    new_user = User(email=data.email, hashed_password=hash_password(data.password))\n    db.add(new_user)\n    db.commit()\n    return TokenOut(access_token=create_access_token(new_user.email))\n\n@router.post(\"/login\", response_model=TokenOut)\ndef login(data: RegisterIn, db: Session = Depends(get_db)):\n    user = db.query(User).filter(User.email == data.email).first()\n    if not user or not verify_password(data.password, user.hashed_password):\n        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=\"Invalid credentials\")\n    return TokenOut(access_token=create_access_token(user.email))\n\n@router.get(\"/me\", response_model=UserOut)\ndef me(user: User = Depends(get_current_user)):\n    return user\nPY"
          }
        ]
      },
      {
        "id": "update-notes-router",
        "title": "ノートAPIに詳細取得・更新・削除を追加",
        "summary": "ノートの詳細GET、PUT更新、DELETE削除を追加します（本人のみ編集可）。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "cat > backend/app/api/routers/notes.py <<'PY'\nfrom fastapi import APIRouter, Depends, HTTPException, status\nfrom sqlalchemy.orm import Session\nfrom typing import List\nfrom app.api.deps import get_db, get_current_user\nfrom app.schemas.note import NoteCreate, NoteOut\nfrom app.models.note import Note\nfrom app.models.user import User\n\nrouter = APIRouter(prefix=\"/notes\", tags=[\"notes\"])\n\n@router.get(\"\", response_model=List[NoteOut])\ndef list_notes(db: Session = Depends(get_db), user: User = Depends(get_current_user)):\n    return db.query(Note).order_by(Note.id.desc()).all()\n\n@router.post(\"\", response_model=NoteOut)\ndef create_note(payload: NoteCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):\n    note = Note(\n        owner_id=user.id,\n        title=payload.title,\n        project_type=payload.project_type,\n        frontend_stack=payload.frontend_stack,\n        backend_stack=payload.backend_stack,\n        description=payload.description,\n    )\n    db.add(note)\n    db.commit()\n    db.refresh(note)\n    return note\n\n@router.get(\"/{note_id}\", response_model=NoteOut)\ndef get_note(note_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):\n    note = db.query(Note).get(note_id)\n    if not note:\n        raise HTTPException(status_code=404, detail=\"Note not found\")\n    return note\n\n@router.put(\"/{note_id}\", response_model=NoteOut)\ndef update_note(note_id: int, payload: NoteCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):\n    note = db.query(Note).get(note_id)\n    if not note:\n        raise HTTPException(status_code=404, detail=\"Note not found\")\n    if note.owner_id != user.id:\n        raise HTTPException(status_code=403, detail=\"Forbidden\")\n    note.title = payload.title\n    note.project_type = payload.project_type\n    note.frontend_stack = payload.frontend_stack\n    note.backend_stack = payload.backend_stack\n    note.description = payload.description\n    db.commit()\n    db.refresh(note)\n    return note\n\n@router.delete(\"/{note_id}\", status_code=204)\ndef delete_note(note_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):\n    note = db.query(Note).get(note_id)\n    if not note:\n        raise HTTPException(status_code=404, detail=\"Note not found\")\n    if note.owner_id != user.id:\n        raise HTTPException(status_code=403, detail=\"Forbidden\")\n    db.delete(note)\n    db.commit()\n    return\nPY"
          }
        ]
      },
      {
        "id": "update-root",
        "title": "ルートエンドポイントの更新",
        "summary": "トップページをわかりやすくするため、ルートにAPI案内を追加します。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "cat > backend/app/main.py <<'PY'\nfrom fastapi import FastAPI\nfrom fastapi.middleware.cors import CORSMiddleware\nfrom app.core.config import settings\nfrom app.api.routers.auth import router as auth_router\nfrom app.api.routers.notes import router as notes_router\n\napp = FastAPI(title=settings.PROJECT_NAME)\n\napp.add_middleware(\n    CORSMiddleware,\n    allow_origins=[\"*\"], allow_credentials=True,\n    allow_methods=[\"*\"], allow_headers=[\"*\"],\n)\n\n@app.get(\"/\")\ndef root():\n    return {\n        \"message\": \"Welcome to Code Share API\",\n        \"endpoints\": [\"/health\", \"/auth/register\", \"/auth/login\", \"/auth/me\", \"/notes\"]\n    }\n\n@app.get(\"/health\")\ndef health():\n    return {\"status\": \"ok\"}\n\napp.include_router(auth_router)\napp.include_router(notes_router)\nPY"
          },
          {
            "type": "p",
            "text": "ここで startup 時の create_all() は削除し、次章で Alembic に移行します。"
          }
        ]
      },
      {
        "id": "verify-api",
        "title": "新しいAPIを検証する",
        "summary": "curl コマンドでログイン・ユーザー情報・ノート編集削除を確認します。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "# 重建并启动\ncd ~/code-share\ndocker-compose build backend\ndocker-compose up -d\n\n# 登录获取token（假设已注册 test@example.com）\ncurl -s -X POST http://localhost:8000/auth/login \\\n -H 'Content-Type: application/json' \\\n -d '{\"email\":\"test@example.com\",\"password\":\"pass1234\"}'\n\n# 保存token\nTOKEN=\"(在这里粘贴access_token)\"\n\n# 获取当前用户\ncurl -s http://localhost:8000/auth/me -H \"Authorization: Bearer $TOKEN\"\n\n# 创建一条笔记\ncurl -s -X POST http://localhost:8000/notes \\\n -H \"Authorization: Bearer $TOKEN\" -H 'Content-Type: application/json' \\\n -d '{\"title\":\"二号项目\",\"project_type\":\"静态\",\"frontend_stack\":\"Next.js\",\"backend_stack\":\"—\",\"description\":\"静态展示\"}'\n\n# 查看详情（假设是id=2）\ncurl -s http://localhost:8000/notes/2 -H \"Authorization: Bearer $TOKEN\"\n\n# 更新\ncurl -s -X PUT http://localhost:8000/notes/2 \\\n -H \"Authorization: Bearer $TOKEN\" -H 'Content-Type: application/json' \\\n -d '{\"title\":\"二号项目（更新）\",\"project_type\":\"静态\",\"frontend_stack\":\"Next.js\",\"backend_stack\":\"—\",\"description\":\"更新后的描述\"}'\n\n# 删除\ncurl -s -X DELETE http://localhost:8000/notes/2 -H \"Authorization: Bearer $TOKEN\" -i"
          },
          {
            "type": "img",
            "src": "/images/backend-8.png",
            "alt": "新しいAPIを検証する",
            "caption": "新しいAPIを検証する"
          },
          {
            "type": "p",
            "text": "ここまでで、登録・ログイン・ノートCRUDが全て完成しました。次章でAlembicによるDBマイグレーションを導入します。"
          }
        ]
      }
    ]
  },
  {
    "key": "backend-alembic-setup",
    "title": "データベース移行管理：Alembicによるマイグレーション導入",
    "lessons": [
      {
        "id": "install-alembic",
        "title": "AlembicをDocker環境に追加",
        "summary": "まずAlembicをバックエンドのDockerイメージに追加し、再ビルドします。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "# backend/Dockerfile に alembic がまだ含まれていない場合のみ追加します。\nsed -n '1,200p' backend/Dockerfile | grep -q alembic || \\\nawk '1;/python-jose\\[cryptography\\]==3\\.3\\.0/&&c++==0{print \"    alembic==1.13.2 \\\\\";c++} ' backend/Dockerfile > /tmp/D && mv /tmp/D backend/Dockerfile\n\n# 再ビルドしてコンテナを起動\ncd ~/code-share\ndocker-compose build backend\ndocker-compose up -d"
          }
        ]
      },
      {
        "id": "init-alembic",
        "title": "Alembicの初期化",
        "summary": "Alembic環境をFastAPIプロジェクトに初期化します。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "# コンテナ内で Alembic を初期化\n docker-compose exec backend bash -lc 'alembic init migrations'\n\n# コンテナにルート権限で入る\n docker-compose exec backend bash"
          }
        ]
      },
      {
        "id": "edit-env-py",
        "title": "migrations/env.py の編集",
        "summary": "AlembicがFastAPIのSQLAlchemyモデルを認識できるよう設定を変更します。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "cat > migrations/env.py <<'EOF'\nfrom logging.config import fileConfig\nimport sys\nimport os\nsys.path.append(os.path.join(os.path.dirname(__file__), '..'))\n\nfrom sqlalchemy import engine_from_config, pool\nfrom alembic import context\nfrom app.db.session import Base\nfrom app.models import user, note  # モデルを確実に読み込む\n\n# alembic.ini の設定を読み込む\nconfig = context.config\nfileConfig(config.config_file_name)\n\ntarget_metadata = Base.metadata\n\ndef run_migrations_offline():\n    \"\"\"オフラインモード\"\"\"\n    url = config.get_main_option(\"sqlalchemy.url\")\n    context.configure(\n        url=url, target_metadata=target_metadata, literal_binds=True, dialect_opts={\"paramstyle\": \"named\"},\n    )\n\n    with context.begin_transaction():\n        context.run_migrations()\n\ndef run_migrations_online():\n    \"\"\"オンラインモード\"\"\"\n    connectable = engine_from_config(\n        config.get_section(config.config_ini_section),\n        prefix=\"sqlalchemy.\",\n        poolclass=pool.NullPool,\n    )\n\n    with connectable.connect() as connection:\n        context.configure(connection=connection, target_metadata=target_metadata)\n\n        with context.begin_transaction():\n            context.run_migrations()\n\nif context.is_offline_mode():\n    run_migrations_offline()\nelse:\n    run_migrations_online()\nEOF"
          }
        ]
      },
      {
        "id": "edit-alembic-ini",
        "title": "alembic.ini の設定変更",
        "summary": "デフォルトの接続情報を仮設定します（後で修正します）。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "cat > alembic.ini <<'EOF'\n[alembic]\nscript_location = migrations\nsqlalchemy.url = postgresql+psycopg2://postgres:postgres@db:5432/postgres\n\n[loggers]\nkeys = root,sqlalchemy,alembic\n\n[handlers]\nkeys = console\n\n[formatters]\nkeys = generic\n\n[logger_root]\nlevel = WARN\nhandlers = console\nqualname =\n\n[logger_sqlalchemy]\nlevel = WARN\nhandlers =\nqualname = sqlalchemy.engine\n\n[logger_alembic]\nlevel = INFO\nhandlers = console\nqualname = alembic\n\n[handler_console]\nclass = StreamHandler\nargs = (sys.stderr,)\nlevel = NOTSET\nformatter = generic\n\n[formatter_generic]\nformat = %(levelname)-5.5s [%(name)s] %(message)s\nEOF"
          },
          {
            "type": "p",
            "text": "設定が反映されているか確認します。"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "cat alembic.ini | grep sqlalchemy.url"
          },
          {
            "type": "p",
            "text": "出力例：\n\nsqlalchemy.url = postgresql+psycopg2://postgres:postgres@db:5432/postgres"
          }
        ]
      },
      {
        "id": "verify-db-credentials",
        "title": "正しいデータベース接続情報を確認",
        "summary": "docker-compose.yml から実際の接続ユーザーとパスワードを確認します。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "# コンテナから一度抜ける\nexit\n\n# docker-compose.yml 内のDB設定を確認\ncat docker-compose.yml | grep POSTGRES"
          },
          {
            "type": "p",
            "text": "通常の出力例：\n\nPOSTGRES_USER: cs_user  POSTGRES_PASSWORD: cs_pass  POSTGRES_DB: cs_app"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "# 再びバックエンドコンテナに入る\ndocker exec -it csb-backend bash\n\n# alembic.ini のURLを正しいものに書き換え\nsed -i 's#^sqlalchemy.url = .*#sqlalchemy.url = postgresql+psycopg2://cs_user:cs_pass@db:5432/cs_app#' alembic.ini\n\n# 確認\ngrep sqlalchemy.url alembic.ini"
          },
          {
            "type": "p",
            "text": "出力例：\n\nsqlalchemy.url = postgresql+psycopg2://cs_user:cs_pass@db:5432/cs_app\n\n→ これで正しい接続設定に変更されました。"
          }
        ]
      },
      {
        "id": "run-migration",
        "title": "マイグレーションの作成と適用",
        "summary": "SQLAlchemyモデル定義を基にマイグレーションスクリプトを自動生成し、DBに反映します。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "# モデルからマイグレーションスクリプトを自動生成\nalembic revision --autogenerate -m \"create initial tables\"\n\n# 成功時の出力例：\n# INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.\n# INFO  [alembic.autogenerate.compare] Detected added table 'users'\n# INFO  [alembic.autogenerate.compare] Detected added table 'notes'\n# Generating /app/migrations/versions/xxxx_create_initial_tables.py ... done\n\n# マイグレーションを実行（テーブルを作成）\nalembic upgrade head"
          },
          {
            "type": "p",
            "text": "実行後の例：\n\nINFO  [alembic.runtime.migration] Context impl PostgresqlImpl.\nINFO  [alembic.runtime.migration] Running upgrade  -> 20251015_xxxxxx, create initial tables"
          }
        ]
      },
      {
        "id": "verify-tables",
        "title": "PostgreSQLでテーブルを確認",
        "summary": "最後に、データベース上でテーブルが正しく作成されたかを確認します。",
        "content": [
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "# PostgreSQL コンテナに入る\n docker exec -it csb-postgres psql -U cs_user -d cs_app\n\n# テーブル一覧を確認\n \\dt"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "          List of relations\n Schema |     Name     | Type  |  Owner\n--------+---------------+-------+----------\n public | users         | table | cs_user\n public | notes         | table | cs_user\n(2 rows)"
          },
          {
            "type": "code",
            "filename": "terminal",
            "lang": "bash",
            "code": "\\q"
          },
          {
            "type": "p",
            "text": "これでAlembicによる初回マイグレーションが完了しました。"
          },
          {
            "type": "img",
            "src": "/images/backend-9.png",
            "alt": "データベース移行管理1",
            "caption": "データベース移行管理1"
          },
          {
            "type": "img",
            "src": "/images/backend-10.png",
            "alt": "データベース移行管理2",
            "caption": "データベース移行管理2"
          },
          {
            "type": "img",
            "src": "/images/backend-11.png",
            "alt": "データベース移行管理3",
            "caption": "データベース移行管理3"
          },
        ]
      },
      {
        "id": "summary",
        "title": "まとめ",
        "summary": "この章ではAlembicを導入し、DBスキーマをバージョン管理できるようにしました。",
        "content": [
          {
            "type": "ul",
            "items": [
              "DockerfileにAlembicを追加して再ビルド",
              "migrations/env.py と alembic.ini の編集",
              "alembic revision / upgrade でテーブル作成",
              "psqlで users / notes テーブルを確認"
            ]
          },
          {
            "type": "p",
            "text": "次の章では、Alembicを使ったカラム追加・削除などのテーブル構造変更を学びます。"
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
            フルスタック開発実践（バックエンドとデータベース）
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