// Mercado Pago — descarga segura del PDF (link verificado por pago)
// GET /.netlify/functions/descargar?payment_id=<id>
//
// Verifica contra la API de Mercado Pago que el pago exista, esté APROBADO,
// corresponda al producto correcto y que el monto coincida, antes de servir
// el PDF. El cliente nunca elige el producto ni el archivo: se deriva del
// pago real. Los PDFs viven empaquetados con la function (included_files en
// netlify.toml) y NO son accesibles directamente desde la web.
//
// Variables de entorno: MP_ACCESS_TOKEN (igual que crear-preferencia.js).

const fs = require('fs');
const path = require('path');

const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

// Catálogo server-side: precio esperado + archivo real + nombre de descarga.
const PRODUCTOS = {
  'hooks': {
    price: 13999,
    pdf: '100_Hooks_que_Convierten_Mariano_Calandra.pdf',
    filename: '100-Hooks-que-Convierten-Mariano-Calandra.pdf'
  },
  'prompts': {
    price: 13999,
    pdf: '135_Prompts_Estrategia_Negocios_Mariano_Calandra.pdf',
    filename: '135-Prompts-Estrategia-Negocios-Mariano-Calandra.pdf'
  },
  'paid-media': {
    price: 22999,
    pdf: 'Paid-Media-Sin-Humo-ebook.pdf',
    filename: 'Paid-Media-Sin-Humo-Mariano-Calandra.pdf'
  }
};

// Ventana de validez del link tras la aprobación del pago.
const DOWNLOAD_WINDOW_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

function findPdf(name) {
  const candidates = [
    path.join(process.cwd(), 'contenido', name),
    path.join('/var/task', 'contenido', name),
    path.join(__dirname, 'contenido', name),
    path.join(__dirname, '..', '..', 'contenido', name)
  ];
  for (const c of candidates) {
    try { if (fs.existsSync(c)) return c; } catch (_) {}
  }
  return null;
}

function slugFromPayment(payment) {
  const meta = payment.metadata || {};
  if (meta.producto && PRODUCTOS[meta.producto]) return meta.producto;
  const ext = payment.external_reference || '';
  for (const slug of Object.keys(PRODUCTOS)) {
    if (ext.indexOf(slug + '-') === 0) return slug;
  }
  return null;
}

function errorPage(msg) {
  return '<!doctype html><html lang="es"><head><meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>Descarga no disponible</title><style>'
    + 'body{font-family:system-ui,Segoe UI,Roboto,sans-serif;background:#0B0B0B;color:#E8E8E8;'
    + 'display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;padding:24px;text-align:center}'
    + '.box{max-width:520px}a{color:#35D4AE;font-weight:600}h1{font-size:22px;margin-bottom:12px}p{line-height:1.6;color:#B8B8B8}'
    + '</style></head><body><div class="box"><h1>No pudimos validar tu descarga</h1>'
    + '<p>' + msg + '</p><p>Escribime por <a href="https://wa.me/5493416397137?text='
    + 'Hola%20Mariano%2C%20pagu%C3%A9%20un%20contenido%20premium%20y%20no%20puedo%20descargarlo">WhatsApp</a>'
    + ' y te lo paso al instante.</p></div></body></html>';
}

function htmlError(statusCode, msg) {
  return {
    statusCode,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    body: errorPage(msg)
  };
}

exports.handler = async (event) => {
  if (!ACCESS_TOKEN) {
    return htmlError(500, 'El checkout todavía no está configurado.');
  }

  const params = event.queryStringParameters || {};
  const paymentId = params.payment_id || params.collection_id || params.id;
  if (!paymentId) {
    return htmlError(400, 'Falta el identificador del pago en el link.');
  }

  let payment;
  try {
    const res = await fetch(
      'https://api.mercadopago.com/v1/payments/' + encodeURIComponent(paymentId),
      { headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN } }
    );
    if (!res.ok) {
      return htmlError(402, 'No encontramos tu pago en Mercado Pago.');
    }
    payment = await res.json();
  } catch (e) {
    return htmlError(502, 'Hubo un problema verificando tu pago. Probá de nuevo en un minuto.');
  }

  if (payment.status !== 'approved') {
    return htmlError(402, 'Tu pago todavía no figura como aprobado.');
  }

  const slug = slugFromPayment(payment);
  if (!slug) {
    return htmlError(400, 'No pudimos identificar el producto de tu compra.');
  }
  const prod = PRODUCTOS[slug];

  const amount = Number(payment.transaction_amount || 0);
  if (amount + 1 < prod.price) {
    return htmlError(402, 'El monto del pago no coincide con el producto.');
  }

  if (payment.date_approved) {
    const age = Date.now() - new Date(payment.date_approved).getTime();
    if (age > DOWNLOAD_WINDOW_MS) {
      return htmlError(410, 'El link de descarga expiró. Te lo reenvío sin problema.');
    }
  }

  const pdfPath = findPdf(prod.pdf);
  if (!pdfPath) {
    return htmlError(500, 'No encontramos el archivo en el servidor.');
  }

  let buf;
  try {
    buf = fs.readFileSync(pdfPath);
  } catch (e) {
    return htmlError(500, 'No pudimos leer el archivo en el servidor.');
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="' + prod.filename + '"',
      'Cache-Control': 'no-store, private'
    },
    body: buf.toString('base64'),
    isBase64Encoded: true
  };
};
