"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function ItConsultingCaseInterviewPage() {
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
          ITコンサル業界のケース面接・模擬面接
        </h1>

        {/* ===== Intro Card ===== */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 leading-relaxed">
          <p className="mb-4">
            ITコンサル業界の選考では、一般的な質問（志望動機・ガクチカ・キャリアパスなど）に加えて、
            「ケース面接」が行われることが多くあります。
          </p>
          <p className="mb-4">
            ケース面接では、企業の課題や新規事業、IT 戦略、業務改革などのテーマに対して、
            限られた時間の中で構造的に考え、仮説を立て、数字やロジックを使って説明する力が求められます。
          </p>
          <p>
            ここでは詳細なケースの内容や解き方のフレームワークには踏み込みません。
            具体的なケースの学習・例題・思考プロセスについては、
            本サイト内の「ケーススタディの学習」パートを参照してください。
          </p>
        </div>

        {/* ===== Section: Mock Interview Offer ===== */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          模擬ケース面接を行いたい場合
        </h2>
        <div className="bg-white p-5 rounded-lg shadow-md mb-8 leading-relaxed">
          <p>
            「ITコンサル向けのケース面接を実際に練習したい」  
            「ケーススタディの学習内容を使って模擬面接をしてほしい」  
            といった場合は、必要に応じて開発者へお気軽にお問い合わせください。
          </p>
        </div>

      </div>
    </div>
  );
}
