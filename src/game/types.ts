export type CardState = 'hidden' | 'faceUp' | 'matched';

export interface Card {
  id: number;
  symbol: string;
  state: CardState;
}

export type GameStatus = 'playing' | 'won';

export interface GameState {
  cards: Card[];
  status: GameStatus;
  moves: number;
  /** Ids of the currently face-up, not-yet-matched cards (0, 1, or 2). */
  selectedIds: number[];
  matchedPairs: number;
  totalPairs: number;
}
