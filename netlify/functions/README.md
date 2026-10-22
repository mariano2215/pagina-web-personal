# Meta Conversions API — setup en Netlify

## 1. Variables de entorno

En Netlify: **Site settings → Environment variables → Add a variable**

| Key | Value | Scopes | Secret |
|-----|-------|--------|--------|
| `META_PIXEL_ID` | `1460516722431287` | All | No |
| `META_CAPI_ACCESS_TOKEN` | (token generado en Business Manager) | Functions | **Sí** |
| `META_TEST_EVENT_CODE` | (opcional, ej. `TEST12345`) | Functions | No |

Importante:
- Marcar `META_CAPI_ACCESS_TOKEN` como **Secret value** — Netlify lo enmascara en logs/UI.
- Scope mínimo: **Functions** (no hace falta en build).
- Después de agregar las vars, **redeploy** el último deploy para que las tome.

## 2. Generar el token

Business Manager → Administrador de eventos → Dataset/Pixel `1460516722431287`
→ **Settings → API de conversiones → Generar token de acceso**
→ Elegir "Configurar con Dataset Quality API" (recomendado)
→ Copiar el token y pegarlo en Netlify como `META_CAPI_ACCESS_TOKEN`.

⚠️ Meta NO guarda el token. Si lo perdés, generá otro y actualizá la env var.

## 3. Verificar que funciona

### A) Test events en Business Manager
1. En Admin de eventos → pestaña **Probar eventos**.
2. Copiar el `Test Event Code` que aparece (ej. `TEST12345`).
3. Setear `META_TEST_EVENT_CODE=TEST12345` en Netlify y redeployar.
4. Navegar el sitio → ver que llegan eventos en la pestaña en tiempo real.
5. Cuando termines: **borrar la env var** `META_TEST_EVENT_CODE` para que los eventos vayan a producción normal.

### B) Calidad de eventos
En Admin de eventos → **Diagnóstico** y **Calidad de coincidencia de eventos**:
- Deduplication: cada evento se manda por Pixel y CAPI con el mismo `event_id`. Meta debe reportar "Eventos deduplicados" > 0.
- EMQ (Event Match Quality): cuanto más alto, mejor. El form Contact manda email/phone/nombre hasheados → debería levantar el score.

## 4. Eventos configurados

| Página | Evento | Notas |
|--------|--------|-------|
| Todas las páginas | `PageView` | Automático al cargar (`meta-pixel.js`) |
| `/quien-soy.html` | `ViewContent` | content_name=`quien-soy` |
| `/servicios/*` | `ViewContent` | content_name por servicio |
| `/newsletter.html`, `/contenido.html`, `/recursos.html` | `ViewContent` | |
| `/recursos/<recurso>.html` | `ViewContent` | category=`lead-magnet` |
| `/gracias.html` | `Lead` | tras submit del form de contacto |
| `/gracias/<recurso>.html` | `Lead` | tras descarga de lead magnet |
| `#contactForm` (submit) | `Contact` | manda email/phone/nombre hasheados |

## 5. Tocar la function localmente (opcional)

```bash
npm install -g netlify-cli
netlify dev
```

`netlify dev` ejecuta las Functions localmente. El `python3 -m http.server` que usás para preview rápido no ejecuta Functions (verás 501 en `POST /.netlify/functions/meta-capi`, lo cual es normal local — en prod va a funcionar).

---

# Leads → CRM Comercial (`submission-created.js`)

Netlify ejecuta `submission-created.js` sola con cada envío válido de **Netlify Forms** (el nombre del archivo es el evento; no se configura nada en el panel). Reenvía el lead a n8n (EPIGROUP WF20), que lo carga o actualiza en la base **CRM Comercial** de Notion sin duplicar.

| Key | Value | Scopes | Secret |
|-----|-------|--------|--------|
| `EPIGROUP_LEADS_WEBHOOK_SECRET` | la clave del webhook (la misma que la credencial «EPIGROUP Leads · webhook» de n8n) | Functions | **Sí** |
| `EPIGROUP_LEADS_WEBHOOK_URL` | opcional; por defecto `https://marianocalandra.app.n8n.cloud/webhook/epigroup-leads` | Functions | No |

- Sin `EPIGROUP_LEADS_WEBHOOK_SECRET` la función no reenvía nada: el lead queda solo en Netlify Forms.
- Formularios que van al CRM: `contacto`, `consultoria`, los tres `lead-*` y `epibrands-studio` / `epibrands-diagnostico`. Las newsletters no se reenvían.
- No manda IP, navegador ni el campo antispam. En los logs solo aparece el nombre del formulario.
- Si n8n o Notion fallan, el envío sigue en Netlify Forms y el error se ve en las ejecuciones de WF20.
- Después de cargar la variable, **redeploy** para que la tome.
