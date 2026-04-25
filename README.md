# Jet App

Base do sistema fullstack orientado por schema, preparado para evoluir para uma plataforma low-code offline-first.

## Visao geral

- Frontend: React + TypeScript + Tailwind CSS + PWA.
- Estado: Zustand.
- Formularios: React Hook Form.
- Validacao: Zod.
- Offline: IndexedDB com Dexie.js e Service Worker com Workbox.
- Backend: Node.js + TypeScript + NestJS.
- Banco: PostgreSQL.
- ORM: Prisma.

## Estrutura do repositório

- `frontend/` aplicativo React.
- `backend/` API NestJS.
- `shared/` contratos e artefatos compartilhados no futuro.
- `docs/` documentação complementar.
- `PROJECT_GUIDE.md` guia mestre de desenvolvimento.

## Como rodar o frontend

```powershell
cd frontend
npm install
npm run dev
```

## Estado atual

- Estrutura inicial do monorepo criada.
- Repositório Git inicializado e publicado em `main`.
- Frontend mínimo em andamento.

## Branch protection

O projeto ja possui base para CI no GitHub Actions. A proteção de `main` deve ser ativada no GitHub com exigencia de checks apos o primeiro fluxo de CI ficar disponivel.
