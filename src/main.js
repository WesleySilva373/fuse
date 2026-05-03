import * as THREE from 'three';

// --- THREE.JS ADVANCED CORPORATE BACKGROUND ---
// Criando uma teia de nós (Node Web) elegante, lembrando conexões moleculares ou redes elétricas avançadas, similar a Integrated Biosciences.
const container = document.getElementById('hero-canvas-container');
if (container) {
  const scene = new THREE.Scene();
  // Fundo bem sutil em Fog para criar profundidade
  scene.fog = new THREE.FogExp2(0x050505, 0.03);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 25;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // otimização
  renderer.domElement.style.pointerEvents = 'none';
  container.appendChild(renderer.domElement);

  // Particles (Nós)
  const particlesCount = window.innerWidth < 768 ? 100 : 250;
  const positions = new Float32Array(particlesCount * 3);
  const velocities = [];

  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    velocities.push({
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
      z: (Math.random() - 0.5) * 0.02
    });
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Um brilho suave ciano (primary) nos pontos
  const material = new THREE.PointsMaterial({
    size: 0.15,
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Linhas
  const lineMaterial = new THREE.LineBasicMaterial({ 
    color: 0x00e5ff, 
    transparent: true, 
    opacity: 0.15,
    blending: THREE.AdditiveBlending
  });
  
  const lineGeometry = new THREE.BufferGeometry();
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  // Animação e Interação com Mouse
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;
  });

  const clock = new THREE.Clock();

  const animate = () => {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    targetX = mouseX * 2;
    targetY = mouseY * 2;
    
    // Rotação sutil da câmera com base no mouse
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (-targetY - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    // Mover partículas
    const posAttribute = geometry.attributes.position;
    const currentPositions = posAttribute.array;
    
    // Atualizar linhas
    const linePositions = [];
    
    for (let i = 0; i < particlesCount; i++) {
      currentPositions[i * 3] += velocities[i].x;
      currentPositions[i * 3 + 1] += velocities[i].y;
      currentPositions[i * 3 + 2] += velocities[i].z;

      // Wrap around bounds
      if (Math.abs(currentPositions[i * 3]) > 25) velocities[i].x *= -1;
      if (Math.abs(currentPositions[i * 3 + 1]) > 25) velocities[i].y *= -1;
      if (Math.abs(currentPositions[i * 3 + 2]) > 10) velocities[i].z *= -1;

      // Conexões
      for (let j = i + 1; j < particlesCount; j++) {
        const dx = currentPositions[i * 3] - currentPositions[j * 3];
        const dy = currentPositions[i * 3 + 1] - currentPositions[j * 3 + 1];
        const dz = currentPositions[i * 3 + 2] - currentPositions[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        // Conecta pontos próximos (distância ao quadrado para otimização)
        if (distSq < 15) {
          linePositions.push(
            currentPositions[i * 3], currentPositions[i * 3 + 1], currentPositions[i * 3 + 2],
            currentPositions[j * 3], currentPositions[j * 3 + 1], currentPositions[j * 3 + 2]
          );
        }
      }
    }

    posAttribute.needsUpdate = true;
    lines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

    // Parallax ao fazer scroll
    const scrollY = window.scrollY;
    scene.position.y = scrollY * 0.01;

    renderer.render(scene, camera);
  };

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// --- NAVBAR SCROLL EFFECT ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// --- SMOOTH SCROLL ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// --- REVEAL ANIMATIONS (SCROLL INTERSECTION) ---
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

revealElements.forEach(el => revealObserver.observe(el));

// --- MOBILE MENU LOGIC ---
const hamburgerMenu = document.getElementById('hamburger-menu');
const navMenu = document.getElementById('nav-menu');
const closeMenu = document.getElementById('close-menu');
const mobileOverlay = document.getElementById('mobile-menu-overlay');

function toggleMenu() {
    navMenu.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
}

if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', toggleMenu);
    closeMenu.addEventListener('click', toggleMenu);
    mobileOverlay.addEventListener('click', toggleMenu);
}

if (navMenu) {
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) toggleMenu();
        });
    });
}

// --- FUSEL AI ASSISTANT LOGIC ---
const fuselTrigger = document.getElementById('fusel-trigger');
const fuselChat = document.getElementById('fusel-chat');
const closeFusel = document.getElementById('close-fusel');
const fuselMessages = document.getElementById('fusel-messages');
const fuselInput = document.getElementById('fusel-input');
const sendFusel = document.getElementById('send-fusel');
const suggestionBtns = document.querySelectorAll('.suggestion-btn');

if (fuselTrigger && fuselChat && fuselMessages) {
    fuselTrigger.addEventListener('click', () => {
        fuselChat.classList.toggle('hidden');
        if (!fuselChat.classList.contains('hidden') && fuselMessages.children.length === 0) {
            addMessage('Olá. Sou o Fusel, a inteligência técnica da Fuseletric. Como posso auxiliar nos seus projetos hoje?', 'ai');
        }
    });
}

if (closeFusel && fuselChat) {
    closeFusel.addEventListener('click', () => fuselChat.classList.add('hidden'));
}

function handleSend() {
    const text = fuselInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    fuselInput.value = '';
    
    const typingId = showTyping();
    
    // Simulação corporativa e rápida
    setTimeout(() => {
        removeTyping(typingId);
        addMessage("Entendi sua necessidade. Nossa equipe de engenharia avaliará as especificações. Por favor, preencha o formulário em 'Trabalhe Conosco' ou solicite contato direto via corporate@fuseletric.com.", 'ai');
    }, 1500);
}

if (sendFusel) {
    sendFusel.addEventListener('click', handleSend);
}
if (fuselInput) {
    fuselInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}

suggestionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        fuselInput.value = btn.innerText;
        handleSend();
    });
});

function addMessage(text, role) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;
    msgDiv.innerText = text;
    fuselMessages.appendChild(msgDiv);
    fuselMessages.scrollTop = fuselMessages.scrollHeight;
}

function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai typing';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerText = '...';
    fuselMessages.appendChild(typingDiv);
    fuselMessages.scrollTop = fuselMessages.scrollHeight;
    return 'typing-indicator';
}

function removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

// Inicializar ícones (caso Lucide exista globalmente via CDN)
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}
