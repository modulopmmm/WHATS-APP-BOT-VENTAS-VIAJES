# 🚌 Bot WhatsApp - Viajes al Paraíso

Bot automatizado de WhatsApp para atención al cliente de la agencia de viajes.

---

## 📋 SERVICIOS QUE MANEJA

### 1️⃣ CORRIDAS DIARIAS
- Ruta: Central Taxqueña (CDMX) ↔ Acapulco Costera
- Horarios: 10:00 AM, 5:00 PM, 11:50 PM
- Precio desde: $600 MXN (temporada alta)
- Anticipo sencillo: $100 por persona
- Anticipo redondo: $200 por persona

### 2️⃣ TOURS TURÍSTICOS
- Destinos: Cualquier parte del país
- Mínimo: 15-18 personas
- Precio: Según destino, duración y temporada
- Anticipo: $100 por persona

### 3️⃣ VIAJES GRUPALES/EJECUTIVOS
- Renta de autobús
- Mínimo: 15-18 personas
- Horarios: 10:00 AM, 5:00 PM, 11:50 PM
- Precio: Según kilómetros y tiempo
- Anticipo: $100 por persona

---

## 🔐 INFORMACIÓN IMPORTANTE

### ⚠️ Punto de reunión y teléfono del chofer
- Se proporciona SOLO cuando se confirma el anticipo
- Esto evita confusiones y asegura reservaciones serias

### 💳 Anticipos
- Sencillo: $100 por persona
- Redondo: $200 por persona
- Temporada alta: Desde $600 MXN por persona

---

## 🚀 CÓMO USAR EL BOT

### Iniciar el bot:
```bash
cd whatsapp-bot
node bot-viajes.js
```

### Detener el bot:
```bash
Ctrl + C
```

---

## 💬 FLUJO DE CONVERSACIÓN

### Cliente escribe: "Hola"
Bot muestra menú:
```
1️⃣ CORRIDAS DIARIAS
2️⃣ TOURS TURÍSTICOS  
3️⃣ VIAJES GRUPALES
```

### Cliente elige: "1" o "corridas"
Bot muestra información de corridas diarias

### Cliente pregunta: "precios"
Bot solicita datos para cotizar

### Cliente pregunta: "punto de reunión"
Bot explica que se da al confirmar anticipo

---

## ⚙️ PERSONALIZACIÓN

### Cambiar información:
Edita `bot-viajes.js` en la sección CONFIG:

```javascript
const CONFIG = {
    nombreAgencia: 'Viajes al Paraíso',
    telefono: '+52 744 221 8624',
    ubicacion: 'Hotel Club Diamante, Puerto Marqués',
    // ...
};
```

---

## 📞 INFORMACIÓN DE CONTACTO

- **Agencia:** Viajes al Paraíso
- **Teléfono:** +52 744 221 8624
- **Ubicación:** Hotel Club Diamante, Puerto Marqués, Acapulco

---

## 💡 VENTAJAS DEL BOT

✅ Responde 24/7 automáticamente
✅ Recopila información del cliente
✅ Filtra consultas serias (anticipo)
✅ Reduce carga de trabajo del personal
✅ Proporciona información clara y consistente
✅ No da punto de reunión hasta confirmar anticipo

---

## 🔧 MANTENIMIENTO

### Ver mensajes en tiempo real:
Los mensajes aparecen en la consola donde corre el bot

### Reiniciar el bot:
```bash
Ctrl + C
node bot-viajes.js
```

### Mantener bot corriendo 24/7:
Opción 1: Dejar Mac prendida
Opción 2: Contratar servidor VPS ($150 MXN/mes)

---

## ❓ PREGUNTAS FRECUENTES

**¿El bot da el punto de reunión?**
No, solo cuando se confirma el anticipo.

**¿El bot cobra?**
No, solo informa precios y recopila datos.

**¿Funciona sin internet?**
No, necesita conexión a internet.

**¿Puedo modificar las respuestas?**
Sí, editando bot-viajes.js

---

**Fecha:** Marzo 2026
**Versión:** 1.0 - Especializado en Viajes al Paraíso
