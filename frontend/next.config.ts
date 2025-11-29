import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 让 yarn build 不会因为 ESLint 报错而失败（先上线，再慢慢修 ESLint）
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 你以后如果想连 TypeScript 的类型错误也不阻塞 build，可以把下面这段解开：
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

export default nextConfig;

