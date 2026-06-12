// Meta Pixel + Conversions API client
// Carga el Pixel client-side y dispara cada evento por ambos lados
// (browser + servidor) con el mismo event_id para deduplicacion en Meta.
//
// Uso:
//   <script src="/meta-pixel.js?v=__BUST__"></script>
//   <script>window.mcTrack('Lead', { content_name: 'guia-paid-media' });</script>
//
// El PageView se dispara automaticamente al cargar.

(function () {
  var PIXEL_ID = '1460516722431287';
  var CAPI_ENDPOINT = '/.netlify/functions/meta-capi';

  // ---------- Meta Pixel bootstrap (estandar Meta) ----------
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', PIXEL_ID);

  // ---------- Utilidades ----------
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    // fallback: timestamp + random
    return (
      Date.now().toString(36) +
      '-' +
      Math.random().toString(36).slice(2, 10) +
      '-' +
      Math.random().toString(36).slice(2, 10)
    );
  }

  function sendToCAPI(eventName, eventId, customData, userData) {
    try {
      var body = JSON.stringify({
        event_name: eventName,
        event_id: eventId,
        event_source_url: window.location.href,
        custom_data: customData || {},
        user_data: userData || {}
      });
      // sendBeacon sobrevive al unload (ideal para clicks que navegan)
      if (navigator.sendBeacon) {
        var blob = new Blob([body], { type: 'application/json' });
        if (navigator.sendBeacon(CAPI_ENDPOINT, blob)) return;
      }
      fetch(CAPI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
        keepalive: true,
        credentials: 'same-origin'
      }).catch(function () {});
    } catch (_) {
      /* nada */
    }
  }

  // ---------- API publica ----------
  window.mcTrack = function (eventName, customData, userData) {
    var eventId = uuid();
    try {
      fbq('track', eventName, customData || {}, { eventID: eventId });
    } catch (_) {}
    sendToCAPI(eventName, eventId, customData, userData);
    return eventId;
  };

  // PageView automatico en cada carga
  window.mcTrack('PageView');

  // ---------- Auto-tracking de eventos comunes ----------
  // Cubre todas las paginas con un solo bloque (delegacion en document).
  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  onReady(function () {
    // 1) Schedule — clicks a Google Calendar / Calendly / Cal.com
    var scheduleSelector =
      'a[href*="calendar.google.com/calendar"], a[href*="calendly.com"], a[href*="cal.com"]';
    document.addEventListener(
      'click',
      function (e) {
        var link = e.target.closest && e.target.closest(scheduleSelector);
        if (!link) return;
        window.mcTrack('Schedule', {
          content_name: 'auditoria-gratuita',
          content_category: 'schedule'
        });
      },
      { capture: true }
    );

    // 2) Contact — clicks a WhatsApp
    var waSelector = 'a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href*="whatsapp.com/send"]';
    document.addEventListener(
      'click',
      function (e) {
        var link = e.target.closest && e.target.closest(waSelector);
        if (!link) return;
        window.mcTrack('Contact', {
          content_name: 'whatsapp',
          content_category: 'contact'
        });
      },
      { capture: true }
    );

    // 3) Subscribe — submit de forms de newsletter
    document.addEventListener(
      'submit',
      function (e) {
        var form = e.target;
        if (!form || form.tagName !== 'FORM') return;
        var name = (form.getAttribute('name') || '').toLowerCase();
        if (name !== 'newsletter' && name !== 'newsletter-footer') return;
        var email = (form.querySelector('input[name="email"]') || {}).value || '';
        var nombre = (form.querySelector('input[name="nombre"]') || {}).value || '';
        var parts = nombre.trim().split(/\s+/);
        var fn = parts.shift() || '';
        var ln = parts.join(' ');
        window.mcTrack(
          'Subscribe',
          { content_name: name, content_category: 'newsletter' },
          { email: email, first_name: fn, last_name: ln }
        );
      },
      { capture: true }
    );
  });
})();
