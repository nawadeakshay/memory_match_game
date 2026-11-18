import { createContext, ReactNode, useCallback, useContext, useMemo } from 'react';
import { usePersistentState } from '../services/storage';

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

/** Best time and fewest moves for a difficulty, tracked independently (they may come from different games). */
export interface BestResult {
  seconds: number;
  moves: number;
}

export interface NewBests {
  time: boolean;
  moves: boolean;
}

interface GameSettingsContextValue {
  difficulty: Difficulty;
  difficultyConfig: DifficultyConfig;
  setDifficulty: (difficulty: Difficulty) => void;
  cycleDifficulty: () => void;
  timeLimitSec: number;
  cycleTimeLimit: () => void;
  bestResults: Record<Difficulty, BestResult | null>;
  /** Saves a finished game and reports which personal bests it beat. */
  recordResult: (difficulty: Difficulty, result: BestResult) => NewBests;
  resetStatistics: () => void;
}

const GameSettingsContext = createContext<GameSettingsContextValue | null>(null);

function findDifficultyConfig(difficulty: Difficulty): DifficultyConfig {
  // DIFFICULTIES always contains every Difficulty value, so this lookup cannot fail.
  return DIFFICULTIES.find((config) => config.id === difficulty)!;
}

type BestResults = Record<Difficulty, BestResult | null>;

const EMPTY_BEST_RESULTS: BestResults = { easy: null, medium: null, hard: null };

export const STORAGE_KEYS = {
  difficulty: 'memoryMatch.difficulty',
  timeLimit: 'memoryMatch.timeLimitSec',
  bestResults: 'memoryMatch.bestResults',
} as const;

function isDifficulty(value: unknown): value is Difficulty {
  return DIFFICULTIES.some((config) => config.id === value);
}

function isTimeLimit(value: unknown): value is number {
  return TIME_LIMIT_OPTIONS.includes(value as (typeof TIME_LIMIT_OPTIONS)[number]);
}

function isBestResult(value: unknown): value is BestResult {
  if (typeof value !== 'object' || value === null) return false;
  const { seconds, moves } = value as Record<string, unknown>;
  return typeof seconds === 'number' && seconds >= 0 && typeof moves === 'number' && moves >= 0;
}

function isBestResults(value: unknown): value is BestResults {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return DIFFICULTIES.every(({ id }) => record[id] === null || isBestResult(record[id]));
}

export function GameSettingsProvider({ children }: { children: ReactNode }) {
  const [difficulty, setDifficulty] = usePersistentState<Difficulty>(STORAGE_KEYS.difficulty, 'medium', isDifficulty);
  const [timeLimitSec, setTimeLimitSec] = usePersistentState<number>(STORAGE_KEYS.timeLimit, 0, isTimeLimit);
  const [bestResults, setBestResults] = usePersistentState<BestResults>(
    STORAGE_KEYS.bestResults,
    EMPTY_BEST_RESULTS,
    isBestResults
  );

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

  const recordResult = useCallback(
    (forDifficulty: Difficulty, result: BestResult): NewBests => {
      const existing = bestResults[forDifficulty];
      const newBests: NewBests = {
        time: !existing || result.seconds < existing.seconds,
        moves: !existing || result.moves < existing.moves,
      };
      if (newBests.time || newBests.moves) {
        setBestResults((current) => {
          const previous = current[forDifficulty];
          return {
            ...current,
            [forDifficulty]: previous
              ? { seconds: Math.min(previous.seconds, result.seconds), moves: Math.min(previous.moves, result.moves) }
              : result,
          };
        });
      }
      return newBests;
    },
    [bestResults, setBestResults]
  );

  const resetStatistics = useCallback(() => {
    setBestResults(EMPTY_BEST_RESULTS);
  }, [setBestResults]);

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
