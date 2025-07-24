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
  const [isSavingCustom, setIsSavingCustom] = useState(false)
  const [customMusicName, setCustomMusicName] = useState('')
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
    setShowCustomMusic(false)
    setSearchQuery('')
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
    // Set custom music immediately
    const customMusic = {
      name: 'カスタム',
      centerCharacter: '',
      attribute: 'smile' as const,
      phases: [customPhases.beforeFever, customPhases.duringFever, customPhases.afterFever] as [number, number, number]
    }
    setMusic(customMusic)
  }
  
  const formatPhases = (phases: number[]) => {
    return `${phases[0]}-${phases[1]}-${phases[2]}`
  }
  
  const handleCustomPhaseChange = (field: string, value: number) => {
    const newPhases = { ...customPhases, [field]: value }
    setCustomPhases(newPhases)
    
    // Update the music if custom is selected
    if (selectedMusic && selectedMusic.name === 'カスタム') {
      const customMusic = {
        ...selectedMusic,
        phases: [newPhases.beforeFever, newPhases.duringFever, newPhases.afterFever]
      }
      setMusic(customMusic)
    }
  }
  
  const handleCustomCenterChange = (center: string) => {
    if (selectedMusic && selectedMusic.name === 'カスタム') {
      const customMusic = {
        ...selectedMusic,
        centerCharacter: center
      }
      setMusic(customMusic)
    }
  }
  
  const handleCustomAttributeChange = (attribute: string) => {
    if (selectedMusic && selectedMusic.name === 'カスタム') {
      const customMusic = {
        ...selectedMusic,
        attribute: attribute as 'smile' | 'pure' | 'cool'
      }
      setMusic(customMusic)
    }
  }
  
  const handleSaveCustomMusic = () => {
    if (!customMusicName.trim()) {
      alert('楽曲名を入力してください')
      return
    }
    
    const customMusic: CustomMusic = {
      id: generateCustomMusicId(),
      name: customMusicName,
      phases: [customPhases.beforeFever, customPhases.duringFever, customPhases.afterFever] as [number, number, number],
      centerCharacter: selectedMusic?.centerCharacter || '',
      attribute: (selectedMusic?.attribute || 'smile') as 'smile' | 'pure' | 'cool',
      combos: {
        normal: 100,
        hard: 200,
        expert: 300,
        master: 400
      }
    }
    
    addCustomMusic(customMusic)
    setMusic(customMusic)
    setIsSavingCustom(false)
    setCustomMusicName('')
    setShowCustomMusic(false)
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
                      <div className="music-item-title">{music.name}</div>
                      <div className="music-item-info">
                        {formatPhases(music.phases)} • {music.centerCharacter}
                      </div>
                    </div>
                  ))}
                  <div 
                    className="music-dropdown-item custom-item"
                    onClick={handleCustomSelect}
                  >
                    <div className="music-item-title">📝 カスタム入力</div>
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
                
                <div className="custom-attribute-section">
                  <label htmlFor="customAttribute">楽曲属性</label>
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
              </div>
              
              <div className="custom-music-save-section">
                {!isSavingCustom ? (
                  <button 
                    className="custom-music-save-button"
                    onClick={() => setIsSavingCustom(true)}
                  >
                    この設定を保存
                  </button>
                ) : (
                  <div className="custom-music-save-form">
                    <input
                      type="text"
                      className="custom-music-name-input"
                      placeholder="楽曲名を入力"
                      value={customMusicName}
                      onChange={(e) => setCustomMusicName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveCustomMusic()}
                    />
                    <div className="custom-music-save-actions">
                      <button onClick={handleSaveCustomMusic}>保存</button>
                      <button onClick={() => { setIsSavingCustom(false); setCustomMusicName(''); }}>キャンセル</button>
                    </div>
                  </div>
                )}
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