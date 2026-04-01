#!/bin/bash

# Script para detener el bot
# Viajes al Paraíso

echo "🛑 Deteniendo bot de Viajes al Paraíso..."

if [ -f bot.pid ]; then
    PID=$(cat bot.pid)
    
    if ps -p $PID > /dev/null 2>&1; then
        kill $PID
        echo "✅ Bot detenido correctamente (PID: $PID)"
        rm bot.pid
    else
        echo "⚠️  El bot no estaba corriendo"
        rm bot.pid
    fi
else
    echo "⚠️  No se encontró el archivo bot.pid"
    echo "El bot puede no estar corriendo o fue iniciado manualmente"
fi
