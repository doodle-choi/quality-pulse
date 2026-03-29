import { Suspense } from "react";
import { InsightBoardContainer } from "@/components/dashboard/InsightBoardContainer";
import { INTERNAL_API_BASE_URL } from "@/config";

// React Server Component to fetch data
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

export default async function InsightBoardPage() {
  const issues = await getIssues();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <Suspense fallback={<div className="h-64 flex items-center justify-center text-text-muted">Loading insight board...</div>}>
        <InsightBoardContainer initialIssues={issues} />
      </Suspense>
    </div>
  );
}
