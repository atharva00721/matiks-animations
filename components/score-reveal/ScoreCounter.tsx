import { useEffect } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface ScoreCounterProps {
  targetScore: number;
  onComplete?: () => void;
}

export function ScoreCounter({ targetScore, onComplete }: ScoreCounterProps) {
  const animatedScore = useSharedValue(0);
  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

  const animatedTextProps = useAnimatedProps(() => {
    const value = Math.floor(animatedScore.value).toLocaleString();
    return {
      text: value,
      value,
    } as never;
  });

  useEffect(() => {
    const overshoot = targetScore * 1.05;

    animatedScore.value = withSequence(
      withTiming(overshoot, {
        duration: 2000,
        easing: Easing.out(Easing.cubic),
      }),
      withDelay(
        80,
        withSpring(targetScore, {
          damping: 14,
          stiffness: 120,
          mass: 0.8,
        }),
      ),
    );

    // Fire onComplete after the sequence settles (~2.6s total)
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2600);

    return () => clearTimeout(timer);
  }, [targetScore]);

  return (
    <View style={styles.container}>
      <Animated.Text style={styles.label}>TOTAL XP</Animated.Text>
      <AnimatedTextInput
        editable={false}
        underlineColorAndroid="transparent"
        pointerEvents="none"
        style={styles.scoreText}
        animatedProps={animatedTextProps}
      />
      <View style={styles.underline} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#888888',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 80,
    fontWeight: '900',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
    letterSpacing: -2,
    lineHeight: 88,
    textShadowColor: 'rgba(181, 255, 0, 0.25)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  underline: {
    marginTop: 8,
    height: 3,
    width: 60,
    borderRadius: 2,
    backgroundColor: '#B5FF00',
  },
});
