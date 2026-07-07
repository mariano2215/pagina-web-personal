// ============================================
// JS listo: habilita la animación fade-up vía CSS (.js-ready).
// Sin esta clase, el contenido se ve siempre — protege contra zonas negras
// si IntersectionObserver no dispara o el JS falla más abajo.
// ============================================
document.documentElement.classList.add('js-ready');

// ============================================
// Menú mobile
// ============================================
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
}

// Cerrar menú al hacer click en un link
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
  });
});

// ============================================
// LANGUAGE SELECTOR
// ============================================
const translations = {
  en: {
    // Meta
    'meta-title': 'Mariano Calandra — Clear marketing. Real growth.',
    'meta-description': 'Mariano Calandra — Business strategist, consultant and Paid Media specialist. Clear marketing. Real growth.',

    // Nav
    'nav-home': 'Home',
    'nav-quien': 'About me',
    'nav-proyectos': 'EPIGROUP',
    'nav-contacto': 'Contact',

    // Hero
    'hero-eyebrow': 'Clear marketing · Real growth',
    'hero-headline': 'Transform your marketing and put your sales on <span>autopilot.</span>',
    'hero-subtitle': 'Strategy, paid media and consulting for <strong>digital marketing freelancers, B2C ventures and B2B SMBs</strong> that want to turn their ads into real sales.',
    'hero-btn-primary': 'Request your free audit →',
    'hero-btn-secondary': "Let's talk about your business →",
    'hero-microcopy': 'Rosario, Argentina · Working with clients across Argentina and LATAM',
    'hero-img-alt': 'Mariano Calandra — Business strategist and Paid Media specialist',

    // Posicionamiento
    'pos-title': 'An integrated view for businesses that want to grow',
    'pos-p1': 'I don\'t treat marketing as separate pieces. I think of it as a system where every part matters: strategy, brand, offer, ads, content, measurement, sales and customer experience.',
    'pos-p2': 'My approach combines <strong>sales, paid media, consulting, artificial intelligence and business vision</strong> to help brands grow with more clarity, better decisions and concrete actions.',
    'pos-highlight': "Marketing doesn't start with a campaign. It starts with a clear strategy.",

    // Áreas
    'areas-title': 'What improves your business',
    'areas-subtitle': 'I work with companies, SMBs, entrepreneurs, ecommerce, personal brands, agencies and digital projects that need to <strong>organize their strategy, generate demand and sell better.</strong>',
    'areas-card1-title': 'Digital Marketing Services',
    'areas-card1-desc': 'Performance marketing, content creation, video production, websites, landing pages, email marketing and SEO. Everything you need to attract, convert and scale.',
    'areas-card1-cta': 'See services →',
    'areas-card2-title': 'Business Consulting',
    'areas-card2-desc': 'In-depth diagnosis, positioning, value proposition and a clear, actionable growth plan. Marketing, communication and sales aligned with clarity before you scale.',
    'areas-card2-cta': 'See details →',
    'areas-card3-title': 'Automation & AI for businesses',
    'areas-card3-desc': 'Automation of social media, CRM, workflows and chatbots with artificial intelligence. Systems that work for you, save time and organize your business processes.',
    'areas-card3-cta': 'See details →',

    // Quién soy
    'quien-title': 'About me',
    'quien-subtitle': 'My name is <strong>Mariano Calandra</strong>, I\'m <strong>28 years old</strong> and I\'m from <strong>Rosario, Argentina</strong>.',
    'quien-p1': 'My experience defines me as a <strong>business strategist, consultant and Paid Media specialist</strong>, always focused on <strong>strategic marketing, sales and commercial processes, and AI applied to companies</strong>.',
    'quien-p2': 'But before talking about campaigns, metrics, funnels or automations, my story started in a much simpler place: <strong>selling</strong>.',
    'quien-p3': 'In 2016 I started working in sales at a travel agency. That\'s where I understood something that still guides the way I see marketing today: before selling more, you have to understand better. Understand what the person wants, what problem they have, what objections come up and what they need to hear to make a decision.',
    'quien-p4': 'In 2018, while studying, I launched my first business with a friend from school: a phone-accessories store. Small in size but huge in learning. It showed me up close what it means to try to sell, communicate, differentiate and create real momentum in your own business.',
    'quien-p5': 'In 2020 I founded <strong>EPICALCOS</strong>, a graphic communication store specialized in stickers, vinyls and personalized products. That project is the one that made me fall in love with marketing for good. Not from theory, but from practice: building a brand, communicating it, selling, running ads, helping customers, understanding the product, testing offers and building a community around an idea.',
    'quien-p6': 'From 2021 and 2022 I started studying marketing in depth and offering services to agencies, entrepreneurs, SMBs, B2B and B2C businesses, ecommerce, personal brands, traditional industries and digital projects.',
    'quien-p7': 'Today I work as <strong>Paid Media at LA IDEA Creative Agency</strong>, where I manage advertising campaigns and growth strategies for different brands. I also keep developing my own ecosystem of projects: <strong>EPICALCOS</strong>, <strong>EPIBRANDS</strong> and <strong>EPICADEMY</strong>.',
    'quien-p8': 'That combination lets me look at each business from several angles: the seller\'s, the entrepreneur\'s, the strategist\'s, the advertiser\'s and the consultant\'s.',
    'quien-p9': 'That\'s why my work doesn\'t start by asking "what campaign do we run", but by first understanding <strong>what the business needs to sell, to whom, with what message and under what commercial system</strong>.',
    'quien-img-alt': 'Mariano Calandra',

    // Timeline
    'tl-title': 'My journey',
    'tl-2016': 'First steps in sales',
    'tl-2018': 'First business of my own',
    'tl-2020': 'EPICALCOS is born',
    'tl-2021': 'Marketing and consulting',
    'tl-2025': 'EPIBRANDS · EPICADEMY',
    'tl-hoy-year': 'Today',
    'tl-hoy': 'Paid Media at LA IDEA',

    // Resultados / Testimonios
    'testi-title': 'Real client results',
    'testi-subtitle': 'A few numbers from campaigns I manage at LA IDEA Creative Agency and EPIBRANDS. Quotes are drafted from the results and pending validation with each client.',
    'testi-1-tag': 'Google Ads · Search campaign',
    'testi-1-metric-label': 'Campaign ROAS',
    'testi-1-secondary-label': 'ARS in purchases generated',
    'testi-1-quote': '"We went from spending on Google Ads without a clear strategy to generating over $4M in sales with a 13.4x ROAS. Mariano understood the business quickly and built campaigns that actually sold."',
    'testi-1-role': 'General Manager',
    'testi-1-company': 'Foodservice equipment company (Rosario, Argentina)',
    'testi-2-tag': 'Meta Ads · Lead generation',
    'testi-2-metric-label': 'Leads generated in 1 month',
    'testi-2-secondary-label': 'ARS · Average CPL',
    'testi-2-quote': '"We needed a predictable channel to generate qualified leads in capital markets. In the first month the Meta Ads campaign delivered 271 leads at a very competitive cost for our industry."',
    'testi-2-role': 'Head of Marketing',
    'testi-2-company': 'Argentine securities brokerage (ALYC) · Capital markets',
    'testi-3-tag': 'Instagram · Organic growth',
    'testi-3-metric-label': 'Views on social media',
    'testi-3-quote': '"We started from zero and over the past year built a huge community. Over 1 million views and more than 110,000 Instagram followers, with content that truly connects with the audience and positioned the blog as a reference."',
    'testi-3-role': 'Co-Founder',
    'testi-3-company': 'Psychology blog',
    'testi-4-tag': 'Consulting + AI · Web development',
    'testi-4-metric-label': 'Saved on web development',
    'testi-4-secondary-label': 'Applied to the process',
    'testi-4-quote': '"Mariano helped us rethink part of our web development by combining consulting and artificial intelligence. We saved over USD 5,000 in work we used to outsource, without losing quality or delivery times."',
    'testi-4-role': 'Manager',
    'testi-4-company': 'Software development company',

    // Filosofía
    'filo-title': 'ESCALA™ Method',
    'filo-subtitle': 'A clear strategy to grow your business with judgment.',
    'filo-p1': 'We don\'t believe in posting for the sake of posting, investing without measuring, or running isolated actions hoping for results.',
    'filo-p2': 'With the <strong>ESCALA™ Method</strong>, we analyze your business, design a tailored strategy, execute the necessary actions, and optimize every decision to grow with structure, data and commercial focus.',
    'filo-highlight': 'When marketing is done with strategy, it stops being an expense and becomes a concrete tool for growth.',

    // Habilidades
    'skills-title': 'Experience and skills',
    'skills-subtitle': '+10 years working with all these tools and developing these skills.',
    'skills-cat-pauta': 'Ad platforms',
    'skills-cat-medicion': 'Measurement & analytics',
    'skills-cat-estrategia': 'Strategy & business',
    'skills-cat-contenido': 'Content & brand',
    'chip-meta': 'Meta Ads',
    'chip-google': 'Google Ads',
    'chip-tiktok': 'TikTok Ads',
    'chip-ga4': 'GA4',
    'chip-gtm': 'Google Tag Manager',
    'chip-paid': 'Paid Media',
    'chip-estrategia': 'Commercial strategy',
    'chip-consultoria': 'Business consulting',
    'chip-planning': 'Strategic planning',
    'chip-ai': 'AI automation',
    'chip-content': 'Content strategy',
    'chip-ventas': 'Sales',
    'chip-branding': 'Branding & positioning',
    'chip-digital': 'Digital business',
    'chip-medicion': 'Measurement & analytics',
    'chip-embudos': 'Sales funnels',
    'chip-reportes': 'Reporting',
    'chip-opt': 'Campaign optimization',

    // Proyectos
    'proj-title': 'EPIGROUP',
    'proj-subtitle': 'An ecosystem built from practice.',
    'proj-intro1': 'My projects all come from the same idea: <strong>doing marketing from real experience</strong>. Not just from theory, but from the process of building brands, selling products, growing communities, launching services and turning knowledge into systems that can help other businesses.',
    'proj-intro2': 'Each project represents a different part of my journey: graphic communication, integrated marketing and digital education.',

    'proj1-tagline': 'Graphic communication, personalization and visual culture',
    'proj1-d1': 'EPICALCOS was born in 2020 as a store of stickers, vinyls and personalized products. It was the project that fully connected me with the world of marketing, communication and brand building.',
    'proj1-d2': 'What started as a sticker store turned into a real marketing lab: product creation, social media management, Meta Ads advertising, customer service, offer development, content production and direct sales.',
    'proj1-meaning-title': 'EPICALCOS represents my entrepreneurial, creative and commercial side.',
    'proj1-meaning-desc': 'It\'s the project where I learned to sell from scratch, communicate better and understand the value of a brand with personality.',
    'proj1-cta': 'Discover EPICALCOS →',

    'proj2-tagline': 'Integrated marketing for companies that want to grow',
    'proj2-d1': 'EPIBRANDS Marketing Studio is a natural evolution of my experience working with campaigns, businesses, brands and commercial processes.',
    'proj2-d2': 'It\'s a project focused on providing integrated marketing services for companies, SMBs, entrepreneurs, personal brands and digital projects that need to organize their communication, improve their campaigns and build a more professional strategy.',
    'proj2-meaning-title': 'EPIBRANDS represents my strategic vision of marketing.',
    'proj2-meaning-desc': 'It\'s the space where paid media, branding, content, consulting, AI, sales and commercial planning come together.',
    'proj2-cta': 'Discover EPIBRANDS →',

    'proj3-tagline': 'Digital education to learn marketing, AI and business',
    'proj3-d1': 'EPICADEMY is an online course platform built to turn knowledge into practical, clear and actionable training.',
    'proj3-d2': 'It\'s built around the idea of bringing content on marketing, digital advertising, artificial intelligence, sales, digital business and professional skills to people who want to learn without filler — with real examples and an applied view of today\'s market.',
    'proj3-meaning-title': 'EPICADEMY represents my educational and expansive side.',
    'proj3-meaning-desc': 'It\'s the project where I turn experience, tools and methodologies into resources so other people can grow professionally.',
    'proj3-cta': 'Discover EPICADEMY →',

    'proj-closing-title': 'Three projects. One shared vision.',
    'proj-closing-p1': 'EPICALCOS, EPIBRANDS and EPICADEMY are different, but they share the same root: <strong>create, communicate, sell and grow with strategy</strong>.',
    'proj-closing-p2': 'Each one lets me experiment, learn and apply marketing in real scenarios. And that experience comes back into my work as a consultant, paid media specialist and business strategist.',
    'proj-closing-p3': 'Because for me, marketing isn\'t understood just by studying it. It\'s understood by doing it.',

    // Proyecto image alts
    'proj1-img-alt': 'EPICALCOS — Stickers and graphic communication store',
    'proj2-img-alt': 'EPIBRANDS Marketing Studio',
    'proj3-img-alt': 'EPICADEMY — Online marketing courses',

    // Sobre mí (teaser en la home)
    'about-teaser-title': "Who's behind this",
    'about-teaser-text': 'I\'m Mariano Calandra, from Rosario, Argentina. In 2020 I founded my first brand, EPICALCOS, and that\'s where I fell in love with marketing: not from theory, but from selling, running ads and building a community. Today I bring that same experience to the businesses I work with.',
    'about-teaser-link': 'Get to know my story →',

    // Contacto
    'contact-title': "Let's talk about your business",
    'contact-intro1': 'If you made it this far, you\'re probably looking to organize your marketing, improve your campaigns, sell more or get an outside perspective that helps you make better decisions.',
    'contact-intro2': 'Tell me what stage your business is in, what you\'re looking to improve and the main challenge you want to solve. If you feel I can help you, write to me.',

    'contact-label-email': 'Email',
    'contact-label-whatsapp': 'WhatsApp',
    'contact-label-linkedin': 'LinkedIn',
    'contact-label-instagram': 'Instagram',
    'contact-label-ubicacion': 'Location',
    'contact-ubicacion-value': 'Rosario, Argentina · Clients in Arg and LATAM',

    // Form
    'form-nombre': 'Full name',
    'form-nombre-ph': 'Your full name',
    'form-email': 'Email',
    'form-email-ph': 'you@email.com',
    'form-whatsapp': 'WhatsApp',
    'form-whatsapp-ph': '+54 9 341 ...',
    'form-empresa': 'Company / Project',
    'form-empresa-ph': 'Your business name',
    'form-sitio': 'Website or Instagram',
    'form-sitio-ph': 'www.yourbusiness.com or @account',
    'form-necesidad': 'What do you need to work on?',
    'form-necesidad-opt0': 'Select an option',
    'form-necesidad-opt1': 'Marketing / business consulting',
    'form-necesidad-opt2': 'Paid Media',
    'form-necesidad-opt3': 'Commercial strategy',
    'form-necesidad-opt4': 'Sales',
    'form-necesidad-opt5': 'AI applied to the business',
    'form-necesidad-opt6': 'Content / communication',
    'form-necesidad-opt7': 'Branding / positioning',
    'form-necesidad-opt8': 'Other',
    'form-situacion': 'Tell me briefly about your situation',
    'form-situacion-ph': 'What stage is your business in? What are you looking to improve?',
    'form-presupuesto': 'Estimated monthly budget',
    'form-presupuesto-opt0': 'Select a range',
    'form-presupuesto-opt1': 'Less than USD 300',
    'form-presupuesto-opt2': 'USD 300 to 500',
    'form-presupuesto-opt3': 'USD 500 to 1,000',
    'form-presupuesto-opt4': 'USD 1,000 to 3,000',
    'form-presupuesto-opt5': 'More than USD 3,000',
    'form-presupuesto-opt6': "I haven't defined it yet",
    'form-inicio': 'When would you like to start?',
    'form-inicio-opt0': 'Select an option',
    'form-inicio-opt1': 'As soon as possible',
    'form-inicio-opt2': 'This month',
    'form-inicio-opt3': 'In the next 2 or 3 months',
    'form-inicio-opt4': 'Exploring options',
    'form-optional': '(optional)',
    'form-submit': 'Send inquiry →',
    'form-microcopy': 'Reply with as much clarity as possible. The more context I have about your business, the better I\'ll understand whether I can help you and how.',

    'contact-final': "Marketing doesn't start with a campaign.<br><span>It starts with a clear conversation.</span>",

    // Footer
    'footer-brand-desc': 'Business strategist, consultant and Paid Media specialist.',
    'footer-tagline': 'Clear marketing. Real growth.',
    'footer-col1-title': 'Quick links',
    'footer-col2-title': 'Contact',
    'footer-link-home': 'Home',
    'footer-link-quien': 'About me',
    'footer-link-proyectos': 'EPIGROUP',
    'footer-link-contacto': 'Contact',
    'footer-link-email': 'Email',
    'footer-link-whatsapp': 'WhatsApp',
    'footer-link-linkedin': 'LinkedIn',
    'footer-link-instagram': 'Instagram',
    'footer-copyright': '© 2026 Mariano Calandra. All rights reserved.',

    // WhatsApp float
    'wa-text': "Let's chat — 5 min",

    // Selector "¿Cuál es tu situación?" (Bloque 2.2)
    'sit-title': "What's your situation?",
    'sit-subtitle': "Pick the line that fits you best and I'll show you how I'd tackle it.",
    'sit-pill-1': "My campaigns aren't selling.",
    'sit-pill-2': "I don't know what to measure.",
    'sit-pill-3': "I get leads but don't close sales.",
    'sit-pill-4': 'I want to organize my marketing strategy.',
    'sit-pill-5': 'I want to apply AI to my business.',
    'sit-pill-6': "My content isn't getting results."
  }
};

// Título/descripción base = los propios de cada página (capturados antes de
// cualquier traducción). Antes se forzaba el título del home en todas las
// subpáginas que cargan app.js. Solo la home (con selector de idioma) aplica
// las traducciones de meta del diccionario.
const DEFAULT_TITLE = document.title;
const _metaDescEl = document.querySelector('meta[name="description"]');
const DEFAULT_DESCRIPTION = _metaDescEl ? (_metaDescEl.getAttribute('content') || '') : '';
const IS_TRANSLATABLE_PAGE = !!document.querySelector('.language-toggle');

let currentLang = localStorage.getItem('language') || 'es';

function cacheOriginals() {
  if (window._i18nCached) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.dataset.i18nOriginal = el.textContent;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.dataset.i18nOriginal = el.innerHTML;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.dataset.i18nOriginal = el.getAttribute('placeholder') || '';
  });
  window._i18nCached = true;
}

function setLanguage(lang) {
  currentLang = lang;
  cacheOriginals();

  const dict = translations[lang] || {};

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (lang !== 'es' && dict[key] !== undefined) {
      el.textContent = dict[key];
    } else {
      el.textContent = el.dataset.i18nOriginal;
    }
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (lang !== 'es' && dict[key] !== undefined) {
      el.innerHTML = dict[key];
    } else {
      el.innerHTML = el.dataset.i18nOriginal;
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (lang !== 'es' && dict[key] !== undefined) {
      el.setAttribute('placeholder', dict[key]);
    } else {
      el.setAttribute('placeholder', el.dataset.i18nOriginal);
    }
  });

  // <title> y meta description: solo se traducen en la home; el resto de las
  // páginas conservan siempre los suyos.
  document.title = (IS_TRANSLATABLE_PAGE && lang !== 'es' && dict['meta-title']) ? dict['meta-title'] : DEFAULT_TITLE;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', (IS_TRANSLATABLE_PAGE && lang !== 'es' && dict['meta-description']) ? dict['meta-description'] : DEFAULT_DESCRIPTION);
  }

  // Active button
  document.querySelectorAll('.lang-option').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`[data-lang="${lang}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  document.documentElement.lang = lang;
  localStorage.setItem('language', lang);

  // Refrescar componentes dinámicos ya inicializados al cambiar de idioma
  if (window._sitRender) window._sitRender();                 // Tarea 2.2
  if (window._stickyApplyText) window._stickyApplyText();     // Tarea 2.1
}

document.querySelectorAll('.lang-option').forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

setLanguage(currentLang);

// ============================================
// Animaciones al hacer scroll (fade-up)
// ============================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

const fadeTargets = document.querySelectorAll('.card, .project-block, .highlight-box, .chip, .timeline-item, .contact-info-item, .business-types');
fadeTargets.forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// Safety net: si por cualquier razón el observer no marcó algo como visible
// (scroll muy rápido, anchor profundo, browser raro), forzamos visibilidad
// después de 1.5s para evitar la "zona negra".
window.addEventListener('load', () => {
  setTimeout(() => {
    fadeTargets.forEach(el => el.classList.add('visible'));
  }, 1500);
});

// Activador para el divider de frase con underline animado
(function() {
  const quoteEls = document.querySelectorAll('.epi-divider-quote');
  if (!quoteEls.length) return;
  const quoteObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('epi-visible');
        quoteObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  quoteEls.forEach(el => quoteObs.observe(el));
})();

// ============================================
// Header shadow al scrollear (toggle de clase, no inline style)
// ============================================
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

// ============================================
// Nav activo según sección visible (IntersectionObserver)
// ============================================
(function () {
  const navLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'))
    .filter(a => !a.classList.contains('nav-cta'));
  if (!navLinks.length) return;

  const linkBySectionId = new Map();
  const sections = [];
  navLinks.forEach(link => {
    const id = link.getAttribute('href').slice(1);
    const section = document.getElementById(id);
    if (section) {
      linkBySectionId.set(id, link);
      sections.push(section);
    }
  });
  if (!sections.length) return;

  const visible = new Set();

  function updateActive() {
    if (!visible.size) return;
    // De las secciones visibles, elegimos la que tiene su tope más cerca del top del viewport
    let bestId = null;
    let bestTop = Infinity;
    visible.forEach(id => {
      const top = document.getElementById(id).getBoundingClientRect().top;
      if (top < bestTop) {
        bestTop = top;
        bestId = id;
      }
    });
    navLinks.forEach(l => l.classList.remove('active'));
    const active = linkBySectionId.get(bestId);
    if (active) active.classList.add('active');
  }

  const navObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      if (entry.isIntersecting) visible.add(id);
      else visible.delete(id);
    });
    updateActive();
  }, {
    rootMargin: '-80px 0px -55% 0px',
    threshold: 0
  });

  sections.forEach(s => navObs.observe(s));
})();

// ============================================
// HYPEFRAME Parallax (CSS custom prop, requiere 'unsafe-inline' en style-src)
// ============================================
const projectBlocks = document.querySelectorAll('.project-block');

if (projectBlocks.length > 0) {
  window.addEventListener('scroll', () => {
    projectBlocks.forEach(block => {
      const rect = block.getBoundingClientRect();
      const blockCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const normalizedOffset = (blockCenter - viewportCenter) / (window.innerHeight / 2);
      const parallaxOffset = Math.max(-30, Math.min(30, normalizedOffset * 30));
      block.style.setProperty('--parallax-offset', `${parallaxOffset}px`);

      if (rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2) {
        block.classList.add('hypeframe-active');
      } else {
        block.classList.remove('hypeframe-active');
      }
    });
  }, { passive: true });
}

// ============================================
// Contador animado de métricas (Tarea 1.1)
// Count-up al entrar en viewport, una sola vez. Formato AR (miles con punto,
// decimales con coma). Respeta prefers-reduced-motion.
// ============================================
(function () {
  const counters = document.querySelectorAll('.metric-value[data-count]');
  if (!counters.length || !('IntersectionObserver' in window)) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DURATION = 1800;

  function formatAR(value, decimals) {
    const fixed = value.toFixed(decimals);
    let [intPart, decPart] = fixed.split('.');
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return decimals > 0 ? intPart + ',' + decPart : intPart;
  }

  // Actualiza solo el nodo de texto inicial, preservando el <span class="metric-unit">.
  function setText(el, str) {
    const node = el.firstChild;
    if (node && node.nodeType === Node.TEXT_NODE) {
      node.nodeValue = str;
    } else {
      el.insertBefore(document.createTextNode(str), el.firstChild);
    }
  }

  function animate(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    if (isNaN(target)) return;

    if (reduceMotion) {
      setText(el, prefix + formatAR(target, decimals));
      return;
    }

    const start = performance.now();
    function frame(now) {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cúbico
      if (t < 1) {
        setText(el, prefix + formatAR(target * eased, decimals));
        requestAnimationFrame(frame);
      } else {
        setText(el, prefix + formatAR(target, decimals)); // valor exacto final
      }
    }
    requestAnimationFrame(frame);
  }

  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target); // una sola vez por carga
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => obs.observe(c));
})();

// ============================================
// Número de WhatsApp + helper de URL precargada (compartido Bloque 2)
// ============================================
const WA_NUMBER = '5493416397137';
function waLink(msg) {
  return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
}

// ============================================
// Selector "¿Cuál es tu situación?" (Tarea 2.2)
// Pills accesibles → respuesta consultiva + CTA a WhatsApp. i18n ES/EN.
// ============================================
(function () {
  const section = document.getElementById('situacion');
  if (!section) return;
  const pills = Array.from(section.querySelectorAll('.sit-pill'));
  const responseEl = document.getElementById('sit-response');
  if (!pills.length || !responseEl) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const data = {
    '1': {
      body: {
        es: 'Si tus campañas tienen tráfico pero no ventas, el problema casi siempre no es el anuncio. Es la oferta, la landing, el proceso de seguimiento o la calidad del lead. Hay que diagnosticar todo el embudo antes de optimizar la pauta.',
        en: "If your campaigns get traffic but no sales, the problem is almost never the ad. It's the offer, the landing page, the follow-up process or the lead quality. You have to diagnose the whole funnel before optimizing the ads."
      },
      cta: { es: 'Revisemos tu campaña juntos →', en: "Let's review your campaign →" },
      msg: 'Hola Mariano, mis campañas tienen tráfico pero no vendo. Quiero que lo analicemos.'
    },
    '2': {
      body: {
        es: 'Sin métricas claras, cualquier decisión es una apuesta. Lo primero es definir qué medir según tu objetivo (leads, ventas, consultas), configurar bien los eventos y entender qué número importa y cuál es ruido.',
        en: 'Without clear metrics, every decision is a gamble. The first step is to define what to measure based on your goal (leads, sales, inquiries), set up your events properly and understand which number matters and which is just noise.'
      },
      cta: { es: 'Hablemos de medición →', en: "Let's talk measurement →" },
      msg: 'Hola Mariano, no tengo clara mi medición y quiero ordenarla.'
    },
    '3': {
      body: {
        es: 'Si los leads llegan pero no se convierten, el cuello de botella es comercial, no publicitario. Tiempos de respuesta, calidad del lead, propuesta de valor, seguimiento y objeciones. Hay que revisar el proceso de venta, no solo la campaña.',
        en: "If leads come in but don't convert, the bottleneck is commercial, not advertising. Response times, lead quality, value proposition, follow-up and objections. You have to review the sales process, not just the campaign."
      },
      cta: { es: 'Analizamos el proceso →', en: "Let's analyze the process →" },
      msg: 'Hola Mariano, tengo leads pero no los convierto. Quiero entender qué está pasando.'
    },
    '4': {
      body: {
        es: 'Un negocio sin estrategia clara desperdicia presupuesto, tiempo y energía. Antes de publicar o pautar necesitás saber a quién le hablás, qué ofrecés, por qué deberían elegirte y cómo vas a cerrar.',
        en: "A business without a clear strategy wastes budget, time and energy. Before posting or running ads you need to know who you're talking to, what you offer, why they should choose you and how you'll close."
      },
      cta: { es: 'Armemos tu estrategia →', en: "Let's build your strategy →" },
      msg: 'Hola Mariano, quiero ordenar mi estrategia de marketing desde cero.'
    },
    '5': {
      body: {
        es: 'La IA no reemplaza la estrategia, la acelera. Hay formas concretas de aplicarla en generación de contenido, análisis de datos, automatización de procesos, campañas y atención al cliente. Pero primero hay que saber dónde tiene sentido usarla.',
        en: "AI doesn't replace strategy, it accelerates it. There are concrete ways to apply it in content generation, data analysis, process automation, campaigns and customer service. But first you need to know where it actually makes sense to use it."
      },
      cta: { es: 'Veamos cómo aplicar IA →', en: "Let's see how to apply AI →" },
      msg: 'Hola Mariano, quiero ver cómo aplicar IA a mi negocio o marketing.'
    },
    '6': {
      body: {
        es: 'El contenido que no convierte suele tener uno de estos problemas: le habla a todos, no tiene un objetivo claro, no está conectado a ningún embudo o no tiene distribución. El problema raramente es el contenido en sí.',
        en: "Content that doesn't convert usually has one of these problems: it speaks to everyone, has no clear goal, isn't connected to any funnel or has no distribution. The problem is rarely the content itself."
      },
      cta: { es: 'Revisemos tu contenido →', en: "Let's review your content →" },
      msg: 'Hola Mariano, genero contenido pero no me da resultados. Quiero revisarlo.'
    }
  };

  let openId = null;

  function render(id) {
    const d = data[id];
    if (!d) return;
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'es';
    responseEl.innerHTML = '';
    const p = document.createElement('p');
    p.textContent = d.body[lang] || d.body.es;
    const a = document.createElement('a');
    a.className = 'btn btn-primary sit-cta';
    a.href = waLink(d.msg);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = d.cta[lang] || d.cta.es;
    responseEl.appendChild(p);
    responseEl.appendChild(a);
    responseEl.hidden = false;
    if (!reduce) {
      responseEl.classList.remove('is-animating');
      void responseEl.offsetWidth; // reinicia la animación
      responseEl.classList.add('is-animating');
    }
  }

  function openPill(id, pill) {
    pills.forEach(p => {
      const active = p === pill;
      p.classList.toggle('is-active', active);
      p.setAttribute('aria-expanded', active ? 'true' : 'false');
    });
    openId = id;
    render(id);
  }

  function closeAll() {
    pills.forEach(p => {
      p.classList.remove('is-active');
      p.setAttribute('aria-expanded', 'false');
    });
    openId = null;
    responseEl.hidden = true;
    responseEl.innerHTML = '';
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const id = pill.dataset.sit;
      if (openId === id) closeAll();
      else openPill(id, pill);
    });
  });

  // Re-render de la respuesta abierta al cambiar idioma
  window._sitRender = function () { if (openId) render(openId); };
})();

// ============================================
// CTA sticky contextual (Tarea 2.1)
// Aparece tras 300px de scroll, cambia texto/link por sección, se oculta en
// contacto. Botón de cierre (sessionStorage). Oculta el float mientras está.
// ============================================
(function () {
  const sticky = document.getElementById('stickyCta');
  if (!sticky || !('IntersectionObserver' in window)) return;
  const btn = document.getElementById('stickyCtaBtn');
  const textEl = sticky.querySelector('.sticky-cta-text');
  const closeBtn = document.getElementById('stickyCtaClose');

  // Config por sección. ext:true → abre WhatsApp en pestaña nueva.
  const cfg = {
    home:       { es: 'Hablemos de tu negocio',        en: "Let's talk about your business", href: waLink('Hola Mariano, vi tu web y quiero hablar sobre mi proyecto de marketing.'), ext: true },
    areas:      { es: 'Quiero mejorar mis campañas',    en: 'I want to improve my campaigns',  href: waLink('Hola Mariano, me interesa mejorar mis campañas de Paid Media.'), ext: true },
    proceso:    { es: 'Quiero trabajar con Mariano',    en: 'I want to work with Mariano',     href: waLink('Hola Mariano, vengo de tu web y quiero consultarte algo.'), ext: true },
    situacion:  { es: 'Quiero trabajar con Mariano',    en: 'I want to work with Mariano',     href: waLink('Hola Mariano, vengo de tu web y quiero consultarte algo.'), ext: true },
    resultados: { es: 'Quiero resultados así',          en: 'I want results like these',       href: waLink('Hola Mariano, vi tus resultados y quiero ver si podés ayudarme con algo similar.'), ext: true },
    recursos:   { es: 'Descargar auditoría gratuita',   en: 'Download free audit',             href: '/recursos/auditoria-marketing-express.html', ext: false },
    default:    { es: 'Hablemos de tu negocio',         en: "Let's talk about your business", href: waLink('Hola Mariano, vengo de tu web y quiero consultarte algo.'), ext: true }
  };

  let dismissed = sessionStorage.getItem('stickyCtaDismissed') === '1';
  let currentKey = 'default';
  let currentId = 'home';

  const sections = Array.from(document.querySelectorAll('section[id]'));
  if (!sections.length) return;

  // Sección actual = la última cuyo tope ya pasó debajo del header (geometría
  // directa, sin depender de que el observer haya poblado un set).
  function pickCurrent() {
    let curId = sections[0].id;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= 140) curId = sections[i].id;
      else break;
    }
    return curId;
  }

  function applyText() {
    const c = cfg[currentKey] || cfg.default;
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'es';
    textEl.textContent = c[lang] || c.es;
    btn.href = c.href;
    if (c.ext) {
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
    } else {
      btn.removeAttribute('target');
      btn.removeAttribute('rel');
    }
  }
  window._stickyApplyText = function () { if (sticky.classList.contains('is-visible')) applyText(); };

  function update() {
    const id = pickCurrent();
    currentId = id;
    const hide = dismissed || window.scrollY <= 300 || id === 'contacto';
    if (hide) {
      sticky.classList.remove('is-visible');
      sticky.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('sticky-cta-active');
      return;
    }
    currentKey = cfg[id] ? id : 'default';
    applyText();
    sticky.classList.add('is-visible');
    sticky.setAttribute('aria-hidden', 'false');
    document.body.classList.add('sticky-cta-active');
  }

  // El observer solo dispara recálculos al cruzar secciones; la decisión la
  // toma pickCurrent() por geometría.
  const obs = new IntersectionObserver(() => update(), { rootMargin: '-100px 0px -45% 0px', threshold: 0 });
  sections.forEach(s => obs.observe(s));

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });

  closeBtn.addEventListener('click', () => {
    dismissed = true;
    sessionStorage.setItem('stickyCtaDismissed', '1');
    sticky.classList.remove('is-visible');
    sticky.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('sticky-cta-active');
  });

  update();
})();
