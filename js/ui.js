// UI Controller for HUD, Modals, Shop, Logbook & Quests
class UIController {
    constructor() {
        this.activeModal = null;
    }

    init() {
        this.updateHUD();
        this.bindEvents();
    }

    bindEvents() {
        // Audio Toggle
        const audioBtn = document.getElementById('btn-audio');
        if (audioBtn) {
            audioBtn.addEventListener('click', () => {
                const muted = window.audio ? window.audio.toggleMute() : false;
                audioBtn.innerHTML = muted ? '🔇' : '🔊';
                this.showToast(muted ? 'Suara Dimatikan' : 'Suara Diaktifkan');
            });
        }

        // Shop Button
        const shopBtn = document.getElementById('btn-shop');
        if (shopBtn) {
            shopBtn.addEventListener('click', () => this.openShopModal('rods'));
        }

        // Logbook Button
        const logBtn = document.getElementById('btn-log');
        if (logBtn) {
            logBtn.addEventListener('click', () => this.openLogbookModal());
        }

        // Quests Button
        const questBtn = document.getElementById('btn-quests');
        if (questBtn) {
            questBtn.addEventListener('click', () => this.openQuestsModal());
        }

        // Gear Slots quick links
        const slotRod = document.querySelector('.gear-slot[title="Joran"]');
        if (slotRod) slotRod.addEventListener('click', () => this.openShopModal('rods'));

        const slotLine = document.querySelector('.gear-slot[title="Senar"]');
        if (slotLine) slotLine.addEventListener('click', () => this.openShopModal('lines'));

        const slotBait = document.querySelector('.gear-slot[title="Umpan"]');
        if (slotBait) slotBait.addEventListener('click', () => this.openShopModal('baits'));

        const slotSpot = document.querySelector('.gear-slot[title="Lokasi"]');
        if (slotSpot) slotSpot.addEventListener('click', () => this.openShopModal('spots'));

        // Close Buttons for Modals
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => this.closeActiveModal());
        });

        // Close on overlay backdrop click
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) this.closeActiveModal();
            });
        });
    }

    updateHUD() {
        if (!window.storage) return;

        // Coins & Level
        document.getElementById('hud-coins').innerText = window.storage.coins.toLocaleString();
        document.getElementById('hud-level').innerText = window.storage.level;

        // XP Bar
        const currentXP = window.storage.xp;
        const targetXP = window.storage.xpForNextLevel;
        const pct = Math.min(100, Math.floor((currentXP / targetXP) * 100));
        document.getElementById('hud-xp-fill').style.width = `${pct}%`;
        document.getElementById('hud-xp-text').innerText = `${currentXP} / ${targetXP} XP`;

        // Equipped Gear Slots
        const currentRod = SHOP_CATALOG.rods.find(r => r.id === window.storage.data.equippedRod);
        const currentLine = SHOP_CATALOG.lines.find(l => l.id === window.storage.data.equippedLine);
        const currentBait = SHOP_CATALOG.baits.find(b => b.id === window.storage.data.equippedBait);
        const currentSpot = SHOP_CATALOG.spots.find(s => s.id === window.storage.data.equippedSpot);

        if (currentRod) document.getElementById('slot-rod-name').innerText = currentRod.name;
        if (currentLine) document.getElementById('slot-line-name').innerText = currentLine.name;
        if (currentBait) {
            const count = window.storage.data.ownedBaits[currentBait.id];
            const countStr = count === 999 || count === undefined ? 'Tak Terbatas' : `${count}x`;
            document.getElementById('slot-bait-name').innerText = `${currentBait.name} (${countStr})`;
        }
        if (currentSpot) document.getElementById('slot-spot-name').innerText = currentSpot.name;
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'instruction-toast';
        toast.style.position = 'fixed';
        toast.style.top = '80px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.zIndex = '9999';
        toast.innerHTML = message;

        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 2200);
    }

    openModal(modalId) {
        this.closeActiveModal();
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            this.activeModal = modal;
            if (window.audio) window.audio.playButtonClickSound();
        }
    }

    closeActiveModal() {
        if (this.activeModal) {
            this.activeModal.classList.remove('active');
            this.activeModal = null;
        }
    }

    openShopModal(tab = 'rods') {
        const modal = document.getElementById('modal-shop');
        const container = document.getElementById('shop-items-container');
        if (!container) return;

        // Render Tabs
        const tabsHtml = `
            <div class="tab-container">
                <button class="tab-btn ${tab === 'rods' ? 'active' : ''}" onclick="ui.openShopModal('rods')">🎣 Joran</button>
                <button class="tab-btn ${tab === 'lines' ? 'active' : ''}" onclick="ui.openShopModal('lines')">🧵 Senar</button>
                <button class="tab-btn ${tab === 'baits' ? 'active' : ''}" onclick="ui.openShopModal('baits')">🪱 Umpan</button>
                <button class="tab-btn ${tab === 'spots' ? 'active' : ''}" onclick="ui.openShopModal('spots')">🏞️ Lokasi</button>
            </div>
        `;

        let itemsHtml = '<div class="cards-grid">';
        const items = SHOP_CATALOG[tab] || [];

        items.forEach(item => {
            let isOwned = false;
            let isEquipped = false;

            if (tab === 'rods') {
                isOwned = window.storage.data.ownedRods.includes(item.id);
                isEquipped = window.storage.data.equippedRod === item.id;
            } else if (tab === 'lines') {
                isOwned = window.storage.data.ownedLines.includes(item.id);
                isEquipped = window.storage.data.equippedLine === item.id;
            } else if (tab === 'baits') {
                const count = window.storage.data.ownedBaits[item.id] || 0;
                isOwned = count > 0;
                isEquipped = window.storage.data.equippedBait === item.id;
            } else if (tab === 'spots') {
                isOwned = window.storage.data.unlockedSpots.includes(item.id);
                isEquipped = window.storage.data.equippedSpot === item.id;
            }

            let buttonHtml = '';
            if (isEquipped) {
                buttonHtml = `<button class="item-action-btn equipped-btn">✓ Terpasang</button>`;
            } else if (isOwned && tab !== 'baits') {
                buttonHtml = `<button class="item-action-btn equip-btn" onclick="ui.equipItem('${tab}', '${item.id}')">Gunakan</button>`;
            } else {
                const isLevelLocked = item.reqLevel && window.storage.level < item.reqLevel;
                if (isLevelLocked) {
                    buttonHtml = `<button class="item-action-btn" disabled style="opacity: 0.5;">Butuh Lv. ${item.reqLevel}</button>`;
                } else {
                    const btnLabel = tab === 'baits' ? `Beli (5x) - 🪙 ${item.price}` : `Beli - 🪙 ${item.price}`;
                    buttonHtml = `<button class="item-action-btn buy-btn" onclick="ui.buyItem('${tab}', '${item.id}')">${btnLabel}</button>`;
                }
            }

            itemsHtml += `
                <div class="item-card ${isEquipped ? 'equipped' : ''}">
                    <div class="item-icon">${item.icon}</div>
                    <div class="item-title">${item.name}</div>
                    <div class="item-desc">${item.description}</div>
                    ${buttonHtml}
                </div>
            `;
        });
        itemsHtml += '</div>';

        container.innerHTML = tabsHtml + itemsHtml;
        this.openModal('modal-shop');
    }

    buyItem(tab, itemId) {
        const item = SHOP_CATALOG[tab].find(i => i.id === itemId);
        if (!item) return;

        if (window.storage.spendCoins(item.price)) {
            if (tab === 'rods') {
                window.storage.data.ownedRods.push(itemId);
                window.storage.data.equippedRod = itemId;
            } else if (tab === 'lines') {
                window.storage.data.ownedLines.push(itemId);
                window.storage.data.equippedLine = itemId;
            } else if (tab === 'baits') {
                window.storage.addBait(itemId, 5);
                window.storage.data.equippedBait = itemId;
            } else if (tab === 'spots') {
                window.storage.data.unlockedSpots.push(itemId);
                window.storage.data.equippedSpot = itemId;
            }
            window.storage.save();
            this.updateHUD();
            this.openShopModal(tab);
            this.showToast(`Berhasil membeli <b>${item.name}</b>!`);
            if (window.audio) window.audio.playCatchVictorySound();
        } else {
            this.showToast('🪙 Koin tidak cukup!');
        }
    }

    equipItem(tab, itemId) {
        if (tab === 'rods') window.storage.data.equippedRod = itemId;
        else if (tab === 'lines') window.storage.data.equippedLine = itemId;
        else if (tab === 'baits') window.storage.data.equippedBait = itemId;
        else if (tab === 'spots') window.storage.data.equippedSpot = itemId;

        window.storage.save();
        this.updateHUD();
        this.openShopModal(tab);
        this.showToast('Peralatan berhasil dipasang!');
    }

    openLogbookModal() {
        const container = document.getElementById('logbook-items-container');
        if (!container) return;

        let html = '<div class="cards-grid">';
        FISH_DATABASE.forEach(fish => {
            const logData = window.storage.data.caughtLog[fish.id];
            const isCaught = logData && logData.count > 0;

            html += `
                <div class="item-card ${isCaught ? '' : 'locked'}" style="${!isCaught ? 'opacity: 0.55; filter: grayscale(1);' : ''}">
                    <div class="item-icon">${fish.icon}</div>
                    <div class="item-title">${fish.name}</div>
                    <span class="rarity-badge rarity-${fish.rarity}">${fish.rarity}</span>
                    <div class="item-desc">${isCaught ? fish.description : '??? Belum pernah ditangkap.'}</div>
                    ${isCaught ? `
                        <div class="item-stats">
                            <div>Tertangkap: <b>${logData.count}x</b></div>
                            <div>Rekor Berat: <b>${logData.maxWeight} kg</b></div>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        html += '</div>';

        container.innerHTML = html;
        this.openModal('modal-logbook');
    }

    openQuestsModal() {
        const container = document.getElementById('quests-items-container');
        if (!container) return;

        const quests = [
            { id: 'q1', title: 'Pemancing Pemula', desc: 'Dapatkan 3 ekor ikan jenis apa saja', rewardCoins: 100, rewardXP: 50 },
            { id: 'q2', title: 'Pemburu Ikan Rare', desc: 'Tangkap 1 ikan berkualitas Rare atau lebih tinggi', rewardCoins: 250, rewardXP: 120 },
            { id: 'q3', title: 'Kolektor Peralatan', desc: 'Beli 1 peralatan baru dari toko', rewardCoins: 200, rewardXP: 80 }
        ];

        let html = '';
        quests.forEach(q => {
            html += `
                <div class="quest-item">
                    <div class="quest-info">
                        <h4>${q.title}</h4>
                        <p>${q.desc}</p>
                    </div>
                    <div class="quest-reward">
                        <span>🪙 ${q.rewardCoins}</span>
                        <span>⭐ ${q.rewardXP} XP</span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        this.openModal('modal-quests');
    }

    showCatchVictory(fish, leveledUp) {
        document.getElementById('catch-icon').innerText = fish.icon;
        document.getElementById('catch-name').innerText = fish.name;
        
        const badge = document.getElementById('catch-rarity');
        badge.className = `rarity-badge rarity-${fish.rarity}`;
        badge.innerText = fish.rarity;

        document.getElementById('catch-weight').innerText = `${fish.caughtWeight} kg`;
        document.getElementById('catch-price').innerText = `+🪙 ${fish.finalPrice}`;
        document.getElementById('catch-xp').innerText = `+⭐ ${fish.xp} XP`;
        document.getElementById('catch-desc').innerText = fish.description;

        this.openModal('modal-catch');

        if (leveledUp) {
            setTimeout(() => {
                this.showToast(`🎉 <b>NAIK LEVEL!</b> Sekarang Anda Level ${window.storage.level}!`);
            }, 600);
        }
    }
}

const ui = new UIController();
window.ui = ui;
window.UIController = UIController;
