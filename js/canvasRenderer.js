// Canvas Renderer for 60fps fishing visuals, environment, water physics, bobber & particles
class CanvasRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        
        this.time = 0;
        this.particles = [];
        this.ambientFish = [];
        this.clouds = [];
        this.birds = [];

        // Sailing & Steer State
        this.boatX = 15;
        this.boatSpeed = 0;
        this.targetBoatSpeed = 0;

        // Time-of-day state
        this.stars = [];
        this.initStars();

        // Bobber state
        this.bobber = {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            visible: false,
            dip: 0, // for bite animation
            rotation: 0
        };

        // Casting arc animation
        this.castProgress = 0;
        this.isCasting = false;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.initAmbientFish();
        this.initClouds();
        this.initBirds();
    }

    initClouds() {
        this.clouds = [];
        for (let i = 0; i < 5; i++) {
            this.clouds.push({
                x: Math.random() * (this.width || 1000),
                y: Math.random() * (this.height * 0.25 || 150) + 20,
                speed: Math.random() * 0.25 + 0.1,
                scale: Math.random() * 0.5 + 0.7
            });
        }
    }

    initBirds() {
        this.birds = [];
        for (let i = 0; i < 4; i++) {
            this.birds.push({
                x: Math.random() * (this.width || 1000) - 200,
                y: Math.random() * (this.height * 0.2 || 120) + 30,
                speed: Math.random() * 0.6 + 0.8,
                wingPhase: Math.random() * Math.PI * 2
            });
        }
    }

    initStars() {
        this.stars = [];
        for (let i = 0; i < 120; i++) {
            this.stars.push({
                x: Math.random(),
                y: Math.random(),
                size: Math.random() * 1.8 + 0.4,
                twinkle: Math.random() * Math.PI * 2
            });
        }
    }

    // Returns a 0–1 value representing current time of day
    // 0 = midnight, 0.25 = 6am, 0.5 = noon, 0.75 = 6pm, 1 = midnight
    getDayProgress() {
        const now = new Date();
        return (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400;
    }

    // Linearly interpolate between two hex colors by t (0–1)
    lerpColor(c1, c2, t) {
        const h = s => parseInt(s, 16);
        const r1 = h(c1.slice(1,3)), g1 = h(c1.slice(3,5)), b1 = h(c1.slice(5,7));
        const r2 = h(c2.slice(1,3)), g2 = h(c2.slice(3,5)), b2 = h(c2.slice(5,7));
        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);
        return `rgb(${r},${g},${b})`;
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    initAmbientFish() {
        this.ambientFish = [];
        for (let i = 0; i < 6; i++) {
            this.ambientFish.push({
                x: Math.random() * this.width,
                y: this.height * 0.65 + Math.random() * (this.height * 0.25),
                speed: (Math.random() * 0.8 + 0.3) * (Math.random() > 0.5 ? 1 : -1),
                size: Math.random() * 15 + 10,
                opacity: Math.random() * 0.3 + 0.15
            });
        }
    }

    setBobberTarget(x, y) {
        this.bobber.targetX = x;
        this.bobber.targetY = y;
        this.bobber.x = this.getRodTipPos().x;
        this.bobber.y = this.getRodTipPos().y;
        this.bobber.visible = true;
        this.isCasting = true;
        this.castProgress = 0;
    }

    getRodTipPos() {
        const waterLineY = this.height * 0.52;
        const floatOffset = Math.sin(this.time * 1.5) * 4.0;
        const boatX = this.boatX;
        const boatY = waterLineY + floatOffset;
        const manX = boatX + 205;
        return {
            x: manX + 40,
            y: boatY - 65
        };
    }

    createSplash(x, y, count = 15) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI - Math.PI;
            const speed = Math.random() * 5 + 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                radius: Math.random() * 3 + 2,
                color: 'rgba(255, 255, 255, 0.8)',
                alpha: 1.0,
                life: 1.0
            });
        }
    }

    render(gameState, currentSpot) {
        this.time += 0.03;
        this.ctx.clearRect(0, 0, this.width, this.height);

        const waterLineY = this.height * 0.52;

        // Update sailing boat position — hanya bergerak saat IDLE (tidak sedang memancing)
        if (gameState === 'IDLE') {
            this.boatX += 0.55;
            if (this.boatX > this.width + 320) {
                this.boatX = -320;
            }
        }

        // 1. Render Sky & Background
        this.drawBackground(currentSpot, waterLineY);

        // 2. Render Sun/Moon rays
        this.drawLightRays();

        // 3. Render Pier & Fisherman
        this.drawPierAndFisherman(waterLineY);

        // 4. Render Underwater Ambient Fish
        this.drawAmbientFish(waterLineY);

        // 5. Update Bobber Casting physics
        if (this.bobber.visible) {
            if (this.isCasting) {
                this.castProgress += 0.04;
                if (this.castProgress >= 1) {
                    this.castProgress = 1;
                    this.isCasting = false;
                    this.createSplash(this.bobber.targetX, this.bobber.targetY, 12);
                    if (window.audio) window.audio.playSplashSound();
                }
                const rodTip = this.getRodTipPos();
                // Arc motion
                const heightArc = 120;
                const arcY = Math.sin(this.castProgress * Math.PI) * heightArc;
                this.bobber.x = rodTip.x + (this.bobber.targetX - rodTip.x) * this.castProgress;
                this.bobber.y = rodTip.y + (this.bobber.targetY - rodTip.y) * this.castProgress - arcY;
            } else {
                // Floating wave motion
                const waveOffset = Math.sin(this.time * 2 + this.bobber.x * 0.01) * 4;
                this.bobber.x += (this.bobber.targetX - this.bobber.x) * 0.1;
                this.bobber.y = this.bobber.targetY + waveOffset + this.bobber.dip;
            }

            // Draw Fishing Line (Curve from rod tip to bobber)
            this.drawFishingLine(this.getRodTipPos(), { x: this.bobber.x, y: this.bobber.y });

            // Draw Bobber
            this.drawBobber(this.bobber.x, this.bobber.y);
        }

        // 6. Draw Water Waves
        this.drawWater(currentSpot, waterLineY);

        // 6.5 Draw Special Lake Visuals (Lily Pads, Fireflies, Mist)
        this.drawLakeElements(currentSpot, waterLineY);

        // 7. Update & Draw Particles
        this.drawParticles();
    }

    drawLakeElements(spot, waterLineY) {
        if (!spot || !spot.id || typeof spot.id !== 'string' || !spot.id.includes('lake')) return;

        this.ctx.save();

        // 1. Draw Floating Lily Pads (Daun Teratai)
        const lilyPads = [
            { x: this.width * 0.2, y: waterLineY + 25, r: 18 },
            { x: this.width * 0.24, y: waterLineY + 32, r: 14 },
            { x: this.width * 0.55, y: waterLineY + 20, r: 22 },
            { x: this.width * 0.59, y: waterLineY + 35, r: 15 },
            { x: this.width * 0.82, y: waterLineY + 28, r: 20 }
        ];

        lilyPads.forEach(pad => {
            const floatY = pad.y + Math.sin(this.time * 2 + pad.x) * 3;
            
            // Green Pad
            this.ctx.fillStyle = '#2e7d32';
            this.ctx.beginPath();
            this.ctx.arc(pad.x, floatY, pad.r, 0.2, Math.PI * 1.85);
            this.ctx.lineTo(pad.x, floatY);
            this.ctx.closePath();
            this.ctx.fill();

            // Lotus Flower on main pads
            if (pad.r > 16) {
                this.ctx.fillStyle = '#ff80ab';
                this.ctx.beginPath();
                this.ctx.arc(pad.x, floatY - 2, 6, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.fillStyle = '#ffd54f';
                this.ctx.beginPath();
                this.ctx.arc(pad.x, floatY - 2, 2.5, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });

        // 2. Draw Fireflies (Kunang-Kunang)
        const fireflyCount = 12;
        for (let i = 0; i < fireflyCount; i++) {
            const fx = (Math.sin(this.time * 0.8 + i * 1.5) * 0.4 + 0.5) * this.width;
            const fy = waterLineY - 40 + Math.cos(this.time * 1.2 + i) * 35;
            const glow = Math.sin(this.time * 4 + i * 2) * 0.5 + 0.5;

            this.ctx.fillStyle = `rgba(238, 255, 65, ${0.3 + glow * 0.6})`;
            this.ctx.shadowColor = '#eeff41';
            this.ctx.shadowBlur = 10;
            this.ctx.beginPath();
            this.ctx.arc(fx, fy, 2.5 + glow, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // 3. Draw Soft Lake Mist / Fog
        const mistGrad = this.ctx.createLinearGradient(0, waterLineY - 30, 0, waterLineY + 20);
        mistGrad.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
        mistGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.12)');
        mistGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = mistGrad;
        this.ctx.fillRect(0, waterLineY - 30, this.width, 50);

        this.ctx.restore();
    }

    drawBackground(spot, waterLineY) {
        const dp = this.getDayProgress(); // 0=midnight, 0.25=6am, 0.5=noon, 0.75=6pm
        const tod = this;

        // --- Sky color phases ---
        // Segmen waktu: night(0-0.2), dawn(0.2-0.27), morning(0.27-0.45), noon(0.45-0.6), dusk(0.6-0.75), night(0.75-1)
        let skyTop, skyMid, skyBot;

        if (dp < 0.20) {
            // Night (00:00 - 04:48)
            skyTop = '#020617'; skyMid = '#0a1128'; skyBot = '#0d1b3e';
        } else if (dp < 0.27) {
            // Dawn (04:48 - 06:29)
            const t = (dp - 0.20) / 0.07;
            skyTop = tod.lerpColor('#020617', '#1a0533', t);
            skyMid = tod.lerpColor('#0a1128', '#c2410c', t);
            skyBot = tod.lerpColor('#0d1b3e', '#fed7aa', t);
        } else if (dp < 0.45) {
            // Morning (06:29 - 10:48)
            const t = (dp - 0.27) / 0.18;
            skyTop = tod.lerpColor('#1a0533', '#1c7ed6', t);
            skyMid = tod.lerpColor('#c2410c', '#4facfe', t);
            skyBot = tod.lerpColor('#fed7aa', '#e0f7fa', t);
        } else if (dp < 0.60) {
            // Noon (10:48 - 14:24) — full daylight
            skyTop = '#1c7ed6'; skyMid = '#4facfe'; skyBot = '#e0f7fa';
        } else if (dp < 0.75) {
            // Dusk (14:24 - 18:00)
            const t = (dp - 0.60) / 0.15;
            skyTop = tod.lerpColor('#1c7ed6', '#7c1d6f', t);
            skyMid = tod.lerpColor('#4facfe', '#f97316', t);
            skyBot = tod.lerpColor('#e0f7fa', '#fde68a', t);
        } else if (dp < 0.82) {
            // Sunset → Night (18:00 - 19:41)
            const t = (dp - 0.75) / 0.07;
            skyTop = tod.lerpColor('#7c1d6f', '#020617', t);
            skyMid = tod.lerpColor('#f97316', '#1a0533', t);
            skyBot = tod.lerpColor('#fde68a', '#0d1b3e', t);
        } else {
            // Full Night (19:41 - 00:00)
            skyTop = '#020617'; skyMid = '#0a1128'; skyBot = '#0d1b3e';
        }

        const bgGrad = this.ctx.createLinearGradient(0, 0, 0, waterLineY);
        bgGrad.addColorStop(0, skyTop);
        bgGrad.addColorStop(0.4, skyMid);
        bgGrad.addColorStop(1, skyBot);
        this.ctx.fillStyle = bgGrad;
        this.ctx.fillRect(0, 0, this.width, waterLineY);

        // Draw stars/moon at night, sun during day
        this.drawCelestialBody(waterLineY, dp);

        // 2. Draw Clouds (hide during deep night)
        if (dp >= 0.20 && dp <= 0.82) {
            this.drawClouds(waterLineY);
        }

        // 3. Draw Flying Birds (only daytime)
        if (dp >= 0.25 && dp <= 0.78) {
            this.drawBirds(waterLineY);
        }

        // Mountain & hills tint by time
        const isNight = (dp < 0.22 || dp > 0.78);
        const mtColor1 = isNight ? 'rgba(10, 20, 40, 0.8)' : 'rgba(27, 94, 32, 0.45)';
        const mtColor2 = isNight ? 'rgba(15, 28, 55, 0.9)' : 'rgba(46, 125, 50, 0.75)';

        // 4. Distant Mountain Range
        this.ctx.fillStyle = mtColor1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, waterLineY);
        for (let x = 0; x <= this.width + 50; x += 50) {
            const h = Math.sin(x * 0.003 + 0.5) * 85 + Math.cos(x * 0.008) * 45;
            this.ctx.lineTo(x, waterLineY - 50 - h);
        }
        this.ctx.lineTo(this.width, waterLineY);
        this.ctx.closePath();
        this.ctx.fill();

        // 5. Midground Hills
        this.ctx.fillStyle = mtColor2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, waterLineY);
        for (let x = 0; x <= this.width + 40; x += 40) {
            const h = Math.sin(x * 0.007 + 2) * 55 + Math.cos(x * 0.015) * 30;
            this.ctx.lineTo(x, waterLineY - 25 - h);
        }
        this.ctx.lineTo(this.width, waterLineY);
        this.ctx.closePath();
        this.ctx.fill();

        // 6. Pine Trees
        this.drawPineTrees(waterLineY);
    }

    drawCelestialBody(waterLineY, dp) {
        if (dp === undefined) dp = this.getDayProgress();

        // --- Sun arc: rises at east (right side) at 0.25, sets at west (left) at 0.75 ---
        // normalizedAngle: 0 = 6am (rising), 1 = 6pm (setting)
        const isDaytime = dp >= 0.20 && dp <= 0.80;
        const isTwilight = (dp >= 0.20 && dp < 0.27) || (dp > 0.73 && dp <= 0.80);

        if (isDaytime) {
            // Map dp 0.20–0.80 to arc angle 0–PI (left to right across sky)
            const t = (dp - 0.20) / 0.60; // 0 = dawn, 1 = dusk
            const angle = t * Math.PI; // 0 = left horizon, PI = right horizon

            // Arc across upper portion of sky
            const centerX = this.width * 0.5;
            const arcRadius = this.width * 0.52;
            const sunX = centerX - Math.cos(angle) * arcRadius;
            const sunY = waterLineY * 0.9 - Math.abs(Math.sin(angle)) * waterLineY * 0.82;

            // Sun color: white at noon, orange/red at dawn/dusk
            let sunColor, auraInner, auraOuter;
            if (isTwilight) {
                sunColor = '#ff6b35';
                auraInner = 'rgba(255, 100, 30, 0.9)';
                auraOuter = 'rgba(255, 50, 0, 0.0)';
            } else {
                sunColor = '#fffde7';
                auraInner = 'rgba(255, 255, 220, 0.95)';
                auraOuter = 'rgba(255, 255, 255, 0.0)';
            }

            this.ctx.save();

            // Aura glow
            const auraRad = isTwilight ? 200 : 160;
            const auraGrad = this.ctx.createRadialGradient(sunX, sunY, 12, sunX, sunY, auraRad);
            auraGrad.addColorStop(0, auraInner);
            auraGrad.addColorStop(0.25, isTwilight ? 'rgba(255, 160, 0, 0.4)' : 'rgba(255, 215, 0, 0.45)');
            auraGrad.addColorStop(0.65, isTwilight ? 'rgba(200, 50, 0, 0.15)' : 'rgba(255, 165, 0, 0.15)');
            auraGrad.addColorStop(1, 'rgba(0,0,0,0)');
            this.ctx.fillStyle = auraGrad;
            this.ctx.beginPath();
            this.ctx.arc(sunX, sunY, auraRad, 0, Math.PI * 2);
            this.ctx.fill();

            // Sun disc
            this.ctx.fillStyle = sunColor;
            this.ctx.beginPath();
            this.ctx.arc(sunX, sunY, 28, 0, Math.PI * 2);
            this.ctx.fill();

            // Store sun position for light rays
            this._sunX = sunX;
            this._sunY = sunY;

            this.ctx.restore();
        }

        // --- Night: stars + moon ---
        const isNight = dp < 0.22 || dp > 0.78;
        const nightAlpha = dp < 0.22
            ? Math.min(1, (0.22 - dp) / 0.05 + (dp < 0.05 ? 1 : 0))
            : Math.min(1, (dp - 0.78) / 0.04);

        if (isNight || isTwilight) {
            const alpha = isNight ? Math.min(1, (dp < 0.5 ? (0.22 - dp) * 20 : (dp - 0.78) * 25)) : 0.3;
            this.ctx.save();

            // Stars
            this.stars.forEach(star => {
                const twinkle = Math.sin(this.time * 3 + star.twinkle) * 0.3 + 0.7;
                this.ctx.globalAlpha = Math.max(0, alpha * twinkle);
                this.ctx.fillStyle = '#ffffff';
                this.ctx.beginPath();
                this.ctx.arc(star.x * this.width, star.y * waterLineY * 0.95, star.size, 0, Math.PI * 2);
                this.ctx.fill();
            });

            // Moon — opposite the sun arc
            const moonT = ((dp < 0.5 ? dp + 1 : dp) - 0.80) / 0.60;
            const moonAngle = Math.max(0, Math.min(1, moonT)) * Math.PI;
            const centerX = this.width * 0.5;
            const arcRadius = this.width * 0.52;
            const moonX = centerX - Math.cos(moonAngle) * arcRadius;
            const moonY = waterLineY * 0.9 - Math.abs(Math.sin(moonAngle)) * waterLineY * 0.75;

            this.ctx.globalAlpha = Math.max(0, alpha);
            // Moon glow
            const moonGlow = this.ctx.createRadialGradient(moonX, moonY, 8, moonX, moonY, 70);
            moonGlow.addColorStop(0, 'rgba(220, 230, 255, 0.6)');
            moonGlow.addColorStop(1, 'rgba(0,0,0,0)');
            this.ctx.fillStyle = moonGlow;
            this.ctx.beginPath();
            this.ctx.arc(moonX, moonY, 70, 0, Math.PI * 2);
            this.ctx.fill();

            // Moon disc
            this.ctx.fillStyle = '#e8eaf6';
            this.ctx.beginPath();
            this.ctx.arc(moonX, moonY, 22, 0, Math.PI * 2);
            this.ctx.fill();
            // Moon craters
            this.ctx.fillStyle = 'rgba(150, 160, 200, 0.4)';
            [[moonX - 7, moonY - 4, 4], [moonX + 6, moonY + 5, 3], [moonX - 2, moonY + 8, 2.5]].forEach(([cx, cy, cr]) => {
                this.ctx.beginPath();
                this.ctx.arc(cx, cy, cr, 0, Math.PI * 2);
                this.ctx.fill();
            });

            this.ctx.globalAlpha = 1;
            this.ctx.restore();
        }
    }

    drawClouds(waterLineY) {
        this.ctx.save();
        this.clouds.forEach(cloud => {
            cloud.x += cloud.speed;
            if (cloud.x > this.width + 150) cloud.x = -180;

            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
            this.ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
            this.ctx.shadowBlur = 10;

            this.ctx.beginPath();
            const cx = cloud.x;
            const cy = cloud.y;
            const s = cloud.scale;

            this.ctx.arc(cx, cy, 28 * s, 0, Math.PI * 2);
            this.ctx.arc(cx + 22 * s, cy - 14 * s, 34 * s, 0, Math.PI * 2);
            this.ctx.arc(cx + 52 * s, cy, 25 * s, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.restore();
    }

    drawBirds(waterLineY) {
        this.ctx.save();
        this.ctx.strokeStyle = '#1e293b';
        this.ctx.lineWidth = 2.0;

        this.birds.forEach(bird => {
            bird.x += bird.speed * 1.2;
            if (bird.x > this.width + 80) {
                bird.x = -100;
                bird.y = Math.random() * (waterLineY * 0.45) + 20;
            }

            const wingY = Math.sin(this.time * 8 + bird.wingPhase) * 6;

            this.ctx.beginPath();
            this.ctx.moveTo(bird.x - 14, bird.y + wingY);
            this.ctx.quadraticCurveTo(bird.x - 7, bird.y - 5, bird.x, bird.y);
            this.ctx.quadraticCurveTo(bird.x + 7, bird.y - 5, bird.x + 14, bird.y + wingY);
            this.ctx.stroke();
        });
        this.ctx.restore();
    }

    drawPineTrees(waterLineY) {
        this.ctx.save();
        this.ctx.fillStyle = '#0a2312'; // Deep forest green silhouette

        for (let x = 0; x <= this.width; x += 32) {
            const treeHeight = Math.sin(x * 0.05) * 16 + 32;
            const treeY = waterLineY - 2;
            const treeWidth = 15;

            this.ctx.beginPath();
            this.ctx.moveTo(x, treeY - treeHeight);
            this.ctx.lineTo(x - treeWidth / 2, treeY);
            this.ctx.lineTo(x + treeWidth / 2, treeY);
            this.ctx.closePath();
            this.ctx.fill();
        }
        this.ctx.restore();
    }

    drawLightRays() {
        const dp = this.getDayProgress();
        const isDaytime = dp >= 0.22 && dp <= 0.78;
        if (!isDaytime || !this._sunX) return;

        const isTwilight = (dp >= 0.22 && dp < 0.30) || (dp > 0.70 && dp <= 0.78);
        const rayAlpha = isTwilight ? 0.05 : 0.08;

        this.ctx.save();
        this.ctx.fillStyle = `rgba(255, 255, 230, ${rayAlpha})`;
        for (let i = 0; i < 6; i++) {
            const angle = 0.12 + i * 0.13;
            this.ctx.beginPath();
            this.ctx.moveTo(this._sunX, this._sunY);
            this.ctx.lineTo(this._sunX + Math.cos(angle) * this.height * 1.8, this.height);
            this.ctx.lineTo(this._sunX + Math.cos(angle + 0.08) * this.height * 1.8, this.height);
            this.ctx.closePath();
            this.ctx.fill();
        }
        this.ctx.restore();
    }

    drawPierAndFisherman(waterLineY) {
        this.ctx.save();

        // Sway large ship gently with water
        const floatOffset = Math.sin(this.time * 1.5) * 4.0;
        const tiltAngle = Math.cos(this.time * 1.5) * 0.015;

        const boatX = this.boatX;
        const boatY = waterLineY + floatOffset;
        const boatWidth = 260; // Large Big Ship Scale!
        const boatHeight = 45;

        this.ctx.translate(boatX, boatY);
        this.ctx.rotate(tiltAngle);

        // 1. Ship Water Foam & Wake
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        this.ctx.beginPath();
        this.ctx.ellipse(boatWidth * 0.5, boatHeight - 2, boatWidth * 0.58, 8, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // 2. Large Ship Main Hull (Lambung Kapal Besar)
        const hullGrad = this.ctx.createLinearGradient(0, 0, 0, boatHeight);
        hullGrad.addColorStop(0, '#1e293b'); // Navy Blue Steel
        hullGrad.addColorStop(0.5, '#0f172a');
        hullGrad.addColorStop(1, '#020617');

        this.ctx.fillStyle = hullGrad;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -10);
        this.ctx.lineTo(boatWidth - 45, -10);
        this.ctx.quadraticCurveTo(boatWidth + 15, -10, boatWidth + 35, -35); // Sharp bow
        this.ctx.lineTo(boatWidth - 20, boatHeight - 6);
        this.ctx.quadraticCurveTo(boatWidth - 60, boatHeight, 20, boatHeight);
        this.ctx.closePath();
        this.ctx.fill();

        // Ship Upper White Deck Layer
        this.ctx.fillStyle = '#f8fafc';
        this.ctx.fillRect(5, -12, boatWidth - 48, 6);

        // Hull Gold & Crimson Trim Stripe
        this.ctx.strokeStyle = '#fecb2e';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(5, -4);
        this.ctx.lineTo(boatWidth + 20, -22);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#ef4444';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(5, 8);
        this.ctx.lineTo(boatWidth - 10, -5);
        this.ctx.stroke();

        // 3. Lifebuoys (2 Ban Pelampung)
        [boatWidth * 0.3, boatWidth * 0.52].forEach(bx => {
            this.ctx.fillStyle = '#ef4444';
            this.ctx.beginPath();
            this.ctx.arc(bx, 12, 10, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(bx, 12, 6, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = '#0f172a';
            this.ctx.beginPath();
            this.ctx.arc(bx, 12, 3.5, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // 4. Multi-Deck Captain's Cabin (Kabin Nahkoda Bertingkat)
        // Deck 1
        this.ctx.fillStyle = '#e2e8f0';
        this.ctx.fillRect(20, -50, 115, 38);
        // Deck 2 (Control Room)
        this.ctx.fillStyle = '#cbd5e1';
        this.ctx.fillRect(35, -72, 70, 22);

        // Cabin Tinted Windows
        this.ctx.fillStyle = '#0284c7';
        this.ctx.fillRect(80, -44, 45, 16);
        this.ctx.fillRect(70, -68, 30, 14);

        // Radar Dome & Navigation Tower
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(50, -82, 8, 0, Math.PI * 2); // Radar Dome
        this.ctx.fill();
        this.ctx.fillRect(49, -74, 2, 8);

        // Antennas
        this.ctx.strokeStyle = '#64748b';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(90, -72);
        this.ctx.lineTo(90, -96);
        this.ctx.moveTo(98, -72);
        this.ctx.lineTo(98, -92);
        this.ctx.stroke();

        // 5. Flag Pole & Fluttering Indonesian Flag (Bendera 🇮🇩)
        const flagX = 10;
        const flagY = -50;
        this.ctx.strokeStyle = '#cbd5e1';
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.moveTo(flagX, flagY);
        this.ctx.lineTo(flagX, flagY - 42);
        this.ctx.stroke();

        const flagWave = Math.sin(this.time * 5) * 4;
        // Red Top
        this.ctx.fillStyle = '#ff0000';
        this.ctx.beginPath();
        this.ctx.moveTo(flagX, flagY - 42);
        this.ctx.quadraticCurveTo(flagX - 12, flagY - 42 + flagWave, flagX - 24, flagY - 42);
        this.ctx.lineTo(flagX - 24, flagY - 31);
        this.ctx.quadraticCurveTo(flagX - 12, flagY - 31 + flagWave, flagX, flagY - 31);
        this.ctx.closePath();
        this.ctx.fill();
        // White Bottom
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.moveTo(flagX, flagY - 31);
        this.ctx.quadraticCurveTo(flagX - 12, flagY - 31 + flagWave, flagX - 24, flagY - 31);
        this.ctx.lineTo(flagX - 24, flagY - 20);
        this.ctx.quadraticCurveTo(flagX - 12, flagY - 20 + flagWave, flagX, flagY - 20);
        this.ctx.closePath();
        this.ctx.fill();

        // 6. Fisherman Standing on Deck
        const manX = 205;
        const manY = -10;

        this.ctx.fillStyle = '#0f172a';
        // Head with Cap
        this.ctx.beginPath();
        this.ctx.arc(manX, manY - 50, 12, 0, Math.PI * 2);
        this.ctx.fill();
        // Cap visor
        this.ctx.fillStyle = '#ff9f43';
        this.ctx.fillRect(manX - 2, manY - 54, 18, 5);

        // Torso & Pro Fishing Jacket
        this.ctx.fillStyle = '#0284c7';
        this.ctx.fillRect(manX - 10, manY - 38, 20, 32);
        this.ctx.fillStyle = '#ff9f43';
        this.ctx.fillRect(manX - 8, manY - 36, 6, 28);
        this.ctx.fillRect(manX + 2, manY - 36, 6, 28);

        // Legs
        this.ctx.fillStyle = '#1e293b';
        this.ctx.fillRect(manX - 9, manY - 6, 8, 14);
        this.ctx.fillRect(manX + 1, manY - 6, 8, 14);

        // Heavy Duty Fishing Rod
        const rodTip = this.getRodTipPos();
        const localRodTipX = rodTip.x - boatX;
        const localRodTipY = rodTip.y - boatY;

        this.ctx.strokeStyle = '#38bdf8';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(manX + 5, manY - 30);
        this.ctx.lineTo(localRodTipX, localRodTipY);
        this.ctx.stroke();

        this.ctx.restore();
    }

    drawFishingLine(from, to) {
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        this.ctx.lineWidth = 1.2;
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);

        // Sag control point
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2 + 15;

        this.ctx.quadraticCurveTo(midX, midY, to.x, to.y);
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawBobber(x, y) {
        this.ctx.save();
        this.ctx.translate(x, y);

        // Red top half
        this.ctx.fillStyle = '#ff5252';
        this.ctx.beginPath();
        this.ctx.arc(0, -4, 7, Math.PI, 0);
        this.ctx.fill();

        // White bottom half
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(0, -4, 7, 0, Math.PI);
        this.ctx.fill();

        // Antenna
        this.ctx.fillStyle = '#fecb2e';
        this.ctx.fillRect(-1.5, -14, 3, 10);

        // Water Ripple circles
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = 1;
        const rippleR = (this.time * 15) % 18;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, rippleR, rippleR * 0.4, 0, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.restore();
    }

    drawWater(spot, waterLineY) {
        const waterHeight = this.height - waterLineY;
        const dp = this.getDayProgress();

        // Water surface color changes with time of day
        let waterSurface;
        if (dp < 0.22 || dp > 0.78) {
            // Night — dark indigo
            waterSurface = 'rgba(10, 18, 50, 0.85)';
        } else if ((dp >= 0.22 && dp < 0.30) || (dp > 0.70 && dp <= 0.78)) {
            // Dawn/Dusk — warm orange-gold reflection
            waterSurface = 'rgba(180, 80, 20, 0.55)';
        } else {
            // Day — use spot color or default blue
            waterSurface = spot.waterColor || 'rgba(0, 180, 216, 0.6)';
        }

        const waterGrad = this.ctx.createLinearGradient(0, waterLineY, 0, this.height);
        waterGrad.addColorStop(0, waterSurface);
        waterGrad.addColorStop(1, dp < 0.22 || dp > 0.78 ? 'rgba(2, 6, 23, 0.98)' : 'rgba(5, 15, 30, 0.95)');

        this.ctx.fillStyle = waterGrad;

        // Animated wave surface
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height);
        this.ctx.lineTo(0, waterLineY);
        for (let x = 0; x <= this.width; x += 10) {
            const y = waterLineY + Math.sin(x * 0.015 + this.time * 2) * 5 + Math.cos(x * 0.03 + this.time) * 3;
            this.ctx.lineTo(x, y);
        }
        this.ctx.lineTo(this.width, this.height);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawAmbientFish(waterLineY) {
        this.ctx.save();
        this.ambientFish.forEach(fish => {
            fish.x += fish.speed;
            if (fish.x > this.width + 50) fish.x = -50;
            if (fish.x < -50) fish.x = this.width + 50;

            this.ctx.fillStyle = `rgba(0, 210, 255, ${fish.opacity})`;
            this.ctx.beginPath();
            // Oval body
            this.ctx.ellipse(fish.x, fish.y, fish.size, fish.size * 0.4, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Tail
            const tailDir = fish.speed > 0 ? -1 : 1;
            this.ctx.beginPath();
            this.ctx.moveTo(fish.x + (fish.size * tailDir), fish.y);
            this.ctx.lineTo(fish.x + (fish.size * 1.6 * tailDir), fish.y - 6);
            this.ctx.lineTo(fish.x + (fish.size * 1.6 * tailDir), fish.y + 6);
            this.ctx.closePath();
            this.ctx.fill();
        });
        this.ctx.restore();
    }

    drawParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // gravity
            p.alpha -= 0.025;

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.alpha;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1.0;
    }
}

window.CanvasRenderer = CanvasRenderer;
