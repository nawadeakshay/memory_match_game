import { GameState, GameStatus } from './types';
import { generateDeck } from './deck';

const CARDS_PER_TURN = 2;

export function createGame(pairCount: number, random?: () => number): GameState {
  return {
    cards: generateDeck(pairCount, random),
    status: 'playing',
    moves: 0,
    selectedIds: [],
    matchedPairs: 0,
    totalPairs: pairCount,
  };
}

export function restartGame(state: GameState, random?: () => number): GameState {
  return createGame(state.totalPairs, random);
}

export function selectCard(state: GameState, cardId: number): GameState {
  if (state.status !== 'playing') return state;
  if (state.selectedIds.length >= CARDS_PER_TURN) return state; // locked while a mismatch resolves

  const card = state.cards.find((c) => c.id === cardId);
  if (!card || card.state !== 'hidden') return state;

  const cards = state.cards.map((c) => (c.id === cardId ? { ...c, state: 'faceUp' as const } : c));
  const selectedIds = [...state.selectedIds, cardId];

  if (selectedIds.length < CARDS_PER_TURN) {
    return { ...state, cards, selectedIds };
  }

  return evaluateTurn({ ...state, cards, selectedIds });
}

function evaluateTurn(state: GameState): GameState {
  const [firstId, secondId] = state.selectedIds;
  // selectedIds are only ever populated from ids that exist in `cards`, so these are safe.
  const first = state.cards.find((c) => c.id === firstId)!;
  const second = state.cards.find((c) => c.id === secondId)!;
  const moves = state.moves + 1;

  if (first.symbol !== second.symbol) {
    // Cards stay face-up and selected; the UI layer calls resolveMismatch after a delay.
    return { ...state, moves };
  }

  const cards = state.cards.map((c) =>
    c.id === firstId || c.id === secondId ? { ...c, state: 'matched' as const } : c
  );
  const matchedPairs = state.matchedPairs + 1;
  const status: GameStatus = matchedPairs === state.totalPairs ? 'won' : 'playing';

  return { ...state, cards, selectedIds: [], moves, matchedPairs, status };
}

export function resolveMismatch(state: GameState): GameState {
  if (state.selectedIds.length !== CARDS_PER_TURN) return state;

  const cards = state.cards.map((c) =>
    state.selectedIds.includes(c.id) ? { ...c, state: 'hidden' as const } : c
  );
  return { ...state, cards, selectedIds: [] };
}
