// Meta Conversions API — endpoint server-side
// Recibe eventos del cliente y los reenvia a Meta con el access token
// (que vive solo como variable de entorno, nunca expuesto al browser).
//
// Variables de entorno requeridas en Netlify:
//   META_PIXEL_ID            — ID del pixel (publico, hardcoded tambien en cliente)
//   META_CAPI_ACCESS_TOKEN   — token generado en Business Manager (SECRETO)
//   META_TEST_EVENT_CODE     — opcional, para usar Test Events en Business Manager
//
// El cliente manda: { event_name, event_id, event_source_url, custom_data, user_data }
// El servidor agrega: client_ip_address, client_user_agent, fbp/fbc cookies, hashing.

const crypto = require('crypto');

const PIXEL_ID = process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE || null;
const API_VERSION = 'v21.0';

const ALLOWED_ORIGINS = [
  'https://marianocalandra.com',
  'https://www.marianocalandra.com'
];

const ALLOWED_EVENTS = new Set([
  'PageView',
  'ViewContent',
  'Lead',
  'Contact',
  'CompleteRegistration',
  'Subscribe'
]);

function sha256(value) {
  if (value === undefined || value === null) return undefined;
  const normalized = String(value).trim().toLowerCase();
  if (!normalized) return undefined;
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

function pickCookie(cookieHeader, name) {
  if (!cookieHeader) return undefined;
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return undefined;
}

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin || '';
  const headers = corsHeaders(origin);

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'method_not_allowed' }) };
  }

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'capi_not_configured' })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (_) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'invalid_json' }) };
  }

  const eventName = payload.event_name;
  if (!eventName || !ALLOWED_EVENTS.has(eventName)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'invalid_event_name' }) };
  }

  const cookieHeader = event.headers.cookie || event.headers.Cookie || '';
  const fbp = pickCookie(cookieHeader, '_fbp');
  const fbc = pickCookie(cookieHeader, '_fbc');

  const clientIp =
    (event.headers['x-nf-client-connection-ip']) ||
    (event.headers['client-ip']) ||
    ((event.headers['x-forwarded-for'] || '').split(',')[0] || '').trim() ||
    undefined;
  const userAgent = event.headers['user-agent'] || event.headers['User-Agent'];

  const incomingUser = payload.user_data || {};

  const user_data = {
    em: incomingUser.email ? [sha256(incomingUser.email)] : undefined,
    ph: incomingUser.phone ? [sha256(incomingUser.phone.replace(/[^0-9]/g, ''))] : undefined,
    fn: incomingUser.first_name ? [sha256(incomingUser.first_name)] : undefined,
    ln: incomingUser.last_name ? [sha256(incomingUser.last_name)] : undefined,
    country: incomingUser.country ? [sha256(incomingUser.country)] : undefined,
    client_ip_address: clientIp,
    client_user_agent: userAgent,
    fbp: fbp || undefined,
    fbc: fbc || undefined
  };

  // limpiamos undefined
  Object.keys(user_data).forEach((k) => user_data[k] === undefined && delete user_data[k]);

  const metaEvent = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: payload.event_id, // dedup con el pixel cliente
    event_source_url: payload.event_source_url,
    action_source: 'website',
    user_data,
    custom_data: payload.custom_data || {}
  };

  const body = {
    data: [metaEvent]
  };
  if (TEST_EVENT_CODE) body.test_event_code = TEST_EVENT_CODE;

  const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN)}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const text = await res.text();

    if (!res.ok) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: 'meta_api_error', status: res.status, detail: text })
      };
    }

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'capi_request_failed', message: err.message })
    };
  }
};
