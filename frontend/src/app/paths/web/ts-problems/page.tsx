"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function TypeScriptMockInterviewPage() {
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
          TypeScript 模擬面接（Mock Interview）
        </h1>

        {/* ===== Intro Card ===== */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 leading-relaxed">
          <p className="mb-4">
            TypeScript を扱う開発系ポジションの面接では、型システムの理解、
            非同期処理、クラス構文、ユニオン型・インターフェースの設計など、
            実務に直結する知識が問われることが多くあります。
          </p>

          <p className="mb-4">
            具体的な質問例、面接対策、学習のステップなどについては、
            本サイト内の教材
          </p>

          <p className="font-semibold mb-4">
            「プログラミング言語学習（TypeScript）」  
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
            実際の面接では、理論的な説明だけではなく、
            「コードを使ってどう表現するか」「どのように設計するか」
            といった観点が重視されます。
          </p>
        </div>

      </div>
    </div>
  );
}
