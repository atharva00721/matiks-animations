import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

interface RankRevealProps {
  rank: number;
  totalPlayers: number;
  delay?: number;
  visible?: boolean;
}

export function RankReveal({ rank, totalPlayers, delay = 0, visible = false }: RankRevealProps) {
  const translateY = useSharedValue(60);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;

    const config = { duration: 500, easing: Easing.out(Easing.cubic) };

    translateY.value = withDelay(delay, withTiming(0, config));
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
  }, [visible, delay]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const rankStr = `#${rank}`;
  const totalStr = totalPlayers.toLocaleString();

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <Text style={styles.eyebrow}>RANKING</Text>
      <View style={styles.row}>
        <Text style={styles.rankNumber}>{rankStr}</Text>
        <Text style={styles.separator}> of </Text>
        <Text style={styles.total}>{totalStr}</Text>
      </View>
      <View style={styles.trophyRow}>
        <Text style={styles.trophy}>{getTrophyEmoji(rank)}</Text>
        <Text style={styles.rankLabel}>{getRankLabel(rank, totalPlayers)}</Text>
      </View>
    </Animated.View>
  );
}

function getTrophyEmoji(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  if (rank <= 10) return '🏆';
  return '🎖️';
}

function getRankLabel(rank: number, total: number): string {
  const percentile = Math.round(((total - rank) / total) * 100);
  if (rank <= 3) return 'TOP FINISHER';
  if (percentile >= 90) return `TOP ${100 - percentile}%`;
  return `TOP ${100 - percentile}%`;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#888888',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  rankNumber: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 48,
  },
  separator: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555555',
    marginHorizontal: 4,
  },
  total: {
    fontSize: 24,
    fontWeight: '700',
    color: '#AAAAAA',
  },
  trophyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  trophy: {
    fontSize: 16,
  },
  rankLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B5FF00',
    letterSpacing: 0.5,
  },
});
