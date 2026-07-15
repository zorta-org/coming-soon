const loadingScreen = document.getElementById('loadingScreen');
const terminalOutput = document.getElementById('terminalOutput');
const pageShell = document.getElementById('pageShell');
const heroParticles = document.getElementById('heroParticles');
const cursorLight = document.querySelector('.cursor-light');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
let cursorFrame = null;

function createTextLine(text, type = 'default') {
  const line = document.createElement('p');
  line.className = `terminal-line ${type}`;
  line.textContent = text;
  terminalOutput.appendChild(line);
  requestAnimationFrame(() => line.classList.add('visible'));
  return line;
}

async function runLoadingSequence() {
  const lines = [
    'Initializing internet...',
    'Loading communities ✓',
    'Loading portfolios ✓',
    'Loading freelancing ✓',
    'Loading hosting ✓',
    'Loading builders ✓'
  ];

  for (const line of lines) {
    createTextLine(line);
    await new Promise((resolve) => setTimeout(resolve, 220));
  }

  await new Promise((resolve) => setTimeout(resolve, 500));
  createTextLine('ERROR', 'error');
  createTextLine('The internet was never built for creators.', 'error');
  await new Promise((resolve) => setTimeout(resolve, 600));
  createTextLine('Rebuilding...', 'success');
  loadingScreen.querySelector('.terminal-window').classList.add('glitch');
  explodeParticles();
  await new Promise((resolve) => setTimeout(resolve, 420));
  loadingScreen.classList.add('hidden');
  document.body.classList.add('loaded');
}

function explodeParticles() {
  const burst = document.createElement('div');
  burst.className = 'burst-layer';
  document.body.appendChild(burst);
  for (let i = 0; i < 24; i += 1) {
    const particle = document.createElement('span');
    particle.style.left = '50%';
    particle.style.top = '50%';
    particle.style.setProperty('--x', `${(Math.random() - 0.5) * 260}px`);
    particle.style.setProperty('--y', `${(Math.random() - 0.5) * 260}px`);
    burst.appendChild(particle);
  }
  requestAnimationFrame(() => {
    Array.from(burst.children).forEach((child, index) => {
      const x = child.style.getPropertyValue('--x').trim();
      const y = child.style.getPropertyValue('--y').trim();
      child.animate(
        [
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          { transform: `translate(${x}, ${y}) scale(0.2)`, opacity: 0 }
        ],
        { duration: 780 + index * 6, easing: 'cubic-bezier(.2,.8,.2,1)' }
      );
    });
  });
  setTimeout(() => burst.remove(), 900);
}

function createHeroParticles() {
  if (!heroParticles) {
    return;
  }

  if (prefersReducedMotion) {
    return;
  }

  const particleCount = 16;
  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement('span');
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${6 + Math.random() * 5}s`;
    particle.style.animationDelay = `${Math.random() * 4}s`;
    heroParticles.appendChild(particle);
  }
}

function addTiltEffect() {
  if (prefersReducedMotion || isTouchDevice) {
    return;
  }

  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      const rotateX = ((0.5 - (y / rect.height))) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

function addMagneticMovement() {
  if (prefersReducedMotion || isTouchDevice) {
    return;
  }

  document.querySelectorAll('.btn-magnetic').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const offsetX = (x / rect.width - 0.5) * 8;
      const offsetY = (y / rect.height - 0.5) * 8;
      button.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });

    button.addEventListener('pointerleave', () => {
      button.style.transform = '';
    });
  });
}

function trackCursor() {
  if (!cursorLight || prefersReducedMotion || isTouchDevice) {
    return;
  }

  window.addEventListener('pointermove', (event) => {
    if (cursorFrame) {
      return;
    }

    cursorFrame = requestAnimationFrame(() => {
      cursorLight.style.left = `${event.clientX}px`;
      cursorLight.style.top = `${event.clientY}px`;
      cursorFrame = null;
    });
  }, { passive: true });
}

function initEcosystemOrbit() {
  const section = document.getElementById('ecosystem');
  const visual = document.getElementById('ecosystemVisual');
  const nodes = Array.from(document.querySelectorAll('.orbit-node'));

  if (!section || !visual || !nodes.length || !window.gsap || !window.ScrollTrigger) {
    return;
  }

  const core = visual.querySelector('.orbit-core');
  const centerX = () => visual.clientWidth / 2;
  const centerY = () => visual.clientHeight / 2;
  const radius = () => Math.min(290, visual.clientWidth * 0.36);

  const applyProgress = (progress) => {
    const eased = 1 - Math.pow(1 - progress, 2.4);
    const cx = centerX();
    const cy = centerY();
    const orbitRadius = radius();

    visual.style.setProperty('--merge-progress', eased.toFixed(3));

    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * Math.PI * 2;
      const fromX = cx + Math.cos(angle) * orbitRadius;
      const fromY = cy + Math.sin(angle) * orbitRadius;
      const x = fromX + (cx - fromX) * eased;
      const y = fromY + (cy - fromY) * eased;
      const opacity = Math.max(0.25, 1 - eased * 0.75);
      const scale = Math.max(0.76, 1 - eased * 0.24);
      const blur = eased > 0.62 ? `${(eased - 0.62) * 10}px` : '0px';

      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      node.style.opacity = String(opacity);
      node.style.filter = `blur(${blur})`;
      node.style.transform = `translate(-50%, -50%) scale(${scale})`;
      node.style.fontSize = `${Math.max(1, 1.05 - eased * 0.12)}rem`;
    });

    if (core) {
      core.style.transform = `translate(-50%, -50%) scale(${1 + eased * 0.08})`;
      core.style.opacity = String(Math.min(1, 0.82 + eased * 0.18));
    }
  };

  const refreshLayout = () => applyProgress(0);
  window.addEventListener('resize', refreshLayout);
  refreshLayout();

  window.gsap.fromTo(
    visual,
    { '--merge-progress': 0 },
    {
      '--merge-progress': 1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        end: 'bottom 16%',
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => applyProgress(self.progress),
      },
    }
  );
}

function initNetwork() {
  const networkNodes = Array.from(document.querySelectorAll('.network-node'));
  const lines = Array.from(document.querySelectorAll('.network-line'));

  if (!networkNodes.length) {
    return;
  }

  const clearState = () => {
    networkNodes.forEach((node) => node.classList.remove('is-active'));
    lines.forEach((line) => line.classList.remove('is-active'));
  };

  networkNodes.forEach((node) => {
    node.addEventListener('mouseenter', () => {
      clearState();
      const activeNode = node.dataset.node;
      node.classList.add('is-active');
      lines.forEach((line) => {
        if (line.dataset.source === activeNode || line.dataset.target === activeNode) {
          line.classList.add('is-active');
        }
      });
    });
    node.addEventListener('mouseleave', clearState);
    node.addEventListener('focus', () => {
      clearState();
      const activeNode = node.dataset.node;
      node.classList.add('is-active');
      lines.forEach((line) => {
        if (line.dataset.source === activeNode || line.dataset.target === activeNode) {
          line.classList.add('is-active');
        }
      });
    });
    node.addEventListener('blur', clearState);
  });
}

function initAiPrompts() {
  const prompt = document.getElementById('aiPrompt');
  const workflow = document.getElementById('aiWorkflow');
  const prompts = [
    { label: 'Build a Discord Bot', steps: ['Create project', 'Invite team', 'Deploy server', 'Share launch'] },
    { label: 'Launch a SaaS', steps: ['Map product', 'Recruit builders', 'Host prototype', 'Grow community'] },
    { label: 'Host a Minecraft Server', steps: ['Set up stack', 'Add communities', 'Publish docs', 'Launch events'] },
    { label: 'Start an AI Startup', steps: ['Define thesis', 'Find co-founder', 'Build MVP', 'Ship reputation'] },
    { label: 'Find a Co-Founder', steps: ['Create profile', 'Search network', 'Start collaboration', 'Share roadmap'] },
    { label: 'Deploy a Portfolio', steps: ['Create portfolio', 'Add projects', 'Connect recruiters', 'Publish proof'] },
    { label: 'Hire a Designer', steps: ['Describe brief', 'Review matches', 'Start contract', 'Deliver launch'] },
    { label: 'Create an Open Source Project', steps: ['Setup repo', 'Invite collaborators', 'Document it', 'Grow community'] }
  ];

  if (!prompt || !workflow) {
    return;
  }

  let index = 0;
  setInterval(() => {
    index = (index + 1) % prompts.length;
    const item = prompts[index];
    prompt.textContent = item.label;
    workflow.innerHTML = item.steps.map((step) => `<div class="workflow-card">${step}</div>`).join('');
  }, 2600);
}

function initScrollAnimations() {
  document.querySelectorAll('.reveal, .identity-module, .final-stage').forEach((element) => {
    element.style.opacity = '1';
    element.style.transform = 'none';
    element.style.filter = 'none';
  });
}

function initSmoothScroll() {
  if (prefersReducedMotion || isTouchDevice) {
    return;
  }

  document.documentElement.style.scrollBehavior = 'auto';
  document.documentElement.style.scrollPaddingTop = '0px';
}

function init() {
  createHeroParticles();
  addTiltEffect();
  addMagneticMovement();
  trackCursor();
  initEcosystemOrbit();
  initNetwork();
  initAiPrompts();
  initScrollAnimations();
  initSmoothScroll();
  runLoadingSequence();
}

window.addEventListener('DOMContentLoaded', init);
