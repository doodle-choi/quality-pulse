# Backend Dockerfile (FastAPI)
FROM python:3.13-slim AS builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install poetry
RUN pip install poetry

# Copy project files
COPY pyproject.toml poetry.lock ./

# Configure poetry to NOT create a virtual environment
RUN poetry config virtualenvs.create false \
    && poetry install --no-root --no-interaction --no-ansi

# Final stage
FROM python:3.13-slim

WORKDIR /app

# Install dynamic runtime dependencies (libpq for psycopg2)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy from builder
COPY --from=builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

COPY . .

# Environment defaults (can be overridden by .env/compose)
ENV PORT=8000
ENV HOST=0.0.0.0

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
