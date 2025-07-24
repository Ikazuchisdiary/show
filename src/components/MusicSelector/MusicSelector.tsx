import React, { useState, useRef, useEffect } from 'react'
import { useGameStore } from '@stores/gameStore'
import { useMusicStore } from '@stores/musicStore'
import { getAllMusic } from '@data/index'
import { CustomMusic } from '@core/models/Music'
import './MusicSelector.css'

export const MusicSelector: React.FC = () => {
  const { 
    selectedMusic, 
    selectedDifficulty, 
    initialMental,
    setMusic, 
    setDifficulty,
    setInitialMental
  } = useGameStore()
  
  const { customMusicList, addCustomMusic, deleteCustomMusic, generateCustomMusicId } = useMusicStore()
  
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCustomMusic, setShowCustomMusic] = useState(false)
  const [isActiveDropdown, setIsActiveDropdown] = useState(false)
  const [customPhases, setCustomPhases] = useState({
    beforeFever: 11,
    duringFever: 7,
    afterFever: 5
  })
  const [customCombos, setCustomCombos] = useState({
    normal: 287,
    hard: 536,
    expert: 1278,
    master: 1857
  })
  const [customMusicName, setCustomMusicName] = useState('')
  
  // Determine if we're in overwrite mode
  const isOverwriteMode = () => {
    const name = customMusicName.trim()
    if (!name) return false
    
    // Check if we're updating the current custom music
    if (selectedMusic?.name.startsWith('custom_') && 
        Object.values(customMusicList).find(m => m.name === selectedMusic.name)?.name === name) {
      return true
    }
    
    // Check if a different custom music with this name exists
    return Object.values(customMusicList).some(music => music.name === name)
  }
  const dropdownRef = useRef<HTMLDivElement>(null)
  const displayRef = useRef<HTMLDivElement>(null)
  
  const allMusic = getAllMusic()
  const customMusicArray = Object.values(customMusicList)
  
  // Set default music if none selected
  useEffect(() => {
    if (!selectedMusic && allMusic.length > 0) {
      setMusic(allMusic[0])
    }
  }, [selectedMusic, allMusic, setMusic])
  
  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          displayRef.current && !displayRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
        setIsActiveDropdown(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const filteredMusic = [...allMusic, ...customMusicArray].filter(music => {
    const query = searchQuery.toLowerCase()
    return music.name.toLowerCase().includes(query) ||
           (music.centerCharacter && music.centerCharacter.toLowerCase().includes(query))
  })
  
  const handleMusicSelect = (music: any) => {
    setMusic(music)
    setShowDropdown(false)
    setIsActiveDropdown(false)
    setSearchQuery('')
    
    // If it's a custom music, show the editor
    if (music.id && music.id.startsWith('custom_')) {
      setShowCustomMusic(true)
      // Load the custom music data into the form
      setCustomPhases({
        beforeFever: music.phases[0],
        duringFever: music.phases[1],
        afterFever: music.phases[2]
      })
      setCustomCombos(music.combos || {
        normal: 287,
        hard: 536,
        expert: 1278,
        master: 1857
      })
      setCustomMusicName(music.name)
    } else {
      setShowCustomMusic(false)
    }
  }
  
  const toggleDropdown = () => {
    if (!showDropdown) {
      setSearchQuery('')
    }
    setShowDropdown(!showDropdown)
    setIsActiveDropdown(!showDropdown)
  }
  
  const handleCustomSelect = () => {
    setShowCustomMusic(true)
    setShowDropdown(false)
    setIsActiveDropdown(false)
    
    // Inherit phases from previous music if available
    if (selectedMusic && selectedMusic.phases) {
      setCustomPhases({
        beforeFever: selectedMusic.phases[0],
        duringFever: selectedMusic.phases[1],
        afterFever: selectedMusic.phases[2]
      })
    }
    
    // Inherit combo values from previous music if available
    if (selectedMusic && 'combos' in selectedMusic) {
      setCustomCombos({
        normal: selectedMusic.combos?.normal || 287,
        hard: selectedMusic.combos?.hard || 536,
        expert: selectedMusic.combos?.expert || 1278,
        master: selectedMusic.combos?.master || 1857
      })
    }
    
    // Set custom music immediately, inheriting all values from previous selection
    const customMusic = {
      name: 'カスタム',
      centerCharacter: selectedMusic?.centerCharacter || '',
      attribute: selectedMusic?.attribute || 'smile' as const,
      phases: selectedMusic?.phases || [customPhases.beforeFever, customPhases.duringFever, customPhases.afterFever] as [number, number, number]
    }
    setMusic(customMusic)
  }
  
  const formatPhases = (phases: number[]) => {
    return `${phases[0]}-${phases[1]}-${phases[2]}`
  }
  
  const handleCustomPhaseChange = (field: string, value: number) => {
    const newPhases = { ...customPhases, [field]: value }
    setCustomPhases(newPhases)
    
    // Update the music if custom is selected or editing a saved custom music
    if (selectedMusic && (selectedMusic.name === 'カスタム' || selectedMusic.id?.startsWith('custom_'))) {
      const customMusic = {
        ...selectedMusic,
        phases: [newPhases.beforeFever, newPhases.duringFever, newPhases.afterFever] as [number, number, number]
      }
      setMusic(customMusic)
    }
  }
  
  const handleCustomCenterChange = (center: string) => {
    if (selectedMusic && (selectedMusic.name === 'カスタム' || selectedMusic.id?.startsWith('custom_'))) {
      const customMusic = {
        ...selectedMusic,
        centerCharacter: center
      }
      setMusic(customMusic)
    }
  }
  
  const handleCustomAttributeChange = (attribute: string) => {
    if (selectedMusic && (selectedMusic.name === 'カスタム' || selectedMusic.id?.startsWith('custom_'))) {
      const customMusic = {
        ...selectedMusic,
        attribute: attribute as 'smile' | 'pure' | 'cool'
      }
      setMusic(customMusic)
    }
  }
  
  const handleCustomComboChange = (difficulty: string, value: number) => {
    const newCombos = { ...customCombos, [difficulty]: value }
    setCustomCombos(newCombos)
    
    // Update the music if editing a saved custom music
    if (selectedMusic && selectedMusic.id?.startsWith('custom_')) {
      const customMusic = {
        ...selectedMusic,
        combos: newCombos
      }
      setMusic(customMusic as any)
    }
  }
  
  const handleSaveCustomMusic = () => {
    if (!customMusicName.trim()) {
      alert('楽曲名を入力してください')
      return
    }
    
    // Check if we're updating an existing custom music
    let musicId = generateCustomMusicId()
    const existingMusic = Object.entries(customMusicList).find(([_, m]) => m.name === customMusicName)
    if (existingMusic) {
      musicId = existingMusic[0]
    }
    
    const customMusic: CustomMusic = {
      id: musicId,
      name: customMusicName,
      phases: [customPhases.beforeFever, customPhases.duringFever, customPhases.afterFever] as [number, number, number],
      centerCharacter: selectedMusic?.centerCharacter || '',
      attribute: (selectedMusic?.attribute || 'smile') as 'smile' | 'pure' | 'cool',
      combos: customCombos
    }
    
    addCustomMusic(customMusic)
    setMusic(customMusic)
    setCustomMusicName('')
    const isUpdate = isOverwriteMode()
    alert(`「${customMusicName}」を${isUpdate ? '更新' : '保存'}しました`)
  }
  
  return (
    <div className="music-info-section">
      <div className="section-header">
        <h3>楽曲情報</h3>
      </div>
      <div className="section-content">
        <div className="form-group">
          <label>楽曲選択:</label>
          <div className="music-select-wrapper">
            <div 
              ref={displayRef}
              className={`music-select-display ${isActiveDropdown ? 'active' : ''}`}
              onClick={toggleDropdown}
            >
              <div className="music-select-value">
                <span className="music-select-title">
                  {selectedMusic ? selectedMusic.name : 'カスタム入力'}
                </span>
                <span className="music-select-info">
                  {selectedMusic ? 
                    (selectedMusic.name === 'カスタム' ? 
                      `${formatPhases(selectedMusic.phases)}${selectedMusic.centerCharacter ? ' • ' + selectedMusic.centerCharacter : ''}` :
                      `${formatPhases(selectedMusic.phases)} • ${selectedMusic.centerCharacter}`
                    ) : ''}
                </span>
              </div>
              <div className="music-select-arrow">▼</div>
            </div>
            
            {showDropdown && (
              <div ref={dropdownRef} className={`music-dropdown ${showDropdown ? 'show' : ''}`}>
                <div className="music-search-container">
                  <input 
                    type="text" 
                    className="music-search-input" 
                    placeholder="楽曲名・センターで検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="music-dropdown-items">
                  {filteredMusic.map((music) => (
                    <div 
                      key={music.name}
                      className="music-dropdown-item"
                      onClick={() => handleMusicSelect(music)}
                    >
                      <div className="music-item-main">
                        <span className="music-title">{music.name}</span>
                        <div className="music-phases">
                          <span className="phase-tag">{music.phases[0]}</span>
                          <span className="phase-arrow">→</span>
                          <span className="phase-tag fever">{music.phases[1]}</span>
                          <span className="phase-arrow">→</span>
                          <span className="phase-tag">{music.phases[2]}</span>
                        </div>
                      </div>
                      <div className="music-item-sub">
                        <span className="center-label">センター:</span>
                        <span className="center-name">{music.centerCharacter}</span>
                      </div>
                    </div>
                  ))}
                  <div 
                    className="music-dropdown-item custom-item"
                    onClick={handleCustomSelect}
                  >
                    <div className="music-item-main">
                      <span className="music-title">カスタム入力</span>
                      <span className="custom-icon">✏️</span>
                    </div>
                    <div className="music-item-sub">
                      <span className="custom-description">楽曲データを自由に設定</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="stats-row">
          <div className="stats-group">
            <label htmlFor="difficulty">難易度</label>
            <select 
              id="difficulty"
              value={selectedDifficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
            >
              <option value="normal">NORMAL</option>
              <option value="hard">HARD</option>
              <option value="expert">EXPERT</option>
              <option value="master">MASTER</option>
            </select>
          </div>
          <div className="stats-group">
            <label htmlFor="mental">初期メンタル (%)</label>
            <input 
              type="number" 
              id="mental" 
              value={initialMental} 
              min="0" 
              max="100"
              onChange={(e) => setInitialMental(parseInt(e.target.value))}
            />
          </div>
          <div className="stats-group">
            <label htmlFor="learningCorrection">ラーニング補正</label>
            <input 
              type="number" 
              id="learningCorrection" 
              defaultValue="1.5" 
              min="0" 
              step="0.01"
            />
          </div>
        </div>
        
        {showCustomMusic && (
          <div className="custom-music-inner">
            <div className="custom-music-card">
              <div className="custom-music-header">
                <h3>カスタム楽曲設定</h3>
              </div>
              
              <div className="phase-inputs-section">
                <div className="section-label">ターン数設定</div>
                <div className="phase-inputs-container">
                  <div className="phase-input-group">
                    <label>フィーバー前</label>
                    <input 
                      type="number" 
                      value={customPhases.beforeFever} 
                      min="0"
                      onChange={(e) => handleCustomPhaseChange('beforeFever', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="phase-separator">→</div>
                  <div className="phase-input-group fever">
                    <label>フィーバー中</label>
                    <input 
                      type="number" 
                      value={customPhases.duringFever} 
                      min="0"
                      onChange={(e) => handleCustomPhaseChange('duringFever', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="phase-separator">→</div>
                  <div className="phase-input-group">
                    <label>フィーバー後</label>
                    <input 
                      type="number" 
                      value={customPhases.afterFever} 
                      min="0"
                      onChange={(e) => handleCustomPhaseChange('afterFever', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="custom-music-settings">
                <div className="setting-row">
                  <label className="setting-label">センターキャラクター</label>
                  <select 
                    id="customCenterCharacter"
                    value={selectedMusic?.centerCharacter || ''}
                    onChange={(e) => handleCustomCenterChange(e.target.value)}
                  >
                    <option value="">なし</option>
                    <option value="乙宗梢">乙宗梢</option>
                    <option value="夕霧綴理">夕霧綴理</option>
                    <option value="藤島慈">藤島慈</option>
                    <option value="日野下花帆">日野下花帆</option>
                    <option value="村野さやか">村野さやか</option>
                    <option value="大沢瑠璃乃">大沢瑠璃乃</option>
                    <option value="百生吟子">百生吟子</option>
                    <option value="徒町小鈴">徒町小鈴</option>
                    <option value="安養寺姫芽">安養寺姫芽</option>
                    <option value="桂城泉">桂城泉</option>
                    <option value="セラス 柳田 リリエンフェルト">セラス 柳田 リリエンフェルト</option>
                  </select>
                </div>
                
                <div className="setting-row">
                  <label className="setting-label">楽曲属性</label>
                  <select 
                    id="customAttribute"
                    value={selectedMusic?.attribute || 'smile'}
                    onChange={(e) => handleCustomAttributeChange(e.target.value)}
                  >
                    <option value="smile">スマイル</option>
                    <option value="pure">ピュア</option>
                    <option value="cool">クール</option>
                  </select>
                </div>
                
                <div className="combo-inputs-section">
                  <div className="section-label">コンボ数設定</div>
                  <div className="combo-inputs-container">
                    <div className="combo-input-group">
                      <label>NORMAL</label>
                      <input 
                        type="number" 
                        value={customCombos.normal}
                        placeholder="287"
                        min="0"
                        onChange={(e) => handleCustomComboChange('normal', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="combo-input-group">
                      <label>HARD</label>
                      <input 
                        type="number" 
                        value={customCombos.hard}
                        placeholder="536"
                        min="0"
                        onChange={(e) => handleCustomComboChange('hard', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="combo-input-group">
                      <label>EXPERT</label>
                      <input 
                        type="number" 
                        value={customCombos.expert}
                        placeholder="1278"
                        min="0"
                        onChange={(e) => handleCustomComboChange('expert', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="combo-input-group">
                      <label>MASTER</label>
                      <input 
                        type="number" 
                        value={customCombos.master}
                        placeholder="1857"
                        min="0"
                        onChange={(e) => handleCustomComboChange('master', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="custom-music-save-section">
                <div className="save-input-group">
                  <input
                    type="text"
                    className="custom-music-name-input"
                    placeholder="カスタム楽曲名を入力"
                    value={customMusicName}
                    onChange={(e) => setCustomMusicName(e.target.value)}
                  />
                  <button 
                    className={`custom-music-save-button ${isOverwriteMode() ? 'overwrite-mode' : ''}`}
                    onClick={handleSaveCustomMusic}
                  >
                    💾 {isOverwriteMode() ? '上書き保存' : '保存'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* 保存済みカスタム楽曲リスト */}
            {Object.keys(customMusicList).length > 0 && (
              <div className="saved-music-container">
                <div className="saved-music-header">保存済みカスタム楽曲</div>
                {Object.entries(customMusicList).map(([id, music]) => (
                  <div key={id} className="saved-music-item">
                    <div className="saved-music-info">
                      <span className="saved-music-name">{music.name}</span>
                      <span className="saved-music-phases">{formatPhases(music.phases)}</span>
                      <span className={`saved-music-attribute ${music.attribute}`}>
                        {music.attribute === 'smile' ? 'スマイル' : 
                         music.attribute === 'pure' ? 'ピュア' : 
                         'クール'}
                      </span>
                      {music.centerCharacter && (
                        <span className="saved-music-center">{music.centerCharacter}</span>
                      )}
                    </div>
                    <button
                      className="delete-button"
                      onClick={() => {
                        if (confirm(`「${music.name}」を削除しますか？`)) {
                          deleteCustomMusic(id)
                          if (selectedMusic?.name === music.name) {
                            setMusic(null)
                          }
                        }
                      }}
                      title="削除"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}