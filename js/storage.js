// LocalStorage Manager untuk data pemain
class StorageManager {
    constructor() {
        this.STORAGE_KEY = 'MANCING_MANIA_SAVE_V1';
        this.data = this.loadData();
    }

    getDefaultData() {
        return {
            coins: 150,
            level: 1,
            xp: 0,
            equippedRod: 'rod_bamboo',
            equippedLine: 'line_nylon',
            equippedBait: 'bait_worm',
            equippedSpot: 'lake',
            ownedRods: ['rod_bamboo'],
            ownedLines: ['line_nylon'],
            ownedBaits: {
                'bait_worm': 999, // Infinite
                'bait_shrimp': 5,
                'bait_gold_pellet': 0,
                'bait_glowing': 0
            },
            unlockedSpots: ['lake'],
            caughtLog: {}, // { fishId: { count: N, maxWeight: W } }
            questsCompleted: []
        };
    }

    loadData() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                return { ...this.getDefaultData(), ...parsed };
            }
        } catch (e) {
            console.error('Gagal memuat save data:', e);
        }
        return this.getDefaultData();
    }

    save() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.error('Gagal menyimpan data:', e);
        }
    }

    resetProgress() {
        this.data = this.getDefaultData();
        this.save();
    }

    // Helper getters & setters
    get coins() { return this.data.coins; }
    addCoins(amount) {
        this.data.coins += amount;
        this.save();
    }
    spendCoins(amount) {
        if (this.data.coins >= amount) {
            this.data.coins -= amount;
            this.save();
            return true;
        }
        return false;
    }

    get level() { return this.data.level; }
    get xp() { return this.data.xp; }
    get xpForNextLevel() { return this.data.level * 100; }

    addXP(amount) {
        this.data.xp += amount;
        let leveledUp = false;
        while (this.data.xp >= this.xpForNextLevel) {
            this.data.xp -= this.xpForNextLevel;
            this.data.level += 1;
            leveledUp = true;
        }
        this.save();
        return leveledUp;
    }

    recordCatch(fish) {
        if (!this.data.caughtLog[fish.id]) {
            this.data.caughtLog[fish.id] = { count: 0, maxWeight: 0 };
        }
        const log = this.data.caughtLog[fish.id];
        log.count += 1;
        if (fish.caughtWeight > log.maxWeight) {
            log.maxWeight = fish.caughtWeight;
        }
        this.save();
    }

    useBait(baitId) {
        if (baitId === 'bait_worm') return true; // infinite
        if (this.data.ownedBaits[baitId] && this.data.ownedBaits[baitId] > 0) {
            this.data.ownedBaits[baitId] -= 1;
            this.save();
            return true;
        }
        return false;
    }

    addBait(baitId, count = 5) {
        if (!this.data.ownedBaits[baitId]) {
            this.data.ownedBaits[baitId] = 0;
        }
        this.data.ownedBaits[baitId] += count;
        this.save();
    }
}

const storage = new StorageManager();
window.storage = storage;
window.StorageManager = StorageManager;
