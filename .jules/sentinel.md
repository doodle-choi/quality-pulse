## 2026-03-25 - [MEDIUM] Fix error handling in scheduler config endpoint
**Vulnerability:** The scheduler config endpoint returned a 200 OK for validation failures.
**Learning:** API endpoints should raise HTTP exceptions for validation errors to ensure clients properly handle the failure.
**Prevention:** Use FastAPI's `HTTPException` to raise errors instead of returning error dictionaries.

## 2026-03-26 - [CRITICAL] Remove hardcoded internal API key defaults
**Vulnerability:** The internal API key defaulted to a hardcoded string `dev_api_key_123` in both the crawler and the backend, creating a risk if deployments omitted the `.env` variable.
**Learning:** Config frameworks often accept string literals as default fallbacks. A default secret means an unconfigured service could unintentionally start with a known backdoor key, leading to unauthorized backend API access.
**Prevention:** Ensure secrets are mandatory requirements at startup. In FastAPI/Pydantic, do not assign a string default to secrets; only specify the type hint `str`. In standard Python, check for `os.getenv()` returning `None` and raise `ValueError` immediately.

## 2026-03-26 - [HIGH] Sanitize URL in `href` to prevent XSS
**Vulnerability:** The `href` attribute in `IssueCard.tsx` consumed unsanitized data (`issue.source_url`). An attacker could inject a malicious URL like `javascript:alert('XSS')` through the database or API.
**Learning:** React escapes HTML content by default, but it does not sanitize `href` attributes for `javascript:` or `data:` URIs. Providing user-controlled data directly to `href` without validation is a common XSS vector.
**Prevention:** Always validate and sanitize URLs before rendering them in `href` attributes, ensuring they use safe protocols like `http:` or `https:`.
