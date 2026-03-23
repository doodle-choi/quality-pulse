import { Suspense } from "react";
import { IssueAttr } from "@/components/dashboard/IssueCard";

async function getRawIssues(): Promise<IssueAttr[]> {
  try {
    const res = await fetch("http://localhost:8000/api/v1/issues/", { 
      cache: "no-store", // Admin view should always show freshest data
      headers: { "Content-Type": "application/json" }
    });
    
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    return [];
  }
}

export default async function RawDbViewPage() {
  const issues = await getRawIssues();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 min-h-[calc(100vh-80px)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-black tracking-tight text-text">Raw Database View</h1>
          <p className="text-[13px] font-medium text-text-muted mt-1">
            Directly querying PostgreSQL via FastAPI (<span className="text-secondary font-mono">{issues.length}</span> records found)
          </p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-surface-alt border-b border-border sticky top-0 z-10">
              <tr>
                <th className="p-4 font-bold text-text-muted uppercase text-[10px] tracking-wider whitespace-nowrap">ID</th>
                <th className="p-4 font-bold text-text-muted uppercase text-[10px] tracking-wider whitespace-nowrap">Brand</th>
                <th className="p-4 font-bold text-text-muted uppercase text-[10px] tracking-wider whitespace-nowrap">Category</th>
                <th className="p-4 font-bold text-text-muted uppercase text-[10px] tracking-wider whitespace-nowrap">Severity</th>
                <th className="p-4 font-bold text-text-muted uppercase text-[10px] tracking-wider whitespace-nowrap">Type</th>
                <th className="p-4 font-bold text-text-muted uppercase text-[10px] tracking-wider min-w-[300px]">Title</th>
                <th className="p-4 font-bold text-text-muted uppercase text-[10px] tracking-wider whitespace-nowrap">Region</th>
                <th className="p-4 font-bold text-text-muted uppercase text-[10px] tracking-wider whitespace-nowrap">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {issues.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-text-muted font-medium">
                    No records found in database.
                  </td>
                </tr>
              ) : (
                issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-surface-alt/50 transition-colors">
                    <td className="p-4 text-text-muted font-mono">{issue.id}</td>
                    <td className="p-4 font-bold text-text">{issue.brand}</td>
                    <td className="p-4 text-text-muted">{issue.product_category}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-[4px] text-[10px] font-black tracking-wide uppercase ${
                        issue.severity === 'Critical' ? 'bg-critical/10 text-critical' :
                        issue.severity === 'High' ? 'bg-high/10 text-high' :
                        issue.severity === 'Medium' ? 'bg-warning/10 text-warning' :
                        'bg-low/10 text-low'
                      }`}>
                        {issue.severity}
                      </span>
                    </td>
                    <td className="p-4 text-text-muted">{issue.issue_type}</td>
                    <td className="p-4 font-medium text-text">{issue.title}</td>
                    <td className="p-4 text-text-muted">{issue.region}</td>
                    <td className="p-4 text-text-muted font-mono text-[11px] whitespace-nowrap">
                      {new Date(issue.created_at).toISOString().replace('T', ' ').split('.')[0]}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
