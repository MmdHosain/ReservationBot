# 🗓️ Multi-Platform Reservation Bot

An enterprise-ready, modular multi-platform reservation and salon management bot system supporting **Bale**, **Telegram**, and **Instagram**, backed by **PostgreSQL** and **TypeORM**.

![CI/CD Pipeline](https://github.com/MmdHosain/ReservationBot/actions/workflows/ci.yml/badge.svg)
![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)
![Node: v20+](https://img.shields.io/badge/Node-v20+-green.svg)
![Docker: Ready](https://img.shields.io/badge/Docker-Ready-blue.svg)

---

## 🏛️ System Architecture

```text
                      ┌────────────────────────────────────────┐
                      │          Unified Core Domain           │
                      │  (TypeORM DB, Appointments, Calendars, │
                      │   Services, Organization Management)   │
                      └──────────────────┬─────────────────────┘
                                         │
                 ┌───────────────────────┼───────────────────────┐
                 ▼                       ▼                       ▼
       ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
       │   Bale Adapter   │    │ Telegram Adapter │    │Instagram Adapter │
       │ (tapi.bale.ai)   │    │  (Official API)  │    │  (Graph Webhook) │
       │                  │    │                  │    │                  │
       │  STATUS: ACTIVE  │    │ STATUS: DORMANT  │    │ STATUS: DORMANT  │
       │ (ENABLE_BALE=on) │    │(ENABLE_TG=off)   │    │(ENABLE_IG=off)   │
       └──────────────────┘    └──────────────────┘    └──────────────────┘
```

### Key Architectural Highlights
- **Multi-Platform Identity Isolation**: Dedicated identifiers (`bale_id`, `telegram_id`, `instagram_id`) on a unified user model prevent ID collisions across channels.
- **Resource Efficiency**: Inactive adapters remain completely dormant (no unnecessary long-polling loops or opened HTTP listener ports).
- **Dual Calendar Engine**: Dynamic Shamsi (Jalali) and Gregorian booking slot calculation and localized date formatting.
- **Unified Multi-Tenant Core**: Multi-business vocabulary dictionary and role-based permissions (Salon Managers, Staff, Customers).

---

## 📁 Repository Structure

```text
reservation_bot/
├── .github/workflows/       # GitHub Actions CI/CD pipeline
├── src/
│   ├── config/              # Centralized environment & platform flags
│   ├── core/                # Platform-agnostic utilities (Calendar, Stage, Cron)
│   ├── db/                  # TypeORM DataSource, Entities & Repositories
│   ├── features/            # Business scenes (Manager, Customer, Profile, Admin)
│   └── platforms/           # Channel-specific adapters
│       ├── bale/            # Bale messenger adapter (tapi.bale.ai)
│       ├── telegram/        # Telegram Bot API adapter
│       └── instagram/       # Instagram Webhook & Graph API adapter
├── bot.ts                   # Application entry point orchestrating adapters
├── docker-compose.yml       # Production-ready multi-container orchestration
├── Dockerfile               # Node 20 container image build definition
└── package.json             # Root dependency management
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v20 or higher
- **PostgreSQL**: v15 or higher (or use Docker)
- **Docker & Docker Compose** (optional, recommended for production)

### 2. Installation
```bash
git clone https://github.com/MmdHosain/ReservationBot.git
cd ReservationBot
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

```dotenv
# ==========================================
# 🚀 PLATFORM ACTIVATION TOGGLES
# ==========================================
ENABLE_BALE=true
ENABLE_TELEGRAM=false
ENABLE_INSTAGRAM=false

# ==========================================
# 🟢 BALE CONFIGURATION (ACTIVE)
# ==========================================
BALE_BOT_TOKEN=your_bale_bot_token
BALE_API_ROOT=https://tapi.bale.ai

# ==========================================
# 🗄️ DATABASE (PostgreSQL)
# ==========================================
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_db_password
DB_NAME=my_telegram_bot
```

### 4. Running the Bot

#### Local Development:
```bash
# Run unit tests
npm test

# Start the bot
npm run start

# Watch mode
npm run dev
```

#### Running with Docker:
```bash
# Build and start all services (Bot + PostgreSQL)
docker compose up -d --build

# View live container logs
docker compose logs -f app

# Stop services
docker compose down
```

---

## 🔄 CI/CD Pipeline

The project includes an automated GitHub Actions CI/CD pipeline configured at `.github/workflows/ci.yml`:

1. **Continuous Integration (CI)**:
   - Automated unit tests via **Vitest** on Node.js 20.
   - Multi-stage **Docker Build Verification** to ensure container image consistency.
2. **Continuous Deployment (CD)**:
   - Automated deployment to remote servers via SSH when commits are merged into `main`.
   - Supports zero-downtime containerized updates (`docker compose up -d --build`).

---

## 📜 License

This project is licensed under the [ISC License](LICENSE).
