// jwt-auth-demo/README.md
# 🔐 JWT Authentication Demo

Proyecto completo de autenticación basada en JWT con Express, MongoDB y seguridad de cookies HTTP-Only.

## 📋 Requisitos

- Node.js v14+
- MongoDB (local o Atlas)
- npm o yarn

## 🚀 Instalación Rápida

### 1. Dependencias (ya instaladas)

```powershell
npm install
```

### 2. Configurar MongoDB

**Lee:** [SETUP_MONGODB.md](./SETUP_MONGODB.md)

Hay 2 opciones:
- **MongoDB Atlas** (Recomendado para empezar): Rápido, sin instalación local
- **MongoDB Community**: Si prefieres local

### 3. Configurar .env

Edita el archivo `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/jwt-auth-demo
JWT_SECRET=mi_secreto_muy_seguro_con_minimo_32_caracteres_aqui_123456
JWT_EXPIRE=15m
NODE_ENV=development
```

### 4. Iniciar el servidor

```powershell
# Producción
npm start

# Desarrollo (con auto-reinicio)
npm run dev
```

Verás:
```
✅ Conectado a MongoDB exitosamente
✅ Servidor ejecutándose en puerto 3000
🌍 http://localhost:3000
```

---

## 📡 Endpoints API

### Registro

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "message": "Usuario registrado exitosamente.",
  "user": {
    "id": "...",
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

---

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "message": "Login exitoso.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

**Headers de respuesta:**
```
Set-Cookie: access_token=...; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=900000
```

---

### Obtener Perfil (Protegido)

Usando **Bearer Token** en header:
```bash
GET /api/profile/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

O usando **Cookie** (se envía automáticamente desde el navegador):
```bash
GET /api/profile/me
```

**Respuesta:**
```json
{
  "message": "Perfil obtenido exitosamente.",
  "user": {
    "_id": "...",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "createdAt": "2024-05-29T...",
    "updatedAt": "2024-05-29T..."
  }
}
```

---

### Logout

```bash
POST /api/auth/logout
```

**Respuesta:**
```json
{
  "message": "Logout exitoso."
}
```

---

## 🔐 Características de Seguridad

✅ **JWT Tokens**
- Expiración: 15 minutos
- Firmado con JWT_SECRET

✅ **Hash de Contraseñas**
- Algoritmo: bcryptjs
- Costo: 10 (seguro y rápido)
- Se hashea antes de guardar en BD

✅ **Cookies HTTP-Only**
- HttpOnly: No accesible desde JavaScript
- Secure: Solo por HTTPS en producción
- SameSite: strict (protección CSRF)

✅ **Middleware de Autenticación**
- Busca token en Authorization header
- Fallback a cookie si no hay header
- Maneja TokenExpiredError específicamente

---

## 📁 Estructura del Proyecto

```
jwt-auth-demo/
├── server.js                 # Servidor principal
├── .env                      # Variables de entorno
├── package.json              # Dependencias
├── SETUP_MONGODB.md          # Guía MongoDB
├── README.md                 # Este archivo
│
├── config/
│   └── db.js                 # Conexión a MongoDB
│
├── middleware/
│   └── auth.js               # Middleware JWT
│
├── routes/
│   ├── auth.js               # Rutas: /register, /login, /logout
│   └── profile.js            # Ruta protegida: /me
│
└── models/
    └── user.js               # Esquema Mongoose de Usuario
```

---

## 🧪 Pruebas con Postman

1. Descarga [Postman](https://www.postman.com/downloads/)
2. Importa la colección: `postman-collection.json` (en la carpeta del proyecto)
3. O crea manualmente los requests

---

## 🐛 Troubleshooting

### Error: "connect ECONNREFUSED"

**Solución:** MongoDB no está corriendo.
- Opción 1: Instala MongoDB Atlas (recomendado)
- Opción 2: Instala MongoDB Community localmente
- Lee [SETUP_MONGODB.md](./SETUP_MONGODB.md)

### Error: "Email ya está registrado"

**Solución:** Usa otro email para registrar un nuevo usuario

### Token expirado

**Solución:** Haz login de nuevo. El token dura 15 minutos.

### "Access token expired"

El servidor responde correctamente. Necesitas obtener un nuevo token haciendo login de nuevo.

---

## 📚 Tecnologías

- **Express.js** - Framework web
- **Mongoose** - ODM para MongoDB
- **jsonwebtoken** - Generación y verificación de JWT
- **bcryptjs** - Hash seguro de contraseñas
- **cookie-parser** - Parseo de cookies
- **dotenv** - Variables de entorno
- **nodemon** - Auto-reinicio en desarrollo

---

## 📝 Notas

- **JWT_SECRET**: Cambiar en producción a algo muy seguro (mín 32 caracteres)
- **NODE_ENV=development**: Cambiar a "production" cuando despliegues
- **MongoDB_URI**: En producción usar Atlas u otro servicio
- **Cookies Secure**: Solo funciona con HTTPS en `production`

---

## 👨‍💻 Desarrollo

```powershell
# Dev mode con auto-reinicio
npm run dev

# Ver logs
npm start
```

---

**¡Listo para usar! 🎉**
