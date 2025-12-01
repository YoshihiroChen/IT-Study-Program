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
    "key": "ai-consulting-overview",
    "title": "AIコンサルの業務内容と他コンサルとの違い",
    "lessons": [
      {
        "id": "what-is-ai-consulting",
        "title": "AIコンサルとは何か",
        "summary": "AIコンサルの定義と、単なる技術導入ではない“業務変革コンサル”としての本質を解説します。",
        "content": [
          {
            "type": "p",
            "text": "AIコンサル（AI Consulting）は、企業の業務プロセス・組織・データ活用戦略をベースに、AIを使ってどのように価値創出を最大化するかを設計するコンサルティング職種です。"
          },
          {
            "type": "p",
            "text": "単なる Chatbot 導入や LLM の実装ではなく、『AI をどう使えばビジネスインパクトが生まれるのか』を定義し、業務全体の最適化を支援する点が特徴です。"
          },
          {
            "type": "ul",
            "items": [
              "✓ AI 活用戦略の策定（短期・中期ロードマップ設計）",
              "✓ 業務プロセスの改善・自動化の企画",
              "✓ RAG や Multi-Agent を活用した業務変革デザイン",
              "✓ ROI（費用対効果）の分析と KPI 設定",
              "✓ AI ガバナンス（リスク・セキュリティ・権限設計）",
              "✓ 組織変革（研修・AIリテラシー育成・社内展開）"
            ]
          },
          {
            "type": "p",
            "text": "つまり AIコンサルは、“AIを作る”のではなく、“AIで業務を変革する”仕事です。"
          }
        ]
      },
      {
        "id": "ai-consulting-tasks",
        "title": "AIコンサルの具体的な業務内容",
        "summary": "AIコンサルが実際のプロジェクトで担う代表的な業務内容を整理します。",
        "content": [
          {
            "type": "p",
            "text": "AIコンサルの仕事は、大きく「分析 → 設計 → 導入支援 → 定着化」の 4 フェーズに分かれます。"
          },
          {
            "type": "ul",
            "items": [
              "① 事前分析（As-Is 分析）\n・既存の業務プロセスを可視化\n・無駄やボトルネックの特定\n・データ整備状況の調査",
              "② AI 活用シナリオの設計（To-Be 設計）\n・AI でどの業務を改善できるかを選定\n・Chatbot、RAG、Multi-Agent などの適用領域の検討\n・AI 導入による効果を定量化（ROI測定）",
              "③ プロトタイプ・PoC 支援\n・小規模導入で仮説検証\n・モデル選定（GPT、Claude、Gemini 等）\n・ナレッジベース（RAG）の構築方針設計",
              "④ 導入・定着化支援\n・組織向け AI 研修\n・AI ガバナンス策定\n・社内ルール（プロンプト管理、権限管理）の構築"
            ]
          },
          {
            "type": "p",
            "text": "特に重要なのは、AI 活用が“単発のツール導入”ではなく“全体最適の業務変革”になるように設計する点です。"
          }
        ]
      },
      {
        "id": "ai-vs-it-vs-dx",
        "title": "AIコンサル・ITコンサル・DXコンサルの違い",
        "summary": "IT コンサル、DX コンサルとの違いを構造的に整理し、志望理由に使える比較軸を示します。",
        "content": [
          {
            "type": "p",
            "text": "AIコンサルは IT コンサルや DX コンサルと似ていますが、扱うテーマ・得意領域・必要なスキルが明確に異なります。"
          },
          {
            "type": "p",
            "text": "以下の比較表に基づき、それぞれの役割の違いを理解しましょう。"
          },
          {
            "type": "ul",
            "items": [
              "【AIコンサル】\n・AI を使った業務最適化が中心\n・RAG、LLM、Multi-Agent など新技術の企画と導入\n・定量効果（ROI）を示す分析が重要\n・“業務の自動化・効率化”が目的\n",
              "【ITコンサル】\n・システム導入／IT 戦略の上流設計が中心\n・ERP、CRM、基幹システムの改善・刷新\n・ウォーターフォール型プロジェクトが多い\n・“ITを使った業務改善”が目的\n",
              "【DXコンサル】\n・企業全体のデジタル変革（経営改革）がテーマ\n・新規事業やデータ戦略まで含む広い領域\n・組織構造や文化まで改革\n・“デジタルで企業価値を最大化”が目的"
            ]
          },
          {
            "type": "p",
            "text": "簡単にまとめると次のようになります："
          },
          {
            "type": "ul",
            "items": [
              "AIコンサル：AI 活用 × 業務自動化の専門家",
              "ITコンサル：システム導入 × 業務改善の専門家",
              "DXコンサル：経営変革 × デジタル戦略の専門家"
            ]
          },
          {
            "type": "p",
            "text": "面接では『自分はどのタイプのコンサルに適性があるか』『なぜ AI なのか』を説明する際に、この比較軸が非常に有効です。"
          }
        ]
      }
    ]
  },
  {
    "key": "ai-consulting-multi-agent-case",
    "title": "AIコンサルの事例：Multi-Agent プロジェクト",
    "lessons": [
      {
        "id": "what-is-multi-agent",
        "title": "Multi-Agent とは何か",
        "summary": "Multi-Agent モデルの基本概念と、なぜ企業の業務改善に有効なのかを解説します。",
        "content": [
          {
            "type": "p",
            "text": "Multi-Agent（マルチエージェント）とは、複数の AI エージェントが役割分担しながら協調してタスクを実行する仕組みです。従来の「1つの AI モデルが全て対応する」方式では難しい複雑な業務を、複数の専門エージェントが分担して処理することで高い正確性と効率を実現できます。"
          },
          {
            "type": "p",
            "text": "各エージェントはそれぞれ固有の『役割（role）』『性格（persona）』『専門能力（tools）』を持っており、タスクに応じて協力しながら最適な回答や成果物を生み出します。"
          },
          {
            "type": "ul",
            "items": [
              "✓ Planner Agent（企画・分析担当）",
              "✓ Research Agent（情報収集担当）",
              "✓ Writer Agent（文章生成・整理担当）",
              "✓ Checker Agent（品質管理・ファクトチェック担当）",
              "✓ Executor Agent（具体的なツール操作やAPI実行担当）"
            ]
          },
          {
            "type": "p",
            "text": "このように Multi-Agent は AI 導入プロジェクトの中でも特に高度な領域であり、複雑な業務プロセスの自動化に向いています。"
          }
        ]
      },
      {
        "id": "case-background-1",
        "title": "プロジェクト背景（Before：導入前の課題）",
        "summary": "なぜ企業が Multi-Agent を導入する必要があったのか、背景と課題を整理します。",
        "content": [
          {
            "type": "p",
            "text": "本事例は、とある大企業の「社内ドキュメント作成業務」を対象としたプロジェクトです。資料作成・社内報告書・分析レポートなどの作成に、多大な工数が発生していました。"
          },
          {
            "type": "ul",
            "items": [
              "・資料作成に平均 4〜6 時間かかる",
              "・情報収集 → 要点整理 → 文章作成 → 校正を全て人手で実施",
              "・上長へのレビューが複数回発生し、工程が長期化",
              "・部門ごとにフォーマットや品質基準がバラバラ",
              "・AI チャットボットではタスクが多段階すぎて再現できない"
            ]
          },
          {
            "type": "p",
            "text": "企業は当初 ChatGPT の社内版を使っていましたが、単一の LLM では複雑な業務を一気通貫で処理することができず、業務効率化の効果が限定的でした。そこで、AIコンサルによる Multi-Agent 活用プロジェクトが始動しました。"
          }
        ]
      },
      {
        "id": "design-process",
        "title": "AIコンサルの設計プロセス（Analysis → To-Be 設計）",
        "summary": "業務分析から Multi-Agent 設計までのコンサルティングプロセスを解説します。",
        "content": [
          {
            "type": "p",
            "text": "AIコンサルは単にエージェントを作るのではなく、『どの業務をどう分解すれば AI が最大効果を発揮するか』を中心にプロジェクトを設計します。"
          },
          {
            "type": "p",
            "text": "本プロジェクトでは社員へのヒアリング・現場観察・業務棚卸しを行い、資料作成業務を以下の 5 工程に分解しました。"
          },
          {
            "type": "ul",
            "items": [
              "① 情報収集（調査）",
              "② 要点整理（分析）",
              "③ 文章生成（ライティング）",
              "④ ファクトチェック（品質管理）",
              "⑤ レポート整形（フォーマット化）"
            ]
          },
          {
            "type": "p",
            "text": "AIコンサルはこの工程に合わせて、次のような Multi-Agent を設計しました："
          },
          {
            "type": "ul",
            "items": [
              "・Research Agent：外部情報や社内データベースの検索を担当",
              "・Analysis Agent：収集情報を構造化し論点整理",
              "・Writer Agent：読みやすい文章へ変換",
              "・Checker Agent：事実確認・表現の調整・品質向上",
              "・Formatter Agent：指定フォーマットに合わせて整形"
            ]
          },
          {
            "type": "p",
            "text": "AIコンサルの役割は、これらの役割分担と業務フロー設計を行い、『どの工程をAIにどの程度任せるか』の最適化を行うことにあります。"
          }
        ]
      },
      {
        "id": "poc-and-implementation",
        "title": "PoC（実証検証）と導入フェーズ",
        "summary": "Multi-Agent が本当に現場で使えるのかを検証し、社内展開するまでの流れを説明します。",
        "content": [
          {
            "type": "p",
            "text": "分析と設計フェーズの後、AIコンサルは PoC を実施しました。ここでは以下の観点から検証を行います。"
          },
          {
            "type": "ul",
            "items": [
              "・Agent 同士の役割分担が正しく動作するか",
              "・誤情報（Hallucination）を防げるか",
              "・出力の品質が社員の基準を満たすか",
              "・作業工数が実際に削減されるか",
              "・既存の IT システムとの連携に問題がないか"
            ]
          },
          {
            "type": "p",
            "text": "PoC の結果、資料作成に必要な時間は平均 4〜6 時間 → 50〜90 分に削減され、品質ブレも大幅に減少しました。これにより本格導入が決定し、社内展開フェーズが開始されました。"
          },
          {
            "type": "p",
            "text": "導入後は AI リテラシー研修、利用ガイドラインの作成、プロンプト規則の策定、AI ガバナンスの整備など、AIコンサルが全体の定着化を支援しました。"
          }
        ]
      },
      {
        "id": "project-impact",
        "title": "プロジェクトの成果とビジネスインパクト",
        "summary": "実際に Multi-Agent 導入がどのような成果を出したのかを整理します。",
        "content": [
          {
            "type": "p",
            "text": "最終的に Multi-Agent プロジェクトは、企業に大きなビジネスインパクトをもたらしました。"
          },
          {
            "type": "ul",
            "items": [
              "・資料作成工数を 60〜80％ 削減",
              "・品質の標準化に成功（部署間のバラつきを解消）",
              "・新人でも一定品質の資料を作成可能に",
              "・社員の時間を“思考・意思決定”に集中させる文化改革",
              "・部門横断で Multi-Agent 活用が横展開"
            ]
          },
          {
            "type": "p",
            "text": "特に重要なのは、単なる自動化ではなく、『人がより価値の高い仕事に集中できる環境』が生まれた点です。これは AIコンサル の目的である“業務の付加価値最大化”に直結します。"
          }
        ]
      }
    ]
  },
  {
    "key": "ai-consulting-rag-case",
    "title": "AIコンサルの事例：RAG プロジェクト",
    "lessons": [
      {
        "id": "what-is-rag",
        "title": "RAG とは何か",
        "summary": "RAG（Retrieval-Augmented Generation）の仕組みと、企業での活用が急速に広がっている理由を解説します。",
        "content": [
          {
            "type": "p",
            "text": "RAG（Retrieval-Augmented Generation）とは、大規模言語モデル（LLM）に外部の知識ベースを組み合わせて、より正確で企業固有の回答を生成する仕組みです。LLM 単体では最新情報や社内データにアクセスできませんが、RAG を使えば“企業固有のナレッジ”に基づいた回答が可能になります。"
          },
          {
            "type": "p",
            "text": "RAG は次の 2 ステップで動作します："
          },
          {
            "type": "ul",
            "items": [
              "① Retrieval（検索）: 社内文書・マニュアル・FAQ などから関連情報を検索する",
              "② Generation（生成）: 検索結果をもとに LLM が回答や報告書を生成する"
            ]
          },
          {
            "type": "p",
            "text": "これにより企業は、ChatGPT では回答できない『社内固有の情報』をもとに、正確で一貫性のある応答を得ることができます。"
          },
          {
            "type": "p",
            "text": "RAG は AIコンサル案件の中でも最も導入効果が高く、特に問い合わせ対応や文書検索を必要とする部門で広く採用されています。"
          }
        ]
      },
      {
        "id": "case-background-2",
        "title": "プロジェクト背景（Before：導入前の課題）",
        "summary": "なぜ企業が RAG を必要としたのか、導入前の業務課題を整理します。",
        "content": [
          {
            "type": "p",
            "text": "本事例の対象企業は、社員数 5,000 名を超える大企業で、内部問い合わせ対応が深刻なボトルネックとなっていました。特に人事部門・法務部門・情シス部門に負担が集中し、月間 2,000 件を超える質問が寄せられていました。"
          },
          {
            "type": "ul",
            "items": [
              "・FAQ が複雑で見つけづらい",
              "・回答に社内規程や専門用語を含むため自動化が難しい",
              "・人事や法務担当者の負担が大きく、本来業務に集中できない",
              "・ChatGPT では企業固有の情報に回答できない（内部資料へのアクセス不可）",
              "・社員の問い合わせ対応にムラがあり、品質が安定しない"
            ]
          },
          {
            "type": "p",
            "text": "こうした背景から、“社内固有の情報に基づき正確に回答できる AI を導入したい”という要望が高まり、RAG プロジェクトが AIコンサル主導で開始されました。"
          }
        ]
      },
      {
        "id": "analysis-phase",
        "title": "業務分析（As-Is 分析）",
        "summary": "AIコンサルがまず行ったのは、問い合わせ対応業務の構造化と課題の可視化でした。",
        "content": [
          {
            "type": "p",
            "text": "AIコンサルは導入前の業務フローを詳細に分析し、問い合わせ対応プロセスを4段階に分解しました。"
          },
          {
            "type": "ul",
            "items": [
              "① 問い合わせ受付",
              "② 文書・規程の検索",
              "③ 回答案の作成",
              "④ 上長チェック（法務・人事の場合）"
            ]
          },
          {
            "type": "p",
            "text": "このうち『②検索』と『③回答案の作成』が大きな工数を占めており、担当者の 60〜70% の時間がここに使われていることが判明しました。"
          },
          {
            "type": "p",
            "text": "AIコンサルはこの業務フローを元に、RAG でどこまで自動化できるか、どのデータを検索対象にすべきかを具体的に設計していきました。"
          }
        ]
      },
      {
        "id": "design-phase",
        "title": "To-Be 設計（RAG アーキテクチャ設計）",
        "summary": "AIコンサルが RAG の仕組み・データ構造・検索方法をどのように設計したかを紹介します。",
        "content": [
          {
            "type": "p",
            "text": "RAG プロジェクトの要となるのは、“どのデータをどう検索し、どう LLM に渡すか”という設計部分です。AIコンサルは企業内部の全ドキュメントを調査し、検索対象を以下のように分類しました。"
          },
          {
            "type": "ul",
            "items": [
              "・社内規程（就業規則、休暇規定など）",
              "・人事 FAQ",
              "・法務マニュアル",
              "・システム利用マニュアル",
              "・問い合わせ過去ログ",
              "・部門別ローカルルール"
            ]
          },
          {
            "type": "p",
            "text": "次に、RAG で高品質な回答を得るためのデータ整備を行いました："
          },
          {
            "type": "ul",
            "items": [
              "✓ データの正規化・フォーマット統一",
              "✓ PDF のテキスト抽出とクリーニング",
              "✓ Chunk（文書分割）の最適化",
              "✓ Embedding（ベクトル化）モデルの選定",
              "✓ 権限管理（機密文書を検索対象に含めるか）"
            ]
          },
          {
            "type": "p",
            "text": "検索部分には Pinecone / Elasticsearch を使用し、LLM には GPT-4 系モデルを採用。これにより、企業固有の情報に基づいた高精度の回答生成が可能になりました。"
          }
        ]
      },
      {
        "id": "poc-phase-2",
        "title": "PoC（実証検証）",
        "summary": "RAG が現場で使える品質を満たしているかを検証します。",
        "content": [
          {
            "type": "p",
            "text": "AIコンサルは PoC の段階で次の観点を徹底的に検証しました。"
          },
          {
            "type": "ul",
            "items": [
              "・検索精度（関連文書を正しく取得できるか）",
              "・回答品質（社内基準を満たすか）",
              "・誤情報（Hallucination）の頻度",
              "・複雑な疑問への対応力（例：規程 × 例外条件）",
              "・部署別の利用ニーズへの適合性",
              "・問い合わせ対応時間の削減率"
            ]
          },
          {
            "type": "p",
            "text": "PoC の結果、回答精度は 87%、問い合わせ時間は 3〜5 分に短縮されるなど、明確な効果が測定されました。これにより、全社導入に向けた意思決定が行われました。"
          }
        ]
      },
      {
        "id": "implementation-phase",
        "title": "本番導入と定着化",
        "summary": "RAG を全社展開し、社員の業務に定着させるフェーズです。",
        "content": [
          {
            "type": "p",
            "text": "本番導入後、AIコンサルは定着化のための施策を多数実施しました。技術導入よりも、この“使われる仕組みづくり”が最重要ポイントとなります。"
          },
          {
            "type": "ul",
            "items": [
              "・社員向け AI 研修の実施",
              "・部門別の専用プロンプトテンプレート作成",
              "・AI ガバナンス・利用ルールの整備",
              "・操作マニュアル・FAQ の用意",
              "・人事/法務/情シス向けの効果測定 KPI の設計",
              "・継続的なデータ更新フローの構築"
            ]
          },
          {
            "type": "p",
            "text": "最終的に、問い合わせ対応の 60〜80% が RAG によって一部または全自動化され、人手による回答は例外ケースに限定されるようになりました。"
          }
        ]
      },
      {
        "id": "result-impact",
        "title": "最終成果とビジネスインパクト",
        "summary": "RAG 導入が企業にもたらした実際の効果をまとめます。",
        "content": [
          {
            "type": "p",
            "text": "RAG プロジェクトは、問い合わせ業務の負担を劇的に削減し、次のような成果を実現しました。"
          },
          {
            "type": "ul",
            "items": [
              "・問い合わせ対応の 60〜80% を自動化",
              "・回答の一貫性・正確性の大幅向上",
              "・担当者の業務負荷削減（1日 1〜2 時間の削減）",
              "・ナレッジ共有の仕組みの標準化",
              "・新人でも一定品質の回答が可能に",
              "・情報検索工数がほぼゼロに"
            ]
          },
          {
            "type": "p",
            "text": "RAG の導入は単なる省力化ではなく、『企業内の知識活用を最適化する仕組み』を構築した点で、AIコンサル案件の中でも非常に高い効果を持つプロジェクトです。"
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