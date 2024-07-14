# Base image
FROM node:18-alpine AS base

# Instalar dependências somente quando necessário
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar dependências baseado no gerenciador de pacotes preferido
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci --legacy-peer-deps; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Reconstruir o código-fonte somente quando necessário
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

#argumentos do servidor
ARG NEXT_TELEMETRY_DISABLED
ARG NODE_ENV
ARG DATABASE_URL
ARG EMAIL_SERVER_USER
ARG EMAIL_SERVER_PASSWORD
ARG EMAIL_SERVER_HOST
ARG EMAIL_SERVER_PORT
ARG EMAIL_FROM
ARG MIN_NUMBER
ARG MAX_NUMBER
ARG AWS_REGION
ARG AWS_S3_ACCESS_KEY
ARG AWS_S3_SECRET_ACCESS_KEY
ARG AWS_S3_BUCKET_NAME
ARG EMAIL_BACKUP

# Desativar a telemetria do Next.js durante a build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV DATABASE_URL=$DATABASE_URL
ENV EMAIL_SERVER_USER=$EMAIL_SERVER_USER
ENV EMAIL_SERVER_PASSWORD=$EMAIL_SERVER_PASSWORD
ENV EMAIL_SERVER_HOST=$EMAIL_SERVER_HOST
ENV EMAIL_SERVER_PORT=$EMAIL_SERVER_PORT
ENV MIN_NUMBER=$MIN_NUMBER
ENV MAX_NUMBER=$MAX_NUMBER
ENV AWS_REGION=$AWS_REGION
ENV AWS_S3_ACCESS_KEY=$AWS_S3_ACCESS_KEY
ENV AWS_S3_SECRET_ACCESS_KEY=$AWS_S3_SECRET_ACCESS_KEY
ENV AWS_S3_BUCKET_NAME=$AWS_S3_BUCKET_NAME
ENV EMAIL_BACKUP=$EMAIL_BACKUP

RUN \
  if [ -f yarn.lock ]; then npx prisma generate && yarn run build; \
  elif [ -f package-lock.json ]; then npx prisma generate && npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm prisma generate && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Imagem de produção, copiar todos os arquivos e executar o Next.js
FROM base AS runner
WORKDIR /app



# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1
# Verificar se o grupo e o usuário existem antes de criar
RUN getent group nodejs || addgroup --system --gid 1001 nodejs
RUN getent passwd nextjs || adduser --system --uid 1001 --ingroup nodejs nextjs

# Copiar arquivos e diretórios necessários da etapa builder
COPY --from=builder /app/public ./public

# Configurar permissões corretas para o cache de prerender
RUN mkdir -p .next
RUN chown -R nextjs:nodejs .next

# Leverage output traces para reduzir o tamanho da imagem
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# server.js é criado pelo next build a partir do output standalone
CMD ["node", "server.js"]