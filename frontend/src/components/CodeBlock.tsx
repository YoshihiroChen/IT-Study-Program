"use client";

import { useState, useRef, useEffect } from "react";
import { Copy, Check, AlertCircle } from "lucide-react";

type Appearance = "auto" | "light" | "dark";

function parseRGB(input: string): [number, number, number] | null {
  const m = input.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!m) return null;
  return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
}
function luminance([r, g, b]: [number, number, number]) {
  const srgb = [r, g, b]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}
function getNearestBgColor(el: HTMLElement | null): string | null {
  let cur: HTMLElement | null = el;
  while (cur) {
    const style = window.getComputedStyle(cur);
    const bg = style.backgroundColor;
    if (bg && !bg.includes("0)") && bg !== "transparent") return bg;
    cur = cur.parentElement;
  }
  return window.getComputedStyle(document.body).backgroundColor || null;
}

export default function CodeBlock({
  code,
  lang = "ts",
  filename,
  appearance = "auto",
}: {
  code: string;
  lang?: string;
  filename?: string;
  appearance?: Appearance;
}) {
  const [status, setStatus] = useState<"idle" | "ok" | "fail">("idle");
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const timerRef = useRef<number | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // 同步 appearance（优先使用外部传入）
  useEffect(() => {
    if (appearance === "light" || appearance === "dark") {
      setMode(appearance);
      return;
    }
    if (!wrapRef.current) return;
    const bg = getNearestBgColor(wrapRef.current);
    const rgb = bg ? parseRGB(bg) : null;
    if (rgb) {
      const L = luminance(rgb);
      setMode(L > 0.5 ? "light" : "dark");
    } else {
      setMode("dark");
    }
  }, [appearance]);

  const resetLater = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setStatus("idle"), 1500);
  };

  const legacyCopy = (text: string) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      document.body.removeChild(ta);
      return false;
    }
  };

  const onCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
        setStatus("ok");
      } else {
        const ok = legacyCopy(code);
        setStatus(ok ? "ok" : "fail");
      }
    } catch {
      const ok = legacyCopy(code);
      setStatus(ok ? "ok" : "fail");
    } finally {
      resetLater();
    }
  };

  // —— 强化浅色对比 & 避免被 prose 覆盖（not-prose）——
  const boxClass =
    mode === "light"
      ? "not-prose rounded-xl border border-neutral-300 bg-neutral-100 shadow-sm"
      : "not-prose rounded-xl border border-white/10 bg-neutral-900/50";
  const headerClass =
    mode === "light"
      ? "flex items-center justify-between text-xs px-3 py-2 border-b border-neutral-300 bg-white/80"
      : "flex items-center justify-between text-xs px-3 py-2 border-b border-neutral-700 bg-neutral-900/60";
  const btnClass =
    mode === "light"
      ? "flex items-center gap-1 px-2 py-1 rounded-md border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-100 text-neutral-800"
      : "flex items-center gap-1 px-2 py-1 rounded-md border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800 text-neutral-100";
  const filenameClass = mode === "light" ? "text-neutral-600" : "text-neutral-300";
  const preClass =
    mode === "light"
      ? "m-0 p-3 overflow-x-auto text-sm leading-6 bg-neutral-100 text-neutral-800"
      : "m-0 p-3 overflow-x-auto text-sm leading-6 bg-transparent text-neutral-100";
  const codeClass = `language-${lang} font-mono`;

  return (
    <div ref={wrapRef} className={`group ${boxClass} overflow-hidden`}>
      <div className={headerClass}>
        <span className={filenameClass}>{filename ?? `code.${lang}`}</span>
        <button type="button" onClick={onCopy} className={btnClass} aria-label="Copy code">
          {status === "ok" ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied!
            </>
          ) : status === "fail" ? (
            <>
              <AlertCircle className="w-3.5 h-3.5" />
              Failed
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className={preClass}>
        <code className={codeClass}>{code}</code>
      </pre>
    </div>
  );
}
