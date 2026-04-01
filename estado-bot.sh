#!/bin/bash

# Script para verificar el estado del bot
# Viajes al Paraíso

echo "🔍 Verificando estado del bot..."
echo ""

if [ -f bot.pid ]; then
    PID=$(cat bot.pid)
    
    if ps -p $PID > /dev/null 2>&1; then
        echo "✅ El bot está CORRIENDO"
        echo "🆔 PID: $PID"
        echo "⏰ Tiempo activo: $(ps -o etime= -p $PID)"
        echo "💾 Memoria: $(ps -o rss= -p $PID | awk '{print $1/1024 " MB"}')"
        echo ""
        echo "📊 Ver logs: ./ver-logs.sh"
        echo "🛑 Detener: ./detener-bot.sh"
    else
        echo "❌ El bot NO está corriendo"
        echo "⚠️  El archivo PID existe pero el proceso no"
        rm bot.pid
        echo ""
        echo "🚀 Iniciar: ./iniciar-bot.sh"
    fi
else
    echo "❌ El bot NO está corriendo"
    echo ""
    echo "🚀 Iniciar: ./iniciar-bot.sh"
fi
