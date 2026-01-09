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
    "key": "cookie-and-session",
    "title": "Cookie & Session",
    "lessons": [
      {
        "id": "http-stateless-and-state",
        "title": "HTTPはなぜStatelessなのか、そしてCookie・Sessionが必要になる理由",
        "summary": "HTTPは本質的にステートレスなプロトコルであり、状態を保持しません。この制約を補うために、CookieやSessionといった仕組みがアプリケーションレベルで導入されます。",
        "content": [
          {
            "type": "p",
            "text": "HTTP（HyperText Transfer Protocol）の最も重要な設計思想の一つが「Stateless（ステートレス）」であるという点です。ステートレスとは、「サーバーがクライアントごとの状態を原則として記憶しない」という性質を意味します。"
          },
          {
            "type": "p",
            "text": "HTTP通信では、各リクエストは常に独立したものとして扱われます。あるリクエストの結果が、次のリクエストに自動的に引き継がれることはありません。サーバー側から見ると、「このリクエストが誰から来たのか」「以前に何をしていたのか」といった情報は、HTTPそのものからは分からない設計になっています。"
          },
          {
            "type": "p",
            "text": "例えば、同じブラウザから連続して次のようなリクエストが送られたとします。"
          },
          {
            "type": "ul",
            "items": [
              "① /login にPOSTしてログインする",
              "② /mypage にGETでアクセスする",
              "③ /settings にGETでアクセスする"
            ]
          },
          {
            "type": "p",
            "text": "人間の感覚では「同じユーザーがログインした後にマイページへ移動している」と理解できますが、HTTPの世界では②や③のリクエストは①とは無関係な“単発のリクエスト”として扱われます。HTTP自体には「ログイン済み」という概念が存在しないためです。"
          },
          {
            "type": "p",
            "text": "このステートレス性には明確なメリットがあります。サーバーはクライアントごとの状態を覚える必要がないため、構造が単純になり、大量のリクエストを効率よく処理できます。ロードバランサーを使って複数台のサーバーに処理を分散させることも容易になります。"
          },
          {
            "type": "p",
            "text": "一方で、この設計はWebアプリケーションにとって致命的な制約も生みます。それが、「ユーザーの状態を継続的に扱えない」という問題です。ログイン状態、ショッピングカートの中身、画面遷移の文脈などは、HTTPの仕組みだけでは表現できません。"
          },
          {
            "type": "p",
            "text": "そこで登場するのが、Cookie と Session です。重要なのは、CookieやSessionはHTTPプロトコルそのものの機能ではない、という点です。これらは、ステートレスなHTTPの上に「状態を持っているかのように振る舞わせるための仕組み」として設計された、アプリケーションレベルの工夫です。"
          },
          {
            "type": "p",
            "text": "まず Cookie とは何かを簡単に説明します。Cookieとは、サーバーがクライアント（主にブラウザ）に保存させる小さなデータです。ブラウザは、同じドメインに対して次回以降リクエストを送る際、このCookieを自動的にリクエストヘッダーに含めて送信します。"
          },
          {
            "type": "p",
            "text": "これにより、サーバーは「このリクエストは、以前このCookieを発行したクライアントから来ている」という識別が可能になります。HTTP自体はステートレスですが、Cookieを介することで、サーバーはリクエスト間の“つながり”を擬似的に認識できるようになります。"
          },
          {
            "type": "p",
            "text": "次に Session です。Session は、ユーザーごとの状態をサーバー側で管理する仕組みです。一般的な設計では、クライアント側のCookieには「セッションID」だけを保存し、実際のユーザー情報（ログイン状態、権限、設定など）はサーバー側のメモリやデータベースに保存されます。"
          },
          {
            "type": "p",
            "text": "リクエストが届くたびに、サーバーはCookieに含まれるセッションIDを手がかりに、対応するセッション情報を取り出します。これにより、HTTPが本来持たない「ユーザーごとの状態」を、安全かつ柔軟に管理できます。"
          },
          {
            "type": "p",
            "text": "まとめると、HTTPは設計上ステートレスであり、それ自体は状態管理を行いません。しかし、実際のWebアプリケーションでは状態管理が不可欠です。そのギャップを埋めるために、CookieとSessionという仕組みが生まれました。これらはHTTPの制約を理解した上で導入された“補助的な状態管理レイヤー”だと言えます。"
          },
          {
            "type": "ul",
            "items": [
              "HTTPはリクエストごとに完結するステートレスなプロトコル",
              "ステートレス性はスケーラビリティに優れるが、状態管理ができない",
              "Cookieはクライアント側に保存され、リクエスト間の識別を可能にする",
              "Sessionはサーバー側で状態を管理し、Cookieと組み合わせて使われる",
              "CookieとSessionはHTTPの上に成り立つアプリケーションレベルの仕組み"
            ]
          }
        ]
      },
      {
        "id": "cookie-structure-and-http",
        "title": "Cookieの具体的な構造とHTTPリクエストでの扱われ方",
        "summary": "Cookieは単なる文字列データであり、HTTPヘッダーとしてやり取りされます。本節ではCookieの構造を分解し、実際のHTTPリクエストの中でどのように送信されるのかを確認します。",
        "content": [
          {
            "type": "p",
            "text": "Cookieは、しばしば「特別な仕組み」のように誤解されがちですが、実体は非常にシンプルです。Cookieとは、HTTPヘッダーに含まれるただの文字列データです。ファイルでもオブジェクトでもなく、HTTP通信の一部としてやり取りされます。"
          },
          {
            "type": "p",
            "text": "Cookieは主に2つの場面で登場します。1つはサーバーがクライアントにCookieを発行するとき、もう1つはクライアントがそのCookieをリクエストに含めて送り返すときです。"
          },
          {
            "type": "p",
            "text": "まず、Cookieの基本構造を見てみましょう。Cookieは「キー＝値」のペアを中心に、いくつかの属性（オプション）を持つ形式で表現されます。"
          },
          {
            "type": "code",
            "filename": "set_cookie_header.txt",
            "lang": "text",
            "code": "Set-Cookie: session_id=abc123; Path=/; HttpOnly; Secure; SameSite=Lax"
          },
          {
            "type": "p",
            "text": "この1行が、サーバーからクライアントへ送られるCookieの正体です。ここから構成要素を分解していきます。"
          },
          {
            "type": "p",
            "text": "まず中心となるのが「session_id=abc123」という部分です。これはCookieの本体であり、「キー=session_id」「値=abc123」という意味になります。サーバーは、この値を使ってクライアントを識別したり、対応する状態を管理します。"
          },
          {
            "type": "p",
            "text": "その後に続く Path=/ は、このCookieがどのパスに対するリクエストで送信されるかを示します。Path=/ の場合、そのドメイン内のすべてのパスに対してCookieが送信されます。"
          },
          {
            "type": "p",
            "text": "HttpOnly は、このCookieがJavaScriptから直接アクセスできないことを意味します。これにより、XSS（クロスサイトスクリプティング）攻撃によってCookieが盗まれるリスクを低減できます。"
          },
          {
            "type": "p",
            "text": "Secure は、このCookieがHTTPS通信のときだけ送信されることを示します。HTTP（暗号化されていない通信）では送られないため、盗聴への耐性が高まります。"
          },
          {
            "type": "p",
            "text": "SameSite=Lax は、他サイトからのリクエストに対してCookieをどのように送るかを制御する属性です。Laxの場合、通常のリンク遷移では送信されますが、CSRFを引き起こしやすい一部のリクエストでは送信されません。"
          },
          {
            "type": "p",
            "text": "ここで重要なのは、これらの属性はすべて「ブラウザの振る舞いを制御するための情報」であり、Cookie自体の本体はあくまでキーと値のペアだという点です。"
          },
          {
            "type": "p",
            "text": "次に、Cookieが実際のHTTP通信の中でどのように使われるのかを見てみましょう。まずは、サーバーがCookieを発行する場面です。"
          },
          {
            "type": "code",
            "filename": "http_response_with_cookie.txt",
            "lang": "text",
            "code": "HTTP/1.1 200 OK\nContent-Type: text/html\nSet-Cookie: session_id=abc123; Path=/; HttpOnly\n\n<html>...</html>"
          },
          {
            "type": "p",
            "text": "このレスポンスを受け取ったブラウザは、Set-Cookie ヘッダーを解釈し、指定された内容を内部に保存します。この保存処理はブラウザが自動的に行い、JavaScriptやユーザーが意識する必要はありません。"
          },
          {
            "type": "p",
            "text": "そして、同じドメインに対して次のHTTPリクエストを送る際、ブラウザは保存してあるCookieを自動的にリクエストに含めます。"
          },
          {
            "type": "code",
            "filename": "http_request_with_cookie.txt",
            "lang": "text",
            "code": "GET /mypage HTTP/1.1\nHost: example.com\nCookie: session_id=abc123"
          },
          {
            "type": "p",
            "text": "この Cookie ヘッダーが、サーバーにとって非常に重要です。サーバーはこの1行を見るだけで、「このリクエストは session_id=abc123 を持つクライアントから来ている」と判断できます。"
          },
          {
            "type": "p",
            "text": "つまり、Cookieは「前回の通信の結果を次のリクエストへ運ぶための仕組み」として機能します。HTTP自体はステートレスですが、Cookieを毎回送り返すことで、結果として状態が維持されているように見えるのです。"
          },
          {
            "type": "p",
            "text": "ここで改めて強調しておくべき点は、Cookieの送信はすべてブラウザが自動的に行っている、という点です。開発者が毎回明示的に付けているわけではありません。サーバーがルールを示し、ブラウザがそれを忠実に守っている、という役割分担になっています。"
          },
          {
            "type": "ul",
            "items": [
              "CookieはHTTPヘッダーとしてやり取りされる単なる文字列データ",
              "Set-Cookieはサーバー→クライアント方向で使われる",
              "Cookieヘッダーはクライアント→サーバー方向で使われる",
              "Cookieの本体はキーと値のペアであり、属性は挙動制御用",
              "ブラウザが自動的に保存・送信を行うことで状態が継続される"
            ]
          }
        ]
      },
      {
        "id": "why-session-is-needed",
        "title": "なぜCookieだけでは不十分なのか ― Sessionが必要になる理由",
        "summary": "Cookieは状態管理の入り口として重要ですが、それだけでは安全性・柔軟性・管理性に限界があります。Sessionはそれらの問題を解決するために導入されます。",
        "content": [
          {
            "type": "p",
            "text": "前節では、CookieがHTTPのステートレス性を補うために使われていることを見てきました。Cookieによって、サーバーは「同じクライアントからのリクエストである」ことを識別できるようになります。では、ここで一つ自然な疑問が生まれます。"
          },
          {
            "type": "p",
            "text": "「Cookieがあれば状態管理はできるのではないか。なぜSessionという仕組みがさらに必要なのか？」"
          },
          {
            "type": "p",
            "text": "結論から言うと、Cookie“だけ”で状態管理を行うことには、いくつか本質的な問題があります。Sessionは、それらの問題を解決するために導入された仕組みです。"
          },
          {
            "type": "p",
            "text": "まず第一の問題は、セキュリティです。Cookieはクライアント側（ブラウザ）に保存されます。たとえHttpOnlyやSecureといった属性を付けたとしても、Cookieの内容そのものは基本的に「クライアントに預けているデータ」です。"
          },
          {
            "type": "p",
            "text": "もしログインユーザーのIDや権限情報、個人データそのものをCookieに直接保存していた場合、改ざん・漏洩・盗用といったリスクを完全に排除することはできません。Cookieはあくまで識別子を持たせる用途に向いており、重要なデータの保管場所としては不適切です。"
          },
          {
            "type": "p",
            "text": "第二の問題は、データ量と構造の制限です。Cookieはサイズに厳しい制約があります（一般に1つあたり約4KB）。また、Cookieは基本的に単なる文字列であり、複雑な構造を安全かつ効率的に扱くのには向いていません。"
          },
          {
            "type": "p",
            "text": "例えば、ログインユーザーのプロフィール情報、権限一覧、途中状態のフォーム入力、ショッピングカートの中身などをすべてCookieに詰め込もうとすると、サイズ制限にすぐに達してしまいます。また、毎回それらをHTTPリクエストで送信することになり、通信コストも増大します。"
          },
          {
            "type": "p",
            "text": "第三の問題は、サーバー側で状態を制御できないことです。Cookieにすべての情報を持たせる設計では、サーバーは「送られてきた値を信じる」以外に選択肢がありません。ユーザーの強制ログアウト、権限変更の即時反映、不正アクセスの遮断などを柔軟に制御するのが困難になります。"
          },
          {
            "type": "p",
            "text": "これらの問題をまとめると、Cookie単体での状態管理には次のような限界があります。"
          },
          {
            "type": "ul",
            "items": [
              "重要な情報をクライアント側に保存することによるセキュリティリスク",
              "サイズ制限と文字列ベースというデータ構造上の制約",
              "サーバー側から状態を一元管理・制御しにくい"
            ]
          },
          {
            "type": "p",
            "text": "ここで登場するのがSessionです。Sessionの基本思想は非常にシンプルで、「状態の本体はサーバー側で管理し、クライアントには識別子だけを持たせる」というものです。"
          },
          {
            "type": "p",
            "text": "具体的には、クライアントにはCookieとして「セッションID」だけを保存させます。このセッションIDは、サーバー側に保存されたセッション情報（ユーザーID、ログイン状態、権限など）への“鍵”として機能します。"
          },
          {
            "type": "p",
            "text": "リクエストが届くたびに、サーバーはCookieに含まれるセッションIDを読み取り、それに対応するセッションデータを自分自身の管理下（メモリ、データベース、Redisなど）から取得します。重要な情報は一切クライアントに渡さず、サーバーが完全にコントロールします。"
          },
          {
            "type": "p",
            "text": "この構造により、サーバーはユーザーの状態を自由に変更・破棄できます。例えば、管理者がユーザーを強制ログアウトさせたい場合は、サーバー側のセッション情報を削除するだけで済みます。次のリクエストで同じセッションIDが送られてきても、対応する状態が存在しないため、未ログインとして扱えます。"
          },
          {
            "type": "p",
            "text": "つまり、SessionはCookieの代替ではなく、Cookieと組み合わせて使うことで初めて意味を持つ仕組みです。Cookieは「誰から来たか」を示し、Sessionは「その人がどんな状態か」をサーバー側で管理します。"
          },
          {
            "type": "ul",
            "items": [
              "Cookieはクライアント側に保存される識別子",
              "Sessionはサーバー側に保存される状態データ",
              "Cookie単体では安全性・柔軟性に限界がある",
              "Sessionにより状態管理をサーバー主導で行える",
              "実運用ではCookieとSessionは必ずセットで使われる"
            ]
          }
        ]
      },
      {
        "id": "session-lifecycle",
        "title": "Sessionのライフサイクル（生成・利用・失効）",
        "summary": "Sessionは一度作られて終わりではなく、生成・利用・更新・失効というライフサイクルを持ちます。本節ではHTTPリクエストの流れに沿って、Sessionがどのように生まれ、使われ、消えていくのかを整理します。",
        "content": [
          {
            "type": "p",
            "text": "Sessionは「サーバー側で状態を管理する仕組み」ですが、その状態は永遠に存在するわけではありません。Sessionには明確なライフサイクルがあり、生成され、利用され、やがて失効します。この流れを理解することは、認証・ログイン・セキュリティ設計を理解する上で不可欠です。"
          },
          {
            "type": "p",
            "text": "Sessionのライフサイクルは、大きく分けて次の4つの段階に整理できます。"
          },
          {
            "type": "ul",
            "items": [
              "① Sessionの生成（作成）",
              "② Sessionの利用（参照）",
              "③ Sessionの更新（延命）",
              "④ Sessionの失効（破棄）"
            ]
          },
          {
            "type": "p",
            "text": "以下では、典型的な「ログインを伴うWebアプリケーション」を例にして、これらの段階を順番に見ていきます。"
          },
          {
            "type": "p",
            "text": "① Sessionの生成\n\nSessionは、多くの場合「ログイン成功」をきっかけに生成されます。ユーザーがIDとパスワードを送信し、それが正しいとサーバーが判断した瞬間に、サーバーは新しいSessionを作成します。"
          },
          {
            "type": "p",
            "text": "このときサーバー側では、ランダムで推測困難なセッションIDが生成されます。そして、そのセッションIDに対応する形で、ユーザーIDやログイン状態などのSessionデータがサーバー内部に保存されます。"
          },
          {
            "type": "p",
            "text": "同時に、サーバーはレスポンスの Set-Cookie ヘッダーを通じて、そのセッションIDをクライアントへ渡します。ここで初めて、クライアントとサーバーの間に関係性が生まれます。"
          },
          {
            "type": "p",
            "text": "② Sessionの利用\n\nSessionが生成された後、クライアントは以降のリクエストにおいて、自動的にセッションIDをCookieとして送信します。"
          },
          {
            "type": "p",
            "text": "サーバーはリクエストを受け取るたびに、Cookieに含まれるセッションIDを読み取り、それに対応するSessionデータを自分の管理下から取得します。これにより、「このリクエストは誰のものか」「ログイン済みかどうか」といった判断が可能になります。"
          },
          {
            "type": "p",
            "text": "この段階では、Sessionは単なる保存領域ではなく、リクエスト処理の前提条件として機能します。認証チェック、権限判定、ユーザー固有データの読み出しなどは、すべてSessionを起点として行われます。"
          },
          {
            "type": "p",
            "text": "③ Sessionの更新（延命）\n\n多くのWebアプリケーションでは、Sessionには有効期限（タイムアウト）が設定されています。これは、一定時間アクセスがなければSessionを無効化するための仕組みです。"
          },
          {
            "type": "p",
            "text": "一般的な実装では、ユーザーがリクエストを送るたびに「最終アクセス時刻」が更新されます。そして、その時刻から一定時間が経過しない限り、Sessionは有効であり続けます。これを「スライディング有効期限」と呼ぶこともあります。"
          },
          {
            "type": "p",
            "text": "この仕組みにより、アクティブに操作しているユーザーはログイン状態を維持でき、長時間操作していないユーザーは自動的にログアウトされます。これはセキュリティと利便性のバランスを取るための重要な設計です。"
          },
          {
            "type": "p",
            "text": "④ Sessionの失効\n\nSessionが失効するタイミングは主に2つあります。1つは有効期限切れ、もう1つは明示的な破棄です。"
          },
          {
            "type": "p",
            "text": "有効期限切れの場合、サーバーは対応するSessionデータを削除、もしくは無効扱いにします。クライアントが同じセッションIDを送り続けたとしても、サーバー側に状態が存在しないため、未ログインとして処理されます。"
          },
          {
            "type": "p",
            "text": "明示的な破棄の代表例が「ログアウト」です。ログアウト処理では、サーバー側のSessionを削除し、同時にクライアント側のCookieも無効化（削除または期限切れ）します。これにより、Sessionのライフサイクルは意図的に終了します。"
          },
          {
            "type": "p",
            "text": "重要なのは、Sessionの実体は常にサーバー側にあり、サーバーがその生殺与奪権を完全に握っている、という点です。これこそが、SessionがCookie単体よりも安全で柔軟な理由です。"
          },
          {
            "type": "ul",
            "items": [
              "Sessionはログイン成功などを契機に生成される",
              "セッションIDがCookieとしてクライアントに渡される",
              "リクエストごとにSessionが参照され、状態判断に使われる",
              "アクセスがあるたびに有効期限が更新されることが多い",
              "期限切れやログアウトによってSessionは失効する"
            ]
          }
        ]
      },
      {
        "id": "cookie-session-full-flow",
        "title": "Cookie & Sessionの完全なリクエストフロー",
        "summary": "CookieとSessionは、単体ではなく一連のHTTP通信の流れの中で連携して機能します。本節では、ログインから通常リクエスト、ログアウトまでの全体像を時系列で整理します。",
        "content": [
          {
            "type": "p",
            "text": "ここまでで、HTTPのステートレス性、Cookieの役割、Sessionの役割を個別に見てきました。本節では、それらを一つの流れとして統合し、「実際のWebアプリケーションで何が起きているのか」をHTTP通信の視点から整理します。"
          },
          {
            "type": "p",
            "text": "以下では、典型的なログイン機能を持つWebアプリケーションを例に、CookieとSessionがどのタイミングで生成され、どのように使われるのかを、リクエスト単位で追っていきます。"
          },
          {
            "type": "p",
            "text": "全体の流れは、大きく次の6段階に分けられます。"
          },
          {
            "type": "ul",
            "items": [
              "① 初回アクセス（Sessionなし）",
              "② ログインリクエスト送信",
              "③ サーバーでSession生成",
              "④ Set-CookieによるSession ID配布",
              "⑤ 認証済みリクエストの繰り返し",
              "⑥ ログアウトまたはSession失効"
            ]
          },
          {
            "type": "p",
            "text": "① 初回アクセス（Sessionなし）\n\nユーザーがブラウザでWebサイトに初めてアクセスする時点では、ブラウザにはまだそのサイト用のCookieが存在しません。したがって、HTTPリクエストにはCookieヘッダーは含まれません。"
          },
          {
            "type": "code",
            "filename": "initial_request.txt",
            "lang": "text",
            "code": "GET / HTTP/1.1\nHost: example.com"
          },
          {
            "type": "p",
            "text": "サーバーはこのリクエストを「未認証の匿名ユーザーからのアクセス」として処理します。この時点ではSessionは存在しない、もしくは利用されていません。"
          },
          {
            "type": "p",
            "text": "② ログインリクエスト送信\n\nユーザーがログインフォームにIDとパスワードを入力し、送信すると、ブラウザはそれらをHTTPリクエストのボディとしてサーバーに送信します。"
          },
          {
            "type": "code",
            "filename": "login_request.txt",
            "lang": "text",
            "code": "POST /login HTTP/1.1\nHost: example.com\nContent-Type: application/json\n\n{\n  \"username\": \"alice\",\n  \"password\": \"secret\"\n}"
          },
          {
            "type": "p",
            "text": "この時点でも、まだSession IDは存在しないため、Cookieヘッダーは含まれていません。"
          },
          {
            "type": "p",
            "text": "③ サーバーでSession生成\n\nサーバーは送信された認証情報を検証し、ログイン成功と判断した場合、新しいSessionを生成します。ここで行われるのは「状態の生成」であり、これは完全にサーバー側の処理です。"
          },
          {
            "type": "p",
            "text": "サーバー内部では、ランダムで推測困難なセッションIDが生成され、そのIDに紐づくSessionデータ（ユーザーID、ログイン状態、権限など）が保存されます。"
          },
          {
            "type": "p",
            "text": "④ Set-CookieによるSession ID配布\n\nSessionを生成した後、サーバーはレスポンスに Set-Cookie ヘッダーを含め、Session IDをクライアントへ渡します。"
          },
          {
            "type": "code",
            "filename": "login_response_with_cookie.txt",
            "lang": "text",
            "code": "HTTP/1.1 200 OK\nSet-Cookie: session_id=abc123; HttpOnly; Path=/\n\nLogin successful"
          },
          {
            "type": "p",
            "text": "ブラウザはこのレスポンスを受け取り、session_id=abc123 というCookieを内部に保存します。この時点で、クライアントとサーバーの間に「識別子による関係」が確立されます。"
          },
          {
            "type": "p",
            "text": "⑤ 認証済みリクエストの繰り返し\n\nログイン後、ユーザーがマイページや設定画面にアクセスすると、ブラウザは保存済みのCookieを自動的にHTTPリクエストに含めます。"
          },
          {
            "type": "code",
            "filename": "authenticated_request.txt",
            "lang": "text",
            "code": "GET /mypage HTTP/1.1\nHost: example.com\nCookie: session_id=abc123"
          },
          {
            "type": "p",
            "text": "サーバーはCookieからセッションIDを取り出し、それに対応するSessionデータを参照します。これにより、HTTP自体はステートレスでありながら、アプリケーションとしては「ログイン状態が維持されている」ように振る舞えます。"
          },
          {
            "type": "p",
            "text": "この流れは、ユーザーが操作を続ける限り何度も繰り返されます。各リクエストは独立していますが、Session IDを媒介として同一ユーザーの状態が再構築されます。"
          },
          {
            "type": "p",
            "text": "⑥ ログアウトまたはSession失効\n\nユーザーがログアウト操作を行った場合、サーバーはSessionデータを削除または無効化します。同時に、Cookieの削除や期限切れ設定をレスポンスとして返すことが一般的です。"
          },
          {
            "type": "p",
            "text": "また、明示的なログアウトがなくても、一定時間アクセスがなければSessionは有効期限切れとなります。この場合も、サーバー側のSessionが消えることでライフサイクルは終了します。"
          },
          {
            "type": "p",
            "text": "このように、CookieとSessionは「HTTPリクエストをまたいで状態を引き継ぐ」という目的のために、明確に役割分担された形で連携しています。"
          },
          {
            "type": "ul",
            "items": [
              "HTTPは常にリクエスト単位で完結する",
              "CookieはSession IDを運ぶための仕組み",
              "Sessionはサーバー側にある状態の本体",
              "各リクエストでSession IDを使って状態を復元する",
              "Sessionの削除により状態管理は即座に終了する"
            ]
          }
        ]
      }
    ]
  },
  {
    "key": "json-web-token",
    "title": "JSON Web Token（JWT）",
    "lessons": [
      {
        "id": "why-jwt-was-born",
        "title": "JWTはなぜ登場したのか ― Session管理の限界",
        "summary": "従来のCookie & Session方式は多くのWebアプリで成功してきましたが、ユーザー数・サーバー数の増加に伴い、スケーラビリティの問題が顕在化しました。JWTはその課題に対する一つの解決策として登場しました。",
        "content": [
          {
            "type": "p",
            "text": "CookieとSessionを用いた認証方式は、長い間Webアプリケーションの標準的な解決策でした。ユーザーの状態をサーバー側で安全に管理でき、設計も直感的で理解しやすいという利点があります。"
          },
          {
            "type": "p",
            "text": "しかし、Webサービスの規模が拡大し、同時接続ユーザー数やアクセス頻度が飛躍的に増えるにつれて、Session方式は徐々に限界を露呈するようになりました。JWTは、こうした背景の中で登場した技術です。"
          },
          {
            "type": "p",
            "text": "まず、Session方式の前提を確認します。Sessionでは、ユーザーごとの状態（ログイン情報など）をサーバー側に保存し、クライアントはCookieとして送信するセッションIDを通じて、その状態を参照します。"
          },
          {
            "type": "p",
            "text": "この設計は単一サーバー構成では非常にうまく機能します。しかし、ユーザー数が増加し、1台のサーバーでは処理しきれなくなった場合、システムは複数台のサーバーによる構成（スケールアウト）へ移行する必要があります。"
          },
          {
            "type": "p",
            "text": "ここで問題が発生します。Sessionはサーバー側に保存されるため、「どのサーバーに、どのユーザーのSessionがあるか」という管理が必要になるからです。"
          },
          {
            "type": "p",
            "text": "例えば、ロードバランサーを介してリクエストが複数のサーバーに振り分けられる環境では、同じユーザーのリクエストが毎回同じサーバーに届くとは限りません。もしSessionがローカルメモリに保存されていれば、別のサーバーではそのSessionを参照できません。"
          },
          {
            "type": "p",
            "text": "この問題への典型的な対処法として、「スティッキーセッション（特定ユーザーを常に同じサーバーに振り分ける）」や、「Sessionを共有ストレージ（DBやRedis）に保存する」といった方法があります。"
          },
          {
            "type": "p",
            "text": "しかし、これらの対策は新たなコストと複雑性を生みます。スティッキーセッションはロードバランシングの自由度を下げ、共有ストレージ方式はSessionストア自体がボトルネックや単一障害点になる可能性があります。"
          },
          {
            "type": "p",
            "text": "さらに、Session方式ではユーザー数に比例してサーバー側の状態が増加します。数百万、数千万ユーザー規模になると、Sessionデータの保存・更新・破棄そのものが大きな運用負荷になります。"
          },
          {
            "type": "p",
            "text": "このように、Session方式は「サーバーがユーザー状態を持ち続ける」設計であるがゆえに、スケーラビリティの面で制約を抱えています。"
          },
          {
            "type": "p",
            "text": "そこで登場した発想が、「サーバーはユーザーの状態を持たない」という考え方です。つまり、認証に必要な情報をクライアント側に持たせ、サーバーはそれを検証するだけ、というモデルです。"
          },
          {
            "type": "p",
            "text": "この思想のもとで設計されたのが、JSON Web Token（JWT）です。JWTは、ユーザー情報や認証結果を一つのトークンとしてまとめ、それをクライアントが保持し、各リクエストで送信します。サーバーはトークンの正当性を検証するだけで、個別のSession状態を保存する必要がありません。"
          },
          {
            "type": "p",
            "text": "つまり、JWTは「Session管理が難しくなったから生まれた」というよりも、「サーバーを可能な限りステートレスに保つために生まれた」と捉える方が正確です。大規模・分散システムとの相性の良さが、JWTの最大の特徴です。"
          },
          {
            "type": "ul",
            "items": [
              "Session方式はサーバー側に状態を保存する",
              "ユーザー数・サーバー数の増加によりSession管理が複雑化する",
              "共有Sessionストアやスティッキーセッションには運用コストがある",
              "JWTはサーバーをステートレスに保つための設計",
              "大規模・分散環境でのスケーラビリティを重視して登場した"
            ]
          }
        ]
      },
      {
        "id": "jwt-structure",
        "title": "JWTの構造（Header・Payload・Signature）を完全に分解する",
        "summary": "JWTは「ドットで3分割された文字列」であり、Header・Payload・Signatureの3要素から構成されます。本節では、各パートが何を意味し、なぜこの構造が成り立つのかを詳細に説明します。",
        "content": [
          {
            "type": "p",
            "text": "JWT（JSON Web Token）は、見た目だけ見ると「長い文字列」に見えますが、実際には明確な構造を持つフォーマットです。JWTは必ず次の3つのパートから構成され、それぞれがピリオド（.）で区切られています。"
          },
          {
            "type": "code",
            "filename": "jwt_format.txt",
            "lang": "text",
            "code": "xxxxx.yyyyy.zzzzz"
          },
          {
            "type": "p",
            "text": "この3つは順番に、Header（ヘッダー）、Payload（ペイロード）、Signature（署名）です。つまりJWTは次の形式を持ちます。"
          },
          {
            "type": "code",
            "filename": "jwt_parts.txt",
            "lang": "text",
            "code": "Base64UrlEncode(Header) . Base64UrlEncode(Payload) . Signature"
          },
          {
            "type": "p",
            "text": "ここで重要なのは、HeaderとPayloadは「JSON」で表現され、それをBase64URLという方式でエンコードして文字列化している、という点です。一方でSignatureは「改ざんされていないことを保証するための検証情報」です。"
          },
          {
            "type": "p",
            "text": "まずは全体像として、JWTの中身を人間が読める形にした例を見てみます。"
          },
          {
            "type": "code",
            "filename": "jwt_decoded_example.txt",
            "lang": "text",
            "code": "[Header]\n{\n  \"alg\": \"HS256\",\n  \"typ\": \"JWT\"\n}\n\n[Payload]\n{\n  \"sub\": \"user_123\",\n  \"name\": \"Alice\",\n  \"iat\": 1700000000,\n  \"exp\": 1700003600\n}\n\n[Signature]\nHMACSHA256(\n  base64url(header) + \".\" + base64url(payload),\n  secret\n)"
          },
          {
            "type": "p",
            "text": "この例をベースに、各パートを順番に細かく分解します。"
          },
          {
            "type": "p",
            "text": "① Header（ヘッダー）\n\nHeaderは「このJWTをどう扱えばよいか」を示すメタ情報です。典型的には、署名アルゴリズム（alg）とトークン種別（typ）を持ちます。"
          },
          {
            "type": "code",
            "filename": "jwt_header.json",
            "lang": "json",
            "code": "{\n  \"alg\": \"HS256\",\n  \"typ\": \"JWT\"\n}"
          },
          {
            "type": "p",
            "text": "alg は署名方式を意味します。HS256は「HMAC + SHA-256」を使う方式で、共有秘密鍵（secret）を使って署名を作ります。typ は通常 \"JWT\" が入りますが、実務では省略されることもあります。"
          },
          {
            "type": "p",
            "text": "Headerが必要な理由は、サーバーがトークンを受け取ったときに「どの方式で検証すればよいか」を理解するためです。ただし、ここで注意点があります。Headerをそのまま信じて検証方式を切り替える設計は危険になり得ます。実装では、受け入れるアルゴリズムをサーバー側で固定・制限するのが一般的です。"
          },
          {
            "type": "p",
            "text": "② Payload（ペイロード）\n\nPayloadは、JWTの中核であり「主張（Claims）」と呼ばれる情報の集合です。ここにユーザー識別子や有効期限など、認証・認可に必要な情報が入ります。"
          },
          {
            "type": "code",
            "filename": "jwt_payload.json",
            "lang": "json",
            "code": "{\n  \"sub\": \"user_123\",\n  \"name\": \"Alice\",\n  \"iat\": 1700000000,\n  \"exp\": 1700003600\n}"
          },
          {
            "type": "p",
            "text": "代表的なClaimには次のようなものがあります。sub は主体（subject）で、ユーザーIDなど「誰のトークンか」を表します。iat は発行時刻（issued at）、exp は有効期限（expiration time）です。JWTではこの exp が極めて重要で、これがないとトークンが実質的に永続化しやすくなります。"
          },
          {
            "type": "p",
            "text": "ここで最重要の注意点があります。Payloadは暗号化されていません。Base64URLは「エンコード」であって「暗号化」ではないため、誰でも復号（デコード）して中身を読めます。したがって、Payloadにはパスワードや個人情報などの機密データを入れてはいけません。"
          },
          {
            "type": "p",
            "text": "③ Signature（署名）\n\nSignatureは「改ざんされていないこと」を保証するための検証用データです。JWTの本質はここにあります。HeaderとPayloadは見える情報であり、重要なのはそれが改ざんされていないことをサーバーが確認できる点です。"
          },
          {
            "type": "p",
            "text": "HS256のようなHMAC方式の場合、署名は次の考え方で作られます。"
          },
          {
            "type": "code",
            "filename": "jwt_signature_concept.txt",
            "lang": "text",
            "code": "signature = HMACSHA256(\n  base64url(header) + \".\" + base64url(payload),\n  secret\n)"
          },
          {
            "type": "p",
            "text": "サーバーはトークンを受け取ったら、同じsecretを使って署名を再計算し、JWTに付いている署名と一致するかを比較します。一致すれば、HeaderとPayloadが途中で書き換えられていないことが分かります。"
          },
          {
            "type": "p",
            "text": "この仕組みにより、サーバーは「ユーザーごとのSession状態を保存しなくても」、トークンの正当性を検証できます。これがJWTが大規模環境で好まれる理由の核心です。"
          },
          {
            "type": "p",
            "text": "最後に、JWTの構造を一言でまとめると次のようになります。HeaderとPayloadは情報（読めるが改ざん可能）、Signatureは改ざん検出（サーバーだけが正当性を判定できる）。この3つを組み合わせることで、トークンとして成立しています。"
          },
          {
            "type": "ul",
            "items": [
              "JWTは「Header.Payload.Signature」の3部構成で、ドットで区切られる",
              "Headerは署名方式などのメタ情報を持つ",
              "PayloadはClaim（ユーザー識別子、有効期限など）を持つ",
              "Payloadは暗号化されていないため、機密情報は入れない",
              "Signatureにより改ざん検出ができ、サーバーは状態保存なしで検証できる"
            ]
          }
        ]
      },
      {
        "id": "jwt-full-request-flow",
        "title": "JWTによる完全な認証リクエストフロー",
        "summary": "JWTはCookie & Sessionとは異なり、サーバーがユーザー状態を保持しません。本節では、ログインから通常APIアクセス、トークン失効までのJWT認証フローをHTTP通信の流れに沿って整理します。",
        "content": [
          {
            "type": "p",
            "text": "前節で見たように、JWTは「サーバーが状態を保持しない」ことを前提とした認証方式です。本節では、JWTが実際のHTTP通信の中でどのように使われるのかを、リクエスト単位の流れとして整理します。"
          },
          {
            "type": "p",
            "text": "JWTを用いた認証フローは、典型的には次の6段階に分けられます。"
          },
          {
            "type": "ul",
            "items": [
              "① 初回アクセス（トークンなし）",
              "② ログインリクエスト送信",
              "③ サーバーでJWTを発行",
              "④ クライアントがJWTを保存",
              "⑤ JWT付きリクエストの繰り返し",
              "⑥ トークンの失効・更新"
            ]
          },
          {
            "type": "p",
            "text": "① 初回アクセス（トークンなし）\n\nユーザーがWebアプリやAPIに初めてアクセスする時点では、クライアントはまだJWTを保持していません。そのため、HTTPリクエストには認証情報が含まれません。"
          },
          {
            "type": "code",
            "filename": "initial_request_no_token.txt",
            "lang": "text",
            "code": "GET /api/resource HTTP/1.1\nHost: api.example.com"
          },
          {
            "type": "p",
            "text": "サーバーはこのリクエストを未認証として扱き、保護されたリソースの場合は401 Unauthorizedなどのレスポンスを返します。"
          },
          {
            "type": "p",
            "text": "② ログインリクエスト送信\n\nユーザーがログイン操作を行うと、IDやパスワードなどの認証情報がHTTPリクエストとしてサーバーに送信されます。"
          },
          {
            "type": "code",
            "filename": "login_request_jwt.txt",
            "lang": "text",
            "code": "POST /login HTTP/1.1\nHost: api.example.com\nContent-Type: application/json\n\n{\n  \"username\": \"alice\",\n  \"password\": \"secret\"\n}"
          },
          {
            "type": "p",
            "text": "この時点では、まだJWTは存在せず、Cookieも必須ではありません。JWT認証では、Cookieを使わずにトークンを扱う構成も一般的です。"
          },
          {
            "type": "p",
            "text": "③ サーバーでJWTを発行\n\nサーバーは認証情報を検証し、正しいと判断した場合、JWTを新たに生成します。このJWTの中には、ユーザーID、有効期限、発行時刻などのClaimが含まれます。"
          },
          {
            "type": "p",
            "text": "ここで重要なのは、サーバーはこのJWTを発行した後、それを保存しないという点です。JWTはあくまでクライアントに渡されるトークンであり、サーバー側にSessionのような状態は残りません。"
          },
          {
            "type": "p",
            "text": "④ クライアントがJWTを保存\n\nサーバーはレスポンスとしてJWTをクライアントに返します。多くの場合、レスポンスボディとして返されます。"
          },
          {
            "type": "code",
            "filename": "login_response_with_jwt.txt",
            "lang": "text",
            "code": "HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  \"access_token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\",\n  \"token_type\": \"Bearer\"\n}"
          },
          {
            "type": "p",
            "text": "クライアントはこのJWTを保存します。保存場所は実装によって異なり、メモリ、localStorage、Cookieなどが使われますが、いずれの場合も「クライアントがトークンを保持する」という点は共通です。"
          },
          {
            "type": "p",
            "text": "⑤ JWT付きリクエストの繰り返し\n\nログイン後、クライアントはAPIリクエストを送るたびに、JWTを認証情報として付与します。最も一般的なのは Authorization ヘッダーを使う方法です。"
          },
          {
            "type": "code",
            "filename": "authenticated_request_with_jwt.txt",
            "lang": "text",
            "code": "GET /api/resource HTTP/1.1\nHost: api.example.com\nAuthorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          },
          {
            "type": "p",
            "text": "サーバーはこのリクエストを受け取ると、JWTの署名を検証し、有効期限（exp）などのClaimをチェックします。問題がなければ、トークンに含まれるユーザー情報を元に処理を行います。"
          },
          {
            "type": "p",
            "text": "ここでの最大の特徴は、サーバーが過去のリクエストを一切記憶していない点です。各リクエストはJWTだけを根拠として検証され、完全に独立して処理されます。"
          },
          {
            "type": "p",
            "text": "⑥ トークンの失効・更新\n\nJWTはSessionとは異なり、サーバー側から即座に無効化することが困難です。そのため、有効期限（exp）を短めに設定する設計が一般的です。"
          },
          {
            "type": "p",
            "text": "トークンが期限切れになった場合、サーバーは認証エラーを返し、クライアントは再ログインやトークン更新（リフレッシュトークン）を行います。これにより、ステートレス性とセキュリティのバランスを取ります。"
          },
          {
            "type": "p",
            "text": "このように、JWT認証では「トークンを毎回検証する」ことで状態管理を不要にし、分散環境でもスケーラブルな設計を実現しています。"
          },
          {
            "type": "ul",
            "items": [
              "JWTはログイン成功時に発行され、サーバー側には保存されない",
              "クライアントがJWTを保持し、毎回リクエストに付与する",
              "Authorizationヘッダーが最も一般的な送信方法",
              "サーバーは署名とClaimを検証するだけで認証できる",
              "JWTはステートレスで分散環境と相性が良い"
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
            Cookie、Session、Tokenの学習
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