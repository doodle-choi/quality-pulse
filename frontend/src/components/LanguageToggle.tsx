"use client";

import { useTranslation } from "react-i18next";
import { MaterialIcon } from "./ui/MaterialIcon";
import { useState } from "react";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === "ko" ? "en" : "ko";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 flex items-center gap-1 text-text-muted hover:text-text hover:bg-surface-high rounded-full transition-colors active:scale-95"
      aria-label="Toggle language"
    >
      <MaterialIcon name="language" />
      <span className="text-xs font-bold uppercase hidden sm:block">
        {i18n.language.startsWith('ko') ? 'KO' : 'EN'}
      </span>
    </button>
  );
}
