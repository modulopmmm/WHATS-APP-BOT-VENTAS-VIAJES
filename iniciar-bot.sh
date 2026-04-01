#!/bin/bash

# Script para mantener el bot corriendo 24/7
# Viajes al Paraíso

echo "🚀 Iniciando bot de Viajes al Paraíso..."
echo "📱 El bot seguirá corriendo incluso si cierras esta ventana"
echo ""

# Ir al directorio del bot
cd "$(dirname "$0")"

# Iniciar el bot en segundo plano con nohup
nohup node bot-viajes.js > bot.log 2>&1 &

# Guardar el PID (ID del proceso)
echo $! > bot.pid

echo "✅ Bot iniciado correctamente!"
echo ""
echo "📊 Para ver los mensajes en tiempo real:"
echo "   tail -f bot.log"
echo ""
echo "🛑 Para detener el bot:"
echo "   ./detener-bot.sh"
echo ""
echo "📝 El bot está guardando logs en: bot.log"
echo "🆔 PID del proceso: $(cat bot.pid)"
