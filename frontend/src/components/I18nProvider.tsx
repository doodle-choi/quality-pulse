"use client";

import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  // Never conditionally skip rendering children to avoid breaking NextThemes context tree
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
