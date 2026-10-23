# GovMithra AI — AI Chatbot for Government Scheme Awareness

> **One chatbot. Every citizen. Every scheme.**
>
> An intelligent multilingual government scheme assistant for Indian citizens, powered by GLM-5.2 AI. Built for the GovMithra AI national-level hackathon project.

GovMithra AI helps citizens discover which government welfare schemes they may be eligible for, understand the benefits, required documents, and application steps — through a conversational AI interface that understands **Tamil, English, and Hindi** (including mixed Tanglish).

---

## ✨ Features

### Core Capabilities
- **GLM-5.2 Multilingual Chatbot** — Understands Tamil, English, Hindi and Tanglish queries. Responds in the citizen's selected language with structured scheme recommendations.
- **Deterministic Eligibility Engine** — Rule-based matching against the citizen profile, producing recommendation match scores (NOT official eligibility).
- **Government Scheme Database** — 18 structured prototype schemes across 9 categories (Agriculture, Education, Health, Women & Child, Employment, Housing, Financial, Senior Citizens, Disability).
- **Identity & Consent Flow** — Prototype verification (demo OTP `123456`) with a 4-stage flow: Profile → Consent → OTP → Verified. No Aadhaar data stored.
- **AgriMithra Agriculture Assistant** — Crop Doctor (GLM-5.2 Vision disease screening), Weather Advisory (live Open-Meteo API), Market Intelligence, Farmer scheme recommendations.

### Views
| View | Description |
|------|-------------|
| **Dashboard** | Citizen overview, hero, recommended schemes, weather, market |
| **AI Chatbot** | Multilingual conversational interface with quick prompts |
| **Government Schemes** | Searchable, filterable scheme explorer with detail dialogs |
| **My Profile** | Editable citizen profile that influences recommendations |
| **Eligibility** | Rule-based matching with filterable results |
| **Identity & Consent** | Prototype verification flow |
| **Agriculture Assistant** | AgriMithra — Crop Doctor, Weather, Market, Schemes |
| **Education / Health / Employment / Financial** | Category-specific scheme pages with tips |

---

## 🛠 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) + TypeScript 5 |
| **Styling** | Tailwind CSS 4 + shadcn/ui (New York) + Lucide icons |
| **Database** | Prisma ORM + SQLite |
| **AI** | GLM-5.2 via `z-ai-web-dev-sdk` (chat + vision) |
| **Weather** | Open-Meteo API (free, no key required) |
| **Icons** | Lucide React |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ / Bun
- A Z.ai API key (for GLM-5.2)

### 1. Install dependencies
```bash
bun install
```

### 2. Environment variables
Create a `.env` file in the project root:
```env
DATABASE_URL=file:./db/govmithra.db
# The Z.ai API key is read by the z-ai-web-dev-sdk automatically.
# Ensure ZAI_API_KEY is available in your environment.
```

See `.env.example` for reference.

### 3. Initialize the database
```bash
bun run db:push     # Create SQLite schema
bun run db:seed     # Seed 18 government schemes + demo citizen
```

### 4. Run the development server
```bash
bun run dev
```
The app runs on `http://localhost:3000`.

### 5. Preview
Open the app in the **Preview Panel** (or click "Open in New Tab"). The only user-visible route is `/`.

---

## 👤 Demo User

The app is pre-seeded with a demo citizen for the hackathon:

| Field | Value |
|-------|-------|
| Name | Arun Kumar |
| Age | 22 |
| State / District | Tamil Nadu / Tirunelveli |
| Occupation | Farmer |
| Annual Income | ₹1,80,000 |
| Land | 2 acres |
| Main Crop | Paddy |
| Language | English (switchable to Tamil/Hindi) |

### Demo Journey
1. Open the **Dashboard** — see recommended schemes (PM-KISAN, KCC, PM Fasal Bima, Soil Health Card)
2. Click **"Ask GovMithra AI"**
3. Ask: *"Enakku 2 acre paddy land irukku. Government la enna schemes kidaikum?"*
4. GLM-5.2 responds in **Tamil** with structured scheme recommendations
5. Open **Agriculture Assistant** → Crop Doctor → upload a crop image
6. Complete **Identity & Consent** (demo OTP: `123456`)

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Service health check |
| GET | `/api/profile` | Get demo citizen profile |
| PUT | `/api/profile` | Update citizen profile |
| GET | `/api/schemes` | List schemes (`?category=`, `?q=`) |
| GET | `/api/categories` | List categories with counts |
| POST | `/api/schemes/match` | Run eligibility engine |
| POST | `/api/chat` | GLM-5.2 chatbot (multilingual) |
| POST | `/api/verification/start` | Start verification (demo OTP) |
| POST | `/api/verification/confirm` | Confirm OTP (demo: `123456`) |
| GET | `/api/dashboard` | Aggregated dashboard data |
| GET | `/api/weather` | Weather (Open-Meteo) |
| GET | `/api/market` | Market intelligence |
| POST | `/api/agriculture/crop-disease` | Crop disease screening (GLM Vision) |

All responses use the envelope: `{ success: boolean, data?: T, error?: string }`

---

## 🔒 Security Considerations

- **API key safety** — The GLM API key is used only in backend code (`z-ai-web-dev-sdk`), never exposed to the frontend.
- **No sensitive identity storage** — Aadhaar numbers, OTPs, passwords, and biometric data are **never** collected or stored.
- **Input validation** — All API routes validate input via Pydantic-style checks; file uploads are validated for type and size (max 5MB).
- **Safe error messages** — Users never see raw stack traces.
- **CORS** — Configured via Next.js defaults.
- **Prototype disclaimers** — Every AI response and scheme recommendation includes a verification note directing users to official portals.

> **Production note:** The verification flow is a prototype. In production, integrate with authorised government identity APIs (DigiLocker, UIDAI) and implement real OTP delivery via an SMS gateway.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # REST API routes (12 endpoints)
│   │   ├── health/
│   │   ├── profile/
│   │   ├── schemes/ + match/
│   │   ├── categories/
│   │   ├── chat/
│   │   ├── verification/ (start + confirm)
│   │   ├── dashboard/
│   │   ├── weather/
│   │   ├── market/
│   │   └── agriculture/crop-disease/
│   ├── globals.css             # Green government theme
│   ├── layout.tsx
│   └── page.tsx                # Single-page app with view switching
├── components/
│   ├── govmithra/
│   │   ├── views/              # 9 view components
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── scheme-card.tsx
│   │   ├── info-cards.tsx      # WeatherCard, MarketCard
│   │   ├── state-cards.tsx     # Loading/Error/Empty/Skeleton
│   │   ├── nav-config.ts
│   │   └── icon.ts
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── ai.ts                   # GLM-5.2 chat service
│   ├── crop-disease.ts         # GLM Vision crop doctor
│   ├── eligibility-engine.ts   # Rule-based matching
│   ├── scheme-data.ts          # 18 scheme records
│   ├── weather.ts              # Open-Meteo adapter
│   ├── market.ts               # Market intelligence
│   ├── demo-user.ts            # Demo citizen helper
│   ├── db.ts                   # Prisma client
│   ├── seed.ts                 # Database seeder
│   └── api-utils.ts
├── services/
│   └── api.ts                  # Frontend API service layer
└── types/
    └── index.ts                # Shared TypeScript types

prisma/
└── schema.prisma               # User, Scheme, ChatSession, etc.
```

---

## ⚠️ Disclaimers

- **Prototype** — GovMithra AI is a hackathon prototype for demonstration purposes.
- **Educational scheme data** — Scheme records are prototype/educational. Final eligibility **must** be verified through official government portals.
- **No guarantees** — The AI never claims guaranteed eligibility. Match scores are recommendations only.
- **No real identity verification** — The OTP flow uses a fixed demo code (`123456`). No real OTP is sent.

---

## 🧪 Verification

Run lint:
```bash
bun run lint
```

The app has been verified end-to-end:
- ✅ Dashboard renders with live data
- ✅ GLM-5.2 chatbot responds in Tamil/English/Hindi
- ✅ Eligibility engine produces correct matches
- ✅ Verification flow completes and persists
- ✅ Weather API (Open-Meteo) returns live data
- ✅ Market intelligence displays
- ✅ Responsive on mobile and desktop

---

**GovMithra AI** — Empowering every Indian citizen with AI-driven scheme awareness. 🇮🇳
