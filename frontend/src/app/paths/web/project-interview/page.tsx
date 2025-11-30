"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function ProjectExperienceMockInterviewPage() {
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
          プロジェクト経験 模擬面接（Project Experience Mock Interview）
        </h1>

        {/* ===== Intro Card ===== */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 leading-relaxed">
          <p className="mb-4">
            プロジェクト経験に関する面接では、
            このサイトで学んだ技術（TypeScript／Python／フレームワーク／インフラ など）を
            実際の開発でどのように活かしたかが重点的に問われます。
          </p>

          <p className="mb-4">
            具体的には、
            「どんなプロジェクトを作ったのか」「自分の役割は何だったのか」
            「技術的な工夫や苦労した点はどこか」「そこから何を学んだのか」などを、
            自分の言葉で整理して説明できるかどうかが重要です。
          </p>

          <p className="mb-4">
            このページでは、詳細な質問リストや解答例には踏み込まず、
            プロジェクト経験の面接対策は本サイト内の各技術教材・実践コンテンツで
            学んだ内容をベースに準備してもらうことを前提としています。
          </p>
        </div>

        {/* ===== Section: 面接のイメージ ===== */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          プロジェクト経験 面接のイメージ
        </h2>

        <div className="bg-white p-5 rounded-lg shadow-md mb-8 leading-relaxed">
          <p className="mb-3">
            プロジェクト経験をテーマにした面接では、たとえば次のような観点で
            深掘りされることが多いです（ここではあくまでイメージのみを示します）：
          </p>

          <ul className="list-disc list-inside mb-3">
            <li>このサイトで学んだ技術を使って、どのようなプロダクト／機能を作ったのか</li>
            <li>チーム開発か個人開発か、その中で自分はどの役割を担ったのか</li>
            <li>直面した技術的・進行上の課題と、それをどのように解決したか</li>
            <li>設計や技術選定の理由をどこまで説明できるか</li>
            <li>そのプロジェクト経験を、応募先企業の業務とどう結びつけてアピールするか</li>
          </ul>

          <p>
            こうした内容をまとめるうえでの基礎知識や実装力については、
            本サイトの各講座・サンプルコード・チュートリアルなどを活用しながら
            自分のプロジェクトを組み立てていくことを想定しています。
          </p>
        </div>


      </div>
    </div>
  );
}
