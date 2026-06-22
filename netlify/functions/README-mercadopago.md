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

## 4. Cómo funciona el flujo

1. Cliente toca **Comprar con Mercado Pago** en la página de detalle.
2. El browser hace `POST /.netlify/functions/crear-preferencia { producto }`.
3. La function crea la preferencia y devuelve `init_point` (link de checkout).
4. El browser redirige al checkout de Mercado Pago.
5. Pago aprobado → MP redirige a `/contenido/gracias-<producto>.html`.
6. Esa página muestra el **botón de descarga del PDF** + **botón de WhatsApp**.

## 5. Nota sobre la descarga

La descarga se entrega en la página de gracias tras el redirect de pago
aprobado (flujo estándar para PDFs de bajo ticket). No hay verificación de
pago server-side con webhook: alguien que comparta el link de gracias podría
descargar sin pagar. Para el volumen y el precio de estos productos es un
trade-off aceptable. Si en algún momento querés blindarlo del todo, se puede
agregar un webhook de Mercado Pago + link de descarga firmado/temporal.
