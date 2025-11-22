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
    "key": "case-study-introduction",
    "title": "第1章：Case Studyとは何か？",
    "lessons": [
      {
        "id": "what-is-case-study",
        "title": "1.1 Case Studyとは？",
        "summary": "Case Study（個別事例分析）は、就職活動において頻出する選考形式であり、応募者の論理性・問題解決力・ビジネス理解を総合的に評価するために用いられます。",
        "content": [
          {
            "type": "p",
            "text": "Case Study（ケーススタディ／個別事例分析）とは、コンサルティングや企画職などの選考でよく使用される面接形式です。面接官が実際のビジネス課題に近いシナリオを提示し、受験者は限られた時間内で論理的に問題分析を行い、説得力のある解決策を提案することが求められます。"
          }
        ]
      },
  
      {
        "id": "why-case-study",
        "title": "1.2 なぜ企業はCase面接を導入するのか？",
        "summary": "通常の質問よりも、応募者の“考える力”をより本質的に測定できるため、コンサルや企画職を中心に多くの企業が導入しています。",
        "content": [
          {
            "type": "p",
            "text": "企業がCase面接を採用するのは、一般的な面接（志望動機・ガクチカ）のみでは見抜きにくい“問題解決力”や“ビジネス理解度”を確実に評価するためです。"
          },
          {
            "type": "p",
            "text": "特に以下の能力を見極めるのに適しています："
          },
          {
            "type": "ul",
            "items": [
              "問題の本質を捉え、仮説を立てる力",
              "構造化された思考で分析を進める力",
              "数値を用いて合理的に推定する力（フェルミ推定を含む）",
              "結論から説明するコミュニケーション能力"
            ]
          }
        ]
      },
  
      {
        "id": "common-case-types",
        "title": "1.3 よく出るCaseの種類",
        "summary": "企業や業界によって形式は異なるが、多くのCaseは“原因分析”“改善提案”“新規参入の検討”などのパターンに分類できる。",
        "content": [
          {
            "type": "p",
            "text": "Case課題には様々な形式がありますが、実際の選考では以下のテーマが頻繁に出題されます："
          },
          {
            "type": "ul",
            "items": [
              "利益減少の要因分析と改善策の提案",
              "新市場への参入可否の検討",
              "価格設定（プライシング）に関する提案",
              "顧客離れ／成長停滞の原因分析",
              "オペレーション効率の改善案"
            ]
          }
        ]
      },
  
      {
        "id": "industries-using-case",
        "title": "1.4 Case Studyを利用する業界・企業",
        "summary": "Case面接は、問題解決力・業務理解が重視される職種や業界で多く採用されている。",
        "content": [
          {
            "type": "p",
            "text": "Case Study面接は、“課題発見”と“解決策の論理構築”が求められる業界・職種で特に使われます。代表的な例は以下の通りです："
          },
          {
            "type": "ul",
            "items": [
              "戦略／総合コンサルティング（BCG、Accenture、野村総合研究所など）",
              "新規事業企画（商社・IT企業の新規事業部門）",
              "商品企画／マーケティング（広告業界、消費財メーカー）",
              "外資系企業の一部選考（P&G、Amazon など）"
            ]
          },
          {
            "type": "p",
            "text": "全体として、Case Studyは文理どちらでも対応可能ですが、高度なロジカルシンキングとビジネス感覚が求められます。"
          }
        ]
      },
  
      {
        "id": "case-vs-gd",
        "title": "1.5 Case面接とGDの違い",
        "summary": "どちらも論理思考を必要とするが、重視点は大きく異なる。Caseは“分析の深さ”、GDは“チームでの推進力”を評価する。",
        "content": [
          {
            "type": "p",
            "text": "Case面接とGD（グループディスカッション）は混同されがちですが、目的と評価基準は大きく異なります。"
          },
          {
            "type": "ul",
            "items": [
              "GD：複数人で議論し、協働して結論へ導く。評価されるのは“議論の推進力・協調性”。",
              "Case：個人または小グループ形式で、分析の深さや論点整理能力が問われる。"
            ]
          },
          {
            "type": "p",
            "text": "つまりGDは“チーム型の議論力”、Caseは“個人の分析力と問題解決力”を見る試験です。"
          }
        ]
      },
  
      {
        "id": "case-vs-gd-proposal",
        "title": "1.6 Case StudyとGDの提案型課題の違い",
        "summary": "両者は“解決策を提案する”という点では似ているが、Caseは分析型、GDは創造型という根本的な違いがある。",
        "content": [
          {
            "type": "p",
            "text": "Case StudyとGD（特に提案型課題）は一見似ていますが、論理構造はまったく異なります。"
          },
          {
            "type": "p",
            "text": "【Case Study】"
          },
          {
            "type": "ul",
            "items": [
              "現状の課題を特定する",
              "原因を構造的に分解する",
              "仮説に基づいて分析を進める",
              "最適な解決策を導く"
            ]
          },
          {
            "type": "p",
            "text": "【GD（提案型課題）】"
          },
          {
            "type": "ul",
            "items": [
              "テーマに対する目標を設定する",
              "アイデアを発散させる（ブレスト）",
              "チームで合意形成しながらまとめる"
            ]
          },
          {
            "type": "p",
            "text": "簡単に言えば、Caseは“問題 → 分析 → 解決策”という流れで、GD提案型は“目標 → アイデア → 整理”という流れです。評価軸が異なるため、対策方法も別々に準備する必要があります。"
          }
        ]
      }
      
    ]
  },
  {
    "key": "case-study-basic-flow",
    "title": "第2章：Case面接の基本プロセス",
    "lessons": [
      {
        "id": "case-interview-types",
        "title": "2.1 Case面接のタイプ分類",
        "summary": "Case面接には口頭型・紙面型・小組型など複数形式があり、それぞれ必要とされる対応方法が異なる。本節では代表的な3つの形式を紹介する。",
        "content": [
          {
            "type": "p",
            "text": "Case面接は企業や職種によって形式が異なりますが、大きく分けると以下の3タイプに分類されます。"
          },
          {
            "type": "ul",
            "items": [
              "口頭型：面接官がその場で問題を口頭で提示し、受験者が即興で回答する形式。外資系コンサルで多く見られる。",
              "紙面型：面接官が資料や設問を紙面で提示し、受験者はメモを取りながら分析し口頭で説明する形式。野村総研（NRI）などに多い。",
              "小組型（グループ型）：複数名の受験者が一つのCaseを協力して分析・議論し、結論を導く形式。GDとCaseのハイブリッド型に近い。"
            ]
          }
        ]
      },
  
      {
        "id": "standard-flow",
        "title": "2.2 標準的なCase面接の進め方（個人面接）",
        "summary": "個人Case面接を突破するための基本プロセスを、ステップごとに整理して解説する。結論から逆算した論理的な流れが重要となる。",
        "content": [
          {
            "type": "p",
            "text": "以下は、一対一のCase面接における一般的な解法プロセスです。実際の選考の流れを想定しながら、常に“結論から逆算する姿勢”を意識しましょう。"
          },
  
          {
            "type": "p",
            "text": "① 問題の理解（聞き取り）"
          },
          {
            "type": "p",
            "text": "提示されたシナリオ・背景・課題を正確に理解します。必要に応じて質問し、何が問われているのか（目的）を明確化することが重要です。"
          },
  
          {
            "type": "p",
            "text": "② 構造の整理（アプローチ説明）"
          },
          {
            "type": "p",
            "text": "分析方針を示し、“どこから切り込むのか”を簡潔に説明します。3C、4P、ファネル分析など一般的なフレームワークの活用も効果的です。"
          },
  
          {
            "type": "p",
            "text": "③ 仮説の提示"
          },
          {
            "type": "p",
            "text": "初期仮説を置くことで、その後の分析の道筋が明確になります。仮説思考はCase面接で最も頻繁に評価される能力です。"
          },
  
          {
            "type": "p",
            "text": "④ 定量推定（フェルミ推定）"
          },
          {
            "type": "p",
            "text": "市場規模、売上、利用者数など、数字を扱う設問ではフェルミ推定を用いて合理的な数値を算出します。計算よりも“考え方の筋”が評価されます。"
          },
  
          {
            "type": "p",
            "text": "⑤ 解決策の提示"
          },
          {
            "type": "p",
            "text": "分析結果に基づき、実現可能性・効果・リスクを踏まえた施策を提示します。「なぜその施策が有効か」を説明することが重要です。"
          },
  
          {
            "type": "p",
            "text": "⑥ 結論のまとめ（総括）"
          },
          {
            "type": "p",
            "text": "最後に結論を再度整理し、論理の流れを簡潔にまとめます。結論 → 理由 → 補足 の順で話すと説得力が高まります。"
          }
        ]
      },
  
      {
        "id": "time-management",
        "title": "2.3 時間感覚の把握",
        "summary": "Case面接は10～30分が一般的であり、限られた時間内で“論理の骨格を作る”能力が求められる。本節では時間配分の目安を紹介する。",
        "content": [
          {
            "type": "p",
            "text": "Case面接の制限時間は企業によって異なりますが、一般的には10〜30分程度です。以下は、口頭型Case面接の代表的な時間配分モデルです。"
          },
          {
            "type": "ul",
            "items": [
              "第1分：問題の理解＋必要な澄清質問",
              "第2〜4分：構造化・分析の方向性提示・仮説設定",
              "第5〜10分：分析の深堀り・フェルミ推定などの計算",
              "第11分以降：施策提案・ロジック収束・結論提示"
            ]
          },
          {
            "type": "p",
            "text": "企業によって細部は異なりますが、“結論に向かって論理を積み上げていく態度”が常に評価されています。"
          }
        ]
      },
  
      {
        "id": "questioning",
        "title": "2.4 面接中に質問しても良いのか？",
        "summary": "Case面接では適切な質問が高く評価される。情報探索力・分析構造力を示すため、必要な質問はむしろ積極的に行うべきである。",
        "content": [
          {
            "type": "p",
            "text": "Case面接では、必要に応じて面接官へ質問することが可能であり、むしろ適切な質問は“論点整理能力”と“情報探索力”を示すために有効です。"
          },
          {
            "type": "p",
            "text": "以下は適切な質問例です："
          },
          {
            "type": "ul",
            "items": [
              "例1：「価格設定の自由度はどの程度ありますか？」",
              "例2：「顧客ターゲットは個人顧客でしょうか、それとも法人でしょうか？」",
              "例3：「利益率やコスト構造に関する追加データはありますか？」"
            ]
          },
          {
            "type": "p",
            "text": "ただし、質問に頼りすぎたり、論点と関係のない細かい質問を連発するのは逆効果です。Case面接の主戦場は“自身の仮説と構造的な考え方”である点を忘れないようにしましょう。"
          }
        ]
      }
    ]
  },
  {
    "key": "food-company-overseas-case",
    "title": "第3章：食品メーカーの海外展開戦略 — 超詳細ケース面接シミュレーション",
    "lessons": [
      {
        "id": "case-setting",
        "title": "3.1 ケース設定",
        "summary": "日本の即席麺メーカーA社が海外展開を検討するケースの背景と目的を整理する。",
        "content": [
          {
            "type": "p",
            "text": "本章では、日本の即席麺メーカーA社が海外市場への進出を検討するケースを題材に、実際のコンサルティング会社で行われるケース面接に近い形式で分析を進めていきます。高い臨場感の中で、構造化思考やフェルミ推定、優先順位付けなど、ケース面接に求められる思考プロセスを体験できます。"
          },
          {
            "type": "p",
            "text": "A社は国内即席麺市場で高いシェアを有しており、今後3年間で東南アジアおよび北米市場への参入を計画しています。検討すべき主なテーマは以下の通りです："
          },
          {
            "type": "ul",
            "items": [
              "ターゲット市場の優先順位付け",
              "参入方式（合弁・直販・OEM）",
              "現地向けの商品ローカライズ方針",
              "投資回収期間の見積もり"
            ]
          }
        ]
      },
  
      {
        "id": "interview-flow",
        "title": "3.2 面接プロセスと役割",
        "summary": "ケース面接の進行形式・役割設定・評価ポイントを解説する。",
        "content": [
          {
            "type": "p",
            "text": "総面接時間：約30分"
          },
          {
            "type": "p",
            "text": "【登場人物】"
          },
          {
            "type": "ul",
            "items": [
              "I＝Interviewer（面接官）",
              "C＝Candidate（学生）"
            ]
          },
          {
            "type": "p",
            "text": "【主な評価ポイント】"
          },
          {
            "type": "ul",
            "items": [
              "構造化された思考プロセス",
              "フェルミ推定による数量感の把握",
              "仮説思考と検証の流れ",
              "市場・競合・実行可能性の評価力",
              "理由一貫性と結論の納得感（費用対効果含む）"
            ]
          }
        ]
      },
  
      {
        "id": "full-simulation",
        "title": "3.3 ケース面接シミュレーション（約30ターン、全日本語）",
        "summary": "実際のコンサル会社さながらの面接対話を再現した超詳細シミュレーション。",
        "content": [
          {
            "type": "p",
            "text": "以下は、A社の海外展開戦略をテーマとした、実際のケース面接に近い対話式シミュレーションです。学生（C）がどのように思考し、どのように応答するか、その流れを全て日本語で約30ターン分再現しています。"
          },
          { "type": "p", "text": "I01：それではケースを始めましょう。A社という即席麺メーカーが海外展開を検討しています。あなたがコンサルタントとして、進出先の候補や戦略を提案してください。" },
          { "type": "p", "text": "C01：はい、よろしくお願いします。まず目的を確認させていただきたいのですが、海外展開のゴールは売上拡大でしょうか？それともブランド認知向上も含まれますか？" },
          { "type": "p", "text": "I02：主な目的は売上と利益の拡大ですが、ブランド認知も一応の目的としています。" },
          { "type": "p", "text": "（Cの思考：売上＋ブランドか。これを軸に進出先を考えよう…）" },
          { "type": "p", "text": "C02：ありがとうございます。では、進出先を選ぶために、市場規模と自社製品との相性をざっくり見ていきたいと思います。" },
          { "type": "p", "text": "I03：はい、ではどの国から検討しますか？" },
          { "type": "p", "text": "C03：東南アジアが思い浮かびました。例えばインドネシアやタイはラーメン消費が多そうな印象です。" },
          { "type": "p", "text": "I04：なぜそう思いますか？" },
          { "type": "p", "text": "C04：インドネシアは人口も多く、物価が安く即席麺が日常的に食べられているイメージがあります。" },
          { "type": "p", "text": "（Cの思考：詳しくないけど庶民食なら需要ありそう…）" },
          { "type": "p", "text": "I05：他に候補はありますか？" },
          { "type": "p", "text": "C05：北米も考えました。アジア食品ブームもありますし、ラーメン専門店も人気です。" },
          { "type": "p", "text": "I06：では、それぞれの市場規模をざっくり比較してみてください。" },
          { "type": "p", "text": "C06：はい…。東南アジアは約6億人で、都市部中間層が3割とすると2億人。週1回即席麺を食べるとすれば、年間100億食規模になります。" },
          { "type": "p", "text": "C07：北米は人口3.5億人ですが、ラーメンを定期的に食べる人は1割程度と仮定すると3500万人。月2回食べると年間8億食ほどになります。" },
          { "type": "p", "text": "（Cの思考：大まかな規模感は伝わるはず…）" },
          { "type": "p", "text": "I07：市場の魅力度以外に検討すべき点はありますか？" },
          { "type": "p", "text": "C08：競合ですね…東南アジアは現地ブランドが多く、価格競争になる可能性があります。" },
          { "type": "p", "text": "C09：一方で北米は韓国・日本の高価格帯が先行しており、A社の中価格帯商品は差別化しやすいとも思います。" },
          { "type": "p", "text": "I08：なるほど。A社製品の特徴は何ですか？" },
          { "type": "p", "text": "C10：無添加でスープが本格的、日本の味がそのまま楽しめる点が強みです。" },
          { "type": "p", "text": "（Cの思考：健康志向の層に刺さりそう…）" },
          { "type": "p", "text": "I09：東南アジアと北米、それぞれの実行上の難しさは？" },
          { "type": "p", "text": "C11：東南アジアはインフラ・物流課題、ハラール認証の必要性があるかもしれません。" },
          { "type": "p", "text": "C12：北米は物流は整備されていますが、参入コストが高く、販促や販路開拓が課題です。" },
          { "type": "p", "text": "I10：両者を踏まえて、どちらを優先進出すべきだと思いますか？" },
          { "type": "p", "text": "C13：悩ましいですが、私は北米を優先すべきと考えます。ブランド力が活かせ、健康志向の需要にも合致します。" },
          { "type": "p", "text": "（Cの思考：東南アジアはシェア獲得は早いかもしれないが…）" },
          { "type": "p", "text": "I11：理由を詳しく説明してください。" },
          { "type": "p", "text": "C14：北米は客単価が高く、収益性が良い可能性があります。D2C活用で流通マージン削減も見込めます。" },
          { "type": "p", "text": "I12：D2Cについてもう少し説明できますか？" },
          { "type": "p", "text": "C15：公式ECで販売すれば、仲介コストが減り、顧客データの取得にも繋がります。" },
          { "type": "p", "text": "I13：東南アジア市場はどう位置づけますか？" },
          { "type": "p", "text": "C16：将来の第2ステップとして位置づけ、まず北米で収益基盤を作る方針が良いと思います。" },
          { "type": "p", "text": "I14：では、提案を1分でまとめてください。" },
          { "type": "p", "text": "C17：A社はまず北米進出を優先すべきです。客単価が高くブランド価値を活かしやすいためです。D2Cも併用し効率的に販売します。東南アジアは成長市場として2〜3年後に参入を狙うべきです。" },
          { "type": "p", "text": "I15：ありがとうございました。ケースは以上です。" },
          { "type": "p", "text": "（Cの思考：まとめは悪くなかったけど、数値の精度はもっと鍛えたい…）" }
        ]
      }
    ]
  },
  
  {
    "key": "cafe-sales-improvement-case",
    "title": "第4章：カフェチェーンの売上改善施策 — 超詳細ケース面接シミュレーション",
    "lessons": [
      {
        "id": "cafe-case-setting",
        "title": "4.1 ケース設定",
        "summary": "全国展開するカフェチェーンA社が、既存店舗の売上停滞という課題に直面している状況を整理する。",
        "content": [
          {
            "type": "p",
            "text": "本章では、日本全国に店舗を展開するカフェチェーンA社の売上改善をテーマに、実際のコンサルティング会社のケース面接に近い形式でシミュレーションを行います。「業績が伸び悩んでいる店舗の売上をどう立て直すか」という典型的な経営課題に対して、コンサルタントとしてどのように提案していくかを疑似体験できます。"
          },
          {
            "type": "p",
            "text": "A社は日本国内に約300店舗を有するカフェチェーンブランドです。近年、消費者のライフスタイルの変化や競合激化の影響を受け、既存店舗の月次売上が横ばい状態となっています。A社はコンサルティングファームに対し、具体的かつ実行可能な売上改善施策の提案を求めています。"
          }
        ]
      },
      {
        "id": "cafe-interview-flow",
        "title": "4.2 面接プロセスと役割",
        "summary": "ケース面接の進行時間、登場人物、評価される観点を整理する。",
        "content": [
          {
            "type": "p",
            "text": "【総所要時間】約30分"
          },
          {
            "type": "p",
            "text": "【登場人物】"
          },
          {
            "type": "ul",
            "items": [
              "I＝Interviewer（面接官）",
              "C＝Candidate（学生・受験者）"
            ]
          },
          {
            "type": "p",
            "text": "【主な評価ポイント】"
          },
          {
            "type": "ul",
            "items": [
              "問題の構造化（どのように論点を整理するか）",
              "売上の因数分解（客数×客単価）とボトルネックの特定力",
              "施策の優先度付け・具体性・実現可能性",
              "費用対効果を意識した提案になっているか",
              "結論と理由の一貫性・説明のわかりやすさ"
            ]
          }
        ]
      },
      {
        "id": "cafe-full-simulation",
        "title": "4.3 ケース面接シミュレーション（全日本語・約30ターン）",
        "summary": "全国カフェチェーンA社の売上改善をテーマにした詳細なケース面接対話シミュレーション。",
        "content": [
          {
            "type": "p",
            "text": "以下は、カフェチェーンA社の売上改善をテーマにしたケース面接の模擬対話です。受験者（C）がどのように状況を整理し、仮説を立て、施策に落とし込んでいくかを、面接官（I）とのやり取りを通じて追体験できます。"
          },
          {
            "type": "p",
            "text": "I01：それではケースを始めましょう。A社という全国展開のカフェチェーンが売上の停滞に直面しています。あなたはコンサルタントとして、売上を伸ばすための施策を提案してください。"
          },
          {
            "type": "p",
            "text": "C01：よろしくお願いします。まず確認ですが、売上改善のゴールは既存店舗の売上増加でしょうか？それとも新規出店やブランド戦略も含まれますか？"
          },
          {
            "type": "p",
            "text": "I02：基本的には既存店舗の売上拡大を主目的としています。新規出店は現時点では考えていません。"
          },
          {
            "type": "p",
            "text": "（Cの思考：新規ではなく、既存店舗の売上をどう改善するかが中心か…）"
          },
          {
            "type": "p",
            "text": "C02：ありがとうございます。では売上を因数分解すると、来店客数×客単価という構造になりますが、どちらに課題があるとお考えですか？"
          },
          {
            "type": "p",
            "text": "I03：現時点では両方に改善の余地があると思っています。"
          },
          {
            "type": "p",
            "text": "C03：承知しました。まず客数に関して、直近の来店者数の推移データはありますか？"
          },
          {
            "type": "p",
            "text": "I04：2020年以降、平日昼間の来店が減少し、週末は横ばいです。"
          },
          {
            "type": "p",
            "text": "C04：つまり、コロナ以降のリモートワークの影響で、平日のビジネス客が減少していると推測されますね。"
          },
          {
            "type": "p",
            "text": "I05：その通りです。"
          },
          {
            "type": "p",
            "text": "C05：では、ターゲットを平日のビジネス層以外に広げる施策を検討する必要があります。"
          },
          {
            "type": "p",
            "text": "I06：具体的にはどういう層を想定しますか？"
          },
          {
            "type": "p",
            "text": "C06：例えば、主婦層や学生、在宅ワーカーなどが考えられます。"
          },
          {
            "type": "p",
            "text": "I07：では、その層をどう取り込んでいくか？"
          },
          {
            "type": "p",
            "text": "C07：一つは平日限定のランチセットや学割プランの導入です。もう一つはWi-Fi環境や電源席を拡充し、作業用途に特化したゾーニングを行うことです。"
          },
          {
            "type": "p",
            "text": "I08：それによって売上はどれくらい増えると見込んでいますか？"
          },
          {
            "type": "p",
            "text": "C08：仮に1店舗あたり平日の利用者が20人増え、1人あたり500円使うとすると、日1万円×20営業日＝月20万円、300店で月6,000万円規模の押し上げになります。"
          },
          {
            "type": "p",
            "text": "（Cの思考：ロジックは大丈夫。次は客単価の側面も見ておこう）"
          },
          {
            "type": "p",
            "text": "C09：次に客単価についてですが、季節限定ドリンクやサイドメニューによるアップセルは実施されていますか？"
          },
          {
            "type": "p",
            "text": "I09：はい、限定商品は月1～2種類程度出していますが、そこまで売上インパクトは大きくないですね。"
          },
          {
            "type": "p",
            "text": "C10：そうですか。ならば、例えばスイーツのセットメニュー化や、ポイント制度による購入頻度の向上なども検討の余地があります。"
          },
          {
            "type": "p",
            "text": "I10：それらの費用対効果についてどう考えますか？"
          },
          {
            "type": "p",
            "text": "C11：セットメニュー化は既存商品を組み合わせるだけなのでコストは抑えられ、客単価上昇が見込めます。ポイント制度は中長期的にリピーター増加に繋がるため、初期投資とのバランスを取りつつ段階的に導入するのが有効だと考えます。"
          },
          {
            "type": "p",
            "text": "I11：では、あなたの考える優先施策を3つに絞ってください。"
          },
          {
            "type": "p",
            "text": "C12：第一に平日客層への訴求（ランチセット、Wi-Fi強化）、第二にセットメニュー導入による客単価上昇、第三にポイント制度導入によるリピート促進です。"
          },
          {
            "type": "p",
            "text": "I12：いいですね。それでは1分でまとめてください。"
          },
          {
            "type": "p",
            "text": "C13：はい。A社の売上改善に向けては、平日利用者の増加を図るためのランチメニューや作業環境の強化、さらに客単価を高めるセット商品の導入、そして長期的にロイヤルカスタマーを増やすためのポイント制度導入が有効です。これらを段階的に実施することで、売上拡大が期待できます。"
          },
          {
            "type": "p",
            "text": "I13：ありがとうございました。以上でケースは終了です。"
          },
          {
            "type": "p",
            "text": "（Cの思考：流れは悪くなかったけど、もう少し数字感を練っておけばよかった…）"
          }
        ]
      }
    ]
  },
  {
    "key": "consulting-thinking-frameworks",
    "title": "コンサル思考の型を身につける — フレームワーク実戦演習編",
    "lessons": [
      {
        "id": "common-frameworks",
        "title": "5.1 よく使われる分析フレームワークと活用事例",
        "summary": "ケース面接や実務で頻出する代表的な分析フレームワークを整理し、各フレームワークの考え方と実務での使用例を示します。",
        "content": [
          {
            "type": "p",
            "text": "本章では、ケース面接・業務の両方で高頻度で使われる代表的な分析フレームワークを紹介し、構造的に物事を整理するための“基本動作”を身につけることを目的とします。これらのフレームワークを使いこなすことで、問題の切り口が明確になり、説明の説得力が大幅に向上します。"
          },
  
          {
            "type": "p",
            "text": "① 因数分解（例：売上＝客数×客単価）"
          },
          {
            "type": "p",
            "text": "ターゲットとなる指標を構成要素に分解することで、どこにボトルネックがあるのかを特定しやすくするフレームワークです。"
          },
          {
            "type": "p",
            "text": "【使用例】あるコンビニで客数は横ばいだが売上が減少。因数分解すると客単価の下落が主因で、特に飲料・タバコの販売が大幅減少していた。そこで商品陳列の改良と高単価のセット商品の導入を提案し、売上が改善した。"
          },
  
          {
            "type": "p",
            "text": "② 3C分析（Customer, Competitor, Company）"
          },
          {
            "type": "p",
            "text": "顧客・競合・自社の3つの視点から市場構造を整理し、戦略立案の初期段階で用いられるフレームワークです。"
          },
          {
            "type": "p",
            "text": "【使用例】ある文房具ブランドが売上停滞。3C分析により、顧客ニーズがサステナブル商品へ移行、競合は既に環境配慮ラインを展開、自社は該当製品がないことが判明。新シリーズ開発とブランド再定義を提案した。"
          },
  
          {
            "type": "p",
            "text": "③ 4P分析（Product, Price, Place, Promotion）"
          },
          {
            "type": "p",
            "text": "マーケティング戦略の立案・改善に用いる基本フレームワーク。"
          },
          {
            "type": "p",
            "text": "【使用例】新発売の飲料商品が不調。4Pで見ると、商品（味）は好評だが、価格が高い、店頭で目立たない、宣伝不足、という問題が判明。価格調整と試飲プロモーション強化により売上が回復した。"
          },
  
          {
            "type": "p",
            "text": "④ MECE（Mutually Exclusive, Collectively Exhaustive）"
          },
          {
            "type": "p",
            "text": "「抜け漏れなく、重複なく」問題を分類するための基礎原則。"
          },
          {
            "type": "p",
            "text": "【使用例】ECユーザー離脱の原因分析をする際、「サイトが使いにくい・価格が高い・配送が遅い・忙しい」などの分類は重複・不完全。MECEに沿って「機能面・価格面・UX面・競合面」の4つに整理すると構造が明確になった。"
          },
  
          {
            "type": "p",
            "text": "⑤ フェルミ推定（数量を仮定と分解で推計する手法）"
          },
          {
            "type": "p",
            "text": "情報が少ない状況で、合理的な仮定から数量を推計する技法。"
          },
          {
            "type": "p",
            "text": "【使用例】カフェチェーンがアプリ開発を検討。来店客100万人のうち20％がスマホ注文、週2回使用すると想定 → 月間アクティブユーザーは約80万人と推計。"
          },
  
          {
            "type": "p",
            "text": "⑥ SWOT分析（Strengths, Weaknesses, Opportunities, Threats）"
          },
          {
            "type": "p",
            "text": "内部要因（強み・弱み）と外部要因（機会・脅威）を整理して、事業の方向性を評価。"
          },
          {
            "type": "p",
            "text": "【使用例】アパレルブランドが中国市場参入を検討。デザイン力と認知度は強み、供給網は弱点。中産階級成長が機会、ローカルブランド台頭が脅威。SWOTから段階的参入戦略を策定。"
          },
  
          {
            "type": "p",
            "text": "⑦ バリューチェーン分析（Value Chain）"
          },
          {
            "type": "p",
            "text": "企業活動を細分化し、どの工程がどのくらい価値を生んでいるかを整理する分析手法。"
          },
          {
            "type": "p",
            "text": "【使用例】家電メーカーの利益低下を分析すると、生産工程の効率性低下とアフターサービスの高コストが要因。生産の自動化とサービス外注化を提案し、コスト削減に成功。"
          },
  
          {
            "type": "p",
            "text": "⑧ PES分析（Politics, Economy, Society）"
          },
          {
            "type": "p",
            "text": "政策・経済・社会の観点からマクロ環境を整理するフレームワーク。"
          },
          {
            "type": "p",
            "text": "【使用例】健康食品ブランドが高齢者向け市場を検討。政策（健康寿命延伸）、経済（高齢者の安定した購買力）、社会（未病管理の注目度）により市場の魅力度を評価し、シニア特化ラインの開発を決定。"
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
            ケーススタディの学習
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