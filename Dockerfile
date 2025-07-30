FROM node:22

# Declare build-time arguments
ARG VITE_REDIRECT_URI
ARG VITE_GITHUB_CLIENT_SECRET
ARG VITE_GITHUB_CLIENT_ID
ARG VITE_ADMIN_EMAIL

# 앱 경로
WORKDIR /app

# 패키지 설치
COPY package.json package-lock.json ./
RUN npm ci

# 나머지 복사
COPY . .

# Prisma 클라이언트 생성
RUN npx prisma generate

# Set environment variables for build step
ENV VITE_REDIRECT_URI=$VITE_REDIRECT_URI
ENV VITE_GITHUB_CLIENT_SECRET=$VITE_GITHUB_CLIENT_SECRET
ENV VITE_GITHUB_CLIENT_ID=$VITE_GITHUB_CLIENT_ID
ENV VITE_ADMIN_EMAIL=$VITE_ADMIN_EMAIL

# SvelteKit 빌드
RUN npm run build

# SQLite 파일이 여기에 마운트될 예정 (volumes)
VOLUME ["/app/prisma"]

# 앱 실행
CMD ["node", "build"]
