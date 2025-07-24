/**
 * Calculate score based on various multipliers
 */
export function calculateScore(
  baseMultiplier: number,
  appeal: number,
  scoreBoost: number,
  voltageLevel: number,
  learningCorrection: number = 1.0
): number {
  const voltageMultiplier = 1 + voltageLevel / 10
  
  const score = Math.floor(
    appeal *
    baseMultiplier *
    (1 + scoreBoost) *
    voltageMultiplier *
    learningCorrection
  )
  
  return score
}

/**
 * Calculate skill invocation multiplier
 */
export function calculateSkillInvocationMultiplier(
  baseMultiplier: number,
  skillInvocationBoost: number
): number {
  return baseMultiplier * (1 + skillInvocationBoost)
}