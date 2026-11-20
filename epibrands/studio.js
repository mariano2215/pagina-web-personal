/* ============================================================
   EPIBRANDS — Growth Partner | JavaScript
   Externo (no inline) para cumplir la CSP del sitio.
   Todo es mejora progresiva: sin JS la página se lee completa
   y el formulario se envía igual a Netlify Forms (POST nativo).
   ============================================================ */

(function () {
  var root = document.documentElement;
  root.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var PAGE_PATH = window.location.pathname;
  var FORM_NAME = "epibrands-studio";

  /* ------------------------------------------------------------
     ANALÍTICA — adaptador desacoplado
     Empuja eventos a window.dataLayer (convención GA4/GTM del
     sitio). Esta página hoy NO carga GTM: los eventos quedan en el
     dataLayer hasta que se conecte (ver docs/epibrands-measurement.md).
     Meta sigue igual que en el resto del sitio: meta-pixel.js marca
     los clicks a WhatsApp como Contact y gracias.html dispara Lead.
     Solo pasan los parámetros de la lista: nunca nombre, email,
     teléfono, texto libre ni URLs ingresadas.
     ------------------------------------------------------------ */
  var ALLOWED_PARAMS = ["cta_location", "cta_label", "link_location"];

  function track(eventName, params) {
    var payload = { event: eventName, page_path: PAGE_PATH };
    params = params || {};
    ALLOWED_PARAMS.forEach(function (key) {
      var value = params[key];
      if (typeof value === "string" || typeof value === "number") {
        payload[key] = String(value).slice(0, 100);
      }
    });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }

  document.addEventListener("click", function (e) {
    if (!e.target.closest) return;
    var cta = e.target.closest("[data-cta]");
    if (cta) {
      track("cta_click", {
        cta_location: cta.getAttribute("data-cta"),
        cta_label: (cta.textContent || "").replace(/\s+/g, " ").trim()
      });
    }
    var wa = e.target.closest('a[href*="wa.me"]');
    if (wa) {
      track("whatsapp_click", { link_location: wa.getAttribute("data-wa-location") || "otro" });
    }
  }, true);

  /* ------------------------------------------------------------
     HEADER, AÑO Y PROGRESO DE SCROLL
     ------------------------------------------------------------ */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var header = document.getElementById("header");
  var progressBar = document.querySelector(".epi-scroll-progress");
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle("is-scrolled", y > 24);
    if (progressBar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* ------------------------------------------------------------
     MENÚ MOBILE — overlay a pantalla completa
     Al abrir, el foco pasa al primer link y queda atrapado entre
     los links y el botón; Escape cierra y devuelve el foco.
     ------------------------------------------------------------ */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    var isOpen = function () { return links.classList.contains("open"); };
    var setMenu = function (open, returnFocus) {
      links.classList.toggle("open", open);
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Cerrar" : "Menú";
      if (open) {
        var first = links.querySelector("a");
        if (first) first.focus();
      } else if (returnFocus) {
        toggle.focus();
      }
    };

    toggle.addEventListener("click", function () { setMenu(!isOpen(), false); });
    links.addEventListener("click", function (e) {
      if (isOpen() && e.target.closest && e.target.closest("a")) setMenu(false, false);
    });
    document.addEventListener("keydown", function (e) {
      if (!isOpen()) return;
      if (e.key === "Escape") { setMenu(false, true); return; }
      if (e.key !== "Tab") return;
      var items = Array.prototype.slice.call(links.querySelectorAll("a")).concat(toggle);
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // Si se agranda la ventana con el menú abierto, se cierra solo.
    var desktop = window.matchMedia("(min-width: 1024px)");
    var onChange = function () { if (desktop.matches && isOpen()) setMenu(false, false); };
    if (desktop.addEventListener) desktop.addEventListener("change", onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  /* ------------------------------------------------------------
     REVEAL — solo oculta lo que está fuera de pantalla y se
     muestra una vez (sin reanimar al salir).
     ------------------------------------------------------------ */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ------------------------------------------------------------
     MOUSE-GLOW EN CARDS
     ------------------------------------------------------------ */
  if (!reduceMotion) {
    document.querySelectorAll(".epi-motion-card").forEach(function (card) {
      card.addEventListener("mousemove", function (event) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", ((event.clientX - rect.left) / rect.width) * 100 + "%");
        card.style.setProperty("--mouse-y", ((event.clientY - rect.top) / rect.height) * 100 + "%");
      });
    });
  }

  /* ------------------------------------------------------------
     CUPOS — única fuente: data-cupos-total / data-cupos-tomados en
     <body>. Cada [data-cupos] los puede pisar con sus propios
     atributos. Sin JS queda el texto genérico del HTML.
     ------------------------------------------------------------ */
  var body = document.body;
  document.querySelectorAll("[data-cupos]").forEach(function (box) {
    var total = parseInt(box.getAttribute("data-cupos-total") || body.getAttribute("data-cupos-total"), 10);
    var taken = parseInt(box.getAttribute("data-cupos-tomados") || body.getAttribute("data-cupos-tomados"), 10);
    if (!(total > 0)) return;
    if (!(taken >= 0)) taken = 0;
    if (taken > total) taken = total;
    var left = total - taken;

    var dots = box.querySelector(".epi-cupos-dots");
    if (dots) {
      dots.textContent = "";
      for (var i = 0; i < total; i++) {
        var dot = document.createElement("span");
        // El próximo cupo libre late (CSS .is-next).
        dot.className = "epi-cupos-dot" + (i < taken ? " is-taken" : i === taken ? " is-next" : "");
        dots.appendChild(dot);
      }
    }
    var text = box.querySelector(".epi-cupos-text");
    if (!text) return;
    var strong = document.createElement("b");
    var rest;
    if (left === 0) { strong.textContent = "Sin cupos disponibles"; rest = " · lista de espera abierta"; }
    else if (left === 1) { strong.textContent = "1 cupo"; rest = " disponible"; }
    else { strong.textContent = left + " de " + total + " cupos"; rest = " disponibles"; }
    text.textContent = "";
    text.appendChild(strong);
    text.appendChild(document.createTextNode(rest));
  });

  /* ------------------------------------------------------------
     CONTADORES — cuentan desde 0 cuando entran en pantalla, una vez.
     El valor final ya viene escrito en el HTML (se lee sin JS).
     data-counter="13.9" data-decimals="1" data-suffix="x" → 13,9x
     ------------------------------------------------------------ */
  // Formato argentino propio: toLocaleString("es-AR") no agrupa los
  // números de cuatro cifras en todos los navegadores (2448 vs 2.448).
  function formatAR(n, decimals) {
    var parts = n.toFixed(decimals).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
  }

  var counters = document.querySelectorAll("[data-counter]");
  if (counters.length && !reduceMotion && "IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        counterObserver.unobserve(entry.target);
        var el = entry.target;
        var target = Number(el.getAttribute("data-counter"));
        var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10) || 0;
        var suffix = el.getAttribute("data-suffix") || "";
        var start = performance.now();
        var tick = function (now) {
          var p = Math.min((now - start) / 1400, 1);
          el.textContent = formatAR(target * (1 - Math.pow(1 - p, 3)), decimals) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) {
      if (!isFinite(Number(el.getAttribute("data-counter")))) return;
      // Se reserva el ancho del valor final para que el texto de al lado
      // no se corra mientras cuenta.
      if (getComputedStyle(el).display === "inline") el.style.display = "inline-block";
      el.style.minWidth = Math.ceil(el.getBoundingClientRect().width) + "px";
      // Si está fuera de pantalla arranca en 0 (así no se ve el final antes).
      if (el.getBoundingClientRect().top > window.innerHeight) {
        var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10) || 0;
        el.textContent = formatAR(0, decimals) + (el.getAttribute("data-suffix") || "");
      }
      counterObserver.observe(el);
    });
  }

  /* ============================================================
     MOTION DE LANDING — los efectos de Epicademy (nov 2026) con los
     datos de EPIBRANDS. Todo es decorativo y se apaga con "reducir
     movimiento"; si algo falla, la página se lee igual.
     ============================================================ */
  var hasIO = "IntersectionObserver" in window;

  // Observa una lista de elementos y llama a fn una sola vez por cada
  // uno cuando entra en pantalla (o enseguida si no hay IO).
  function onceVisible(els, fn, options) {
    els = Array.prototype.slice.call(els);
    if (!els.length) return;
    if (!hasIO) { els.forEach(fn); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        fn(entry.target);
      });
    }, options || { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* --- Hero: máquina de escribir --------------------------------
     Escribe y borra las frases de data-typewriter en loop. La primera
     es la del título: arranca escrita y se queda más tiempo. Se pausa
     cuando el hero no está a la vista o la pestaña está oculta. */
  var typeEl = document.querySelector("[data-typewriter]");
  if (typeEl && !reduceMotion) {
    var phrases = typeEl.getAttribute("data-typewriter").split("|")
      .map(function (s) { return s.trim(); })
      .filter(Boolean);
    if (phrases.length > 1) {
      var make = function (cls, text) {
        var s = document.createElement("span");
        s.className = cls;
        if (text) s.textContent = text;
        return s;
      };
      var box = make("hero-type-box");
      box.setAttribute("aria-hidden", "true");
      // Fantasmas: reservan el alto de la frase más larga (con cursor).
      phrases.forEach(function (p) {
        var ghost = make("hero-type-ghost", p);
        ghost.appendChild(make("type-caret"));
        box.appendChild(ghost);
      });
      var live = make("hero-type-live");
      var liveText = document.createTextNode(phrases[0]);
      live.appendChild(liveText);
      live.appendChild(make("type-caret"));
      box.appendChild(live);

      typeEl.textContent = "";
      typeEl.appendChild(make("sr-only", phrases[0]));
      typeEl.appendChild(box);
      typeEl.classList.add("is-typing");

      var idx = 0, text = phrases[0], deleting = false;
      var timer = null, heroInView = true;
      var schedule = function (ms) { timer = setTimeout(tick, ms); };
      var tick = function () {
        timer = null;
        var full = phrases[idx];
        if (!deleting && text === full) deleting = true;
        if (deleting) {
          if (text) {
            text = text.slice(0, -1);
            liveText.nodeValue = text;
            schedule(text ? 35 : 320);
            return;
          }
          deleting = false;
          idx = (idx + 1) % phrases.length;
          full = phrases[idx];
        }
        text = full.slice(0, text.length + 1);
        liveText.nodeValue = text;
        schedule(text === full ? (idx === 0 ? 3600 : 1800) : 65);
      };
      var sync = function () {
        var run = heroInView && !document.hidden;
        if (run && !timer) schedule(text === phrases[idx] ? (idx === 0 ? 3600 : 1800) : 65);
        if (!run && timer) { clearTimeout(timer); timer = null; }
      };
      if (hasIO) {
        new IntersectionObserver(function (entries) {
          heroInView = entries[0].isIntersecting;
          sync();
        }).observe(typeEl);
      }
      document.addEventListener("visibilitychange", sync);
      sync();
    }
  }

  /* --- Franja que se desliza: se duplica la lista para un loop sin salto --- */
  document.querySelectorAll(".epi-marquee").forEach(function (strip) {
    var track = strip.querySelector(".epi-marquee-track");
    var list = track && track.querySelector("ul");
    if (!list || reduceMotion) return;
    track.appendChild(list.cloneNode(true));
    strip.classList.add("is-ready");
  });

  /* --- Flip cards ------------------------------------------------
     Con mouse giran solas al pasar por encima (CSS). Los botones son
     para pantallas táctiles y teclado: "true" fuerza el dorso y
     "false" fuerza el frente; al sacar el mouse se vuelve al modo
     automático. El botón de la cara oculta no recibe foco. */
  document.querySelectorAll(".epi-flip").forEach(function (card) {
    var openBtn = card.querySelector('[data-flip="open"]');
    var closeBtn = card.querySelector('[data-flip="close"]');
    if (!openBtn || !closeBtn) return;
    var setFlipped = function (flipped, moveFocus) {
      card.setAttribute("data-flipped", flipped ? "true" : "false");
      openBtn.tabIndex = flipped ? -1 : 0;
      closeBtn.tabIndex = flipped ? 0 : -1;
      if (moveFocus) (flipped ? closeBtn : openBtn).focus({ preventScroll: true });
    };
    openBtn.addEventListener("click", function () { setFlipped(true, true); });
    closeBtn.addEventListener("click", function () { setFlipped(false, true); });
    card.addEventListener("mouseleave", function () {
      if (card.getAttribute("data-flipped") === "false") card.removeAttribute("data-flipped");
    });
  });

  /* --- Línea de tiempo de los primeros 30 días -------------------
     --t0/--tlen ubican la línea entre el primer y el último punto;
     --fill (0 a 1) es cuánto se llenó según el scroll. */
  var timeline = document.querySelector(".epi-timeline");
  if (timeline) {
    var stages = Array.prototype.slice.call(timeline.querySelectorAll(".epi-stage"));
    var wide = window.matchMedia("(min-width: 1080px)");
    var NODE = 7;      // radio del punto
    var NODE_TOP = 28; // top del punto en la vista vertical (igual que el CSS)
    var nodes = [];

    var measure = function () {
      nodes = stages.map(function (li) {
        return wide.matches
          ? li.offsetLeft + parseFloat(getComputedStyle(li).paddingLeft) + NODE
          : li.offsetTop + NODE_TOP + NODE;
      });
      var t0 = nodes[0], tlen = Math.max(nodes[nodes.length - 1] - t0, 1);
      timeline.style.setProperty("--t0", t0 + "px");
      timeline.style.setProperty("--tlen", tlen + "px");
      nodes = nodes.map(function (n) { return (n - t0) / tlen; });
    };

    var paint = function () {
      var p = 1;
      if (!reduceMotion) {
        var r = timeline.getBoundingClientRect();
        var vh = window.innerHeight;
        if (wide.matches) {
          // se llena entre que la grilla asoma (80 % de la pantalla) y
          // queda en el tercio superior
          p = (vh * 0.8 - r.top) / (vh * 0.45);
        } else {
          // la punta de la línea sigue una "línea de lectura" al 65 %
          var t0 = parseFloat(timeline.style.getPropertyValue("--t0")) || 0;
          var tlen = parseFloat(timeline.style.getPropertyValue("--tlen")) || 1;
          p = (vh * 0.65 - (r.top + t0)) / tlen;
        }
        p = Math.max(0, Math.min(1, p));
      }
      timeline.style.setProperty("--fill", p.toFixed(4));
      var current = -1;
      stages.forEach(function (li, i) {
        var reached = p >= nodes[i] - 0.001;
        li.classList.toggle("is-reached", reached);
        if (reached) current = i;
      });
      stages.forEach(function (li, i) { li.classList.toggle("is-current", i === current && !reduceMotion); });
    };

    var rafId = null;
    var request = function () {
      if (rafId) return;
      rafId = requestAnimationFrame(function () { rafId = null; paint(); });
    };
    measure();
    paint();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", function () { measure(); request(); });
    window.addEventListener("load", function () { measure(); request(); });
  }

  /* --- Etiquetas de sección: la línea se dibuja al aparecer --- */
  onceVisible(document.querySelectorAll(".eyebrow"), function (el) {
    el.classList.add("is-drawn");
  }, { threshold: 0.6 });

  /* --- Lo que incluye: los ítems aparecen de a uno --- */
  document.querySelectorAll("[data-stagger]").forEach(function (list) {
    Array.prototype.forEach.call(list.children, function (li, i) { li.style.setProperty("--i", i); });
  });
  onceVisible(document.querySelectorAll("[data-stagger]"), function (el) {
    el.classList.add("is-visible");
  }, { threshold: 0.15 });

  /* --- Brillo único en los botones de solicitud al aparecer --- */
  if (!reduceMotion) {
    onceVisible(document.querySelectorAll(".epi-shine"), function (el) {
      el.classList.add("is-shining");
    }, { threshold: 0.8 });
  }

  /* --- FAQ: abre y cierra con el alto animado --------------------
     Mientras anima se ignoran clics nuevos. Sin la API de animaciones
     queda el <details> nativo. */
  if (!reduceMotion && Element.prototype.animate) {
    document.querySelectorAll(".faq-item").forEach(function (item) {
      var summary = item.querySelector("summary");
      var body = item.querySelector(".faq-body");
      if (!summary) return;
      var busy = false;
      summary.addEventListener("click", function (e) {
        e.preventDefault();
        if (busy) return;
        busy = true;
        var borders = item.offsetHeight - item.clientHeight;
        var from = item.offsetHeight;
        var opening = !item.open;
        if (opening) item.open = true;
        var to = opening ? item.offsetHeight : summary.offsetHeight + borders;
        var duration = opening ? 340 : 260;
        var anim = item.animate(
          { height: [from + "px", to + "px"] },
          { duration: duration, easing: "cubic-bezier(.2,.7,.2,1)" }
        );
        if (opening && body) {
          body.animate(
            { opacity: [0, 1], transform: ["translateY(-6px)", "none"] },
            { duration: duration, easing: "ease-out" }
          );
        }
        var finished = false;
        var done = function () {
          if (finished) return;
          finished = true;
          if (!opening) item.open = false;
          busy = false;
        };
        anim.onfinish = done;
        anim.oncancel = done;
        // Respaldo: con la pestaña en segundo plano el evento puede demorarse.
        setTimeout(done, duration + 80);
      });
    });
  }

  /* --- Botón flotante con los cupos ------------------------------
     Visible solo cuando no hay a la vista ningún elemento con
     data-float-guard (botones del hero y del precio, la solicitud y
     el pie). Oculto queda inert, así no recibe foco. */
  var floatBox = document.getElementById("epiFloat");
  var guards = document.querySelectorAll("[data-float-guard]");
  if (floatBox && guards.length && hasIO) {
    var floatText = document.getElementById("epiFloatText");
    var fTotal = parseInt(body.getAttribute("data-cupos-total"), 10);
    var fTaken = parseInt(body.getAttribute("data-cupos-tomados"), 10) || 0;
    if (floatText && fTotal > 0) {
      var fLeft = Math.max(fTotal - Math.min(fTaken, fTotal), 0);
      var strong = document.createElement("b");
      strong.textContent = fLeft === 0 ? "Lista de espera" : fLeft + " de " + fTotal;
      floatText.textContent = "";
      floatText.appendChild(strong);
      if (fLeft > 0) floatText.appendChild(document.createTextNode(fLeft === 1 ? " cupo libre" : " cupos libres"));
    }

    var visibleGuards = new Set();
    var setFloat = function (show) {
      floatBox.classList.toggle("is-shown", show);
      if (show) floatBox.removeAttribute("inert");
      else floatBox.setAttribute("inert", "");
    };
    floatBox.setAttribute("inert", "");
    floatBox.hidden = false;
    var guardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visibleGuards.add(entry.target);
        else visibleGuards.delete(entry.target);
      });
      setFloat(visibleGuards.size === 0);
    });
    guards.forEach(function (g) { guardObserver.observe(g); });
  }
})();

/* ============================================================
   FORMULARIO DE SOLICITUD
   - Validación en el cliente con errores junto a cada campo y un
     resumen accesible. Netlify Forms no valida campos del lado del
     servidor (solo el nombre del form y el antispam).
   - Envío por fetch al mismo endpoint (action) del POST nativo.
     Solo si Netlify responde OK se pasa a gracias.html; si falla,
     los datos quedan en el formulario y se muestra el error.
   - Bloqueo de doble envío mientras la solicitud está en curso.
   ============================================================ */
(function () {
  var form = document.getElementById("epiApplyForm");
  if (!form || !window.fetch || !window.FormData) return;

  var FORM_NAME = "epibrands-studio";
  var MAX_MSG = 600;
  var PAGE_PATH = window.location.pathname;

  var submitBtn = document.getElementById("epiFormSubmit");
  var submitText = submitBtn ? submitBtn.textContent : "";
  var summary = document.getElementById("epiFormSummary");
  var summaryList = summary ? summary.querySelector("ul") : null;
  var alertBox = document.getElementById("epiFormAlert");
  var msgCount = document.getElementById("c-objetivo");

  function track(eventName, params) {
    // Mismo contrato que el adaptador de arriba (sin datos personales).
    var payload = { event: eventName, page_path: PAGE_PATH, form_name: FORM_NAME };
    Object.keys(params || {}).forEach(function (k) { payload[k] = String(params[k]).slice(0, 100); });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }

  // Reglas en el orden visual de los campos. Reciben el valor sin
  // espacios en los extremos y devuelven el mensaje de error o "".
  var rules = {
    nombre: function (v) { return v ? "" : "Ingresá tu nombre y apellido."; },
    email: function (v) {
      if (!v) return "Ingresá tu email.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Revisá el email. Ejemplo: nombre@empresa.com";
    },
    empresa: function (v) { return v ? "" : "Ingresá el nombre de tu marca o negocio."; },
    objetivo: function (v) {
      if (!v) return "Contanos brevemente qué te gustaría mejorar.";
      if (v.length > MAX_MSG) return "El texto tiene " + v.length + " caracteres. Resumilo en " + MAX_MSG + " como máximo.";
      return "";
    },
    whatsapp: function (v) {
      if (!v) return "";
      var digits = v.replace(/\D/g, "");
      var ok = /^[+\d\s().-]+$/.test(v) && digits.length >= 8 && digits.length <= 15;
      return ok ? "" : "Revisá el número. Incluí código de país y de área, por ejemplo +54 9 341 000 0000.";
    }
  };
  var ruleNames = Object.keys(rules);

  function input(name) { return form.elements[name]; }

  function setError(name, msg) {
    var el = input(name);
    var box = document.getElementById("e-" + name);
    if (!el || !box) return;
    box.textContent = msg;
    box.hidden = !msg;
    if (msg) el.setAttribute("aria-invalid", "true");
    else el.removeAttribute("aria-invalid");
  }

  function validate(name) {
    var el = input(name);
    var msg = el ? rules[name](el.value.trim()) : "";
    setError(name, msg);
    return msg;
  }

  function updateCount() {
    if (!msgCount) return;
    var n = input("objetivo").value.trim().length;
    msgCount.textContent = n + " / " + MAX_MSG;
    msgCount.classList.toggle("is-over", n > MAX_MSG);
  }

  function renderSummary(names) {
    if (!summary || !summaryList) return;
    summaryList.textContent = "";
    names.forEach(function (name) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + input(name).id;
      a.textContent = document.getElementById("e-" + name).textContent;
      a.addEventListener("click", function (ev) { ev.preventDefault(); input(name).focus(); });
      li.appendChild(a);
      summaryList.appendChild(li);
    });
    summary.hidden = false;
    summary.focus();
  }

  // El JS toma el control de la validación (sin JS queda la nativa).
  form.noValidate = true;
  if (msgCount) { msgCount.hidden = false; updateCount(); }

  var started = false;
  var attempted = false;
  var sending = false;

  form.addEventListener("input", function (e) {
    var name = e.target.name;
    if (!name || name === "bot-field") return;
    if (!started) {
      started = true;
      track("lead_form_start", {});
    }
    if (name === "objetivo") updateCount();
    // Si el campo ya estaba marcado, el error se va apenas se corrige.
    if (rules[name] && e.target.getAttribute("aria-invalid") === "true") validate(name);
  });

  // Al salir de un campo se valida solo si ya tiene algo escrito (o si
  // ya se intentó enviar), para no marcar errores mientras se recorre.
  form.addEventListener("focusout", function (e) {
    var name = e.target.name;
    if (rules[name] && (attempted || e.target.value.trim())) validate(name);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (sending) return;
    attempted = true;
    if (alertBox) alertBox.hidden = true;

    var invalid = ruleNames.filter(function (name) { return validate(name); });
    if (invalid.length) {
      renderSummary(invalid);
      track("lead_form_error", { error_type: "validacion", error_field: invalid.join(",") });
      return;
    }
    if (summary) summary.hidden = true;
    send();
  });

  function encode(data) {
    var pairs = [];
    data.forEach(function (value, key) {
      pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    });
    return pairs.join("&");
  }

  function fail(errorType) {
    sending = false;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = submitText;
    }
    if (alertBox) alertBox.hidden = false;
    track("lead_form_error", { error_type: errorType });
  }

  function send() {
    sending = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando…";
    }

    var action = form.getAttribute("action");
    var controller = window.AbortController ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, 20000) : null;

    fetch(action, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode(new FormData(form)),
      credentials: "same-origin",
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      if (timer) clearTimeout(timer);
      if (!res.ok) { fail("servidor_" + res.status); return; }
      // Aceptada por Netlify: gracias.html dispara Lead + lead_captured
      // una sola vez gracias a esta marca (una recarga no lo repite).
      try { sessionStorage.setItem("epi_lead_ok", lastCtaLocation()); } catch (err) { /* sin storage */ }
      if (submitBtn) submitBtn.textContent = "Solicitud enviada";
      window.location.assign(action);
    }).catch(function () {
      if (timer) clearTimeout(timer);
      fail("red");
    });
  }

  // El adaptador de arriba guarda el último CTA en el dataLayer.
  function lastCtaLocation() {
    var dl = window.dataLayer || [];
    for (var i = dl.length - 1; i >= 0; i--) {
      if (dl[i] && dl[i].event === "cta_click" && dl[i].cta_location) return dl[i].cta_location;
    }
    return "directo";
  }
})();
