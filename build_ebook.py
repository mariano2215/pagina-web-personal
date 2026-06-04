#!/usr/bin/env python3
"""
Generador del e-book "Paid Media sin humo" — Mariano Calandra.
Estética: dark minimalista premium, verde menta, blanco, gris.
Formato: A4 vertical, ~38 páginas editoriales.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import simpleSplit
import os

# ===================== PALETA =====================
BG          = HexColor("#0B0F14")   # fondo dark principal
BG_SOFT     = HexColor("#111720")   # bloques secundarios
MINT        = HexColor("#34D399")   # verde menta protagonista
MINT_DEEP   = HexColor("#10B981")   # verde menta más profundo
WHITE       = HexColor("#FFFFFF")
GRAY_LIGHT  = HexColor("#D1D5DB")   # texto cuerpo
GRAY_MED    = HexColor("#6B7280")   # apoyos / folios
LINE        = HexColor("#1F2933")   # líneas finas

# ===================== TIPOGRAFÍAS =====================
# Intentamos registrar Poppins; fallback a Helvetica.
FONT_REG, FONT_MED, FONT_SB, FONT_B, FONT_XB = (
    "Helvetica", "Helvetica", "Helvetica-Bold", "Helvetica-Bold", "Helvetica-Bold"
)

def try_register_poppins():
    global FONT_REG, FONT_MED, FONT_SB, FONT_B, FONT_XB
    candidates = [
        "/Library/Fonts", "/System/Library/Fonts", "/System/Library/Fonts/Supplemental",
        os.path.expanduser("~/Library/Fonts"),
    ]
    families = {
        "Poppins-Regular.ttf":    "PoppinsRegular",
        "Poppins-Medium.ttf":     "PoppinsMedium",
        "Poppins-SemiBold.ttf":   "PoppinsSemiBold",
        "Poppins-Bold.ttf":       "PoppinsBold",
        "Poppins-ExtraBold.ttf":  "PoppinsExtraBold",
    }
    found = {}
    for d in candidates:
        if not os.path.isdir(d): continue
        for fname, alias in families.items():
            p = os.path.join(d, fname)
            if os.path.isfile(p) and alias not in found:
                try:
                    pdfmetrics.registerFont(TTFont(alias, p))
                    found[alias] = True
                except Exception:
                    pass
    if found:
        if "PoppinsRegular"    in found: FONT_REG = "PoppinsRegular"
        if "PoppinsMedium"     in found: FONT_MED = "PoppinsMedium"
        if "PoppinsSemiBold"   in found: FONT_SB  = "PoppinsSemiBold"
        if "PoppinsBold"       in found: FONT_B   = "PoppinsBold"
        if "PoppinsExtraBold"  in found: FONT_XB  = "PoppinsExtraBold"

try_register_poppins()

# ===================== CONSTANTES PÁGINA =====================
PAGE_W, PAGE_H = A4
MARGIN_X = 22 * mm
MARGIN_TOP = 22 * mm
MARGIN_BOTTOM = 22 * mm
CONTENT_W = PAGE_W - 2 * MARGIN_X

# ===================== HELPERS =====================
def fill_bg(c):
    c.setFillColor(BG)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

def header(c, label="MARKETING CLARO · CRECIMIENTO REAL"):
    c.setFont(FONT_SB, 7.5)
    c.setFillColor(MINT)
    c.drawString(MARGIN_X, PAGE_H - MARGIN_TOP + 6*mm, label)
    c.setStrokeColor(LINE)
    c.setLineWidth(0.4)
    c.line(MARGIN_X, PAGE_H - MARGIN_TOP + 2*mm, PAGE_W - MARGIN_X, PAGE_H - MARGIN_TOP + 2*mm)

def footer(c, page_num, total=None):
    c.setFont(FONT_SB, 7.5)
    c.setFillColor(GRAY_MED)
    c.drawString(MARGIN_X, MARGIN_BOTTOM - 10*mm, "MARIANOCALANDRA.COM")
    if page_num is not None:
        right = f"{page_num:02d}"
        if total: right = f"{page_num:02d} / {total:02d}"
        c.drawRightString(PAGE_W - MARGIN_X, MARGIN_BOTTOM - 10*mm, right)
    c.setStrokeColor(LINE)
    c.setLineWidth(0.4)
    c.line(MARGIN_X, MARGIN_BOTTOM - 6*mm, PAGE_W - MARGIN_X, MARGIN_BOTTOM - 6*mm)

def wrap(text, font, size, max_w):
    return simpleSplit(text, font, size, max_w)

def draw_paragraph(c, text, x, y, w, font=None, size=10.5, leading=15, color=None):
    font = font or FONT_REG
    color = color or GRAY_LIGHT
    c.setFont(font, size)
    c.setFillColor(color)
    lines = wrap(text, font, size, w)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y

def draw_title(c, text, x, y, w, size=34, color=None, font=None, leading=None):
    font = font or FONT_XB
    color = color or WHITE
    leading = leading or int(size * 1.05)
    c.setFont(font, size)
    c.setFillColor(color)
    lines = wrap(text, font, size, w)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y

def draw_title_mixed(c, parts, x, y, w, size=34, leading=None, font=None):
    """parts: list of (text, color). Concatena en una línea, wrap simple sobre el conjunto."""
    font = font or FONT_XB
    leading = leading or int(size * 1.05)
    full = "".join(p[0] for p in parts)
    c.setFont(font, size)
    lines = wrap(full, font, size, w)
    # Para colorear, reconstruimos buscando coincidencias por offsets.
    # Simplificación: marcamos por línea y reasignamos color a las palabras MINT.
    mint_words = set()
    for txt, col in parts:
        if col == MINT:
            for w_ in txt.split():
                if w_.strip(): mint_words.add(w_.strip(".,—:"))
    for line in lines:
        cur_x = x
        for word in line.split(" "):
            clean = word.strip(".,—:")
            color = MINT if clean in mint_words else WHITE
            c.setFillColor(color)
            c.setFont(font, size)
            c.drawString(cur_x, y, word)
            cur_x += c.stringWidth(word + " ", font, size)
        y -= leading
    return y

def draw_chapter_label(c, num, label, x, y):
    c.setFont(FONT_XB, 72)
    c.setFillColor(MINT)
    c.drawString(x, y, num)
    c.setFont(FONT_SB, 8.5)
    c.setFillColor(GRAY_MED)
    c.drawString(x, y - 8*mm, label.upper())

def callout_box(c, text, x, y, w, h, accent=MINT, label=None, label_color=None):
    # Marco
    c.setStrokeColor(accent)
    c.setLineWidth(1.0)
    c.setFillColor(BG_SOFT)
    c.rect(x, y - h, w, h, fill=1, stroke=1)
    # Barra lateral
    c.setFillColor(accent)
    c.rect(x, y - h, 3, h, fill=1, stroke=0)
    cur_y = y - 7*mm
    if label:
        c.setFont(FONT_SB, 8)
        c.setFillColor(label_color or accent)
        c.drawString(x + 7*mm, cur_y, label.upper())
        cur_y -= 6*mm
    c.setFont(FONT_SB, 11)
    c.setFillColor(WHITE)
    lines = wrap(text, FONT_SB, 11, w - 14*mm)
    for ln in lines:
        c.drawString(x + 7*mm, cur_y, ln)
        cur_y -= 14
    return cur_y

def soft_box(c, x, y, w, h, fill=BG_SOFT, stroke=LINE):
    c.setStrokeColor(stroke)
    c.setLineWidth(0.5)
    c.setFillColor(fill)
    c.rect(x, y - h, w, h, fill=1, stroke=1)

def bullet_list(c, items, x, y, w, size=10.5, leading=15, gap=4):
    for it in items:
        # bullet
        c.setFillColor(MINT)
        c.circle(x + 2, y + size/3 - 1, 1.6, fill=1, stroke=0)
        # text
        c.setFont(FONT_REG, size)
        c.setFillColor(GRAY_LIGHT)
        lines = wrap(it, FONT_REG, size, w - 10*mm)
        for i, ln in enumerate(lines):
            c.drawString(x + 8*mm, y, ln)
            if i < len(lines) - 1: y -= leading
        y -= leading + gap
    return y

def numbered_list(c, items, x, y, w, size=10.5, leading=15, gap=5, start=1):
    for idx, it in enumerate(items):
        i = idx + start
        c.setFont(FONT_XB, 12)
        c.setFillColor(MINT)
        c.drawString(x, y, f"{i:02d}")
        c.setFont(FONT_REG, size)
        c.setFillColor(GRAY_LIGHT)
        lines = wrap(it, FONT_REG, size, w - 14*mm)
        for j, ln in enumerate(lines):
            c.drawString(x + 12*mm, y, ln)
            if j < len(lines) - 1: y -= leading
        y -= leading + gap
    return y

def checklist(c, items, x, y, w, size=10.5, leading=15, gap=5):
    for it in items:
        # check box
        c.setStrokeColor(MINT)
        c.setLineWidth(0.9)
        c.rect(x, y - 2, 8, 8, fill=0, stroke=1)
        c.setFont(FONT_REG, size)
        c.setFillColor(GRAY_LIGHT)
        lines = wrap(it, FONT_REG, size, w - 14*mm)
        for j, ln in enumerate(lines):
            c.drawString(x + 12, y, ln)
            if j < len(lines) - 1: y -= leading
        y -= leading + gap
    return y

def draw_table(c, headers, rows, x, y, col_widths, row_h=11*mm, head_h=10*mm, font_size=9.2):
    total_w = sum(col_widths)
    # Header
    c.setFillColor(MINT)
    c.rect(x, y - head_h, total_w, head_h, fill=1, stroke=0)
    cx = x
    c.setFont(FONT_SB, font_size)
    c.setFillColor(BG)
    for i, h in enumerate(headers):
        lines = wrap(h, FONT_SB, font_size, col_widths[i] - 6*mm)
        ty = y - head_h/2 + (len(lines)-1)*5 + 1
        for ln in lines:
            c.drawString(cx + 3*mm, ty, ln)
            ty -= 11
        cx += col_widths[i]
    y -= head_h
    # Rows
    for ri, row in enumerate(rows):
        bgc = BG_SOFT if ri % 2 == 0 else BG
        c.setFillColor(bgc)
        c.rect(x, y - row_h, total_w, row_h, fill=1, stroke=0)
        c.setStrokeColor(LINE)
        c.setLineWidth(0.3)
        c.line(x, y - row_h, x + total_w, y - row_h)
        cx = x
        for i, cell in enumerate(row):
            lines = wrap(str(cell), FONT_REG, font_size, col_widths[i] - 6*mm)
            ty = y - row_h/2 + (len(lines)-1)*5 + 1
            c.setFont(FONT_REG, font_size)
            c.setFillColor(GRAY_LIGHT)
            for ln in lines:
                c.drawString(cx + 3*mm, ty, ln)
                ty -= 11
            cx += col_widths[i]
        y -= row_h
    # Marco exterior
    c.setStrokeColor(LINE)
    c.setLineWidth(0.5)
    c.rect(x, y, total_w, (head_h + row_h*len(rows)), fill=0, stroke=1)
    return y

def page_eyebrow(c, text):
    c.setFont(FONT_SB, 8)
    c.setFillColor(MINT)
    c.drawString(MARGIN_X, PAGE_H - MARGIN_TOP - 4*mm, text.upper())

# ===================== PÁGINAS =====================
def page_portada(c):
    fill_bg(c)
    # banda superior
    c.setFont(FONT_SB, 9)
    c.setFillColor(MINT)
    c.drawString(MARGIN_X, PAGE_H - 30*mm, "MARKETING CLARO  ·  CRECIMIENTO REAL")
    # marco interior
    c.setStrokeColor(LINE)
    c.setLineWidth(0.5)
    c.line(MARGIN_X, PAGE_H - 33*mm, PAGE_W - MARGIN_X, PAGE_H - 33*mm)

    # título gigantesco
    title_y = PAGE_H - 90*mm
    c.setFont(FONT_XB, 78)
    c.setFillColor(WHITE)
    c.drawString(MARGIN_X, title_y, "PAID MEDIA")
    c.setFillColor(MINT)
    c.drawString(MARGIN_X, title_y - 72, "SIN HUMO.")

    # subtítulo
    c.setFont(FONT_SB, 13)
    c.setFillColor(GRAY_LIGHT)
    sub_y = title_y - 72 - 28*mm
    sub_lines = wrap(
        "Guía completa para convertir publicidad digital en crecimiento real.",
        FONT_SB, 13, CONTENT_W - 30*mm)
    for ln in sub_lines:
        c.drawString(MARGIN_X, sub_y, ln); sub_y -= 18

    # bloque inferior con autor
    c.setStrokeColor(MINT)
    c.setLineWidth(1.2)
    c.line(MARGIN_X, 70*mm, MARGIN_X + 30*mm, 70*mm)

    c.setFont(FONT_XB, 18)
    c.setFillColor(WHITE)
    c.drawString(MARGIN_X, 56*mm, "MARIANO CALANDRA")

    c.setFont(FONT_SB, 9.5)
    c.setFillColor(GRAY_LIGHT)
    c.drawString(MARGIN_X, 48*mm, "Paid Media  ·  Estrategia de Marketing  ·  Consultoría Comercial")

    c.setFont(FONT_SB, 10)
    c.setFillColor(MINT)
    c.drawString(MARGIN_X, 36*mm, "www.marianocalandra.com")

    # acento decorativo derecho
    c.setStrokeColor(MINT)
    c.setLineWidth(0.7)
    for i in range(8):
        y = 90*mm + i * 8
        c.line(PAGE_W - MARGIN_X - 40*mm + i*5, y, PAGE_W - MARGIN_X, y)

    c.setFont(FONT_SB, 7.5)
    c.setFillColor(GRAY_MED)
    c.drawRightString(PAGE_W - MARGIN_X, 22*mm, "EDICIÓN 2026  ·  E-BOOK GRATUITO")

def page_manifiesto(c, num):
    fill_bg(c); header(c); footer(c, num)
    y = PAGE_H - 55*mm
    page_eyebrow(c, "Manifiesto")
    y = draw_title(c, "Invertir en publicidad no es", MARGIN_X, y, CONTENT_W, size=30, color=WHITE)
    y = draw_title(c, "lo mismo que hacer marketing.", MARGIN_X, y, CONTENT_W, size=30, color=MINT)
    y -= 8*mm
    parrafo = ("Hay negocios que invierten miles de pesos por mes en publicidad digital y "
               "no saben con precisión qué campaña funciona, qué creativo convierte ni cuánto "
               "vale realmente un cliente. Hacen ruido, pero no construyen distribución. "
               "Aceleran sin tablero. Apuestan sin método.")
    y = draw_paragraph(c, parrafo, MARGIN_X, y, CONTENT_W, size=11, leading=17)
    y -= 4*mm
    parrafo2 = ("Paid Media es otra cosa. Es decidir con datos, comprar atención con criterio, "
                "medir cada acción y mejorar de manera progresiva. Es estrategia, no impulso. "
                "Es sistema, no suerte.")
    y = draw_paragraph(c, parrafo2, MARGIN_X, y, CONTENT_W, size=11, leading=17)
    y -= 10*mm
    callout_box(c,
        "Una campaña no se mide por cuánto gasta. Se mide por cuánto aprende, cuánto convierte y cuánto aporta al negocio.",
        MARGIN_X, y, CONTENT_W, 46*mm, accent=MINT, label="Idea fuerza")
    # firma
    c.setStrokeColor(MINT); c.setLineWidth(0.8)
    c.line(MARGIN_X, 60*mm, MARGIN_X + 18*mm, 60*mm)
    c.setFont(FONT_XB, 12); c.setFillColor(WHITE)
    c.drawString(MARGIN_X, 52*mm, "MARIANO CALANDRA")
    c.setFont(FONT_SB, 8.5); c.setFillColor(GRAY_MED)
    c.drawString(MARGIN_X, 46*mm, "Paid Media  ·  Estrategia  ·  Consultoría")

def page_intro(c, num):
    fill_bg(c); header(c); footer(c, num)
    page_eyebrow(c, "Introducción")
    y = PAGE_H - 55*mm
    y = draw_title(c, "Por qué existe", MARGIN_X, y, CONTENT_W, size=34, color=WHITE)
    y = draw_title(c, "esta guía.", MARGIN_X, y, CONTENT_W, size=34, color=MINT)
    y -= 6*mm
    paras = [
        ("Esta guía nace para responder una pregunta que se repite en pymes, ecommerce, "
         "profesionales y empresas que invierten en publicidad digital: ¿cómo saber si esa "
         "inversión está funcionando de verdad?"),
        ("A lo largo de las próximas páginas vas a encontrar un sistema simple, profundo y "
         "aplicable para planificar campañas, elegir plataformas, definir audiencias, diseñar "
         "creatividades, medir resultados y optimizar con criterio comercial."),
        ("No es un manual lleno de definiciones desconectadas. Es una hoja de ruta para tomar "
         "decisiones mejores. Sirve si recién empezás a invertir, si querés ordenar una "
         "estrategia existente o si necesitás repensar lo que viene haciendo tu equipo."),
        ("Leelo de corrido o por capítulos. Marcalo. Volvé. Aplicalo. Una buena estrategia "
         "de Paid Media no se memoriza: se construye con cada test, cada métrica y cada "
         "ajuste."),
    ]
    for p in paras:
        y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.8, leading=16)
        y -= 4*mm
    callout_box(c,
        "Leé, aplicá, medí y mejorá. La publicidad digital funciona mejor cuando deja de improvisarse.",
        MARGIN_X, y - 2*mm, CONTENT_W, 28*mm, accent=MINT, label="Cómo usar esta guía")

def page_importancia(c, num):
    fill_bg(c); header(c); footer(c, num)
    page_eyebrow(c, "Por qué importa")
    y = PAGE_H - 55*mm
    y = draw_title(c, "La visibilidad orgánica ayuda.", MARGIN_X, y, CONTENT_W, size=24, color=WHITE)
    y = draw_title(c, "La distribución paga acelera.", MARGIN_X, y, CONTENT_W, size=24, color=MINT)
    y -= 6*mm
    p1 = ("Las plataformas digitales premian el contenido orgánico que ya tiene tracción y "
          "limitan el alcance del que recién empieza. En ese contexto, el Paid Media cumple "
          "una función concreta: ponerle distribución a un mensaje que el algoritmo, por sí "
          "solo, no va a empujar.")
    p2 = ("Cuando hay estrategia, una campaña paga permite llegar a audiencias específicas, "
          "medir cada interacción, identificar qué creativo convierte mejor y construir "
          "datos propios para iterar. Cuando no hay estrategia, sólo acelera la pérdida de "
          "dinero.")
    p3 = ("Para una pyme, un ecommerce o un servicio profesional, esto puede significar "
          "ordenar el flujo comercial, mejorar la previsibilidad y dejar de depender "
          "exclusivamente de referidos o de redes sin pauta.")
    for p in [p1, p2, p3]:
        y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.8, leading=16)
        y -= 4*mm
    y -= 2*mm
    callout_box(c,
        "Paid Media no reemplaza una buena oferta. La potencia.",
        MARGIN_X, y, CONTENT_W, 24*mm, accent=MINT, label="Recordá")

def page_objetivos(c, num):
    fill_bg(c); header(c); footer(c, num)
    page_eyebrow(c, "Objetivos del e-book")
    y = PAGE_H - 55*mm
    y = draw_title(c, "Qué vas a poder hacer", MARGIN_X, y, CONTENT_W, size=26, color=WHITE)
    y = draw_title(c, "después de leer esta guía.", MARGIN_X, y, CONTENT_W, size=26, color=MINT)
    y -= 8*mm
    items = [
        "Entender el ecosistema de publicidad digital y el rol de cada plataforma.",
        "Elegir canales en función del negocio, del público y de la intención del usuario.",
        "Traducir objetivos comerciales en objetivos publicitarios medibles.",
        "Organizar campañas por etapas del funnel: descubrir, considerar, convertir, retener.",
        "Diseñar creatividades y copies orientados a resultados, no a vanidad.",
        "Instalar una lógica básica de medición con GA4, Tag Manager y píxeles.",
        "Leer métricas sin perderte en datos irrelevantes ni reportes interminables.",
        "Optimizar y escalar con criterio cuando algo realmente funciona.",
        "Evitar los errores que hacen perder presupuesto y reputación.",
    ]
    y = numbered_list(c, items, MARGIN_X, y, CONTENT_W, size=10.7, leading=15, gap=5)

def page_indice(c, num):
    fill_bg(c); header(c); footer(c, num)
    page_eyebrow(c, "Índice")
    y = PAGE_H - 55*mm
    y = draw_title(c, "Lo que vas a", MARGIN_X, y, CONTENT_W, size=34, color=WHITE)
    y = draw_title(c, "encontrar.", MARGIN_X, y, CONTENT_W, size=34, color=MINT)
    y -= 8*mm
    entries = [
        ("01", "Paid Media: pagar por atención con estrategia", "07"),
        ("02", "Estrategia antes de la campaña", "09"),
        ("03", "Funnel y recorrido del cliente", "11"),
        ("04", "Ecosistema de plataformas publicitarias", "13"),
        ("05", "Meta Ads", "14"),
        ("06", "Google Ads", "16"),
        ("07", "TikTok Ads", "19"),
        ("08", "LinkedIn Ads y Microsoft Advertising", "21"),
        ("09", "Creatividades y copy publicitario", "22"),
        ("10", "Landing pages y conversión", "25"),
        ("11", "Medición: GA4, GTM, píxeles y APIs", "27"),
        ("12", "Métricas y análisis", "30"),
        ("13", "Optimización", "32"),
        ("14", "Presupuesto y escalabilidad", "34"),
        ("15", "Errores frecuentes", "35"),
        ("16", "Plan de acción práctico", "36"),
        ("17", "Glosario esencial de Paid Media", "38"),
    ]
    for n, title, pg in entries:
        c.setFont(FONT_XB, 12); c.setFillColor(MINT)
        c.drawString(MARGIN_X, y, n)
        c.setFont(FONT_SB, 10.5); c.setFillColor(WHITE)
        c.drawString(MARGIN_X + 14*mm, y, title)
        c.setFont(FONT_SB, 9.5); c.setFillColor(GRAY_MED)
        c.drawRightString(PAGE_W - MARGIN_X, y, pg)
        c.setStrokeColor(LINE); c.setLineWidth(0.3)
        c.line(MARGIN_X, y - 3, PAGE_W - MARGIN_X, y - 3)
        y -= 10*mm

# ---------- helpers de capítulo ----------
def chapter_header(c, num, label, title_top, title_bot=None):
    page_eyebrow(c, f"Capítulo {int(num):02d}")
    # número grande
    c.setFont(FONT_XB, 64)
    c.setFillColor(MINT)
    c.drawString(MARGIN_X, PAGE_H - 72*mm, f"{int(num):02d}.")
    # título
    y = PAGE_H - 86*mm
    if title_bot:
        y = draw_title(c, title_top, MARGIN_X, y, CONTENT_W, size=22, color=WHITE)
        y = draw_title(c, title_bot, MARGIN_X, y, CONTENT_W, size=22, color=MINT)
    else:
        y = draw_title(c, title_top, MARGIN_X, y, CONTENT_W, size=22, color=WHITE)
    # subrayado mint
    c.setStrokeColor(MINT); c.setLineWidth(1.2)
    c.line(MARGIN_X, y - 2*mm, MARGIN_X + 22*mm, y - 2*mm)
    return y - 10*mm

# ===================== CAPÍTULOS =====================
def page_c01(c, num):
    fill_bg(c); header(c); footer(c, num)
    y = chapter_header(c, 1, "Qué es Paid Media", "Paid Media: pagar por atención", "con una estrategia detrás.")
    p1 = ("Paid Media es toda forma de distribución de contenido y mensajes a cambio de una "
          "inversión publicitaria. Se diferencia de los medios propios (Owned) — web, blog, "
          "base de mails, redes sociales — y de los medios ganados (Earned), que son las "
          "menciones, recomendaciones y prensa que no se pagan directamente.")
    p2 = ("Cuando una marca pauta, lo que compra no es solamente un espacio: compra atención, "
          "datos, oportunidades comerciales y la posibilidad de iterar. Por eso, una campaña "
          "que sólo persigue alcance suele rendir menos que una que persigue aprendizaje y "
          "conversión.")
    p3 = ("La diferencia entre 'pautar' y hacer Paid Media estratégico es enorme: pautar es "
          "apretar el botón de promocionar. Hacer Paid Media es definir objetivo, audiencia, "
          "mensaje, formato, medición y plan de optimización.")
    for p in [p1, p2, p3]:
        y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.6, leading=16)
        y -= 4*mm
    y -= 2*mm
    callout_box(c,
        "No todo clic es una oportunidad. No toda impresión construye negocio.",
        MARGIN_X, y, CONTENT_W, 24*mm, accent=MINT, label="Clave")

def page_objetivos_publicitarios(c, num):
    fill_bg(c); header(c); footer(c, num)
    page_eyebrow(c, "Objetivos publicitarios")
    y = PAGE_H - 55*mm
    y = draw_title(c, "El objetivo define", MARGIN_X, y, CONTENT_W, size=28, color=WHITE)
    y = draw_title(c, "todo lo demás.", MARGIN_X, y, CONTENT_W, size=28, color=MINT)
    y -= 6*mm
    p = ("Cada plataforma ofrece un menú de objetivos publicitarios. La elección no es "
         "técnica: es estratégica. Cambiar el objetivo cambia el tipo de usuario al que "
         "se le muestra el anuncio, las pujas, la forma de medir y los resultados a esperar.")
    y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.6, leading=16)
    y -= 6*mm
    # listado breve
    bullets = ["Reconocimiento y alcance", "Reproducciones de video", "Tráfico al sitio",
               "Interacción y comunidad", "Generación de leads", "Conversaciones y mensajes",
               "Ventas y conversiones", "Remarketing y retención"]
    # grid 2 columnas
    col_x = [MARGIN_X, MARGIN_X + CONTENT_W/2 + 4*mm]
    col_w = CONTENT_W/2 - 4*mm
    half = (len(bullets)+1)//2
    bullet_list(c, bullets[:half], col_x[0], y, col_w, size=10, leading=14, gap=2)
    bullet_list(c, bullets[half:], col_x[1], y, col_w, size=10, leading=14, gap=2)
    y -= (half * 16) + 8*mm
    # Tabla objetivo → métrica
    headers = ["Objetivo de negocio", "Objetivo publicitario", "Métrica prioritaria"]
    rows = [
        ["Reconocimiento", "Alcance / video views", "Alcance, frecuencia, CPM"],
        ["Consultas", "Leads / mensajes", "CPL, tasa de contacto, calidad"],
        ["Ventas online", "Ventas / conversiones", "CPA, ROAS, ingresos"],
        ["Recompra", "Remarketing", "CPA recurrente, valor del cliente"],
    ]
    draw_table(c, headers, rows, MARGIN_X, y, [CONTENT_W*0.30, CONTENT_W*0.34, CONTENT_W*0.36], row_h=12*mm)

def page_c02(c, num):
    fill_bg(c); header(c); footer(c, num)
    y = chapter_header(c, 2, "Estrategia antes de la campaña", "Antes del anuncio,", "entendé el negocio.")
    p1 = ("Una campaña empieza antes de abrir el administrador de anuncios. Empieza con un "
          "diagnóstico del negocio: qué se vende, qué margen deja, cuánto vale un cliente, "
          "qué capacidad operativa hay para atender demanda y dónde convierte realmente la "
          "audiencia.")
    p2 = ("Cuando ese diagnóstico está claro, la campaña se vuelve consecuencia de una "
          "decisión comercial. Cuando no, la campaña se vuelve una apuesta que se gana "
          "o se pierde por azar.")
    for p in [p1, p2]:
        y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.6, leading=16); y -= 4*mm
    y -= 2*mm
    soft_box(c, MARGIN_X, y, CONTENT_W, 80*mm)
    cy = y - 8*mm
    c.setFont(FONT_SB, 9); c.setFillColor(MINT)
    c.drawString(MARGIN_X + 8*mm, cy, "CHECKLIST DE DIAGNÓSTICO PREVIO")
    cy -= 8*mm
    items = ["Producto o servicio definido y diferenciado.",
             "Precio, margen y costo de adquisición tolerable.",
             "Capacidad operativa para atender la demanda nueva.",
             "Cliente ideal, zona geográfica y motivaciones.",
             "Objetivo comercial concreto del período.",
             "Presupuesto disponible y plazo de aprendizaje aceptado.",
             "Canal de conversión (web, WhatsApp, tienda) operativo.",
             "Medición y seguimiento comercial instalados."]
    checklist(c, items, MARGIN_X + 8*mm, cy, CONTENT_W - 14*mm, size=10, leading=14, gap=2)
    y -= 88*mm
    callout_box(c,
        "Una mala estrategia con buenos anuncios sigue siendo una mala estrategia.",
        MARGIN_X, y, CONTENT_W, 22*mm, accent=MINT, label="Recordá")

def page_diagnostico(c, num):
    fill_bg(c); header(c); footer(c, num)
    page_eyebrow(c, "Diagnóstico inicial")
    y = PAGE_H - 55*mm
    y = draw_title(c, "Las preguntas correctas", MARGIN_X, y, CONTENT_W, size=24, color=WHITE)
    y = draw_title(c, "antes de invertir.", MARGIN_X, y, CONTENT_W, size=24, color=MINT)
    y -= 4*mm
    p = ("Una buena estrategia parte de buenas preguntas. Antes de definir presupuesto y "
         "plataforma, respondé estas en voz alta o por escrito.")
    y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.6, leading=15); y -= 4*mm
    preguntas = [
        "¿Qué vendés exactamente y qué problema resolvés?",
        "¿Qué producto o servicio deja mayor margen?",
        "¿Cuánto vale un cliente para el negocio en el primer año?",
        "¿Dónde convierte el usuario: web, WhatsApp, formulario, tienda, llamada?",
        "¿Cuánto puede invertir el negocio sin comprometer la operación?",
        "¿Qué objeciones frenan la compra y cómo se responden?",
        "¿Qué pasa después de recibir un lead: quién lo contacta, en cuánto tiempo, con qué argumento?",
        "¿Qué tan rápido puede atender el negocio un aumento de demanda?",
    ]
    numbered_list(c, preguntas, MARGIN_X, y, CONTENT_W, size=10.3, leading=14, gap=4)
    # callout
    callout_box(c,
        "Si no podés responder estas preguntas, la campaña no está lista. La estrategia, todavía menos.",
        MARGIN_X, 60*mm, CONTENT_W, 22*mm, accent=MINT, label="Lectura honesta")

def page_c03_funnel(c, num):
    fill_bg(c); header(c); footer(c, num)
    y = chapter_header(c, 3, "Funnel y recorrido", "No todos están listos", "para comprar hoy.")
    p = ("El recorrido del cliente tiene cuatro etapas básicas. Cada una requiere un mensaje "
         "distinto, un objetivo distinto y una métrica distinta. Empujar al usuario a comprar "
         "sin antes haberlo educado es una de las causas más frecuentes de campañas caras.")
    y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.6, leading=16); y -= 6*mm

    # Funnel visual horizontal — barras decrecientes
    stages = [
        ("Descubrimiento", "Atención + interés", MINT),
        ("Consideración",  "Comparación + confianza", MINT),
        ("Conversión",     "Compra o contacto", MINT),
        ("Retención",      "Recompra y referidos", MINT),
    ]
    bar_y = y - 26*mm
    bar_h = 14*mm
    max_w = CONTENT_W
    for i, (st, sub, col) in enumerate(stages):
        bw = max_w - (i * 22*mm)
        bx = MARGIN_X + (max_w - bw)/2
        c.setFillColor(MINT if i < 3 else MINT_DEEP)
        c.rect(bx, bar_y - i * (bar_h + 4*mm), bw, bar_h, fill=1, stroke=0)
        c.setFont(FONT_XB, 11); c.setFillColor(BG)
        c.drawString(bx + 6*mm, bar_y - i*(bar_h + 4*mm) + 5*mm, st)
        c.setFont(FONT_SB, 8.5); c.setFillColor(BG)
        c.drawRightString(bx + bw - 6*mm, bar_y - i*(bar_h + 4*mm) + 5*mm, sub)

    y2 = bar_y - 4*(bar_h + 4*mm) - 4*mm
    callout_box(c,
        "Cada etapa quiere algo distinto. Tu anuncio tiene que respetar eso.",
        MARGIN_X, y2, CONTENT_W, 22*mm, accent=MINT, label="Lectura del funnel")

def page_funnel_ejemplo(c, num):
    fill_bg(c); header(c); footer(c, num)
    page_eyebrow(c, "Ejemplo ficticio")
    y = PAGE_H - 55*mm
    y = draw_title(c, "Ecommerce de accesorios", MARGIN_X, y, CONTENT_W, size=24, color=WHITE)
    y = draw_title(c, "deportivos.", MARGIN_X, y, CONTENT_W, size=24, color=MINT)
    y -= 4*mm
    c.setFont(FONT_SB, 8); c.setFillColor(MINT)
    c.drawString(MARGIN_X, y, "EJEMPLO FICTICIO CON FINES EDUCATIVOS")
    y -= 8*mm
    p = ("Una marca ficticia que vende accesorios para entrenar en casa quiere ordenar su "
         "estrategia. Antes de empujar ventas, divide la inversión por etapa del funnel.")
    y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.4, leading=15); y -= 4*mm
    headers = ["Etapa", "Mensaje", "Formato", "Acción esperada"]
    rows = [
        ["Descubrimiento", "Conocé una forma más práctica de entrenar", "Video vertical", "Reproducción / visita"],
        ["Consideración", "Compará beneficios y elegí el modelo ideal", "Carrusel", "Ver producto"],
        ["Conversión", "Comprá online con envío disponible", "Imagen / catálogo", "Compra"],
        ["Retención", "Volvé por tu próximo accesorio", "Remarketing", "Nueva compra"],
    ]
    draw_table(c, headers, rows, MARGIN_X, y, [CONTENT_W*0.18, CONTENT_W*0.36, CONTENT_W*0.20, CONTENT_W*0.26], row_h=12*mm)
    y2 = y - 12*mm*5 - 4*mm
    callout_box(c,
        "Repartir el presupuesto por etapa permite que cada campaña haga un solo trabajo bien hecho.",
        MARGIN_X, y2 - 10*mm, CONTENT_W, 22*mm, accent=MINT, label="Aprendizaje")

def page_c04_plataformas(c, num):
    fill_bg(c); header(c); footer(c, num)
    y = chapter_header(c, 4, "Ecosistema de plataformas", "Dónde invertir según", "qué necesitás lograr.")
    p = ("No hay una plataforma 'mejor'. Hay plataformas que se ajustan mejor a cada objetivo, "
         "audiencia e intención. Conocer las fortalezas de cada una permite distribuir el "
         "presupuesto con cabeza y evitar la trampa de copiar lo que hace el competidor sin "
         "entender su contexto.")
    y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.6, leading=16); y -= 6*mm
    headers = ["Plataforma", "Fortaleza principal", "Ideal para"]
    rows = [
        ["Meta Ads", "Descubrimiento, demanda y remarketing", "Ecommerce, servicios y pymes"],
        ["Google Ads", "Captura de intención de búsqueda", "Servicios, ecommerce, demanda activa"],
        ["TikTok Ads", "Atención, video y descubrimiento", "Productos visuales y audiencias móviles"],
        ["LinkedIn Ads", "Segmentación profesional", "B2B y servicios corporativos"],
        ["Microsoft Ads", "Búsqueda complementaria", "Diversificación y mercados específicos"],
    ]
    draw_table(c, headers, rows, MARGIN_X, y, [CONTENT_W*0.22, CONTENT_W*0.42, CONTENT_W*0.36], row_h=12*mm)
    y2 = y - 12*mm*6 - 6*mm
    callout_box(c,
        "Una plataforma no es mejor que otra. Es mejor para algo. La diferencia está en el criterio con el que se elige.",
        MARGIN_X, y2 - 8*mm, CONTENT_W, 26*mm, accent=MINT, label="Criterio")

def page_c05_meta(c, num):
    fill_bg(c); header(c); footer(c, num)
    y = chapter_header(c, 5, "Meta Ads", "Generar demanda,", "conversación y conversión.")
    p1 = ("Meta Ads agrupa la publicidad en Facebook e Instagram. Su gran fuerza es la "
          "capacidad de generar demanda donde antes no existía: el usuario no está buscando "
          "tu producto, pero puede descubrirlo a través de un buen creativo.")
    p2 = ("La estructura básica se organiza en tres niveles: campaña (objetivo), conjunto de "
          "anuncios (audiencia, presupuesto, ubicaciones) y anuncio (creativo, copy, CTA). "
          "Los objetivos disponibles cambian con frecuencia, por lo que conviene validar la "
          "nomenclatura vigente dentro de la plataforma antes de configurar.")
    p3 = ("Meta funciona bien para reconocimiento, tráfico, interacción, generación de leads, "
          "conversaciones por mensajería y ventas en ecommerce. La calidad del creativo es, "
          "junto con la oferta, el factor que más explica los resultados.")
    for p in [p1, p2, p3]:
        y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.5, leading=16); y -= 4*mm
    y -= 2*mm
    callout_box(c,
        "En Meta, el anuncio no interrumpe una búsqueda: tiene que ganar atención.",
        MARGIN_X, y, CONTENT_W, 22*mm, accent=MINT, label="Clave de Meta Ads")

def page_meta_practica(c, num):
    fill_bg(c); header(c); footer(c, num)
    page_eyebrow(c, "Meta Ads en práctica")
    y = PAGE_H - 55*mm
    y = draw_title(c, "Cómo pensar una", MARGIN_X, y, CONTENT_W, size=26, color=WHITE)
    y = draw_title(c, "campaña de Meta Ads.", MARGIN_X, y, CONTENT_W, size=26, color=MINT)
    y -= 4*mm
    c.setFont(FONT_SB, 8); c.setFillColor(MINT)
    c.drawString(MARGIN_X, y, "EJEMPLO FICTICIO: ESTUDIO DE NUTRICIÓN ONLINE")
    y -= 7*mm
    p = ("Objetivo comercial: conseguir entrevistas iniciales con potenciales pacientes. "
         "Conversión principal: formulario web o conversación de WhatsApp. La campaña combina "
         "tres tipos de creatividades y dos audiencias.")
    y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.4, leading=15); y -= 5*mm
    items = [
        "Creativos: video explicativo del método, testimonio ilustrativo sin persona real, carrusel con el proceso de atención.",
        "Audiencias: zona geográfica + intereses (vida saludable, nutrición), más remarketing a visitantes recientes.",
        "Métricas: costo por conversación, costo por lead, calidad del contacto y tasa de cierre comercial.",
        "Aprendizaje: el video explicativo baja el CPL un 30% versus la imagen estática, en un test ficticio interno.",
    ]
    y = bullet_list(c, items, MARGIN_X, y, CONTENT_W, size=10.3, leading=14, gap=3)
    y -= 2*mm
    soft_box(c, MARGIN_X, y, CONTENT_W, 58*mm)
    cy = y - 8*mm
    c.setFont(FONT_SB, 9); c.setFillColor(MINT)
    c.drawString(MARGIN_X + 8*mm, cy, "CHECKLIST DE LANZAMIENTO EN META")
    cy -= 6*mm
    checklist(c,
        ["Objetivo de campaña definido y validado contra el objetivo comercial.",
         "Creativos cargados con sus variantes y copies revisados.",
         "URL de destino o WhatsApp correctos y testeados.",
         "Pixel y/o Conversions API configurados y verificando eventos.",
         "Presupuesto asignado por conjunto y nomenclatura ordenada."],
        MARGIN_X + 8*mm, cy, CONTENT_W - 14*mm, size=9.8, leading=13, gap=2)

def page_c06_google(c, num):
    fill_bg(c); header(c); footer(c, num)
    y = chapter_header(c, 6, "Google Ads", "Aparecer cuando ya", "existe intención.")
    p1 = ("Google Ads se diferencia de Meta en algo clave: la mayor parte de su inventario "
          "captura demanda existente. El usuario está buscando una solución y tu anuncio "
          "intenta ser la respuesta más relevante.")
    p2 = ("Las principales categorías de campaña son: Search para capturar consultas activas; "
          "Performance Max, una campaña automatizada orientada a objetivos que distribuye "
          "anuncios en el inventario de Google; Shopping para ecommerce con feed; y YouTube "
          "y Demand Gen para descubrimiento y consideración, según disponibilidad vigente.")
    p3 = ("El éxito en Google depende de tres factores combinados: una buena selección de "
          "palabras clave o señales, un anuncio relevante y una landing page coherente con "
          "lo prometido.")
    for p in [p1, p2, p3]:
        y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.5, leading=16); y -= 4*mm
    callout_box(c,
        "En Google, una búsqueda puede revelar una necesidad inmediata. Tu anuncio tiene que ser la respuesta correcta.",
        MARGIN_X, y, CONTENT_W, 26*mm, accent=MINT, label="Clave de Google")

def page_google_search(c, num):
    fill_bg(c); header(c); footer(c, num)
    page_eyebrow(c, "Google Search")
    y = PAGE_H - 55*mm
    y = draw_title(c, "La intención detrás", MARGIN_X, y, CONTENT_W, size=26, color=WHITE)
    y = draw_title(c, "de una búsqueda.", MARGIN_X, y, CONTENT_W, size=26, color=MINT)
    y -= 4*mm
    p = ("Las búsquedas se dividen en informativas, comerciales y transaccionales. Identificar "
         "qué tipo de intención hay detrás de cada palabra clave permite escribir anuncios y "
         "diseñar landings adecuadas para cada momento del recorrido.")
    y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.4, leading=15); y -= 5*mm
    items = [
        "Trabajá las concordancias y los términos de búsqueda; verificá las opciones vigentes dentro de la plataforma.",
        "Sumá palabras clave negativas para evitar gastar en búsquedas irrelevantes.",
        "Usá anuncios de búsqueda responsivos con varias variantes de título y descripción.",
        "Incorporá recursos o extensiones de anuncio para ampliar el espacio visual.",
        "Diseñá una landing por grupo de palabras o por intención, no por capricho estético.",
    ]
    y = bullet_list(c, items, MARGIN_X, y, CONTENT_W, size=10.3, leading=14, gap=3)
    y -= 2*mm
    c.setFont(FONT_SB, 8); c.setFillColor(MINT)
    c.drawString(MARGIN_X, y, "EJEMPLO FICTICIO: REPARACIÓN DE AIRES ACONDICIONADOS EN CÓRDOBA")
    y -= 7*mm
    headers = ["Búsqueda", "Titular del anuncio", "Conversión"]
    rows = [
        ["reparación aire acondicionado urgente", "Reparación en el día · Técnicos certificados", "Llamada"],
        ["instalación split zona norte", "Instalación profesional · Presupuesto sin cargo", "Formulario"],
        ["service heladeras económico", "(palabra clave negativa: queremos foco en AC)", "—"],
    ]
    draw_table(c, headers, rows, MARGIN_X, y, [CONTENT_W*0.36, CONTENT_W*0.44, CONTENT_W*0.20], row_h=12*mm, font_size=9)

def page_google_pmax(c, num):
    fill_bg(c); header(c); footer(c, num)
    page_eyebrow(c, "Más allá de Search")
    y = PAGE_H - 55*mm
    y = draw_title(c, "Performance Max, Shopping,", MARGIN_X, y, CONTENT_W, size=22, color=WHITE)
    y = draw_title(c, "YouTube y Demand Gen.", MARGIN_X, y, CONTENT_W, size=22, color=MINT)
    y -= 6*mm
    bloques = [
        ("Performance Max",
         "Campaña automatizada orientada a objetivos: definí conversión, cargá señales de audiencia, "
         "subí assets de calidad y, si aplica, conectá feed. La automatización mejora cuando se la "
         "alimenta con buenos datos."),
        ("Shopping",
         "Pensada para ecommerce con catálogo. Requiere Merchant Center y un feed de productos prolijo "
         "con título, descripción, precio, imagen y stock. La calidad del feed es el factor que más "
         "explica los resultados."),
        ("YouTube",
         "Útil para video, alcance y consideración. Sirve también para acción cuando el formato "
         "incluye CTA y la landing está preparada para tráfico de video."),
        ("Demand Gen",
         "Formatos visuales y video para generar demanda en superficies disponibles del ecosistema "
         "Google. Validá las opciones vigentes antes de configurar."),
    ]
    for titulo, desc in bloques:
        c.setFont(FONT_XB, 11); c.setFillColor(MINT)
        c.drawString(MARGIN_X, y, titulo)
        y -= 5*mm
        y = draw_paragraph(c, desc, MARGIN_X, y, CONTENT_W, size=10.2, leading=14.5)
        y -= 5*mm
    callout_box(c,
        "Las plataformas modifican formatos, nombres y disponibilidades. Antes de implementar, verificá la configuración actual.",
        MARGIN_X, y, CONTENT_W, 26*mm, accent=MINT, label="Aviso editorial")

def page_c07_tiktok(c, num):
    fill_bg(c); header(c); footer(c, num)
    y = chapter_header(c, 7, "TikTok Ads", "Atención, creatividad y", "velocidad de aprendizaje.")
    p1 = ("TikTok es, ante todo, una plataforma de consumo audiovisual vertical. El primer "
          "segundo de un anuncio explica gran parte de su rendimiento. Si no engancha, no "
          "importa cuánto cueste: no va a convertir.")
    p2 = ("Los objetivos de campaña incluyen alcance, tráfico, generación de leads y "
          "conversiones, entre otros. La medición se complementa con TikTok Pixel y Events "
          "API para registrar acciones en el sitio cuando aplica.")
    p3 = ("El ritmo de aprendizaje en TikTok es alto: necesitás más creatividades por mes "
          "que en otras plataformas. La estrategia gana cuando hay un sistema de producción "
          "constante y un calendario de testeo claro.")
    for p in [p1, p2, p3]:
        y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.5, leading=16); y -= 4*mm
    callout_box(c,
        "En TikTok, parecer publicidad tradicional suele ser menos potente que parecer contenido valioso.",
        MARGIN_X, y, CONTENT_W, 26*mm, accent=MINT, label="Clave de TikTok")

def page_tiktok_creatividades(c, num):
    fill_bg(c); header(c); footer(c, num)
    page_eyebrow(c, "Creatividades para TikTok")
    y = PAGE_H - 55*mm
    y = draw_title(c, "El primer segundo", MARGIN_X, y, CONTENT_W, size=26, color=WHITE)
    y = draw_title(c, "compite por la atención.", MARGIN_X, y, CONTENT_W, size=26, color=MINT)
    y -= 5*mm
    p = ("Una estructura simple que funciona en video vertical: gancho, problema, "
         "demostración, prueba, CTA. La idea no es que el anuncio sea hermoso. Es que "
         "respete el código de la plataforma.")
    y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.3, leading=14); y -= 5*mm
    c.setFont(FONT_SB, 8); c.setFillColor(MINT)
    c.drawString(MARGIN_X, y, "EJEMPLOS FICTICIOS — SOLO CON FINES EDUCATIVOS")
    y -= 7*mm
    ejemplos = [
        ("Ecommerce de organización del hogar",
         "Gancho: 'Si tu placard te estresa, mirá esto'. Demostración del antes y después con producto. CTA: 'Mirá la colección'."),
        ("Academia online de idiomas",
         "Gancho: '3 errores que cometés al aprender un idioma'. Explicación breve con texto en pantalla. CTA: 'Probá una clase muestra'."),
        ("Marca de alimentos saludables",
         "Gancho: '¿Comés sano y todavía no ves resultados?'. Ejemplo de receta de 30 segundos. CTA: 'Conocé la línea completa'."),
    ]
    for titulo, desc in ejemplos:
        c.setFont(FONT_XB, 10.5); c.setFillColor(WHITE)
        c.drawString(MARGIN_X, y, titulo); y -= 5*mm
        y = draw_paragraph(c, desc, MARGIN_X, y, CONTENT_W, size=10, leading=14)
        y -= 4*mm
    callout_box(c,
        "Más cantidad de creatividades buenas, más velocidad de aprendizaje. No al revés.",
        MARGIN_X, y, CONTENT_W, 22*mm, accent=MINT, label="Regla práctica")

def page_c08_linkedin_microsoft(c, num):
    fill_bg(c); header(c); footer(c, num)
    y = chapter_header(c, 8, "Canales complementarios", "LinkedIn Ads y", "Microsoft Advertising.")
    # LinkedIn
    c.setFont(FONT_XB, 13); c.setFillColor(MINT)
    c.drawString(MARGIN_X, y, "LINKEDIN ADS"); y -= 6*mm
    p1 = ("Es la plataforma natural para negocios B2B, servicios profesionales y captación "
          "corporativa. Permite segmentar por cargo, industria, antigüedad, tamaño de empresa "
          "y otros atributos profesionales relevantes.")
    p2 = ("Los objetivos incluyen reconocimiento, tráfico, generación de leads y conversiones, "
          "según opciones vigentes. La medición se apoya en Insight Tag y en las herramientas "
          "habilitadas por la plataforma para reportar conversiones.")
    for p in [p1, p2]:
        y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.4, leading=15); y -= 4*mm
    # Microsoft
    y -= 2*mm
    c.setFont(FONT_XB, 13); c.setFillColor(MINT)
    c.drawString(MARGIN_X, y, "MICROSOFT ADVERTISING"); y -= 6*mm
    p3 = ("Funciona como canal complementario de búsqueda y performance. Permite diversificar "
          "más allá de Google y, en algunos mercados, captar audiencias específicas a costos "
          "competitivos.")
    p4 = ("La etiqueta UET cumple un rol similar al de los píxeles de otras plataformas: "
          "registra eventos para reportar conversiones y armar audiencias de remarketing.")
    for p in [p3, p4]:
        y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.4, leading=15); y -= 4*mm
    callout_box(c,
        "No invertir por moda. Diversificar canales sólo cuando el negocio, el ticket y la operación lo justifican.",
        MARGIN_X, y, CONTENT_W, 26*mm, accent=MINT, label="Criterio")

def page_c09_creatividad(c, num):
    fill_bg(c); header(c); footer(c, num)
    y = chapter_header(c, 9, "Creatividad publicitaria", "El anuncio es estrategia", "convertida en pieza.")
    p = ("La creatividad publicitaria no es decoración. Es la traducción del posicionamiento, "
         "la oferta y el insight de cliente en una pieza concreta. Un buen anuncio respeta "
         "estos componentes:")
    y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.5, leading=15); y -= 4*mm
    items = ["Atención inicial: gancho visual o verbal que detiene el scroll.",
             "Problema o deseo: muestra que entendés al usuario.",
             "Beneficio principal: lo que cambia para él si te elige.",
             "Diferencial: por qué vos y no otra opción.",
             "Prueba o demostración: argumento que respalda lo prometido.",
             "Llamado a la acción: qué hacer ahora y dónde."]
    y = bullet_list(c, items, MARGIN_X, y, CONTENT_W, size=10.2, leading=14, gap=3)
    y -= 2*mm
    c.setFont(FONT_XB, 11); c.setFillColor(WHITE)
    c.drawString(MARGIN_X, y, "Ángulos creativos para testear"); y -= 6*mm
    angulos = ["Dolor", "Beneficio", "Comparación", "Demostración",
               "Objeción", "Urgencia ética", "Educativo", "Antes y después conceptual"]
    # grid 2 columnas con guiones
    half = (len(angulos)+1)//2
    col_x = [MARGIN_X, MARGIN_X + CONTENT_W/2 + 4*mm]
    bullet_list(c, angulos[:half], col_x[0], y, CONTENT_W/2 - 4*mm, size=10, leading=14, gap=1)
    bullet_list(c, angulos[half:], col_x[1], y, CONTENT_W/2 - 4*mm, size=10, leading=14, gap=1)
    callout_box(c,
        "No existe el anuncio ganador eterno. Existe un sistema de prueba y aprendizaje.",
        MARGIN_X, y - 38*mm, CONTENT_W, 22*mm, accent=MINT, label="Mentalidad")

def page_copy(c, num):
    fill_bg(c); header(c); footer(c, num)
    page_eyebrow(c, "Copy publicitario")
    y = PAGE_H - 55*mm
    y = draw_title(c, "Qué decir para que el anuncio", MARGIN_X, y, CONTENT_W, size=22, color=WHITE)
    y = draw_title(c, "tenga sentido.", MARGIN_X, y, CONTENT_W, size=22, color=MINT)
    y -= 5*mm
    p = ("El copy publicitario sostiene la creatividad visual. Una estructura simple y eficaz: "
         "hook, desarrollo, beneficio, prueba, CTA.")
    y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.3, leading=14); y -= 5*mm
    c.setFont(FONT_SB, 8); c.setFillColor(MINT)
    c.drawString(MARGIN_X, y, "EJEMPLOS FICTICIOS DE COPY")
    y -= 7*mm
    ejemplos = [
        ("Ecommerce",
         "Hook: 'Tu próxima campera para entrenar no debería romperse a los tres meses'. "
         "CTA: 'Conocé la línea técnica'."),
        ("Servicio profesional",
         "Hook: '¿Estás pensando en abrir tu consultorio?'. Beneficio: acompañamiento "
         "fiscal y legal. CTA: 'Agendá una primera reunión sin cargo'."),
        ("Curso online",
         "Hook: 'Llevás meses queriendo aprender y todavía no diste el paso'. "
         "Argumento: metodología práctica. CTA: 'Mirá el programa completo'."),
        ("Negocio local",
         "Hook: 'Cambiá las gomas con turno en el día'. Argumento: stock, garantía y "
         "atención sin cita previa. CTA: 'Pedí presupuesto por WhatsApp'."),
    ]
    for titulo, desc in ejemplos:
        c.setFont(FONT_XB, 10.5); c.setFillColor(WHITE)
        c.drawString(MARGIN_X, y, titulo); y -= 4.5*mm
        y = draw_paragraph(c, desc, MARGIN_X, y, CONTENT_W, size=9.8, leading=13.5)
        y -= 3*mm
    callout_box(c,
        "Evitá: 'Resultados garantizados'.  ·  Preferí: 'Una estrategia diseñada para mejorar decisiones y oportunidades de conversión'.",
        MARGIN_X, y, CONTENT_W, 26*mm, accent=MINT, label="Reescritura ética")

def page_formatos(c, num):
    fill_bg(c); header(c); footer(c, num)
    page_eyebrow(c, "Formatos publicitarios")
    y = PAGE_H - 55*mm
    y = draw_title(c, "El formato correcto", MARGIN_X, y, CONTENT_W, size=26, color=WHITE)
    y = draw_title(c, "para el mensaje correcto.", MARGIN_X, y, CONTENT_W, size=26, color=MINT)
    y -= 4*mm
    p = ("Cada formato tiene un tipo de mensaje que comunica mejor. Elegirlo a partir del "
         "objetivo, no del gusto, ahorra dinero y mejora resultados.")
    y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.3, leading=14); y -= 5*mm
    headers = ["Formato", "Ventaja", "Mejor uso"]
    rows = [
        ["Imagen estática", "Claridad rápida", "Promoción o beneficio principal"],
        ["Carrusel", "Explicación secuencial", "Productos o pasos"],
        ["Video vertical", "Atención y demostración", "Descubrimiento y consideración"],
        ["Search Ad", "Captura intención", "Demanda activa"],
        ["Catálogo / productos", "Personalización dinámica", "Ecommerce con feed"],
        ["Lead Form", "Menor fricción", "Captación de contactos"],
        ["Landing page propia", "Control total", "Conversión y medición avanzada"],
        ["WhatsApp / mensajes", "Conversación directa", "Servicios y consultas"],
    ]
    draw_table(c, headers, rows, MARGIN_X, y, [CONTENT_W*0.28, CONTENT_W*0.32, CONTENT_W*0.40], row_h=10*mm, font_size=9)

def page_c10_landing(c, num):
    fill_bg(c); header(c); footer(c, num)
    y = chapter_header(c, 10, "Landing pages y conversión", "El clic", "no vende solo.")
    p1 = ("Una buena campaña puede colapsar en una mala landing. La página de destino tiene "
          "que respetar lo prometido en el anuncio, hacer fácil la conversión y transmitir "
          "confianza en pocos segundos.")
    p2 = ("Los pilares son: coherencia, propuesta de valor clara, CTA visible, formularios "
          "simples, prueba o respaldo legítimo, velocidad de carga, experiencia móvil cuidada "
          "y una página de agradecimiento que dispare medición y seguimiento comercial.")
    for p in [p1, p2]:
        y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.5, leading=16); y -= 4*mm
    y -= 2*mm
    soft_box(c, MARGIN_X, y, CONTENT_W, 84*mm)
    cy = y - 8*mm
    c.setFont(FONT_SB, 9); c.setFillColor(MINT)
    c.drawString(MARGIN_X + 8*mm, cy, "UNA LANDING NECESITA")
    cy -= 6*mm
    checklist(c,
        ["Titular claro: prometé un resultado o nombrá un problema.",
         "Beneficio principal antes que el detalle técnico.",
         "Oferta concreta y razonable.",
         "Prueba o respaldo legítimo (sin testimonios inventados).",
         "CTA visible y repetido en el momento adecuado.",
         "Formulario corto o checkout sin fricciones.",
         "Medición instalada y validada con tests reales.",
         "Plan de seguimiento comercial del lead o de la venta."],
        MARGIN_X + 8*mm, cy, CONTENT_W - 14*mm, size=9.8, leading=13, gap=2)

def page_landing_ejemplo(c, num):
    fill_bg(c); header(c); footer(c, num)
    page_eyebrow(c, "Ejemplo ficticio de landing")
    y = PAGE_H - 55*mm
    y = draw_title(c, "Servicio de consultoría", MARGIN_X, y, CONTENT_W, size=24, color=WHITE)
    y = draw_title(c, "para comercios.", MARGIN_X, y, CONTENT_W, size=24, color=MINT)
    y -= 4*mm
    c.setFont(FONT_SB, 8); c.setFillColor(MINT)
    c.drawString(MARGIN_X, y, "ESTRUCTURA EDUCATIVA · NO REPRESENTA UNA OFERTA REAL")
    y -= 7*mm
    bloques = [
        ("Hero",        "Ordená tu publicidad y entendé qué inversión genera oportunidades reales."),
        ("Subtítulo",   "Diagnóstico de campañas, medición y plan de optimización en dos semanas."),
        ("CTA",         "Solicitá tu auditoría inicial."),
        ("Problema",    "Invertís todos los meses, pero no sabés qué campaña funciona."),
        ("Solución",    "Un diagnóstico, un tablero claro y un plan de acción priorizado."),
        ("Incluye",     "Auditoría de cuentas, revisión de medición, recomendaciones por canal."),
        ("Para quién",  "Comercios, pymes y ecommerce que ya invierten al menos un piso mensual."),
        ("FAQ",         "Plazos, formato de entrega y dudas habituales."),
        ("Formulario",  "Datos mínimos, expectativa de respuesta y siguiente paso claro."),
    ]
    label_col_w = 28*mm
    desc_x = MARGIN_X + label_col_w + 4*mm
    desc_w = CONTENT_W - label_col_w - 4*mm
    for titulo, desc in bloques:
        c.setFont(FONT_XB, 9.5); c.setFillColor(MINT)
        c.drawString(MARGIN_X, y, titulo.upper())
        c.setFont(FONT_REG, 10); c.setFillColor(GRAY_LIGHT)
        lines = wrap(desc, FONT_REG, 10, desc_w)
        ly = y
        for ln in lines:
            c.drawString(desc_x, ly, ln); ly -= 12
        c.setStrokeColor(LINE); c.setLineWidth(0.3)
        c.line(MARGIN_X, y - 5*mm, PAGE_W - MARGIN_X, y - 5*mm)
        y -= 9*mm

def page_c11_medicion(c, num):
    fill_bg(c); header(c); footer(c, num)
    y = chapter_header(c, 11, "Medición digital", "Lo que no se mide,", "se interpreta mal.")
    p1 = ("Antes de pautar, instalá medición. Sin eventos correctamente disparados es "
          "imposible saber qué clic se convierte en lead, qué lead en cliente y qué cliente "
          "en recompra. Optimizar sin datos es decorar con intuición.")
    p2 = ("La medición digital combina varias capas: una herramienta de análisis general "
          "(GA4), un gestor de etiquetas (Tag Manager) y los píxeles o APIs propios de cada "
          "plataforma publicitaria.")
    p3 = ("El objetivo no es medirlo todo. Es medir lo que define decisiones: eventos "
          "clave, conversiones y valor.")
    for p in [p1, p2, p3]:
        y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.5, leading=16); y -= 4*mm
    y -= 2*mm
    # Flujo visual
    soft_box(c, MARGIN_X, y, CONTENT_W, 38*mm)
    pasos = ["Anuncio", "Clic", "Landing", "Acción", "Evento medido", "Reporte", "Decisión"]
    step_y = y - 24*mm
    step_w = CONTENT_W / len(pasos)
    for i, p in enumerate(pasos):
        cx = MARGIN_X + i*step_w + step_w/2
        c.setFillColor(MINT_DEEP)
        c.circle(cx, step_y, 4.2, fill=1, stroke=0)
        c.setFont(FONT_SB, 8.5); c.setFillColor(WHITE)
        c.drawCentredString(cx, step_y - 7*mm, p)
        if i < len(pasos)-1:
            c.setStrokeColor(MINT); c.setLineWidth(1)
            c.line(cx + 4.5, step_y, cx + step_w - 4.5, step_y)

def page_herramientas(c, num):
    fill_bg(c); header(c); footer(c, num)
    page_eyebrow(c, "Herramientas de medición")
    y = PAGE_H - 55*mm
    y = draw_title(c, "El stack básico", MARGIN_X, y, CONTENT_W, size=28, color=WHITE)
    y = draw_title(c, "de medición.", MARGIN_X, y, CONTENT_W, size=28, color=MINT)
    y -= 6*mm
    bloques = [
        ("Google Analytics 4 (GA4)",
         "Analiza comportamiento, eventos clave, adquisición y recorridos del usuario en el sitio."),
        ("Google Tag Manager (GTM)",
         "Facilita implementar y gestionar etiquetas y eventos sin tener que modificar el código cada vez."),
        ("Google Ads Conversion Tracking",
         "Registra acciones valiosas en el sitio vinculadas con campañas de Google Ads."),
        ("Meta Pixel + Conversions API",
         "Píxel del sitio más API de servidor para mejorar la calidad de la medición y la optimización en Meta."),
        ("TikTok Pixel + Events API / LinkedIn Insight Tag / Microsoft UET",
         "Herramientas equivalentes en otras plataformas. Misma lógica: medir eventos y mejorar la optimización."),
    ]
    for titulo, desc in bloques:
        c.setFont(FONT_XB, 11); c.setFillColor(MINT)
        c.drawString(MARGIN_X, y, titulo); y -= 5*mm
        y = draw_paragraph(c, desc, MARGIN_X, y, CONTENT_W, size=10.2, leading=14)
        y -= 4*mm
    callout_box(c,
        "Toda implementación debe respetar políticas de privacidad, consentimiento y normativa aplicable en cada mercado.",
        MARGIN_X, y, CONTENT_W, 24*mm, accent=MINT, label="Cumplimiento")

def page_eventos(c, num):
    fill_bg(c); header(c); footer(c, num)
    page_eyebrow(c, "Eventos y conversiones")
    y = PAGE_H - 55*mm
    y = draw_title(c, "No midas todo igual:", MARGIN_X, y, CONTENT_W, size=26, color=WHITE)
    y = draw_title(c, "definí qué vale de verdad.", MARGIN_X, y, CONTENT_W, size=26, color=MINT)
    y -= 5*mm
    p = ("Una buena medición ordena los eventos por valor estratégico. No todo lo medible "
         "merece optimización. La jerarquía evita reportes inflados con métricas que no "
         "deciden nada.")
    y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.4, leading=15); y -= 5*mm
    headers = ["Acción", "Valor estratégico", "Uso recomendado"]
    rows = [
        ["Vista de página", "Bajo", "Análisis y remarketing"],
        ["Scroll relevante", "Bajo", "Engagement y contenido"],
        ["Clic en WhatsApp", "Medio", "Microconversión"],
        ["Inicio de formulario", "Medio", "Diagnóstico de fricción"],
        ["Lead enviado", "Alto", "Optimización para captación"],
        ["Inicio de checkout", "Alto", "Optimización ecommerce"],
        ["Compra", "Muy alto", "Optimización para ventas"],
        ["Compra con valor", "Máximo", "Análisis de rentabilidad y ROAS"],
    ]
    draw_table(c, headers, rows, MARGIN_X, y, [CONTENT_W*0.32, CONTENT_W*0.26, CONTENT_W*0.42], row_h=10*mm, font_size=9)

def page_c12_metricas(c, num):
    fill_bg(c); header(c); footer(c, num)
    y = chapter_header(c, 12, "Métricas", "Las métricas que importan", "según el objetivo.")
    p = ("Cada métrica tiene un sentido específico. Aisladas pueden engañar. Combinadas con "
         "el objetivo, cuentan una historia útil.")
    y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.4, leading=15); y -= 4*mm
    pares = [
        ("Inversión", "Lo que ya gastaste, no lo que pensás gastar."),
        ("Impresiones / Alcance / Frecuencia", "Cuánto se vio, a cuántos y cuántas veces."),
        ("CPM", "Costo por mil impresiones. Útil para alcance y video."),
        ("Clics / CTR / CPC", "Cuántos clics, qué porcentaje y a qué precio."),
        ("Reproducciones de video", "Cuántos vieron y por cuánto tiempo."),
        ("Leads / CPL", "Contactos y cuánto cuesta cada uno."),
        ("Conversiones / CPA", "Acciones valiosas y su costo unitario."),
        ("Tasa de conversión", "Porcentaje de los que avanzaron en el funnel."),
        ("Ingresos atribuidos / ROAS", "Plata facturada por la campaña dividido la inversión."),
        ("Calidad del lead / Tasa de cierre", "Cuántos contactos se vuelven clientes."),
    ]
    # dos columnas
    col_w = CONTENT_W/2 - 6*mm
    col1, col2 = pares[:5], pares[5:]
    def draw_pairs(items, x, y_start):
        yy = y_start
        for titulo, desc in items:
            c.setFont(FONT_XB, 10); c.setFillColor(MINT)
            c.drawString(x, yy, titulo); yy -= 4.6*mm
            c.setFont(FONT_REG, 9.5); c.setFillColor(GRAY_LIGHT)
            lines = wrap(desc, FONT_REG, 9.5, col_w)
            for ln in lines:
                c.drawString(x, yy, ln); yy -= 12
            yy -= 4*mm
        return yy
    y1 = draw_pairs(col1, MARGIN_X, y)
    y2 = draw_pairs(col2, MARGIN_X + col_w + 12*mm, y)
    y_min = min(y1, y2)
    callout_box(c,
        "Una métrica no es buena ni mala. Depende del objetivo, del momento y del negocio.",
        MARGIN_X, y_min - 2*mm, CONTENT_W, 22*mm, accent=MINT, label="Lectura útil")

def page_metricas_lectura(c, num):
    fill_bg(c); header(c); footer(c, num)
    page_eyebrow(c, "Lectura estratégica")
    y = PAGE_H - 55*mm
    y = draw_title(c, "Un número aislado", MARGIN_X, y, CONTENT_W, size=26, color=WHITE)
    y = draw_title(c, "no toma decisiones.", MARGIN_X, y, CONTENT_W, size=26, color=MINT)
    y -= 5*mm
    p = ("Cuatro situaciones ficticias para entrenar la lectura combinada de métricas.")
    y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.2, leading=14); y -= 5*mm
    situaciones = [
        ("Situación A · muchos clics, pocos leads",
         "Probables causas: landing débil, oferta poco clara, mensaje desalineado o formulario con demasiados campos."),
        ("Situación B · leads baratos, pocas ventas",
         "Probables causas: calidad de público, falta de calificación, propuesta floja o seguimiento comercial lento."),
        ("Situación C · CPA alto, ticket aún mayor",
         "Lectura: puede ser rentable si margen y capacidad operativa lo justifican. No siempre 'caro' es 'malo'."),
        ("Situación D · ROAS positivo, pocas ventas totales",
         "Lectura: revisar escalabilidad, inventario, margen, demanda y techo del mercado antes de aumentar inversión."),
    ]
    for titulo, desc in situaciones:
        c.setFont(FONT_XB, 10.5); c.setFillColor(MINT)
        c.drawString(MARGIN_X, y, titulo); y -= 5*mm
        y = draw_paragraph(c, desc, MARGIN_X, y, CONTENT_W, size=10, leading=13.5)
        y -= 4*mm

def page_c13_opt(c, num):
    fill_bg(c); header(c); footer(c, num)
    y = chapter_header(c, 13, "Optimización", "Optimizar no es tocar", "todo todos los días.")
    p1 = ("Optimizar no es modificar campañas porque hoy te ponés ansioso. Es una práctica "
          "metódica que parte de una hipótesis, espera datos, identifica la variable y "
          "decide con criterio.")
    p2 = ("Antes de cambiar nada, separá si el problema es creativo, de audiencia, de "
          "oferta, de landing o de medición. Casi siempre hay una causa raíz que ataca el "
          "rendimiento por arriba.")
    for p in [p1, p2]:
        y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.5, leading=16); y -= 4*mm
    # Metodología en pasos verticales (más legible y sin superposiciones)
    soft_box(c, MARGIN_X, y, CONTENT_W, 70*mm)
    pasos = [
        ("Observar",     "Mirá los datos antes de tocar nada."),
        ("Diagnosticar", "Identificá la causa raíz del problema."),
        ("Hipótesis",    "Formulá qué creés que va a mejorar el resultado."),
        ("Testear",      "Cambiá una variable por vez."),
        ("Medir",        "Esperá datos suficientes antes de concluir."),
        ("Decidir",      "Escalar, iterar o descartar el cambio."),
    ]
    sx = MARGIN_X + 8*mm
    sy = y - 10*mm
    step_w = CONTENT_W - 16*mm
    for i, (paso, desc) in enumerate(pasos):
        py = sy - i * 9.5*mm
        # número
        c.setFont(FONT_XB, 11); c.setFillColor(MINT)
        c.drawString(sx, py, f"{i+1:02d}")
        # paso
        c.setFont(FONT_XB, 10.5); c.setFillColor(WHITE)
        c.drawString(sx + 12*mm, py, paso)
        # descripción
        c.setFont(FONT_REG, 9.8); c.setFillColor(GRAY_LIGHT)
        c.drawString(sx + 46*mm, py, desc)
    y -= 78*mm
    callout_box(c,
        "Apagá lo que no aporta. Escalá lo que sostiene resultados. Documentá todo el proceso.",
        MARGIN_X, y, CONTENT_W, 24*mm, accent=MINT, label="Disciplina")

def page_testing(c, num):
    fill_bg(c); header(c); footer(c, num)
    page_eyebrow(c, "Testing creativo")
    y = PAGE_H - 55*mm
    y = draw_title(c, "Probá con método,", MARGIN_X, y, CONTENT_W, size=26, color=WHITE)
    y = draw_title(c, "no por ansiedad.", MARGIN_X, y, CONTENT_W, size=26, color=MINT)
    y -= 5*mm
    p = ("El testing necesita una hipótesis clara, una variable por vez y una métrica "
         "definida. Cambiar varias cosas al mismo tiempo impide aprender: no sabés qué fue "
         "lo que movió el resultado.")
    y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.3, leading=14); y -= 5*mm
    items = ["Qué se puede testear: hook, formato, concepto, CTA, audiencia, landing, oferta.",
             "Cuántas variantes por ronda: idealmente 3 a 5 hipótesis a la vez.",
             "Cuánto tiempo: dejá correr hasta tener volumen suficiente, no horas sueltas.",
             "Cómo documentar: planilla simple con hipótesis, variable, métrica y resultado.",
             "Qué hacer con lo que funciona: escalar, iterar o aplicarlo a otra etapa del funnel."]
    y = bullet_list(c, items, MARGIN_X, y, CONTENT_W, size=10.2, leading=14, gap=3)
    y -= 2*mm
    headers = ["Hipótesis", "Variable", "Métrica", "Resultado", "Próxima decisión"]
    rows = [
        ["Video demostrativo gana a imagen estática", "Formato", "CPL", "Pendiente", "Escalar o descartar"],
        ["Hook con pregunta supera al hook con dato", "Copy", "CTR", "Pendiente", "Aplicar al resto"],
        ["Audiencia con intereses afines mejora calidad", "Audiencia", "Calidad de lead", "Pendiente", "Reasignar presupuesto"],
    ]
    draw_table(c, headers, rows, MARGIN_X, y,
               [CONTENT_W*0.30, CONTENT_W*0.14, CONTENT_W*0.16, CONTENT_W*0.16, CONTENT_W*0.24],
               row_h=12*mm, font_size=8.5)

def page_c14_presupuesto(c, num):
    fill_bg(c); header(c); footer(c, num)
    y = chapter_header(c, 14, "Presupuesto y escalabilidad", "Invertir con criterio,", "no con impulso.")
    p1 = ("No existe un presupuesto universal. Depende del objetivo, del mercado, del ticket "
          "promedio, del margen, del volumen de demanda, del costo esperado por conversión, "
          "de la capacidad operativa y del tiempo que el negocio puede aceptar para aprender.")
    p2 = ("Hay dos momentos distintos: presupuesto de validación (aprendés, registrás y "
          "decidís) y presupuesto de escalamiento (sostenés resultados a mayor inversión). "
          "Mezclarlos es la receta para tomar decisiones equivocadas.")
    p3 = ("Escalar no es duplicar la inversión y rezar. Es subir presupuesto en pasos y "
          "revisar margen, calidad de lead, tasa de cierre y capacidad operativa antes de "
          "seguir.")
    for p in [p1, p2, p3]:
        y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=10.4, leading=15); y -= 4*mm
    callout_box(c,
        "Escalar no es gastar más. Es sostener resultados mientras aumenta la inversión.",
        MARGIN_X, y, CONTENT_W, 26*mm, accent=MINT, label="Definición útil")

def page_c15_errores(c, num):
    fill_bg(c); header(c); footer(c, num)
    y = chapter_header(c, 15, "Errores frecuentes", "Lo que suele hacer", "perder presupuesto.")
    items = [
        "Pautar sin objetivo comercial detrás.",
        "Medir solamente clics, seguidores o métricas de vanidad.",
        "No instalar conversiones o no verificarlas.",
        "Enviar tráfico a una página confusa o lenta.",
        "Crear un solo anuncio y esperar resultados permanentes.",
        "Cambiar campañas todos los días sin datos suficientes.",
        "Ignorar la calidad del lead y celebrar volumen sin filtro.",
        "Optimizar por métricas que no se transforman en negocio.",
        "Desconectar marketing y ventas: lo que entra no se atiende.",
        "Escalar sin revisar margen, capacidad operativa o demanda real.",
        "Copiar estrategias de otros negocios sin entender su contexto.",
        "Confiar ciegamente en automatizaciones sin estrategia ni control.",
    ]
    # Lista en dos columnas con numeración continua
    col_w = CONTENT_W/2 - 6*mm
    half = (len(items)+1)//2
    numbered_list(c, items[:half], MARGIN_X, y, col_w, size=9.6, leading=13, gap=2, start=1)
    numbered_list(c, items[half:], MARGIN_X + col_w + 12*mm, y, col_w, size=9.6, leading=13, gap=2, start=half+1)
    callout_box(c,
        "Casi ningún error es técnico. La mayoría son decisiones tomadas sin información o sin tiempo.",
        MARGIN_X, 70*mm, CONTENT_W, 24*mm, accent=MINT, label="Lectura honesta")

def page_c16_plan(c, num):
    fill_bg(c); header(c); footer(c, num)
    y = chapter_header(c, 16, "Plan de acción", "Tu primer sistema de", "Paid Media en 10 pasos.")
    pasos = [
        "Definí qué querés vender en este período y por qué.",
        "Calculá margen, ticket, costo objetivo y capacidad operativa.",
        "Elegí la conversión principal a optimizar.",
        "Identificá a quién necesitás llegar y qué busca.",
        "Seleccioná plataformas según objetivo, intención y presupuesto.",
        "Diseñá oferta, mensaje y creatividades con foco en el usuario.",
        "Prepará landing o canal de conversión con experiencia móvil cuidada.",
        "Instalá y validá medición: eventos, píxeles y conversiones.",
        "Lanzá con hipótesis claras y plazo de aprendizaje definido.",
        "Medí, optimizá y documentá aprendizajes para la próxima ronda.",
    ]
    numbered_list(c, pasos, MARGIN_X, y, CONTENT_W, size=10.4, leading=14.5, gap=3)
    callout_box(c,
        "La publicidad digital no debería ser una apuesta. Debería ser un sistema de decisiones mejoradas por datos.",
        MARGIN_X, 60*mm, CONTENT_W, 26*mm, accent=MINT, label="Cierre del método")

def page_cierre(c, num):
    fill_bg(c); header(c); footer(c, num)
    page_eyebrow(c, "Hablemos de tu negocio")
    y = PAGE_H - 60*mm
    y = draw_title(c, "¿Tu negocio invierte en publicidad", MARGIN_X, y, CONTENT_W, size=22, color=WHITE)
    y = draw_title(c, "pero no sabe qué está funcionando?", MARGIN_X, y, CONTENT_W, size=22, color=MINT)
    y -= 6*mm
    p = ("Trabajo con pymes, ecommerce y empresas que necesitan ordenar su marketing, medir "
         "mejor sus campañas y convertir la inversión publicitaria en oportunidades "
         "comerciales reales. Si querés revisar cómo está hoy tu estrategia y qué se puede "
         "mejorar en las próximas semanas, hablemos.")
    y = draw_paragraph(c, p, MARGIN_X, y, CONTENT_W, size=11, leading=17)
    y -= 10*mm

    # CTAs
    btn_w, btn_h = 78*mm, 14*mm
    # CTA 1
    c.setFillColor(MINT)
    c.roundRect(MARGIN_X, y - btn_h, btn_w, btn_h, 7, fill=1, stroke=0)
    c.setFont(FONT_XB, 11); c.setFillColor(BG)
    c.drawString(MARGIN_X + 8*mm, y - btn_h/2 - 1*mm, "Solicitá una auditoría  →")
    # CTA 2
    c.setStrokeColor(MINT); c.setLineWidth(1.2)
    c.setFillColor(BG)
    c.roundRect(MARGIN_X + btn_w + 6*mm, y - btn_h, btn_w, btn_h, 7, fill=1, stroke=1)
    c.setFont(FONT_XB, 11); c.setFillColor(MINT)
    c.drawString(MARGIN_X + btn_w + 6*mm + 8*mm, y - btn_h/2 - 1*mm, "Hablemos de tu negocio  →")

    y -= btn_h + 16*mm

    c.setStrokeColor(MINT); c.setLineWidth(0.8)
    c.line(MARGIN_X, y, MARGIN_X + 18*mm, y); y -= 8*mm
    c.setFont(FONT_XB, 16); c.setFillColor(WHITE)
    c.drawString(MARGIN_X, y, "MARIANO CALANDRA"); y -= 7*mm
    c.setFont(FONT_SB, 10); c.setFillColor(GRAY_LIGHT)
    c.drawString(MARGIN_X, y, "Paid Media  ·  Estrategia de Marketing  ·  Consultoría Comercial"); y -= 6*mm
    c.setFont(FONT_SB, 10.5); c.setFillColor(MINT)
    c.drawString(MARGIN_X, y, "www.marianocalandra.com"); y -= 6*mm
    c.setFont(FONT_SB, 9); c.setFillColor(GRAY_MED)
    c.drawString(MARGIN_X, y, "Rosario, Argentina  ·  Clientes de Argentina y LATAM")

# ===================== GLOSARIO =====================
GLOSARIO = [
    ("Alcance", "Cantidad de personas únicas que vieron un anuncio en un período determinado."),
    ("Anuncio", "Pieza publicitaria final: creativo, copy y CTA mostrados al usuario."),
    ("API de conversiones", "Conexión servidor a servidor que envía eventos directamente a la plataforma para mejorar la medición."),
    ("Atribución", "Modelo que asigna el mérito de una conversión a uno o varios puntos de contacto."),
    ("Audiencia", "Conjunto de personas a las que se muestra un anuncio según criterios definidos."),
    ("Audiencia personalizada", "Grupo construido a partir de datos propios: visitantes, clientes, base de mails."),
    ("Audiencia similar", "Grupo nuevo que la plataforma estima parecido a una audiencia base de origen."),
    ("Bidding / Puja", "Estrategia con la que la plataforma compite por mostrar tu anuncio."),
    ("Campaña", "Nivel máximo de una estructura publicitaria: define objetivo y presupuesto general."),
    ("CTR (Click-Through Rate)", "Porcentaje de impresiones que se transforman en clic."),
    ("Conversión", "Acción valiosa registrada por el sistema de medición (lead, compra, llamada)."),
    ("Conversion Rate / Tasa de conversión", "Porcentaje de usuarios que completan una acción deseada."),
    ("CPA (Cost Per Acquisition)", "Costo promedio por conversión registrada."),
    ("CPC (Cost Per Click)", "Costo promedio por clic en el anuncio."),
    ("CPL (Cost Per Lead)", "Costo promedio por contacto comercial generado."),
    ("CPM (Cost Per Mille)", "Costo por mil impresiones del anuncio."),
    ("Creatividad", "Pieza visual o audiovisual del anuncio."),
    ("CTA (Call to Action)", "Llamado a la acción que invita al usuario al siguiente paso."),
    ("Demand Gen", "Tipo de campaña para generar demanda con formatos visuales y video en superficies de Google."),
    ("Ecommerce", "Negocio que opera ventas en línea."),
    ("Evento", "Acción registrada en el sitio o app por una herramienta de medición."),
    ("Evento clave", "Evento que la organización define como prioritario para tomar decisiones."),
    ("Feed de productos", "Archivo estructurado con los productos del ecommerce: título, precio, imagen, stock."),
    ("Frecuencia", "Cantidad de veces promedio que cada persona vio el anuncio."),
    ("Funnel", "Modelo conceptual del recorrido del usuario: descubrir, considerar, convertir, retener."),
    ("GA4 (Google Analytics 4)", "Herramienta de análisis basada en eventos del ecosistema Google."),
    ("Google Ads", "Plataforma publicitaria de Google: Search, Performance Max, Shopping, YouTube, Demand Gen."),
    ("Google Tag Manager (GTM)", "Gestor de etiquetas que facilita implementar mediciones sin tocar el código."),
    ("Impresión", "Cada vez que un anuncio se muestra en pantalla."),
    ("Insight Tag", "Etiqueta de seguimiento de LinkedIn Ads para medir conversiones y armar audiencias."),
    ("Landing page", "Página web diseñada específicamente para recibir tráfico de una campaña."),
    ("Lead", "Contacto comercial generado a través de un formulario, mensaje o llamada."),
    ("Meta Ads", "Plataforma publicitaria de Facebook e Instagram."),
    ("Meta Pixel", "Píxel de seguimiento de Meta para registrar acciones en el sitio."),
    ("Microsoft Advertising", "Plataforma publicitaria de búsqueda y display complementaria a Google."),
    ("Objetivo publicitario", "Acción que la plataforma optimiza durante la entrega del anuncio."),
    ("Optimización", "Conjunto de decisiones basadas en datos para mejorar el rendimiento de la campaña."),
    ("Paid Media", "Distribución de contenido y mensajes a través de inversión publicitaria."),
    ("Palabra clave", "Término que un usuario escribe en un buscador y al que apunta una campaña."),
    ("Performance Max", "Campaña automatizada de Google orientada a objetivos y multi-inventario."),
    ("Remarketing", "Estrategia para impactar a usuarios que ya interactuaron con la marca."),
    ("ROAS", "Retorno sobre la inversión publicitaria: ingresos atribuidos divididos por inversión."),
    ("Search Ads", "Anuncios de búsqueda que aparecen en respuesta a consultas concretas."),
    ("Shopping Ads", "Anuncios de catálogo para ecommerce con feed de productos en el ecosistema Google."),
    ("TikTok Ads", "Plataforma publicitaria de TikTok orientada a video vertical."),
    ("TikTok Pixel", "Píxel de seguimiento de TikTok para medir acciones en el sitio."),
    ("UET", "Etiqueta de seguimiento de Microsoft Advertising para conversiones y remarketing."),
    ("Video Ads", "Formato publicitario basado en video, con foco en atención y demostración."),
    ("WhatsApp como canal", "Uso de WhatsApp como destino de conversión para conversaciones comerciales."),
]

def render_glosario(c, start_page):
    # Repartimos en 3 páginas balanceadas
    items = GLOSARIO
    chunks = []
    n = len(items)
    per = (n + 2) // 3
    chunks = [items[:per], items[per:per*2], items[per*2:]]
    pages_drawn = 0
    for idx, chunk in enumerate(chunks):
        fill_bg(c); header(c); footer(c, start_page + idx)
        page_eyebrow(c, "Glosario esencial")
        y = PAGE_H - 55*mm
        if idx == 0:
            y = draw_title(c, "Glosario esencial", MARGIN_X, y, CONTENT_W, size=26, color=WHITE)
            y = draw_title(c, "de Paid Media.", MARGIN_X, y, CONTENT_W, size=26, color=MINT)
            y -= 6*mm
        else:
            y = draw_title(c, "Glosario (continuación).", MARGIN_X, y, CONTENT_W, size=22, color=WHITE)
            y -= 4*mm
        # dos columnas
        col_w = CONTENT_W/2 - 6*mm
        col_x = [MARGIN_X, MARGIN_X + col_w + 12*mm]
        half = (len(chunk)+1)//2
        cols = [chunk[:half], chunk[half:]]
        for ci, col in enumerate(cols):
            yy = y
            for term, desc in col:
                c.setFont(FONT_XB, 10); c.setFillColor(MINT)
                c.drawString(col_x[ci], yy, term)
                yy -= 4.4*mm
                lines = wrap(desc, FONT_REG, 9.2, col_w)
                c.setFont(FONT_REG, 9.2); c.setFillColor(GRAY_LIGHT)
                for ln in lines:
                    c.drawString(col_x[ci], yy, ln); yy -= 11.5
                yy -= 3*mm
        if idx == len(chunks) - 1:
            callout_box(c,
                "Marketing claro.  Decisiones medibles.  Crecimiento real.",
                MARGIN_X, 48*mm, CONTENT_W, 22*mm, accent=MINT, label="Cierre")
        c.showPage()
        pages_drawn += 1
    return pages_drawn

# ===================== BUILD =====================
def build(out_path):
    c = canvas.Canvas(out_path, pagesize=A4)
    c.setTitle("Paid Media sin humo — Mariano Calandra")
    c.setAuthor("Mariano Calandra")
    c.setSubject("Guía completa para convertir publicidad digital en crecimiento real")

    # Página 1 — Portada
    page_portada(c); c.showPage()
    # Página 2 — Manifiesto
    page_manifiesto(c, 2); c.showPage()
    # Página 3 — Introducción
    page_intro(c, 3); c.showPage()
    # Página 4 — Importancia
    page_importancia(c, 4); c.showPage()
    # Página 5 — Objetivos
    page_objetivos(c, 5); c.showPage()
    # Página 6 — Índice
    page_indice(c, 6); c.showPage()
    # Página 7 — Cap 1
    page_c01(c, 7); c.showPage()
    # Página 8 — Objetivos publicitarios
    page_objetivos_publicitarios(c, 8); c.showPage()
    # Página 9 — Cap 2
    page_c02(c, 9); c.showPage()
    # Página 10 — Diagnóstico
    page_diagnostico(c, 10); c.showPage()
    # Página 11 — Cap 3 Funnel
    page_c03_funnel(c, 11); c.showPage()
    # Página 12 — Ejemplo funnel
    page_funnel_ejemplo(c, 12); c.showPage()
    # Página 13 — Cap 4 plataformas
    page_c04_plataformas(c, 13); c.showPage()
    # Página 14 — Cap 5 Meta
    page_c05_meta(c, 14); c.showPage()
    # Página 15 — Meta en práctica
    page_meta_practica(c, 15); c.showPage()
    # Página 16 — Cap 6 Google
    page_c06_google(c, 16); c.showPage()
    # Página 17 — Google Search
    page_google_search(c, 17); c.showPage()
    # Página 18 — Performance Max, etc.
    page_google_pmax(c, 18); c.showPage()
    # Página 19 — Cap 7 TikTok
    page_c07_tiktok(c, 19); c.showPage()
    # Página 20 — TikTok creatividades
    page_tiktok_creatividades(c, 20); c.showPage()
    # Página 21 — Cap 8 LinkedIn + Microsoft
    page_c08_linkedin_microsoft(c, 21); c.showPage()
    # Página 22 — Cap 9 Creatividad
    page_c09_creatividad(c, 22); c.showPage()
    # Página 23 — Copy
    page_copy(c, 23); c.showPage()
    # Página 24 — Formatos
    page_formatos(c, 24); c.showPage()
    # Página 25 — Cap 10 Landing
    page_c10_landing(c, 25); c.showPage()
    # Página 26 — Landing ejemplo
    page_landing_ejemplo(c, 26); c.showPage()
    # Página 27 — Cap 11 Medición
    page_c11_medicion(c, 27); c.showPage()
    # Página 28 — Herramientas
    page_herramientas(c, 28); c.showPage()
    # Página 29 — Eventos
    page_eventos(c, 29); c.showPage()
    # Página 30 — Cap 12 Métricas
    page_c12_metricas(c, 30); c.showPage()
    # Página 31 — Lectura
    page_metricas_lectura(c, 31); c.showPage()
    # Página 32 — Cap 13 Optimización
    page_c13_opt(c, 32); c.showPage()
    # Página 33 — Testing
    page_testing(c, 33); c.showPage()
    # Página 34 — Cap 14 Presupuesto
    page_c14_presupuesto(c, 34); c.showPage()
    # Página 35 — Cap 15 Errores
    page_c15_errores(c, 35); c.showPage()
    # Página 36 — Cap 16 Plan
    page_c16_plan(c, 36); c.showPage()
    # Página 37 — Cierre comercial
    page_cierre(c, 37); c.showPage()
    # Páginas 38-40 — Glosario
    render_glosario(c, 38)

    c.save()
    print(f"OK — generado: {out_path}")

if __name__ == "__main__":
    out = "descargables/Paid-Media-Sin-Humo-ebook.pdf"
    build(out)
