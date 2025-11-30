"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function PythonMockInterviewPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 text-[#222] py-10 px-6">
      <div className="max-w-3xl mx-auto">

        {/* ===== Back Button ===== */}
        <button
          onClick={() => router.push("/")}
          className="mb-6 px-4 py-2 border border-gray-500 rounded-md bg-white hover:bg-gray-200 transition"
        >
          ← ホームに戻る
        </button>

        {/* ===== Title ===== */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Python 模擬面接（Mock Interview）
        </h1>

        {/* ===== Intro Card ===== */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 leading-relaxed">
          <p className="mb-4">
            Python を扱うポジションの面接では、文法の理解だけでなく、
            データ構造（リスト・辞書など）、例外処理、関数・クラス設計、
            ライブラリ活用、そして「どのように問題を分解してコードに落とし込むか」
            といった実務的な思考プロセスが問われることが多くあります。
          </p>

          <p className="mb-4">
            具体的な質問例や学習ステップ、コードの書き方の整理などについては、
            本サイト内の教材
          </p>

          <p className="font-semibold mb-4">
            「プログラミング言語学習（Python）」  
          </p>

          <p className="mb-4">
            に詳しくまとめています。  
            模擬面接に進む前に、まずはこの教材の内容をご確認ください。
          </p>
        </div>

        {/* ===== Section: Practice Guidance ===== */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          模擬面接について
        </h2>

        <div className="bg-white p-5 rounded-lg shadow-md mb-8 leading-relaxed">
          <p className="mb-3">
            実際の Python 面接では、「このコードは何をしているか」を説明する問題や、
            簡単なアルゴリズム・実装問題をその場で考えてもらうことが多くあります。
          </p>

        </div>

      </div>
    </div>
  );
}
