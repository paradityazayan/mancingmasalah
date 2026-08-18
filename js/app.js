// Main Game Loop and State Controller
const GAME_STATE = {
    IDLE: 'IDLE',
    CASTING_CHARGE: 'CASTING_CHARGE',
    WAITING_BITE: 'WAITING_BITE',
    FISH_BITING: 'FISH_BITING',
    REELING: 'REELING',
    SUMMARY: 'SUMMARY'
};

class GameApp {
    constructor() {
        this.state = GAME_STATE.IDLE;
        this.renderer = null;
        
        // Casting charge power
        this.castPower = 0;
        this.castPowerDir = 1;

        // Waiting bite timer
        this.biteTimer = 0;
        this.targetBiteTime = 0;

        // Current hooked fish
        this.hookedFish = null;

        this.init();
    }

    init() {
        this.renderer = new CanvasRenderer('gameCanvas');
        window.ui.init();

        this.bindControls();
        this.gameLoop();
    }

    bindControls() {
        const actionBtn = document.getElementById('btn-main-action');
        
        // Press action (Cast Charge or Reel Hold)
        const handlePress = (e) => {
            e.preventDefault();
            if (window.audio) window.audio.init();

            if (this.state === GAME_STATE.IDLE) {
                this.state = GAME_STATE.CASTING_CHARGE;
                this.castPower = 0;
                this.castPowerDir = 1;
                document.getElementById('power-meter').style.display = 'flex';
                this.updateInstruction('Tentukan Jarak Lemparan! Lepaskan untuk Melempar Kail!');
            } else if (this.state === GAME_STATE.REELING) {
                minigame.setReeling(true);
            }
        };

        // Release action (Cast Launch or Reel Release)
        const handleRelease = (e) => {
            e.preventDefault();
            if (this.state === GAME_STATE.CASTING_CHARGE) {
                this.launchCast();
            } else if (this.state === GAME_STATE.REELING) {
                minigame.setReeling(false);
            }
        };

        if (actionBtn) {
            actionBtn.addEventListener('mousedown', handlePress);
            actionBtn.addEventListener('mouseup', handleRelease);
            actionBtn.addEventListener('touchstart', handlePress);
            actionBtn.addEventListener('touchend', handleRelease);
        }

        // Keyboard Spacebar control
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !e.repeat && !ui.activeModal) {
                handlePress(e);
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.code === 'Space' && !ui.activeModal) {
                handleRelease(e);
            }
        });

        // Close Catch Modal button handler
        const continueBtn = document.getElementById('btn-catch-continue');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                ui.closeActiveModal();
                this.resetToIdle();
            });
        }
    }

    launchCast() {
        document.getElementById('power-meter').style.display = 'none';
        this.state = GAME_STATE.WAITING_BITE;

        // Calculate landing position based on cast power
        const minDist = this.renderer.width * 0.25;
        const maxDist = this.renderer.width * 0.82;
        const targetX = minDist + (maxDist - minDist) * (this.castPower / 100);
        const targetY = this.renderer.height * 0.58 + (Math.random() * 30 - 15);

        this.renderer.setBobberTarget(targetX, targetY);
        if (window.audio) window.audio.playCastSound();

        // Bait usage check
        const currentBaitId = window.storage.data.equippedBait;
        window.storage.useBait(currentBaitId);
        window.ui.updateHUD();

        this.updateInstruction('Mencari Umpan... Harap Tunggu...');
        this.targetBiteTime = Math.random() * 2.5 + 2.0; // 2 to 4.5 seconds
        this.biteTimer = 0;
    }

    triggerBite() {
        this.state = GAME_STATE.FISH_BITING;
        if (window.audio) window.audio.playBiteSound();

        // Dip bobber into water
        this.renderer.bobber.dip = 18;
        this.renderer.createSplash(this.renderer.bobber.x, this.renderer.bobber.y, 20);

        this.updateInstruction('🚨 <span class="highlight" style="color:#ff5252;">STRIKE!</span> TEKAN & TAHAN TOMBOL UNTUK MENGGULUNG!');

        // Select fish from current spot & bait
        const currentSpot = window.storage.data.equippedSpot;
        const currentBait = SHOP_CATALOG.baits.find(b => b.id === window.storage.data.equippedBait);
        const luckRating = currentBait ? currentBait.luckRating : 1.0;

        this.hookedFish = getRandomFish(currentSpot, luckRating);

        // Transition to reeling after quick pause
        setTimeout(() => {
            if (this.state === GAME_STATE.FISH_BITING) {
                this.startReelingMiniGame();
            }
        }, 800);
    }

    startReelingMiniGame() {
        this.state = GAME_STATE.REELING;
        document.getElementById('tension-gauge').style.display = 'flex';

        const actionBtn = document.getElementById('btn-main-action');
        actionBtn.innerText = '⚙️ GULUNG SENAR!';
        actionBtn.classList.add('reeling');

        const currentRod = SHOP_CATALOG.rods.find(r => r.id === window.storage.data.equippedRod);
        const currentLine = SHOP_CATALOG.lines.find(l => l.id === window.storage.data.equippedLine);

        minigame.start(
            this.hookedFish,
            currentRod,
            currentLine,
            (caughtFish) => this.onFishLanded(caughtFish),
            (failReason) => this.onFishFailed(failReason)
        );
    }

    onFishLanded(fish) {
        this.state = GAME_STATE.SUMMARY;
        document.getElementById('tension-gauge').style.display = 'none';

        // Add coins & XP
        window.storage.addCoins(fish.finalPrice);
        const leveledUp = window.storage.addXP(fish.xp);
        window.storage.recordCatch(fish);

        window.ui.updateHUD();
        window.ui.showCatchVictory(fish, leveledUp);
    }

    onFishFailed(reason) {
        this.state = GAME_STATE.SUMMARY;
        document.getElementById('tension-gauge').style.display = 'none';
        window.ui.showToast(`💥 ${reason}`);
        this.renderer.createSplash(this.renderer.bobber.x, this.renderer.bobber.y, 10);
        setTimeout(() => this.resetToIdle(), 1200);
    }

    resetToIdle() {
        this.state = GAME_STATE.IDLE;
        this.renderer.bobber.visible = false;

        const actionBtn = document.getElementById('btn-main-action');
        actionBtn.innerText = '🎣 LEMPAR KAIL';
        actionBtn.classList.remove('reeling');

        document.getElementById('tension-gauge').style.display = 'none';
        document.getElementById('power-meter').style.display = 'none';

        this.updateInstruction('Klik / Sentuh <b>LEMPAR KAIL</b> (atau Tekan Spasi) untuk Memulai!');
    }

    updateInstruction(html) {
        document.getElementById('instruction-text').innerHTML = html;
    }

    gameLoop() {
        const dt = 0.016;

        // 1. Casting Power bar update
        if (this.state === GAME_STATE.CASTING_CHARGE) {
            this.castPower += this.castPowerDir * 120 * dt;
            if (this.castPower >= 100) {
                this.castPower = 100;
                this.castPowerDir = -1;
            } else if (this.castPower <= 0) {
                this.castPower = 0;
                this.castPowerDir = 1;
            }
            document.getElementById('power-bar-fill').style.width = `${this.castPower}%`;
        }

        // 2. Waiting for bite timer
        if (this.state === GAME_STATE.WAITING_BITE) {
            this.biteTimer += dt;
            if (this.biteTimer >= this.targetBiteTime) {
                this.triggerBite();
            }
        }

        // 3. Reeling Mini-Game update
        if (this.state === GAME_STATE.REELING) {
            minigame.update(dt);
            const mState = minigame.getState();

            // Update UI elements for Tension Gauge
            document.getElementById('fish-stamina-fill').style.width = `${mState.staminaPct}%`;
            document.getElementById('tension-needle').style.left = `${mState.tension}%`;

            const safeZoneEl = document.getElementById('tension-safe-zone');
            safeZoneEl.style.left = `${mState.safeZonePos}%`;
            safeZoneEl.style.width = `${mState.safeZoneWidth}%`;

            const statusText = document.getElementById('tension-status-text');
            if (mState.inDanger) {
                statusText.innerText = '🔴 BAHAYA! SENAR HAMPIR PUTUS!';
                statusText.className = 'tension-status-text danger';
            } else if (mState.inSlack) {
                statusText.innerText = '🟡 KENDOR! IKAN AKAN KABUR!';
                statusText.className = 'tension-status-text warning';
            } else {
                statusText.innerText = '🟢 ZONA AMAN - TAHAN UNTUK MENGGULUNG!';
                statusText.className = 'tension-status-text ok';
            }
        }

        // Render current frame safely
        try {
            const currentSpotObj = (SHOP_CATALOG && SHOP_CATALOG.spots) ? 
                (SHOP_CATALOG.spots.find(s => s && s.id === window.storage.data.equippedSpot) || SHOP_CATALOG.spots[0]) : null;
            if (currentSpotObj && this.renderer) {
                this.renderer.render(this.state, currentSpotObj);
            }
        } catch (err) {
            console.error('Error rendering frame:', err);
        }

        requestAnimationFrame(() => this.gameLoop());
    }
}

function initGameApp() {
    if (!window.game) {
        window.game = new GameApp();
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initGameApp);
} else {
    initGameApp();
}
