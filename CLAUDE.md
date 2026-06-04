# Instrucciones para Claude Code — marianocalandra.com

## Stack
- Hosting: Netlify (auto-deploy desde GitHub)
- Dominio: marianocalandra.com (DNS en Hostinger)
- Repositorio: GitHub → rama `main`

## Workflow de cambios

Después de CUALQUIER cambio que hagas, ejecutá:

```bash
./deploy.sh "descripción breve del cambio"
```

Ejemplos:
```bash
./deploy.sh "actualizar hero section con nuevo copy"
./deploy.sh "agregar sección servicios"
./deploy.sh "fix: corregir link del formulario"
./deploy.sh "update email de contacto"
```

Si no pasás descripción, se usa la fecha/hora automáticamente.

## Qué hace el deploy.sh
1. `git add -A` → stagea todos los cambios
2. `git commit -m "mensaje"` → commitea
3. Hook post-commit → pushea a GitHub automáticamente
4. Netlify detecta el push → deploya en ~60 segundos

## Ver estado del deploy
- Panel Netlify: https://app.netlify.com
- El sitio tarda ~60 segundos en actualizarse después del push

## Estructura del proyecto
- Editá los archivos HTML/CSS/JS directamente
- No tocar: .git/, node_modules/ (si existe)
- El archivo CLAUDE.md es solo para contexto, no afecta el sitio

## Comandos útiles
```bash
git log --oneline -10      # Ver últimos 10 commits
git status                 # Ver qué cambió
git diff                   # Ver diferencias antes de commitear
```
