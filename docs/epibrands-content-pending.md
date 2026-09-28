# EPIBRANDS Studio — contenido pendiente y decisiones

Página: `/epibrands/studio` (`epibrands/studio.html`, `epibrands/studio.js`, `epibrands/gracias.html`).
Fecha: 2026-09-28. Rama: `epibrands-studio-conversion`.

> Este archivo NO se publica: `_redirects` devuelve 404 para `/docs/*`.

## 1. Decisiones tomadas en esta versión (todas reversibles)

| Tema | Qué se hizo | Por qué |
| --- | --- | --- |
| Cupos "2 de 4 disponibles" | Se quitó el indicador numérico (hero, precio y formulario). Queda la capacidad ("Cuatro negocios por período") y "Consultá disponibilidad". | El número vive en 3 atributos HTML editados a mano (último cambio: commit `ae672df`, 2026-09-07). No hay una fuente operativa que lo mantenga al día. |
| Contadores (34 clientes actuales, USD 25.000 facturados, 7 ecommerce, 945.000 visualizaciones) y "Más de 10 años" | Se ocultaron. | Falta el contexto de cada cifra. Además no coinciden con la home (`+35 clientes`, `+50.000 USD facturados por mes`, `+5 años especializado en paid media`). |
| Evidencia | Se muestran 2 casos ya publicados en `/portfolio/` (equipamiento gastronómico / Google Ads y e-commerce de branding / Meta Ads), con período, moneda y fuente. | Único material con período y contexto dentro del repo. |
| Calendario directo | Se quitó de la landing. El link de Google Calendar sigue intacto en `/servicios/*`. | El recorrido elegido es solicitud → revisión → llamada. |
| Formulario | De 9 campos en 3 pasos a 6 campos en una pantalla. Se quitaron `rubro`, `facturacion`, `inversion` e `inicio`. `whatsapp` pasó a opcional. | Pedido del brief. Se mantienen los nombres de campo existentes (`nombre`, `email`, `empresa`, `web`, `objetivo`, `whatsapp`), el nombre del form `epibrands-studio`, el honeypot y la página de éxito. |
| Frases eliminadas | "Alcance completo", "sin condiciones adicionales", "el impacto se refleja en la facturación" en seis meses, "Toda iniciativa sin retorno verificable se discontinúa". | No hay definición que las respalde o prometen resultados. |
| CRM y automatización | "Automatización de seguimiento, WhatsApp y CRM" ya no figura como incluido. | No hay documentación del alcance (implementación vs. asesoramiento). |
| "Plan documentado en la primera semana" | No se publicó. La sección de 30 días aclara que el plan inicial no es una auditoría técnica completa. | El brief pide mantenerlo solo si Mariano lo confirma. |
| Industrias | Se quitó la lista de 9 sectores y el bloque "No es ideal para". | El brief pide sectores solo con experiencia documentada. |
| Registro del copy | Voseo, como la versión Growth Partner vigente y el brief. | La regla anterior de "trato de usted" (2026-09-01) ya no se aplicaba en la página publicada. Confirmar. |

## 2. Preguntas para Mariano (sin respuesta no se publican)

1. **Alcance de los USD 990**: cantidad de cuentas publicitarias, canales y mercados incluidos.
2. **Piezas creativas**: ¿quién produce los anuncios? ¿Está incluido?
3. **CRM y automatización**: ¿EPIBRANDS configura o solo asesora? ¿Incluye migraciones?
4. **Licencias y terceros**: ¿quién paga herramientas (CRM, automatización, etc.)?
5. **Canal entre reuniones**: ¿qué canal es (WhatsApp, email) y en qué plazo se responde?
6. **Permanencia**: ¿los seis meses son un mínimo contractual? ¿Cómo es la cancelación y la renovación?
7. **Pago e impuestos**: moneda, medio de pago, factura.
8. **Plan en la primera semana**: ¿se mantiene ese compromiso?
9. **Cupos**: si se quiere volver a mostrar la disponibilidad, ¿quién la actualiza y cada cuánto?
10. **Cifras**: para cada una, qué mide, período y fuente:
    - 34 "clientes actuales": ¿de qué servicio? ¿Cómo convive con 4 partnerships?
    - USD 25.000 "facturados en servicios profesionales": ¿quién facturó, en qué período?
    - 7 ecommerce: ¿propios, de clientes o implementados? ¿Período?
    - 945.000 visualizaciones: ¿qué cuenta y qué período?
    - Años de experiencia: ¿en qué áreas?
11. **Casos**:
    - Confirmar que se pueden mostrar en EPIBRANDS (hoy son públicos en `/portfolio/`).
    - En el portfolio, los bullets de "Qué hice" tienen un `TODO(Mariano)`: acá solo se publicó lo que figura en "Contexto".
    - Caso 1: el portfolio dice "mar–jun 2026", pero el pie de la captura dice "23 feb – 29 jun 2026". ¿Cuál es el correcto?
    - Las capturas anonimizadas (`img/casos/*.png`) no están en el repo.
12. **Política de privacidad**: no existe en el sitio. El formulario conserva el texto previo ("La información es confidencial y no se comparte con terceros").
13. **Imagen OG y logo**: la OG (`epibrands/assets/og-epibrands.jpg`) todavía dice "Marketing Studio / Marketing claro. Crecimiento real.", y el logo del header dice "MARKETING STUDIO". ¿Se actualizan?
14. **Sectores**: ¿en qué industrias hay experiencia documentada para mencionar?
15. **FAQ sin publicar**: "¿Quién prepara las piezas y qué herramientas se necesitan?" y "¿Cómo funcionan la permanencia y la cancelación?".
16. **Campos quitados del formulario**: si la calificación por facturación o por plazo de inicio era necesaria, se puede volver a agregar un campo opcional.

## 3. Componentes listos para reactivar

El CSS y el JS de estos componentes siguen en la página, pero no se renderizan. Pegar el HTML solo con datos confirmados.

### Cupos
Actualizar `data-cupos-tomados` cada vez que cambie la disponibilidad real.

```html
<div class="epi-cupos" data-cupos data-cupos-total="4" data-cupos-tomados="2">
  <span class="epi-cupos-dots" aria-hidden="true"></span>
  <span class="epi-cupos-text"><b>2 de 4 cupos</b> disponibles</span>
</div>
```

### Contadores
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
