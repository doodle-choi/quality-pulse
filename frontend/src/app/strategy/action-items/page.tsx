"use client";

import { useTranslation } from "react-i18next";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function ActionItemsPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-text-muted">
          <MaterialIcon name="task_alt" size="sm" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-70">{t("navigation.Business Structural Improvement", "Business Structural Improvement")}</span>
        </div>
        <h1 className="text-2xl font-headline font-extrabold text-text tracking-tight">
          {t("navigation.Action Item Progress", "Action Item Progress")}
        </h1>
      </header>

      <div className="p-20 flex flex-col items-center justify-center bg-surface-container rounded-3xl border border-dashed border-border-ghost/20 opacity-50">
        <MaterialIcon name="construction" size="lg" className="mb-4 text-text-muted" />
        <p className="text-sm font-semibold text-text-muted">Module Under Construction</p>
        <p className="text-xs text-text-muted mt-1 opacity-70">Detailed action item tracking system is being integrated.</p>
      </div>
    </div>
  );
}
