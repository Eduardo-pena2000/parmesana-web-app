# 🍕 La Parmesana - Backend API

Backend REST API para la Web App de La Parmesana, complementario con el chatbot de WhatsApp.

## 🚀 Características

- ✅ **Autenticación JWT** con refresh tokens
- ✅ **Gestión de Usuarios** con roles y permisos
- ✅ **Menú Digital** con categorías, items, precios dinámicos
- ✅ **Sistema de Pedidos** completo con estados
- ✅ **Sistema de Loyalty** (puntos por compra)
- ✅ **Reservaciones** de mesas
- ✅ **Integración Mercado Pago**
- ✅ **PostgreSQL** con Sequelize ORM
- ✅ **Compartido con Chatbot** (misma base de datos)

## 📋 Requisitos

- Node.js v16+
- PostgreSQL 13+
- Cuenta de Mercado Pago (para pagos)
- Twilio (para WhatsApp - opcional)

## 🛠️ Instalación

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales.

### 3. Crear base de datos

```bash
# En PostgreSQL
createdb parmesana_db
```

### 4. Poblar base de datos

```bash
npm run seed
```

Esto creará:
- 7 categorías
- ~12 items del menú de ejemplo
- 1 usuario admin (admin@laparmesana.com / admin123)

### 5. Iniciar servidor

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📡 API Endpoints

### Autenticación

```
POST   /api/auth/register       # Registrar usuario
POST   /api/auth/login          # Login
POST   /api/auth/refresh        # Refresh token
GET    /api/auth/me             # Usuario actual (requiere auth)
POST   /api/auth/logout         # Logout
```

### Menú

```
GET    /api/menu/categories           # Listar categorías
GET    /api/menu/categories/:slug     # Categoría por slug
GET    /api/menu/items                # Listar items (con filtros)
GET    /api/menu/items/:slug          # Item por slug
GET    /api/menu/popular              # Items populares
GET    /api/menu/featured             # Items destacados
GET    /api/menu/search?q=pizza       # Buscar en menú
```

### Pedidos (requieren autenticación)

```
POST   /api/orders                    # Crear pedido
GET    /api/orders                    # Listar pedidos del usuario
GET    /api/orders/stats              # Estadísticas de pedidos
GET    /api/orders/:id                # Obtener pedido por ID
GET    /api/orders/number/:number     # Obtener pedido por número
PUT    /api/orders/:id/cancel         # Cancelar pedido
PUT    /api/orders/:id/rate           # Calificar pedido
```

## 🗄️ Estructura de Base de Datos

### Tablas principales

- `users` - Usuarios de la plataforma
- `addresses` - Direcciones de entrega
- `categories` - Categorías del menú
- `menu_items` - Items del menú
- `orders` - Pedidos
- `reservations` - Reservaciones de mesas

## 🔐 Autenticación

La API usa JWT (JSON Web Tokens) para autenticación.

### Registro

```bash
POST /api/auth/register
Content-Type: application/json

{
  "phone": "+528281234567",
  "email": "cliente@example.com",
  "password": "mipassword",
  "firstName": "Juan",
  "lastName": "Pérez"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "phone": "+528281234567",
  "password": "mipassword"
}
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Usar el token

```bash
GET /api/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🛒 Crear Pedido

```bash
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    {
      "menuItemId": "uuid-del-item",
      "size": "Grande",
      "extras": ["Extra queso", "Orilla de queso"],
      "quantity": 2,
      "notes": "Sin cebolla por favor"
    }
  ],
  "type": "delivery",
  "addressId": "uuid-de-direccion",
  "paymentMethod": "card",
  "notes": "Timbre rojo"
}
```

## 📦 Despliegue en Railway

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Crear proyecto
railway init

# Agregar PostgreSQL
railway add

# Deploy
railway up

# Configurar variables de entorno en Railway Dashboard
```

## 🔧 Scripts disponibles

```bash
npm start          # Iniciar servidor en producción
npm run dev        # Iniciar con nodemon (desarrollo)
npm run seed       # Poblar base de datos
```

## 🤝 Integración con Chatbot

Este backend comparte la misma base de datos con el chatbot de WhatsApp. Los pedidos pueden crearse desde:

1. **Web App** → Este API REST
2. **WhatsApp** → Chatbot (tu sistema existente)

Ambos sistemas leen y escriben en las mismas tablas.

## 📝 Variables de Entorno

Ver `.env.example` para la lista completa.

Las más importantes:

```env
# Database
DB_HOST=localhost
DB_NAME=parmesana_db
DB_USER=postgres
DB_PASSWORD=tu_password

# JWT
JWT_SECRET=tu_secret_super_seguro

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=tu_token_de_mercadopago

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:5173
```

## 🐛 Troubleshooting

**Error: "Unable to connect to database"**
- Verifica que PostgreSQL esté corriendo
- Confirma credenciales en `.env`

**Error: "JWT invalid"**
- El token expiró, usa el refresh token
- Verifica que JWT_SECRET sea el mismo

## 📞 Soporte

Para dudas o problemas, contacta al equipo de desarrollo.

---

**La Parmesana** - Cadereyta Jiménez, NL 🍕
