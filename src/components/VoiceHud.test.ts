import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_VOICE_HUD_SETTINGS,
  DEFAULT_VOICE_HUD_HOTKEY,
  VOICE_HUD_STORAGE_KEY,
  DEFAULT_PHONE_VOICE_SETTINGS,
  sanitizeVoiceHudSettings,
  sanitizePhoneVoiceSettings,
  loadVoiceHudSettings,
  matchesVoiceHudChord,
  validateCapturedShortcut,
  stepAnalyticSpring,
  formatHotkeyChips,
} from './VoiceHud';

test('sanitizeVoiceHudSettings falls back safely on null or malformed objects', () => {
  const fromNull = sanitizeVoiceHudSettings(null);
  assert.deepEqual(fromNull, DEFAULT_VOICE_HUD_SETTINGS);

  const fromMalformed = sanitizeVoiceHudSettings({
    enabled: 'yes',
    hotkey: { ctrl: false, shift: false, alt: false, meta: false, code: 'KeyA' }, // bare key rejected -> falls back to Ctrl+Space
    clickVolume: 999,
    showOnLockScreen: 123,
  });
  assert.equal(fromMalformed.enabled, true);
  assert.deepEqual(fromMalformed.hotkey, DEFAULT_VOICE_HUD_HOTKEY);
  assert.equal(fromMalformed.clickVolume, 100);
  assert.equal(fromMalformed.showOnLockScreen, true);
});

test('loadVoiceHudSettings recovers from malformed localStorage JSON without throwing', () => {
  const fakeStore: Record<string, string> = {
    [VOICE_HUD_STORAGE_KEY]: '{bad',
  };
  const prevWindow = (globalThis as any).window;
  (globalThis as any).window = {
    localStorage: {
      getItem: (k: string) => fakeStore[k] ?? null,
      setItem: (k: string, v: string) => {
        fakeStore[k] = v;
      },
    },
  };

  try {
    const loaded = loadVoiceHudSettings();
    assert.deepEqual(loaded, DEFAULT_VOICE_HUD_SETTINGS);
  } finally {
    (globalThis as any).window = prevWindow;
  }
});

test('matchesVoiceHudChord matches default Ctrl+Space and macOS Cmd+Space fallback', () => {
  // Exact Ctrl+Space
  assert.equal(
    matchesVoiceHudChord(
      { ctrlKey: true, shiftKey: false, altKey: false, metaKey: false, code: 'Space' },
      DEFAULT_VOICE_HUD_HOTKEY,
      false
    ),
    true
  );

  // Cmd+Space on macOS when Ctrl is not held
  assert.equal(
    matchesVoiceHudChord(
      { ctrlKey: false, shiftKey: false, altKey: false, metaKey: true, code: 'Space' },
      DEFAULT_VOICE_HUD_HOTKEY,
      true
    ),
    true
  );

  // Bare Space does not match
  assert.equal(
    matchesVoiceHudChord(
      { ctrlKey: false, shiftKey: false, altKey: false, metaKey: false, code: 'Space' },
      DEFAULT_VOICE_HUD_HOTKEY,
      false
    ),
    false
  );
});

test('validateCapturedShortcut rejects bare keys and reserved FLUX shortcuts, accepts valid chords', () => {
  // Bare key without modifier
  const bare = validateCapturedShortcut({
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    metaKey: false,
    code: 'KeyA',
    key: 'a',
  });
  assert.equal(bare.ok, false);
  if (!bare.ok) {
    assert.equal(bare.reason, 'bare_key');
  }

  // Reserved Ctrl+K
  const reserved = validateCapturedShortcut({
    ctrlKey: true,
    shiftKey: false,
    altKey: false,
    metaKey: false,
    code: 'KeyK',
    key: 'k',
  });
  assert.equal(reserved.ok, false);
  if (!reserved.ok) {
    assert.equal(reserved.reason, 'reserved');
  }

  // Valid custom shortcut Ctrl+Shift+Period
  const valid = validateCapturedShortcut({
    ctrlKey: true,
    shiftKey: true,
    altKey: false,
    metaKey: false,
    code: 'Period',
    key: '>',
  });
  assert.equal(valid.ok, true);
  if (valid.ok) {
    assert.deepEqual(formatHotkeyChips(valid.hotkey), ['Ctrl', 'Shift', '.']);
  }
});

test('stepAnalyticSpring clamps dt to 50ms and converges cleanly to target width', () => {
  let state = { pos: 0, vel: 0 };
  // Giant dt (e.g. 5 seconds tab switch) must clamp to 50ms and not explode
  state = stepAnalyticSpring(state.pos, state.vel, 224, 5.0);
  assert.ok(state.pos > 0 && state.pos < 300);

  // Step 40 frames at 16ms -> converges to 224
  for (let i = 0; i < 40; i++) {
    state = stepAnalyticSpring(state.pos, state.vel, 224, 0.016);
  }
  assert.equal(state.pos, 224);
  assert.equal(state.vel, 0);
});

test('sanitizePhoneVoiceSettings validates resettable phone gesture and button coordinates', () => {
  assert.deepEqual(sanitizePhoneVoiceSettings(null), DEFAULT_PHONE_VOICE_SETTINGS);

  const custom = sanitizePhoneVoiceSettings({
    showFloatingMic: false,
    gesture: 'triple-tap',
    floatingPos: { x: 48, y: 96 },
  });
  assert.equal(custom.showFloatingMic, false);
  assert.equal(custom.gesture, 'triple-tap');
  assert.deepEqual(custom.floatingPos, { x: 48, y: 96 });

  const invalidGesture = sanitizePhoneVoiceSettings({
    gesture: 'unknown-gesture',
    floatingPos: { x: 'invalid', y: 10 },
  });
  assert.equal(invalidGesture.gesture, 'two-finger-tap');
  assert.equal(invalidGesture.floatingPos, null);
});

