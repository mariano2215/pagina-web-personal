# EPIBRANDS Studio — contenido pendiente y decisiones

Página: `/epibrands/studio` (`epibrands/studio.html`, `epibrands/studio.js`, `epibrands/gracias.html`).
Fecha: 2026-09-28. Rama: `epibrands-studio-conversion`.

> Este archivo NO se publica: `_redirects` devuelve 404 para `/docs/*`.

## 1. Confirmado por Mariano (2026-09-28) y ya publicado en la página

| Tema | Qué dice la página |
| --- | --- |
| Qué incluye | Los 10 ítems de la lista original: growth meeting semanal de 60 min, diagnóstico, plan documentado a seis meses, Meta/Google/TikTok Ads, GA4 + GTM, calidad de leads y proceso comercial, propuesta de valor/pricing/margen, automatización de seguimiento/WhatsApp/CRM, tablero y canal directo. |
| CRM y automatización | Si el cliente no los tiene, EPIBRANDS acompaña la creación y la implementación. Las licencias las paga el cliente. |
| Permanencia | Mínimo tres meses. |
| Cancelación | Por escrito, con 7 días de anticipación. |
| Pago | PayPal, Stripe u otras plataformas internacionales. En Argentina, transferencia en pesos a la cotización del dólar del día. |
| Canal entre reuniones | WhatsApp, con respuesta inmediata. |
| Plan en la primera semana | Se mantiene (30 días y FAQ). |
| Cupos | Visibles: 3 de 4 disponibles. Solo se toman los negocios que cumplen los requisitos. **Para actualizarlo, cambiar solo `data-cupos-tomados` en `<body>` de `epibrands/studio.html`.** |
| Política de privacidad | `/privacidad.html` (sitio completo). Enlazada desde el formulario y el footer de EPIBRANDS. |
| Logo y OG | Siguen diciendo "Marketing Studio": es parte de la marca EPIBRANDS. |
| Registro | Voseo. |

Decisiones que siguen vigentes: los contadores y "más de 10 años" están ocultos; el calendario directo se quitó de la landing; WhatsApp cuenta como `Contact` y no como `Lead`; el formulario tiene 6 campos.

## 2. Todavía pendiente

1. **Contadores**: para mostrarlos, cada cifra necesita qué mide, período y fuente (34 clientes actuales, USD 25.000, 7 ecommerce, 945.000 visualizaciones, años de experiencia). Hoy no coinciden con la home.
2. **Cotización del dólar** para la transferencia en Argentina: ¿oficial, MEP, otra? La página dice "del día".
3. **Impuestos y factura**: no se publicó nada.
4. **Piezas creativas**: ¿quién produce los anuncios?
5. **Casos**: ya se muestran con período y resultado. Faltan:
   - las capturas de las cuentas publicitarias (`img/casos/google-ads-ecommerce-marjun26.png` y `meta-ads-leadgen-marjun26.png` no están en el repo; el portfolio las oculta);
   - unificar el período del caso 1 en el portfolio ("mar–jun 2026" en el título vs. "23 feb – 29 jun 2026" en el pie de la captura);
   - confirmar los bullets "Qué hice" del portfolio (tienen un `TODO(Mariano)`).
6. **Política de privacidad**: es un texto base armado según lo que hace el sitio (Netlify Forms, Meta Pixel + CAPI, GTM/GA, Clarity, Mercado Pago/PayPal/Stripe) y la Ley 25.326. Conviene que la revise un abogado. Además, solo está enlazada desde EPIBRANDS: falta sumarla al footer y a los otros formularios del sitio.

## 3. Componente listo para reactivar

### Contadores
El CSS y el JS siguen en la página, pero no se renderizan. Pegar el HTML solo con datos confirmados.
El valor final va escrito en el HTML (sirve sin JS y para lectores de pantalla); la animación es un extra. Cada cifra necesita unidad, período y fuente.

```html
<div class="epi-counters">
  <div class="epi-counter">
    <span class="epi-counter-num"><span class="sr-only">34</span><span aria-hidden="true" data-counter="34">34</span></span>
    <p class="epi-counter-label">QUÉ MIDE</p>
    <p class="epi-counter-context">PERÍODO · FUENTE</p>
  </div>
</div>
```

## 4. Estado real de las integraciones

- **Netlify Forms (`epibrands-studio`)**: se mantienen el nombre, el honeypot `bot-field` y el action `/epibrands/gracias.html`. Con JS, el formulario se envía por `fetch` al mismo action y solo pasa a gracias.html si Netlify responde OK. Sin JS, funciona como POST nativo.
- **Verificado** en un servidor local que imita a Netlify: validación, error 500, doble clic (1 solo POST), éxito y datos enviados. **No verificado**: un envío real a Netlify, las notificaciones por email y el Deploy Preview.
- **Campos**: al deployar, Netlify vuelve a leer el formulario. Los envíos nuevos ya no traen `rubro`, `facturacion`, `inversion` ni `inicio`. Si alguna integración externa (Zapier, Make, webhooks, filtros de notificación) usa esos campos, hay que ajustarla. Desde el repo no se puede ver.
- **Validación del lado del servidor**: Netlify Forms no valida campos, solo el nombre del form y el spam. Hoy la validación es solo en el cliente. Para validar en el servidor haría falta una Netlify Function delante del formulario; no se hizo, para no cambiar el endpoint.
- **Deploy Preview**: los envíos de prueba desde el preview también llegan a Netlify Forms y pueden disparar las notificaciones.

Medición: ver `docs/epibrands-measurement.md`.
