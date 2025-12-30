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