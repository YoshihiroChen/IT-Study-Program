"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function JavaScriptIntroPage() {
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
          JavaScript 学習リソースの紹介
        </h1>

        {/* ===== Intro Card ===== */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-10 leading-relaxed">
          <p className="mb-4">
            JavaScript は、Web フロントエンド開発の中心となるプログラミング言語であり、
            ブラウザ上での動的な UI の実装や、SPA（Single Page Application）、
            さらには Node.js を使ったサーバーサイド開発にも利用される非常に重要な言語です。
          </p>

          <p className="mb-4">
            Web 系エンジニアやフロントエンドエンジニアを目指す場合、
            HTML / CSS とあわせて JavaScript をしっかり学ぶことがほぼ必須になります。
            そのうえで TypeScript や各種フレームワーク（React / Next.js など）へと
            学習を広げていくのが一般的なルートです。
          </p>

          <p>
            ここでは、JavaScript の基礎から体系的に学習を進めたい人向けに、
            外部の学習サイトを 1 つ紹介します。
          </p>
        </div>

        {/* ===== External Link Button (Black) ===== */}
        <div className="text-center">
          <Link
            href="https://ja.javascript.info/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="mt-2 px-6 py-3 text-lg rounded-lg bg-black text-white hover:bg-gray-900 transition">
              JavaScript 学習サイトへ（外部リンク）
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
