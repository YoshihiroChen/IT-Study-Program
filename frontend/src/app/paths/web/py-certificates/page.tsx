"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PythonBasicPage() {
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
          Python 3 エンジニア認定基礎試験とは？
        </h1>

        {/* ===== Explanation Card ===== */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-10 leading-relaxed">
          <p className="mb-4">
            Python 3 エンジニア認定基礎試験は、プログラミング初心者や
            Python 学習者を対象とした民間資格で、
            「Python の基本文法や考え方をどれだけ理解しているか」を
            客観的に証明できる試験です。
          </p>

          <p className="mb-4">
            試験範囲には、変数・データ型・制御構文（if, for, while）、
            関数、モジュール、例外処理、ファイル操作、標準ライブラリの基礎などが含まれ、
            Web開発・データ分析・機械学習など、今後の学習の土台になる内容が
            体系的にカバーされています。
          </p>

          <p className="mb-4">
            SIer や Web 系 IT 企業、データ分析職を目指す学生にとっては、
            「Python の基礎を正式なテキストで一通り学んだ」という証拠になるため、
            ポートフォリオや自己 PR と組み合わせることで、技術的な説得力を高めることができます。
          </p>
        </div>

        {/* ===== Study Site Section ===== */}
        <h2 className="text-2xl font-semibold mb-4">
          Python 3 エンジニア認定基礎試験 公式サイト・学習情報
        </h2>

        <p className="mb-6 leading-relaxed">
          下記の公式サイトでは、試験概要、シラバス、学習用公式テキスト、
          認定スクールや模擬試験情報などが公開されています。<br />
          まずはシラバスを確認し、自分の学習状況と照らし合わせながら
          「どの分野をどこまで押さえればよいか」を整理して学習計画を立てるのがおすすめです。
        </p>

        {/* ===== External Link Button（Black） ===== */}
        <div className="text-center">
          <Link
            href="https://python-basic.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="mt-2 px-6 py-3 text-lg rounded-lg bg-black text-white hover:bg-gray-900 transition">
              Python 3 エンジニア認定基礎試験 公式サイトへ（外部リンク）
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
