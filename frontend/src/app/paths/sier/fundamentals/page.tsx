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
    "key": "about-this-guide",
    "title": "本ガイドについて",
    "lessons": [
      {
        "id": "guide-overview",
        "title": "ガイドの目的と概要",
        "summary": "本ガイドは、SE（システムエンジニア）を志望する新卒学生を対象に、SIer業界の構造と就職方法をわかりやすく解説するものです。",
        "content": [
          {
            "type": "p",
            "text": "このガイドは、システムエンジニア（SE）としての新卒就職を目指す学生に向けて作成されたものです。SIer業界とは何か、その役割・分類・職種構成を体系的に解説し、就職活動における理解を深めることを目的としています。"
          },
          {
            "type": "p",
            "text": "特に、SIer企業におけるSEの仕事内容やキャリアパス、選考の特徴、必要とされるスキルや心構えなどを中心に紹介します。技術的な知識に加えて、業界全体の構造や動向を理解することで、より戦略的に就職活動を進める助けとなることを目指しています。"
          },
          {
            "type": "p",
            "text": "このガイドを通じて、皆さんが自分に合ったSIer企業や職種を見つけ、IT業界の中で確かな一歩を踏み出せるようになることを願っています。"
          }
        ]
      }
    ]
  },
  
  {
    "key": "sier-role",
    "title": "SI業界の役割",
    "lessons": [
      {
        "id": "what-sier-does",
        "title": "SI業界とは何をしているのか",
        "summary": "企業や行政の業務をITシステムで支える「総合請負型」の業界です。要件定義から設計・開発・運用保守までを一貫して提供します。",
        "content": [
          {
            "type": "p",
            "text": "SI（System Integration）業界は、クライアント企業や官公庁が抱える業務課題を、ITシステムの導入によって解決することを目的とした業界です。業務分析からシステム設計・構築、導入後の運用保守までを一貫して請け負うことが特徴です。このような企業は一般的に「SIer（エスアイヤー）」と呼ばれます。"
          },
          {
            "type": "p",
            "text": "SIerのビジネスモデルは、クライアントからの受託契約（請負・委託）を中心に成り立っています。上流工程では顧客企業と直接打ち合わせを行い、要件定義・基本設計を担当し、中流～下流工程では実際のプログラム開発やテストを外注企業や下請けパートナーと連携して進めます。"
          },
          {
            "type": "p",
            "text": "この構造は「多層構造（ピラミッド構造）」と呼ばれ、最上位の大手SIer（例：NTTデータ、日立製作所、富士通など）がプロジェクト全体を統括し、一次・二次請けの中小企業が開発実務を担うケースが多いです。プロジェクトのスケジュール管理、品質保証、顧客折衝などのマネジメント業務も重要な役割となります。"
          },
          {
            "type": "p",
            "text": "また、最近ではクラウド化・DX（デジタルトランスフォーメーション）推進により、単なるシステム構築だけでなく「コンサルティング」や「データ活用支援」に踏み出すSIerも増えています。従来の受託型から、価値提案・共創型のビジネスモデルへと変化しつつあります。"
          },
          {
            "type": "ul",
            "items": [
              "クライアント企業の業務課題をITで解決する",
              "要件定義～設計～開発～運用までの一貫受託",
              "多層構造によるプロジェクトマネジメント",
              "受託中心からDX・コンサルティング型への進化"
            ]
          }
        ]
      }
    ]
  },
  {
    "key": "existing-roles",
    "title": "既存職種",
    "lessons": [
      {
        "id": "it-consultant",
        "title": "ITコンサルタント",
        "summary": "クライアントの経営課題をITの力で解決へ導く専門職。戦略立案からシステム構想策定までを担います。",
        "content": [
          {
            "type": "p",
            "text": "ITコンサルタントは、企業が抱える経営課題や業務改善のニーズを分析し、ITを活用した最適な解決策を提案する職種です。単なるシステム導入ではなく、「なぜ導入するのか」「どのような効果を得るのか」というビジネス視点から企画・提案を行います。"
          },
          {
            "type": "p",
            "text": "SIerでは上流工程の入口に位置し、クライアントと最初に接点を持つ重要な役割です。業務分析や要件定義、IT戦略の策定などを通じて、システム開発全体の方向性を決定します。"
          },
          {
            "type": "ul",
            "items": [
              "経営・業務課題のヒアリングと分析",
              "IT戦略・システム化構想の立案",
              "要件定義・プロジェクト企画支援",
              "経営層への提案資料作成とプレゼンテーション"
            ]
          }
        ]
      },
      {
        "id": "project-manager",
        "title": "プロジェクトマネージャー（PM）",
        "summary": "システム開発全体を統括し、納期・品質・コストを管理する責任者です。",
        "content": [
          {
            "type": "p",
            "text": "プロジェクトマネージャー（PM）は、システム開発プロジェクトの責任者として、チーム全体を統括します。顧客との契約管理、進捗・予算・品質・リスクの管理などを行い、プロジェクトの成功に責任を持ちます。"
          },
          {
            "type": "p",
            "text": "単に技術的な理解だけでなく、リーダーシップ・交渉力・マネジメントスキルが求められる職種です。近年ではアジャイル型やハイブリッド型のプロジェクト運営も増え、多様な管理手法への理解も重要です。"
          },
          {
            "type": "ul",
            "items": [
              "プロジェクト全体の進捗・コスト・品質管理",
              "チーム編成・メンバー育成・モチベーション管理",
              "顧客・ベンダーとの調整・交渉",
              "リスクマネジメントと課題解決"
            ]
          }
        ]
      },
      {
        "id": "project-leader",
        "title": "プロジェクトリーダー（PL）",
        "summary": "開発チームの現場責任者として、PMの下で実務を推進する役割です。",
        "content": [
          {
            "type": "p",
            "text": "プロジェクトリーダー（PL）は、プロジェクトマネージャーの方針のもとで、開発チームの日々の業務を取りまとめます。要件定義の実務化、設計書のレビュー、タスク分配、進捗報告などを担当します。"
          },
          {
            "type": "p",
            "text": "PLは現場に最も近い管理者として、メンバーとのコミュニケーションを通じて品質とスピードを両立させる役割を担います。技術的な判断力と人間的なリーダーシップの両方が求められます。"
          },
          {
            "type": "ul",
            "items": [
              "要件定義や基本設計の具体化・レビュー",
              "開発チームの進捗管理と課題共有",
              "技術的な指導・品質確認",
              "PMへの報告と顧客対応補助"
            ]
          }
        ]
      },
      {
        "id": "system-engineer",
        "title": "システムエンジニア（SE）",
        "summary": "要件定義から設計・開発までを担い、顧客ニーズをシステムとして形にする中核的職種です。",
        "content": [
          {
            "type": "p",
            "text": "システムエンジニア（SE）は、クライアントが求める業務機能を理解し、それを実際のシステムとして設計・実装する職種です。上流では要件定義や設計を、下流ではプログラマーと協力して開発を進めます。"
          },
          {
            "type": "p",
            "text": "顧客との調整や仕様書作成などのドキュメント業務が多く、技術力だけでなくコミュニケーション能力や論理的思考も重視されます。SIerの現場では最も人数が多い中心的職種です。"
          },
          {
            "type": "ul",
            "items": [
              "要件定義書・設計書の作成",
              "仕様検討・顧客との打ち合わせ",
              "プログラマーへの指示とレビュー",
              "テスト設計・動作確認"
            ]
          }
        ]
      },
      {
        "id": "programmer",
        "title": "プログラマー（PG）",
        "summary": "設計書をもとに実際のプログラムを作成し、システムを動かす技術担当です。",
        "content": [
          {
            "type": "p",
            "text": "プログラマー（PG）は、システムエンジニアが作成した設計書をもとに、具体的なコードを記述し、テストを通じてシステムを完成させる職種です。Java、C#、Python、SQLなど、言語やフレームワークのスキルが重要になります。"
          },
          {
            "type": "p",
            "text": "SIerではしばしば外部委託や下請け企業がこの工程を担当しますが、品質を左右する重要な工程であり、細部への注意力と安定した実装力が求められます。"
          },
          {
            "type": "ul",
            "items": [
              "設計書に基づくプログラム実装",
              "単体テスト・結合テストの実施",
              "バグ修正・仕様変更への対応",
              "コードレビュー・品質向上施策"
            ]
          }
        ]
      },
      {
        "id": "infra-engineer",
        "title": "インフラエンジニア",
        "summary": "システムを動かすためのサーバー・ネットワークなどの基盤を設計・運用します。",
        "content": [
          {
            "type": "p",
            "text": "インフラエンジニアは、システムが安定的に稼働するための環境を整える職種です。ネットワーク構築、サーバー設定、クラウド運用、セキュリティ管理などを担当します。"
          },
          {
            "type": "p",
            "text": "オンプレミスからクラウド（AWS・Azure・GCP）への移行が進む中で、仮想化技術やIaC（Infrastructure as Code）の知識も重要になっています。開発チームと連携し、運用効率と安全性を両立させることが求められます。"
          },
          {
            "type": "ul",
            "items": [
              "ネットワーク・サーバーの設計・構築・運用",
              "クラウド環境の設定・監視・最適化",
              "セキュリティ対策・障害対応",
              "インフラ自動化（Ansible, Terraformなど）"
            ]
          }
        ]
      },
      {
        "id": "operation-maintenance",
        "title": "運用・保守エンジニア",
        "summary": "稼働中のシステムを安定的に動かし、トラブルを未然に防ぐ職種です。",
        "content": [
          {
            "type": "p",
            "text": "運用・保守エンジニアは、導入済みのシステムが24時間安定して稼働するよう、監視・障害対応・定期メンテナンスを行います。異常検知やログ分析、バックアップ管理など、システムを「守る」ことに特化した職種です。"
          },
          {
            "type": "p",
            "text": "障害時の迅速な対応力と原因分析能力が求められ、夜間や休日対応が発生する場合もあります。クラウド監視ツールや自動運用スクリプトの導入など、効率化も進んでいます。"
          },
          {
            "type": "ul",
            "items": [
              "システムの稼働監視・ログ分析",
              "障害発生時の初動対応・復旧作業",
              "バックアップ・セキュリティパッチ適用",
              "運用自動化ツールの活用と改善提案"
            ]
          }
        ]
      },
      {
        "id": "test-engineer",
        "title": "テストエンジニア",
        "summary": "開発されたシステムの品質を保証するために、検証計画を立てテストを実施する専門職です。",
        "content": [
          {
            "type": "p",
            "text": "テストエンジニアは、システムが仕様通りに動作し、バグや不具合がないかを確認する職種です。テスト設計書の作成、テストケースの実施、結果報告などを通じて、品質を保証します。"
          },
          {
            "type": "p",
            "text": "自動テストツール（Selenium、JUnitなど）の活用やCI/CDパイプラインとの連携により、効率的で再現性の高いテストを行うことが重視されています。"
          },
          {
            "type": "ul",
            "items": [
              "テスト計画・テストケース設計",
              "手動・自動テストの実施と結果分析",
              "不具合報告・品質改善提案",
              "自動テスト環境の構築と保守"
            ]
          }
        ]
      },
      {
        "id": "sales-engineer",
        "title": "セールスエンジニア",
        "summary": "技術知識を持ちながら営業活動を支援し、顧客との信頼関係を築く職種です。",
        "content": [
          {
            "type": "p",
            "text": "セールスエンジニアは、営業職と技術職の中間に位置する職種で、顧客の要望を技術的な観点から分析し、最適なシステム構成を提案します。提案書作成やプレゼンのほか、導入後のフォローアップも行います。"
          },
          {
            "type": "p",
            "text": "技術的理解力とコミュニケーション能力の両方が必要であり、顧客の信頼を得る「技術的な営業担当」として重要な役割を果たします。"
          },
          {
            "type": "ul",
            "items": [
              "顧客の要件ヒアリングと技術的提案",
              "提案書・見積書の作成とプレゼン",
              "導入前後の技術サポート・フォロー",
              "営業部門と開発部門の橋渡し"
            ]
          }
        ]
      }
    ]
  },

  {
    "key": "sier-types",
    "title": "SIerの分類",
    "lessons": [
      {
        "id": "user-based",
        "title": "ユーザー系SIer",
        "summary": "事業会社（親会社）のシステム部門が分社化して誕生したSIer。グループ内向けのシステム開発が中心です。",
        "content": [
          {
            "type": "p",
            "text": "ユーザー系SIerは、銀行、保険、製造、商社などの大手企業グループの情報システム部門が独立して設立されたSIerです。親会社やグループ企業のシステム開発・運用を主な業務とし、業務知識の深さが強みです。"
          },
          {
            "type": "p",
            "text": "顧客が限られているため営業負担が比較的少なく、長期的な安定取引を維持できる点が特徴です。親会社の業務フローを熟知しているため、業務改善提案やDX支援を行うケースも増えています。"
          },
          {
            "type": "ul",
            "items": [
              "親会社・グループ向けのシステム開発・運用",
              "特定業界の業務知識（例：銀行・製造・物流）に精通",
              "安定した取引関係と長期的キャリア形成",
              "代表例：野村総合情報（NRIデジタル）、みずほリサーチ&テクノロジーズ、三菱UFJインフォメーションテクノロジー"
            ]
          }
        ]
      },
      {
        "id": "maker-based",
        "title": "メーカー系SIer",
        "summary": "ハードウェアメーカーや電機メーカーを母体とし、自社製品や技術を活かしたソリューション提供を行うSIer。",
        "content": [
          {
            "type": "p",
            "text": "メーカー系SIerは、日立製作所、富士通、NECなどの大手電機メーカーを母体とする企業群です。自社のハードウェア・ソフトウェア製品を基盤に、官公庁・金融・製造業など幅広い分野にシステムソリューションを提供します。"
          },
          {
            "type": "p",
            "text": "メーカーとしての研究開発力と技術基盤を活かし、インフラからアプリケーションまで包括的に対応できる点が強みです。大規模案件が多く、プロジェクトマネジメント力や技術的専門性が求められます。"
          },
          {
            "type": "ul",
            "items": [
              "自社ハード・ソフトを活用したシステム提案",
              "官公庁・金融・製造業など大規模案件が中心",
              "研究開発力と実装力を両立した総合技術企業",
              "代表例：日立ソリューションズ、富士通Japan、NECソリューションイノベータ"
            ]
          }
        ]
      },
      {
        "id": "independent",
        "title": "独立系SIer",
        "summary": "特定の親会社を持たず、業界横断的に幅広い顧客を持つ独立系SIer。柔軟な技術選定と中立性が特徴です。",
        "content": [
          {
            "type": "p",
            "text": "独立系SIerは、特定のメーカーやグループに属さない独立資本の企業で、幅広い業界・クライアントに対してシステム構築を行います。顧客に応じて最適な製品・技術を自由に選定できる中立性が強みです。"
          },
          {
            "type": "p",
            "text": "案件の幅が広く、提案力やマルチベンダー対応力が求められます。一方で、競争が激しく営業力や価格交渉力が重要になる傾向もあります。"
          },
          {
            "type": "ul",
            "items": [
              "メーカー・親会社に依存しない独立資本系SIer",
              "多業種・多分野のシステム開発を担当",
              "マルチベンダー対応による柔軟な技術提案",
              "代表例：TIS、SCSK、オージス総研、クレスコ"
            ]
          }
        ]
      },
      {
        "id": "consulting",
        "title": "コンサル系SIer",
        "summary": "戦略コンサルティングから実装までを一貫して行う、上流特化型のSIer。",
        "content": [
          {
            "type": "p",
            "text": "コンサル系SIerは、IT戦略や業務改革コンサルティングを起点に、システム設計・構築までを一貫して担う企業群です。上流工程（構想策定・要件定義）に強みを持ち、経営課題に近い位置から関与します。"
          },
          {
            "type": "p",
            "text": "ITとビジネスの両方に精通した人材が多く、近年ではDX推進・データ分析・クラウド導入支援などの高付加価値領域で需要が拡大しています。"
          },
          {
            "type": "ul",
            "items": [
              "戦略・業務コンサルティングからシステム実装まで一貫支援",
              "経営課題に直結した上流工程を担当",
              "DX・データ活用・クラウド導入などの高付加価値領域",
              "代表例：アクセンチュア、NRI、アビームコンサルティング、PwCコンサルティング"
            ]
          }
        ]
      },
      {
        "id": "foreign",
        "title": "外資系SIer",
        "summary": "グローバル基準の技術力とプロジェクト管理力を持ち、海外企業向けや外資クライアント案件を多く扱うSIer。",
        "content": [
          {
            "type": "p",
            "text": "外資系SIerは、海外資本を持つITサービス企業で、グローバル展開を行う日系企業や外資系クライアント向けに高品質なITソリューションを提供します。"
          },
          {
            "type": "p",
            "text": "最新の開発手法・グローバル標準のプロジェクト管理・多国籍チームでの業務などが特徴で、英語力と国際的な視点が求められます。成果主義的な評価制度を採用する傾向も強いです。"
          },
          {
            "type": "ul",
            "items": [
              "グローバル企業向けのITソリューション提供",
              "海外チームとの協働・英語によるプロジェクト進行",
              "最新技術・国際基準の品質管理を導入",
              "代表例：IBM、Capgemini、Cognizant、TCS（タタ・コンサルタンシー・サービシズ）"
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
            日本Web系IT業界の現状
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
