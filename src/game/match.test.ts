import { createGame, restartGame, resolveMismatch, selectCard } from './match';
import { GameState } from './types';

// A fixed "random" source makes createGame produce a known layout: ids [1, 2, 3, 0],
// where id1/id0 share one symbol and id2/id3 share another (see deck.test.ts).
const fixedRandom = () => 0;
const newGame = () => createGame(2, fixedRandom);

describe('selectCard', () => {
  it('flips a hidden card face-up and tracks it as selected', () => {
    const state = selectCard(newGame(), 1);
    const card = state.cards.find((c) => c.id === 1)!;

    expect(card.state).toBe('faceUp');
    expect(state.selectedIds).toEqual([1]);
  });

  it('does nothing when selecting an already matched card', () => {
    const matched = selectCard(selectCard(newGame(), 1), 0); // completes the first pair
    const result = selectCard(matched, 1);

    expect(result).toBe(matched);
  });

  it('does nothing when selecting the same card twice', () => {
    const oneSelected = selectCard(newGame(), 1);
    const result = selectCard(oneSelected, 1);

    expect(result).toBe(oneSelected);
  });

  it('marks two matching cards as matched and clears the selection', () => {
    const result = selectCard(selectCard(newGame(), 1), 0);

    expect(result.cards.find((c) => c.id === 1)!.state).toBe('matched');
    expect(result.cards.find((c) => c.id === 0)!.state).toBe('matched');
    expect(result.selectedIds).toEqual([]);
    expect(result.matchedPairs).toBe(1);
    expect(result.moves).toBe(1);
  });

  it('leaves two non-matching cards face-up and selected, awaiting resolution', () => {
    const result = selectCard(selectCard(newGame(), 1), 2);

    expect(result.cards.find((c) => c.id === 1)!.state).toBe('faceUp');
    expect(result.cards.find((c) => c.id === 2)!.state).toBe('faceUp');
    expect(result.selectedIds).toEqual([1, 2]);
    expect(result.moves).toBe(1);
  });

  it('prevents selecting a third card while a mismatch is awaiting resolution', () => {
    const mismatched = selectCard(selectCard(newGame(), 1), 2);
    const result = selectCard(mismatched, 3);

    expect(result).toBe(mismatched);
    expect(result.cards.find((c) => c.id === 3)!.state).toBe('hidden');
  });

  it('detects a win once every pair has been matched', () => {
    let state = newGame();
    state = selectCard(selectCard(state, 1), 0); // first pair
    state = selectCard(selectCard(state, 2), 3); // second pair

    expect(state.status).toBe('won');
    expect(state.matchedPairs).toBe(2);
    expect(state.moves).toBe(2);
  });

  it('ignores an unknown card id', () => {
    const before = newGame();
    const result = selectCard(before, 9999);

    expect(result).toBe(before);
  });

  it('ignores further selections once the game is won', () => {
    const wonState: GameState = { ...newGame(), status: 'won' };
    const result = selectCard(wonState, 1);

    expect(result).toBe(wonState);
  });
});

describe('resolveMismatch', () => {
  it('flips both unresolved cards back to hidden', () => {
    const mismatched = selectCard(selectCard(newGame(), 1), 2);
    const result = resolveMismatch(mismatched);

    expect(result.cards.find((c) => c.id === 1)!.state).toBe('hidden');
    expect(result.cards.find((c) => c.id === 2)!.state).toBe('hidden');
    expect(result.selectedIds).toEqual([]);
  });

  it('does nothing when there is no pending mismatch', () => {
    const state = newGame();
    expect(resolveMismatch(state)).toBe(state);
  });
});

describe('restartGame', () => {
  it('produces a fresh game with the same pair count', () => {
    const played = selectCard(selectCard(newGame(), 1), 0);
    const restarted = restartGame(played, fixedRandom);

    expect(restarted.cards).not.toBe(played.cards);
    expect(restarted.moves).toBe(0);
    expect(restarted.matchedPairs).toBe(0);
    expect(restarted.selectedIds).toEqual([]);
    expect(restarted.status).toBe('playing');
    expect(restarted.totalPairs).toBe(played.totalPairs);
    expect(restarted.cards.every((c) => c.state === 'hidden')).toBe(true);
  });
});
