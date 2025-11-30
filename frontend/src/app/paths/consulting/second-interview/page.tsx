"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function SecondInterviewPage() {
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
          二次面接・模擬面接（Second Interview）
        </h1>

        {/* ===== Intro Card ===== */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 leading-relaxed">
          <p className="mb-4">
            二次面接では、一次面接で確認された「人柄・基本的なコミュニケーション力」に加えて、
            より深いレベルでの志望度・業界理解・企業理解が問われます。
          </p>
          <p className="mb-4">
            質問内容そのものは一次面接と似ていても、
            「どこまで調べているか」「どこまで自分の言葉で語れるか」が
            より厳しくチェックされるのが特徴です。
          </p>
          <p>
            このページでは、二次面接で特に重視されやすい
            「企業分析」「業界分析」「将来の仕事理解」の観点から、
            模擬面接のイメージを整理します。
            本格的な模擬面接の練習が必要な場合は、開発者へお気軽にお問い合わせください。
          </p>
        </div>

        {/* ===== Section: 基本質問の継続 ===== */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          一次面接の内容は「より深く」聞かれる
        </h2>
        <div className="bg-white p-5 rounded-lg shadow-md mb-8 leading-relaxed">
          <p className="mb-2">
            二次面接でも、以下のような一次面接の定番質問は引き続き聞かれることが多いです：
          </p>
          <ul className="list-disc list-inside mb-3">
            <li>志望動機（なぜこの業界・この企業なのか）</li>
            <li>ガクチカ（学生時代に力を入れたこと）</li>
            <li>キャリアパス（将来どのような人材になりたいか）</li>
            <li>自分の強み・弱み（強みの根拠・弱みの改善努力）</li>
          </ul>
          <p>
            ただし二次面接では、「一次で話した内容をさらに深掘りされる」ことが多く、  
            例えば「その経験は当社のどの業務で活かせると思いますか？」など、
            企業理解と結びつけて答える力が求められます。
          </p>
        </div>

        {/* ===== Section: 企業分析 ===== */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          ① 企業分析：同業他社との比較まで答えられるか
        </h2>
        <div className="bg-white p-5 rounded-lg shadow-md mb-8 leading-relaxed">
          <p className="mb-3">
            二次面接では、「うちの会社のどこに魅力を感じていますか？」という質問が
            一次よりも具体的に飛んでくることが多いです。
          </p>
          <p className="mb-3">
            単に「御社の理念に共感しました」だけでは不十分で、例えば：
          </p>
          <ul className="list-disc list-inside mb-3">
            <li>同じ業界の中で、この企業ならではの強み・特徴を説明できるか</li>
            <li>具体的な事業（サービス・プロジェクト・案件）の名前を挙げて語れるか</li>
            <li>「A社ではなく、あえて御社を選ぶ理由」を比較の形で説明できるか</li>
          </ul>
          <p>
            模擬面接では、「なぜこの企業か」を 他社との比較つきで
            ロジカルに説明する練習を中心に行います。
          </p>
        </div>

        {/* ===== Section: 業界分析 ===== */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          ② 業界分析：なぜこの業界なのかを他業界と比較して語る
        </h2>
        <div className="bg-white p-5 rounded-lg shadow-md mb-8 leading-relaxed">
          <p className="mb-3">
            二次面接では、「なぜこの業界を選んだのか」という質問も
            一次より深いレベルで問われます。
          </p>
          <ul className="list-disc list-inside mb-3">
            <li>この業界のビジネスモデル・収益構造をどこまで理解しているか</li>
            <li>他に悩んだ業界（例：Web系IT、コンサル、メーカーなど）とどう比較したか</li>
            <li>なぜ最終的にこの業界に決めたのか（決め手は何か）</li>
          </ul>
          <p>
            「なんとなく楽しそうだから」ではなく、  
            自分の経験・価値観と業界の特徴を結びつけて説明することが重要です。  
            模擬面接では、志望業界と他業界の違いを言語化する練習を行います。
          </p>
        </div>

        {/* ===== Section: 仕事理解 ===== */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          ③ 将来の仕事内容の理解：現実をどこまでイメージできているか
        </h2>
        <div className="bg-white p-5 rounded-lg shadow-md mb-8 leading-relaxed">
          <p className="mb-3">
            二次面接で特にチェックされるのが、「仕事の中身をどこまで理解しているか」です。
          </p>
          <ul className="list-disc list-inside mb-3">
            <li>1日のスケジュールや、年間の業務サイクルをイメージできているか</li>
            <li>大変な点・泥臭い部分も含めて理解し、それでもやりたいと思えているか</li>
            <li>自分の強みがどの業務で活かせるのか、具体的に説明できるか</li>
          </ul>
          <p>
            「華やかなイメージ」だけで志望していると、  
            二次面接の段階で簡単に見抜かれてしまいます。  
            模擬面接では、実際の業務内容と自分の経験を結びつけて語る練習をします。
          </p>
        </div>

        {/* ===== Final Message ===== */}
        <div className="bg-white mt-10 p-6 rounded-lg shadow-md text-gray-700 leading-relaxed">
          <p className="mb-3">
            二次面接は「志望度の最終確認」と同時に、
            「入社後にギャップなく働けそうか」を見られるフェーズです。
          </p>
          <p className="mb-3">
            自分一人では業界や企業の整理が難しい場合や、
            回答内容に不安がある場合は、実際の ES・志望企業リストをもとにした
            個別の模擬面接も行うことができます。
          </p>
          <p>
            「二次面接の練習をしたい」「企業・業界の整理から一緒にやってほしい」など、  
            必要に応じて開発者までお気軽にお問い合わせください。
          </p>
        </div>

      </div>
    </div>
  );
}