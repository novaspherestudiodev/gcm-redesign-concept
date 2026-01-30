/* === GLOBAL STATE MANAGEMENT === */
const views = {
    landing: document.getElementById('view-landing'),
    auth: document.getElementById('view-auth'),
    dashboard: document.getElementById('view-dashboard')
};

function navigateTo(viewName, subState = null) {
    const target = views[viewName];
    
    // Hide others
    Object.values(views).forEach(el => {
        if (el !== target) { 
            el.classList.remove('active-view');
            setTimeout(() => {
                if (!el.classList.contains('active-view')) el.classList.add('hidden-view');
            }, 500); 
        }
    });

    // Show Target
    target.classList.remove('hidden-view');
    setTimeout(() => target.classList.add('active-view'), 10);

    if (viewName === 'auth') {
        const container = document.getElementById('auth-container');
        if (subState === 'signup') container.classList.add("right-panel-active");
        else container.classList.remove("right-panel-active");
    }
    
    if (viewName === 'dashboard') {
        initDashboard();
    }
}

/* === AUTH LOGIC === */
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('auth-container');

if(signUpButton && signInButton) {
    signUpButton.addEventListener('click', () => container.classList.add("right-panel-active"));
    signInButton.addEventListener('click', () => container.classList.remove("right-panel-active"));
}

function handleAuth(e, type) {
    e.preventDefault();
    if (type === 'login') {
        const text = document.getElementById('login-text');
        const loader = document.getElementById('login-loader');
        text.style.display = 'none';
        loader.style.display = 'block';
        
        setTimeout(() => {
            navigateTo('dashboard');
            text.style.display = 'block';
            loader.style.display = 'none';
        }, 1500);
    } else {
        alert("Request sent to Chamber Admin.");
    }
}

/* === DASHBOARD LOGIC === */
let chartInterval;
const dataPoints = [40, 65, 30, 85, 50, 95, 60, 80, 45, 75, 55, 90, 30, 60]; // 14 points

function initDashboard() {
    renderCharts();
    // Simulate live data updates every 3 seconds
    clearInterval(chartInterval);
    chartInterval = setInterval(updateLiveCharts, 3000);
}

function switchTab(element, tabId) {
    document.querySelectorAll('.menu li').forEach(li => li.classList.remove('active'));
    element.classList.add('active');
    document.querySelectorAll('.dash-tab').forEach(tab => tab.classList.add('hidden-tab'));
    document.getElementById(tabId).classList.remove('hidden-tab');
}

/* --- ADVANCED CHARTING ENGINE --- */
function renderCharts() {
    // 1. Render Bar Chart
    const barContainer = document.getElementById('bar-container');
    barContainer.innerHTML = '';
    
    dataPoints.forEach((val, i) => {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.height = '0%';
        bar.title = val + '%';
        barContainer.appendChild(bar);
        setTimeout(() => bar.style.height = val + '%', i * 50);
    });

    // 2. Render Line Chart (SVG)
    renderLineSVG();
}

function renderLineSVG() {
    const svgWidth = 100;
    const svgHeight = 50;
    const step = svgWidth / (dataPoints.length - 1);
    
    // Generate Path "d" attribute
    let pathD = `M 0,${svgHeight - (dataPoints[0]/100 * svgHeight)} `;
    
    dataPoints.forEach((val, i) => {
        if (i === 0) return;
        const x = i * step;
        const y = svgHeight - (val / 100 * svgHeight);
        pathD += `L ${x},${y} `;
    });

    const linePath = document.getElementById('chart-line');
    const areaPath = document.getElementById('chart-area');
    
    linePath.setAttribute('d', pathD);
    // Close area path for gradient fill
    areaPath.setAttribute('d', pathD + `L ${svgWidth},${svgHeight} L 0,${svgHeight} Z`);
}

function updateLiveCharts() {
    // Shift data: remove first, add new random
    dataPoints.shift();
    dataPoints.push(Math.floor(Math.random() * 70) + 20);
    renderCharts(); // Re-render with new data
    
    // Update text stats randomly
    document.getElementById('live-grid').innerText = Math.floor(Math.random() * 15 + 80) + "%";
}

/* --- VIEW MODES --- */
function setChartMode(mode) {
    const btnBar = document.getElementById('btn-bar');
    const btnLine = document.getElementById('btn-line');
    const viewBar = document.getElementById('view-bar');
    const viewLine = document.getElementById('view-line');

    if (mode === 'bar') {
        btnBar.classList.add('active');
        btnLine.classList.remove('active');
        viewBar.classList.remove('hidden-chart');
        viewBar.classList.add('active-chart');
        viewLine.classList.add('hidden-chart');
        viewLine.classList.remove('active-chart');
    } else {
        btnLine.classList.add('active');
        btnBar.classList.remove('active');
        viewLine.classList.remove('hidden-chart');
        viewLine.classList.add('active-chart');
        viewBar.classList.add('hidden-chart');
        viewBar.classList.remove('active-chart');
    }
}

function toggleMapMode() {
    const map = document.getElementById('geo-map');
    const wrapper = document.querySelector('.visual-wrapper'); // We toggle contents inside wrapper
    
    if (map.classList.contains('hidden-view')) {
        map.classList.remove('hidden-view');
    } else {
        map.classList.add('hidden-view');
    }
}

function toggleCrisisMode() {
    const main = document.getElementById('main-interface');
    const banner = document.getElementById('crisis-banner');
    
    if (!main.classList.contains('crisis-active')) {
        main.classList.add('crisis-active');
        banner.classList.remove('crisis-hidden');
    } else {
        main.classList.remove('crisis-active');
        banner.classList.add('crisis-hidden');
    }
}

function runAiPrediction() {
    const el = document.getElementById('live-gold');
    el.style.color = 'var(--gold)';
    let c = 0;
    const i = setInterval(() => {
        el.innerText = Math.floor(Math.random() * 9000000).toLocaleString();
        c++;
        if(c > 20) {
            clearInterval(i);
            el.innerText = "3,100,050 (AI PROJECTION)";
            el.style.color = "#0f0";
        }
    }, 50);
}

/* === PARTICLES === */
const canvas = document.getElementById('neural-net');
const ctx = canvas.getContext('2d');
let particlesArray;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = '#F5B932';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    for (let i = 0; i < 100; i++) particlesArray.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();