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
    'nav-proyectos': 'My projects',
    'nav-contacto': 'Contact',
    'nav-hablemos': "Let's talk →",

    // Hero
    'hero-eyebrow': 'Clear marketing · Real growth',
    'hero-headline': 'Transform your marketing and put your sales on <span>autopilot.</span>',
    'hero-subtitle': 'I empower <strong>SMBs, ecommerce and companies across Argentina and LATAM</strong> to organize their marketing, stop improvising and turn ads into real sales. Strategy, paid media and consulting — focused on what moves the needle.',
    'hero-btn-primary': "Let's talk about your business →",
    'hero-btn-secondary': 'Request a free audit →',
    'hero-microcopy': 'Rosario, Argentina · Working with clients across Argentina and LATAM',
    'hero-img-alt': 'Mariano Calandra — Business strategist and Paid Media specialist',

    // Posicionamiento
    'pos-title': 'An integrated view for businesses that want to grow',
    'pos-p1': 'I don\'t treat marketing as separate pieces. I think of it as a system where every part matters: strategy, brand, offer, ads, content, measurement, sales and customer experience.',
    'pos-p2': 'My approach combines <strong>sales, paid media, consulting, artificial intelligence and business vision</strong> to help brands grow with more clarity, better decisions and concrete actions.',
    'pos-highlight': "Marketing doesn't start with a campaign. It starts with a clear strategy.",

    // Áreas
    'areas-title': 'How you benefit from working with me',
    'areas-subtitle': 'I work with companies, SMBs, entrepreneurs, ecommerce, personal brands, agencies and digital projects that need to <strong>organize their strategy, generate demand and sell better.</strong>',
    'areas-card1-title': 'Digital advertising (Paid Media)',
    'areas-card1-desc': 'Planning, implementation and optimization of campaigns on Meta Ads, Google Ads and TikTok Ads, focused on measurable results and data-driven decisions.',
    'areas-card2-title': 'Consulting & Commercial strategy',
    'areas-card2-desc': 'Diagnosis, positioning, value proposition, growth planning and sales-process improvement — connecting marketing, communication and sales with clarity before executing.',
    'areas-card3-title': 'Visual & graphic communication (with purpose)',
    'areas-card3-desc': 'Design, identity and graphic materials with strategic focus. Visual communication that reinforces the brand, conveys the value proposition and supports the sale.',
    'areas-card4-title': 'AI applied to marketing',
    'areas-card4-desc': 'Automation, analysis, content, workflows and AI-assisted decision making to speed up processes without losing strategic judgment.',

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
    'testi-subtitle': 'A few numbers from campaigns I manage at LA IDEA Creative Agency. Quotes are drafted from the results and pending validation with each client.',
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
    'proj-title': 'My projects',
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

    // Contacto
    'contact-title': "Let's talk about your business",
    'contact-intro1': 'If you made it this far, you\'re probably looking to organize your marketing, improve your campaigns, sell more or get an outside perspective that helps you make better decisions.',
    'contact-intro2': 'I work with companies, entrepreneurs, SMBs, ecommerce, personal brands, agencies and digital projects that need to move from improvisation to a clearer, measurable and actionable strategy.',
    'contact-intro3': 'If you feel I can help you, write to me.',
    'contact-intro4': 'Tell me what stage your business is in, what you\'re looking to improve and the main challenge you want to solve.',
    'contact-intro5': 'It can be a question about campaigns, commercial strategy, integrated marketing, AI applied to processes, content, sales or general business growth.',

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
    'footer-link-proyectos': 'My projects',
    'footer-link-contacto': 'Contact',
    'footer-link-email': 'Email',
    'footer-link-whatsapp': 'WhatsApp',
    'footer-link-linkedin': 'LinkedIn',
    'footer-link-instagram': 'Instagram',
    'footer-copyright': '© 2026 Mariano Calandra. All rights reserved.',

    // WhatsApp float
    'wa-text': "Let's chat — 5 min"
  }
};

const DEFAULT_TITLE = 'Mariano Calandra — Marketing claro. Crecimiento real.';
const DEFAULT_DESCRIPTION = 'Mariano Calandra — Estratega comercial, consultor y especialista en Paid Media. Marketing claro. Crecimiento real.';

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

  // <title> y meta description
  document.title = (lang !== 'es' && dict['meta-title']) ? dict['meta-title'] : DEFAULT_TITLE;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', (lang !== 'es' && dict['meta-description']) ? dict['meta-description'] : DEFAULT_DESCRIPTION);
  }

  // Active button
  document.querySelectorAll('.lang-option').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`[data-lang="${lang}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  document.documentElement.lang = lang;
  localStorage.setItem('language', lang);
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
