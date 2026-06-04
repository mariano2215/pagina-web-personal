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
