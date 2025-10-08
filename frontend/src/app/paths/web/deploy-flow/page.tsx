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
    "key": "waterfall-development",
    "title": "ウォーターフォール開発",
    "lessons": [
      {
        "id": "waterfall-overview",
        "title": "ウォーターフォール開発とは",
        "summary": "計画と設計を重視し、工程を順序立てて進める伝統的な開発手法です。",
        "content": [
          {
            "type": "p",
            "text": "ウォーターフォール開発とは、要件定義からテスト・運用までを順番に進めていく「計画駆動型」の開発手法です。滝（ウォーターフォール）のように上流から下流へと工程が一方向に流れていくことからこの名前が付きました。"
          },
          {
            "type": "p",
            "text": "上流工程で仕様を詳細に決めてから設計・実装に移るため、変更に弱い反面、進捗管理や品質保証がしやすく、金融・公共・製造業など大規模システム開発で広く採用されています。"
          },
          {
            "type": "ul",
            "items": [
              "要件定義から運用までを段階的に進行",
              "各工程が明確に分離されており進捗管理が容易",
              "仕様変更には弱いが、品質・スケジュールの安定性が高い",
              "大規模・ミッションクリティカルなシステムに適している"
            ]
          }
        ]
      },
      {
        "id": "waterfall-process",
        "title": "ウォーターフォール開発の工程",
        "summary": "上流から下流へと段階的に進める明確なフェーズ構造を持ちます。",
        "content": [
          {
            "type": "p",
            "text": "ウォーターフォール開発は、複数の明確なフェーズで構成され、それぞれが完了してから次の工程に進みます。上流工程では要求の整理と設計を入念に行い、下流工程で実装・テスト・リリースへと進みます。"
          },
          {
            "type": "p",
            "text": "このフェーズごとの進行により、各段階のレビューや承認がしやすく、進捗や品質を管理しやすいという特徴があります。"
          },
          {
            "type": "ul",
            "items": [
              "要件定義：顧客・利用者のニーズを整理し、機能・非機能要件を明確化",
              "基本設計：システム全体の構造や画面遷移などを設計",
              "詳細設計：モジュールやデータ構造、処理フローを詳細に設計",
              "実装：設計書に従ってプログラムを開発",
              "テスト：単体・結合・総合テストで品質を確認",
              "運用・保守：リリース後のシステムを運用し、問題があれば修正"
            ]
          }
        ]
      },
      {
        "id": "waterfall-advantages",
        "title": "ウォーターフォール開発のメリット",
        "summary": "計画性と品質保証のしやすさが最大の強みです。",
        "content": [
          {
            "type": "p",
            "text": "ウォーターフォール開発の最大の強みは、全体像を明確にした上で進行できる計画性と品質の担保のしやすさです。各工程が完了してから次に進むため、進捗管理が容易で、ドキュメントも整備されやすい構造になっています。"
          },
          {
            "type": "p",
            "text": "また、契約や要件が事前に明確な案件では、見積もりや納期の精度が高く、リスク管理もしやすい点が評価されています。"
          },
          {
            "type": "ul",
            "items": [
              "要件が固まっている場合に計画が立てやすい",
              "各工程が明確なため進捗・品質管理が容易",
              "ドキュメントが整備されやすく引き継ぎがしやすい",
              "契約・見積もりが明確になりやすい"
            ]
          }
        ]
      },
      {
        "id": "waterfall-disadvantages",
        "title": "ウォーターフォール開発のデメリット",
        "summary": "変更への弱さと初期要件の重要性が大きな課題です。",
        "content": [
          {
            "type": "p",
            "text": "ウォーターフォール開発の最大の弱点は、後工程での変更が極めて難しいことです。上流で決めた仕様に沿って進めるため、途中での方針変更はコストや工数を大きく増やしてしまいます。"
          },
          {
            "type": "p",
            "text": "また、初期段階で要件を正確に定義できなければ、後になってユーザーのニーズとずれたシステムになるリスクが高まります。近年の変化の激しいWeb・スタートアップ領域では不向きな場合も多いです。"
          },
          {
            "type": "ul",
            "items": [
              "仕様変更への対応が難しくコストが高くなる",
              "初期段階で要件を正確に定義する必要がある",
              "実際のユーザーフィードバックが得られるのが遅い",
              "不確実性の高いプロジェクトには不向き"
            ]
          }
        ]
      },
      {
        "id": "waterfall-vs-agile",
        "title": "アジャイル開発との比較",
        "summary": "「計画重視」と「適応重視」、両者の考え方の違いを理解することが重要です。",
        "content": [
          {
            "type": "p",
            "text": "ウォーターフォールは「計画駆動」、アジャイルは「適応駆動」という性格の違いがあります。前者は安定性と品質重視、後者は変化対応とスピード重視と言えます。"
          },
          {
            "type": "p",
            "text": "近年では両者を組み合わせるケースも増えており、上流工程でウォーターフォール的に仕様を固め、下流でアジャイル的な反復開発を行う“ハイブリッド型”が現実的な選択肢となっています。"
          },
          {
            "type": "ul",
            "items": [
              "ウォーターフォール：計画・品質重視／大規模・仕様固定型に適する",
              "アジャイル：柔軟性・スピード重視／不確実性の高い領域に適する",
              "ハイブリッド型：両者の長所を活かした実践的な手法",
              "プロジェクトの性質に応じて使い分けが重要"
            ]
          }
        ]
      },
      {
        "id": "waterfall-skills",
        "title": "ウォーターフォール開発に求められるスキル",
        "summary": "計画力・設計力とともに、ドキュメント化能力や調整力が重要です。",
        "content": [
          {
            "type": "p",
            "text": "ウォーターフォール開発では、初期段階で要件を正確に整理し、設計書や仕様書を緻密に作り込む力が不可欠です。また、多くの関係者と合意を取りながら進めるため、調整力や文書化能力が特に重視されます。"
          },
          {
            "type": "p",
            "text": "エンジニアだけでなく、プロジェクトマネージャーやシステムアーキテクトなど、計画と設計を司る職種が大きな役割を担います。"
          },
          {
            "type": "ul",
            "items": [
              "要件定義・仕様策定のための分析力とヒアリング力",
              "詳細な設計書・仕様書を作成するドキュメント力",
              "関係者との合意形成やスケジュール調整力",
              "大規模プロジェクト管理・リスク管理のスキル"
            ]
          }
        ]
      }
    ]
  },
  
  {
    "key": "agile-development",
    "title": "アジャイル開発",
    "lessons": [
      {
        "id": "agile-overview",
        "title": "アジャイル開発とは",
        "summary": "変化の激しい現代の開発現場で主流となっている柔軟かつ反復的な開発手法です。",
        "content": [
          {
            "type": "p",
            "text": "アジャイル開発とは、従来のウォーターフォール型のように「要件定義→設計→実装→テスト→リリース」を一方向に進めるのではなく、短い開発サイクル（イテレーション）を繰り返しながら少しずつ価値をユーザーに届けていく開発手法です。"
          },
          {
            "type": "p",
            "text": "「変化への適応」「顧客との協調」「動くソフトウェアの重視」「人と対話の重視」という4つの価値観を基盤に、仕様の変更や市場の変化に柔軟に対応できるのが特徴です。スタートアップから大企業まで幅広く採用されており、Webサービスやアプリ開発の現場では標準的な考え方となっています。"
          },
          {
            "type": "ul",
            "items": [
              "短いサイクル（スプリント）で小さな価値を継続的にリリース",
              "顧客・ユーザーとの密なコミュニケーションを重視",
              "仕様変更への柔軟な対応が可能",
              "チームの自律性とコラボレーションを促進"
            ]
          }
        ]
      },
      {
        "id": "scrum",
        "title": "スクラム開発",
        "summary": "アジャイル開発で最も広く使われるフレームワークで、チームが一丸となって価値を生み出します。",
        "content": [
          {
            "type": "p",
            "text": "スクラムはアジャイル開発の代表的なフレームワークで、1〜4週間程度の短い期間「スプリント」を繰り返しながら製品を進化させていきます。各スプリントでは計画・実装・レビュー・振り返りを行い、次のサイクルに改善を反映します。"
          },
          {
            "type": "p",
            "text": "スクラムチームは3つの役割で構成されます。プロダクトオーナー（PO）は何を作るかを決める役割、スクラムマスターはプロセス改善とチーム支援を担い、開発チームは実際に価値を生み出す実装を担当します。"
          },
          {
            "type": "ul",
            "items": [
              "スプリントごとに計画・開発・レビュー・改善を反復",
              "プロダクトオーナー・スクラムマスター・開発チームの3役割",
              "デイリースクラムによる進捗共有と課題解消",
              "スプリントレビューで成果をステークホルダーに共有"
            ]
          }
        ]
      },
      {
        "id": "kanban",
        "title": "カンバン方式",
        "summary": "タスクの見える化とフロー改善により、継続的な価値提供を実現するアプローチです。",
        "content": [
          {
            "type": "p",
            "text": "カンバンは日本のトヨタ生産方式に由来する手法で、開発プロセスを「見える化」し、作業の流れ（フロー）を最適化することを重視します。タスクを「To Do」「Doing」「Done」といったカンバンボード上で管理し、チーム全体で進捗を把握します。"
          },
          {
            "type": "p",
            "text": "スクラムのようにスプリントという明確な期間を設けず、継続的な改善とデリバリーを追求するのが特徴です。特に運用・保守フェーズや継続的な開発が中心のプロジェクトで効果を発揮します。"
          },
          {
            "type": "ul",
            "items": [
              "タスクをボード上で「見える化」し、フローを最適化",
              "WIP（仕掛かり作業数）の制限による効率向上",
              "継続的なデリバリーと改善を重視",
              "スクラムと組み合わせてハイブリッド運用するケースも多い"
            ]
          }
        ]
      },
      {
        "id": "agile-vs-waterfall",
        "title": "ウォーターフォールとの違い",
        "summary": "一方向的な計画駆動と、反復的な価値提供という根本的な違いがあります。",
        "content": [
          {
            "type": "p",
            "text": "ウォーターフォール型開発は、上流から下流へと工程を一方向に進める「計画駆動型」の手法で、大規模で仕様が明確なプロジェクトに向いています。一方、アジャイルは変化を前提に「反復と適応」を重視するため、不確実性の高いプロジェクトに適しています。"
          },
          {
            "type": "p",
            "text": "近年では、要件定義や基本設計など上流部分はウォーターフォール的に行い、実装や改善をアジャイルで進める“ハイブリッド型”も増えています。"
          },
          {
            "type": "ul",
            "items": [
              "ウォーターフォール：一方向・計画重視・変更に弱い",
              "アジャイル：反復・適応重視・変更に強い",
              "大規模・公共系はウォーターフォール、小規模・Web系はアジャイルが主流",
              "両者を組み合わせたハイブリッド運用も一般化"
            ]
          }
        ]
      },
      {
        "id": "agile-skills",
        "title": "アジャイル開発に求められるスキル",
        "summary": "技術力だけでなく、チームでの対話力・改善力が重要です。",
        "content": [
          {
            "type": "p",
            "text": "アジャイル開発では、個々の技術スキルだけでなく、チームとして価値を最大化するためのソフトスキルも重視されます。特に、顧客やメンバーとの対話力、変化に適応する柔軟性、課題を自律的に改善する姿勢が求められます。"
          },
          {
            "type": "p",
            "text": "また、自動テストやCI/CD、クラウド開発環境など、継続的デリバリーを支える技術知識も重要です。スクラムマスターやプロダクトオーナーなど、開発以外のロールに進むキャリアパスも存在します。"
          },
          {
            "type": "ul",
            "items": [
              "チーム内外との円滑なコミュニケーション力",
              "仕様変更や優先度変化に対応できる柔軟性",
              "自律的に改善点を見つけるアジャイルマインドセット",
              "自動テスト・CI/CD・クラウド活用などの技術知識"
            ]
          }
        ]
      }
    ]
  },
  {
    "key": "web-dev-methodologies",
    "title": "Web系IT業界での開発方式",
    "lessons": [
      {
        "id": "web-dev-overview",
        "title": "Web系ITにおける開発方式の特徴",
        "summary": "変化の速いWebサービスの世界では、アジャイル開発が主流となっています。",
        "content": [
          {
            "type": "p",
            "text": "Web系IT業界では、ユーザーのニーズや市場環境の変化に迅速に対応することが重要です。そのため、ほとんどの企業が従来型のウォーターフォール開発ではなく、短いサイクルで反復的に開発を進める「アジャイル開発」を採用しています。"
          },
          {
            "type": "p",
            "text": "アジャイル開発は、仕様変更への柔軟な対応が可能であり、動くプロダクトを早期にユーザーへ届けられるという点で、Webサービスの性質と非常に相性が良い手法です。特に、スタートアップ企業やBtoC向けのWebサービスでは、毎週・毎日のように改善とリリースを繰り返す開発体制が一般的です。"
          },
          {
            "type": "ul",
            "items": [
              "ユーザーのフィードバックを素早く反映できる",
              "仕様や要件が変化しやすいWebサービスに適応できる",
              "MVP（Minimum Viable Product）開発と相性が良い",
              "小規模チームでの高速な開発・改善が可能"
            ]
          }
        ]
      },
      {
        "id": "web-scrum",
        "title": "スクラムによる反復的な開発",
        "summary": "Webサービス開発では、スクラムによる短期サイクルの反復開発が広く使われています。",
        "content": [
          {
            "type": "p",
            "text": "Web系企業の多くはアジャイル開発の中でも「スクラム」を採用しています。1〜2週間のスプリントごとに計画・開発・レビュー・改善を繰り返すことで、サービスを少しずつ成長させながら市場の変化に対応します。"
          },
          {
            "type": "p",
            "text": "また、チーム内でのデイリースクラムによる情報共有や、スプリントレビューでのフィードバック反映が文化として定着しており、「作ってから直す」ことが前提の開発プロセスとなっています。"
          },
          {
            "type": "ul",
            "items": [
              "1〜2週間ごとのスプリントで継続的にリリース",
              "ユーザーフィードバックを踏まえて次のスプリント計画を更新",
              "短期間で価値を届けることでサービス成長を加速",
              "チームの自律性とコラボレーションを重視"
            ]
          }
        ]
      },
      {
        "id": "web-kanban",
        "title": "カンバンによる継続的な改善",
        "summary": "運用・保守や長期的改善ではカンバン方式も広く活用されます。",
        "content": [
          {
            "type": "p",
            "text": "Web系開発では、スクラムだけでなくカンバン方式もよく利用されます。特に運用・改善フェーズでは、タスクをボード上で可視化し、WIP制限を設けてフローを最適化するカンバンが効果を発揮します。"
          },
          {
            "type": "p",
            "text": "スクラムとカンバンを併用して、開発フェーズはスプリント単位で、運用フェーズは継続的なフロー管理で進めるといった“ハイブリッド運用”も一般的です。"
          },
          {
            "type": "ul",
            "items": [
              "カンバンボードでタスクの見える化と優先順位管理",
              "WIP制限により効率的なタスク処理を実現",
              "継続的な改善や小さな機能追加に適している",
              "スクラムと組み合わせた柔軟な運用が可能"
            ]
          }
        ]
      },
      {
        "id": "waterfall-usage-in-web",
        "title": "ウォーターフォール開発が使われるケース",
        "summary": "一部の大型プロジェクトや受託開発ではウォーターフォールが採用されることもあります。",
        "content": [
          {
            "type": "p",
            "text": "Web系IT業界でも、すべてがアジャイルというわけではありません。大規模な基幹システムや公共向けWebシステム、要件が初めから明確な受託開発などでは、ウォーターフォール型の開発が今でも採用されています。"
          },
          {
            "type": "p",
            "text": "特に受託案件では契約や納期が厳密に定められているため、仕様を初期段階で固めるウォーターフォールの方が適している場合があります。ただし、Webサービスの中心的な領域（自社サービス・BtoCサービスなど）ではアジャイルが圧倒的多数です。"
          },
          {
            "type": "ul",
            "items": [
              "大規模・長期開発プロジェクト（基幹系システムなど）",
              "契約・納期が厳格な受託開発",
              "仕様が初期段階から確定している場合",
              "運用コストや障害リスクが極めて高いシステム"
            ]
          }
        ]
      },
      {
        "id": "web-dev-summary",
        "title": "なぜWeb系はアジャイルなのか",
        "summary": "スピードと柔軟性が競争力の源泉となるからです。",
        "content": [
          {
            "type": "p",
            "text": "Webサービスの世界は変化が激しく、ユーザーの行動や市場環境も日々変わります。こうした環境では、数ヶ月先の要件を完全に決めてから開発を始めるウォーターフォールではスピードが遅すぎ、機会損失につながります。"
          },
          {
            "type": "p",
            "text": "アジャイル開発であれば、最小限の機能を素早くリリースし、実際のユーザーの反応を踏まえて改善を重ねることができます。この“仮説検証型”のアプローチこそが、Web系IT企業がアジャイルを標準としている最大の理由です。"
          },
          {
            "type": "ul",
            "items": [
              "ユーザー行動・市場変化に即応できる柔軟性",
              "短期間で価値を提供し、継続的に改善できる",
              "仮説検証サイクルを高速に回すことができる",
              "競争の激しい市場でスピードと適応力が競争力となる"
            ]
          }
        ]
      }
    ]
  },
  {
    "key": "dev-tools",
    "title": "開発ツール",
    "lessons": [
      {
        "id": "dev-tools-overview",
        "title": "開発ツールとは",
        "summary": "プログラミングや開発を効率的に進めるためのソフトウェアやサービスです。",
        "content": [
          {
            "type": "p",
            "text": "開発ツールとは、エンジニアがソフトウェア開発を行う際に使用するさまざまなツールの総称です。コードを書くエディタやIDE、ソースコードを管理するバージョン管理ツール、チーム開発を支えるコラボレーションツールなど、多岐にわたります。"
          },
          {
            "type": "p",
            "text": "Web系IT業界では、素早い開発と継続的な改善を支えるために、軽量で拡張性が高く、クラウド連携にも強いツールが好まれます。ここでは代表的なツールをいくつか紹介します。"
          },
          {
            "type": "ul",
            "items": [
              "エディタ・IDE：コードを書くための開発環境",
              "バージョン管理ツール：ソースコードの変更履歴を管理",
              "コンテナ・仮想化ツール：環境構築を自動化・共有",
              "CI/CDツール：自動テスト・自動デプロイの仕組みを構築",
              "コラボレーションツール：チーム開発を支援"
            ]
          }
        ]
      },
      {
        "id": "vscode",
        "title": "Visual Studio Code",
        "summary": "軽量かつ高機能なエディタとして、Web開発の標準ツールとなっています。",
        "content": [
          {
            "type": "p",
            "text": "Visual Studio Code（通称 VS Code）は、Microsoft が開発した無料のソースコードエディタで、現在Web系IT業界で最も広く使われている開発ツールです。軽量で高速な動作ながら、拡張機能によってさまざまな言語・フレームワーク・開発環境に対応できます。"
          },
          {
            "type": "p",
            "text": "Gitとの連携やデバッガー、ターミナル統合などが標準搭載されており、フロントエンド・バックエンド問わずほとんどの開発を1つのツール上で完結させることができます。リモート開発機能を使えば、AWSなどクラウド上のサーバーに直接接続して開発することも可能です。"
          },
          {
            "type": "ul",
            "items": [
              "軽量で起動が早く、拡張性が高い",
              "TypeScript、Python、Javaなど多数の言語に対応",
              "Git連携やデバッグ機能を標準搭載",
              "リモート開発やコンテナ内開発にも対応"
            ]
          }
        ]
      },
      {
        "id": "git-and-github",
        "title": "Git / GitHub",
        "summary": "ソースコードの履歴管理とチーム開発に欠かせないツールです。",
        "content": [
          {
            "type": "p",
            "text": "Gitはソースコードのバージョン管理システムで、開発中のコードの変更履歴を記録・共有することができます。複数人での開発でも、誰がいつどのような変更を行ったかを追跡し、安全に統合できます。"
          },
          {
            "type": "p",
            "text": "GitHubはそのGitリポジトリをクラウド上でホスティングできるサービスで、チーム開発やオープンソースプロジェクトでは事実上の標準プラットフォームです。プルリクエストやレビュー機能を活用することで、コード品質を保ちながら開発を進められます。"
          },
          {
            "type": "ul",
            "items": [
              "コードの変更履歴を記録し、いつでも過去に戻せる",
              "ブランチを用いて複数人での並行開発が可能",
              "GitHubを使えばクラウド上で共有・レビューができる",
              "CI/CDやIssue管理などの機能とも連携可能"
            ]
          }
        ]
      },
      {
        "id": "docker",
        "title": "Docker",
        "summary": "環境構築を自動化し、どこでも同じ環境で動かせるコンテナ技術です。",
        "content": [
          {
            "type": "p",
            "text": "Dockerは、アプリケーションとその動作環境を「コンテナ」としてまとめて構築・共有できるツールです。開発環境と本番環境の違いによる不具合（いわゆる“本番で動かない”問題）を防ぐことができます。"
          },
          {
            "type": "p",
            "text": "Web系IT業界では、バックエンド・フロントエンド・データベースなど複数のサービスをDocker Composeでまとめて管理するのが一般的で、開発効率とチーム共有性が大きく向上します。"
          },
          {
            "type": "ul",
            "items": [
              "環境構築をコード化し、自動で再現可能",
              "本番と同一環境での動作検証が容易",
              "チームメンバー全員が同じ環境を共有できる",
              "Docker Composeで複数コンテナをまとめて管理"
            ]
          }
        ]
      },
      {
        "id": "aws",
        "title": "AWS（Amazon Web Services）",
        "summary": "クラウド開発・運用の基盤として、現代Webサービス開発に欠かせない存在です。",
        "content": [
          {
            "type": "p",
            "text": "AWS（Amazon Web Services）は、世界で最も広く利用されているクラウドプラットフォームで、サーバー・データベース・ストレージ・ネットワークなどをオンデマンドで利用できます。Web系サービスの多くは、AWS上にインフラを構築して本番運用を行っています。"
          },
          {
            "type": "p",
            "text": "開発段階でも、EC2（仮想サーバー）を使ってリモート開発環境を用意したり、S3に静的ファイルをホスティングしたりするケースが一般的です。クラウドネイティブな開発・運用を行う上で、AWSの基本知識は必須といえます。"
          },
          {
            "type": "ul",
            "items": [
              "EC2：仮想サーバーで開発・本番環境を構築",
              "S3：静的ファイルやデータの保存・配信",
              "RDS：マネージドなデータベースサービス",
              "IAM：アクセス管理やセキュリティの制御",
              "CI/CD・監視など他ツールとの統合も容易"
            ]
          }
        ]
      },
      {
        "id": "ci-cd-tools",
        "title": "CI/CDツール",
        "summary": "テストやデプロイを自動化し、開発サイクルを高速化するツール群です。",
        "content": [
          {
            "type": "p",
            "text": "CI（継続的インテグレーション）とCD（継続的デリバリー／デプロイメント）は、アジャイル開発を支える重要な仕組みです。代表的なツールとしてはGitHub Actions、CircleCI、Jenkinsなどがあります。"
          },
          {
            "type": "p",
            "text": "コードをプッシュすると自動でテストやビルド、デプロイが実行されるため、人為的なミスを減らし、迅速なリリースサイクルを実現できます。特にWeb系サービスでは1日に何度も更新が行われるため、CI/CDは不可欠な存在です。"
          },
          {
            "type": "ul",
            "items": [
              "テスト・ビルド・デプロイの自動化で開発効率向上",
              "人的ミスを減らし品質を安定させる",
              "Gitとの連携で開発フローに自然に組み込める",
              "小さな変更を頻繁にリリースできる"
            ]
          }
        ]
      },
      {
        "id": "collaboration-tools",
        "title": "コラボレーションツール",
        "summary": "チームでの開発を円滑にするための情報共有・管理ツールです。",
        "content": [
          {
            "type": "p",
            "text": "Web系の開発では、エンジニアだけでなく、デザイナー、PM、ビジネス担当者との連携が欠かせません。そのため、SlackやNotion、Jiraといったコラボレーションツールが広く使われています。"
          },
          {
            "type": "p",
            "text": "これらのツールを活用することで、情報共有やタスク管理、ドキュメント整理を効率化でき、アジャイル開発のスピードと柔軟性を最大限に活かすことができます。"
          },
          {
            "type": "ul",
            "items": [
              "Slack：リアルタイムなコミュニケーションを支援",
              "Notion：仕様書やナレッジの共有・整理",
              "Jira：タスク・スプリントの管理と可視化",
              "Figma：デザインと開発の連携を効率化"
            ]
          }
        ]
      }
    ]
  },
  {
    "key": "about-this-guidance",
    "title": "本ガイダンスについて",
    "lessons": [
      {
        "id": "guidance-overview",
        "title": "本ガイダンスの目的",
        "summary": "Web系IT業界で活躍するために必要な基礎知識と実践力を体系的に身につけるための教材です。",
        "content": [
          {
            "type": "p",
            "text": "本ガイダンスは、Web系IT業界への理解を深め、実際の開発現場で通用するスキルを段階的に身につけることを目的としています。開発手法やツール、業界の特徴など、基礎から実践までを一貫して学べる構成になっています。"
          }
        ]
      },
      {
        "id": "guidance-tools",
        "title": "今後の学習と実践について",
        "summary": "VS Code・GitHub・Dockerなどのツールを用いた実践的な開発演習を行います。",
        "content": [
          {
            "type": "p",
            "text": "本ガイダンスの後半では、これまでに紹介した開発ツールを実際に活用しながら、Webアプリケーション開発の流れを体験的に学んでいきます。VS Code を使ったコーディング、GitHub を使ったバージョン管理、Docker を使った開発環境の構築など、実務に直結するスキルを身につけることが目標です。"
          },
          {
            "type": "p",
            "text": "また、これらのツールは今後の実戦演習でも継続的に使用していきます。開発環境の整備からチーム開発、デプロイまで、一貫したツールチェーンを通じて、現場に近い形での学習を進めていきましょう。"
          },
          {
            "type": "ul",
            "items": [
              "VS Code：開発現場で最も使われているコードエディタ",
              "GitHub：ソースコードの共有とチーム開発の基盤",
              "Docker：再現性の高い開発環境の構築・運用",
              "これらのツールを活用してWeb開発の実戦演習を行う"
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
            開発フローとツールの紹介
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