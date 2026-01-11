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
    "key": "https-basics",
    "title": "HTTPSの基礎理解",
    "lessons": [
      {
        "id": "http-insecurity",
        "title": "HTTPプロトコルの危険性と限界",
        "summary": "HTTP通信が抱えるセキュリティ上の問題点を理解し、HTTPSが必要とされる理由を学びます。",
        "content": [
          {
            "type": "p",
            "text": "HTTP（HyperText Transfer Protocol）は、Webの基本となる通信プロトコルですが、「通信内容が暗号化されない」という重大な欠点を持っています。そのため、第三者に通信を盗み見られたり、内容を改ざんされたりする危険性があります。"
          },
          {
            "type": "p",
            "text": "例えば、HTTPでログインフォームを送信した場合、ユーザーIDやパスワードは**平文（そのままの文字列）**でネットワーク上を流れます。これは、同じネットワーク上にいる攻撃者にとって、情報を取得しやすい状態であることを意味します。"
          },
          {
            "type": "code",
            "filename": "http-plain-request.txt",
            "lang": "text",
            "code": "POST /login HTTP/1.1\nHost: example.com\n\nusername=alice&password=secret123"
          },
          {
            "type": "p",
            "text": "このようなHTTP通信では、次のようなリスクが存在します。"
          },
          {
            "type": "ul",
            "items": [
              "通信内容を第三者に盗聴される（盗聴）",
              "通信途中で内容を書き換えられる（改ざん）",
              "接続先サーバーが本物かどうか確認できない（なりすまし）"
            ]
          },
          {
            "type": "p",
            "text": "これらの問題を解決するために登場したのが **HTTPS（HyperText Transfer Protocol Secure）** です。HTTPSは、HTTP通信にTLS（SSL）による暗号化と認証の仕組みを追加し、安全なデータ通信を実現します。"
          },
          {
            "type": "p",
            "text": "次の章では、HTTPSがどのようにして通信を安全にしているのか、その仕組みを詳しく見ていきます。"
          }
        ]
      }
    ]
  },
  {
    "key": "https-basic-mechanism",
    "title": "HTTPSの基本仕組み",
    "lessons": [
      {
        "id": "symmetric-encryption",
        "title": "対称鍵暗号方式とは何か",
        "summary": "HTTPSで使われる暗号技術の基礎として、対称鍵暗号方式の考え方を理解します。",
        "content": [
          {
            "type": "p",
            "text": "HTTPSの仕組みを理解するためには、まず「暗号化通信の基本概念」を知る必要があります。その中でも最も基本となるのが、「対称鍵暗号方式（Symmetric Encryption）」です。"
          },
          {
            "type": "p",
            "text": "対称鍵暗号方式とは、暗号化と復号に同じ鍵（秘密鍵）を使う方式のことを指します。送信者と受信者の両方が、あらかじめ同じ鍵を共有していることが前提になります。"
          },
          {
            "type": "p",
            "text": "この方式では、送信側は平文データを秘密鍵で暗号化し、受信側は同じ秘密鍵を使って元のデータに復号します。第三者が通信内容を盗み見たとしても、鍵を持っていなければ内容を理解することはできません。"
          },
          {
            "type": "code",
            "filename": "symmetric-encryption-image.txt",
            "lang": "text",
            "code": "平文データ\n   ↓（秘密鍵で暗号化）\n暗号文\n   ↓（同じ秘密鍵で復号）\n平文データ"
          },
          {
            "type": "ul",
            "items": [
              "暗号化と復号に同じ鍵を使用する",
              "処理が高速で、大量データの通信に向いている",
              "鍵を安全に共有する必要がある"
            ]
          },
          {
            "type": "p",
            "text": "対称鍵暗号方式は非常に高速で効率的なため、HTTPS通信においても 実際のデータ通信部分ではこの方式が使われています。しかし一方で、最初に秘密鍵をどのように安全に共有するかという問題が存在します。"
          },
          {
            "type": "p",
            "text": "次の小節では、この鍵共有の問題を解決するために使われる「公開鍵暗号方式」について学びます。"
          }
        ]
      },
      {
        "id": "symmetric-key-problem",
        "title": "対称鍵暗号方式が抱える課題",
        "summary": "対称鍵暗号方式における最大の問題点である「鍵共有の危険性」について理解します。",
        "content": [
          {
            "type": "p",
            "text": "対称鍵暗号方式は高速で効率的な暗号方式ですが、重大な弱点を抱えています。それが、秘密鍵をどのように相手に安全に渡すかという問題です。"
          },
          {
            "type": "p",
            "text": "通信を開始する前に、送信者と受信者は同じ秘密鍵を共有しておく必要があります。しかし、この秘密鍵をネットワーク上で送信する場合、その通信自体が盗聴される可能性があります。"
          },
          {
            "type": "code",
            "filename": "symmetric-key-leak-risk.txt",
            "lang": "text",
            "code": "送信者\n  ↓（秘密鍵を送信）\nインターネット（盗聴の可能性）\n  ↓\n受信者\n\n※ 鍵が盗まれると、以降の通信内容はすべて解読される"
          },
          {
            "type": "p",
            "text": "もし第三者がこの秘密鍵を入手してしまうと、その後にやり取りされるすべての暗号通信を復号できてしまうため、暗号化の意味がなくなってしまいます。"
          },
          {
            "type": "ul",
            "items": [
              "秘密鍵を安全に共有する方法が必要",
              "鍵送信時に盗聴されるリスクがある",
              "一度鍵が漏れると通信全体が危険にさらされる"
            ]
          },
          {
            "type": "p",
            "text": "このように、対称鍵暗号方式は単体では「安全な鍵共有」を実現できません。この問題を解決するために考案されたのが、次に学ぶ「公開鍵暗号方式」です。"
          }
        ]
      },
      {
        "id": "asymmetric-encryption",
        "title": "非対称鍵暗号方式（公開鍵暗号）",
        "summary": "対称鍵暗号方式の鍵共有問題を解決するための、非対称鍵暗号方式の仕組みと利用手順を理解します。",
        "content": [
          {
            "type": "p",
            "text": "対称鍵暗号方式の「鍵共有が危険」という問題を解決するために考案されたのが、「非対称鍵暗号方式（Asymmetric Encryption / 公開鍵暗号方式）」です。"
          },
          {
            "type": "p",
            "text": "非対称鍵暗号方式では、2つで1組になる異なる鍵を使用します。この2つの鍵は役割が異なり、片方の鍵で暗号化したデータは、「もう一方の鍵でしか復号できない」という性質を持っています。"
          },
          {
            "type": "p",
            "text": "重要なポイントは、どちらの鍵で暗号化しても、反対側の鍵でしか復号できないという点です。この性質を利用することで、安全な鍵共有が可能になります。"
          },
          {
            "type": "p",
            "text": "ここでは、A と B の2者間通信を例に、非対称鍵暗号方式を使った安全な鍵共有の流れを見ていきます。"
          },
          {
            "type": "code",
            "filename": "asymmetric-key-exchange.txt",
            "lang": "text",
            "code": "① A が鍵のペアを用意する\n   ・鍵1（公開してよい鍵）\n   ・鍵2（絶対に秘密にする鍵）\n\n② A は「鍵1」を B に送る\n   ※ この途中で第三者に盗まれても問題はない\n\n③ B は自分で作った「対称鍵」を、\n   受け取った 鍵1 で暗号化する\n\n④ B は、暗号化された対称鍵を A に送る\n\n⑤ A は、自分だけが持つ 鍵2 を使って\n   暗号化された対称鍵を復号する\n\n→ A は安全に対称鍵を受け取ることができる"
          },
          {
            "type": "p",
            "text": "この仕組みでは、途中で通信を盗聴する第三者が存在しても、暗号化された対称鍵を復号するための鍵を持っていないため、中身を知ることはできません。"
          },
          {
            "type": "ul",
            "items": [
              "鍵は2つで1組（片方で暗号化、もう片方で復号）",
              "公開してよい鍵が存在する",
              "安全に対称鍵を共有するために利用される"
            ]
          },
          {
            "type": "p",
            "text": "このように、非対称鍵暗号方式は 対称鍵暗号方式そのものを置き換えるためではなく、対称鍵を安全に共有するために使われます。HTTPSでは、この仕組みを使って最初に対称鍵を安全に交換し、その後の通信は高速な対称鍵暗号方式で行います。"
          }
        ]
      },
      {
        "id": "asymmetric-encryption-problem",
        "title": "非対称鍵暗号方式が抱える問題点",
        "summary": "公開鍵を安全に受け取れない場合に発生する「なりすまし・改ざん問題」を理解します。",
        "content": [
          {
            "type": "p",
            "text": "非対称鍵暗号方式は、対称鍵を安全に共有できる強力な仕組みですが、それだけでは完全に安全とは言えません。特に問題となるのが、公開鍵が途中で改ざんされる可能性です。"
          },
          {
            "type": "p",
            "text": "前の小節では、②の手順として「A が公開してよい鍵（鍵1）を B に送る」流れを説明しました。しかし、この通信経路上に第三者（中間者）が存在する場合、送信された鍵1が本当に A のものかどうかを B は確認できません。"
          },
          {
            "type": "p",
            "text": "ここで発生する問題の流れを、段階ごとに整理してみます。"
          },
          {
            "type": "code",
            "filename": "asymmetric-key-tampering.txt",
            "lang": "text",
            "code": "① A は鍵のペアを作成する\n   ・鍵1（公開鍵）\n   ・鍵2（秘密鍵）\n\n② A は 鍵1 を B に送信する\n   ↓\n   ※ この途中で中間者が介入\n\n③ 中間者は、A の 鍵1 を\n   自分の用意した別の鍵（偽の鍵1）に差し替える\n\n④ B は、それが A の鍵だと信じて\n   偽の鍵1 を使って\n   自分の対称鍵を暗号化する\n\n⑤ B は、暗号化された対称鍵を A に送る\n\n⑥ 中間者は、自分が用意した鍵を使って\n   B から送られた対称鍵を復号する\n\n→ 中間者は A と B が使う対称鍵を入手してしまう"
          },
          {
            "type": "p",
            "text": "この結果、中間者は A と B の間で使用される対称鍵を完全に把握した状態になります。その後の通信は対称鍵暗号方式で行われるため、通信内容はすべて中間者に解読されてしまいます。"
          },
          {
            "type": "ul",
            "items": [
              "公開鍵が本当に相手のものか確認できない",
              "鍵が途中で差し替えられても気づけない",
              "結果として中間者攻撃（MITM）が成立する"
            ]
          },
          {
            "type": "p",
            "text": "この問題は、非対称鍵暗号方式そのものの欠陥ではなく、「公開鍵の正当性を保証できない」ことによって発生します。HTTPSでは、この問題を解決するために 「証明書（Certificate）」と「認証局（CA）」という仕組みが導入されています。次の小節では、その解決方法を詳しく見ていきます。"
          }
        ]
      },
      {
        "id": "prevent-key-tampering",
        "title": "公開鍵の改ざんを防ぐ仕組み",
        "summary": "公開鍵が途中で差し替えられる問題を、防止するための「署名による検証」の考え方を理解します。",
        "content": [
          {
            "type": "p",
            "text": "前の小節では、非対称鍵暗号方式において、公開鍵が途中で改ざんされると中間者攻撃が成立してしまうという問題を見ました。この問題を防ぐためには、受信した公開鍵が本当に A が送ったものであることを確認できる仕組みが必要になります。"
          },
          {
            "type": "p",
            "text": "そのために使われる考え方が、「秘密鍵で暗号化し、公開鍵で検証する」仕組みです。ここでは、A が追加で用意する鍵のペアを使って、改ざんを防ぐ流れを整理します。"
          },
          {
            "type": "p",
            "text": "A は、これまでの通信に使う鍵とは別に、もう一組の鍵ペアを用意します。"
          },
          {
            "type": "ul",
            "items": [
              "鍵3：A だけが持つ秘密鍵（署名用）",
              "鍵4：誰にでも公開してよい公開鍵（検証用）"
            ]
          },
          {
            "type": "p",
            "text": "次に、公開鍵の改ざんを防ぐための通信手順を、順を追って見ていきます。"
          },
          {
            "type": "code",
            "filename": "prevent-public-key-tampering.txt",
            "lang": "text",
            "code": "① A は新しい鍵ペアを用意する\n   ・鍵3（秘密鍵）\n   ・鍵4（公開鍵）\n\n② A は 鍵4（公開鍵）を B に送る\n   ※ 中間者に知られても問題はない\n\n③ A は、通信に使う公開鍵（鍵1）を\n   自分の秘密鍵（鍵3）で暗号化する\n\n④ A は、暗号化された 鍵1 を B に送る\n\n⑤ B は、受け取った 鍵4 を使って\n   暗号化された 鍵1 を復号する\n\n→ B は「この鍵1は A が送った本物だ」と確認できる"
          },
          {
            "type": "p",
            "text": "この仕組みでは、中間者は鍵4（公開鍵）を知っているため、暗号化された鍵1を復号することはできます。しかし、A の秘密鍵（鍵3）を持っていないため、復号した内容を再び暗号化して差し替えることができません。"
          },
          {
            "type": "p",
            "text": "そのため、中間者が途中で公開鍵を書き換えようとしても、B 側で検証に失敗し、改ざんが発覚します。これにより、公開鍵の正当性が保証されます。"
          },
          {
            "type": "ul",
            "items": [
              "秘密鍵で暗号化することで「送信者本人」を証明できる",
              "公開鍵は改ざん検知のために使われる",
              "中間者は再暗号化できないため、差し替えが不可能"
            ]
          },
          {
            "type": "p",
            "text": "このように、秘密鍵で暗号化し、公開鍵で検証する仕組みによって、公開鍵の改ざんを防ぐことができます。この考え方は「デジタル署名」と呼ばれ、HTTPSでは証明書と認証局（CA）を通じて、より大規模に実装されています。"
          }
        ]
      },
      {
        "id": "trusted-third-party-solution",
        "title": "信頼できる第三者による改ざん問題の解決",
        "summary": "公開鍵の改ざんが無限に連鎖する問題を、信頼できる第三者を導入することで解決する考え方を理解します。",
        "content": [
          {
            "type": "p",
            "text": "前の小節では、秘密鍵による暗号化を使って公開鍵の改ざんを防ぐ方法を説明しました。しかし、この方法にも根本的な問題が残っています。"
          },
          {
            "type": "p",
            "text": "それは、改ざんを防ぐために最初に送る公開鍵自体も、やはり改ざんされる可能性があるという点です。公開鍵4を安全に届けるためには、さらに別の鍵が必要になり、その鍵を守るためにまた別の仕組みが必要になります。"
          },
          {
            "type": "p",
            "text": "このようにして、鍵を増やせば増やすほど「その鍵をどうやって安全に渡すか」という問題が繰り返し発生し、無限ループ（悪性循環）に陥ってしまいます。"
          },
          {
            "type": "p",
            "text": "この問題を根本的に解決するために導入されるのが、信頼できる第三者の存在です。この第三者は、通信当事者である A と B のどちらからも信頼されており、自身も鍵のペアを持っています。"
          },
          {
            "type": "p",
            "text": "ここでは、第三者を介して公開鍵1の改ざんを防ぐ流れを、段階的に整理します。"
          },
          {
            "type": "code",
            "filename": "trusted-third-party-flow.txt",
            "lang": "text",
            "code": "① A は、自分の公開鍵（鍵1）を\n   信頼できる第三者に送る\n\n② 第三者は、自分の秘密鍵で\n   A の公開鍵（鍵1）を暗号化する\n\n③ 第三者は、\n   ・暗号化された 公開鍵1\n   ・第三者自身の公開鍵\n   を用意する\n\n④ 第三者は、自分の公開鍵を B に送る\n\n⑤ 第三者は、暗号化された 公開鍵1 を\n   A に返す\n\n⑥ A は、\n   ・暗号化された 公開鍵1\n   ・暗号化されていない 公開鍵1\n   の両方を B に送る\n\n⑦ B は、第三者から受け取った公開鍵を使って\n   暗号化された 公開鍵1 を復号する\n\n⑧ B は、復号した 公開鍵1 と\n   A から直接受け取った 公開鍵1 を比較する\n\n→ 一致すれば改ざんなし\n→ 一致しなければ改ざんありとして通信を拒否"
          },
          {
            "type": "p",
            "text": "この仕組みにより、第三者の秘密鍵を持たない中間者は、暗号化された公開鍵1を正しく作り直すことができません。そのため、公開鍵の差し替えや改ざんは必ず検出されます。"
          },
          {
            "type": "ul",
            "items": [
              "鍵の信頼性を第三者が保証する",
              "第三者の秘密鍵は中間者には入手できない",
              "比較によって改ざんを検知できる"
            ]
          },
    
        ]
      }
      
      
      
      
      
    ]
  },
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
   
  
  
  
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