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
