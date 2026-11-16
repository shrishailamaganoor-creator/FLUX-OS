export const STORAGE_KEY = 'NEXORA_ARCHITECTURAL_OS_V1';
export const IDB_NAME = 'NexoraStyleVaultDB';
export const IDB_STORE = 'garmentMedia';
export const AUTH_KEY = 'XOR_BIT_AUTH_V1';

export const DEFAULT_DAY_TYPES = [
  { id: 'productive', label: 'Logged / Productive Day', color: '#10B981' },
  { id: 'hackathon', label: 'Hackathon / Deep Build Day', color: '#F59E0B' },
  { id: 'chill', label: 'Movie / Chill Day', color: '#EAB308' },
  { id: 'travel', label: 'Outing / Travel Day', color: '#06B6D4' },
  { id: 'deadline', label: 'Holiday / Exam / Deadline', color: '#F43F5E' },
  { id: 'rest', label: 'Rest / Recharge Day', color: '#A855F7' },
  { id: 'zeroday', label: 'Zero Day', color: '#71717A' }
];

export const EMPTY_STATE = {
  habitDesigns: [] as any[],
  identityVotes: [] as any[],
  revisionTopics: [] as any[],
  problemPages: [] as any[],
  bioLog: { days: {} as Record<string, any>, templates: {} as Record<string, any> },
  audioPrefs: { track: 'pink', volume: 0.4, timerMin: 15, nsdrDuration: 10 },
  morningRoutine: [] as any[],
  morningLog: {} as Record<string, any>,
  nightRoutine: [] as any[],
  nightLog: {} as Record<string, any>,
  decisions: [] as any[],
  growthMetrics: [] as any[],
  roadmaps: [] as any[],
  feynmanNotes: [] as any[],
  recallQs: [] as any[],
  lifeWheel: [] as any[],
  lifeSettings: {} as Record<string, any>,
  profile: {
    name: 'Shrishaila M',
    title: 'B.Tech Engineering',
    semester: 'Semester 1',
    theme: 'obsidian', // 'obsidian' | 'paper'
    soundEnabled: true,
    gamificationEnabled: true,
    xp: 0
  },
  subjects: [] as any[],
  transactions: [] as any[],
  savingsPots: [] as any[],
  tasks: [] as any[],
  skills: [] as any[],
  projects: [] as any[],
  ideas: [] as any[],
  wardrobe: [] as any[],
  outfits: [] as any[],
  experiences: [] as any[],
  diary: [] as any[],
  calendarEvents: [] as any[],
  dayTags: {} as Record<string, any>,
  customDayTypes: [] as any[],
  habits: [] as any[],
  habitShields: {} as Record<string, any>,
  extracurriculars: [] as any[],
  focusSessions: [] as any[],
  distractionLog: [] as any[],
  shutdownDays: {} as Record<string, any>,
  focusGoalHrs: 10,
  arcadeScores: {
    roverNodes: 0,
    snakeHigh: 0,
    pongWins: 0,
    reactionBestMs: 0,
    memoryHigh: 0
  }
};

export const JSON_SLOTS_KEY = 'FLUX_JSON_SLOTS_V1';

export function isPlainObject(value: unknown): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function mergeValidatedState(defaults: any, candidate: any, path = 'state'): any {
  if (Array.isArray(defaults)) {
    if (candidate === undefined || candidate === null) return [];
    if (!Array.isArray(candidate)) throw new Error(`${path} must be an array`);
    return candidate;
  }

  if (isPlainObject(defaults)) {
    if (candidate === undefined || candidate === null) return { ...defaults };
    if (!isPlainObject(candidate)) throw new Error(`${path} must be an object`);
    const merged: Record<string, any> = { ...defaults };
    Object.entries(candidate).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      merged[key] = Object.prototype.hasOwnProperty.call(defaults, key)
        ? mergeValidatedState(defaults[key], value, `${path}.${key}`)
        : value;
    });
    return merged;
  }

  if (candidate === undefined || candidate === null) return defaults;
  if (typeof candidate !== typeof defaults) throw new Error(`${path} has an invalid value`);
  return candidate;
}

export function normalizeImportedState(candidate: unknown) {
  if (!isPlainObject(candidate)) throw new Error('Backup data must be an object');
  const normalized = mergeValidatedState(EMPTY_STATE, candidate);
  normalized.tasks = normalized.tasks.map((task: any) =>
    task && task.completed && task.rewardClaimed === undefined ? { ...task, rewardClaimed: true } : task
  );
  return normalized;
}

export function validateImportedMedia(candidate: unknown): Record<string, string> {
  if (!isPlainObject(candidate)) throw new Error('Backup media must be an object');
  const media: Record<string, string> = {};
  Object.entries(candidate).forEach(([key, value]) => {
    if (typeof value === 'string' && value.length > 0) {
      media[key] = value;
    } else if (value !== null && value !== undefined) {
      throw new Error('Backup contains invalid media');
    }
  });
  return media;
}

function getItemSignature(item: any): string {
  if (!isPlainObject(item)) return String(item);
  const label =
    item.title ??
    item.name ??
    item.question ??
    item.topic ??
    item.anchor ??
    item.habit ??
    item.statement ??
    item.axis ??
    item.label ??
    item.desc ??
    item.text ??
    '';
  const secondary =
    item.date ??
    item.due ??
    item.startTime ??
    item.time ??
    item.code ??
    item.category ??
    item.type ??
    item.amount ??
    '';
  return `${String(label).trim().toLowerCase()}::${String(secondary).trim().toLowerCase()}`;
}

export function mergeArrayItems(existing: any[], incoming: any[], keyPrefix = 'item'): any[] {
  const baseList = Array.isArray(existing) ? existing.map((x) => (isPlainObject(x) ? { ...x } : x)) : [];
  const incList = Array.isArray(incoming) ? incoming : [];

  incList.forEach((inc, idx) => {
    if (inc === null || inc === undefined) return;
    if (!isPlainObject(inc)) {
      if (!baseList.includes(inc)) baseList.push(inc);
      return;
    }

    const incSig = getItemSignature(inc);
    const hasMeaningfulSig = incSig !== '::';

    // 1. Check if an item with the exact same logical signature already exists
    const sigMatchIdx = hasMeaningfulSig
      ? baseList.findIndex((ex) => isPlainObject(ex) && getItemSignature(ex) === incSig)
      : -1;

    if (sigMatchIdx !== -1) {
      const exItem = baseList[sigMatchIdx];
      const mergedItem: Record<string, any> = { ...exItem, ...inc, id: exItem.id || inc.id };
      // Merge nested arrays if present (e.g. attachments, milestones, history, subpages)
      ['attachments', 'milestones', 'history', 'subpages', 'sessions'].forEach((subKey) => {
        if (Array.isArray(exItem[subKey]) || Array.isArray(inc[subKey])) {
          mergedItem[subKey] = mergeArrayItems(exItem[subKey] || [], inc[subKey] || [], subKey);
        }
      });
      // Merge nested log objects if present (e.g. habit logs)
      if (isPlainObject(exItem.logs) || isPlainObject(inc.logs)) {
        mergedItem.logs = { ...(exItem.logs || {}), ...(inc.logs || {}) };
      }
      baseList[sigMatchIdx] = mergedItem;
      return;
    }

    // 2. Check if the incoming item's ID collides with a DIFFERENT existing item
    const idCollision = inc.id !== undefined && baseList.some((ex) => isPlainObject(ex) && ex.id === inc.id);
    if (!idCollision) {
      baseList.push({
        ...inc,
        id: inc.id !== undefined ? inc.id : `${keyPrefix}-${Date.now()}-${idx}`
      });
    } else {
      // Preserve both items by assigning a fresh unique ID to the incoming item from the 2nd JSON file
      baseList.push({
        ...inc,
        id: `${inc.id}-m${idx}-${Math.random().toString(36).slice(2, 6)}`
      });
    }
  });

  return baseList;
}

export function mergeNexoraStates(baseCandidate: unknown, incomingCandidate: unknown) {
  const base = isPlainObject(baseCandidate) ? normalizeImportedState(baseCandidate) : normalizeImportedState({});
  const inc = isPlainObject(incomingCandidate) ? normalizeImportedState(incomingCandidate) : normalizeImportedState({});

  const merged: Record<string, any> = { ...EMPTY_STATE };

  Object.keys(EMPTY_STATE).forEach((key) => {
    const defVal = (EMPTY_STATE as Record<string, any>)[key];
    const baseVal = base[key];
    const incVal = inc[key];

    if (Array.isArray(defVal)) {
      merged[key] = mergeArrayItems(baseVal || [], incVal || [], key);
      return;
    }

    if (key === 'bioLog') {
      const baseDays = baseVal?.days || {};
      const incDays = incVal?.days || {};
      const allDayKeys = new Set([...Object.keys(baseDays), ...Object.keys(incDays)]);
      const mergedDays: Record<string, any> = {};
      allDayKeys.forEach((dKey) => {
        const bDay = baseDays[dKey] || {};
        const iDay = incDays[dKey] || {};
        mergedDays[dKey] = {
          ...bDay,
          ...iDay,
          waterMl: Math.max(Number(bDay.waterMl) || 0, Number(iDay.waterMl) || 0),
          sleepHrs: Math.max(Number(bDay.sleepHrs) || 0, Number(iDay.sleepHrs) || 0),
          schedule: mergeArrayItems(bDay.schedule || [], iDay.schedule || [], 'blk')
        };
      });
      merged.bioLog = {
        days: mergedDays,
        templates: { ...(baseVal?.templates || {}), ...(incVal?.templates || {}) }
      };
      return;
    }

    if (key === 'morningLog' || key === 'nightLog') {
      const bLog = isPlainObject(baseVal) ? baseVal : {};
      const iLog = isPlainObject(incVal) ? incVal : {};
      const allDates = new Set([...Object.keys(bLog), ...Object.keys(iLog)]);
      const combinedLog: Record<string, any> = {};
      allDates.forEach((dKey) => {
        combinedLog[dKey] = { ...(bLog[dKey] || {}), ...(iLog[dKey] || {}) };
      });
      merged[key] = combinedLog;
      return;
    }

    if (key === 'profile') {
      const bProf = isPlainObject(baseVal) ? baseVal : EMPTY_STATE.profile;
      const iProf = isPlainObject(incVal) ? incVal : EMPTY_STATE.profile;
      const pickCustom = (bField: any, iField: any, defField: any) =>
        iField && iField !== defField ? iField : bField || defField;
      merged.profile = {
        ...EMPTY_STATE.profile,
        ...bProf,
        ...iProf,
        name: pickCustom(bProf.name, iProf.name, EMPTY_STATE.profile.name),
        title: pickCustom(bProf.title, iProf.title, EMPTY_STATE.profile.title),
        semester: pickCustom(bProf.semester, iProf.semester, EMPTY_STATE.profile.semester),
        xp: Math.max(Number(bProf.xp) || 0, Number(iProf.xp) || 0)
      };
      return;
    }

    if (key === 'arcadeScores') {
      const bArc = isPlainObject(baseVal) ? baseVal : EMPTY_STATE.arcadeScores;
      const iArc = isPlainObject(incVal) ? incVal : EMPTY_STATE.arcadeScores;
      const bReact = Number(bArc.reactionBestMs) || 0;
      const iReact = Number(iArc.reactionBestMs) || 0;
      merged.arcadeScores = {
        roverNodes: Math.max(Number(bArc.roverNodes) || 0, Number(iArc.roverNodes) || 0),
        snakeHigh: Math.max(Number(bArc.snakeHigh) || 0, Number(iArc.snakeHigh) || 0),
        pongWins: Math.max(Number(bArc.pongWins) || 0, Number(iArc.pongWins) || 0),
        memoryHigh: Math.max(Number(bArc.memoryHigh) || 0, Number(iArc.memoryHigh) || 0),
        reactionBestMs: bReact > 0 && iReact > 0 ? Math.min(bReact, iReact) : Math.max(bReact, iReact)
      };
      return;
    }

    if (isPlainObject(defVal)) {
      merged[key] = {
        ...defVal,
        ...(isPlainObject(baseVal) ? baseVal : {}),
        ...(isPlainObject(incVal) ? incVal : {})
      };
      return;
    }

    merged[key] = incVal !== undefined && incVal !== defVal ? incVal : baseVal !== undefined ? baseVal : defVal;
  });

  // Also preserve any extra top-level keys from either state (e.g., priorities, countdown)
  [base, inc].forEach((src) => {
    if (!isPlainObject(src)) return;
    Object.keys(src).forEach((k) => {
      if (!Object.prototype.hasOwnProperty.call(EMPTY_STATE, k)) {
        if (Array.isArray(src[k])) {
          merged[k] = mergeArrayItems(merged[k] || [], src[k], k);
        } else if (isPlainObject(src[k])) {
          merged[k] = { ...(merged[k] || {}), ...src[k] };
        } else if (src[k] !== undefined) {
          merged[k] = src[k];
        }
      }
    });
  });

  merged.tasks = (merged.tasks || []).map((task: any) =>
    task && task.completed && task.rewardClaimed === undefined ? { ...task, rewardClaimed: true } : task
  );

  return merged;
}

export function parseFlexibleJsonImport(parsed: unknown): {
  data: Record<string, any> | null;
  dayflow: Record<string, any> | null;
  media: Record<string, string> | null;
} {
  if (!isPlainObject(parsed)) {
    throw new Error('JSON file root must be an object');
  }

  // Case 1: Envelope format { format, data, dayflow, media }
  const hasDataEnvelope = isPlainObject(parsed.data);
  if (hasDataEnvelope) {
    const normalizedData = normalizeImportedState(parsed.data);
    const media = isPlainObject(parsed.media) ? validateImportedMedia(parsed.media) : null;
    const dayflow = isPlainObject(parsed.dayflow) ? parsed.dayflow : null;
    return {
      data: normalizedData,
      dayflow,
      media
    };
  }

  // Case 2: Standalone Dayflow JSON { config, recurringClasses, tasks, inbox, dayOverrides }
  const looksLikeStandaloneDayflow =
    (Array.isArray(parsed.recurringClasses) || isPlainObject(parsed.dayOverrides) || Array.isArray(parsed.inbox)) &&
    !Array.isArray(parsed.subjects) &&
    !Array.isArray(parsed.transactions);

  if (looksLikeStandaloneDayflow) {
    return {
      data: null,
      dayflow: parsed,
      media: isPlainObject(parsed.media) ? validateImportedMedia(parsed.media) : null
    };
  }

  // Case 3: Direct state object (full or partial) with optional inline dayflow/media
  const { dayflow: inlineDayflow, media: inlineMedia, format: _fmt, exportedAt: _exp, ...restState } = parsed;
  const normalizedData = normalizeImportedState(restState);
  return {
    data: normalizedData,
    dayflow: isPlainObject(inlineDayflow) ? inlineDayflow : null,
    media: isPlainObject(inlineMedia) ? validateImportedMedia(inlineMedia) : null
  };
}

export function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw);
    const mergedProfile = { ...EMPTY_STATE.profile, ...(parsed.profile || {}) };
    if (mergedProfile.name === 'Operator') mergedProfile.name = 'Shrishaila M';
    return {
      ...EMPTY_STATE,
      ...parsed,
      tasks: (Array.isArray(parsed.tasks) ? parsed.tasks : []).map((task: any) =>
        task && task.completed && task.rewardClaimed === undefined ? { ...task, rewardClaimed: true } : task
      ),
      profile: mergedProfile,
      arcadeScores: { ...EMPTY_STATE.arcadeScores, ...(parsed.arcadeScores || {}) },
      dayTags: parsed.dayTags || {},
      customDayTypes: parsed.customDayTypes || [],
      habitShields: parsed.habitShields || {},
      ideas: parsed.ideas || [],
      distractionLog: parsed.distractionLog || [],
      shutdownDays: parsed.shutdownDays || {},
      focusGoalHrs: parsed.focusGoalHrs !== undefined ? parsed.focusGoalHrs : 10,
      feynmanNotes: parsed.feynmanNotes || [],
      recallQs: parsed.recallQs || [],
      lifeWheel: parsed.lifeWheel || [],
      lifeSettings: parsed.lifeSettings || {}
    };
  } catch {
    return EMPTY_STATE;
  }
}

export function savePersistedState(state: unknown): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function ensureWritableFetch(target: any = typeof window !== 'undefined' ? window : undefined): boolean {
  if (!target) return false;
  try {
    let currentFetch = typeof target.fetch === 'function' ? target.fetch.bind(target) : target.fetch;
    const desc =
      Object.getOwnPropertyDescriptor(target, 'fetch') ||
      (typeof Window !== 'undefined' ? Object.getOwnPropertyDescriptor(Window.prototype, 'fetch') : undefined);
    if (!desc || desc.configurable !== false) {
      Object.defineProperty(target, 'fetch', {
        configurable: true,
        enumerable: true,
        get() {
          return currentFetch;
        },
        set(fn) {
          currentFetch = fn;
        },
      });
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function calculateAttendanceProjection(
  attended: number,
  total: number,
  targetPct = 75
): {
  currentPct: number;
  status: 'SAFE' | 'CRITICAL' | 'STANDBY';
  marginClasses: number;
  summary: string;
} {
  const safeTotal = Math.max(0, Math.floor(total));
  const safeAttended = Math.max(0, Math.min(safeTotal, Math.floor(attended)));
  const safeTarget = Math.max(1, Math.min(99, targetPct));

  if (safeTotal === 0) {
    return {
      currentPct: 0,
      status: 'STANDBY',
      marginClasses: 0,
      summary: 'No sessions logged yet'
    };
  }

  const currentPct = Math.round((safeAttended / safeTotal) * 1000) / 10;
  const targetRatio = safeTarget / 100;

  if (currentPct >= safeTarget) {
    const canMiss = Math.max(0, Math.floor(safeAttended / targetRatio - safeTotal));
    return {
      currentPct,
      status: 'SAFE',
      marginClasses: canMiss,
      summary: canMiss > 0 ? `Buffer: can miss ${canMiss} upcoming session${canMiss === 1 ? '' : 's'}` : 'On exact threshold boundary'
    };
  }

  const needed = Math.max(
    1,
    Math.ceil((targetRatio * safeTotal - safeAttended) / (1 - targetRatio))
  );
  return {
    currentPct,
    status: 'CRITICAL',
    marginClasses: -needed,
    summary: `Attend next ${needed} consecutive session${needed === 1 ? '' : 's'} to reach ${safeTarget}%`
  };
}

export interface CommandPaletteItem {
  id: string;
  label: string;
  category: string;
  shortcut?: string;
  keywords?: string;
}

export function filterCommandPaletteItems<T extends CommandPaletteItem>(
  items: T[],
  query: string
): T[] {
  const q = (query || '').trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) => {
    const haystack = `${item.label} ${item.category} ${item.keywords || ''} ${item.shortcut || ''}`.toLowerCase();
    return q.split(/\s+/).every((token) => haystack.includes(token));
  });
}


