#!/bin/bash

# Script para ver los logs del bot en tiempo real
# Viajes al Paraíso

echo "📊 Mostrando logs del bot en tiempo real..."
echo "Presiona Ctrl+C para salir"
echo ""

if [ -f bot.log ]; then
    tail -f bot.log
else
    echo "⚠️  No se encontró el archivo bot.log"
    echo "El bot puede no haber sido iniciado aún"
fi
