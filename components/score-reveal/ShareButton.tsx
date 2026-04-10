import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface ShareButtonProps {
  onPress?: () => void;
  visible?: boolean;
  delay?: number;
}

export function ShareButton({ onPress, visible = false, delay = 0 }: ShareButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const shimmerX = useSharedValue(-120);
  const [buttonWidth, setButtonWidth] = useState(280);

  useEffect(() => {
    if (!visible) return;

    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));

    // Start shimmer after the button fades in
    shimmerX.value = withDelay(
      delay + 400,
      withRepeat(
        withSequence(
          withTiming(-120, { duration: 0 }),
          withTiming(buttonWidth + 120, {
            duration: 1400,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(buttonWidth + 120, { duration: 800 }), // pause before repeat
        ),
        -1,
        false,
      ),
    );
  }, [visible, delay, buttonWidth]);

  const containerAnimStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const shimmerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.93, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSequence(
      withSpring(1.04, { damping: 12, stiffness: 280 }),
      withSpring(1.0, { damping: 14, stiffness: 240 }),
    );
  };

  const handlePress = async () => {
    try {
      if (Platform.OS === 'android') {
        await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
      } else {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch {
      // Fallback for devices that don't support advanced haptics API.
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {
        // No-op: some devices/emulators don't provide haptics hardware.
      }
    }
    onPress?.();
  };

  const onLayout = (e: LayoutChangeEvent) => {
    setButtonWidth(e.nativeEvent.layout.width);
  };

  return (
    <Animated.View style={[styles.wrapper, containerAnimStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={styles.pressable}
        onLayout={onLayout}>
        {/* Shimmer glint overlay */}
        <Animated.View style={[styles.shimmerTrack, shimmerAnimStyle]}>
          <View style={styles.shimmerBar} />
        </Animated.View>

        <Text style={styles.label}>SHARE RESULT</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
    marginHorizontal: 32,
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'transparent',
    borderColor: '#B5FF00',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  shimmerTrack: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 80,
    zIndex: 1,
  },
  shimmerBar: {
    flex: 1,
    width: 60,
    backgroundColor: 'rgba(181, 255, 0, 0.15)',
    transform: [{ skewX: '-20deg' }],
    borderRadius: 4,
  },
  icon: {
    fontSize: 20,
    color: '#B5FF00',
    fontWeight: '900',
    zIndex: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '800',
    color: '#B5FF00',
    letterSpacing: 1,
    zIndex: 2,
  },
});
