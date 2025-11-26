"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ItPassportPage() {
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
        <h1 className="text-33xl font-bold mb-6">ITパスポート（IT Passport）とは？</h1>

        {/* ===== Explanation Card ===== */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-10 leading-relaxed">
          <p className="mb-4">
            ITパスポート（iパス）は、社会人や学生を問わず
            「ITを正しく理解し、活用するための基礎力」を評価する
            経済産業省の国家試験です。
          </p>

          <p className="mb-4">
            試験範囲は IT 基礎、セキュリティ、ネットワーク、データベース、
            アルゴリズムに加え、経営戦略、会計、マネジメントなど
            広範囲のビジネス知識まで含まれています。
          </p>

          <p className="mb-4">
            特に SIer・IT コンサルの就職活動では、
            「ITリテラシーの証明」として評価が高く、
            文系学生でも短期間で合格を目指せる点が魅力です。
          </p>
        </div>

        {/* ===== Quiz Section ===== */}
        <h2 className="text-2xl font-semibold mb-4">ITパスポート 模擬試験・問題集サイト</h2>

        <p className="mb-6 leading-relaxed">
          下記のサイトでは ITパスポートの用語クイズ、過去問、模擬試験を
          無料で何度でも練習できます。  
          <br />
          特に「用語クイズ」は初心者でも知識を効率よく定着させることができ、
          試験勉強の最初のステップとして非常に有効です。
        </p>

        {/* ===== External Link Button（Black） ===== */}
        <div className="text-center">
          <Link
            href="https://www.itpassportsiken.com/ip_yougoquiz.php"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="mt-2 px-6 py-3 text-lg rounded-lg bg-black text-white hover:bg-gray-900 transition">
              ITパスポート 用語クイズ・模擬試験サイトへ（外部リンク）
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
