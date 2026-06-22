// Mercado Pago — webhook (notification_url de las preferencias)
// Mercado Pago llama acá (server-to-server) cuando cambia el estado de un pago.
// Verificamos el pago contra la API de MP (fuente de verdad) y lo registramos.
//
// Es la confirmación autoritativa del pago. La descarga del PDF
// (descargar.js) también verifica el pago de forma independiente, así que la
// seguridad no depende de este webhook: este endpoint sirve como registro y
// como punto de extensión para, por ejemplo, mandar el PDF por email.
//
// Variable de entorno: MP_ACCESS_TOKEN.

const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

exports.handler = async (event) => {
  // Respondemos 200 siempre que podamos, para que Mercado Pago no reintente
  // indefinidamente. Solo procesamos notificaciones de tipo "payment".
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'method_not_allowed' };
  }

  if (!ACCESS_TOKEN) {
    return { statusCode: 200, body: 'ok' };
  }

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (_) {}
  const q = event.queryStringParameters || {};

  const type = body.type || body.topic || q.type || q.topic;
  const paymentId =
    (body.data && body.data.id) ||
    body['data.id'] ||
    q['data.id'] ||
    q.id;

  if (type !== 'payment' || !paymentId) {
    return { statusCode: 200, body: 'ignored' };
  }

  try {
    const res = await fetch(
      'https://api.mercadopago.com/v1/payments/' + encodeURIComponent(paymentId),
      { headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN } }
    );
    if (res.ok) {
      const p = await res.json();
      console.log('MP webhook payment', {
        id: p.id,
        status: p.status,
        external_reference: p.external_reference,
        amount: p.transaction_amount,
        producto: (p.metadata && p.metadata.producto) || null
      });
      // Punto de extensión: si p.status === 'approved', acá se puede disparar
      // el envío del PDF por email (cuando se configure un proveedor de mail).
    }
  } catch (e) {
    console.error('MP webhook error', e.message);
  }

  return { statusCode: 200, body: 'ok' };
};
