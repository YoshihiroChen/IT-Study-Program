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
    "key": "company-analysis",
    "title": "openworkにて企業分析のやり方",
    "lessons": [
      {
        "id": "openwork-basic",
        "title": "OpenWorkを使った企業分析の基本",
        "summary": "OpenWorkを使って企業のリアルな労働環境（年収・残業・カルチャー）を読み取る方法を解説します。",
        "content": [
          {
            "type": "p",
            "text": "企業分析の際、最も重要なのが「外から見えない内部情報を把握すること」です。OpenWork は、社員や元社員の口コミをもとに企業の実態を把握できる強力なツールです。本節では、Simplex を例に企業分析のポイントを解説します。"
          },
          {
            "type": "img",
            "src": "/images/company-analysis-1.png",
            "alt": "OpenWorkでSimplexを検索した画面",
            "caption": "OpenWorkで企業を検索すると、各スコアと月間残業時間が確認できます。"
          },
          {
            "type": "p",
            "text": "画面の赤い丸で囲まれたスコアには、それぞれ重要な意味があります。特に次の3つは企業の働き方を判断する上で非常に重要です。"
          },
          {
            "type": "ul",
            "items": [
              "法令遵守意識：残業代が適切に支払われるかどうか。低いと“サービス残業”がある可能性が高い。",
              "20代成長環境：20代の成長環境スコアが高い = 仕事量が多い、負荷が高い、いわゆる「激務」傾向を示す。",
              "待遇面の満足度：給与が十分かどうかの指標。3.5〜4.0以上なら比較的満足度は高い。"
            ]
          },
          {
            "type": "p",
            "text": "さらに、右側の赤い四角で囲まれているのが「月間の残業時間」です。これは企業の働き方を判断するうえで最重要レベルのデータです。"
          },
          {
            "type": "p",
            "text": "Simplex の場合、20代成長環境のスコアが非常に高く、仕事の負荷が極めて大きいことを示しています。また、法令遵守意識スコアがやや低いため、残業代が満額支払われない可能性があります。待遇面の満足度は 3.9 と比較的高めですが、残業時間が毎月 50 時間を超えており、これは日本企業の中でも上位レベルの長時間労働です。"
          }
        ]
      },
  
      {
        "id": "openwork-questions",
        "title": "質問ページで働き方を確認する",
        "summary": "OpenWork の質問タブを活用して、在宅勤務や制度面に関するリアルな情報を確認します。",
        "content": [
          {
            "type": "p",
            "text": "スコアだけではわからない「働き方」に関する細かい点は、OpenWork の質問ページを見ることで補えます。特に“在宅勤務は可能か”は多くの学生が気にするポイントです。"
          },
          {
            "type": "img",
            "src": "/images/company-analysis-2.png",
            "alt": "OpenWorkの質問欄 在宅勤務に関する回答",
            "caption": "質問ページでは、社員のリアルな回答が確認できます。この例では「完全な在宅勤務は不可、部分的な在宅は可能」と回答されています。"
          },
          {
            "type": "p",
            "text": "在宅勤務に関する質問は複数人が投稿していることもあり、続けてスクロールすると別の回答が見つかる場合があります。"
          },
          {
            "type": "img",
            "src": "/images/company-analysis-3.png",
            "alt": "OpenWorkの質問で別の回答を表示",
            "caption": "同じ質問でも複数の社員が回答しているので、実際の制度の利用度合いをより正確に把握できます。"
          }
        ]
      },
  
      {
        "id": "openwork-review",
        "title": "社員クチコミから“リスク”を読み取る",
        "summary": "OpenWorkの社員レビュー欄で、企業が持つネガティブな側面を深く分析します。",
        "content": [
          {
            "type": "p",
            "text": "企業分析では、ポジティブな情報よりも「ネガティブな情報」をいかに読むかが重要です。OpenWork の社員クチコミ欄には『退職検討理由』や『入社前と入社後のギャップ』など、企業の課題がはっきり書かれています。"
          },
          {
            "type": "img",
            "src": "/images/company-analysis-4.png",
            "alt": "OpenWorkの社員クチコミ画面",
            "caption": "クチコミ欄の赤枠部分には、企業の問題点・退職理由・ギャップなど“本音”が記載されます。"
          },
          {
            "type": "p",
            "text": "特に『退職検討理由』は社内で何が問題になっているかを知る最も重要な情報源です。長時間労働、ワークライフバランスの欠如、給与への不満、マネジメントの問題など、実際の声がそのまま反映されています。"
          },
          {
            "type": "p",
            "text": "『入社前と入社後のギャップ』では、学生時代のイメージと現実の違いを把握できます。ここに多く書かれている企業は、採用段階と実態の間に大きな差がある可能性があります。"
          },
          {
            "type": "p",
            "text": "企業の“良いところ”は面接対策になる一方、“悪いところ”は入社後のミスマッチを避けるために不可欠な情報です。口コミを冷静に分析し、総合的に判断することが企業分析の本質です。"
          }
        ]
      }
    ]
  },

  {
    "key": "company-website-analysis",
    "title": "企業ホームページを使った企業分析",
    "lessons": [
      {
        "id": "visit-official-site",
        "title": "企業ホームページにアクセスする",
        "summary": "企業分析の第一歩は公式サイトを開き、企業のサービス・採用情報を直接確認することです。",
        "content": [
          {
            "type": "p",
            "text": "OpenWorkで企業の内部情報を確認した後は、公式サイトからその企業がどんなサービスを提供し、どんな人材を求めているかを深掘りしていきます。まずは Simplex の公式ホームページを開きましょう。"
          },
          {
            "type": "img",
            "src": "/images/company-analysis-5.png",
            "alt": "Simplex公式ホームページ",
            "caption": "まずは Simplex の公式ホームページを開きます。"
          }
        ]
      },
  
      {
        "id": "services-overview",
        "title": "サービス内容から事業領域を理解する",
        "summary": "企業の事業内容を知るために、公式サイトの“サービス欄”を確認します。",
        "content": [
          {
            "type": "p",
            "text": "企業が提供している事業（ビジネス領域）を知ることは、企業理解の基礎となります。Simplex の場合、上部メニューの「サービス」から主な事業内容を確認できます。"
          },
          {
            "type": "img",
            "src": "/images/company-analysis-6.png",
            "alt": "Simplexのサービス一覧",
            "caption": "サービス欄には、Simplex の主要事業が並んでいます。"
          },
          {
            "type": "p",
            "text": "Simplex の事業領域は以下の通りです。これらはITコンサル・Web系IT企業の両方の特徴を持つ、非常に広い領域をカバーしています。"
          },
          {
            "type": "ul",
            "items": [
              "金融：金融系システム、トレーディング基盤などの高度な開発領域。",
              "AI・データ：分析基盤、AI活用、データ基盤構築などの先端技術領域。",
              "クラウド：AWS・GCP などのクラウド設計・構築。",
              "Web3：ブロックチェーン・分散技術を使った新領域の開発。",
              "UI / UXデザイン：ユーザー体験に基づくアプリ設計。"
            ]
          },
          {
            "type": "p",
            "text": "志望度をアピールするためには、これらのサービスを“理解した上で”志望理由に組み込むことが重要です。単なる興味ではなく、各領域のビジネスロジックを理解することが求められます。"
          }
        ]
      },
  
      {
        "id": "recruit-top",
        "title": "採用情報ページを確認する",
        "summary": "公式サイトの採用情報ページから、新卒向けの情報を確認する方法を学びます。",
        "content": [
          {
            "type": "p",
            "text": "次に、Simplex の採用情報へ進みましょう。トップページ右上の「採用情報」から採用関連のページへ移動できます。"
          },
          {
            "type": "img",
            "src": "/images/company-analysis-7.png",
            "alt": "Simplex採用情報への遷移",
            "caption": "右上の採用情報ボタンから、新卒採用ページへ移動します。"
          },
          {
            "type": "p",
            "text": "採用情報ページでは、新卒向け採用ページ（新卒採用）へアクセスできます。企業が求めている人物像、給与、福利厚生、選考フローなどをここから確認できます。"
          }
        ]
      },
  
      {
        "id": "recruit-requirements",
        "title": "新卒の募集要項を確認する",
        "summary": "募集要項から、給与、勤務条件、募集職種を確認する方法を解説します。",
        "content": [
          {
            "type": "p",
            "text": "新卒採用ページでは、募集要項（募集職種、給与、勤務地、勤務時間、福利厚生など）を確認できます。これにより企業の待遇と期待される働き方を理解できます。"
          },
          {
            "type": "img",
            "src": "/images/company-analysis-8.png",
            "alt": "Simplex募集要項ページ",
            "caption": "募集要項ページで、新卒の待遇と募集職種を確認できます。"
          },
          {
            "type": "img",
            "src": "/images/company-analysis-9.png",
            "alt": "Simplexの月給情報",
            "caption": "Simplex の月給は 425,000 円。日本企業の中でもトップクラスの初任給です。"
          },
          {
            "type": "p",
            "text": "月給 425,000 円は、外資コンサル・外資ITを除けば日本トップクラスの初任給です。その一方で、Simplex は非常にハードワークな企業としても有名で、高待遇の裏側には“激務”が存在します。"
          }
        ]
      },
  
      {
        "id": "selection-flow",
        "title": "選考フローを確認する",
        "summary": "企業の選考ステップを理解し、どのような準備が必要か把握します。",
        "content": [
          {
            "type": "p",
            "text": "募集要項の中には、企業の選考フローも記載されています。選考フローを把握することで、どの能力を求められるか、どの対策を優先すべきか判断できます。"
          },
          {
            "type": "img",
            "src": "/images/company-analysis-10.png",
            "alt": "Simplexの選考フロー",
            "caption": "Simplex の選考フロー：ES → Webテスト → GD → 個別面接（2回）。ITコンサル企業とほぼ同じ構成。"
          },
          {
            "type": "p",
            "text": "Simplex の選考フローは、ITコンサル企業とほぼ共通しています。特に Webテスト と GD があり、ロジカルシンキングとコミュニケーション力が強く求められます。"
          }
        ]
      },
  
      {
        "id": "job-types",
        "title": "企業の職種ラインナップを確認する",
        "summary": "公式サイトの「仕事について」から、募集職種と組織構造を理解します。",
        "content": [
          {
            "type": "p",
            "text": "採用トップページに戻り、「仕事について」では企業内の職種構成を見ることができます。企業の体制や技術スタックを知る上で非常に重要です。"
          },
          {
            "type": "img",
            "src": "/images/company-analysis-11.png",
            "alt": "仕事についてページ",
            "caption": "「仕事について」では、企業がどのような専門職を抱えているか確認できます。"
          },
          {
            "type": "img",
            "src": "/images/company-analysis-12.png",
            "alt": "Simplexの職種一覧",
            "caption": "Simplex にはソフトエンジニア、セキュリティエンジニア、クラウドエンジニアなど、Web系企業に近い専門職が揃っています。"
          },
          {
            "type": "p",
            "text": "職種ラインナップを見ると、Simplex はITコンサル企業でありながら技術職の比率が高く、Web系 IT 企業に近い構造になっています。専門エンジニアが多く在籍しており、技術力を武器に金融・クラウド・AI の大型案件を扱うスタイルが特徴です。"
          }
        ]
      }
    ]
  },
  {
    "key": "company-analysis-overseas-students",
    "title": "留学生の視点から企業分析を行う方法",
    "lessons": [
      {
        "id": "search-xiaohongshu",
        "title": "小红书を活用した留学生向け企業分析",
        "summary": "小红书を使って、留学生が投稿したリアルな選考体験や企業情報を収集する方法を学びます。",
        "content": [
          {
            "type": "p",
            "text": "日本の就職活動では、日本語サイトに掲載されている選考体验や面接対策は、多くの場合、日本人学生向けの内容が中心です。しかし、留学生にとっては、言語・文化・選考基準の違いから、同じ内容がそのまま当てはまらないことも多くあります。"
          },
          {
            "type": "p",
            "text": "そこで非常に役に立つのが“小红书（RED）”です。小红书では、多くの中国留学生が実際の ES、面接、Webテスト、GD の経験を詳細に共有しており、留学生視点のリアルな難易度や注意点を知ることができます。"
          },
          {
            "type": "img",
            "src": "/images/company-analysis-13.png",
            "alt": "小红书での企業選考经验の検索画面",
            "caption": "小红书で企業名を検索すると、留学生による選考経験や攻略情報が多数見つかります。"
          },
          {
            "type": "p",
            "text": "例えば Simplex の場合、日语サイトでは日本人学生の視点が中心ですが、小红书では留学生が経験した Webテストの难易度、语言の壁、GD での立ち回り方、面接官の态度など、留学生だからこそ直面するポイントが詳しく書かれています。"
          },
          {
            "type": "p",
            "text": "特に以下のような情報は、小红书でしか得られないことが多いです："
          },
          {
            "type": "p",
            "text": "留学生にとって、小红书は“最も再现性の高い就活データベース”とも言えます。企業分析をする際は、必ず日本語サイトだけでなく、小红书の情報もあわせて確認することで、より正確で信頼性の高い分析が可能になります。"
          }
        ]
      }
    ]
  },
  {
    "key": "company-analysis-comparison",
    "title": "企業間比較で志望度を高める企業分析",
    "lessons": [
      {
        "id": "why-comparison",
        "title": "なぜ企業間比較が必要なのか",
        "summary": "単独企業の分析だけでは志望度を伝えきれない理由と、企業比較の重要性を解説します。",
        "content": [
          {
            "type": "p",
            "text": "企業分析を進めると、多くの学生は「この企業の事業内容は理解した」と思いがちです。しかし、面接官が本当に知りたいのは『なぜ競合他社ではなく、うちの企業なのか？』という点です。"
          },
          {
            "type": "p",
            "text": "単独の企業分析だけでは、この問いに十分答えられません。志望度を強くアピールするためには、必ず“他社との比較”を行う必要があります。"
          },
          {
            "type": "p",
            "text": "企業比較は、次のような面接質問に対する最も強力な武器になります："
          },
          {
            "type": "ul",
            "items": [
              "「うちではなく、他社ではいけない理由は？」",
              "「複数社を受けていると思いますが、志望順位は？」",
              "「なぜこの業界の中で当社を選んだのですか？」",
              "「同じような事業を持つ企業と比べて、どこに魅力を感じましたか？」"
            ]
          }
        ]
      },
  
      {
        "id": "accenture-vs-simplex",
        "title": "企業比較の具体例：Accenture と Simplex",
        "summary": "Accenture と Simplex の事業領域を比較し、志望理由として活かす方法を学びます。",
        "content": [
          {
            "type": "p",
            "text": "ここでは、IT コンサルティング領域で人気のある 2 社：Accenture と Simplex を例に挙げて、企業比較の具体例を説明します。"
          },
          {
            "type": "img",
            "src": "/images/company-analysis-14.png",
            "alt": "アクセンチュアの事業内容",
            "caption": "アクセンチュアの事業内容"
          },
          {
            "type": "p",
            "text": "企業比較の基準はさまざまですが、特に“事業領域の違い”は最もわかりやすく、志望理由に直接つながる情報です。"
          },
          {
            "type": "p",
            "text": "まず、2 社の大きな違いをまとめると以下のようになります。"
          },
          {
            "type": "ul",
            "items": [
              "Simplex：金融 × IT を中心とした高難度システム開発が主力。AI、クラウド、Web3 など技術に特化した事業構造。",
              "Accenture：Simplex の事業領域を含みつつ、さらに人材開発、サステナビリティ、戦略コンサルティング、BPO など幅広い総合コンサルティング事業を展開。"
            ]
          },
          {
            "type": "p",
            "text": "このように、Accenture は“総合コンサル型企業”、Simplex は“テクノロジードリブン企業”という違いがあります。"
          },
          {
            "type": "p",
            "text": "この違いを利用することで、面接で次のように志望度を示すことができます："
          },
          {
            "type": "ul",
            "items": [
              "「Accenture は人材・サステナビリティなど広い領域がありますが、私は技術を武器に金融領域で価値を出したいので、Simplex に惹かれました。」",
              "「総合型ではなく、専門性の高いフィールドで鍛えられたいという軸で比較した結果、Simplex を第一志望にしています。」",
              "「Accenture の幅広さも魅力的ですが、私はより深い技術課題に向き合える環境を求めており、その点で Simplex が最も適していると考えました。」"
            ]
          },
          {
            "type": "p",
            "text": "このように、企業比較を行うことで“自分の軸”が明確になり、説得力のある志望理由につながります。"
          }
        ]
      },
  
      {
        "id": "how-to-compare",
        "title": "企業比較のやり方",
        "summary": "企業を比較するために必要な分析項目と、効果的な比較方法を紹介します。",
        "content": [
          {
            "type": "p",
            "text": "実際に企業比較を行う際には、次の分析項目を中心に比較を行うと効果的です。"
          },
          {
            "type": "ul",
            "items": [
              "① 事業領域の広さ・深さ（総合型か専門型か）",
              "② 技術力の強さ・専門性の高さ",
              "③ 提供サービスの対象（金融・公共・製造・通信など）",
              "④ 働き方（残業時間、在宅勤務制度、プロジェクトの性質）",
              "⑤ 組織文化（体育会系・ロジカル重視・専門性重視など）",
              "⑥ 育成・研修制度の違い",
              "⑦ 企業の規模感（上場・売上・社員数）",
              "⑧ 強みと弱みの比較表を作る"
            ]
          },
          {
            "type": "p",
            "text": "特に面接対策として重要なのは、次の 3 点です："
          },
          {
            "type": "ul",
            "items": [
              "・他社より自社を選ぶ理由が明確になっているか",
              "・比較の軸（価値観）が一貫しているか",
              "・単なる企業紹介ではなく、自分自身の“Will（やりたいこと）”とつながっているか"
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
            ITコンサルの企業分析法
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