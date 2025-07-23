// Update history data
const updateHistory = [
    {
        version: "2025.07.24.2",
        date: "2025-07-24",
        time: "02:48",
        updates: [
            "共有モードで楽曲選択を無効化",
            "共有モードからの保存でコンボ数・属性も保存されるように修正",
            "カスタム楽曲選択時は常に設定画面を表示",
            "カスタム楽曲の上書き保存機能を追加（ボタンが動的に変化）",
            "共有モードでカスタム楽曲の保存機能を非表示に",
            "カスタム楽曲保存後に自動選択されるように修正"
        ]
    },
    {
        version: "2025.07.24.1",
        date: "2025-07-24",
        time: "01:15",
        updates: [
            "新カード追加: ［ツキマカセ］夕霧綴理"
        ]
    },
    {
        version: "2025.07.23.3",
        date: "2025-07-23",
        time: "23:55",
        updates: [
            "センター特性を追加: ［18th Birthday］乙宗梢",
            "センター特性を追加: ［17th Birthday］大沢瑠璃乃"
        ]
    },
    {
        version: "2025.07.23.2",
        date: "2025-07-23",
        time: "23:48",
        updates: [
            "新カード追加: ［18th Birthday］夕霧綴理",
            "新カード追加: ［福音の銀河へ］夕霧綴理",
            "AP削減処理をセンター特性データを参照する方式に改善"
        ]
    },
    {
        version: "2025.07.23.1a",
        date: "2025-07-23",
        time: "23:20",
        updates: [
            "【大型アップデート】アピール値の自動計算機能を実装"
        ]
    },
    {
        version: "2025.07.23.1",
        date: "2025-07-23",
        time: "00:30",
        updates: [
            "【大型アップデート】APに関する機能をいろいろ追加"
        ]
    },
    {
        version: "2025.07.22.4",
        date: "2025-07-22",
        time: "18:04",
        updates: [
            "37.5度のファンタジーのデッキリセット回数をURL共有に含めるように修正"
        ]
    },
    {
        version: "2025.07.22.3",
        date: "2025-07-22",
        time: "16:46",
        updates: [
            "アップデート通知機能を追加",
            "通知バナーのレイアウトを改善",
            "アップデート履歴の表示機能を追加"
        ]
    },
    {
        version: "2025.07.22.2",
        date: "2025-07-22",
        time: "15:38",
        updates: [
            "共有された編成が正しく表示されるように修正"
        ]
    },
    {
        version: "2025.07.22.1",
        date: "2025-07-22",
        time: "02:34",
        updates: [
            "新カード追加: ［レディバグ］徒町小鈴",
            "複数カードのスキル値を修正"
        ]
    },
    {
        version: "2025.07.21.3",
        date: "2025-07-21",
        time: "23:42",
        updates: [
            "カスタム楽曲の共有機能を修正"
        ]
    },
    {
        version: "2025.07.21.2",
        date: "2025-07-21",
        time: "23:24", 
        updates: [
            "共有された編成の保存動作を改善",
            "URLサイズ削減",
            "デフォルト楽曲を「愛♡スクリ〜ム！」に変更"
        ]
    },
    {
        version: "2025.07.21.1",
        date: "2025-07-21",
        time: "20:34",
        updates: [
            "URL共有機能の実装"
        ]
    },
    {
        version: "2025.07.17.1",
        date: "2025-07-17",
        time: "13:37",
        updates: [
            "センタースキル発動ログの改善"
        ]
    },
    {
        version: "2025.07.16.2",
        date: "2025-07-16",
        time: "17:35",
        updates: [
            "104期Ver.楽曲を9曲追加"
        ]
    },
    {
        version: "2025.07.16.1",
        date: "2025-07-16",
        time: "00:10",
        updates: [
            "楽曲データを15曲追加",
            "On your mark (104期Ver.)のフェーズデータを修正"
        ]
    }
];

// Check for updates
function checkForUpdates() {
    const lastViewedVersion = localStorage.getItem('sukushou_last_viewed_version');
    const currentVersion = updateHistory[0].version;
    
    if (lastViewedVersion !== currentVersion) {
        document.getElementById('updateBanner').style.display = 'block';
    }
}

// Show update history
function showUpdateHistory() {
    const modal = document.getElementById('updateHistoryModal');
    const content = document.getElementById('updateHistoryContent');
    
    // Build update history HTML
    let html = '';
    
    updateHistory.forEach(update => {
        html += `
            <div class="update-entry">
                <div class="update-header">
                    <span class="update-datetime">
                        <span class="update-date">${update.date}</span>
                        ${update.time ? `<span class="update-time">${update.time}</span>` : ''}
                    </span>
                </div>
                <ul class="update-list">
                    ${update.updates.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
    });
    
    content.innerHTML = html;
    modal.style.display = 'flex';
    
    // Mark as viewed if opened from banner
    if (document.getElementById('updateBanner').style.display !== 'none') {
        localStorage.setItem('sukushou_last_viewed_version', updateHistory[0].version);
        document.getElementById('updateBanner').style.display = 'none';
    }
}

// Close update history
function closeUpdateHistory(event) {
    // If event is passed and it's not a direct call from the close button
    if (event && event.target === document.getElementById('updateHistoryModal')) {
        document.getElementById('updateHistoryModal').style.display = 'none';
    } else if (!event) {
        // Direct call from close button
        document.getElementById('updateHistoryModal').style.display = 'none';
    }
}

// Dismiss update banner
function dismissUpdateBanner() {
    localStorage.setItem('sukushou_last_viewed_version', updateHistory[0].version);
    document.getElementById('updateBanner').style.display = 'none';
}