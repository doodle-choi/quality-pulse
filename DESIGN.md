# Quality Pulse: Design System Specification
**Version:** 2.1 (Stitch Format Compliance)

## Overview
The Creative North Star for the Quality Pulse frontend is **"The Digital Command Center & The Analytical Architect"**. 

This system moves beyond the "spreadsheet in a browser" aesthetic. It treats complex enterprise data as high-end editorial content, pairing deep navy tones with vibrant accent nodes to create a workspace that feels like a premium flight deck. Support for both a bright "Analytical" (Light) mode and a dark "Command Center" (Dark) mode is mandatory.

## Colors
The palette relies heavily on Tonal Layering. We use deep slates and navies, punctuated by high-chroma accents for analytical clarity.

*   **Primary** (#7bd0ff): CTAs, active states, and key interactive elements. (Light mode equivalent: Deep Navy #0F172A).
*   **Secondary** (#3a4a5f): Supporting actions, data chips, toggle states.
*   **Tertiary** (#ffafd3): Vibrant Pink/Emerald. Reserved exclusively for highlights, alerts, or data anomalies.
*   **Error** (#ffb4ab): Soft Red for critical errors or escalation events.
*   **Surface** (#0b1326): Base canvas background (Light mode: #f7f9fb).
*   **Surface Container Lowest** (#060e20): Primary data cards, offering maximum contrast (Light mode: #ffffff).
*   **On-Surface** (#dae2fd): Used for primary body text to reduce eye strain (Light mode: #191c1e).

## Typography
We utilize a dual-font strategy to balance analytical precision with authoritative personality.

*   **Headline Font**: Manrope
*   **Body Font**: Inter
*   **Label Font**: Inter

Manrope is used for display sizes (e.g., major KPIs) and section headers due to its geometric, "engineered" qualities. Inter is the workhorse for dense data tables, body, and label text to maintain crisp readability at small sizes.

## Elevation
Depth is achieved primarily through **Tonal Layering** (Surface hierarchy) rather than shadows.

*   **Cards and Base Elements**: Flat. Layout boundaries are established solely by background color shifts (e.g., a `surface-container-lowest` card sitting on top of a `surface-container` background).
*   **Floating Elements (Glassmorphism)**: Used for dropdowns and floating context menus. Backgrounds are set to 60-80% opacity with a `20px` backdrop-blur to create a frosted glass effect.
*   **Dialogs and Overlays**: Elevation 3. Use an Ambient Shadow (`0px 24px 48px rgba(0, 0, 0, 0.08)`) tinted with the `on-surface` color. Standard heavy drop shadows are forbidden.

## Components
*   **Buttons**: Primary buttons use a linear gradient (e.g., `primary` to `primary-container`) with a `8px` corner radius. No borders. Secondary actions use a `surface-container-highest` background.
*   **Data Cards & Containers**: No borders. Use `8px` corner radius. Separate internal headers from content using `24px` vertical spacing rather than divider lines.
*   **Specialized Data Tables**: Header rows use `surface-container-high` background with semi-bold `label` text. Do not use border/divider lines between rows; use alternating row colors (zebra striping) or ample vertical spacing.
*   **Inputs & Search**: Background set to `surface-container-lowest`. On focus, transition to `surface-container-highest` and add a `2px` border using `primary`.
*   **Data Visualization (Apache ECharts)**: Core library for analytic charts. High-density grids use `surface-variant` lines at 20% opacity. Critical data spikes use `tertiary` colors to cut through the neutral backgrounds.

## Do's and Don'ts
*   **Do**: Embrace negative space. Use generous margins (`spacing-12` or `16`) to organize data.
*   **Do**: Use Glassmorphism and gradients for primary actions and active states to add a premium touch without overwhelming the data.
*   **Do**: Tint ambient shadows with the background tone to ensure they feel like natural light occlusion.
*   **Do**: Implement an explicit Light/Dark mode switch.
*   **Don't**: Use 1px solid borders to define section boundaries (The "No-Line" Rule). Use tonal shifts instead. (Exception: 15% opacity "ghost borders" for complex inputs if strictly needed for A11y).
*   **Don't**: Use pure `#000000` or `#ffffff` for primary text; always use the theme's `on-surface` color.
*   **Don't**: Use standard drop shadows on static dashboard cards. Let the color shifts do the work.
