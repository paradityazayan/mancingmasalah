// Reeling Tension Mini-game Engine
class ReelMinigame {
    constructor() {
        this.active = false;
        this.fish = null;
        this.rod = null;
        this.line = null;

        this.fishStamina = 100; // 100 -> 0
        this.maxStamina = 100;
        
        this.tension = 30; // 0 -> 100
        this.isReeling = false;

        // Safe zone parameters (0 -> 100 scale)
        this.safeZonePos = 40;
        this.safeZoneWidth = 30;
        this.safeZoneDir = 1;
        this.moveSpeed = 1.0;

        this.overTensionTime = 0; // max allowed 1.5 seconds in red
        this.slackTime = 0; // max allowed 2.5 seconds in extreme slack

        this.onSuccessCallback = null;
        this.onFailCallback = null;
    }

    start(fish, rod, line, onSuccess, onFail) {
        this.active = true;
        this.fish = fish;
        this.rod = rod;
        this.line = line;

        this.maxStamina = fish.stamina;
        this.fishStamina = fish.stamina;
        this.tension = 30;
        this.isReeling = false;
        this.overTensionTime = 0;
        this.slackTime = 0;

        // Calculate safe zone width based on rod safeZoneBonus
        const baseWidth = 32;
        this.safeZoneWidth = Math.min(60, baseWidth * (rod ? rod.safeZoneBonus : 1.0));
        this.safeZonePos = 50 - (this.safeZoneWidth / 2);
        this.moveSpeed = (fish.speed || 1.0) * (Math.random() > 0.5 ? 1 : -1);

        this.onSuccessCallback = onSuccess;
        this.onFailCallback = onFail;
    }

    setReeling(reeling) {
        this.isReeling = reeling;
    }

    update(dt = 0.016) {
        if (!this.active) return;

        // 1. Move Safe Zone dynamically based on fish resistance
        this.safeZonePos += this.moveSpeed * (this.fish.speed * 0.8);
        if (this.safeZonePos <= 5) {
            this.safeZonePos = 5;
            this.moveSpeed = Math.abs(this.moveSpeed);
        } else if (this.safeZonePos + this.safeZoneWidth >= 95) {
            this.safeZonePos = 95 - this.safeZoneWidth;
            this.moveSpeed = -Math.abs(this.moveSpeed);
        }

        // Randomly change direction occasionally
        if (Math.random() < 0.02) {
            this.moveSpeed *= -1;
        }

        // 2. Adjust Tension based on player input & rod power
        const reelSpeed = 80 * (this.rod ? this.rod.power : 1.0);
        const dropSpeed = 45;

        if (this.isReeling) {
            this.tension += reelSpeed * dt;
            if (window.audio && Math.random() < 0.25) {
                window.audio.playReelClickSound();
            }
        } else {
            this.tension -= dropSpeed * dt;
        }

        // Fish pulling back adds tension spikes
        const fishTug = (Math.sin(Date.now() * 0.005) * 15) * (this.fish.pullForce || 1.0);
        const currentTension = Math.max(0, Math.min(100, this.tension + (fishTug * 0.1)));
        this.tension = currentTension;

        // 3. Check if Tension is inside Safe Zone
        const inSafeZone = (
            this.tension >= this.safeZonePos && 
            this.tension <= (this.safeZonePos + this.safeZoneWidth)
        );

        if (inSafeZone) {
            // Deplete fish stamina
            const drainRate = 22 * (this.rod ? this.rod.power : 1.0);
            this.fishStamina -= drainRate * dt;
            this.overTensionTime = Math.max(0, this.overTensionTime - dt * 2);
            this.slackTime = Math.max(0, this.slackTime - dt * 2);
        } else if (this.tension > 85) {
            // Danger red zone!
            const durability = this.line ? this.line.durability : 1.0;
            this.overTensionTime += (dt / durability);
            if (this.overTensionTime >= 1.2) {
                this.active = false;
                if (window.audio) window.audio.playLineSnapSound();
                if (this.onFailCallback) this.onFailCallback('SNAP! Senar Putus!');
                return;
            }
        } else if (this.tension < 10) {
            // Slack line - fish slips away!
            this.slackTime += dt;
            if (this.slackTime >= 2.0) {
                this.active = false;
                if (this.onFailCallback) this.onFailCallback('Ikan Kabur! Senar Terlalu Kendor.');
                return;
            }
        }

        // 4. Check Victory Condition
        if (this.fishStamina <= 0) {
            this.fishStamina = 0;
            this.active = false;
            if (window.audio) window.audio.playCatchVictorySound();
            if (this.onSuccessCallback) this.onSuccessCallback(this.fish);
        }
    }

    getState() {
        return {
            active: this.active,
            tension: this.tension,
            safeZonePos: this.safeZonePos,
            safeZoneWidth: this.safeZoneWidth,
            staminaPct: Math.max(0, (this.fishStamina / this.maxStamina) * 100),
            inDanger: this.overTensionTime > 0.3,
            inSlack: this.slackTime > 0.5
        };
    }
}

const minigame = new ReelMinigame();
window.minigame = minigame;
window.ReelMinigame = ReelMinigame;
