#!/usr/bin/env python3
"""
Cache bust: reemplaza el placeholder __BUST__ en archivos HTML
con un timestamp único en cada build.

Uso:
  - En el deploy de Netlify se ejecuta automáticamente (ver netlify.toml).
  - Local: `python3 bust.py` (no es necesario, pero útil para testear).

Cómo funciona:
  - En el source, los tags de assets versionados usan `?v=__BUST__`
    (ej: <script src="app.js?v=__BUST__" defer></script>).
  - Antes de publicar, este script reemplaza __BUST__ con un identificador
    único basado en el timestamp actual (base36 para URL más corta).
  - El source queda con el placeholder (no se modifica el repo de git).
  - El deploy queda con una versión única, así el browser hace fetch fresco.

Combinado con los headers Cache-Control immutable de _headers, el browser
cachea agresivo cada versión y solo descarga cuando cambia.
"""

import os
import sys
import time

PLACEHOLDER = "__BUST__"


def to_base36(n: int) -> str:
    """Convierte un entero a string base36 (0-9a-z)."""
    if n == 0:
        return "0"
    digits = "0123456789abcdefghijklmnopqrstuvwxyz"
    out = []
    while n > 0:
        n, r = divmod(n, 36)
        out.append(digits[r])
    return "".join(reversed(out))


SKIP_DIRS = {".git", "node_modules", ".netlify", "netlify"}


def collect_html_files(root: str) -> list:
    """Todos los .html del sitio, incluidas las subcarpetas.

    Antes solo se recorria el directorio raiz, asi que paginas como
    /epibrands/studio.html o /servicios/*.html se publicaban con el
    placeholder __BUST__ literal y nunca invalidaban cache.
    """
    found = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith(".")]
        for name in filenames:
            if name.endswith(".html"):
                found.append(os.path.join(dirpath, name))
    return sorted(found)


def main() -> int:
    bust = to_base36(int(time.time() * 1000))

    html_files = collect_html_files(".")
    if not html_files:
        print("[bust] No se encontraron archivos .html.", file=sys.stderr)
        return 0

    total = 0
    touched = []
    for f in html_files:
        with open(f, "r", encoding="utf-8") as fp:
            content = fp.read()
        count = content.count(PLACEHOLDER)
        if count == 0:
            continue
        with open(f, "w", encoding="utf-8") as fp:
            fp.write(content.replace(PLACEHOLDER, bust))
        total += count
        touched.append(f"{f} ({count})")

    print(f"[bust] Versión: {bust}")
    print(f"[bust] {total} reemplazos en: {', '.join(touched) if touched else '(ninguno)'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
