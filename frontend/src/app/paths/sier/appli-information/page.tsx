"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ApPage() {
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
          応用情報技術者試験（AP）とは？
        </h1>

        {/* ===== Explanation Card ===== */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-10 leading-relaxed">
          <p className="mb-4">
            応用情報技術者試験（AP）は、基本情報技術者試験の
            ワンランク上に位置づけられる中級レベルの国家試験で、
            システム開発・インフラ・セキュリティ・プロジェクトマネジメントなど、
            より実務寄りの知識と応用力が問われます。
          </p>

          <p className="mb-4">
            午前試験では幅広い IT 知識が問われ、
            午後試験ではシステムアーキテクチャ、ネットワーク、
            データベース、セキュリティ、マネジメント、ストラテジなどから
            複数テーマを選択して、長文ケース問題に対して記述式で回答します。
          </p>

          <p className="mb-4">
            SIer や IT コンサル、インフラエンジニア、PM を目指す人にとっては、
            「設計・マネジメントまで含めた応用的な IT スキル」があることを
            客観的に示す強力な資格であり、若手のうちに取得しておくと
            その後のキャリア形成に大きくプラスになります。
          </p>
        </div>

        {/* ===== Past Exams / Practice Section ===== */}
        <h2 className="text-2xl font-semibold mb-4">
          応用情報技術者試験 過去問・問題演習サイト
        </h2>

        <p className="mb-6 leading-relaxed">
          下記のサイトでは、応用情報の過去問や解説、分野別問題、
          午後試験対策などを無料で利用できます。<br />
          特に午後試験は「問題形式に慣れること」が非常に重要なため、
          本番形式の過去問を何度も解いて、読むスピードと答案構成力を
          鍛えていくことが合格への近道です。
        </p>

        {/* ===== External Link Button（Black） ===== */}
        <div className="text-center">
          <Link
            href="https://www.ap-siken.com/apkakomon.php"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="mt-2 px-6 py-3 text-lg rounded-lg bg-black text-white hover:bg-gray-900 transition">
              応用情報技術者試験 過去問・演習サイトへ（外部リンク）
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
