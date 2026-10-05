"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

// La progression vit dans le navigateur (localStorage) : le site est statique,
// il n'y a pas de serveur ni de base de données.
export type Attempt = { score: number; totalQ: number; at: number };
export type ProgressMap = Record<string, Attempt>;

const PROGRESS_KEY = "certprep-progress-v1";
const WEEKS_KEY = "certprep-weeks-v1";
export const PASS_RATIO = 0.7;

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // stockage indisponible (navigation privée) : on ignore
  }
  listeners.forEach((l) => l());
}

function useStored<T>(key: string, fallback: T): T {
  const raw = useSyncExternalStore(subscribe, () => read(key), () => null);
  return useMemo(() => {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }, [raw, fallback]);
}

const EMPTY_PROGRESS: ProgressMap = {};
const EMPTY_WEEKS: string[] = [];

export function useProgress(): ProgressMap {
  return useStored(PROGRESS_KEY, EMPTY_PROGRESS);
}

export function saveAttempt(unitSlug: string, score: number, totalQ: number) {
  let current: ProgressMap = {};
  try {
    current = JSON.parse(read(PROGRESS_KEY) ?? "{}") as ProgressMap;
  } catch {
    // données corrompues : on repart d'un objet vide
  }
  write(PROGRESS_KEY, { ...current, [unitSlug]: { score, totalQ, at: Date.now() } });
}

export function isDone(a: Attempt | undefined): boolean {
  return !!a && a.totalQ > 0 && a.score / a.totalQ >= PASS_RATIO;
}

export function pctOf(a: Attempt | undefined): number | null {
  return a && a.totalQ > 0 ? Math.round((a.score / a.totalQ) * 100) : null;
}

export function useWeeksDone(): [string[], (id: string) => void] {
  const weeks = useStored(WEEKS_KEY, EMPTY_WEEKS);
  const toggle = useCallback(
    (id: string) => write(WEEKS_KEY, weeks.includes(id) ? weeks.filter((w) => w !== id) : [...weeks, id]),
    [weeks]
  );
  return [weeks, toggle];
}

export function resetAll() {
  try {
    window.localStorage.removeItem(PROGRESS_KEY);
    window.localStorage.removeItem(WEEKS_KEY);
  } catch {
    // rien à effacer
  }
  listeners.forEach((l) => l());
}
