# JOSH Ordering App

React Native ordering flow prototype for the JOSH Frontend Mobile
Developer Assessment.

## Stack

- Expo SDK 56
- React Native
- TypeScript
- Expo Router
- Zustand
- Vitest

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the Expo development server:

```bash
npm start
```

3. Run on a specific target if needed:

```bash
npm run android
npm run ios
npm run web
```

## Verification

Verified in the current workspace:

```bash
npm test
npm run typecheck
```

Current result:

- `npm test` → 7 test files passed, 21 tests passed
- `npm run typecheck` → passed with no TypeScript errors

## Product Flow

The prototype includes five screens:

- Product List
- Product Detail
- Cart
- Checkout Review
- Order Confirmation

Core delivery scenarios covered in the current build:

- Search and category filtering
- Earliest delivery messaging
- Out-of-stock and order-taking checks
- Bangkok frozen-route validation
- Mixed-temperature split delivery warning

Implemented scope note:

- The prototype uses local mock data in `src/data/` and does not call a live
  backend API.
- The UI uses placeholder visuals for products rather than real image assets.
- The current build includes cart persistence fallback, accessibility labels/
  hints, skeleton loading, and FlatList-based catalog rendering.
- It does not include LINE/push-notification mock support.

## Project Structure

```text
app/                  Expo Router screens
src/components/       Reusable UI building blocks
src/data/             Local mock data and delivery rules
src/domain/           Pure business logic and formatters
src/features/         Store logic, selectors, and feature services
src/theme/            Color, spacing, and typography tokens
```

## Technical Decisions

Expo SDK 56:
The assessment asked for React Native with Expo or RN CLI. Expo keeps the
setup light, makes local review faster, and fits the prototype scope well.

Expo Router:
File-based routing keeps the five-screen flow easy to follow and reduces
navigation boilerplate for a small app.

Zustand:
The cart state is small and local to the ordering flow. Zustand keeps the
store simple, avoids heavy reducer ceremony, and is easy to test.

Domain-first logic:
Delivery validation, totals, and formatting live outside the screens so the
rules are reusable, easier to test, and less coupled to UI rendering.

FlatList for the catalog:
The list screen uses `FlatList` with stable keys and initial render tuning so
the product catalog can scale more gracefully than a manual map over a
`ScrollView`.

## Notes for Review

- Product and delivery data live in local mock files instead of UI components.
- The current validation path uses the Bangkok delivery region as the active
  checkout flow in the UI.
- Unit tests cover cart calculations, cart store behavior, product filtering,
  delivery validation, date utilities, and shared formatters.
- The current build covers the five-screen ordering prototype, local mock
  catalog and delivery rules, cart validation, and confirmation flow.
  Implemented bonus items in this repo are cart persistence fallback,
  accessibility labels/hints, skeleton loading, and FlatList-based list
  rendering. Push-notification mock support is not part of this build.
