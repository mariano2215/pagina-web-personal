# EPIBRANDS Studio — medición de conversión

> Este archivo NO se publica: `_redirects` devuelve 404 para `/docs/*`.

## Qué carga hoy la página

| Sistema | En `/epibrands/studio` | Notas |
| --- | --- | --- |
| Meta Pixel + CAPI (`meta-pixel.js`, pixel `1460516722431287`, function `meta-capi`) | Sí | PageView automático, Contact en clicks a WhatsApp. |
| Google Tag Manager (`gtm.js`, `GTM-WF2DG4B7`) | **No** | Se usa en otras páginas del sitio. |
| GA4 | **No** (llegaría vía GTM) | |
| Microsoft Clarity | No | |
| Banner de consentimiento | No existe en el sitio | No se agregó ningún tracker nuevo. |

## Eventos

Los eventos se empujan a `window.dataLayer` con la convención GA4. **Hoy no llegan a ninguna herramienta** porque esta página no carga GTM: quedan listos para conectar.

| Evento | Cuándo | Parámetros | Dónde se genera |
| --- | --- | --- | --- |
| `cta_click` | Click en un CTA "Solicitar una llamada" (header, hero, precio, footer) | `cta_location`, `cta_label`, `page_path` | `studio.js` |
| `lead_form_start` | Primer input real en el formulario (una vez por visita) | `form_name`, `page_path` | `studio.js` |
| `lead_form_error` | Validación fallida o error de envío | `error_type` (`validacion`, `servidor_<código>`, `red`), `error_field` (nombres de campo, solo en validación), `form_name` | `studio.js` |
| `generate_lead` | Netlify aceptó la solicitud (se consume una vez en gracias.html) | `form_name`, `lead_source` (último CTA o `directo`), `page_path` | `gracias.html` |
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

## Para activar GA4 (pendiente, decisión de Mariano)

1. Agregar `<script src="/gtm.js?v=__BUST__" defer></script>` en `epibrands/studio.html` y `epibrands/gracias.html` (la CSP ya permite GTM y GA).
2. Antes, revisar que el contenedor no dispare otro Meta Pixel: duplicaría `PageView` y `Lead`.
3. En GTM: un trigger de Evento personalizado por cada evento de la tabla y una etiqueta GA4 Event con esos parámetros (variables de capa de datos).
4. En GA4: marcar `generate_lead` como evento clave. Si "Medición mejorada → Interacciones con formularios" está activa, desactivarla o no usar `form_start`/`form_submit`: se duplicarían con `lead_form_start`/`generate_lead`.

## Embudo

visita → `lead_form_start` → `generate_lead` (solicitud aceptada) → solicitud calificada → llamada realizada → cliente

Las tres últimas etapas no se pueden medir desde el frontend. Necesitan un registro comercial (CRM o planilla a partir del export de Netlify Forms) con el estado de cada solicitud.

## Rendimiento

No se midieron Core Web Vitals. Datos de laboratorio de este cambio:
- HTML: 106 KB → 71 KB. `studio.js`: 13 KB → 17 KB (sin dependencias).
- El hero no espera JS ni animaciones para mostrarse (antes el subtítulo y los CTA arrancaban en `opacity:0`). Se eliminaron la marquesina y las animaciones continuas.
- Foto de Mariano: WebP 480/900 px con `srcset`, `width`/`height` y `lazy` (está lejos del primer viewport).
