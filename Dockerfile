# syntax = docker/dockerfile:1

# Stage 1: Build the Node.js frontend
ARG NODE_VERSION=20.15.0
FROM node:${NODE_VERSION}-slim as node-build

LABEL fly_launch_runtime="Node.js"

WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install node modules
COPY ["package*.json", "./"]
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Build application
RUN npm run build

# Stage 2: Set up the Python backend
FROM python:3.8-slim as python-base

# Set the working directory for Flask
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy Python application files
COPY water.py .

# Stage 3: Combine Node.js and Python environments
FROM python:3.8-slim

# Set the working directory
WORKDIR /app

# Copy the built Node.js application
COPY --from=node-build /app /app

# Copy the Python environment and application
COPY --from=python-base /app /app

# Install Node.js for running the frontend
RUN apt-get update -qq && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Set environment variables
ENV NODE_ENV="production"
ENV FLASK_APP=water.py

# Expose the ports
EXPOSE 3000
EXPOSE 5000

# Command to run both servers (Node.js frontend and Flask backend)
CMD ["sh", "-c", "npm run start & gunicorn -b 0.0.0.0:5000 water:app"]
