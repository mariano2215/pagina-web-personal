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
        dot.className = "epi-cupos-dot" + (i < taken ? " is-taken" : "");
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
     CONTADORES (reutilizable, hoy sin uso en la página)
     El valor final ya viene escrito en el HTML; la animación es un
     extra que respeta movimiento reducido. Markup listo para pegar
     en docs/epibrands-content-pending.md.
     ------------------------------------------------------------ */
  var counters = document.querySelectorAll("[data-counter]");
  if (counters.length && !reduceMotion && "IntersectionObserver" in window) {
    var formatCounter = function (n) { return Math.round(n).toLocaleString("es-AR"); };
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        counterObserver.unobserve(entry.target);
        var el = entry.target;
        var target = Number(el.getAttribute("data-counter"));
        if (!isFinite(target)) return;
        var start = performance.now();
        var tick = function (now) {
          var p = Math.min((now - start) / 1400, 1);
          el.textContent = formatCounter(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { counterObserver.observe(c); });
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
      // Aceptada por Netlify: gracias.html dispara Lead + generate_lead
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
