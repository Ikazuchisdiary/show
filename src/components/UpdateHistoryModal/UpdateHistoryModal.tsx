import React from 'react'
import { updateHistory } from '@core/data/updateHistory'
import './UpdateHistoryModal.css'

interface UpdateHistoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export const UpdateHistoryModal: React.FC<UpdateHistoryModalProps> = ({ isOpen, onClose }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal" onClick={handleBackdropClick} style={{ display: 'flex' }}>
      <div className="modal-content update-history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>アップデート履歴</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div id="updateHistoryContent">
            {updateHistory.map((entry, index) => (
              <div key={index} className="update-entry">
                <div className="update-version">
                  <span className="version-badge">v{entry.version}</span>
                  <span className="update-date">{entry.date}</span>
                </div>
                <ul className="update-changes">
                  {entry.changes.map((change, changeIndex) => (
                    <li key={changeIndex}>{change}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
