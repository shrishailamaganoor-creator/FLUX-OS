import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_SHOWCASE_MISSIONS,
  EMPTY_STATE,
  calculateAttendanceProjection,
  ensureWritableFetch,
  filterCommandPaletteItems,
  isPlainObject,
  mergeValidatedState,
  normalizeImportedState,
  stepShowcaseMissionXp,
  toggleShowcaseMissionStatus,
  validateImportedMedia,
} from './nexoraState';

test('isPlainObject identifies plain objects vs arrays and primitives', () => {
  assert.equal(isPlainObject({ a: 1 }), true);
  assert.equal(isPlainObject([]), false);
  assert.equal(isPlainObject(null), false);
  assert.equal(isPlainObject('string'), false);
});

test('mergeValidatedState merges partial candidate state onto EMPTY_STATE defaults', () => {
  const merged = mergeValidatedState(EMPTY_STATE, {
    focusGoalHrs: 8,
    profile: { name: 'Shrishaila M', theme: 'industrial' },
  });
  assert.equal(merged.focusGoalHrs, 8);
  assert.equal(merged.profile.theme, 'industrial');
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

test('toggleShowcaseMissionStatus and stepShowcaseMissionXp update mission records deterministically', () => {
  const next = toggleShowcaseMissionStatus(DEFAULT_SHOWCASE_MISSIONS, 'm-raft');
  assert.equal(next[0].status, 'done');
  const next2 = toggleShowcaseMissionStatus(next, 'm-raft');
  assert.equal(next2[0].status, 'queued');
  const stepped = stepShowcaseMissionXp(DEFAULT_SHOWCASE_MISSIONS, 'm-raft', 30);
  assert.equal(stepped[0].xp, 150);
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


