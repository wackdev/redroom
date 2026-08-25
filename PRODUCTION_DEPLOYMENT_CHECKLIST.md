# WHYNOTUPSC — Production Deployment & Launch Protocol

## 1. System Overview
**WHYNOTUPSC** is a high-performance responsive web application built for UPSC Civil Services Examination aspirants across Desktop, Laptop, Tablet, and Mobile browsers.

- **Primary URL**: Production Domain (Vercel / Custom Domain)
- **Framework**: Next.js 16 (App Router + Webpack Bundler)
- **UI & Aesthetics**: Tailwind CSS v4, Glassmorphism, Dark Mode Matrix (#030305, #12091F, #D8A63A)
- **Database Engine**: PostgreSQL (Supabase) with Client-Side Offline Dexie (IndexedDB)
- **AI Intelligence**: Multi-Provider Fallback (DeepSeek V3 / Qwen 2.5 72B / Llama 3.3 70B / Mistral 24B)
- **Telemetry & Sync**: Realtime custom events + Atomic `mutateWithOutbox` sync

---

## 2. Pre-Deployment Checklist

### A. Environment Configuration
Verify that the following environment variables are securely configured in your deployment platform:

```env
# SUPABASE DATABASE & AUTH
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# AI PROVIDER API KEYS (Cascading Fallback Chain)
OPENROUTER_API_KEY=sk-or-v1-...
GROQ_API_KEY=gsk_...
HUGGINGFACE_API_KEY=hf_...
GEMINI_API_KEY=AIzaSy...

# TELEGRAM BOT & NOTIFICATION DISPATCH (Optional)
TELEGRAM_BOT_TOKEN=123456789:ABCdef...
ADMIN_TELEGRAM_CHAT_ID=987654321
ADMIN_TELEGRAM_USERNAME=UPSCAdmin

# APP CONFIGURATION
NEXT_PUBLIC_APP_URL=https://whynotupsc.com
NEXT_PUBLIC_APP_NAME="WHYNOTUPSC"
```

### B. Database Migrations
1. Run `supabase/full_production_schema.sql` on the PostgreSQL instance.
2. Verify Row-Level Security (RLS) is active on:
   - `user_profiles` (Owner access only)
   - `study_plans` (Owner access only)
   - `test_results` (Owner access only)
   - `revision_items` (Owner access only)
   - `notes` (Owner access only)
   - `admin_broadcasts` (Public Read, Admin Write)
3. Execute dataset seed:
   ```bash
   npm run seed
   ```

---

## 3. Production Deployment Execution

### Step 1: Quality Gate Verification
Ensure local validation passes with zero errors:
```bash
# 1. Zero Lint Warnings or Errors
npm run lint

# 2. Complete Type Safety Check
npm run typecheck

# 3. Comprehensive Domain Test Suite (5/5 Engines)
npm run test

# 4. Optimized Webpack Bundle Compilation
npm run build:webpack
```

### Step 2: Deployment Push
```bash
git add .
git commit -m "chore(release): WHYNOTUPSC Production Release v1.0.0"
git push origin main
```

---

## 4. Post-Deployment Verification Matrix

| Area | Verification Step | Expected Result |
| :--- | :--- | :--- |
| **Authentication** | Guest signup and login | JWT generated, profile created in Supabase & local Dexie |
| **WhyNotUPSC Brain** | Initial load for new cadet | Displays "Your preparation profile is being built." with 3 starter actions |
| **Focus Sanctuary** | Launch 25-min Pomodoro timer, lock screen, unlock | Timer remains 100% accurate with zero drift via timestamp delta |
| **PYQ Arena** | Filter 2023 Polity questions, eliminate 2 options | Probability recalculates to 50% "Favorable (Take Guess)" |
| **Current Affairs** | Open daily editorial | 07:00 AM brief renders with Prelims Eliminators & Audio briefs |
| **SM-2 Spaced Revision**| Rate flashcard difficulty (1 to 5) | Interval recalculates via SuperMemo SM-2 formula |
| **Mobile Browser** | Open on 320px–390px iPhone/Android | Full touch responsiveness, >44px touch targets, zero horizontal scroll |
| **Offline Resilience** | Disconnect Wi-Fi, take mock test, reconnect | Test saved in Dexie `sync_outbox` and automatically synced to cloud |

---

## 5. Rollback Procedure
If critical runtime exceptions occur in production:
1. Revert to previous deployment tag in Vercel / Hosting dashboard.
2. In git:
   ```bash
   git revert HEAD
   git push origin main
   ```
3. Database changes are additive and backward-compatible.
