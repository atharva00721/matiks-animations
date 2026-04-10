import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface ComboStreakBadgeProps {
  streakCount: number;
  visible?: boolean;
}

export function ComboStreakBadge({ streakCount, visible = false }: ComboStreakBadgeProps) {
  const badgeScale = useSharedValue(0);
  const badgeOpacity = useSharedValue(0);
  const flameScale = useSharedValue(1);
  const flameOpacity = useSharedValue(1);

  useEffect(() => {
    if (!visible) return;

    // Badge entry: scale 0 → 1.15 → 1.0 with bounce
    badgeOpacity.value = withTiming(1, { duration: 80 });
    badgeScale.value = withSequence(
      withSpring(1.18, { damping: 6, stiffness: 200, mass: 0.6 }),
      withSpring(1.0, { damping: 12, stiffness: 180, mass: 0.8 }),
    );

    // Flame pulse: scale + opacity looping
    flameScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 500 }),
        withTiming(1.0, { duration: 500 }),
      ),
      -1,
      false,
    );
    flameOpacity.value = withRepeat(
      withSequence(
        withTiming(0.65, { duration: 500 }),
        withTiming(1.0, { duration: 500 }),
      ),
      -1,
      false,
    );
  }, [visible]);

  const badgeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity: badgeOpacity.value,
  }));

  const flameAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
    opacity: flameOpacity.value,
  }));

  return (
    <Animated.View style={[styles.badge, badgeAnimStyle]}>
      <Animated.Text style={[styles.flame, flameAnimStyle]}>🔥</Animated.Text>
      <View style={styles.textContainer}>
        <Text style={styles.countText}>{streakCount}</Text>
        <Text style={styles.labelText}> Combo Streak!</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderColor: '#2A2A2A',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 8,
    alignSelf: 'center',
  },
  flame: {
    fontSize: 24,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  countText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FF8C00',
    fontVariant: ['tabular-nums'],
  },
  labelText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFB347',
    letterSpacing: 0.5,
  },
});
