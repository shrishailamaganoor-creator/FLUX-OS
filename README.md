# FLUX — Personal Life & Engineering OS

> **An opinionated, local-first, zero-cost Personal Operating System engineered for B.Tech students and builders—turning proven behavioral science, cognitive psychology, and book frameworks into executable daily software protocols.**

- **Architecture:** React 19 + TypeScript + Vite + Tailwind CSS v4 (plus precompiled static bundle in `./compiled/`)
- **Persistence:** 100% Local-First (`localStorage` + `IndexedDB`) · Zero Backend · Zero Cloud Database · `$0` Operating Cost
- **Offline & Installable:** Progressive Web App (`manifest.webmanifest` + Network-First Service Worker `sw.js` `flux-v2.3.0`)
- **Design System:** 3 Calibrated Engineering Themes (`Direction A: Obsidian Precision`, `Direction B: Editorial Paper`, `Direction C: Swiss Industrial`)

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
| ***The Psychology of Money* & Mental Accounting** | Morgan Housel & Richard Thaler | **Wallet (`03 // My Wallet`)** & **Life & Money (`22 // Life & Money`)** | **"Pay Yourself First" Allocator** (auto-calculates savings cut % and transfers to target Savings Pots), **Safe-to-Spend-Today Ceiling** (`Remaining Monthly Budget ÷ Days Left in Month`), **Survival Runway** (`Liquid Pool ÷ Avg Daily Spend`), and the **Hostel Maggi Waste Index** (converts weekly `"Waste"`-tagged expenses into plates of ₹40 hostel Maggi). |
| **Type 1 vs. Type 2 Decisions (Reversible vs. Irreversible)** | Jeff Bezos | **Executive Lab (`18 // Executive Function & Decision Matrix`)** | **2×2 Executive Decision Matrix** crossing *Important vs. Not Important* with *Irreversible vs. Reversible*: `Q1` (*Think slowly*), `Q2` (*Decide fast, then adjust*), `Q3` (*Be careful, then forget*), and `Q4` (*Just do it / delegate in <2m*), paired with an auto-resetting **Morning Launch Protocol**. |
| ***Four Thousand Weeks* & Stoic *Memento Mori*** | Oliver Burkeman & Seneca | **Life & Money (`22 // Life & Money`)** | **Life in Weeks Grid** (`52 weeks × Target Age`, e.g., `4,160 weeks` for 80 years) rendering every lived week vs. remaining week from your birth date, alongside an **8-Axis Life Wheel Audit** (`Health`, `Academics`, `Skills`, `Money`, `Friends`, `Family`, `Fun`, `Peace of mind`) that flags your lowest-scoring life axis and compares against historical snapshots. |
| **Autonomic Neuro-Modulation & NSDR** | Andrew Huberman | **Bio-State Lab (`17 // Bio-State & NSDR Lab`)** | Zero-dependency **Web Audio API Synthesizer** generating real-time **Pink Noise**, **Brown Noise**, **White Noise**, and **40 Hz Gamma Binaural Beats** (`200 Hz` Left / `240 Hz` Right stereo panner), plus a **4-Stage Guided NSDR Timer** (`10m` / `20m`) with `4s Inhale – 4s Hold – 6s Exhale` somatic pacing, **3,000 mL Hydration Telemetry**, and **7-Day Sleep Debt vs. 8.0h Target**. |
| **First-Principles Engineering & `.plan` Logs** | Elon Musk & John Carmack | **Project Lab**, **Innovation Canvas**, **Trajectory** & **System Core** | **Execution Hub** linking Courses, Missions (with `₹` bounties), and Shipped Builds; **OneNote-Style Idea Spec Sheets + Interactive HTML5 Wireframe Sketch Pad** (with `Ctrl+V` clipboard image paste); **SVG Baseline-to-Now Delta Charts**; and **100% Local-First Sovereignty**. |

---

## 3. Complete Module-by-Module Architecture (21 Modules + Classified Vault)

All modules are accessible from the fixed `240px` collapsible left sidebar, the `⌘K` / `/` Command Palette, or numeric hotkeys `1`–`9`.

### I. Daily Command & Execution Hub
1. **Today (`01 // Telemetry Workbench` — `DashboardView`)**
   - **4-Column Calibrated KPI Matrix:** Live readouts with 12-segment progress bars (`SegmentedTelemetryBar`) for **Attendance Aggregate**, **Net Liquid Capital (`₹`)**, **Active Missions**, and **Deep Work Logged (`LVL` & `XP`)**.
   - **Top 3 Daily Priorities:** Date-scoped (`YYYY-MM-DD`) 3-slot priority lock (`0 / 3 LOCKED`) that resets cleanly each day.
   - **Streak // Per Habit:** Live overall streak counter, per-habit streak leaderboard, and a **28-Day Consistency Matrix** dot-grid fallback.
   - **Countdown Readout:** Dot-matrix `T-MINUS` day counter (`--d`) to your next exam, hackathon, or milestone.
   - **02 // Instant Telemetry Capture:** Unified omnibox with mode pills (`Mission`, `Expense (₹)`, `Income (₹)`, `Course`) for single-line logging.
   - **03 // Priority Mission Queue:** Displays active mission packets (with `SLOT.01–03 // IDLE` telemetry standby slots when clear) and one-click completion.
   - **04 // Deep Work Focus Engine:** Circular SVG progress dial (`CYCLE %`), `STANDBY // READY` / `RECORDING ACTIVE` status pill, `15m / 25m / 50m / 90m` steppers, session objective input, and automatic +50 XP reward upon block completion.
2. **Academy (`02 // B.Tech Academic Telemetry` — `AcademyView`)**
   - Part of the shared **Execution Hub** (`Missions & ₹ Bounties` · `Project Lab` · `Academy Matrix`).
   - Tracks courses (`Code`, `Title`, `Target Attendance %`, `Exam Date`), `+1 PRESENT` / `+1 ABSENT` steppers, safe/critical status badges, and per-course **Syllabus Modules** checklists.
   - Pure helper `calculateAttendanceProjection()` computes exact class buffer (*how many upcoming sessions you can safely miss*) or recovery requirement (*how many consecutive sessions you must attend to hit target %*).
3. **Wallet (`03 // Campus Wallet & Daily Survival` — `BankView`)**
   - **Safe-to-Spend-Today Ceiling:** $\text{Safe Today} = \text{round}\left(\frac{\max(0, \text{Monthly Budget} - \text{Spent This Month})}{\text{Days Left in Month}}\right)$.
   - **Survival Runway:** $\text{Runway Days} = \left\lfloor\frac{\text{Active Pool}}{\text{Avg Daily Spend This Month}}\right\rfloor$.
   - **Hostel Maggi Waste Index:** Sums all expenses tagged `"Waste"` over the last 7 days and converts the total into plates of hostel Maggi ($\lceil \text{Waste ₹} / 40 \rceil$).
   - **2-Tap Quick Spend / Income:** Enter ₹ amount (or tap `₹20 / ₹50 / ₹100 / ₹200 / ₹500` presets) and tap a category (`Food`, `Travel`, `Recharge`, `Fun`, `Books`, `Other` or `+ Home Allowance`, `+ Intern / Gig`, `+ Cashback / Gift`) to log immediately.
   - **7-Day Spending Bar Chart & Savings Goals (Pots):** Track dedicated pots (with `+ Laptop ₹65,000` and `+ Trip ₹8,000` quick presets) and direct ₹ deposits.
4. **Mission Control (`04 // Execution & Deliverables` — `MissionsView`)**
   - Toggle between **List View** and **2-Column Kanban Board View** (`Pending Directives` vs. `Completed Directives`).
   - Supports **₹ Bounties**: completing a mission with a bounty automatically awards `+30 XP` and credits the exact `₹ Bounty` amount into your Wallet transaction ledger (`Mission Bounty: <title>`).
5. **Skill Matrix (`05 // Competency Architecture` — `SkillsView`)**
   - Categorized skill tree (`Systems & Core CS`, `Full-Stack Engineering`, `AI & Machine Learning`, `Design & Product`, `Communication & Leadership`).
   - Tracks `LVL 1` to `LVL 5`, mastery progress (`0–100%`), and custom sub-milestones (+50 XP per completed milestone).
6. **Project Lab (`06 // Build Pipeline` — `ProjectsView`)**
   - Engineering build portfolio with comma-separated stack tags, deadline tracking, `0–100%` completion slider, and a `MARK SHIPPED (100%)` trigger (+100 XP).
7. **Innovation Canvas (`06B // OneNote-Style Architecture & Wireframe Studio` — `InnovationCanvasView`)**
   - **01 // Idea Specification Sheet:** Structured concept cards tagged by `Architecture`, `Startup / Product`, `Hardware / IoT`, `Algorithm`, or `UI / Wireframe`, with global **`Ctrl+V` clipboard image paste** and file upload.
   - **02 // Interactive Wireframe Sketch Pad:** Built-in `540×250` HTML5 `<canvas>` with gridlines, multi-color pens (`White`, `Neon`, `Orange`, `Red`), `Eraser`, and one-click `Save with Sketch →` persistence into `IndexedDB` (+35 XP).

### II. Habits, Focus & Behavioral Engineering
8. **Habit Matrix (`11 // Habit Verification Calendar, Rest Shield & Consistency Compound Engine` — `HabitsView`)**
   - **Interactive Month Grid & 365-Day Rolling Horizon Heatmap:** Click any date cell to verify a habit (+25 XP) or inspect multi-habit status for a specific date.
   - **Purple Rest Shield (`#A855F7`):** Activate `REST SHIELD` on any date to protect your streak during exams, travel, or illness without inflating your verified count.
   - **03 // Consistency Compounding Engine:** Live calculator with `30m/1Y`, `60m/1Y`, `90m/2Y`, `2h/3Y`, and `4h/5Y` presets, outputting Total Hours, Total Minutes, `40H Weeks`, `Pure 24H Days`, `10,000-Hour Mastery %`, and a multi-year compounding horizon table.
9. **Habit Design (`15 // Atomic Architecture & Identity Telemetry` — `HabitDesignView`)**
   - **01 // Identity Votes:** Register `"I am someone who..."` statements and track progress toward `100 VOTES`.
   - **02 // Daily Habit Scorecard:** Audit daily behaviors as `Good (+)`, `Neutral (=)`, or `Bad (-)` with live tally counters.
   - **03 // Habit Stacking Builder & 2-Minute Rule Gateway:** Chain new habits to existing anchors, link each stack to an identity statement (checking in a stack automatically increments its linked Identity Vote and awards +25 XP), and trigger an automatic **`NEVER MISS TWICE`** warning banner if a stack was missed yesterday.
10. **Focus Discipline (`20 // Focus Discipline & Cognitive Containment` — `FocusDisciplineView`)**
    - **01 // Weekly Deep-Work Goal (Mon–Sun):** Editable weekly hour quota (`focusGoalHrs`), calibrated 7-day vertical gauge bars (click any day `Mon–Sun` to target that date), quick-log presets (`+25m`, `+50m`, `+90m`), custom duration/topic logger (`+15 XP` per logged block), and a scrollable weekly session log.
    - **02 // Impulse & Urge Delay (10m):** One-click `"Wait 10 minutes before opening it"` countdown timer (`10:00` → `00:00`) that awards `+10 XP` once daily when you outlast a distraction impulse.
    - **03 // Daily Shutdown Ritual:** 4-step end-of-day cognitive closure checklist (*Review today's completed & pending tasks*, *Check tomorrow's calendar & first class*, *Lock Top 3 priorities for tomorrow*, *Clear desk & pack bag for morning*) with streak tracking and `+20 XP` on full completion.
    - **04 // Distraction Log & Trigger Telemetry:** Logs attention leaks (`App/Activity`, `Minutes Lost`, `Trigger`, and `What I Was Avoiding`), computing **This Week Lost (Min)** and your **Top 3 Distraction Triggers**.

### III. Cognitive Compression & Spaced Retrieval
11. **Learning Engine (`21 // Cognitive Compression & Active Retrieval` — `LearningEngineView`)**
    - **01 // Feynman Technique Synthesis:** Record topics linked to your Academy courses using the **ELI12** (*Explain Like I'm 12*) composer and explicit **Gaps** field. Grade notes across `Confusing` → `Getting there` → `Mastered` (+20 XP on mastery).
    - **02 // Active Recall Question Bank:** Build a Q&A prompt bank, launch interactive **Quiz Me** mode (`Show answer` → `Got it` / `Missed it`), track overall retrieval accuracy %, and automatically surface the top 5 **Weakest Questions (Highest Miss Rate)**.
12. **Study Vault (`16 // Spaced Repetition & Hierarchical Knowledge Tree` — `StudyVaultView`)**
    - **01 // Due Today & Overdue Queue:** Surfaces all pending `+1D`, `+3D`, and `+7D` spaced reviews due on or before today (+10 XP per completed review).
    - **02 // 1-3-7 Revision Calendar:** Interactive monthly calendar displaying scheduled, completed, and overdue revision dots per date.
    - **03 // Problem Vault (Unlimited Nested Notebook):** Recursive tree notebook for DSA, system design, or course notes with `Easy` / `Med` / `Hard` difficulty badges, instant ancestor-preserving search, and unlimited nested sub-pages.

### IV. Bio-State, Executive Function & Long-Term Trajectory
13. **Bio-State Lab (`17 // Physiological Telemetry & Acoustic Neuro-Modulation` — `BioStateView`)**
    - **01 // Hydration Telemetry:** `3,000 mL` daily target with `+250 ML` / `+500 ML` triggers, custom mL input, +15 XP on reaching 3L, and a 7-day continuity bar chart.
    - **02 // Sleep Architecture:** 8.0h target with 7-day rolling average and real-time **7-Day Sleep Debt (`56h - 7dTotal`)** readout.
    - **03 // Day Timeline (`05:00 – 23:00`):** Time-block scheduler (`Deep Work`, `Classes`, `Training`, `Recovery`) with reusable **Weekday Templates** (`Save Template` / `Copy Template to Today`).
    - **04 // NSDR & Synthesized Focus Audio:** Real-time procedural Web Audio generator (`Pink Noise`, `Brown Noise`, `White Noise`, `40Hz Binaural`, and `NSDR Guided` 10m/20m somatic breathing circle) with `15m / 30m / 60m` auto-off sleep timers and global sidebar playback control.
14. **Executive Lab (`18 // Autonomic Launch Checklist & Strategic Triage` — `ExecutiveView`)**
    - **01 // Morning Protocol:** Auto-resetting daily launchpad checklist (`Meds`, `Wake without phone`, `Water`, `Dress`, `Pack bag`, `ID/wallet/charger`, `Bus time check` + custom items) with streak counter and +25 XP on full completion.
    - **02 // 2×2 Executive Decision Matrix:** Interactive quadrant board (`Important + Irreversible`, `Important + Reversible`, `Not Important + Irreversible`, `Not Important + Reversible`) with one-click resolution (+10 XP).
    - **03 // Executive Operating Recommendations:** 6 collapsible low-friction engineering rules (*Night-Before Launchpad*, *Zero-Screen First 30m*, *Sunlight & Hydration First*, *Hardest Task First*, *One Fixed Bus Time*, *Single Pocket Audit*).
15. **Trajectory (`19 // Baseline Delta Charts & Milestone Chronology` — `TrajectoryView`)**
    - **01 // Growth Trajectory Graphs (`Baseline → Now`):** Track quantitative metrics from a dated baseline, log check-ins (+10 XP), and render dynamic **SVG Polyline Trajectory Charts** with `Started → Now (±Delta)` badges.
    - **02 // Multi-Roadmap Timeline Architect:** Build multiple long-term roadmaps with chronological milestones, live `DAYS LEFT` / `OVERDUE` badges, and `Planned` → `In progress` → `Done` (+30 XP) state transitions.
16. **Life & Money (`22 // Capital Allocation, Balance Audit & Memento Mori` — `LifeMoneyView`)**
    - **01 // Pay Yourself First Allocator:** Configurable savings rate % that computes and transfers your savings cut directly into any Wallet Savings Pot.
    - **02 // 8-Axis Life Wheel Audit:** Score 8 life dimensions (`1–10`), highlight the `LOWEST` bottleneck axis, compare against your previous dated snapshot, and save historical snapshots (+15 XP).
    - **03 // Life in Weeks (`52 Weeks per Row`):** Full *Memento Mori* week grid (`Target Age × 52`) visualizing lived vs. remaining weeks from your birth date.

### V. Campus Life, Wardrobe, Calendar & Sandbox
17. **Style Lab (`07 // Apparel Archive, Milestone Locks & Lookbook` — `StyleLabView`)**
    - Digital wardrobe with local photo uploads persisted in `IndexedDB` (`NexoraStyleVaultDB`).
    - **Gamified Milestone Locks:** Lock specific garments behind a minimum **Operator Level (`Req LVL`)** or **Wallet Balance (`Req Wallet ₹`)** so planned purchases must be earned. Includes a **Lookbook Builder** for assembling multi-item outfits.
18. **Unified Calendar (`10 // Color-Coded Life Calendar & Master Chronology` — `CalendarView`)**
    - Paint any date on the monthly grid using **Day Type Brushes** (`Logged / Productive Day`, `Hackathon / Deep Build Day`, `Movie / Chill Day`, `Outing / Travel Day`, `Holiday / Exam / Deadline`, `Rest / Recharge Day`, plus unlimited **Custom Day Types** with custom hex colors).
    - Automatically merges custom calendar events, Academy course exam dates, and active Mission Control deadlines into a single chronological feed.
19. **Extracurriculars (`12 // Competitions, Hackathons & Leadership` — `ExtracurricularView`)**
    - Portfolio log for `Hackathons`, `Technical Societies`, `Open Source`, `Sports & Athletics`, and `Volunteering` with role/placement outcomes.
20. **Simulation Deck (`13 // Cognitive & Telemetry Sandbox` — `ArcadeView`)**
    - **SIM.01 // Precision Line-Parking Rover (`RoverSimulationCanvas`):** 2D physics rover with `WASD` / Arrow steering and `Space` brake. Park inside top bays `P1`–`P6` and press `Enter` to physically launch the corresponding OS module (`Today`, `Academy`, `Wallet`, `Missions`, `Skills`, `Projects`).
    - **SIM.02 // Vector Snake (`VectorSnakeGame`):** Classic vector grid snake with high-score persistence and a secret **Classified Vault Trapdoor** trigger.
    - **SIM.03 // Reflex & 3×3 Matrix (`ReactionLatencyTest`):** Dual-mode cognitive trainer featuring a **Reaction Latency Test** (`ms` benchmark) and a **3×3 Spatial Sequence Memory Grid**.
    - **SIM.04 // Algorithmic Synth:** Bitwise and mathematical sequence benchmarks (+50 XP per verified solution).
21. **System Core (`14 // System Configuration & Storage` — `SettingsView`)**
    - **Sidebar Module Visibility Manager:** Hide or show any module in the sidebar without losing its underlying data (`TODAY` and `SYSTEM CORE` remain pinned).
    - **3 Authentic Engineering Themes:** Switch instantaneously between `Direction A: Obsidian Precision`, `Direction B: Editorial Paper`, and `Direction C: Swiss Industrial`.
    - **Operator Identity & Tactile Audio Toggle:** Customize Operator Name, Program/Branch, Active Semester, and synthesized UI click feedback.
    - **Local Storage Vault:** One-click **Export JSON Snapshot** (bundles both `localStorage` state and all `IndexedDB` base64 media into `xor-bit-backup-YYYY-MM-DD.json`), schema-validated **Import JSON Snapshot**, and **Wipe All Local Data**.
22. **Classified Vault Trapdoor (`08 & 09 // SecretVaultView` — Hidden Module)**
    - Zero sidebar footprint. Unlocked from **Simulation Deck → Vector Snake** by clicking the `[VAULT]` header button or pressing `Ctrl/Cmd + H` (or `H` while hovering/playing the snake canvas). Press `Esc` to lock immediately.
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
| `localStorage` | `NEXORA_ARCHITECTURAL_OS_V1` | JSON (`EMPTY_STATE` schema) | Primary store for all 21 modules: profile, courses, transactions, savings pots, missions, skills, projects, habits, habit shields, focus sessions, distraction logs, Feynman notes, recall questions, 1-3-7 revisions, problem pages, bio-logs, morning logs, decisions, roadmaps, and life wheel snapshots. |
| `localStorage` | `NEXORA_SIDEBAR_HIDDEN_V1` | JSON (`string[]`) | Persists hidden sidebar module IDs configured in **System Core**. |
| `IndexedDB` | `NexoraStyleVaultDB` | Store: `garmentMedia` | Stores high-resolution base64 data URLs for **Style Lab** garment photos (`wardrobe-<id>`) and **Innovation Canvas** wireframe sketches / pasted images (`idea-<id>`), bypassing the ~5 MB `localStorage` ceiling. |
| **JSON Snapshot** | `flux-backup-YYYY-MM-DD.json` | `{ format: "FLUX_BACKUP_V1", exportedAt, data, media }` | Full-fidelity portable backup combining `localStorage` state + `IndexedDB` media, verified on import via `normalizeImportedState()` and `validateImportedMedia()`. |

### 3-Direction Engineering Theme System (`src/index.css`)
Scoped via `[data-theme="obsidian | paper | industrial"]` on `<html>`:
- **Direction A — Obsidian Precision (`obsidian`, Default):** Matte Carbon `#09090B` canvas, `#111113` elevated surface cards, `1px` structural hairlines, and pure monochrome `#FAFAFA` primary action buttons (`--accent: #FAFAFA`, `--accent-fg: #09090B`).
- **Direction B — Editorial Paper (`paper`):** Stripe Press Warm Alabaster `#FAF8F5` canvas, crisp `#FFFFFF` surface panels, and deep warm ink `#1A1917` primary controls.
- **Direction C — Swiss Industrial (`industrial`):** Teenage Engineering Machined Stone `#EAEAE6` canvas, crisp `#FFFFFF` surface cards, and Safety Orange `#FF4F00` primary buttons and active indicators.

### Procedural Web Audio Engine & PWA Offline Architecture
- **Web Audio API Synthesizer:** Zero external MP3/WAV dependencies. Generates tactile UI micro-clicks (`playTactileClick(enabled, freq, durationMs)`), white/pink/brown filtered noise buffers, and stereo-panned `200 Hz` / `240 Hz` oscillators for `40 Hz` gamma binaural beats.
- **Progressive Web App (PWA):** Includes `/manifest.webmanifest`, custom SVG/PNG *Life in Orbit* icons, and a **Network-First Service Worker (`/sw.js`, cache `flux-v2.3.0`)** that serves fresh builds when online and falls back seamlessly to cached assets when offline.

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
- **`index.html` Dual-Mode Loader:** In local development, Vite serves `/src/main.tsx`. When hosted on GitHub Pages (`*.github.io`), `index.html` automatically loads the precompiled static bundle from `./compiled/app.js?v=2.3.0` and `./compiled/app.css?v=2.3.0`.

### Complete Keyboard Shortcut Reference

| Shortcut | Scope | Action |
| :--- | :--- | :--- |
| `Ctrl + K` / `⌘ + K` | Global | Toggle the **Command Palette** (jump to any module or search courses, missions, projects, Innovation Canvas ideas, Feynman notes, and Active Recall prompts). |
| `/` | Global *(outside inputs)* | Open the **Command Palette** immediately. |
| `1` – `9` | Global *(outside inputs)* | Jump directly to the 1st through 9th visible sidebar modules (`1` Today, `2` Academy, `3` Wallet, `4` Mission Control, `5` Skill Matrix, `6` Project Lab, `7` Innovation Canvas, `8` Style Lab, `9` Unified Calendar). |
| `Alt + S` | Global | Jump directly to **Style Lab (`07 // Wardrobe`)**. |
| `Alt + G` | Global | Jump directly to **Simulation Deck (`13 // Arcade & Sandbox`)**. |
| `Ctrl + V` / `⌘ + V` | **Innovation Canvas** | Paste an image directly from your system clipboard into the active Idea Specification Card. |
| `W A S D` / `Arrow Keys` | **Simulation Deck** | Steer the Rover (`SIM.01`) or control Vector Snake (`SIM.02`). |
| `Space` | **Simulation Deck (Rover)** | Engage rover handbrake. |
| `Enter` | **Simulation Deck (Rover)** | Launch the OS module bay (`P1`–`P6`) where the rover is currently parked. |
| `Ctrl/Cmd + H` *(or `H`)* | **Simulation Deck (Snake)** | Unlock the hidden **Classified Vault Trapdoor** (`Memory Vault` + `Experience Archive`). |
| `Esc` | Global | Close open modals / Command Palette, or immediately **Lock the Classified Vault Trapdoor** and return to Simulation Deck. |

---

## Credits

Designed, architected, and developed by **Shrishaila M**.
