"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PmPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-[#111] py-10 px-6">
      <div className="max-w-3xl mx-auto">

        {/* ===== Back Button ===== */}
        <button
          onClick={() => router.push("/")}
          className="mb-6 px-4 py-2 border border-gray-400 rounded-md hover:bg-gray-100 transition"
        >
          ← ホームに戻る
        </button>

        {/* ===== Title ===== */}
        <h1 className="text-3xl font-bold mb-6">
          プロジェクトマネージャ試験（PM）とは？
        </h1>

        {/* ===== Explanation Card ===== */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-10 leading-relaxed">
          <p className="mb-4">
            プロジェクトマネージャ試験（PM）は、情報処理技術者試験の中でも
            上位レベルに位置づけられる高度情報処理試験の一つで、
            大規模システム開発や IT プロジェクトを統括する
            「プロジェクトマネージャ」としての知識と実務能力が問われます。
          </p>

          <p className="mb-4">
            試験では、要件定義から設計・開発・テスト・リリースまでの
            プロジェクトライフサイクル全体に加え、QCD（品質・コスト・納期）管理、
            リスクマネジメント、ステークホルダー調整、ベンダーコントロールなど、
            実務で必要となるマネジメントスキルが総合的に問われます。
          </p>

          <p className="mb-4">
            SIer や IT コンサルで PM／PL を目指す人にとっては、
            「プロジェクトを主導できるレベルの知識と経験」を示す
            強力な資格であり、管理職・リーダー職へのステップとして
            取得を推奨されることも多い高度試験です。
          </p>
        </div>

        {/* ===== Past Exams / Practice Section ===== */}
        <h2 className="text-2xl font-semibold mb-4">
          プロジェクトマネージャ試験 過去問・演習サイト
        </h2>

        <p className="mb-6 leading-relaxed">
          下記のサイトでは、プロジェクトマネージャ試験の
          過去問・解説・分野別問題・論述対策などを無料で利用できます。<br />
          PM 試験は特に記述・論述問題のウエイトが高いため、
          過去問を用いて「どのようにストーリーを構成し、どの観点を
          アピールするか」を意識しながら答案練習をすることが重要です。
        </p>

        {/* ===== External Link Button（Black） ===== */}
        <div className="text-center">
          <Link
            href="https://www.pm-siken.com/pmkakomon.php"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="mt-2 px-6 py-3 text-lg rounded-lg bg-black text-white hover:bg-gray-900 transition">
              プロジェクトマネージャ試験 過去問・演習サイトへ（外部リンク）
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
