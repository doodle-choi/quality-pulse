## 2024-03-27 - Icon-Only Button Accessibility in Dashboard Components
**Learning:** Several key layout and dashboard components (Header, Sidebar, FilterBar) rely heavily on icon-only buttons (like Menu, X, Sun/Moon) from `lucide-react` without native text labels or `aria-label`s, rendering them inaccessible to screen readers. This pattern is common across the app's interactive elements.
**Action:** When working with or adding new `lucide-react` icon buttons, always verify and include a descriptive `aria-label` attribute if there is no visible accompanying text.
