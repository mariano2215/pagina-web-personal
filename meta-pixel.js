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
})();
