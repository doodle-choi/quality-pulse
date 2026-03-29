# Quality Pulse: AI-Driven Product Quality & Safety Monitor

Quality Pulse is an advanced, automated system designed to monitor, scrape, and analyze product quality and safety issues (recalls, lawsuits, defects, hazards) across global sources. It leverages LLMs (Gemini) to triage unstructured web data into structured, actionable insights displayed on a real-time dashboard. The platform acts as a comprehensive **"Digital Command Center,"** pairing thread-based issue tracking with deep data analysis, complex interactive visualizations (via Apache ECharts), and strategic insight generation.

## 🌟 Project Overview

The system operates on a "Two-Track" intelligence gathering model:
- **Track A (HTML/Markdown):** Deep scraping of specific regulatory sites (e.g., CPSC) using `crawl4ai` and Playwright. Content is converted to Markdown and analyzed by Gemini for issue extraction.
- **Track B (API Aggregators):** Real-time monitoring of global news and crisis events via NewsAPI and GDELT.

### Key Workflows:
1.  **Crawl:** Scheduled workers (Celery) trigger scrapers to fetch data.
2.  **Triage:** Gemini LLM analyzes the raw content to identify specific issues, assigning severity, category, and brand.
3.  **Sync:** Structured data is stored in PostgreSQL via a FastAPI backend.
4.  **Visualize & Analyze:** A Next.js dashboard provides a real-time feed, risk charts, and timeline views. A mandatory Light/Dark mode toggle supports both bright "Analytical" and dark "Command Center" environments. **Force-dynamic** rendering ensures data freshness on every visit.

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
| **Frontend** | Next.js 15 (App Router), Tailwind CSS v4, Apache ECharts (`echarts-for-react`) |
| **Backend** | FastAPI, Pydantic v2, SQLAlchemy 2.0 |
| **Database** | PostgreSQL 16 |
| **Cache/Queue** | Redis 7.2, Celery |
| **AI/LLM** | Google Gemini (GenAI SDK) |
| **Development** | Antigravity, Stitch, Gemini CLI, Jules |
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
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD="your_secure_password" # Use quotes for special characters like #
    POSTGRES_DB=qualitypulse
    REDIS_PASSWORD="your_secure_password"
    GEMINI_API_KEY=your_gemini_api_key
    INTERNAL_API_KEY="your_secure_internal_key" # Required for component sync
    NEWS_API_KEY=your_news_api_key
    DOMAIN_NAME=doodle-choi.me
    ```
3.  **Launch the development stack**:
    ```bash
    docker-compose up --build -d
    ```
4.  **Access the applications**:
    - Dashboard: `http://localhost:3000`
    - API Docs: `http://localhost:8000/docs`

---

## ⚙️ Operations & Deployment

For detailed operational guidelines, production deployment instructions, and troubleshooting, please refer to [OPERATIONS.md](OPERATIONS.md).

### Production Environment (HTTPS Enabled)

The production environment uses `docker-compose.prod.yml`, which includes Nginx for routing and Certbot for automatic SSL/HTTPS certificate management.

**Start Production Stack:**
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

*(Note: For initial setup, you must run the `init-letsencrypt.sh` script. See Operations doc for details).*

### Viewing Logs
```bash
# View all logs
docker-compose logs -f

# View logs for a specific service
docker-compose logs -f crawler
```

---

## 📂 Project Structure

```text
.
├── backend/            # FastAPI source, models, migrations
├── crawler/            # Scrapers, LLM triage logic, Celery workers
├── frontend/           # Next.js source, components, dashboard, interactive charts
├── nginx/              # Nginx configuration
├── docker-compose.yml       # Local development orchestration
├── docker-compose.prod.yml  # Production orchestration
├── DESIGN.md           # Core visual design and component architecture ("The Digital Command Center")
├── GEMINI.md           # Agent Context
└── OPERATIONS.md       # Runbook & Operations Guide
```
