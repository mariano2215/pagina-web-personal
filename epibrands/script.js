/* =========================================================
   EPIBRANDS — Script de la landing
   - Navegación mobile
   - Captura de UTMs
   - Validación del formulario
   - Envío a Netlify Forms (de ahí al CRM Comercial vía n8n)
   - Apertura de WhatsApp con mensaje precargado
   - Eventos dataLayer para GTM (sin PII)
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Config ---------- */
  var WHATSAPP_NUMBER = "5493416397137";
  var WHATSAPP_BASE = "https://wa.me/" + WHATSAPP_NUMBER;

  /* ---------- DataLayer helper (sin PII) ---------- */
  window.dataLayer = window.dataLayer || [];
  function gtmPush(payload) {
    try { window.dataLayer.push(payload); }
    catch (e) { /* no-op */ }
  }

  /* ---------- Año dinámico footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navegación mobile ---------- */
  var navToggle = document.getElementById("navToggle");
  var navList = document.getElementById("navList");
  if (navToggle && navList) {
    navToggle.addEventListener("click", function () {
      var open = navList.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
    navList.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navList.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Eventos en CTAs ---------- */
  document.querySelectorAll("[data-cta]").forEach(function (el) {
    el.addEventListener("click", function () {
      var loc = el.getAttribute("data-cta");
      var plan = el.getAttribute("data-plan");

      if (plan) {
        gtmPush({
          event: "plan_cta_click",
          plan_name: plan,
          cta_location: "pricing_card"
        });
      } else if (loc === "hero" || loc === "header" || loc === "resultados" || loc === "sticky-mobile" || loc === "hero-secondary") {
        gtmPush({
          event: "diagnostico_cta_click",
          cta_location: loc
        });
      } else if (loc === "footer-whatsapp") {
        gtmPush({
          event: "whatsapp_click",
          cta_location: "footer",
          plan_interest: "indefinido"
        });
      }
    });
  });

  /* ---------- FAQ: dataLayer al abrir (opcional, sin PII) ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        var q = item.querySelector("summary span");
        gtmPush({
          event: "faq_open",
          faq_question: q ? q.textContent.trim().slice(0, 80) : ""
        });
      }
    });
  });

  /* ---------- Captura de UTMs (se envían con el formulario) ---------- */
  function getUtms() {
    var params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_content: params.get("utm_content") || "",
      utm_term: params.get("utm_term") || ""
    };
  }
  var UTMS = getUtms();

  /* ---------- Formulario ---------- */
  var form = document.getElementById("diagnosticoForm");
  if (!form) return;

  var submitBtn = document.getElementById("formSubmit");
  var statusEl = document.getElementById("formStatus");
  var formStarted = false;

  // Disparar form_start una sola vez
  form.addEventListener("focusin", function () {
    if (formStarted) return;
    formStarted = true;
    gtmPush({
      event: "diagnostico_form_start",
      form_name: "diagnostico_epibrands"
    });
  }, { once: false });

  /* ---------- Validación ---------- */
  function showError(fieldEl, show) {
    var wrap = fieldEl.closest(".field");
    var err = wrap ? wrap.querySelector(".field-error") : null;
    if (!wrap || !err) return;
    if (show) {
      wrap.classList.add("has-error");
      err.hidden = false;
      fieldEl.setAttribute("aria-invalid", "true");
    } else {
      wrap.classList.remove("has-error");
      err.hidden = true;
      fieldEl.removeAttribute("aria-invalid");
    }
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  function validate() {
    var ok = true;
    var fields = form.querySelectorAll("input, select, textarea");
    fields.forEach(function (f) {
      if (!f.name) return;
      var val = (f.value || "").trim();

      if (f.type === "checkbox") {
        if (f.required && !f.checked) { showError(f, true); ok = false; }
        else showError(f, false);
        return;
      }

      if (f.required && !val) { showError(f, true); ok = false; return; }
      if (f.type === "email" && val && !validEmail(val)) { showError(f, true); ok = false; return; }
      if (f.tagName === "TEXTAREA" && f.minLength && val.length < f.minLength) { showError(f, true); ok = false; return; }

      showError(f, false);
    });
    return ok;
  }

  // Limpiar error al editar
  form.querySelectorAll("input, select, textarea").forEach(function (f) {
    f.addEventListener("input", function () { showError(f, false); });
    f.addEventListener("change", function () { showError(f, false); });
  });

  /* ---------- Construcción del mensaje WhatsApp ---------- */
  function buildWhatsAppMessage(data) {
    return [
      "Hola Mariano, quiero solicitar un diagnóstico gratuito de 30 minutos para EPIBRANDS.",
      "",
      "Nombre: " + data.nombre,
      "Empresa / proyecto: " + data.empresa,
      "Email: " + data.email,
      "WhatsApp: " + data.whatsapp,
      "País: " + data.pais,
      "Tipo de negocio: " + data.tipoNegocio,
      "Plan de interés: " + data.planInteres,
      "Necesidad principal: " + data.necesidad,
      "Presupuesto mensual estimado: " + data.presupuesto,
      "Inicio estimado: " + data.inicio,
      "",
      "Situación actual:",
      data.situacion
    ].join("\n");
  }

  /* ---------- Envío a Netlify Forms ---------- */
  // Netlify guarda la solicitud y la reenvía al CRM (netlify/functions/submission-created.js).
  // keepalive: el envío termina aunque la pestaña pase a WhatsApp enseguida.
  function sendToNetlify() {
    Object.keys(UTMS).forEach(function (k) {
      if (form.elements[k]) form.elements[k].value = UTMS[k];
    });
    if (form.elements.pagina) form.elements.pagina.value = window.location.href;
    var body = new URLSearchParams(new FormData(form)).toString();
    return fetch(form.getAttribute("action") || "/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body,
      keepalive: true
    }).then(function (res) {
      return { ok: res.ok, reason: res.ok ? null : "http-" + res.status };
    }).catch(function (err) {
      console.warn("[EPIBRANDS] Error al enviar a Netlify Forms:", err);
      return { ok: false, reason: "fetch-failed" };
    });
  }

  /* ---------- Submit ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validate()) {
      statusEl.hidden = false;
      statusEl.className = "form-status is-error";
      statusEl.textContent = "Revisá los campos marcados antes de enviar.";
      // Foco al primer campo con error
      var firstErr = form.querySelector(".field.has-error input, .field.has-error select, .field.has-error textarea");
      if (firstErr) firstErr.focus();
      return;
    }

    var fd = new FormData(form);
    var data = {
      nombre: (fd.get("nombre") || "").toString().trim(),
      empresa: (fd.get("empresa") || "").toString().trim(),
      email: (fd.get("email") || "").toString().trim(),
      whatsapp: (fd.get("whatsapp") || "").toString().trim(),
      pais: (fd.get("pais") || "").toString().trim(),
      tipoNegocio: (fd.get("tipoNegocio") || "").toString().trim(),
      planInteres: (fd.get("planInteres") || "").toString().trim(),
      necesidad: (fd.get("necesidad") || "").toString().trim(),
      presupuesto: (fd.get("presupuesto") || "").toString().trim(),
      inicio: (fd.get("inicio") || "").toString().trim(),
      situacion: (fd.get("situacion") || "").toString().trim()
    };

    // Estado visual
    submitBtn.disabled = true;
    var originalLabel = submitBtn.textContent;
    submitBtn.textContent = "Enviando...";
    statusEl.hidden = false;
    statusEl.className = "form-status";
    statusEl.textContent = "Preparando tu solicitud...";

    // Evento dataLayer sin PII
    gtmPush({
      event: "generate_lead",
      form_name: "diagnostico_epibrands",
      plan_interest: data.planInteres || "indefinido",
      business_type: data.tipoNegocio || "otro"
    });

    // Se guarda en Netlify Forms y, sin esperar la respuesta, se abre WhatsApp
    // (esperar puede hacer que el navegador bloquee la ventana nueva).
    sendToNetlify().then(function (res) {
      if (!res.ok) console.warn("[EPIBRANDS] La solicitud no se guardó en Netlify Forms (" + res.reason + "). WhatsApp sigue funcionando.");
    });

    (function () {
      var msg = buildWhatsAppMessage(data);
      var url = WHATSAPP_BASE + "?text=" + encodeURIComponent(msg);

      gtmPush({
        event: "whatsapp_click",
        cta_location: "diagnostico_form",
        plan_interest: data.planInteres || "indefinido"
      });

      statusEl.className = "form-status is-success";
      statusEl.textContent = "Abriendo WhatsApp con tu solicitud. Si no se abre automáticamente, tocá el botón nuevamente.";

      // Abrimos WhatsApp en nueva pestaña.
      var win = window.open(url, "_blank");
      if (!win) {
        // Si el browser bloqueó el popup, redirigimos.
        window.location.href = url;
      }

      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    })();
  });

})();
