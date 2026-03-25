# Quality Pulse: AI-Driven Product Quality & Safety Monitor

Quality Pulse is an advanced, automated system designed to monitor, scrape, and analyze product quality and safety issues (recalls, lawsuits, defects, hazards) across global sources. It leverages LLMs (Gemini) to triage unstructured web data into structured, actionable insights displayed on a real-time dashboard.

## 🌟 Project Overview

The system operates on a "Two-Track" intelligence gathering model:
- **Track A (HTML/Markdown):** Deep scraping of specific regulatory sites (e.g., CPSC) using `crawl4ai` and Playwright. Content is converted to Markdown and analyzed by Gemini for issue extraction.
- **Track B (API Aggregators):** Real-time monitoring of global news and crisis events via NewsAPI and GDELT.

### Key Workflows:
1.  **Crawl:** Scheduled workers (Celery) trigger scrapers to fetch data.
2.  **Triage:** Gemini LLM analyzes the raw content to identify specific issues, assigning severity, category, and brand.
3.  **Sync:** Structured data is stored in PostgreSQL via a FastAPI backend.
4.  **Visualize:** A Next.js dashboard provides a real-time feed, risk charts, and timeline views of detected issues.

---

## 🏗️ Core Architecture

- **`frontend/`**: Next.js 15+ application (React 19, Tailwind CSS 4, Recharts, Lucide).
- **`backend/`**: FastAPI REST API (Python 3.13, SQLAlchemy 2.0, Alembic, PostgreSQL).
- **`crawler/`**: Python-based scraper and triage engine (Crawl4AI, Celery, Redis, Google Gemini Pro).
- **`nginx/`**: Reverse proxy for routing and SSL termination.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Language** | Python 3.13, TypeScript |
| **Frontend** | Next.js (App Router), Tailwind CSS v4, Recharts |
| **Backend** | FastAPI, Pydantic v2, SQLAlchemy 2.0 |
| **Database** | PostgreSQL 16 |
| **Cache/Queue** | Redis 7.2, Celery |
| **AI/LLM** | Google Gemini (GenAI SDK) |
| **Infrastructure** | Docker, Docker Compose, Nginx |

---

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Gemini API Key (Google AI Studio)
- NewsAPI Key (Optional, for Track B)

### Quick Start
1.  **Clone the repository** and navigate to the root directory.
2.  **Configure environment variables**:
    Create a `.env` file in the root (see `docker-compose.yml` for required keys):
    ```bash
    POSTGRES_PASSWORD=your_secure_password
    REDIS_PASSWORD=your_secure_password
    GEMINI_API_KEY=your_gemini_api_key
    NEWS_API_KEY=your_news_api_key
    ```
3.  **Launch the stack**:
    ```bash
    docker-compose up --build
    ```
4.  **Access the applications**:
    - Dashboard: `http://localhost:3000`
    - API Docs: `http://localhost:8000/docs`

---

## 📂 Project Structure

```text
.
├── backend/            # FastAPI source, models, migrations
├── crawler/            # Scrapers, LLM triage logic, Celery workers
├── frontend/           # Next.js source, components, dashboard
├── nginx/              # Nginx configuration
├── docker-compose.yml  # Local development orchestration
└── GEMINI.md           # This file (Agent Context)
```

---

## 🛠️ Development Conventions

### Backend (Python)
- Use **Poetry** for dependency management (`pyproject.toml`).
- Follow **FastAPI** best practices: Dependency injection, Pydantic schemas, and `async` handlers.
- Database migrations are managed by **Alembic**. Run `alembic upgrade head` after schema changes.

### Frontend (TypeScript)
- Use **Tailwind CSS v4** for styling (no `tailwind.config.js` needed, use CSS variables).
- Prioritize **Server Components** where possible; use `"use client"` only for interactive elements.
- Components should be modular and located in `src/components/`.

### Crawler
- Scrapers are located in `crawler/scrapers/`.
- Triage logic (LLM prompts) is in `crawler/triage.py`.
- New targets should be added to `crawler/core/targets.py`.

---

## 🤖 Agent Mandates

- **Security:** Never commit API keys or hardcode secrets. Use `.env` files.
- **Consistency:** Ensure the frontend adheres to the existing Tailwind 4 design system.
- **Validation:** When modifying models, always generate and verify an Alembic migration.
- **Testing:** When adding scrapers, verify they handle Markdown extraction correctly before passing to the LLM.
