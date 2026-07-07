# BidRank.pro

**AI-Powered Federal RFP Analysis for Small Business Contractors**

BidRank analyzes government RFPs in minutes — giving 8(a), HUBZone, SDVOSB, and WOSB contractors instant compliance checks, risk scoring, and actionable insights without the consultant fees.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Auth**: Better Auth
- **Database**: PostgreSQL (Neon) via Prisma ORM
- **AI**: Google Gemini
- **Payments**: FastSpring
- **Email**: Resend
- **Runtime**: Bun

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/oussamaboudraa2017-blip/bidrank-pro.git
cd bidrank-pro
bun install
```

### 2. Environment Variables

```bash
cp .env.example .env
# Fill in your values in .env
```

Required variables:
- `DATABASE_URL` + `DIRECT_URL` — Neon PostgreSQL connection strings
- `BETTER_AUTH_SECRET` — Strong random string (generate with `openssl rand -base64 32`)
- `BETTER_AUTH_URL` — Your app URL (`http://localhost:3000` for dev)
- `GEMINI_API_KEY` — Google AI Studio API key

### 3. Database Setup

```bash
bun run db:push       # Push schema to database
bun run db:generate   # Generate Prisma client
```

### 4. Run Development Server

```bash
bun run dev
# App available at http://localhost:3000
```

---

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start dev server on port 3000 |
| `bun run build` | Production build |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run db:push` | Push Prisma schema to database |
| `bun run db:migrate` | Run database migrations |
| `bun run db:generate` | Generate Prisma client |

---

## Project Structure

```
src/
├── app/
│   ├── (main)/        # Public marketing pages (homepage, pricing, etc.)
│   ├── (auth)/        # Sign-in / Sign-up pages
│   ├── (admin)/       # Admin dashboard
│   ├── (onboarding)/  # User onboarding flow
│   └── api/           # API routes
├── components/
│   ├── bidrank/       # App-specific components
│   └── ui/            # shadcn/ui primitives
└── lib/               # Utilities, auth config, DB client
prisma/
└── schema.prisma      # Database schema
```

---

## Environment Variables

Never commit your `.env` file. Use `.env.example` as a template. See the full list of required variables in `.env.example`.

---

## Deployment

The app is deployed on a VPS using Bun as the runtime. The production build produces a Next.js standalone output.

```bash
bun run build   # Builds to .next/standalone/
bun run start   # Starts the production server
```

---

## License

Private — All rights reserved.
