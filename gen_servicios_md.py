# -*- coding: utf-8 -*-
"""
Generador de las sublandings de Servicios de Marketing Digital.

Fuente única de verdad para las 7 subpáginas de:
  /servicios/marketing-digital/<slug>.html

Cada subpágina tiene: hero (breadcrumb, badge, precio, CTA Comprar + Agendar),
qué contiene, para quién es, cómo contratarlo, comparativo sin/con y CTA final.

NO lo corre Netlify (el build solo ejecuta bust.py). Es una herramienta local:
    python3 gen_servicios_md.py
Edita la copy acá y regenerá los HTML. Mantiene la identidad real del sitio
(acento teal #35d4ae, tokens de styles.css), no la paleta del brief.
"""

import os

OUT_DIR = os.path.join("servicios", "marketing-digital")

CALENDAR_URL = ("https://calendar.google.com/calendar/u/0/appointments/schedules/"
                "AcZssZ0ia82BAbDyGthqzolde_NV2XPid5bfoAH0WuXI1NgmCFZyf5DvB7wPZBZAt2nrZRumUXYQJATZ?gv=true")

SITE = "https://marianocalandra.com"
WA_NUMBER = "5493416397137"

# ---------------------------------------------------------------------------
# Datos de los servicios (mismos nombres y precios que la página madre).
# El precio mostrado es en USD (como en la web). El cobro real en ARS vive
# server-side en netlify/functions/crear-preferencia.js (catálogo SERVICIOS).
# ---------------------------------------------------------------------------
SERVICES = [
    {
        "slug": "performance-marketing",
        "name": "Performance Marketing",
        "icon": "📊",
        "modality": "Mensual",
        "price": "USD 300",
        "priceNote": "por mes · + inversión publicitaria, que corre por cuenta del cliente",
        "heroTitle": "Campañas pagas con estrategia, datos y foco real en ventas.",
        "heroDescription": "Gestión profesional de campañas en Meta Ads y Google Ads orientada a ordenar la inversión publicitaria, mejorar el rendimiento y sustentar las decisiones en métricas verificables.",
        "shortDescription": "Gestión profesional de campañas en Meta Ads y Google Ads con foco en ROI.",
        "includes": [
            "Diagnóstico inicial de cuenta publicitaria, oferta y embudo.",
            "Estructura de campañas en Meta Ads y/o Google Ads.",
            "Definición de objetivos, públicos, presupuesto y KPIs.",
            "Optimización de presupuesto, anuncios y segmentaciones.",
            "Revisión de creativos y mensajes comerciales.",
            "Seguimiento de métricas clave: leads, CPL, ROAS, CPA o conversiones.",
            "Recomendaciones de mejora para escalar con criterio.",
        ],
        "forWho": [
            "Negocios que ya invierten en publicidad y buscan mejorar sus resultados.",
            "Empresas que necesitan generar oportunidades comerciales de forma más previsible.",
            "Emprendimientos B2C que requieren una gestión ordenada de sus campañas.",
            "PYMES B2B que necesitan campañas conectadas al proceso comercial.",
        ],
        "without": [
            "Presupuesto publicitario mal distribuido.",
            "Campañas activas sin una estrategia clara.",
            "Métricas de vanidad sin relación con ventas.",
            "Dificultad para saber qué anuncio, público o canal funciona.",
            "Decisiones tomadas por intuición y no por datos.",
        ],
        "withList": [
            "Campañas estructuradas según objetivo comercial.",
            "Mejor lectura de métricas y retorno de inversión.",
            "Optimización continua de presupuesto y anuncios.",
            "Claridad para escalar lo que funciona.",
            "Publicidad conectada con ventas reales.",
        ],
        "finalCtaTitle": "Convierta la inversión publicitaria en un sistema medible.",
        "finalCtaText": "Agende una llamada para evaluar si Performance Marketing constituye el punto de partida adecuado para su empresa.",
    },
    {
        "slug": "content-creation",
        "name": "Content Creation",
        "icon": "✍️",
        "modality": "Mensual",
        "price": "USD 450",
        "priceNote": "por mes · servicio mensual de contenido estratégico",
        "heroTitle": "Contenido estratégico para construir marca, demanda y confianza.",
        "heroDescription": "Creación de contenido para redes con enfoque comercial: ideas, guiones, textos y piezas orientadas a conectar con la audiencia y a nutrir las campañas.",
        "shortDescription": "Contenido estratégico para redes, campañas y posicionamiento de marca.",
        "includes": [
            "Planificación mensual de contenidos.",
            "Ideas de posteos alineadas a objetivos comerciales.",
            "Copys para redes sociales.",
            "Guiones para reels o videos cortos.",
            "Piezas pensadas para marca, autoridad, educación y conversión.",
            "Optimización de mensajes para conectar con la audiencia correcta.",
            "Calendario de publicación organizado.",
        ],
        "forWho": [
            "Marcas personales que necesitan construir autoridad.",
            "Negocios que publican pero no tienen una línea editorial clara.",
            "Empresas que necesitan contenido para acompañar campañas pagas.",
            "Profesionales independientes y consultores que buscan comunicar mejor su propuesta.",
        ],
        "without": [
            "Publicaciones sueltas sin estrategia.",
            "Contenido que no educa, no posiciona y no vende.",
            "Falta de consistencia en redes.",
            "Mensajes poco claros sobre qué ofrece la marca.",
            "Dependencia de ideas improvisadas semana a semana.",
        ],
        "withList": [
            "Contenido alineado a objetivos de negocio.",
            "Mayor claridad en el mensaje de marca.",
            "Piezas que educan, generan confianza y acompañan la venta.",
            "Calendario ordenado y sostenible.",
            "Mejor conexión entre contenido orgánico y campañas pagas.",
        ],
        "finalCtaTitle": "Contenido con estrategia, no publicaciones aisladas.",
        "finalCtaText": "Agende una llamada para ordenar el contenido de su empresa bajo una estrategia definida.",
    },
    {
        "slug": "realizacion-audiovisual",
        "name": "Realización Audiovisual",
        "icon": "🎬",
        "modality": "Mensual",
        "price": "USD 450",
        "priceNote": "producción mensual",
        "heroTitle": "Videos cortos pensados para captar atención y vender mejor.",
        "heroDescription": "Producción y edición de videos dinámicos con aperturas efectivas, estructura comercial y formato listo para pauta, reels, historias y contenido orgánico.",
        "shortDescription": "Producción de videos cortos con edición dinámica y enfoque comercial.",
        "includes": [
            "Definición de ideas y conceptos para videos.",
            "Hooks pensados para captar atención en los primeros segundos.",
            "Guiones breves para reels, stories o anuncios.",
            "Edición dinámica adaptada a redes sociales.",
            "Formato vertical mobile-first.",
            "Optimización del mensaje para pauta y orgánico.",
            "Entrega de piezas listas para publicar o pautar.",
        ],
        "forWho": [
            "Negocios que necesitan videos para redes y anuncios.",
            "Marcas que buscan mejorar la retención y la atención de sus contenidos.",
            "Empresas que tienen material grabado pero necesitan convertirlo en piezas útiles.",
            "Emprendimientos que buscan comunicar mejor su oferta en video.",
        ],
        "without": [
            "Videos largos, poco claros o sin gancho.",
            "Baja retención en los primeros segundos.",
            "Contenido audiovisual sin estructura comercial.",
            "Piezas que no sirven para pauta.",
            "Dificultad para transformar ideas en videos publicables.",
        ],
        "withList": [
            "Videos con aperturas efectivas y estructura pensada para redes.",
            "Mayor capacidad de captar atención.",
            "Piezas listas para orgánico y pauta.",
            "Comunicación más dinámica de productos o servicios.",
            "Mejor conexión entre creatividad y objetivo comercial.",
        ],
        "finalCtaTitle": "Piezas audiovisuales al servicio del objetivo comercial.",
        "finalCtaText": "Agende una llamada para definir qué tipo de piezas audiovisuales requiere su empresa.",
    },
    {
        "slug": "creacion-sitio-web",
        "name": "Creación de Sitio Web",
        "icon": "🌐",
        "modality": "Pago único",
        "price": "USD 500",
        "priceNote": "pago único · sitio profesional, responsive y orientado a conversión",
        "heroTitle": "Un sitio web profesional para presentar, ordenar y potenciar el negocio.",
        "heroDescription": "Diseño y desarrollo de un sitio web rápido, responsive y orientado a convertir visitas en consultas, oportunidades comerciales o ventas.",
        "shortDescription": "Sitio profesional, rápido, responsive y optimizado para conversión.",
        "includes": [
            "Estructura estratégica del sitio.",
            "Diseño responsive adaptado a mobile y desktop.",
            "Secciones comerciales clave: propuesta de valor, servicios, prueba social y contacto.",
            "Copy base orientado a conversión.",
            "Optimización de navegación y experiencia de usuario.",
            "Integración con botones de contacto o formularios.",
            "Preparación para medición, campañas y crecimiento futuro.",
        ],
        "forWho": [
            "Negocios que necesitan una presencia digital profesional.",
            "Marcas personales que buscan centralizar su autoridad.",
            "Empresas que hoy dependen solo de Instagram o WhatsApp.",
            "Empresas que necesitan un sitio claro para sostener su proceso de venta.",
        ],
        "without": [
            "Dependencia total de redes sociales.",
            "Falta de una plataforma propia para presentar la oferta.",
            "Pérdida de confianza frente a potenciales clientes.",
            "Dificultad para medir visitas y conversiones.",
            "Campañas llevando tráfico a páginas poco preparadas.",
        ],
        "withList": [
            "Presencia digital profesional y ordenada.",
            "Mejor experiencia para potenciales clientes.",
            "Mayor claridad sobre la oferta y sobre el modo de contratación.",
            "Base sólida para campañas, SEO y contenidos.",
            "Mayor confianza y autoridad comercial.",
        ],
        "finalCtaTitle": "El sitio web puede ser mucho más que una vidriera.",
        "finalCtaText": "Agende una llamada para definir la estructura adecuada para su sitio web.",
    },
    {
        "slug": "creacion-landing-page",
        "name": "Creación de Landing Page",
        "icon": "🎯",
        "modality": "Pago único",
        "price": "USD 300",
        "priceNote": "pago único · landing específica para leads, ventas o campañas",
        "heroTitle": "Una landing enfocada en convertir tráfico en consultas o ventas.",
        "heroDescription": "Diseño y desarrollo de una página de aterrizaje clara, directa y optimizada para campañas, captación de leads o venta de un producto o servicio específico.",
        "shortDescription": "Landing de alta conversión para capturar leads o vender una oferta concreta.",
        "includes": [
            "Estructura persuasiva de landing page.",
            "Hero con propuesta de valor clara.",
            "Bloques de beneficios, problemas y solución.",
            "Sección de prueba social o autoridad si aplica.",
            "CTA principal visible y repetido estratégicamente.",
            "Diseño responsive.",
            "Preparación para campañas y medición.",
        ],
        "forWho": [
            "Negocios que necesitan promocionar un servicio puntual.",
            "Empresas que hacen campañas en Meta Ads o Google Ads.",
            "Empresas que necesitan captar oportunidades comerciales.",
            "Marcas que necesitan validar una oferta específica.",
        ],
        "without": [
            "Tráfico pago enviado a páginas genéricas.",
            "Baja conversión por falta de foco.",
            "Mensajes dispersos y sin jerarquía.",
            "Menor claridad para el usuario.",
            "Dificultad para medir qué oferta convierte.",
        ],
        "withList": [
            "Página enfocada en una sola acción.",
            "Mayor claridad para el usuario.",
            "Mejor conversión de campañas.",
            "Mensaje alineado a la oferta.",
            "Base ideal para testear y optimizar.",
        ],
        "finalCtaTitle": "El tráfico pago requiere una página preparada para convertir.",
        "finalCtaText": "Agende una llamada para desarrollar una landing preparada para convertir.",
    },
    {
        "slug": "email-marketing",
        "name": "Email Marketing",
        "icon": "📧",
        "modality": "Setup + mensual",
        "price": "USD 500",
        "priceNote": "setup inicial · + USD 150 / mes (≈ $217.500 ARS) de fee de gestión",
        "heroTitle": "Email marketing para nutrir leads, vender mejor y no depender solo de redes.",
        "heroDescription": "Configuración de plataforma, automatizaciones y estrategia de campañas mensuales para construir una lista propia y activar oportunidades comerciales.",
        "shortDescription": "Setup, automatizaciones y estrategia mensual de campañas por email.",
        "includes": [
            "Configuración inicial de plataforma de email marketing.",
            "Segmentación básica de contactos.",
            "Automatizaciones iniciales según el negocio.",
            "Estructura de campañas mensuales.",
            "Copy para emails comerciales o educativos.",
            "Revisión de métricas: aperturas, clics y respuestas.",
            "Recomendaciones para mejorar captación y nutrición de leads.",
        ],
        "forWho": [
            "Negocios que generan leads y necesitan nutrirlos.",
            "Empresas que necesitan vender sin depender exclusivamente de las redes sociales.",
            "Marcas personales con comunidad o newsletter.",
            "Ecommerce o servicios que buscan mejorar la recurrencia y el seguimiento.",
        ],
        "without": [
            "Leads que se enfrían sin seguimiento.",
            "Dependencia excesiva de redes y pauta.",
            "Falta de canal propio de comunicación.",
            "Oportunidades comerciales perdidas.",
            "Base de contactos desaprovechada.",
        ],
        "withList": [
            "Canal propio para comunicar y vender.",
            "Mejor nutrición de leads.",
            "Automatizaciones que ahorran tiempo.",
            "Mayor recurrencia y seguimiento comercial.",
            "Campañas más ordenadas y medibles.",
        ],
        "finalCtaTitle": "La base de contactos puede convertirse en un activo comercial.",
        "finalCtaText": "Agende una llamada para definir la estrategia de email marketing adecuada.",
    },
    {
        "slug": "seo-geo",
        "name": "Posicionamiento SEO / GEO",
        "icon": "📍",
        "modality": "Mensual",
        "price": "USD 400",
        "priceNote": "por mes · estrategia mensual de posicionamiento orgánico",
        "heroTitle": "Posicionamiento orgánico para captar la demanda que ya está buscando.",
        "heroDescription": "Estrategia SEO y GEO para mejorar la visibilidad del negocio en Google, búsquedas locales y mapas, articulando contenido, intención de búsqueda y conversión.",
        "shortDescription": "Estrategia de posicionamiento orgánico en Google y mapas.",
        "includes": [
            "Diagnóstico SEO inicial del sitio.",
            "Investigación de palabras clave e intención de búsqueda.",
            "Optimización de páginas clave.",
            "Recomendaciones de estructura, contenido y enlazado interno.",
            "Optimización local si aplica.",
            "Plan de contenidos orientado a búsqueda.",
            "Seguimiento de oportunidades y mejoras mensuales.",
        ],
        "forWho": [
            "Negocios locales que necesitan aparecer en Google y en mapas.",
            "Empresas que buscan captar demanda orgánica.",
            "Marcas que buscan reducir su dependencia de la pauta paga.",
            "Sitios web que necesitan mejorar visibilidad y estructura.",
        ],
        "without": [
            "Baja visibilidad cuando el cliente busca soluciones.",
            "Dependencia total de anuncios pagos.",
            "Sitio web sin estructura para posicionar.",
            "Contenido que no responde a intención de búsqueda.",
            "Oportunidades orgánicas desaprovechadas.",
        ],
        "withList": [
            "Mejor visibilidad en búsquedas relevantes.",
            "Captación de demanda con intención real.",
            "Sitio más ordenado para Google y usuarios.",
            "Menor dependencia de pauta a largo plazo.",
            "Contenido conectado a búsquedas y conversión.",
        ],
        "finalCtaTitle": "Ser encontrado también forma parte del proceso comercial.",
        "finalCtaText": "Agende una llamada para evaluar las oportunidades de posicionamiento.",
    },
]

# Equivalente en ARS que se muestra al lado del precio USD (al lado del botón
# Comprar). Conversión a 1 USD = $1450 ARS. Debe coincidir con los montos del
# catálogo SERVICIOS en netlify/functions/crear-preferencia.js (lo que cobra MP).
PRICE_ARS = {
    "performance-marketing": "$435.000 ARS",
    "content-creation": "$652.500 ARS",
    "realizacion-audiovisual": "$652.500 ARS",
    "creacion-sitio-web": "$725.000 ARS",
    "creacion-landing-page": "$435.000 ARS",
    "email-marketing": "$725.000 ARS",
    "seo-geo": "$580.000 ARS",
}

# ---------------------------------------------------------------------------
# CSS de la sublanding (scoped con prefijo .sd-). Usa tokens reales del sitio.
# ---------------------------------------------------------------------------
CSS = """
/* ================================================================
   SERVICE DETAIL — Sublanding de un servicio
   ================================================================ */
.sd-page { padding-top: 136px; padding-bottom: 0; }

.sd-breadcrumb {
  display: inline-flex; align-items: center; gap: 6px;
  color: var(--text-muted); font-size: 13px; font-weight: 500;
  margin-bottom: 28px; transition: var(--transition);
}
.sd-breadcrumb:hover { color: var(--accent); opacity: 1; }
.sd-breadcrumb b { color: var(--text-gray); font-weight: 600; }

/* ── Hero ── */
.sd-hero { padding-bottom: 64px; border-bottom: 1px solid rgba(255,255,255,0.07); }

.sd-badge {
  display: inline-flex; width: fit-content;
  font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--accent); background: var(--accent-soft);
  border: 1px solid var(--accent-border); border-radius: var(--radius-pill);
  padding: 6px 14px; margin-bottom: 22px;
}

.sd-hero h1 {
  font-size: clamp(34px, 5.2vw, 60px); font-weight: 900;
  line-height: 1.05; letter-spacing: -0.025em;
  max-width: 880px; margin-bottom: 20px;
}
.sd-hero h1 span { color: var(--accent); }

.sd-hero-desc {
  font-size: 18px; color: var(--text-gray); line-height: 1.7;
  max-width: 720px; margin-bottom: 34px;
}

.sd-price-box {
  display: flex; flex-direction: column; gap: 6px; margin-bottom: 30px;
}
.sd-price {
  font-family: 'Montserrat', sans-serif; font-size: clamp(34px, 5vw, 52px);
  font-weight: 900; color: var(--text-white); line-height: 1; letter-spacing: -0.03em;
}
.sd-price-ars {
  font-family: 'Montserrat', sans-serif; font-size: 17px; font-weight: 700;
  color: var(--accent); letter-spacing: -0.01em;
}
.sd-price-note { font-size: 13px; color: var(--text-muted); line-height: 1.5; }

/* ── Botones ── */
.sd-ctas { display: flex; flex-wrap: wrap; gap: 14px; }

.sd-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 52px; padding: 0 30px; border-radius: var(--radius-pill);
  font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 600;
  text-decoration: none; cursor: pointer; transition: var(--transition);
  border: 1.5px solid transparent;
}
.sd-btn-primary { background: var(--accent); color: #111111; }
.sd-btn-primary:hover {
  background: #3de0bb; transform: translateY(-2px); opacity: 1;
  box-shadow: 0 10px 28px rgba(53, 212, 174, 0.28);
}
.sd-btn-secondary {
  background: transparent; color: var(--text-gray);
  border-color: rgba(255,255,255,0.14);
}
.sd-btn-secondary:hover {
  border-color: var(--accent); color: var(--accent);
  transform: translateY(-2px); opacity: 1;
}

/* ── Secciones ── */
.sd-section { padding: 72px 0; border-bottom: 1px solid rgba(255,255,255,0.07); }

.sd-eyebrow {
  font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700;
  letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent);
  display: block; margin-bottom: 12px;
}
.sd-section h2 {
  font-size: clamp(26px, 3.6vw, 40px); font-weight: 800;
  letter-spacing: -0.025em; line-height: 1.1; margin-bottom: 36px;
  max-width: 760px;
}

/* Grids */
.sd-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.sd-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }

.sd-card {
  background: var(--bg-secondary); border: 1px solid rgba(255,255,255,0.07);
  border-radius: var(--radius-card); padding: 24px 24px;
  display: flex; align-items: flex-start; gap: 12px;
  transition: var(--transition);
}
.sd-card:hover { border-color: rgba(255,255,255,0.14); transform: translateY(-3px); }
.sd-card p { color: var(--text-gray); font-size: 14px; line-height: 1.6; margin: 0; }
.sd-card .sd-check {
  color: var(--accent); font-family: 'Montserrat', sans-serif; font-weight: 800;
  font-size: 14px; flex-shrink: 0; line-height: 1.5;
}
.sd-card.sd-muted .sd-dot {
  width: 7px; height: 7px; border-radius: 50%; background: var(--accent);
  flex-shrink: 0; margin-top: 7px;
}

/* Pasos */
.sd-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.sd-step {
  background: var(--bg-secondary); border: 1px solid rgba(255,255,255,0.07);
  border-radius: var(--radius-card); padding: 28px 26px;
}
.sd-step .sd-num {
  font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 800;
  color: var(--accent); display: block; margin-bottom: 14px; letter-spacing: 0.08em;
}
.sd-step h3 { font-size: 18px; font-weight: 800; margin-bottom: 10px; color: var(--text-white); }
.sd-step p { font-size: 14px; color: var(--text-gray); line-height: 1.6; }

/* Comparativo */
.sd-compare { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
.sd-compare-card {
  background: var(--bg-secondary); border: 1px solid rgba(255,255,255,0.07);
  border-radius: var(--radius-card); padding: 30px 28px;
}
.sd-compare-card h3 {
  font-size: 17px; font-weight: 800; margin-bottom: 20px;
  display: flex; align-items: center; gap: 10px;
}
.sd-compare-card.sd-neg h3 { color: #ff7a7a; }
.sd-compare-card.sd-pos {
  border-color: var(--accent-border);
  background: linear-gradient(150deg, rgba(53,212,174,0.08) 0%, rgba(53,212,174,0.02) 60%, var(--bg-secondary) 100%);
}
.sd-compare-card.sd-pos h3 { color: var(--accent); }
.sd-compare-card ul { list-style: none; padding: 0; margin: 0; }
.sd-compare-card li {
  display: flex; align-items: flex-start; gap: 11px;
  padding: 13px 0; border-bottom: 1px solid rgba(255,255,255,0.06);
  font-size: 14px; color: var(--text-gray); line-height: 1.55;
}
.sd-compare-card li:last-child { border-bottom: 0; }
.sd-compare-card li .sd-mark { flex-shrink: 0; font-weight: 800; font-size: 14px; line-height: 1.55; }
.sd-neg li .sd-mark { color: #ff7a7a; }
.sd-pos li .sd-mark { color: var(--accent); }

/* CTA final */
.sd-final {
  text-align: center; padding: 80px 24px;
  background: linear-gradient(160deg, rgba(53,212,174,0.10) 0%, rgba(53,212,174,0.02) 45%, var(--bg-secondary) 100%);
  border: 1px solid var(--accent-border); border-radius: var(--radius-card);
  margin: 72px 0 100px;
}
.sd-final h2 {
  font-size: clamp(24px, 3.4vw, 36px); font-weight: 800;
  letter-spacing: -0.02em; margin-bottom: 14px; max-width: 640px;
  margin-inline: auto;
}
.sd-final p {
  font-size: 16px; color: var(--text-gray); line-height: 1.65;
  max-width: 600px; margin: 0 auto 30px;
}
.sd-final .sd-ctas { justify-content: center; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .sd-grid-3, .sd-steps, .sd-grid-2, .sd-compare { grid-template-columns: 1fr; }
}
@media (max-width: 680px) {
  .sd-page { padding-top: 110px; }
  .sd-hero { padding-bottom: 48px; }
  .sd-section { padding: 52px 0; }
  .sd-btn { width: 100%; }
  .sd-final { padding: 56px 22px; margin-bottom: 72px; }
}
"""

# ---------------------------------------------------------------------------
# Plantilla HTML (placeholders @@TOKEN@@; el CSS va literal para no chocar
# con las llaves de las reglas).
# ---------------------------------------------------------------------------
TEMPLATE = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="@@META_DESC@@">
<title>@@NAME@@ — Servicios de Marketing Digital | Mariano Calandra</title>

<link rel="canonical" href="@@SITE@@/servicios/marketing-digital/@@SLUG@@.html">

<meta property="og:type" content="website">
<meta property="og:title" content="@@NAME@@ — Mariano Calandra">
<meta property="og:description" content="@@META_DESC@@">
<meta property="og:url" content="@@SITE@@/servicios/marketing-digital/@@SLUG@@.html">
<meta property="og:image" content="@@SITE@@/img/mariano-hero.jpg">
<meta property="og:locale" content="es_AR">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="@@NAME@@ — Mariano Calandra">
<meta name="twitter:description" content="@@META_DESC@@">

<script src="/gtm.js?v=__BUST__"></script>
<!-- Microsoft Clarity -->
<script src="/clarity.js?v=__BUST__"></script>

<link rel="icon" type="image/png" href="/img/favicon-nuevo.png">
<link rel="apple-touch-icon" href="/img/favicon-nuevo.png">
<meta name="theme-color" content="#0B0B0B">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">

<link rel="stylesheet" href="/styles.css?v=__BUST__">

<style>@@CSS@@</style>

<!-- Meta Pixel + CAPI -->
<script src="/meta-pixel.js?v=__BUST__" defer></script>

<!-- Datos estructurados (JSON-LD) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "name": "@@NAME@@",
      "url": "@@SITE@@/servicios/marketing-digital/@@SLUG@@.html",
      "description": "@@META_DESC@@",
      "serviceType": "Marketing digital",
      "areaServed": ["Argentina", "LATAM"],
      "provider": {
        "@type": "Person",
        "@id": "@@SITE@@/#person",
        "name": "Mariano Calandra",
        "url": "@@SITE@@/"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "@@SITE@@/" },
        { "@type": "ListItem", "position": 2, "name": "Servicios", "item": "@@SITE@@/servicios/" },
        { "@type": "ListItem", "position": 3, "name": "Marketing Digital", "item": "@@SITE@@/servicios/marketing-digital.html" },
        { "@type": "ListItem", "position": 4, "name": "@@NAME@@", "item": "@@SITE@@/servicios/marketing-digital/@@SLUG@@.html" }
      ]
    }
  ]
}
</script>
</head>
<body>

<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WF2DG4B7" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<noscript><img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=1460516722431287&ev=PageView&noscript=1"/></noscript>

<!-- HEADER / NAV -->
<header class="header" id="siteHeader">
  <div class="container">
    <div class="header-inner">
      <a href="/" class="logo" aria-label="Mariano Calandra — Inicio">
        <img src="/img/favicon-nuevo.png" alt="MC monograma" width="28" height="28">
        <span class="logo-text">Mariano <span>Calandra</span></span>
      </a>
      <nav aria-label="Navegación principal">
        <ul class="nav-menu" id="navMenu">
          <li><a href="/#home">Home</a></li>
          <li><a href="/quien-soy.html">Quién soy</a></li>
          <li><a href="/#proyectos">EPIGROUP</a></li>
          <li><a href="/servicios/" class="active">Servicios</a></li>
          <li><a href="/portfolio/">Portfolio</a></li>
          <li class="nav-dropdown">
            <button type="button" class="nav-dropdown-toggle" aria-haspopup="true">Contenido</button>
            <ul class="nav-submenu">
              <li><a href="/contenido.html">Ebooks y packs</a></li>
              <li><a href="/blog/">Blog</a></li>
              <li><a href="/newsletter.html">Newsletter</a></li>
            </ul>
          </li>
        </ul>
      </nav>
      <button class="menu-toggle" id="menuToggle" aria-label="Menú" aria-expanded="false">☰</button>
    </div>
  </div>
</header>

<main>
<div class="container sd-page">

  <!-- Breadcrumb -->
  <a href="/servicios/marketing-digital.html" class="sd-breadcrumb">
    ← Servicios / Marketing Digital / <b>@@NAME@@</b>
  </a>

  <!-- HERO -->
  <section class="sd-hero">
    <span class="sd-badge">@@MODALITY@@</span>
    <h1>@@HERO_TITLE_HTML@@</h1>
    <p class="sd-hero-desc">@@HERO_DESC@@</p>
    <div class="sd-ctas">
      <a href="@@CALENDAR@@" class="sd-btn sd-btn-primary" target="_blank" rel="noopener noreferrer">Agendar una llamada</a>
    </div>
  </section>

  <!-- QUÉ CONTIENE -->
  <section class="sd-section">
    <span class="sd-eyebrow">Qué incluye</span>
    <h2>Qué contiene el servicio</h2>
    <div class="sd-grid-3">
@@INCLUDES@@
    </div>
  </section>

  <!-- PARA QUIÉN ES -->
  <section class="sd-section">
    <span class="sd-eyebrow">Para quién es</span>
    <h2>Perfil de empresa al que está dirigido</h2>
    <div class="sd-grid-2">
@@FORWHO@@
    </div>
  </section>

  <!-- CÓMO CONTRATARLO -->
  <section class="sd-section">
    <span class="sd-eyebrow">Cómo contratarlo</span>
    <h2>Tres pasos</h2>
    <div class="sd-steps">
      <div class="sd-step">
        <span class="sd-num">01</span>
        <h3>Evaluación del servicio</h3>
        <p>Se verifica si la solución se adapta a la etapa, los objetivos y el presupuesto de la empresa.</p>
      </div>
      <div class="sd-step">
        <span class="sd-num">02</span>
        <h3>Llamada de coordinación</h3>
        <p>Se coordina una llamada para determinar si constituye el punto de partida adecuado.</p>
      </div>
      <div class="sd-step">
        <span class="sd-num">03</span>
        <h3>Diagnóstico inicial</h3>
        <p>Se analizan el negocio, la oferta, los canales vigentes y los próximos pasos.</p>
      </div>
    </div>
  </section>

  <!-- COMPARATIVO -->
  <section class="sd-section">
    <span class="sd-eyebrow">Situación comparada</span>
    <h2>Qué cambia al tener este servicio</h2>
    <div class="sd-compare">
      <div class="sd-compare-card sd-neg">
        <h3>✕ Sin este servicio</h3>
        <ul>
@@WITHOUT@@
        </ul>
      </div>
      <div class="sd-compare-card sd-pos">
        <h3>✓ Con este servicio</h3>
        <ul>
@@WITH@@
        </ul>
      </div>
    </div>
  </section>

  <!-- CTA FINAL -->
  <section class="sd-final">
    <h2>@@FINAL_TITLE@@</h2>
    <p>@@FINAL_TEXT@@</p>
    <div class="sd-ctas">
      <a href="@@CALENDAR@@" class="sd-btn sd-btn-primary" target="_blank" rel="noopener noreferrer">Agendar una llamada</a>
    </div>
  </section>

</div>
</main>

<!-- Footer -->
<footer style="background:var(--bg-secondary);border-top:1px solid rgba(255,255,255,0.06);padding:32px 0;">
  <div class="container" style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
    <a href="/" class="logo" aria-label="Inicio">
      <img src="/img/favicon-nuevo.png" alt="MC" width="20" height="20">
      <span class="logo-text" style="font-size:0.9rem;">Mariano <span>Calandra</span></span>
    </a>
    <nav aria-label="Footer" style="display:flex;gap:20px;flex-wrap:wrap;">
      <a href="/" style="font-size:13px;color:var(--text-muted);transition:var(--transition);">Inicio</a>
      <a href="/servicios/marketing-digital.html" style="font-size:13px;color:var(--text-muted);transition:var(--transition);">Marketing Digital</a>
      <a href="/portfolio/" style="font-size:13px;color:var(--text-muted);transition:var(--transition);">Portfolio</a>
      <a href="/contenido.html" style="font-size:13px;color:var(--text-muted);transition:var(--transition);">Contenido</a>
      <a href="/newsletter.html" style="font-size:13px;color:var(--text-muted);transition:var(--transition);">Newsletter</a>
    </nav>
    <p style="font-size:12px;color:var(--text-muted);">© 2026 marianocalandra.com</p>
  </div>
</footer>

<script>
  // Header scroll
  const hdr = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    hdr.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile menu toggle
  const toggleBtn = document.getElementById('menuToggle');
  const navMenu   = document.getElementById('navMenu');
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.textContent = isOpen ? '✕' : '☰';
    });
  }
</script>

<!-- Meta CAPI eventos custom de pagina -->
<script>/* MCAPI-PAGE-EVENTS */
document.addEventListener("DOMContentLoaded", function(){
  if (window.mcTrack) window.mcTrack("ViewContent", {"content_name": "@@SLUG@@", "content_category": "servicios-detalle"});
});
</script>
</body>
</html>
"""


def esc(text):
    """Escapa para atributos/meta (comillas y &)."""
    return (text.replace("&", "&amp;")
                .replace('"', "&quot;"))


def hero_title_html(title):
    """Resalta en acento la última frase corta del título (después de la última coma)."""
    if "," in title:
        head, tail = title.rsplit(",", 1)
        return head + ', <span>' + tail.strip() + "</span>"
    return title


def build_list_cards(items, muted=False):
    out = []
    for it in items:
        if muted:
            out.append(
                '      <article class="sd-card sd-muted">\n'
                '        <span class="sd-dot"></span>\n'
                '        <p>' + it + "</p>\n"
                "      </article>"
            )
        else:
            out.append(
                '      <article class="sd-card">\n'
                '        <span class="sd-check">✓</span>\n'
                '        <p>' + it + "</p>\n"
                "      </article>"
            )
    return "\n".join(out)


def build_compare_list(items, positive):
    mark = "✓" if positive else "✕"
    out = []
    for it in items:
        out.append(
            '          <li><span class="sd-mark">' + mark + "</span>" + it + "</li>"
        )
    return "\n".join(out)


def render(svc):
    html = TEMPLATE
    repl = {
        "@@CSS@@": CSS,
        "@@SITE@@": SITE,
        "@@SLUG@@": svc["slug"],
        "@@NAME@@": esc(svc["name"]),
        "@@META_DESC@@": esc(svc["shortDescription"]),
        "@@MODALITY@@": esc(svc["modality"]),
        "@@HERO_TITLE_HTML@@": hero_title_html(svc["heroTitle"]),
        "@@HERO_DESC@@": svc["heroDescription"],
        "@@PRICE@@": svc["price"],
        "@@PRICE_ARS@@": PRICE_ARS.get(svc["slug"], ""),
        "@@PRICE_NOTE@@": svc["priceNote"],
        "@@CALENDAR@@": CALENDAR_URL,
        "@@INCLUDES@@": build_list_cards(svc["includes"]),
        "@@FORWHO@@": build_list_cards(svc["forWho"], muted=True),
        "@@WITHOUT@@": build_compare_list(svc["without"], positive=False),
        "@@WITH@@": build_compare_list(svc["withList"], positive=True),
        "@@FINAL_TITLE@@": svc["finalCtaTitle"],
        "@@FINAL_TEXT@@": svc["finalCtaText"],
    }
    for k, v in repl.items():
        html = html.replace(k, v)
    return html


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for svc in SERVICES:
        path = os.path.join(OUT_DIR, svc["slug"] + ".html")
        with open(path, "w", encoding="utf-8") as f:
            f.write(render(svc))
        print("✓ " + path)
    print("\n%d subpáginas generadas en %s/" % (len(SERVICES), OUT_DIR))


if __name__ == "__main__":
    main()
