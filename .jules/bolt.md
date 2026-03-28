## 2024-05-24 - [O(1) Lookup Optimization in Render Loops]
**Learning:** Declaring static lookup arrays (like severity levels) inside loops or `useMemo` and iterating through them (e.g., using `indexOf()`) causes redundant memory allocations and unnecessary CPU overhead. Similarly, scanning O(N) object entries on every render for many child components (like countries in a Map) adds up quickly.
**Action:** Lift constant mapping objects and lookup maps (like `SEVERITY_WEIGHTS` or `COUNTRY_TO_REGION`) outside component declarations to guarantee O(1) lookup times and zero unnecessary re-allocations during iteration or rendering.

## 2026-03-28 - [Combine Independent useMemo Hooks for Single-Pass O(N) Iteration]
**Learning:** When multiple independent `useMemo` hooks map or filter the same large array to derive different dashboard statistics (e.g., aggregating risk counts, timeline frequencies, and KPIs), the React component performs O(K*N) operations. This architecture also often introduces redundant string manipulation and garbage collection overheads on every render cycle.
**Action:** Refactor related statistical computations that depend on the same input dataset into a single `useMemo` block using a single unified O(N) loop to compute and return all required derived state at once.
