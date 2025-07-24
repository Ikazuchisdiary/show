import React from 'react'

interface SkillParameterDisplayProps {
  label: string
  value: string | number
  style?: React.CSSProperties
}

export const SkillParameterDisplay: React.FC<SkillParameterDisplayProps> = ({
  label,
  value,
  style
}) => {
  const spanStyle = {
    flex: 1,
    minWidth: '100px',
    padding: '5px',
    border: '1px solid #ddd',
    borderRadius: '3px',
    fontSize: '14px',
    display: 'inline-block',
    boxSizing: 'border-box' as const,
    height: '32px',
    lineHeight: '20px',
    ...style
  }
  
  return (
    <div className="skill-param-row">
      <label>{label}:</label>
      <span style={spanStyle}>{value}</span>
    </div>
  )
}