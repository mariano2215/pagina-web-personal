/* ============================================================
   EPIBRANDS Studio — JavaScript
   Externo (no inline) para cumplir la CSP del sitio:
   script-src 'self' ... (los <script> inline están bloqueados).
   ============================================================ */

/* ------------------------------------------------------------
   BLOQUE 1 — header sticky, menú mobile, mask reveal, parallax
   ------------------------------------------------------------ */
(function(){
  // año footer
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // header al hacer scroll
  var header = document.getElementById('header');
  var onScroll = function(){ header.classList.toggle('is-scrolled', window.scrollY > 24); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });

  // menú mobile
  var toggle = document.getElementById('navToggle');
  var links  = document.getElementById('navLinks');
  toggle.addEventListener('click', function(){
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.textContent = open ? 'Cerrar' : 'Menú';
  });
  links.addEventListener('click', function(e){
    if(e.target.tagName === 'A'){
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
      toggle.textContent = 'Menú';
    }
  });

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Mask reveal por palabras -------------------------------------
  // Envuelve cada palabra de los títulos en una máscara recortada para
  // que aparezca/desaparezca deslizándose. Preserva <em>, <span>, etc.
  function splitWords(el, counter){
    var nodes = Array.prototype.slice.call(el.childNodes);
    nodes.forEach(function(node){
      if(node.nodeType === 3){ // nodo de texto
        var parts = node.textContent.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function(part){
          if(part === '') return;
          if(/^\s+$/.test(part)){ frag.appendChild(document.createTextNode(part)); return; }
          var word = document.createElement('span'); word.className = 'word';
          var inner = document.createElement('span');
          inner.textContent = part;
          // escalonado suave, con tope para textos largos
          inner.style.transitionDelay = Math.min(counter.i, 18) * 0.045 + 's';
          counter.i++;
          word.appendChild(inner);
          frag.appendChild(word);
        });
        el.replaceChild(frag, node);
      } else if(node.nodeType === 1){
        splitWords(node, counter); // recursa preservando el elemento
      }
    });
  }

  var maskSelector = '.hero h1, .manifesto blockquote, .section-head h2, ' +
    '.method-head h2, .principle h3, .step h3, .service h3, .work .meta h3, .cta h2';
  var masked = [];
  if(!reduce){
    document.querySelectorAll(maskSelector).forEach(function(el){
      splitWords(el, { i:0 });
      el.classList.add('mask');
      masked.push(el);
    });
    // líneas divisorias que se dibujan al entrar (clase .rule en CSS)
    document.querySelectorAll('.hero-bottom, .principles, .steps, .services .service:first-child').forEach(function(el){
      el.classList.add('drawline');
    });
  }

  // ---- Observer bidireccional (entrada Y salida) --------------------
  var animated = document.querySelectorAll('.reveal, .mask, .drawline');
  if(reduce){
    animated.forEach(function(el){ el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      en.target.classList.toggle('in', en.isIntersecting);
    });
  }, { threshold:0.15, rootMargin:'0px 0px -8% 0px' });
  animated.forEach(function(el){ io.observe(el); });

  // ---- Parallax de los visuales del portfolio ----------------------
  // Cada inicial se desplaza en vertical a distinta velocidad que la
  // tarjeta al scrollear, generando sensación de profundidad y movimiento.
  var glyphs = Array.prototype.map.call(
    document.querySelectorAll('.work'),
    function(work, i){
      return { glyph: work.querySelector('.glyph'), el: work,
               // intensidad alterna para que no se muevan todas igual
               amp: (i % 2 === 0) ? 38 : 24 };
    }
  ).filter(function(o){ return o.glyph; });

  var ticking = false;
  function updateParallax(){
    var vh = window.innerHeight;
    glyphs.forEach(function(o){
      var r = o.el.getBoundingClientRect();
      if(r.bottom < -100 || r.top > vh + 100) return; // fuera de vista: saltar
      // progreso -1 (abajo) .. 1 (arriba) según centro respecto al viewport
      var progress = ((r.top + r.height / 2) - vh / 2) / vh;
      o.glyph.style.setProperty('--py', (progress * o.amp).toFixed(1) + 'px');
    });
    ticking = false;
  }
  function onScrollParallax(){
    if(!ticking){ ticking = true; requestAnimationFrame(updateParallax); }
  }
  window.addEventListener('scroll', onScrollParallax, { passive:true });
  window.addEventListener('resize', onScrollParallax, { passive:true });
  updateParallax();
})();

/* ------------------------------------------------------------
   BLOQUE 2 — módulos premium: progreso, reveal global,
   diagnóstico, counters, toggle antes/después, mouse-glow
   ------------------------------------------------------------ */
(function(){
  function init(){
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* --- Scroll progress --- */
    var progressBar = document.querySelector(".epi-scroll-progress");
    function updateScrollProgress() {
      if (!progressBar) return;
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + "%";
    }
    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);

    /* --- Reveal global (data-reveal) --- */
    var revealElements = document.querySelectorAll("[data-reveal]");
    if (prefersReducedMotion) {
      revealElements.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
      revealElements.forEach(function (el) { revealObserver.observe(el); });
    }

    /* --- Diagnóstico interactivo --- */
    var diagnosticButton = document.getElementById("epiDiagnosticButton");
    var diagnosticInput = document.getElementById("epiDiagnosticInput");
    var diagnosticStatus = document.getElementById("epiDiagnosticStatus");
    if (diagnosticButton && diagnosticStatus) {
      var diagnosticSteps = [
        "Analizando presencia digital",
        "Detectando oportunidades",
        "Revisando embudo comercial",
        "Generando plan de acción"
      ];
      diagnosticButton.addEventListener("click", function () {
        if (diagnosticButton.dataset.loading === "true") return;
        diagnosticButton.dataset.loading = "true";
        diagnosticButton.disabled = true;
        diagnosticStatus.classList.add("is-loading");
        var currentStep = 0;
        diagnosticStatus.textContent = diagnosticSteps[currentStep];
        var interval = window.setInterval(function () {
          currentStep += 1;
          if (currentStep < diagnosticSteps.length) {
            diagnosticStatus.textContent = diagnosticSteps[currentStep];
          } else {
            window.clearInterval(interval);
            diagnosticStatus.classList.remove("is-loading");
            var userText = diagnosticInput && diagnosticInput.value.trim()
              ? " sobre: “" + diagnosticInput.value.trim() + "”"
              : "";
            diagnosticStatus.textContent =
              "Listo. Podemos ayudarte a ordenar estrategia, contenido, campañas y ventas" + userText + ".";
            diagnosticButton.disabled = false;
            diagnosticButton.dataset.loading = "false";
          }
        }, 850);
      });
    }

    /* --- Counters animados --- */
    var counters = document.querySelectorAll("[data-counter]");
    function formatCounter(n) { return Math.round(n).toLocaleString("es-AR"); }
    function animateCounter(counter) {
      var target = Number(counter.getAttribute("data-counter"));
      var duration = 1400;
      var startTime = performance.now();
      function tick(now) {
        var elapsed = now - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = formatCounter(target * eased);
        if (progress < 1) { requestAnimationFrame(tick); }
        else { counter.textContent = formatCounter(target); }
      }
      requestAnimationFrame(tick);
    }
    if (prefersReducedMotion) {
      counters.forEach(function (c) { c.textContent = formatCounter(Number(c.getAttribute("data-counter"))); });
    } else {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (c) { counterObserver.observe(c); });
    }

    /* --- Mouse-glow en cards --- */
    if (!prefersReducedMotion) {
      document.querySelectorAll(".epi-motion-card").forEach(function (card) {
        card.addEventListener("mousemove", function (event) {
          var rect = card.getBoundingClientRect();
          var x = ((event.clientX - rect.left) / rect.width) * 100;
          var y = ((event.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty("--mouse-x", x + "%");
          card.style.setProperty("--mouse-y", y + "%");
        });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
