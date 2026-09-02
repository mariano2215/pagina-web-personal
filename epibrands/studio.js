/* ============================================================
   EPIBRANDS — Mentoría | JavaScript
   Externo (no inline) para cumplir la CSP del sitio:
   script-src 'self' ... (los <script> inline están bloqueados).
   ============================================================ */

/* ------------------------------------------------------------
   BLOQUE 1 — header sticky, menú mobile, mask reveal
   ------------------------------------------------------------ */
(function(){
  // año footer
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // header al hacer scroll
  var header = document.getElementById('header');
  if (header) {
    var onScroll = function(){ header.classList.toggle('is-scrolled', window.scrollY > 24); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });
  }

  // menú mobile
  var toggle = document.getElementById('navToggle');
  var links  = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function(){
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.textContent = open ? 'Cerrar' : 'Menú';
    });
    links.addEventListener('click', function(e){
      if(e.target.tagName === 'A' || e.target.closest('a')){
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
        toggle.textContent = 'Menú';
      }
    });
  }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Mask reveal por palabras -------------------------------------
  // Envuelve cada palabra de los títulos en una máscara recortada para
  // que aparezca deslizándose. Preserva <em>, <span>, <b>, etc.
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

  var maskSelector = '.hero h1, .manifesto blockquote, .section-head h2, .principle h3';
  if(!reduce){
    document.querySelectorAll(maskSelector).forEach(function(el){
      splitWords(el, { i:0 });
      el.classList.add('mask');
    });
    // líneas divisorias que se "dibujan" al entrar
    document.querySelectorAll('.hero-bottom, .principles').forEach(function(el){
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
})();

/* ------------------------------------------------------------
   BLOQUE 2 — progreso de scroll, reveal global, cupos,
   counters, mouse-glow y formulario de aplicación en pasos
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

    /* --- Indicador de cupos -----------------------------------------
       Los valores salen de data-cupos-total / data-cupos-tomados en el
       HTML. Para marcar un cupo como ocupado, subí data-cupos-tomados
       en los tres bloques (hero, precio y aplicación).                */
    document.querySelectorAll("[data-cupos]").forEach(function (box) {
      var total = parseInt(box.getAttribute("data-cupos-total"), 10);
      var taken = parseInt(box.getAttribute("data-cupos-tomados"), 10);
      if (!(total > 0)) total = 4;
      if (!(taken >= 0)) taken = 0;
      if (taken > total) taken = total;
      var left = total - taken;

      var dots = box.querySelector(".epi-cupos-dots");
      if (dots) {
        dots.textContent = "";
        for (var i = 0; i < total; i++) {
          var dot = document.createElement("span");
          dot.className = "epi-cupos-dot" + (i < taken ? " is-taken" : "");
          dots.appendChild(dot);
        }
      }

      var text = box.querySelector(".epi-cupos-text");
      if (!text) return;
      var strong = document.createElement("b");
      var rest = "";
      if (left === 0) {
        strong.textContent = "Sin cupos disponibles";
        rest = " · lista de espera abierta";
      } else if (left === 1) {
        strong.textContent = "1 cupo";
        rest = " disponible";
      } else if (left === total) {
        strong.textContent = total + " cupos";
        rest = " disponibles";
      } else {
        strong.textContent = left + " de " + total + " cupos";
        rest = " disponibles";
      }
      text.textContent = "";
      text.appendChild(strong);
      text.appendChild(document.createTextNode(rest));
    });

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

    /* --- Formulario de aplicación en 3 pasos -------------------------
       Sin JS el formulario se ve completo y funciona igual: los pasos
       solo se activan cuando esta clase se agrega.                     */
    var form = document.getElementById("epiApplyForm");
    if (!form) return;
    var panels = Array.prototype.slice.call(form.querySelectorAll(".epi-step-panel"));
    if (panels.length < 2) return;

    var btnNext   = document.getElementById("epiFormNext");
    var btnBack   = document.getElementById("epiFormBack");
    var btnSubmit = document.getElementById("epiFormSubmit");
    var title     = document.getElementById("epiFormTitle");
    var count     = document.getElementById("epiFormCount");
    var bar       = document.getElementById("epiFormBar");
    var card      = form.closest(".epi-form-card") || form;

    form.classList.add("js-steps");
    var current = 0;

    function fieldsOf(panel) {
      return Array.prototype.slice.call(panel.querySelectorAll("input, select, textarea"));
    }

    function render(scroll) {
      panels.forEach(function (p, i) { p.classList.toggle("is-active", i === current); });
      if (title) title.textContent = panels[current].getAttribute("data-title") || "";
      if (count) count.textContent = "Paso " + (current + 1) + " de " + panels.length;
      if (bar)   bar.style.width = ((current + 1) / panels.length) * 100 + "%";

      var last = current === panels.length - 1;
      if (btnNext)   btnNext.hidden   = last;
      if (btnSubmit) btnSubmit.hidden = !last;
      if (btnBack)   btnBack.hidden   = current === 0;

      if (scroll) {
        var top = card.getBoundingClientRect().top;
        if (top < 70) {
          window.scrollTo({
            top: window.scrollY + top - 90,
            behavior: prefersReducedMotion ? "auto" : "smooth"
          });
        }
        var first = fieldsOf(panels[current]).filter(function (f) { return f.type !== "hidden"; })[0];
        if (first) { try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); } }
      }
    }

    // Devuelve true si el paso está completo; si no, marca el campo.
    function validPanel(panel) {
      var invalid = fieldsOf(panel).filter(function (f) { return !f.checkValidity(); })[0];
      if (!invalid) return true;
      invalid.reportValidity();
      return false;
    }

    if (btnNext) {
      btnNext.addEventListener("click", function () {
        if (!validPanel(panels[current])) return;
        if (current < panels.length - 1) { current++; render(true); }
      });
    }
    if (btnBack) {
      btnBack.addEventListener("click", function () {
        if (current > 0) { current--; render(true); }
      });
    }

    // Enter avanza de paso en vez de enviar el formulario incompleto.
    form.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      if (e.target.tagName === "TEXTAREA") return;
      if (current < panels.length - 1) {
        e.preventDefault();
        if (btnNext) btnNext.click();
      }
    });

    // Red de seguridad: la validación nativa no puede enfocar un campo que
    // quedó en un paso oculto y el envío se bloquearía en silencio. Por eso
    // revisamos todos los pasos en el click (antes de que valide el browser)
    // y volvemos al paso que falta completar.
    function firstInvalidStep() {
      for (var i = 0; i < panels.length; i++) {
        var invalid = fieldsOf(panels[i]).filter(function (el) { return !el.checkValidity(); })[0];
        if (invalid) return { index: i, field: invalid };
      }
      return null;
    }

    if (btnSubmit) {
      btnSubmit.addEventListener("click", function (e) {
        var bad = firstInvalidStep();
        if (!bad) return; // todo completo: sigue el envío normal
        e.preventDefault();
        if (bad.index !== current) { current = bad.index; render(true); }
        bad.field.reportValidity();
      });
    }

    form.addEventListener("submit", function () {
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.textContent = "Enviando…";
      }
    });

    render(false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
