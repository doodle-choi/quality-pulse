## 2025-02-23 - Prevent Hardcoded Admin Credentials
**Vulnerability:** Found hardcoded admin credentials (`admin@example.com` / `admin123`) inside NextAuth configuration (`frontend/src/auth.config.ts`), which would allow unauthorized access in any deployed environment using this code.
**Learning:** Hardcoded credentials are often left over from initial prototyping phases or "mock" setups, bypassing environment-specific configuration entirely.
**Prevention:** Never commit plaintext credentials. Always map sensitive variables (like `ADMIN_EMAIL` and `ADMIN_PASSWORD`) to `process.env` immediately, and explicitly implement secure fallback logic (e.g., returning `null` to fail securely if these variables are missing).
