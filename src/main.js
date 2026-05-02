import * as THREE from 'three';

// --- THREE.JS HERO BACKGROUND ---
const container = document.getElementById('hero-canvas-container');
if (container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.pointerEvents = 'none';
  renderer.domElement.style.touchAction = 'none';
  container.appendChild(renderer.domElement);

  // Particles & Connections (Electric Circuit Style)
  const particlesCount = 150;
  const positions = new Float32Array(particlesCount * 3);
  const velocity = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 15;
    velocity[i] = (Math.random() - 0.5) * 0.01;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.08,
    color: 0x00D4FF,
    transparent: true,
    opacity: 1
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Connections (Lines)
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00D4FF, transparent: true, opacity: 0.3 });
  let lineGeometry = new THREE.BufferGeometry();
  let lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  // 3D Fuse Model (Premium Mesh)
  const fuseGroup = new THREE.Group();
  
  // Ceramic body
  const bodyGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.2, 32);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.1 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  fuseGroup.add(body);

  // Metallic caps
  const capGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.5, 32);
  const capMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.1, metalness: 0.9 });
  
  const capTop = new THREE.Mesh(capGeo, capMat);
  capTop.position.y = 1.35;
  fuseGroup.add(capTop);

  const capBottom = new THREE.Mesh(capGeo, capMat);
  capBottom.position.y = -1.35;
  fuseGroup.add(capBottom);

  // Extra details (Metallic rings)
  const ringGeo = new THREE.TorusGeometry(0.51, 0.02, 16, 100);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xFF6600, metalness: 1 });
  
  for(let i = -2; i <= 2; i++) {
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = i * 0.4;
    fuseGroup.add(ring);
  }

  // Lights for fuse
  const orangeLight = new THREE.PointLight(0xFF6600, 50, 20);
  orangeLight.position.set(5, 0, 5);
  scene.add(orangeLight);

  const blueLight = new THREE.PointLight(0x00D4FF, 50, 20);
  blueLight.position.set(-5, 5, 5);
  scene.add(blueLight);
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  fuseGroup.position.set(3, 0, 0);
  scene.add(fuseGroup);

  camera.position.z = 5;

  // Animation Loop
  const animate = () => {
    requestAnimationFrame(animate);

    // Update Particles
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] += velocity[i];
      if (positions[i] > 8 || positions[i] < -8) velocity[i] *= -1;
    }
    geometry.attributes.position.needsUpdate = true;

    // Update Lines (connect nearby particles)
    const lineCoords = [];
    for (let i = 0; i < particlesCount; i++) {
      for (let j = i + 1; j < particlesCount; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 1.5) {
          lineCoords.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
          lineCoords.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
        }
      }
    }
    lines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(lineCoords, 3));

    // Rotate Fuse
    fuseGroup.rotation.y += 0.01;
    fuseGroup.rotation.x += 0.005;

    // Responsive Position
    if (window.innerWidth < 768) {
      fuseGroup.visible = false;
    } else {
      fuseGroup.visible = true;
      fuseGroup.position.x = window.innerWidth > 1200 ? 3.5 : 2.5;
    }

    // Parallax Effect
    const scrollY = window.scrollY;
    container.style.transform = `translateY(${scrollY * 0.4}px)`;

    renderer.render(scene, camera);
  };

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// --- LOGO GLITCH EFFECT ---
const logo = document.querySelector('.logo');
if (logo) {
  setTimeout(() => {
    logo.classList.add('glitch-active');
    setTimeout(() => {
      logo.classList.remove('glitch-active');
    }, 1000);
  }, 500);
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
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// --- REVEAL ANIMATIONS ---
const revealElements = document.querySelectorAll('section, .product-card, .stat-item');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => {
  if (!el.classList.contains('hero')) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    revealObserver.observe(el);
  }
});

// --- MOBILE MENU LOGIC ---
const hamburgerMenu = document.getElementById('hamburger-menu');
const navMenu = document.getElementById('nav-menu');
const closeMenu = document.getElementById('close-menu');
const mobileOverlay = document.getElementById('mobile-menu-overlay');

function toggleMenu() {
    const isOpen = navMenu.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.classList.toggle('menu-open', isOpen);
}

if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', toggleMenu);
    closeMenu.addEventListener('click', toggleMenu);
    mobileOverlay.addEventListener('click', toggleMenu);
}

// Close on ESC and Link click
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (navMenu.classList.contains('active')) toggleMenu();
        if (!fuselChat.classList.contains('hidden')) fuselChat.classList.add('hidden');
    }
});

navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) toggleMenu();
    });
});

// --- FORM SIMULATION ---
const form = document.querySelector('form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'Enviando...';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerText = 'Solicitação Enviada!';
      btn.style.backgroundColor = '#28a745';
      form.reset();
      setTimeout(() => {
        btn.innerText = originalText;
        btn.style.backgroundColor = '';
        btn.disabled = false;
      }, 3000);
    }, 1500);
  });
}

// Initial icons
lucide.createIcons();

// --- FUSEL AI ASSISTANT LOGIC ---
const fuselTrigger = document.getElementById('fusel-trigger');
const fuselChat = document.getElementById('fusel-chat');
const closeFusel = document.getElementById('close-fusel');
const fuselMessages = document.getElementById('fusel-messages');
const fuselInput = document.getElementById('fusel-input');
const sendFusel = document.getElementById('send-fusel');
const suggestionBtns = document.querySelectorAll('.suggestion-btn');

// Configuração da API (IMPORTANTE: Use variáveis de ambiente em produção)
const ANTHROPIC_API_KEY = 'SUA_CHAVE_AQUI'; // Substitua pela sua chave
const API_URL = 'https://api.anthropic.com/v1/messages';

let conversationHistory = [];

// Toggle Chat
fuselTrigger.addEventListener('click', () => {
    fuselChat.classList.toggle('hidden');
    if (!fuselChat.classList.contains('hidden') && fuselMessages.children.length === 0) {
        addMessage('Olá! Sou o Fusel, assistente técnico da Fuseletric. Como posso ajudar você a escolher o fusível ideal para sua aplicação?', 'ai');
    }
});

closeFusel.addEventListener('click', () => fuselChat.classList.add('hidden'));

// Send Message
async function handleSend() {
    const text = fuselInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    fuselInput.value = '';
    
    // Mostra indicador de digitação
    const typingId = showTyping();
    
    // MODO MOCK: Se não houver chave, responde com simulação técnica
    if (ANTHROPIC_API_KEY === 'SUA_CHAVE_AQUI') {
        setTimeout(() => {
            removeTyping(typingId);
            const mockResponse = getMockResponse(text);
            addMessage(mockResponse, 'ai');
            conversationHistory.push({ role: 'user', content: text });
            conversationHistory.push({ role: 'assistant', content: mockResponse });
        }, 1000);
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'dangerously-allow-browser': 'true' // Necessário para chamadas client-side
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229', // Atualizado para um modelo válido
                max_tokens: 1024,
                system: "Você é Fusel, o assistente técnico virtual da Fuseletric, empresa brasileira fabricante de fusíveis industriais. Responda sempre em português. Ajude os usuários a escolher o fusível correto, explique especificações técnicas, oriente sobre aplicações (industrial, média tensão, fotovoltaico). Para orçamentos, colete: produto desejado, quantidade, tensão e corrente nominal, e informe que a equipe entrará em contato via vendas@fuseletric.com.br ou (11) 9 8460-7777. Seja técnico mas acessível.",
                messages: [...conversationHistory, { role: 'user', content: text }]
            })
        });

        const data = await response.json();
        removeTyping(typingId);

        if (data.content && data.content[0]) {
            const aiText = data.content[0].text;
            addMessage(aiText, 'ai');
            conversationHistory.push({ role: 'user', content: text });
            conversationHistory.push({ role: 'assistant', content: aiText });
        } else {
            addMessage('Desculpe, tive um problema técnico. Pode tentar novamente?', 'ai');
        }
    } catch (error) {
        console.error('Erro Fusel:', error);
        removeTyping(typingId);
        addMessage('Ops! Parece que estou offline no momento. Tente novamente mais tarde.', 'ai');
    }
}

sendFusel.addEventListener('click', handleSend);
fuselInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});

// Suggestions
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
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    fuselMessages.appendChild(typingDiv);
    fuselMessages.scrollTop = fuselMessages.scrollHeight;
    return 'typing-indicator';
}

function removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

// Respostas simuladas para demonstração
function getMockResponse(text) {
    const query = text.toLowerCase();
    if (query.includes('solar') || query.includes('fotovoltaico')) {
        return "Para sistemas fotovoltaicos, recomendo nossos fusíveis gPV (10x38mm ou NH). Eles suportam tensões de até 1500Vcc e são projetados para as correntes de retorno das strings. Qual a corrente nominal do seu inversor?";
    }
    if (query.includes('motor')) {
        return "Para proteção de motores, o ideal são os fusíveis classe aM (acompanhamento de motor), pois suportam o pico de partida sem desarmar. Temos opções de NH 000 a NH 4.";
    }
    if (query.includes('orçamento') || query.includes('comprar')) {
        return "Com certeza! Para um orçamento preciso, por favor informe o tipo de fusível, a corrente (A) e a tensão (V). Você também pode falar diretamente com vendas@fuseletric.com.br.";
    }
    return "Entendi sua dúvida. Como assistente técnico da Fuseletric, posso te orientar sobre especificações de fusíveis NH, HH, gPV e cilíndricos. Qual categoria de proteção você busca?";
}
