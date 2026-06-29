# Instrucciones para Claude Code — marianocalandra.com

## Qué es esto

Sitio personal de Mariano Calandra (estratega comercial / paid media) + ecosistema EPIGROUP:
landing de EPIBRANDS, lead magnets con descarga gratuita y productos digitales pagos
(ebooks/PDFs) con checkout de Mercado Pago. Sitio estático (HTML/CSS/JS, sin build de
framework), con Netlify Functions para todo lo que necesita server-side (pagos, tracking).

## Stack
- HTML/CSS/JS estático, sin framework ni bundler de JS — se edita directo.
- Build de Netlify: corre `python3 bust.py` antes de publicar (ver abajo, "Cache busting").
- Netlify Functions (`netlify/functions/`) para Meta Conversions API y checkout de Mercado Pago.
- Hosting: Netlify (auto-deploy desde GitHub)
- Dominio: marianocalandra.com (DNS en Hostinger)
- Repositorio: GitHub → rama `main`

## Workflow de cambios

Después de CUALQUIER cambio que hagas, ejecutá:

```bash
./deploy.sh "descripción breve del cambio"
```

Ejemplos:
```bash
./deploy.sh "actualizar hero section con nuevo copy"
./deploy.sh "agregar sección servicios"
./deploy.sh "fix: corregir link del formulario"
./deploy.sh "update email de contacto"
```

Si no pasás descripción, se usa la fecha/hora automáticamente.

## Qué hace el deploy.sh
1. `git add -A` → stagea todos los cambios
2. `git commit -m "mensaje"` → commitea
3. Hook post-commit → pushea a GitHub automáticamente
4. Netlify detecta el push → deploya en ~60 segundos

## Ver estado del deploy
- Panel Netlify: https://app.netlify.com
- El sitio tarda ~60 segundos en actualizarse después del push

## Estructura del proyecto

```
pagina-web-personal/
├── index.html, quien-soy.html, newsletter.html, recursos.html, contenido.html, gracias.html
├── styles.css          ← estilos globales, variables CSS (ver abajo)
├── app.js              ← JS principal: nav, contadores animados, hover, etc.
├── gtm.js               ← Google Tag Manager (container GTM-WF2DG4B7)
├── meta-pixel.js        ← Meta Pixel + dispara eventos a la function de CAPI
├── clarity.js           ← Microsoft Clarity
├── bust.py              ← script de build: reemplaza __BUST__ por timestamp (cache busting)
├── deploy.sh            ← commit + push (ver "Workflow de cambios" arriba)
├── netlify.toml         ← build command, Functions, redirects de protección de PDFs
├── _headers, _redirects
│
├── servicios/                       páginas de servicios
│   └── marketing-digital/           sub-servicios (landing, SEO, email, content, etc.)
├── blog/                            posts del blog
├── recursos/ + gracias/             lead magnets gratuitos (auditoría, GTM+GA4, paid media)
├── descargables/                    PDFs de los lead magnets gratuitos
├── contenido/ + contenido.html      productos digitales PAGOS (ebooks, packs de prompts)
│   └── gracias-<producto>.html      página post-pago con botón de descarga
├── leadmagnets-mariano/             docs de implementación de lead magnets (no es código del sitio)
├── epibrands/                       sub-sitio EPIBRANDS (landing + studio), self-contained
├── anuncios-meta/                   generador de creativos para Meta Ads (gen_ads.py)
├── img/                             imágenes, logos, avatares
└── netlify/functions/
    ├── meta-capi.js                 ← Meta Conversions API (server-side)
    ├── crear-preferencia.js         ← crea checkout de Mercado Pago
    ├── webhook-mp.js                ← confirmación server-to-server de pago
    └── descargar.js                 ← valida pago y entrega el PDF pago (ver abajo)
```

## Convenciones de CSS

Variables en `:root` (`styles.css`), **no usar colores hardcodeados** en componentes nuevos:

```css
--bg-primary: #242424;
--bg-secondary: #111111;
--accent: #35d4ae;          /* verde menta — color de marca */
--accent-soft: rgba(53, 212, 174, 0.08);
--accent-border: rgba(53, 212, 174, 0.35);
--text-white: #FFFFFF;
--text-gray: #CFCFCF;
--text-muted: #8a8a8a;
--radius-card: 24px;
--radius-pill: 999px;
```

Tipografías: `Montserrat` (headings, 700-900) + `Poppins` (body, 400-600), vía Google Fonts.

## Cache busting (importante al editar HTML/CSS/JS)

Los `<script src="...">` y `<link href="...">` en los HTML usan `?v=__BUST__` (ej.
`gtm.js?v=__BUST__`, `styles.css?v=__BUST__`). Netlify corre `bust.py` en el build
(`netlify.toml` → `command = "python3 bust.py"`) y reemplaza `__BUST__` por un timestamp único
en todos los HTML, para que el browser no cachee versiones viejas tras cada deploy. **No
borrar `__BUST__` ni resolverlo a mano** — si agregás un nuevo `<script>` o `<link>` a un
archivo propio del sitio, seguí el mismo patrón `?v=__BUST__`.

## Sistemas críticos — leer antes de tocar

### Meta Conversions API (tracking server-side)
`meta-pixel.js` dispara eventos client-side Y manda el mismo `event_id` a la function
`netlify/functions/meta-capi.js` para deduplicar con Meta (dual-layer tracking). Eventos ya
mapeados: `PageView`, `ViewContent` (por página/servicio), `Lead` (tras lead magnet o form),
`Contact` (submit de `#contactForm`, manda email/phone/nombre hasheados). Variables de
entorno en Netlify: `META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN` (secret), `META_TEST_EVENT_CODE`
(opcional, solo para testear — borrar después). Detalle completo en
`netlify/functions/README.md`.

### Checkout de Mercado Pago + protección de PDFs pagos
Productos pagos (`contenido/*.pdf`: 100 Hooks, +135 Prompts, Paid Media Sin Humo) se compran
vía `crear-preferencia.js` → checkout de MP → `webhook-mp.js` confirma el pago →
`descargar.js` **valida el pago contra la API de Mercado Pago antes de entregar el PDF**
(aprobado, producto correcto, monto correcto, dentro de la ventana de 7 días). Los PDFs
**no se sirven directo**: están empaquetados con las Functions (`included_files` en
`netlify.toml`) y cualquier acceso directo a la URL rebota a la página de detalle. Precios
viven server-side en `crear-preferencia.js` (objeto `PRODUCTOS`), nunca en el cliente. Variable
de entorno: `MP_ACCESS_TOKEN` (secret). Detalle completo en
`netlify/functions/README-mercadopago.md`.

### Protección de PDFs gratuitos (lead magnets)
Los PDFs de `descargables/` (auditoría, manual GTM+GA4, guía paid media) redirigen a su
landing de captura (`/recursos/...`) si el `Referer` no es del propio dominio — así no se
pueden compartir/indexar los links directos. Reglas en `netlify.toml` (`[[redirects]]` con
`force = true`).

## No tocar / tener cuidado
- `.git/`, `node_modules/` (si existe)
- El archivo CLAUDE.md es solo para contexto, no afecta el sitio
- `netlify.toml` — los redirects de protección de PDFs son frágiles (`force = true` es
  obligatorio para que el redirect gane sobre el archivo estático); no reordenar ni borrar sin
  entender el comentario que está arriba de cada bloque.
- Precios de productos pagos: viven en `crear-preferencia.js`, no en el HTML/frontend.
- Variables de entorno (`META_CAPI_ACCESS_TOKEN`, `MP_ACCESS_TOKEN`) — nunca hardcodear, viven
  solo en Netlify (Site settings → Environment variables, marcadas como Secret).

## Comandos útiles
```bash
git log --oneline -10      # Ver últimos 10 commits
git status                 # Ver qué cambió
git diff                   # Ver diferencias antes de commitear
```
