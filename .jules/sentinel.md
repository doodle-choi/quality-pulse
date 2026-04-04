## 2026-03-25 - [MEDIUM] Fix error handling in scheduler config endpoint
**Vulnerability:** The scheduler config endpoint returned a 200 OK for validation failures.
**Learning:** API endpoints should raise HTTP exceptions for validation errors to ensure clients properly handle the failure.
**Prevention:** Use FastAPI's `HTTPException` to raise errors instead of returning error dictionaries.

## 2026-03-26 - [CRITICAL] Remove hardcoded internal API key defaults
**Vulnerability:** The internal API key defaulted to a hardcoded string `dev_api_key_123` in both the crawler and the backend, creating a risk if deployments omitted the `.env` variable.
**Learning:** Config frameworks often accept string literals as default fallbacks. A default secret means an unconfigured service could unintentionally start with a known backdoor key, leading to unauthorized backend API access.
**Prevention:** Ensure secrets are mandatory requirements at startup. In FastAPI/Pydantic, do not assign a string default to secrets; only specify the type hint `str`. In standard Python, check for `os.getenv()` returning `None` and raise `ValueError` immediately.
## 2024-05-24 - [Sanitize IssueCard source_url to prevent XSS]
**Vulnerability:** Cross-Site Scripting (XSS) via `issue.source_url` in `IssueCard.tsx`.
**Learning:** External or database-sourced URLs were being passed directly to an `<a>` tag's `href` attribute without sanitization, allowing potential `javascript:` protocol payloads.
**Prevention:** Always use a dedicated URL sanitization utility (like `sanitizeUrl` from `security.ts`) to validate that the URL protocol is safe (`http:` or `https:`) before rendering it in any `href` attribute in React.
## 2025-02-25 - [Missing Authorization on Workspace API]
**Vulnerability:** The workspace creation, updating, and deletion API endpoints (`POST /`, `PATCH /{workspace_id}`, `DELETE /{workspace_id}`) in `backend/api/endpoints/workspace.py` lacked authentication/authorization checks, allowing any user to freely modify or delete workspaces.
**Learning:** These endpoints were missing the `dependencies=[Depends(verify_api_key)]` parameter that other administrative or modifying endpoints (such as `issue.py` or `announcement.py`) have properly configured. This allowed authorization bypass.
**Prevention:** Always verify that all sensitive and state-modifying API endpoints (POST, PUT, PATCH, DELETE) have appropriate authentication and authorization dependencies applied at the router level or endpoint level before deployment.
## 2025-02-25 - [Exposed Internal API Key in Client-Side Component]
**Vulnerability:** A hardcoded dummy API key (`"your_secure_internal_key"`) was used in client-side component `frontend/src/app/admin/announcements/page.tsx` for `fetch` calls to backend API. This exposes the API key logic to the frontend and could potentially leak the actual `INTERNAL_API_KEY` if it was replaced with the actual environment variable.
**Learning:** Client components (`"use client"`) execute in the browser and should never contain sensitive secrets or direct calls to authenticated internal endpoints if they require a secret API key.
**Prevention:** Always use Next.js Server Actions (`"use server"`) or dedicated API routes for operations requiring secrets. Server actions safely encapsulate the logic and use server-side environment variables without exposing them to the client bundle.

## 2024-05-24 - [CRITICAL] Fix hardcoded admin credentials in NextAuth configuration
**Vulnerability:** The `authorize` function in NextAuth's configuration (`frontend/src/auth.config.ts`) used hardcoded credentials (`admin@example.com` and `admin123`) for administrative authentication.
**Learning:** Hardcoding credentials in source code exposes sensitive access to anyone who can view the repository or the deployed client bundle.
**Prevention:** Never hardcode credentials. Always use environment variables (`process.env`) to securely inject sensitive information at runtime, and implement secure fallbacks (e.g., returning `null` if required variables are missing).
## 2025-02-25 - [Exposed Internal API Key in Client-Side Component]
**Vulnerability:** A hardcoded dummy API key (`"your_secure_internal_key"`) was used in client-side component `frontend/src/app/admin/announcements/page.tsx` for `fetch` calls to backend API. This exposes the API key logic to the frontend and could potentially leak the actual `INTERNAL_API_KEY` if it was replaced with the actual environment variable.
**Learning:** Client components (`"use client"`) execute in the browser and should never contain sensitive secrets or direct calls to authenticated internal endpoints if they require a secret API key.
**Prevention:** Always use Next.js Server Actions (`"use server"`) or dedicated API routes for operations requiring secrets. Server actions safely encapsulate the logic and use server-side environment variables without exposing them to the client bundle.
