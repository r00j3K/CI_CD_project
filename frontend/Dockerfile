FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --silent

COPY . .

RUN npm run build

FROM nginx:alpine AS runner

LABEL maintainer="themarcos"
LABEL description="MedApp - Frontend React"
LABEL version="1.0.0"


COPY --from=builder /app/dist /usr/share/nginx/html


COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider \
    http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]