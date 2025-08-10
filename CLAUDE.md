# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a web-based score calculator for "スクショウ" (Sukushou), a Japanese rhythm/idol game. The application calculates game scores based on complex mechanics involving cards, appeal values, voltage levels, and fever phases.

## Current Architecture

### Technology Stack

- **TypeScript**: Type-safe development
- **React**: Component-based UI
- **Vite**: Build tool and development server
- **Zustand**: State management
- **Vitest**: Testing framework

### Project Structure

```
src/
├── components/       # React components
├── core/            # Core business logic
│   ├── calculations/  # Score, AP, voltage calculations
│   ├── models/       # Card, Music, Effect models
│   └── simulation/   # Game simulation engine
├── data/            # Game data files
│   ├── cards/       # Character-specific card data
│   ├── cardData.js  # Card data aggregator
│   └── musicData.js # Music/song data
├── stores/          # Zustand stores
└── utils/           # Utility functions
```

### Data Organization

- **Card Data**: Split by character in `src/data/cards/` directory (TypeScript files)
  - Character files use romanized names: `osawa_rurino.ts`, `momose_ginko.ts`, etc.
  - Each file exports a default object with all cards for that character
  - Cards are re-exported through `cardData.ts` for backward compatibility
- **Music Data**: Centralized in `src/data/musicData.ts`
- **Important**: All skill values in card data are stored as **Lv.10 values**
- Center skill timings:
  - `beforeFirstTurn`: ライブ開始時
  - `beforeFeverStart`: FEVER開始時
  - `afterLastTurn`: ライブ終了時

## Development Commands

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build

# Code Quality
pnpm lint         # Run ESLint
pnpm format       # Run Prettier
pnpm type-check   # Run TypeScript type checking

# Testing
pnpm test         # Run tests
pnpm test:ui      # Run tests with UI
pnpm coverage     # Generate test coverage
```

## Important Implementation Details

1. **Effect System**: Card effects support various types:
   - Basic: `scoreBoost`, `voltageBoost`, `scoreGain`, `voltageGain`
   - Conditional: Based on turn count, voltage level, mental state
   - Special: `resetCardTurn`, `removeAfterUse`, `apGain`

2. **Skill Level System**:
   - Levels 1-14 with multipliers from 1.0x to 3.0x
   - Some effects have fixed values regardless of level (check `levelValues` array)

3. **Game Phases**:
   - Before fever: Start to fever start
   - During fever: Fever duration
   - After fever: Remaining turns

4. **AP System**:
   - Cards have AP costs
   - Center characteristics can reduce AP costs
   - AP gains are multiplied by 1.5x during calculations

## Card Data Structure

### File Organization

Card data is organized by character in `src/data/cards/`:

```typescript
// src/data/cards/[character_name].ts
import { CardData } from '../../core/models/Card'

const character_nameCards: CardData = {
  cardKey1: { ... },
  cardKey2: { ... },
}

export default character_nameCards
```

### Important Conventions

1. **Skill Values**: All `value` fields in card effects contain **Lv.10 values**
   - The game automatically calculates other levels using multipliers
   - Lv.1 = 1.0x, Lv.10 = 2.1x, Lv.14 = 3.0x (full list in `SKILL_LEVEL_MULTIPLIERS`)
   - Example: If Lv.10 value is 2.175, then Lv.1 = 1.035, Lv.14 = 3.11

2. **Fixed Values**: Some effects have fixed values regardless of skill level
   - Use `levelValues` array to specify fixed values per level
   - Example: `levelValues: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]` = always 5
   - Common fixed-value effects:
     - `apGain`: AP回復量が固定の場合（一部のカードはLv.11以上で変動）
     - `mentalReduction`: メンタル減少量（パーセンテージの場合あり）
     - `mentalRecover`: メンタル回復量（直接加算、値は実数点）
     - `voltagePenalty`: ボルテージ減少量
     - `resetCardTurn`: 山札リセット（数値なし）
     - `removeAfterUse`: カード除外（数値なし）

3. **Card Structure**:

   ```javascript
   cardKey: {
     name: 'Internal Name',           // English internal identifier
     displayName: '[衣装名]キャラ名',    // Japanese display name
     character: 'キャラクター名',        // Character name for grouping
     shortCode: 'Xx',                 // 2-letter abbreviation (MUST be unique)
     apCost: 10,                      // AP cost to use
     stats: {                         // Base stats
       smile: 5760,
       pure: 5760,
       cool: 5760,
       mental: 480
     },
     effects: [...],                  // Card effects array
     centerCharacteristic: {...},     // Optional: Center position bonus
     centerSkill: {...}              // Optional: Center skill timing effect
   }
   ```

4. **Effect Types**:
   - Score/Voltage boost: Use decimal (0.825 = 82.5%)
   - Score/Voltage gain: Use decimal (2.175 = 217.5%)
   - AP/Mental values: Use integers (10 = 10 points, 50 = 50 points)
   - Voltage penalty: Use integers (5000 = 5000 points)

## Adding New Features

### Adding New Cards

1. **Find or create character file** in `src/data/cards/[character_name].ts`
   - Use romanized names: `osawa_rurino.ts`, `momose_ginko.ts`, etc.
   - File should export a default object with all cards for that character

2. **Add card to the character's cards object**:

   ```typescript
   const character_nameCards: CardData = {
     // Existing cards...
     newCardKey: {
       name: 'New Card Name',
       displayName: '［衣装名］キャラクター名',
       character: 'キャラクター名',
       shortCode: 'Xx',
       apCost: 10,
       stats: { smile: 5760, pure: 5760, cool: 5760, mental: 480 },
       effects: [
         {
           type: 'scoreBoost',
           value: 1.365, // Lv.10 value (136.5%)
           description: 'スコア136.5%ブースト (Lv.10)',
         },
       ],
       // Optional: centerCharacteristic, centerSkill
     },
   }
   ```

3. **Important reminders**:
   - Always use Lv.10 values for the `value` field
   - Mental recovery values are direct points (50 = 50 points, not 50%)
   - **shortCode must be unique** - Each card must have a different 2-letter code
   - Test with different skill levels and game scenarios
   - You can check card details on the wiki: `https://wikiwiki.jp/llll_wiki/{displayName}`
     - Example: `https://wikiwiki.jp/llll_wiki/［17th Birthday］大沢瑠璃乃`

### Adding New Music

1. **Check music details on the wiki**:
   - Music attributes and combo counts: https://wikiwiki.jp/llll_wiki/スクショウ/楽曲一覧
2. **Add to `src/data/musicData.ts`**:

   ```typescript
   musicKey: {
     name: '楽曲名',
     attribute: 'smile', // or 'pure', 'cool'
     comboCount: 123,
     phases: [15, 10, 15], // [beforeFever, duringFever, afterFever]
     description: '説明文（任意）',
   }
   ```

3. **Special music types**:
   - **(-2秒) versions**: Same structure as regular songs, only phases array differs
     ```typescript
     musicKeyShort: {
       name: '楽曲名（-2秒）',
       attribute: 'smile',  // Same as regular version
       comboCount: 100,     // Same as regular version
       phases: [13, 8, 13], // Shorter turn counts than regular version
       description: '短縮版楽曲',
     }
     ```

### Adding New Effects

1. Add type to `EffectType` in `src/core/models/Effect.ts`
2. Create interface for the effect
3. Add to `Effect` union type
4. Implement handling in `GameSimulator.processEffect()`

## Commit Message Guidelines

Format: `type: description in Japanese`

Types:

- `feat`: New features
- `fix`: Bug fixes
- `refactor`: Code refactoring
- `docs`: Documentation updates
- `test`: Test additions/changes
- `style`: UI/styling changes

Examples:

- `feat: 新カード「[カード名]」を追加`
- `fix: AP計算の不具合を修正`
- `refactor: カードデータをキャラクター別に分割`

## Development Best Practices

1. **Always confirm before pushing**: pushする前にユーザに確認をとってください
2. **Update history tracking**: updateHistoryを更新するときは現在時刻を取得して指定
3. **Test thoroughly**: Run lint, format, and type-check before committing
4. **Maintain data integrity**: Ensure all card/music data follows established patterns

## TypeScript Benefits

- **Type Safety**: All card and music data is now strongly typed
- **IntelliSense Support**: Auto-completion for effect types, card properties, etc.
- **Compile-time Validation**: Invalid effect types or missing required fields will cause build errors
- **Better Documentation**: Type definitions serve as inline documentation

## Recent Updates

- Converted all data files to TypeScript for better type safety
- Refactored data structure: Split gameData into character-specific files
- Fixed TypeScript errors related to optional effect arrays
- Standardized effect naming: `resetDeck` → `resetCardTurn`
- Improved type safety throughout the codebase
- Fixed center skill `mentalRecover` implementation

## Known Issues and TODOs

- Some effects marked as `visualOnly` (like CT reduction) are not fully implemented in the calculator
- Performance optimization opportunities exist in the simulation engine
- Additional test coverage needed for edge cases
