import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createGame,
  restartGame as restartGameLogic,
  resolveMismatch,
  selectCard as selectCardLogic,
} from '../game/match';
import { Card } from '../game/types';
import { useTimer } from './useTimer';

const MISMATCH_DELAY_MS = 700;

/** 0 (or omitted) means the game has no time limit. */
export const NO_TIME_LIMIT = 0;

export type UseGameStatus = 'playing' | 'won' | 'timeUp';

export interface UseGameOptions {
  pairCount: number;
  timeLimitSec?: number;
}

export interface UseGameResult {
  cards: Card[];
  status: UseGameStatus;
  moves: number;
  matchedPairs: number;
  totalPairs: number;
  seconds: number;
  timeLimitSec: number;
  /** True for the brief window where two mismatched cards are visible and every other card is untappable. */
  isBoardLocked: boolean;
  selectCard: (cardId: number) => void;
  restart: () => void;
}

export function useGame({ pairCount, timeLimitSec = NO_TIME_LIMIT }: UseGameOptions): UseGameResult {
  const [state, setState] = useState(() => createGame(pairCount));
  const mismatchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstPairCount = useRef(true);

  const clearPendingMismatch = useCallback(() => {
    if (mismatchTimeout.current !== null) {
      clearTimeout(mismatchTimeout.current);
      mismatchTimeout.current = null;
    }
  }, []);

  // Guarantees the pending mismatch timer never fires after this hook unmounts.
  useEffect(() => clearPendingMismatch, [clearPendingMismatch]);

  // Changing difficulty mid-session deals a fresh board at the new size. The
  // very first deck is already created by the useState initializer above, so
  // this effect only needs to react to pairCount changing after mount.
  useEffect(() => {
    if (isFirstPairCount.current) {
      isFirstPairCount.current = false;
      return;
    }
    clearPendingMismatch();
    setState(createGame(pairCount));
  }, [pairCount, clearPendingMismatch]);

  const { seconds, reset: resetTimer } = useTimer(state.status === 'playing');

  const timeUp = timeLimitSec > NO_TIME_LIMIT && state.status === 'playing' && seconds >= timeLimitSec;
  const status: UseGameStatus = state.status === 'won' ? 'won' : timeUp ? 'timeUp' : 'playing';
  const isBoardLocked = state.selectedIds.length === 2;

  const selectCard = useCallback(
    (cardId: number) => {
      if (status !== 'playing') return; // includes timeUp, which match.ts has no concept of

      setState((current) => {
        const next = selectCardLogic(current, cardId);

        // selectCardLogic returns a *new* object with two pending ids only when this
        // tap just completed a mismatched pair (a match clears selectedIds immediately,
        // and every other case is a no-op that returns the same reference). That is the
        // one moment the flip-back needs to be scheduled.
        const isNewMismatch = next !== current && next.selectedIds.length === 2;

        if (isNewMismatch) {
          clearPendingMismatch();
          mismatchTimeout.current = setTimeout(() => {
            mismatchTimeout.current = null;
            setState((latest) => resolveMismatch(latest));
          }, MISMATCH_DELAY_MS);
        }

        return next;
      });
    },
    [status, clearPendingMismatch]
  );

  const restart = useCallback(() => {
    clearPendingMismatch();
    resetTimer();
    setState((current) => restartGameLogic(current));
  }, [clearPendingMismatch, resetTimer]);

  return {
    cards: state.cards,
    status,
    moves: state.moves,
    matchedPairs: state.matchedPairs,
    totalPairs: state.totalPairs,
    seconds,
    timeLimitSec,
    isBoardLocked,
    selectCard,
    restart,
  };
}
