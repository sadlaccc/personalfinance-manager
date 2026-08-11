# ---------- Stage 1: install all dependencies (incl. dev) ----------
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# ---------- Stage 2: build the app ----------
FROM node:22-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ---------- Stage 3: production runtime ----------
FROM node:22-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/app.cjs ./app.cjs
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "app.cjs"]
