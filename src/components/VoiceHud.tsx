import React, { useEffect, useRef, useState, useCallback } from 'react';

export const VOICE_HUD_STORAGE_KEY = 'flux.voiceHud.v1';
const VOICE_HUD_EVENT = 'flux-voice-hud-settings';

export interface VoiceHudHotkey {
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
  code: string;
}

export interface VoiceHudSettings {
  enabled: boolean;
  hotkey: VoiceHudHotkey;
  clickVolume: number;
  showOnLockScreen: boolean;
}

export const DEFAULT_VOICE_HUD_HOTKEY: VoiceHudHotkey = {
  ctrl: true,
  shift: false,
  alt: false,
  meta: false,
  code: 'Space',
};

export const DEFAULT_VOICE_HUD_SETTINGS: VoiceHudSettings = {
  enabled: true,
  hotkey: { ...DEFAULT_VOICE_HUD_HOTKEY },
  clickVolume: 30,
  showOnLockScreen: true,
};

export type VoiceHudPhase = 'idle' | 'recording' | 'transcribing' | 'done' | 'error';

export function isDefaultCtrlSpaceHotkey(hotkey: VoiceHudHotkey): boolean {
  return (
    hotkey.ctrl === true &&
    hotkey.shift === false &&
    hotkey.alt === false &&
    hotkey.meta === false &&
    hotkey.code === 'Space'
  );
}

export function sanitizeVoiceHudSettings(raw: unknown): VoiceHudSettings {
  if (!raw || typeof raw !== 'object') {
    return {
      ...DEFAULT_VOICE_HUD_SETTINGS,
      hotkey: { ...DEFAULT_VOICE_HUD_HOTKEY },
    };
  }
  const obj = raw as Record<string, unknown>;
  const rawHotkey =
    obj.hotkey && typeof obj.hotkey === 'object'
      ? (obj.hotkey as Record<string, unknown>)
      : null;

  const code =
    rawHotkey && typeof rawHotkey.code === 'string' && rawHotkey.code.trim().length > 0
      ? rawHotkey.code.trim()
      : DEFAULT_VOICE_HUD_HOTKEY.code;

  const ctrl = rawHotkey && typeof rawHotkey.ctrl === 'boolean' ? rawHotkey.ctrl : DEFAULT_VOICE_HUD_HOTKEY.ctrl;
  const shift = rawHotkey && typeof rawHotkey.shift === 'boolean' ? rawHotkey.shift : DEFAULT_VOICE_HUD_HOTKEY.shift;
  const alt = rawHotkey && typeof rawHotkey.alt === 'boolean' ? rawHotkey.alt : DEFAULT_VOICE_HUD_HOTKEY.alt;
  const meta = rawHotkey && typeof rawHotkey.meta === 'boolean' ? rawHotkey.meta : DEFAULT_VOICE_HUD_HOTKEY.meta;

  const isFunctionKey = /^F([1-9]|1[0-2])$/.test(code);
  const hasModifier = ctrl || shift || alt || meta;

  const validHotkey: VoiceHudHotkey =
    hasModifier || isFunctionKey
      ? { ctrl, shift, alt, meta, code }
      : { ...DEFAULT_VOICE_HUD_HOTKEY };

  const rawVol = typeof obj.clickVolume === 'number' ? obj.clickVolume : Number(obj.clickVolume);
  const clickVolume = Number.isFinite(rawVol)
    ? Math.max(0, Math.min(100, Math.round(rawVol)))
    : DEFAULT_VOICE_HUD_SETTINGS.clickVolume;

  return {
    enabled: typeof obj.enabled === 'boolean' ? obj.enabled : DEFAULT_VOICE_HUD_SETTINGS.enabled,
    hotkey: validHotkey,
    clickVolume,
    showOnLockScreen:
      typeof obj.showOnLockScreen === 'boolean'
        ? obj.showOnLockScreen
        : DEFAULT_VOICE_HUD_SETTINGS.showOnLockScreen,
  };
}

export function loadVoiceHudSettings(): VoiceHudSettings {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { ...DEFAULT_VOICE_HUD_SETTINGS, hotkey: { ...DEFAULT_VOICE_HUD_HOTKEY } };
    }
    const raw = window.localStorage.getItem(VOICE_HUD_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_VOICE_HUD_SETTINGS, hotkey: { ...DEFAULT_VOICE_HUD_HOTKEY } };
    }
    const parsed = JSON.parse(raw);
    return sanitizeVoiceHudSettings(parsed);
  } catch {
    return { ...DEFAULT_VOICE_HUD_SETTINGS, hotkey: { ...DEFAULT_VOICE_HUD_HOTKEY } };
  }
}

export function saveVoiceHudSettings(next: VoiceHudSettings): VoiceHudSettings {
  const clean = sanitizeVoiceHudSettings(next);
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(VOICE_HUD_STORAGE_KEY, JSON.stringify(clean));
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(VOICE_HUD_EVENT, { detail: clean }));
    }
  } catch {
    // Ignore storage quota errors
  }
  return clean;
}

export function useVoiceHudSettings(): [
  VoiceHudSettings,
  (updater: VoiceHudSettings | ((prev: VoiceHudSettings) => VoiceHudSettings)) => void,
] {
  const [settings, setSettingsState] = useState<VoiceHudSettings>(() => loadVoiceHudSettings());

  useEffect(() => {
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<VoiceHudSettings>).detail;
      if (detail) {
        setSettingsState(sanitizeVoiceHudSettings(detail));
      } else {
        setSettingsState(loadVoiceHudSettings());
      }
    };
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === VOICE_HUD_STORAGE_KEY) {
        setSettingsState(loadVoiceHudSettings());
      }
    };
    window.addEventListener(VOICE_HUD_EVENT, onCustom);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(VOICE_HUD_EVENT, onCustom);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const updateSettings = useCallback(
    (updater: VoiceHudSettings | ((prev: VoiceHudSettings) => VoiceHudSettings)) => {
      const current = loadVoiceHudSettings();
      const next = typeof updater === 'function' ? updater(current) : updater;
      const saved = saveVoiceHudSettings(next);
      setSettingsState(saved);
    },
    []
  );

  return [settings, updateSettings];
}

export function formatKeyCodeLabel(code: string): string {
  if (!code) return 'Space';
  if (code === 'Space') return 'Space';
  if (code.startsWith('Key') && code.length === 4) return code.slice(3).toUpperCase();
  if (code.startsWith('Digit') && code.length === 6) return code.slice(5);
  if (code.startsWith('Numpad')) return 'Num ' + code.slice(6);
  const map: Record<string, string> = {
    Backquote: '`',
    Minus: '-',
    Equal: '=',
    BracketLeft: '[',
    BracketRight: ']',
    Backslash: '\\',
    Semicolon: ';',
    Quote: "'",
    Comma: ',',
    Period: '.',
    Slash: '/',
    Enter: 'Enter',
    Tab: 'Tab',
    Backspace: 'Backspace',
    ArrowUp: 'Up',
    ArrowDown: 'Down',
    ArrowLeft: 'Left',
    ArrowRight: 'Right',
  };
  return map[code] || code;
}

export function formatHotkeyChips(hotkey: VoiceHudHotkey): string[] {
  const chips: string[] = [];
  if (hotkey.ctrl) chips.push('Ctrl');
  if (hotkey.alt) chips.push('Alt');
  if (hotkey.shift) chips.push('Shift');
  if (hotkey.meta) chips.push('Cmd');
  chips.push(formatKeyCodeLabel(hotkey.code));
  return chips;
}

const MODIFIER_CODES = new Set([
  'ControlLeft',
  'ControlRight',
  'ShiftLeft',
  'ShiftRight',
  'AltLeft',
  'AltRight',
  'MetaLeft',
  'MetaRight',
]);

export function isReservedFluxShortcut(hotkey: VoiceHudHotkey): boolean {
  // Ctrl+K or Cmd+K (Command palette)
  if ((hotkey.ctrl || hotkey.meta) && !hotkey.alt && !hotkey.shift && hotkey.code === 'KeyK') {
    return true;
  }
  // Escape
  if (hotkey.code === 'Escape') {
    return true;
  }
  // Alt+V or Ctrl+Shift+V (Classified Vault Trapdoor)
  if (
    (hotkey.alt && !hotkey.ctrl && !hotkey.shift && !hotkey.meta && hotkey.code === 'KeyV') ||
    ((hotkey.ctrl || hotkey.meta) && hotkey.shift && !hotkey.alt && hotkey.code === 'KeyV')
  ) {
    return true;
  }
  return false;
}

export type ShortcutCaptureValidation =
  | { ok: true; hotkey: VoiceHudHotkey }
  | { ok: false; reason: 'modifier_only' | 'bare_key' | 'reserved'; message: string };

export function validateCapturedShortcut(e: {
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  code: string;
  key?: string;
}): ShortcutCaptureValidation {
  if (MODIFIER_CODES.has(e.code) || e.key === 'Control' || e.key === 'Shift' || e.key === 'Alt' || e.key === 'Meta') {
    return {
      ok: false,
      reason: 'modifier_only',
      message: 'Hold a modifier and press a trigger key (e.g. Space, Period, M).',
    };
  }

  const candidate: VoiceHudHotkey = {
    ctrl: Boolean(e.ctrlKey),
    shift: Boolean(e.shiftKey),
    alt: Boolean(e.altKey),
    meta: Boolean(e.metaKey),
    code: e.code || 'Space',
  };

  if (isReservedFluxShortcut(candidate)) {
    return {
      ok: false,
      reason: 'reserved',
      message: `${formatHotkeyChips(candidate).join('+')} is reserved by FLUX (Command Bar / Vault). Choose another chord.`,
    };
  }

  const isFunctionKey = /^F([1-9]|1[0-2])$/.test(candidate.code);
  const hasModifier = candidate.ctrl || candidate.shift || candidate.alt || candidate.meta;

  if (!hasModifier && !isFunctionKey) {
    return {
      ok: false,
      reason: 'bare_key',
      message: 'Shortcut must include Ctrl, Alt, Shift, or Cmd (or F1–F12) so normal typing is not blocked.',
    };
  }

  return { ok: true, hotkey: candidate };
}

export function matchesVoiceHudChord(
  e: {
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    metaKey: boolean;
    code: string;
  },
  hotkey: VoiceHudHotkey,
  isMacPlatform?: boolean
): boolean {
  if (e.code !== hotkey.code) return false;

  const exactMatch =
    Boolean(e.ctrlKey) === hotkey.ctrl &&
    Boolean(e.shiftKey) === hotkey.shift &&
    Boolean(e.altKey) === hotkey.alt &&
    Boolean(e.metaKey) === hotkey.meta;

  if (exactMatch) return true;

  // Also accept Cmd+Space on macOS only if Cmd is held and Ctrl is not, when using default Ctrl+Space
  const isMac =
    typeof isMacPlatform === 'boolean'
      ? isMacPlatform
      : typeof navigator !== 'undefined' && /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent || '');

  if (
    isMac &&
    isDefaultCtrlSpaceHotkey(hotkey) &&
    e.metaKey &&
    !e.ctrlKey &&
    !e.shiftKey &&
    !e.altKey &&
    e.code === 'Space'
  ) {
    return true;
  }

  return false;
}

/**
 * Analytic underdamped spring step (`duration = 0.30s`, `bounce = 0.15` => `omega = 2*PI/0.30`, `zeta = 0.85`).
 * `dtSec` is clamped to `0.05s` (`50ms`) so tab switches never explode.
 */
export function stepAnalyticSpring(
  pos: number,
  vel: number,
  target: number,
  dtSec: number,
  duration = 0.3,
  bounce = 0.15
): { pos: number; vel: number } {
  const dt = Math.min(Math.max(dtSec, 0), 0.05);
  if (dt === 0) return { pos, vel };

  const omega = (2 * Math.PI) / duration;
  const zeta = Math.max(0.01, Math.min(0.99, 1 - bounce));
  const x0 = pos - target;
  const v0 = vel;

  if (Math.abs(x0) < 0.02 && Math.abs(v0) < 0.15) {
    return { pos: target, vel: 0 };
  }

  const omegaD = omega * Math.sqrt(1 - zeta * zeta);
  const decay = Math.exp(-zeta * omega * dt);
  const cosTerm = Math.cos(omegaD * dt);
  const sinTerm = Math.sin(omegaD * dt);
  const B = (v0 + zeta * omega * x0) / omegaD;

  const x1 = decay * (x0 * cosTerm + B * sinTerm);
  const v1 =
    decay *
    ((B * omegaD - zeta * omega * x0) * cosTerm -
      (x0 * omegaD + zeta * omega * B) * sinTerm);

  if (Math.abs(x1) < 0.02 && Math.abs(v1) < 0.15) {
    return { pos: target, vel: 0 };
  }

  return { pos: target + x1, vel: v1 };
}

// ─── AUDIO SYNTHESIS (CLICK & METERING) ──────────────────────────────────────
let sharedClickAudioCtx: AudioContext | null = null;

function getClickAudioContext(): AudioContext | null {
  try {
    if (typeof window === 'undefined') return null;
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    if (!sharedClickAudioCtx || sharedClickAudioCtx.state === 'closed') {
      sharedClickAudioCtx = new Ctx();
    }
    if (sharedClickAudioCtx.state === 'suspended') {
      sharedClickAudioCtx.resume().catch(() => {});
    }
    return sharedClickAudioCtx;
  } catch {
    return null;
  }
}

export function playDictationClick(
  kind: 'start' | 'stop' | 'error',
  clickVolume = 30
): void {
  const vol = Math.max(0, Math.min(100, Number(clickVolume) || 0));
  if (vol <= 0) return;

  const ctx = getClickAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Master gain scaled by clickVolume (0..100, default 30, max gain 0.10 at 100)
    const maxGain = (vol / 100) * 0.1;

    if (kind === 'error') {
      // Error: 1200 Hz then 800 Hz sine ticks
      const playTick = (freq: number, startOffset: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + startOffset);
        gain.gain.setValueAtTime(maxGain, now + startOffset);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + 0.045);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + startOffset);
        osc.stop(now + startOffset + 0.05);
      };
      playTick(1200, 0);
      playTick(800, 0.055);
      return;
    }

    const bpFreq = kind === 'start' ? 2400 : 1900;
    const sineFreq = kind === 'start' ? 1600 : 1200;

    // 8 ms decaying white-noise buffer through bandpass (Q = 0.9)
    const noiseSamples = Math.max(1, Math.floor(ctx.sampleRate * 0.008));
    const noiseBuffer = ctx.createBuffer(1, noiseSamples, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseSamples; i++) {
      const env = 1 - i / noiseSamples;
      data[i] = (Math.random() * 2 - 1) * env;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(bpFreq, now);
    bandpass.Q.setValueAtTime(0.9, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(maxGain, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

    noiseSource.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(now);
    noiseSource.stop(now + 0.012);

    // Sine tick with 40 ms exponential decay
    const osc = ctx.createOscillator();
    const tickGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(sineFreq, now);
    tickGain.gain.setValueAtTime(maxGain * 0.9, now);
    tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(tickGain);
    tickGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.042);
  } catch {
    // Ignore audio context errors on restricted autoplay
  }
}

// ─── TARGET CAPTURE, INSERTION & VERIFICATION ────────────────────────────────

const ALLOWED_INPUT_TYPES = new Set([
  'text',
  'search',
  'email',
  'url',
  'tel',
  'password',
  '',
]);

export interface CapturedTarget {
  el: HTMLElement;
  kind: 'input' | 'textarea' | 'contenteditable';
  selectionStart: number | null;
  selectionEnd: number | null;
  range: Range | null;
}

export function isValidDictationTarget(el: Element | null): el is HTMLElement {
  if (!el || !(el instanceof HTMLElement)) return false;
  if (el.closest('[data-voice-hud-ignore]')) return false;

  const tag = el.tagName.toLowerCase();
  if (tag === 'textarea') {
    const ta = el as HTMLTextAreaElement;
    return !ta.disabled && !ta.readOnly;
  }
  if (tag === 'input') {
    const inp = el as HTMLInputElement;
    if (inp.disabled || inp.readOnly) return false;
    const type = (inp.getAttribute('type') || inp.type || 'text').toLowerCase();
    return ALLOWED_INPUT_TYPES.has(type);
  }
  if (el.isContentEditable || el.getAttribute('contenteditable') === 'true') {
    return true;
  }
  return false;
}

export function captureFocusedTarget(activeEl: Element | null = typeof document !== 'undefined' ? document.activeElement : null): CapturedTarget | null {
  if (!activeEl) return null;

  const editable =
    isValidDictationTarget(activeEl)
      ? activeEl
      : activeEl instanceof HTMLElement && activeEl.closest('[contenteditable="true"]')
      ? (activeEl.closest('[contenteditable="true"]') as HTMLElement)
      : null;

  if (!editable || !isValidDictationTarget(editable)) return null;

  const tag = editable.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea') {
    const inputEl = editable as HTMLInputElement | HTMLTextAreaElement;
    let selectionStart: number | null = null;
    let selectionEnd: number | null = null;
    try {
      selectionStart = typeof inputEl.selectionStart === 'number' ? inputEl.selectionStart : null;
      selectionEnd = typeof inputEl.selectionEnd === 'number' ? inputEl.selectionEnd : null;
    } catch {
      selectionStart = null;
      selectionEnd = null;
    }
    return {
      el: editable,
      kind: tag as 'input' | 'textarea',
      selectionStart,
      selectionEnd,
      range: null,
    };
  }

  let savedRange: Range | null = null;
  try {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const r = sel.getRangeAt(0);
      if (editable.contains(r.commonAncestorContainer)) {
        savedRange = r.cloneRange();
      }
    }
  } catch {
    savedRange = null;
  }

  return {
    el: editable,
    kind: 'contenteditable',
    selectionStart: null,
    selectionEnd: null,
    range: savedRange,
  };
}

export type InsertionResult =
  | { status: 'empty' }
  | { status: 'inserted'; text: string }
  | { status: 'copied'; text: string };

export async function insertAndVerifyTranscript(
  savedTarget: CapturedTarget | null,
  rawTranscript: string
): Promise<InsertionResult> {
  const cleanText = (rawTranscript || '').trim();
  if (!cleanText) {
    return { status: 'empty' };
  }

  // Prefer currently focused valid target if user moved focus to another input while speaking,
  // otherwise use the target captured when recording started.
  const currentTarget =
    typeof document !== 'undefined' ? captureFocusedTarget(document.activeElement) : null;
  const target =
    currentTarget && document.contains(currentTarget.el)
      ? currentTarget
      : savedTarget && typeof document !== 'undefined' && document.contains(savedTarget.el)
      ? savedTarget
      : null;

  if (target && isValidDictationTarget(target.el)) {
    const el = target.el;
    try {
      if (target.kind === 'input' || target.kind === 'textarea') {
        const inputEl = el as HTMLInputElement | HTMLTextAreaElement;
        if (typeof document !== 'undefined' && document.activeElement !== inputEl) {
          try {
            inputEl.focus({ preventScroll: true });
          } catch {
            inputEl.focus();
          }
        }

        const existingVal = String(inputEl.value ?? '');
        let start = existingVal.length;
        let end = existingVal.length;

        try {
          if (typeof inputEl.selectionStart === 'number' && typeof inputEl.selectionEnd === 'number') {
            start = inputEl.selectionStart;
            end = inputEl.selectionEnd;
          } else if (typeof target.selectionStart === 'number' && typeof target.selectionEnd === 'number') {
            start = target.selectionStart;
            end = target.selectionEnd;
          }
        } catch {
          if (typeof target.selectionStart === 'number' && typeof target.selectionEnd === 'number') {
            start = target.selectionStart;
            end = target.selectionEnd;
          }
        }

        start = Math.max(0, Math.min(existingVal.length, start));
        end = Math.max(start, Math.min(existingVal.length, end));

        const before = existingVal.slice(0, start);
        const after = existingVal.slice(end);
        const needsSpace = before.length > 0 && !/\s$/.test(before) && !/^\s/.test(cleanText);
        const chunk = (needsSpace ? ' ' : '') + cleanText;
        const nextValue = before + chunk + after;

        const proto =
          target.kind === 'textarea' && typeof HTMLTextAreaElement !== 'undefined'
            ? HTMLTextAreaElement.prototype
            : typeof HTMLInputElement !== 'undefined'
            ? HTMLInputElement.prototype
            : null;
        const nativeSetter = proto ? Object.getOwnPropertyDescriptor(proto, 'value')?.set : undefined;
        if (nativeSetter) {
          nativeSetter.call(inputEl, nextValue);
        } else {
          inputEl.value = nextValue;
        }

        inputEl.dispatchEvent(new Event('input', { bubbles: true }));
        inputEl.dispatchEvent(new Event('change', { bubbles: true }));

        const nextCaret = start + chunk.length;
        try {
          inputEl.setSelectionRange(nextCaret, nextCaret);
        } catch {
          // Some input types (e.g. email) do not support setSelectionRange
        }

        // 2g) VERIFY insertion by reading el.value back
        const readBack = String(inputEl.value ?? '');
        if (readBack.includes(cleanText)) {
          return { status: 'inserted', text: cleanText };
        }
      } else if (target.kind === 'contenteditable') {
        try {
          el.focus({ preventScroll: true });
        } catch {
          el.focus();
        }

        const sel = typeof window !== 'undefined' ? window.getSelection() : null;
        if (sel) {
          try {
            sel.removeAllRanges();
            if (target.range && el.contains(target.range.commonAncestorContainer)) {
              sel.addRange(target.range);
            } else {
              const endRange = document.createRange();
              endRange.selectNodeContents(el);
              endRange.collapse(false);
              sel.addRange(endRange);
            }
          } catch {
            // Ignore selection range errors
          }
        }

        const beforeText = String(el.innerText || el.textContent || '');
        const needsSpace = beforeText.length > 0 && !/\s$/.test(beforeText) && !/^\s/.test(cleanText);
        const chunk = (needsSpace ? ' ' : '') + cleanText;

        let execWorked = false;
        try {
          if (typeof document.execCommand === 'function') {
            execWorked = document.execCommand('insertText', false, chunk);
          }
        } catch {
          execWorked = false;
        }

        const afterExecText = String(el.innerText || el.textContent || '');
        if (!execWorked || !afterExecText.includes(cleanText)) {
          // Manual Range fallback
          const activeSel = typeof window !== 'undefined' ? window.getSelection() : null;
          if (activeSel && activeSel.rangeCount > 0 && el.contains(activeSel.getRangeAt(0).commonAncestorContainer)) {
            const r = activeSel.getRangeAt(0);
            r.deleteContents();
            const textNode = document.createTextNode(chunk);
            r.insertNode(textNode);
            r.setStartAfter(textNode);
            r.collapse(true);
            activeSel.removeAllRanges();
            activeSel.addRange(r);
          } else {
            el.appendChild(document.createTextNode(chunk));
          }
          el.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // 2g) VERIFY insertion by reading innerText / textContent back
        const readBack = String(el.innerText || el.textContent || '');
        if (readBack.includes(cleanText)) {
          return { status: 'inserted', text: cleanText };
        }
      }
    } catch {
      // Fall through to clipboard fallback if DOM insertion threw
    }
  }

  // Fallback: copy to clipboard and report 'copied' (never lie with 'Done')
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(cleanText);
    }
  } catch {
    // Ignore clipboard write rejection in headless/unfocused frames
  }
  return { status: 'copied', text: cleanText };
}

// ─── DOT MATRIX CANVAS CONSTANTS ─────────────────────────────────────────────
const GRID_COLS = 43;
const GRID_ROWS = 9;
const DOT_PITCH = 5.2;
const DOT_RADIUS = 1.05;
const HUD_HEIGHT = 52;

const WIDTH_BY_PHASE: Record<VoiceHudPhase, number> = {
  idle: 0,
  recording: 224,
  transcribing: 152,
  done: 44,
  error: 272,
};

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

const RGB_DIM = hexToRgb('#3A3A3A');
const RGB_LIT = hexToRgb('#FAFAFA');
const RGB_TRACE = hexToRgb('#A2BCFF');
const RGB_ERROR = hexToRgb('#FF6B5A');

function mixRgb(a: [number, number, number], b: [number, number, number], t: number): string {
  const clamped = Math.max(0, Math.min(1, t));
  const r = Math.round(a[0] + (b[0] - a[0]) * clamped);
  const g = Math.round(a[1] + (b[1] - a[1]) * clamped);
  const bl = Math.round(a[2] + (b[2] - a[2]) * clamped);
  return `rgb(${r},${g},${bl})`;
}

// ─── VOICE HUD COMPONENT ─────────────────────────────────────────────────────

export const VoiceHud: React.FC = () => {
  const [settings] = useVoiceHudSettings();
  const [phase, setPhase] = useState<VoiceHudPhase>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const phaseRef = useRef<VoiceHudPhase>('idle');
  const settingsRef = useRef<VoiceHudSettings>(settings);
  settingsRef.current = settings;

  const plateRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  //Captured target & active resources
  const capturedTargetRef = useRef<CapturedTarget | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const meterAudioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const meterTimeDataRef = useRef<Float32Array | null>(null);
  const smoothedLevelRef = useRef<number>(0);
  const peakEnergySeenRef = useRef<number>(0);

  // Speech recognition / fallback recorder
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const transcriptsRef = useRef<string[]>([]);
  const recognitionEndedEarlyRef = useRef<boolean>(false);
  const recognitionFatalErrorRef = useRef<string | null>(null);

  // Timers
  const settleTimerRef = useRef<number | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);

  // Animation loop state
  const rafIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const phaseStartTimeRef = useRef<number>(0);
  const springWidthRef = useRef<{ pos: number; vel: number }>({ pos: 0, vel: 0 });
  const springScaleRef = useRef<{ pos: number; vel: number }>({ pos: 0.96, vel: 0 });
  const springYRef = useRef<{ pos: number; vel: number }>({ pos: -6, vel: 0 });
  const opacityRef = useRef<number>(0);
  const phosphorTrailRef = useRef<Float32Array>(new Float32Array(GRID_COLS * GRID_ROWS));
  const reducedMotionRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mq.matches;
    const onChange = (ev: MediaQueryListEvent) => {
      reducedMotionRef.current = ev.matches;
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
    };
  }, []);

  const clearAllTimers = useCallback(() => {
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  }, []);

  const releaseMediaAndRecognizer = useCallback((abortRecognition = true) => {
    if (recognitionRef.current) {
      const rec = recognitionRef.current;
      recognitionRef.current = null;
      try {
        rec.onresult = null;
        rec.onerror = null;
        rec.onend = null;
        if (abortRecognition) {
          rec.abort();
        } else {
          rec.stop();
        }
      } catch {
        // Ignore recognizer stop errors
      }
    }

    if (mediaRecorderRef.current) {
      const mr = mediaRecorderRef.current;
      mediaRecorderRef.current = null;
      try {
        if (mr.state !== 'inactive') mr.stop();
      } catch {
        // Ignore recorder stop errors
      }
    }

    if (mediaStreamRef.current) {
      const stream = mediaStreamRef.current;
      mediaStreamRef.current = null;
      try {
        stream.getTracks().forEach((t) => {
          try {
            t.stop();
          } catch {}
        });
      } catch {}
    }

    analyserRef.current = null;
    meterTimeDataRef.current = null;
    if (meterAudioCtxRef.current) {
      const ctx = meterAudioCtxRef.current;
      meterAudioCtxRef.current = null;
      try {
        ctx.close().catch(() => {});
      } catch {}
    }
    smoothedLevelRef.current = 0;
  }, []);

  const ensureRafLoopRunning = useCallback(() => {
    if (rafIdRef.current !== null) return;
    lastFrameTimeRef.current = performance.now();

    const tick = (now: number) => {
      if (typeof document !== 'undefined' && document.hidden) {
        lastFrameTimeRef.current = now;
        rafIdRef.current = window.requestAnimationFrame(tick);
        return;
      }

      const rawDt = (now - lastFrameTimeRef.current) / 1000;
      const dt = Math.min(Math.max(rawDt, 0.001), 0.05);
      lastFrameTimeRef.current = now;

      const currentPhase = phaseRef.current;
      const isIdle = currentPhase === 'idle';
      const targetWidth = WIDTH_BY_PHASE[currentPhase];
      const targetScale = isIdle ? 0.96 : 1.0;
      const targetY = isIdle ? -6 : 0;
      const targetOpacity = isIdle ? 0 : 1;

      if (reducedMotionRef.current) {
        // prefers-reduced-motion: no spring, 160ms opacity crossfade only
        if (!isIdle) {
          springWidthRef.current = { pos: targetWidth, vel: 0 };
        }
        springScaleRef.current = { pos: 1, vel: 0 };
        springYRef.current = { pos: 0, vel: 0 };
        const alpha = 1 - Math.exp(-dt / 0.08);
        opacityRef.current += (targetOpacity - opacityRef.current) * alpha;
        if (isIdle && opacityRef.current < 0.02) {
          springWidthRef.current = { pos: 0, vel: 0 };
        }
      } else {
        springWidthRef.current = stepAnalyticSpring(
          springWidthRef.current.pos,
          springWidthRef.current.vel,
          targetWidth,
          dt,
          0.3,
          0.15
        );
        springScaleRef.current = stepAnalyticSpring(
          springScaleRef.current.pos,
          springScaleRef.current.vel,
          targetScale,
          dt,
          0.3,
          0.15
        );
        springYRef.current = stepAnalyticSpring(
          springYRef.current.pos,
          springYRef.current.vel,
          targetY,
          dt,
          0.3,
          0.15
        );
        // ~120ms exponential ease for opacity
        const opAlpha = 1 - Math.exp(-dt / 0.06);
        opacityRef.current += (targetOpacity - opacityRef.current) * opAlpha;
      }

      // Live audio level metering during recording
      if (currentPhase === 'recording' && analyserRef.current && meterTimeDataRef.current) {
        try {
          analyserRef.current.getFloatTimeDomainData(meterTimeDataRef.current as Float32Array<ArrayBuffer>);
          const buf = meterTimeDataRef.current;
          let sumSq = 0;
          for (let i = 0; i < buf.length; i++) {
            sumSq += buf[i] * buf[i];
          }
          const rms = Math.sqrt(sumSq / buf.length);
          const db = 20 * Math.log10(Math.max(rms, 1e-7));
          const norm = Math.max(0, Math.min(1, (db + 60) / 50));
          if (norm > peakEnergySeenRef.current) {
            peakEnergySeenRef.current = norm;
          }
          // Attack 40ms, release 150ms
          const tau = norm > smoothedLevelRef.current ? 0.04 : 0.15;
          const k = 1 - Math.exp(-dt / tau);
          smoothedLevelRef.current += (norm - smoothedLevelRef.current) * k;
        } catch {
          // Ignore analyser read error
        }
      } else {
        const k = 1 - Math.exp(-dt / 0.15);
        smoothedLevelRef.current *= 1 - k;
      }

      // Update plate DOM styles directly for 60fps spring without React re-render overhead
      const plate = plateRef.current;
      const drawWidth = Math.max(0, springWidthRef.current.pos);
      if (plate) {
        plate.style.width = `${drawWidth.toFixed(2)}px`;
        plate.style.opacity = `${Math.max(0, Math.min(1, opacityRef.current)).toFixed(3)}`;
        plate.style.transform = `translateX(-50%) translateY(${springYRef.current.pos.toFixed(2)}px) scale(${springScaleRef.current.pos.toFixed(4)})`;
        plate.style.pointerEvents = isIdle || opacityRef.current < 0.05 ? 'none' : 'auto';
      }

      // Paint dot-matrix canvas
      const canvas = canvasRef.current;
      if (canvas && drawWidth > 2) {
        const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
        const cssW = Math.max(44, Math.round(drawWidth));
        const cssH = HUD_HEIGHT;
        const targetPxW = Math.round(cssW * dpr);
        const targetPxH = Math.round(cssH * dpr);
        if (canvas.width !== targetPxW || canvas.height !== targetPxH) {
          canvas.width = targetPxW;
          canvas.height = targetPxH;
          canvas.style.width = `${cssW}px`;
          canvas.style.height = `${cssH}px`;
        }

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.save();
          ctx.scale(dpr, dpr);
          ctx.clearRect(0, 0, cssW, cssH);

          const trail = phosphorTrailRef.current;
          const phaseElapsedSec = (now - phaseStartTimeRef.current) / 1000;

          if (currentPhase === 'done') {
            // Done: 2px white check (#FAFAFA) centered in the 44px pill
            const cx = cssW / 2;
            const cy = cssH / 2;
            ctx.strokeStyle = '#FAFAFA';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(cx - 6.5, cy + 0.5);
            ctx.lineTo(cx - 1.5, cy + 5.5);
            ctx.lineTo(cx + 7.0, cy - 4.5);
            ctx.stroke();
          } else if (currentPhase === 'error') {
            // Error: draw subtle dim matrix on left + coral #FF6B5A alert glyph
            const iconX = 20;
            const iconY = cssH / 2;
            for (let r = -1; r <= 1; r++) {
              for (let c = -1; c <= 1; c++) {
                ctx.fillStyle = r === 0 || c === 0 ? '#FF6B5A' : '#3A3A3A';
                ctx.beginPath();
                ctx.arc(iconX + c * DOT_PITCH, iconY + r * DOT_PITCH, DOT_RADIUS * 1.15, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          } else {
            // Recording or Transcribing: 43 columns × 9 rows dot field, pitch 5.2px, dot radius 1.05px
            const gridSpanW = (GRID_COLS - 1) * DOT_PITCH;
            const gridSpanH = (GRID_ROWS - 1) * DOT_PITCH;
            const startX = (cssW - gridSpanW) / 2;
            const startY = (cssH - gridSpanH) / 2;

            // Phosphor decay (0.6s trail)
            const decayFactor = Math.exp(-dt / 0.18);
            for (let i = 0; i < trail.length; i++) {
              trail[i] *= decayFactor;
            }

            if (currentPhase === 'recording') {
              const lvl = smoothedLevelRef.current;
              // Braided traces: two counter-phase sines per column, tapered at edges
              for (let c = 0; c < GRID_COLS; c++) {
                const u = c / (GRID_COLS - 1);
                const taper = Math.pow(Math.sin(u * Math.PI), 0.85);
                const amp = (0.42 + lvl * 3.35) * taper;
                const y1 = 4 + Math.sin(u * Math.PI * 3.2 - phaseElapsedSec * 6.4) * amp;
                const y2 = 4 + Math.sin(u * Math.PI * 3.2 + phaseElapsedSec * 5.6 + Math.PI) * amp * 0.88;

                for (let r = 0; r < GRID_ROWS; r++) {
                  const d1 = Math.abs(r - y1);
                  const d2 = Math.abs(r - y2);
                  const minDist = Math.min(d1, d2);
                  if (minDist < 1.35) {
                    const excitation = Math.max(0, 1 - minDist / 1.35);
                    const idx = c * GRID_ROWS + r;
                    if (excitation > trail[idx]) {
                      trail[idx] = excitation;
                    }
                  }
                }
              }
            } else if (currentPhase === 'transcribing') {
              if (reducedMotionRef.current) {
                for (let c = 0; c < GRID_COLS; c++) {
                  const u = c / (GRID_COLS - 1);
                  const taper = Math.sin(u * Math.PI);
                  trail[c * GRID_ROWS + 4] = 0.65 * taper;
                }
              } else {
                // Soft #A2BCFF beam sweeps left-to-right every 0.55 s
                const cycle = ((now - phaseStartTimeRef.current) % 550) / 550;
                const beamCol = cycle * (GRID_COLS - 1);
                for (let c = 0; c < GRID_COLS; c++) {
                  const distCols = Math.abs(c - beamCol);
                  if (distCols < 5.5) {
                    const colEnergy = Math.max(0, 1 - distCols / 5.5);
                    for (let r = 0; r < GRID_ROWS; r++) {
                      const rowCenterDist = Math.abs(r - 4) / 4;
                      const energy = colEnergy * (1 - rowCenterDist * 0.45);
                      const idx = c * GRID_ROWS + r;
                      if (energy > trail[idx]) {
                        trail[idx] = energy;
                      }
                    }
                  }
                }
              }
            }

            // Render 43 × 9 dots
            for (let c = 0; c < GRID_COLS; c++) {
              const x = startX + c * DOT_PITCH;
              if (x < 6 || x > cssW - 6) continue;
              for (let r = 0; r < GRID_ROWS; r++) {
                const y = startY + r * DOT_PITCH;
                const energy = trail[c * GRID_ROWS + r];

                if (energy > 0.72) {
                  ctx.fillStyle = mixRgb(RGB_TRACE, RGB_LIT, (energy - 0.72) / 0.28);
                } else if (energy > 0.06) {
                  ctx.fillStyle = mixRgb(RGB_DIM, RGB_TRACE, energy / 0.72);
                } else {
                  ctx.fillStyle = '#3A3A3A';
                }

                ctx.beginPath();
                ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }

          ctx.restore();
        }
      }

      // Stop rAF loop completely once idle and opacity < 0.01
      if (isIdle && opacityRef.current < 0.01 && Math.abs(springWidthRef.current.pos) < 0.5) {
        opacityRef.current = 0;
        springWidthRef.current = { pos: 0, vel: 0 };
        if (plate) {
          plate.style.width = '0px';
          plate.style.opacity = '0';
          plate.style.pointerEvents = 'none';
        }
        rafIdRef.current = null;
        return;
      }

      rafIdRef.current = window.requestAnimationFrame(tick);
    };

    rafIdRef.current = window.requestAnimationFrame(tick);
  }, []);

  const transitionToPhase = useCallback(
    (nextPhase: VoiceHudPhase, announcement?: string, errText = '') => {
      phaseRef.current = nextPhase;
      phaseStartTimeRef.current = performance.now();
      setPhase(nextPhase);
      setErrorMessage(errText);
      if (announcement !== undefined) {
        setLiveAnnouncement(announcement);
      }
      ensureRafLoopRunning();
    },
    [ensureRafLoopRunning]
  );

  const showErrorAndClose = useCallback(
    (msg: string) => {
      clearAllTimers();
      releaseMediaAndRecognizer(true);
      playDictationClick('error', settingsRef.current.clickVolume);
      transitionToPhase('error', `Dictation failed: ${msg}`, msg);
      holdTimerRef.current = window.setTimeout(() => {
        transitionToPhase('idle', '');
      }, 2000);
    },
    [clearAllTimers, releaseMediaAndRecognizer, transitionToPhase]
  );

  const finalizeTranscript = useCallback(
    async (rawText: string) => {
      clearAllTimers();
      releaseMediaAndRecognizer(true);

      const savedTarget = capturedTargetRef.current;
      capturedTargetRef.current = null;

      const result = await insertAndVerifyTranscript(savedTarget, rawText);
      if (result.status === 'empty') {
        showErrorAndClose('No speech detected — try again');
        return;
      }

      if (result.status === 'copied') {
        showErrorAndClose('Copied — nothing was focused');
        return;
      }

      // Verified insertion in target!
      playDictationClick('stop', settingsRef.current.clickVolume);
      transitionToPhase('done', `Inserted dictated text: ${result.text}`);
      holdTimerRef.current = window.setTimeout(() => {
        transitionToPhase('idle', '');
      }, 700);
    },
    [clearAllTimers, releaseMediaAndRecognizer, showErrorAndClose, transitionToPhase]
  );

  const cancelListening = useCallback(() => {
    clearAllTimers();
    releaseMediaAndRecognizer(true);
    capturedTargetRef.current = null;
    transcriptsRef.current = [];
    transitionToPhase('idle', 'Dictation cancelled');
  }, [clearAllTimers, releaseMediaAndRecognizer, transitionToPhase]);

  const stopAndTranscribe = useCallback(() => {
    if (phaseRef.current !== 'recording') return;
    clearAllTimers();
    transitionToPhase('transcribing', 'Transcribing speech');

    // Hard settle timeout of 4 s: if no result, no error, and no onend fires, abort cleanly
    settleTimerRef.current = window.setTimeout(() => {
      if (phaseRef.current === 'transcribing') {
        const joined = transcriptsRef.current.join(' ').trim();
        if (joined) {
          finalizeTranscript(joined);
        } else {
          showErrorAndClose('No speech detected — try again');
        }
      }
    }, 3900);

    // Check for mock transcript override (for deterministic testing if set)
    const mockOverride =
      typeof window !== 'undefined'
        ? (window as unknown as { __FLUX_VOICE_HUD_MOCK_TRANSCRIPT__?: string }).__FLUX_VOICE_HUD_MOCK_TRANSCRIPT__
        : undefined;
    if (typeof mockOverride === 'string') {
      fallbackTimerRef.current = window.setTimeout(() => {
        finalizeTranscript(mockOverride);
      }, 220);
      return;
    }

    // If using Web Speech API
    if (recognitionRef.current) {
      const rec = recognitionRef.current;
      // Stop microphone stream tracks right away while letting recognizer flush final result
      if (mediaStreamRef.current) {
        try {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        } catch {}
        mediaStreamRef.current = null;
      }

      if (recognitionFatalErrorRef.current) {
        const errCode = recognitionFatalErrorRef.current;
        recognitionFatalErrorRef.current = null;
        if (errCode === 'not-allowed' || errCode === 'service-not-allowed') {
          showErrorAndClose('Microphone unavailable');
        } else {
          showErrorAndClose('No speech detected — try again');
        }
        return;
      }

      if (recognitionEndedEarlyRef.current) {
        const joined = transcriptsRef.current.join(' ').trim();
        fallbackTimerRef.current = window.setTimeout(() => {
          finalizeTranscript(joined);
        }, 200);
        return;
      }

      try {
        rec.stop();
      } catch {
        const joined = transcriptsRef.current.join(' ').trim();
        finalizeTranscript(joined);
      }
      return;
    }

    // Fallback: MediaRecorder + 1.2s simulated pass ONLY if Web Speech API is absent
    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      } catch {}
      fallbackTimerRef.current = window.setTimeout(() => {
        const hadSignal = peakEnergySeenRef.current > 0.08;
        finalizeTranscript(hadSignal ? '[Demo] hello world' : '');
      }, 1200);
      return;
    }

    finalizeTranscript(transcriptsRef.current.join(' ').trim());
  }, [clearAllTimers, finalizeTranscript, showErrorAndClose, transitionToPhase]);

  const startListening = useCallback(async () => {
    if (phaseRef.current === 'recording' || phaseRef.current === 'transcribing') return;

    clearAllTimers();
    releaseMediaAndRecognizer(true);
    transcriptsRef.current = [];
    recognitionEndedEarlyRef.current = false;
    recognitionFatalErrorRef.current = null;
    peakEnergySeenRef.current = 0;

    // 2a & 2b) Capture activeElement and caret selection when recording STARTS
    capturedTargetRef.current = captureFocusedTarget(
      typeof document !== 'undefined' ? document.activeElement : null
    );

    // Check microphone API availability
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== 'function'
    ) {
      showErrorAndClose('Microphone unavailable');
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch {
      showErrorAndClose('Microphone unavailable');
      return;
    }

    const audioTracks = stream.getAudioTracks();
    if (!audioTracks || audioTracks.length === 0 || audioTracks[0].readyState === 'ended') {
      try {
        stream.getTracks().forEach((t) => t.stop());
      } catch {}
      showErrorAndClose('No audio track');
      return;
    }

    mediaStreamRef.current = stream;

    // Set up AnalyserNode (fftSize = 1024) on dedicated AudioContext so app audio never conflicts
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctx) {
        const audioCtx = new Ctx();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 1024;
        source.connect(analyser);
        meterAudioCtxRef.current = audioCtx;
        analyserRef.current = analyser;
        meterTimeDataRef.current = new Float32Array(analyser.fftSize);
      }
    } catch {
      // Metering is optional if AudioContext fails
    }

    // Play start click & enter recording state
    playDictationClick('start', settingsRef.current.clickVolume);
    transitionToPhase('recording', 'Listening — press Ctrl+Space or Enter to finish, Escape to cancel');

    // Start Web Speech API (or MediaRecorder fallback ONLY if Web Speech API is absent)
    const SpeechRec =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (SpeechRec) {
      try {
        const rec = new SpeechRec();
        rec.interimResults = false;
        rec.continuous = false;
        rec.lang = (typeof navigator !== 'undefined' && navigator.language) || 'en-US';

        rec.onresult = (event: any) => {
          try {
            for (let i = event.resultIndex || 0; i < event.results.length; i++) {
              const res = event.results[i];
              if (res && res[0] && typeof res[0].transcript === 'string') {
                const piece = res[0].transcript.trim();
                if (piece) transcriptsRef.current.push(piece);
              }
            }
          } catch {}
        };

        rec.onerror = (event: any) => {
          const code = String(event?.error || 'unknown');
          if (code === 'aborted') return;
          if (phaseRef.current === 'transcribing') {
            if (code === 'not-allowed' || code === 'service-not-allowed') {
              showErrorAndClose('Microphone unavailable');
            } else {
              const joined = transcriptsRef.current.join(' ').trim();
              if (joined) {
                finalizeTranscript(joined);
              } else {
                showErrorAndClose('No speech detected — try again');
              }
            }
          } else if (phaseRef.current === 'recording') {
            if (code === 'not-allowed' || code === 'service-not-allowed' || code === 'audio-capture') {
              showErrorAndClose('Microphone unavailable');
            } else if (code !== 'no-speech') {
              recognitionFatalErrorRef.current = code;
            }
          }
        };

        rec.onend = () => {
          if (phaseRef.current === 'transcribing') {
            const joined = transcriptsRef.current.join(' ').trim();
            finalizeTranscript(joined);
          } else if (phaseRef.current === 'recording') {
            recognitionEndedEarlyRef.current = true;
          }
        };

        recognitionRef.current = rec;
        rec.start();
      } catch {
        showErrorAndClose('Speech recognizer unavailable');
      }
    } else if (typeof MediaRecorder !== 'undefined') {
      try {
        const mr = new MediaRecorder(stream);
        mediaRecorderRef.current = mr;
        mr.start();
      } catch {
        // Ignore MediaRecorder error; fallback timer handles completion
      }
    }
  }, [clearAllTimers, finalizeTranscript, releaseMediaAndRecognizer, showErrorAndClose, transitionToPhase]);

  // Global keyboard listener (capture phase so Esc / Enter / Ctrl+Space never leak into focused inputs)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentSettings = settingsRef.current;
      if (!currentSettings.enabled) return;

      // Check lock screen restriction if disabled on lock screen
      if (!currentSettings.showOnLockScreen && typeof document !== 'undefined') {
        if (document.getElementById('xor-auth-pin')) return;
      }

      // Escape hatch: if inside [data-voice-hud-ignore], do nothing
      const targetEl = e.target instanceof Element ? e.target : document.activeElement;
      if (targetEl && targetEl.closest('[data-voice-hud-ignore]')) {
        return;
      }

      const currentPhase = phaseRef.current;

      // When listening, Enter stops & transcribes; Esc cancels immediately
      if (currentPhase === 'recording') {
        if (e.key === 'Escape' || e.code === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          cancelListening();
          return;
        }
        if (e.key === 'Enter' || e.code === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          stopAndTranscribe();
          return;
        }
      }

      if (matchesVoiceHudChord(e, currentSettings.hotkey)) {
        // Always preventDefault so Ctrl+Space never types a space into the focused input
        e.preventDefault();
        e.stopPropagation();
        if (e.repeat) return;

        if (currentPhase === 'recording') {
          stopAndTranscribe();
        } else if (currentPhase === 'idle' || currentPhase === 'done' || currentPhase === 'error') {
          startListening();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [cancelListening, startListening, stopAndTranscribe]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
      releaseMediaAndRecognizer(true);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [clearAllTimers, releaseMediaAndRecognizer]);

  return (
    <>
      {/* Separate visually-hidden polite live region for screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        data-testid="voice-hud-status"
      >
        {liveAnnouncement}
      </div>

      {/* Measured Top-Center Obsidian Pill Plate (aria-hidden="true") */}
      <div
        ref={plateRef}
        aria-hidden="true"
        data-testid="voice-hud-plate"
        data-phase={phase}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          if (phase === 'recording') {
            stopAndTranscribe();
          }
        }}
        style={{
          position: 'fixed',
          top: '8px',
          left: '50%',
          transform: 'translateX(-50%) translateY(-6px) scale(0.96)',
          width: '0px',
          height: '52px',
          maxHeight: '52px',
          borderRadius: '26px',
          zIndex: 60,
          background: 'rgba(8,8,8,0.96)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
          backdropFilter: 'blur(18px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
          overflow: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
          cursor: phase === 'recording' ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            pointerEvents: 'none',
          }}
        />

        {phase === 'error' && errorMessage && (
          <div
            data-testid="voice-hud-error-text"
            style={{
              position: 'absolute',
              left: '36px',
              right: '12px',
              color: '#FF6B5A',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '10.5px',
              fontWeight: 500,
              lineHeight: '1.2',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              pointerEvents: 'none',
            }}
          >
            {errorMessage}
          </div>
        )}

        {phase === 'recording' && isHovered && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(8,8,8,0.72)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FAFAFA',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '11px',
              letterSpacing: '0.02em',
              pointerEvents: 'none',
            }}
          >
            Stop recording
          </div>
        )}
      </div>
    </>
  );
};

export default VoiceHud;
