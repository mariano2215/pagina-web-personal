/* ============================================================
   EPIBRANDS — Marketing & Growth Studio | JavaScript
   Externo (no inline) para cumplir la CSP del sitio.

   Bloques:
   1. Header sticky, menú mobile y mask reveal de títulos.
   2. Scroll progress, reveal global, cupos, counters, mouse-glow
      y formulario de diagnóstico en pasos.
   3. Tracking (dataLayer + Meta Pixel) de los CTA de la landing.
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
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      toggle.textContent = open ? 'Cerrar' : 'Menú';
    });
    links.addEventListener('click', function(e){
      if(e.target.tagName === 'A' || e.target.closest('a')){
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
        toggle.setAttribute('aria-label', 'Abrir menú');
        toggle.textContent = 'Menú';
      }
    });
    // Escape cierra el menú full screen (accesibilidad por teclado).
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && links.classList.contains('open')){
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
        toggle.setAttribute('aria-label', 'Abrir menú');
        toggle.textContent = 'Menú';
        toggle.focus();
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
    // El resaltado del H1 solo se anima si hay JS y no hay reduced-motion.
    // Sin esta clase el subrayado queda pintado desde el HTML.
    var heroTitle = document.querySelector('.hero h1');
    if (heroTitle) heroTitle.classList.add('hl-anim');
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
  }, { threshold:0, rootMargin:'0px 0px -10% 0px' });

  // Lo que ya está en pantalla al cargar (todo el hero) se revela solo, sin
  // observer: con el margen negativo un elemento pegado al borde inferior del
  // hero nunca llegaba a intersecar y quedaba invisible hasta hacer scroll.
  var inView = [], rest = [];
  animated.forEach(function(el){
    var r = el.getBoundingClientRect();
    (r.top < window.innerHeight && r.bottom > 0 ? inView : rest).push(el);
  });
  // Doble rAF: da tiempo al primer paint para que la transición se vea.
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      inView.forEach(function(el){ el.classList.add('in'); });
    });
  });
  rest.forEach(function(el){ io.observe(el); });
})();

/* ------------------------------------------------------------
   BLOQUE 2 — progreso de scroll, reveal global, cupos,
   counters, mouse-glow y formulario de diagnóstico en pasos
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
      }, { threshold: 0, rootMargin: "0px 0px -10% 0px" });
      revealElements.forEach(function (el) {
        var r = el.getBoundingClientRect();
        // Mismo criterio que el bloque 1: lo visible al cargar no se observa.
        if (r.top < window.innerHeight && r.bottom > 0) { el.classList.add("is-visible"); return; }
        revealObserver.observe(el);
      });
    }

    /* --- Indicador de cupos -----------------------------------------
       Los valores salen de data-cupos-total / data-cupos-tomados en el
       HTML. Para marcar un cupo como ocupado, subí data-cupos-tomados
       en los cuatro bloques (hero, honorarios y diagnóstico).          */
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

    /* --- Counters animados -------------------------------------------
       IMPORTANTE: el valor real ya está escrito en el HTML. Crawlers,
       lectores de IA y usuarios sin JS ven siempre la métrica correcta,
       nunca un 0. La animación es progressive enhancement y solo se
       arma para los counters que todavía están fuera de pantalla, así
       nadie ve el número "resetearse" a 0 delante suyo.                */
    var counters = Array.prototype.slice.call(document.querySelectorAll("[data-counter]"));

    function formatCounter(el, n) {
      var decimals = parseInt(el.getAttribute("data-counter-decimals"), 10);
      if (!(decimals >= 0)) decimals = 0;
      var value = decimals > 0 ? Number(n).toFixed(decimals) : String(Math.round(n));
      // toLocaleString con los decimales ya fijados evita redondeos raros.
      value = Number(value).toLocaleString("es-AR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
      return (el.getAttribute("data-counter-prefix") || "") + value +
             (el.getAttribute("data-counter-suffix") || "");
    }

    function animateCounter(counter) {
      var target = Number(counter.getAttribute("data-counter"));
      if (!isFinite(target)) return;
      var duration = 1400;
      var startTime = performance.now();
      function tick(now) {
        var progress = Math.min((now - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = formatCounter(counter, target * eased);
        if (progress < 1) requestAnimationFrame(tick);
        else counter.textContent = formatCounter(counter, target);
      }
      requestAnimationFrame(tick);
    }

    if (!prefersReducedMotion && counters.length) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        });
      }, { threshold: 0.5 });

      counters.forEach(function (c) {
        var rect = c.getBoundingClientRect();
        var belowFold = rect.top > window.innerHeight;
        if (!belowFold) return;              // ya visible: se queda con el valor del HTML
        c.textContent = formatCounter(c, 0); // se resetea fuera de pantalla, no se ve
        counterObserver.observe(c);
      });
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

    /* --- Formulario de diagnóstico en pasos --------------------------
       Sin JS el formulario se ve completo y funciona igual: los pasos
       solo se activan cuando se agrega la clase .js-steps.
       El form tiene novalidate, así que la validación y los mensajes
       de error los maneja este bloque (con role="alert" por campo).   */
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
    var alertBox  = document.getElementById("epiFormAlert");
    var card      = form.closest(".epi-form-card") || form;

    form.classList.add("js-steps");
    var current = 0;

    function fieldsOf(panel) {
      return Array.prototype.slice.call(panel.querySelectorAll("input, select, textarea"))
        .filter(function (f) { return f.type !== "hidden"; });
    }

    // Mensaje entendible: primero el data-error del campo, después el
    // del browser, y recién ahí un texto genérico.
    function messageFor(field) {
      if (field.validity.valueMissing || field.validity.typeMismatch) {
        return field.getAttribute("data-error") || field.validationMessage || "Revisá este dato.";
      }
      return field.validationMessage || field.getAttribute("data-error") || "Revisá este dato.";
    }

    function wrapperOf(field) { return field.closest(".epi-field"); }

    function clearError(field) {
      var wrap = wrapperOf(field);
      if (!wrap) return;
      wrap.classList.remove("has-error");
      field.removeAttribute("aria-invalid");
      var box = wrap.querySelector(".epi-field-error");
      if (box) box.textContent = "";
    }

    function showError(field) {
      var wrap = wrapperOf(field);
      if (!wrap) return;
      wrap.classList.add("has-error");
      field.setAttribute("aria-invalid", "true");
      var box = wrap.querySelector(".epi-field-error");
      if (box) box.textContent = messageFor(field);
    }

    // Al corregir, el error se limpia solo.
    form.addEventListener("input", function (e) {
      if (e.target.checkValidity && e.target.checkValidity()) clearError(e.target);
    });
    form.addEventListener("change", function (e) {
      if (e.target.checkValidity && e.target.checkValidity()) clearError(e.target);
    });
    form.addEventListener("blur", function (e) {
      var f = e.target;
      if (!f.checkValidity) return;
      if (f.value !== "" && !f.checkValidity()) showError(f);
    }, true);

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
        var first = fieldsOf(panels[current])[0];
        if (first) { try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); } }
      }
    }

    // Valida un paso completo: marca todos los campos con problema y
    // devuelve el primero, para poder enfocarlo.
    function firstInvalidIn(panel) {
      var invalid = null;
      fieldsOf(panel).forEach(function (f) {
        if (f.checkValidity()) { clearError(f); return; }
        showError(f);
        if (!invalid) invalid = f;
      });
      return invalid;
    }

    function setAlert(message) {
      if (!alertBox) return;
      alertBox.textContent = message || "";
      alertBox.classList.toggle("is-visible", !!message);
    }

    if (btnNext) {
      btnNext.addEventListener("click", function () {
        var bad = firstInvalidIn(panels[current]);
        if (bad) { setAlert("Falta completar un dato para seguir."); bad.focus(); return; }
        setAlert("");
        if (current < panels.length - 1) { current++; render(true); }
      });
    }
    if (btnBack) {
      btnBack.addEventListener("click", function () {
        setAlert("");
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

    // El form tiene novalidate: el submit lo validamos acá, paso por
    // paso, para poder volver al paso que falta completar.
    form.addEventListener("submit", function (e) {
      var bad = null, badIndex = -1;
      for (var i = 0; i < panels.length; i++) {
        var invalid = firstInvalidIn(panels[i]);
        if (invalid && !bad) { bad = invalid; badIndex = i; }
      }
      if (bad) {
        e.preventDefault();
        setAlert("Revisá los campos marcados antes de enviar.");
        if (badIndex !== current) { current = badIndex; render(true); }
        bad.focus();
        return;
      }
      setAlert("");
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.setAttribute("aria-busy", "true");
        btnSubmit.textContent = "Enviando…";
      }
      // El estado de éxito vive en /epibrands/gracias.html, adonde
      // redirige Netlify después de guardar la submission.
    });

    render(false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/* ------------------------------------------------------------
   BLOQUE 3 — Tracking
   dataLayer (GTM-WF2DG4B7, el mismo contenedor del resto del
   sitio) + Meta Pixel vía window.mcTrack. Sin PII: solo la
   ubicación del CTA dentro de la página.
   ------------------------------------------------------------ */
(function(){
  function push(event, params){
    window.dataLayer = window.dataLayer || [];
    var payload = { event: event };
    if (params) Object.keys(params).forEach(function(k){ payload[k] = params[k]; });
    window.dataLayer.push(payload);
  }

  function ready(fn){
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function(){
    /* --- Clicks en CTA (delegación: un solo listener) --------------
       data-cta define el evento y data-cta-location la ubicación.   */
    document.addEventListener("click", function(e){
      var el = e.target.closest && e.target.closest("[data-cta]");
      if (!el) return;
      var kind = el.getAttribute("data-cta");
      var location = el.getAttribute("data-cta-location") || "sin-definir";

      if (kind === "diagnostico") {
        push("epibrands_diagnostic_click", { cta_location: location });
      } else if (kind === "whatsapp") {
        push("epibrands_whatsapp_click", { cta_location: location });
        // Meta: el click a WhatsApp es una oportunidad comercial.
        // meta-pixel.js ya dispara Contact automáticamente; acá se
        // suma el Lead, igual que en el resto del sitio.
        if (window.mcTrack) {
          window.mcTrack("Lead", { content_name: "EPIBRANDS diagnóstico", content_category: "whatsapp" });
        }
      } else if (kind === "portfolio") {
        push("epibrands_portfolio_click", { cta_location: location });
      }
    });

    /* --- Submit del formulario de diagnóstico ---------------------
       Solo se dispara si el submit no fue cancelado por la
       validación (el listener del bloque 2 llama a preventDefault). */
    var form = document.getElementById("epiApplyForm");
    if (form) {
      form.addEventListener("submit", function(e){
        if (e.defaultPrevented) return;
        push("epibrands_diagnostic_submit", { form_name: "epibrands-studio" });
      });
    }

    /* --- Vistas de sección (una sola vez por sesión de página) ----- */
    if (!("IntersectionObserver" in window)) return;
    var views = [
      { id: "metodo", event: "epibrands_method_view" },
      { id: "casos",  event: "epibrands_cases_view" }
    ];
    var seen = {};
    var viewObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (!entry.isIntersecting) return;
        var conf = entry.target.__epiView;
        if (!conf || seen[conf.event]) return;
        seen[conf.event] = true;
        push(conf.event);
        viewObserver.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    views.forEach(function(conf){
      var el = document.getElementById(conf.id);
      if (!el) return;
      el.__epiView = conf;
      viewObserver.observe(el);
    });
  });
})();
