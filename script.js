// Animated Background Canvas
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;

// Particle System
let particles = [];
const PARTICLE_COUNT = 100;
const RED_ACCENT = 'rgba(180, 40, 40, ';
const WHITE_ACCENT = 'rgba(255, 255, 255, ';

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.isRed = Math.random() > 0.7;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap around edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
        
        // Gentle sine wave movement
        this.y += Math.sin(Date.now() * 0.001 * this.size) * 0.1;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const color = this.isRed ? RED_ACCENT : WHITE_ACCENT;
        ctx.fillStyle = color + this.opacity + ')';
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initParticles();
}

// Gradient Animation
let gradientOffset = 0;

function animateBackground() {
    if (!ctx) return;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(
        Math.sin(gradientOffset) * width * 0.2 + width * 0.5,
        Math.cos(gradientOffset * 0.7) * height * 0.2 + height * 0.5,
        Math.sin(gradientOffset + Math.PI) * width * 0.2 + width * 0.5,
        Math.cos(gradientOffset * 0.7 + Math.PI) * height * 0.2 + height * 0.5
    );
    
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(0.5, '#0a0505');
    gradient.addColorStop(1, '#1a0a0a');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    // Draw subtle connecting lines between nearby particles
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(180, 40, 40, 0.1)';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(180, 40, 40, ${0.05 * (1 - distance / 120)})`;
                ctx.stroke();
            }
        }
    }
    
    gradientOffset += 0.002;
    requestAnimationFrame(animateBackground);
}

// Modal and Main Content Logic
const modal = document.getElementById('welcomeModal');
const enterBtn = document.getElementById('enterBtn');
const mainContent = document.getElementById('mainContent');

// Check if user has already entered (session storage)
const hasEntered = sessionStorage.getItem('chaosAwakened');

if (hasEntered) {
    // Skip modal if already entered in this session
    modal.classList.add('hide');
    mainContent.classList.remove('hidden');
} else {
    // Show modal normally
    modal.classList.remove('hide');
    mainContent.classList.add('hidden');
}

enterBtn.addEventListener('click', () => {
    // Add hide class to modal with transition
    modal.classList.add('hide');
    
    // Show main content after modal transition
    setTimeout(() => {
        mainContent.classList.remove('hidden');
        // Store in session storage to prevent modal reappearance on page refresh
        sessionStorage.setItem('chaosAwakened', 'true');
    }, 500);
});

// Handle window resize for canvas
window.addEventListener('resize', () => {
    resizeCanvas();
});

// Initialize canvas and start animation
resizeCanvas();
initParticles();
animateBackground();

// Optional: Add smooth scroll for any internal links (if added later)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
