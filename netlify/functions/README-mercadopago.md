# Checkout de Mercado Pago — setup en Netlify

El botón "Comprar con Mercado Pago" de cada producto premium llama a la
function `crear-preferencia` (server-side). Esa function crea el checkout con
tu Access Token y devuelve el link de pago. Después del pago, Mercado Pago
redirige a la página de descarga (`gracias-<producto>.html`), que tiene el
botón de descarga del PDF + un botón de WhatsApp.

## 1. Variable de entorno (paso obligatorio)

Sin esto, el botón de compra cae automáticamente a comprar por WhatsApp.

En Netlify: **Site settings → Environment variables → Add a variable**

| Key | Value | Scopes | Secret |
|-----|-------|--------|--------|
| `MP_ACCESS_TOKEN` | (Access Token **de producción**) | Functions | **Sí** |

- Marcar como **Secret value** para que Netlify lo enmascare.
- Scope mínimo: **Functions**.
- Después de agregar la var, **redeploy** el último deploy para que la tome.

## 2. De dónde sacar el Access Token

1. Entrar a https://www.mercadopago.com.ar/developers/panel
2. Crear (o abrir) una aplicación → **Credenciales de producción**.
3. Copiar el **Access Token** (empieza con `APP_USR-...`).
4. Pegarlo en Netlify como `MP_ACCESS_TOKEN` (paso 1).

⚠️ El Access Token es secreto: da acceso a cobrar en tu cuenta. No lo subas
al repo ni lo compartas. Si se filtra, regeneralo desde el panel de Mercado Pago.

> Para probar antes de cobrar de verdad, podés pegar las credenciales de
> **prueba** (TEST) y usar las tarjetas de test de Mercado Pago. Cuando esté
> todo ok, reemplazás por las de producción.

## 3. Productos y precios

Los precios viven server-side en `crear-preferencia.js` (el cliente nunca los
manda, así nadie puede falsear el monto). Para cambiar un precio, editá el
objeto `PRODUCTOS` en ese archivo:

| Slug | Producto | Precio |
|------|----------|--------|
| `hooks` | 100 Hooks que Convierten | $13.999 ARS |
| `prompts` | +135 Prompts de Estrategia | $13.999 ARS |
| `paid-media` | Paid Media Sin Humo | $22.999 ARS |

## 4. Cómo funciona el flujo (descarga verificada)

1. Cliente toca **Comprar con Mercado Pago** en la página de detalle.
2. El browser hace `POST /.netlify/functions/crear-preferencia { producto }`.
3. La function crea la preferencia y devuelve `init_point` (link de checkout).
4. El browser redirige al checkout de Mercado Pago.
5. Pago aprobado → MP redirige a `/contenido/gracias-<producto>.html?payment_id=...`.
6. El botón de descarga apunta a `/.netlify/functions/descargar?payment_id=...`.
7. `descargar` **verifica el pago contra la API de Mercado Pago** (que exista,
   esté APROBADO, sea del producto correcto y el monto coincida) y recién ahí
   entrega el PDF. Si algo no valida, muestra un mensaje y un botón de WhatsApp.

Los PDFs premium **no se sirven directo** desde la web: están empaquetados con
las functions (`included_files` en `netlify.toml`) y cualquier acceso a la URL
del PDF rebota a la página de detalle. La única forma de descargar es con un
pago aprobado real. El link de descarga vale **7 días** desde la aprobación
(se puede cambiar en `DOWNLOAD_WINDOW_MS` dentro de `descargar.js`).

## 5. Webhook (confirmación server-to-server)

`crear-preferencia` ya manda `notification_url` apuntando a
`/.netlify/functions/webhook-mp`. Conviene además registrarlo en el panel de MP:

**developers → tu aplicación → Webhooks / Notificaciones**
- URL: `https://marianocalandra.com/.netlify/functions/webhook-mp`
- Evento: **Pagos** (`payment`)

El webhook re-verifica cada pago contra la API de MP y lo registra en los logs
de la function (Netlify → Functions → `webhook-mp`). Es la confirmación
autoritativa y el punto donde, más adelante, se puede enchufar el envío del
PDF por email. La seguridad de la descarga **no depende** del webhook:
`descargar` valida el pago por su cuenta.

## 6. Probar el flujo

Con credenciales de **prueba** (TEST) y las tarjetas de test de Mercado Pago:
1. Entrá a un producto → **Comprar con Mercado Pago**.
2. Pagá con una tarjeta de prueba aprobada.
3. Volvés a `gracias-<producto>.html` y el botón de descarga ya trae el
   `payment_id`. Al tocarlo, baja el PDF.
4. Probá pegar la URL del PDF directo (ej. `/contenido/...pdf`): debe rebotar
   al detalle. Probá `descargar` sin `payment_id`: debe mostrar el error.
