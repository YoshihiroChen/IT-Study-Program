"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function ComingSoonPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-[#222] flex flex-col justify-center items-center px-6 py-10">
      
      {/* ===== Message ===== */}
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        開発中です。近日公開予定！
      </h1>

      <p className="text-gray-600 mb-8 text-center">
        新しいコンテンツを準備しておりますので、もう少々お待ちください。
      </p>

      {/* ===== Back Button ===== */}
      <button
        onClick={() => router.push("/")}
        className="px-6 py-3 border border-gray-400 rounded-md hover:bg-gray-100 transition"
      >
        ← ホームに戻る
      </button>

    </div>
  );
}
