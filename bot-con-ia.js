const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// ============================================
// CONFIGURACIÓN
// ============================================
const CONFIG = {
    nombreNegocio: 'Club Diamante Hotel',
    
    // IMPORTANTE: Agrega tu API key aquí
    // OpenAI: https://platform.openai.com/api-keys
    // Claude: https://console.anthropic.com/
    openaiApiKey: 'tu-api-key-aqui',
    
    // Información del negocio para la IA
    contextNegocio: `
Eres un asistente virtual del Club Diamante Hotel.

INFORMACIÓN DEL HOTEL:
- Nombre: Club Diamante Hotel
- Ubicación: Zona Hotelera, frente a la playa
- Teléfono: +52 123 456 7890
- Email: info@clubdiamante.com

TARIFAS:
- Habitación Estándar: $1,200 MXN/noche
- Habitación Doble: $1,800 MXN/noche
- Suite Premium: $2,500 MXN/noche
- Suite Presidencial: $4,000 MXN/noche

SERVICIOS INCLUIDOS:
- Desayuno buffet (7:00 AM - 11:00 AM)
- WiFi de alta velocidad
- Alberca climatizada (8:00 AM - 8:00 PM)
- Gimnasio (6:00 AM - 10:00 PM)
- Estacionamiento gratuito
- Room service 24/7

HORARIOS:
- Check-in: 3:00 PM
- Check-out: 12:00 PM
- Recepción: 24/7
- Restaurante: 1:00 PM - 10:00 PM

INSTRUCCIONES:
- Sé amable, profesional y servicial
- Responde en español
- Si no sabes algo, ofrece contactar a recepción
- Usa emojis moderadamente
- Mantén respuestas concisas (máximo 200 palabras)
- Si preguntan por reservaciones, pide: fecha entrada, fecha salida, número de personas
`
};

// ============================================
// INICIALIZAR WHATSAPP
// ============================================
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Historial de conversaciones (últimos 5 mensajes por usuario)
const conversaciones = new Map();

// ============================================
// EVENTOS
// ============================================

client.on('qr', (qr) => {
    console.log('📱 Escanea este código QR con WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot con IA conectado y listo!');
    console.log(`🤖 Usando OpenAI GPT para respuestas inteligentes\n`);
});

client.on('message', async (message) => {
    try {
        if (message.from.includes('@g.us') || message.isStatus) {
            return;
        }

        const contacto = await message.getContact();
        const nombre = contacto.pushname || 'Cliente';
        const userId = message.from;

        console.log(`📩 ${nombre}: ${message.body}`);

        // Obtener historial del usuario
        if (!conversaciones.has(userId)) {
            conversaciones.set(userId, []);
        }
        const historial = conversaciones.get(userId);

        // Agregar mensaje del usuario al historial
        historial.push({
            role: 'user',
            content: message.body
        });

        // Mantener solo últimos 5 mensajes
        if (historial.length > 10) {
            historial.splice(0, historial.length - 10);
        }

        // Generar respuesta con IA
        const respuesta = await generarRespuestaIA(historial, nombre);

        // Agregar respuesta al historial
        historial.push({
            role: 'assistant',
            content: respuesta
        });

        // Enviar respuesta
        await message.reply(respuesta);
        console.log(`✅ Respuesta enviada\n`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        await message.reply('Disculpa, tuve un problema. ¿Puedes repetir tu pregunta?');
    }
});

// ============================================
// FUNCIÓN DE IA CON OPENAI
// ============================================

async function generarRespuestaIA(historial, nombre) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: CONFIG.contextNegocio
                    },
                    ...historial
                ],
                max_tokens: 300,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${CONFIG.openaiApiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.choices[0].message.content.trim();

    } catch (error) {
        console.error('Error en API de OpenAI:', error.response?.data || error.message);
        
        // Fallback a respuesta simple
        return `Hola ${nombre}, gracias por contactarnos. ` +
               `En este momento tengo problemas técnicos. ` +
               `Por favor llama al ${CONFIG.telefono} o escribe a ${CONFIG.email}`;
    }
}

// ============================================
// INICIAR
// ============================================

client.initialize();

console.log('🚀 Iniciando bot con IA...');
console.log('⏳ Esperando código QR...\n');
