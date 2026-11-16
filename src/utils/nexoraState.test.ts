import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EMPTY_STATE,
  calculateAttendanceProjection,
  ensureWritableFetch,
  filterCommandPaletteItems,
  isPlainObject,
  mergeNexoraStates,
  mergeValidatedState,
  normalizeImportedState,
  parseFlexibleJsonImport,
  validateImportedMedia,
} from './nexoraState';
import {
  DEFAULT_DAYFLOW_STATE,
  calculateFreeTimeGaps,
  getBlocksForDate,
  getDayAvailabilitySummary,
  mergeDayflowStates,
  normalizeDayflowState,
} from './dayflowState';

test('isPlainObject identifies plain objects vs arrays and primitives', () => {
  assert.equal(isPlainObject({ a: 1 }), true);
  assert.equal(isPlainObject([]), false);
  assert.equal(isPlainObject(null), false);
  assert.equal(isPlainObject('string'), false);
});

test('mergeValidatedState merges partial candidate state onto EMPTY_STATE defaults', () => {
  const merged = mergeValidatedState(EMPTY_STATE, {
    focusGoalHrs: 8,
    profile: { name: 'Shrishaila M', theme: 'paper' },
  });
  assert.equal(merged.focusGoalHrs, 8);
  assert.equal(merged.profile.theme, 'paper');
  assert.equal(merged.profile.soundEnabled, true);
  assert.deepEqual(merged.tasks, []);
});

test('normalizeImportedState marks completed tasks as rewardClaimed when missing', () => {
  const imported = normalizeImportedState({
    tasks: [
      { id: 't1', title: 'Complete OS Kernel Lab', completed: true },
      { id: 't2', title: 'Review Signals', completed: false },
    ],
  });
  assert.equal(imported.tasks[0].rewardClaimed, true);
  assert.equal(imported.tasks[1].rewardClaimed, undefined);
});

test('normalizeImportedState rejects invalid non-object backups or mismatched types', () => {
  assert.throws(() => normalizeImportedState(null), /Backup data must be an object/);
  assert.throws(
    () => normalizeImportedState({ focusGoalHrs: 'invalid' }),
    /state\.focusGoalHrs has an invalid value/
  );
});

test('validateImportedMedia accepts valid data URLs and rejects empty or non-string entries', () => {
  const valid = validateImportedMedia({ item1: 'data:image/png;base64,AAAA' });
  assert.equal(valid.item1, 'data:image/png;base64,AAAA');
  assert.throws(() => validateImportedMedia({ item1: '' }), /Backup contains invalid media/);
  assert.throws(() => validateImportedMedia([]), /Backup media must be an object/);
});

test('ensureWritableFetch allows assigning to a previously getter-only fetch property', () => {
  const mockWin: any = {};
  const originalFetch = async () => 'ok';
  Object.defineProperty(mockWin, 'fetch', {
    configurable: true,
    get() {
      return originalFetch;
    },
  });
  assert.throws(() => {
    'use strict';
    mockWin.fetch = async () => 'intercepted';
  }, /Cannot set property fetch/);

  assert.equal(ensureWritableFetch(mockWin), true);
  const replacementFetch = async () => 'intercepted';
  mockWin.fetch = replacementFetch;
  assert.equal(mockWin.fetch, replacementFetch);
});

test('calculateAttendanceProjection computes safe buffer and recovery sessions', () => {
  const safe = calculateAttendanceProjection(34, 40, 75);
  assert.equal(safe.currentPct, 85);
  assert.equal(safe.status, 'SAFE');
  assert.equal(safe.marginClasses, 5);

  const critical = calculateAttendanceProjection(20, 30, 75);
  assert.equal(critical.status, 'CRITICAL');
  assert.equal(critical.marginClasses, -10);
});

test('filterCommandPaletteItems matches multi-token fuzzy queries', () => {
  const items = [
    { id: '1', label: 'Launch Mission Control', category: 'OS MODULE', shortcut: '4' },
    { id: '2', label: 'Direction A: Obsidian Precision', category: 'THEME', shortcut: 'T' },
  ];
  assert.equal(filterCommandPaletteItems(items, 'mission 4').length, 1);
  assert.equal(filterCommandPaletteItems(items, 'obsidian theme').length, 1);
  assert.equal(filterCommandPaletteItems(items, 'nonexistent').length, 0);
});

test('Dayflow calculateFreeTimeGaps computes exact in-between free gaps within waking hours', () => {
  // 2026-11-16 is a Monday (ISO weekday 1)
  const state = normalizeDayflowState({
    config: { wakeStartHour: 8, wakeEndHour: 18 },
    recurringClasses: [
      {
        id: 'c1',
        title: 'Operating Systems Lecture',
        category: 'lecture',
        startTime: '09:00',
        durationMin: 60,
        repeatDays: [1, 3, 5],
      },
    ],
    tasks: [
      {
        id: 't1',
        title: 'Kernel Lab Prep',
        category: 'deepwork',
        date: '2026-11-16',
        startTime: '12:15',
        durationMin: 45,
        completed: false,
      },
    ],
  });

  const blocks = getBlocksForDate(state, '2026-11-16');
  assert.equal(blocks.length, 2);
  const gaps = calculateFreeTimeGaps(blocks, 8, 18, 15);
  // Expected gaps: 08:00-09:00 (1h), 10:00-12:15 (2h 15m), 13:00-18:00 (5h)
  assert.equal(gaps.length, 3);
  assert.equal(gaps[0].startTime, '08:00');
  assert.equal(gaps[0].endTime, '09:00');
  assert.equal(gaps[0].label, '1h free • + Add');
  assert.equal(gaps[1].startTime, '10:00');
  assert.equal(gaps[1].endTime, '12:15');
  assert.equal(gaps[1].label, '2h 15m free • + Add');
  assert.equal(gaps[2].startTime, '13:00');
  assert.equal(gaps[2].endTime, '18:00');
  assert.equal(gaps[2].label, '5h free • + Add');
});

test('Dayflow holiday day override suppresses recurring classes while preserving explicit tasks', () => {
  const state = normalizeDayflowState({
    ...DEFAULT_DAYFLOW_STATE,
    recurringClasses: [
      {
        id: 'c1',
        title: 'Algorithms',
        category: 'lecture',
        startTime: '10:00',
        durationMin: 60,
        repeatDays: [1],
      },
    ],
    tasks: [
      {
        id: 't1',
        title: 'Personal Reading',
        category: 'personal',
        date: '2026-11-16',
        startTime: '14:00',
        durationMin: 60,
        completed: false,
      },
    ],
    dayOverrides: {
      '2026-11-16': 'holiday',
    },
  });

  const summary = getDayAvailabilitySummary(state, '2026-11-16');
  assert.equal(summary.blocks.length, 1);
  assert.equal(summary.blocks[0].kind, 'task');
  assert.equal(summary.statusOverride, 'holiday');
});

test('mergeNexoraStates combines 2 different JSON files without losing items even when IDs collide', () => {
  const jsonFile1 = parseFlexibleJsonImport({
    format: 'FLUX_BACKUP_V1',
    data: {
      subjects: [{ id: 'sub-1', name: 'Operating Systems', attended: 18, total: 20 }],
      tasks: [{ id: 't-1', title: 'Write Memory Allocator', completed: false }],
      transactions: [{ id: 'tx-1', title: 'Hostel Mess', amount: 1500, type: 'expense', date: '2026-11-10' }],
    },
  });

  const jsonFile2 = parseFlexibleJsonImport({
    format: 'NEXORA_BACKUP_V1',
    data: {
      // Notice 'sub-1' and 't-1' collide by ID with jsonFile1, but have different titles/names!
      subjects: [{ id: 'sub-1', name: 'Computer Networks', attended: 15, total: 16 }],
      tasks: [{ id: 't-1', title: 'Implement TCP congestion control', completed: true }],
      transactions: [{ id: 'tx-2', title: 'Hackathon Prize', amount: 5000, type: 'income', date: '2026-11-12' }],
    },
  });

  const combined = mergeNexoraStates(jsonFile1.data, jsonFile2.data);
  assert.equal(combined.subjects.length, 2);
  assert.equal(combined.tasks.length, 2);
  assert.equal(combined.transactions.length, 2);
  assert.notEqual(combined.subjects[0].id, combined.subjects[1].id);
  assert.notEqual(combined.tasks[0].id, combined.tasks[1].id);
});

test('mergeDayflowStates combines classes and tasks from 2 different JSON files without losing items', () => {
  const df1 = {
    config: { wakeStartHour: 7, wakeEndHour: 22 },
    recurringClasses: [{ id: 'c1', title: 'DSA Lecture', category: 'lecture', startTime: '09:00', durationMin: 60, repeatDays: [1, 3] }],
    tasks: [{ id: 't1', title: 'Morning Lab', category: 'lab', date: '2026-11-16', startTime: '11:00', durationMin: 60, completed: false }],
    inbox: [],
    dayOverrides: { '2026-11-16': 'focus' },
  };
  const df2 = {
    config: { wakeStartHour: 6, wakeEndHour: 23 },
    recurringClasses: [{ id: 'c1', title: 'Signals Lab', category: 'lab', startTime: '14:00', durationMin: 90, repeatDays: [2, 4] }],
    tasks: [{ id: 't1', title: 'Evening Project', category: 'deepwork', date: '2026-11-16', startTime: '17:00', durationMin: 90, completed: false }],
    inbox: [{ id: 'i1', title: 'Review linear algebra', category: 'lecture', durationMin: 45, createdAt: '2026-11-16' }],
    dayOverrides: { '2026-11-17': 'holiday' },
  };

  const mergedDf = mergeDayflowStates(df1, df2);
  assert.equal(mergedDf.recurringClasses.length, 2);
  assert.equal(mergedDf.tasks.length, 2);
  assert.equal(mergedDf.inbox.length, 1);
  assert.equal(mergedDf.dayOverrides['2026-11-16'], 'focus');
  assert.equal(mergedDf.dayOverrides['2026-11-17'], 'holiday');
});

