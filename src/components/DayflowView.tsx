import React, { useState, useEffect, useMemo } from 'react';
import {
  DAYFLOW_CATEGORIES,
  DAY_STATUS_OPTIONS,
  SUBMISSION_KINDS,
  DayflowCategory,
  DayflowInboxItem,
  DayflowRecurringClass,
  DayflowState,
  DayflowSubmissionItem,
  DayflowTask,
  DayStatusType,
  FreeTimeGap,
  SubmissionKind,
  TimelineBlock,
  deleteDayflowSubmission,
  formatDurationCompact,
  formatTime12h,
  formatYMDLocal,
  getCategoryMeta,
  getDayAvailabilitySummary,
  getDayStatusMeta,
  getIsoWeekday,
  getMondayToSundayWeek,
  getSortedSubmissionsByClosestWindow,
  getSubmissionWindowTelemetry,
  loadDayflowState,
  minutesToTime,
  parseYMDLocal,
  saveDayflowState,
  slotSubmissionPrepIntoFreeGap,
  timeToMinutes,
  toggleDayflowSubmissionComplete,
  upsertDayflowSubmission,
} from '../utils/dayflowState';

interface DayflowViewProps {
  soundEnabled?: boolean;
  onAwardXP?: (amount: number, reason: string) => void;
  onNotify?: (msg: string, status?: 'ok' | 'err') => void;
  onPlayClick?: (enabled?: boolean, pitch?: number, durationMs?: number) => void;
}

const WEEKDAY_BUTTONS = [
  { iso: 1, short: 'Mon', label: 'M' },
  { iso: 2, short: 'Tue', label: 'T' },
  { iso: 3, short: 'Wed', label: 'W' },
  { iso: 4, short: 'Thu', label: 'T' },
  { iso: 5, short: 'Fri', label: 'F' },
  { iso: 6, short: 'Sat', label: 'S' },
  { iso: 7, short: 'Sun', label: 'S' },
];

const DURATION_PRESETS = [
  { label: '15m', min: 15 },
  { label: '30m', min: 30 },
  { label: '45m', min: 45 },
  { label: '1h', min: 60 },
  { label: '1.5h', min: 90 },
  { label: '2h', min: 120 },
];

export const DayflowView: React.FC<DayflowViewProps> = ({
  soundEnabled = true,
  onAwardXP,
  onNotify,
  onPlayClick,
}) => {
  const [state, setState] = useState<DayflowState>(loadDayflowState);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');

  const todayDate = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => formatYMDLocal(todayDate), [todayDate]);
  const [selectedDateKey, setSelectedDateKey] = useState<string>(todayKey);
  const [monthCursor, setMonthCursor] = useState<Date>(
    () => new Date(todayDate.getFullYear(), todayDate.getMonth(), 1)
  );

  // Live clock for current-time glowing indicator line
  const [nowMinutes, setNowMinutes] = useState<number>(() => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const n = new Date();
      setNowMinutes(n.getHours() * 60 + n.getMinutes());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Persist to localStorage under 'flux_os_dayflow' and notify Today module
  useEffect(() => {
    saveDayflowState(state, true);
  }, [state]);

  // Reload state immediately when a JSON backup is imported or updated from Today module
  useEffect(() => {
    const onExternalUpdate = () => {
      const fresh = loadDayflowState();
      setState((prev) => (JSON.stringify(prev) === JSON.stringify(fresh) ? prev : fresh));
    };
    window.addEventListener('flux-dayflow-updated', onExternalUpdate);
    return () => window.removeEventListener('flux-dayflow-updated', onExternalUpdate);
  }, []);

  // Collapsible Right Slide Bar (Exams & Submissions + Inbox Tray) state
  const [inboxOpen, setInboxOpen] = useState<boolean>(true);
  const [rightSlideTab, setRightSlideTab] = useState<'submissions' | 'inbox'>('submissions');
  const [inboxTitle, setInboxTitle] = useState<string>('');
  const [inboxCategory, setInboxCategory] = useState<DayflowCategory>('deepwork');
  const [inboxDuration, setInboxDuration] = useState<number>(45);

  // Exams & Assignment Submissions state (Add / Modify with Given Date & Deadline)
  const [editingSubmId, setEditingSubmId] = useState<string | null>(null);
  const [submTitle, setSubmTitle] = useState<string>('');
  const [submSubject, setSubmSubject] = useState<string>('');
  const [submKind, setSubmKind] = useState<SubmissionKind>('assignment');
  const [submGivenDate, setSubmGivenDate] = useState<string>(todayKey);
  const [submDueDate, setSubmDueDate] = useState<string>(todayKey);
  const [submDueTime, setSubmDueTime] = useState<string>('17:00');
  const [submDuration, setSubmDuration] = useState<number>(60);
  const [submAutoSchedule, setSubmAutoSchedule] = useState<boolean>(true);
  const [submNote, setSubmNote] = useState<string>('');

  // Configure Timetable / Waking Hours Modal
  const [configModalOpen, setConfigModalOpen] = useState<boolean>(false);
  const [draftWakeStart, setDraftWakeStart] = useState<number>(state.config.wakeStartHour);
  const [draftWakeEnd, setDraftWakeEnd] = useState<number>(state.config.wakeEndHour);

  // Quick-Add / Edit Modal state
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fromInboxId, setFromInboxId] = useState<string | null>(null);
  const [formKind, setFormKind] = useState<'task' | 'class'>('task');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formCategory, setFormCategory] = useState<DayflowCategory>('deepwork');
  const [formDate, setFormDate] = useState<string>(todayKey);
  const [formStartTime, setFormStartTime] = useState<string>('09:00');
  const [formDuration, setFormDuration] = useState<number>(60);
  const [formGapMaxMin, setFormGapMaxMin] = useState<number | null>(null);
  const [formRepeatDays, setFormRepeatDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [formRoomOrNote, setFormRoomOrNote] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  const clickSound = (pitch = 820, dur = 12) => {
    if (onPlayClick) onPlayClick(soundEnabled, pitch, dur);
  };

  const selectedDateObj = useMemo(() => parseYMDLocal(selectedDateKey), [selectedDateKey]);
  const weekDays = useMemo(() => getMondayToSundayWeek(selectedDateObj), [selectedDateObj]);
  const activeDaySummary = useMemo(
    () => getDayAvailabilitySummary(state, selectedDateKey),
    [state, selectedDateKey]
  );

  const stepDate = (deltaDays: number) => {
    clickSound(740, 10);
    const next = new Date(
      selectedDateObj.getFullYear(),
      selectedDateObj.getMonth(),
      selectedDateObj.getDate() + deltaDays
    );
    const nextKey = formatYMDLocal(next);
    setSelectedDateKey(nextKey);
    setMonthCursor(new Date(next.getFullYear(), next.getMonth(), 1));
  };

  const jumpToToday = () => {
    clickSound(880, 12);
    const now = new Date();
    const k = formatYMDLocal(now);
    setSelectedDateKey(k);
    setMonthCursor(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  // Open Quick-Add Modal for a new item or pre-filled Free-Time Gap
  const openQuickAdd = (opts?: {
    kind?: 'task' | 'class';
    dateKey?: string;
    startTime?: string;
    durationMin?: number;
    gapMaxMin?: number | null;
    title?: string;
    category?: DayflowCategory;
    inboxItemId?: string | null;
  }) => {
    clickSound(860, 12);
    const targetDate = opts?.dateKey || selectedDateKey;
    const targetIsoDay = getIsoWeekday(parseYMDLocal(targetDate));
    setEditingId(null);
    setFromInboxId(opts?.inboxItemId || null);
    setFormKind(opts?.kind || 'task');
    setFormTitle(opts?.title || '');
    setFormCategory(opts?.category || (opts?.kind === 'class' ? 'lecture' : 'deepwork'));
    setFormDate(targetDate);
    setFormStartTime(opts?.startTime || '09:00');
    setFormDuration(opts?.durationMin || 60);
    setFormGapMaxMin(opts?.gapMaxMin ?? null);
    setFormRepeatDays([targetIsoDay]);
    setFormRoomOrNote('');
    setFormError('');
    setModalOpen(true);
  };

  // Open Edit Modal from an existing timeline block
  const openEditBlock = (block: TimelineBlock) => {
    clickSound(820, 12);
    setFormError('');
    setFromInboxId(null);
    setFormGapMaxMin(null);
    if (block.kind === 'class') {
      const cls = state.recurringClasses.find((c) => c.id === block.sourceId);
      if (!cls) return;
      setEditingId(cls.id);
      setFormKind('class');
      setFormTitle(cls.title);
      setFormCategory(cls.category);
      setFormDate(selectedDateKey);
      setFormStartTime(cls.startTime);
      setFormDuration(cls.durationMin);
      setFormRepeatDays(cls.repeatDays.length > 0 ? cls.repeatDays : [1]);
      setFormRoomOrNote(cls.roomOrNote || '');
      setModalOpen(true);
    } else {
      const tsk = state.tasks.find((t) => t.id === block.sourceId);
      if (!tsk) return;
      setEditingId(tsk.id);
      setFormKind('task');
      setFormTitle(tsk.title);
      setFormCategory(tsk.category);
      setFormDate(tsk.date);
      setFormStartTime(tsk.startTime);
      setFormDuration(tsk.durationMin);
      setFormRepeatDays([getIsoWeekday(parseYMDLocal(tsk.date))]);
      setFormRoomOrNote(tsk.note || '');
      setModalOpen(true);
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Enter a title for this schedule block.');
      return;
    }
    const cleanDuration = Math.max(10, Math.min(720, Number(formDuration) || 60));

    if (formKind === 'class') {
      const days = formRepeatDays.length > 0 ? [...formRepeatDays].sort() : [getIsoWeekday(parseYMDLocal(formDate))];
      if (editingId) {
        setState((prev) => ({
          ...prev,
          recurringClasses: prev.recurringClasses.map((c) =>
            c.id === editingId
              ? {
                  ...c,
                  title: formTitle.trim(),
                  category: formCategory,
                  startTime: formStartTime,
                  durationMin: cleanDuration,
                  repeatDays: days,
                  roomOrNote: formRoomOrNote.trim(),
                }
              : c
          ),
        }));
        onNotify?.('Updated recurring class in Dayflow');
      } else {
        const newCls: DayflowRecurringClass = {
          id: 'df-cls-' + Date.now(),
          title: formTitle.trim(),
          category: formCategory,
          startTime: formStartTime,
          durationMin: cleanDuration,
          repeatDays: days,
          skippedDates: [],
          roomOrNote: formRoomOrNote.trim(),
        };
        setState((prev) => ({
          ...prev,
          recurringClasses: [...prev.recurringClasses, newCls],
        }));
        onNotify?.('Added weekly recurring class to Dayflow');
      }
    } else {
      if (editingId) {
        setState((prev) => ({
          ...prev,
          tasks: prev.tasks.map((t) =>
            t.id === editingId
              ? {
                  ...t,
                  title: formTitle.trim(),
                  category: formCategory,
                  date: formDate,
                  startTime: formStartTime,
                  durationMin: cleanDuration,
                  note: formRoomOrNote.trim(),
                }
              : t
          ),
        }));
        onNotify?.('Updated scheduled task');
      } else {
        const newTask: DayflowTask = {
          id: 'df-tsk-' + Date.now(),
          title: formTitle.trim(),
          category: formCategory,
          date: formDate,
          startTime: formStartTime,
          durationMin: cleanDuration,
          completed: false,
          note: formRoomOrNote.trim(),
        };
        setState((prev) => ({
          ...prev,
          tasks: [...prev.tasks, newTask],
          inbox: fromInboxId ? prev.inbox.filter((i) => i.id !== fromInboxId) : prev.inbox,
        }));
        setSelectedDateKey(formDate);
        onNotify?.(`Scheduled "${newTask.title}" at ${formatTime12h(formStartTime)}`);
      }
    }

    clickSound(940, 14);
    setModalOpen(false);
    setEditingId(null);
    setFromInboxId(null);
  };

  const handleDeleteFromModal = () => {
    if (!editingId) return;
    clickSound(520, 14);
    if (formKind === 'class') {
      setState((prev) => ({
        ...prev,
        recurringClasses: prev.recurringClasses.filter((c) => c.id !== editingId),
      }));
      onNotify?.('Removed recurring class');
    } else {
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => t.id !== editingId),
      }));
      onNotify?.('Removed task from timeline');
    }
    setModalOpen(false);
    setEditingId(null);
  };

  const toggleTaskCompleted = (taskId: string) => {
    const target = state.tasks.find((t) => t.id === taskId);
    if (!target) return;
    const nextDone = !target.completed;
    clickSound(nextDone ? 980 : 620, 14);
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, completed: nextDone } : t)),
    }));
    if (nextDone) {
      onAwardXP?.(15, `Completed Dayflow Block: ${target.title}`);
    }
  };

  const deleteTaskDirect = (taskId: string) => {
    clickSound(520, 12);
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
    onNotify?.('Deleted task block');
  };

  const skipClassOnDate = (classId: string, dateKey: string) => {
    clickSound(640, 12);
    setState((prev) => ({
      ...prev,
      recurringClasses: prev.recurringClasses.map((cls) => {
        if (cls.id !== classId) return cls;
        const skipped = Array.isArray(cls.skippedDates) ? cls.skippedDates : [];
        if (skipped.includes(dateKey)) return cls;
        return { ...cls, skippedDates: [...skipped, dateKey] };
      }),
    }));
    onNotify?.(`Skipped class for ${dateKey}`);
  };

  const setDayStatusOverride = (dateKey: string, status: DayStatusType | null) => {
    clickSound(840, 12);
    setState((prev) => {
      const nextOverrides = { ...(prev.dayOverrides || {}) };
      if (!status || nextOverrides[dateKey] === status) {
        delete nextOverrides[dateKey];
        onNotify?.(`Cleared day status for ${dateKey}`);
      } else {
        nextOverrides[dateKey] = status;
        const meta = getDayStatusMeta(status);
        onNotify?.(`Marked ${dateKey} as ${meta?.label || status}`);
      }
      return { ...prev, dayOverrides: nextOverrides };
    });
  };

  // Inbox handlers
  const handleAddInboxItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inboxTitle.trim()) return;
    clickSound(880, 12);
    const item: DayflowInboxItem = {
      id: 'df-inb-' + Date.now(),
      title: inboxTitle.trim(),
      category: inboxCategory,
      durationMin: Math.max(15, Number(inboxDuration) || 45),
      createdAt: todayKey,
    };
    setState((prev) => ({
      ...prev,
      inbox: [item, ...prev.inbox],
    }));
    setInboxTitle('');
    onNotify?.('Added task to Dayflow Inbox');
  };

  const scheduleInboxIntoGap = (item: DayflowInboxItem) => {
    // Find first free gap on selectedDateKey that fits item.durationMin, or fallback to largest gap
    const gaps = activeDaySummary.gaps;
    const fittingGap =
      gaps.find((g) => g.durationMin >= item.durationMin) ||
      gaps[0] || {
        startTime: `${String(state.config.wakeStartHour).padStart(2, '0')}:00`,
        durationMin: item.durationMin,
      };

    // If viewing today, try to schedule after current time if possible
    let chosenStart = fittingGap.startTime;
    if (selectedDateKey === todayKey) {
      const roundedNow = Math.ceil(nowMinutes / 15) * 15;
      const futureGap = gaps.find((g) => g.endMin - Math.max(g.startMin, roundedNow) >= item.durationMin);
      if (futureGap) {
        chosenStart = minutesToTime(Math.max(futureGap.startMin, roundedNow));
      }
    }

    openQuickAdd({
      kind: 'task',
      dateKey: selectedDateKey,
      startTime: chosenStart,
      durationMin: item.durationMin,
      title: item.title,
      category: item.category,
      inboxItemId: item.id,
    });
  };

  const deleteInboxItem = (id: string) => {
    clickSound(520, 12);
    setState((prev) => ({
      ...prev,
      inbox: prev.inbox.filter((i) => i.id !== id),
    }));
  };

  // Submissions & Exams handlers
  const sortedSubmissions = useMemo(
    () => getSortedSubmissionsByClosestWindow(state.submissions || [], todayKey, nowMinutes),
    [state.submissions, todayKey, nowMinutes]
  );

  const pendingSubmissionsCount = useMemo(
    () => (state.submissions || []).filter((s) => !s.completed).length,
    [state.submissions]
  );

  const resetSubmissionForm = () => {
    setEditingSubmId(null);
    setSubmTitle('');
    setSubmSubject('');
    setSubmKind('assignment');
    setSubmGivenDate(todayKey);
    setSubmDueDate(selectedDateKey || todayKey);
    setSubmDueTime('17:00');
    setSubmDuration(60);
    setSubmAutoSchedule(true);
    setSubmNote('');
  };

  const handleSaveSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submTitle.trim()) return;
    clickSound(920, 14);
    const wasEditing = Boolean(editingSubmId);
    setState((prev) =>
      upsertDayflowSubmission(prev, {
        id: editingSubmId || undefined,
        title: submTitle.trim(),
        subject: submSubject.trim() || undefined,
        kind: submKind,
        givenDate: submGivenDate || todayKey,
        dueDate: submDueDate || todayKey,
        dueTime: submDueTime || '17:00',
        durationMin: Math.max(15, Number(submDuration) || 60),
        completed: wasEditing
          ? Boolean(prev.submissions.find((s) => s.id === editingSubmId)?.completed)
          : false,
        autoSchedule: submAutoSchedule,
        note: submNote.trim() || undefined,
      })
    );
    onNotify?.(
      wasEditing
        ? `Modified "${submTitle.trim()}" (Given: ${submGivenDate} → Due: ${submDueDate} ${submDueTime})`
        : `Added "${submTitle.trim()}" to Schedule & Today Priority Queue`
    );
    resetSubmissionForm();
  };

  const handleEditSubmission = (item: DayflowSubmissionItem) => {
    clickSound(820, 12);
    setInboxOpen(true);
    setRightSlideTab('submissions');
    setEditingSubmId(item.id);
    setSubmTitle(item.title);
    setSubmSubject(item.subject || '');
    setSubmKind(item.kind || 'assignment');
    setSubmGivenDate(item.givenDate || todayKey);
    setSubmDueDate(item.dueDate || todayKey);
    setSubmDueTime(item.dueTime || '17:00');
    setSubmDuration(item.durationMin || 60);
    setSubmAutoSchedule(item.autoSchedule !== false);
    setSubmNote(item.note || '');
  };

  const handleToggleSubmissionDone = (id: string) => {
    const res = toggleDayflowSubmissionComplete(state, id);
    clickSound(res.nowCompleted ? 980 : 620, 14);
    setState(res.nextState);
    if (res.nowCompleted) {
      onAwardXP?.(25, 'Completed Exam / Assignment Submission');
      onNotify?.('Marked submission complete (+25 XP)');
    }
  };

  const handleDeleteSubmission = (id: string) => {
    clickSound(520, 12);
    setState((prev) => deleteDayflowSubmission(prev, id));
    if (editingSubmId === id) resetSubmissionForm();
    onNotify?.('Removed submission & linked schedule block');
  };

  const handleSlotSubmissionPrep = (id: string) => {
    clickSound(880, 12);
    const { nextState, slottedTask } = slotSubmissionPrepIntoFreeGap(state, id, selectedDateKey);
    if (slottedTask) {
      setState(nextState);
      onNotify?.(
        `Slotted "${slottedTask.title}" into free gap at ${formatTime12h(slottedTask.startTime)} on ${selectedDateKey}`
      );
    }
  };

  const saveWakingHoursConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const s = Math.max(0, Math.min(22, Number(draftWakeStart) || 6));
    const end = Math.max(s + 1, Math.min(24, Number(draftWakeEnd) || 23));
    setState((prev) => ({
      ...prev,
      config: { wakeStartHour: s, wakeEndHour: end },
    }));
    setConfigModalOpen(false);
    onNotify?.(`Updated waking hours: ${formatTime12h(`${s}:00`)} – ${formatTime12h(`${end === 24 ? 23 : end}:${end === 24 ? '59' : '00'}`)}`);
  };

  // Build unified chronological stream for Day View (interleaving scheduled blocks & free-time gap pills)
  const dayStreamItems = useMemo(() => {
    const items: Array<
      | { type: 'block'; sortMin: number; block: TimelineBlock }
      | { type: 'gap'; sortMin: number; gap: FreeTimeGap }
    > = [];

    activeDaySummary.blocks.forEach((b) => {
      items.push({ type: 'block', sortMin: b.startMin, block: b });
    });
    activeDaySummary.gaps.forEach((g) => {
      items.push({ type: 'gap', sortMin: g.startMin + 0.1, gap: g });
    });

    return items.sort((a, b) => a.sortMin - b.sortMin);
  }, [activeDaySummary]);

  // Month grid cells (Monday-first calendar grid)
  const monthCells = useMemo(() => {
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const firstIso = getIsoWeekday(firstDay); // 1 (Mon) .. 7 (Sun)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<{ day: number; key: string; summary: ReturnType<typeof getDayAvailabilitySummary> } | null> = [];
    for (let i = 1; i < firstIso; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        day: d,
        key,
        summary: getDayAvailabilitySummary(state, key),
      });
    }
    return cells;
  }, [monthCursor, state]);

  const wakeStartMin = state.config.wakeStartHour * 60;
  const wakeEndMin = state.config.wakeEndHour * 60;
  const isSelectedToday = selectedDateKey === todayKey;
  const currentStatusMeta = getDayStatusMeta(activeDaySummary.statusOverride);

  // Format header date title
  const headerTitle = useMemo(() => {
    if (viewMode === 'month') {
      return monthCursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    if (viewMode === 'week') {
      const first = weekDays[0]?.date;
      const last = weekDays[6]?.date;
      if (!first || !last) return '';
      return `${first.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${last.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return selectedDateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [viewMode, monthCursor, weekDays, selectedDateObj]);

  return (
    <div className="space-y-5">
      {/* DAYFLOW HUB SUB-VIEW SWITCHER BAR (Matches EXECUTION HUB style) */}
      <div
        className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-lg border"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-hairline)' }}
        data-testid="dayflow-hub-bar"
      >
        <span className="font-mono text-[10px] uppercase tracking-wider px-2" style={{ color: 'var(--ink-muted)' }}>
          DAYFLOW HUB:
        </span>
        <button
          type="button"
          onClick={() => {
            clickSound(780, 10);
            setRightSlideTab('inbox');
          }}
          className={`px-3 py-1 rounded-md text-xs font-mono inline-flex items-center gap-1.5 transition ${
            rightSlideTab === 'inbox' ? 'arch-btn-primary' : 'arch-btn-ghost border-transparent'
          }`}
        >
          <span>Timeline &amp; Inbox</span>
        </button>
        <button
          type="button"
          data-testid="dayflow-hub-submissions-tab"
          onClick={() => {
            clickSound(780, 10);
            setRightSlideTab('submissions');
            setInboxOpen(true);
          }}
          className={`px-3 py-1 rounded-md text-xs font-mono inline-flex items-center gap-1.5 transition ${
            rightSlideTab === 'submissions' ? 'arch-btn-primary' : 'arch-btn-ghost border-transparent'
          }`}
        >
          <span>Exams &amp; Submissions</span>
          {pendingSubmissionsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded text-[10px] border tabular-nums">
              {pendingSubmissionsCount}
            </span>
          )}
        </button>
      </div>

      {/* 1. TOP NAVIGATION & VIEW SWITCHER HEADER */}
      <div className="arch-panel rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-[11px] uppercase tracking-widest"
                style={{ color: 'var(--ink-muted)' }}
              >
                04 // STRUCTURED TIMELINE &amp; AVAILABILITY PLANNER
              </span>
              {isSelectedToday && viewMode === 'day' && (
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold border"
                  style={{
                    color: 'var(--status-ok)',
                    borderColor: 'var(--status-ok)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  }}
                >
                  LIVE TODAY
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <h1 className="text-xl sm:text-2xl font-semibold heading-tight">
                Dayflow — {headerTitle}
              </h1>
              {currentStatusMeta && viewMode === 'day' && (
                <span
                  className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-semibold uppercase border"
                  style={{
                    color: currentStatusMeta.color,
                    borderColor: currentStatusMeta.color,
                    backgroundColor: 'var(--bg-canvas)',
                  }}
                >
                  {currentStatusMeta.shortLabel}
                </span>
              )}
            </div>
          </div>

          {/* Right Controls: Segmented View Switcher + Today + Prev/Next + Gear Config + Add */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Segmented Toggle: Day | Week | Month */}
            <div
              className="inline-flex rounded-lg border p-0.5 font-mono text-xs"
              style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-hairline)' }}
              role="tablist"
              aria-label="Dayflow View Switcher"
            >
              {(['day', 'week', 'month'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  role="tab"
                  aria-selected={viewMode === mode}
                  onClick={() => {
                    clickSound(780, 10);
                    setViewMode(mode);
                  }}
                  className={`px-3 py-1.5 rounded-md uppercase transition font-medium ${
                    viewMode === mode ? 'arch-btn-primary' : 'arch-btn-ghost border-transparent'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Prev / Today / Next */}
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous period"
                onClick={() => {
                  if (viewMode === 'month') {
                    setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1));
                  } else if (viewMode === 'week') {
                    stepDate(-7);
                  } else {
                    stepDate(-1);
                  }
                }}
                className="arch-btn-ghost px-2.5 py-1.5 rounded-md font-mono text-xs"
              >
                &lt;
              </button>
              <button
                type="button"
                onClick={jumpToToday}
                className="arch-btn-ghost px-3 py-1.5 rounded-md font-mono text-xs font-medium"
              >
                Today
              </button>
              <button
                type="button"
                aria-label="Next period"
                onClick={() => {
                  if (viewMode === 'month') {
                    setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1));
                  } else if (viewMode === 'week') {
                    stepDate(7);
                  } else {
                    stepDate(1);
                  }
                }}
                className="arch-btn-ghost px-2.5 py-1.5 rounded-md font-mono text-xs"
              >
                &gt;
              </button>
            </div>

            {/* Submissions & Exams Slide Bar Toggle */}
            <button
              type="button"
              data-testid="dayflow-submissions-toggle"
              onClick={() => {
                if (inboxOpen && rightSlideTab === 'submissions') {
                  setInboxOpen(false);
                } else {
                  setRightSlideTab('submissions');
                  setInboxOpen(true);
                }
              }}
              className={`px-3 py-1.5 rounded-md font-mono text-xs inline-flex items-center gap-1.5 border transition ${
                inboxOpen && rightSlideTab === 'submissions' ? 'arch-btn-primary' : 'arch-btn-ghost'
              }`}
              title="Toggle Exams & Assignment Submissions Slide Bar"
            >
              <span>Exams &amp; Submissions</span>
              <span
                className="px-1.5 py-0.2 rounded text-[10px] border tabular-nums"
                style={{
                  borderColor: pendingSubmissionsCount > 0 ? '#F59E0B' : 'currentColor',
                  color:
                    inboxOpen && rightSlideTab === 'submissions'
                      ? 'currentColor'
                      : pendingSubmissionsCount > 0
                      ? '#F59E0B'
                      : 'currentColor',
                }}
              >
                {pendingSubmissionsCount}
              </span>
            </button>

            {/* Inbox Drawer Toggle */}
            <button
              type="button"
              onClick={() => {
                if (inboxOpen && rightSlideTab === 'inbox') {
                  setInboxOpen(false);
                } else {
                  setRightSlideTab('inbox');
                  setInboxOpen(true);
                }
              }}
              className={`px-3 py-1.5 rounded-md font-mono text-xs inline-flex items-center gap-1.5 border transition ${
                inboxOpen && rightSlideTab === 'inbox' ? 'arch-btn-primary' : 'arch-btn-ghost'
              }`}
              title="Toggle Unscheduled Inbox Tray"
            >
              <span>Inbox</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] border tabular-nums">
                {state.inbox.length}
              </span>
            </button>

            {/* Configure Timetable / Hours Gear Button */}
            <button
              type="button"
              onClick={() => {
                setDraftWakeStart(state.config.wakeStartHour);
                setDraftWakeEnd(state.config.wakeEndHour);
                setConfigModalOpen(true);
              }}
              aria-label="Configure Timetable and Waking Hours"
              title="Configure Timetable / Waking Hours"
              className="arch-btn-ghost px-3 py-1.5 rounded-md font-mono text-xs inline-flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span className="hidden sm:inline">Timetable / Hours</span>
            </button>

            {/* Primary + Add Button */}
            <button
              type="button"
              onClick={() => openQuickAdd({ dateKey: selectedDateKey })}
              className="arch-btn-primary px-3.5 py-1.5 rounded-md font-mono text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <span>+ Add Block</span>
            </button>
          </div>
        </div>

        {/* Horizontal Mon–Sun Week-Strip (Shown in Day View) */}
        {viewMode === 'day' && (
          <div className="pt-3 border-t space-y-3" style={{ borderColor: 'var(--border-hairline)' }}>
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {weekDays.map((wd) => {
                const daySum = getDayAvailabilitySummary(state, wd.key);
                const isSelected = wd.key === selectedDateKey;
                const isToday = wd.key === todayKey;
                const statusMeta = getDayStatusMeta(daySum.statusOverride);

                return (
                  <button
                    key={wd.key}
                    type="button"
                    onClick={() => {
                      clickSound(720, 10);
                      setSelectedDateKey(wd.key);
                    }}
                    className={`p-2 sm:p-2.5 rounded-lg border text-left transition flex flex-col justify-between ${
                      isSelected ? 'arch-btn-primary' : 'arch-btn-ghost'
                    }`}
                    style={
                      !isSelected
                        ? {
                            backgroundColor: isToday ? 'var(--bg-elevated)' : 'var(--bg-canvas)',
                            borderColor: isToday ? 'var(--border-strong)' : 'var(--border-hairline)',
                          }
                        : undefined
                    }
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono text-[10px] uppercase opacity-75">{wd.shortDay}</span>
                      {isToday && (
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: isSelected ? 'var(--accent-fg)' : 'var(--status-ok)' }}
                        />
                      )}
                    </div>
                    <div className="font-mono text-sm sm:text-base font-bold tabular-nums my-0.5">
                      {String(wd.dayNum).padStart(2, '0')}
                    </div>

                    {/* Indicator Dots for Scheduled Items */}
                    <div className="flex items-center justify-between gap-1 w-full mt-1">
                      <div className="flex items-center gap-1 overflow-hidden">
                        {daySum.blocks.length === 0 ? (
                          <span className="font-mono text-[9px] opacity-65 truncate">FREE</span>
                        ) : (
                          daySum.blocks.slice(0, 4).map((b) => {
                            const cat = getCategoryMeta(b.category);
                            return (
                              <span
                                key={b.id}
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{
                                  backgroundColor: isSelected ? 'currentColor' : cat.color,
                                }}
                              />
                            );
                          })
                        )}
                      </div>
                      {statusMeta && (
                        <span
                          className="w-2 h-2 rounded-sm shrink-0"
                          title={statusMeta.label}
                          style={{ backgroundColor: statusMeta.color }}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Day Telemetry Bar + Editable Day Status Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs font-mono">
              <div className="flex flex-wrap items-center gap-3 tabular-nums">
                <span>
                  <span style={{ color: 'var(--ink-muted)' }}>SCHEDULED: </span>
                  <strong>{formatDurationCompact(activeDaySummary.busyMinutes)}</strong> (
                  {activeDaySummary.blocks.length} blocks)
                </span>
                <span style={{ color: 'var(--ink-muted)' }}>&bull;</span>
                <span>
                  <span style={{ color: 'var(--ink-muted)' }}>AVAILABLE: </span>
                  <strong style={{ color: 'var(--status-ok)' }}>
                    {activeDaySummary.freeSummaryLabel}
                  </strong>
                </span>
                <span style={{ color: 'var(--ink-muted)' }}>&bull;</span>
                <span style={{ color: 'var(--ink-muted)' }}>
                  HOURS: {formatTime12h(`${state.config.wakeStartHour}:00`)} –{' '}
                  {formatTime12h(`${state.config.wakeEndHour === 24 ? 23 : state.config.wakeEndHour}:${state.config.wakeEndHour === 24 ? '59' : '00'}`)}
                </span>
              </div>

              {/* Quick Editable Day Status Toggles */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] uppercase" style={{ color: 'var(--ink-muted)' }}>
                  DAY STATUS:
                </span>
                {DAY_STATUS_OPTIONS.map((opt) => {
                  const active = activeDaySummary.statusOverride === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDayStatusOverride(selectedDateKey, active ? null : opt.id)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono border transition ${
                        active ? 'font-semibold' : 'opacity-75 hover:opacity-100'
                      }`}
                      style={{
                        borderColor: active ? opt.color : 'var(--border-hairline)',
                        color: active ? opt.color : 'var(--ink-secondary)',
                        backgroundColor: active ? 'var(--bg-elevated)' : 'var(--bg-canvas)',
                      }}
                    >
                      {active ? `✓ ${opt.label}` : opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MAIN BODY: LEFT TIMELINE/CALENDAR + RIGHT COLLAPSIBLE INBOX TRAY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className={inboxOpen ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'}>
          {/* ==================== VIEW 1: DAY VIEW ==================== */}
          {viewMode === 'day' && (
            <div className="arch-panel rounded-xl p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-hairline)' }}>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest block" style={{ color: 'var(--ink-muted)' }}>
                    PROPORTIONAL DAILY TIMELINE &amp; IN-BETWEEN FREE GAPS
                  </span>
                  <h2 className="text-sm font-mono font-semibold mt-0.5">
                    {selectedDateKey} // {activeDaySummary.freeSummaryLabel}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => openQuickAdd({ dateKey: selectedDateKey, kind: 'class' })}
                  className="arch-btn-ghost px-2.5 py-1 rounded text-[11px] font-mono"
                >
                  + Add Recurring Class
                </button>
              </div>

              {/* Current-Time Live Indicator Banner when viewing Today */}
              {isSelectedToday && (
                <div
                  className="flex items-center gap-3 px-3 py-2 rounded-lg border"
                  style={{
                    borderColor: 'rgba(16, 185, 129, 0.45)',
                    backgroundColor: 'rgba(16, 185, 129, 0.07)',
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0"
                    style={{
                      backgroundColor: '#10B981',
                      boxShadow: '0 0 10px #10B981',
                    }}
                  />
                  <div className="flex-1 h-[1px]" style={{ backgroundColor: '#10B981', opacity: 0.5 }} />
                  <span className="font-mono text-[11px] font-semibold tabular-nums" style={{ color: '#10B981' }}>
                    LIVE NOW • {formatTime12h(minutesToTime(nowMinutes))}
                  </span>
                </div>
              )}

              {/* Proportional Vertical Timeline Stream */}
              <div className="relative pl-2 sm:pl-4 space-y-2.5">
                {/* Vertical Spine Line */}
                <div
                  className="absolute left-5 sm:left-7 top-3 bottom-3 w-[2px] pointer-events-none"
                  style={{ backgroundColor: 'var(--border-hairline)' }}
                />

                {dayStreamItems.map((item, idx) => {
                  if (item.type === 'gap') {
                    const { gap } = item;
                    const showNowLineInGap =
                      isSelectedToday && nowMinutes >= gap.startMin && nowMinutes < gap.endMin;

                    return (
                      <div key={`gap-${gap.startMin}-${idx}`} className="relative pl-7 sm:pl-9 py-1">
                        {/* Timeline node dot */}
                        <span
                          className="Jw-2 h-2 w-2 rounded-full border absolute left-[13px] sm:left-[21px] top-1/2 -translate-y-1/2"
                          style={{
                            backgroundColor: 'var(--bg-canvas)',
                            borderColor: 'var(--border-strong)',
                          }}
                        />

                        {showNowLineInGap && (
                          <div className="flex items-center gap-2 my-1.5">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: '#10B981', boxShadow: '0 0 8px #10B981' }}
                            />
                            <div className="flex-1 h-[1px]" style={{ backgroundColor: '#10B981' }} />
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ color: '#10B981' }}>
                              {formatTime12h(minutesToTime(nowMinutes))}
                            </span>
                          </div>
                        )}

                        {/* In-Between Free Time Pill */}
                        <button
                          type="button"
                          onClick={() =>
                            openQuickAdd({
                              kind: 'task',
                              dateKey: selectedDateKey,
                              startTime: gap.startTime,
                              durationMin: Math.min(60, gap.durationMin),
                              gapMaxMin: gap.durationMin,
                            })
                          }
                          className="w-full rounded-lg border border-dashed px-3.5 py-2.5 text-left transition flex flex-wrap items-center justify-between gap-2 group hover:border-solid"
                          style={{
                            backgroundColor: 'var(--bg-canvas)',
                            borderColor: 'var(--border-elevated)',
                          }}
                        >
                          <div className="flex items-center gap-2.5 font-mono text-xs">
                            <span className="tabular-nums opacity-65">
                              {formatTime12h(gap.startTime)} – {formatTime12h(gap.endTime)}
                            </span>
                            <span
                              className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition"
                              style={{
                                color: 'var(--status-ok)',
                                borderColor: 'rgba(16, 185, 129, 0.35)',
                                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                              }}
                            >
                              {gap.label}
                            </span>
                          </div>
                          <span
                            className="font-mono text-[10px] uppercase tracking-wider opacity-60 group-hover:opacity-100"
                            style={{ color: 'var(--ink-secondary)' }}
                          >
                            Click to schedule in gap &rarr;
                          </span>
                        </button>
                      </div>
                    );
                  }

                  const { block } = item;
                  const cat = getCategoryMeta(block.category);
                  const isClass = block.kind === 'class';
                  const isDone = Boolean(block.completed);
                  const minHeightPx = Math.max(64, Math.min(180, Math.round(block.durationMin * 0.85)));
                  const isNowInsideBlock =
                    isSelectedToday && nowMinutes >= block.startMin && nowMinutes < block.endMin;

                  return (
                    <div key={block.id} className="relative pl-7 sm:pl-9">
                      {/* Colored Node Indicator on Spine */}
                      <span
                        className="w-3 h-3 rounded-full absolute left-[11px] sm:left-[19px] top-5 border-2"
                        style={{
                          backgroundColor: isDone ? 'var(--status-ok)' : cat.color,
                          borderColor: 'var(--bg-surface)',
                          boxShadow: isNowInsideBlock ? `0 0 10px ${cat.color}` : undefined,
                        }}
                      />

                      <div
                        className="rounded-xl border p-3.5 sm:p-4 transition flex flex-col justify-between gap-2"
                        style={{
                          minHeight: `${minHeightPx}px`,
                          backgroundColor: isClass ? cat.bgSoft : 'var(--bg-canvas)',
                          borderTopColor: isNowInsideBlock ? cat.color : isClass ? cat.borderSoft : 'var(--border-hairline)',
                          borderRightColor: isNowInsideBlock ? cat.color : isClass ? cat.borderSoft : 'var(--border-hairline)',
                          borderBottomColor: isNowInsideBlock ? cat.color : isClass ? cat.borderSoft : 'var(--border-hairline)',
                          borderLeftWidth: '4px',
                          borderLeftColor: cat.color,
                          opacity: isDone ? 0.68 : 1,
                        }}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 min-w-0">
                            {!isClass ? (
                              <button
                                type="button"
                                role="checkbox"
                                aria-checked={isDone}
                                aria-label={`Mark "${block.title}" as ${isDone ? 'incomplete' : 'complete'}`}
                                onClick={() => toggleTaskCompleted(block.sourceId)}
                                className="mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition"
                                style={{
                                  backgroundColor: isDone ? 'var(--status-ok)' : 'transparent',
                                  borderColor: isDone ? 'var(--status-ok)' : cat.color,
                                  color: '#09090B',
                                }}
                              >
                                {isDone && (
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </button>
                            ) : (
                              <span
                                className="mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold shrink-0"
                                style={{ backgroundColor: cat.color, color: '#09090B' }}
                              >
                                CLASS
                              </span>
                            )}

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  onClick={() => openEditBlock(block)}
                                  className={`text-sm font-semibold cursor-pointer hover:underline ${
                                    isDone ? 'line-through opacity-75' : ''
                                  }`}
                                >
                                  {block.title}
                                </span>
                                <span
                                  className="px-2 py-0.2 rounded text-[10px] font-mono border"
                                  style={{
                                    color: cat.color,
                                    borderColor: cat.borderSoft,
                                    backgroundColor: 'var(--bg-surface)',
                                  }}
                                >
                                  {cat.label}
                                </span>
                                {isNowInsideBlock && (
                                  <span
                                    className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold"
                                    style={{ backgroundColor: '#10B981', color: '#09090B' }}
                                  >
                                    ACTIVE NOW
                                  </span>
                                )}
                              </div>

                              <div className="font-mono text-[11px] tabular-nums mt-1 flex flex-wrap items-center gap-2" style={{ color: 'var(--ink-secondary)' }}>
                                <span>
                                  {formatTime12h(block.startTime)} – {formatTime12h(block.endTime)}
                                </span>
                                <span>&bull;</span>
                                <span>{formatDurationCompact(block.durationMin)}</span>
                                {block.roomOrNote && (
                                  <>
                                    <span>&bull;</span>
                                    <span>{block.roomOrNote}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => openEditBlock(block)}
                              className="arch-btn-ghost px-2 py-1 rounded text-[10px] font-mono"
                            >
                              Edit
                            </button>
                            {isClass ? (
                              <button
                                type="button"
                                onClick={() => skipClassOnDate(block.sourceId, selectedDateKey)}
                                className="arch-btn-ghost px-2 py-1 rounded text-[10px] font-mono"
                                title="Skip this recurring class for this date only"
                              >
                                Skip Today
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => deleteTaskDirect(block.sourceId)}
                                className="arch-btn-ghost px-2 py-1 rounded text-[10px] font-mono"
                                style={{ color: 'var(--status-err)' }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================== VIEW 2: WEEK VIEW (7-COLUMN AVAILABILITY) ==================== */}
          {viewMode === 'week' && (
            <div className="arch-panel rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3" style={{ borderColor: 'var(--border-hairline)' }}>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest block" style={{ color: 'var(--ink-muted)' }}>
                    7-COLUMN WEEKLY BUSY VS. OPEN FREE-TIME OVERVIEW
                  </span>
                  <h2 className="text-sm font-mono font-semibold mt-0.5">
                    Click any free gap pill to schedule or toggle day status below
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-7 gap-2.5">
                {weekDays.map((wd) => {
                  const sum = getDayAvailabilitySummary(state, wd.key);
                  const isToday = wd.key === todayKey;
                  const isSelected = wd.key === selectedDateKey;
                  const statusMeta = getDayStatusMeta(sum.statusOverride);

                  return (
                    <div
                      key={wd.key}
                      className="rounded-xl border p-2.5 flex flex-col justify-between space-y-2.5"
                      style={{
                        backgroundColor: 'var(--bg-canvas)',
                        borderColor: isSelected
                          ? 'var(--ink-primary)'
                          : isToday
                          ? 'var(--status-ok)'
                          : 'var(--border-hairline)',
                      }}
                    >
                      <div className="space-y-2">
                        {/* Column Header */}
                        <div className="pb-2 border-b" style={{ borderColor: 'var(--border-hairline)' }}>
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDateKey(wd.key);
                                setViewMode('day');
                              }}
                              className="font-mono text-xs font-bold hover:underline flex items-center gap-1"
                            >
                              <span>{wd.shortDay}</span>
                              <span>{String(wd.dayNum).padStart(2, '0')}</span>
                            </button>
                            {isToday && (
                              <span
                                className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase"
                                style={{ backgroundColor: 'rgba(16, 185, 129, 0.16)', color: 'var(--status-ok)' }}
                              >
                                TODAY
                              </span>
                            )}
                          </div>

                          {/* Availability Readout Badge */}
                          <div
                            className="mt-1.5 px-2 py-1 rounded text-[10px] font-mono font-semibold text-center border"
                            style={{
                              color: sum.busyMinutes === 0 ? 'var(--status-ok)' : 'var(--ink-primary)',
                              borderColor:
                                sum.busyMinutes === 0 ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-elevated)',
                              backgroundColor:
                                sum.busyMinutes === 0 ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)',
                            }}
                          >
                            {sum.freeSummaryLabel}
                          </div>

                          {/* Quick Day Status Cycle Button */}
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {DAY_STATUS_OPTIONS.map((opt) => {
                              const active = sum.statusOverride === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => setDayStatusOverride(wd.key, active ? null : opt.id)}
                                  className="px-1.5 py-0.5 rounded text-[9px] font-mono border transition"
                                  style={{
                                    borderColor: active ? opt.color : 'var(--border-hairline)',
                                    color: active ? opt.color : 'var(--ink-muted)',
                                    backgroundColor: active ? 'var(--bg-elevated)' : 'transparent',
                                  }}
                                  title={`Toggle ${opt.label}`}
                                >
                                  {opt.id === 'holiday' ? 'Holiday' : opt.id === 'free' ? 'Free' : 'Focus'}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Busy Blocks */}
                        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-0.5">
                          {sum.blocks.map((b) => {
                            const cat = getCategoryMeta(b.category);
                            return (
                              <button
                                key={b.id}
                                type="button"
                                onClick={() => {
                                  setSelectedDateKey(wd.key);
                                  openEditBlock(b);
                                }}
                                className="w-full text-left p-2 rounded-md border text-[11px] space-y-0.5 transition hover:opacity-90"
                                style={{
                                  backgroundColor: b.kind === 'class' ? cat.bgSoft : 'var(--bg-surface)',
                                  borderTopColor: cat.borderSoft,
                                  borderRightColor: cat.borderSoft,
                                  borderBottomColor: cat.borderSoft,
                                  borderLeftWidth: '3px',
                                  borderLeftColor: cat.color,
                                }}
                              >
                                <div className="font-semibold truncate">{b.title}</div>
                                <div className="font-mono text-[9px] tabular-nums opacity-75">
                                  {formatTime12h(b.startTime)} • {formatDurationCompact(b.durationMin)}
                                </div>
                              </button>
                            );
                          })}

                          {/* Open Free-Time Slots in Column */}
                          {sum.gaps.slice(0, 3).map((g, gIdx) => (
                            <button
                              key={`wk-gap-${wd.key}-${gIdx}`}
                              type="button"
                              onClick={() =>
                                openQuickAdd({
                                  kind: 'task',
                                  dateKey: wd.key,
                                  startTime: g.startTime,
                                  durationMin: Math.min(60, g.durationMin),
                                  gapMaxMin: g.durationMin,
                                })
                              }
                              className="w-full text-left px-2 py-1.5 rounded border border-dashed font-mono text-[10px] transition hover:border-solid"
                              style={{
                                borderColor: 'var(--border-elevated)',
                                color: 'var(--status-ok)',
                              }}
                            >
                              <div>{formatDurationCompact(g.durationMin)} free • + Add</div>
                              <div className="text-[9px] opacity-65 tabular-nums">
                                {formatTime12h(g.startTime)}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDateKey(wd.key);
                          setViewMode('day');
                        }}
                        className="w-full arch-btn-ghost py-1 rounded text-[10px] font-mono"
                      >
                        Open Day &rarr;
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================== VIEW 3: MONTH VIEW (WORKLOAD DENSITY & FREE DAYS) ==================== */}
          {viewMode === 'month' && (
            <div className="arch-panel rounded-xl p-4 sm:p-5 space-y-4">
              {/* Selected Date Inspector Bar in Month View */}
              <div
                className="p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3"
                style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-elevated)' }}
              >
                <div className="space-y-0.5">
                  <div className="font-mono text-[10px] uppercase" style={{ color: 'var(--ink-muted)' }}>
                    EDITING SELECTED DATE // {selectedDateKey}
                  </div>
                  <div className="text-xs font-mono">
                    <strong>{activeDaySummary.freeSummaryLabel}</strong> ({activeDaySummary.blocks.length}{' '}
                    scheduled blocks)
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {DAY_STATUS_OPTIONS.map((opt) => {
                    const active = activeDaySummary.statusOverride === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setDayStatusOverride(selectedDateKey, active ? null : opt.id)}
                        className="px-2.5 py-1 rounded text-[10px] font-mono border transition"
                        style={{
                          borderColor: active ? opt.color : 'var(--border-hairline)',
                          color: active ? opt.color : 'var(--ink-secondary)',
                          backgroundColor: active ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                        }}
                      >
                        {active ? `✓ ${opt.label}` : opt.label}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => openQuickAdd({ dateKey: selectedDateKey })}
                    className="arch-btn-ghost px-2.5 py-1 rounded text-[10px] font-mono"
                  >
                    + Add Task
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('day')}
                    className="arch-btn-primary px-3 py-1 rounded text-[10px] font-mono"
                  >
                    Open Timeline &rarr;
                  </button>
                </div>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1.5 text-center font-mono text-[10px] uppercase" style={{ color: 'var(--ink-muted)' }}>
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => (
                  <div key={d} className="py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar Month Grid */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {monthCells.map((cell, idx) => {
                  if (!cell) {
                    return (
                      <div
                        key={`m-empty-${idx}`}
                        className="min-h-[88px] rounded-lg border opacity-20"
                        style={{ backgroundColor: 'var(--bg-canvas)' }}
                      />
                    );
                  }

                  const { day, key, summary } = cell;
                  const isToday = key === todayKey;
                  const isSelected = key === selectedDateKey;
                  const statusMeta = getDayStatusMeta(summary.statusOverride);
                  const isCompletelyFree = summary.density === 'free';
                  const isLightDay = summary.density === 'light';

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        clickSound(720, 10);
                        setSelectedDateKey(key);
                      }}
                      onDoubleClick={() => {
                        setSelectedDateKey(key);
                        setViewMode('day');
                      }}
                      className="min-h-[92px] p-2 rounded-lg border text-left transition flex flex-col justify-between"
                      style={{
                        backgroundColor: isCompletelyFree
                          ? 'rgba(16, 185, 129, 0.06)'
                          : 'var(--bg-canvas)',
                        borderColor: isSelected
                          ? 'var(--ink-primary)'
                          : statusMeta
                          ? statusMeta.color
                          : isCompletelyFree
                          ? 'rgba(16, 185, 129, 0.35)'
                          : 'var(--border-hairline)',
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`font-mono text-xs tabular-nums ${isToday ? 'font-bold underline' : ''}`}>
                          {String(day).padStart(2, '0')}
                        </span>
                        {statusMeta ? (
                          <span
                            className="px-1 py-0.2 rounded text-[8px] font-mono uppercase font-semibold"
                            style={{ color: statusMeta.color, border: `1px solid ${statusMeta.color}` }}
                          >
                            {statusMeta.id.toUpperCase()}
                          </span>
                        ) : isCompletelyFree ? (
                          <span
                            className="px-1 py-0.2 rounded text-[8px] font-mono uppercase font-semibold"
                            style={{ color: 'var(--status-ok)' }}
                          >
                            FREE DAY
                          </span>
                        ) : isLightDay ? (
                          <span
                            className="px-1 py-0.2 rounded text-[8px] font-mono uppercase"
                            style={{ color: '#06B6D4' }}
                          >
                            LIGHT
                          </span>
                        ) : null}
                      </div>

                      {/* Preview up to 2 scheduled items */}
                      <div className="space-y-0.5 my-1 w-full overflow-hidden">
                        {summary.blocks.slice(0, 2).map((b) => {
                          const cat = getCategoryMeta(b.category);
                          return (
                            <div
                              key={b.id}
                              className="truncate text-[9px] font-mono px-1 py-0.2 rounded"
                              style={{ backgroundColor: cat.bgSoft, color: 'var(--ink-primary)' }}
                            >
                              {b.title}
                            </div>
                          );
                        })}
                        {summary.blocks.length > 2 && (
                          <div className="text-[8px] font-mono opacity-65">
                            +{summary.blocks.length - 2} more
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between w-full font-mono text-[9px] tabular-nums opacity-75">
                        <span>{summary.freeSummaryLabel}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 4. RIGHT SIDEBAR IN DAYFLOW: + NEW EXAM / ASSIGNMENT (AS IN IMAGE 1) & INBOX */}
        {inboxOpen && (
          <div
            className="lg:col-span-4 xl:col-span-3 arch-panel rounded-xl p-4 sm:p-5 space-y-4"
            data-testid="dayflow-right-slidebar"
          >
            {/* Segmented Slide-Bar Switcher: Exams & Submissions vs. Inbox */}
            <div className="space-y-2.5 border-b pb-3" style={{ borderColor: 'var(--border-hairline)' }}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--ink-muted)' }}>
                  {rightSlideTab === 'submissions'
                    ? 'CLOSEST WINDOW // EXAMS & SUBMISSIONS'
                    : 'UNSCHEDULED BACKLOG // INBOX'}
                </span>
                <button
                  type="button"
                  onClick={() => setInboxOpen(false)}
                  className="arch-btn-ghost px-2 py-0.5 rounded text-[10px] font-mono"
                >
                  Slide Out &rarr;
                </button>
              </div>

              <div
                className="grid grid-cols-2 gap-1 rounded-lg border p-0.5 font-mono text-[11px]"
                style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-hairline)' }}
              >
                <button
                  type="button"
                  onClick={() => setRightSlideTab('submissions')}
                  className={`py-1.5 px-2 rounded-md transition font-medium flex items-center justify-center gap-1.5 ${
                    rightSlideTab === 'submissions' ? 'arch-btn-primary' : 'arch-btn-ghost border-transparent'
                  }`}
                >
                  <span>Submissions</span>
                  <span className="px-1 rounded text-[9px] border tabular-nums">
                    {pendingSubmissionsCount}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRightSlideTab('inbox')}
                  className={`py-1.5 px-2 rounded-md transition font-medium flex items-center justify-center gap-1.5 ${
                    rightSlideTab === 'inbox' ? 'arch-btn-primary' : 'arch-btn-ghost border-transparent'
                  }`}
                >
                  <span>Inbox</span>
                  <span className="px-1 rounded text-[9px] border tabular-nums">
                    {state.inbox.length}
                  </span>
                </button>
              </div>
            </div>

            {rightSlideTab === 'submissions' ? (
              <div className="space-y-4">
                {/* Add / Modify Exam or Assignment Submission Form */}
                <form
                  onSubmit={handleSaveSubmission}
                  className="space-y-2.5 p-3 rounded-lg border"
                  style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-hairline)' }}
                  data-testid="dayflow-submission-form"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase font-semibold" style={{ color: editingSubmId ? '#F59E0B' : 'var(--ink-secondary)' }}>
                      {editingSubmId ? 'MODIFY EXAM / SUBMISSION' : '+ NEW EXAM / ASSIGNMENT'}
                    </span>
                    {editingSubmId && (
                      <button
                        type="button"
                        onClick={resetSubmissionForm}
                        className="font-mono text-[10px] underline"
                        style={{ color: 'var(--ink-muted)' }}
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    data-testid="subm-title-input"
                    value={submTitle}
                    onChange={(e) => setSubmTitle(e.target.value)}
                    placeholder="Title (e.g. OS Lab Record / DBMS Mid-Sem)..."
                    className="w-full arch-input rounded-md px-3 py-1.5 text-xs font-mono"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      data-testid="subm-kind-select"
                      value={submKind}
                      onChange={(e) => setSubmKind(e.target.value as SubmissionKind)}
                      aria-label="Submission or exam type"
                      className="arch-input rounded-md px-2 py-1.5 text-[11px] font-mono"
                    >
                      {SUBMISSION_KINDS.map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.shortBadge}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      data-testid="subm-subject-input"
                      value={submSubject}
                      onChange={(e) => setSubmSubject(e.target.value)}
                      placeholder="Course (e.g. CS-301)"
                      className="arch-input rounded-md px-2.5 py-1.5 text-[11px] font-mono"
                    />
                  </div>

                  {/* Given Date & Deadline Date */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-mono text-[9px] uppercase mb-0.5" style={{ color: 'var(--ink-muted)' }}>
                        Given Date
                      </label>
                      <input
                        type="date"
                        data-testid="subm-given-date"
                        value={submGivenDate}
                        onChange={(e) => setSubmGivenDate(e.target.value)}
                        className="w-full arch-input rounded-md px-2 py-1 text-[11px] font-mono tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[9px] uppercase mb-0.5" style={{ color: '#F59E0B' }}>
                        Deadline Date
                      </label>
                      <input
                        type="date"
                        data-testid="subm-due-date"
                        value={submDueDate}
                        onChange={(e) => setSubmDueDate(e.target.value)}
                        className="w-full arch-input rounded-md px-2 py-1 text-[11px] font-mono tabular-nums"
                      />
                    </div>
                  </div>

                  {/* Deadline Time & Duration */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-mono text-[9px] uppercase mb-0.5" style={{ color: 'var(--ink-muted)' }}>
                        Deadline / Exam Time
                      </label>
                      <input
                        type="time"
                        data-testid="subm-due-time"
                        value={submDueTime}
                        onChange={(e) => setSubmDueTime(e.target.value)}
                        className="w-full arch-input rounded-md px-2 py-1 text-[11px] font-mono tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[9px] uppercase mb-0.5" style={{ color: 'var(--ink-muted)' }}>
                        Block Duration
                      </label>
                      <select
                        value={submDuration}
                        onChange={(e) => setSubmDuration(Number(e.target.value))}
                        className="w-full arch-input rounded-md px-2 py-1 text-[11px] font-mono tabular-nums"
                      >
                        {DURATION_PRESETS.map((p) => (
                          <option key={p.min} value={p.min}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={submNote}
                    onChange={(e) => setSubmNote(e.target.value)}
                    placeholder="Notes / syllabus / portal link (optional)..."
                    className="w-full arch-input rounded-md px-2.5 py-1.5 text-[11px] font-mono"
                  />

                  <label className="flex items-center gap-2 cursor-pointer font-mono text-[10px]" style={{ color: 'var(--ink-secondary)' }}>
                    <input
                      type="checkbox"
                      checked={submAutoSchedule}
                      onChange={(e) => setSubmAutoSchedule(e.target.checked)}
                      className="w-3.5 h-3.5 rounded cursor-pointer accent-current"
                    />
                    <span>Auto-add to Dayflow schedule &amp; Today radar</span>
                  </label>

                  <button
                    type="submit"
                    data-testid="subm-submit-btn"
                    className="w-full arch-btn-primary py-2 rounded-md text-xs font-mono font-semibold"
                  >
                    {editingSubmId ? 'Save Modified Deadline & Sync' : '+ Add to Schedule & Today Queue'}
                  </button>
                </form>

                {/* Closest-Window Priority List */}
                {sortedSubmissions.length === 0 ? (
                  <div
                    className="p-4 rounded-lg border border-dashed text-center space-y-1"
                    style={{ borderColor: 'var(--border-elevated)' }}
                  >
                    <div className="font-mono text-xs" style={{ color: 'var(--ink-muted)' }}>
                      NO EXAMS OR SUBMISSIONS QUEUED
                    </div>
                    <p className="text-[11px]" style={{ color: 'var(--ink-secondary)' }}>
                      Add assignments, labs, or exams above. They automatically rank by closest deadline window, slot into your Dayflow schedule, and pop up in your Today module.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1" data-testid="dayflow-submissions-list">
                    {sortedSubmissions.map((sub) => {
                      const win = getSubmissionWindowTelemetry(sub, todayKey, nowMinutes);
                      return (
                        <div
                          key={sub.id}
                          data-testid="dayflow-submission-card"
                          className="p-3 rounded-lg border space-y-2 transition"
                          style={{
                            backgroundColor: 'var(--bg-canvas)',
                            borderTopColor: editingSubmId === sub.id ? '#F59E0B' : 'var(--border-hairline)',
                            borderRightColor: editingSubmId === sub.id ? '#F59E0B' : 'var(--border-hairline)',
                            borderBottomColor: editingSubmId === sub.id ? '#F59E0B' : 'var(--border-hairline)',
                            borderLeftWidth: '3px',
                            borderLeftColor: win.color,
                            opacity: sub.completed ? 0.65 : 1,
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 min-w-0">
                              <input
                                type="checkbox"
                                checked={sub.completed}
                                onChange={() => handleToggleSubmissionDone(sub.id)}
                                aria-label={`Mark ${sub.title} complete`}
                                className="mt-0.5 w-4 h-4 rounded cursor-pointer shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span
                                    className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold"
                                    style={{ backgroundColor: win.kindMeta.color, color: '#09090B' }}
                                  >
                                    {win.kindMeta.shortBadge}
                                  </span>
                                  {sub.subject && (
                                    <span
                                      className="px-1.5 py-0.2 rounded text-[9px] font-mono border"
                                      style={{ borderColor: 'var(--border-elevated)', color: 'var(--ink-secondary)' }}
                                    >
                                      {sub.subject}
                                    </span>
                                  )}
                                  <span
                                    className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold"
                                    style={{
                                      color: win.color,
                                      border: `1px solid ${win.color}`,
                                      backgroundColor: 'var(--bg-surface)',
                                    }}
                                  >
                                    {win.windowBadge}
                                  </span>
                                </div>
                                <div className={`text-xs font-semibold mt-1 ${sub.completed ? 'line-through opacity-75' : ''}`}>
                                  {sub.title}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Given Date -> Deadline Date & Window Progress Bar */}
                          <div className="space-y-1 pt-0.5">
                            <div className="flex flex-wrap items-center justify-between gap-1 font-mono text-[10px] tabular-nums" style={{ color: 'var(--ink-secondary)' }}>
                              <span>Given: <strong>{sub.givenDate}</strong></span>
                              <span>&rarr;</span>
                              <span style={{ color: sub.completed ? 'var(--ink-muted)' : win.color }}>
                                Due: <strong>{sub.dueDate}</strong> {formatTime12h(sub.dueTime)}
                              </span>
                            </div>
                            <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                              <div
                                className="h-full transition-all"
                                style={{ width: `${win.elapsedWindowPct}%`, backgroundColor: win.color }}
                              />
                            </div>
                            {sub.note && (
                              <div className="font-mono text-[10px] truncate" style={{ color: 'var(--ink-muted)' }}>
                                {sub.note}
                              </div>
                            )}
                          </div>

                          {/* Actions: Slot Prep in Free Gap | Modify | Delete */}
                          <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
                            {!sub.completed ? (
                              <button
                                type="button"
                                onClick={() => handleSlotSubmissionPrep(sub.id)}
                                className="arch-btn-ghost px-2 py-1 rounded text-[10px] font-mono font-medium"
                                style={{ color: 'var(--status-ok)' }}
                                title="Find open free-time gap on selected date and schedule prep/submission work"
                              >
                                + Slot Prep in Gap
                              </button>
                            ) : (
                              <span className="font-mono text-[10px]" style={{ color: 'var(--status-ok)' }}>
                                ✓ Submitted
                              </span>
                            )}
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                data-testid="subm-modify-btn"
                                onClick={() => handleEditSubmission(sub)}
                                className="arch-btn-ghost px-2 py-1 rounded text-[10px] font-mono"
                              >
                                Modify
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDateKey(sub.dueDate);
                                  setViewMode('day');
                                }}
                                className="arch-btn-ghost px-2 py-1 rounded text-[10px] font-mono"
                                title="Jump to deadline day in timeline"
                              >
                                Open Due Day
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSubmission(sub.id)}
                                className="arch-btn-ghost px-1.5 py-1 rounded text-[10px] font-mono"
                                style={{ color: 'var(--status-err)' }}
                                aria-label={`Delete ${sub.title}`}
                              >
                                &times;
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <>
                <form onSubmit={handleAddInboxItem} className="space-y-2.5">
                  <input
                    type="text"
                    value={inboxTitle}
                    onChange={(e) => setInboxTitle(e.target.value)}
                    placeholder="Dump unscheduled task..."
                    className="w-full arch-input rounded-md px-3 py-2 text-xs font-mono"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={inboxCategory}
                      onChange={(e) => setInboxCategory(e.target.value as DayflowCategory)}
                      aria-label="Inbox task category"
                      className="arch-input rounded-md px-2 py-1.5 text-[11px] font-mono"
                    >
                      {DAYFLOW_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={inboxDuration}
                      onChange={(e) => setInboxDuration(Number(e.target.value))}
                      aria-label="Inbox task duration"
                      className="arch-input rounded-md px-2 py-1.5 text-[11px] font-mono tabular-nums"
                    >
                      {DURATION_PRESETS.map((p) => (
                        <option key={p.min} value={p.min}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full arch-btn-primary py-2 rounded-md text-xs font-mono font-medium"
                  >
                    + Add to Inbox
                  </button>
                </form>

                {state.inbox.length === 0 ? (
                  <div
                    className="p-4 rounded-lg border border-dashed text-center space-y-1"
                    style={{ borderColor: 'var(--border-elevated)' }}
                  >
                    <div className="font-mono text-xs" style={{ color: 'var(--ink-muted)' }}>
                      INBOX CLEAR
                    </div>
                    <p className="text-[11px]" style={{ color: 'var(--ink-secondary)' }}>
                      Dump tasks without a time here, then click &ldquo;Slot into Gap&rdquo; to place them into open free time.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {state.inbox.map((item) => {
                      const cat = getCategoryMeta(item.category);
                      return (
                        <div
                          key={item.id}
                          className="p-3 rounded-lg border space-y-2"
                          style={{
                            backgroundColor: 'var(--bg-canvas)',
                            borderTopColor: 'var(--border-hairline)',
                            borderRightColor: 'var(--border-hairline)',
                            borderBottomColor: 'var(--border-hairline)',
                            borderLeftWidth: '3px',
                            borderLeftColor: cat.color,
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-xs font-semibold">{item.title}</div>
                              <div className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--ink-muted)' }}>
                                {cat.label} &bull; {formatDurationCompact(item.durationMin)}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => deleteInboxItem(item.id)}
                              aria-label={`Delete inbox item ${item.title}`}
                              className="arch-btn-ghost px-1.5 py-0.5 rounded text-[10px] font-mono"
                            >
                              &times;
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => scheduleInboxIntoGap(item)}
                            className="w-full arch-btn-ghost py-1.5 rounded text-[11px] font-mono font-medium"
                            style={{ color: 'var(--status-ok)' }}
                          >
                            Slot into Free Gap ({selectedDateKey}) &rarr;
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* 5. QUICK-ADD / EDIT MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="arch-panel rounded-xl w-full max-w-lg p-5 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-hairline)' }}>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest block" style={{ color: 'var(--ink-muted)' }}>
                  DAYFLOW SCHEDULER
                </span>
                <h3 className="text-base font-semibold">
                  {editingId ? 'Edit Schedule Block' : 'Schedule Block in Dayflow'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="arch-btn-ghost px-2.5 py-1 rounded text-xs font-mono"
              >
                ESC
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              {/* Type Switcher: Actionable Task vs Recurring Class */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormKind('task')}
                  className={`py-2 rounded-md font-mono text-xs border transition ${
                    formKind === 'task' ? 'arch-btn-primary' : 'arch-btn-ghost'
                  }`}
                >
                  Actionable Task (One-Off)
                </button>
                <button
                  type="button"
                  onClick={() => setFormKind('class')}
                  className={`py-2 rounded-md font-mono text-xs border transition ${
                    formKind === 'class' ? 'arch-btn-primary' : 'arch-btn-ghost'
                  }`}
                >
                  Recurring Weekly Class
                </button>
              </div>

              {/* Title */}
              <div>
                <label className="block font-mono text-[10px] uppercase mb-1" style={{ color: 'var(--ink-muted)' }}>
                  TITLE
                </label>
                <input
                  type="text"
                  autoFocus
                  value={formTitle}
                  onChange={(e) => {
                    setFormTitle(e.target.value);
                    setFormError('');
                  }}
                  placeholder={
                    formKind === 'class'
                      ? 'e.g., CS-301 Operating Systems Lecture'
                      : 'e.g., Solve 2 Graph Problems / Project Sprint'
                  }
                  className="w-full arch-input rounded-md px-3 py-2 text-xs font-mono"
                />
              </div>

              {/* Category / Color Tag */}
              <div>
                <label className="block font-mono text-[10px] uppercase mb-1.5" style={{ color: 'var(--ink-muted)' }}>
                  CATEGORY &amp; COLOR TAG
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {DAYFLOW_CATEGORIES.map((cat) => {
                    const active = formCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormCategory(cat.id)}
                        className="px-2.5 py-1.5 rounded-md border text-left font-mono text-[11px] flex items-center gap-2 transition"
                        style={{
                          borderColor: active ? cat.color : 'var(--border-hairline)',
                          backgroundColor: active ? cat.bgSoft : 'var(--bg-canvas)',
                          color: 'var(--ink-primary)',
                        }}
                      >
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date (for Task) + Start Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formKind === 'task' && (
                  <div>
                    <label className="block font-mono text-[10px] uppercase mb-1" style={{ color: 'var(--ink-muted)' }}>
                      DATE
                    </label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full arch-input rounded-md px-3 py-2 text-xs font-mono"
                    />
                  </div>
                )}
                <div className={formKind === 'class' ? 'sm:col-span-2' : ''}>
                  <label className="block font-mono text-[10px] uppercase mb-1" style={{ color: 'var(--ink-muted)' }}>
                    START TIME
                  </label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full arch-input rounded-md px-3 py-2 text-xs font-mono tabular-nums"
                  />
                </div>
              </div>

              {/* Duration Presets */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-mono text-[10px] uppercase" style={{ color: 'var(--ink-muted)' }}>
                    DURATION ({formatDurationCompact(formDuration)})
                  </label>
                  {formGapMaxMin && formGapMaxMin > 0 && (
                    <button
                      type="button"
                      onClick={() => setFormDuration(formGapMaxMin)}
                      className="font-mono text-[10px] underline"
                      style={{ color: 'var(--status-ok)' }}
                    >
                      Fill Full Gap ({formatDurationCompact(formGapMaxMin)})
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {DURATION_PRESETS.map((p) => (
                    <button
                      key={p.min}
                      type="button"
                      onClick={() => setFormDuration(p.min)}
                      className={`px-2.5 py-1 rounded text-xs font-mono tabular-nums border ${
                        formDuration === p.min ? 'arch-btn-primary' : 'arch-btn-ghost'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                  <input
                    type="number"
                    min="10"
                    max="720"
                    step="5"
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    aria-label="Custom duration in minutes"
                    className="w-20 arch-input rounded px-2 py-1 text-xs font-mono tabular-nums"
                  />
                  <span className="font-mono text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                    min
                  </span>
                </div>
              </div>

              {/* Repeat Days (Mon–Sun Checkboxes for Weekly Class) */}
              {formKind === 'class' && (
                <div>
                  <label className="block font-mono text-[10px] uppercase mb-1.5" style={{ color: 'var(--ink-muted)' }}>
                    REPEAT DAYS (WEEKLY TIMETABLE)
                  </label>
                  <div className="grid grid-cols-7 gap-1.5">
                    {WEEKDAY_BUTTONS.map((w) => {
                      const active = formRepeatDays.includes(w.iso);
                      return (
                        <button
                          key={w.iso}
                          type="button"
                          onClick={() =>
                            setFormRepeatDays((prev) =>
                              prev.includes(w.iso) ? prev.filter((d) => d !== w.iso) : [...prev, w.iso]
                            )
                          }
                          className={`py-2 rounded-md font-mono text-xs border transition ${
                            active ? 'arch-btn-primary' : 'arch-btn-ghost'
                          }`}
                        >
                          {w.short}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Room / Location / Note */}
              <div>
                <label className="block font-mono text-[10px] uppercase mb-1" style={{ color: 'var(--ink-muted)' }}>
                  ROOM / CONTEXT NOTE (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={formRoomOrNote}
                  onChange={(e) => setFormRoomOrNote(e.target.value)}
                  placeholder="e.g., Room LH-204 / Lab 3 / Chapter 4"
                  className="w-full arch-input rounded-md px-3 py-2 text-xs font-mono"
                />
              </div>

              {formError && (
                <div className="text-xs font-mono" style={{ color: 'var(--status-err)' }}>
                  {formError}
                </div>
              )}

              <div className="flex items-center justify-between gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-hairline)' }}>
                {editingId ? (
                  <button
                    type="button"
                    onClick={handleDeleteFromModal}
                    className="arch-btn-ghost px-3 py-2 rounded-md text-xs font-mono"
                    style={{ color: 'var(--status-err)' }}
                  >
                    Delete Block
                  </button>
                ) : (
                  <div />
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="arch-btn-ghost px-3.5 py-2 rounded-md text-xs font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="arch-btn-primary px-4 py-2 rounded-md text-xs font-mono font-semibold"
                  >
                    {editingId ? 'Save Changes' : 'Add to Timeline'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. CONFIGURE TIMETABLE & WAKING HOURS MODAL */}
      {configModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setConfigModalOpen(false)}
        >
          <div
            className="arch-panel rounded-xl w-full max-w-lg p-5 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-hairline)' }}>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest block" style={{ color: 'var(--ink-muted)' }}>
                  DAYFLOW CONFIGURATION
                </span>
                <h3 className="text-base font-semibold">Waking Hours &amp; Recurring Classes</h3>
              </div>
              <button
                type="button"
                onClick={() => setConfigModalOpen(false)}
                className="arch-btn-ghost px-2.5 py-1 rounded text-xs font-mono"
              >
                ESC
              </button>
            </div>

            <form onSubmit={saveWakingHoursConfig} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase mb-1" style={{ color: 'var(--ink-muted)' }}>
                    DAY START HOUR (0–22)
                  </label>
                  <select
                    value={draftWakeStart}
                    onChange={(e) => setDraftWakeStart(Number(e.target.value))}
                    className="w-full arch-input rounded-md px-3 py-2 text-xs font-mono"
                  >
                    {Array.from({ length: 16 }).map((_, idx) => {
                      const h = idx + 4; // 4 AM to 7 PM
                      return (
                        <option key={h} value={h}>
                          {formatTime12h(`${h}:00`)} ({String(h).padStart(2, '0')}:00)
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase mb-1" style={{ color: 'var(--ink-muted)' }}>
                    DAY END HOUR (1–24)
                  </label>
                  <select
                    value={draftWakeEnd}
                    onChange={(e) => setDraftWakeEnd(Number(e.target.value))}
                    className="w-full arch-input rounded-md px-3 py-2 text-xs font-mono"
                  >
                    {Array.from({ length: 12 }).map((_, idx) => {
                      const h = idx + 13; // 1 PM to Midnight (24)
                      return (
                        <option key={h} value={h}>
                          {h === 24 ? '12:00 AM (Midnight)' : `${formatTime12h(`${h}:00`)} (${h}:00)`}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full arch-btn-primary py-2 rounded-md text-xs font-mono font-semibold"
              >
                Save Waking Hours
              </button>
            </form>

            {/* Manage Recurring Weekly Classes List */}
            <div className="pt-3 border-t space-y-2.5" style={{ borderColor: 'var(--border-hairline)' }}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase" style={{ color: 'var(--ink-muted)' }}>
                  RECURRING WEEKLY CLASSES ({state.recurringClasses.length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setConfigModalOpen(false);
                    openQuickAdd({ kind: 'class', dateKey: selectedDateKey });
                  }}
                  className="arch-btn-ghost px-2.5 py-1 rounded text-[11px] font-mono"
                >
                  + New Class
                </button>
              </div>

              {state.recurringClasses.length === 0 ? (
                <div className="p-3 rounded border border-dashed text-center font-mono text-xs" style={{ color: 'var(--ink-muted)' }}>
                  No recurring weekly classes configured yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {state.recurringClasses.map((cls) => {
                    const cat = getCategoryMeta(cls.category);
                    const daysLabel = WEEKDAY_BUTTONS.filter((w) => cls.repeatDays.includes(w.iso))
                      .map((w) => w.short)
                      .join(', ');
                    return (
                      <div
                        key={cls.id}
                        className="p-2.5 rounded-lg border flex items-center justify-between gap-2 text-xs"
                        style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-hairline)' }}
                      >
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span>{cls.title}</span>
                          </div>
                          <div className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--ink-muted)' }}>
                            {daysLabel} &bull; {formatTime12h(cls.startTime)} ({formatDurationCompact(cls.durationMin)})
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setState((prev) => ({
                              ...prev,
                              recurringClasses: prev.recurringClasses.filter((c) => c.id !== cls.id),
                            }))
                          }
                          className="arch-btn-ghost px-2 py-1 rounded text-[10px] font-mono"
                          style={{ color: 'var(--status-err)' }}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
