const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// ============================================
// CONFIGURACIÓN - VIAJES AL PARAÍSO
// ============================================
const CONFIG = {
    nombreAgencia: 'Viajes en Familia',
    telefono: '+52 744 221 8624',
    ubicacion: 'Hotel Club Diamante, Puerto Marqués, Acapulco',
    
    // Información de servicios
    corridas: {
        ruta: 'Central de Autobuses Taxqueña ↔ Acapulco Costera',
        horarios: ['10:00 AM', '5:00 PM', '11:50 PM']
    },
    
    anticipos: {
        sencillo: 100,
        redondo: 200,
        temporadaAlta: 600
    },
    
    // Cuentas bancarias para depósito
    cuentasBancarias: {
        banco1: {
            nombre: 'Mercado Pago W',
            titular: 'Veronica Bustos Chavez',
            clabe: '722969010770501905'
        },
        banco2: {
            nombre: 'Banco Azteca',
            titular: 'Verónica Bustos',
            tarjeta: '1272 6101 3398 1910 42'
        },
        banco3: {
            nombre: 'Spin by OXXO',
            titular: 'Verónica Bustos',
            tarjeta: '4217 4701 4588 4298'
        }
    },
    
    minimoPersonas: '15-18 personas',
    
    palabrasClave: {
        saludo: ['hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'ola', 'inicio'],
        corridas: ['corridas', 'horarios', 'taxqueña', 'acapulco', 'cdmx', 'diarias', '1'],
        grupal: ['grupal', 'grupo', 'renta', 'autobus', 'camion', 'ejecutivo', '2'],
        asesor: ['asesor', 'agente', 'persona', 'humano', 'hablar', 'contacto', '3'],
        cuentas: ['cuentas', 'deposito', 'transferencia', 'pago', 'banco', 'datos'],
        precios: ['precio', 'costo', 'cuanto', 'tarifa', 'cotizar'],
        reservar: ['reservar', 'apartar', 'anticipo', 'pagar'],
        ubicacion: ['donde', 'ubicacion', 'direccion', 'encuentro', 'reunion'],
        ayuda: ['ayuda', 'info', 'menu', 'opciones']
    }
};

const estadoUsuarios = new Map();

// Función para verificar si ya se mostró el menú
function yaVioMenu(userId) {
    const estado = estadoUsuarios.get(userId);
    return estado && estado.menuMostrado;
}

function marcarMenuMostrado(userId) {
    const estado = estadoUsuarios.get(userId);
    if (estado) {
        estado.menuMostrado = true;
    }
}

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

client.on('qr', (qr) => {
    console.log('📱 Escanea este código QR con WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot conectado!');
    console.log(`🚌 ${CONFIG.nombreAgencia}`);
    console.log('⏰ Esperando mensajes...\n');
});

client.on('message', async (message) => {
    try {
        if (message.from.includes('@g.us') || message.isStatus) return;

        const texto = message.body.toLowerCase().trim();
        const contacto = await message.getContact();
        const nombre = contacto.pushname || 'Cliente';
        const userId = message.from;

        console.log(`📩 ${nombre}: ${message.body}`);

        if (!estadoUsuarios.has(userId)) {
            estadoUsuarios.set(userId, { seccion: null });
        }
        const estado = estadoUsuarios.get(userId);

        const respuesta = generarRespuesta(texto, nombre, estado, userId);
        await message.reply(respuesta);
        console.log(`✅ Respuesta enviada\n`);

    } catch (error) {
        console.error('❌ Error:', error);
    }
});

// ============================================
// SISTEMA DE RESPUESTAS
// ============================================
function generarRespuesta(texto, nombre, estado) {
    const { palabrasClave } = CONFIG;

    if (contienePalabras(texto, palabrasClave.saludo) || contienePalabras(texto, palabrasClave.ayuda)) {
        estado.seccion = null;
        return menuPrincipal(nombre);
    }

    if (!estado.seccion) {
        if (contienePalabras(texto, palabrasClave.corridas)) {
            estado.seccion = 'corridas';
            return infoCorridas();
        }
        if (contienePalabras(texto, palabrasClave.grupal)) {
            estado.seccion = 'grupal';
            return infoGrupal();
        }
        if (contienePalabras(texto, palabrasClave.asesor)) {
            return hablarConAsesor(nombre);
        }
        if (contienePalabras(texto, palabrasClave.cuentas)) {
            return mostrarCuentasBancarias();
        }
        return menuPrincipal(nombre);
    }

    if (estado.seccion === 'corridas') {
        return respuestasCorridas(texto);
    }
    if (estado.seccion === 'grupal') {
        return respuestasGrupal(texto);
    }

    return menuPrincipal(nombre);
}

function contienePalabras(texto, palabras) {
    return palabras.some(palabra => texto.includes(palabra));
}

// ============================================
// MENÚ PRINCIPAL
// ============================================
function menuPrincipal(nombre) {
    return `¡Hola ${nombre}! 👋\n\n` +
           `Bienvenido a *${CONFIG.nombreAgencia}* 🚌✨\n\n` +
           `⚠️ *IMPORTANTE:*\n` +
           `Los lugares se apartan por internet para evitar filas. Reserva aquí y viaja sin complicaciones! 🎫\n\n` +
           `¿Qué servicio te interesa?\n\n` +
           `*1️⃣ CORRIDAS DIARIAS* 🚍\n` +
           `   Taxqueña ↔ Acapulco\n` +
           `   Horarios: 10am, 5pm, 11:50pm\n\n` +
           `*2️⃣ VIAJES GRUPALES* 👥\n` +
           `   Renta de unidades (15-18 personas mín.)\n\n` +
           `*3️⃣ HABLAR CON ASESOR* 👤\n` +
           `   Atención personalizada\n\n` +
           `👉 *Escribe el número (1, 2 o 3) para iniciar*`;
}

// ============================================
// HABLAR CON ASESOR
// ============================================
function hablarConAsesor(nombre) {
    return `👤 *CONTACTO CON ASESOR*\n\n` +
           `¡Hola ${nombre}! 😊\n\n` +
           `Con gusto te atendemos personalmente.\n\n` +
           `📞 *Llámanos:*\n` +
           `${CONFIG.telefono}\n\n` +
           `💬 *O escríbenos por WhatsApp:*\n` +
           `Responderemos tu mensaje lo antes posible\n\n` +
           `📍 *Visítanos:*\n` +
           `${CONFIG.ubicacion}\n\n` +
           `⏰ *Horario de atención:*\n` +
           `Lunes a Domingo\n` +
           `10:00 AM - 6:00 PM\n\n` +
           `_Escribe "menú" para volver al inicio_`;
}

// ============================================
// DATOS PARA PAGO/DEPÓSITO
// ============================================
function datosPago() {
    return `💳 *DATOS PARA DEPÓSITO*\n\n` +
           `¡Hola! 😀 Te comparto los datos para que puedas transferir el anticipo 👇\n\n` +
           `━━━━━━━━━━━━━━━━━━━━\n` +
           `🏦 *OPCIÓN 1: TRANSFERENCIA BANCARIA*\n\n` +
           `📋 CLABE: 722969010770501905\n` +
           `👤 Beneficiario: Veronica Bustos Chavez\n` +
           `🏛️ Institución: Mercado Pago W\n\n` +
           `━━━━━━━━━━━━━━━━━━━━\n` +
           `💳 *OPCIÓN 2: BANCO AZTECA*\n\n` +
           `💳 Tarjeta: 1272 6101 3398 1910 42\n` +
           `👤 Nombre: Verónica Bustos\n\n` +
           `━━━━━━━━━━━━━━━━━━━━\n` +
           `🏪 *OPCIÓN 3: SPIN BY OXXO*\n\n` +
           `💳 No. Tarjeta: 4217 4701 4588 4298\n` +
           `👤 Nombre: Verónica Bustos\n\n` +
           `━━━━━━━━━━━━━━━━━━━━\n\n` +
           `⚠️ *IMPORTANTE:*\n` +
           `• El anticipo confirma tu reservación\n` +
           `• El resto se paga al abordar\n` +
           `• Envía tu comprobante de pago\n` +
           `• Recibirás punto de reunión y teléfono del chofer\n\n` +
           `📞 Confirma tu pago al:\n` +
           `${CONFIG.telefono}\n\n` +
           `_Escribe "menú" para volver al inicio_`;
}

// ============================================
// CORRIDAS DIARIAS
// ============================================
function infoCorridas() {
    return `🚍 *CORRIDAS DIARIAS*\n\n` +
           `📍 *Ruta:*\n` +
           `Central de Autobuses Taxqueña (CDMX)\n` +
           `↕️\n` +
           `Acapulco Costera\n\n` +
           `🕐 *Horarios:*\n` +
           `• 10:00 AM\n` +
           `• 5:00 PM\n` +
           `• 11:50 PM\n\n` +
           `💰 *Precios:*\n` +
           `• Viaje sencillo: Desde $600 MXN\n` +
           `• Viaje redondo: Consultar\n` +
           `• Temporada alta: Desde $600 MXN\n\n` +
           `📅 *Para reservar:*\n` +
           `• Anticipo sencillo: $100 por persona\n` +
           `• Anticipo redondo: $200 por persona\n\n` +
           `¿Qué necesitas?\n` +
           `• *Precios* - Cotización\n` +
           `• *Reservar* - Apartar lugar\n` +
           `• *Pago* - Datos para depósito\n` +
           `• *Ubicación* - Punto de salida\n` +
           `• *Asesor* - Hablar con una persona\n` +
           `• *Menú* - Volver al inicio`;
}

function respuestasCorridas(texto) {
    const { palabrasClave } = CONFIG;

    if (contienePalabras(texto, palabrasClave.precios)) {
        return preciosCorridas();
    }
    if (contienePalabras(texto, palabrasClave.reservar)) {
        return reservarCorridas();
    }
    if (contienePalabras(texto, palabrasClave.ubicacion)) {
        return ubicacionCorridas();
    }
    if (contienePalabras(texto, palabrasClave.cuentas)) {
        return mostrarCuentasBancarias();
    }
    if (contienePalabras(texto, palabrasClave.asesor)) {
        return hablarConAsesor('Cliente');
    }
    
    return infoCorridas();
}

function preciosCorridas() {
    return `💰 *PRECIOS CORRIDAS DIARIAS*\n\n` +
           `Taxqueña ↔ Acapulco (Viaje Sencillo)\n\n` +
           `📅 *Lunes a Jueves:*\n` +
           `$450 MXN por persona\n\n` +
           `📅 *Viernes a Domingo:*\n` +
           `$500 MXN por persona\n\n` +
           `🎉 *Temporada Alta:*\n` +
           `$600 MXN por persona\n` +
           `(Semana Santa, Navidad, Año Nuevo, puentes)\n\n` +
           `🎫🎫 *Viaje Redondo:*\n` +
           `Precio especial - Consultar\n\n` +
           `📅 *Anticipos para apartar:*\n` +
           `• Sencillo: $100 por persona\n` +
           `• Redondo: $200 por persona\n\n` +
           `📞 *Para reservar:*\n` +
           `Llama al ${CONFIG.telefono}\n` +
           `y pregunta por disponibilidad en tu fecha\n\n` +
           `⚠️ Sujeto a disponibilidad`;
}

function reservarCorridas() {
    return `📅 *RESERVAR CORRIDA*\n\n` +
           `Para apartar tu lugar necesito:\n\n` +
           `1️⃣ *Fecha del viaje*\n` +
           `2️⃣ *Número de personas*\n` +
           `3️⃣ *Tipo de viaje*\n` +
           `   • Sencillo (solo ida)\n` +
           `   • Redondo (ida y vuelta)\n` +
           `4️⃣ *Horario*\n` +
           `   • 10:00 AM\n` +
           `   • 5:00 PM\n` +
           `   • 11:50 PM\n\n` +
           `💳 *Anticipo:*\n` +
           `• Sencillo: $100 por persona\n` +
           `• Redondo: $200 por persona\n\n` +
           `🏖️ *¿VIVES EN ACAPULCO?*\n` +
           `Si necesitas viaje redondo desde Acapulco, agenda una cita para ver la unidad antes de tu viaje.\n\n` +
           `💰 *Para hacer el depósito:*\n` +
           `Escribe "pago" o "datos" para ver las cuentas\n\n` +
           `📍 Una vez confirmado el anticipo te damos:\n` +
           `✅ Punto de reunión\n` +
           `✅ Teléfono del chofer\n\n` +
           `⚠️ El resto se paga al abordar\n\n` +
           `📞 Llama o escribe:\n` +
           `${CONFIG.telefono}`;
}

function ubicacionCorridas() {
    return `📍 *PUNTOS DE SALIDA*\n\n` +
           `🚌 *Desde CDMX:*\n` +
           `Central de Autobuses Taxqueña\n\n` +
           `🏖️ *Desde Acapulco:*\n` +
           `Acapulco Costera\n\n` +
           `⚠️ *IMPORTANTE:*\n` +
           `El punto exacto de reunión y teléfono del chofer se proporcionan SOLO cuando se confirma el anticipo del viaje.\n\n` +
           `💳 *Anticipos:*\n` +
           `• Sencillo: $100 por persona\n` +
           `• Redondo: $200 por persona\n\n` +
           `📞 Para más información:\n` +
           `${CONFIG.telefono}`;
}

// ============================================
// ============================================
// VIAJES GRUPALES / RENTA DE AUTOBÚS
// ============================================
function infoGrupal() {
    return `👥 *VIAJES GRUPALES Y EJECUTIVOS*\n\n` +
           `Renta de unidades para tu grupo\n\n` +
           `✅ Viajes a cualquier parte del país\n` +
           `✅ Servicio ejecutivo\n` +
           `✅ Unidades cómodas y seguras\n\n` +
           `⚠️ *Requisitos:*\n` +
           `Mínimo ${CONFIG.minimoPersonas} personas\n\n` +
           `🕐 *Horarios disponibles:*\n` +
           `• 10:00 AM\n` +
           `• 5:00 PM\n` +
           `• 11:50 PM\n\n` +
           `🏖️ *¿Vives en Acapulco?*\n` +
           `Si necesitas viaje redondo desde Acapulco, agenda una cita para ver la unidad antes de tu viaje.\n\n` +
           `Para cotizar necesito:\n\n` +
           `1️⃣ *Origen y destino*\n` +
           `   ¿De dónde a dónde?\n\n` +
           `2️⃣ *Número de personas*\n` +
           `   (Mínimo ${CONFIG.minimoPersonas})\n\n` +
           `3️⃣ *Fecha del viaje*\n\n` +
           `4️⃣ *Horario preferido*\n\n` +
           `📞 Contáctanos:\n` +
           `${CONFIG.telefono}\n\n` +
           `_Escribe "menú" para volver al inicio_`;
}

function respuestasGrupal(texto) {
    const { palabrasClave } = CONFIG;

    if (contienePalabras(texto, palabrasClave.precios)) {
        return preciosGrupal();
    }
    if (contienePalabras(texto, palabrasClave.reservar)) {
        return reservarGrupal();
    }
    if (contienePalabras(texto, palabrasClave.pago)) {
        return datosPago();
    }
    if (contienePalabras(texto, palabrasClave.asesor)) {
        return hablarConAsesor('Cliente');
    }
    
    return infoGrupal();
}

function preciosGrupal() {
    return `💰 *COTIZACIÓN VIAJES GRUPALES*\n\n` +
           `El precio se calcula según:\n\n` +
           `📏 *Kilómetros recorridos*\n` +
           `⏱️ *Tiempo de viaje*\n` +
           `👥 *Número de personas*\n` +
           `📅 *Temporada*\n\n` +
           `⚠️ *Mínimo:* ${CONFIG.minimoPersonas} personas\n\n` +
           `Para cotizar necesito:\n\n` +
           `1️⃣ *¿De dónde a dónde?*\n` +
           `   (Origen → Destino)\n\n` +
           `2️⃣ *¿Cuántas personas?*\n\n` +
           `3️⃣ *¿Qué fecha?*\n\n` +
           `4️⃣ *¿Qué horario?*\n` +
           `   • 10:00 AM\n` +
           `   • 5:00 PM\n` +
           `   • 11:50 PM\n\n` +
           `📞 Envía estos datos:\n` +
           `${CONFIG.telefono}\n\n` +
           `Te cotizamos inmediatamente! ⚡`;
}

function reservarGrupal() {
    return `📅 *RESERVAR VIAJE GRUPAL*\n\n` +
           `Para apartar la unidad necesito:\n\n` +
           `1️⃣ *Origen y destino*\n` +
           `2️⃣ *Fecha del viaje*\n` +
           `3️⃣ *Número de personas*\n` +
           `   (Mínimo ${CONFIG.minimoPersonas})\n` +
           `4️⃣ *Horario*\n` +
           `   • 10:00 AM\n` +
           `   • 5:00 PM\n` +
           `   • 11:50 PM\n\n` +
           `🏖️ *¿Vives en Acapulco?*\n` +
           `Si necesitas viaje redondo desde Acapulco, agenda una cita para ver la unidad.\n\n` +
           `💳 *Anticipo para apartar:*\n` +
           `$100 por persona\n\n` +
           `📍 Una vez confirmado el anticipo:\n` +
           `✅ Punto de reunión exacto\n` +
           `✅ Teléfono del chofer\n` +
           `✅ Detalles del viaje\n\n` +
           `📞 Contáctanos:\n` +
           `${CONFIG.telefono}\n\n` +
           `📍 Ubicación:\n` +
           `${CONFIG.ubicacion}`;
}

// ============================================
// INICIAR BOT
// ============================================
client.initialize();

console.log('🚀 Iniciando bot de Viajes en Familia...');
console.log('⏳ Esperando código QR...\n');


// ============================================
// CUENTAS BANCARIAS
// ============================================
function mostrarCuentasBancarias() {
    return `💳 *DATOS PARA DEPÓSITO*\n\n` +
           `Una vez confirmada tu reservación, realiza el depósito del anticipo a cualquiera de estas cuentas:\n\n` +
           `━━━━━━━━━━━━━━━━━━━━\n` +
           `🏦 *Opción 1: Mercado Pago*\n\n` +
           `CLABE: 722969010770501905\n` +
           `Beneficiario: Veronica Bustos\n\n` +
           `━━━━━━━━━━━━━━━━━━━━\n` +
           `💳 *Opción 2: Banco Azteca*\n\n` +
           `Tarjeta: 1272 6101 3398 1910 42\n` +
           `Nombre: Verónica Bustos\n\n` +
           `━━━━━━━━━━━━━━━━━━━━\n` +
           `🏪 *Opción 3: Spin by OXXO*\n\n` +
           `Tarjeta: 4217 4701 4588 4298\n` +
           `Nombre: Verónica Bustos\n\n` +
           `━━━━━━━━━━━━━━━━━━━━\n\n` +
           `⚠️ *IMPORTANTE:*\n` +
           `• Envía tu comprobante de pago al ${CONFIG.telefono}\n` +
           `• Una vez reflejado el depósito recibirás:\n` +
           `  ✅ Punto de reunión exacto\n` +
           `  ✅ Teléfono del chofer\n` +
           `  ✅ Confirmación de tu viaje\n\n` +
           `📞 ¿Dudas? Llámanos: ${CONFIG.telefono}`;
}
