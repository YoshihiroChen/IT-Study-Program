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
    "key": "se-recruit-flow",
    "title": "システムエンジニアの選考フロー",
    "lessons": [
      {
        "id": "step1-web-seminar",
        "title": "Step 1：会社説明会（WEB）",
        "summary": "企業理解の第一歩。オンラインでSIer業界や企業の事業内容を知る機会です。",
        "content": [
          {
            "type": "p",
            "text": "多くのSIer企業では、まずWEB会社説明会から選考が始まります。自社の事業領域、開発実績、働き方、研修制度などを紹介し、学生に業界理解を深めてもらう場です。"
          },
          {
            "type": "p",
            "text": "この段階では、質問コーナーを通して現場社員と交流できることもあります。興味を持った企業には早めにエントリーするのがポイントです。"
          },
          {
            "type": "ul",
            "items": [
              "企業理念・事業領域の説明",
              "社員登壇による仕事内容紹介",
              "質疑応答や座談会形式のセッション",
              "エントリー案内・今後の選考スケジュール共有"
            ]
          }
        ]
      },
      {
        "id": "step2-entry-sheet",
        "title": "Step 2：エントリーシート（ES）",
        "summary": "自己PR・志望動機・ガクチカなどを通じて、企業とのマッチ度を示す書類選考です。",
        "content": [
          {
            "type": "p",
            "text": "エントリーシート（ES）は、システムエンジニア志望の学生にとって最初の重要な選考関門です。志望動機や学生時代に力を入れたこと（ガクチカ）、チーム経験などを中心に、論理的かつ明確に記述することが求められます。"
          },
          {
            "type": "p",
            "text": "SIer企業では、「チームで協力して課題を解決した経験」や「ものづくり・ITへの関心の高さ」が特に評価されます。専門知識よりも、思考力とコミュニケーション力が重視される傾向があります。"
          },
          {
            "type": "ul",
            "items": [
              "志望動機・自己PR・ガクチカの記述",
              "チームワーク・課題解決の経験を明確に伝える",
              "論理的構成・わかりやすい文章表現",
              "提出前の誤字脱字チェックは必須"
            ]
          }
        ]
      },
      {
        "id": "step3-aptitude-test",
        "title": "Step 3：適性検査",
        "summary": "論理・数理・性格面を評価するオンラインテスト。SEとしての基礎的資質を確認します。",
        "content": [
          {
            "type": "p",
            "text": "多くのSIer企業では、Web上での適性検査（SPI・玉手箱・CABなど）を実施します。論理的思考力、数的処理能力、性格傾向などを測定することで、SEとしての基礎的素養を確認します。"
          },
          {
            "type": "p",
            "text": "特にCAB（Computer Aptitude Battery）はSE職特有の問題形式で、論理配列・暗号・命令表の理解などが問われます。事前の練習が非常に効果的です。"
          },
          {
            "type": "ul",
            "items": [
              "SPI・玉手箱・CABなどのWeb適性検査",
              "論理・数理・性格・集中力などの総合評価",
              "SE適性（論理構造理解・正確性）を重視",
              "事前対策本や模試サイトでの練習が有効"
            ]
          }
        ]
      },
      {
        "id": "step4-group-work",
        "title": "Step 4：グループワーク",
        "summary": "チームで課題に取り組み、協調性や論理性、発言力を評価される選考ステップです。",
        "content": [
          {
            "type": "p",
            "text": "グループワークでは、数名の学生がチームを組み、与えられた課題に対してディスカッションや発表を行います。テーマは「新しいITサービスの提案」「業務効率化の仕組みを考える」など、実務に近い内容が多いです。"
          },
          {
            "type": "p",
            "text": "評価のポイントは発言量ではなく、論理的に考え、他者の意見を整理しながらチームを前に進められるかどうかです。SIerでは特に協調性と課題解決力が重視されます。"
          },
          {
            "type": "ul",
            "items": [
              "テーマに沿った議論と結論の導出",
              "論理的思考力・傾聴力・協調性の評価",
              "ファシリテーション・要約・資料作成などの役割分担",
              "チーム成果物のプレゼンテーション"
            ]
          }
        ]
      },
      {
        "id": "step5-first-interview",
        "title": "Step 5：一次面接",
        "summary": "現場社員や人事担当との面接。人柄や基本的な志望動機を確認します。",
        "content": [
          {
            "type": "p",
            "text": "一次面接では、主に人事担当者や現場の若手エンジニアが面接官を務めます。エントリーシートの内容をもとに、志望動機・自己PR・学生時代の経験について掘り下げられます。"
          },
          {
            "type": "p",
            "text": "「なぜSEを志望するのか」「どのようにチームで動いたか」「困難をどう乗り越えたか」といった質問が多く、素直さや成長意欲、論理的な話し方が評価されます。"
          },
          {
            "type": "ul",
            "items": [
              "人柄・志望動機・コミュニケーション力の確認",
              "チーム経験や課題解決のエピソード",
              "質問例：「ITに興味を持ったきっかけは？」「将来どんなSEになりたい？」",
              "笑顔と丁寧な受け答えを意識する"
            ]
          }
        ]
      },
      {
        "id": "step6-final-interview",
        "title": "Step 6：最終面接",
        "summary": "役員や部門長との面接。企業との相性・入社意欲・キャリア観を総合的に判断します。",
        "content": [
          {
            "type": "p",
            "text": "最終面接では、企業の役員や部門責任者が面接官を務めます。形式は1対1または少人数面接で、学生の価値観やキャリア観、入社後の展望などを深く掘り下げます。"
          },
          {
            "type": "p",
            "text": "ここでは「この会社で働きたい理由」や「SEとしてどのように成長したいか」を明確に語ることが重要です。企業との相性・熱意・長期的な視点が重視されます。"
          },
          {
            "type": "ul",
            "items": [
              "企業理念への共感・価値観の一致を確認",
              "入社後のビジョン・キャリア志向の明確化",
              "質問例：「10年後どんなエンジニアになっていたいですか？」",
              "面接後に簡潔なお礼メールを送ると印象が良い"
            ]
          }
        ]
      },
      {
        "id": "step7-naitei",
        "title": "Step 7：内々定",
        "summary": "すべての選考を通過し、企業から正式な採用意向が伝えられる段階です。",
        "content": [
          {
            "type": "p",
            "text": "最終面接を通過すると、企業から「内々定」が通知されます。正式な内定通知は10月以降に出されるのが一般的ですが、多くの学生はこの段階で就職活動を終了します。"
          },
          {
            "type": "p",
            "text": "内々定後は、懇親会や面談を通じて会社理解を深める機会が設けられることもあります。早期に複数社から内々定を得た場合は、入社意思を慎重に検討することが大切です。"
          },
          {
            "type": "ul",
            "items": [
              "企業からの採用意向の伝達",
              "内定承諾・辞退の意思表示",
              "懇親会・入社前研修などの案内",
              "入社までの準備（書類・資格・ITスキル確認）"
            ]
          }
        ]
      }
    ]
  },
  {
    "key": "job-preparation",
    "title": "就職準備",
    "lessons": [
      {
        "id": "japanese-practice",
        "title": "日本語練習",
        "summary": "SE職の選考は技術よりもコミュニケーション力を重視。日本語運用能力はN1以上が前提であり、特に「聞く・話す」力が問われます。",
        "content": [
          {
            "type": "p",
            "text": "システムエンジニア（SE）の新卒採用では、面接やGD（グループディスカッション）などの選考において、日本語での円滑なコミュニケーション能力が最も重視されます。選考自体は「技術試験」ではなく、非技術的な人物評価が中心です。"
          },
          {
            "type": "p",
            "text": "そのため、求められる日本語力は単なるN1合格レベルをはるかに超え、ビジネスの場で自然に意見を述べ、質問を理解し、適切に返答できるレベルが必要です。特に「聞き取り（リスニング）」と「話す（スピーキング）」が合否を左右します。"
          },
          {
            "type": "ul",
            "items": [
              "ニュースや討論番組でリスニング練習を行う",
              "日本語での自己紹介・志望動機を何度も口に出して練習する",
              "面接想定質問に対して即答するトレーニングを行う",
              "会話のテンポ・間の取り方・相槌（あいづち）も意識する"
            ]
          }
        ]
      },
      {
        "id": "gd-practice",
        "title": "GD練習（グループディスカッション）",
        "summary": "留学生にとって最も難しい選考段階。全員が日本人の中で議論をリードするための準備が必要です。",
        "content": [
          {
            "type": "p",
            "text": "グループディスカッション（GD）は、複数の学生が一つのテーマについて話し合い、限られた時間で結論を導く選考形式です。多くのSIerでは協調性・論理性・発言力を同時に評価するため、非常に重要なステップとなります。"
          },
          {
            "type": "p",
            "text": "特に留学生の場合、参加者のほとんどが日本人であることが多く、日本語での議論スピードや会話の間合いに慣れていないと不利になりがちです。そのため、個人面接よりもGDの方が難易度が高いと感じる学生も多いです。"
          },
          {
            "type": "ul",
            "items": [
              "日本人学生との模擬GD練習を行う",
              "発言タイミングや話のまとめ方を学ぶ",
              "テーマ例：「新しいITサービスの提案」「効率化のための仕組みづくり」",
              "意見を述べるだけでなく、他人の意見を整理・補足する姿勢を示す"
            ]
          }
        ]
      },
      {
        "id": "industry-analysis",
        "title": "業界分析",
        "summary": "SIer業界の特徴を理解し、他業界との比較を通して志望度を高める準備を行います。",
        "content": [
          {
            "type": "p",
            "text": "業界分析は、面接での「なぜこの業界なのか」を説得力を持って説明するために欠かせません。SIer業界の役割・ビジネスモデル・職種構成を理解し、他のIT系業界との違いを明確に説明できるようにしましょう。"
          },
          {
            "type": "p",
            "text": "特に「Web系IT」や「ITコンサルティング」との比較は重要です。SIerは『顧客の課題解決を請け負う』モデルであり、Web系ITの『自社サービス開発』やITコンサルの『上流提案』とは立ち位置が異なります。"
          },
          {
            "type": "ul",
            "items": [
              "SIerの役割・構造・主要企業を整理する",
              "Web系IT・ITコンサルとの比較で自分の志向を明確化",
              "「なぜSIerで働きたいのか」を具体的に言語化する",
              "最新の業界動向（クラウド・DX・AI活用）も把握する"
            ]
          }
        ]
      },
      {
        "id": "company-analysis",
        "title": "企業分析",
        "summary": "同じ業界の中で、なぜその企業を志望するのかを明確にするための分析です。",
        "content": [
          {
            "type": "p",
            "text": "企業分析では、志望企業の特徴や強みを調べることで「なぜこの企業なのか」を具体的に語れるようにします。企業理念・主要顧客・代表的な開発事例・社員の働き方などを調べることが大切です。"
          },
          {
            "type": "p",
            "text": "特にSIerの場合、業界内での立ち位置（メーカー系・独立系・ユーザー系など）を踏まえて、同業他社との比較を行うと志望動機に深みが出ます。"
          },
          {
            "type": "ul",
            "items": [
              "企業理念・ミッション・価値観の把握",
              "主な顧客層・案件分野・代表的プロジェクトの確認",
              "同業他社（例：NTTデータ、TIS、SCSKなど）との比較",
              "志望動機を「自分との相性」「成長環境」の観点で語る"
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
            System Engineerの紹介
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