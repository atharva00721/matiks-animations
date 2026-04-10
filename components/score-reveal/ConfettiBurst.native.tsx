import { Canvas, Group, Rect } from '@shopify/react-native-skia';
import { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import {
  Easing,
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const PARTICLE_COUNT = 52;
const DURATION_MS = 2400;

const PALETTE = [
  '#FF6B6B',
  '#FFD93D',
  '#6BCB77',
  '#4D96FF',
  '#FF922B',
  '#CC5DE8',
  '#F06595',
  '#74C0FC',
  '#A9E34B',
  '#FFA94D',
];

interface ParticleData {
  x0: number;
  y0: number;
  vx: number;
  vy: number;
  gravity: number;
  rotation0: number;
  rotSpeed: number;
  color: string;
  w: number;
  h: number;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function buildParticles(): ParticleData[] {
  const cx = SCREEN_W / 2;
  const cy = SCREEN_H * 0.3;
  return Array.from({ length: PARTICLE_COUNT }, () => {
    const angle = rand(-Math.PI * 0.92, -Math.PI * 0.08);
    const speed = rand(400, 900);
    return {
      x0: cx + rand(-20, 20),
      y0: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: rand(600, 1200),
      rotation0: rand(0, Math.PI * 2),
      rotSpeed: rand(-8, 8),
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      w: rand(10, 20),
      h: rand(5, 10),
    };
  });
}

export interface ConfettiBurstProps {
  trigger?: boolean;
}

function ConfettiParticle({
  particle,
  progress,
}: {
  particle: ParticleData;
  progress: SharedValue<number>;
}) {
  const transform = useDerivedValue(() => {
    const t = progress.value;
    const x = particle.x0 + particle.vx * t;
    const y = particle.y0 + particle.vy * t + 0.5 * particle.gravity * t * t;
    const rot = particle.rotation0 + particle.rotSpeed * t;
    return [{ rotate: rot }, { translateX: x }, { translateY: y }];
  });

  const opacity = useDerivedValue(() => {
    const t = progress.value;
    if (t <= 0.001) return 0;
    return Math.max(0, 1 - t * 1.15);
  });

  return (
    <Group transform={transform} opacity={opacity}>
      <Rect
        x={-particle.w / 2}
        y={-particle.h / 2}
        width={particle.w}
        height={particle.h}
        color={particle.color}
      />
    </Group>
  );
}

export function ConfettiBurst({ trigger = false }: ConfettiBurstProps) {
  const progress = useSharedValue(0);
  const particles = useMemo(() => buildParticles(), []);

  useEffect(() => {
    if (!trigger) return;
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: DURATION_MS,
      easing: Easing.out(Easing.quad),
    });
  }, [trigger]);

  if (!trigger) return null;

  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p, i) => (
        <ConfettiParticle key={i} particle={p} progress={progress} />
      ))}
    </Canvas>
  );
}
