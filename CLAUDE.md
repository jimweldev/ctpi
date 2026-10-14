# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

ctpi is a Tauri 2 + React 19 + TypeScript (Vite) app. Mobile is the target platform. **Android is the focus right now**; iOS comes later. Desktop builds exist only because Tauri scaffolds them. The repo is public at `jimweldev/ctpi` on GitHub.

## Commands

```sh
npm run dev                 # Vite dev server in a browser (port 1420, strict)
npm run tauri dev           # Desktop Tauri window
npm run tauri android dev   # Run on an Android device or emulator
npm run tauri android build -- --apk --target aarch64  # Local arm64 release APK (signed if keystore.properties exists)
npm run build               # tsc type-check + vite build (the only static check; no linter or tests yet)
npx shadcn@latest add <component>
```

## Architecture

- **Routing:** `react-router` v8 data router in `src/router.tsx`. All pages render inside `src/layouts/root-layout.tsx`, which has a mobile bottom nav and pads for safe areas using `env(safe-area-inset-*)`. `index.html` sets `viewport-fit=cover` so those insets work. To add a page, create it in `src/pages/`, add it to `router.tsx`, and add it to `navItems` in the layout.
- **State:** zustand stores live in `src/stores/`. Components read a store through its hook. Code outside React calls `useXStore.getState()`.
- **HTTP:** use the axios instances in `src/lib/api.ts`. Don't call bare `axios` or `fetch`.
- **UI:** shadcn/ui with the `radix-luma` style (see `components.json`). Generated components are in `src/components/ui/`; treat them as vendored and prefer composing them over editing them. The theme is OKLCH CSS variables in `src/index.css` (neutral base, blue primary, Inter font, `.dark` class variant). Toasts use `sonner`, mounted once in `App.tsx`.
- **Path alias:** `@/` → `src/`. It's configured in both `vite.config.ts` and `tsconfig.json`; keep the two in sync.

## Updates (important)

The official `tauri-plugin-updater` **does not support Android or iOS**, so it is intentionally not used. Instead:

- `src/stores/updater-store.ts` calls the GitHub API (`/repos/{GITHUB_REPO}/releases/latest`; the repo name lives in `src/config.ts`) and compares the release `tag_name` with the app's version from `getVersion()` using `src/lib/version.ts`.
- When a newer version exists, `src/components/update-dialog.tsx` opens the release's `.apk` asset in the system browser through `@tauri-apps/plugin-opener`. If there is no `.apk` asset, it opens the release page instead. Android can't self-install silently, so the user installs the update by hand.
- The check runs once on app start (`App.tsx`) and on demand from the Settings page.

## Releasing

1. Bump `version` in `package.json`. It is the single source; `src-tauri/tauri.conf.json` reads it through `"version": "../package.json"`.
2. Commit, then push a tag that matches: `git tag v0.2.0 && git push origin v0.2.0`.
3. `.github/workflows/release-android.yml` builds a signed universal APK and publishes it as a GitHub release asset named `ctpi-v0.2.0.apk`. The workflow fails if the tag doesn't match `package.json`.

Signing details:

- `src-tauri/gen/android/app/build.gradle.kts` signs release builds only when `src-tauri/gen/android/keystore.properties` exists. That file is git-ignored; CI writes it from the `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD` and `ANDROID_KEY_BASE64` repo secrets.
- The keystore must never change. Android refuses to install an update signed with a different key.
- Local Android builds need `ANDROID_HOME` and `NDK_HOME` set. Gradle should run on Android Studio's bundled JDK (`JAVA_HOME="C:/Program Files/Android/Android Studio/jbr"`), not the system JDK 26.

## Tauri side

- Rust entry point is `src-tauri/src/lib.rs`; `run()` is shared by the desktop and mobile entry points.
- Plugin permissions go in `src-tauri/capabilities/default.json`. A new Tauri plugin needs both registration in `lib.rs` and a permission entry there.
- `vite.config.ts` reads `TAURI_DEV_HOST` for HMR when running on a physical mobile device.
