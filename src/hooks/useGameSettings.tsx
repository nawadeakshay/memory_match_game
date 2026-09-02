import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  id: Difficulty;
  label: string;
  columns: number;
  rows: number;
  pairCount: number;
}

// All presets use 4 columns so the board's column math stays identical across
// difficulties — only the row count (and therefore pair count) changes.
export const DIFFICULTIES: DifficultyConfig[] = [
  { id: 'easy', label: 'Easy', columns: 4, rows: 3, pairCount: 6 },
  { id: 'medium', label: 'Medium', columns: 4, rows: 4, pairCount: 8 },
  { id: 'hard', label: 'Hard', columns: 4, rows: 6, pairCount: 12 },
];

/** Seconds allowed per game; 0 means no limit. */
export const TIME_LIMIT_OPTIONS = [0, 60, 90, 120, 180] as const;

export interface BestResult {
  seconds: number;
  moves: number;
}

interface GameSettingsContextValue {
  difficulty: Difficulty;
  difficultyConfig: DifficultyConfig;
  setDifficulty: (difficulty: Difficulty) => void;
  cycleDifficulty: () => void;
  timeLimitSec: number;
  cycleTimeLimit: () => void;
  bestResults: Record<Difficulty, BestResult | null>;
  recordResult: (difficulty: Difficulty, result: BestResult) => void;
  resetStatistics: () => void;
}

const GameSettingsContext = createContext<GameSettingsContextValue | null>(null);

function findDifficultyConfig(difficulty: Difficulty): DifficultyConfig {
  // DIFFICULTIES always contains every Difficulty value, so this lookup cannot fail.
  return DIFFICULTIES.find((config) => config.id === difficulty)!;
}

export function GameSettingsProvider({ children }: { children: ReactNode }) {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [timeLimitSec, setTimeLimitSec] = useState<number>(0);
  const [bestResults, setBestResults] = useState<Record<Difficulty, BestResult | null>>({
    easy: null,
    medium: null,
    hard: null,
  });

  const cycleDifficulty = useCallback(() => {
    setDifficulty((current) => {
      const index = DIFFICULTIES.findIndex((config) => config.id === current);
      return DIFFICULTIES[(index + 1) % DIFFICULTIES.length].id;
    });
  }, []);

  const cycleTimeLimit = useCallback(() => {
    setTimeLimitSec((current) => {
      const index = TIME_LIMIT_OPTIONS.indexOf(current as (typeof TIME_LIMIT_OPTIONS)[number]);
      const nextIndex = index === -1 ? 0 : (index + 1) % TIME_LIMIT_OPTIONS.length;
      return TIME_LIMIT_OPTIONS[nextIndex];
    });
  }, []);

  const recordResult = useCallback((forDifficulty: Difficulty, result: BestResult) => {
    setBestResults((current) => {
      const existing = current[forDifficulty];
      const isBetter = !existing || result.seconds < existing.seconds;
      return isBetter ? { ...current, [forDifficulty]: result } : current;
    });
  }, []);

  const resetStatistics = useCallback(() => {
    setBestResults({ easy: null, medium: null, hard: null });
  }, []);

  const value = useMemo<GameSettingsContextValue>(
    () => ({
      difficulty,
      difficultyConfig: findDifficultyConfig(difficulty),
      setDifficulty,
      cycleDifficulty,
      timeLimitSec,
      cycleTimeLimit,
      bestResults,
      recordResult,
      resetStatistics,
    }),
    [difficulty, cycleDifficulty, timeLimitSec, cycleTimeLimit, bestResults, recordResult, resetStatistics]
  );

  return <GameSettingsContext.Provider value={value}>{children}</GameSettingsContext.Provider>;
}

export function useGameSettings(): GameSettingsContextValue {
  const context = useContext(GameSettingsContext);
  if (!context) {
    throw new Error('useGameSettings must be used within a GameSettingsProvider');
  }
  return context;
}
