# Sistema de Lead Magnets — marianocalandra.com

**Objetivo:** Reemplazar las descargas directas de PDF por landings de captura con formulario corto en Netlify Forms. Cada recurso queda con su propio embudo independiente (form + página de gracias + tracking).

**Stack:** HTML estático · Netlify Forms · GTM (`GTM-WF2DG4B7`) · CSS existente (`/styles.css`).

---

## 1. Estructura de archivos a deployar

```
marianocalandra.com/
├── index.html                                    ← MODIFICAR (cambiar 3 links de recursos)
├── styles.css                                    ← (ya existe, reusable)
├── netlify.toml                                  ← CREAR
│
├── recursos/                                     ← CREAR carpeta
│   ├── auditoria-marketing-express.html          ← landing #1
│   ├── manual-gtm-ga4.html                       ← landing #2
│   └── guia-paid-media.html                      ← landing #3
│
├── gracias/                                      ← CREAR carpeta
│   ├── auditoria-marketing-express.html          ← thank-you #1
│   ├── manual-gtm-ga4.html                       ← thank-you #2
│   └── guia-paid-media.html                      ← thank-you #3
│
└── descargables/                                 ← (ya existe)
    ├── auditoria_consultoria_marketing_express_campanas_mc.pdf
    ├── manual_gtm_ga4_mc_descarga_gratis.pdf
    └── guia_inicial_paid_media_mc_descarga_gratis.pdf
```

---

## 2. Flujo del lead (de extremo a extremo)

```
[index.html sección Recursos]
   │
   │ click "Descargar gratis →"
   ▼
[/recursos/<slug>.html]
   │
   │  Form Netlify: nombre + email + whatsapp (opcional)
   │  POST a "/" (Netlify intercepta)
   ▼
[Netlify Forms]
   │  ├─ Guarda submission en panel
   │  ├─ Envía notificación por mail al admin
   │  └─ Redirect a la URL del form action
   ▼
[/gracias/<slug>.html]
   │  ├─ Mensaje de confirmación
   │  ├─ Botón de descarga del PDF
   │  ├─ Auto-descarga vía JS (después de 1s)
   │  ├─ Dispara evento GTM: lead_captured
   │  └─ Cross-sell: 2 recursos relacionados + CTA "Hablemos"
```

---

## 3. Tareas concretas para Claude Code

### Tarea 1 — Crear los archivos nuevos

Crear estos 7 archivos en el repo:

| Archivo | Origen |
|---|---|
| `/recursos/auditoria-marketing-express.html` | de este paquete |
| `/recursos/manual-gtm-ga4.html` | de este paquete |
| `/recursos/guia-paid-media.html` | de este paquete |
| `/gracias/auditoria-marketing-express.html` | de este paquete |
| `/gracias/manual-gtm-ga4.html` | de este paquete |
| `/gracias/guia-paid-media.html` | de este paquete |
| `/netlify.toml` | de este paquete |

### Tarea 2 — Modificar `index.html`

Hay que reemplazar los 3 enlaces a PDFs directos por enlaces a las nuevas landings de captura.

**Buscar y reemplazar** estos tres bloques de `href`:

```diff
- href="descargables/auditoria_consultoria_marketing_express_campanas_mc.pdf"
+ href="/recursos/auditoria-marketing-express.html"

- href="descargables/manual_gtm_ga4_mc_descarga_gratis.pdf"
+ href="/recursos/manual-gtm-ga4.html"

- href="descargables/guia_inicial_paid_media_mc_descarga_gratis.pdf"
+ href="/recursos/guia-paid-media.html"
```

Asegurate que ninguno de los tres recursos quede apuntando directo al PDF. El visitante debe pasar SIEMPRE por la landing de captura.

### Tarea 3 — Verificar que los PDFs existan

Estos archivos deben estar accesibles públicamente:

- `https://marianocalandra.com/descargables/auditoria_consultoria_marketing_express_campanas_mc.pdf`
- `https://marianocalandra.com/descargables/manual_gtm_ga4_mc_descarga_gratis.pdf`
- `https://marianocalandra.com/descargables/guia_inicial_paid_media_mc_descarga_gratis.pdf`

Si alguno tiene otro nombre o path, ajustar las thank-you pages correspondientes (el `href` del botón "Descargar" y el `window.location` del auto-download).

### Tarea 4 — Deploy en Netlify

1. Commit y push de los cambios al repo conectado a Netlify.
2. Netlify hace build automáticamente. Como son HTML estáticos, el deploy es inmediato.
3. **Verificar en el panel de Netlify → Forms** que aparezcan los 3 forms nuevos:
   - `lead-auditoria-marketing-express`
   - `lead-manual-gtm-ga4`
   - `lead-guia-paid-media`

   Si no aparecen tras el primer deploy, hacer un cambio mínimo en cada landing y volver a deployar (Netlify a veces los detecta en el segundo build).

### Tarea 5 — Configurar notificaciones de Netlify Forms

En el panel de Netlify → **Site settings → Forms → Form notifications**:

1. Agregar **email notification** a `mariano.calandra7@gmail.com` (o el mail que prefiera Mariano) para cada uno de los 3 forms.
2. Personalizar el asunto del email, por ejemplo:
   - `[Lead Auditoría] {nombre} dejó sus datos`
   - `[Lead GTM/GA4] {nombre} dejó sus datos`
   - `[Lead Paid Media] {nombre} dejó sus datos`

### Tarea 6 — Verificar tracking GTM

Cada thank-you page dispara `dataLayer.push({event:'lead_captured', lead_magnet:'<slug>'})`.

En GTM (`GTM-WF2DG4B7`) hay que:
1. Crear un trigger **Custom Event** con event name = `lead_captured`.
2. Crear una **Data Layer Variable** que lea `lead_magnet`.
3. Crear un tag **GA4 Event** con nombre `generate_lead` y parámetro `lead_magnet`.
4. (Cuando se instale Meta Pixel) crear tag **Meta Pixel Custom Event** = `Lead` con el mismo parámetro.

### Tarea 7 — Test E2E manual

Para cada uno de los 3 recursos:

1. Entrar al sitio en navegación privada.
2. Click en "Descargar gratis →" del recurso.
3. Completar el form con datos reales o de prueba.
4. Verificar que redirige a `/gracias/<slug>.html`.
5. Verificar que se descarga el PDF.
6. Verificar que el submission aparece en Netlify → Forms.
7. Verificar que el mail de notificación llega al admin.
8. Verificar que el evento `lead_captured` aparece en GTM Preview / GA4 Realtime.

---

## 4. Próximos pasos (fuera de esta entrega, pero recomendados)

Una vez funcionando el sistema base, sumar:

1. **Auto-respuesta al lead con el PDF por email**
   Conectar Netlify Forms con Make/Zapier → enviar mail desde Brevo/Mailerlite/ConvertKit con el PDF adjunto.
   Alternativa: trigger un webhook desde Netlify que dispare la secuencia.

2. **Secuencia de nurturing de 5 mails por lead magnet**
   Cada lead recibido entra a una secuencia de email distinta según el recurso descargado:
   - *Auditoría* → 5 mails sobre diagnóstico de marketing → CTA consultoría.
   - *GTM/GA4* → 5 mails sobre medición y data → CTA auditoría técnica.
   - *Paid Media* → 5 mails sobre campañas básicas → CTA gestión de pauta.

3. **Instalar Meta Pixel + CAPI** en el sitio (todavía falta).
   Una vez instalado, las thank-you pages ya envían el evento `Lead` via dataLayer.

4. **Crear audiencias de retargeting** en Meta y Google con los visitantes de `/recursos/*` que no convirtieron.

5. **Reportar conversiones** en un dashboard simple (Looker Studio) cruzando GA4 + Netlify Forms.

---

## 5. Notas técnicas importantes

- **Netlify Forms** detecta forms automáticamente en archivos HTML estáticos al hacer build. No necesita configuración adicional siempre que el form tenga el atributo `data-netlify="true"` y un `name` único.
- El campo `bot-field` (honeypot) ya está incluido en cada landing como anti-spam.
- El form usa `method="POST"` y `action="/gracias/<slug>.html"`. Netlify intercepta el POST, guarda el submission y luego redirige.
- Los inputs `hidden` con `name="origen"` permiten rastrear desde qué recurso vino el lead, útil para los emails y reportes.
- Toda la UI reusa `styles.css` ya existente para mantener consistencia visual. No hay que tocar el CSS principal.
- El attribute `data-i18n` no se incluyó en estos archivos (a diferencia del index) porque las landings de captura no necesitan multi-idioma inicialmente. Si después se quiere agregar, se puede replicar el patrón.
