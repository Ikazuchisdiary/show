import React, { useState, useRef, useEffect } from 'react'
import { Card } from '@core/models/Card'
import { Effect } from '@core/models/Effect'
import { useGameStore } from '@stores/gameStore'
import { getAllCards, getCardsByCharacter } from '@data/index'
import './CardSelector.css'

interface CardSelectorProps {
  index: number
  onDragStart?: (index: number) => void
  onDragEnd?: () => void
  onDragOver?: (e: React.DragEvent, index: number) => void
  onDragLeave?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent, index: number) => void
  onTouchStart?: (e: React.TouchEvent) => void
  onTouchMove?: (e: React.TouchEvent) => void
  onTouchEnd?: (e: React.TouchEvent) => void
  onTouchCancel?: (e: React.TouchEvent) => void
  isDragging?: boolean
  isCenter?: boolean
  isDuplicate?: boolean
}

// 条件を日本語にフォーマットする共通関数
const formatConditionToJapanese = (condition: string): string => {
  let formatted = condition

  // 変換パターン
  const patterns = [
    // 使用回数の条件
    { regex: /count\s*>\s*(\d+)/, format: '使用回数 > $1' },
    { regex: /count\s*>=\s*(\d+)/, format: '使用回数 ≥ $1' },
    { regex: /count\s*<=\s*(\d+)/, format: '使用回数 ≤ $1' },
    { regex: /count\s*<\s*(\d+)/, format: '使用回数 < $1' },
    { regex: /count\s*==\s*(\d+)/, format: '使用回数 = $1' },
    // ターンの条件
    { regex: /turn\s*>\s*(\d+)/, format: 'ターン > $1' },
    { regex: /turn\s*>=\s*(\d+)/, format: 'ターン ≥ $1' },
    { regex: /turn\s*<=\s*(\d+)/, format: 'ターン ≤ $1' },
    { regex: /turn\s*<\s*(\d+)/, format: 'ターン < $1' },
    { regex: /turn\s*==\s*(\d+)/, format: 'ターン = $1' },
    // メンタルの条件
    { regex: /mental\s*>\s*(\d+)/, format: 'メンタル > $1%' },
    { regex: /mental\s*>=\s*(\d+)/, format: 'メンタル ≥ $1%' },
    { regex: /mental\s*<=\s*(\d+)/, format: 'メンタル ≤ $1%' },
    { regex: /mental\s*<\s*(\d+)/, format: 'メンタル < $1%' },
    { regex: /mental\s*==\s*(\d+)/, format: 'メンタル = $1%' },
    // ボルテージレベルの条件
    { regex: /voltageLevel\s*>\s*(\d+)/, format: 'ボルテージLv > $1' },
    { regex: /voltageLevel\s*>=\s*(\d+)/, format: 'ボルテージLv ≥ $1' },
    { regex: /voltageLevel\s*<=\s*(\d+)/, format: 'ボルテージLv ≤ $1' },
    { regex: /voltageLevel\s*<\s*(\d+)/, format: 'ボルテージLv < $1' },
    { regex: /voltageLevel\s*==\s*(\d+)/, format: 'ボルテージLv = $1' },
  ]

  for (const pattern of patterns) {
    const match = formatted.match(pattern.regex)
    if (match) {
      formatted = pattern.format.replace('$1', match[1])
      break
    }
  }

  // 特殊な条件
  if (condition === 'count <= 999') return 'デッキリセット条件'

  return formatted
}

export const CardSelector: React.FC<CardSelectorProps> = ({
  index,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onTouchCancel,
  isDragging,
  isCenter,
  isDuplicate,
}) => {
  const {
    selectedCards,
    cardSkillLevels,
    centerSkillLevels,
    customSkillValues,
    customCenterSkillValues,
    setCard,
    setCardSkillLevel,
    setCenterSkillLevel,
    setCustomSkillValue,
    clearCustomSkillValues,
    setCustomCenterSkillValue,
    clearCustomCenterSkillValues,
  } = useGameStore()
  const selectedCard = selectedCards[index]
  const skillLevel = cardSkillLevels[index]
  const centerSkillLevel = centerSkillLevels[index]
  const cardCustomValues = customSkillValues[index] || {}
  const centerCustomValues = customCenterSkillValues[index] || {}

  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const searchRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Display value for the input (shows selected card when not focused)
  const displayValue = isFocused ? searchQuery : selectedCard ? selectedCard.displayName : ''

  const allCards = getAllCards()

  // Character order from v1
  const characterOrder = [
    '乙宗梢',
    '夕霧綴理',
    '藤島慈',
    '日野下花帆',
    '村野さやか',
    '大沢瑠璃乃',
    '百生吟子',
    '徒町小鈴',
    '安養寺姫芽',
    '桂城泉',
    'セラス 柳田 リリエンフェルト',
    '桂城泉＆セラス 柳田 リリエンフェルト',
    '大賀美沙知',
  ]

  const characters = Array.from(new Set(allCards.map((card) => card.character))).sort((a, b) => {
    const indexA = characterOrder.indexOf(a)
    const indexB = characterOrder.indexOf(b)
    if (indexA === -1 && indexB === -1) return a.localeCompare(b)
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })

  // Only filter when actually searching
  const getFilteredCards = () => {
    if (!searchQuery || !isFocused) {
      return allCards
    }
    const query = searchQuery.toLowerCase()
    return allCards.filter(
      (card) =>
        card.displayName.toLowerCase().includes(query) ||
        card.character.toLowerCase().includes(query) ||
        card.shortCode.toLowerCase().includes(query),
    )
  }

  // Get all selectable items (including "未選択" as first item only when not searching)
  const getSelectableItems = () => {
    const items: Array<{ card: Card | null; index: number }> = []
    let itemIndex = 0

    // Only include "未選択" when not searching
    if (!searchQuery || !isFocused) {
      items.push({ card: null, index: itemIndex++ })
    }

    const filteredCards = getFilteredCards()
    characters.forEach((character) => {
      const characterCards = getCardsByCharacter(character).filter((card) =>
        filteredCards.includes(card),
      )
      characterCards.forEach((card) => {
        items.push({ card, index: itemIndex++ })
      })
    })

    return items
  }

  const handleCardSelect = (card: Card | null) => {
    setCard(index, card)
    setShowDropdown(false)
    setIsFocused(false)
    setSearchQuery('')
    setHighlightedIndex(-1)
  }

  const handleSearchFocus = () => {
    setIsFocused(true)
    setShowDropdown(true)
    setSearchQuery('') // Clear search when focusing
    // Select all text on focus
    if (searchRef.current) {
      searchRef.current.select()
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (!showDropdown) {
      setShowDropdown(true)
    }
    setHighlightedIndex(-1) // Reset highlight when search changes
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return

    const selectableItems = getSelectableItems()
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => {
          const next = prev + 1
          return next >= selectableItems.length ? 0 : next
        })
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => {
          const next = prev - 1
          return next < 0 ? selectableItems.length - 1 : next
        })
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < selectableItems.length) {
          handleCardSelect(selectableItems[highlightedIndex].card)
        }
        break
      case 'Escape':
        e.preventDefault()
        setShowDropdown(false)
        setIsFocused(false)
        setSearchQuery('')
        setHighlightedIndex(-1)
        break
    }
  }

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
        setIsFocused(false)
        setSearchQuery('') // Reset search query
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.querySelector('.card-option.highlighted')
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [highlightedIndex])

  return (
    <div
      className={`card-slot ${isDragging ? 'dragging' : ''} ${isCenter ? 'center-character' : ''} ${isDuplicate ? 'duplicate-character' : ''}`}
      draggable="true"
      data-slot={index + 1}
      onDragStart={() => onDragStart?.(index)}
      onDragEnd={() => onDragEnd?.()}
      onDragOver={(e) => onDragOver?.(e, index)}
      onDragLeave={(e) => onDragLeave?.(e)}
      onDrop={(e) => onDrop?.(e, index)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchCancel}
    >
      <div className="card-row">
        <div className="card-number">{index + 1}</div>
        <div
          className={`searchable-select-wrapper ${showDropdown ? 'active' : ''}`}
          ref={wrapperRef}
        >
          <input
            ref={searchRef}
            type="text"
            className="card-search"
            placeholder="カード名で検索..."
            value={displayValue}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          <select
            id={`card${index + 1}`}
            style={{ display: 'none' }}
            value={selectedCard?.name || ''}
            onChange={() => {}}
          >
            <option value="">未選択</option>
            {allCards.map((card) => (
              <option key={card.name} value={card.name}>
                {card.displayName}
              </option>
            ))}
          </select>
          <div className="card-dropdown" ref={dropdownRef}>
            {(!searchQuery || !isFocused) && (
              <div 
                className={`card-option ${highlightedIndex === 0 ? 'highlighted' : ''}`}
                onClick={() => handleCardSelect(null)}
              >
                未選択
              </div>
            )}
            {characters.map((character) => {
              const filteredCards = getFilteredCards()
              const characterCards = getCardsByCharacter(character).filter((card) =>
                filteredCards.includes(card),
              )

              if (characterCards.length === 0) return null

              let currentIndex = 1
              const selectableItems = getSelectableItems()

              return (
                <div key={character} className="card-group">
                  <div className="card-group-header">{character}</div>
                  {characterCards.map((card) => {
                    const itemIndex = selectableItems.findIndex(
                      (item) => item.card?.name === card.name
                    )
                    const isHighlighted = highlightedIndex === itemIndex

                    return (
                      <div
                        key={card.name}
                        className={`card-option ${selectedCard?.name === card.name ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                        onClick={() => handleCardSelect(card)}
                      >
                        {card.displayName}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>

        <select
          className="skill-level-select"
          value={skillLevel}
          onChange={(e) => setCardSkillLevel(index, parseInt(e.target.value))}
          style={{ display: selectedCard ? 'block' : 'none' }}
        >
          {Array.from({ length: 14 }, (_, i) => 14 - i).map((level) => (
            <option key={level} value={level}>
              Lv.{level}
            </option>
          ))}
        </select>
      </div>

      {selectedCard && (
        <div className="skill-params" style={{ display: 'block' }}>
          <div className="skill-param-row">
            <label>AP消費:</label>
            <span className="skill-param-value">{selectedCard.apCost}</span>
          </div>

          {/* スキル効果の表示 */}
          {(() => {
            const skillMultipliers = [
              1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 2.0, 2.2, 2.4, 2.6, 3.0,
            ]
            const multiplier = skillMultipliers[skillLevel - 1]

            const calculateValue = (baseValue: number, isPercentage: boolean = true) => {
              const calculated = (baseValue / 2) * multiplier
              if (isPercentage) {
                const rounded = Math.round(calculated * 10000) / 10000
                return Math.floor(rounded * 10000) / 10000
              } else {
                return Math.floor(calculated)
              }
            }

            const renderEffect = (effect: Effect, effectPath: string = ''): React.ReactNode => {
              const effectKey = effectPath || effect.type
              const hasCustomValue = cardCustomValues[effectKey] !== undefined
              const customValue = cardCustomValues[effectKey]

              switch (effect.type) {
                case 'scoreBoost':
                  if (effect.value !== undefined) {
                    const defaultValue = calculateValue(effect.value)
                    return (
                      <div className="skill-param-row">
                        <label>スコアブースト:</label>
                        <input
                          type="number"
                          className={`skill-param-input ${hasCustomValue ? 'custom' : ''}`}
                          value={hasCustomValue ? customValue : defaultValue}
                          placeholder={defaultValue.toString()}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value)
                            if (!isNaN(value) && value !== defaultValue) {
                              setCustomSkillValue(index, effectKey, value)
                            } else if (value === defaultValue || e.target.value === '') {
                              // Remove custom value if it matches default
                              const newCustomValues = { ...cardCustomValues }
                              delete newCustomValues[effectKey]
                              if (Object.keys(newCustomValues).length === 0) {
                                clearCustomSkillValues(index)
                              } else {
                                setCustomSkillValue(index, effectKey, defaultValue)
                              }
                            }
                          }}
                          step="0.001"
                        />
                      </div>
                    )
                  }
                  break

                case 'voltageBoost':
                  if (effect.value !== undefined) {
                    const defaultValue = calculateValue(effect.value)
                    return (
                      <div className="skill-param-row">
                        <label>ボルテージブースト:</label>
                        <input
                          type="number"
                          value={hasCustomValue ? customValue : defaultValue}
                          placeholder={defaultValue.toString()}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value)
                            if (!isNaN(value) && value !== defaultValue) {
                              setCustomSkillValue(index, effectKey, value)
                            } else if (value === defaultValue || e.target.value === '') {
                              const newCustomValues = { ...cardCustomValues }
                              delete newCustomValues[effectKey]
                              if (Object.keys(newCustomValues).length === 0) {
                                clearCustomSkillValues(index)
                              } else {
                                setCustomSkillValue(index, effectKey, defaultValue)
                              }
                            }
                          }}
                          step="0.001"
                          className={`skill-param-input ${hasCustomValue ? 'custom' : ''}`}
                        />
                      </div>
                    )
                  }
                  break

                case 'scoreGain':
                  if (effect.value !== undefined) {
                    const defaultValue = calculateValue(effect.value)
                    return (
                      <div className="skill-param-row">
                        <label>スコア獲得倍率:</label>
                        <input
                          type="number"
                          value={hasCustomValue ? customValue : defaultValue}
                          placeholder={defaultValue.toString()}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value)
                            if (!isNaN(value) && value !== defaultValue) {
                              setCustomSkillValue(index, effectKey, value)
                            } else if (value === defaultValue || e.target.value === '') {
                              const newCustomValues = { ...cardCustomValues }
                              delete newCustomValues[effectKey]
                              if (Object.keys(newCustomValues).length === 0) {
                                clearCustomSkillValues(index)
                              } else {
                                setCustomSkillValue(index, effectKey, defaultValue)
                              }
                            }
                          }}
                          step="0.01"
                          className={`skill-param-input ${hasCustomValue ? 'custom' : ''}`}
                        />
                      </div>
                    )
                  }
                  break

                case 'voltageGain':
                  if (effect.value !== undefined) {
                    const defaultValue = calculateValue(effect.value, false)
                    return (
                      <div className="skill-param-row">
                        <label>ボルテージ獲得:</label>
                        <input
                          type="number"
                          value={hasCustomValue ? customValue : defaultValue}
                          placeholder={defaultValue.toString()}
                          onChange={(e) => {
                            const value = parseInt(e.target.value)
                            if (!isNaN(value) && value !== defaultValue) {
                              setCustomSkillValue(index, effectKey, value)
                            } else if (value === defaultValue || e.target.value === '') {
                              const newCustomValues = { ...cardCustomValues }
                              delete newCustomValues[effectKey]
                              if (Object.keys(newCustomValues).length === 0) {
                                clearCustomSkillValues(index)
                              } else {
                                setCustomSkillValue(index, effectKey, defaultValue)
                              }
                            }
                          }}
                          step="1"
                          className={`skill-param-input ${hasCustomValue ? 'custom' : ''}`}
                        />
                      </div>
                    )
                  }
                  break

                case 'apGain':
                  if (effect.value !== undefined) {
                    const defaultValue = Math.floor(
                      effect.levelValues?.[skillLevel - 1] ?? calculateValue(effect.value, false),
                    )
                    return (
                      <div className="skill-param-row">
                        <label>AP獲得:</label>
                        <input
                          type="number"
                          value={hasCustomValue ? customValue : defaultValue}
                          placeholder={defaultValue.toString()}
                          onChange={(e) => {
                            const value = parseInt(e.target.value)
                            if (!isNaN(value) && value !== defaultValue) {
                              setCustomSkillValue(index, effectKey, value)
                            } else if (value === defaultValue || e.target.value === '') {
                              const newCustomValues = { ...cardCustomValues }
                              delete newCustomValues[effectKey]
                              if (Object.keys(newCustomValues).length === 0) {
                                clearCustomSkillValues(index)
                              } else {
                                setCustomSkillValue(index, effectKey, defaultValue)
                              }
                            }
                          }}
                          step="1"
                          className={`skill-param-input ${hasCustomValue ? 'custom' : ''}`}
                        />
                      </div>
                    )
                  }
                  break

                case 'mentalRecover':
                  if (
                    effect.levelValues &&
                    effect.levelValues[skillLevel - 1] !== undefined
                  ) {
                    return (
                      <div className="skill-param-row">
                        <label>メンタル回復:</label>
                        <span
                          className="skill-param-value"
                          style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}
                        >
                          +{effect.levelValues[skillLevel - 1]}%
                        </span>
                      </div>
                    )
                  } else if (effect.value !== undefined) {
                    return (
                      <div className="skill-param-row">
                        <label>メンタル回復:</label>
                        <span
                          className="skill-param-value"
                          style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}
                        >
                          +{effect.value}%
                        </span>
                      </div>
                    )
                  }
                  break

                case 'mentalReduction':
                  if (
                    effect.levelValues &&
                    effect.levelValues[skillLevel - 1] !== undefined
                  ) {
                    return (
                      <div className="skill-param-row">
                        <label>メンタル減少:</label>
                        <span
                          className="skill-param-value"
                          style={{ backgroundColor: '#ffebee', color: '#c62828' }}
                        >
                          -{effect.levelValues[skillLevel - 1]}%
                        </span>
                      </div>
                    )
                  } else if (effect.value !== undefined) {
                    return (
                      <div className="skill-param-row">
                        <label>メンタル減少:</label>
                        <span
                          className="skill-param-value"
                          style={{ backgroundColor: '#ffebee', color: '#c62828' }}
                        >
                          -{effect.value}%
                        </span>
                      </div>
                    )
                  }
                  break

                case 'voltagePenalty':
                  if (effect.value !== undefined) {
                    return (
                      <div className="skill-param-row">
                        <label>ボルテージ減少:</label>
                        <span
                          className="skill-param-value"
                          style={{ backgroundColor: '#ffebee', color: '#c62828' }}
                        >
                          -{effect.value}
                        </span>
                      </div>
                    )
                  }
                  break

                case 'removeAfterUse':
                case 'skipTurn':
                  return (
                    <div className="skill-param-row">
                      <label>効果:</label>
                      <span className="skill-param-value">
                        {effect.description || 'ターンスキップ'}
                      </span>
                    </div>
                  )

                case 'visualOnly':
                  return (
                    <div className="skill-param-row">
                      <label>効果:</label>
                      <span
                        className="skill-param-value"
                        style={{ color: '#9e9e9e', fontStyle: 'italic' }}
                      >
                        {effect.description}
                      </span>
                    </div>
                  )

                case 'resetCardTurn':
                  return (
                    <div className="skill-param-row">
                      <label>効果:</label>
                      <span
                        className="skill-param-value"
                        style={{ backgroundColor: '#e3f2fd', color: '#1565c0' }}
                      >
                        {effect.description || '山札リセット'}
                      </span>
                    </div>
                  )

                case 'conditional':
                  return (
                    <div className="conditional-effect-container">
                      <div className="conditional-effect-header">
                        {formatConditionToJapanese(effect.condition)}
                      </div>

                      {/* then効果の表示 */}
                      {effect.then && effect.then.length > 0 && (
                        <div>
                          <div className="conditional-effect-label">▶ 成立時</div>
                          {effect.then.map((thenEffect: Effect, i: number) => {
                            const rendered = renderEffect(thenEffect, `${effectPath}_then_${i}`)
                            return rendered ? (
                              <React.Fragment key={`then-${i}`}>{rendered}</React.Fragment>
                            ) : null
                          })}
                        </div>
                      )}

                      {/* else効果の表示 */}
                      {effect.else && effect.else.length > 0 && (
                        <div style={{ marginTop: '5px' }}>
                          <div className="conditional-effect-label failure">▶ 不成立時</div>
                          {effect.else.map((elseEffect: Effect, i: number) => {
                            const rendered = renderEffect(elseEffect, `${effectPath}_else_${i}`)
                            return rendered ? (
                              <React.Fragment key={`else-${i}`}>{rendered}</React.Fragment>
                            ) : null
                          })}
                        </div>
                      )}
                    </div>
                  )
              }

              // トリガー条件の表示
              const effectWithTrigger = effect as Effect & {
                trigger?: { turn?: number; cardName?: string }
              }
              if (effectWithTrigger.trigger?.turn) {
                return (
                  <div className="skill-param-row">
                    <label style={{ color: '#666', fontSize: '13px' }}>
                      発動ターン: {effectWithTrigger.trigger.turn}
                    </label>
                  </div>
                )
              }

              if (effectWithTrigger.trigger?.cardName) {
                return (
                  <div className="skill-param-row">
                    <label style={{ color: '#666', fontSize: '13px' }}>
                      条件: {effectWithTrigger.trigger.cardName}が編成内
                    </label>
                  </div>
                )
              }

              return null
            }

            return selectedCard.effects.map((effect, idx) => (
              <React.Fragment key={idx}>{renderEffect(effect, `effect_${idx}`)}</React.Fragment>
            ))
          })()}

          {/* 特殊なカードの追加入力 */}
          {selectedCard.name === 'fantasyGin' && (
            <div className="skill-param-row">
              <label>何回デッキリセット？:</label>
              <input
                type="number"
                value={cardCustomValues['deckResetCount'] || 999}
                min="0"
                step="1"
                onChange={(e) => {
                  const value = parseInt(e.target.value)
                  if (!isNaN(value)) {
                    setCustomSkillValue(index, 'deckResetCount', value)
                  }
                }}
                style={{
                  padding: '5px',
                  border: '1px solid #ddd',
                  borderRadius: '3px',
                  width: '80px',
                  backgroundColor:
                    cardCustomValues['deckResetCount'] !== undefined ? '#fffbdd' : 'white',
                }}
              />
              <div style={{ color: '#666', fontSize: '12px', marginTop: '5px', width: '100%' }}>
                デッキリセットする回数を指定（0=リセットなし、999=常にリセット）
              </div>
            </div>
          )}

          {/* センタースキル表示（センターキャラクターの場合のみ） */}
          {isCenter && selectedCard.centerSkill && (
            <div className="center-skill-info">
              <div
                className="skill-param-row"
                style={{ alignItems: 'flex-start', marginBottom: '10px' }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#ff9800', fontWeight: 'bold', fontSize: '13px' }}>
                    センタースキル
                  </span>
                  <select
                    className="skill-level-select"
                    value={centerSkillLevel}
                    onChange={(e) => setCenterSkillLevel(index, parseInt(e.target.value))}
                  >
                    {Array.from({ length: 14 }, (_, i) => 14 - i).map((level) => (
                      <option key={level} value={level}>
                        Lv.{level}
                      </option>
                    ))}
                  </select>
                </span>
              </div>

              {/* センタースキルのタイミング表示 */}
              <div
                style={{ color: '#ff9800', fontWeight: 'bold', fontSize: '14px', margin: '5px 0' }}
              >
                ⚡{' '}
                {selectedCard.centerSkill.when === 'beforeFirstTurn'
                  ? 'ライブ開始時'
                  : selectedCard.centerSkill.when === 'beforeFeverStart'
                    ? 'FEVER開始時'
                    : selectedCard.centerSkill.when === 'afterLastTurn'
                      ? 'ライブ終了時'
                      : selectedCard.centerSkill.when}
              </div>

              {/* センタースキルの効果表示 */}
              {(() => {
                const skillMultipliers = [
                  1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 2.0, 2.2, 2.4, 2.6, 3.0,
                ]
                const multiplier = skillMultipliers[centerSkillLevel - 1] || 1

                const renderCenterEffect = (effect: Effect, effectPath: string) => {
                  const effectKey = effectPath
                  const hasCustomValue = centerCustomValues[effectKey] !== undefined
                  const customValue = centerCustomValues[effectKey]

                  const calculateCenterValue = (baseValue: number) => {
                    // Center skills store actual Lv.10 values, not doubled like regular skills
                    // So we use a different formula: value * multiplier / 2.0
                    const calculated = baseValue * multiplier / 2.0
                    // 小数点第3位で切り捨て
                    return Math.floor(calculated * 1000) / 1000
                  }

                  switch (effect.type) {
                    case 'apGain':
                      if (
                        effect.levelValues &&
                        effect.levelValues[centerSkillLevel - 1] !== undefined
                      ) {
                        return (
                          <div className="skill-param-row">
                            <label>AP獲得:</label>
                            <span
                              className="skill-param-value"
                              style={{
                                backgroundColor: '#e3f2fd',
                                color: '#1976d2',
                                fontWeight: 'bold',
                              }}
                            >
                              +{effect.levelValues[centerSkillLevel - 1]}
                            </span>
                          </div>
                        )
                      } else if (effect.value !== undefined) {
                        const defaultValue = Math.floor(effect.value * multiplier)
                        return (
                          <div className="skill-param-row">
                            <label>AP獲得:</label>
                            <div style={{ position: 'relative', flex: 1, minWidth: '100px' }}>
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '10px',
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  color: '#1976d2',
                                  fontWeight: 'bold',
                                  pointerEvents: 'none',
                                }}
                              >
                                +
                              </span>
                              <input
                                type="number"
                                className={`skill-param-input ${hasCustomValue ? 'custom' : ''}`}
                                style={{
                                  paddingLeft: '25px',
                                  backgroundColor: hasCustomValue ? '#fffbdd' : '#e3f2fd',
                                  color: '#1976d2',
                                  fontWeight: 'bold',
                                }}
                                value={hasCustomValue ? customValue : defaultValue}
                                placeholder={defaultValue.toString()}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value)
                                  if (!isNaN(value) && value !== defaultValue) {
                                    setCustomCenterSkillValue(index, effectKey, value)
                                  } else if (value === defaultValue || e.target.value === '') {
                                    const newCustomValues = { ...centerCustomValues }
                                    delete newCustomValues[effectKey]
                                    if (Object.keys(newCustomValues).length === 0) {
                                      clearCustomCenterSkillValues(index)
                                    } else {
                                      setCustomCenterSkillValue(index, effectKey, defaultValue)
                                    }
                                  }
                                }}
                                step="1"
                              />
                            </div>
                          </div>
                        )
                      }
                      break

                    case 'scoreGain':
                      if (effect.value !== undefined) {
                        const defaultValue = calculateCenterValue(effect.value)
                        return (
                          <div className="skill-param-row">
                            <label>スコア獲得:</label>
                            <input
                              type="number"
                              className={`skill-param-input ${hasCustomValue ? 'custom' : ''}`}
                              value={hasCustomValue ? customValue : defaultValue}
                              placeholder={defaultValue.toString()}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value)
                                if (!isNaN(value) && value !== defaultValue) {
                                  setCustomCenterSkillValue(index, effectKey, value)
                                } else if (value === defaultValue || e.target.value === '') {
                                  const newCustomValues = { ...centerCustomValues }
                                  delete newCustomValues[effectKey]
                                  if (Object.keys(newCustomValues).length === 0) {
                                    clearCustomCenterSkillValues(index)
                                  } else {
                                    setCustomCenterSkillValue(index, effectKey, defaultValue)
                                  }
                                }
                              }}
                              step="0.001"
                            />
                          </div>
                        )
                      }
                      break

                    case 'voltageGain':
                      if (effect.value !== undefined) {
                        // Center skills store actual Lv.10 values, not doubled like regular skills
                        // So we use a different formula: value * multiplier / 2.0
                        const defaultValue = Math.floor(effect.value * multiplier / 2.0)
                        return (
                          <div className="skill-param-row">
                            <label>ボルテージ獲得:</label>
                            <input
                              type="number"
                              className={`skill-param-input ${hasCustomValue ? 'custom' : ''}`}
                              value={hasCustomValue ? customValue : defaultValue}
                              placeholder={defaultValue.toString()}
                              onChange={(e) => {
                                const value = parseInt(e.target.value)
                                if (!isNaN(value) && value !== defaultValue) {
                                  setCustomCenterSkillValue(index, effectKey, value)
                                } else if (value === defaultValue || e.target.value === '') {
                                  const newCustomValues = { ...centerCustomValues }
                                  delete newCustomValues[effectKey]
                                  if (Object.keys(newCustomValues).length === 0) {
                                    clearCustomCenterSkillValues(index)
                                  } else {
                                    setCustomCenterSkillValue(index, effectKey, defaultValue)
                                  }
                                }
                              }}
                              step="1"
                            />
                          </div>
                        )
                      }
                      break

                    case 'scoreBoost':
                      if (effect.value !== undefined) {
                        const defaultValue = calculateCenterValue(effect.value)
                        return (
                          <div className="skill-param-row">
                            <label>スコアブースト:</label>
                            <input
                              type="number"
                              className={`skill-param-input ${hasCustomValue ? 'custom' : ''}`}
                              value={hasCustomValue ? customValue : defaultValue}
                              placeholder={defaultValue.toString()}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value)
                                if (!isNaN(value) && value !== defaultValue) {
                                  setCustomCenterSkillValue(index, effectKey, value)
                                } else if (value === defaultValue || e.target.value === '') {
                                  const newCustomValues = { ...centerCustomValues }
                                  delete newCustomValues[effectKey]
                                  if (Object.keys(newCustomValues).length === 0) {
                                    clearCustomCenterSkillValues(index)
                                  } else {
                                    setCustomCenterSkillValue(index, effectKey, defaultValue)
                                  }
                                }
                              }}
                              step="0.001"
                            />
                          </div>
                        )
                      }
                      break

                    case 'voltageBoost':
                      if (effect.value !== undefined) {
                        const defaultValue = calculateCenterValue(effect.value)
                        return (
                          <div className="skill-param-row">
                            <label>ボルテージブースト:</label>
                            <input
                              type="number"
                              className={`skill-param-input ${hasCustomValue ? 'custom' : ''}`}
                              value={hasCustomValue ? customValue : defaultValue}
                              placeholder={defaultValue.toString()}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value)
                                if (!isNaN(value) && value !== defaultValue) {
                                  setCustomCenterSkillValue(index, effectKey, value)
                                } else if (value === defaultValue || e.target.value === '') {
                                  const newCustomValues = { ...centerCustomValues }
                                  delete newCustomValues[effectKey]
                                  if (Object.keys(newCustomValues).length === 0) {
                                    clearCustomCenterSkillValues(index)
                                  } else {
                                    setCustomCenterSkillValue(index, effectKey, defaultValue)
                                  }
                                }
                              }}
                              step="0.001"
                            />
                          </div>
                        )
                      }
                      break

                    case 'mentalReduction':
                      if (
                        effect.levelValues &&
                        effect.levelValues[centerSkillLevel - 1] !== undefined
                      ) {
                        return (
                          <div className="skill-param-row">
                            <label>メンタル減少:</label>
                            <span
                              className="skill-param-value"
                              style={{
                                backgroundColor: '#ffebee',
                                color: '#c62828',
                                fontWeight: 'bold',
                              }}
                            >
                              -{effect.levelValues[centerSkillLevel - 1]}%
                            </span>
                          </div>
                        )
                      } else if (effect.value !== undefined) {
                        return (
                          <div className="skill-param-row">
                            <label>メンタル減少:</label>
                            <span
                              className="skill-param-value"
                              style={{
                                backgroundColor: '#ffebee',
                                color: '#c62828',
                                fontWeight: 'bold',
                              }}
                            >
                              -{effect.value}%
                            </span>
                          </div>
                        )
                      }
                      break
                    case 'mentalRecover':
                      if (
                        effect.levelValues &&
                        effect.levelValues[centerSkillLevel - 1] !== undefined
                      ) {
                        return (
                          <div className="skill-param-row">
                            <label>メンタル回復:</label>
                            <span
                              className="skill-param-value"
                              style={{
                                backgroundColor: '#e8f5e9',
                                color: '#2e7d32',
                                fontWeight: 'bold',
                              }}
                            >
                              +{effect.levelValues[centerSkillLevel - 1]}%
                            </span>
                          </div>
                        )
                      } else if (effect.value !== undefined) {
                        return (
                          <div className="skill-param-row">
                            <label>メンタル回復:</label>
                            <span
                              className="skill-param-value"
                              style={{
                                backgroundColor: '#e8f5e9',
                                color: '#2e7d32',
                                fontWeight: 'bold',
                              }}
                            >
                              +{effect.value}%
                            </span>
                          </div>
                        )
                      }
                      break

                    case 'conditional':
                      // 条件付き効果の表示（センタースキル用）
                      return (
                        <div className="conditional-effect-container">
                          <div className="conditional-effect-header">
                            {formatConditionToJapanese(effect.condition)}
                          </div>

                          {effect.then && effect.then.length > 0 && (
                            <div>
                              <div className="conditional-effect-label">▶ 成立時</div>
                              {effect.then.map((thenEffect: Effect, i: number) => {
                                const rendered = renderCenterEffect(
                                  thenEffect,
                                  `${effectPath}_then_${i}`,
                                )
                                return rendered ? (
                                  <React.Fragment key={`then-${i}`}>{rendered}</React.Fragment>
                                ) : null
                              })}
                            </div>
                          )}
                        </div>
                      )
                  }

                  return null
                }

                const hasParams = selectedCard.centerSkill.effects.some(
                  (effect: Effect, idx: number) => {
                    return renderCenterEffect(effect, `center_effect_${idx}`) !== null
                  },
                )

                if (hasParams) {
                  return selectedCard.centerSkill.effects.map((effect: Effect, idx: number) => (
                    <React.Fragment key={`center-${idx}`}>
                      {renderCenterEffect(effect, `center_effect_${idx}`)}
                    </React.Fragment>
                  ))
                } else {
                  return (
                    <div style={{ color: '#666', fontSize: '14px' }}>
                      このセンタースキルには調整可能なパラメータがありません
                    </div>
                  )
                }
              })()}
            </div>
          )}

          {/* センター特性表示（センターキャラクターの場合のみ） */}
          {isCenter && selectedCard.centerCharacteristic && (
            <div className="center-characteristic-info">
              <div className="center-characteristic-header">センター特性</div>
              <div className="center-characteristic-content">
                {selectedCard.centerCharacteristic.effects
                  .map((effect: Effect, idx: number) => {
                    if (effect.type === 'appealBoost') {
                      const percentage = Math.round(effect.value * 100)
                      const target =
                        effect.target === 'all'
                          ? '全員'
                          : effect.target === '102期'
                            ? '102期生'
                            : effect.target === '103期'
                              ? '103期生'
                              : effect.target === '104期'
                                ? '104期生'
                                : effect.target
                      return (
                        <div key={idx}>
                          {target}のアピール値が{percentage}%上昇
                        </div>
                      )
                    } else if (effect.type === 'apReduce') {
                      return <div key={idx}>全てのスキルの消費APが{effect.value}減少</div>
                    } else if (effect.type === 'visualOnly') {
                      return (
                        <div key={idx} style={{ color: '#9e9e9e', fontStyle: 'italic' }}>
                          {effect.description}
                        </div>
                      )
                    }
                    return null
                  })
                  .filter(Boolean)}
              </div>
            </div>
          )}

          {/* アピール値表示（下部に配置） */}
          <div
            className="skill-param-row"
            style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e0e0e0' }}
          >
            <label>アピール値:</label>
            <div className="card-stats">
              <span className="stat stat--smile">♪ {selectedCard.stats.smile}</span>
              <span className="stat stat--pure">♥ {selectedCard.stats.pure}</span>
              <span className="stat stat--cool">☆ {selectedCard.stats.cool}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
