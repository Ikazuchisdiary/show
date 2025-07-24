# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a web-based score calculator for "スクショウ" (Sukushou), a Japanese rhythm/idol game. The application calculates game scores based on complex mechanics involving cards, appeal values, voltage levels, and fever phases.

## Key Architecture

### Core Files
- `index.html`: Main entry point with UI structure
- `script.js`: Game logic implementation using ES6 classes (`Game`, `Card`, `GenericCard`)
- `cardData.js`: Card definitions and configurations in JSON format
- `style.css`: Styling for the web interface

### Important Classes and Concepts

1. **Game Class** (`script.js:24`): Manages game state including score, voltage, boosts, turns, and card rotations
2. **Card System**: Cards have configurable effects defined in `cardData.js` with support for:
   - Score/voltage boosts
   - Conditional effects based on game state
   - Turn skipping mechanics
   - Skill levels (1-14) with multipliers

3. **Game Mechanics**:
   - Turn-based system with card rotations
   - Voltage levels affecting score multipliers
   - Three phases: before fever, during fever, after fever
   - Mental system for card conditions

## Development Commands

This is a plain HTML/CSS/JavaScript application with no build system:
- **Run locally**: Open `index.html` in a web browser
- **No build/lint/test commands**: The project has no package manager or testing framework

## Important Implementation Details

1. **Effect System**: Card effects are defined in JSON format in `cardData.js`. Each effect has a type (e.g., "scoreBoost", "voltageBoost", "conditional") and associated parameters.

2. **Skill Level Multipliers**: Defined in `SKILL_LEVEL_MULTIPLIERS` array (`script.js:6`) ranging from 1.0x (Lv.1) to 3.0x (Lv.14).

3. **Voltage Calculation**: The `getVoltageLevel()` method (`script.js:86`) uses predefined thresholds for levels 0-19, then adds 1 level per 200 voltage points above 1900.

4. **Phase Detection**: The game has three phases determined by the music array:
   - Before fever: turns 0 to music[0]-1
   - During fever: turns music[0] to music[0]+music[1]-1
   - After fever: remaining turns

5. **Card Rotation**: Cards are used in sequence, resetting to the first card after all have been used (`script.js:51`).

## Adding New Features

When adding new cards or effects:
1. Add card definitions to `cardData.js` following the existing JSON structure
2. For new effect types, implement handling in the `GenericCard.do()` method
3. Update UI elements in `index.html` if needed
4. Maintain the existing code style and patterns

## Commit Message Guidelines

When committing changes, include update information for the update banner system:
1. Keep commit messages concise and descriptive
2. When making user-facing changes, think about how they would appear in the update history
3. The update history is manually maintained in `script.js` in the `updateHistory` array
4. Format: Brief description of the change in Japanese (matching the app's language)

Example commit messages:
- "新カード追加: [カード名]キャラクター名"
- "スキル値を修正: カード名"
- "共有機能のバグを修正"
- "UIの改善: 具体的な改善内容"

## Development Best Practices

- **User Confirmation**: 
  - pushする前にユーザに確認をとってください

## Temporary Work Instructions (2025-07-24)

- ユーザーが6時間ほど離席中
- 定期的に各種markdownを確認しながら、許可を得ずに作業を進める
- 主な作業内容:
  1. ログ表示形式をv1に準拠させる
  2. AP不足計算と参考スコア表示機能の実装
  3. その他のpendingタスクの処理

## Memory Notes

- updateHistoryを更新するときは、現在時刻を取得して指定してください
- v2開発時は必ずv1の実装を確認してから実装する
- インラインスタイルはCSSクラスに移行する
- font-family: inheritなどのグローバルスタイルに注意

## v2 Development Methodology

### Code Analysis and Documentation
When improving v2 to match v1 quality:
1. **Analyze v1 implementation** - Study CSS, HTML, and JS in detail
2. **Create analysis markdown** - Document findings in dedicated markdown files
3. **Track differences** - Maintain detailed comparisons between v1 and v2
4. **Update systematically** - Make changes based on documented analysis

### Key Analysis Files
- `V1_FEATURE_ANALYSIS.md` - Comprehensive v1 feature list and implementation status
- `V2_IMPLEMENTATION_GAPS.md` - Features marked complete but actually incomplete
- `V2_IMPLEMENTATION_TASKS.md` - Prioritized task list with time estimates
- `V1_IMPLEMENTATION_REFERENCE.md` - Detailed code locations in v1
- `V1_CARD_SELECTOR_ANALYSIS.md` - Deep dive into card selection UI differences

### v1 Reference Location
Reference files from v1 are stored in `/v1-reference/` directory for easy comparison.

## UI Implementation Guidelines

### Card Selection UI (Based on v1 Analysis) ✅ COMPLETED
1. **Card numbers**: Square with rounded corners (32x32px, border-radius: 6px, white background)
2. **Font family**: System fonts with proper font-weights
3. **Conditional effects**: Gray background (#f0f0f0) with proper indentation
4. **Success/Failure colors**: Success (#2196F3), Failure (#f44336)
5. **Label width**: 150px fixed width with font-weight: 700 for skill parameters
6. **No shortCodes**: Display only card names without [Kg] style prefixes
7. **Character order**: Fixed order matching v1 (102期 → 103期 → 104期 → Others)
8. **Drag & Drop**: Insert behavior with green position indicators (not swap)

### Development Approach
1. Always compare with v1 before implementing UI changes
2. Document findings in markdown before coding
3. Update CLAUDE.md with new guidelines discovered
4. Maintain consistency with v1's visual design language

## Architecture Migration Plan

A comprehensive architecture migration plan has been created in `ARCHITECTURE_PLAN.md`. The migration involves:

### Technology Stack (Planned)
- **TypeScript**: For type safety and better developer experience
- **Vite**: Modern build tool with fast HMR and optimized builds
- **React**: Component-based UI architecture
- **Zustand**: Lightweight state management
- **Vitest**: Testing framework integrated with Vite

### Migration Phases
1. **Phase 1**: Development environment setup (1-2 weeks)
2. **Phase 2**: Core logic migration to TypeScript (2-3 weeks)
3. **Phase 3**: UI layer reconstruction with React (2-3 weeks)
4. **Phase 4**: Optimization and new features (1-2 weeks)

### Important Notes
- The migration will be gradual to minimize risk
- GitHub Pages deployment will be maintained (output to `docs/` folder)
- Old and new versions will run in parallel during transition
- All changes should maintain backward compatibility where possible

See `ARCHITECTURE_PLAN.md` for detailed implementation plan.

## v2 Progress Tracking

### Completed Features (2025-07-24)
1. **Card Selection UI** - Fully matches v1 appearance and behavior
   - Skill parameter editing with custom values
   - Conditional effect display formatting
   - Character ordering (102期 → 103期 → 104期 → Others)
   - Font weights and sizes matching v1
   - Drag & drop with insertion indicators
2. **Center Character System** - Highlight and bonus calculations
   - Orange border (#ff9800) highlighting for center character cards
   - Center characteristic appeal boost calculations (already implemented in GameSimulator)

### Next Priority Tasks
1. **Center Skill System** - Level selection and parameter inputs
2. **AP Balance Details** - Income/expense breakdown
3. **Local Storage** - Save skill levels and custom songs
4. **Turn Log Improvements** - Show calculation formulas