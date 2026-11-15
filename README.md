# FLUX — Personal Life & Engineering OS

> **An opinionated, local-first, zero-cost Personal Operating System engineered for B.Tech students and builders—turning proven behavioral science, cognitive psychology, and book frameworks into executable daily software protocols.**

- **Live Web App (PWA):** [https://shrishailamaganoor-creator.github.io/FLUX-OS/](https://shrishailamaganoor-creator.github.io/FLUX-OS/)
- **Repository:** [https://github.com/shrishailamaganoor-creator/FLUX-OS](https://github.com/shrishailamaganoor-creator/FLUX-OS)
- **Architecture:** React 19 + TypeScript + Vite + Tailwind CSS v4 (plus precompiled static bundle in `./compiled/`)
- **Persistence:** 100% Local-First (`localStorage` + `IndexedDB`) · Zero Backend · Zero Cloud Database · `$0` Operating Cost
- **Offline & Installable:** Progressive Web App (`manifest.webmanifest`, clean installed app title **`FLUX`**, Network-First Service Worker `sw.js` `flux-v3.1.0`, and smart single-button device installer in **System Core**)
- **Design System:** 2 Calibrated Engineering Themes (`Direction A: Obsidian Precision`, `Direction B: Editorial Paper`)

---

## 1. Product Thesis

Most student productivity tools are passive containers—blank note pages or generic to-do lists that decay within a week because they lack **behavioral scaffolding**.

**FLUX** is built on a different premise: **every module translates a battle-tested mental model, cognitive psychology principle, or book framework into an interactive, deterministic software protocol.** Instead of asking you to remember habits, study schedules, or spending rules, the OS encodes those rules directly into the interface—complete with live math, tactile Web Audio feedback, XP/level telemetry (`1200 × L^1.65`), and zero-latency local storage.

---

## 2. Core Philosophy: From Book Principles to Working Protocols

| Book / Mental Model | Author / Thinker | Target Module in FLUX | Executable Software Protocol & Mechanism |
| :--- | :--- | :--- | :--- |
| ***Getting Things Done (GTD)*** & **The Zeigarnik Effect** | David Allen & Bluma Zeigarnik | **Today (`01 // Telemetry Workbench`)** & **Global Command Palette (`⌘K`)** | *"Your mind is for having ideas, not holding them."* **02 // Instant Telemetry Capture** omnibox logs Missions, Expenses (`₹`), Income (`₹`), or Courses in one keystroke. **Top 3 Daily Priorities** (`0/3 LOCKED`) and the **Priority Mission Queue** (`SLOT.01–03 // IDLE`) close open cognitive loops. |
| ***Atomic Habits*** | James Clear | **Habit Design (`15 // Habit Design & Identity Lab`)** & **Habit Matrix (`11 // Habit Matrix`)** | **100-Vote Identity Bars** (*"I am someone who..."*, `0–100 VOTES`), **Habit Stacking Builder** (*"After I [ANCHOR], I will [NEW HABIT], in [PLACE]"*), **2-Minute Gateway Rule**, **Daily Habit Scorecard** (`+` / `=` / `-`), **"Never Miss Twice" Alert** when yesterday was missed, and **Purple Rest Shield** (`#A855F7`) to protect streaks on exam or recovery days. |
| ***Outliers* & Deliberate Practice (The 10,000-Hour Rule)** | Malcolm Gladwell & K. Anders Ericsson | **Habit Matrix (`03 // Consistency Compounding Engine`)** | Converts daily input (`MIN/D` or `HRS/D`) over any horizon (`DAYS`, `MONTHS`, `YEARS`) into cumulative hours, **40-Hour Work Weeks**, **Pure 24-Hour Days**, percentage toward the **10,000-Hour Mastery Benchmark**, and a 1Y / 2Y / 3Y / 5Y / 10Y compounding table. |
| ***Deep Work* & Cognitive Containment** | Cal Newport | **Today (`04 // Deep Work Focus Engine`)** & **Focus Discipline (`20 // Focus Discipline`)** | **Circular SVG Cycle Dial** (`15m / 25m / 50m / 90m` protocols), **Calibrated 7-Day Vertical Gauge Matrix** with direct `+25m / +50m / +90m` session logging, **10-Minute Impulse & Urge Delay Timer** (+10 XP for waiting out a distraction urge), **4-Step Daily Shutdown Ritual**, and **Root-Cause Distraction Telemetry** tracking both trigger (`Boredom`, `Stress`, `Avoidance`, `Habit`, `Notification`) and *"What I Was Avoiding"*. |
| **The Feynman Technique & Forgetting Curve Spaced Repetition** | Richard Feynman & Hermann Ebbinghaus | **Learning Engine (`21 // Learning Engine`)** & **Study Vault (`16 // Study Vault`)** | **ELI12 Synthesis Composer** (*Explain Like I'm 12* in plain language + explicit *Gaps I Found*), graded `Confusing` → `Getting there` → `Mastered` (+20 XP). **1-3-7 Spaced Revision Matrix** auto-schedules reviews at `+1`, `+3`, and `+7` days on creation, paired with an **Active Recall Quiz Engine** that surfaces your highest-miss-rate questions. |
| ***The Psychology of Money* & Mental Accounting** | Morgan Housel & Richard Thaler | **Wallet Hub (`03 // My Wallet & Ledger` + `03B // Pay Yourself First`)** | **Wallet Hub Switcher** combining daily campus survival telemetry with the **"Pay Yourself First" Allocator** (auto-calculates savings cut % and transfers to target Savings Pots), **Safe-to-Spend-Today Ceiling** (`Remaining Monthly Budget ÷ Days Left in Month`), **Survival Runway** (`Liquid Pool ÷ Avg Daily Spend`), and the **Hostel Maggi Waste Index** (converts weekly `"Waste"`-tagged expenses into plates of ₹40 hostel Maggi). |
| **Type 1 vs. Type 2 Decisions (Reversible vs. Irreversible)** | Jeff Bezos | **Executive Lab (`18 // Executive Function & Decision Matrix`)** | **2×2 Executive Decision Matrix** crossing *Important vs. Not Important* with *Irreversible vs. Reversible*: `Q1` (*Think slowly*), `Q2` (*Decide fast, then adjust*), `Q3` (*Be careful, then forget*), and `Q4` (*Just do it / delegate in <2m*), paired with an auto-resetting **Morning Launch Protocol**. |
| ***Four Thousand Weeks* & Stoic *Memento Mori*** | Oliver Burkeman & Seneca | **Bio-State Hub (`17B // Life Wheel & Life in Weeks`)** | Integrated directly into **Bio-State Lab's Hub Switcher**: **Life in Weeks Grid** (`52 weeks × Target Age`, e.g., `4,160 weeks` for 80 years) rendering every lived week vs. remaining week from your birth date, alongside an **8-Axis Life Wheel Audit** (`Health`, `Academics`, `Skills`, `Money`, `Friends`, `Family`, `Fun`, `Peace of mind`) that flags your lowest-scoring life axis and compares against historical snapshots. |
| **Autonomic Neuro-Modulation & NSDR** | Andrew Huberman | **Bio-State Hub (`17 // Bio-State & NSDR Lab`)** | Zero-dependency **Web Audio API Synthesizer** generating real-time **Pink Noise**, **Brown Noise**, **White Noise**, and **40 Hz Gamma Binaural Beats** (`200 Hz` Left / `240 Hz` Right stereo panner), plus a **4-Stage Guided NSDR Timer** (`10m` / `20m`) with `4s Inhale – 4s Hold – 6s Exhale` somatic pacing, **3,000 mL Hydration Telemetry**, and **7-Day Sleep Debt vs. 8.0h Target**. |
| **First-Principles Engineering & `.plan` Logs** | Elon Musk & John Carmack | **Academy Execution Hub**, **Innovation Canvas**, **Trajectory** & **System Core** | **Execution Hub** linking Courses, Missions (with `₹` bounties), Shipped Builds, and the **Unified Calendar** (with `Zero Day` tracking); **Universal File Vault + Interactive HTML5 Wireframe Sketch Pad** (attach PDFs, Word docs, spreadsheets, slide decks, code, archives, or images); **SVG Baseline-to-Now Delta Charts**; and **100% Local-First Sovereignty**. |

---

## 3. Complete Module-by-Module Architecture

All primary modules are accessible from the fixed `240px` collapsible left sidebar, the `⌘K` / `/` Command Palette, or numeric hotkeys `1`–`9`. Related sub-systems are consolidated into dedicated top **Hub Switcher Bars** inside **Academy**, **Wallet**, and **Bio-State Lab** so the sidebar stays clean, fast, and focused.

### I. Daily Command, Execution Hub & Capital Hub
1. **Today (`01 // Telemetry Workbench` — `DashboardView`)**
   - **4-Column Calibrated KPI Matrix:** Live readouts with 12-segment progress bars (`SegmentedTelemetryBar`) for **Attendance Aggregate**, **Net Liquid Capital (`₹`)**, **Active Missions**, and **Deep Work Logged (`LVL` & `XP`)**.
   - **Top 3 Daily Priorities:** Date-scoped (`YYYY-MM-DD`) 3-slot priority lock (`0 / 3 LOCKED`) that resets cleanly each day.
   - **Streak // Per Habit:** Live overall streak counter, per-habit streak leaderboard, and a **28-Day Consistency Matrix** dot-grid fallback.
   - **Countdown Readout:** Dot-matrix `T-MINUS` day counter (`--d`) to your next exam, hackathon, or milestone.
   - **02 // Instant Telemetry Capture:** Unified omnibox with mode pills (`Mission`, `Expense (₹)`, `Income (₹)`, `Course`) for single-line logging.
   - **03 // Priority Mission Queue:** Displays active mission packets (with `SLOT.01–03 // IDLE` telemetry standby slots when clear) and one-click completion.
   - **04 // Deep Work Focus Engine:** Circular SVG progress dial (`CYCLE %`), `STANDBY // READY` / `RECORDING ACTIVE` status pill, `15m / 25m / 50m / 90m` steppers, session objective input, and automatic +50 XP reward upon block completion.
2. **Academy & Execution Hub (`02 // B.Tech Academic Telemetry` — `AcademyView`, `MissionsView`, `ProjectsView`, `CalendarView`)**
   - Houses the 4-tab **EXECUTION HUB** switcher bar (`Missions & ₹ Bounties` · `Project Lab` · `Academy Matrix` · `Unified Calendar`):
     - **Academy Matrix (`AcademyView`):** Tracks courses (`Code`, `Title`, `Target Attendance %`, `Exam Date`), `+1 PRESENT` / `+1 ABSENT` steppers, safe/critical status badges, per-course **Syllabus Modules** checklists, and `calculateAttendanceProjection()` class buffer/recovery math.
     - **Missions & ₹ Bounties (`MissionsView`):** Toggle between **List View** and **2-Column Kanban Board View** (`Pending Directives` vs. `Completed Directives`). Completing a mission with a bounty awards `+30 XP` and credits the `₹ Bounty` amount into your Wallet ledger.
     - **Project Lab (`ProjectsView`):** Engineering build portfolio with comma-separated stack tags, deadline tracking, `0–100%` completion slider, and a `MARK SHIPPED (100%)` trigger (+100 XP).
     - **Unified Calendar (`CalendarView`):** Paint any date on the monthly grid using **Day Type Brushes** (`Logged / Productive Day`, `Hackathon / Deep Build Day`, `Movie / Chill Day`, `Outing / Travel Day`, `Holiday / Exam / Deadline`, `Rest / Recharge Day`, **`Zero Day`**, plus unlimited **Custom Day Types** with custom hex colors). Automatically merges custom calendar events, Academy course exam dates, and active Mission Control deadlines into a single chronological feed.
3. **Wallet & Capital Hub (`03 // Campus Wallet & Capital Allocation` — `BankView`, `MoneyAllocatorView`)**
   - Houses the 2-tab **WALLET HUB** switcher bar (`My Wallet & Ledger` · `Pay Yourself First`):
     - **My Wallet & Ledger (`BankView`):**
       - **Safe-to-Spend-Today Ceiling:** $\text{Safe Today} = \text{round}\left(\frac{\max(0, \text{Monthly Budget} - \text{Spent This Month})}{\text{Days Left in Month}}\right)$.
       - **Survival Runway:** $\text{Runway Days} = \left\lfloor\frac{\text{Active Pool}}{\text{Avg Daily Spend This Month}}\right\rfloor$.
       - **Hostel Maggi Waste Index:** Sums all expenses tagged `"Waste"` over the last 7 days and converts the total into plates of hostel Maggi ($\lceil \text{Waste ₹} / 40 \rceil$).
       - **2-Tap Quick Spend / Income:** Enter ₹ amount (or tap `₹20 / ₹50 / ₹100 / ₹200 / ₹500` presets) and tap a category (`Food`, `Travel`, `Recharge`, `Fun`, `Books`, `Other` or `+ Home Allowance`, `+ Intern / Gig`, `+ Cashback / Gift`) to log immediately.
       - **7-Day Spending Bar Chart & Savings Goals (Pots):** Track dedicated pots (with `+ Laptop ₹65,000` and `+ Trip ₹8,000` quick presets) and direct ₹ deposits.
     - **Pay Yourself First (`03B // Capital Allocation & Pay Yourself First` — `MoneyAllocatorView`):** Configurable savings rate % that computes your savings cut from any allowance/income and transfers it directly into your chosen Wallet Savings Pot while logging the transaction.
4. **Innovation Canvas (`06B // Universal Document, Spreadsheet, PDF & Wireframe Studio` — `InnovationCanvasView`)**
   - **01 // Idea Specification & Universal File Vault:** Attach **any file format**—**PDFs (`.pdf`), Word Docs (`.doc`/`.docx`), Spreadsheets (`.xlsx`/`.xls`/`.csv`/`.tsv`), Slide Decks (`.pptx`), Text/Markdown/Code files, ZIP Archives, or Images**—via multi-file picker (`+ Attach Files`), drag-and-drop, or `Ctrl+V` clipboard paste. Includes inline PDF reader, CSV/TSV table preview, code/text viewer, one-click original-filename download, and `+ Attach File` on existing cards.
   - **02 // Interactive Wireframe Sketch Pad:** Built-in `540×250` HTML5 `<canvas>` with gridlines, multi-color pens (`White`, `Neon`, `Orange`, `Red`), `Eraser`, and one-click `Save with Sketch →` persistence into `IndexedDB` (+35 XP).

### II. Habits, Focus & Behavioral Engineering
5. **Habit Matrix (`11 // Habit Verification Calendar, Rest Shield & Consistency Compound Engine` — `HabitsView`)**
   - **Interactive Month Grid & 365-Day Rolling Horizon Heatmap:** Click any date cell to verify a habit (+25 XP) or inspect multi-habit status for a specific date.
   - **Purple Rest Shield (`#A855F7`):** Activate `REST SHIELD` on any date to protect your streak during exams, travel, or illness without inflating your verified count.
   - **03 // Consistency Compounding Engine:** Live calculator with `30m/1Y`, `60m/1Y`, `90m/2Y`, `2h/3Y`, and `4h/5Y` presets, outputting Total Hours, Total Minutes, `40H Weeks`, `Pure 24H Days`, `10,000-Hour Mastery %`, and a multi-year compounding horizon table.
6. **Focus Discipline (`20 // Focus Discipline & Cognitive Containment` — `FocusDisciplineView`)**
   - **01 // Weekly Deep-Work Goal (Mon–Sun):** Editable weekly hour quota (`focusGoalHrs`), calibrated 7-day vertical gauge bars (click any day `Mon–Sun` to target that date), quick-log presets (`+25m`, `+50m`, `+90m`), custom duration/topic logger (`+15 XP` per logged block), and a scrollable weekly session log.
   - **02 // Impulse & Urge Delay (10m):** One-click `"Wait 10 minutes before opening it"` countdown timer (`10:00` → `00:00`) that awards `+10 XP` once daily when you outlast a distraction impulse.
   - **03 // Daily Shutdown Ritual:** 4-step end-of-day cognitive closure checklist (*Review today's completed & pending tasks*, *Check tomorrow's calendar & first class*, *Lock Top 3 priorities for tomorrow*, *Clear desk & pack bag for morning*) with streak tracking and `+20 XP` on full completion.
   - **04 // Distraction Log & Trigger Telemetry:** Logs attention leaks (`App/Activity`, `Minutes Lost`, `Trigger`, and `What I Was Avoiding`), computing **This Week Lost (Min)** and your **Top 3 Distraction Triggers**.
7. **Habit Design (`15 // Atomic Architecture & Identity Telemetry` — `HabitDesignView`)**
   - **01 // Identity Votes:** Register `"I am someone who..."` statements and track progress toward `100 VOTES`.
   - **02 // Daily Habit Scorecard:** Audit daily behaviors as `Good (+)`, `Neutral (=)`, or `Bad (-)` with live tally counters.
   - **03 // Habit Stacking Builder & 2-Minute Rule Gateway:** Chain new habits to existing anchors, link each stack to an identity statement (checking in a stack automatically increments its linked Identity Vote and awards +25 XP), and trigger an automatic **`NEVER MISS TWICE`** warning banner if a stack was missed yesterday.

### III. Cognitive Compression & Spaced Retrieval
8. **Learning Engine (`21 // Cognitive Compression & Active Retrieval` — `LearningEngineView`)**
   - **01 // Feynman Technique Synthesis:** Record topics linked to your Academy courses using the **ELI12** (*Explain Like I'm 12*) composer and explicit **Gaps** field. Grade notes across `Confusing` → `Getting there` → `Mastered` (+20 XP on mastery).
   - **02 // Active Recall Question Bank:** Build a Q&A prompt bank, launch interactive **Quiz Me** mode (`Show answer` → `Got it` / `Missed it`), track overall retrieval accuracy %, and automatically surface the top 5 **Weakest Questions (Highest Miss Rate)**.
9. **Study Vault (`16 // Spaced Repetition & Hierarchical Knowledge Tree` — `StudyVaultView`)**
   - **01 // Due Today & Overdue Queue:** Surfaces all pending `+1D`, `+3D`, and `+7D` spaced reviews due on or before today (+10 XP per completed review).
   - **02 // 1-3-7 Revision Calendar:** Interactive monthly calendar displaying scheduled, completed, and overdue revision dots per date.
   - **03 // Problem Vault (Unlimited Nested Notebook):** Recursive tree notebook for DSA, system design, or course notes with `Easy` / `Med` / `Hard` difficulty badges, instant ancestor-preserving search, and unlimited nested sub-pages.

### IV. Bio-State & Life Hub, Executive Function & Long-Term Trajectory
10. **Bio-State & Life Hub (`17 // Physiological Telemetry, Acoustic Neuro-Modulation & Life Audit` — `BioStateView`, `LifeAuditView`)**
    - Houses the 2-tab **BIO-STATE HUB** switcher bar (`Bio-State & NSDR Lab` · `Life Wheel & Life in Weeks`):
      - **Bio-State & NSDR Lab (`BioStateView`):**
        - **01 // Hydration Telemetry:** `3,000 mL` daily target with `+250 ML` / `+500 ML` triggers, custom mL input, +15 XP on reaching 3L, and a 7-day continuity bar chart.
        - **02 // Sleep Architecture:** 8.0h target with 7-day rolling average and real-time **7-Day Sleep Debt (`56h - 7dTotal`)** readout.
        - **03 // Day Timeline (`05:00 – 23:00`):** Time-block scheduler (`Deep Work`, `Classes`, `Training`, `Recovery`) with reusable **Weekday Templates** (`Save Template` / `Copy Template to Today`).
        - **04 // NSDR & Synthesized Focus Audio:** Real-time procedural Web Audio generator (`Pink Noise`, `Brown Noise`, `White Noise`, `40Hz Binaural`, and `NSDR Guided` 10m/20m somatic breathing circle) with `15m / 30m / 60m` auto-off sleep timers and global sidebar playback control.
      - **Life Wheel & Life in Weeks (`17B // Balance Audit & Memento Mori` — `LifeAuditView`):**
        - **01 // 8-Axis Life Wheel Audit:** Score 8 life dimensions (`1–10`), highlight the `LOWEST` bottleneck axis, compare against your previous dated snapshot, and save historical snapshots (+15 XP).
        - **02 // Life in Weeks (`52 Weeks per Row`):** Full *Memento Mori* week grid (`Target Age × 52`) visualizing lived vs. remaining weeks from your birth date.
11. **Executive Lab (`18 // Autonomic Launch Checklist & Strategic Triage` — `ExecutiveView`)**
    - **01 // Morning Protocol:** Auto-resetting daily launchpad checklist (`Meds`, `Wake without phone`, `Water`, `Dress`, `Pack bag`, `ID/wallet/charger`, `Bus time check` + custom items) with streak counter and +25 XP on full completion.
    - **02 // 2×2 Executive Decision Matrix:** Interactive quadrant board (`Important + Irreversible`, `Important + Reversible`, `Not Important + Irreversible`, `Not Important + Reversible`) with one-click resolution (+10 XP).
    - **03 // Executive Operating Recommendations:** 6 collapsible low-friction engineering rules (*Night-Before Launchpad*, *Zero-Screen First 30m*, *Sunlight & Hydration First*, *Hardest Task First*, *One Fixed Bus Time*, *Single Pocket Audit*).
12. **Trajectory (`19 // Baseline Delta Charts & Milestone Chronology` — `TrajectoryView`)**
    - **01 // Growth Trajectory Graphs (`Baseline → Now`):** Track quantitative metrics from a dated baseline, log check-ins (+10 XP), and render dynamic **SVG Polyline Trajectory Charts** with `Started → Now (±Delta)` badges.
    - **02 // Multi-Roadmap Timeline Architect:** Build multiple long-term roadmaps with chronological milestones, live `DAYS LEFT` / `OVERDUE` badges, and `Planned` → `In progress` → `Done` (+30 XP) state transitions.

### V. Cognitive Sandbox & System Core
13. **Simulation Deck (`13 // Cognitive & Telemetry Sandbox` — `ArcadeView`)**
    - Positioned at the bottom of the navigation stack directly above **System Core**.
    - **SIM.01 // Vector Snake (`VectorSnakeGame`):** Classic vector grid snake with speed modes (`CHILL`, `NORM`, `FAST`), high-score persistence, and the secret **Classified Vault Trapdoor** trigger.
    - **SIM.02 // Reflex & 3×3 Matrix (`ReactionLatencyTest`):** Dual-mode cognitive trainer featuring a **Reaction Latency Test** (`ms` benchmark) and a **3×3 Spatial Sequence Memory Grid**.
    - **SIM.03 // Algorithmic Synth:** Bitwise and mathematical sequence benchmarks (+50 XP per verified solution).
14. **System Core (`14 // System Configuration & Storage` — `SettingsView`)**
    - **Smart Device Installation (`DEVICE INSTALLATION // WEB APP`):** Single `Install FLUX App` card shown only when running in a browser and the app is not yet installed on the device; automatically hides once installed.
    - **Sidebar Module Visibility Manager:** Hide or show any sidebar module without losing its underlying data (`TODAY` and `SYSTEM CORE` remain pinned).
    - **2 Authentic Engineering Themes:** Switch instantaneously between `Direction A: Obsidian Precision` and `Direction B: Editorial Paper`.
    - **Operator Identity & Tactile Audio Toggle:** Customize Operator Name, Program/Branch, Active Semester, and synthesized UI click feedback.
    - **Local Storage Vault:** One-click **Export JSON Snapshot** (bundles both `localStorage` state and all `IndexedDB` base64 media/files into `flux-backup-YYYY-MM-DD.json`), schema-validated **Import JSON Snapshot**, and **Wipe All Local Data**.
15. **Classified Vault Trapdoor (`08 & 09 // SecretVaultView` — Hidden Module)**
    - Zero sidebar footprint. Unlocked from **Simulation Deck → Vector Snake** by pressing `Ctrl/Cmd + H` followed by `O` (or `H` then `O` while hovering/playing the snake canvas). Press `Esc` to lock immediately.
    - Houses two private subsystems:
      - **Memory Vault (`09 // Local-First Reflection Archive`):** Personal journal and engineering post-mortem timeline (`Daily Log`, `Architecture Note`, `Lessons Learned`, `Monthly Reflection`, `Future Letter`) tagged by cognitive mood.
      - **Experience Archive (`08 // Field Expeditions & Life Goals`):** India expeditions & personal bucket-list tracker with budget bracket filters (`All`, `Free ₹0`, `≤ ₹500`, `≤ ₹2,000`) and `+75 XP` upon completion.

---

## 4. Technical Architecture & Local-First Sovereignty

### Zero-Backend, Zero-Cost Guarantee
- **0 Runtime API Calls:** No LLM calls, no telemetry pings, and no external API requests at runtime.
- **0 API Keys Required:** Works out of the box with zero `.env` configuration.
- **0 Server / Cloud Database:** All state lives strictly on your device inside browser storage.

### Dual-Layer Local Persistence Schema
| Storage Engine | Key / Database Name | Object Store / Format | Purpose |
| :--- | :--- | :--- | :--- |
| `localStorage` | `NEXORA_ARCHITECTURAL_OS_V1` | JSON (`EMPTY_STATE` schema) | Primary store for all modules: profile, courses, transactions, savings pots, missions, projects, Innovation Canvas cards & attachment metadata, habits, habit shields, focus sessions, distraction logs, Feynman notes, recall questions, 1-3-7 revisions, problem pages, bio-logs, morning logs, decisions, roadmaps, and life wheel snapshots. |
| `localStorage` | `NEXORA_SIDEBAR_HIDDEN_V1` | JSON (`string[]`) | Persists hidden sidebar module IDs configured in **System Core**. |
| `localStorage` | `XOR_BIT_AUTH_V1` | JSON (`{ username, hash }`) | Stores SHA-256 PIN lock hash locally on the device. |
| `IndexedDB` | `NexoraStyleVaultDB` | Store: `garmentMedia` | Stores base64 data URLs for **Innovation Canvas** universal file attachments (`idea-att-<id>`) and wireframe sketches (`idea-<id>`), bypassing the ~5 MB `localStorage` ceiling. |
| **JSON Snapshot** | `flux-backup-YYYY-MM-DD.json` | `{ format: "FLUX_BACKUP_V1", exportedAt, data, media }` | Full-fidelity portable backup combining `localStorage` state + `IndexedDB` files/media, verified on import via `normalizeImportedState()` and `validateImportedMedia()`. |

### 2-Direction Engineering Theme System (`src/index.css`)
Scoped via `[data-theme="obsidian | paper"]` on `<html>`:
- **Direction A — Obsidian Precision (`obsidian`, Default):** Matte Carbon `#09090B` canvas, `#111113` elevated surface cards, `1px` structural hairlines, and pure monochrome `#FAFAFA` primary action buttons (`--accent: #FAFAFA`, `--accent-fg: #09090B`).
- **Direction B — Editorial Paper (`paper`):** Stripe Press Warm Alabaster `#FAF8F5` canvas, crisp `#FFFFFF` surface panels, and deep warm ink `#1A1917` primary controls.

### Procedural Web Audio Engine & PWA Offline Architecture
- **Web Audio API Synthesizer:** Zero external MP3/WAV dependencies. Generates tactile UI micro-clicks (`playTactileClick(enabled, freq, durationMs)`), white/pink/brown filtered noise buffers, and stereo-panned `200 Hz` / `240 Hz` oscillators for `40 Hz` gamma binaural beats.
- **Progressive Web App (PWA):** Includes `/manifest.webmanifest` (`"name": "FLUX"`), custom shattered-planet app icons (`icon-512.png`, `icon-256.png`, `icon-192.png`, `icon-maskable-512.png`, `apple-touch-icon.png`, `favicon.ico`), and a **Network-First Service Worker (`/sw.js`, cache `flux-v3.1.0`)** that serves fresh builds when online and falls back seamlessly to cached assets when offline.

---

## 5. Quick Start & Keyboard Shortcuts

### Running Locally (Vite + React + TypeScript)
```bash
# 1. Install dependencies
npm install

# 2. Start the development server on http://localhost:3000
npm run dev

# 3. Run unit tests (state validation, attendance math, command palette filtering)
npx tsx --test src/utils/nexoraState.test.ts

# 4. Build production bundle
npm run build
```

### Running on GitHub Pages / Static Hosting (Zero Build Step Needed on Host)
- **`index.html` Dual-Mode Loader:** In local development, Vite serves `/src/main.tsx`. When hosted on GitHub Pages (`*.github.io`), `index.html` automatically loads the precompiled static bundle from `./compiled/app.js?v=3.1.0` and `./compiled/app.css?v=3.1.0`.

### Complete Keyboard Shortcut Reference

| Shortcut | Scope | Action |
| :--- | :--- | :--- |
| `Ctrl + K` / `⌘ + K` | Global | Toggle the **Command Palette** (jump to any module or hub tab, or search courses, missions, projects, Innovation Canvas ideas, Feynman notes, and Active Recall prompts). |
| `/` | Global *(outside inputs)* | Open the **Command Palette** immediately. |
| `1` – `9` | Global *(outside inputs)* | Jump directly to the 1st through 9th visible sidebar modules (`1` Today, `2` Academy, `3` Wallet, `4` Innovation Canvas, `5` Habit Matrix, `6` Focus Discipline, `7` Learning Engine, `8` Habit Design, `9` Study Vault). |
| `Alt + G` | Global | Jump directly to **Simulation Deck (`13 // Cognitive & Telemetry Sandbox`)**. |
| `Ctrl + V` / `⌘ + V` | **Innovation Canvas** | Paste any copied file or screenshot directly from your system clipboard into the active Idea Specification Card. |
| `W A S D` / `Arrow Keys` | **Simulation Deck (Snake)** | Control Vector Snake (`SIM.01`). |
| `H` then `O` *(or `Ctrl/Cmd + H` then `O`)* | **Simulation Deck (Snake)** | Unlock the hidden **Classified Vault Trapdoor** (`Memory Vault` + `Experience Archive`). |
| `Esc` | Global | Close open modals / Command Palette, or immediately **Lock the Classified Vault Trapdoor** and return to Simulation Deck. |

---

## Credits

Designed, architected, and developed by **Shrishaila M**.
