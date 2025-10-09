'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * 🐍 Python 練習ページ（LeetCode風）+ 昼夜テーマ切替
 * - Pyodide を読み込み、ブラウザで Python を実行
 * - 各問題に対してコードを記述し、公開テストで採点（合格率でスコア表示）
 * - 右上のボタンで ライト/ダーク を切替（localStorage に保存）
 */

// ==================== 型定義 ====================

// 放在文件顶部 import 后、其它代码之前
const NL = '\n'; // 统一使用的换行符（防止 '\n' 被误改成真实换行）


type TestCase = {
  name: string; // テスト名（UI 表示用）
  args: any[]; // Python 関数へ渡す引数（位置引数）
  expected: any; // 期待される戻り値（JS で比較）
};

type Problem = {
  id: string; // 一意 ID（タブ切替用）
  title: string; // タブに表示するタイトル
  prompt: string; // 問題文
  funcName: string; // 受験者が実装すべき関数名（Python 名）
  starter: string; // スターターコード
  tests: TestCase[]; // 公開テスト
  validator?: (output: any, expected: any) => boolean; // カスタム比較
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
      { name: '3524', args: [3524], expected: 3 }, // 3524 -> 3087 -> 8352 -> 6174
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
      { name: '単純ケース', args: ['Apple banana apple BANANA banana orange!', 2], expected: [['banana', 3], ['apple', 2]] },
      { name: '同率ケース', args: ['a a b b c', 2], expected: [['a', 2], ['b', 2]] },
      { name: '句読点処理', args: ['Hello, world! Hello... world?? hello;', 1], expected: [['hello', 3]] },
    ],
    validator: (out, exp) => {
      const toPairs = (v: any): [string, number][] => Array.from(v as any).map((x: any) => [String(x[0]), Number(x[1])]);
      const a = toPairs(out);
      if (a.length !== exp.length) return false;
      for (let i = 0; i < a.length; i++) if (a[i][0] !== exp[i][0] || a[i][1] !== exp[i][1]) return false;
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

function usePyodide() {
  const [pyodide, setPyodide] = useState<Pyodide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        setLoading(true);
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
    return () => { cancelled = true; };
  }, []);

  return { pyodide, loading, error };
}

// ==================== テーマ（昼/夜）管理 ====================

type Theme = 'light' | 'dark';

function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>('dark');

  // 初期化：localStorage or OS 設定
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('pyproblems-theme') as Theme | null) : null;
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
      return;
    }
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  // 変更時に保存
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('pyproblems-theme', theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  return [theme, toggle];
}

// ==================== ユーティリティ ====================

function cx(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(' ');
}

function useProblemState() {
  const [buffers, setBuffers] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const p of PROBLEMS) init[p.id] = p.starter;
    return init;
  });
  const setBuffer = (id: string, code: string) => setBuffers((m) => ({ ...m, [id]: code }));
  const resetBuffer = (id: string) => setBuffers((m) => ({ ...m, [id]: PROBLEMS.find((p) => p.id === id)!.starter }));
  return { buffers, setBuffer, resetBuffer };
}

/**
 * スターターコードからインデント幅（スペース数）を推定
 * 例: 最初に見つかったインデントの最小幅（2 か 4 が多い）。見つからなければ 4。
 */
// ===== 修正版：从 starter 推测缩进宽度 =====
function detectIndentFromStarter(text: string): string {
  const lines = text.split(NL);
  let min: number | null = null;
  for (const ln of lines) {
    if (!ln.trim()) continue; // 空行は無視
    const m = ln.match(/^ +/); // 先頭スペース
    if (m) {
      const n = m[0].length;
      if (n > 0 && (min === null || n < min)) min = n;
    }
  }
  // 先に null を排除して TS の警告をなくす
  if (min === null) {
    return ' '.repeat(4);
  }
  const size = min % 4 === 0 ? 4 : (min % 2 === 0 ? 2 : min);
  return ' '.repeat(size);
}


/**
 * テキストエリアで Tab / Shift+Tab によるインデントを実現
 */
// ===== 修正版：Tab/Shift+Tab 缩进处理（全部使用 NL）=====
function handleEditorKeyDown(
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  indent: string,
  value: string,
  setValue: (v: string) => void
) {
  if (e.key !== 'Tab') return;
  e.preventDefault();
  const el = e.currentTarget;
  const start = el.selectionStart ?? 0;
  const end = el.selectionEnd ?? 0;

  const before = value.slice(0, start);
  const after = value.slice(end);

  // 行頭〜行末のインデックス（使用するのは NL）
  const lineStart = before.lastIndexOf(NL) + 1; // 先頭行なら 0
  const lineEndIndex = value.indexOf(NL, end);
  const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;

  const affected = value.slice(lineStart, lineEnd);
  const isMultiLine = affected.includes(NL) || start !== end; // 複数行 or 範囲選択
  const isShift = e.shiftKey;

  if (isMultiLine) {
    const lines = affected.split(NL);
    if (isShift) {
      // 逆インデント
      const removed = lines.map((ln) => (ln.startsWith(indent) ? ln.slice(indent.length) : ln)).join(NL);
      const newValue = value.slice(0, lineStart) + removed + value.slice(lineEnd);
      const removedCount = lines.reduce(
        (acc, ln) => acc + (ln.startsWith(indent) ? indent.length : 0),
        0
      );
      const newStart = start - Math.min(indent.length, start - lineStart);
      const newEnd = end - removedCount;
      setValue(newValue);
      requestAnimationFrame(() => {
        el.selectionStart = newStart;
        el.selectionEnd = newEnd;
      });
    } else {
      // インデント追加
      const added = lines.map((ln) => indent + ln).join(NL);
      const newValue = value.slice(0, lineStart) + added + value.slice(lineEnd);
      const addedCount = indent.length * lines.length;
      const newStart = start + indent.length;
      const newEnd = end + addedCount;
      setValue(newValue);
      requestAnimationFrame(() => {
        el.selectionStart = newStart;
        el.selectionEnd = newEnd;
      });
    }
  } else {
    if (isShift) {
      // 単一行で Shift+Tab
      const curLineStart = before.lastIndexOf(NL) + 1;
      const curLine = value.slice(curLineStart, end);
      let newValue = value;
      let cursor = start;
      if (curLine.startsWith(indent)) {
        newValue = value.slice(0, curLineStart) + curLine.slice(indent.length) + value.slice(end);
        cursor = Math.max(curLineStart, start - indent.length);
      }
      setValue(newValue);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = cursor;
      });
    } else {
      // 単一位置に indent を挿入
      const newValue = before + indent + after;
      const cursor = start + indent.length;
      setValue(newValue);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = cursor;
      });
    }
  }
}


function toPlain(v: any): any {
  if (v == null) return v;
  if (typeof v === 'object') {
    if (Array.isArray(v)) return v.map(toPlain);
    if ((v as any).toJs) {
      try { return (v as any).toJs({ dict_converter: Object.fromEntries }); }
      catch { try { return (v as any).toJs(); } catch { return String(v); } }
    }
  }
  return v;
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a && b && typeof a === 'object') {
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
      return true;
    }
    const ka = Object.keys(a), kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    for (const k of ka) if (!deepEqual(a[k], (b as any)[k])) return false;
    return true;
  }
  return false;
}

async function runTests(
  pyodide: Pyodide,
  problem: Problem,
  code: string
): Promise<{ passed: number; total: number; details: { name: string; ok: boolean; got: any; expected: any; error?: string }[] }>
{
  // Python グローバルをクリア
  pyodide.runPython('globals().clear()');

  // 受験者のコードを実行（関数定義）
  try {
    pyodide.runPython(code);
  } catch (e: any) {
    return {
      passed: 0,
      total: problem.tests.length,
      details: problem.tests.map((t) => ({ name: t.name, ok: false, got: null, expected: t.expected, error: 'コードの実行時エラー: ' + (e?.message || String(e)) })),
    };
  }

  const func = pyodide.globals.get(problem.funcName);
  if (!func) {
    return {
      passed: 0,
      total: problem.tests.length,
      details: problem.tests.map((t) => ({ name: t.name, ok: false, got: null, expected: t.expected, error: `関数 ${problem.funcName} が見つかりません` })),
    };
  }

  let passed = 0; const details: { name: string; ok: boolean; got: any; expected: any; error?: string }[] = [];
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
  const [theme, toggleTheme] = useTheme();
  const isDark = theme === 'dark';

  const current = useMemo(() => PROBLEMS.find((p) => p.id === active)!, [active]);
  // 現在の問題スターターからインデント幅（スペース）を推定
  const indentStr = useMemo(() => detectIndentFromStarter(current.starter), [current.id]);

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

  // テーマ別クラス
  const pageCls = cx(isDark ? 'bg-neutral-950 text-neutral-100' : 'bg-white text-neutral-900', 'min-h-screen transition-colors');
  const headerCls = cx('sticky top-0 z-40 border-b backdrop-blur', isDark ? 'border-white/10 bg-neutral-950/70' : 'border-neutral-200 bg-white/80');
  const tabActive = isDark ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white';
  const tabIdle = isDark ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-neutral-200 hover:bg-neutral-300';
  const cardBorder = isDark ? 'border-neutral-800' : 'border-neutral-200';
  const cardBg = isDark ? 'bg-neutral-900/60' : 'bg-neutral-50';
  const subPanelBg = isDark ? 'bg-black/30 text-neutral-300' : 'bg-white text-neutral-600';
  const textMuted = isDark ? 'text-neutral-300' : 'text-neutral-600';
  const editorTextArea = cx('h-[380px] w-full resize-none bg-transparent p-3 font-mono text-sm leading-6 focus:outline-none', isDark ? '' : 'text-neutral-800');

  return (
    <div className={pageCls}>
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* ヘッダー */}
        <header className={headerCls}>
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <h1 className="text-2xl font-semibold tracking-tight">Python オンライン練習（Leet 風）</h1>
            <div className="flex items-center gap-3 text-sm">
              <span className={cx('opacity-80', error ? 'text-red-400' : '')}>
                Pyodide 状態：{loading ? '読み込み中…' : error ? '読み込み失敗' : '準備完了'}
              </span>
              <button
                onClick={toggleTheme}
                className={cx('ml-2 flex items-center gap-2 rounded-lg border px-3 py-1.5 transition', isDark ? 'border-white/20 hover:bg-white/10' : 'border-neutral-300 hover:bg-neutral-100')}
                aria-label={isDark ? '昼モードに切替' : '夜モードに切替'}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span>{isDark ? '昼' : '夜'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* 問題タブ */}
        <div className="mb-4 flex flex-wrap gap-2">
          {PROBLEMS.map((p) => {
            const r = results[p.id];
            const score = r ? Math.round((r.passed / r.total) * 100) : null;
            const isActive = active === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className={cx('rounded-full px-4 py-2 text-sm transition', isActive ? tabActive : tabIdle)}
                title={score != null ? `スコア ${score}%` : undefined}
              >
                {p.title}
                {score != null && (
                  <span className={cx('ml-2 rounded-full px-2 py-0.5 text-[10px]', isDark ? 'bg-black/30' : 'bg-black/70 text-white')}>{score}%</span>
                )}
              </button>
            );
          })}
        </div>

        {/* 問題パネル */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* 説明 */}
          <article className={cx('rounded-2xl border p-4', cardBorder, cardBg)}>
            <h2 className="mb-2 text-lg font-medium">問題文</h2>
            <p className={cx('whitespace-pre-wrap', textMuted)}>{current.prompt}</p>
            <div className={cx('mt-4 rounded-xl p-3 text-xs', subPanelBg, 'border', isDark ? 'border-white/10' : 'border-neutral-200')}>
              <p>
                関数シグネチャ：<code className="select-all">{current.funcName}(…)</code>
              </p>
              <p className="mt-1">公開テスト数：{current.tests.length}</p>
            </div>
          </article>

          {/* エディタ */}
          <article className={cx('overflow-hidden rounded-2xl border p-0', cardBorder, cardBg)}>
            <div className={cx('flex items-center justify-between border-b px-3 py-2', isDark ? 'border-neutral-800' : 'border-neutral-200')}>
              <h3 className="text-sm font-medium">コードエディタ（Python）</h3>
              <div className="flex items-center gap-2">
                <button onClick={onReset} className={cx('rounded-md px-3 py-1.5 text-xs', isDark ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-neutral-200 hover:bg-neutral-300')}>初期コードに戻す</button>
                <button
                  onClick={onRun}
                  disabled={!pyodide || running || !!error}
                  className={cx('rounded-md px-3 py-1.5 text-xs', running || !pyodide || !!error ? (isDark ? 'cursor-not-allowed bg-neutral-700' : 'cursor-not-allowed bg-neutral-300') : 'bg-emerald-600 hover:bg-emerald-500 text-white')}
                >
                  {running ? '実行中…' : 'テストを実行'}
                </button>
              </div>
            </div>
            <textarea
              value={buffers[current.id]}
              onChange={(e) => setBuffer(current.id, e.target.value)}
              onKeyDown={(e) => handleEditorKeyDown(e, indentStr, buffers[current.id], (v) => setBuffer(current.id, v))}
              spellCheck={false}
              className={editorTextArea}
            />
          </article>
        </section>

        {/* 結果 */}
        <section className={cx('mt-4 rounded-2xl border p-4', cardBorder, cardBg)}>
          <h2 className="mb-3 text-lg font-medium">テスト結果</h2>
          {results[current.id] ? (
            <div>
              <div className={cx('mb-3 text-sm', textMuted)}>
                合格 {results[current.id].passed} / {results[current.id].total}（スコア {Math.round((results[current.id].passed / results[current.id].total) * 100)}%）
              </div>
              <ul className="space-y-2">
                {results[current.id].details.map((d, i) => (
                  <li
                    key={i}
                    className={cx('rounded-xl border px-3 py-2 text-sm', d.ok ? (isDark ? 'border-emerald-700 bg-emerald-900/20' : 'border-emerald-300 bg-emerald-50') : (isDark ? 'border-red-800 bg-red-900/20' : 'border-red-300 bg-red-50'))}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{d.name}</div>
                      <div className={d.ok ? 'text-emerald-500' : 'text-red-500'}>{d.ok ? '合格' : '不合格'}</div>
                    </div>
                    {!d.ok && (
                      <div className={cx('mt-1', textMuted)}>
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
            <div className={cx('text-sm', isDark ? 'text-neutral-400' : 'text-neutral-500')}>まだ実行していません。「テストを実行」をクリックしてください。</div>
          )}
        </section>

        {/* ヒント */}
        <section className={cx('mt-6 rounded-2xl border p-4 text-sm', cardBorder, cardBg, textMuted)}>
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
