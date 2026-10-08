"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

// La progression vit dans le navigateur (localStorage) : le site est statique,
// il n'y a pas de serveur ni de base de données.
export type Attempt = { score: number; totalQ: number; at: number };
export type ProgressMap = Record<string, Attempt>;

const PROGRESS_KEY = "certprep-progress-v1";
const TASKS_KEY = "certprep-tasks-v1";
const CERT_KEY = "certprep-cert-v1";
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
const EMPTY_TASKS: string[] = [];

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

// Certification affichée (onglet choisi sur l'accueil et le plan)
export function useCertCode(fallback: string): [string, (code: string) => void] {
  const code = useStored(CERT_KEY, fallback);
  return [code, (c: string) => write(CERT_KEY, c)];
}

// Tâches du plan cochées à la main, identifiées par "<certif>:<semaine>-<index>" (ex. "AI-103:S1-0")
export function useTasksDone(): [string[], (id: string) => void] {
  const tasks = useStored(TASKS_KEY, EMPTY_TASKS);
  const toggle = useCallback(
    (id: string) => write(TASKS_KEY, tasks.includes(id) ? tasks.filter((t) => t !== id) : [...tasks, id]),
    [tasks]
  );
  return [tasks, toggle];
}

export function resetAll() {
  try {
    window.localStorage.removeItem(PROGRESS_KEY);
    window.localStorage.removeItem(TASKS_KEY);
  } catch {
    // rien à effacer
  }
  listeners.forEach((l) => l());
}
