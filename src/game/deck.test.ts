import { generateDeck, SYMBOLS } from './deck';

describe('generateDeck', () => {
  it('returns two cards per pair requested', () => {
    const deck = generateDeck(8);
    expect(deck).toHaveLength(16);
  });

  it('creates every symbol exactly twice', () => {
    const deck = generateDeck(8);
    const counts = new Map<string, number>();
    deck.forEach((card) => counts.set(card.symbol, (counts.get(card.symbol) ?? 0) + 1));

    expect(counts.size).toBe(8);
    counts.forEach((count) => expect(count).toBe(2));
  });

  it('assigns unique ids to every card', () => {
    const deck = generateDeck(8);
    const ids = new Set(deck.map((card) => card.id));
    expect(ids.size).toBe(deck.length);
  });

  it('starts every card hidden', () => {
    const deck = generateDeck(8);
    expect(deck.every((card) => card.state === 'hidden')).toBe(true);
  });

  it('shuffles the deck instead of returning pairs in creation order', () => {
    // A fixed "random" source makes the Fisher-Yates pass deterministic, so we can
    // assert the exact resulting order instead of relying on statistical chance.
    const deck = generateDeck(2, () => 0);
    expect(deck.map((card) => card.id)).toEqual([1, 2, 3, 0]);
  });

  it('throws when more pairs are requested than symbols exist', () => {
    expect(() => generateDeck(SYMBOLS.length + 1)).toThrow();
  });

  it('does not mutate the shared SYMBOLS list', () => {
    const before = [...SYMBOLS];
    generateDeck(8);
    expect(SYMBOLS).toEqual(before);
  });
});
