const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// ============================================
// CONFIGURACIÓN DEL NEGOCIO
// ============================================
const CONFIG = {
    nombreNegocio: 'Club Diamante',
    telefono: '+52 744 221 8624',
    email: 'info@clubdiamante.com',
    
    // Palabras clave para respuestas automáticas
    palabrasClave: {
        saludo: ['hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'ola', 'inicio', 'menu'],
        
        // Opciones del menú principal
        hotel: ['hotel', '1', 'hospedaje', 'habitacion', 'cuarto'],
        eventos: ['eventos', '2', 'salon', 'evento', 'fiesta', 'boda', 'reunion'],
        viajes: ['viajes', '3', 'corridas', 'transporte', 'tour', 'excursion'],
        
        // Palabras comunes
        precios: ['precio', 'costo', 'cuanto', 'tarifa', 'cotizar'],
        reservar: ['reservar', 'reservacion', 'disponibilidad', 'apartar'],
        servicios: ['servicio', 'incluye', 'amenidades', 'que tienen'],
        ubicacion: ['donde', 'ubicacion', 'direccion', 'como llegar'],
        horarios: ['horarios', 'horario', 'hora', 'salidas', 'corridas'],
        capacidad: ['capacidad', 'cuantas personas', 'aforo', 'caben'],
        destinos: ['destinos', 'donde van', 'a donde', 'lugares'],
        ayuda: ['ayuda', 'help', 'volver', 'atras']
    }
};

// Estado de conversación por usuario
const estadoUsuarios = new Map();

// ============================================
// INICIALIZAR CLIENTE DE WHATSAPP
// ============================================
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// ============================================
// EVENTOS DEL CLIENTE
// ============================================

client.on('qr', (qr) => {
    console.log('📱 Escanea este código QR con WhatsApp:');
    qrcode.generate(qr, { small: true });
    console.log('\n⚠️  Abre WhatsApp > Dispositivos vinculados > Vincular dispositivo');
});

client.on('ready', () => {
    console.log('✅ Bot de WhatsApp conectado y listo!');
    console.log(`🏨 Negocio: ${CONFIG.nombreNegocio}`);
    console.log('⏰ Esperando mensajes...\n');
});

// Manejar mensajes entrantes
client.on('message', async (message) => {
    try {
        if (message.from.includes('@g.us') || message.isStatus) {
            return;
        }

        const texto = message.body.toLowerCase().trim();
        const contacto = await message.getContact();
        const nombre = contacto.pushname || 'Cliente';
        const userId = message.from;

        console.log(`📩 Mensaje de ${nombre}: ${message.body}`);

        // Obtener o inicializar estado del usuario
        if (!estadoUsuarios.has(userId)) {
            estadoUsuarios.set(userId, { seccion: null });
        }
        const estado = estadoUsuarios.get(userId);

        // Generar respuesta inteligente
        const respuesta = generarRespuesta(texto, nombre, estado);

        // Enviar respuesta
        await message.reply(respuesta);
        console.log(`✅ Respuesta enviada a ${nombre}\n`);

    } catch (error) {
        console.error('❌ Error al procesar mensaje:', error);
    }
});

// ============================================
// SISTEMA DE RESPUESTAS INTELIGENTES
// ============================================

function generarRespuesta(texto, nombre, estado) {
    const { palabrasClave } = CONFIG;

    // Detectar si quiere volver al menú principal
    if (contienePalabras(texto, palabrasClave.saludo) || contienePalabras(texto, palabrasClave.ayuda)) {
        estado.seccion = null;
        return menuPrincipal(nombre);
    }

    // MENÚ PRINCIPAL - Seleccionar sección
    if (!estado.seccion) {
        if (contienePalabras(texto, palabrasClave.hotel)) {
            estado.seccion = 'hotel';
            return menuHotel();
        }
        if (contienePalabras(texto, palabrasClave.eventos)) {
            estado.seccion = 'eventos';
            return menuEventos();
        }
        if (contienePalabras(texto, palabrasClave.viajes)) {
            estado.seccion = 'viajes';
            return menuViajes();
        }
        return menuPrincipal(nombre);
    }

    // RESPUESTAS SEGÚN SECCIÓN ACTIVA
    if (estado.seccion === 'hotel') {
        return respuestasHotel(texto);
    }
    if (estado.seccion === 'eventos') {
        return respuestasEventos(texto);
    }
    if (estado.seccion === 'viajes') {
        return respuestasViajes(texto);
    }

    return menuPrincipal(nombre);
}

// ============================================
// MENÚ PRINCIPAL
// ============================================

function menuPrincipal(nombre) {
    return `¡Hola ${nombre}! 👋\n\n` +
           `Bienvenido a *${CONFIG.nombreNegocio}* ✨\n\n` +
           `¿Qué servicio te interesa?\n\n` +
           `*1️⃣ HOTEL* 🏨\n` +
           `   Hospedaje y habitaciones\n\n` +
           `*2️⃣ SALÓN DE EVENTOS* 🎉\n` +
           `   Bodas, fiestas y reuniones\n\n` +
           `*3️⃣ VIAJES GRUPALES* 🚌\n` +
           `   Tours y corridas diarias\n\n` +
           `_Escribe el número o nombre del servicio_`;
}

// ============================================
// MENÚS POR SECCIÓN
// ============================================

function menuHotel() {
    return `🏨 *HOTEL - CLUB DIAMANTE*\n\n` +
           `¿Qué información necesitas?\n\n` +
           `💰 *Precios* - Tarifas de habitaciones\n` +
           `📅 *Reservar* - Hacer reservación\n` +
           `⭐ *Servicios* - Amenidades incluidas\n` +
           `📍 *Ubicación* - Cómo llegar\n` +
           `🔙 *Menú* - Volver al inicio\n\n` +
           `_Escribe lo que necesites_`;
}

function menuEventos() {
    return `🎉 *SALÓN DE EVENTOS*\n\n` +
           `¿Qué información necesitas?\n\n` +
           `💰 *Precios* - Cotización de salón\n` +
           `👥 *Capacidad* - Aforo del salón\n` +
           `📅 *Reservar* - Apartar fecha\n` +
           `🎊 *Servicios* - Qué incluye\n` +
           `📍 *Ubicación* - Cómo llegar\n` +
           `🔙 *Menú* - Volver al inicio\n\n` +
           `_Escribe lo que necesites_`;
}

function menuViajes() {
    return `🚌 *VIAJES GRUPALES Y CORRIDAS*\n\n` +
           `¿Qué información necesitas?\n\n` +
           `🗺️ *Destinos* - A dónde viajamos\n` +
           `🕐 *Horarios* - Corridas diarias\n` +
           `💰 *Precios* - Tarifas de viajes\n` +
           `📅 *Reservar* - Apartar lugar\n` +
           `📍 *Salidas* - Puntos de partida\n` +
           `🔙 *Menú* - Volver al inicio\n\n` +
           `_Escribe lo que necesites_`;
}

// ============================================
// RESPUESTAS - HOTEL
// ============================================

function respuestasHotel(texto) {
    const { palabrasClave } = CONFIG;

    if (contienePalabras(texto, palabrasClave.precios)) {
        return preciosHotel();
    }
    if (contienePalabras(texto, palabrasClave.reservar)) {
        return reservaHotel();
    }
    if (contienePalabras(texto, palabrasClave.servicios)) {
        return serviciosHotel();
    }
    if (contienePalabras(texto, palabrasClave.ubicacion)) {
        return ubicacionHotel();
    }
    
    return menuHotel();
}

function preciosHotel() {
    return `💰 *COTIZACIÓN HOTEL*\n\n` +
           `Para darte el mejor precio necesito saber:\n\n` +
           `� ¿Qué días quieres hospedarte?\n` +
           `   (Ejemplo: Del 15 al 18 de abril)\n\n` +
           `👥 ¿Cuántas personas?\n\n` +
           `🐕 ¿Traes mascotas?\n\n` +
           `Con esta información nuestro recepcionista te dará:\n` +
           `• Opciones de habitaciones\n` +
           `• Precio según temporada\n` +
           `• Disponibilidad\n\n` +
           `📞 Llama: ${CONFIG.telefono}\n` +
           `📧 Escribe: ${CONFIG.email}\n\n` +
           `_Proporciona estos datos para cotizar_`;
}

function reservaHotel() {
    return `📅 *INFORMACIÓN PARA RESERVAR*\n\n` +
           `Por favor proporciona:\n\n` +
           `1️⃣ *Fechas de hospedaje*\n` +
           `   ¿Qué días? (entrada y salida)\n\n` +
           `2️⃣ *Número de personas*\n` +
           `   ¿Cuántos se hospedan?\n\n` +
           `3️⃣ *Mascotas*\n` +
           `   ¿Traes mascota? (Sí/No)\n\n` +
           `Con esta info te daremos:\n` +
           `✅ Opciones de habitaciones\n` +
           `✅ Precio según temporada\n` +
           `✅ Disponibilidad inmediata\n\n` +
           `📞 ${CONFIG.telefono}\n` +
           `📧 ${CONFIG.email}\n\n` +
           `_Envía estos datos y te contactamos_`;
}

function serviciosHotel() {
    return `⭐ *SERVICIOS DEL HOTEL*\n\n` +
           `🏊 Alberca\n` +
           `🍳 Desayuno incluido\n` +
           `📶 WiFi gratis\n` +
           `🅿️ Estacionamiento\n` +
           `🧺 Servicio de lavandería\n` +
           `🛎️ Recepción 24/7\n` +
           `❄️ Aire acondicionado\n` +
           `📺 TV por cable\n\n` +
           `¿Algo más?`;
}

function ubicacionHotel() {
    return `📍 *UBICACIÓN*\n\n` +
           `${CONFIG.nombreNegocio}\n` +
           `Av. Principal #123\n` +
           `Centro, CP 12345\n\n` +
           `🚗 Cómo llegar:\n` +
           `• 10 min del centro\n` +
           `• Cerca de la terminal\n\n` +
           `📞 ${CONFIG.telefono}`;
}

// ============================================
// RESPUESTAS - EVENTOS
// ============================================

function respuestasEventos(texto) {
    const { palabrasClave } = CONFIG;

    if (contienePalabras(texto, palabrasClave.precios)) {
        return preciosEventos();
    }
    if (contienePalabras(texto, palabrasClave.capacidad)) {
        return capacidadEventos();
    }
    if (contienePalabras(texto, palabrasClave.reservar)) {
        return reservaEventos();
    }
    if (contienePalabras(texto, palabrasClave.servicios)) {
        return serviciosEventos();
    }
    if (contienePalabras(texto, palabrasClave.ubicacion)) {
        return ubicacionEventos();
    }
    
    return menuEventos();
}

function preciosEventos() {
    return `💰 *COTIZACIÓN SALÓN DE EVENTOS*\n\n` +
           `Para cotizar tu evento necesito:\n\n` +
           `👥 *¿Cuántas personas?*\n` +
           `   (Número aproximado de invitados)\n\n` +
           `📅 *¿Qué día(s)?*\n` +
           `   (Fecha del evento)\n\n` +
           `🎉 *Tipo de evento:*\n` +
           `   • Boda 💒\n` +
           `   • XV Años 👑\n` +
           `   • Cumpleaños 🎂\n` +
           `   • Evento corporativo 💼\n` +
           `   • Otro\n\n` +
           `Con esta información te cotizamos:\n` +
           `✅ Salón adecuado\n` +
           `✅ Paquetes disponibles\n` +
           `✅ Servicios incluidos\n\n` +
           `📞 ${CONFIG.telefono}\n` +
           `📧 ${CONFIG.email}`;
}

function capacidadEventos() {
    return `👥 *CAPACIDAD DEL SALÓN*\n\n` +
           `Tenemos salones para diferentes aforos:\n\n` +
           `🏛️ Hasta 200 personas\n` +
           `🎪 Hasta 100 personas\n` +
           `🎯 Hasta 50 personas\n\n` +
           `Para cotizar necesito saber:\n\n` +
           `1️⃣ *¿Cuántas personas?*\n` +
           `2️⃣ *¿Qué día(s)?*\n\n` +
           `📞 ${CONFIG.telefono}\n` +
           `� ${CONFIG.email}\n\n` +
           `_Proporciona estos datos para cotizar_`;
}

function reservaEventos() {
    return `📅 *INFORMACIÓN PARA COTIZAR*\n\n` +
           `Por favor proporciona:\n\n` +
           `1️⃣ *Número de personas*\n` +
           `   ¿Cuántos invitados?\n\n` +
           `2️⃣ *Fecha del evento*\n` +
           `   ¿Qué día(s)?\n\n` +
           `3️⃣ *Tipo de evento*\n` +
           `   (Boda, XV años, cumpleaños, etc.)\n\n` +
           `Con esta información te enviamos:\n` +
           `✅ Cotización personalizada\n` +
           `✅ Opciones de salón\n` +
           `✅ Paquetes disponibles\n\n` +
           `📞 ${CONFIG.telefono}\n` +
           `📧 ${CONFIG.email}\n\n` +
           `_Envía estos datos y te contactamos_`;
}

function serviciosEventos() {
    return `🎊 *SERVICIOS INCLUIDOS*\n\n` +
           `✅ Salón decorado\n` +
           `✅ Mesas y sillas\n` +
           `✅ Mantelería\n` +
           `✅ Sonido básico\n` +
           `✅ Iluminación\n` +
           `✅ Estacionamiento\n` +
           `✅ Personal de apoyo\n\n` +
           `📦 *SERVICIOS ADICIONALES:*\n` +
           `• Catering\n` +
           `• DJ o música en vivo\n` +
           `• Decoración temática\n` +
           `• Fotografía/video\n` +
           `• Pastel\n\n` +
           `¿Te interesa alguno?`;
}

function ubicacionEventos() {
    return `📍 *UBICACIÓN SALÓN*\n\n` +
           `${CONFIG.nombreNegocio}\n` +
           `Salón de Eventos\n` +
           `Av. Principal #123\n\n` +
           `🅿️ Estacionamiento para 50 autos\n` +
           `♿ Acceso para discapacitados\n\n` +
           `📞 ${CONFIG.telefono}`;
}

// ============================================
// RESPUESTAS - VIAJES
// ============================================

function respuestasViajes(texto) {
    const { palabrasClave } = CONFIG;

    if (contienePalabras(texto, palabrasClave.destinos)) {
        return destinosViajes();
    }
    if (contienePalabras(texto, palabrasClave.horarios)) {
        return horariosViajes();
    }
    if (contienePalabras(texto, palabrasClave.precios)) {
        return preciosViajes();
    }
    if (contienePalabras(texto, palabrasClave.reservar)) {
        return reservaViajes();
    }
    if (contienePalabras(texto, palabrasClave.ubicacion)) {
        return salidasViajes();
    }
    
    return menuViajes();
}

function destinosViajes() {
    return `🗺️ *VIAJES GRUPALES*\n\n` +
           `Organizamos viajes a cualquier destino desde CDMX y Edo. de México.\n\n` +
           `Para cotizar necesito:\n\n` +
           `📍 *¿De dónde a dónde?*\n` +
           `   Origen → Destino\n\n` +
           `👥 *¿Cuántas personas?*\n` +
           `   (Mínimo 15-18 personas)\n\n` +
           `🕐 *¿Qué horario?*\n` +
           `   • 10:00 AM\n` +
           `   • 5:00 PM\n` +
           `   • 11:50 PM\n\n` +
           `💡 El precio depende de:\n` +
           `• Kilómetros recorridos\n` +
           `• Tiempo de viaje\n` +
           `• Número de personas\n\n` +
           `📞 ${CONFIG.telefono}\n` +
           `📧 ${CONFIG.email}`;
}

function horariosViajes() {
    return `🕐 *HORARIOS DISPONIBLES*\n\n` +
           `Tenemos 3 horarios:\n\n` +
           `🌅 *10:00 AM* - Matutino\n` +
           `🌆 *5:00 PM* - Vespertino\n` +
           `🌙 *11:50 PM* - Nocturno\n\n` +
           `Para cotizar necesito:\n\n` +
           `1️⃣ *¿De dónde a dónde?*\n` +
           `   (Origen y destino)\n\n` +
           `2️⃣ *¿Cuántas personas?*\n` +
           `   (Mínimo 15-18)\n\n` +
           `3️⃣ *¿Qué horario prefieres?*\n\n` +
           `📞 ${CONFIG.telefono}\n` +
           `📧 ${CONFIG.email}`;
}

function preciosViajes() {
    return `💰 *COTIZACIÓN DE VIAJES*\n\n` +
           `El precio se calcula según:\n\n` +
           `📏 *Kilómetros recorridos*\n` +
           `⏱️ *Tiempo de viaje*\n` +
           `👥 *Número de personas*\n\n` +
           `⚠️ *Viaje grupal mínimo:*\n` +
           `15-18 personas\n\n` +
           `Para cotizar necesito:\n\n` +
           `1️⃣ *Origen y destino*\n` +
           `   ¿De dónde a dónde?\n\n` +
           `2️⃣ *Cuántas personas*\n\n` +
           `3️⃣ *Horario preferido*\n` +
           `   (10am, 5pm o 11:50pm)\n\n` +
           `📞 ${CONFIG.telefono}\n` +
           `� ${CONFIG.email}\n\n` +
           `_Proporciona estos datos para cotizar_`;
}

function reservaViajes() {
    return `📅 *INFORMACIÓN PARA COTIZAR*\n\n` +
           `Por favor proporciona:\n\n` +
           `1️⃣ *Origen y destino*\n` +
           `   ¿De dónde a dónde?\n` +
           `   (Cualquier punto de CDMX o Edo. Méx.)\n\n` +
           `2️⃣ *Número de personas*\n` +
           `   ¿Cuántos viajan?\n` +
           `   (Mínimo 15-18 personas)\n\n` +
           `3️⃣ *Horario*\n` +
           `   • 10:00 AM\n` +
           `   • 5:00 PM\n` +
           `   • 11:50 PM\n\n` +
           `4️⃣ *Fecha del viaje*\n\n` +
           `Con esta info calculamos:\n` +
           `✅ Kilómetros y tiempo\n` +
           `✅ Precio por persona\n` +
           `✅ Disponibilidad\n\n` +
           `📞 ${CONFIG.telefono}\n` +
           `📧 ${CONFIG.email}\n\n` +
           `_Envía estos datos y te contactamos_`;
}

function salidasViajes() {
    return `📍 *PUNTOS DE SALIDA*\n\n` +
           `Salimos desde cualquier punto de:\n\n` +
           `🏙️ Ciudad de México\n` +
           `🏘️ Estado de México\n\n` +
           `El punto de salida se coordina según:\n` +
           `• Ubicación del grupo\n` +
           `• Destino final\n` +
           `• Ruta más conveniente\n\n` +
           `Para cotizar necesito:\n\n` +
           `📍 *¿De dónde a dónde?*\n` +
           `👥 *¿Cuántas personas?*\n` +
           `🕐 *¿Qué horario?*\n\n` +
           `📞 ${CONFIG.telefono}\n` +
           `📧 ${CONFIG.email}`;
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function contienePalabras(texto, palabras) {
    return palabras.some(palabra => texto.includes(palabra));
}

// ============================================
// INICIAR BOT
// ============================================

client.initialize();

console.log('🚀 Iniciando bot de WhatsApp...');
console.log('⏳ Esperando código QR...\n');
