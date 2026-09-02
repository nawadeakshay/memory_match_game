import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Modal, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../components/AppButton';
import { Mascot } from '../components/illustrations/Mascot';
import { useGameSettings } from '../hooks/useGameSettings';
import { useTheme } from '../theme/ThemeContext';
import { radii } from '../theme/radii';
import { DECORATION_IMAGES } from '../theme/gameAssets';
import { getShadow } from '../theme/shadows';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { RootStackScreenProps } from '../types/navigation';
import { formatTime } from '../utils/formatTime';

export function HomeScreen({ navigation }: RootStackScreenProps<'Home'>) {
  const { colors, colorScheme } = useTheme();
  const { difficulty, difficultyConfig, bestResults } = useGameSettings();
  const [howToPlayVisible, setHowToPlayVisible] = useState(false);

  const bestResult = bestResults[difficulty];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <View pointerEvents="none" style={styles.blobsWrapper}>
        <Image source={DECORATION_IMAGES.blobs} style={styles.blobsImage} resizeMode="contain" accessibilityIgnoresInvertColors />
      </View>
      <View pointerEvents="none" style={styles.blobsWrapperBottom}>
        <Image source={DECORATION_IMAGES.blobs} style={styles.blobsImageBottom} resizeMode="contain" accessibilityIgnoresInvertColors />
      </View>

      <View pointerEvents="none" style={styles.goodThingsTag}>
        <Image source={DECORATION_IMAGES.rays} style={styles.raysImage} resizeMode="contain" />
        <Text style={[styles.goodThingsText, { color: colors.textSecondary }]}>Good things{'\n'}click</Text>
      </View>

      {/*
        Three weighted flexible spacers (1:2:1) instead of one fixed gap or one
        edge absorbing all leftover height. On a screen taller than the
        reference's own composition, the extra space distributes proportionally
        above the mascot, between the stat tiles and New Game, and below the
        buttons — matching the reference's rhythm at every height rather than
        concentrating the difference at a single edge.
      */}
      <View style={{ flex: 1 }} />

      <View style={styles.hero}>
        <Mascot variant="brain" size={104} />

        <Text style={[styles.title, { color: colors.textPrimary }]}>MEMORY</Text>
        <RainbowWord word="MATCH" />
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>Find every pair.</Text>
        <Text style={[styles.subTagline, { color: colors.textSecondary }]}>A sharper mind is a happier you.</Text>

        <View style={styles.bestRow}>
          <BestTile
            label="Best Time"
            value={bestResult ? formatTime(bestResult.seconds) : '—'}
            icon="trophy"
            iconColor={colors.accentYellow}
          />
          <BestTile
            label="Fewest Moves"
            value={bestResult ? `${bestResult.moves}` : '—'}
            icon="star"
            iconColor={colors.info}
          />
        </View>
      </View>

      <View style={{ flex: 2 }} />

      <View style={styles.actions}>
        <AppButton label="New Game" icon="play" onPress={() => navigation.navigate('Game')} variant="primary" />
        <View style={styles.secondaryRow}>
          <AppButton
            label="Settings"
            icon="settings-outline"
            onPress={() => navigation.navigate('Settings')}
            variant="secondary"
            style={styles.secondaryHalf}
          />
          <AppButton
            label="How to Play"
            icon="help-circle-outline"
            onPress={() => setHowToPlayVisible(true)}
            variant="secondary"
            style={styles.secondaryHalf}
          />
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <Modal visible={howToPlayVisible} animationType="fade" transparent onRequestClose={() => setHowToPlayVisible(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.card, borderColor: colors.border, ...getShadow('s3', colorScheme, colors) },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>How to Play</Text>
            <Text style={[styles.modalBody, { color: colors.textSecondary }]}>
              Tap two cards to flip them. If their symbols match, they stay face up. If not, they flip back down.
              {'\n\n'}
              Match every pair before time runs out (if a time limit is set) to win the game.
            </Text>
            <AppButton label="Got it" onPress={() => setHowToPlayVisible(false)} variant="primary" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function RainbowWord({ word }: { word: string }) {
  const { colors } = useTheme();
  const palette = [colors.accent, colors.mismatch, colors.accentYellow, colors.success, colors.info];

  return (
    <Text style={styles.title}>
      {word.split('').map((letter, index) => (
        <Text key={index} style={{ color: palette[index % palette.length] }}>
          {letter}
        </Text>
      ))}
    </Text>
  );
}

function BestTile({
  label,
  value,
  icon,
  iconColor,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
}) {
  const { colors, colorScheme } = useTheme();
  return (
    <View
      style={[
        styles.bestTile,
        { backgroundColor: colors.surface, borderColor: colors.border, ...getShadow('s1', colorScheme, colors) },
      ]}
    >
      <View style={styles.bestTileHeader}>
        <Ionicons name={icon} size={14} color={iconColor} />
        <Text style={[styles.bestTileLabel, { color: colors.textSecondary }]}>{label.toUpperCase()}</Text>
      </View>
      <Text style={[styles.bestTileValue, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    overflow: 'hidden',
  },
  blobsWrapper: {
    position: 'absolute',
    top: -20,
    left: -40,
  },
  blobsImage: {
    width: 320,
    height: 125,
    opacity: 0.7,
  },
  blobsWrapperBottom: {
    position: 'absolute',
    bottom: -30,
    right: -60,
    transform: [{ rotate: '180deg' }],
  },
  blobsImageBottom: {
    width: 260,
    height: 100,
    opacity: 0.35,
  },
  goodThingsTag: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.lg,
    alignItems: 'center',
    gap: 2,
  },
  raysImage: {
    width: 28,
    height: 22,
  },
  goodThingsText: {
    fontSize: 10,
    fontFamily: typography.caption.fontFamily,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Natural height, top-aligned — deliberately NOT flex:1/justifyContent:'center'.
  // That combination previously centered this whole block within all leftover
  // screen space above the buttons, which on a tall device left a large gap
  // between the stat tiles and New Game with nothing visually anchoring it.
  hero: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.display.fontSize,
    fontFamily: typography.display.fontFamily,
    lineHeight: typography.display.lineHeight,
  },
  tagline: {
    fontSize: typography.body.fontSize,
    fontFamily: typography.body.fontFamily,
    marginTop: spacing.sm,
  },
  subTagline: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    marginBottom: spacing.xl,
  },
  bestRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  bestTile: {
    alignItems: 'flex-start',
    borderRadius: radii.lg,
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
    flex: 1,
  },
  bestTileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  bestTileValue: {
    fontSize: typography.stat.fontSize,
    fontFamily: typography.stat.fontFamily,
  },
  bestTileLabel: {
    fontSize: 10,
    fontFamily: typography.caption.fontFamily,
    letterSpacing: 0.4,
  },
  actions: {
    gap: spacing.sm,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  secondaryHalf: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  modalCard: {
    width: '100%',
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  modalTitle: {
    fontSize: typography.title.fontSize,
    fontFamily: typography.title.fontFamily,
  },
  modalBody: {
    fontSize: typography.body.fontSize,
    fontFamily: typography.body.fontFamily,
    lineHeight: typography.body.lineHeight,
  },
});
