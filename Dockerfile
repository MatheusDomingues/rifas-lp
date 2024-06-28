# Base image
FROM node:18-alpine AS base

# Instalar dependências somente quando necessário
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /src/app

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
WORKDIR /src/app
COPY --from=deps /src/app/node_modules ./node_modules
COPY . .

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Imagem de produção, copiar todos os arquivos e executar o Next.js
FROM base AS runner
WORKDIR /src/app

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1
# Verificar se o grupo e o usuário existem antes de criar
RUN getent group nodejs || addgroup --system --gid 1001 nodejs
RUN getent passwd nextjs || adduser --system --uid 1001 --ingroup nodejs nextjs

# Copiar arquivos e diretórios necessários da etapa builder
COPY --from=builder /src/app/public ./public

# Configurar permissões corretas para o cache de prerender
RUN mkdir -p .next
RUN chown -R nextjs:nodejs .next

# Leverage output traces para reduzir o tamanho da imagem
COPY --from=builder --chown=nextjs:nodejs /src/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /src/app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# server.js é criado pelo next build a partir do output standalone
CMD ["node", "server.js"]