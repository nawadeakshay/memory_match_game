import { act, renderHook } from '@testing-library/react-native';
import { Card } from '../game/types';
import { useGame, UseGameOptions } from './useGame';

// Deck ids are always paired as (0,1), (2,3), (4,5)... regardless of shuffle order,
// because shuffling only reorders array positions, not the id-to-symbol mapping
// assigned at deck creation (see deck.ts). Tests rely on that invariant instead of
// needing to inject a fixed random source.
const findCard = (cards: Card[], id: number) => cards.find((c) => c.id === id)!;

describe('useGame', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initializes a fresh game at the requested pair count', async () => {
    const { result } = await renderHook(() => useGame({ pairCount: 8 }));

    expect(result.current.cards).toHaveLength(16);
    expect(result.current.status).toBe('playing');
    expect(result.current.moves).toBe(0);
    expect(result.current.matchedPairs).toBe(0);
    expect(result.current.totalPairs).toBe(8);
    expect(result.current.seconds).toBe(0);
    expect(result.current.timeLimitSec).toBe(0);
    expect(result.current.isBoardLocked).toBe(false);
  });

  it('flips a card face-up on selection', async () => {
    const { result } = await renderHook(() => useGame({ pairCount: 8 }));

    await act(async () => result.current.selectCard(0));

    expect(findCard(result.current.cards, 0).state).toBe('faceUp');
  });

  it('matches a pair immediately with no delay', async () => {
    const { result } = await renderHook(() => useGame({ pairCount: 8 }));

    await act(async () => {
      result.current.selectCard(0);
      result.current.selectCard(1);
    });

    expect(findCard(result.current.cards, 0).state).toBe('matched');
    expect(findCard(result.current.cards, 1).state).toBe('matched');
    expect(result.current.matchedPairs).toBe(1);
    expect(result.current.moves).toBe(1);
    expect(result.current.isBoardLocked).toBe(false);
  });

  it('lets the game continue normally after a match: the matched pair stays matched and other cards remain selectable', async () => {
    const { result } = await renderHook(() => useGame({ pairCount: 8 }));

    // First pair: match.
    await act(async () => {
      result.current.selectCard(0);
      result.current.selectCard(1);
    });
    expect(result.current.matchedPairs).toBe(1);
    expect(result.current.moves).toBe(1);
    expect(result.current.isBoardLocked).toBe(false);

    // The board must still accept new taps on the untouched cards.
    await act(async () => result.current.selectCard(2));
    expect(findCard(result.current.cards, 2).state).toBe('faceUp');
    // The already-matched pair is untouched by this new selection.
    expect(findCard(result.current.cards, 0).state).toBe('matched');
    expect(findCard(result.current.cards, 1).state).toBe('matched');

    // Completing a second pair progresses matchedPairs/moves further, proving
    // play continues rather than the board getting stuck after the first match.
    await act(async () => result.current.selectCard(3));
    expect(result.current.matchedPairs).toBe(2);
    expect(result.current.moves).toBe(2);
    expect(result.current.status).toBe('playing');
  });

  it('locks the board while a mismatch is awaiting resolution', async () => {
    const { result } = await renderHook(() => useGame({ pairCount: 8 }));

    await act(async () => {
      result.current.selectCard(0);
      result.current.selectCard(2);
    });

    expect(result.current.isBoardLocked).toBe(true);
    expect(findCard(result.current.cards, 0).state).toBe('faceUp');
    expect(findCard(result.current.cards, 2).state).toBe('faceUp');

    await act(async () => {
      jest.advanceTimersByTime(700);
    });

    expect(result.current.isBoardLocked).toBe(false);
    expect(findCard(result.current.cards, 0).state).toBe('hidden');
    expect(findCard(result.current.cards, 2).state).toBe('hidden');
  });

  it('ignores a third tap while a mismatch is still resolving', async () => {
    const { result } = await renderHook(() => useGame({ pairCount: 8 }));

    await act(async () => {
      result.current.selectCard(0);
      result.current.selectCard(2);
    });
    await act(async () => {
      result.current.selectCard(4); // tapped before the 700ms flip-back timer fires
    });

    expect(findCard(result.current.cards, 4).state).toBe('hidden');

    await act(async () => {
      jest.advanceTimersByTime(700);
    });

    expect(findCard(result.current.cards, 0).state).toBe('hidden');
    expect(findCard(result.current.cards, 2).state).toBe('hidden');
    expect(findCard(result.current.cards, 4).state).toBe('hidden');
  });

  it('ticks the timer once per second while playing', async () => {
    const { result } = await renderHook(() => useGame({ pairCount: 8 }));

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.seconds).toBe(3);
  });

  it('stops the timer once the game is won', async () => {
    const { result } = await renderHook(() => useGame({ pairCount: 8 }));
    const pairs: [number, number][] = [
      [0, 1],
      [2, 3],
      [4, 5],
      [6, 7],
      [8, 9],
      [10, 11],
      [12, 13],
      [14, 15],
    ];

    for (const [a, b] of pairs) {
      await act(async () => {
        result.current.selectCard(a);
        result.current.selectCard(b);
      });
    }

    expect(result.current.status).toBe('won');
    expect(result.current.matchedPairs).toBe(8);
    const secondsAtWin = result.current.seconds;

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.seconds).toBe(secondsAtWin);
  });

  it('restart deals a fresh board and resets moves, matches, and the timer', async () => {
    const { result } = await renderHook(() => useGame({ pairCount: 8 }));

    await act(async () => {
      result.current.selectCard(0);
      result.current.selectCard(1);
    });
    await act(async () => {
      jest.advanceTimersByTime(4000);
    });
    expect(result.current.moves).toBe(1);
    expect(result.current.seconds).toBe(4);

    await act(async () => result.current.restart());

    expect(result.current.status).toBe('playing');
    expect(result.current.moves).toBe(0);
    expect(result.current.matchedPairs).toBe(0);
    expect(result.current.seconds).toBe(0);
    expect(result.current.cards.every((c) => c.state === 'hidden')).toBe(true);
  });

  it('restarting mid-mismatch cancels the pending flip-back so it cannot corrupt the new game', async () => {
    const { result } = await renderHook(() => useGame({ pairCount: 8 }));

    await act(async () => {
      result.current.selectCard(0);
      result.current.selectCard(2); // mismatch now pending, 700ms flip-back scheduled
    });

    await act(async () => result.current.restart());
    const movesAfterRestart = result.current.moves;

    await act(async () => {
      jest.advanceTimersByTime(1000); // past the original delay
    });

    expect(result.current.moves).toBe(movesAfterRestart);
    expect(result.current.status).toBe('playing');
  });

  it('clears the pending mismatch timeout on unmount', async () => {
    const clearSpy = jest.spyOn(global, 'clearTimeout');
    const { result, unmount } = await renderHook(() => useGame({ pairCount: 8 }));

    await act(async () => {
      result.current.selectCard(0);
      result.current.selectCard(2);
    });

    await unmount();

    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });

  it('ends the game in "timeUp" once the time limit elapses, and blocks further taps', async () => {
    const { result } = await renderHook(() => useGame({ pairCount: 8, timeLimitSec: 5 }));

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });
    expect(result.current.status).toBe('timeUp');

    await act(async () => result.current.selectCard(0));
    expect(findCard(result.current.cards, 0).state).toBe('hidden');
  });

  it('does not end the game early when there is no time limit', async () => {
    const { result } = await renderHook(() => useGame({ pairCount: 8 }));

    await act(async () => {
      jest.advanceTimersByTime(600_000);
    });

    expect(result.current.status).toBe('playing');
  });

  it('restart clears a timeUp status and starts the clock over', async () => {
    const { result } = await renderHook(() => useGame({ pairCount: 8, timeLimitSec: 5 }));

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });
    expect(result.current.status).toBe('timeUp');

    await act(async () => result.current.restart());

    expect(result.current.status).toBe('playing');
    expect(result.current.seconds).toBe(0);
  });

  it('deals a differently-sized board when pairCount changes after mount', async () => {
    const { result, rerender } = await renderHook((props: UseGameOptions) => useGame(props), {
      initialProps: { pairCount: 8 },
    });
    expect(result.current.cards).toHaveLength(16);

    await act(async () => {
      await rerender({ pairCount: 6 });
    });

    expect(result.current.cards).toHaveLength(12);
    expect(result.current.totalPairs).toBe(6);
    expect(result.current.moves).toBe(0);
    expect(result.current.status).toBe('playing');
  });
});
