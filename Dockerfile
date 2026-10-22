# ---------- Stage 1: build the React app ----------
FROM node:24-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Stage 2: serve the built files with nginx ----------
FROM nginxinc/nginx-unprivileged:stable-alpine

# Files in /etc/nginx/templates/ get ${VARIABLES} replaced at startup
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

# Default backend address inside Kubernetes (the API Service name)
ENV API_URL=http://task-manager-api:5000

EXPOSE 8080