/**
 * Fallback entry for TypeScript and any bundler/SSR pass that resolves the base
 * name before platform extensions. Must not import @shopify/react-native-skia.
 *
 * Metro / Expo normally prefers ConfettiBurst.web.tsx (web) or
 * ConfettiBurst.native.tsx (iOS/Android) over this file.
 */
export function ConfettiBurst(_props: { trigger?: boolean }) {
  return null;
}
