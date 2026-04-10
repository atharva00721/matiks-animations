import { Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { ComboStreakBadge } from '@/components/score-reveal/ComboStreakBadge';
import { ConfettiBurst } from '@/components/score-reveal/ConfettiBurst';
import { RankReveal } from '@/components/score-reveal/RankReveal';
import { ScoreCounter } from '@/components/score-reveal/ScoreCounter';
import { ShareButton } from '@/components/score-reveal/ShareButton';

// ── Mock game data ─────────────────────────────────────────────
const GAME_RESULT = {
  playerName: 'ATHARVA THAKUR',
  score: 2840,
  comboStreak: 7,
  rank: 3,
  totalPlayers: 1200,
};

// Stagger offsets (ms) after the score counter completes
const RANK_DELAY = 200;
const SHARE_DELAY = 650;

export default function ScoreRevealScreen() {
  const [scoreComplete, setScoreComplete] = useState(false);
  const [confettiTriggered, setConfettiTriggered] = useState(false);

  // Header fade-in on mount
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);

  useEffect(() => {
    headerOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));
    headerTranslateY.value = withDelay(200, withTiming(0, { duration: 500 }));
  }, []);

  const headerAnimStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const handleScoreComplete = useCallback(() => {
    setScoreComplete(true);
    setConfettiTriggered(true);
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Game Over',
          headerShown: false,
        }}
      />
      <StatusBar barStyle="light-content" />

      {/* Full-screen dark background matching Matiks UI */}
      <View style={styles.background}>
        {/* Subtle neon green radial glow in the centre */}
        <View style={styles.glow} />

        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}>

            {/* ── Match header ─────────────────────────────────── */}
            <Animated.View style={[styles.header, headerAnimStyle]}>
              <Text style={styles.gameOverLabel}>MATCH COMPLETE</Text>
              <Text style={styles.playerName}>
                {GAME_RESULT.playerName}
              </Text>
            </Animated.View>

            {/* ── Divider ──────────────────────────────────────── */}
            <View style={styles.divider} />

            {/* ── Score counter ────────────────────────────────── */}
            <ScoreCounter
              targetScore={GAME_RESULT.score}
              onComplete={handleScoreComplete}
            />

            {/* ── Spacer ───────────────────────────────────────── */}
            <View style={styles.gap24} />

            {/* ── Combo streak badge ───────────────────────────── */}
            <ComboStreakBadge
              streakCount={GAME_RESULT.comboStreak}
              visible={scoreComplete}
            />

            <View style={styles.gap32} />

            {/* ── Rank reveal ──────────────────────────────────── */}
            <RankReveal
              rank={GAME_RESULT.rank}
              totalPlayers={GAME_RESULT.totalPlayers}
              delay={RANK_DELAY}
              visible={scoreComplete}
            />

            <View style={styles.gap48} />

            {/* ── Share CTA ────────────────────────────────────── */}
            <ShareButton
              visible={scoreComplete}
              delay={SHARE_DELAY}
              onPress={() => {
                // Share integration placeholder
              }}
            />

            <View style={styles.gap24} />

          </ScrollView>
        </SafeAreaView>

        {/* ── Confetti burst (bonus Skia layer) ────────────────── */}
        <ConfettiBurst trigger={confettiTriggered} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#0F0F0F', // Matiks dark background
  },
  glow: {
    position: 'absolute',
    top: -100,
    alignSelf: 'center',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(181, 255, 0, 0.04)', // Subtle neon green glow
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
  },
  gameOverLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#888888',
    marginBottom: 6,
  },
  playerName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  divider: {
    marginVertical: 24,
    height: 1,
    width: '60%',
    backgroundColor: '#2A2A2A',
    borderRadius: 1,
  },
  gap24: { height: 24 },
  gap32: { height: 32 },
  gap48: { height: 48 },
});
