// src/app/api/health/route.ts

export async function GET() {
  // 这里用 docker 内部网络访问 backend 容器
  const res = await fetch("http://backend:8000/health");
  const data = await res.json();
  return Response.json(data);
}
