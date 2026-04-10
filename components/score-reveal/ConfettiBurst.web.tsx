/**
 * Web stub — @shopify/react-native-skia requires CanvasKit (WASM) which
 * is not loaded in Expo's default web setup. Confetti is native-only.
 *
 * Implementation lives in ConfettiBurst.native.tsx so the web bundle never
 * imports react-native-skia (avoids PictureRecorder / CanvasKit errors).
 * Do not import from the .native file here — that would bundle Skia on web.
 */
export function ConfettiBurst(_props: { trigger?: boolean }) {
  return null;
}
