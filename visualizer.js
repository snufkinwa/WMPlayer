export function visualize(player) {
    const canvas = document.querySelector("canvas");
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error('Failed to get canvas context');
        return;
    }

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const particles = [];
    let radius = 0;
    const angleIncrement = 0.1;
    let angle = 0;

    function createParticle(x, y, color) {
        return {
            x,
            y,
            color,
            size: Math.random() * 5 + 1,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2
        };
    }

    function updateParticles() {
        particles.forEach((particle, index) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.size *= 0.95;
            if (particle.size < 0.5) {
                particles.splice(index, 1);
            }
        });
    }

    function drawBackground() {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "rgb(0, 0, 0)");
        gradient.addColorStop(1, "rgb(0, 0, 50)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawWave(dataArray) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        for (let i = 0; i < dataArray.length; i++) {
            const y = canvas.height / 2 + dataArray[i] / 128.0 * canvas.height / 4;
            ctx.lineTo((i / dataArray.length) * canvas.width, y);
        }
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function drawSpiral(dataArray) {
        for (let i = 0; i < dataArray.length; i++) {
            const amplitude = dataArray[i] / 128.0;
            const hue = i / dataArray.length * 360;
            const saturation = amplitude * 100;
            const lightness = amplitude * 50;
            const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.fillStyle = color;

            const barHeight = amplitude * 100;
            const barWidth = 5;
            ctx.fillRect(-barWidth / 2, -barHeight / 2, barWidth, barHeight);

            ctx.restore();

            particles.push(createParticle(x, y, color));

            angle += angleIncrement;
            radius += 0.5;
        }
    }

    function drawParticles() {
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });
    }

    function draw() {
        if (!player.initialized || player.audioElement.paused) {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            requestAnimationFrame(draw);
            return;
        }

        const analyser = player.analyser;
        const dataArray = player.dataArray;
        analyser.getByteFrequencyData(dataArray);

        drawBackground();
        drawWave(dataArray);
        drawSpiral(dataArray);
        drawParticles();
        updateParticles();

        if (radius > Math.min(canvas.width, canvas.height) / 2) {
            radius = 0;
            angle = 0;
        }

        requestAnimationFrame(draw);
    }

    draw();
}
