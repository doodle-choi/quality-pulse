import { Suspense } from "react";
import { DashboardContainer } from "@/components/dashboard/DashboardContainer";
import { INTERNAL_API_BASE_URL } from "@/config";
export const dynamic = "force-dynamic";

// 1. FastAPI 백엔드 연동 (React Server Component)
async function getIssues() {
  try {
    const res = await fetch(`${INTERNAL_API_BASE_URL}/issues/`, { 
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
      <Suspense fallback={<div className="h-64 flex items-center justify-center text-text-muted">Loading dashboard data...</div>}>
        <DashboardContainer initialIssues={issues} />
      </Suspense>
    </div>
  );
}
