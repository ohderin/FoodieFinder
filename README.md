# Foodie

Expo / React Native Project

## Setup

```bash
cd FoodieFinder
npm install
npx expo start
```

iPhone: use Expo Go (App Store) and scan the QR. If local emulation (Xcode sim) is available that works too.

Android: use Android Studio emulation.

If `npm install` fails because of global npm cache permissions on your machine, fix ownership of `~/.npm` or set a project-local cache:

```bash
npm install --cache ./.npm-cache
```
If `npx expo start` throws an error 'Cannot find module', fix by reinstalling modules:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Configuration

- **Location**: `expo-location` with `NSLocationWhenInUseUsageDescription` in `app.json` (iOS) and Android location permissions.
- **Maps links**: Uses `expo-linking` for `maps://`, `comgooglemaps://`, and `waze://` (falls back to Google Maps in browser if the native app is missing).

Restaurant data is mock (`src/data/sampleRestaurant.ts`) until we implement.

## File path layout

- `app/` : routes (`(tabs)`, `onboarding`, `menu`, `reviews`).
- `src/theme/colors.ts` : Hi-Fi palette tokens.
- `src/context/AppContext.tsx` : onboarding + sign-out reset.
- `src/components/` : buttons, logo, card.
