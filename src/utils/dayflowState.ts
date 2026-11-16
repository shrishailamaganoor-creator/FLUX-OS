export const DAYFLOW_STORAGE_KEY = 'flux_os_dayflow';

export type DayflowCategory =
  | 'lecture'
  | 'lab'
  | 'deepwork'
  | 'assignment'
  | 'personal'
  | 'health';

export interface DayflowCategoryMeta {
  id: DayflowCategory;
  label: string;
  color: string;
  bgSoft: string;
  borderSoft: string;
}

export const DAYFLOW_CATEGORIES: DayflowCategoryMeta[] = [
  {
    id: 'lecture',
    label: 'Lecture / Class',
    color: '#3B82F6',
    bgSoft: 'rgba(59, 130, 246, 0.14)',
    borderSoft: 'rgba(59, 130, 246, 0.38)'
  },
  {
    id: 'lab',
    label: 'Engineering Lab',
    color: '#A855F7',
    bgSoft: 'rgba(168, 85, 247, 0.14)',
    borderSoft: 'rgba(168, 85, 247, 0.38)'
  },
  {
    id: 'deepwork',
    label: 'Deep Work / Build',
    color: '#10B981',
    bgSoft: 'rgba(16, 185, 129, 0.14)',
    borderSoft: 'rgba(16, 185, 129, 0.38)'
  },
  {
    id: 'assignment',
    label: 'Exam / Deadline',
    color: '#F59E0B',
    bgSoft: 'rgba(245, 158, 11, 0.14)',
    borderSoft: 'rgba(245, 158, 11, 0.38)'
  },
  {
    id: 'personal',
    label: 'Personal / Errand',
    color: '#06B6D4',
    bgSoft: 'rgba(6, 182, 212, 0.14)',
    borderSoft: 'rgba(6, 182, 212, 0.38)'
  },
  {
    id: 'health',
    label: 'Health / Training',
    color: '#F43F5E',
    bgSoft: 'rgba(244, 63, 94, 0.14)',
    borderSoft: 'rgba(244, 63, 94, 0.38)'
  }
];

export type DayStatusType = 'free' | 'holiday' | 'focus';

export interface DayStatusMeta {
  id: DayStatusType;
  label: string;
  shortLabel: string;
  color: string;
  suppressClasses: boolean;
}

export const DAY_STATUS_OPTIONS: DayStatusMeta[] = [
  {
    id: 'free',
    label: 'Free Day',
    shortLabel: 'FREE DAY',
    color: '#10B981',
    suppressClasses: false
  },
  {
    id: 'holiday',
    label: 'Holiday / No Class',
    shortLabel: 'HOLIDAY • NO CLASS',
    color: '#F59E0B',
    suppressClasses: true
  },
  {
    id: 'focus',
    label: 'Focus Day',
    shortLabel: 'FOCUS DAY',
    color: '#3B82F6',
    suppressClasses: false
  }
];

export interface DayflowRecurringClass {
  id: string;
  title: string;
  category: DayflowCategory;
  startTime: string; // "HH:MM" 24h
  durationMin: number;
  repeatDays: number[]; // 1=Mon ... 7=Sun (ISO weekday: Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6, Sun=7)
  skippedDates?: string[]; // ["YYYY-MM-DD"]
  roomOrNote?: string;
}

export interface DayflowTask {
  id: string;
  title: string;
  category: DayflowCategory;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:MM"
  durationMin: number;
  completed: boolean;
  note?: string;
}

export interface DayflowInboxItem {
  id: string;
  title: string;
  category: DayflowCategory;
  durationMin: number;
  createdAt: string;
}

export interface DayflowConfig {
  wakeStartHour: number; // e.g., 6 (06:00)
  wakeEndHour: number; // e.g., 23 (23:00)
}

export interface DayflowState {
  config: DayflowConfig;
  recurringClasses: DayflowRecurringClass[];
  tasks: DayflowTask[];
  inbox: DayflowInboxItem[];
  dayOverrides: Record<string, DayStatusType>; // "YYYY-MM-DD" -> 'free' | 'holiday' | 'focus'
}

export const DEFAULT_DAYFLOW_STATE: DayflowState = {
  config: {
    wakeStartHour: 6,
    wakeEndHour: 23
  },
  recurringClasses: [],
  tasks: [],
  inbox: [],
  dayOverrides: {}
};

export interface TimelineBlock {
  id: string;
  sourceId: string;
  title: string;
  kind: 'class' | 'task';
  category: DayflowCategory;
  startTime: string;
  endTime: string;
  startMin: number;
  endMin: number;
  durationMin: number;
  completed?: boolean;
  repeatDays?: number[];
  roomOrNote?: string;
}

export interface FreeTimeGap {
  startMin: number;
  endMin: number;
  startTime: string;
  endTime: string;
  durationMin: number;
  label: string;
}

export function formatYMDLocal(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function parseYMDLocal(ymd: string): Date {
  const [y, m, d] = (ymd || '').split('-').map(Number);
  if (!y || !m || !d) return new Date();
  return new Date(y, m - 1, d);
}

/**
 * Returns ISO weekday 1 (Mon) .. 7 (Sun)
 */
export function getIsoWeekday(d: Date): number {
  const day = d.getDay();
  return day === 0 ? 7 : day;
}

export function timeToMinutes(hhmm: string): number {
  const parts = (hhmm || '00:00').split(':').map(Number);
  const h = Number.isFinite(parts[0]) ? Math.max(0, Math.min(23, parts[0])) : 0;
  const m = Number.isFinite(parts[1]) ? Math.max(0, Math.min(59, parts[1])) : 0;
  return h * 60 + m;
}

export function minutesToTime(totalMin: number): string {
  const clamped = Math.max(0, Math.min(24 * 60, Math.round(totalMin)));
  const h = Math.floor(clamped / 60) % 24;
  const m = clamped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function formatTime12h(hhmm: string): string {
  const mins = timeToMinutes(hhmm);
  const h24 = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

export function formatDurationCompact(durationMin: number): string {
  const mins = Math.max(0, Math.round(durationMin));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export function getCategoryMeta(catId?: string): DayflowCategoryMeta {
  return DAYFLOW_CATEGORIES.find((c) => c.id === catId) || DAYFLOW_CATEGORIES[0];
}

export function getDayStatusMeta(status?: DayStatusType): DayStatusMeta | null {
  if (!status) return null;
  return DAY_STATUS_OPTIONS.find((s) => s.id === status) || null;
}

export function loadDayflowState(): DayflowState {
  try {
    if (typeof localStorage === 'undefined') return DEFAULT_DAYFLOW_STATE;
    const raw = localStorage.getItem(DAYFLOW_STORAGE_KEY);
    if (!raw) return DEFAULT_DAYFLOW_STATE;
    const parsed = JSON.parse(raw);
    return normalizeDayflowState(parsed);
  } catch {
    return DEFAULT_DAYFLOW_STATE;
  }
}

export function saveDayflowState(state: DayflowState, broadcastEvent = false): boolean {
  try {
    if (typeof localStorage === 'undefined') return false;
    localStorage.setItem(DAYFLOW_STORAGE_KEY, JSON.stringify(state));
    if (broadcastEvent && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('flux-dayflow-updated'));
    }
    return true;
  } catch {
    return false;
  }
}

export function normalizeDayflowState(candidate: any): DayflowState {
  if (!candidate || typeof candidate !== 'object') return DEFAULT_DAYFLOW_STATE;
  const rawStart = Number(candidate.config?.wakeStartHour);
  const rawEnd = Number(candidate.config?.wakeEndHour);
  const wakeStartHour = Number.isFinite(rawStart) ? Math.max(0, Math.min(22, Math.floor(rawStart))) : 6;
  const wakeEndHour = Number.isFinite(rawEnd) ? Math.max(wakeStartHour + 1, Math.min(24, Math.floor(rawEnd))) : 23;

  return {
    config: { wakeStartHour, wakeEndHour },
    recurringClasses: Array.isArray(candidate.recurringClasses) ? candidate.recurringClasses : [],
    tasks: Array.isArray(candidate.tasks) ? candidate.tasks : [],
    inbox: Array.isArray(candidate.inbox) ? candidate.inbox : [],
    dayOverrides:
      candidate.dayOverrides && typeof candidate.dayOverrides === 'object' && !Array.isArray(candidate.dayOverrides)
        ? candidate.dayOverrides
        : {}
  };
}

function mergeDayflowCollection<T extends { id?: string; title?: string; startTime?: string; date?: string }>(
  existing: T[],
  incoming: T[],
  prefix: string
): T[] {
  const result: T[] = Array.isArray(existing) ? existing.map((item) => ({ ...item })) : [];
  const incomingList = Array.isArray(incoming) ? incoming : [];

  incomingList.forEach((inc, idx) => {
    if (!inc || typeof inc !== 'object') return;
    const incTitle = String(inc.title || '').trim().toLowerCase();
    const incStart = String(inc.startTime || '').trim();
    const incDate = String(inc.date || '').trim();

    // Check if an identical item already exists by content
    const contentMatchIdx = result.findIndex((ex) => {
      const exTitle = String(ex.title || '').trim().toLowerCase();
      const exStart = String(ex.startTime || '').trim();
      const exDate = String(ex.date || '').trim();
      return exTitle === incTitle && exStart === incStart && exDate === incDate && exTitle.length > 0;
    });

    if (contentMatchIdx !== -1) {
      result[contentMatchIdx] = { ...result[contentMatchIdx], ...inc, id: result[contentMatchIdx].id || inc.id };
      return;
    }

    // Check if ID collides with a different item
    const idMatchIdx = inc.id ? result.findIndex((ex) => ex.id === inc.id) : -1;
    if (idMatchIdx === -1) {
      result.push({
        ...inc,
        id: inc.id || `${prefix}-${Date.now()}-${idx}`
      });
    } else {
      // Different item content that happened to share the same ID in a second JSON file: preserve both!
      result.push({
        ...inc,
        id: `${inc.id}-m${idx}-${Math.random().toString(36).slice(2, 6)}`
      });
    }
  });

  return result;
}

export function mergeDayflowStates(baseCandidate: any, incomingCandidate: any): DayflowState {
  const base = normalizeDayflowState(baseCandidate);
  const inc = normalizeDayflowState(incomingCandidate);

  const wakeStartHour = Math.min(base.config.wakeStartHour, inc.config.wakeStartHour);
  const wakeEndHour = Math.max(base.config.wakeEndHour, inc.config.wakeEndHour);

  return {
    config: { wakeStartHour, wakeEndHour },
    recurringClasses: mergeDayflowCollection(base.recurringClasses, inc.recurringClasses, 'cls'),
    tasks: mergeDayflowCollection(base.tasks, inc.tasks, 'dft'),
    inbox: mergeDayflowCollection(base.inbox, inc.inbox, 'dfi'),
    dayOverrides: {
      ...(base.dayOverrides || {}),
      ...(inc.dayOverrides || {})
    }
  };
}

/**
 * Computes all scheduled blocks (recurring classes + date tasks) for a given YYYY-MM-DD date,
 * sorted chronologically by startMin.
 * If the date has a 'holiday' override, recurring classes are suppressed for that date.
 */
export function getBlocksForDate(state: DayflowState, dateKey: string): TimelineBlock[] {
  const dateObj = parseYMDLocal(dateKey);
  const isoDay = getIsoWeekday(dateObj);
  const statusOverride = state.dayOverrides?.[dateKey];
  const suppressClasses = statusOverride === 'holiday';

  const classBlocks: TimelineBlock[] = suppressClasses
    ? []
    : (state.recurringClasses || [])
        .filter((cls) => {
          const repeats = Array.isArray(cls.repeatDays) && cls.repeatDays.includes(isoDay);
          const skipped = Array.isArray(cls.skippedDates) && cls.skippedDates.includes(dateKey);
          return repeats && !skipped;
        })
        .map((cls) => {
          const startMin = timeToMinutes(cls.startTime);
          const durationMin = Math.max(15, Number(cls.durationMin) || 60);
          const endMin = Math.min(24 * 60, startMin + durationMin);
          return {
            id: `cls-${cls.id}-${dateKey}`,
            sourceId: cls.id,
            title: cls.title,
            kind: 'class' as const,
            category: cls.category || 'lecture',
            startTime: minutesToTime(startMin),
            endTime: minutesToTime(endMin),
            startMin,
            endMin,
            durationMin: endMin - startMin,
            repeatDays: cls.repeatDays,
            roomOrNote: cls.roomOrNote
          };
        });

  const taskBlocks: TimelineBlock[] = (state.tasks || [])
    .filter((t) => t.date === dateKey)
    .map((t) => {
      const startMin = timeToMinutes(t.startTime);
      const durationMin = Math.max(15, Number(t.durationMin) || 30);
      const endMin = Math.min(24 * 60, startMin + durationMin);
      return {
        id: t.id,
        sourceId: t.id,
        title: t.title,
        kind: 'task' as const,
        category: t.category || 'deepwork',
        startTime: minutesToTime(startMin),
        endTime: minutesToTime(endMin),
        startMin,
        endMin,
        durationMin: endMin - startMin,
        completed: Boolean(t.completed),
        roomOrNote: t.note
      };
    });

  return [...classBlocks, ...taskBlocks].sort((a, b) => {
    if (a.startMin !== b.startMin) return a.startMin - b.startMin;
    return a.endMin - b.endMin;
  });
}

/**
 * Calculates every open free-time gap (>= minGapMinutes) within waking hours for a date's blocks.
 */
export function calculateFreeTimeGaps(
  blocks: TimelineBlock[],
  wakeStartHour = 6,
  wakeEndHour = 23,
  minGapMinutes = 15
): FreeTimeGap[] {
  const windowStart = Math.max(0, Math.min(23, wakeStartHour)) * 60;
  const windowEnd = Math.max(windowStart + 60, Math.min(24, wakeEndHour) * 60);

  if (!blocks || blocks.length === 0) {
    const durationMin = windowEnd - windowStart;
    return [
      {
        startMin: windowStart,
        endMin: windowEnd,
        startTime: minutesToTime(windowStart),
        endTime: minutesToTime(windowEnd),
        durationMin,
        label: `${formatDurationCompact(durationMin)} free • + Add`
      }
    ];
  }

  // Merge overlapping busy intervals clamped to waking window
  const intervals = blocks
    .map((b) => ({
      start: Math.max(windowStart, b.startMin),
      end: Math.min(windowEnd, b.endMin)
    }))
    .filter((iv) => iv.end > iv.start)
    .sort((a, b) => a.start - b.start);

  const merged: { start: number; end: number }[] = [];
  for (const iv of intervals) {
    if (merged.length === 0 || iv.start > merged[merged.length - 1].end) {
      merged.push({ ...iv });
    } else {
      merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, iv.end);
    }
  }

  const gaps: FreeTimeGap[] = [];
  let cursor = windowStart;

  for (const busy of merged) {
    if (busy.start - cursor >= minGapMinutes) {
      const durationMin = busy.start - cursor;
      gaps.push({
        startMin: cursor,
        endMin: busy.start,
        startTime: minutesToTime(cursor),
        endTime: minutesToTime(busy.start),
        durationMin,
        label: `${formatDurationCompact(durationMin)} free • + Add`
      });
    }
    cursor = Math.max(cursor, busy.end);
  }

  if (windowEnd - cursor >= minGapMinutes) {
    const durationMin = windowEnd - cursor;
    gaps.push({
      startMin: cursor,
      endMin: windowEnd,
      startTime: minutesToTime(cursor),
      endTime: minutesToTime(windowEnd),
      durationMin,
      label: `${formatDurationCompact(durationMin)} free • + Add`
    });
  }

  return gaps;
}

export interface DayAvailabilitySummary {
  dateKey: string;
  blocks: TimelineBlock[];
  gaps: FreeTimeGap[];
  busyMinutes: number;
  freeMinutes: number;
  totalWakingMinutes: number;
  density: 'free' | 'light' | 'moderate' | 'heavy';
  statusOverride?: DayStatusType;
  freeSummaryLabel: string;
}

export function getDayAvailabilitySummary(state: DayflowState, dateKey: string): DayAvailabilitySummary {
  const wakeStart = state.config?.wakeStartHour ?? 6;
  const wakeEnd = state.config?.wakeEndHour ?? 23;
  const totalWakingMinutes = Math.max(60, (wakeEnd - wakeStart) * 60);
  const blocks = getBlocksForDate(state, dateKey);
  const gaps = calculateFreeTimeGaps(blocks, wakeStart, wakeEnd, 15);
  const freeMinutes = gaps.reduce((acc, g) => acc + g.durationMin, 0);
  const busyMinutes = Math.max(0, totalWakingMinutes - freeMinutes);
  const statusOverride = state.dayOverrides?.[dateKey];

  let density: 'free' | 'light' | 'moderate' | 'heavy' = 'free';
  if (busyMinutes === 0) {
    density = 'free';
  } else if (busyMinutes <= 180) {
    density = 'light';
  } else if (busyMinutes <= 360) {
    density = 'moderate';
  } else {
    density = 'heavy';
  }

  const freeSummaryLabel =
    busyMinutes === 0
      ? 'Completely Free'
      : freeMinutes <= 0
      ? 'Fully Booked'
      : `${formatDurationCompact(freeMinutes)} free`;

  return {
    dateKey,
    blocks,
    gaps,
    busyMinutes,
    freeMinutes,
    totalWakingMinutes,
    density,
    statusOverride,
    freeSummaryLabel
  };
}

/**
 * Returns the 7 dates (Mon..Sun) of the ISO week containing `anchorDate`
 */
export function getMondayToSundayWeek(anchorDate: Date): { date: Date; key: string; isoDay: number; shortDay: string; dayNum: number }[] {
  const iso = getIsoWeekday(anchorDate);
  const monday = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), anchorDate.getDate() - (iso - 1));
  const DAY_NAMES = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + idx);
    return {
      date: d,
      key: formatYMDLocal(d),
      isoDay: idx + 1,
      shortDay: DAY_NAMES[idx],
      dayNum: d.getDate()
    };
  });
}
