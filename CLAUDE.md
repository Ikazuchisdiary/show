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