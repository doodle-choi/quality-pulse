import { Suspense } from "react";
import { DashboardContainer } from "@/components/dashboard/DashboardContainer";

// 1. FastAPI 백엔드 연동 (React Server Component)
async function getIssues() {
  try {
    const res = await fetch("http://localhost:8000/api/v1/issues/", { 
      next: { revalidate: 10 },
      headers: { "Content-Type": "application/json" }
    });
    
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    return [];
  }
}

export default async function Home() {
  const issues = await getIssues();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <Suspense fallback={<div className="h-64 flex items-center justify-center text-text-muted">대시보드 데이터를 로드하고 있습니다...</div>}>
        <DashboardContainer initialIssues={issues} />
      </Suspense>
    </div>
  );
}
