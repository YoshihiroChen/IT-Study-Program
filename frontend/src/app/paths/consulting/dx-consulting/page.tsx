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
    "key": "dx-consulting-overview",
    "title": "DXコンサルの業務内容と実際のプロジェクト事例",
    "lessons": [
      {
        "id": "what-is-dx-consulting",
        "title": "DXコンサルとは何か",
        "summary": "DXコンサルの定義と、“デジタル × 業務 × 組織”を一体で変革する専門職としての本質を解説します。",
        "content": [
          {
            "type": "p",
            "text": "DXコンサル（Digital Transformation Consulting）は、企業の経営課題・業務プロセス・デジタル環境を総合的に分析し、デジタル技術を使って“企業の価値最大化”を実現するコンサルティング職種です。"
          },
          {
            "type": "p",
            "text": "単なるシステム刷新ではなく、業務文化・組織構造・データ戦略まで含めて企業を変革する点が、ITコンサルやAIコンサルと大きく異なります。"
          },
          {
            "type": "ul",
            "items": [
              "✓ デジタル戦略（中期ロードマップ）の策定",
              "✓ 既存業務の可視化・再構築（BPR）",
              "✓ データ活用基盤（DWH・BI）の設計",
              "✓ 新規事業・デジタルサービス企画",
              "✓ 既存システムの刷新・クラウド移行",
              "✓ 組織変革（文化・人材育成・権限設計）"
            ]
          },
          {
            "type": "p",
            "text": "DX の本質は “デジタル化” ではなく “経営と業務をデジタル前提で再設計すること” です。"
          }
        ]
      },
  
      {
        "id": "dx-consulting-core-tasks",
        "title": "DXコンサルの主要業務（分析 → 設計 → 導入 → 定着）",
        "summary": "DXプロジェクトで DXコンサルが担う業務内容をフェーズごとに整理します。",
        "content": [
          {
            "type": "p",
            "text": "DXコンサルのプロジェクトは通常、次の 4 つのフェーズで進みます。"
          },
          {
            "type": "ul",
            "items": [
              "① As-Is 分析（現状把握）\n・業務フローの可視化\n・部署間の連携構造の整理\n・デジタル成熟度（Digital Maturity）の診断\n・データ整備状況の評価",
              "② To-Be 設計（あるべき姿の設計）\n・理想的な業務プロセスモデル（BPR）設計\n・DX ロードマップ（短・中期計画）の策定\n・必要なシステム群（基幹、CRM、BI等）の定義\n・データ活用戦略（DWH、AI活用）の設計",
              "③ 実行フェーズ（導入支援）\n・PoC（概念検証）\n・クラウド移行（AWS/GCP/Azure）\n・業務変更に伴うルール整備\n・部門横断プロジェクト管理（PMO）",
              "④ 定着フェーズ（Change Management）\n・社員研修（DXリテラシー向上）\n・KPI策定とモニタリング\n・ガバナンス整備（権限・データ管理）\n・改善サイクル（PDCA）の運用"
            ]
          },
          {
            "type": "p",
            "text": "DXコンサルは、単に“IT プロジェクトを回す”のではなく、「企業がデジタルで戦える状態」を作る仕事です。"
          }
        ]
      },
  
      {
        "id": "dx-real-case-bpr",
        "title": "DXプロジェクト事例①：業務BPR（バックオフィス改革）",
        "summary": "大企業のバックオフィス業務を対象に行われた DX × BPR プロジェクトの実例を解説します。",
        "content": [
          {
            "type": "p",
            "text": "本事例は、ある大企業の「経理・購買・人事を含むバックオフィス改革」をテーマとした DX プロジェクトです。"
          },
          {
            "type": "p",
            "text": "現場では、紙ベースの承認手続きや Excel 管理が複雑化し、年間数千時間もの業務ロスが発生していました。"
          },
          {
            "type": "ul",
            "items": [
              "・紙の申請書で承認が滞留（1つの承認に平均 3〜5 日）",
              "・Excel ファイルが部門ごとに乱立しバージョン不整合が多発",
              "・人事情報、購買情報、会計情報が全て別システムに分断",
              "・作業時間の 40〜60% が“転記・確認・照合作業”",
              "・在宅勤務の定着に伴い、紙業務がより大きな障壁に"
            ]
          },
          {
            "type": "p",
            "text": "DXコンサルは 2 か月の As-Is 分析を経て、業務を 7 つのプロセスに分解し、再設計方針を作成しました。"
          },
          {
            "type": "ul",
            "items": [
              "① 申請・承認のデジタル化（ワークフロー統合）",
              "② 社内データの統合（DWH 化）",
              "③ Excel 依存業務の BI 化（ダッシュボード設計）",
              "④ 会計・購買のマスタ統一",
              "⑤ 人事情報との連携強化",
              "⑥ ペーパーレス化のルール設計",
              "⑦ 作業の自動化（RPA + AI 併用）"
            ]
          },
          {
            "type": "p",
            "text": "PoC の結果、次のようなインパクトが確認され、本格導入が決定しました。"
          },
          {
            "type": "ul",
            "items": [
              "・承認リードタイム 3〜5日 → 数時間に短縮",
              "・作業工数の 35〜50% 削減",
              "・紙業務ゼロ（完全ペーパーレス化）を達成",
              "・年度決算の締め作業が 30% 早期化",
              "・データの一元化により管理職の意思決定が高速化"
            ]
          },
          {
            "type": "p",
            "text": "バックオフィスは企業全体の“血流”であり、DX による効果が非常に大きい領域です。"
          }
        ]
      },
  
      {
        "id": "dx-real-case-sales",
        "title": "DXプロジェクト事例②：営業DX（SFA/CRM × データ活用）",
        "summary": "営業部門の“勘と経験”をデータ駆動型の業務へ変革したプロジェクト事例を解説します。",
        "content": [
          {
            "type": "p",
            "text": "本事例は、営業現場における「案件管理の属人化」「情報共有の不足」「予測精度の低さ」を DX の力で解決したプロジェクトです。"
          },
          {
            "type": "ul",
            "items": [
              "・営業日報が Excel / メールで散在し共有できない",
              "・案件ステータスが個人管理でブラックボックス化",
              "・予算達成率の予測が管理職の“勘”に依存",
              "・過去顧客データの分析がほぼ不可能",
              "・新人営業は立ち上がりに平均 6 ヶ月以上必要"
            ]
          },
          {
            "type": "p",
            "text": "DXコンサルは次の 4 ステップで営業 DX を設計しました。"
          },
          {
            "type": "ul",
            "items": [
              "① SFA（営業管理システム）の要件設計",
              "② 顧客・案件情報を DWH に統合",
              "③ BI（営業ダッシュボード）で予測モデルを構築",
              "④ 営業プロセスの標準化（マネジメント改革）"
            ]
          },
          {
            "type": "p",
            "text": "導入後、営業部門は次のような改善を実現しました。"
          },
          {
            "type": "ul",
            "items": [
              "・案件可視化により“属人化”がほぼゼロに",
              "・受注予測の精度が約 20 → 80％ に上昇",
              "・新人営業の立ち上がり期間が 6 ヶ月 → 2 ヶ月に短縮",
              "・週次会議での報告作業が 50％ 削減",
              "・トップ営業のノウハウが全社に共有される仕組みを確立"
            ]
          },
          {
            "type": "p",
            "text": "営業DXの特徴は、単なるツール導入ではなく“営業文化そのものの変革”が伴う点にあります。"
          }
        ]
      },
  
      {
        "id": "ai-vs-it-vs-dx",
        "title": "DXコンサル・AIコンサル・ITコンサルの違い",
        "summary": "役割・目的・適性の観点から 3 つのコンサルを比較し、志望理由に使える整理を示します。",
        "content": [
          {
            "type": "p",
            "text": "DXコンサルは AIコンサル・ITコンサルと近い領域ですが、扱う課題のスケールと本質が異なります。"
          },
          {
            "type": "p",
            "text": "以下の比較で、各コンサルの特徴を明確に理解しましょう。"
          },
          {
            "type": "ul",
            "items": [
              "【DXコンサル】\n・経営課題 × デジタル戦略\n・組織・業務・文化の総合変革\n・売上成長や事業モデル変革にも踏み込む\n・“企業価値の最大化”が目的\n",
              "【AIコンサル】\n・AI/LLM を使った自動化・効率化\n・RAG / Multi-Agent / AI 活用シナリオの設計\n・ROI（効果測定）が中心\n・“業務生産性の最大化”が目的\n",
              "【ITコンサル】\n・ERP/CRM/基幹システムの導入設計\n・DX の中でも“システム刷新”に特化\n・ウォーターフォール型の大規模プロジェクト管理\n・“IT を使った業務改善”が目的"
            ]
          },
          {
            "type": "p",
            "text": "まとめると以下の通りです："
          },
          {
            "type": "ul",
            "items": [
              "DXコンサル：経営 × デジタルの変革リーダー",
              "AIコンサル：AI × 自動化の専門家",
              "ITコンサル：ITシステム × 業務改善の専門家"
            ]
          }
        ]
      }
    ]
  },
  {
    "key": "dx-case-supplychain",
    "title": "DXプロジェクト事例：サプライチェーンDX（業務フローに沿った詳細解説）",
    "lessons": [
      {
        "id": "supplychain-overview",
        "title": "サプライチェーンDXとは何か",
        "summary": "在庫・物流・需要予測を中心としたサプライチェーン領域におけるDXの全体像を解説します。",
        "content": [
          {
            "type": "p",
            "text": "サプライチェーンDX は、生産・在庫・物流・販売などの企業活動をデジタル前提で再構築し、需要変動に強い柔軟な供給体制を作ることを目的とした大型 DX 領域です。"
          },
          {
            "type": "p",
            "text": "特に大手メーカー/小売/物流企業では、在庫の過剰・欠品、需要予測の精度低下、物流コストの高騰などの経営課題が顕著化しており、データ活用による変革が急務となっています。"
          },
          {
            "type": "ul",
            "items": [
              "✓ 在庫の適正化（欠品防止と過剰在庫削減）",
              "✓ 需要予測の精度向上（AI・統計モデル）",
              "✓ 生産計画・出荷計画の最適化",
              "✓ 物流効率化（配送ルート最適化・倉庫作業自動化）",
              "✓ 全社データ統合（POS・生産・購買の統合）"
            ]
          }
        ]
      },
  
      {
        "id": "workflow-case-detail",
        "title": "DX コンサルの業務フローに沿った詳細プロジェクト（新規ケース）",
        "summary": "分析 → 設計 → PoC → 導入 → 定着のワークフローに基づき、サプライチェーンDXの実例を詳細解説します。",
        "content": [
          {
            "type": "p",
            "text": "本ケースは、全国に 300 店舗以上を展開する小売企業を対象とした「在庫最適化 × サプライチェーン可視化」の DX プロジェクトです。"
          },
  
          {
            "type": "p",
            "text": "導入前、サプライチェーンには次のような課題が存在しました。"
          },
          {
            "type": "ul",
            "items": [
              "・在庫が慢性的に過剰（年間廃棄コスト数億円）",
              "・欠品率が高く、販売機会損失が多発",
              "・需要予測が店舗担当者の経験に依存",
              "・POS・在庫・発注システムが分断されデータ連携不能",
              "・物流センターの作業が非効率（紙ベースの作業指示）"
            ]
          },
  
          {
            "type": "p",
            "text": "――――――――――――――――――――――――\n① As-Is 分析（現状把握）\n――――――――――――――――――――――――"
          },
          {
            "type": "ul",
            "items": [
              "◆ 全国300店舗の POS・在庫データを収集し、在庫回転率を算出",
              "◆ 欠品率・廃棄率を商品カテゴリ別に分析",
              "◆ 店舗〜物流センター〜本部の情報伝達速度を測定",
              "◆ 発注プロセスをヒアリングし、属人化ポイントを特定",
              "◆ システム構成図を作成し、データ断絶の原因を可視化"
            ]
          },
          {
            "type": "p",
            "text": "分析結果、在庫の 35% が“売れ残る可能性が高い余剰在庫”であり、さらに店舗ごとの需要予測の精度に大きなばらつきがあることが判明しました。"
          },
  
          {
            "type": "p",
            "text": "――――――――――――――――――――――――\n② To-Be 設計（理想プロセスの構築）\n――――――――――――――――――――――――"
          },
          {
            "type": "ul",
            "items": [
              "◆ 需要予測モデル（AI + 統計）の導入構想を設計",
              "◆ POS／在庫／出荷データ統合のための DWH アーキテクチャ設計",
              "◆ 店舗発注業務の標準化ルールを策定",
              "◆ 在庫最適化アルゴリズム（安全在庫量計算）を設計",
              "◆ 物流センター作業フローのデジタル化（WMS導入構想）"
            ]
          },
          {
            "type": "p",
            "text": "特に重要だったのが、「店舗の属人的な発注判断」を AI × データに置き換える仕組み作りでした。"
          },
  
          {
            "type": "p",
            "text": "――――――――――――――――――――――――\n③ PoC（概念実証）\n――――――――――――――――――――――――"
          },
          {
            "type": "ul",
            "items": [
              "◆ 都市部 20 店舗で AI 需要予測モデルを検証",
              "◆ 在庫シミュレーションを実施（過去2年のデータ利用）",
              "◆ 在庫最適化ロジックの検証（安全在庫量の自動算出）",
              "◆ 発注作業を自動化した場合の工数削減効果を測定"
            ]
          },
          {
            "type": "p",
            "text": "PoC の結果、明確な効果が確認されました："
          },
          {
            "type": "ul",
            "items": [
              "・需要予測の精度：平均 62% → 87% に改善",
              "・欠品率：10% → 4% に改善",
              "・廃棄量：15% 減少（年間効果見込み：1.2億円）",
              "・店舗スタッフの発注にかかる時間：1店舗あたり 40% 削減"
            ]
          },
  
          {
            "type": "p",
            "text": "――――――――――――――――――――――――\n④ 導入（Implementation）\n――――――――――――――――――――――――"
          },
          {
            "type": "ul",
            "items": [
              "◆ 全300店舗へ AI需要予測システムを展開",
              "◆ POS・在庫・WMS を連結する API を開発",
              "◆ 本部の在庫管理ダッシュボードを構築（BI）",
              "◆ 店舗スタッフ向けの操作マニュアルを整備",
              "◆ 発注ルール（例外処理含む）を全国統一"
            ]
          },
  
          {
            "type": "p",
            "text": "この導入で、店舗発注業務の属人性が大幅に排除され、店舗間のオペレーション品質が均質化されました。"
          },
  
          {
            "type": "p",
            "text": "――――――――――――――――――――――――\n⑤ 定着化（Change Management）\n――――――――――――――――――――――――"
          },
          {
            "type": "ul",
            "items": [
              "◆ 店舗スタッフ向けの DX 研修（約600名参加）",
              "◆ 新KPI（在庫回転率・欠品率・廃棄率）のモニタリング運用開始",
              "◆ 月次で改善提案を行う PDCA サイクルを導入",
              "◆ データガバナンス（ID管理・ログ管理）を整備"
            ]
          },
  
          {
            "type": "p",
            "text": "最終的に、このプロジェクトは企業に次の成果をもたらしました。"
          },
          {
            "type": "ul",
            "items": [
              "・廃棄コスト年間 1.5億円削減",
              "・欠品率 60% 改善",
              "・在庫回転率 20% 向上",
              "・店舗スタッフの発注工数を年間 1.2万時間削減",
              "・本部が全店舗の在庫状況をリアルタイム把握可能に"
            ]
          },
  
          {
            "type": "p",
            "text": "このように DX コンサルは、業務改善の枠を超えて “店舗運営モデルそのものの作り直し” に踏み込み、企業の利益構造を変革する役割を担います。"
          }
        ]
      }
    ]
  },
  {
    "key": "dx-case-amazon",
    "title": "DX 事例：Amazon のサプライチェーン改革（業務プロセスを再構築した代表例）",
    "lessons": [
      {
        "id": "amazon-overview",
        "title": "Amazon の DX が注目される理由",
        "summary": "Amazon は単なる EC 企業ではなく、サプライチェーン全体をデジタル前提で再設計し、世界最高レベルの物流モデルを構築しました。",
        "content": [
          {
            "type": "p",
            "text": "Amazon の DX が世界中で高く評価される理由は、オンライン化やシステム導入ではなく、「物流・在庫・需要予測・配送」のすべての業務プロセスを根本から再設計した点にあります。"
          },
          {
            "type": "p",
            "text": "特に Amazon の革新性は、“注文が来てから動く”という旧来型の物流を完全に捨て、「需要予測 → 事前配置 → 最速配送」という新しい業務モデルを作り上げたことにあります。"
          }
        ]
      },
  
      {
        "id": "before-process",
        "title": "Before（旧来の小売・物流プロセス）",
        "summary": "従来の小売・物流業界のプロセスは、情報が分断され、顧客に商品が届くまで多くの時間とコストがかかっていました。",
        "content": [
          {
            "type": "ul",
            "items": [
              "① メーカーが商品を大量生産",
              "② 卸業者 → 小売店に商品を配送",
              "③ 小売店が店頭に陳列して販売",
              "④ 顧客は在庫状況を把握できない",
              "⑤ 店舗側は “売れ残りリスク” を抱える"
            ]
          },
          {
            "type": "p",
            "text": "この構造では、在庫は店舗に固定され、需要変動に対応できず、欠品と余剰在庫の両方が発生していました。"
          }
        ]
      },
  
      {
        "id": "after-process",
        "title": "After（Amazon の新しいサプライチェーンモデル）",
        "summary": "Amazon は、需要予測とデータ統合をベースに『注文前に動く物流』を実現し、業界の常識を覆しました。",
        "content": [
          {
            "type": "ul",
            "items": [
              "① 顧客データ・検索データ・地域データを AI が分析",
              "② 需要を予測して商品を“事前に”最適な倉庫へ移動",
              "③ 在庫が顧客の近くにあるため配送が高速化",
              "④ 注文が入った瞬間に“逆算式フロー”が開始",
              "⑤ OMS（注文管理）・WMS（倉庫管理）・TMS（配送管理）が統合され、リアルタイムで自動調整"
            ]
          },
          {
            "type": "p",
            "text": "これにより Amazon は、従来の『注文 → 梱包 → 配送』の直線プロセスから脱却し、データ駆動の『事前配置 → 最適ルート配送』へと進化しました。"
          }
        ]
      },
  
      {
        "id": "process-reform",
        "title": "Amazon が実際に改革した業務プロセス",
        "summary": "Amazon の DX は単なる IT 導入ではなく、物流・在庫・配送の根本的な業務フローの再構築です。",
        "content": [
          {
            "type": "p",
            "text": "Amazon が成功した最大の理由は、“デジタル化”ではなく“業務プロセスの再設計”を徹底したことです。下記が具体的な改革点です。"
          },
          {
            "type": "ul",
            "items": [
              "✓ 【需要予測 → 事前在庫配置】という発想の転換\n従来の『注文が来てから動く』物流を廃止し、需要予測で先に動くモデルへ変革。",
              "✓ サプライチェーンのデータ統合\nPOS、検索履歴、購入履歴、在庫、配送データなどを統合し、リアルタイムで意思決定。",
              "✓ OMS / WMS / TMS の完全統合\n倉庫・配送・在庫の指示がすべて自動化され、“人が考えない物流”を構築。",
              "✓ 倉庫作業の自動化（Amazon Robotics）\n棚がロボットの方に移動する仕組みにより、ピッキング時間を大幅短縮。",
              "✓ ラストワンマイルの再設計\n配送ルートを AI が自動で最適化し、地域密着型の配送網を構築。"
            ]
          },
          {
            "type": "p",
            "text": "これらは全て、旧来の物流プロセスを前提にした改善ではなく、プロセスそのものを“ゼロから作り直す”アプローチでした。"
          }
        ]
      },
  
      {
        "id": "impact",
        "title": "改革の結果（ビジネスインパクト）",
        "summary": "業務プロセスの刷新により、Amazon は圧倒的な競争優位を獲得しました。",
        "content": [
          {
            "type": "ul",
            "items": [
              "・配送速度：数日 → 最短当日へ",
              "・在庫最適化：余剰在庫の大幅削減",
              "・欠品率：一桁台まで低下",
              "・物流コスト最適化：単位配送あたりのコストを改善",
              "・顧客満足度：Prime 導入後に急上昇",
              "・EC 市場シェア：世界トップを維持"
            ]
          },
          {
            "type": "p",
            "text": "最も重要なのは、これらが“データ”や“IT システム”だけの力ではなく、業務プロセスが根本的に再構築されたことによる成果だという点です。"
          }
        ]
      },
  
      {
        "id": "why-real-dx",
        "title": "なぜ Amazon の改善は『真のDX』なのか？",
        "summary": "この事例が単なるデジタル化ではなく、業務変革型のDXである理由を整理します。",
        "content": [
          {
            "type": "ul",
            "items": [
              "✓ デジタル化（Digitalization）：紙を電子化することではない",
              "✓ IT化（Digitization）：既存業務を IT で置き換えるだけではない",
              "✓ DX（Transformation）：業務プロセスの作り直し＋デジタル前提の経営判断"
            ]
          },
          {
            "type": "p",
            "text": "Amazon の改革はまさにこの『Transformation』に該当し、物流・在庫・需要予測・配送の仕組みを“デジタル前提でゼロから再設計”しています。"
          },
          {
            "type": "p",
            "text": "その結果、競合他社が模倣できない“圧倒的に効率的で高速なサプライチェーン”を構築し、継続的な競争優位を生み出しています。"
          }
        ]
      }
    ]
  },
  {
    "key": "dx-vs-it",
    "title": "DX と IT化 の違い：業務改革としての DX を理解する",
    "lessons": [
      {
        "id": "definitions",
        "title": "DX・IT化・デジタル化の定義の違い",
        "summary": "DX・IT化・デジタル化は似ているように見えるが、本質はまったく異なる。経産省の定義を基に、それぞれの意味を明確に整理する。",
        "content": [
          {
            "type": "p",
            "text": "DX（Digital Transformation）と IT化 はしばしば混同されますが、目的・手段・影響範囲が根本的に異なります。まずは定義の違いを確認しましょう。"
          },
          {
            "type": "ul",
            "items": [
              "【デジタル化（Digitization）】\n紙・アナログ情報をデジタルに置き換えること。\n例：紙の申請書 → PDF、手書き棚卸し → Excel",
              "【IT化（Digitalization）】\n既存業務を IT で効率化すること。\n例：Excel業務をシステム化、会計ソフト導入",
              "【DX（Digital Transformation）】\nデジタル前提で業務プロセス・組織・ルール・文化まで変革し、企業の競争力を高めること。"
            ]
          },
          {
            "type": "p",
            "text": "経産省の定義でも、DXは“単なるデジタル化や IT 活用ではなく、企業のビジネスモデルや業務を変革すること”と明記されています。"
          }
        ]
      },
  
      {
        "id": "why-dx-is-process",
        "title": "なぜ DX は『業務プロセスの再設計』なのか",
        "summary": "DX の中心はツール導入ではなく、業務の作り直しである。なぜプロセス改革が不可欠なのかを説明する。",
        "content": [
          {
            "type": "p",
            "text": "DX は “業務プロセスを変えずにツールだけ導入する” ことでは成功しません。理由は簡単で、古いフローに新しいシステムを入れても無駄やボトルネックは消えないからです。"
          },
          {
            "type": "ul",
            "items": [
              "無駄な承認ステップが残ると、システム化しても遅いまま",
              "複雑な例外ルールがそのままだと、システムが破綻する",
              "部署別にバラバラのルールを統合しないと、データ活用できない",
              "属人化した業務を標準化しないと、自動化ができない"
            ]
          },
          {
            "type": "p",
            "text": "だからこそ DX では、まず \"業務そのものをどうあるべきか\" をゼロベースで再考し、不要なステップを削除し、例外を減らし、デジタル前提の流れに作り直します。"
          },
          {
            "type": "p",
            "text": "この“業務の再構築（BPR）”こそが、DX の第一歩であり中心です。"
          }
        ]
      },
  
      {
        "id": "difference-structure",
        "title": "DX と IT化 の具体的な違い（目的・範囲・成果）",
        "summary": "DXとIT化の違いを目的・範囲・成果・文化の観点から整理する。",
        "content": [
          {
            "type": "ul",
            "items": [
              "【目的の違い】\nIT化：業務効率を上げる\nDX：企業価値・競争力を上げる（経営課題の解決）",
              "【対象範囲の違い】\nIT化：特定部門・特定業務\nDX：企業全体（業務・データ・組織・文化）",
              "【アプローチの違い】\nIT化：既存業務をそのままシステム化\nDX：業務プロセスを再設計してからデジタル化",
              "【成果の違い】\nIT化：効率が上がる\nDX：ビジネスモデルが変わる／売上が増える／意思決定が高速化する",
              "【組織への影響】\nIT化：担当者が楽になるだけ\nDX：役割、ルール、KPI、文化が変わる"
            ]
          },
          {
            "type": "p",
            "text": "DX が目指すのは、“業務を効率化した状態”ではなく、“デジタル前提で強い組織に生まれ変わること”です。"
          }
        ]
      },
  
      {
        "id": "misunderstandings",
        "title": "よくある誤解：これは DX ではない",
        "summary": "企業でよく起きる『DX の誤用』を示し、何が間違っているのかを解説する。",
        "content": [
          {
            "type": "ul",
            "items": [
              "ChatGPT を導入した → DX ではない",
              "Excel をクラウドにした → DX ではない",
              "会議をオンラインにした → DX ではない",
              "アプリを作った → DX ではない",
              "RPA を導入した → DX ではない（RPA はあくまで部分自動化）"
            ]
          },
          {
            "type": "p",
            "text": "これらはすべて “IT化” または “デジタル化” に該当します。根本の業務プロセスが変わっていなければ DX とは呼べません。"
          },
          {
            "type": "p",
            "text": "DX の本質は、デジタルを前提に業務構造そのものを作り直すことです。"
          }
        ]
      },
  
      {
        "id": "summary-for-interview",
        "title": "まとめ（面接で使える説明）",
        "summary": "DX と IT化 の違いを簡潔に説明できるようにまとめる。面接・ES にそのまま使える表現を提供する。",
        "content": [
          {
            "type": "p",
            "text": "DX と IT化 の違いを一言で言うと："
          },
          {
            "type": "p",
            "text": "DX は “デジタル前提で業務プロセスを再構築すること”。IT化は “既存業務をシステム化すること”。"
          },
          {
            "type": "p",
            "text": "だから DX プロジェクトでは、まず業務の可視化・標準化・ルール整理（BPR）を行い、そのうえで AI・RPA・クラウドなどの技術を適用し、企業全体の競争力を高めるアプローチが求められます。"
          },
          {
            "type": "p",
            "text": "この点を理解していると、IT コンサルや DX コンサルの面接で非常に説得力のある志望動機が書けます。"
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
            DXコンサルの学習
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