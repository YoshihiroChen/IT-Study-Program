'use client';

import React, { useEffect, useMemo, useState } from 'react';

/**
 * 🐍 Python 練習ページ（LeetCode風）
 * - Pyodide を読み込み、ブラウザで Python を実行
 * - 各問題ごとにエディタにコードを書き、テストケースで採点（合格率でスコア）
 * - 完全クライアントサイド実装（Next.js のクライアントコンポーネント）
 */

// ==================== 型定義 ====================

type TestCase = {
  /** テスト名（UI 表示用） */
  name: string;
  /** Python 関数へ渡す引数（位置引数のみ対応） */
  args: any[];
  /** 期待される戻り値（JS 側で比較） */
  expected: any;
};

type Problem = {
  /** 一意 ID */
  id: string;
  /** タブに表示するタイトル */
  title: string;
  /** 問題文 */
  prompt: string;
  /** 受験者が実装すべき関数名（Python 側のシンボル名） */
  funcName: string;
  /** エディタに最初から表示するスターターコード */
  starter: string;
  /** 公開テストケース */
  tests: TestCase[];
  /**
   * 比較関数（省略時は deepEqual）。
   * PyProxy（Pyodide の Python オブジェクト参照）を受けるので、必要に応じて整形。
   */
  validator?: (output: any, expected: any) => boolean;
};

// ==================== 問題セット ====================

const PROBLEMS: Problem[] = [
  {
    id: 'c-to-f',
    title: '温度変換（摂氏→華氏）',
    prompt:
      '関数 c_to_f(c: float) -> float を実装しなさい。公式 F = C * 9/5 + 32 に基づいて摂氏を華氏に変換する。戻り値は浮動小数でよい。',
    funcName: 'c_to_f',
    starter: `# 関数 c_to_f(c: float) -> float を実装してください\n# 公式: F = C * 9/5 + 32\n# 例: c_to_f(0) == 32.0\nfrom typing import Union\n\ndef c_to_f(c: Union[int, float]) -> float:\n    # TODO: ここに処理を記述\n    return 0.0\n`,
    tests: [
      { name: '氷点', args: [0], expected: 32.0 },
      { name: '体温', args: [37], expected: 98.6 },
      { name: '沸点', args: [100], expected: 212.0 },
      { name: '負の温度', args: [-40], expected: -40.0 },
    ],
    validator: (out, exp) => Math.abs(Number(out) - exp) < 1e-6,
  },
  {
    id: 'odd-even-count',
    title: '奇数と偶数のカウント',
    prompt:
      '関数 count_odds_evens(nums: list[int]) -> tuple[int, int] を実装し、(奇数の数, 偶数の数) を返しなさい。',
    funcName: 'count_odds_evens',
    starter: `# (奇数の数, 偶数の数) を返す\nfrom typing import List, Tuple\n\ndef count_odds_evens(nums: List[int]) -> Tuple[int, int]:\n    # TODO: 実装\n    return 0, 0\n`,
    tests: [
      { name: '混在', args: [[1, 2, 3, 4]], expected: [2, 2] },
      { name: '全偶数', args: [[2, 4, 6, 8]], expected: [0, 4] },
      { name: '全奇数', args: [[1, 3, 5, 7, 9]], expected: [5, 0] },
      { name: '空リスト', args: [[]], expected: [0, 0] },
    ],
    validator: (out, exp) => {
      // Py 側の tuple などを配列風に受ける場合があるため、素直に 0/1 番目を比較
      const a0 = Array.isArray(out) ? out[0] : (out as any)[0];
      const a1 = Array.isArray(out) ? out[1] : (out as any)[1];
      return a0 === exp[0] && a1 === exp[1];
    },
  },
  {
    id: 'kaprekar-6174',
    title: 'カプレカの定数（6174）',
    prompt:
      '関数 kaprekar_steps(n: int) -> int を実装しなさい。4桁の数について、桁を降順・昇順に並べ差を取り続け、6174 に到達するまでの反復回数を返す。n=6174 の場合は 0。',
    funcName: 'kaprekar_steps',
    starter: `# 4桁で同一数字のみ（例: 1111）の入力は除外される前提。\n# テストは有効ケースのみ与えられる。\n\ndef kaprekar_steps(n: int) -> int:\n    # TODO: 実装\n    return 0\n`,
    tests: [
      { name: '3524', args: [3524], expected: 3 },  // 3524 -> 3087 -> 8352 -> 6174
      { name: '2111', args: [2111], expected: 5 },
      { name: '9831', args: [9831], expected: 7 },
      { name: '既に6174', args: [6174], expected: 0 },
    ],
  },
  {
    id: 'word-freq-topk',
    title: '単語出現頻度 Top-K',
    prompt:
      '関数 top_k_words(text: str, k: int) -> list[tuple[str,int]] を実装。大文字小文字・句読点を無視し、出現回数降順・同率は単語の辞書順昇順で並べ、上位 k 個を返す。',
    funcName: 'top_k_words',
    starter: `# 規則: 小文字化し、英字以外を区切りとみなす（正規表現）。\n# (-count, word) でソートし、先頭 k 個の (word, count) を返す。\nimport re\nfrom collections import Counter\nfrom typing import List, Tuple\n\ndef top_k_words(text: str, k: int) -> List[Tuple[str, int]]:\n    # TODO: 実装\n    return []\n`,
    tests: [
      {
        name: '単純ケース',
        args: ['Apple banana apple BANANA banana orange!', 2],
        expected: [ ['banana', 3], ['apple', 2] ],
      },
      {
        name: '同率ケース',
        args: ['a a b b c', 2],
        expected: [ ['a', 2], ['b', 2] ],
      },
      {
        name: '句読点処理',
        args: ['Hello, world! Hello... world?? hello;', 1],
        expected: [['hello', 3]],
      },
    ],
    validator: (out, exp) => {
      // Py の list[tuple[str,int]] -> JS 反映を素直にペア配列に変換して比較
      const toPairs = (v: any): [string, number][] => Array.from(v as any).map((x: any) => [String(x[0]), Number(x[1])]);
      const a = toPairs(out);
      if (a.length !== exp.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (a[i][0] !== exp[i][0] || a[i][1] !== exp[i][1]) return false;
      }
      return true;
    },
  },
  {
    id: 'fib-nth',
    title: 'フィボナッチ数列（第 n 項）',
    prompt:
      '関数 fib(n: int) -> int を実装。fib(0)=0, fib(1)=1 とし、以後 f(n)=f(n-1)+f(n-2)。計算量は O(n) とすること。',
    funcName: 'fib',
    starter: `def fib(n: int) -> int:\n    # TODO: 反復で線形時間に実装\n    return 0\n`,
    tests: [
      { name: '基礎0', args: [0], expected: 0 },
      { name: '基礎1', args: [1], expected: 1 },
      { name: 'n=10', args: [10], expected: 55 },
      { name: 'n=20', args: [20], expected: 6765 },
    ],
  },
];

// ==================== Pyodide ローダー ====================

type Pyodide = any;

declare global {
  interface Window {
    loadPyodide?: (options: any) => Promise<Pyodide>;
  }
}

/**
 * Pyodide を動的に読み込み、準備完了までの状態を管理するフック。
 */
function usePyodide() {
  const [pyodide, setPyodide] = useState<Pyodide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        setLoading(true);
        // スクリプト未読込なら CDN から取得
        if (!window.loadPyodide) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Pyodide の読み込みに失敗しました'));
            document.head.appendChild(script);
          });
        }
        const py = await window.loadPyodide!({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
        if (!cancelled) setPyodide(py);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  return { pyodide, loading, error };
}

// ==================== ユーティリティ ====================

function cx(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(' ');
}

function useProblemState() {
  // 各問題ごとのコードバッファ
  const [buffers, setBuffers] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const p of PROBLEMS) init[p.id] = p.starter;
    return init;
  });
  const setBuffer = (id: string, code: string) => setBuffers((m) => ({ ...m, [id]: code }));
  const resetBuffer = (id: string) => setBuffers((m) => ({ ...m, [id]: PROBLEMS.find((p) => p.id === id)!.starter }));
  return { buffers, setBuffer, resetBuffer };
}

/** Python の戻り値を JS 側で比較しやすい素の値に変換 */
function toPlain(v: any): any {
  if (v == null) return v;
  if (typeof v === 'object') {
    if (Array.isArray(v)) return v.map(toPlain);
    if ((v as any).toJs) {
      try {
        return (v as any).toJs({ dict_converter: Object.fromEntries });
      } catch {
        try {
          return (v as any).toJs();
        } catch {
          return String(v);
        }
      }
    }
  }
  return v;
}

/** 構造的な等価比較（配列・オブジェクト対応） */
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a && b && typeof a === 'object') {
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
      return true;
    }
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    for (const k of ka) if (!deepEqual(a[k], (b as any)[k])) return false;
    return true;
  }
  return false;
}

// ==================== テスト実行器 ====================

async function runTests(
  pyodide: Pyodide,
  problem: Problem,
  code: string
): Promise<{
  passed: number;
  total: number;
  details: { name: string; ok: boolean; got: any; expected: any; error?: string }[];
}> {
  // Python 側のグローバルをクリアしてクリーンな環境に
  pyodide.runPython('globals().clear()');

  // 1) 受験者コードを実行（関数定義）
  try {
    pyodide.runPython(code);
  } catch (e: any) {
    return {
      passed: 0,
      total: problem.tests.length,
      details: problem.tests.map((t) => ({
        name: t.name,
        ok: false,
        got: null,
        expected: t.expected,
        error: 'コードの実行時にエラーが発生しました: ' + (e?.message || String(e)),
      })),
    };
  }

  // 2) Python グローバルから目標関数を取得
  const func = pyodide.globals.get(problem.funcName);
  if (!func) {
    return {
      passed: 0,
      total: problem.tests.length,
      details: problem.tests.map((t) => ({
        name: t.name,
        ok: false,
        got: null,
        expected: t.expected,
        error: `関数 ${problem.funcName} が見つかりません。関数名が正しいか確認してください。`,
      })),
    };
  }

  // 3) 各テストを実行
  let passed = 0;
  const details: { name: string; ok: boolean; got: any; expected: any; error?: string }[] = [];

  for (const tc of problem.tests) {
    try {
      const out = func(...tc.args);
      const ok = problem.validator ? problem.validator(out, tc.expected) : deepEqual(toPlain(out), tc.expected);
      if (ok) passed++;
      details.push({ name: tc.name, ok, got: toPlain(out), expected: tc.expected });
    } catch (err: any) {
      details.push({ name: tc.name, ok: false, got: null, expected: tc.expected, error: err?.message || String(err) });
    }
  }

  return { passed, total: problem.tests.length, details };
}

// ==================== ページ本体 ====================

export default function PyCodingProblemsPage() {
  const { pyodide, loading, error } = usePyodide();
  const { buffers, setBuffer, resetBuffer } = useProblemState();
  const [active, setActive] = useState<string>(PROBLEMS[0].id);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Record<string, { passed: number; total: number; details: any[] }>>({});

  const current = useMemo(() => PROBLEMS.find((p) => p.id === active)!, [active]);

  async function onRun() {
    if (!pyodide) return;
    setRunning(true);
    try {
      const r = await runTests(pyodide, current, buffers[current.id]);
      setResults((m) => ({ ...m, [current.id]: r }));
    } finally {
      setRunning(false);
    }
  }

  function onReset() {
    resetBuffer(current.id);
    setResults((m) => ({ ...m, [current.id]: undefined as any }));
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* ヘッダー */}
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Python オンライン練習（Leet 風）</h1>
          <div className="text-sm opacity-80">
            Pyodide 状態：{loading ? '読み込み中…' : error ? '読み込み失敗' : '準備完了'}
          </div>
        </header>

        {/* 問題タブ */}
        <div className="mb-4 flex flex-wrap gap-2">
          {PROBLEMS.map((p) => {
            const r = results[p.id];
            const score = r ? Math.round((r.passed / r.total) * 100) : null;
            return (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className={
                  'rounded-full px-4 py-2 text-sm transition ' +
                  (active === p.id ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-neutral-800 hover:bg-neutral-700')
                }
                title={score != null ? `スコア ${score}%` : undefined}
              >
                {p.title}
                {score != null && (
                  <span className="ml-2 rounded-full bg-black/30 px-2 py-0.5 text-[10px]">{score}%</span>
                )}
              </button>
            );
          })}
        </div>

        {/* 問題パネル */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* 説明 */}
          <article className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            <h2 className="mb-2 text-lg font-medium">問題文</h2>
            <p className="whitespace-pre-wrap text-neutral-300">{current.prompt}</p>
            <div className="mt-4 rounded-xl bg-black/30 p-3 text-xs text-neutral-300">
              <p>
                関数シグネチャ：<code className="select-all">{current.funcName}(…)</code>
              </p>
              <p className="mt-1">公開テスト数：{current.tests.length}</p>
            </div>
          </article>

          {/* エディタ */}
          <article className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 p-0">
            <div className="flex items-center justify-between border-b border-neutral-800 px-3 py-2">
              <h3 className="text-sm font-medium">コードエディタ（Python）</h3>
              <div className="flex items-center gap-2">
                <button onClick={onReset} className="rounded-md bg-neutral-800 px-3 py-1.5 text-xs hover:bg-neutral-700">
                  初期コードに戻す
                </button>
                <button
                  onClick={onRun}
                  disabled={!pyodide || running || !!error}
                  className={cx(
                    'rounded-md px-3 py-1.5 text-xs',
                    running || !pyodide || !!error ? 'cursor-not-allowed bg-neutral-700' : 'bg-emerald-600 hover:bg-emerald-500'
                  )}
                >
                  {running ? '実行中…' : 'テストを実行'}
                </button>
              </div>
            </div>
            <textarea
              value={buffers[current.id]}
              onChange={(e) => setBuffer(current.id, e.target.value)}
              spellCheck={false}
              className="h-[380px] w-full resize-none bg-transparent p-3 font-mono text-sm leading-6 focus:outline-none"
            />
          </article>
        </section>

        {/* 結果 */}
        <section className="mt-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
          <h2 className="mb-3 text-lg font-medium">テスト結果</h2>
          {results[current.id] ? (
            <div>
              <div className="mb-3 text-sm text-neutral-300">
                合格 {results[current.id].passed} / {results[current.id].total}（スコア{' '}
                {Math.round((results[current.id].passed / results[current.id].total) * 100)}%）
              </div>
              <ul className="space-y-2">
                {results[current.id].details.map((d, i) => (
                  <li
                    key={i}
                    className={cx(
                      'rounded-xl border px-3 py-2 text-sm',
                      d.ok ? 'border-emerald-700 bg-emerald-900/20' : 'border-red-800 bg-red-900/20'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{d.name}</div>
                      <div className={d.ok ? 'text-emerald-400' : 'text-red-400'}>{d.ok ? '合格' : '不合格'}</div>
                    </div>
                    {!d.ok && (
                      <div className="mt-1 text-neutral-300">
                        <div className="break-words">
                          <span className="opacity-70">期待値：</span>
                          <code className="select-all"> {JSON.stringify(d.expected)}</code>
                        </div>
                        {d.error ? (
                          <div className="break-words">
                            <span className="opacity-70">エラー：</span>
                            <code className="select-all"> {d.error}</code>
                          </div>
                        ) : (
                          <div className="break-words">
                            <span className="opacity-70">実際の出力：</span>
                            <code className="select-all"> {JSON.stringify(d.got)}</code>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-sm text-neutral-400">まだ実行していません。「テストを実行」をクリックしてください。</div>
          )}
        </section>

        {/* ヒント */}
        <section className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 text-sm text-neutral-300">
          <h3 className="mb-2 font-medium">ヒント</h3>
          <ul className="list-disc pl-5">
            <li>問題文で指定された関数名・引数・戻り値の型に従って実装してください。</li>
            <li>実行環境はブラウザ上の Pyodide です（サーバ不要）。</li>
            <li>問題を増やす場合は <code>PROBLEMS</code> 配列に要素を追加するだけで拡張できます。</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
