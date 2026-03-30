#!/bin/bash
# Temporary node test
cat << 'DOCKERFILE' > frontend/Dockerfile.test
FROM node:20-slim
WORKDIR /app
RUN echo "hello"
DOCKERFILE
cd frontend
docker build -f Dockerfile.test -t temp .
