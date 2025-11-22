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
    "key": "what-is-it-consulting",
    "title": "ITコンサルとは何か",
    "lessons": [
      {
        "id": "what-it-consultants-do",
        "title": "ITコンサルとは何をしているのか",
        "summary": "企業の経営課題をITの力で解決する専門家であり、業務分析から改革提案、システム導入支援まで一貫して関わる職種です。",
        "content": [
          {
            "type": "p",
            "text": "ITコンサルタント（IT Consultant）は、企業が抱える経営課題や業務課題を、ITの導入・活用を通じて解決する専門家です。ITの知識だけでなく、ビジネス構造・業務フロー・組織課題などを理解した上で、「どのようにITで企業を変革するか」を提案する役割を担います。"
          },
          {
            "type": "p",
            "text": "ITコンサルの重要な特徴は「技術者」ではなく「経営・業務の変革パートナー」である点です。そのため、プログラミングよりも、業務要件整理、課題分析、プロジェクトの推進などが主な仕事内容となります。"
          },
          {
            "type": "p",
            "text": "多くのプロジェクトは企業の大規模な業務改革（BPR）、基幹システム刷新、デジタル戦略立案、データ活用基盤の構築などと結びついており、企業の経営層から現場担当者まで幅広いステークホルダーと連携しながら進められます。"
          },
          {
            "type": "ul",
            "items": [
              "企業の業務・組織・IT環境の課題を分析する（現状分析）",
              "経営戦略に基づいたIT戦略を立案する（ITロードマップ）",
              "新システムの構想、要件定義を実施する",
              "クラウド・AI・データ活用などの導入方針を策定する",
              "プロジェクトマネジメント（PMO）として全体進行を支援する",
              "システム導入後の運用改善や定着化を支援する"
            ]
          },
          {
            "type": "p",
            "text": "ITコンサルは、単にITを導入するのではなく、企業の業務効率化・売上向上・コスト削減などの成果を最大化することを目的とします。そのため、論理的思考力、課題解決力、コミュニケーション力が非常に重要となります。"
          }
        ]
      },
      {
        "id": "difference-from-sier",
        "title": "SIerとの違い",
        "summary": "ITコンサルは上流の課題解決・戦略立案を中心に行い、SIerはシステムの設計・開発・運用を中心に担当します。役割・視点・成果物が大きく異なります。",
        "content": [
          {
            "type": "p",
            "text": "ITコンサルとSIerはどちらも企業のIT導入に関わる職種ですが、担当する領域や役割は大きく異なります。ITコンサルは「何を実現するべきか」「ビジネスをどう変革するか」を考える役割であり、SIerは「どのようにシステムとして実装するか」を担います。"
          },
          {
            "type": "p",
            "text": "ITコンサルは、経営課題の整理、業務フローの再設計（BPR）、IT戦略立案、システム構想策定など、上流の企画・設計フェーズに深く関わります。一方、SIerは要件定義以降の設計・開発・テスト・運用保守を中心とした工程に携わり、具体的なシステムを構築する立場です。"
          },
          {
            "type": "ul",
            "items": [
              "ITコンサル：企業の経営課題・業務課題の分析から解決策の提案を担当",
              "SIer：決定された要件に基づき、システムの設計・開発・運用を担当"
            ]
          },
          {
            "type": "p",
            "text": "また、クライアントとの関わり方も異なります。ITコンサルは経営層・部門長など意思決定者と協議し、改革方針や投資判断に影響を与える役割が大きいです。SIerはプロジェクト実行段階で実務的な調整を行い、システムが仕様通りに動くよう確実に構築することに責任を持ちます。"
          },
          {
            "type": "ul",
            "items": [
              "視点の違い：ITコンサル＝ビジネス視点、SIer＝システム視点",
              "成果物の違い：ITコンサル＝提案書・業務設計書、SIer＝システムそのもの",
              "関わる工程：ITコンサル＝構想・企画、SIer＝設計・開発・運用"
            ]
          },
          {
            "type": "p",
            "text": "このように、ITコンサルとSIerは互いに補完的な関係にあり、役割を分担しながら企業のITプロジェクトを推進しています。"
          }
        ]
      }
      
    ]
  },

  {
    "key": "it-consulting-specialized-domains",
    "title": "ITコンサルの領域細分",
    "lessons": [
      {
        "id": "it-management-strategy-consultant",
        "title": "ITマネジメント戦略コンサルタント",
        "summary": "企業全体のIT戦略・デジタル投資の方向性を定める“経営層寄り”のコンサルタント。ITガバナンス、IT投資判断、DXロードマップ策定などを担当します。",
        "content": [
          {
            "type": "p",
            "text": "ITマネジメント戦略コンサルタントは、企業の経営視点からITの活用戦略を立てる役割を担います。システム単体ではなく、全社的なIT構造、投資計画、DX戦略を俯瞰しながら最適な方向性を提示することが求められます。"
          },
          {
            "type": "ul",
            "items": [
              "全社IT戦略の策定",
              "ITガバナンス構築（規程・管理体制）",
              "DXロードマップの作成",
              "レガシー刷新計画の立案",
              "IT投資の優先順位付け・ROI分析",
              "経営層・役員向け報告資料の作成"
            ]
          },
          {
            "type": "p",
            "text": "上流の中でも最上流に位置する領域で、企業のIT予算や中期経営計画と密接に関わる点が特徴です。経営層との折衝が多く、論理性と説得力が特に重視されます。"
          }
        ]
      },
  
      {
        "id": "erp-consultant",
        "title": "ERPコンサルタント",
        "summary": "企業の基幹システム（会計・人事・在庫など）を統合的に管理するERPパッケージの導入・設計を担当します。SAP、Oracle、Workdayなどが代表的です。",
        "content": [
          {
            "type": "p",
            "text": "ERPコンサルタントは、企業の基幹業務（会計、人事、在庫、販売、購買など）を管理するERPシステムの導入・設計を担当する専門家です。特に日本ではSAPやOracleが広く使用されています。"
          },
          {
            "type": "ul",
            "items": [
              "業務要件ヒアリング（会計、人事、販売など）",
              "ERPパッケージの設定・設計",
              "Fit/Gap分析（標準機能との適合度評価）",
              "データ移行計画の立案",
              "ユーザートレーニングの実施",
              "本番リリース支援"
            ]
          },
          {
            "type": "p",
            "text": "ERP導入は企業活動の中心を担うため、業務知識とシステム理解の両方が求められます。新卒が最も多く配属される人気領域の一つです。"
          }
        ]
      },
  
      {
        "id": "crm-consultant",
        "title": "CRMコンサルタント",
        "summary": "顧客管理（Customer Relationship Management）を最適化するためのシステム導入・業務改革を担当。Salesforce・Dynamicsが主流です。",
        "content": [
          {
            "type": "p",
            "text": "CRMコンサルタントは、企業の顧客管理・営業活動・マーケティングを最適化するためのシステム導入と業務改善を担当します。代表的にはSalesforce、Microsoft Dynamics、HubSpotなどがあります。"
          },
          {
            "type": "ul",
            "items": [
              "営業プロセスの可視化・改善",
              "顧客管理データの統合・設計",
              "Salesforce等を用いた業務アプリの構築",
              "マーケティングオートメーション設計",
              "営業組織のKPI設計と運用支援"
            ]
          },
          {
            "type": "p",
            "text": "デジタルマーケティングやCRMシステムの活用が進む中、顧客接点の最適化は企業にとって重要なテーマであり、需要が急増している領域です。"
          }
        ]
      },
  
      {
        "id": "scm-consultant",
        "title": "SCMコンサルタント",
        "summary": "サプライチェーン（生産・在庫・物流・調達）の全体最適化を支援する専門領域。需要予測、在庫管理、物流改革など高度な分析力が求められます。",
        "content": [
          {
            "type": "p",
            "text": "SCM（Supply Chain Management）コンサルタントは、企業の調達・生産・在庫・物流・販売をつなぐサプライチェーンの最適化を担当します。製造業・小売業を中心に需要が非常に大きい領域です。"
          },
          {
            "type": "ul",
            "items": [
              "需要予測モデルの設計",
              "在庫・物流最適化のシミュレーション",
              "調達プロセス改善（サプライヤー管理）",
              "SCMシステム（Kinaxis、SAP IBP等）の導入",
              "工場・倉庫のオペレーション改革"
            ]
          },
          {
            "type": "p",
            "text": "SCM領域は数学的・分析的なアプローチが多く、ロジカルかつ定量的な思考が求められます。データ分析スキルがある学生にとって特に相性の良い分野です。"
          }
        ]
      },
  
      {
        "id": "pmo-consultant",
        "title": "PMOコンサルタント",
        "summary": "大型ITプロジェクトの管理・統制を専門とするコンサルタント。進捗管理、課題管理、品質管理などを体系的に支援します。",
        "content": [
          {
            "type": "p",
            "text": "PMO（Project Management Office）コンサルタントは、大規模ITプロジェクトの成功に向けてプロジェクト管理を専門に支援する役割を担います。企業側・ベンダー側の両方を巻き込み、プロジェクトが計画通り進むようコントロールします。"
          },
          {
            "type": "ul",
            "items": [
              "進捗管理の設計・運用",
              "課題・リスク管理",
              "会議体運営（議事作成、論点整理）",
              "品質管理（テスト計画・レビュー）",
              "複数ベンダーの調整・統制"
            ]
          },
          {
            "type": "p",
            "text": "PMOは IT コンサルの中でも幅広いスキルが求められる領域で、調整力・コミュニケーション力・タスク管理能力が強く重視されます。"
          }
        ]
      },
  
      {
        "id": "sap-consultant",
        "title": "SAPコンサルタント",
        "summary": "ERPの中でも最も需要の高いSAPを専門とするコンサルタント。FI/CO/MM/SD/HCMなど複数モジュールに分かれ、業務知識と技術の両方が必要な分野です。",
        "content": [
          {
            "type": "p",
            "text": "SAPコンサルタントは、世界最大のERPパッケージである SAP を用いて企業の基幹業務を支える専門職です。会計（FI/CO）、購買（MM）、販売（SD）、人事（HCM）、生産管理（PP）など、多数のモジュールによって構成されています。"
          },
          {
            "type": "ul",
            "items": [
              "SAP標準機能の調査・設定（カスタマイズ）",
              "Fit/Gap分析（標準で実現できるかの分析）",
              "業務要件に合わせた設計書の作成",
              "データ移行、アドオン開発の設計",
              "ユーザーリハーサル（UAT）の支援"
            ]
          },
          {
            "type": "p",
            "text": "SAPは日本企業で圧倒的な導入実績があり、スキルの市場価値が非常に高い領域です。最も王道の IT コンサルキャリアの1つであり、新卒から専門性を高めやすいのも特徴です。"
          }
        ]
      }
    ]
  },

  {
    "key": "advanced-tech-it-consulting",
    "title": "先端テクノロジーを活用したITコンサル",
    "lessons": [
      {
        "id": "ai-consulting",
        "title": "AIコンサルタント",
        "summary": "AI技術を用いて企業の業務効率化・高度化を実現する領域。AI企画、データ分析、AIモデルの導入支援などを行います。",
        "content": [
          {
            "type": "p",
            "text": "AIコンサルタントは、企業の課題をAI（機械学習・深層学習）の活用によって解決することを目指すコンサルタントです。AIの技術を直接実装することよりも、どの業務にどのAIを適用すべきかを企画し、導入プロジェクトを推進する役割が中心となります。"
          },
          {
            "type": "ul",
            "items": [
              "AI活用領域の特定（課題ヒアリング）",
              "PoC（概念実証）の企画・評価",
              "AIモデルの要件定義・性能評価",
              "データ活用ロードマップの策定",
              "AI導入後の業務プロセス見直し・定着化支援"
            ]
          },
          {
            "type": "p",
            "text": "ChatGPTをはじめとした生成AIの普及により、AIコンサルは急速に需要が拡大している領域で、コンサルタントとしての論理思考とデータ理解の両立が求められます。"
          }
        ]
      },
  
      {
        "id": "data-platform-consulting",
        "title": "データ基盤・データサイエンスコンサルタント",
        "summary": "企業のデータ活用を支える分析基盤の設計・構築や、データ分析モデルの導入支援を担当。",
        "content": [
          {
            "type": "p",
            "text": "データ基盤コンサルタントは、企業全体のデータ利活用を実現するための「データ基盤（Data Platform）」の構築方針を定め、データの流れ・管理方法・活用方法を設計する役割を担います。"
          },
          {
            "type": "ul",
            "items": [
              "データアーキテクチャ設計（DWH・データレイク）",
              "BIダッシュボードの設計（Tableau、Power BI）",
              "データガバナンス・データ品質管理の構築",
              "分析モデルの要件定義（予測・分類など）",
              "データ活用KPIの策定・運用支援"
            ]
          },
          {
            "type": "p",
            "text": "企業のDXを支える中核領域であり、エンジニア・データサイエンティスト・コンサルタントと連携しながらプロジェクトを推進します。"
          }
        ]
      },
  
      {
        "id": "iot-consulting",
        "title": "IoTコンサルタント",
        "summary": "センサーやデバイスから取得したデータを活用し、工場・物流・小売などの現場改革を行う領域。",
        "content": [
          {
            "type": "p",
            "text": "IoTコンサルタントは、工場・設備・物流などの現場に設置されたセンサーやデバイスからデータを収集し、それを用いて業務改善や高度化を行うことを支援する領域です。製造業・物流業を中心に需要が急増しています。"
          },
          {
            "type": "ul",
            "items": [
              "センサーデータ収集基盤の設計",
              "設備稼働分析・品質分析の高度化",
              "IoT活用による工場のスマート化構想",
              "物流倉庫の最適化シミュレーション",
              "IoTプラットフォーム導入支援（Azure IoT、AWS IoT）"
            ]
          },
          {
            "type": "p",
            "text": "IoTはAI・データ基盤と密接に関連する領域であり、データの収集から可視化・改善提案まで一貫したスキルが求められます。"
          }
        ]
      },
  
      {
        "id": "cloud-architecture-consulting",
        "title": "クラウドアーキテクチャコンサルタント",
        "summary": "AWS、Azure、GCPなどのクラウドサービスを用いて全社システム基盤を最適化する領域。",
        "content": [
          {
            "type": "p",
            "text": "クラウドアーキテクチャコンサルタントは、企業のIT基盤をクラウドへ移行し、柔軟性・セキュリティ・コスト最適化を実現するための戦略・設計を支援します。クラウド化はDXの重要要素であり、現在最も需要が高い領域のひとつです。"
          },
          {
            "type": "ul",
            "items": [
              "現行システムのクラウド移行計画（Cloud Migration Plan）",
              "AWS/Azure/GCPアーキテクチャ設計",
              "セキュリティ・認証設計",
              "大規模システムのパフォーマンス最適化",
              "全社クラウド戦略・ガバナンスの設計"
            ]
          },
          {
            "type": "p",
            "text": "技術と経営の両面からクラウド活用を考える必要があり、ITコンサルの中でも比較的エンジニアリング要素が強い領域です。"
          }
        ]
      },
  
      {
        "id": "security-consulting",
        "title": "サイバーセキュリティコンサルタント",
        "summary": "企業の情報資産を守るためのセキュリティ対策・ゼロトラストモデル導入を支援する専門領域。",
        "content": [
          {
            "type": "p",
            "text": "サイバーセキュリティコンサルタントは、企業の情報資産をサイバー攻撃から守るための戦略・体制・技術的対策を設計する役割を担います。社会的リスクの増大により、需要が急速に拡大しています。"
          },
          {
            "type": "ul",
            "items": [
              "セキュリティ診断・脆弱性評価",
              "ゼロトラストモデル設計",
              "情報セキュリティポリシー策定",
              "SOC/CSIRTの体制構築支援",
              "クラウドのセキュリティ設計"
            ]
          },
          {
            "type": "p",
            "text": "企業の信頼性と事業継続に直結するため、経営層への報告やリスク管理も含めた広い視点が求められます。"
          }
        ]
      }
    ]
  },
  {
    "key": "it-consulting-selection-flow",
    "title": "ITコンサルの選考フロー",
    "lessons": [
      {
        "id": "es-screening",
        "title": "第一段階：ES選考",
        "summary": "ITコンサル職の最初の選考ステップであり、論理性・具体性・志望度が問われる重要な関門です。",
        "content": [
          {
            "type": "p",
            "text": "ITコンサル関連の職種は名称こそ異なりますが（ソリューションエンジニア・ITソリューションコンサルタントなど）、ESで見られるポイントは共通しています。"
          },
          {
            "type": "ul",
            "items": [
              "志望動機（なぜIT×コンサルなのか）",
              "ガクチカ（論理性・再現性のある経験）",
              "IT業界またはデジタルへの関心",
              "結果とプロセスを分けて説明できるか",
              "結論ファーストで構造的に書けているか"
            ]
          },
          {
            "type": "p",
            "text": "ESは選考全体の「論理性の基準」を測る最初のフィルターであり、通過率は決して高くありません。"
          }
        ]
      },
  
      {
        "id": "web-test",
        "title": "第二段階：WEBテスト（適性検査）",
        "summary": "ITコンサルではTG-WEBを採用する企業が多く、特に計数分野の対策が重要になります。",
        "content": [
          {
            "type": "p",
            "text": "ITコンサル職は論理思考力を重視するため、WEBテストの難易度は他業界と比較して高くなる傾向があります。"
          },
          {
            "type": "ul",
            "items": [
              "TG-WEB（言語・計数）は最も一般的",
              "SPIを採用する企業もあるが比率は低い",
              "計数問題の難易度が高く、事前対策が必須",
              "性格検査は企業カルチャーと矛盾がないか確認される"
            ]
          },
          {
            "type": "p",
            "text": "WEBテストは“伸びる領域”であり、対策すれば通過率を大きく上げられるフェーズです。"
          }
        ]
      },
  
      {
        "id": "group-discussion",
        "title": "第三段階：GD選考（グループディスカッション）",
        "summary": "議論の結論よりも、論点整理・構造化された発言・協働姿勢が重視されるステップです。",
        "content": [
          {
            "type": "p",
            "text": "ITコンサルのGDは難易度が高く、テーマが抽象的であることも多いため、論理的な思考力とチームで議論を前進させる能力が求められます。"
          },
          {
            "type": "ul",
            "items": [
              "論点整理ができるか（何を議論するのか）",
              "構造化（要素分解・フレームワーク活用）",
              "チームメンバーの意見を拾う姿勢",
              "過度なリーダーシップより“議論の質”が重視",
              "短時間で結論へ導くファシリテーション能力"
            ]
          },
          {
            "type": "p",
            "text": "GDは“ITコンサルに必要な素養を体現する場”であり、選考通過において非常に重要です。"
          }
        ]
      },
  
      {
        "id": "first-interview",
        "title": "第四段階：個人面接（一次面接・ケース面接）",
        "summary": "ケース面接か通常面接かによって内容は異なるが、いずれも論理性と再現性を中心に評価されます。",
        "content": [
          {
            "type": "p",
            "text": "一次面接では、ケース面接か通常面接のどちらかが行われます。どちらの場合も、学生の“思考プロセス”と“再現性のある行動力”を見られます。"
          },
  
          {
            "type": "p",
            "text": "【ケース面接の場合】"
          },
          {
            "type": "ul",
            "items": [
              "課題の分解・整理（何が問題か）",
              "仮説思考（最も解決すべき論点）",
              "構造化（MECE・因果構造の理解）",
              "結論から話す能力",
              "ビジネスロジックに基づいた発言"
            ]
          },
  
          {
            "type": "p",
            "text": "【通常面接の場合】（多くのファームはこちら）"
          },
          {
            "type": "ul",
            "items": [
              "志望動機（IT×コンサル×企業の3点セット）",
              "ガクチカの深掘り（成果よりプロセス）",
              "就活の軸（価値観・判断基準）",
              "キャリアパス（入社後の成長イメージ）",
              "ITスキルや業界知識への興味"
            ]
          },
          {
            "type": "p",
            "text": "ケースがなくても、一次面接では“ロジックを言語化できるか”が最重要ポイントです。"
          }
        ]
      },
  
      {
        "id": "final-interview",
        "title": "第五段階：終面（最終面接）",
        "summary": "業界理解・企業理解を通じて志望度を確認するフェーズ。価値観・企業カルチャーとの相性が重視されます。",
        "content": [
          {
            "type": "p",
            "text": "最終面接では、論理力よりも“志望度”と“価値観のフィット感”が最も重視されます。役員クラスが登場し、ITコンサルとして長期的に働きたいかを確認されます。"
          },
          {
            "type": "ul",
            "items": [
              "業界分析の深さ（競合比較含む）",
              "企業分析の具体性（なぜこのファームか）",
              "配属領域への適性（ERP・DX・AI等）",
              "働き方・価値観の一致",
              "長期的に活躍できるかの総合判断"
            ]
          },
          {
            "type": "p",
            "text": "最終面接は“カルチャーマッチ面接”とも言われ、ここで合否が決まります。"
          },
          {
            "type": "p",
            "text": "また、本ガイドの全体構成および学習カリキュラムは、この選考フローに沿って設計されています。ES対策、GD対策、ケース面接対策、業界分析など、すべてがこのプロセスと一致しています。"
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
            日本ITコンサル業界の現状
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