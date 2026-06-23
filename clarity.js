/* Microsoft Clarity — analítica de comportamiento (heatmaps + grabaciones de sesión).
   Proyecto: xbr2h2igw3. Se carga en el <head> de cada página del sitio igual que
   gtm.js y meta-pixel.js. El dominio www.clarity.ms tiene que estar permitido en la
   CSP (ver _headers): script-src, img-src y connect-src apuntan a *.clarity.ms. */
(function (c, l, a, r, i, t, y) {
  c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
  t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
  y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
})(window, document, "clarity", "script", "xbr2h2igw3");
