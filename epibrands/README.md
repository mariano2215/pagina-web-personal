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
| ID de GTM | `index.html` → reemplazar `GTM-XXXXXXX` (aparece 2 veces) | Pendiente |
| Endpoint Google Sheets | `script.js` → `SHEETS_ENDPOINT = ""` | Pendiente |

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

## 6. Google Sheets (CRM inicial)

### 6.1 Crear la hoja

1. Crear un Google Sheet nuevo (cuenta del titular del negocio).
2. Crear una pestaña llamada **`Leads EPIBRANDS`** (el Apps Script la crea automáticamente si no existe, pero conviene tenerla a mano).

### 6.2 Pegar y publicar Apps Script

1. Extensiones → Apps Script.
2. Reemplazar el contenido por `apps-script/google-sheets-leads.gs`.
3. Guardar.
4. **Deploy → New deployment**
   - Type: **Web app**
   - Description: `EPIBRANDS leads`
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copiar la **Web app URL**.

### 6.3 Configurar el endpoint en el front

En `script.js`:

```js
var SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbXXXX/exec";
```

Listo: cada envío del formulario se guarda como fila en la hoja.

### 6.4 Columnas de la hoja

`Fecha | Nombre | Empresa | Email | WhatsApp | País | Tipo de negocio | Plan de interés | Necesidad | Presupuesto | Inicio | Situación | Fuente | UTM Source | UTM Medium | UTM Campaign | UTM Content | UTM Term | Estado | Observaciones`

La columna **Estado** queda con validación de datos: Nuevo / Contactado / Diagnóstico agendado / Propuesta enviada / Seguimiento / Ganado / Perdido / No califica.

## 7. Google Tag Manager

### 7.1 Instalar el contenedor

En `index.html` aparece `GTM-XXXXXXX` en dos lugares (script y noscript). Reemplazar por el ID real del contenedor.

### 7.2 Eventos `dataLayer` que dispara la landing

| Evento | Cuándo | Parámetros |
|---|---|---|
| `diagnostico_cta_click` | Click en CTA hero / header / resultados / sticky mobile | `cta_location` |
| `plan_cta_click` | Click en CTA de plan (Standard / Essential / Premium) | `plan_name`, `cta_location` |
| `diagnostico_form_start` | Primer foco en cualquier campo del form | `form_name` |
| `generate_lead` | Submit válido del formulario | `form_name`, `plan_interest`, `business_type` |
| `whatsapp_click` | Apertura de WhatsApp desde el form o footer | `cta_location`, `plan_interest` |
| `faq_open` | Apertura de un item del FAQ | `faq_question` |

> **No se envía PII** (nombre, email, teléfono, mensaje) al `dataLayer`. Solo dimensiones agregables.

## 8. UTMs

La landing captura automáticamente `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` de la URL y los guarda **solo en Google Sheets**, no en `dataLayer`.

## 9. Cómo probar el formulario

1. Configurar `SHEETS_ENDPOINT` en `script.js`.
2. Servir localmente o publicar.
3. Llenar el formulario con datos de prueba (ej.: `Empresa: TEST`).
4. Submit → debería abrirse WhatsApp con el mensaje precargado.
5. Verificar la nueva fila en la pestaña `Leads EPIBRANDS`.

## 10. Validar GTM

- Activar **Preview / Tag Assistant** en GTM.
- Recorrer la landing y disparar cada CTA / form_start / submit.
- Confirmar los eventos descritos arriba en el panel `Variables → Data Layer`.

## 11. Limitaciones del MVP

- El `fetch(..., { mode: "no-cors" })` impide leer la respuesta del Apps Script. El lead se guarda pero el navegador no confirma el éxito explícitamente. WhatsApp queda como respaldo operativo de cada lead.
- Para confirmación robusta + reintentos + CRM real, conviene migrar a:
  - una function serverless (Netlify Functions, Cloudflare Workers) que reciba el POST y lo proxyee al Sheets API o a un CRM (HubSpot, Pipedrive, Notion), o
  - un endpoint propio en el dominio (`/api/lead`) con CORS configurado.

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
- [ ] Configurado `SHEETS_ENDPOINT` en `script.js`.
- [ ] Verificadas las cifras de los 4 casos contra el portfolio.
- [ ] Reemplazada la foto de Mariano.
- [ ] Subida `og-epibrands.jpg` (1200×630).
- [ ] Completados links de Instagram y LinkedIn.
- [ ] Subida la política de privacidad.
- [ ] Probado el form en mobile y desktop.
- [ ] Validados eventos en Tag Assistant.
