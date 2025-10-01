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
    key: "existing-roles",
    title: "既存職種",
    lessons: [
      {
        id: "frontend-engineer",
        title: "フロントエンドエンジニア",
        summary: "ユーザーが直接触れる部分を設計・実装し、快適な操作体験を提供する役割です。",
        content: [
          {
            type: "p",
            text: "フロントエンドエンジニアは、WebサイトやWebアプリケーションの「見える部分」を担当する職種です。HTML・CSS・JavaScriptを中心に、最近ではTypeScriptやReact、Next.jsといったモダンフレームワークを用いて、ユーザーが直接操作する画面やインターフェースを設計・実装します。",
          },
          {
            type: "p",
            text: "単に画面を作るだけでなく、UI/UXデザイナーと連携して操作性やパフォーマンスを最適化するのも重要な役割です。また、アクセシビリティ対応やレスポンシブデザイン、SEO対策など幅広い知識も求められます。",
          },
          {
            type: "ul",
            items: [
              "HTML/CSS/JavaScript/TypeScriptによるUIの構築",
              "ReactやVue.jsなどのフレームワークを用いたSPA開発",
              "デザイナーとの協働によるUX最適化",
              "パフォーマンスチューニングやアクセシビリティ対応",
            ],
          },
        ],
  
      },
      {
        id: "backend-engineer",
        title: "バックエンドエンジニア",
        summary: "アプリケーションの裏側でデータ処理やビジネスロジックを支える職種です。",
        content: [
          {
            type: "p",
            text: "バックエンドエンジニアは、ユーザーには見えないサーバーサイドで動作する処理を担当します。データベースとの連携、ビジネスロジックの実装、APIの設計などが主な業務です。言語としてはPython、Ruby、Go、Java、Node.jsなどが使われ、フレームワークやクラウドインフラの知識も必要です。",
          },
          {
            type: "p",
            text: "堅牢でスケーラブルなシステムを構築するためには、セキュリティやパフォーマンス、トランザクション管理など、フロントエンドとは異なる観点が求められます。",
          },
          {
            type: "ul",
            items: [
              "データベース設計・操作とAPI開発",
              "認証・認可などのセキュリティ機能の実装",
              "スケーラビリティとパフォーマンスを意識した設計",
              "クラウド環境やインフラとの連携",
            ],
          },
        ],
    
      },
      {
        id: "fullstack-engineer",
        title: "フルスタックエンジニア",
        summary: "フロントとバック両方をカバーし、サービス全体を横断的に開発できるエンジニアです。",
        content: [
          {
            type: "p",
            text: "フルスタックエンジニアは、UIの構築からサーバーサイドのロジック、データベース、さらにはインフラ設定まで幅広い領域を一貫して扱えるエンジニアです。小規模スタートアップやプロトタイプ開発で特に重宝されます。",
          },
          {
            type: "p",
            text: "専門分野が浅くなりがちな一方で、サービス全体の構造を理解し、チーム間の橋渡し役として重要な役割を果たすことができます。最近ではNext.jsやNestJSのようなフルスタック指向のフレームワークが登場し、活躍の場が広がっています。",
          },
          {
            type: "ul",
            items: [
              "フロントエンドとバックエンドの両方を開発",
              "データベース・インフラ構築も含めた横断的な設計",
              "サービス全体のアーキテクチャ設計への関与",
              "小規模開発・新規サービス立ち上げでの活躍",
            ],
          },
        ],
    
      },
      {
        id: "ai-engineer",
        title: "AIエンジニア",
        summary: "機械学習モデルや生成AIを活用し、知能的な機能をサービスに組み込む職種です。",
        content: [
          {
            type: "p",
            text: "AIエンジニアは、機械学習・深層学習のアルゴリズムを活用し、画像認識・自然言語処理・生成モデルなどの機能を開発します。PythonやPyTorch、TensorFlowといったライブラリが主に使われ、データ前処理からモデル学習、API化まで幅広い工程に関わります。",
          },
          {
            type: "p",
            text: "最近では生成AIや大規模言語モデル（LLM）を活用したアプリケーション開発の需要が急増しており、AIエンジニアはWebサービスの中核機能を担うことも増えています。",
          },
          {
            type: "ul",
            items: [
              "データ収集・前処理・特徴量設計",
              "機械学習・深層学習モデルの構築と評価",
              "モデルのAPI化・サービスへの統合",
              "生成AI・LLMの活用による新機能開発",
            ],
          },
        ],
    
      },
      {
        id: "algorithm-engineer",
        title: "アルゴリズムエンジニア",
        summary: "数理的な最適化や検索・推薦など、サービスの根幹を支えるアルゴリズムを設計する職種です。",
        content: [
          {
            type: "p",
            text: "アルゴリズムエンジニアは、膨大なデータを効率的に処理し、サービスの中核となるロジックを設計する専門家です。探索・推薦・最適化・グラフ計算・確率モデルなど、数学・統計・計算機科学の知識が必要になります。",
          },
          {
            type: "p",
            text: "AIエンジニアがモデル構築を主とするのに対し、アルゴリズムエンジニアは“ロジックそのもの”の効率や精度を追求します。検索エンジン、マッチングプラットフォーム、物流最適化などで特に重要です。",
          },
          {
            type: "ul",
            items: [
              "探索・推薦・最適化などのアルゴリズム設計",
              "計算量・データ構造を意識した高効率な実装",
              "機械学習モデルとの組み合わせによる性能向上",
              "理論検証と実装の両立",
            ],
          },
        ],
    
      },
      {
        id: "infra-engineer",
        title: "インフラエンジニア",
        summary: "アプリケーションが安定して動くための基盤を設計・運用する職種です。",
        content: [
          {
            type: "p",
            text: "インフラエンジニアは、アプリケーションを支えるサーバーやネットワーク、クラウド環境の設計・構築・運用を担当します。AWSやGCPなどのクラウドサービス、DockerやKubernetesなどのコンテナ技術、CI/CDパイプラインなどの知識が求められます。",
          },
          {
            type: "p",
            text: "障害対応やセキュリティ対策、スケーラビリティ確保など、表には見えない部分でサービスの安定性と信頼性を支える重要な役割です。DevOpsの考え方を取り入れて開発と運用を橋渡しするケースも増えています。",
          },
          {
            type: "ul",
            items: [
              "クラウド・サーバー・ネットワークの設計と構築",
              "セキュリティ対策と監視・運用管理",
              "インフラ自動化やIaC（Infrastructure as Code）の活用",
              "開発チームとの連携によるDevOps実践",
            ],
          },
        ],
  
      },
      {
        id: "data-scientist",
        title: "データサイエンティスト",
        summary: "データから価値を引き出し、意思決定や事業戦略に貢献する専門家です。",
        content: [
          {
            type: "p",
            text: "データサイエンティストは、膨大なデータを収集・分析し、そこからビジネス上の洞察や意思決定の根拠を導き出す職種です。統計学、機械学習、データ可視化などのスキルに加え、ビジネス課題を構造化する力が求められます。",
          },
          {
            type: "p",
            text: "AIエンジニアやアルゴリズムエンジニアが「仕組みやモデルの実装」に重点を置くのに対し、データサイエンティストは「ビジネス課題をデータで解決する」ことに主眼を置きます。分析結果を経営層に提案し、サービス改善や新規事業立案に直結させる役割も担います。",
          },
          {
            type: "ul",
            items: [
              "ビジネス課題の整理とデータ分析方針の設計",
              "統計解析・機械学習モデルを用いたデータ分析",
              "可視化・レポーティングによる意思決定支援",
              "事業戦略やサービス改善へのデータ活用提案",
            ],
          },
        ],
      },
      {
        id: "security-engineer",
        title: "セキュリティエンジニア",
        summary: "システムやデータを脅威から守り、安全なサービス運用を支える専門家です。",
        content: [
          {
            type: "p",
            text: "セキュリティエンジニアは、サイバー攻撃や不正アクセス、情報漏洩などの脅威からシステムやサービスを守る役割を担います。脆弱性診断や侵入テストを通じてリスクを洗い出し、セキュリティポリシーや対策の設計・実装を行います。",
          },
          {
            type: "p",
            text: "業務はシステム開発のあらゆる段階に関わり、設計段階でのセキュリティレビュー、運用段階での監視・検知・対応まで多岐にわたります。クラウド環境やゼロトラストなど新しい技術動向への対応力も重要です。",
          },
          {
            type: "ul",
            items: [
              "脆弱性診断・ペネトレーションテストによるリスク評価",
              "アクセス制御・暗号化などのセキュリティ設計と実装",
              "ログ監視やインシデント対応による運用フェーズでの防御",
              "最新の攻撃手法・脅威インテリジェンスの調査と対策",
            ],
          },
        ],
      },
      
      
    ],
  },
  {
    key: "system-diagram",
    title: "Webシステム構成と職種の関係図",
    lessons: [
      {
        id: "system-diagram",
        title: "Webシステム構成と職種の関係図",
        summary: "Webサービスの構成全体と、各職種がどの領域を担当しているかを図で整理します。",
        content: [
          {
            type: "p",
            text: "ここでは、フロントエンド・バックエンド・データベース・インフラなどのシステム構成要素と、それぞれの職種がどの範囲を担当しているかを一目で理解できる図を示します。職種ごとの円や楕円は、実際の開発現場でどこに関与しているかを表現しています。"
          },
          {
            type: "img",
            src: "/images/web_system_roles.png",
            alt: "Webシステム構成と職種の担当範囲図",
            caption: "Webアプリケーション全体の構成と各職種の担当範囲（半透明の円は担当領域を示す）",
            width: 1200,
            height: 800
          },
          {
            type: "p",
            text: "この図からわかるように、フロントエンドエンジニアは主にUI層を担当し、バックエンドエンジニアはAPIやビジネスロジックを設計・実装します。AIエンジニア、データサイエンティスト、アルゴリズムエンジニアはアプリ層だけでなく、データ基盤やMLOpsといったインフラ層にも深く関与します。インフラエンジニアは全体の基盤を支え、セキュリティエンジニアは全レイヤーにわたってシステムの安全性を確保します。フルスタックエンジニアは全ての領域を横断的に理解し、連携を促進する役割を担います。"
          }
        ],
      },
    ],
  },
  {
    key: "about-guidance",
    title: "本ガイダンスについて",
    lessons: [
      {
        id: "about-this-guidance",
        title: "対象と範囲",
        summary: "本ガイダンスはWebアプリケーション開発に特化した学習ルートを示し、以降の内容はフロントエンド／バックエンドエンジニアを主な対象とします。",
        content: [
          {
            type: "p",
            text: "このガイダンスは、日本のWeb系IT業界を背景に、Webアプリケーション開発に進むための学習ルートを整理したものです。対象は主にフロントエンドエンジニアとバックエンドエンジニアを志向する学習者であり、以降の各章・各レッスンもこの前提で構成されています。"
          },
          {
            type: "ul",
            items: [
              "対象領域: ブラウザ／UI・API／ビジネスロジック・データベース・クラウド基盤に関わるWebアプリ開発",
              "想定職種: Webフロントエンドエンジニア、Webバックエンドエンジニア、ソフトエンジニア（Web）",
              "学習のねらい: Web開発の基礎技術、Webエンジニアとしての自走力（勉強内容と勉強手法の掌握）",
              "注意点: モバイルネイティブ開発、組込み、データ分析専業、インフラ専業などは本ガイダンスの中心対象ではありません（関連章があっても、Web開発者の観点からの解説が主になります）"
            ]
          },
          {
            type: "p",
            text: "用語や技術は継続的に更新されますが、本ガイダンスでは“Web アプリ開発者として現場で迷わない”ことを最優先し、学習順序と到達目標を明確に提示します。以降の章でも Web 開発者向けの観点で内容を統一しますので、他領域の学習と混同しないように進めてください。"
          }
        ],
      },
    ],
  },
  {
    key: "selection-flow",
    title: "Webエンジニア選考フロー",
    lessons: [
      {
        id: "web-engineer-selection-flow",
        title: "Webエンジニア選考フロー",
        summary: "エントリーシート→ウェブテスト（コーディングテスト）→個人面接（複数回）→内々定の順で進む典型的な選考プロセスを図で示します。",
        content: [
          {
            type: "img",
            src: "/images/web-engineer-selection-flow.png",
            alt: "Webエンジニア選考フロー（横長・モノクロ・同一行）",
            caption: "エントリーシート → ウェブテスト（コーディングテスト） → 個人面接（複数回） → 内々定",
            width: 1920,
            height: 640
          }
        ],
      },
      {
        id: "entry-sheet",
        title: "エントリーシート",
        summary: "応募時に提出するエントリーシート（ES）に記載すべき主な項目と、Webエンジニア職向けの書き方ポイントを整理します。",
        content: [
          {
            type: "p",
            text: "エントリーシートは、選考初期で応募者の基礎情報と適性を素早く把握するための書類です。Webエンジニア職では、一般的な学歴・基本情報に加え、開発経験や技術スタック、ポートフォリオの提示が重視されます。"
          },
          {
            type: "ul",
            items: [
              "基本情報：氏名（フリガナ）／生年月日／国籍・在留資格（必要な場合）／連絡先（メール・電話）／住所",
              "学歴：学部・学科（本科院校）／研究科・専攻（修士院校）／在籍期間／卒業（予定）年月",
              "専攻・出身分野：研究テーマ・扱った技術領域・関連する開発経験",
              "学チカ（学生時代に力を入れたこと）：課題／取り組み／成果／学び（後述のSTAR法で整理）",
              "資格・認定：基本情報技術者・応用情報・LPIC／AWS・GCP・Azure 認定 等（あれば）",
              "語学力：TOEIC／TOEFL／IELTS／英検／JLPT 等（スコア・級・取得年月）",
              "志望動機・自己PR：なぜWeb開発か／自分の強み・価値観／将来像",
              "希望職種と開発経験（重要）：フロントエンド／バックエンド／フルスタックなどの志向、使用言語・FW・ツール（例：TypeScript／React／Next.js／Node.js／Python 等）、担当範囲、役割、チーム規模、開発プロセス、テスト・レビュー経験",
              "作品・実績：GitHub／ポートフォリオURL／技術記事・登壇資料（公開可能なもの）",
              "その他：インターン・アルバイトの実務経験／勤務開始可能時期／就労可否（ビザ）／勤務地・働き方の希望",
              "企業独自の設問例：開発年数／得意領域（例：API設計・DB・フロント性能最適化）／使用可能クラウド／チーム開発経験／障害対応経験／セキュリティの配慮 等"
            ]
          },
          {
            type: "img",
            src: "/images/web-engineer-entry-sheet.png",
            alt: "Webエンジニア選考フロー（エントリーシート→ウェブテスト→個人面接（複数回）→内々定）",
            caption: "Webエンジニア採用のエントリーシートの一例",
            width: 1600,
            height: 600
          },
          
        ],
      },
      {
        id: "web-coding-test",
        title: "ウェブテスト（コーディングテスト）",
        summary: "多くのWeb系IT企業ではコーディング中心のウェブテストを実施します。典型的にはアルゴリズム問題／機能実装型の課題が多く、ごく一部は数学寄りの問題を出題します。",
        content: [
          {
            type: "p",
            text: "Web系の選考では、一次～二次の早い段階でオンラインのコーディングテストが行われることが一般的です。出題形式は大きく3つ：①アルゴリズム・データ構造、②与えられたシナリオに基づく機能追加・実装、③少数ながら数学系（確率・組合せ・数列など）です。"
          },
          {
            type: "ul",
            items: [
              "想定言語：JavaScript/TypeScript、Python が主流（企業指定がある場合あり）",
              "制限：時間制限・メモリ制限・入出力仕様に厳密に従う（サンプル通過だけでなく隅ケースに注意）",
              "評価観点：正確性・計算量（時間/空間）・可読性・テスト容易性・境界条件の扱い"
            ]
          },
          {
            type: "img",
            src: "/images/web-engineer-coding-test.png",
            alt: "ウェブテスト（コーディングテスト）の受験画面イメージ",
            caption: "オンラインで実施されるコーディングテストの例（問題文・エディタ・入出力パネルなど）",
            width: 1600,
            height: 900
          },
        ],
    
      },
      {
        id: "multiple-interviews",
        title: "個人面接複数回",
        summary: "個人面接ではESに基づく質問と行動評価が行われ、志望動機・自己PRに加えて、開発/インターン等のプロジェクト経験が鍵。技術面を含む多方面から現時点のIT知識・経験が確認される。",
        content: [
          {
            type: "p",
            text: "個人面接では、面接官はエントリーシート（entry）の内容を起点に質問し、あなたの行動を評価します。最も一般的な志望動機や自己PRに加えて、この期間はプロジェクト経験（開発経験またはインターン経験）が重要な役割を果たします。面接官は技術などの観点からも質問し、これまでのIT知識およびIT経験を全方位で確認します。"
          },
          {
            type: "ul",
            items: [
              "なぜこの職種を志望しますか？",
              "なぜこの会社を志望しますか？",
              "どのような開発経験がありますか？",
              "なぜそのプロジェクトに取り組みましたか？",
              "なぜその技術スタックを採用しましたか？",
              "（プログラミング基礎知識に関する質問）",
              "（開発フレームワークの基礎知識に関する質問）",
              "ご自身のキャリアパスについてどう考えていますか？"
            ]
          }
        ],
        estMin: 5
      },
      {
        id: "naitei",
        title: "内々定",
        summary: "ES・ウェブテスト・複数回の個人面接を経て、最終的に内々定に到達します。",
        content: [
        ],
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
