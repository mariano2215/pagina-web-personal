// Mercado Pago — Checkout Pro (creación de preferencia server-side)
// El browser pide POST /.netlify/functions/crear-preferencia { producto: "<slug>" }
// y el server crea la preferencia con el Access Token (que vive solo como
// variable de entorno, nunca expuesto al cliente) y devuelve el init_point
// al que se redirige para pagar.
//
// Variables de entorno requeridas en Netlify:
//   MP_ACCESS_TOKEN — Access Token de producción de Mercado Pago (SECRETO)
//
// Ver netlify/functions/README-mercadopago.md para el setup completo.

const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const SITE = 'https://marianocalandra.com';

const ALLOWED_ORIGINS = [
  'https://marianocalandra.com',
  'https://www.marianocalandra.com'
];

// Catálogo server-side: el precio y el título NUNCA llegan desde el cliente,
// así nadie puede manipular el monto a pagar. El cliente solo manda el slug.
const PRODUCTOS = {
  'hooks': {
    title: '100 Hooks que Convierten en Redes Sociales',
    price: 13999,
    gracias: '/contenido/gracias-hooks.html',
    detalle: '/contenido/100-hooks-que-convierten.html'
  },
  'prompts': {
    title: '+135 Prompts de Estrategia para Negocios',
    price: 13999,
    gracias: '/contenido/gracias-prompts.html',
    detalle: '/contenido/pack-prompts.html'
  },
  'paid-media': {
    title: 'Paid Media Sin Humo — E-Book',
    price: 22999,
    gracias: '/contenido/gracias-paid-media.html',
    detalle: '/contenido/ebook-paid-media-sin-humo.html'
  }
};

// Servicios de Marketing Digital. El precio se cobra en ARS (Checkout Pro AR).
// Montos cargados a 1 USD = $1450 ARS (entero, sin puntos). Si en el futuro se
// agrega un servicio con `price: null`, el botón "Comprar" no genera checkout:
// la function devuelve `precio_no_configurado` y el front cae a "Agendar una
// llamada". El equivalente ARS mostrado en las páginas (PRICE_ARS en
// gen_servicios_md.py y las cards de marketing-digital.html) debe coincidir.
const DET = '/servicios/marketing-digital/';
const GRACIAS_SERVICIO = '/servicios/marketing-digital/gracias.html';
const SERVICIOS = {
  'performance-marketing': {
    title: 'Performance Marketing — Mariano Calandra',
    price: 435000, // USD 300/mes × 1450
    gracias: GRACIAS_SERVICIO,
    detalle: DET + 'performance-marketing.html',
    tipo: 'servicio'
  },
  'content-creation': {
    title: 'Content Creation — Mariano Calandra',
    price: 652500, // USD 450/mes × 1450
    gracias: GRACIAS_SERVICIO,
    detalle: DET + 'content-creation.html',
    tipo: 'servicio'
  },
  'realizacion-audiovisual': {
    title: 'Realización Audiovisual — Mariano Calandra',
    price: 652500, // USD 450/mes × 1450
    gracias: GRACIAS_SERVICIO,
    detalle: DET + 'realizacion-audiovisual.html',
    tipo: 'servicio'
  },
  'creacion-sitio-web': {
    title: 'Creación de Sitio Web — Mariano Calandra',
    price: 725000, // USD 500 pago único × 1450
    gracias: GRACIAS_SERVICIO,
    detalle: DET + 'creacion-sitio-web.html',
    tipo: 'servicio'
  },
  'creacion-landing-page': {
    title: 'Creación de Landing Page — Mariano Calandra',
    price: 435000, // USD 300 pago único × 1450
    gracias: GRACIAS_SERVICIO,
    detalle: DET + 'creacion-landing-page.html',
    tipo: 'servicio'
  },
  'email-marketing': {
    title: 'Email Marketing — Setup — Mariano Calandra',
    price: 725000, // USD 500 setup × 1450 (el fee mensual se cobra aparte)
    gracias: GRACIAS_SERVICIO,
    detalle: DET + 'email-marketing.html',
    tipo: 'servicio'
  },
  'seo-geo': {
    title: 'Posicionamiento SEO / GEO — Mariano Calandra',
    price: 580000, // USD 400/mes × 1450
    gracias: GRACIAS_SERVICIO,
    detalle: DET + 'seo-geo.html',
    tipo: 'servicio'
  }
};

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

  if (!ACCESS_TOKEN) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'mp_not_configured' })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (_) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'invalid_json' }) };
  }

  const slug = payload.producto;
  const producto = PRODUCTOS[slug] || SERVICIOS[slug];
  if (!producto) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'producto_invalido' }) };
  }

  // Servicio sin precio ARS cargado todavía: no se puede cobrar. El front
  // (botón Comprar) interpreta cualquier error y cae a "Agendar una llamada".
  if (producto.price == null) {
    return { statusCode: 409, headers, body: JSON.stringify({ error: 'precio_no_configurado' }) };
  }

  const esServicio = producto.tipo === 'servicio';
  const descripcion = esServicio
    ? 'Servicio de Marketing Digital · Mariano Calandra'
    : 'Contenido premium descargable · Mariano Calandra';

  const preference = {
    items: [
      {
        id: slug,
        title: producto.title,
        description: descripcion,
        quantity: 1,
        currency_id: 'ARS',
        unit_price: producto.price
      }
    ],
    back_urls: {
      success: SITE + producto.gracias,
      pending: SITE + producto.gracias,
      failure: SITE + producto.detalle
    },
    auto_return: 'approved',
    statement_descriptor: 'MCALANDRA',
    external_reference: slug + '-' + Date.now(),
    metadata: { producto: slug, tipo: esServicio ? 'servicio' : 'descargable' },
    notification_url: SITE + '/.netlify/functions/webhook-mp'
  };

  try {
    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ACCESS_TOKEN
      },
      body: JSON.stringify(preference)
    });
    const data = await res.json();

    if (!res.ok) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: 'mp_api_error', status: res.status, detail: data })
      };
    }

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: data.id, init_point: data.init_point })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'mp_request_failed', message: err.message })
    };
  }
};
