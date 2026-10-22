# EPIBRANDS Marketing Studio — Landing

Landing comercial de **EPIBRANDS Marketing Studio**, la consultora de crecimiento de Mariano Calandra. MVP estático (HTML + CSS + JS vanilla) listo para publicar sobre la infraestructura existente (Netlify).

Ruta sugerida en producción: `https://marianocalandra.com/epibrands/`

---

## 1. Estructura

```
epibrands/
├── index.html
├── styles.css
├── script.js
├── README.md
├── apps-script/
│   └── google-sheets-leads.gs
└── assets/
    ├── logo-epibrands.svg
    ├── mariano-calandra.webp   (PENDIENTE: foto profesional)
    └── og-epibrands.jpg        (PENDIENTE: imagen Open Graph)
```

## 2. Abrir localmente

Es un sitio estático. Cualquier servidor sirve:

```bash
cd epibrands
python3 -m http.server 4321
# abrir http://localhost:4321
```

O usar Live Server / cualquier preview.

## 3. Reemplazos obligatorios antes de publicar

| Elemento | Dónde | Estado |
|---|---|---|
| Foto profesional de Mariano | `assets/mariano-calandra.webp` + reemplazar `.photo-placeholder` en `index.html` | Pendiente |
| Imagen Open Graph (1200×630) | `assets/og-epibrands.jpg` | Pendiente |
| Logo definitivo | `assets/logo-epibrands.svg` | Placeholder textual |
| Instagram URL | `index.html` → buscar `aria-label="Instagram (configurar)"` | Pendiente |
| LinkedIn URL | `index.html` → buscar `aria-label="LinkedIn (configurar)"` | Pendiente |
| Política de privacidad | `index.html` → último link del footer | Pendiente |
| ID de GTM | `index.html` → reemplazar `GTM-XXXXXXX` (aparece 2 veces). Mientras sea el ID de ejemplo, GTM no se carga. | Pendiente |
| Guardado de solicitudes | Netlify Forms (`epibrands-diagnostico`) → CRM Comercial de Notion (`netlify/functions/submission-created.js`) | Hecho (22/10/2026) |

## 4. Modificar precios y textos

- **Precios**: `index.html` → secciones `<article class="plan">` y tabla `<table class="tabla-planes">`.
- **Copy**: el copy fue aprobado según `Brief_Claude_Code_Landing_EPIBRANDS.md`. Modificar solo con visado comercial.
- **FAQ**: `<section id="faq">`, cada `<details class="faq-item">`.
- **Casos / resultados**: `<section class="resultados">`. **No publicar cifras sin validar contra el portfolio fuente.**

## 5. WhatsApp

Configurado en `script.js`:

```js
var WHATSAPP_NUMBER = "5493416397137";  // +54 9 341 639 7137
```

Cambiarlo ahí y en el link directo del footer (`href="https://wa.me/..."`).

El mensaje precargado vive en `script.js` → `buildWhatsAppMessage()`.

## 6. Dónde quedan las solicitudes

Desde el 22/10/2026 el formulario de diagnóstico es un formulario de **Netlify Forms** (`epibrands-diagnostico`):

1. `script.js` lo envía a Netlify con `fetch` (`keepalive`) y, sin esperar la respuesta, abre WhatsApp con el mensaje precargado, igual que antes.
2. Netlify guarda la solicitud (panel de Netlify → Forms → `epibrands-diagnostico`) y manda las notificaciones que tengas configuradas.
3. La función `netlify/functions/submission-created.js` la reenvía a n8n (EPIGROUP WF20), que la carga o actualiza en la base **CRM Comercial** de Notion con marca EPIBRANDS, sin duplicar.

Los campos ocultos (`utm_*`, `pagina`) tienen que existir en el HTML del formulario: Netlify solo guarda los campos que ve al publicar.

> Antes del 22/10 el envío iba a Google Sheets, pero el endpoint nunca se configuró: las solicitudes solo llegaban si la persona mandaba el WhatsApp. `apps-script/google-sheets-leads.gs` queda como referencia y ya no se usa.

> **No se envía PII** (nombre, email, teléfono, mensaje) al `dataLayer`. Solo dimensiones agregables.

## 8. UTMs

La landing captura automáticamente `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` de la URL y los envía con el formulario (Netlify Forms y CRM), no al `dataLayer`. Con `utm_source` de Meta y `utm_medium` pago (`cpc`, `paid`, `paid_social`…), el CRM marca el origen como «Meta Ads».

## 9. Cómo probar el formulario

1. Publicar (Netlify Forms solo funciona en el sitio publicado o en un Deploy Preview).
2. Llenar el formulario con datos de prueba (ej.: `Empresa: PRUEBA`).
3. Submit → debería abrirse WhatsApp con el mensaje precargado.
4. Verificar el envío en Netlify → Forms → `epibrands-diagnostico` y el registro en Notion → CRM Comercial (marca EPIBRANDS).
5. Archivar el registro de prueba en Notion.

## 10. Validar GTM

- Activar **Preview / Tag Assistant** en GTM.
- Recorrer la landing y disparar cada CTA / form_start / submit.
- Confirmar los eventos descritos arriba en el panel `Variables → Data Layer`.

## 11. Limitaciones

- Si Netlify Forms falla, la solicitud igual llega por WhatsApp si la persona lo envía (respaldo operativo).
- Si n8n o Notion fallan, la solicitud queda guardada en Netlify Forms; el error se ve en las ejecuciones de WF20 en n8n.

## 12. Accesibilidad y performance

- HTML semántico.
- Navegación por teclado, `:focus-visible` claro.
- FAQ con `<details>` nativo (accesible).
- Sin librerías externas (solo Google Fonts).
- Mobile-first, breakpoints en 640 / 768 / 900 / 1024 px.
- Respeta `prefers-reduced-motion`.

## 13. Tipografías

Pensadas para **Futura** y **Aileron**. Como aún no se entregan archivos licenciados, el fallback efectivo es **Inter**. Cuando estén los archivos:

1. Colocarlos en `assets/fonts/`.
2. Agregar `@font-face` en `styles.css`.
3. Las variables `--font-display` y `--font-body` ya los usan en primer lugar.

## 14. Checklist final de publicación

- [ ] Reemplazado `GTM-XXXXXXX` por el ID real.
- [x] Formulario guardado en Netlify Forms y reenviado al CRM (22/10/2026).
- [ ] Verificadas las cifras de los 4 casos contra el portfolio.
- [ ] Reemplazada la foto de Mariano.
- [ ] Subida `og-epibrands.jpg` (1200×630).
- [ ] Completados links de Instagram y LinkedIn.
- [ ] Subida la política de privacidad.
- [ ] Probado el form en mobile y desktop.
- [ ] Validados eventos en Tag Assistant.
