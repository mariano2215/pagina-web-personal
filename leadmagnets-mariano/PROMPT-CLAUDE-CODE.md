# Prompt para Claude Code

Pegá este prompt directamente en Claude Code dentro del repo de `marianocalandra.com`. Asegurate de tener los 8 archivos del paquete (los 6 HTML + el `netlify.toml` + este README) accesibles para copiarlos.

---

## PROMPT

```
Estoy trabajando en el sitio marianocalandra.com (HTML estático, hosteado en Netlify, GTM-WF2DG4B7 ya instalado, CSS en /styles.css).

Necesito implementar un sistema de lead magnets que reemplace las descargas directas de PDF actuales por landings de captura con formulario corto en Netlify Forms.

TAREAS A EJECUTAR EN ORDEN:

1) Crear la carpeta /recursos/ con estos 3 archivos (te los voy a pasar a continuación):
   - /recursos/auditoria-marketing-express.html
   - /recursos/manual-gtm-ga4.html
   - /recursos/guia-paid-media.html

2) Crear la carpeta /gracias/ con estos 3 archivos:
   - /gracias/auditoria-marketing-express.html
   - /gracias/manual-gtm-ga4.html
   - /gracias/guia-paid-media.html

3) Crear /netlify.toml en la raíz del proyecto si no existe. Si ya existe, mergear los headers y redirects de mi archivo sin pisar la configuración existente.

4) Modificar /index.html: reemplazar los 3 enlaces directos a PDFs por enlaces a las nuevas landings. Buscar y reemplazar EXACTAMENTE:

   ANTES:
     href="descargables/auditoria_consultoria_marketing_express_campanas_mc.pdf"
   DESPUÉS:
     href="/recursos/auditoria-marketing-express.html"

   ANTES:
     href="descargables/manual_gtm_ga4_mc_descarga_gratis.pdf"
   DESPUÉS:
     href="/recursos/manual-gtm-ga4.html"

   ANTES:
     href="descargables/guia_inicial_paid_media_mc_descarga_gratis.pdf"
   DESPUÉS:
     href="/recursos/guia-paid-media.html"

   Hay que cambiar TODAS las ocurrencias (puede haber más de una por cada PDF si hay menú o footer). Sacame los enlaces directos a los PDFs de todo el index.

5) Verificar que estos 3 archivos PDF existan en /descargables/ del repo:
   - auditoria_consultoria_marketing_express_campanas_mc.pdf
   - manual_gtm_ga4_mc_descarga_gratis.pdf
   - guia_inicial_paid_media_mc_descarga_gratis.pdf

   Si faltan, avisame.

6) Validar la sintaxis HTML de los 6 archivos nuevos y confirmarme que los 3 forms tienen los atributos necesarios para Netlify Forms:
   - data-netlify="true"
   - data-netlify-honeypot="bot-field"
   - input hidden name="form-name" con el valor del name del form
   - method="POST"
   - action apuntando a la /gracias/ correspondiente

7) Hacer commit con un mensaje claro tipo:
   "feat: sistema de lead magnets con captura de email via Netlify Forms"

DESPUÉS DEL DEPLOY (esto lo voy a hacer yo manualmente en el panel de Netlify, pero recordame los pasos en tu respuesta final):

a) Verificar en Site settings → Forms que aparezcan los 3 forms:
   - lead-auditoria-marketing-express
   - lead-manual-gtm-ga4
   - lead-guia-paid-media

b) Configurar email notifications para cada form a mariano.calandra7@gmail.com.

c) Hacer un test E2E de cada uno de los 3 flujos.

d) En GTM (GTM-WF2DG4B7) crear el trigger "Custom Event: lead_captured" y el tag GA4 "generate_lead" que lo dispara.

Confirmame paso por paso lo que vas haciendo. Si encontrás algún conflicto con archivos existentes, pará y preguntame antes de pisar nada.
```

---

## Cómo pasar los archivos a Claude Code

Tenés dos opciones:

**Opción A (más simple):** Después de pegar el prompt, arrastrá los 7 archivos del paquete (los 6 HTML + el netlify.toml) al chat de Claude Code uno por uno cuando te los pida.

**Opción B (todo de una):** Descomprimí el paquete dentro del repo local antes de abrir Claude Code, y en el prompt agregá:

> "Los archivos ya están en una carpeta `/leadmagnets-paquete/` en la raíz del repo. Tomalos de ahí y movelos a las rutas correctas."

---

## Verificación post-deploy (checklist)

- [ ] Las 3 landings se ven correctamente en mobile y desktop.
- [ ] Los 3 forms aparecen en Netlify → Forms.
- [ ] Submission de prueba aparece en el panel.
- [ ] Email de notificación llegó al admin.
- [ ] Redirect a /gracias/ funciona correctamente.
- [ ] El PDF se descarga automáticamente desde la página de gracias.
- [ ] El evento `lead_captured` aparece en GTM Preview.
- [ ] El evento `generate_lead` aparece en GA4 Realtime.
- [ ] Los links del index.html ya no van directo al PDF (todos pasan por /recursos/).
