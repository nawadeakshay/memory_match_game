import { Card } from './types';

// Centralized so the visual theme can be swapped without touching game logic.
// Plain geometric shape glyphs (no illustrations, no image assets) — ordered so the
// first 6/8/12 entries each read as visually distinct for the Easy/Medium/Hard grids.
export const SYMBOLS = [
  '🔵', // blue circle
  '🟧', // orange square
  '🟣', // purple circle
  '🔷', // blue diamond
  '🟡', // yellow circle
  '🟪', // purple square
  '⚫', // black circle
  '🔶', // orange diamond
  '🟦', // blue square
  '🟨', // yellow square
  '🟠', // orange circle
  '🟫', // brown square
];

function shuffle(cards: Card[], random: () => number): Card[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Builds a shuffled deck of `pairCount` matching pairs.
 * `random` is injectable so tests can produce a deterministic shuffle.
 */
export function generateDeck(pairCount: number, random: () => number = Math.random): Card[] {
  if (pairCount > SYMBOLS.length) {
    throw new Error(`Cannot generate ${pairCount} pairs: only ${SYMBOLS.length} symbols are available.`);
  }

  const pairs: Card[] = SYMBOLS.slice(0, pairCount).flatMap((symbol, index) => [
    { id: index * 2, symbol, state: 'hidden' as const },
    { id: index * 2 + 1, symbol, state: 'hidden' as const },
  ]);

  return shuffle(pairs, random);
}
