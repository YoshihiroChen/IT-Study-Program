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
    "key": "fastapi-core-components",
    "title": "FastAPIの二大構成要素",
    "lessons": [
      {
        "id": "starlette",
        "title": "Starlette：FastAPIの基盤となるASGIフレームワーク",
        "summary": "FastAPIはStarletteを土台として動作し、HTTPリクエスト処理・ルーティング・ミドルウェアなど“Webアプリとして動くための機能”を担います。",
        "content": [
          {
            "type": "p",
            "text": "FastAPIは「全部入りの単体フレームワーク」というよりも、複数の優れた部品を組み合わせて作られた“モダンなAPI開発のための統合レイヤー”です。その中で、Webアプリとして動くための基礎（HTTPサーバーとの接続方式、リクエスト受付、レスポンス返却、ルーティングなど）を提供しているのがStarletteです。"
          },
          {
            "type": "p",
            "text": "StarletteはASGI（Asynchronous Server Gateway Interface）に準拠したフレームワークです。ASGIはPythonのWebアプリが「同期だけでなく非同期（async/await）でも動ける」ようにするためのインターフェース規格であり、FastAPIはこのASGI世界で動作します。そのため実行にはUvicornなどのASGIサーバーを使います。"
          },
          {
            "type": "p",
            "text": "FastAPIのエンドポイント（@app.get など）で定義したルートは、内部ではStarletteのルーティング機構として登録されます。つまり、あなたがFastAPIで書いた「URLと関数の対応付け」は、最終的にStarletteが解釈し、実際にHTTPリクエストを関数へ届けます。"
          },
          {
            "type": "ul",
            "items": [
              "ASGIベース：非同期処理に最適化された実行モデル",
              "ルーティング：URLとハンドラ（関数）を結びつける",
              "リクエスト/レスポンス：HTTPデータを扱う土台を提供",
              "ミドルウェア：認証・ログ・CORS等の共通処理を挟み込める",
              "WebSocket：HTTP以外の双方向通信もサポート（ASGIの強み）"
            ]
          },
          {
            "type": "p",
            "text": "重要なのは、FastAPIは“Starletteの上で動きつつ”、開発者が書くコードをより簡潔にし、さらにPydanticと連携して「入力データの型安全性」「自動ドキュメント生成」などの体験を提供している点です。Starletteが担当するのは、あくまでWebアプリとしての基盤であり、データの厳密な検証やスキーマ生成は次のPydanticが大きく担います。"
          },
          {
            "type": "code",
            "filename": "example_starlette_base.py",
            "lang": "python",
            "code": "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get(\"/\")\ndef read_root():\n    return {\"message\": \"Hello from Starlette base\"}"
          },
          {
            "type": "p",
            "text": "この最小例でも、実際には「ASGIサーバー（例：Uvicorn）がHTTPリクエストを受け取る → ASGIとしてアプリへ渡す → Starletteが該当ルートを探索する → ハンドラ関数が実行される → 戻り値をStarletteがレスポンスへ整形して返す」という流れが裏側で動いています。"
          }
        ]
      },
      {
        "id": "pydantic",
        "title": "Pydantic：外部入力を“信頼できるデータ”に変換する仕組み",
        "summary": "Pydanticは型ヒントをもとに、入力データの検証（validation）と変換（parsing/coercion）を自動化し、FastAPIの型安全性と自動スキーマ生成を支えます。",
        "content": [
          {
            "type": "p",
            "text": "Pydanticの本質は、「外部から来る不確かなデータ（dict/JSON/フォームなど）」を、アプリ内部で安全に扱える“信頼できるPythonオブジェクト”へ変換することです。API開発では、ユーザーや外部システムから送られてくる入力は常に不正・欠損・型ズレの可能性があります。Pydanticはそれをモデル定義（型ヒント）に従って一括で検証し、必要なら型変換も行い、エラーなら理由付きで失敗させます。"
          },
          {
            "type": "p",
            "text": "以下はPydantic公式ドキュメントの代表例です。この短い例の中に、Pydanticの主要機能（必須/任意、デフォルト、型検証、ネスト構造、型変換、制約型、ダンプ）が凝縮されています。"
          },
          {
            "type": "code",
            "filename": "pydantic_official_example.py",
            "lang": "python",
            "code": "from datetime import datetime\n\nfrom pydantic import BaseModel, PositiveInt\n\n\nclass User(BaseModel):\n    id: int  \n    name: str = 'John Doe'  \n    signup_ts: datetime | None  \n    tastes: dict[str, PositiveInt]  \n\n\nexternal_data = {\n    'id': 123,\n    'signup_ts': '2019-06-01 12:22',  \n    'tastes': {\n        'wine': 9,\n        b'cheese': 7,  \n        'cabbage': '1',  \n    },\n}\n\nuser = User(**external_data)  \n\nprint(user.id)  \n#> 123\nprint(user.model_dump())  \n\"\"\"\n{\n    'id': 123,\n    'name': 'John Doe',\n    'signup_ts': datetime.datetime(2019, 6, 1, 12, 22),\n    'tastes': {'wine': 9, 'cheese': 7, 'cabbage': 1},\n}\n\"\"\""
          },
          {
            "type": "p",
            "text": "ここからは、この例でPydanticが実際に何をしているのかを「見える結果」と「裏側の処理」に分けて、フィールドごとに丁寧に分解します。"
          },
          {
            "type": "p",
            "text": "まず、class User(BaseModel) と書いた瞬間に、UserはただのPythonクラスではなくなります。Pydanticはクラス定義時に型ヒントとデフォルト値を読み取り、各フィールドに対する検証ルールを構築します。以降 User(**data) を呼ぶことは「コンストラクタ」ではなく、「入力データをモデルに従って検証・変換し、成功したらモデルインスタンスを返す処理」と考えるのが正確です。"
          },
          {
            "type": "ul",
            "items": [
              "モデル定義（型ヒント）から検証ルールを生成する",
              "外部入力（dictなど）を受け取り、フィールド単位で検証する",
              "必要に応じて型変換（例：str→int、str→datetime、bytes→str）を行う",
              "制約違反や変換不能ならValidationErrorとして失敗する",
              "成功した場合のみ“型が揃った”安全なモデルを得る"
            ]
          },
          {
            "type": "p",
            "text": "次に、各フィールドが意味するところを確認します。"
          },
          {
            "type": "p",
            "text": "1) id: int は「必須フィールド」かつ「整数でなければならない」という宣言です。external_data に id が欠けていればエラーになりますし、id が 'abc' のような数値に変換できない値なら検証で弾かれます。逆に '123' のように整数へ変換可能な文字列なら、Pydanticが int へ変換して通すことがあります（設定や型により挙動は変わり得ますが、例が示す思想は“可能なら正しい型へ寄せる”です）。"
          },
          {
            "type": "p",
            "text": "2) name: str = 'John Doe' は「型は文字列」「外部入力に無ければデフォルトで 'John Doe' を採用」という意味です。この例の external_data には name が無いので、出力の model_dump() では name が自動補完されて 'John Doe' になります。ここで重要なのは、Pydanticが“欠損値をデフォルトで埋める”という、API設計上とても重要な役割を担っている点です。"
          },
          {
            "type": "p",
            "text": "3) signup_ts: datetime | None は「datetime でもよいし、None でもよい（任意）」という意味です。external_data では signup_ts が '2019-06-01 12:22' という文字列として渡されていますが、Pydanticはこれを datetime へパース（解析）して、datetime.datetime(2019, 6, 1, 12, 22) に変換します。もし変換できないフォーマットならエラーになり、APIとしては“入力が不正である”ことを明確に返せます。"
          },
          {
            "type": "p",
            "text": "4) tastes: dict[str, PositiveInt] は、この例の核心です。これは「キーは str、値は PositiveInt（正の整数）」というネスト構造を宣言しています。つまり tastes 全体が辞書であるだけでなく、辞書の中身まで“型と制約”を持ちます。これにより、単に tastes が dict かどうかを見るだけではなく、各エントリ（キー/値）を要素単位で検証・変換できます。"
          },
          {
            "type": "p",
            "text": "では external_data['tastes'] の中身を見てみましょう。"
          },
          {
            "type": "code",
            "filename": "tastes_input_snippet.py",
            "lang": "python",
            "code": "tastes = {\n    'wine': 9,\n    b'cheese': 7,\n    'cabbage': '1',\n}"
          },
          {
            "type": "p",
            "text": "ここでPydanticは、tastes の「キー」と「値」をそれぞれ型に合わせて整形します。"
          },
          {
            "type": "ul",
            "items": [
              "キー 'wine' はすでに str なのでそのまま採用される",
              "キー b'cheese' は bytes だが、dict[str, ...] の定義に合わせて str へ変換され 'cheese' になる",
              "値 '1' は本来 str だが、PositiveInt（intかつ正）として解釈され、int へ変換されて 1 になる",
              "もし値が 0 や -1 なら PositiveInt の制約違反でエラーになる"
            ]
          },
          {
            "type": "p",
            "text": "この結果、model_dump() の tastes は {'wine': 9, 'cheese': 7, 'cabbage': 1} という、キーも値も“宣言した通り”に揃った辞書として出力されます。ここがPydanticの強みで、入力データが多少バラついていても、モデルの定義に従ってデータを正規化（normalize）できます。"
          },
          {
            "type": "p",
            "text": "次に user = User(**external_data) が何を意味するかを整理します。この1行は「辞書をそのままUserに詰める」ではなく、「Userモデル（型と制約の集合）を使って external_data を検証し、必要な型変換を行い、成功したらUserインスタンスを生成する」という処理です。途中で一つでも条件を満たさないフィールドがあれば、例外（ValidationError）として止まります。"
          },
          {
            "type": "p",
            "text": "最後に model_dump() についてです。Pydantic v2 では、モデルを辞書へ戻す際に model_dump() を使います。ここで返る値は「検証と変換が終わった後のデータ」であり、アプリ内部で扱う“正規化済みの真の値”と考えてよいです。FastAPIでは、Pydanticモデルをレスポンスモデルとして指定すると、同様の仕組みでレスポンスの形を保証できます。"
          },
          {
            "type": "p",
            "text": "まとめると、この短い例でPydanticがやっていることは次の一言に集約できます：外部入力（不確かなデータ）を、型ヒントに基づいて検証し、可能なら型を揃えて変換し、アプリ内部で信頼できる形に整える。これがFastAPIの「型安全」「自動バリデーション」「自動ドキュメント生成」を成立させている中心メカニズムです。"
          },
          {
            "type": "ul",
            "items": [
              "必須/任意（Optional）の判定と欠損検出",
              "デフォルト値の自動補完",
              "文字列→datetime、bytes→str、文字列→intなどの型変換",
              "PositiveIntのような制約型によるルール付け",
              "検証済みデータの取り出し（model_dump）",
              "FastAPIの入力検証・OpenAPIスキーマ生成の基盤"
            ]
          }
        ]
      }
    ]
  },
  {
    "key": "http-basics",
    "title": "HTTPの基礎知識",
    "lessons": [
      {
        "id": "http-characteristics",
        "title": "HTTPの基本的な特徴",
        "summary": "HTTPはWeb通信の基盤となるプロトコルであり、通信方式・設計思想・制約を理解することがWebアプリケーション理解の出発点となります。",
        "content": [
          {
            "type": "p",
            "text": "HTTP（HyperText Transfer Protocol）は、WebブラウザとWebサーバーの間で情報をやり取りするための通信規約です。私たちが日常的に利用しているWebページの表示、フォーム送信、API通信などは、すべてHTTPという共通ルールの上で成り立っています。"
          },
          {
            "type": "p",
            "text": "FastAPIや他のWebフレームワークを理解するためには、HTTPがどのような性質を持つ通信方式なのかを把握しておくことが不可欠です。本節では、HTTPの最も基本的な特徴を4つに分けて説明します。"
          },
          {
            "type": "ul",
            "items": [
              "TCP/IP上で動作するプロトコルであること",
              "リクエスト・レスポンス型の通信モデルであること",
              "ステートレス（状態を保持しない）であること",
              "基本的に短命な接続（短い通信）であること"
            ]
          },
          {
            "type": "p",
            "text": "以下では、それぞれの特徴を順番に詳しく見ていきます。"
          },
          {
            "type": "p",
            "text": "① HTTPはTCP/IPの上で動作する\nHTTPは単独で存在する通信方式ではなく、インターネットの基盤であるTCP/IPプロトコル群の上に構築されています。具体的には、HTTPはトランスポート層にあるTCPを利用して通信を行います。TCPは「通信相手との接続確立」「データの順序保証」「再送制御」などを担当し、HTTPはその上で『どのような形式でデータをやり取りするか』を定義します。"
          },
          {
            "type": "p",
            "text": "そのため、HTTP自体は通信の信頼性を保証する仕組みを持たず、あくまでTCPの上で動作するアプリケーション層のプロトコルです。FastAPIを含む多くのWebフレームワークは、この構造を前提として設計されています。"
          },
          {
            "type": "p",
            "text": "② リクエスト・レスポンス型の通信モデル\nHTTP通信は必ず「クライアントがリクエストを送信し、それに対してサーバーがレスポンスを返す」という一方向の流れで構成されます。サーバー側から自発的に通信を開始することはできません。"
          },
          {
            "type": "p",
            "text": "例えば、ブラウザでURLを開くと、ブラウザがHTTPリクエストを送信し、サーバーはHTMLやJSONなどのレスポンスを返します。この1往復がHTTP通信の最小単位です。FastAPIで定義するエンドポイント（@app.get など）は、この「リクエスト → レスポンス」の関係をコードとして表現したものです。"
          },
          {
            "type": "p",
            "text": "③ ステートレス（Stateless）であること\nHTTPの最も重要な特徴の一つが「ステートレス」である点です。これは、サーバーがクライアントごとの状態を原則として記憶しない、という設計思想を意味します。"
          },
          {
            "type": "p",
            "text": "たとえば、同じユーザーが連続してリクエストを送ったとしても、HTTPそのものは『前回のリクエストが誰から来たか』『ログインしているかどうか』といった情報を保持しません。すべてのリクエストは独立したものとして扱われます。"
          },
          {
            "type": "p",
            "text": "この性質はサーバーの構造を単純にし、スケーラビリティを高める一方で、「ログイン状態の保持」や「ユーザー識別」といった機能をそのままでは実現できないという制約も生みます。"
          },
          {
            "type": "p",
            "text": "そこで登場するのが Cookie や Session といった仕組みです。これらはHTTP自体の仕様ではなく、ステートレスなHTTPの上で「状態を擬似的に管理するための仕組み」として設計されています。"
          },
          {
            "type": "p",
            "text": "Cookieとは、サーバーがクライアント（ブラウザ）に保存させる小さなデータのことです。ブラウザは次回以降のリクエスト時に、そのCookieを自動的にサーバーへ送り返します。これにより、サーバー側は『同じクライアントからのアクセスである』と識別できます。"
          },
          {
            "type": "p",
            "text": "Sessionは、サーバー側でユーザーごとの状態を保持する仕組みです。一般的には、CookieにはセッションIDのみを保存し、実際のユーザー情報（ログイン状態や権限など）はサーバー側のメモリやデータベースに保存されます。これにより、HTTPが本来持たない「状態」をアプリケーションレベルで管理できます。"
          },
          {
            "type": "p",
            "text": "つまり、HTTPは本質的にステートレスである一方、CookieやSessionといった仕組みを組み合わせることで、ログイン機能やユーザーごとの継続的な体験を実現しています。FastAPIを含む多くのWebフレームワークは、この考え方を前提に設計されています。"
          },
          {
            "type": "p",
            "text": "④ 短い接続（短命な通信）であること\nHTTP通信は基本的に「1リクエスト＝1レスポンス」で完結します。通信が完了すると接続は終了し、次のリクエストでは新たな接続が作られます（HTTP/1.1以降ではKeep-Aliveなどの最適化はありますが、論理的には独立した通信です）。"
          },
          {
            "type": "p",
            "text": "この性質により、HTTPは大量のクライアントからの同時アクセスを効率よく処理できます。一方で、リアルタイム性が求められる場面ではWebSocketなど別の通信方式が利用されます。FastAPIがWebSocketをサポートしている理由も、ここにあります。"
          },
          {
            "type": "p",
            "text": "まとめると、HTTPは「シンプル・ステートレス・リクエスト駆動」という思想を持つプロトコルであり、この性質を理解することがWebアプリケーション設計の基礎となります。FastAPIはこのHTTPの性質を前提として、高速かつ安全なAPI構築を可能にしています。"
          }
        ]
      },
      {
        "id": "http-request-format",
        "title": "HTTPリクエストの形式",
        "summary": "HTTPリクエストは単なる文字列の集合であり、リクエストライン・ヘッダー・空行・ボディという4つの要素から構成されます。",
        "content": [
          {
            "type": "p",
            "text": "HTTPリクエストとは、クライアント（ブラウザやAPIクライアント）がサーバーに対して送信する「お願いのメッセージ」です。"
          },
          {
            "type": "p",
            "text": "このリクエストは、実はただのテキスト（文字列）で構成されています。見た目は単純ですが、Web通信の基本構造がすべて詰まっています。"
          },
          {
            "type": "p",
            "text": "HTTPリクエストは、大きく分けて次の4つの要素から構成されます。"
          },
          {
            "type": "ul",
            "items": [
              "リクエストライン（Request Line）",
              "ヘッダー（Headers）",
              "空行（空白行）",
              "ボディ（Body）"
            ]
          },
          {
            "type": "p",
            "text": "まずは、実際のHTTPリクエストの例をそのまま見てみましょう。"
          },
          {
            "type": "code",
            "filename": "raw_http_request.txt",
            "lang": "text",
            "code": "POST /api/users HTTP/1.1\nHost: example.com\nContent-Type: application/json\nContent-Length: 47\nAuthorization: Bearer abcdef123456\n\n{\n  \"name\": \"Alice\",\n  \"age\": 20\n}"
          },
          {
            "type": "p",
            "text": "これが1つのHTTPリクエストです。見た目は単なるテキストですが、行ごとに明確な意味があります。"
          },
          {
            "type": "p",
            "text": "① リクエストライン（Request Line）\n\nPOST /api/users HTTP/1.1\n\nこの1行目をリクエストラインと呼びます。"
          },
          {
            "type": "p",
            "text": "リクエストラインは次の3つの要素で構成されます。"
          },
          {
            "type": "ul",
            "items": [
              "HTTPメソッド（例：GET / POST / PUT / DELETE）",
              "パス（例：/api/users）",
              "HTTPバージョン（例：HTTP/1.1）"
            ]
          },
          {
            "type": "p",
            "text": "この行は、「HTTP/1.1 を使って /api/users に対して POST リクエストを送る」という意味になります。"
          },
          {
            "type": "p",
            "text": "② ヘッダー（Headers）\n\nリクエストラインの次には、ヘッダーが続きます。ヘッダーはリクエストに関する補足情報を表します。"
          },
          {
            "type": "code",
            "filename": "headers_example.txt",
            "lang": "text",
            "code": "Host: example.com\nContent-Type: application/json\nContent-Length: 47\nAuthorization: Bearer abcdef123456"
          },
          {
            "type": "p",
            "text": "ヘッダーには次のような情報が含まれます。"
          },
          {
            "type": "ul",
            "items": [
              "Host：どのドメイン宛てのリクエストかを示す",
              "Content-Type：ボディのデータ形式を示す",
              "Content-Length：ボディのサイズ（バイト数）",
              "Authorization：認証情報（トークンなど）"
            ]
          },
          {
            "type": "p",
            "text": "ヘッダーは1行につき1つの情報を持ち、必要に応じて増減します。"
          },
          {
            "type": "p",
            "text": "③ 空行（重要）\n\nヘッダーの最後には必ず1行の空行が入ります。"
          },
          {
            "type": "p",
            "text": "この空行は「ここまでがヘッダーで、ここからがボディである」という区切りを示します。"
          },
          {
            "type": "p",
            "text": "この空行がないと、サーバーはどこからがボディなのかを正しく判断できません。"
          },
          {
            "type": "p",
            "text": "④ ボディ（Body）\n\nボディは、サーバーに送信したい実際のデータそのものです。"
          },
          {
            "type": "code",
            "filename": "body_example.json",
            "lang": "json",
            "code": "{\n  \"name\": \"Alice\",\n  \"age\": 20\n}"
          },
          {
            "type": "p",
            "text": "ボディは主に POST / PUT / PATCH リクエストで使用されます。JSON・フォームデータ・ファイルなど、用途に応じた形式が存在します。"
          },
          {
            "type": "p",
            "text": "一方で、GET リクエストには通常ボディは含まれません。HTTP仕様上、GET にボディを含めることは禁止されてはいませんが、多くのサーバー・フレームワーク・ブラウザがこれを想定しておらず、実運用では使われません。"
          },
          {
            "type": "p",
            "text": "そのため、GET リクエストでデータを送る場合は、URL のクエリパラメータ（?key=value の形式）を使用します。"
          },
          {
            "type": "p",
            "text": "FastAPI でも同様に、GET リクエストではクエリパラメータを使い、POST や PUT ではリクエストボディを使う、という設計が推奨されています。"
          },
          {
            "type": "p",
            "text": "⑤ 全体のまとめ\n\nHTTPリクエストとは、「どこに」「何をしてほしいか」をリクエストラインで示し、「どのような情報か」をヘッダーで補足し、「実際のデータ」をボディで送る仕組みです。"
          },
          {
            "type": "p",
            "text": "特に GET リクエストはボディを持たず、状態を変更しない参照操作として設計されている点を理解することが、正しいAPI設計の第一歩となります。"
          }
        ]
      },
      {
        "id": "http-response-format",
        "title": "HTTPレスポンスの形式",
        "summary": "HTTPレスポンスはサーバーからクライアントへ返されるメッセージであり、ステータスライン・ヘッダー・空行・ボディの4つの要素で構成されます。",
        "content": [
          {
            "type": "p",
            "text": "HTTPレスポンスとは、クライアントからのリクエストに対してサーバーが返す「応答メッセージ」です。ブラウザが画面を表示できるのは、このレスポンスを受け取って内容を解釈しているからです。"
          },
          {
            "type": "p",
            "text": "HTTPレスポンスもリクエストと同様に、単なるテキストの集合で構成されています。構造は大きく4つの要素に分かれます。"
          },
          {
            "type": "ul",
            "items": [
              "ステータスライン（Status Line）",
              "ヘッダー（Headers）",
              "空行（空白行）",
              "ボディ（Body）"
            ]
          },
          {
            "type": "p",
            "text": "まずは、典型的なHTTPレスポンスの例を見てみましょう。"
          },
          {
            "type": "code",
            "filename": "raw_http_response.txt",
            "lang": "text",
            "code": "HTTP/1.1 200 OK\nContent-Type: application/json\nContent-Length: 56\n\n{\n  \"id\": 1,\n  \"name\": \"Alice\",\n  \"age\": 20\n}"
          },
          {
            "type": "p",
            "text": "これが1つのHTTPレスポンスです。ここから各構成要素を順番に見ていきます。"
          },
          {
            "type": "p",
            "text": "① ステータスライン（Status Line）\n\nHTTP/1.1 200 OK\n\nこの1行目をステータスラインと呼びます。"
          },
          {
            "type": "p",
            "text": "ステータスラインは次の3つの要素で構成されます。"
          },
          {
            "type": "ul",
            "items": [
              "HTTPバージョン（HTTP/1.1）",
              "ステータスコード（200）",
              "ステータスメッセージ（OK）"
            ]
          },
          {
            "type": "p",
            "text": "ステータスコードは、リクエストの処理結果を数値で表します。200 は「正常に処理された」ことを意味します。"
          },
          {
            "type": "p",
            "text": "ステータスメッセージ（OK など）は人間向けの補足情報であり、プログラム上の処理では主にステータスコードが利用されます。"
          },
          {
            "type": "p",
            "text": "② ヘッダー（Headers）\n\nステータスラインの次に続くのがヘッダーです。レスポンスに関する補足情報が含まれます。"
          },
          {
            "type": "code",
            "filename": "response_headers.txt",
            "lang": "text",
            "code": "Content-Type: application/json\nContent-Length: 56"
          },
          {
            "type": "p",
            "text": "主なレスポンスヘッダーの意味は以下の通りです。"
          },
          {
            "type": "ul",
            "items": [
              "Content-Type：レスポンスボディのデータ形式",
              "Content-Length：ボディのサイズ（バイト数）"
            ]
          },
          {
            "type": "p",
            "text": "レスポンスヘッダーは、クライアントがレスポンスの内容を正しく解釈するための補助情報を提供します。"
          },
          {
            "type": "p",
            "text": "③ 空行（重要）\n\nヘッダーの後には必ず1行の空行が入ります。この空行が「ここまでがヘッダーで、ここからがボディである」という境界を示します。"
          },
          {
            "type": "p",
            "text": "④ ボディ（Body）\n\nボディは、サーバーがクライアントに返したい実際のデータ本体です。"
          },
          {
            "type": "code",
            "filename": "response_body.json",
            "lang": "json",
            "code": "{\n  \"id\": 1,\n  \"name\": \"Alice\",\n  \"age\": 20\n}"
          },
          {
            "type": "p",
            "text": "JSON形式のレスポンスでは、クライアント（ブラウザやアプリケーション）はこのデータを解析して画面表示や処理を行います。"
          },
          {
            "type": "p",
            "text": "HTTPレスポンスは、クライアントが送ったリクエストに対する「結果」を表すものであり、サーバーが何をしたかを明確に示します。"
          },
          {
            "type": "p",
            "text": "⑤ 全体のまとめ\n\nHTTPレスポンスは「処理結果を伝えるメッセージ」であり、ステータスラインで結果の概要を示し、ヘッダーで補足情報を伝え、ボディで実際のデータを返します。"
          },
          {
            "type": "p",
            "text": "FastAPIでは、このレスポンス生成をフレームワークが自動的に行い、開発者は返したいデータをPythonオブジェクトとして返すだけで済むようになっています。"
          }
        ]
      }      
      
    ]
  },
  {
    "key": "application-patterns",
    "title": "アプリケーションの運用・開発パターン（応用モード）",
    "lessons": [
      {
        "id": "separated-vs-nonseparated",
        "title": "分離式と非分離式",
        "summary": "非分離式ではサーバーがデータ取得とHTML生成を一括で行い、完成したHTMLを返します。分離式ではフロントエンド（静的配信）とバックエンド（データ提供）が分かれ、ブラウザ上のJavaScriptがHTMLとデータを組み合わせて画面を構築します。",
        "content": [
          {
            "type": "p",
            "text": "本節では、Webアプリケーションの代表的な開発方式である「非分離式」と「分離式」について、実際の実行フロー（ユーザーの操作から画面表示までの流れ）に沿って整理します。"
          },
          {
            "type": "p",
            "text": "■ 非分離式の実行フロー\n非分離式では、サーバーは1台（1つのアプリケーション）として動作します。ユーザーがブラウザからサーバーへリクエストを送ると、サーバーはそのリクエスト内容に基づいてデータベースから必要なデータを検索します。次に、そのデータをHTMLテンプレートに埋め込み（データをページに“镶嵌”するイメージ）、完成したHTMLページ全体をブラウザへ返します。ブラウザは受け取った完成済みのHTMLをそのまま表示するため、画面生成は基本的にサーバー側で完結します。"
          },
          {
            "type": "p",
            "text": "▼ 非分離式（モノリシック）実行フロー図"
          },
          {
            "type": "code",
            "filename": "monolithic_diagram.txt",
            "lang": "text",
            "code": "┌──────────────┐\n│   ブラウザ    │\n│（ユーザー）   │\n└──────┬───────┘\n       │ HTTPリクエスト\n       ▼\n┌────────────────────────────┐\n│        Webサーバー           │\n│  （アプリケーション本体）     │\n│                            │\n│  ・リクエスト受信             │\n│  ・DBから必要データ取得       │\n│  ・HTMLテンプレートへ埋め込み │\n│  ・完成HTMLを生成            │\n│                            │\n│  ┌──────────────┐         │\n│  │ データベース │         │\n│  └──────────────┘         │\n└──────────┬────────────────┘\n           │ 完成したHTML（ページ全体）\n           ▼\n┌──────────────┐\n│   ブラウザ    │\n│（完成画面表示）│\n└──────────────┘"
          },
          {
            "type": "p",
            "text": "■ 分離式の実行フロー\n分離式では、バックエンドサーバーとフロントエンドサーバーが分かれています。フロントエンドサーバーは基本的に静的なサーバーであり、HTML（およびCSS・JavaScriptなどの静的ファイル）を配信します。一方、バックエンドサーバーはデータを担当し、必要なデータをデータベースから取得して返す役割を持ちます。"
          },
          {
            "type": "p",
            "text": "ユーザーがブラウザ上のページから何らかの操作を行い、データが必要になるタイミングでリクエストが発生すると、バックエンドサーバーがデータベースからデータを取り出して返します。同時に、フロントエンド側が提供しているHTML（および画面の雛形）と、そのデータがブラウザ上で合流し、ブラウザ上で動作するJavaScriptが両者を組み合わせて画面を構築します。つまり、分離式では「画面の組み立て（表示の完成）」がブラウザ側のJavaScriptで行われる点が特徴です。"
          },
          {
            "type": "p",
            "text": "▼ 分離式（フロントエンド・バックエンド分離）実行フロー図"
          },
          {
            "type": "code",
            "filename": "separated_diagram.txt",
            "lang": "text",
            "code": "          （最初のアクセス）\n┌──────────────┐\n│   ブラウザ    │\n└──────┬───────┘\n       │ HTML / JS / CSS（静的ファイル）\n       ▼\n┌──────────────────────┐\n│  フロントエンドサーバー │\n│（静的ファイル配信）    │\n└─────────┬──────────┘\n          │ ブラウザでJavaScriptが実行される\n          ▼\n   ┌──────────────────┐\n   │   ブラウザ内JS    │\n   │（画面制御・通信） │\n   └─────────┬────────┘\n             │ データ取得のためのリクエスト\n             ▼\n┌──────────────────────┐\n│   バックエンドサーバー │\n│（データ担当：API等）   │\n│  ・DBからデータ取得    │\n│  ・データを返す         │\n└─────────┬──────────┘\n          │ データ（例：JSON）\n          ▼\n   ┌──────────────────┐\n   │   ブラウザ内JS    │\n   │ HTMLとデータを組合せ│\n   │ 画面を完成させる   │\n   └──────────────────┘"
          },
          {
            "type": "p",
            "text": "このように、非分離式は「サーバーがデータ取得からHTML生成までをまとめて行い、完成したHTMLを返す」方式であり、分離式は「フロントエンド（静的配信）とバックエンド（データ提供）が分かれ、ブラウザ上でHTMLとデータをJavaScriptが組み合わせて画面を作る」方式です。"
          },
          {
            "type": "p",
            "text": "分離式の構成では、バックエンドはデータ提供に特化し、フロントエンドは画面の雛形や表示ロジックを担当します。その結果、画面変更とデータ処理を別々に開発・運用しやすくなる一方、API通信や認証など、設計上考えるべきポイントが増えることもあります。"
          }
        ]
      },
      {
        "id": "restful-architecture",
        "title": "RESTful 開発規約とは何か",
        "summary": "REST（Representational State Transfer）は、HTTPを用いてリソースを操作するための設計思想であり、フロントエンドとバックエンドを明確に分離するための基盤となる考え方です。",
        "content": [
          {
            "type": "p",
            "text": "REST（Representational State Transfer）とは、Webアプリケーションを設計する際の考え方・設計思想の一つです。RESTは特定の技術やフレームワークを指すものではなく、「どのようにHTTPを使ってシステムを設計するか」というルールの集合です。"
          },
          {
            "type": "p",
            "text": "RESTの最大の特徴は、「リソース（Resource）」という考え方を中心にシステムを設計する点にあります。RESTでは、URLは操作ではなく“対象そのもの”を表します。"
          },
          {
            "type": "p",
            "text": "例えば、ユーザーというリソースは /users、特定のユーザーは /users/1 のように表現されます。URLはあくまで“何を扱うか”を示し、実際の処理内容はHTTPメソッドによって区別されます。"
          },
          {
            "type": "p",
            "text": "RESTでは、操作の種類をURLではなくHTTPメソッドで表現します。代表的な対応関係は以下の通りです。"
          },
          {
            "type": "ul",
            "items": [
              "GET：リソースを取得する",
              "POST：新しいリソースを作成する",
              "PUT：リソース全体を更新する",
              "PATCH：リソースの一部を更新する",
              "DELETE：リソースを削除する"
            ]
          },
          {
            "type": "p",
            "text": "このように、RESTでは「動詞はHTTPメソッドで表し、URLは名詞（リソース）で表す」という設計を行います。"
          },
          {
            "type": "p",
            "text": "RESTのもう一つの重要な特徴は「ステートレス（Stateless）」であることです。これは、サーバーがクライアントの状態を保持しないことを意味します。各リクエストは、それ単体で完結しており、サーバーは過去のリクエストを記憶しません。"
          },
          {
            "type": "p",
            "text": "そのため、認証情報や必要なデータは、毎回のリクエストに含めて送信されます。実際の開発では、トークン（JWTなど）をHTTPヘッダーに含める形がよく使われます。"
          },
          {
            "type": "p",
            "text": "RESTはHTTPの仕組みと非常に相性が良く、HTTPのステータスコード、メソッド、ヘッダー、ボディと自然に対応します。"
          },
          {
            "type": "p",
            "text": "例えば、データ取得に成功した場合は 200 OK、存在しないリソースを指定した場合は 404 Not Found、認証が必要な場合は 401 Unauthorized といったように、HTTPステータスコードで結果を表現します。"
          },
          {
            "type": "p",
            "text": "RESTは特に分離式アーキテクチャと相性が良く、フロントエンドとバックエンドを明確に役割分担できます。フロントエンドはデータの表示とユーザー操作を担当し、バックエンドはデータの取得・保存・検証を担当します。"
          },
          {
            "type": "p",
            "text": "この構成により、フロントエンドとバックエンドを独立して開発・デプロイできるようになり、大規模開発やチーム開発に適した構造になります。"
          },
          {
            "type": "p",
            "text": "まとめると、RESTとは「HTTPを使ってリソースを操作するための設計思想」であり、URL・HTTPメソッド・ステータスコードを組み合わせることで、拡張性と可読性の高いAPIを実現します。"
          }
        ]
      }
      
    ]
  },
  {
    "key": "fastapi-practice",
    "title": "FastAPIの実践",
    "lessons": [
      {
        "id": "fastapi-minimal-app",
        "title": "最小構成のFastAPIアプリケーション",
        "summary": "FastAPIを使った最小構成のWebアプリケーションを作成し、FastAPIの基本構造と役割を理解します。",
        "content": [
          {
            "type": "p",
            "text": "この節では、FastAPIを使った最もシンプルなアプリケーションを作成し、その構造と意味を一つずつ解説します。まずは、FastAPIで「動く最小構成」を理解することが目的です。"
          },
          {
            "type": "p",
            "text": "以下は、FastAPIで最小限のWebアプリケーションを構成するコード例です。"
          },
          {
            "type": "code",
            "filename": "main.py",
            "lang": "python",
            "code": "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get(\"/\")\ndef read_root():\n    return {\"message\": \"Hello, FastAPI!\"}"
          },
          {
            "type": "p",
            "text": "このファイルだけで、FastAPIアプリケーションとして動作します。次に、それぞれの行が何をしているのかを詳しく見ていきましょう。"
          },
          {
            "type": "p",
            "text": "まず、`from fastapi import FastAPI` は、FastAPIフレームワークの中核となる `FastAPI` クラスを読み込んでいます。このクラスは、Webアプリケーション全体を管理するための中心的なオブジェクトです。"
          },
          {
            "type": "p",
            "text": "`FastAPI` クラスは、ルーティング・リクエスト処理・レスポンス生成など、Webアプリケーションとして必要な機能をすべてまとめて管理します。"
          },
          {
            "type": "p",
            "text": "次に、`app = FastAPI()` という行では、FastAPIクラスのインスタンスを生成しています。この `app` という変数が、アプリケーション本体になります。"
          },
          {
            "type": "p",
            "text": "この `app` オブジェクトは、後ほどルーティングの定義や設定の登録に使用され、FastAPIアプリ全体の入り口として機能します。"
          },
          {
            "type": "p",
            "text": "続いて、`@app.get(\"/\")` というデコレータが登場します。これは「HTTPのGETメソッドで、パス `/` にアクセスがあったときに、この関数を実行する」という意味です。"
          },
          {
            "type": "p",
            "text": "このように、FastAPIではデコレータを使ってURLと処理内容を結び付けます。これをルーティング（routing）と呼びます。"
          },
          {
            "type": "p",
            "text": "最後に定義されている `read_root` 関数は、実際にリクエストを受け取った際に実行される処理です。この関数が返す値が、そのままHTTPレスポンスとしてクライアントに返されます。"
          },
          {
            "type": "p",
            "text": "ここでは Python の辞書（dict）を返していますが、FastAPI はこれを自動的に JSON 形式へ変換して返します。"
          },
          {
            "type": "p",
            "text": "つまり、この最小構成のアプリでは、ブラウザで `http://localhost:8000/` にアクセスすると、次のようなレスポンスが返ってきます。"
          },
          {
            "type": "code",
            "filename": "response_example.json",
            "lang": "json",
            "code": "{\n  \"message\": \"Hello, FastAPI!\"\n}"
          },
          {
            "type": "p",
            "text": "このように、FastAPIでは非常に少ないコードでAPIを構築することができ、HTTPリクエストとPython関数を直感的に対応づけることができます。"
          },
          {
            "type": "p",
            "text": "次の節では、FastAPIでリクエストパラメータやパスパラメータをどのように受け取るかを学びます。"
          }
        ]
      },
      {
        "id": "fastapi-path-params",
        "title": "パスパラメータ（Path Parameters）",
        "summary": "URLの一部を変数として受け取り、リクエストごとに異なるデータを返す仕組みを学びます。FastAPIではパスパラメータを関数引数として受け取り、型注釈によって自動検証も行われます。",
        "content": [
          {
            "type": "p",
            "text": "パスパラメータ（Path Parameters）とは、URLの一部を「変数」として扱い、アクセスされた値に応じて処理を変える仕組みです。たとえば、ユーザーIDや記事IDなど、対象リソースを識別する番号をURLに含めたい場合に使われます。"
          },
          {
            "type": "p",
            "text": "例えば、次のようなURLを考えます。\n\n・/users/1\n・/users/2\n・/users/999\n\nこのとき、末尾の数字（1や2や999）をパスパラメータとして受け取り、ユーザー情報を返すAPIを作りたい、というのが典型的な用途です。"
          },
          {
            "type": "p",
            "text": "FastAPIでは、URLパスの中で `{}` を使ってパスパラメータを定義します。そして、同じ名前の引数を関数に用意すると、その値が自動的に渡されます。"
          },
          {
            "type": "code",
            "filename": "main.py",
            "lang": "python",
            "code": "from fastapi import FastAPI\n\napp = FastAPI()\n\n# 例：/users/1 のようにURL末尾の数字を user_id として受け取る\n@app.get(\"/users/{user_id}\")\ndef get_user(user_id: int):\n    return {\n        \"user_id\": user_id,\n        \"message\": f\"user_id={user_id} のユーザー情報を返します\"\n    }"
          },
          {
            "type": "p",
            "text": "この例では、`@app.get(\"/users/{user_id}\")` により、`/users/〇〇` という形式のURLへのGETアクセスを受け付けます。`{user_id}` の部分が変数になっており、ここに入った値が関数 `get_user` の引数 `user_id` に渡されます。"
          },
          {
            "type": "p",
            "text": "重要なのは、関数引数に `user_id: int` と型注釈を書いている点です。FastAPIはこの型注釈を使って、受け取った値を自動的に変換・検証します。"
          },
          {
            "type": "p",
            "text": "例えば、次のURLにアクセスすると：\n\nGET /users/123\n\nFastAPIは `{user_id}` に入った文字列 \"123\" を int に変換し、関数には `user_id=123`（整数）として渡します。"
          },
          {
            "type": "p",
            "text": "レスポンスは次のようになります（例）。"
          },
          {
            "type": "code",
            "filename": "response_example_123.json",
            "lang": "json",
            "code": "{\n  \"user_id\": 123,\n  \"message\": \"user_id=123 のユーザー情報を返します\"\n}"
          },
          {
            "type": "p",
            "text": "では、もし `/users/abc` のように数字ではない文字列を送ったらどうなるでしょうか。"
          },
          {
            "type": "p",
            "text": "この場合、`user_id: int` に変換できないため、FastAPIは自動的にエラー（バリデーションエラー）を返します。開発者が明示的にif文でチェックしなくても、型注釈にもとづいて入力検証が行われるのがFastAPIの大きな特徴です。"
          },
          {
            "type": "p",
            "text": "実際には、次のようなエラーが返されます（内容は環境によって多少異なりますが、基本構造は同じです）。"
          },
          {
            "type": "code",
            "filename": "error_example.json",
            "lang": "json",
            "code": "{\n  \"detail\": [\n    {\n      \"type\": \"int_parsing\",\n      \"loc\": [\"path\", \"user_id\"],\n      \"msg\": \"Input should be a valid integer\",\n      \"input\": \"abc\"\n    }\n  ]\n}"
          },
          {
            "type": "p",
            "text": "このエラーは、どこで（loc）、何が（msg）問題だったのかが構造化されて返るため、API利用者にとっても非常に分かりやすい形式になります。"
          },
          {
            "type": "p",
            "text": "まとめると、パスパラメータは「URLの一部を変数として受け取る仕組み」であり、FastAPIでは `{}` と関数引数を対応させることで自然に受け取れます。さらに型注釈によって自動変換と自動検証が行われるため、堅牢で読みやすいAPIを作りやすくなります。"
          }
        ]
      },
      {
        "id": "fastapi-query-params",
        "title": "クエリパラメータ（Query Parameters / リクエストパラメータ）",
        "summary": "URLの末尾に `?key=value` 形式で付けるクエリパラメータを学びます。FastAPIでは関数引数として受け取り、型注釈により自動変換・自動検証が行われます。",
        "content": [
          {
            "type": "p",
            "text": "クエリパラメータ（Query Parameters）とは、URLの末尾に `?key=value` の形で付ける追加情報です。日本語では「リクエストパラメータ」と呼ばれることもあります。主に「検索条件」「並び替え」「ページング」「フィルタ」など、同じリソースに対して条件を変えて取得したいときに使われます。"
          },
          {
            "type": "p",
            "text": "例えば、ユーザー一覧を取得するAPIを考えると、次のような要求がよくあります。\n\n・アクティブなユーザーだけを取得したい\n・最大で何件返すかを指定したい\n・検索キーワードで絞り込みたい"
          },
          {
            "type": "p",
            "text": "このようなときに、URLパス自体（/users や /users/1）は変えずに、条件をクエリパラメータで渡します。"
          },
          {
            "type": "p",
            "text": "例：\n\n・GET /users?limit=10\n・GET /users?active=true\n・GET /users?keyword=alice&limit=5"
          },
          {
            "type": "p",
            "text": "FastAPIでは、関数引数として定義したパラメータが、パスに含まれていない場合は基本的にクエリパラメータとして扱われます。以下のコードでは、ユーザー一覧を取得する `/users` を作り、クエリパラメータで絞り込み条件を受け取る例を示します。"
          },
          {
            "type": "code",
            "filename": "main.py",
            "lang": "python",
            "code": "from fastapi import FastAPI\n\napp = FastAPI()\n\n# 例：/users?limit=10&active=true&keyword=alice\n@app.get(\"/users\")\ndef list_users(limit: int = 10, active: bool = False, keyword: str | None = None):\n    return {\n        \"limit\": limit,\n        \"active\": active,\n        \"keyword\": keyword,\n        \"message\": \"指定された条件でユーザー一覧を返す想定です\"\n    }"
          },
          {
            "type": "p",
            "text": "この例では、`/users` というパスに対してGETリクエストを受け付けます。関数 `list_users` の引数がそのままクエリパラメータになります。"
          },
          {
            "type": "p",
            "text": "それぞれの引数の意味は次の通りです。"
          },
          {
            "type": "ul",
            "items": [
              "`limit: int = 10`：返す件数の上限。指定がない場合はデフォルトで10。",
              "`active: bool = False`：アクティブユーザーのみ返すかどうか。指定がない場合はFalse。",
              "`keyword: str | None = None`：検索キーワード。指定がない場合はNone（絞り込みなし）。"
            ]
          },
          {
            "type": "p",
            "text": "ここで重要なのは、引数に「デフォルト値」を設定している点です。デフォルト値があるパラメータは必須ではなく、指定がなければその値が使われます。"
          },
          {
            "type": "p",
            "text": "実際に次のようなアクセスをすると：\n\nGET /users\n\nクエリパラメータが何も指定されていないため、デフォルト値が使われます。"
          },
          {
            "type": "p",
            "text": "このときのレスポンス例は次のようになります。"
          },
          {
            "type": "code",
            "filename": "response_default.json",
            "lang": "json",
            "code": "{\n  \"limit\": 10,\n  \"active\": false,\n  \"keyword\": null,\n  \"message\": \"指定された条件でユーザー一覧を返す想定です\"\n}"
          },
          {
            "type": "p",
            "text": "次に、条件を指定してアクセスしてみます。\n\nGET /users?limit=5&active=true&keyword=alice"
          },
          {
            "type": "p",
            "text": "この場合、FastAPIはクエリ文字列から値を読み取り、型注釈に従って自動的に変換します。つまり、`limit` は文字列 \"5\" ではなく整数 5 として、`active` は文字列 \"true\" ではなく真偽値 True として関数に渡されます。"
          },
          {
            "type": "p",
            "text": "レスポンス例は次の通りです。"
          },
          {
            "type": "code",
            "filename": "response_with_params.json",
            "lang": "json",
            "code": "{\n  \"limit\": 5,\n  \"active\": true,\n  \"keyword\": \"alice\",\n  \"message\": \"指定された条件でユーザー一覧を返す想定です\"\n}"
          },
          {
            "type": "p",
            "text": "もし `limit=abc` のように数値ではない値が渡された場合、`limit: int` に変換できないため、FastAPIは自動的にバリデーションエラーを返します。開発者が手作業でチェックしなくても、型注釈に基づいて入力検証が行われる点がFastAPIの強みです。"
          },
          {
            "type": "p",
            "text": "ここで、クエリパラメータにおいて重要になるのが `None`、`Union[]`、`Optional[]` の使い方です。これらは「そのパラメータが省略可能である」ことを型として明示するために使われます。"
          },
          {
            "type": "p",
            "text": "`None` をデフォルト値として指定すると、そのクエリパラメータは必須ではなくなります。例えば `keyword: str | None = None` は、「文字列または None を受け取る」「指定がなければ None になる」という意味です。"
          },
          {
            "type": "p",
            "text": "Python 3.10 以降では、`str | None` のような書き方が可能ですが、これは内部的には `Union[str, None]` と同じ意味になります。"
          },
          {
            "type": "p",
            "text": "つまり、次の2つの書き方は意味的に等価です。"
          },
          {
            "type": "code",
            "filename": "type_union_example.py",
            "lang": "python",
            "code": "def example_a(keyword: str | None = None):\n    ...\n\nfrom typing import Union\n\ndef example_b(keyword: Union[str, None] = None):\n    ..."
          },
          {
            "type": "p",
            "text": "また、`Optional[str]` という書き方もよく使われます。`Optional[str]` は `Union[str, None]` の省略表現であり、「str または None」を意味します。"
          },
          {
            "type": "p",
            "text": "したがって、FastAPIのクエリパラメータでは、次の3つの書き方はすべて同じ意味になります。"
          },
          {
            "type": "code",
            "filename": "optional_types_example.py",
            "lang": "python",
            "code": "keyword: str | None = None\nkeyword: Union[str, None] = None\nkeyword: Optional[str] = None"
          },
          {
            "type": "p",
            "text": "これらを使うことで、「指定されてもよいし、されなくてもよいクエリパラメータ」を型レベルで明確に表現できます。FastAPIはこの型情報をもとに、必須・任意の判定やバリデーションを自動的に行います。"
          },
          {
            "type": "p",
            "text": "パスパラメータとの使い分けを整理すると次の通りです。"
          },
          {
            "type": "ul",
            "items": [
              "パスパラメータ：リソースを一意に特定する（例：/users/1 の `1`）",
              "クエリパラメータ：同じリソースに条件を付ける（例：/users?limit=10）"
            ]
          },
          {
            "type": "p",
            "text": "まとめると、クエリパラメータは「検索条件や絞り込み条件をURLで渡す仕組み」であり、FastAPIでは関数引数として自然に受け取れます。さらに `None`・`Union`・`Optional` を使うことで、省略可能なパラメータを型として明確に表現でき、安全で読みやすいAPI設計につながります。"
          }
        ]
      },
      
      {
        "id": "fastapi-include-router",
        "title": "include_router と prefix（ルーティング分割の基本）",
        "summary": "FastAPIの include_router を使うと、ルーティング定義をファイル単位・機能単位で分割でき、コードの見通しと保守性が大きく向上します。prefix を使えば、まとめてURLの共通前置きを付けられます。",
        "content": [
          {
            "type": "p",
            "text": "FastAPIでAPIが増えてくると、すべてのルーティングを main.py に書き続けるのは現実的ではありません。ファイルが肥大化し、どこに何があるか分かりにくくなり、変更の影響範囲も見えにくくなります。"
          },
          {
            "type": "p",
            "text": "そこで使うのが `include_router` です。`include_router` は、別ファイルに定義したルーティング（APIRouter）を、アプリ本体（FastAPIインスタンス）に「取り込む」ための仕組みです。"
          },
          {
            "type": "p",
            "text": "まず、理解しやすいように、以下のような“想定ディレクトリ構成”を作ります。"
          },
          {
            "type": "code",
            "filename": "project_structure.txt",
            "lang": "text",
            "code": "myapp/\n├── main.py\n└── routers/\n    ├── __init__.py\n    ├── users.py\n    └── items.py"
          },
          {
            "type": "p",
            "text": "ここでは、`routers/` ディレクトリに機能ごとのルーティングを分離します。例えば、ユーザー関連は users.py、商品（またはアイテム）関連は items.py というように分けます。"
          },
          {
            "type": "p",
            "text": "次に、routers/users.py で `APIRouter` を使ってルーティングを定義します。ポイントは、`app = FastAPI()` は作らず、代わりに `router = APIRouter()` を作ることです。"
          },
          {
            "type": "code",
            "filename": "routers/users.py",
            "lang": "python",
            "code": "from fastapi import APIRouter\n\nrouter = APIRouter()\n\n@router.get(\"/\")\ndef list_users():\n    return {\"message\": \"ユーザー一覧\"}\n\n@router.get(\"/{user_id}\")\ndef get_user(user_id: int):\n    return {\"message\": f\"user_id={user_id} のユーザー詳細\"}"
          },
          {
            "type": "p",
            "text": "このファイルの中では `@router.get(...)` のように router を使ってルーティングを定義します。つまり、ユーザー関連のエンドポイント定義は users.py に閉じ込められます。"
          },
          {
            "type": "p",
            "text": "同様に、routers/items.py も用意します。"
          },
          {
            "type": "code",
            "filename": "routers/items.py",
            "lang": "python",
            "code": "from fastapi import APIRouter\n\nrouter = APIRouter()\n\n@router.get(\"/\")\ndef list_items():\n    return {\"message\": \"アイテム一覧\"}\n\n@router.get(\"/{item_id}\")\ndef get_item(item_id: int):\n    return {\"message\": f\"item_id={item_id} のアイテム詳細\"}"
          },
          {
            "type": "p",
            "text": "ここまでで、users.py と items.py にルーティングを分割できました。しかし、このままでは FastAPI アプリ本体はこれらのルーティングを知らないので、実際には動きません。"
          },
          {
            "type": "p",
            "text": "そこで main.py で `include_router` を使い、分割したルーティングをアプリに取り込みます。"
          },
          {
            "type": "code",
            "filename": "main.py",
            "lang": "python",
            "code": "from fastapi import FastAPI\n\nfrom routers import users, items\n\napp = FastAPI()\n\napp.include_router(users.router, prefix=\"/users\")\napp.include_router(items.router, prefix=\"/items\")"
          },
          {
            "type": "p",
            "text": "`app.include_router(users.router, prefix=\"/users\")` は、「users.py の router をアプリに取り込み、すべてのルートに /users を先頭に付ける」という意味です。"
          },
          {
            "type": "p",
            "text": "この設定により、users.py 内では `@router.get(\"/\")` と書いていても、実際のURLは次のようになります。"
          },
          {
            "type": "ul",
            "items": [
              "users.py の `@router.get(\"/\")` → GET /users",
              "users.py の `@router.get(\"/{user_id}\")` → GET /users/{user_id}"
            ]
          },
          {
            "type": "p",
            "text": "同様に items.py も、prefix=\"/items\" によって次のURLになります。"
          },
          {
            "type": "ul",
            "items": [
              "items.py の `@router.get(\"/\")` → GET /items",
              "items.py の `@router.get(\"/{item_id}\")` → GET /items/{item_id}"
            ]
          },
          {
            "type": "p",
            "text": "ここで `prefix` の役割が重要です。`prefix` を使うと、各ルーター内のパス定義をシンプルに保ったまま、URLの階層構造を綺麗に設計できます。"
          },
          {
            "type": "p",
            "text": "もし prefix を使わずに users.py 側で `/users` を毎回書くと、次のようになりがちです：\n\n@router.get(\"/users\")\n@router.get(\"/users/{user_id}\")\n\nこれでも動きますが、ルーティングが増えるほど重複が増え、管理が大変になります。prefix を使うことで「共通部分は main.py 側で一括管理」「各機能の詳細は routers 配下で管理」という分業が可能になります。"
          },
          {
            "type": "p",
            "text": "まとめると、include_router は「ルーティングを分割して取り込む仕組み」、prefix は「そのルーター群に共通するURLの先頭を一括で付ける仕組み」です。FastAPIで実務的な構成を作るうえで必須の基本テクニックになります。"
          }
        ]
      },
      {
        "id": "fastapi-request-body",
        "title": "リクエストボディ（Request Body）と BaseModel",
        "summary": "FastAPIでPOSTやPUTリクエストのボディデータを受け取る方法を学びます。PydanticのBaseModelを使うことで、リクエストデータの構造定義・型変換・バリデーションを自動化できます。",
        "content": [
          {
            "type": "p",
            "text": "これまで見てきたパスパラメータやクエリパラメータは、主にURLからデータを受け取る方法でした。一方で、POSTやPUTリクエストでは、より多くのデータをHTTPリクエストの本文（リクエストボディ）に含めて送信するのが一般的です。"
          },
          {
            "type": "p",
            "text": "例えば「ユーザーを新規作成する」「記事を投稿する」「フォームの内容を送信する」といった処理では、JSON形式のデータをリクエストボディとして送ります。"
          },
          {
            "type": "p",
            "text": "FastAPIでは、リクエストボディの受け取りに Pydantic の `BaseModel` を使います。これにより、リクエストデータの構造を明示的に定義でき、型チェックやバリデーションを自動で行うことができます。"
          },
          {
            "type": "p",
            "text": "まず、リクエストボディとして受け取りたいデータ構造を `BaseModel` を継承したクラスとして定義します。以下は、ユーザー作成APIの例です。"
          },
          {
            "type": "code",
            "filename": "models.py",
            "lang": "python",
            "code": "from pydantic import BaseModel\n\nclass UserCreate(BaseModel):\n    name: str\n    age: int\n    email: str"
          },
          {
            "type": "p",
            "text": "この `UserCreate` クラスは、「リクエストボディには name（文字列）、age（整数）、email（文字列）が含まれている必要がある」というルールを表しています。"
          },
          {
            "type": "p",
            "text": "次に、この BaseModel をFastAPIのエンドポイントで使います。関数引数としてBaseModel型を指定すると、FastAPIは自動的にリクエストボディをそのモデルとして解釈します。"
          },
          {
            "type": "code",
            "filename": "main.py",
            "lang": "python",
            "code": "from fastapi import FastAPI\nfrom models import UserCreate\n\napp = FastAPI()\n\n@app.post(\"/users\")\ndef create_user(user: UserCreate):\n    return {\n        \"message\": \"ユーザーを作成しました\",\n        \"user\": user\n    }"
          },
          {
            "type": "p",
            "text": "ここで重要なのは、`user: UserCreate` という書き方です。この1行だけで、「このエンドポイントはJSON形式のリクエストボディを受け取り、それを UserCreate として扱う」という意味になります。"
          },
          {
            "type": "p",
            "text": "例えば、次のようなHTTPリクエストを送るとします。"
          },
          {
            "type": "code",
            "filename": "request_example.json",
            "lang": "json",
            "code": "{\n  \"name\": \"Alice\",\n  \"age\": 25,\n  \"email\": \"alice@example.com\"\n}"
          },
          {
            "type": "p",
            "text": "FastAPIはこのJSONを読み取り、内部で `UserCreate` のインスタンスを生成します。その際、型の変換や必須項目のチェックが自動的に行われます。"
          },
          {
            "type": "p",
            "text": "もし `age` が文字列だったり、`email` が欠けていた場合は、エンドポイントの処理が実行される前に、FastAPIが自動的にバリデーションエラーを返します。"
          },
          {
            "type": "p",
            "text": "この仕組みにより、開発者は「正しいデータが渡ってくる前提」でビジネスロジックを書くことができ、if文だらけの入力チェックを書く必要がなくなります。"
          },
          {
            "type": "p",
            "text": "また、BaseModelを使うと、OpenAPI（Swagger）ドキュメントにもリクエストボディの構造が自動的に反映されます。そのため、API仕様書を別途手書きする必要もありません。"
          },
          {
            "type": "p",
            "text": "まとめると、FastAPIにおけるリクエストボディ処理の基本は「BaseModelでデータ構造を定義し、それを関数引数として受け取る」ことです。これにより、型安全で保守性の高いAPIを簡潔に実装できます。"
          }
        ]
      },
      {
        "id": "fastapi-request-body-custom-validation",
        "title": "リクエストボディの追加バリデーション：BaseModelに自作検証関数を追加する",
        "summary": "BaseModelは型チェックだけでなく、自分で書いた関数（バリデータ）で入力内容を追加検証できます。ここでは前の小節の UserCreate を拡張し、「name は英字のみ」などの独自ルールを適用する方法を学びます。",
        "content": [
          {
            "type": "p",
            "text": "前の小節では、リクエストボディを `BaseModel` で受け取り、型注釈によって自動的に検証できることを学びました。ただし実務では、型が合っているだけでは不十分なことが多いです。例えば、`name` が文字列であっても「英字のみ」などの追加ルールを課したい場合があります。"
          },
          {
            "type": "p",
            "text": "このような「型以外の独自ルール」をチェックしたいときに使うのが、BaseModelにバリデーション関数（自作検証関数）を追加する方法です。Pydanticでは、フィールドごとに検証関数を紐付けることができます。"
          },
          {
            "type": "p",
            "text": "ここでは前の小節の例をそのまま拡張し、`UserCreate` に次のルールを追加します。\n\n・name：英字のみ許可（例：Alice はOK、Alice123 はNG）\n・age：0より大きく、100未満（0 < age < 100）\n\n※ age の範囲は Field でも表現できますが、ここでは「自作関数で検証する」例として扱います。"
          },
          {
            "type": "p",
            "text": "まず、`UserCreate` を定義している BaseModel を更新します。Pydantic v2 では `@field_validator` を使って、特定のフィールドに対する検証関数を定義できます。"
          },
          {
            "type": "code",
            "filename": "models.py",
            "lang": "python",
            "code": "from pydantic import BaseModel, field_validator\n\n\nclass UserCreate(BaseModel):\n    name: str\n    age: int\n    email: str\n\n    # name に対する独自バリデーション（英字のみ）\n    @field_validator(\"name\")\n    @classmethod\n    def validate_name(cls, v: str) -> str:\n        if not v.isalpha():\n            raise ValueError(\"name は英字のみ許可されます（例：Alice）\")\n        return v\n\n    # age に対する独自バリデーション（0 < age < 100）\n    @field_validator(\"age\")\n    @classmethod\n    def validate_age(cls, v: int) -> int:\n        if v <= 0:\n            raise ValueError(\"age は 0 より大きい値である必要があります\")\n        if v >= 100:\n            raise ValueError(\"age は 100 未満である必要があります\")\n        return v"
          },
          {
            "type": "p",
            "text": "ここでのポイントは次の通りです。"
          },
          {
            "type": "ul",
            "items": [
              "`@field_validator(\"name\")`：name フィールドが検証対象であることを指定する",
              "検証関数は `@classmethod` として定義し、引数 `v` に入力値が入る",
              "条件を満たさない場合は `ValueError` を投げる（FastAPIでは 422 エラーになる）",
              "最後に `return v` を返す（問題ない値として採用する）"
            ]
          },
          {
            "type": "p",
            "text": "次に、前の小節と同様に、この `UserCreate` をリクエストボディとして受け取るエンドポイントを用意します（ここは前の小節の形を維持します）。"
          },
          {
            "type": "code",
            "filename": "main.py",
            "lang": "python",
            "code": "from fastapi import FastAPI\nfrom models import UserCreate\n\napp = FastAPI()\n\n\n@app.post(\"/users\")\ndef create_user(user: UserCreate):\n    return {\n        \"message\": \"ユーザーを作成しました\",\n        \"user\": user\n    }"
          },
          {
            "type": "p",
            "text": "このAPIに対して、例えば次のようなリクエストボディを送るとします。"
          },
          {
            "type": "code",
            "filename": "request_ok.json",
            "lang": "json",
            "code": "{\n  \"name\": \"Alice\",\n  \"age\": 25,\n  \"email\": \"alice@example.com\"\n}"
          },
          {
            "type": "p",
            "text": "この場合、name は英字のみで、age も 0 < age < 100 を満たすため、正常に処理されます。"
          },
          {
            "type": "p",
            "text": "一方で、次のように name に数字が混ざっていると、`validate_name` が `ValueError` を投げるため、FastAPIは自動的にバリデーションエラー（422）を返します。"
          },
          {
            "type": "code",
            "filename": "request_ng_name.json",
            "lang": "json",
            "code": "{\n  \"name\": \"Alice123\",\n  \"age\": 25,\n  \"email\": \"alice@example.com\"\n}"
          },
          {
            "type": "p",
            "text": "また age についても、次のように 0 や 100 以上を送ると `validate_age` がエラーを返し、同様に 422 になります。"
          },
          {
            "type": "code",
            "filename": "request_ng_age.json",
            "lang": "json",
            "code": "{\n  \"name\": \"Alice\",\n  \"age\": 0,\n  \"email\": \"alice@example.com\"\n}"
          },
          {
            "type": "p",
            "text": "このように、BaseModelに自作の検証関数を追加すると「型は合っているが内容として不正」な入力を確実に弾けるようになります。フォーム入力の品質を守りたい場面や、APIの仕様を厳密にしたい場面で非常に重要なテクニックです。"
          }
        ]
      },
      {
        "id": "fastapi-request-body-nested-model",
        "title": "ネストした BaseModel による型検証（Nested Models）",
        "summary": "BaseModel は他の BaseModel をフィールドとして持つことができます。これにより、JSONの入れ子構造をそのまま型として表現し、階層ごとに自動バリデーションを行えます。",
        "content": [
          {
            "type": "p",
            "text": "これまでの例では、リクエストボディのフィールドはすべて `str` や `int` などの単純な型でした。しかし実際のAPIでは、データが入れ子構造（ネスト構造）になっていることがよくあります。"
          },
          {
            "type": "p",
            "text": "例えば、「ユーザー情報の中に住所情報が含まれている」「注文データの中に複数の商品データが含まれている」といったケースです。このような構造を、FastAPI + Pydantic では BaseModel のネストで自然に表現できます。"
          },
          {
            "type": "p",
            "text": "ここでは次のようなJSONを受け取るAPIを例にします。ユーザーの中に `address` というオブジェクトが含まれています。"
          },
          {
            "type": "code",
            "filename": "request_example.json",
            "lang": "json",
            "code": "{\n  \"name\": \"Alice\",\n  \"age\": 25,\n  \"email\": \"alice@example.com\",\n  \"address\": {\n    \"country\": \"Japan\",\n    \"city\": \"Tokyo\",\n    \"zipcode\": \"100-0001\"\n  }\n}"
          },
          {
            "type": "p",
            "text": "まず、ネストされる側のデータ構造を BaseModel として定義します。ここでは住所情報を表す `Address` モデルを作ります。"
          },
          {
            "type": "code",
            "filename": "models.py",
            "lang": "python",
            "code": "from pydantic import BaseModel\n\n\nclass Address(BaseModel):\n    country: str\n    city: str\n    zipcode: str"
          },
          {
            "type": "p",
            "text": "この `Address` は単体でも「国・市区町村・郵便番号」を持つデータ構造として定義されています。次に、この Address を別の BaseModel のフィールドとして利用します。"
          },
          {
            "type": "p",
            "text": "前の小節で使った `UserCreate` を拡張し、`address` フィールドに `Address` 型を指定します。"
          },
          {
            "type": "code",
            "filename": "models.py",
            "lang": "python",
            "code": "from pydantic import BaseModel\n\n\nclass Address(BaseModel):\n    country: str\n    city: str\n    zipcode: str\n\n\nclass UserCreate(BaseModel):\n    name: str\n    age: int\n    email: str\n    address: Address"
          },
          {
            "type": "p",
            "text": "ここでの重要な点は、`address: Address` という1行です。これにより、「address には Address 型のオブジェクト（JSONオブジェクト）が必ず含まれている」というルールが定義されます。"
          },
          {
            "type": "p",
            "text": "FastAPIはリクエストを受け取ると、まず外側の `UserCreate` を検証し、その途中で `address` フィールドに対して自動的に `Address` の検証も行います。"
          },
          {
            "type": "p",
            "text": "次に、このモデルをリクエストボディとして受け取るエンドポイントを定義します。"
          },
          {
            "type": "code",
            "filename": "main.py",
            "lang": "python",
            "code": "from fastapi import FastAPI\nfrom models import UserCreate\n\napp = FastAPI()\n\n\n@app.post(\"/users\")\ndef create_user(user: UserCreate):\n    return {\n        \"message\": \"ユーザーを受け取りました\",\n        \"user\": user\n    }"
          },
          {
            "type": "p",
            "text": "先ほどのJSONをこの `/users` に送信すると、FastAPIは次の処理を自動で行います。"
          },
          {
            "type": "ul",
            "items": [
              "name・age・email が正しい型かを検証する",
              "address がオブジェクトであることを確認する",
              "address の中で country・city・zipcode がすべて存在し、型が正しいかを検証する"
            ]
          },
          {
            "type": "p",
            "text": "もし address の中で `zipcode` が欠けていたり、`address` が文字列になっていた場合は、内部の Address モデルの検証でエラーとなり、FastAPIは自動的に 422 エラーを返します。"
          },
          {
            "type": "p",
            "text": "このように、BaseModel をネストすると、JSONの階層構造そのものを型として表現でき、各階層で厳密な検証を行えます。データが複雑になるほど、この書き方の価値は大きくなります。"
          },
          {
            "type": "p",
            "text": "まとめると、ネストした BaseModel は「構造があるデータ」を安全に受け取るための基本テクニックです。FastAPIでは、モデルを分割して再利用できるため、可読性と保守性の高いAPI設計につながります。"
          }
        ]
      },
      {
        "id": "fastapi-form-data",
        "title": "フォームデータ（Form Data）の受け取り",
        "summary": "HTMLの form タグなどから送信されるフォームデータ（application/x-www-form-urlencoded / multipart/form-data）を FastAPI で受け取る方法を学びます。JSONとの違いと、Form() の役割を理解します。",
        "content": [
          {
            "type": "p",
            "text": "これまでの小節では、リクエストボディとして JSON データを受け取る方法を学んできました。しかし、Webアプリケーションでは今でも「HTMLの form から送信されるデータ」を扱う場面が多く存在します。"
          },
          {
            "type": "p",
            "text": "例えば、ログイン画面やお問い合わせフォームなどでは、`<form>` タグを使ってデータを送信します。この場合、データは JSON ではなく「フォームデータ（Form Data）」として送られます。"
          },
          {
            "type": "p",
            "text": "フォームデータの特徴は次の通りです。"
          },
          {
            "type": "ul",
            "items": [
              "キーと値のペアで送信される（見た目はクエリパラメータに近い）",
              "HTTPリクエストのボディに含まれる",
              "Content-Type は application/x-www-form-urlencoded または multipart/form-data"
            ]
          },
          {
            "type": "p",
            "text": "FastAPIでは、フォームデータを受け取るために `Form()` を使います。書き方はクエリパラメータと非常によく似ていますが、「これはフォームデータである」と明示するために `= Form()` を付ける点が重要です。"
          },
          {
            "type": "p",
            "text": "まずは、最もシンプルな例として、ユーザー名とパスワードをフォームから受け取るAPIを作ってみます。"
          },
          {
            "type": "code",
            "filename": "main.py",
            "lang": "python",
            "code": "from fastapi import FastAPI, Form\n\napp = FastAPI()\n\n\n@app.post(\"/login\")\ndef login(username: str = Form(), password: str = Form()):\n    return {\n        \"username\": username,\n        \"message\": \"ログイン処理を行う想定です\"\n    }"
          },
          {
            "type": "p",
            "text": "このコードでは、`username: str = Form()` と `password: str = Form()` がフォームデータを受け取る部分です。クエリパラメータと似ていますが、`Form()` を指定することで「リクエストボディ内のフォームデータから値を取り出す」ことをFastAPIに伝えています。"
          },
          {
            "type": "p",
            "text": "例えば、HTML側では次のようなフォームが送信されることを想定しています。"
          },
          {
            "type": "code",
            "filename": "login.html",
            "lang": "html",
            "code": "<form action=\"/login\" method=\"post\">\n  <input type=\"text\" name=\"username\" />\n  <input type=\"password\" name=\"password\" />\n  <button type=\"submit\">Login</button>\n</form>"
          },
          {
            "type": "p",
            "text": "このフォームが送信されると、FastAPIはフォームデータの中から `username` と `password` を取り出し、それぞれ関数引数に渡します。"
          },
          {
            "type": "p",
            "text": "ここで注意点として、フォームデータは JSON のように BaseModel では受け取れません。フォームの場合は、基本的に「フィールドごとに `Form()` を指定する」形になります。"
          },
          {
            "type": "p",
            "text": "また、フォームデータでも型注釈は有効です。例えば、数値を `int` として受け取れば、自動的に型変換とバリデーションが行われます。"
          },
          {
            "type": "code",
            "filename": "form_with_type.py",
            "lang": "python",
            "code": "from fastapi import FastAPI, Form\n\napp = FastAPI()\n\n\n@app.post(\"/age\")\ndef submit_age(age: int = Form()):\n    return {\"age\": age}"
          },
          {
            "type": "p",
            "text": "この場合、フォームから送られた age が数値でなければ、FastAPIは自動的にバリデーションエラー（422）を返します。"
          },
          {
            "type": "p",
            "text": "まとめると、フォームデータは「見た目はクエリパラメータに近いが、送信場所はリクエストボディ」であり、FastAPIでは `Form()` を使って明示的に受け取ります。HTMLフォームとFastAPIをつなぐ際の基本となる重要な仕組みです。"
          }
        ]
      },
      {
        "id": "fastapi-file-upload",
        "title": "ファイルアップロード（File Upload）",
        "summary": "HTMLフォームなどから送信されるファイルデータを FastAPI で受け取る方法を学びます。`File()` を使ってファイルをバイト列として受け取る基本形を理解します。",
        "content": [
          {
            "type": "p",
            "text": "前の小節では、HTML の form タグから送信される「フォームデータ（Form Data）」を `Form()` で受け取る方法を学びました。フォームでは、テキスト情報だけでなく、ファイル（画像・PDF・CSVなど）を一緒に送信することもできます。"
          },
          {
            "type": "p",
            "text": "このような「ファイルデータ」を FastAPI で受け取る場合に使うのが `File()` です。フォームデータと同様に、リクエストボディに含まれるデータですが、ファイル専用の型として明示的に指定します。"
          },
          {
            "type": "p",
            "text": "まず、FastAPI でファイルアップロードを扱うためには、`File` をインポートします。"
          },
          {
            "type": "code",
            "filename": "import_example.py",
            "lang": "python",
            "code": "from fastapi import FastAPI, File"
          },
          {
            "type": "p",
            "text": "次に、エンドポイントの関数引数として `file: bytes = File()` のように書くことで、アップロードされたファイルを「バイト列（bytes）」として受け取ることができます。"
          },
          {
            "type": "p",
            "text": "以下は、最もシンプルなファイルアップロードの例です。"
          },
          {
            "type": "code",
            "filename": "main.py",
            "lang": "python",
            "code": "from fastapi import FastAPI, File\n\napp = FastAPI()\n\n\n@app.post(\"/upload\")\ndef upload_file(file: bytes = File()):\n    return {\n        \"file_size\": len(file),\n        \"message\": \"ファイルを受け取りました\"\n    }"
          },
          {
            "type": "p",
            "text": "このコードでは、`file: bytes = File()` によって、アップロードされたファイル全体をバイト列としてメモリ上に読み込みます。`len(file)` を使えば、ファイルサイズ（バイト数）を確認できます。"
          },
          {
            "type": "p",
            "text": "このエンドポイントは、HTML 側から次のようなフォームで呼び出されることを想定しています。"
          },
          {
            "type": "code",
            "filename": "upload.html",
            "lang": "html",
            "code": "<form action=\"/upload\" method=\"post\" enctype=\"multipart/form-data\">\n  <input type=\"file\" name=\"file\" />\n  <button type=\"submit\">Upload</button>\n</form>"
          },
          {
            "type": "p",
            "text": "ここで重要なのは、`enctype=\"multipart/form-data\"` が指定されている点です。ファイルアップロードでは、この形式でなければブラウザはファイルを送信できません。"
          },
          {
            "type": "p",
            "text": "また、`name=\"file\"` の値と、FastAPI 側の引数名 `file` が一致している必要があります。これにより、FastAPI は正しくファイルデータを対応付けます。"
          },
          {
            "type": "p",
            "text": "なお、`file: bytes = File()` は「小さめのファイル」を扱う場合に向いています。ファイル全体を一度にメモリに読み込むため、大きなファイルには注意が必要です。"
          },
          {
            "type": "p",
            "text": "ここまでが、単一ファイルをアップロードする場合の基本的な使い方です。"
          },
          {
            "type": "p",
            "text": "次に、複数のファイルを同時にアップロードする方法を見ていきます。Webアプリケーションでは、画像をまとめて送信したり、複数の添付ファイルを一度にアップロードしたいケースがよくあります。"
          },
          {
            "type": "p",
            "text": "FastAPIでは、`File()` を使った引数を「リスト型（list[bytes]）」にすることで、複数ファイルを受け取ることができます。"
          },
          {
            "type": "code",
            "filename": "main_multiple_files.py",
            "lang": "python",
            "code": "from fastapi import FastAPI, File\nfrom typing import List\n\napp = FastAPI()\n\n\n@app.post(\"/upload-multiple\")\ndef upload_multiple_files(files: List[bytes] = File()):\n    return {\n        \"file_count\": len(files),\n        \"file_sizes\": [len(f) for f in files],\n        \"message\": \"複数のファイルを受け取りました\"\n    }"
          },
          {
            "type": "p",
            "text": "この例では、`files: List[bytes] = File()` と書くことで、「同じ名前のファイル項目が複数送られてくる」ことを想定しています。FastAPIはそれらを自動的にリストとしてまとめて渡します。"
          },
          {
            "type": "p",
            "text": "ここからは、より実務向けの方法である `UploadFile` を使ったファイルアップロードについて説明します。"
          },
          {
            "type": "p",
            "text": "`UploadFile` は、ファイルをメモリに一括で読み込まず、ストリームとして扱える仕組みです。そのため、大きなファイルや実運用環境では、`bytes` よりも `UploadFile` を使うことが推奨されます。"
          },
          {
            "type": "p",
            "text": "まず、`UploadFile` を使う場合は次のようにインポートします。"
          },
          {
            "type": "code",
            "filename": "import_uploadfile.py",
            "lang": "python",
            "code": "from fastapi import FastAPI, File, UploadFile"
          },
          {
            "type": "p",
            "text": "次に、関数引数を `file: UploadFile = File()` の形で定義します。"
          },
          {
            "type": "code",
            "filename": "main_uploadfile.py",
            "lang": "python",
            "code": "from fastapi import FastAPI, File, UploadFile\n\napp = FastAPI()\n\n\n@app.post(\"/upload-stream\")\ndef upload_file_stream(file: UploadFile = File()):\n    return {\n        \"filename\": file.filename,\n        \"content_type\": file.content_type,\n        \"message\": \"UploadFile としてファイルを受け取りました\"\n    }"
          },
          {
            "type": "p",
            "text": "`UploadFile` を使うと、次のような情報にアクセスできます。"
          },
          {
            "type": "ul",
            "items": [
              "`file.filename`：アップロードされたファイル名",
              "`file.content_type`：MIMEタイプ（例：image/png）",
              "`file.file`：内部的なファイルオブジェクト（ストリーム）"
            ]
          },
          {
            "type": "p",
            "text": "例えば、ファイル内容を読み取りたい場合は、次のようにします。"
          },
          {
            "type": "code",
            "filename": "read_uploadfile.py",
            "lang": "python",
            "code": "contents = file.file.read()"
          },
          {
            "type": "p",
            "text": "このように `UploadFile` は、ファイルサイズが大きくなる可能性がある場合や、本番環境での運用を想定する場合に非常に重要な選択肢です。"
          },
          {
            "type": "p",
            "text": "まとめると、FastAPI では次のように使い分けます。"
          },
          {
            "type": "ul",
            "items": [
              "`bytes = File()`：小さなファイル・学習用・簡単な用途",
              "`UploadFile = File()`：大きなファイル・実務・本番向け"
            ]
          }
        ]
      },
      {
        "id": "fastapi-request-object",
        "title": "Request オブジェクト",
        "summary": "FastAPI で HTTP リクエスト全体の情報にアクセスするための Request オブジェクトを学びます。URL・ヘッダー・クライアント情報に加え、Cookie の取得方法も理解します。",
        "content": [
          {
            "type": "p",
            "text": "これまでの小節では、パスパラメータ、クエリパラメータ、リクエストボディ、フォームデータ、ファイルなど、「リクエストの一部」を関数引数として受け取る方法を学んできました。"
          },
          {
            "type": "p",
            "text": "しかし実際の開発では、「HTTPリクエスト全体の情報」にアクセスしたい場面も多くあります。例えば、どのURLにアクセスされたのか、どんなヘッダーが付いているのか、クライアントのIPアドレスは何か、といった情報です。"
          },
          {
            "type": "p",
            "text": "そのために FastAPI が提供しているのが `Request` オブジェクトです。`Request` を使うことで、HTTPリクエストの詳細情報をまとめて扱うことができます。"
          },
          {
            "type": "p",
            "text": "まず、`Request` を使うためにインポートします。"
          },
          {
            "type": "code",
            "filename": "import_request.py",
            "lang": "python",
            "code": "from fastapi import FastAPI, Request"
          },
          {
            "type": "p",
            "text": "FastAPI では、エンドポイント関数の引数に `request: Request` を追加するだけで、現在のHTTPリクエストオブジェクトを受け取ることができます。"
          },
          {
            "type": "code",
            "filename": "main_basic.py",
            "lang": "python",
            "code": "from fastapi import FastAPI, Request\n\napp = FastAPI()\n\n\n@app.get(\"/info\")\ndef read_request_info(request: Request):\n    return {\n        \"method\": request.method,\n        \"url\": str(request.url)\n    }"
          },
          {
            "type": "p",
            "text": "この例では、`request.method` で HTTP メソッド（GET / POST など）を、`request.url` でアクセスされたURLを取得しています。"
          },
          {
            "type": "p",
            "text": "次に、HTTPヘッダーを取得する例を見てみましょう。ヘッダーは `request.headers` から参照できます。"
          },
          {
            "type": "code",
            "filename": "request_headers.py",
            "lang": "python",
            "code": "from fastapi import FastAPI, Request\n\napp = FastAPI()\n\n\n@app.get(\"/headers\")\ndef read_headers(request: Request):\n    return {\n        \"user_agent\": request.headers.get(\"user-agent\"),\n        \"accept\": request.headers.get(\"accept\")\n    }"
          },
          {
            "type": "p",
            "text": "`request.headers` は辞書のように扱うことができ、`get()` を使って安全に値を取得できます。ブラウザの種類判定やAPIクライアントの識別などでよく使われます。"
          },
          {
            "type": "p",
            "text": "また、クライアントのIPアドレスやポート番号などの接続情報は `request.client` から取得できます。"
          },
          {
            "type": "code",
            "filename": "request_client.py",
            "lang": "python",
            "code": "from fastapi import FastAPI, Request\n\napp = FastAPI()\n\n\n@app.get(\"/client\")\ndef read_client_info(request: Request):\n    return {\n        \"client_host\": request.client.host if request.client else None,\n        \"client_port\": request.client.port if request.client else None\n    }"
          },
          {
            "type": "p",
            "text": "ここまでで、Request オブジェクトから URL・メソッド・ヘッダー・クライアント情報を取得できることが分かりました。"
          },
          {
            "type": "p",
            "text": "次に、Cookie の取得方法について説明します。Cookie は、ブラウザが自動的に送信する小さなデータで、ログイン状態の維持やユーザー識別によく使われます。"
          },
          {
            "type": "p",
            "text": "FastAPIでは、Cookie も Request オブジェクトから直接取得できます。Cookie は `request.cookies` に辞書形式で格納されています。"
          },
          {
            "type": "code",
            "filename": "request_cookies.py",
            "lang": "python",
            "code": "from fastapi import FastAPI, Request\n\napp = FastAPI()\n\n\n@app.get(\"/cookies\")\ndef read_cookies(request: Request):\n    return {\n        \"session_id\": request.cookies.get(\"session_id\"),\n        \"all_cookies\": request.cookies\n    }"
          },
          {
            "type": "p",
            "text": "この例では、`request.cookies.get(\"session_id\")` によって、`session_id` という名前の Cookie を取得しています。存在しない場合は `None` になります。"
          },
          {
            "type": "p",
            "text": "Cookie はクエリパラメータやフォームとは異なり、クライアント（主にブラウザ）が自動的に送信する点が特徴です。そのため、認証・セッション管理・ユーザー追跡などでよく利用されます。"
          },
          {
            "type": "p",
            "text": "まとめると、`Request` オブジェクトは「HTTPリクエスト全体を表すオブジェクト」であり、次のような情報にアクセスできます。"
          },
          {
            "type": "ul",
            "items": [
              "HTTPメソッド（request.method）",
              "URL情報（request.url）",
              "ヘッダー（request.headers）",
              "クライアント情報（request.client）",
              "Cookie（request.cookies）"
            ]
          },
          {
            "type": "p",
            "text": "FastAPIでは、これらを1つの Request オブジェクトからまとめて扱えるため、ログ出力・認証処理・アクセス制御などの実装が非常にシンプルになります。"
          }
        ]
      },
      {
        "id": "http-dynamic-vs-static-requests",
        "title": "動的リクエストと静的リクエストの比較",
        "summary": "動的リクエスト（ルーティング→処理関数→DBなど）と、静的リクエスト（サーバー上の既存ファイルをそのまま返す）の違いを、処理フロー図で整理します。SSR（非分離）と分離式（API + フロント）も合わせて比較します。",
        "content": [
          {
            "type": "p",
            "text": "ここまでの小節では、主に「動的リクエスト（Dynamic Request）」を扱ってきました。動的リクエストとは、クライアントからの要求がルーティングに入り、処理関数（エンドポイント）でロジックが実行され、必要に応じてデータベース（DB）などを参照し、結果を生成して返すタイプのリクエストです。"
          },
          {
            "type": "p",
            "text": "一方で「静的リクエスト（Static Request）」は、サーバー（あるいはCDN）上にすでに存在する“変化しないファイル”を、そのまま返すタイプのリクエストです。例えば、CSS・JavaScript・画像・ビルド済みのHTMLなどが代表例です。"
          },
          {
            "type": "p",
            "text": "まずは、動的リクエストの代表的な流れを「非分離式（SSR寄り）」と「分離式（API + フロント）」に分けて整理します。"
          },
      
          {
            "type": "p",
            "text": "① 動的リクエスト：非分離式（サーバー側でHTMLを組み立てて返す）"
          },
          {
            "type": "code",
            "filename": "dynamic_ssr_flow.mmd",
            "lang": "mermaid",
            "code": "flowchart TD\n  A[Client / Browser] --> B[Server]\n  B --> C[Router / Routing]\n  C --> D[Endpoint / Logic Function]\n  D --> E[Database]\n  E --> D\n  D --> F[HTML生成（テンプレートにデータを埋め込む）]\n  F --> G[Response: HTML（+参照されるCSS/JS）]\n  G --> A"
          },
      
          {
            "type": "p",
            "text": "② 動的リクエスト：分離式（フロントとAPIが分かれていて、ブラウザのJavaScriptが画面を組み立てる）"
          },
          {
            "type": "code",
            "filename": "dynamic_separated_flow.mmd",
            "lang": "mermaid",
            "code": "flowchart TD\n  A[Client / Browser] --> B[Front Server or CDN]\n  B --> C[Response: HTML/CSS/JS（静的）]\n  C --> A\n\n  A --> D[API Server]\n  D --> E[Router / Routing]\n  E --> F[Endpoint / Logic Function]\n  F --> G[Database]\n  G --> F\n  F --> H[Response: JSON]\n  H --> A\n\n  A --> I[Browser JavaScript]\n  I --> J[HTML/CSS/JS + JSON を使って画面を組み立てる]"
          },
      
          {
            "type": "p",
            "text": "次に、静的リクエストの流れを整理します。静的リクエストでは、基本的に「ルーティング→処理関数→DB」という流れは発生せず、ファイルをそのまま返します。"
          },
      
          {
            "type": "p",
            "text": "③ 静的リクエスト：サーバー上の既存ファイルをそのまま返す（例：/static/app.css, /static/app.js, /images/logo.png）"
          },
          {
            "type": "code",
            "filename": "static_flow.mmd",
            "lang": "mermaid",
            "code": "flowchart TD\n  A[Client / Browser] --> B[Static File Handler]\n  B --> C[File System / CDN Cache]\n  C --> D[Response: File 그대로返す（CSS/JS/画像/HTMLなど）]\n  D --> A"
          },
      
          {
            "type": "p",
            "text": "ここまでの内容を、どこで何が起きるのかという観点で整理すると、次のように比較できます。"
          },
          {
            "type": "ul",
            "items": [
              "動的リクエスト：ルーティングに入り、処理関数が実行され、必要ならDBを参照し、結果を生成して返す。",
              "静的リクエスト：すでに存在するファイルを、そのまま返す（通常DBには触れない）。",
              "非分離式（動的）：サーバー側でHTMLを作って返す（テンプレートにDBのデータを埋め込む）。",
              "分離式（動的）：APIはJSONを返し、画面の組み立てはブラウザのJavaScriptが担当する。"
            ]
          },
      
          {
            "type": "p",
            "text": "まとめると、動的リクエストは「リクエストごとに処理を走らせて結果を作る」もので、静的リクエストは「作り済みのものを配布する」ものです。FastAPIでAPIを作るときは動的リクエストが中心になりますが、実際のWebアプリではCSS/JS/画像などの静的配信も必ず登場するため、両方の処理フローをセットで理解しておくことが重要です。"
          }
        ]
      },
      {
        "id": "fastapi-static-files-mount",
        "title": "静的ファイル配信：mount を使う（StaticFiles）",
        "summary": "FastAPIで静的ファイル（CSS/JS/画像など）を配信する方法を学びます。`StaticFiles` と `app.mount()` を使って、`/static` のようなURLにディレクトリを紐付けます。",
        "content": [
          {
            "type": "p",
            "text": "前の小節では、動的リクエストと静的リクエストの違いを整理しました。ここからは実際に「静的ファイルリクエスト（Static File Request）」を FastAPI で扱う方法を学びます。"
          },
          {
            "type": "p",
            "text": "静的ファイルとは、サーバー側ですでに用意されていて、基本的に内容が変化しないファイルのことです。例えば、CSS / JavaScript / 画像 / フォント / ビルド済みHTML などが該当します。静的ファイルリクエストでは、通常はデータベースやビジネスロジックに入らず、ファイルをそのまま返します。"
          },
          {
            "type": "p",
            "text": "FastAPIで静的ファイルを配信する基本は、`StaticFiles` と `mount`（`app.mount()`）です。`mount` は「あるURLパスに対して、別のアプリ（または静的ファイルハンドラ）をぶら下げる」ための仕組みです。"
          },
          {
            "type": "p",
            "text": "まずは必要なものをインポートします。静的ファイル配信には `fastapi.staticfiles.StaticFiles` を使います。"
          },
          {
            "type": "code",
            "filename": "imports.py",
            "lang": "python",
            "code": "from fastapi import FastAPI\nfrom fastapi.staticfiles import StaticFiles"
          },
          {
            "type": "p",
            "text": "次に、プロジェクトのディレクトリ構成を例として示します。ここでは `static/` ディレクトリに静的ファイルを置く想定です。"
          },
          {
            "type": "code",
            "filename": "project_structure.txt",
            "lang": "text",
            "code": "your_project/\n├── main.py\n└── static/\n    ├── style.css\n    ├── app.js\n    └── images/\n        └── logo.png"
          },
          {
            "type": "p",
            "text": "それでは `app.mount()` を使って、URLの `/static` を `static/` ディレクトリに紐付けます。すると、例えば `static/style.css` は `/static/style.css` としてアクセスできるようになります。"
          },
          {
            "type": "code",
            "filename": "main.py",
            "lang": "python",
            "code": "from fastapi import FastAPI\nfrom fastapi.staticfiles import StaticFiles\n\napp = FastAPI()\n\n# /static へのアクセスを、ローカルの static/ ディレクトリに紐付ける\napp.mount(\"/static\", StaticFiles(directory=\"static\"), name=\"static\")\n\n\n@app.get(\"/\")\ndef root():\n    return {\"message\": \"Hello, Static Files!\"}"
          },
          {
            "type": "p",
            "text": "この1行が静的ファイル配信の中心です。"
          },
          {
            "type": "ul",
            "items": [
              "`app.mount(\"/static\", ...)`：URLの先頭が `/static` のリクエストを、静的ファイル配信に回す",
              "`StaticFiles(directory=\"static\")`：実際に参照するフォルダを指定する（ここではプロジェクト直下の static/）",
              "`name=\"static\"`：このマウント設定に名前を付ける（主に内部参照やURL生成に使う）"
            ]
          },
          {
            "type": "p",
            "text": "例えば、次のようなリクエストをブラウザで開くと、サーバーはそのままファイルを返します。"
          },
          {
            "type": "ul",
            "items": [
              "GET /static/style.css  → static/style.css を返す",
              "GET /static/app.js     → static/app.js を返す",
              "GET /static/images/logo.png → static/images/logo.png を返す"
            ]
          },
          {
            "type": "p",
            "text": "ここで重要なのは、これらのリクエストは通常の `@app.get()` のルーティング処理には入らないという点です。`/static` 配下は `mount` によって静的ファイルハンドラに直接渡されるため、アプリのロジック関数やDBアクセスは発生しません。"
          },
          {
            "type": "p",
            "text": "次に、静的ファイルが本当に配信されていることを確認するために、簡単な `style.css` を用意してみます。"
          },
          {
            "type": "code",
            "filename": "static/style.css",
            "lang": "css",
            "code": "body {\n  font-family: sans-serif;\n}\n\nh1 {\n  font-size: 32px;\n}"
          },
          {
            "type": "p",
            "text": "この状態で `http://127.0.0.1:8000/static/style.css` にアクセスすると、CSSファイルの内容がそのまま表示されます（ブラウザによってはダウンロードやプレビューになります）。"
          },
          {
            "type": "p",
            "text": "まとめると、FastAPIで静的ファイル配信を行うには `StaticFiles` と `app.mount()` を使い、URLとディレクトリを対応付けます。動的APIとは違い、静的ファイル配信は「作り済みのファイルをそのまま返す」ため、Webアプリ全体の構成を理解するうえで重要な要素になります。"
          }
        ]
      },
      {
        "id": "fastapi-rendering-where",
        "title": "レンダリングはどこで行われるのか（SSR / 分離式 / 静的配信）",
        "summary": "「レンダリング（rendering）」が処理フローのどの段階で発生するのかを整理します。非分離式（SSR）ではサーバー側、分離式ではブラウザ側（JavaScript）、静的ファイル配信ではサーバー側レンダリングは基本的に発生しません。",
        "content": [
          {
            "type": "p",
            "text": "ここまでで、動的リクエストと静的リクエストの処理フローを学びました。この小節では、そのフローの中で「レンダリング（rendering）」が“どこで”行われているのかを整理します。"
          },
          {
            "type": "p",
            "text": "まず、ここで言うレンダリングとは「ユーザーが画面として見られる形（HTML画面）を組み立てること」を指します。どの方式を採用しているかによって、レンダリングを担当する場所が変わります。"
          },
      
          {
            "type": "p",
            "text": "## 1. 非分離式（SSR）ではレンダリングはサーバー側で行われる"
          },
          {
            "type": "p",
            "text": "非分離式（サーバーがHTMLを返すタイプ）では、リクエストはルーティングを通り、処理関数でロジックを実行し、必要ならデータベースからデータを取得します。その後、サーバーが「テンプレートにデータを埋め込んでHTMLを生成」し、そのHTMLをレスポンスとして返します。"
          },
          {
            "type": "p",
            "text": "つまり、非分離式ではレンダリングは次の場所（段階）で発生します。"
          },
          {
            "type": "ul",
            "items": [
              "DBからデータを取ってきた後",
              "レスポンスを返す直前",
              "サーバーがテンプレートを使ってHTMLを生成する段階"
            ]
          },
          {
            "type": "p",
            "text": "この「テンプレート + データ → HTML生成」の部分が、サーバーサイドレンダリング（SSR）におけるレンダリングです。"
          },
          {
            "type": "code",
            "filename": "ssr_rendering_flow.mmd",
            "lang": "mermaid",
            "code": "flowchart TD\n  A[Client / Browser] --> B[Server]\n  B --> C[Router / Routing]\n  C --> D[Endpoint / Logic Function]\n  D --> E[Database]\n  E --> D\n  D --> F[HTML生成（テンプレートにデータを埋め込む） ← レンダリング]\n  F --> G[Response: HTML]\n  G --> A"
          },
          {
            "type": "p",
            "text": "代表的な例としては、Rails（ERB）、Django（Template）、Laravel（Blade）などがあり、いずれもサーバーでHTMLを組み立てて返す仕組みを持っています。"
          },
      
          {
            "type": "p",
            "text": "## 2. 分離式（フロント + API）ではレンダリングはブラウザ側（JavaScript）で行われる"
          },
          {
            "type": "p",
            "text": "分離式では、フロント側はHTML/CSS/JavaScript（多くは静的ファイル）を返し、バックエンド（FastAPIなど）はデータ（多くはJSON）を返します。"
          },
          {
            "type": "p",
            "text": "この方式では、サーバーは基本的に「画面（HTML）を完成させて返す」のではなく、「データ（JSON）を返す」だけです。では画面はどこで組み立てるのでしょうか。答えはブラウザです。"
          },
          {
            "type": "p",
            "text": "分離式では、レンダリングは次の場所（段階）で発生します。"
          },
          {
            "type": "ul",
            "items": [
              "ブラウザがHTML/CSS/JSを受け取った後",
              "ブラウザがAPIからJSONを受け取った後",
              "ブラウザ内のJavaScriptがDOMを更新して画面を組み立てる段階（ここがレンダリング）"
            ]
          },
          {
            "type": "code",
            "filename": "separated_rendering_flow.mmd",
            "lang": "mermaid",
            "code": "flowchart TD\n  A[Client / Browser] --> B[Front Server or CDN]\n  B --> C[Response: HTML/CSS/JS（静的）]\n  C --> A\n\n  A --> D[API Server]\n  D --> E[Router / Routing]\n  E --> F[Endpoint / Logic Function]\n  F --> G[Database]\n  G --> F\n  F --> H[Response: JSON]\n  H --> A\n\n  A --> I[Browser JavaScript]\n  I --> J[HTML/CSS/JS + JSON を使って画面を組み立てる ← レンダリング]"
          },
          {
            "type": "p",
            "text": "React / Vue / Angular などのSPAフレームワークは、この「ブラウザ側レンダリング」を中心に動く設計になっています。"
          },
      
          {
            "type": "p",
            "text": "## 3. 静的ファイル配信では、サーバー側のレンダリングは基本的に発生しない"
          },
          {
            "type": "p",
            "text": "静的ファイルリクエスト（CSS/JS/画像/ビルド済みHTMLなど）は、サーバー上にすでに存在するファイルをそのまま返すだけです。通常はルーティング→処理関数→DBという流れに入らず、サーバー側でテンプレート処理やデータ注入をしません。"
          },
          {
            "type": "p",
            "text": "つまり、静的ファイル配信の時点では「サーバー側のレンダリング」は行われません。"
          },
          {
            "type": "code",
            "filename": "static_no_rendering_flow.mmd",
            "lang": "mermaid",
            "code": "flowchart TD\n  A[Client / Browser] --> B[Static File Handler]\n  B --> C[File System / CDN Cache]\n  C --> D[Response: File（そのまま返す）]\n  D --> A"
          },
          {
            "type": "p",
            "text": "ただし、ブラウザは受け取ったHTMLを解析して画面に表示したり、JavaScriptを実行してDOMを更新したりします。その意味では「ブラウザ側の表示処理」はありますが、少なくともサーバー側のテンプレート生成＝レンダリングは基本的に発生しません。"
          },
      
          {
            "type": "p",
            "text": "## 4. まとめ：レンダリングの場所は方式で決まる"
          },
          {
            "type": "p",
            "text": "最後に、レンダリングがどこで行われるかを整理します。"
          },
          {
            "type": "ul",
            "items": [
              "非分離式（SSR）：サーバー側でHTMLを生成する段階がレンダリング",
              "分離式（フロント + API）：ブラウザのJavaScriptが画面を組み立てる段階がレンダリング",
              "静的ファイル配信：サーバー側レンダリングは基本的に行われず、ファイルをそのまま返す"
            ]
          },
          {
            "type": "p",
            "text": "この整理ができると、「FastAPIはどこまで担当するのか」「フロントはどこで画面を作るのか」「静的ファイルは誰が配るのか」をはっきり切り分けられるようになります。次の小節では、FastAPIが静的ファイルを配信する方法（mount / StaticFiles）を実装として確認します。"
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
            FASTAPIの学習
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