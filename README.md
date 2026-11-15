# FLUX — Personal Life & Engineering OS

> **An opinionated, local-first, zero-cost Personal Operating System engineered for B.Tech students and builders—turning proven behavioral science, cognitive psychology, and book frameworks into executable daily software protocols.**

- **Live Web App (PWA):** [https://shrishailamaganoor-creator.github.io/FLUX-OS/](https://shrishailamaganoor-creator.github.io/FLUX-OS/)
- **Repository:** [https://github.com/shrishailamaganoor-creator/FLUX-OS](https://github.com/shrishailamaganoor-creator/FLUX-OS)
- **Architecture:** React 19 + TypeScript + Vite + Tailwind CSS v4 (plus precompiled static bundle in `./compiled/`)
- **Persistence:** 100% Local-First (`localStorage` + `IndexedDB`) · Zero Backend · Zero Cloud Database · `$0` Operating Cost
- **Offline & Installable:** Progressive Web App (`manifest.webmanifest`, clean installed app title **`FLUX`**, Network-First Service Worker `sw.js` `flux-v3.4.0`, and smart single-button device installer in **System Core**)
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
| **Timeboxing & Visual Availability Architecture** *(Structured.app)* | Cal Newport & Parkinson's Law | **Dayflow (`04 // Structured Timeline & Availability Planner`)** | Multi-view (`Day` · `Week` · `Month`) visual timeline with **In-Between Free Time Pills** (`"2h 15m free • + Add"`), recurring weekly class timetable, **Holiday / Free Day / Focus Day** date overrides, and a collapsible **Inbox Tray** that slots unscheduled tasks directly into open free-time gaps (`flux_os_dayflow`). |
| ***Atomic Habits*** | James Clear | **Habit Design (`15 // Habit Design & Identity Lab`)** & **Habit Matrix (`11 // Habit Matrix`)** | **100-Vote Identity Bars** (*"I am someone who..."*, `0–100 VOTES`), **Habit Stacking Builder** (*"After I [ANCHOR], I will [NEW HABIT], in [PLACE]"*), **2-Minute Gateway Rule**, **Daily Habit Scorecard** (`+` / `=` / `-`), **"Never Miss Twice" Alert** when yesterday was missed, and **Purple Rest Shield** (`#A855F7`) to protect streaks on exam or recovery days. |
| ***Outliers* & Deliberate Practice (The 10,000-Hour Rule)** | Malcolm Gladwell & K. Anders Ericsson | **Habit Matrix (`03 // Consistency Compounding Engine`)** | Converts daily input (`MIN/D` or `HRS/D`) over any horizon (`DAYS`, `MONTHS`, `YEARS`) into cumulative hours, **40-Hour Work Weeks**, **Pure 24-Hour Days**, percentage toward the **10,000-Hour Mastery Benchmark**, and a 1Y / 2Y / 3Y / 5Y / 10Y compounding table. |
| ***Deep Work* & Cognitive Containment** | Cal Newport | **Today (`04 // Deep Work Focus Engine`)** & **Focus Discipline (`20 // Focus Discipline`)** | **Circular SVG Cycle Dial** (`15m / 25m / 50m / 90m` protocols), **Calibrated 7-Day Vertical Gauge Matrix** with direct `+25m / +50m / +90m` session logging, **10-Minute Impulse & Urge Delay Timer** (+10 XP for waiting out a distraction urge), **4-Step Daily Shutdown Ritual**, and **Root-Cause Distraction Telemetry**. |
| **Forgetting Curve Spaced Repetition** | Hermann Ebbinghaus | **Study Vault (`16 // Study Vault`)** | **1-3-7 Spaced Revision Matrix** auto-schedules reviews at `+1`, `+3`, and `+7` days on creation, paired with a recursive **Problem Vault** notebook for DSA, system design, and course notes. |
| ***The Psychology of Money* & Mental Accounting** | Morgan Housel & Richard Thaler | **Wallet Hub (`03 // My Wallet & Ledger` + `03B // Pay Yourself First`)** | **Wallet Hub Switcher** combining daily campus survival telemetry with the **"Pay Yourself First" Allocator** (auto-calculates savings cut % and transfers to target Savings Pots), **Safe-to-Spend-Today Ceiling**, **Survival Runway**, and the **Hostel Maggi Waste Index**. |
| **Type 1 vs. Type 2 Decisions & Circadian Launchpad** | Jeff Bezos & Andrew Huberman | **Executive Lab (`18 // Executive Function & Decision Matrix`)** | **01 // Morning Protocol** (*Zero-Screen First 30m*, *Sunlight & Hydration First*, *Hardest Task First*) + **02 // Night Protocol** (*Night-Before Launchpad*, *Lock Tomorrow's #1 Hardest Problem*, *Device Charge & Wind-Down*) + **03 // 2×2 Executive Decision Matrix** crossing *Important vs. Not Important* with *Irreversible vs. Reversible*. |
| ***Four Thousand Weeks* & Stoic *Memento Mori*** | Oliver Burkeman & Seneca | **Bio-State Hub (`17B // Life Wheel & Life in Weeks`)** | Integrated directly into **Bio-State Lab's Hub Switcher**: **Life in Weeks Grid** (`52 weeks × Target Age`) rendering every lived week vs. remaining week from your birth date, alongside an **8-Axis Life Wheel Audit**. |
| **Autonomic Neuro-Modulation & NSDR** | Andrew Huberman | **Bio-State Hub (`17 // Bio-State & NSDR Lab`)** | Full-width **NSDR Somatic Recovery & Synthesized Focus Audio Console** pairing zero-dependency **Web Audio API** synthesis (**Pink Noise**, **Brown Noise**, **White Noise**, **40 Hz Gamma Binaural Beats**, **NSDR Guided**) with a **4-Stage Guided NSDR Somatic Breathing Console** (`5M / 10M / 15M / 20M / 30M` durations, `4s Inhale – 4s Hold – 6s Exhale` cadence), **3,000 mL Hydration Telemetry**, and **7-Day Sleep Debt**. |
| **First-Principles Engineering & `.plan` Logs** | Elon Musk & John Carmack | **Academy Execution Hub**, **Innovation Canvas**, **Trajectory** & **System Core** | **Execution Hub** linking Courses, Missions (`₹` bounties), and Shipped Builds; **Universal File Vault + Interactive HTML5 Wireframe Sketch Pad**; **SVG Baseline-to-Now Delta Charts**; and **100% Local-First Sovereignty**. |

---

## 3. Complete Module-by-Module Architecture

### I. Daily Command, Dayflow Timeline, Execution Hub & Capital Hub
1. **Today (`01 // Telemetry Workbench` — `DashboardView`)**
   - **4-Column Calibrated KPI Matrix:** Live readouts with 12-segment progress bars (`SegmentedTelemetryBar`) for **Attendance Aggregate**, **Net Liquid Capital (`₹`)**, **Active Missions**, and **Deep Work Logged (`LVL` & `XP`)**.
   - **Top 3 Daily Priorities**, **Streak // Per Habit**, **Countdown Readout**, **02 // Instant Telemetry Capture**, **03 // Priority Mission Queue**, and **04 // Deep Work Focus Engine**.
2. **Dayflow (`04 // Structured Timeline & Availability Planner` — `DayflowView`)**
   - **View Switcher & Header:** Segmented toggle between **Day**, **Week**, and **Month** views, quick **Today** jump, `< / >` period steppers, **Mon–Sun Week Strip** with color-coded item indicator dots, and **Configure Timetable / Hours** gear modal (`wakeStartHour` – `wakeEndHour` + weekly class manager).
   - **Day View — Proportional Vertical Timeline & In-Between Free Time Pills:**
     - Live glowing current-time indicator banner & node (`LIVE NOW`).
     - Color-coded cards distinguishing **Recurring Weekly Classes** (`CLASS` badge, skip-for-today button) from **Actionable Tasks** (one-click completion checkbox awarding `+15 XP`).
     - **In-Between Free Time Pills:** Automatically calculates every open gap between scheduled blocks (`"2h 15m free • + Add"`) and pre-fills the Quick-Add modal with that exact start time and available gap duration (`Fill Full Gap`).
   - **Week & Month Availability Views:**
     - **7-Column Week View:** Displays busy blocks vs. open free-time slots side-by-side and highlights remaining free hours (`"6h 30m free"` or `"Completely Free"`).
     - **Month View:** Highlights **Free Days**, **Light Days**, and workload density across the month.
     - **Editable Day Status:** One-click day status tags (**`Free Day`**, **`Holiday / No Class`** which suppresses recurring classes for that date, and **`Focus Day`**).
   - **Collapsible Inbox Tray:** Unscheduled task backlog alongside the timeline with one-click **`Slot into Free Gap`** scheduling.
   - **Persistence:** Saved automatically in `localStorage` under `flux_os_dayflow` (and bundled in System Core JSON Snapshots).
3. **Academy & Execution Hub (`02 // B.Tech Academic Telemetry` — `AcademyView`, `MissionsView`, `ProjectsView`)**
   - Houses the **EXECUTION HUB** switcher bar (`Missions & ₹ Bounties` · `Project Lab` · `Academy Matrix`).
4. **Wallet & Capital Hub (`03 // Campus Wallet & Capital Allocation` — `BankView`, `MoneyAllocatorView`)**
   - Houses the **WALLET HUB** switcher bar (`My Wallet & Ledger` · `Pay Yourself First`).
5. **Innovation Canvas (`06B // Universal Document, Spreadsheet, PDF & Wireframe Studio` — `InnovationCanvasView`)**
   - **Universal File Vault** (PDFs, Word docs, spreadsheets, slide decks, code, archives, images) + **Interactive HTML5 Wireframe Sketch Pad**.

### II. Habits, Focus, Spaced Retrieval & Bio-State Hub
6. **Habit Matrix (`11 // Habit Verification Calendar, Rest Shield & Consistency Compound Engine` — `HabitsView`)**
7. **Focus Discipline (`20 // Focus Discipline & Cognitive Containment` — `FocusDisciplineView`)**
8. **Habit Design (`15 // Atomic Architecture & Identity Telemetry` — `HabitDesignView`)**
9. **Study Vault (`16 // Spaced Repetition & Hierarchical Knowledge Tree` — `StudyVaultView`)**
10. **Bio-State & Life Hub (`17 // Physiological Telemetry, Acoustic Neuro-Modulation & Life Audit` — `BioStateView`, `LifeAuditView`)**
    - Houses the **BIO-STATE HUB** switcher bar (`Bio-State & NSDR Lab` · `Life Wheel & Life in Weeks`).
    - Includes `01 // Hydration Telemetry (3000 mL Target)`, `02 // Sleep Architecture (8.0h Target)`, and the full-width `03 // NSDR Somatic Recovery & Synthesized Focus Audio Console`.
11. **Executive Lab (`18 // Autonomic Launch Checklist & Strategic Triage` — `ExecutiveView`)**
    - Houses side-by-side **01 // Morning Protocol** (*Zero-Screen First 30m*, *Sunlight & Hydration First*, *Hardest Task First*, *Meds & Morning Fuel*, *Dress & Ready to Launch*), **02 // Night Protocol** (*Night-Before Launchpad*, *Lock Tomorrow's #1 Hardest Problem*, *Device Charge & Zero-Screen Wind-Down*), and **03 // 2×2 Executive Decision Matrix**.
12. **Trajectory (`19 // Baseline Delta Charts & Milestone Chronology` — `TrajectoryView`)**

### III. System Core & Classified Vault Trapdoor
13. **System Core (`14 // System Configuration & Storage` — `SettingsView`)**
    - **Startup Security (`ACCESS SECURITY // STARTUP PASSWORD & PIN`):** Keep, change/update, or **remove (turn off)** the startup password/PIN (`XOR_BIT_AUTH_V1`). When removed, FLUX opens directly without asking for a PIN.
    - **Smart Device Installation (`DEVICE INSTALLATION // WEB APP`):** Single `Install FLUX App` card shown only when running in a browser and the app is not yet installed.
    - **Sidebar Module Visibility Manager**, **2 Engineering Themes (`Obsidian Precision` & `Editorial Paper`)**, **Operator Identity & Tactile Audio**, and **Local Storage Vault (`Export / Import JSON Snapshot`)**.
14. **Classified Vault Trapdoor (`08 & 09 // SecretVaultView` — Hidden Module)**
    - Zero sidebar footprint. Unlocked from **anywhere in FLUX** by pressing **`H` then `O`** (outside text inputs) or **`Alt + V`** / **`Ctrl + Shift + V`**. Press **`Esc`** to lock immediately.
    - Houses **Memory Vault** and **Experience Archive**.

---

## 4. Quick Start & Keyboard Shortcuts

| Shortcut | Scope | Action |
| :--- | :--- | :--- |
| `Ctrl + K` / `⌘ + K` | Global | Toggle the **Command Palette** (jump to any module or search courses, Dayflow blocks, missions, projects, and Innovation Canvas ideas). |
| `/` | Global *(outside inputs)* | Open the **Command Palette** immediately. |
| `1` – `9` | Global *(outside inputs)* | Jump directly to the 1st through 9th visible sidebar modules (`1` Today, `2` Dayflow, `3` Academy, `4` Wallet, `5` Innovation Canvas, `6` Habit Matrix, `7` Focus Discipline, `8` Habit Design, `9` Study Vault). |
| `H` then `O` *(outside inputs)* or `Alt + V` / `Ctrl + Shift + V` | Global | Unlock and open the hidden **Classified Vault Trapdoor** (`Memory Vault` + `Experience Archive`). |
| `Ctrl + V` / `⌘ + V` | **Innovation Canvas** | Paste any copied file or screenshot directly from your system clipboard into the active Idea Specification Card. |
| `Esc` | Global | Close open modals / Command Palette, or immediately **Lock the Classified Vault Trapdoor** and return to Today. |

---

## Credits

Designed, architected, and developed by **Shrishaila M**.
