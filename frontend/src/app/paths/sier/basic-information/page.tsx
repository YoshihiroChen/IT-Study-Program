"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FePage() {
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
        <h1 className="text-3xl font-bold mb-6">基本情報技術者試験（FE）とは？</h1>

        {/* ===== Explanation Card ===== */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-10 leading-relaxed">
          <p className="mb-4">
            基本情報技術者試験（FE）は、ITエンジニアを目指す学生・社会人が
            最初に目指すべき国家資格として位置づけられており、
            プログラミングやアルゴリズム、ネットワーク、データベース、
            セキュリティなど IT エンジニアに必須の知識が広く問われます。
          </p>

          <p className="mb-4">
            特に午後試験では、アルゴリズム読解、データ構造、システム設計、
            セキュリティ、データベース設計など、実務に直結する問題が多く、
            SIer・開発エンジニアを目指す人にとっては
            「技術基礎力を客観的に証明する指標」として非常に有効です。
          </p>

          <p className="mb-4">
            文系でも勉強次第で十分に合格可能ですが、
            ITパスポートよりもレベルが高く、特にアルゴリズム分野の
            学習量が多い点が特徴です。
          </p>
        </div>

        {/* ===== Quiz / Study Site Section ===== */}
        <h2 className="text-2xl font-semibold mb-4">基本情報技術者試験 模擬試験・問題集サイト</h2>

        <p className="mb-6 leading-relaxed">
          下記のサイトでは、基本情報の過去問、模擬試験、アルゴリズム問題などを
          無料で練習することができます。
          <br />
          特に午後試験のアルゴリズムとデータベース問題は
          繰り返し解くことで実力が大きく伸びるため、
          FE の学習者に非常に人気があります。
        </p>

        {/* ===== External Link Button（Black） ===== */}
        <div className="text-center">
          <Link
            href="https://www.fe-siken.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="mt-2 px-6 py-3 text-lg rounded-lg bg-black text-white hover:bg-gray-900 transition">
              基本情報技術者試験 過去問・模擬試験サイトへ（外部リンク）
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
