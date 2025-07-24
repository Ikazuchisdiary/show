# V1 Score Calculation Analysis

## Core Score Formula

The main score calculation happens in the `getScore()` method:

```javascript
const score = Math.floor(
  this.appeal * 
  value * 
  (1 + this.scoreBoost[this.scoreBoostCount]) * 
  (1 + this.getVoltageLevel() / 10) * 
  this.learningCorrection
);
```

### Formula Components

1. **Base Appeal** (`this.appeal`)
   - Calculated from card appeal values
   - Modified by center characteristic bonuses
   - Takes into account music attribute matching

2. **Value Multiplier** (`value`)
   - Card-specific score gain value
   - Modified by skill level multipliers
   - Can be customized through skill parameters

3. **Score Boost** (`1 + this.scoreBoost[this.scoreBoostCount]`)
   - Accumulated boost values from card effects
   - Each score gain consumes one boost from the array
   - Boosts stack additively (e.g., 0.15 + 0.10 = 0.25 → 125% multiplier)

4. **Voltage Level Multiplier** (`1 + this.getVoltageLevel() / 10`)
   - Based on accumulated voltage points
   - Voltage level increases score by 10% per level
   - During fever phase, voltage level is doubled

5. **Learning Correction** (`this.learningCorrection`)
   - Default value: 1.5
   - User-configurable multiplier

## Appeal Calculation

### Base Appeal Calculation
```javascript
function calculateAppealValue() {
    // 1. Sum up appeal values for each attribute across all cards
    let totalSmile = 0;
    let totalPure = 0;
    let totalCool = 0;
    
    // 2. Apply center characteristic boosts
    // If center character has appealBoost effect:
    // - target: 'all' → boost all cards
    // - target: specific character → boost only that character's cards
    
    // 3. Return the appeal value matching the music attribute
    // If music is smile → return totalSmile
    // If music is pure → return totalPure
    // If music is cool → return totalCool
}
```

### Center Characteristic Appeal Boost
- Applied during appeal calculation (before game starts)
- Multiplies card appeal by `(1 + boostValue)`
- Example: 15% boost → appeal * 1.15

## Voltage System

### Voltage Level Calculation
```javascript
const voltageLevels = [
    0,    // Level 0: 0-9
    10,   // Level 1: 10-29
    30,   // Level 2: 30-59
    60,   // Level 3: 60-99
    100,  // Level 4: 100-149
    150,  // Level 5: 150-209
    210,  // Level 6: 210-279
    280,  // Level 7: 280-359
    360,  // Level 8: 360-449
    450,  // Level 9: 450-549
    550,  // Level 10: 550-659
    660,  // Level 11: 660-779
    780,  // Level 12: 780-909
    910,  // Level 13: 910-1049
    1050, // Level 14: 1050-1199
    1200, // Level 15: 1200-1359
    1360, // Level 16: 1360-1529
    1530, // Level 17: 1530-1709
    1710, // Level 18: 1710-1899
    1900  // Level 19: 1900+
];

// Above 1900: Level 19 + floor((voltage - 1900) / 200)
```

### Fever Phase Voltage Doubling
- During fever phase (turns `music[0]` to `music[0] + music[1] - 1`), voltage level is **doubled**
- Example: Voltage level 10 → 20 during fever
- This significantly increases score during fever phase

### Voltage Gain Calculation
```javascript
const voltagePt = Math.floor(value * (1 + this.voltageBoost[this.voltageBoostCount]));
```

## Boost Mechanics

### Score Boost System
- Stored in an array with 100 slots
- Each boost adds to the current slot: `this.scoreBoost[index] += value`
- When gaining score, uses boost at `scoreBoostCount` index
- After using, `scoreBoostCount` increments
- Multiple boosts at same index stack additively

### Voltage Boost System
- Similar to score boost but for voltage gains
- Stored in separate array: `this.voltageBoost`
- Uses `voltageBoostCount` for tracking

### Boost Stacking Example
```
Turn 1: Card adds 0.15 score boost → scoreBoost[0] = 0.15
Turn 2: Card adds 0.10 score boost → scoreBoost[0] = 0.25
Turn 3: Score gain uses scoreBoost[0] → multiplier = 1.25
        scoreBoostCount increments to 1
Turn 4: Next score gain uses scoreBoost[1] (default 0) → multiplier = 1.0
```

## Skill Level Multipliers

```javascript
const SKILL_LEVEL_MULTIPLIERS = [
    1.0,  // Lv.1
    1.1,  // Lv.2
    1.2,  // Lv.3
    1.3,  // Lv.4
    1.4,  // Lv.5
    1.5,  // Lv.6
    1.6,  // Lv.7
    1.8,  // Lv.8
    2.0,  // Lv.9
    2.2,  // Lv.10 (base values in cardData.js)
    2.4,  // Lv.11
    2.6,  // Lv.12
    2.8,  // Lv.13
    3.0   // Lv.14
];
```

- Card data stores Lv.10 values
- Actual value = (Lv.10 value / 2.2) * multiplier[level-1]

## Center Skills

### Activation Timing
- `beforeFirstTurn`: Before turn 1
- `beforeFeverStart`: Start of fever phase
- `afterLastTurn`: After the last turn

### Center Skill Effects
- Use same effect types as regular cards
- Can have conditional effects
- Apply skill level multipliers
- Center skills have 0 AP cost

## Special Mechanics

### Mental System
- Starts at 100 (or user-configured value)
- Can be modified by card effects
- Used in conditional checks

### AP (Action Point) System
- Each card has an AP cost
- Center characteristic can reduce AP costs
- AP tracking for balance calculations

### Turn Skipping
- Cards can skip turns with `skipTurn` effect
- Affects card rotation

### Card Removal
- `removeCard` effect excludes cards from rotation
- Removed cards stored in `removedCards` Set

## Complete Score Calculation Example

Given:
- Appeal: 50,000
- Card score gain value: 1.5
- Score boost: 0.25 (25%)
- Voltage: 550 (Level 10, or Level 20 during fever)
- Learning correction: 1.5

Normal phase:
```
Score = floor(50,000 * 1.5 * 1.25 * 2.0 * 1.5)
      = floor(281,250)
      = 281,250
```

Fever phase (voltage level doubled):
```
Score = floor(50,000 * 1.5 * 1.25 * 3.0 * 1.5)
      = floor(421,875)
      = 421,875
```

## Key Implementation Notes

1. **Math.floor() is used for final score calculation**
2. **Boost arrays are pre-initialized with 100 slots of 0**
3. **Turn counting is 0-indexed internally**
4. **Voltage level doubling only occurs during fever phase**
5. **Center skills activate at specific game phases**
6. **Appeal calculation happens before game starts**
7. **Skill parameters can override default effect values**