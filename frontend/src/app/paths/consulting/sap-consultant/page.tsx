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
    "key": "sap-overview",
    "title": "SAPの全体像",
    "lessons": [
      {
        "id": "to-be-process",
        "title": "業務プロセスの描き（To-Be）",
        "summary": "SAP導入の第一歩は、企業のあるべき業務姿（To-Be）を描くことから始まります。現場業務と経営目標のギャップを明確化し、標準化・効率化すべきポイントを特定します。",
        "content": [
          {
            "type": "p",
            "text": "SAP導入は単なるシステム置き換えではなく、企業の業務そのものを改善・標準化するための“業務改革プロジェクト”です。そのため、まず最初に行うのが To-Be（あるべき姿）の定義です。"
          },
          {
            "type": "p",
            "text": "To-Be では、現状の As-Is に対して以下を明確にします："
          },
          {
            "type": "ul",
            "items": [
              "・どの業務を標準化するか（例：受注→出荷→請求）",
              "・どこを自動化し、どの部門間連携を強化するか",
              "・経営指標（KPI）にどう貢献するか",
              "・SAP標準プロセスと自社独自プロセスの境界線",
              "・ユーザー部門の役割分担（承認権限・入力範囲）"
            ]
          },
          {
            "type": "p",
            "text": "SAPプロジェクトでは、SAPが持つ世界標準の業務プロセス（Best Practice）をベースに、企業が目指す To-Be モデルを描き、全体の業務フローを再設計します。"
          }
        ]
      },
      {
        "id": "sap-erp-package",
        "title": "SAP社のERPパッケージ",
        "summary": "SAPは世界トップシェアのERPベンダーであり、財務・購買・在庫・販売・人事を統合管理する包括的なパッケージを提供しています。",
        "content": [
          {
            "type": "p",
            "text": "SAP社は世界180カ国以上で利用されているERP（Enterprise Resource Planning）パッケージのリーディングカンパニーです。企業の基幹業務を一つのシステムで統合管理できる点が最大の特徴です。"
          },
          {
            "type": "p",
            "text": "SAPの代表的なモジュールは以下の通りです："
          },
          {
            "type": "ul",
            "items": [
              "・FI：財務会計",
              "・CO：管理会計",
              "・MM：購買・在庫管理",
              "・SD：販売管理",
              "・PP：生産管理",
              "・HR/HCM：人事管理",
              "・BW：データ分析/レポート",
              "・Basis：システム基盤"
            ]
          },
          {
            "type": "p",
            "text": "近年主流の製品は SAP S/4HANA で、従来ERPと異なりインメモリデータベース HANA を採用し、リアルタイム処理性能が大幅に向上しています。これにより、経営判断スピードや分析能力の向上が期待できます。"
          }
        ]
      },
      {
        "id": "erp-flow",
        "title": "ERPパッケージの使用流れ",
        "summary": "SAP導入は、インフラ準備 → モジュール選定 → アドオン開発・検証という一連のプロセスで進みます。単なるソフトウェア導入ではなく、大規模な基幹システム構築プロジェクトとして進行します。",
        "content": [
          {
            "type": "p",
            "text": "SAP の導入は“使う”というよりも、“企業の基幹システムを構築するプロジェクト”と捉える必要があります。そのため、インフラ準備からモジュール選定、開発・検証に至るまで、段階的にプロセスが進みます。"
          },
          {
            "type": "p",
            "text": "一般的な SAP 導入の流れは以下の 3 ステップです："
          },
          {
            "type": "ul",
            "items": [
              "① インフラ準備：オンプレミス or クラウド（SAP S/4HANA Cloud / AWS / Azure）を選定し、環境構築を行う",
              "② モジュール選定：FI/CO/MM/SD/PP/HCM など必要な業務領域を定義し、標準機能で賄う範囲とカスタマイズ範囲を決める",
              "③ 開発・検証：アドオン開発、IF連携、結合テスト、ユーザーテスト（UAT）を実施し、本番環境へ移行する"
            ]
          },
          {
            "type": "p",
            "text": "このプロセスは数ヶ月〜1年以上かかることも多く、企業規模や業務範囲によって大きく異なりますが、共通しているのは“インフラ → モジュール → 開発・検証”という順番で導入が進む点です。"
          },
          {
            "type": "p",
            "text": "特にクラウド導入が増えている現在では、AWS や Azure 上に SAP 環境を構築するケースが一般的になっており、インフラ設計は SAP 導入の出発点として非常に重要です。"
          }
        ]
      }
      
    ]
  },
  {
    "key": "sap-accounting-modules",
    "title": "会計管理モジュール",
    "lessons": [
      {
        "id": "tr-module",
        "title": "TR（財務・資金管理）モジュール：資金管理ポジション、流動性予測",
        "summary": "TRモジュールは、企業の資金繰り・キャッシュマネジメント・流動性予測を統合管理し、日々の資金状況を可視化するための機能を提供します。",
        "content": [
          {
            "type": "p",
            "text": "TR（Treasury & Risk Management）モジュールは、企業の財務部門が“資金をどのように管理し、どのように将来のキャッシュフローを予測するか”を統合的に扱う領域です。特に大企業では、資金の見える化と予測精度が経営判断に直結するため、TRは非常に重要なモジュールです。"
          },
          {
            "type": "p",
            "text": "TRモジュールの中心概念は次の2つです："
          },
          {
            "type": "ul",
            "items": [
              "① 資金管理ポジション：銀行残高、入出金予定、投資・借入の状況をリアルタイムに可視化",
              "② 流動性予測：SAPに登録された受注・購買・請求・支払情報をもとに、将来のキャッシュフローを予測"
            ]
          },
          {
            "type": "p",
            "text": "これにより財務部門は、資金ショートのリスク回避、投資判断、借入タイミングの最適化など、企業の資金戦略を効率的に設計することができます。"
          }
        ]
      },
      {
        "id": "co-module",
        "title": "CO（管理会計）モジュール：原価要素会計",
        "summary": "COモジュールでは、製造業を中心に、どの活動にどれだけコストが発生し、どの要因によって利益が生み出されているかを分析します。原価要素会計はその基盤となる仕組みです。",
        "content": [
          {
            "type": "p",
            "text": "CO（Controlling）モジュールは、企業内部の“コストと収益”を管理し、経営に必要な分析情報を提供する領域です。その基礎となるのが『原価要素会計（Cost Element Accounting）』です。"
          },
          {
            "type": "p",
            "text": "原価要素会計では、コストを次のように分類して管理します："
          },
          {
            "type": "ul",
            "items": [
              "・一次原価要素：外部の取引から発生するコスト（仕入、外注費、給与など）",
              "・二次原価要素：社内で発生する配賦コスト（共通部門費、内部作業費など）"
            ]
          },
          {
            "type": "p",
            "text": "これにより、どの部門・どのプロセスで・どれだけコストが発生しているのかを正確に把握でき、利益改善や生産性向上のための経営判断に活かされます。"
          }
        ]
      },
      {
        "id": "copa-module",
        "title": "CO-PA（収益性分析）モジュール",
        "summary": "CO-PAは、製品・顧客・市場別に収益性を分析するモジュールで、どの事業が“どれだけ儲かっているか”を可視化する役割を担います。",
        "content": [
          {
            "type": "p",
            "text": "CO-PA（Profitability Analysis）は、企業の売上・コスト・利益を“セグメント別（製品、地域、顧客、チャネルなど）”に分析するためのモジュールです。経営層が最も重視する分析領域の一つです。"
          },
          {
            "type": "p",
            "text": "CO-PA では主に以下を分析できます："
          },
          {
            "type": "ul",
            "items": [
              "・どの製品が最も利益を生んでいるか",
              "・どの顧客が最も収益性が高いか",
              "・どの地域で利益率が低下しているか",
              "・販売チャネル別の採算性の差異"
            ]
          },
          {
            "type": "p",
            "text": "CO-PA の強みは、売上や原価をリアルタイムに取り込み、セグメント別に瞬時に分析できる点です。これにより、経営会議で必要な収益性レポートを即時作成することが可能になります。"
          }
        ]
      },
      {
        "id": "im-module",
        "title": "IM（設備予算管理）モジュール",
        "summary": "IMモジュールは、工場の設備投資・更新・大型プロジェクトの予算管理を行う領域で、長期的な投資計画を一元管理できます。",
        "content": [
          {
            "type": "p",
            "text": "IM（Investment Management）モジュールは、企業が行う設備投資や長期プロジェクトの予算管理を行う領域です。特に製造業においては、設備更新や新ライン導入の計画を管理するために必須のモジュールです。"
          },
          {
            "type": "p",
            "text": "IMモジュールで管理できる内容は以下の通りです："
          },
          {
            "type": "ul",
            "items": [
              "・設備投資計画の立案（例：新工場建設、ライン増設）",
              "・年度別予算管理（CapEx 管理）",
              "・プロジェクト別の実績と予算進捗の比較",
              "・投資効果（ROI）評価の基礎データ生成"
            ]
          },
          {
            "type": "p",
            "text": "IM を使うことで、投資金額・予算消化率・将来の償却計画などを一元管理でき、経営層が投資判断を行う際の根拠として活用されます。"
          }
        ]
      }
    ]
  },
  {
    "key": "sap-logistics-modules",
    "title": "ロジスティクスモジュール",
    "lessons": [
      {
        "id": "pp-module",
        "title": "PP（生産管理）モジュール：見込生産、受注生産、生産計画と生産管理",
        "summary": "PPモジュールは、生産計画・手配・製造実績管理を行う領域で、製造業の基幹プロセスを支える中心機能です。見込生産、受注生産の両方に対応し、生産計画から実績までを一元管理します。",
        "content": [
          {
            "type": "p",
            "text": "PP（Production Planning）モジュールは、製造業における生産計画・製造指示・実績管理を統合的に扱う領域です。SAP の中でも特に業務の複雑度が高いモジュールで、生産方式に応じて必要な管理内容が大きく変わります。"
          },
          {
            "type": "p",
            "text": "PPモジュールでは代表的に以下の生産方式に対応します："
          },
          {
            "type": "ul",
            "items": [
              "① 見込生産（MTS）：需要予測に基づき事前に生産し、在庫として保持する方式",
              "② 受注生産（MTO）：顧客の注文を受けてから生産を開始する方式"
            ]
          },
          {
            "type": "p",
            "text": "生産管理の主なプロセスは以下の通りです："
          },
          {
            "type": "ul",
            "items": [
              "・需要計画（Demand Planning）",
              "・MPS/MRPによる資材所要量計算",
              "・製造指図（生産オーダー）の発行",
              "・作業進捗管理",
              "・製造実績の登録（作業時間・使用部材・出来高）",
              "・原価計算への連携"
            ]
          },
          {
            "type": "p",
            "text": "PPはMM（資材管理）、SD（販売）、CO（原価計算）と強く結びついており、SAPロジスティクス全体の中核となるモジュールです。"
          }
        ]
      },
      {
        "id": "mm-module",
        "title": "MM（在庫・購買管理）モジュール：購買管理機能、在庫管理機能",
        "summary": "MMモジュールは、購買処理・仕入・在庫管理を行う領域で、資材確保から入庫・棚卸までのプロセスを統合管理します。",
        "content": [
          {
            "type": "p",
            "text": "MM（Material Management）モジュールは、原材料・部品・製品などの“モノの流れ”を管理する領域で、購買から在庫管理までを一元的に扱います。"
          },
          {
            "type": "p",
            "text": "MMの主要機能は以下の2つに分かれます："
          },
          {
            "type": "ul",
            "items": [
              "① 購買管理機能：購買依頼、見積依頼、購買発注、入荷検収、仕入先評価",
              "② 在庫管理機能：入庫、出庫、移動、棚卸、在庫評価、ロット管理"
            ]
          },
          {
            "type": "p",
            "text": "購買・在庫の正確な管理は、生産管理（PP）や販売管理（SD）とも密接に連動し、企業全体のコスト構造や生産効率に大きく影響します。"
          }
        ]
      },
      {
        "id": "sd-module",
        "title": "SD（販売管理）モジュール：受注管理、出荷管理、請求管理、与信管理、販売サポート管理、販売情報システム",
        "summary": "SDモジュールは、営業活動の中心となる受注・出荷・請求までのプロセスを管理する領域で、売上と顧客取引を一元管理する役割を担います。",
        "content": [
          {
            "type": "p",
            "text": "SD（Sales & Distribution）モジュールは、顧客取引を管理し、受注から売上計上までの一連の営業プロセスを統合するモジュールです。SAP導入の中心となる領域の一つです。"
          },
          {
            "type": "p",
            "text": "SDの主要プロセスは以下の通りです："
          },
          {
            "type": "ul",
            "items": [
              "① 受注管理：見積作成、受注登録、価格決定（条件テーブル）",
              "② 出荷管理：ピッキング、梱包、出荷指示、納品書発行",
              "③ 請求管理：請求書作成、入金照合、売掛金管理",
              "④ 与信管理：顧客の信用枠管理とリスクチェック",
              "⑤ 販売サポート管理：問い合わせ対応、契約管理、キャンペーン管理",
              "⑥ 販売情報システム（SIS）：販売データの分析・レポート作成"
            ]
          },
          {
            "type": "p",
            "text": "SD は FI（会計）や MM（在庫）ともリアルタイムに連動し、受注と同時に在庫確認・与信チェック・会計転記が行われる点が特徴です。"
          }
        ]
      },
      {
        "id": "le-module",
        "title": "LE（物流管理）モジュール：LE-TRM輸送管理モジュール、LE-WMS倉庫管理システムモジュール",
        "summary": "LEモジュールは輸送計画・物流倉庫管理を扱う領域で、輸送効率化・倉庫作業の最適化を支援します。SAPの中で最も現場オペレーションに近い領域です。",
        "content": [
          {
            "type": "p",
            "text": "LE（Logistics Execution）モジュールは、“物流の最後の一マイル”を扱う領域で、輸送管理と倉庫管理を統合的に行います。"
          },
          {
            "type": "p",
            "text": "LEは主に次の2つのサブモジュールで構成されています："
          },
          {
            "type": "ul",
            "items": [
              "① LE-TRM（輸送管理）：輸送計画、配送ルート管理、トラック手配、納品スケジュール管理",
              "② LE-WMS（倉庫管理）：入庫、出庫、在庫配置、棚番管理、倉庫ロケーション最適化"
            ]
          },
          {
            "type": "p",
            "text": "倉庫作業者のハンディ端末や自動倉庫システムとも連携し、現場の作業をリアルタイムに効率化できる点が特徴です。"
          }
        ]
      },
      {
        "id": "qm-module",
        "title": "QM（品質管理）モジュール",
        "summary": "QMモジュールは品質検査・不良分析・是正処置など、企業の品質管理活動を支援するモジュールです。",
        "content": [
          {
            "type": "p",
            "text": "QM（Quality Management）モジュールは、原材料・仕掛品・完成品の品質を管理する領域で、購買、製造、出荷の各プロセスに品質チェックを組み込みます。"
          },
          {
            "type": "p",
            "text": "QMの代表的な機能は以下の通りです："
          },
          {
            "type": "ul",
            "items": [
              "・受入検査（購買時の品質チェック）",
              "・工程内検査（製造プロセス中の品質確認）",
              "・最終検査（出荷前の品質チェック）",
              "・不良・クレーム管理",
              "・品質改善のための分析レポート"
            ]
          },
          {
            "type": "p",
            "text": "品質管理は生産性向上・顧客満足度向上に直結するため、PP（生産）やMM（購買）との連携が非常に重要です。"
          }
        ]
      }
    ]
  },
  {
    "key": "sap-hr-hcm-modules",
    "title": "人事管理モジュール",
    "lessons": [
      {
        "id": "hr-hcm-module",
        "title": "HR、HCM（人事管理）モジュール",
        "summary": "HR/HCMモジュールは、人事情報管理・勤怠管理・給与計算・人材育成・組織管理など、人事部門の基幹業務をすべて統合管理するモジュールです。",
        "content": [
          {
            "type": "p",
            "text": "HR/HCM（Human Resource / Human Capital Management）モジュールは、企業の人に関する情報を統合管理する領域で、採用・配置・勤怠・給与・評価・育成まで、人事ライフサイクル全体を支える SAP の基幹モジュールです。"
          },
          {
            "type": "p",
            "text": "従来は HR（Human Resource）と呼ばれていましたが、S/4HANA 時代にはより広い概念として HCM（Human Capital Management）と呼ばれ、人材戦略まで含む領域として進化しています。"
          },
          {
            "type": "p",
            "text": "HR/HCMモジュールで扱う主な機能は以下の通りです："
          },
          {
            "type": "ul",
            "items": [
              "① 組織管理（Organizational Management）：組織構造、役職、部署、配置情報の管理",
              "② 人事マスタ管理（Personnel Administration）：社員情報の管理（入社・異動・退職・住所・契約情報など）",
              "③ 勤怠管理（Time Management）：出勤・休暇・残業・勤務パターンの管理",
              "④ 給与計算（Payroll）：控除、手当、税金、社会保険などを含む給与処理",
              "⑤ 人事評価・タレント管理（Performance / Talent Management）：評価制度、スキル管理、研修管理",
              "⑥ 従業員セルフサービス（ESS/MSS）：社員や管理職が自分で手続きを行う仕組み",
              "⑦ 法定調書・コンプライアンス対応：社会保険・税務関連の出力"
            ]
          },
          {
            "type": "p",
            "text": "特に給与計算（Payroll）と勤怠管理は、日本特有の制度（社会保険、住民税、残業計算など）に対応するため導入難易度が高く、多くの企業で HCM の主要領域として扱われます。"
          },
          {
            "type": "p",
            "text": "また、SAP SuccessFactors（クラウド人事システム）との連携が増えており、中長期的には SAP の人事領域は“SuccessFactors＋S/4HANA の連携型”が標準となりつつあります。"
          }
        ]
      }
    ]
  },
  {
    "key": "sap-implementation-flow",
    "title": "SAPの導入フロー",
    "lessons": [
      {
        "id": "current-analysis",
        "title": "現状分析（As-Is 分析）",
        "summary": "SAP導入の第一歩は、現状業務を正確に把握し、課題を可視化することです。これにより、標準化・自動化の対象領域を特定します。",
        "content": [
          {
            "type": "p",
            "text": "SAP導入プロジェクトでは、まず企業の現行業務（As-Is）を詳細に分析することから始まります。部門ごとの業務フロー、マスタ、帳票、システム連携、Excel作業など、現在の運用状況を正確に把握します。"
          },
          {
            "type": "p",
            "text": "現状分析の主な目的は以下の通りです："
          },
          {
            "type": "ul",
            "items": [
              "・属人化している作業の特定",
              "・業務の重複・非効率の可視化",
              "・業務ルールの整理（承認権限・責任範囲）",
              "・既存システムの課題・制約の洗い出し",
              "・データ構造やマスタ運用の問題把握"
            ]
          },
          {
            "type": "p",
            "text": "現状分析は後続の To-Be（あるべき姿）設計の土台となり、標準機能の適合性検証（Fit/Gap分析）に直結する極めて重要なフェーズです。"
          }
        ]
      },
      {
        "id": "requirement-definition",
        "title": "要件定義（Fit/Gap 分析）",
        "summary": "SAP標準機能と現場業務の差分を整理し、“どこを標準で運用し、どこをカスタマイズするか”を決定します。",
        "content": [
          {
            "type": "p",
            "text": "要件定義フェーズでは、現状業務（As-Is）と SAP 標準プロセスを照合し、Fit/Gap 分析を通じて“あるべき姿（To-Be）”を決定します。"
          },
          {
            "type": "p",
            "text": "要件定義で決める内容は以下の通りです："
          },
          {
            "type": "ul",
            "items": [
              "・SAP標準で対応できる領域（Fit）",
              "・カスタマイズ or アドオンが必要な領域（Gap）",
              "・必要なモジュール、サブモジュールの範囲",
              "・IF連携（外部システム連携）の要件",
              "・マスタの構造や運用ポリシー",
              "・帳票・レポート要件"
            ]
          },
          {
            "type": "p",
            "text": "Fit/Gap 分析は最も重要な工程で、ここでの判断が“導入工数・期間・コスト”を大きく左右します。特にアドオン開発は慎重に判断する必要があります。"
          }
        ]
      },
      {
        "id": "design-development",
        "title": "設計・開発（基本設計・詳細設計・アドオン開発）",
        "summary": "要件定義で決定したTo-Beモデルに基づき、SAP標準設定とアドオン開発を行います。基本設計→詳細設計→開発→単体テストの順で進みます。",
        "content": [
          {
            "type": "p",
            "text": "設計・開発フェーズでは、要件定義で整理された To-Be 業務をシステムとして実装するための設計書を作成し、アドオンやIF連携の開発を行います。"
          },
          {
            "type": "p",
            "text": "主なプロセスは以下の通りです："
          },
          {
            "type": "ul",
            "items": [
              "① 基本設計：画面構成、データ項目、業務ルール、標準設定の方針を決定",
              "② 詳細設計：ロジック詳細、テーブル、IF仕様、帳票レイアウトを確定",
              "③ 開発：アドオン開発（ABAP）、外部システムとのIF開発",
              "④ 単体テスト：プログラム単位で動作確認を実施"
            ]
          },
          {
            "type": "p",
            "text": "SAP導入では、基本設計と詳細設計の精度が品質に直結するため、ドキュメントの正確性・整合性が最も重視されます。"
          }
        ]
      },
      {
        "id": "go-live-preparation",
        "title": "本稼働準備（結合テスト・移行・ユーザートレーニング）",
        "summary": "開発完了後、結合テスト・UAT・データ移行・ユーザ教育など、本番稼働に向けた準備を行います。",
        "content": [
          {
            "type": "p",
            "text": "本稼働準備フェーズでは、SAPシステムを本番稼働させるための最終準備を行います。複数部門・複数モジュールを跨ぐ工程が多く、プロジェクト全体の山場となるフェーズです。"
          },
          {
            "type": "p",
            "text": "主な作業内容は以下の通りです："
          },
          {
            "type": "ul",
            "items": [
              "・結合テスト（Integration Test）：複数モジュール間の連携検証",
              "・UAT（User Acceptance Test）：現場ユーザーによる承認テスト",
              "・データ移行（マスタ・在庫・残高データなど）",
              "・移行リハーサル（本番切替手順の確認）",
              "・ユーザートレーニング（操作方法・運用研修）",
              "・本番環境の構築と設定"
            ]
          },
          {
            "type": "p",
            "text": "特にデータ移行（移行設計 → 移行ツール開発 → 移行リハーサル → 本番移行）は、多くのプロジェクトで最もリスクの高い工程とされます。"
          }
        ]
      },
      {
        "id": "post-go-live",
        "title": "稼働後フロー（運用・保守・改善）",
        "summary": "SAP稼働後は、運用定着・改善・問い合わせ対応・追加開発など、長期的な運用フェーズに入ります。導入よりも“稼働後の運用設計”が重要です。",
        "content": [
          {
            "type": "p",
            "text": "SAPは本番稼働後がスタートであり、安定運用・改善活動・問い合わせ対応・追加入力など、継続的なサポートが必要になります。"
          },
          {
            "type": "p",
            "text": "稼働後に行う主な業務は以下の通りです："
          },
          {
            "type": "ul",
            "items": [
              "・運用保守（トラブル対応・パフォーマンス改善）",
              "・問い合わせ対応（操作方法・データ不整合）",
              "・追加開発（業務改善の要望に応じて拡張）",
              "・定期的なマスタメンテナンス",
              "・SAPアップデート（Support Package、Enhancement）",
              "・運用レポートの作成と改善提案"
            ]
          },
          {
            "type": "p",
            "text": "SAPの価値は“導入した瞬間”ではなく、“運用しながら改善していく過程”で大きく高まるため、稼働後のサポート設計は非常に重要な領域です。"
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
            AIコンサルの学習
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
