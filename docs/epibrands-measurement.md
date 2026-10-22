# EPIBRANDS Studio — medición de conversión

> Este archivo NO se publica: `_redirects` devuelve 404 para `/docs/*`.

## Qué carga hoy la página

| Sistema | En `/epibrands/studio` | Notas |
| --- | --- | --- |
| Meta Pixel + CAPI (`meta-pixel.js`, pixel `1460516722431287`, function `meta-capi`) | Sí | PageView automático, Contact en clicks a WhatsApp. |
| Google Tag Manager (`gtm.js`, `GTM-WF2DG4B7`) | **Sí** (desde el 22/10/2026, también en `gracias.html`) | Mismo contenedor que el resto del sitio, por decisión de Mariano. |
| GA4 | Vía GTM (`G-5YP65LHQXB`, con server-side GTM) | Una etiqueta GA4 Event manda todos los eventos del dataLayer con su nombre. |
| Microsoft Clarity | No | |
| Banner de consentimiento | No existe en el sitio | No se agregó ningún tracker nuevo. |

## Eventos

Los eventos se empujan a `window.dataLayer`. Desde el 22/10/2026 la página carga GTM. El contenedor tiene una etiqueta GA4 Event que manda **todos** los eventos del dataLayer con su nombre, así que los de esta tabla llegan a GA4 sin configurar nada más.

> **No usar `generate_lead`.** El contenedor también tiene una etiqueta de Meta Pixel (+ CAPI por el server-side de GTM) que traduce los eventos GA4 a eventos de Meta: `generate_lead` → `Lead`, `gtm.dom`/`page_view` → `PageView`, `purchase` → `Purchase`, etc. Como `meta-pixel.js` ya manda su propio `Lead`, con otro `event_id`, Meta contaría cada solicitud dos veces. Por eso el lead de EPIBRANDS usa `lead_captured`, igual que las descargas del sitio.

| Evento | Cuándo | Parámetros | Dónde se genera |
| --- | --- | --- | --- |
| `cta_click` | Click en un CTA "Solicitar una llamada" (header, hero, precio, footer) | `cta_location`, `cta_label`, `page_path` | `studio.js` |
| `lead_form_start` | Primer input real en el formulario (una vez por visita) | `form_name`, `page_path` | `studio.js` |
| `lead_form_error` | Validación fallida o error de envío | `error_type` (`validacion`, `servidor_<código>`, `red`), `error_field` (nombres de campo, solo en validación), `form_name` | `studio.js` |
| `lead_captured` | Netlify aceptó la solicitud (se consume una vez en gracias.html) | `form_name`, `lead_source` (último CTA o `directo`), `page_path` | `gracias.html` |
| `whatsapp_click` | Click en un link a WhatsApp | `link_location` (`aplicar`, `error-formulario`), `page_path` | `studio.js` |

Nunca se envían nombre, email, teléfono, texto libre, URLs ingresadas ni el mensaje del servidor.

### Meta (sin cambios de pixel ni de function)

- `PageView`: automático.
- `Contact`: click en WhatsApp (lo registra `meta-pixel.js` en todo el sitio).
- `Lead`: gracias.html, **solo** tras un envío confirmado (marca `epi_lead_ok` en `sessionStorage`, que se consume una vez).

**Cambios respecto de la versión anterior (impactan los números de Meta):**
1. El click en WhatsApp ya no dispara `Lead` (un click no es una conversación iniciada). Sigue registrándose como `Contact`.
2. Las visitas directas o recargas de gracias.html ya no cuentan como `Lead`.

Si alguna campaña optimiza por `Lead`, el volumen va a bajar: a partir de ahora solo cuenta solicitudes reales. Revisar las conversiones personalizadas y los objetivos de las campañas.

## GA4 vía GTM (activado el 22/10/2026)

> **Medido el 22/10/2026** (Deploy Preview de la PR #7 y la home en producción). El contenedor `GTM-WF2DG4B7` tiene su propia etiqueta de Meta Pixel con el mismo píxel (`1460516722431287`). Resultado:
> - `PageView` llega **dos veces** a Meta en todas las páginas del sitio (una de `meta-pixel.js` y otra de GTM, con `event_id` distintos, así que Meta no las deduplica). Pasa en producción desde antes de este cambio.
> - `Lead` no se duplica en EPIBRANDS porque gracias.html usa `lead_captured` (ver arriba).
> - Arreglo pendiente, a decidir: que un solo sistema mande los eventos estándar de Meta. Ver «Pendiente» al final.

Pasos originales:

1. Agregar `<script src="/gtm.js?v=__BUST__" defer></script>` en `epibrands/studio.html` y `epibrands/gracias.html` (la CSP ya permite GTM y GA).
2. Antes, revisar que el contenedor no dispare otro Meta Pixel: duplicaría `PageView` y `Lead`.
3. En GTM: un trigger de Evento personalizado por cada evento de la tabla y una etiqueta GA4 Event con esos parámetros (variables de capa de datos).
4. En GA4: marcar `lead_captured` como evento clave (filtrable por `form_name`). Si "Medición mejorada → Interacciones con formularios" está activa, desactivarla o no usar `form_start`/`form_submit`: se duplicarían con `lead_form_start`/`lead_captured`.

## Embudo

visita → `lead_form_start` → `lead_captured` (solicitud aceptada) → solicitud calificada → llamada realizada → cliente

Las tres últimas etapas no se pueden medir desde el frontend. Necesitan un registro comercial (CRM o planilla a partir del export de Netlify Forms) con el estado de cada solicitud.

## Rendimiento

No se midieron Core Web Vitals. Datos de laboratorio de este cambio:
- HTML: 106 KB → 71 KB. `studio.js`: 13 KB → 17 KB (sin dependencias).
- El hero no espera JS ni animaciones para mostrarse (antes el subtítulo y los CTA arrancaban en `opacity:0`). Se eliminaron la marquesina y las animaciones continuas.
- Foto de Mariano: WebP 480/900 px con `srcset`, `width`/`height` y `lazy` (está lejos del primer viewport).

## Pendiente: PageView duplicado en Meta (todo el sitio)

En todas las páginas conviven dos emisores del mismo píxel: `meta-pixel.js` (Pixel + function `meta-capi`, dedup por `event_id` propio) y la etiqueta de Meta Pixel de GTM (+ CAPI por el server-side). Cada uno manda su `PageView` con su propio `event_id`, así que Meta cuenta dos. Opciones:

1. **En GTM, que la etiqueta de Meta Pixel no mande eventos estándar que ya cubre `meta-pixel.js`** (`PageView`, `Lead`, `Contact`): excepción en el trigger o tabla de mapeo sin esas filas. No toca el código del sitio. Recomendada.
2. Sacar `meta-pixel.js` del sitio y dejar todo en GTM + server-side. Más prolijo a largo plazo, pero hay que migrar `mcTrack` (Lead, Contact, descargas) a eventos del dataLayer y validar la deduplicación en Events Manager.
