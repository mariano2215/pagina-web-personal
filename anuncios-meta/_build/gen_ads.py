#!/usr/bin/env python3
# Genera 14 anuncios Meta Ads (7 servicios x {1:1, 9:16}) como HTML a medida exacta.
import base64, pathlib

BUILD = pathlib.Path(__file__).parent
ROOT  = BUILD.parent
FONTS = BUILD / "fonts"
OUT   = ROOT          # los .html van a anuncios-meta/_build, los png a anuncios-meta/

def b64(p):
    return base64.b64encode(pathlib.Path(p).read_bytes()).decode()

font_face = f"""
@font-face {{ font-family:'Montserrat'; font-weight:700; font-style:normal;
  src:url(data:font/woff2;base64,{b64(FONTS/'latin-700-normal.woff2')}) format('woff2'); }}
@font-face {{ font-family:'Montserrat'; font-weight:800; font-style:normal;
  src:url(data:font/woff2;base64,{b64(FONTS/'latin-800-normal.woff2')}) format('woff2'); }}
@font-face {{ font-family:'Montserrat'; font-weight:900; font-style:normal;
  src:url(data:font/woff2;base64,{b64(FONTS/'latin-900-normal.woff2')}) format('woff2'); }}
@font-face {{ font-family:'Poppins'; font-weight:500; font-style:normal;
  src:url(data:font/woff2;base64,{b64(FONTS/'latin-500-normal.woff2')}) format('woff2'); }}
@font-face {{ font-family:'Poppins'; font-weight:600; font-style:normal;
  src:url(data:font/woff2;base64,{b64(FONTS/'latin-600-normal.woff2')}) format('woff2'); }}
"""

LOGO = "data:image/png;base64," + b64(ROOT.parent / "img" / "favicon-nuevo.png")

# --- iconos (viewBox 0 0 120 120, stroke = currentColor) ---
ICONS = {
"performance": """
  <line x1="20" y1="98" x2="100" y2="98" opacity=".35"/>
  <polyline points="22,82 46,58 64,70 94,32"/>
  <polyline points="80,32 94,32 94,46"/>
  <circle cx="46" cy="58" r="3.4" fill="currentColor" stroke="none"/>
  <circle cx="64" cy="70" r="3.4" fill="currentColor" stroke="none"/>
""",
"content": """
  <rect x="20" y="24" width="80" height="56" rx="12"/>
  <line x1="33" y1="42" x2="74" y2="42"/>
  <line x1="33" y1="56" x2="87" y2="56" opacity=".5"/>
  <path d="M60 102 L46 89 a8.5 8.5 0 0 1 14 -8.5 a8.5 8.5 0 0 1 14 8.5 Z" fill="currentColor" stroke="none"/>
""",
"audiovisual": """
  <circle cx="60" cy="60" r="38"/>
  <path d="M50 43 L82 60 L50 77 Z" fill="currentColor" stroke="none"/>
""",
"web": """
  <rect x="18" y="26" width="84" height="66" rx="11"/>
  <line x1="18" y1="44" x2="102" y2="44"/>
  <circle cx="30" cy="35" r="2.7" fill="currentColor" stroke="none"/>
  <circle cx="40" cy="35" r="2.7" fill="currentColor" stroke="none"/>
  <circle cx="50" cy="35" r="2.7" fill="currentColor" stroke="none"/>
  <line x1="32" y1="60" x2="62" y2="60"/>
  <line x1="32" y1="74" x2="88" y2="74" opacity=".5"/>
""",
"landing": """
  <rect x="32" y="20" width="56" height="80" rx="11"/>
  <line x1="44" y1="36" x2="76" y2="36"/>
  <line x1="44" y1="48" x2="68" y2="48" opacity=".5"/>
  <circle cx="60" cy="76" r="13"/>
  <circle cx="60" cy="76" r="4.4" fill="currentColor" stroke="none"/>
""",
"email": """
  <rect x="20" y="32" width="80" height="56" rx="9"/>
  <polyline points="20,40 60,66 100,40"/>
""",
"seo": """
  <circle cx="53" cy="53" r="27"/>
  <line x1="74" y1="74" x2="98" y2="98"/>
  <line x1="44" y1="62" x2="44" y2="54"/>
  <line x1="53" y1="62" x2="53" y2="46"/>
  <line x1="62" y1="62" x2="62" y2="50"/>
""",
}

# --- servicios (slug, icono, eyebrow, headline html, subline) ---
SERVICES = [
 ("performance-marketing","performance","PERFORMANCE MARKETING",
   'Cada peso invertido,<br><b>medido y optimizado</b>',
   "Campañas en Meta &amp; Google Ads con foco en ROI."),
 ("content-creation","content","CONTENT CREATION",
   'Contenido que<br><b>conecta y vende</b>',
   "Guiones, copys y piezas que construyen marca."),
 ("realizacion-audiovisual","audiovisual","REALIZACIÓN AUDIOVISUAL",
   'Videos que<br><b>frenan el scroll</b>',
   "Hooks que captan en los primeros 3 segundos."),
 ("creacion-sitio-web","web","SITIO WEB",
   'Tu sitio web,<br><b>listo para vender</b>',
   "Rápido, responsive y optimizado para convertir."),
 ("creacion-landing-page","landing","LANDING PAGE",
   'Landing de<br><b>alta conversión</b>',
   "Diseñada para capturar leads y vender."),
 ("email-marketing","email","EMAIL MARKETING",
   'Convertí tu lista<br><b>en ventas</b>',
   "Automatizaciones y campañas que generan ingresos."),
 ("seo-geo","seo","SEO &amp; GEO",
   'Que te<br><b>encuentren en Google</b>',
   "Posicionamiento orgánico y en mapas."),
]

# --- medidas por formato ---
FMT = {
 "1x1":  dict(w=1080, h=1080, pad=92,  glow="78% 12%", badge=232, icon=128,
              eb=22, hl=70, sub=28, cta=30, ctap="26px 46px", foot=22, logo=40, wm=30, gap=30),
 "9x16": dict(w=1080, h=1920, pad=104, glow="50% 8%",  badge=312, icon=172,
              eb=26, hl=92, sub=34, cta=36, ctap="32px 56px", foot=26, logo=46, wm=34, gap=40),
}

TPL = """<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><style>
{font_face}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:{w}px;height:{h}px;overflow:hidden}}
.ad{{
  width:{w}px;height:{h}px;position:relative;overflow:hidden;
  background:
    radial-gradient(circle at {glow}, rgba(53,212,174,.20), transparent 44%),
    radial-gradient(circle at 8% 96%, rgba(53,212,174,.06), transparent 42%),
    #0B0B0B;
  font-family:'Poppins',sans-serif;color:#fff;
  padding:{pad}px;display:flex;flex-direction:column;
}}
.ad::after{{content:"";position:absolute;inset:0;border:1px solid rgba(255,255,255,.04);pointer-events:none}}
.brand{{display:flex;align-items:center;gap:13px;z-index:2}}
.brand img{{width:{logo}px;height:{logo}px;border-radius:8px}}
.brand .wm{{font-family:'Poppins';font-weight:600;font-size:{wm}px;letter-spacing:-.01em;color:#fff}}
.brand .wm b{{color:#35d4ae;font-weight:600}}
.body{{flex:1;display:flex;flex-direction:column;justify-content:center;gap:{gap}px;z-index:2}}
.badge{{
  width:{badge}px;height:{badge}px;border-radius:30px;
  background:rgba(53,212,174,.08);border:1.5px solid rgba(53,212,174,.34);
  box-shadow:0 0 90px rgba(53,212,174,.22);
  display:flex;align-items:center;justify-content:center;color:#35d4ae;
}}
.badge svg{{width:{icon}px;height:{icon}px;fill:none;stroke:currentColor;
  stroke-width:6;stroke-linecap:round;stroke-linejoin:round}}
.eyebrow{{font-family:'Montserrat';font-weight:700;font-size:{eb}px;letter-spacing:.18em;
  text-transform:uppercase;color:#35d4ae}}
.headline{{font-family:'Montserrat';font-weight:900;font-size:{hl}px;line-height:1.04;
  letter-spacing:-.025em;color:#fff}}
.headline b{{color:#35d4ae;font-weight:900}}
.sub{{font-family:'Poppins';font-weight:500;font-size:{sub_sz}px;line-height:1.5;color:#CFCFCF;max-width:86%}}
.foot{{display:flex;align-items:center;justify-content:space-between;z-index:2}}
.cta{{display:inline-flex;align-items:center;gap:12px;background:#35d4ae;color:#0B0B0B;
  font-family:'Poppins';font-weight:600;font-size:{cta}px;padding:{ctap};border-radius:999px;
  box-shadow:0 14px 40px rgba(53,212,174,.28)}}
.cta .ar{{font-weight:600}}
.dom{{font-family:'Poppins';font-weight:500;font-size:{foot}px;color:#8a8a8a;letter-spacing:.01em}}
</style></head><body>
<div class="ad">
  <div class="brand"><img src="{logo_src}" alt=""><span class="wm">Mariano <b>Calandra</b></span></div>
  <div class="body">
    <div class="badge"><svg viewBox="0 0 120 120">{icon_svg}</svg></div>
    <div class="eyebrow">{eyebrow}</div>
    <div class="headline">{headline}</div>
    <div class="sub">{sub}</div>
  </div>
  <div class="foot">
    <span class="cta">Agendá una llamada <span class="ar">&rarr;</span></span>
    <span class="dom">marianocalandra.com</span>
  </div>
</div>
</body></html>"""

count = 0
for slug, icon, eyebrow, headline, sub in SERVICES:
    for fmt, m in FMT.items():
        html = TPL.format(
            font_face=font_face, logo_src=LOGO, icon_svg=ICONS[icon],
            eyebrow=eyebrow, headline=headline, sub=sub,
            w=m["w"], h=m["h"], pad=m["pad"], glow=m["glow"], badge=m["badge"],
            icon=m["icon"], eb=m["eb"], hl=m["hl"], sub_sz=m["sub"], cta=m["cta"],
            ctap=m["ctap"], foot=m["foot"], logo=m["logo"], wm=m["wm"], gap=m["gap"],
        )
        (BUILD / f"{slug}-{fmt}.html").write_text(html, encoding="utf-8")
        count += 1
print(f"generados {count} HTML")
