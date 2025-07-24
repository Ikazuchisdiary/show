# V2 Score Calculation Fix Plan

## Critical Issues to Fix

### 1. Boost System Architecture (CRITICAL)
**Issue**: v2 uses a single accumulated boost value instead of an array-based system
- v1: `scoreBoost[0..99]` array where each score gain consumes one boost
- v2: Single `scoreBoost` variable that accumulates all boosts

**Fix Required**:
- Change `scoreBoost: number` to `scoreBoost: number[]` (100 elements)
- Add `scoreBoostCount: number` to track current position
- Change `voltageBoost: number` to `voltageBoost: number[]` (100 elements)
- Add `voltageBoostCount: number` to track current position

### 2. Learning Correction Missing (CRITICAL)
**Issue**: Learning correction not passed to score calculation
- v1: Default 1.5, configurable by user
- v2: Default 1.0, not configurable

**Fix Required**:
- Add `learningCorrection` to SimulationOptions
- Default to 1.5
- Pass through to calculateScore function

### 3. Voltage Gain Calculation (CRITICAL)
**Issue**: Wrong formula for voltage gains
- v1: `voltagePt = Math.floor(value * (1 + voltageBoost[voltageBoostCount]))`
- v2: Missing proper voltage boost application

**Fix Required**:
- Apply voltage boost from array when gaining voltage
- Increment voltageBoostCount after each voltage gain

### 4. Center Skill Score Gain (CRITICAL)
**Issue**: Center skills not using full score calculation
- v1: Uses complete score formula with all multipliers
- v2: Only multiplies appeal by skill value

**Fix Required**:
- Center skill scoreGain effects must use the full calculateScore function
- Include all multipliers (voltage level, score boost, learning correction)

### 5. Combo Count Not Used
**Issue**: Combo count from music/difficulty not being used
- v1: Uses combo count for calculations
- v2: Has comboCount in options but doesn't use it

## Implementation Steps

1. **Update GameState interface**:
   - Change boost fields from number to number[]
   - Add boost count trackers
   - Add learningCorrection

2. **Update boost application logic**:
   - When applying boost effects, add to array at current count position
   - When using boosts, consume from array and increment counter

3. **Fix score calculation**:
   - Pass learningCorrection through
   - Use boost arrays properly

4. **Fix voltage calculation**:
   - Apply voltage boost from array
   - Use correct formula

5. **Fix center skill effects**:
   - Use full score calculation for scoreGain effects
   - Apply all multipliers correctly

## Test Cases to Verify

1. Multiple score boosts should stack at same index
2. Each score gain should consume one boost and move to next
3. Learning correction should default to 1.5
4. Voltage gains should use voltage boost array
5. Center skills should produce same scores as regular cards with same values