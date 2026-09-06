# EPIBRANDS — Landings de /epibrands/

Este directorio tiene dos landings:

| Ruta | Archivo | Estado |
|---|---|---|
| `/epibrands/studio` | `studio.html` + `studio.css` + `studio.js` | **Landing principal en producción** |
| `/epibrands/` | `index.html` + `styles.css` + `script.js` | MVP anterior (se mantiene por links viejos) |

La URL limpia `/epibrands/studio` se resuelve con las reglas de `_redirects`
en la raíz del repo. No cambiar ese bloque sin leer el comentario que tiene:
sin el rewrite 200 se genera un loop de redirects.

---

## 1. `/epibrands/studio` — estructura

```
epibrands/
├── studio.html          → markup de la landing
├── studio.css           → design system compartido (ver §2)
├── studio.js            → header, reveals, cupos, counters, formulario, tracking
├── gracias.html         → confirmación tras enviar el formulario (dispara Lead)
└── assets/
    ├── epibrands-logo.png
    ├── logo-epibrands.svg
    └── og-epibrands.jpg  (1200×630)
```

Orden de las secciones (la jerarquía es intencional, de mayor a menor
impacto sobre la conversión):

1. Hero — propuesta de valor + CTA `Solicitar diagnóstico`.
2. Barra de autoridad — métricas reales.
3. Marquee — las piezas que el sistema conecta.
4. Problemas del cliente (`#problemas`).
5. Antes / Después (`#antes-despues`).
6. Sistema EPIBRANDS (`#sistema`) — los 8 componentes.
7. Casos y resultados (`#casos`).
8. Método (`#metodo`) — los 6 pasos.
9. Capacidades (`#capacidades`).
10. Para quién es / para quién no (`#para-quien`).
11. Honorarios (`#honorarios`).
12. Sobre EPIBRANDS / Mariano (`#sobre`).
13. FAQ (`#faq`).
14. Diagnóstico + formulario (`#diagnostico`).
15. CTA final.
16. Footer.

Los ids viejos (`#concepto`, `#servicios`, `#incluye`, `#pilares`, `#ruta`,
`#precio`, `#aplicar`) siguen existiendo como anclas de compatibilidad
(`<span class="anchor-alias">`) para que ningún link compartido se rompa.

---

## 2. `studio.css` — design system reutilizable

`studio.css` está pensado para reutilizarse tal cual en las próximas
landings de `/epibrands/*` (meta-ads, google-ads, paid-media,
consultoria-marketing, estrategia-marketing, automatizacion-ia,
auditoria-marketing, landing-pages, casos).

Para armar una landing nueva:

1. `<link rel="stylesheet" href="studio.css?v=__BUST__">` en el `<head>`.
2. Copiar el markup de los bloques que hagan falta: cada componente es
   independiente del resto.
3. Si la landing necesita otra paleta, redefinir solo las variables de
   `:root`. No hace falta tocar ningún componente.

El inventario completo de componentes está comentado arriba de todo en
`studio.css`.

---

## 3. Métricas y casos: de dónde salen los números

**Regla: no se publica ninguna cifra que no esté ya publicada en el sitio.**

| Dato en la landing | Fuente |
|---|---|
| +35 clientes en LATAM | ticker de la home (`/index.html`) |
| +8.500 leads generados | ticker de la home |
| +1.000.000 de visualizaciones | ticker de la home + `/portfolio/` |
| 13,9x ROAS | ficha del caso de equipamiento gastronómico en `/portfolio/` |
| Caso Google Ads ($22,7M / $1,63M / 12.200 clics / $134 CPC) | `/portfolio/` |
| Caso Meta Ads (2.448 conversaciones / ~$500 CPL / ~$27M) | `/portfolio/` |
| 271 leads · CPL $625 (ALYC) | `/portfolio/`, bloque "Más resultados" |
| +1M visualizaciones · +110k seguidores (psicología) | `/portfolio/` |
| +5.000 USD ahorrados (software + IA) | `/portfolio/` |
| Biografía de Mariano | `/quien-soy.html` |

> **Nota pendiente:** la home muestra `13,4x ROAS` y el portfolio `13,9x`
> para el mismo caso. La landing usa **13,9x**, que es el número que se
> desprende de las cifras publicadas en el portfolio
> ($22.700.000 / $1.630.000). Conviene unificar la home.

**No hay testimonios firmados publicados en el sitio**, así que la landing
no los muestra: la prueba social se apoya en casos, números y metodología.
Tampoco hay logos de clientes utilizables (el portfolio los anonimiza por
vertical), así que no existe sección de logos.

---

## 4. Contadores: por qué el HTML tiene el número final

Los `[data-counter]` llevan el valor real escrito en el HTML:

```html
<span data-counter="35" data-counter-prefix="+">+35</span>
```

Crawlers, herramientas de IA y usuarios sin JavaScript ven siempre la
métrica correcta, nunca un `0`. `studio.js` solo anima **los counters que
todavía están fuera de pantalla al cargar**, así nadie ve el número
resetearse a 0 delante suyo.

Atributos soportados: `data-counter` (destino), `data-counter-prefix`,
`data-counter-suffix`, `data-counter-decimals`.

---

## 5. Cupos

El indicador de cupos sale del HTML, no del JS:

```html
<div class="epi-cupos" data-cupos data-cupos-total="4" data-cupos-tomados="0">
```

Cuando se ocupa un lugar hay que subir `data-cupos-tomados` en **los tres
bloques**: hero, honorarios y diagnóstico.

---

## 6. Formulario

- Netlify Forms, `name="epibrands-studio"`, honeypot `bot-field`.
- Redirige a `/epibrands/gracias.html`, que dispara el evento `Lead`
  (browser + CAPI, deduplicado).
- Campos enviados: `nombre`, `email`, `whatsapp`, `empresa`, `web`,
  `facturacion`, `objetivo`.
- Dos pasos, pero **solo con JavaScript**: sin JS se ve el formulario
  completo y funciona igual.
- El `<form>` tiene `novalidate`: la validación y los mensajes los maneja
  `studio.js`, con `role="alert"` por campo y `aria-invalid`. El texto de
  cada error se define en el atributo `data-error` del campo.
- Estado de carga: el botón queda `disabled` + `aria-busy="true"`.
  El estado de éxito es `gracias.html`.

---

## 7. Tracking

`studio.html` carga el mismo contenedor de GTM que el resto del sitio
(`GTM-WF2DG4B7`, vía `/gtm.js`) y el mismo pixel (`/meta-pixel.js`).
**No se agregaron herramientas nuevas ni IDs nuevos.**

Eventos de `dataLayer` que dispara la landing:

| Evento | Cuándo | Parámetros |
|---|---|---|
| `epibrands_diagnostic_click` | Click en cualquier CTA de diagnóstico | `cta_location` |
| `epibrands_diagnostic_submit` | Submit válido del formulario | `form_name` |
| `epibrands_whatsapp_click` | Click en cualquier CTA de WhatsApp | `cta_location` |
| `epibrands_portfolio_click` | Click hacia `/portfolio/` | `cta_location` |
| `epibrands_method_view` | El método entra en pantalla (una vez) | — |
| `epibrands_cases_view` | Los casos entran en pantalla (una vez) | — |

Se declaran con atributos en el HTML, no con listeners por elemento:

```html
<a href="#diagnostico" data-cta="diagnostico" data-cta-location="hero">
```

Valores de `data-cta`: `diagnostico`, `whatsapp`, `portfolio`.
`cta_location` identifica el lugar de la página (`hero`, `nav`, `casos`,
`honorarios`, `cta-final`, `footer`, `diagnostico`, `authority`).

**No se envía PII al dataLayer**: ni nombre, ni email, ni teléfono, ni el
texto del mensaje. Solo la ubicación del CTA.

Meta: el click a WhatsApp dispara `Lead` vía `window.mcTrack`. El
`Contact` automático lo dispara `meta-pixel.js` para todo el sitio.

---

## 8. SEO

- Un solo `<h1>`.
- `title`, `description`, `canonical`, Open Graph y Twitter Card propios
  de EPIBRANDS (la imagen OG es `assets/og-epibrands.jpg`, **no** un asset
  de EPICALCOS ni de la marca personal).
- JSON-LD en un `@graph`: `Person`, `ProfessionalService` (con
  `hasOfferCatalog` de los 8 componentes y la oferta real de USD 990),
  `BreadcrumbList` y `FAQPage`.
- **El `FAQPage` del JSON-LD y el FAQ del HTML tienen que decir lo mismo.**
  Si se edita una pregunta o una respuesta, editar las dos.

---

## 9. Accesibilidad

- Skip link, foco visible en todo elemento interactivo.
- Contraste AA verificado sobre los dos fondos (crema y gris).
- FAQ con `<details>`/`<summary>` nativo.
- Menú mobile: `aria-expanded`, `aria-controls` y cierre con `Escape`.
- Targets táctiles de 24px o más (44px en los controles principales).
- `prefers-reduced-motion: reduce` apaga marquee, chips flotantes,
  reveals, el subrayado del H1 y la animación de los counters.

---

## 10. Performance

- Sin webfonts: la tipografía es Helvetica del sistema.
- CSS y JS externos, cacheados como `immutable` (ver `_headers`).
- `?v=__BUST__` lo reemplaza `bust.py` en cada build de Netlify.
  Desde ahora `bust.py` recorre también las subcarpetas: antes solo
  procesaba la raíz y las páginas de `/epibrands/`, `/servicios/`, `/blog/`
  y `/portfolio/` se publicaban con el placeholder literal.
- Imágenes con `width`, `height`, `srcset`, `loading="lazy"` y
  `decoding="async"`.

---

## 11. WhatsApp

Número: `5493416397137`. Aparece en el panel de diagnóstico, en el CTA
final y en el footer, siempre como acción secundaria del CTA principal.
El mensaje precargado va en el `?text=` de cada link.

---

## 12. Checklist para editar la landing

- [ ] ¿La cifra que estoy por publicar existe en la home o en el portfolio?
- [ ] Si toqué el FAQ, ¿actualicé también el JSON-LD del `<head>`?
- [ ] Si ocupé un cupo, ¿subí `data-cupos-tomados` en los tres bloques?
- [ ] Si agregué un CTA, ¿le puse `data-cta` y `data-cta-location`?
- [ ] Si agregué un counter, ¿el HTML tiene el valor final, no un `0`?
- [ ] `./deploy.sh "descripción del cambio"` desde la raíz del repo.

---

## 13. `/epibrands/` (MVP anterior)

La landing vieja sigue publicada en `/epibrands/`. Usa `styles.css`,
`script.js` y un contenedor de GTM sin configurar (`GTM-XXXXXXX`). No
comparte código con `/epibrands/studio`. Si en algún momento se decide
retirarla, conviene dejar un redirect a `/epibrands/studio` en
`_redirects`.
