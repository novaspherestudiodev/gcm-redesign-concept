/* === GLOBAL STATE MANAGEMENT === */
const views = {
    landing: document.getElementById('view-landing'),
    auth: document.getElementById('view-auth'),
    dashboard: document.getElementById('view-dashboard')
};

// Function to switch between main views (Landing -> Auth -> Dashboard)
function navigateTo(viewName, subState = null) {
    const target = views[viewName];

    // 1. Hide ONLY the views that are NOT the target
    Object.values(views).forEach(el => {
        if (el !== target) { 
            el.classList.remove('active-view');
            // Wait for transition to finish before hiding
            setTimeout(() => {
                // Double check: Only add hidden-view if it's STILL not the active target
                // (This prevents flickering if user clicks fast)
                if (!el.classList.contains('active-view')) {
                    el.classList.add('hidden-view');
                }
            }, 500); 
        }
    });

    // 2. Show target view
    // Remove hidden class immediately so it occupies space
    target.classList.remove('hidden-view');
    
    // Small delay to allow browser to render 'display:block' before changing opacity
    setTimeout(() => {
        target.classList.add('active-view');
    }, 10);

    // 3. Handle Sub-states (like Login vs Signup)
    if (viewName === 'auth') {
        const container = document.getElementById('auth-container');
        if (subState === 'signup') {
            container.classList.add("right-panel-active");
        } else {
            container.classList.remove("right-panel-active");
        }
    }
    
    // 4. Trigger Animations if Dashboard
    if (viewName === 'dashboard') {
        initDashboard();
    }
}

/* === AUTHENTICATION LOGIC (PHASE 2) === */
// Toggle Animation between Sign In and Sign Up
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('auth-container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

// Handle Login Submit
function handleAuth(e, type) {
    e.preventDefault();
    if (type === 'login') {
        const btn = document.getElementById('login-btn');
        const text = document.getElementById('login-text');
        const loader = document.getElementById('login-loader');
        
        // Show Loading State
        text.style.display = 'none';
        loader.style.display = 'block';
        
        // Simulate Server Request (2 seconds)
        setTimeout(() => {
            navigateTo('dashboard');
            // Reset button
            text.style.display = 'block';
            loader.style.display = 'none';
        }, 2000);
    } else {
        alert("Request sent to Chamber Admin for approval.");
    }
}

/* === DASHBOARD LOGIC (PHASE 3) === */
function initDashboard() {
    renderChart();
}

function switchTab(element, tabId) {
    // Remove active class from sidebar
    document.querySelectorAll('.menu li').forEach(li => li.classList.remove('active'));
    element.classList.add('active');

    // Hide all tabs
    document.querySelectorAll('.dash-tab').forEach(tab => tab.classList.add('hidden-tab'));
    
    // Show target tab
    document.getElementById(tabId).classList.remove('hidden-tab');
}

// Generate Random Data for the Chart to make it look "Live"
function renderChart() {
    const chartContainer = document.getElementById('dynamic-chart');
    chartContainer.innerHTML = ''; // Clear existing
    
    const data = [45, 70, 30, 90, 60, 85, 50, 75, 40, 95];
    
    data.forEach((val, index) => {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.height = '0%'; // Start at 0 for animation
        bar.setAttribute('data-val', val + '%');
        
        chartContainer.appendChild(bar);
        
        // Animate height after small delay
        setTimeout(() => {
            bar.style.height = val + '%';
        }, index * 100);
    });
}

/* === BACKGROUND PARTICLES (CANVAS) === */
const canvas = document.getElementById('neural-net');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#F5B932'; // Gold
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = '#F5B932';
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0,0,innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
}

initParticles();
animateParticles();

window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    initParticles();
});