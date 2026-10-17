#!/bin/sh
# Publie docs/ sur GitHub Pages (commit + push).
cd "$(dirname "$0")/.." || exit 1
.venv/bin/python pipeline/index.py
git add -A docs pipeline template README.md .gitignore
git -c user.name="Alexandre Rosenberger" -c user.email="contact@agencemopale.com" commit -qm "Aperçus : $(ls -d docs/*/ | grep -v _captures | wc -l | tr -d ' ') maquettes" && git push -q origin main && echo "publié : https://rosenaal.github.io/mopal-apercus/"
