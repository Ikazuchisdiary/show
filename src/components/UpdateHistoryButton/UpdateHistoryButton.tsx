import React from 'react'
import './UpdateHistoryButton.css'

interface UpdateHistoryButtonProps {
  onClick: () => void
}

export const UpdateHistoryButton: React.FC<UpdateHistoryButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="update-history-button" title="アップデート履歴">
      <span className="update-history-icon">📋</span>
    </button>
  )
}
