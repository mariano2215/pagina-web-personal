#!/bin/bash

# ============================================
# SETUP AUTO-DEPLOY — marianocalandra.com
# Ejecutar UNA SOLA VEZ en la carpeta del proyecto
# ============================================

echo "🚀 Configurando auto-deploy para marianocalandra.com..."

# 1. Crear carpeta de hooks si no existe
mkdir -p .git/hooks

# 2. Crear el hook post-commit (se ejecuta solo después de cada commit)
cat > .git/hooks/post-commit << 'HOOK'
#!/bin/bash
echo "📡 Pusheando a GitHub → Netlify deploying..."
git push origin main
if [ $? -eq 0 ]; then
  echo "✅ Deploy iniciado. marianocalandra.com se actualiza en ~60s"
else
  echo "❌ Error en el push. Revisá conexión o permisos."
fi
HOOK

chmod +x .git/hooks/post-commit

# 3. Crear el script de commit rápido (deploy.sh)
cat > deploy.sh << 'DEPLOY'
#!/bin/bash

# ============================================
# DEPLOY RÁPIDO — marianocalandra.com
# Uso: ./deploy.sh "descripción del cambio"
# O sin argumento: ./deploy.sh
# ============================================

MSG="${1:-update: $(date '+%d/%m/%Y %H:%M')}"

echo "📝 Commiteando: $MSG"
git add -A
git commit -m "$MSG"
# El push lo hace automáticamente el hook post-commit
DEPLOY

chmod +x deploy.sh

# 4. Crear archivo CLAUDE.md con instrucciones para Claude Code
cat > CLAUDE.md << 'CLAUDEMD'
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
CLAUDEMD

echo ""
echo "✅ Setup completo. Archivos creados:"
echo "   → .git/hooks/post-commit (auto-push después de cada commit)"
echo "   → deploy.sh (comando para commitear y deployar)"
echo "   → CLAUDE.md (instrucciones para Claude Code)"
echo ""
echo "📋 USO:"
echo "   ./deploy.sh 'descripción del cambio'"
echo ""
echo "⚡ Workflow:"
echo "   Claude Code edita → ./deploy.sh → GitHub → Netlify → marianocalandra.com ✓"
