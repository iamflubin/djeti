# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run prisma:generate

RUN npm run build

# ---- Stage 2: Runtime ----
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/node_modules/.prisma/ ./node_modules/.prisma/
COPY --from=builder /app/node_modules/@prisma/ ./node_modules/@prisma/

COPY --from=builder /app/dist ./dist
COPY prisma ./prisma


EXPOSE 3000
ENV NODE_ENV=production

CMD ["sh", "-c", "npm run prisma:deploy && npm run start"]
