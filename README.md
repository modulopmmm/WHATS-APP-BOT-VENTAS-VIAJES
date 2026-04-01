# Bot de WhatsApp con IA para Negocios

Bot automatizado de WhatsApp con inteligencia artificial para atención al cliente 24/7.

## 🚀 Características

- ✅ Respuestas automáticas inteligentes
- 🤖 Integración con IA (OpenAI GPT)
- 💬 Mantiene contexto de conversación
- 📱 Fácil de configurar
- 🔄 Respuestas personalizadas por negocio
- ⚡ Responde instantáneamente

## 📋 Requisitos

- Node.js 16 o superior
- WhatsApp instalado en tu teléfono
- Cuenta de OpenAI (opcional, para IA avanzada)

## 🛠️ Instalación

### 1. Instalar Node.js

Si no tienes Node.js instalado:

```bash
# En macOS con Homebrew
brew install node

# Verificar instalación
node --version
npm --version
```

### 2. Instalar dependencias

```bash
cd whatsapp-bot
npm install
```

## 🎯 Uso

### Opción 1: Bot Simple (Sin IA externa)

Usa respuestas predefinidas inteligentes:

```bash
npm start
```

### Opción 2: Bot con IA (OpenAI)

1. Obtén tu API key de OpenAI:
   - Ve a https://platform.openai.com/api-keys
   - Crea una cuenta (gratis con créditos iniciales)
   - Genera una API key

2. Edita `bot-con-ia.js` y agrega tu API key:
   ```javascript
   openaiApiKey: 'sk-tu-api-key-aqui',
   ```

3. Ejecuta el bot:
   ```bash
   node bot-con-ia.js
   ```

### 3. Conectar WhatsApp

1. Ejecuta el bot
2. Escanea el código QR con WhatsApp:
   - Abre WhatsApp en tu teléfono
   - Ve a Configuración > Dispositivos vinculados
   - Toca "Vincular un dispositivo"
   - Escanea el código QR

3. ¡Listo! El bot está activo

## ⚙️ Configuración

### Personalizar información del negocio

Edita en `bot.js` o `bot-con-ia.js`:

```javascript
const CONFIG = {
    nombreNegocio: 'Tu Negocio',
    telefono: '+52 123 456 7890',
    email: 'info@tunegocio.com',
    // ... más configuración
};
```

### Agregar nuevas respuestas automáticas

En `bot.js`, agrega palabras clave:

```javascript
palabrasClave: {
    saludo: ['hola', 'buenos dias', 'hey'],
    precios: ['precio', 'costo', 'cuanto'],
    // Agrega más aquí
}
```

## 📱 Ejemplos de uso

El bot responde automáticamente a:

- **Saludos**: "Hola", "Buenos días"
- **Precios**: "¿Cuánto cuesta?", "Precios"
- **Horarios**: "¿A qué hora abren?"
- **Reservaciones**: "Quiero reservar"
- **Ubicación**: "¿Dónde están?"
- **Servicios**: "¿Qué incluye?"

## 🔧 Comandos útiles

```bash
# Iniciar bot
npm start

# Iniciar con auto-reinicio (desarrollo)
npm run dev

# Detener bot
Ctrl + C
```

## 📊 Versiones

### bot.js (Recomendado para empezar)
- ✅ No requiere API keys
- ✅ Gratis 100%
- ✅ Respuestas rápidas
- ⚠️ Respuestas predefinidas

### bot-con-ia.js (Avanzado)
- ✅ Respuestas más naturales
- ✅ Entiende contexto
- ✅ Aprende de conversaciones
- ⚠️ Requiere API key de OpenAI
- ⚠️ Costo por uso (~$0.002 por mensaje)

## 💡 Consejos

1. **Mantén el bot corriendo**: Usa `screen` o `pm2` en servidor
2. **Backup de sesión**: La carpeta `.wwebjs_auth` guarda tu sesión
3. **Monitorea logs**: Revisa la consola para ver actividad
4. **Prueba primero**: Envía mensajes de prueba antes de publicar

## 🚨 Solución de problemas

### Error: "Cannot find module"
```bash
npm install
```

### Error: "QR code timeout"
- Escanea el QR más rápido
- Verifica tu conexión a internet

### Bot no responde
- Verifica que WhatsApp esté conectado
- Revisa los logs en consola
- Reinicia el bot

### Error de API de OpenAI
- Verifica tu API key
- Revisa que tengas créditos disponibles
- Usa `bot.js` como alternativa

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en consola
2. Verifica tu conexión a internet
3. Asegúrate de tener Node.js actualizado

## 🔐 Seguridad

- ⚠️ NO compartas tu API key de OpenAI
- ⚠️ NO subas `.wwebjs_auth` a repositorios públicos
- ✅ Usa variables de entorno para API keys en producción

## 📝 Licencia

MIT - Úsalo libremente para tu negocio

---

**¿Necesitas ayuda?** Revisa la documentación de:
- [whatsapp-web.js](https://wwebjs.dev/)
- [OpenAI API](https://platform.openai.com/docs)
