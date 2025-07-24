import React from 'react'

interface SkillParameterInputProps {
  label: string
  value: number
  defaultValue: number
  placeholder?: string
  onChange: (value: number | undefined) => void
  step?: string
  type?: 'float' | 'int'
  hasCustomValue?: boolean
}

export const SkillParameterInput: React.FC<SkillParameterInputProps> = ({
  label,
  value,
  defaultValue,
  placeholder,
  onChange,
  step = '0.001',
  type = 'float',
  hasCustomValue = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    
    if (inputValue === '') {
      onChange(undefined)
      return
    }
    
    const parsedValue = type === 'int' ? parseInt(inputValue) : parseFloat(inputValue)
    
    if (!isNaN(parsedValue)) {
      onChange(parsedValue === defaultValue ? undefined : parsedValue)
    }
  }
  
  const inputStyle = {
    flex: 1,
    minWidth: '100px',
    padding: '5px',
    border: '1px solid #ddd',
    borderRadius: '3px',
    fontSize: '14px',
    backgroundColor: hasCustomValue ? '#fffbdd' : 'white'
  }
  
  return (
    <div className="skill-param-row">
      <label>{label}:</label>
      <input 
        type="number" 
        value={value}
        placeholder={placeholder || defaultValue.toString()}
        onChange={handleChange}
        step={step}
        style={inputStyle}
      />
    </div>
  )
}