// Leads → CRM Comercial (Notion), vía n8n (EPIGROUP WF20)
// Netlify ejecuta esta función sola cada vez que llega un envío válido de Netlify Forms
// (el nombre "submission-created" es el evento; no hay que configurar nada en el panel).
// Reenvía el lead a n8n con el contrato epigroup.lead.v1. Netlify Forms sigue guardando su copia:
// si n8n o Notion fallan, el lead no se pierde.
//
// Variables de entorno en Netlify (scope: Functions):
//   EPIGROUP_LEADS_WEBHOOK_SECRET — clave del webhook de n8n (SECRETO). Sin ella, la función no reenvía nada.
//   EPIGROUP_LEADS_WEBHOOK_URL    — opcional; por defecto el webhook de producción de n8n.
//
// No reenvía newsletters: son suscriptores, no oportunidades comerciales.

const DEFAULT_WEBHOOK_URL = 'https://marianocalandra.app.n8n.cloud/webhook/epigroup-leads';
const SOURCE = 'marianocalandra.com';
const TIMEOUT_MS = 8000;

// Formularios que van al CRM. Cualquier otro (por ejemplo, las newsletters) no se reenvía.
const CRM_FORMS = new Set([
  'contacto',
  'consultoria',
  'lead-guia-paid-media',
  'lead-auditoria-marketing-express',
  'lead-manual-gtm-ga4',
  'epibrands-studio',
  'epibrands-diagnostico'
]);

// Campos que ya viajan como contacto, UTM o metadatos y no se repiten en el detalle.
const OMIT_FIELDS = new Set([
  'nombre', 'name', 'email', 'whatsapp', 'telefono', 'phone', 'empresa', 'company',
  'form-name', 'bot-field', 'ip', 'user_agent', 'referrer', 'pagina', 'aceptacion',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'
]);

const text = (value, max = 1500) => {
  const s = value === undefined || value === null ? '' : String(value).replace(/\s+/g, ' ').trim();
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
};

function buildLead(payload) {
  const data = payload.data || {};
  const fields = {};
  for (const [key, value] of Object.entries(data)) {
    if (OMIT_FIELDS.has(key)) continue;
    const v = text(value);
    if (v) fields[key] = v;
  }
  return {
    schema: 'epigroup.lead.v1',
    source: SOURCE,
    form: payload.form_name,
    event_id: 'nf-' + payload.id,
    occurred_at: payload.created_at || new Date().toISOString(),
    contact: {
      name: text(data.nombre || data.name || payload.name, 200),
      email: text(data.email || payload.email, 200),
      phone: text(data.whatsapp || data.telefono || data.phone, 40),
      company: text(data.empresa || data.company || payload.company, 200)
    },
    interest: payload.form_name === 'epibrands-diagnostico' ? text(data.planInteres, 200) : '',
    fields,
    utm: {
      source: text(data.utm_source, 80),
      medium: text(data.utm_medium, 80),
      campaign: text(data.utm_campaign, 120),
      content: text(data.utm_content, 120),
      term: text(data.utm_term, 120)
    },
    page_url: text(data.pagina || data.referrer || payload.site_url, 300)
  };
}

exports.buildLead = buildLead;

exports.handler = async (event) => {
  let payload;
  try {
    payload = JSON.parse(event.body || '{}').payload || {};
  } catch (err) {
    console.error('[leads] cuerpo inválido:', err.message);
    return { statusCode: 200, body: 'ignored' };
  }

  if (!CRM_FORMS.has(payload.form_name)) {
    return { statusCode: 200, body: 'not-a-crm-form' };
  }

  const secret = process.env.EPIGROUP_LEADS_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('[leads] EPIGROUP_LEADS_WEBHOOK_SECRET sin configurar: el lead queda solo en Netlify Forms.');
    return { statusCode: 200, body: 'not-configured' };
  }

  const url = process.env.EPIGROUP_LEADS_WEBHOOK_URL || DEFAULT_WEBHOOK_URL;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-EPIGROUP-Secret': secret },
      body: JSON.stringify(buildLead(payload)),
      signal: controller.signal
    });
    // Sin datos personales en el log: solo el formulario y el resultado.
    if (!res.ok) console.error('[leads] n8n respondió', res.status, 'para', payload.form_name);
    else console.log('[leads] reenviado al CRM:', payload.form_name);
  } catch (err) {
    console.error('[leads] no se pudo reenviar', payload.form_name, '→', err.name === 'AbortError' ? 'timeout' : err.message);
  } finally {
    clearTimeout(timer);
  }
  return { statusCode: 200, body: 'ok' };
};
