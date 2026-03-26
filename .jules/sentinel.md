## 2026-03-25 - [MEDIUM] Fix error handling in scheduler config endpoint
**Vulnerability:** The scheduler config endpoint returned a 200 OK for validation failures.
**Learning:** API endpoints should raise HTTP exceptions for validation errors to ensure clients properly handle the failure.
**Prevention:** Use FastAPI's `HTTPException` to raise errors instead of returning error dictionaries.
