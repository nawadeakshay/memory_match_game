import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Card } from '../game/types';
import { spacing } from '../theme/spacing';
import { CardVisualState, MemoryCard } from './MemoryCard';

export interface GameBoardProps {
  cards: Card[];
  columns: number;
  isBoardLocked: boolean;
  onSelectCard: (cardId: number) => void;
}

const GAP = spacing.sm;

export function GameBoard({ cards, columns, isBoardLocked, onSelectCard }: GameBoardProps) {
  // Measured via onLayout rather than derived from window width, so the grid is
  // correct regardless of whatever padding the parent screen happens to apply.
  const [boardWidth, setBoardWidth] = useState(0);
  const cardSize = boardWidth > 0 ? (boardWidth - GAP * (columns - 1)) / columns : 0;

  const handleLayout = (event: LayoutChangeEvent) => {
    setBoardWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.board} onLayout={handleLayout}>
      {cardSize > 0 &&
        cards.map((card) => (
          <View key={card.id} style={{ width: cardSize, height: cardSize, marginBottom: GAP }}>
            <MemoryCard
              symbol={card.symbol}
              visualState={getVisualState(card, isBoardLocked)}
              size={cardSize}
              onPress={() => onSelectCard(card.id)}
            />
          </View>
        ))}
    </View>
  );
}

function getVisualState(card: Card, isBoardLocked: boolean): CardVisualState {
  if (card.state === 'matched') return 'matched';
  if (card.state === 'faceUp') return isBoardLocked ? 'mismatch' : 'faceUp';
  return isBoardLocked ? 'locked' : 'hidden';
}

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
