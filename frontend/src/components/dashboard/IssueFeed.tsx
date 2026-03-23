"use client";

import { IssueCard, IssueAttr } from "@/components/dashboard/IssueCard";

export function IssueFeed({ issues }: { issues: IssueAttr[] }) {
  if (!issues || issues.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-10 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-surface-alt rounded-full flex items-center justify-center mb-4 text-text-muted">
          📉
        </div>
        <h3 className="font-bold text-text mb-1">데이터가 없습니다</h3>
        <p className="text-sm text-text-muted">아직 크롤러가 수집한 분석 이슈가 존재하지 않습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  );
}
