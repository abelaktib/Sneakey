# Sneakey — Starter

Mono-repo pnpm avec :
- **apps/web** (Next.js + Prisma + Stripe)
- **apps/agent** (Tauri/Rust)

## Démarrage rapide
1) Installe Node 18+, pnpm 9+, Rust stable, PostgreSQL 15+, Redis 7
2) `cd apps/web && cp .env.example .env && pnpm i && pnpm prisma migrate dev && pnpm dev`
3) `cd ../../apps/agent/src-tauri && cargo run`

Voir docs détaillées dans le projet.