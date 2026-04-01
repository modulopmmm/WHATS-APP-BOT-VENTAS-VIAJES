# 📱 Guía de Uso - Bot WhatsApp Club Diamante

## 🎯 Objetivo del Bot

Bot de primer contacto que recopila información del cliente antes de pasar con el recepcionista para cotización personalizada.

---

## 🏨 HOTEL

### Información que recopila:
1. **Fechas de hospedaje** (entrada y salida)
2. **Número de personas**
3. **¿Trae mascotas?** (Sí/No)

### NO muestra precios
- Los precios dependen de la temporada
- El recepcionista cotiza directamente con la información recopilada
- Ofrece opciones de habitaciones según número de personas

---

## 🎉 SALÓN DE EVENTOS

### Información que recopila:
1. **Número de personas** (invitados aproximados)
2. **Fecha(s) del evento**
3. **Tipo de evento** (boda, XV años, cumpleaños, corporativo, etc.)

### Capacidades disponibles:
- Hasta 50 personas
- Hasta 100 personas
- Hasta 200 personas

---

## 🚌 VIAJES GRUPALES Y CORRIDAS

### Información que recopila:
1. **Origen y destino** (De dónde a dónde)
2. **Número de personas** (Mínimo 15-18)
3. **Horario preferido**:
   - 10:00 AM
   - 5:00 PM
   - 11:50 PM
4. **Fecha del viaje**

### Características:
- Viajes desde cualquier punto de CDMX o Estado de México
- Precio según kilómetros recorridos y tiempo
- Mínimo 15-18 personas para viaje grupal

---

## 📋 Flujo de Conversación

### 1. Saludo Inicial
Cliente: "Hola"

Bot muestra menú:
```
1️⃣ HOTEL 🏨
2️⃣ SALÓN DE EVENTOS 🎉
3️⃣ VIAJES GRUPALES 🚌
```

### 2. Cliente elige opción
Cliente: "1" o "hotel"

Bot muestra submenú del hotel con opciones

### 3. Cliente pide información
Cliente: "precios" o "reservar"

Bot solicita datos necesarios

### 4. Cliente proporciona datos
Cliente envía la información

Bot confirma y da contacto para cotización

---

## 🔄 Comandos Útiles

- **"menú"** o **"inicio"** - Volver al menú principal
- **"ayuda"** - Ver opciones disponibles
- **"hola"** - Reiniciar conversación

---

## 📞 Información de Contacto

El bot siempre proporciona:
- 📞 Teléfono: +52 123 456 7890
- 📧 Email: info@clubdiamante.com

---

## ⚙️ Personalización

### Editar información del negocio:

Abre `bot.js` y modifica la sección CONFIG:

```javascript
const CONFIG = {
    nombreNegocio: 'Club Diamante',
    telefono: '+52 123 456 7890',
    email: 'info@clubdiamante.com',
    // ...
};
```

### Agregar más palabras clave:

```javascript
palabrasClave: {
    hotel: ['hotel', '1', 'hospedaje', 'habitacion'],
    // Agrega más palabras aquí
}
```

---

## 🚀 Instalación Rápida

1. **Instalar Node.js**
   ```bash
   # Descarga desde: https://nodejs.org
   # O usa el instalador que descargamos
   open ~/node-installer.pkg
   ```

2. **Instalar dependencias**
   ```bash
   cd whatsapp-bot
   npm install
   ```

3. **Iniciar bot**
   ```bash
   npm start
   ```

4. **Escanear QR con WhatsApp**
   - WhatsApp > Dispositivos vinculados
   - Vincular dispositivo
   - Escanear código

---

## 💡 Consejos

1. **Mantén el bot corriendo**: Deja la terminal abierta
2. **Prueba primero**: Envía mensajes de prueba a tu WhatsApp
3. **Personaliza respuestas**: Edita las funciones en bot.js
4. **Monitorea**: Revisa la consola para ver mensajes entrantes

---

## ❓ Preguntas Frecuentes

**¿El bot responde automáticamente?**
Sí, 24/7 mientras esté corriendo.

**¿Puedo usar mi WhatsApp personal?**
Sí, pero recomendamos un número de negocio.

**¿Funciona en grupos?**
No, solo responde mensajes directos.

**¿Cuánto cuesta?**
$0 MXN - Completamente gratis.

**¿Necesito dejar mi Mac prendida?**
Sí, o contratar un servidor ($150 MXN/mes).

---

## 📝 Notas Importantes

- El bot NO cotiza precios, solo recopila información
- El recepcionista hace la cotización personalizada
- Precios de hotel dependen de temporada
- Viajes grupales mínimo 15-18 personas
- Precio de viajes según kilómetros y tiempo

---

**Fecha**: Marzo 2026
**Versión**: 1.0
