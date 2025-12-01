"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function FirstInterviewPage() {
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
          一次面接・模擬面接（General First Interview）
        </h1>

        {/* ===== Intro Card ===== */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 leading-relaxed">
          <p className="mb-4">
            一次面接では、応募者の「人柄」「論理性」「コミュニケーション力」を
            確認するための基本質問が中心になります。技術力よりも、
            自分の経験をどれだけわかりやすく説明できるかが重視されます。
          </p>

          <p className="mb-4">
            このページでは、一般的に一次面接でよく聞かれる質問内容と、
            模擬面接の方向性について紹介します。もし本格的な模擬面接の練習が必要な場合、
            開発者へお気軽にお問い合わせください。
          </p>
        </div>

        {/* ===== Section: Common Questions ===== */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          一次面接でよく聞かれる質問
        </h2>

        <div className="space-y-6">

          {/* Motivations */}
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">① 志望動機（Why us? / Why IT?）</h3>
            <p className="leading-relaxed">
              ・企業を選んだ理由、業界を選んだ理由、ここで働きたい明確な根拠を問われます。  
              ・「経験 → 気づき → 志望の理由」という流れで話すと説得力が上がります。
            </p>
          </div>

          {/* Gakuchika */}
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">② ガクチカ（学生時代に力を入れたこと）</h3>
            <p className="leading-relaxed">
              ・課題の設定 → 行動 → 工夫 → 結果 → 学んだこと  
              という構造に沿って説明するのが基本です。  
              ・“何をしたか”ではなく“どのように考えたか”が評価されます。
              ・ガクチカでは深く質問される可能性が高いです。
            </p>
          </div>

          {/* Career Path */}
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">③ キャリアパス（将来像）</h3>
            <p className="leading-relaxed">
              ・3〜5年後、10年後に「どのような人材になりたいか」  
              ・応募企業で達成したいこと  
              ・“なぜこの会社・この業界でなければならないのか”  
            </p>
          </div>

          {/* Strength / Weakness */}
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">④ 自分の強みと弱み（Strength & Weakness）</h3>
            <p className="leading-relaxed">
              ・強みは「根拠となるエピソード」とセットで説明する。  
              ・弱みは「改善のために何をしているか」を必ず添えることでプラス評価になります。
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
