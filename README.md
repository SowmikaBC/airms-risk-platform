# AIRMS â€” AI-Powered Risk Intelligence & Management Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-blue.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-cyan.svg)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6.svg)](https://www.typescriptlang.org)

**AIRMS** is an enterprise-grade AI Risk Platform designed for modern engineering, product, and compliance teams. It delivers continuous risk telemetry, predictive signal calibration, explainable risk scoring, and a conversational AI risk officer copilot.

---

## ðŸŒŸ Key Features

### 1. Executive Risk Dashboard (`/`)
- **Real-Time KPIs**: Track total risks, critical exposures, average risk posture score, and resolution velocity.
- **7-Week Exposure & Incident Timeline**: Interactive vector chart showing risk scores plotted against incident frequencies.
- **Severity Mix Distribution**: Color-coded progress metrics for Critical, High, Medium, and Low bands.
- **Live Intelligence Feed**: Real-time alerts with one-click "Mark as Read" acknowledgment.
- **Priority Watchlist**: High-risk items surfaced for instant triage.

### 2. Live Risk Register (`/risks`)
- **Multi-Factor Search & Filtering**: Instant full-text search across titles, descriptions, categories, and owners.
- **Severity & Status Selectors**: Filter by Critical / High / Medium / Low and Open / Under review / Accepted / Resolved.
- **Trend Indicators**: Live direction arrows ($\uparrow$ Increasing, $\rightarrow$ Stable, $\downarrow$ Decreasing).

### 3. Risk Detail & Explainability (`/risks/:id`)
- **Radial Score Dial**: Dynamic gauge displaying calibrated score (0â€“100) and severity color coding.
- **Explainability Readout**: Plain-language breakdown ("Why AIRMS Flagged This") linking causal events to scores.
- **Accountable Owner Assignment**: Editable and persistent owner allocation.
- **Evidence Trail**: Event telemetry logging milestone slips, utilization spikes, and defect counts.

### 4. Signal Lab / Detect Risk (`/detect`)
- **Simulation & Ingestion Form**: Input narrative conditions, probability (1â€“5), impact (1â€“5), known incidents, budget burn %, and schedule completion %.
- **Calibrated AI Scoring**: Computes score, severity rating, confidence percentage, and recommended control actions.
- **Automated Register Ingestion**: Instantly saves the assessed signal into the live register.

### 5. Analytics & Risk Heatmap Matrix (`/analytics`)
- **5Ã—5 Probability vs. Impact Heatmap**: Color-coded risk matrix placing active risks in appropriate severity quadrants.
- **Category Breakdown**: Proportionate distribution of risk across Delivery, Technology, Compliance, Third party, Financial, and People.
- **Resolution Ratio**: Interactive donut visualization showing active vs. resolved/accepted posture.

### 6. AIRMS Copilot (`/assistant`)
- **Context-Aware AI Assistant**: Ask free-form questions about current exposures, delivery blockers, and ownership.
- **Evidence Sourcing**: Responses cite specific register items (e.g. `R-101 Northstar API migration`) and telemetry streams.
- **Dual AI Engine**: Supports Google Gemini API (`gemini-2.5-flash`), OpenAI API, or the built-in heuristic intelligence engine.

---

## ðŸ—ï¸ Architecture & Technology Stack

```
airms-risk-platform/
â”œâ”€â”€ client/                     # Frontend (React 18 + TypeScript + Vite)
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ components/         # Modular UI widgets (Charts, Matrix, Sidebar, Badges)
â”‚   â”‚   â”œâ”€â”€ pages/              # Overview, Register, Detail, Detect, Analytics, Assistant
â”‚   â”‚   â”œâ”€â”€ lib/                # API client (TanStack Query) & utility functions
â”‚   â”‚   â”œâ”€â”€ App.tsx             # Route configuration (Wouter) & Layout
â”‚   â”‚   â”œâ”€â”€ index.css           # Custom theme & Tailwind directives
â”‚   â”‚   â””â”€â”€ main.tsx            # React application entry point
â”‚   â””â”€â”€ public/
â”œâ”€â”€ server/                     # Backend (Node.js + Express + TypeScript)
â”‚   â”œâ”€â”€ index.ts                # Express server initialization & static serving
â”‚   â”œâ”€â”€ routes.ts               # REST API endpoints
â”‚   â”œâ”€â”€ storage.ts              # In-memory storage with initial enterprise seed data
â”‚   â”œâ”€â”€ ai.ts                   # Risk scoring formulas & Copilot LLM/heuristic engine
â”‚   â””â”€â”€ types.ts                # Shared TypeScript models and interfaces
â”œâ”€â”€ package.json                # Project dependencies and npm scripts
â”œâ”€â”€ tsconfig.json               # TypeScript configuration with path aliases
â”œâ”€â”€ vite.config.ts              # Vite bundling & proxy configuration
â””â”€â”€ tailwind.config.js          # Design system & color tokens
```

---

## ðŸš€ Step-by-Step Setup & Running Locally

### Prerequisites
- **Node.js**: Version 18.0.0 or higher
- **npm** / **pnpm** / **yarn**

### 1. Clone or Navigate to the Repository
```bash
cd airms-risk-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables (Optional)
Copy the example environment file:
```bash
cp .env.example .env
```
*(Optional)* Add your Google Gemini API Key or OpenAI Key to `.env` to enable live LLM synthesis:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```
> **Note**: If no API key is supplied, AIRMS operates with its built-in rule-based AI engine out of the box.

### 4. Run in Development Mode
Start both backend and frontend concurrently:
```bash
npm run dev
```
Open your browser at **`http://localhost:5000`** (or `http://localhost:5173` if running Vite standalone).

### 5. Build for Production
```bash
npm run build
npm start
```

---

## ðŸ“¡ REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard/summary` | Returns high-level metrics, risk counts, and average score |
| `GET` | `/api/dashboard/trends` | Returns 7-week exposure & incident timeline data |
| `GET` | `/api/risks` | Fetch all risks (Supports `?search=`, `?severity=`, `?status=`, `?category=`) |
| `GET` | `/api/risks/:id` | Fetch specific risk details by ID |
| `PATCH`| `/api/risks/:id` | Update risk fields (status, owner, probability, etc.) |
| `POST` | `/api/risks` | Create a new risk entry manually |
| `POST` | `/api/risks/analyze` | AI Signal Detection: scores input conditions & adds to register |
| `GET` | `/api/alerts` | Fetch list of active risk alerts |
| `PATCH`| `/api/alerts/:id/read` | Mark an alert as read |
| `POST` | `/api/assistant/ask` | Query the AIRMS Copilot AI |

---

## ðŸ“¤ Step-by-Step Guide to Upload to GitHub

Follow these exact steps to publish this project to your GitHub account:

### Step 1: Create a New Repository on GitHub
1. Log in to [GitHub](https://github.com).
2. Click the **`+`** icon in the top-right corner and select **New repository**.
3. Name your repository (e.g., `airms-risk-platform`).
4. Choose **Public** or **Private**.
5. **Do not** check "Initialize this repository with a README" (we already have a complete one).
6. Click **Create repository**.

### Step 2: Initialize Git and Push from Terminal
In your terminal, inside the `airms-risk-platform` folder, run:

```bash
# 1. Initialize Git repository
git init

# 2. Add all files to staging
git add .

# 3. Commit the codebase
git commit -m "feat: Initial release of AIRMS Risk Intelligence Platform"

# 4. Set default branch to main
git branch -M main

# 5. Link your GitHub remote repository (replace with your GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/airms-risk-platform.git

# 6. Push code to GitHub
git push -u origin main
```

---

## ðŸŒ Deploying to Hosting Platforms

### Deploying to Render / Railway / Replit
1. Connect your GitHub repository.
2. Set Build Command: `npm install && npm run build`
3. Set Start Command: `npm start`
4. Set Environment Variable: `NODE_ENV=production`, `PORT=5000` (and optionally `GEMINI_API_KEY`).

---

## ðŸ“„ License
This project is open-source and available under the [MIT License](LICENSE).
